import { HttpException, HttpStatus, Injectable, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { DatabaseService } from "../../database/database.service";
import type {
  BusinessAuthBusiness,
  BusinessAuthUser,
  BusinessLoginResponse
} from "./auth.dto";

type BusinessUserRow = {
  user_id: string;
  user_name: string;
  user_email: string;
  user_username: string | null;
  user_status: string;
  password_hash: string;
  business_id: string;
  business_slug: string;
  business_name: string;
  business_type: string;
  business_status: string;
  role: string;
  permissions: string[] | null;
  membership_status: string;
};

type LoginAttemptRow = {
  failed_count: number;
  locked_until: Date | null;
};

type PosAccountAuthRow = {
  account_id: string;
  username: string;
  password_hash: string;
  account_status: string;
  business_id: string;
  business_slug: string;
  business_name: string;
  business_type: string;
  business_status: string;
};

type AuthTokenPayload = {
  sub: string;
  businessId: string;
  businessSlug: string;
  role: string;
  email: string;
  accountType?: "admin" | "pos";
};

const maxFailedLoginAttempts = 5;
const loginLockMs = 60_000;

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly database: DatabaseService,
    private readonly jwtService: JwtService
  ) {}

  async onModuleInit() {
    await this.ensureAuthSchema();
    await this.seedBusinessAdminAccount();
  }

  async loginBusiness(
    identifier: string,
    password: string,
    rememberMe = false,
    businessSlug?: string
  ): Promise<BusinessLoginResponse> {
    const normalizedIdentifier = identifier.trim().toLowerCase();

    if (!normalizedIdentifier || !password) {
      throw new UnauthorizedException("Invalid email or password");
    }

    await this.assertLoginIsAllowed(normalizedIdentifier);

    const [posAccount] = await this.database.sql<PosAccountAuthRow[]>`
      SELECT
        pa.id AS account_id,
        pa.username,
        pa.password_hash,
        pa.status AS account_status,
        b.id AS business_id,
        b.slug AS business_slug,
        b.name AS business_name,
        b.type AS business_type,
        b.status AS business_status
      FROM pos_accounts pa
      INNER JOIN businesses b ON b.id = pa.business_id
      WHERE lower(pa.username) = ${normalizedIdentifier}
        AND (${businessSlug?.trim() || null}::text IS NULL OR b.slug = ${businessSlug?.trim() || null})
      LIMIT 1
    `;

    if (posAccount) {
      const passwordMatches =
        posAccount.account_status === "active" &&
        posAccount.business_status === "active" &&
        await bcrypt.compare(password, posAccount.password_hash);

      if (!passwordMatches) {
        await this.registerFailedLogin(normalizedIdentifier);
        throw new UnauthorizedException("Invalid email or password");
      }

      await this.resetLoginAttempts(normalizedIdentifier);

      const accessToken = await this.jwtService.signAsync({
        sub: posAccount.account_id,
        businessId: posAccount.business_id,
        businessSlug: posAccount.business_slug,
        role: "cashier",
        email: `${posAccount.username}@pos.local`,
        accountType: "pos"
      } satisfies AuthTokenPayload, {
        expiresIn: rememberMe ? "30d" : "1d"
      });

      return {
        accessToken,
        tokenType: "Bearer",
        user: {
          id: posAccount.account_id,
          name: posAccount.username,
          email: `${posAccount.username}@pos.local`,
          username: posAccount.username,
          status: posAccount.account_status
        },
        business: {
          id: posAccount.business_id,
          slug: posAccount.business_slug,
          name: posAccount.business_name,
          type: posAccount.business_type,
          status: posAccount.business_status
        },
        role: "cashier",
        permissions: ["orders:read", "orders:manage", "payments:manage"],
        accountType: "pos"
      };
    }

    const [row] = await this.database.sql<BusinessUserRow[]>`
      SELECT
        u.id AS user_id,
        COALESCE(NULLIF(sm.name, ''), NULLIF(u.name, ''), u.email) AS user_name,
        u.email AS user_email,
        u.username AS user_username,
        u.status AS user_status,
        u.password_hash,
        b.id AS business_id,
        b.slug AS business_slug,
        b.name AS business_name,
        b.type AS business_type,
        b.status AS business_status,
        bu.role,
        bu.permissions,
        bu.status AS membership_status
      FROM users u
      INNER JOIN business_users bu ON bu.user_id = u.id
      INNER JOIN businesses b ON b.id = bu.business_id
      LEFT JOIN staff_members sm ON sm.user_id = u.id
        AND sm.business_id = b.id
        AND sm.deleted_at IS NULL
      WHERE lower(u.email) = ${normalizedIdentifier}
        OR lower(u.username) = ${normalizedIdentifier}
      LIMIT 1
    `;

    if (!row || row.user_status !== "active" || row.membership_status !== "active") {
      await this.registerFailedLogin(normalizedIdentifier);
      throw new UnauthorizedException("Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(password, row.password_hash);

    if (!passwordMatches) {
      await this.registerFailedLogin(normalizedIdentifier);
      throw new UnauthorizedException("Invalid email or password");
    }

    await this.resetLoginAttempts(normalizedIdentifier);

    const user: BusinessAuthUser = {
      id: row.user_id,
      name: row.user_name,
      email: row.user_email,
      username: row.user_username,
      status: row.user_status
    };

    const business: BusinessAuthBusiness = {
      id: row.business_id,
      slug: row.business_slug,
      name: row.business_name,
      type: row.business_type,
      status: row.business_status
    };

    const payload: AuthTokenPayload = {
      sub: row.user_id,
      businessId: row.business_id,
      businessSlug: row.business_slug,
      role: row.role,
      email: row.user_email,
      accountType: "admin"
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: rememberMe ? "30d" : "1d"
    });

    return {
      accessToken,
      tokenType: "Bearer",
      user,
      business,
      role: row.role,
      permissions: row.permissions ?? [],
      accountType: "admin"
    };
  }

  async getBusinessSession(accessToken: string): Promise<BusinessLoginResponse> {
    const payload = await this.verifyAccessToken(accessToken);

    if (payload.accountType === "pos") {
      const [posAccount] = await this.database.sql<PosAccountAuthRow[]>`
        SELECT
          pa.id AS account_id,
          pa.username,
          pa.password_hash,
          pa.status AS account_status,
          b.id AS business_id,
          b.slug AS business_slug,
          b.name AS business_name,
          b.type AS business_type,
          b.status AS business_status
        FROM pos_accounts pa
        INNER JOIN businesses b ON b.id = pa.business_id
        WHERE pa.id = ${payload.sub}
          AND b.id = ${payload.businessId}
        LIMIT 1
      `;

      if (!posAccount || posAccount.account_status !== "active" || posAccount.business_status !== "active") {
        throw new UnauthorizedException("Session expired");
      }

      return {
        accessToken,
        tokenType: "Bearer",
        user: {
          id: posAccount.account_id,
          name: posAccount.username,
          email: `${posAccount.username}@pos.local`,
          username: posAccount.username,
          status: posAccount.account_status
        },
        business: {
          id: posAccount.business_id,
          slug: posAccount.business_slug,
          name: posAccount.business_name,
          type: posAccount.business_type,
          status: posAccount.business_status
        },
        role: "cashier",
        permissions: ["orders:read", "orders:manage", "payments:manage"],
        accountType: "pos"
      };
    }

    const [row] = await this.database.sql<BusinessUserRow[]>`
      SELECT
        u.id AS user_id,
        COALESCE(NULLIF(sm.name, ''), NULLIF(u.name, ''), u.email) AS user_name,
        u.email AS user_email,
        u.username AS user_username,
        u.status AS user_status,
        u.password_hash,
        b.id AS business_id,
        b.slug AS business_slug,
        b.name AS business_name,
        b.type AS business_type,
        b.status AS business_status,
        bu.role,
        bu.permissions,
        bu.status AS membership_status
      FROM users u
      INNER JOIN business_users bu ON bu.user_id = u.id
      INNER JOIN businesses b ON b.id = bu.business_id
      LEFT JOIN staff_members sm ON sm.user_id = u.id
        AND sm.business_id = b.id
        AND sm.deleted_at IS NULL
      WHERE u.id = ${payload.sub}
        AND b.id = ${payload.businessId}
      LIMIT 1
    `;

    if (!row || row.user_status !== "active" || row.membership_status !== "active") {
      throw new UnauthorizedException("Session expired");
    }

    return {
      accessToken,
      tokenType: "Bearer",
      user: {
        id: row.user_id,
        name: row.user_name,
        email: row.user_email,
        username: row.user_username,
        status: row.user_status
      },
      business: {
        id: row.business_id,
        slug: row.business_slug,
        name: row.business_name,
        type: row.business_type,
        status: row.business_status
      },
      role: row.role,
      permissions: row.permissions ?? [],
      accountType: "admin"
    };
  }

  private async verifyAccessToken(accessToken: string): Promise<AuthTokenPayload> {
    try {
      return await this.jwtService.verifyAsync<AuthTokenPayload>(accessToken);
    } catch {
      throw new UnauthorizedException("Invalid access token");
    }
  }

  private async ensureAuthSchema() {
    await this.database.sql`
      CREATE TABLE IF NOT EXISTS businesses (
        id uuid PRIMARY KEY,
        slug text NOT NULL UNIQUE,
        name text NOT NULL,
        type text NOT NULL,
        status text NOT NULL DEFAULT 'active',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    await this.database.sql`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY,
        name text NOT NULL,
        username text NULL,
        email text NOT NULL UNIQUE,
        password_hash text NOT NULL,
        status text NOT NULL DEFAULT 'active',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    await this.database.sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS username text NULL
    `;

    await this.database.sql`
      CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_idx
      ON users (lower(username))
      WHERE username IS NOT NULL
    `;

    await this.database.sql`
      CREATE TABLE IF NOT EXISTS business_users (
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role text NOT NULL,
        permissions text[] NOT NULL DEFAULT '{}',
        status text NOT NULL DEFAULT 'active',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (business_id, user_id)
      )
    `;

    await this.database.sql`
      CREATE TABLE IF NOT EXISTS auth_login_attempts (
        email text PRIMARY KEY,
        failed_count integer NOT NULL DEFAULT 0,
        locked_until timestamptz,
        last_failed_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
  }

  private async assertLoginIsAllowed(email: string) {
    const [attempt] = await this.database.sql<LoginAttemptRow[]>`
      SELECT failed_count, locked_until
      FROM auth_login_attempts
      WHERE email = ${email}
      LIMIT 1
    `;

    if (!attempt?.locked_until) {
      return;
    }

    const retryAfterSeconds = Math.ceil((attempt.locked_until.getTime() - Date.now()) / 1000);

    if (retryAfterSeconds > 0) {
      this.throwLoginLocked(retryAfterSeconds);
    }
  }

  private async registerFailedLogin(email: string) {
    const [attempt] = await this.database.sql<LoginAttemptRow[]>`
      INSERT INTO auth_login_attempts (email, failed_count, last_failed_at, updated_at)
      VALUES (${email}, 1, now(), now())
      ON CONFLICT (email) DO UPDATE SET
        failed_count = auth_login_attempts.failed_count + 1,
        last_failed_at = now(),
        updated_at = now()
      RETURNING failed_count, locked_until
    `;

    if (attempt.failed_count >= maxFailedLoginAttempts) {
      await this.database.sql`
        UPDATE auth_login_attempts
        SET locked_until = now() + (${loginLockMs} * interval '1 millisecond'),
            updated_at = now()
        WHERE email = ${email}
      `;

      this.throwLoginLocked(Math.ceil(loginLockMs / 1000));
    }
  }

  private throwLoginLocked(retryAfterSeconds: number): never {
    throw new HttpException({
      message: "Too many failed login attempts. Please wait 1 minute.",
      retryAfterSeconds
    }, HttpStatus.TOO_MANY_REQUESTS);
  }

  private async resetLoginAttempts(email: string) {
    await this.database.sql`
      DELETE FROM auth_login_attempts
      WHERE email = ${email}
    `;
  }

  private async seedBusinessAdminAccount() {
    const businessId = "11111111-1111-4111-8111-111111111111";
    const userId = "22222222-2222-4222-8222-222222222222";
    const isProduction = process.env.NODE_ENV === "production";
    const password = process.env.INITIAL_ADMIN_PASSWORD ?? (isProduction ? "" : "VtCoffee@2025!");

    if (!password) {
      throw new Error("INITIAL_ADMIN_PASSWORD is required in production");
    }

    const businessSlug = process.env.INITIAL_BUSINESS_SLUG ?? "tj-cafe-vientiane";
    const businessName = process.env.INITIAL_BUSINESS_NAME ?? "TJ Cafe Vientiane";
    const adminName = process.env.INITIAL_ADMIN_NAME ?? "Somchai Phommaseanh";
    const adminUsername = process.env.INITIAL_ADMIN_USERNAME ?? "owner";
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL ?? "owner@tjcafe.la";
    const passwordHash = await bcrypt.hash(password, 12);

    await this.database.sql`
      INSERT INTO businesses (id, slug, name, type, status)
      VALUES (
        ${businessId},
        ${businessSlug},
        ${businessName},
        'cafe',
        'active'
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        type = EXCLUDED.type,
        status = EXCLUDED.status,
        updated_at = now()
    `;

    await this.database.sql`
      INSERT INTO users (id, name, username, email, password_hash, status)
      VALUES (
        ${userId},
        ${adminName},
        ${adminUsername},
        ${adminEmail},
        ${passwordHash},
        'active'
      )
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        username = EXCLUDED.username,
        password_hash = EXCLUDED.password_hash,
        status = EXCLUDED.status,
        updated_at = now()
    `;

    await this.database.sql`
      INSERT INTO business_users (business_id, user_id, role, permissions, status)
      VALUES (
        ${businessId},
        ${userId},
        'owner',
        ${[
          "business:read",
          "business:update",
          "dashboard:read",
          "items:manage",
          "inventory:manage",
          "orders:manage",
          "payments:manage",
          "reports:read",
          "staff:manage",
          "settings:manage",
          "platform:manage"
        ]},
        'active'
      )
      ON CONFLICT (business_id, user_id) DO UPDATE SET
        role = EXCLUDED.role,
        permissions = EXCLUDED.permissions,
        status = EXCLUDED.status,
        updated_at = now()
    `;

  }
}
