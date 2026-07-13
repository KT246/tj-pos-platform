import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "crypto";

import { DatabaseService } from "../../database/database.service";
import type {
  CafeCombo,
  ComboKpi,
  ComboProduct,
  ComboStatus,
  CombosResponse,
  DeleteComboResponse,
  SaveComboBody
} from "./combos.dto";

type BusinessRow = {
  id: string;
};

type ComboRow = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  status: ComboStatus;
  sort_order: number;
  image_url: string;
  description: string;
  products: ComboProduct[] | string | null;
  created_at: Date;
  updated_at: Date;
};

const defaultPageSize = 50;
const comboStatuses = new Set<ComboStatus>(["active", "paused", "stopped"]);

@Injectable()
export class CombosService implements OnModuleInit {
  constructor(private readonly database: DatabaseService) {}

  async onModuleInit() {
    await this.ensureCombosSchema();
  }

  async listBusinessCombos(
    businessSlug: string,
    query: { q?: string; status?: string; page?: number; pageSize?: number }
  ): Promise<CombosResponse> {
    const business = await this.getBusinessBySlug(businessSlug);
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || defaultPageSize));
    const offset = (page - 1) * pageSize;
    const search = query.q?.trim() ? `%${query.q.trim()}%` : null;
    const status = isComboStatus(query.status) ? query.status : null;
    const rows = await this.database.sql<ComboRow[]>`
      SELECT ${this.comboSelectFields()}
      FROM pos_combos pc
      WHERE pc.business_id = ${business.id}
        AND pc.deleted_at IS NULL
        AND (${search}::text IS NULL OR pc.name ILIKE ${search} OR pc.subtitle ILIKE ${search})
        AND (${status}::text IS NULL OR pc.status = ${status})
      ORDER BY pc.sort_order ASC, pc.created_at DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `;
    const allRows = await this.getAllComboRows(business.id);
    const total = await this.countCombos(business.id, search, status);
    const allCombos = allRows.map(toCafeCombo);

    return {
      combos: rows.map(toCafeCombo),
      kpis: buildComboKpis(allCombos),
      pagination: { page, pageSize, total }
    };
  }

  async getBusinessCombo(businessSlug: string, comboId: string): Promise<CafeCombo> {
    const business = await this.getBusinessBySlug(businessSlug);
    const row = await this.findComboRow(business.id, comboId);

    if (!row) {
      throw new NotFoundException("Combo not found");
    }

    return toCafeCombo(row);
  }

  async createBusinessCombo(businessSlug: string, body: SaveComboBody): Promise<CafeCombo> {
    const business = await this.getBusinessBySlug(businessSlug);
    const normalized = normalizeComboBody(body, true);
    const comboId = randomUUID();

    await this.database.sql`
      INSERT INTO pos_combos (
        id,
        business_id,
        name,
        subtitle,
        price,
        status,
        sort_order,
        image_url,
        description,
        products,
        created_at,
        updated_at
      )
      VALUES (
        ${comboId},
        ${business.id},
        ${normalized.name ?? ""},
        ${normalized.subtitle ?? ""},
        ${normalized.price ?? 0},
        ${normalized.status ?? "active"},
        ${normalized.sortOrder ?? 999},
        ${normalized.image ?? ""},
        ${normalized.description ?? ""},
        ${this.database.sql.json(normalized.products ?? [])},
        now(),
        now()
      )
    `;

    return this.getBusinessCombo(businessSlug, comboId);
  }

  async updateBusinessCombo(
    businessSlug: string,
    comboId: string,
    body: SaveComboBody
  ): Promise<CafeCombo> {
    const business = await this.getBusinessBySlug(businessSlug);
    const current = await this.findComboRow(business.id, comboId);

    if (!current) {
      throw new NotFoundException("Combo not found");
    }

    const normalized = normalizeComboBody(body, false);

    await this.database.sql`
      UPDATE pos_combos
      SET
        name = ${normalized.name ?? current.name},
        subtitle = ${normalized.subtitle ?? current.subtitle},
        price = ${normalized.price ?? Number(current.price)},
        status = ${normalized.status ?? current.status},
        sort_order = ${normalized.sortOrder ?? current.sort_order},
        image_url = ${normalized.image ?? current.image_url},
        description = ${normalized.description ?? current.description},
        products = ${this.database.sql.json(normalized.products ?? normalizeProducts(current.products))},
        updated_at = now()
      WHERE id = ${comboId}
        AND business_id = ${business.id}
        AND deleted_at IS NULL
    `;

    return this.getBusinessCombo(businessSlug, comboId);
  }

  async deleteBusinessCombo(
    businessSlug: string,
    comboId: string
  ): Promise<DeleteComboResponse> {
    const business = await this.getBusinessBySlug(businessSlug);
    const [row] = await this.database.sql<{ id: string }[]>`
      UPDATE pos_combos
      SET deleted_at = now(),
        status = 'stopped',
        updated_at = now()
      WHERE id = ${comboId}
        AND business_id = ${business.id}
        AND deleted_at IS NULL
      RETURNING id
    `;

    if (!row) {
      throw new NotFoundException("Combo not found");
    }

    return { id: row.id, deleted: true };
  }

  private comboSelectFields() {
    return this.database.sql`
      pc.id,
      pc.name,
      pc.subtitle,
      pc.price::text,
      pc.status,
      pc.sort_order,
      pc.image_url,
      pc.description,
      pc.products,
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

  private async findComboRow(businessId: string, comboId: string) {
    const [row] = await this.database.sql<ComboRow[]>`
      SELECT ${this.comboSelectFields()}
      FROM pos_combos pc
      WHERE pc.business_id = ${businessId}
        AND pc.id = ${comboId}
        AND pc.deleted_at IS NULL
      LIMIT 1
    `;

    return row ?? null;
  }

  private async getAllComboRows(businessId: string) {
    return await this.database.sql<ComboRow[]>`
      SELECT ${this.comboSelectFields()}
      FROM pos_combos pc
      WHERE pc.business_id = ${businessId}
        AND pc.deleted_at IS NULL
      ORDER BY pc.sort_order ASC, pc.created_at DESC
    `;
  }

  private async countCombos(
    businessId: string,
    search: string | null,
    status: ComboStatus | null
  ) {
    const [{ count }] = await this.database.sql<{ count: string }[]>`
      SELECT count(*)::text
      FROM pos_combos pc
      WHERE pc.business_id = ${businessId}
        AND pc.deleted_at IS NULL
        AND (${search}::text IS NULL OR pc.name ILIKE ${search} OR pc.subtitle ILIKE ${search})
        AND (${status}::text IS NULL OR pc.status = ${status})
    `;

    return Number(count);
  }

  private async ensureCombosSchema() {
    await this.database.sql`
      CREATE TABLE IF NOT EXISTS pos_combos (
        id uuid PRIMARY KEY,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        name varchar NOT NULL,
        subtitle varchar NOT NULL DEFAULT '',
        price numeric(14, 2) NOT NULL DEFAULT 0,
        status varchar NOT NULL DEFAULT 'active',
        sort_order integer NOT NULL DEFAULT 999,
        image_url text NOT NULL DEFAULT '',
        description text NOT NULL DEFAULT '',
        products jsonb NOT NULL DEFAULT '[]'::jsonb,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz NULL
      )
    `;

    await this.database.sql`
      CREATE INDEX IF NOT EXISTS pos_combos_business_status_idx
      ON pos_combos (business_id, status)
      WHERE deleted_at IS NULL
    `;
  }
}

function normalizeComboBody(body: SaveComboBody, creating: boolean) {
  const name = normalizeText(body.name);

  if (creating && !name) {
    throw new BadRequestException("Combo name is required");
  }

  return {
    name,
    subtitle: normalizeText(body.subtitle) ?? (creating ? "" : undefined),
    price: normalizeNumber(body.price) ?? (creating ? 0 : undefined),
    status: isComboStatus(body.status) ? body.status : creating ? "active" : undefined,
    sortOrder: normalizeInteger(body.sortOrder) ?? (creating ? 999 : undefined),
    image: normalizeText(body.image) ?? (creating ? "" : undefined),
    description: normalizeText(body.description) ?? (creating ? "" : undefined),
    products: body.products ? normalizeProducts(body.products) : creating ? [] : undefined
  };
}

function normalizeText(value?: string | null) {
  const text = value?.trim();

  return text ? text : undefined;
}

function normalizeNumber(value?: number | null) {
  if (value === undefined || value === null) return undefined;
  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : undefined;
}

function normalizeInteger(value?: number | null) {
  const numberValue = normalizeNumber(value);

  return numberValue === undefined ? undefined : Math.round(numberValue);
}

function isComboStatus(value?: string): value is ComboStatus {
  return Boolean(value && comboStatuses.has(value as ComboStatus));
}

function normalizeProducts(value: ComboProduct[] | string | null): ComboProduct[] {
  const products = typeof value === "string" ? safeJsonParse(value) : value;

  if (!Array.isArray(products)) {
    return [];
  }

  return products.map((product) => ({
    name: normalizeText(product.name) ?? "ສິນຄ້າ",
    price: normalizeNumber(product.price) ?? 0,
    quantity: Math.max(1, normalizeInteger(product.quantity) ?? 1),
    image: normalizeText(product.image) ?? ""
  }));
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value) as ComboProduct[];
  } catch {
    return [];
  }
}

function toCafeCombo(row: ComboRow): CafeCombo {
  return {
    id: row.id,
    name: row.name,
    subtitle: row.subtitle,
    price: Number(row.price),
    status: row.status,
    sortOrder: row.sort_order,
    image: row.image_url,
    description: row.description,
    products: normalizeProducts(row.products),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString()
  };
}

function buildComboKpis(combos: CafeCombo[]): ComboKpi[] {
  const active = combos.filter((combo) => combo.status === "active").length;
  const closed = combos.filter((combo) => combo.status !== "active").length;

  return [
    { id: "total", title: "ຄອມໂບທັງໝົດ", value: String(combos.length), subtitle: "ຄອມໂບ", tone: "brown" },
    { id: "active", title: "ເປີດ", value: String(active), subtitle: "ຄອມໂບ", tone: "green" },
    { id: "closed", title: "ປິດ", value: String(closed), subtitle: "ຄອມໂບ", tone: "red" }
  ];
}
