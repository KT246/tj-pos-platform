import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  OnModuleInit,
  UnauthorizedException
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";

import { DatabaseService } from "../../database/database.service";
import { AuthService } from "../auth/auth.service";
import type {
  ProvisionPosClientBody,
  ProvisionPosClientResponse
} from "./platform.dto";

const ownerPermissions = [
  "business:read",
  "business:update",
  "dashboard:read",
  "items:manage",
  "inventory:manage",
  "orders:manage",
  "payments:manage",
  "reports:read",
  "staff:manage",
  "settings:manage"
];

const allowedPlans = new Set(["starter", "business", "premium"]);
const allowedDurations = new Set([1, 6, 12]);

@Injectable()
export class PlatformService implements OnModuleInit {
  constructor(
    private readonly database: DatabaseService,
    private readonly authService: AuthService
  ) {}

  async onModuleInit() {
    await this.ensureSchema();
  }

  async provisionPosClient(
    body: ProvisionPosClientBody,
    authorization?: string
  ): Promise<ProvisionPosClientResponse> {
    await this.requirePlatformAdmin(authorization);

    const input = normalizeProvisionInput(body);
    validateProvisionInput(input);

    const businessId = randomUUID();
    const ownerId = randomUUID();
    const subscriptionId = randomUUID();
    const passwordHash = await bcrypt.hash(input.password, 12);
    const ownerEmail = input.email || `${input.username}.${businessId.slice(0, 8)}@owner.pos.local`;
    const endsOn = addMonths(input.startDate, input.durationMonths);

    try {
      return await this.database.sql.begin(async (sql) => {
        const [existingBusiness] = await sql<{ id: string }[]>`
          SELECT id FROM businesses WHERE lower(slug) = lower(${input.slug}) LIMIT 1
        `;
        if (existingBusiness) {
          throw new ConflictException("Business slug already exists");
        }

        const [existingUser] = await sql<{ id: string }[]>`
          SELECT id
          FROM users
          WHERE lower(username) = lower(${input.username})
             OR lower(email) = lower(${ownerEmail})
          LIMIT 1
        `;
        if (existingUser) {
          throw new ConflictException("Username or email already exists");
        }

        await sql`
          INSERT INTO businesses (id, slug, name, type, status)
          VALUES (${businessId}, ${input.slug}, ${input.businessName}, ${input.posType}, 'active')
        `;

        await sql`
          INSERT INTO users (id, name, username, email, phone, password_hash, status)
          VALUES (
            ${ownerId},
            ${input.ownerName},
            ${input.username},
            ${ownerEmail},
            ${input.phone},
            ${passwordHash},
            'active'
          )
        `;

        await sql`
          INSERT INTO business_users (business_id, user_id, role, permissions, status)
          VALUES (${businessId}, ${ownerId}, 'owner', ${ownerPermissions}, 'active')
        `;

        await sql`
          INSERT INTO platform_pos_subscriptions (
            id, business_id, plan, starts_on, ends_on, status
          )
          VALUES (
            ${subscriptionId}, ${businessId}, ${input.plan},
            ${input.startDate}, ${endsOn}, 'active'
          )
        `;

        return {
          business: {
            id: businessId,
            name: input.businessName,
            slug: input.slug,
            type: input.posType,
            status: "active" as const
          },
          owner: {
            id: ownerId,
            name: input.ownerName,
            username: input.username,
            email: ownerEmail
          },
          subscription: {
            id: subscriptionId,
            plan: input.plan,
            startsOn: input.startDate,
            endsOn,
            status: "active" as const
          }
        };
      });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }

      if (isUniqueViolation(error)) {
        throw new ConflictException("Business slug, username, or email already exists");
      }

      throw error;
    }
  }

  private async requirePlatformAdmin(authorization?: string) {
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const session = await this.authService.getBusinessSession(
      authorization.slice("Bearer ".length).trim()
    );

    if (!session.permissions.includes("platform:manage")) {
      throw new ForbiddenException("Platform admin access required");
    }
  }

  private async ensureSchema() {
    await this.database.sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS phone text NULL
    `;

    await this.database.sql`
      CREATE TABLE IF NOT EXISTS platform_pos_subscriptions (
        id uuid PRIMARY KEY,
        business_id uuid NOT NULL UNIQUE REFERENCES businesses(id) ON DELETE CASCADE,
        plan text NOT NULL,
        starts_on date NOT NULL,
        ends_on date NOT NULL,
        status text NOT NULL DEFAULT 'active',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
  }
}

type NormalizedProvisionInput = {
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  slug: string;
  posType: string;
  username: string;
  password: string;
  plan: string;
  startDate: string;
  durationMonths: number;
};

function normalizeProvisionInput(body: ProvisionPosClientBody): NormalizedProvisionInput {
  return {
    businessName: body.businessName?.trim() ?? "",
    ownerName: body.ownerName?.trim() ?? "",
    phone: body.phone?.trim() ?? "",
    email: body.email?.trim().toLowerCase() ?? "",
    slug: body.slug?.trim().toLowerCase() ?? "",
    posType: body.posType?.trim().toLowerCase() ?? "",
    username: body.username?.trim().toLowerCase() ?? "",
    password: body.password ?? "",
    plan: body.plan?.trim().toLowerCase() ?? "",
    startDate: body.startDate?.trim() ?? "",
    durationMonths: Number(body.durationMonths)
  };
}

function validateProvisionInput(input: NormalizedProvisionInput) {
  if (!input.businessName || !input.ownerName || !input.phone) {
    throw new BadRequestException("Business, owner name, and phone are required");
  }
  if (input.posType !== "cafe") {
    throw new BadRequestException("Only cafe POS is currently supported");
  }
  if (!/^cafe-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) {
    throw new BadRequestException("Slug must start with cafe-");
  }
  if (!/^[a-z0-9._-]{3,}$/.test(input.username)) {
    throw new BadRequestException("Invalid username");
  }
  if (input.password.length < 8) {
    throw new BadRequestException("Password must contain at least 8 characters");
  }
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    throw new BadRequestException("Invalid email");
  }
  if (!allowedPlans.has(input.plan)) {
    throw new BadRequestException("Invalid plan");
  }
  if (!allowedDurations.has(input.durationMonths)) {
    throw new BadRequestException("Invalid subscription duration");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.startDate) || Number.isNaN(Date.parse(`${input.startDate}T00:00:00Z`))) {
    throw new BadRequestException("Invalid start date");
  }
}

function addMonths(startDate: string, months: number) {
  const date = new Date(`${startDate}T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + months);
  return date.toISOString().slice(0, 10);
}

function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}
