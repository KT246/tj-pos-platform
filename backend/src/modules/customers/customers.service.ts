import { BadRequestException, ConflictException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "crypto";

import { DatabaseService } from "../../database/database.service";
import type {
  CafeCustomer,
  CustomerKpi,
  CustomerListResponse,
  CustomerStatus,
  DeleteCustomerResponse,
  SaveCustomerBody
} from "./customers.dto";

type BusinessRow = {
  id: string;
};

type CustomerRow = {
  id: string;
  code: string;
  name: string;
  phone: string;
  points: string;
  status: CustomerStatus;
  total_spent: string;
  orders_count: string;
  last_order_at: string;
  created_at: Date;
  updated_at: Date;
};

type CustomerSettingsRow = {
  customer_settings: unknown;
};

const defaultCustomerCodePrefix = "CM";

const customerStatusSet = new Set<CustomerStatus>(["active", "locked"]);

@Injectable()
export class CustomersService implements OnModuleInit {
  constructor(private readonly database: DatabaseService) {}

  async onModuleInit() {
    await this.ensureCustomersSchema();
  }

  async listBusinessCustomers(
    businessSlug: string,
    query: { q?: string; status?: string }
  ): Promise<CustomerListResponse> {
    const business = await this.getBusinessBySlug(businessSlug);
    const search = query.q?.trim() ? `%${query.q.trim()}%` : null;
    const status = isCustomerStatus(query.status) ? query.status : null;
    const rows = await this.database.sql<CustomerRow[]>`
      SELECT ${this.customerSelectFields()}
      FROM pos_customers pc
      WHERE pc.business_id = ${business.id}
        AND pc.deleted_at IS NULL
        AND (${search}::text IS NULL OR pc.name ILIKE ${search} OR pc.phone ILIKE ${search} OR pc.code ILIKE ${search})
        AND (${status}::text IS NULL OR pc.status = ${status})
      ORDER BY pc.created_at DESC
    `;
    const allRows = await this.database.sql<CustomerRow[]>`
      SELECT ${this.customerSelectFields()}
      FROM pos_customers pc
      WHERE pc.business_id = ${business.id}
        AND pc.deleted_at IS NULL
    `;
    const allCustomers = allRows.map(toCafeCustomer);

    return {
      customers: rows.map(toCafeCustomer),
      kpis: buildCustomerKpis(allCustomers)
    };
  }

  async getBusinessCustomer(businessSlug: string, customerId: string): Promise<CafeCustomer> {
    const business = await this.getBusinessBySlug(businessSlug);
    const row = await this.findCustomerRow(business.id, customerId);

    if (!row) {
      throw new NotFoundException("Customer not found");
    }

    return toCafeCustomer(row);
  }

  async createBusinessCustomer(businessSlug: string, body: SaveCustomerBody): Promise<CafeCustomer> {
    const business = await this.getBusinessBySlug(businessSlug);
    const normalized = normalizeCustomerBody(body, true);
    const phone = normalized.phone ?? "";

    await this.assertPhoneAvailable(business.id, phone);

    const customerId = randomUUID();
    const code = await this.generateCustomerCode(business.id);

    await this.database.sql`
      INSERT INTO pos_customers (
        id,
        business_id,
        code,
        name,
        phone,
        points,
        status,
        total_spent,
        orders_count,
        last_order_at,
        created_at,
        updated_at
      )
      VALUES (
        ${customerId},
        ${business.id},
        ${code},
        ${normalized.name ?? ""},
        ${phone},
        0,
        ${normalized.status ?? "active"},
        0,
        0,
        '',
        now(),
        now()
      )
    `;

    return this.getBusinessCustomer(businessSlug, customerId);
  }

  async updateBusinessCustomer(
    businessSlug: string,
    customerId: string,
    body: SaveCustomerBody
  ): Promise<CafeCustomer> {
    const business = await this.getBusinessBySlug(businessSlug);
    const current = await this.findCustomerRow(business.id, customerId);

    if (!current) {
      throw new NotFoundException("Customer not found");
    }

    const normalized = normalizeCustomerBody(body, false);
    const nextPhone = normalized.phone ?? current.phone;

    await this.assertPhoneAvailable(business.id, nextPhone, customerId);

    await this.database.sql`
      UPDATE pos_customers
      SET
        name = ${normalized.name ?? current.name},
        phone = ${nextPhone},
        status = ${normalized.status ?? current.status},
        updated_at = now()
      WHERE id = ${customerId}
        AND business_id = ${business.id}
        AND deleted_at IS NULL
    `;

    return this.getBusinessCustomer(businessSlug, customerId);
  }

  async deleteBusinessCustomer(
    businessSlug: string,
    customerId: string
  ): Promise<DeleteCustomerResponse> {
    const business = await this.getBusinessBySlug(businessSlug);
    const [row] = await this.database.sql<{ id: string }[]>`
      UPDATE pos_customers
      SET deleted_at = now(),
        status = 'locked',
        updated_at = now()
      WHERE id = ${customerId}
        AND business_id = ${business.id}
        AND deleted_at IS NULL
      RETURNING id
    `;

    if (!row) {
      throw new NotFoundException("Customer not found");
    }

    return {
      id: row.id,
      deleted: true
    };
  }

  private customerSelectFields() {
    return this.database.sql`
      pc.id,
      pc.code,
      pc.name,
      pc.phone,
      pc.points::text,
      pc.status,
      pc.total_spent::text,
      pc.orders_count::text,
      pc.last_order_at,
      pc.created_at,
      pc.updated_at
    `;
  }

  private async getBusinessBySlug(slug: string) {
    const [business] = await this.database.sql<BusinessRow[]>`
      SELECT id
      FROM businesses
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (!business) {
      throw new NotFoundException("Business not found");
    }

    return business;
  }

  private async findCustomerRow(businessId: string, customerId: string) {
    const [row] = await this.database.sql<CustomerRow[]>`
      SELECT ${this.customerSelectFields()}
      FROM pos_customers pc
      WHERE pc.business_id = ${businessId}
        AND pc.id = ${customerId}
        AND pc.deleted_at IS NULL
      LIMIT 1
    `;

    return row ?? null;
  }

  private async assertPhoneAvailable(
    businessId: string,
    phone: string,
    excludeCustomerId?: string
  ) {
    if (!phone) {
      return;
    }

    const [existing] = await this.database.sql<{ id: string }[]>`
      SELECT id
      FROM pos_customers
      WHERE business_id = ${businessId}
        AND phone = ${phone}
        AND deleted_at IS NULL
        AND (${excludeCustomerId ?? null}::uuid IS NULL OR id <> ${excludeCustomerId ?? null})
      LIMIT 1
    `;

    if (existing) {
      throw new ConflictException("Customer phone already exists");
    }
  }

  private async generateCustomerCode(businessId: string) {
    const prefix = await this.getCustomerCodePrefix(businessId);
    const [row] = await this.database.sql<{ count: string }[]>`
      SELECT count(*)::text
      FROM pos_customers
      WHERE business_id = ${businessId}
    `;
    const nextNumber = Number(row?.count ?? 0) + 1;

    return `${prefix}${String(nextNumber).padStart(4, "0")}`;
  }

  private async getCustomerCodePrefix(businessId: string) {
    const [settings] = await this.database.sql<CustomerSettingsRow[]>`
      SELECT customer_settings
      FROM pos_business_settings
      WHERE business_id = ${businessId}
      LIMIT 1
    `;
    const customerSettings = parseJsonValue(settings?.customer_settings);

    return isRecord(customerSettings)
      ? normalizeCustomerCodePrefix(customerSettings.codePrefix, defaultCustomerCodePrefix)
      : defaultCustomerCodePrefix;
  }

  private async ensureCustomersSchema() {
    await this.database.sql`
      CREATE TABLE IF NOT EXISTS pos_customers (
        id uuid PRIMARY KEY,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        code varchar NOT NULL,
        name varchar NOT NULL,
        phone varchar NOT NULL DEFAULT '',
        email varchar NOT NULL DEFAULT '',
        customer_group varchar NOT NULL DEFAULT 'regular',
        points int NOT NULL DEFAULT 0,
        status varchar NOT NULL DEFAULT 'active',
        birthday varchar NOT NULL DEFAULT '',
        favorite_drink varchar NOT NULL DEFAULT '',
        note text NULL,
        total_spent numeric(14,2) NOT NULL DEFAULT 0,
        orders_count int NOT NULL DEFAULT 0,
        last_order_at varchar NOT NULL DEFAULT '',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz NULL
      )
    `;

    await this.database.sql`
      ALTER TABLE pos_customers
      ADD COLUMN IF NOT EXISTS points int NOT NULL DEFAULT 0
    `;

    await this.database.sql`
      CREATE UNIQUE INDEX IF NOT EXISTS pos_customers_business_code_idx
      ON pos_customers (business_id, code)
      WHERE deleted_at IS NULL
    `;

    await this.database.sql`
      CREATE UNIQUE INDEX IF NOT EXISTS pos_customers_business_phone_idx
      ON pos_customers (business_id, phone)
      WHERE deleted_at IS NULL AND phone <> ''
    `;

    await this.database.sql`
      CREATE UNIQUE INDEX IF NOT EXISTS pos_customers_business_email_idx
      ON pos_customers (business_id, lower(email))
      WHERE deleted_at IS NULL AND email <> ''
    `;
  }
}

function normalizeCustomerBody(body: SaveCustomerBody, creating: boolean) {
  const name = normalizeText(body.name);
  const status = isCustomerStatus(body.status) ? body.status : undefined;

  if (creating && !name) {
    throw new BadRequestException("Customer name is required");
  }

  return {
    name,
    phone: normalizeText(body.phone) ?? (creating ? "" : undefined),
    status: status ?? (creating ? "active" : undefined)
  };
}

function normalizeText(value?: string | null) {
  const text = value?.trim();

  return text ? text : undefined;
}

function parseJsonValue(value: unknown) {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeCustomerCodePrefix(value: unknown, current: string) {
  if (typeof value !== "string") return current;
  const prefix = value.trim().toUpperCase();

  return /^[A-Z0-9]{1,6}$/.test(prefix) ? prefix : current;
}

function isCustomerStatus(value?: string): value is CustomerStatus {
  return Boolean(value && customerStatusSet.has(value as CustomerStatus));
}

function toCafeCustomer(row: CustomerRow): CafeCustomer {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    phone: row.phone,
    points: Number(row.points),
    status: row.status,
    totalSpent: Number(row.total_spent),
    ordersCount: Number(row.orders_count),
    lastOrderAt: row.last_order_at,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString()
  };
}

function buildCustomerKpis(customers: CafeCustomer[]): CustomerKpi[] {
  const totalPoints = customers.reduce((sum, customer) => sum + customer.points, 0);
  const totalSpent = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);

  return [
    {
      id: "total",
      title: "ລູກຄ້າທັງໝົດ",
      value: String(customers.length),
      subtitle: "ໂປຣໄຟລ໌ລູກຄ້າ",
      tone: "brown"
    },
    {
      id: "points",
      title: "ຄະແນນສະສົມ",
      value: totalPoints.toLocaleString("vi-VN"),
      subtitle: "ຄະແນນປັດຈຸບັນລວມ",
      tone: "purple"
    },
    {
      id: "spent",
      title: "ຍອດໃຊ້ລວມ",
      value: totalSpent.toLocaleString("vi-VN"),
      subtitle: "ບັນທຶກແລ້ວ",
      tone: "amber"
    }
  ];
}
