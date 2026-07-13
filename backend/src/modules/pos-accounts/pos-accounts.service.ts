import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";

import { DatabaseService } from "../../database/database.service";
import { AuthService } from "../auth/auth.service";
import type {
  PosAccount,
  PosAccountListResponse,
  PosAccountStatus,
  SavePosAccountBody
} from "./pos-accounts.dto";

type BusinessRow = { id: string };

type PosAccountRow = {
  id: string;
  username: string;
  status: PosAccountStatus;
  created_at: Date;
  updated_at: Date;
};

@Injectable()
export class PosAccountsService implements OnModuleInit {
  constructor(
    private readonly database: DatabaseService,
    private readonly authService: AuthService
  ) {}

  async onModuleInit() {
    await this.ensureSchema();
  }

  async listAccounts(
    businessSlug: string,
    authorization?: string
  ): Promise<PosAccountListResponse> {
    const business = await this.requireAdmin(businessSlug, authorization);
    const rows = await this.database.sql<PosAccountRow[]>`
      SELECT id, username, status, created_at, updated_at
      FROM pos_accounts
      WHERE business_id = ${business.id}
      ORDER BY lower(username) ASC
    `;

    return { accounts: rows.map(toPosAccount) };
  }

  async createAccount(
    businessSlug: string,
    body: SavePosAccountBody,
    authorization?: string
  ): Promise<PosAccount> {
    const business = await this.requireAdmin(businessSlug, authorization);
    const username = normalizeUsername(body.username);
    const password = body.password?.trim() ?? "";

    validateCredentials(username, password, true);
    await this.assertUsernameAvailable(business.id, username);

    const [row] = await this.database.sql<PosAccountRow[]>`
      INSERT INTO pos_accounts (id, business_id, username, password_hash, status)
      VALUES (${randomUUID()}, ${business.id}, ${username}, ${await bcrypt.hash(password, 12)}, 'active')
      RETURNING id, username, status, created_at, updated_at
    `;

    return toPosAccount(row);
  }

  async updateAccount(
    businessSlug: string,
    accountId: string,
    body: SavePosAccountBody,
    authorization?: string
  ): Promise<PosAccount> {
    const business = await this.requireAdmin(businessSlug, authorization);
    const current = await this.findAccount(business.id, accountId);

    if (!current) {
      throw new NotFoundException("POS account not found");
    }

    const username = body.username === undefined
      ? current.username
      : normalizeUsername(body.username);
    const password = body.password?.trim() ?? "";
    const status = normalizeStatus(body.status) ?? current.status;

    validateCredentials(username, password, false);

    if (username !== current.username) {
      await this.assertUsernameAvailable(business.id, username, accountId);
    }

    const passwordHash = password ? await bcrypt.hash(password, 12) : null;
    const [row] = await this.database.sql<PosAccountRow[]>`
      UPDATE pos_accounts
      SET username = ${username},
          password_hash = COALESCE(${passwordHash}, password_hash),
          status = ${status},
          updated_at = now()
      WHERE id = ${accountId}
        AND business_id = ${business.id}
      RETURNING id, username, status, created_at, updated_at
    `;

    return toPosAccount(row);
  }

  async deactivateAccount(
    businessSlug: string,
    accountId: string,
    authorization?: string
  ) {
    const business = await this.requireAdmin(businessSlug, authorization);
    const [row] = await this.database.sql<{ id: string }[]>`
      UPDATE pos_accounts
      SET status = 'inactive', updated_at = now()
      WHERE id = ${accountId}
        AND business_id = ${business.id}
      RETURNING id
    `;

    if (!row) {
      throw new NotFoundException("POS account not found");
    }

    return { id: row.id, deleted: true };
  }

  private async requireAdmin(businessSlug: string, authorization?: string): Promise<BusinessRow> {
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const session = await this.authService.getBusinessSession(
      authorization.slice("Bearer ".length).trim()
    );

    if (
      session.business.slug !== businessSlug ||
      !session.permissions.includes("settings:manage")
    ) {
      throw new ForbiddenException("Admin access required");
    }

    const [business] = await this.database.sql<BusinessRow[]>`
      SELECT id FROM businesses WHERE slug = ${businessSlug} LIMIT 1
    `;

    if (!business) {
      throw new NotFoundException("Business not found");
    }

    return business;
  }

  private async findAccount(businessId: string, accountId: string) {
    const [row] = await this.database.sql<PosAccountRow[]>`
      SELECT id, username, status, created_at, updated_at
      FROM pos_accounts
      WHERE id = ${accountId} AND business_id = ${businessId}
      LIMIT 1
    `;

    return row;
  }

  private async assertUsernameAvailable(businessId: string, username: string, excludeId?: string) {
    const [row] = await this.database.sql<{ id: string }[]>`
      SELECT id
      FROM pos_accounts
      WHERE business_id = ${businessId}
        AND lower(username) = lower(${username})
        AND (${excludeId ?? null}::uuid IS NULL OR id <> ${excludeId ?? null})
      LIMIT 1
    `;

    if (row) {
      throw new ConflictException("Username already exists");
    }
  }

  private async ensureSchema() {
    await this.database.sql`
      CREATE TABLE IF NOT EXISTS pos_accounts (
        id uuid PRIMARY KEY,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        username varchar NOT NULL,
        password_hash varchar NOT NULL,
        status varchar NOT NULL DEFAULT 'active',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    await this.database.sql`
      CREATE UNIQUE INDEX IF NOT EXISTS pos_accounts_business_username_lower_idx
      ON pos_accounts (business_id, lower(username))
    `;
  }
}

function normalizeUsername(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

function normalizeStatus(value?: string): PosAccountStatus | undefined {
  return value === "inactive" ? "inactive" : value === "active" ? "active" : undefined;
}

function validateCredentials(username: string, password: string, creating: boolean) {
  if (!username || username.length < 3) {
    throw new BadRequestException("Username must contain at least 3 characters");
  }

  if (creating && password.length < 6) {
    throw new BadRequestException("Password must contain at least 6 characters");
  }

  if (!creating && password && password.length < 6) {
    throw new BadRequestException("Password must contain at least 6 characters");
  }
}

function toPosAccount(row: PosAccountRow): PosAccount {
  return {
    id: row.id,
    username: row.username,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString()
  };
}
