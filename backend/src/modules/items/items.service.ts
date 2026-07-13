import { BadRequestException, ConflictException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "crypto";

import { DatabaseService } from "../../database/database.service";
import type {
  BusinessItem,
  BusinessItemsResponse,
  CategorySummary,
  CreateBusinessItemBody,
  DeleteBusinessItemResponse,
  ItemCurrency,
  ItemOptionGroup
} from "./items.dto";

type BusinessRow = {
  id: string;
};

type ItemRow = {
  id: string;
  name: string;
  local_name: string | null;
  item_type: string;
  category_name: string;
  selling_price: string;
  selling_currency: string | null;
  cost_price: string | null;
  cost_currency: string | null;
  wholesale_price: string | null;
  wholesale_currency: string | null;
  reseller_price: string | null;
  reseller_currency: string | null;
  min_wholesale_quantity: string | null;
  price_list_name: string | null;
  brand: string | null;
  size_volume: string | null;
  variant: string | null;
  color: string | null;
  condition_type: string | null;
  image_url: string | null;
  description: string | null;
  sku: string | null;
  barcode: string | null;
  unit: string;
  current_stock: string | null;
  sold_count: string | null;
  best_seller: boolean | null;
  option_groups: unknown | null;
  available_for_sale: boolean;
  status: "active" | "inactive" | "archived";
  created_at: Date;
  updated_at: Date;
};

type CategorySummaryRow = {
  name: string;
  count: string;
};

const defaultPageSize = 8;
const lowStockThreshold = 20;

@Injectable()
export class ItemsService implements OnModuleInit {
  constructor(private readonly database: DatabaseService) {}

  async onModuleInit() {
    await this.ensureCatalogSchema();
  }

  async listBusinessItems(
    businessSlug: string,
    query: { q?: string; category?: string; status?: string; page?: number; pageSize?: number }
  ): Promise<BusinessItemsResponse> {
    const business = await this.getBusinessBySlug(businessSlug);
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(query.pageSize) || defaultPageSize));
    const offset = (page - 1) * pageSize;
    const search = query.q?.trim() ? `%${query.q.trim()}%` : null;
    const category = query.category?.trim() || null;
    const itemStatus = isItemStatus(query.status) ? query.status : null;

    const rows = await this.getPagedItems(business.id, search, category, itemStatus, pageSize, offset);
    const total = await this.countItems(business.id, search, category, itemStatus);
    const allItems = (await this.getAllItems(business.id)).map(toBusinessItem);
    const categoryRows = await this.database.sql<CategorySummaryRow[]>`
      SELECT c.name, count(i.id)::text
      FROM categories c
      LEFT JOIN items i ON i.category_id = c.id
        AND i.deleted_at IS NULL
      WHERE c.business_id = ${business.id}
        AND c.deleted_at IS NULL
      GROUP BY c.id, c.name, c.sort_order
      ORDER BY c.sort_order NULLS LAST, c.name
    `;

    return {
      items: rows.map(toBusinessItem),
      kpis: buildKpis(allItems),
      categories: buildCategorySummary(categoryRows),
      topSellingItems: allItems
        .sort((a, b) => b.soldCount - a.soldCount)
        .slice(0, 5),
      pagination: {
        page,
        pageSize,
        total
      }
    };
  }

  async getBusinessItem(businessSlug: string, itemId: string): Promise<BusinessItem> {
    const business = await this.getBusinessBySlug(businessSlug);
    const [row] = await this.database.sql<ItemRow[]>`
      SELECT ${this.itemSelectFields()}
      FROM items i
      INNER JOIN categories c ON c.id = i.category_id
      WHERE i.business_id = ${business.id}
        AND i.id = ${itemId}
        AND i.deleted_at IS NULL
      LIMIT 1
    `;

    if (!row) {
      throw new NotFoundException("Item not found");
    }

    return toBusinessItem(row);
  }

  async checkBarcode(
    businessSlug: string,
    barcode?: string,
    excludeItemId?: string
  ): Promise<{ exists: boolean; itemId: string | null }> {
    const normalizedBarcode = normalizeBarcode(barcode);

    if (!normalizedBarcode) {
      return { exists: false, itemId: null };
    }

    const business = await this.getBusinessBySlug(businessSlug);
    const existing = await this.findItemByBarcode(business.id, normalizedBarcode, excludeItemId);

    return {
      exists: Boolean(existing),
      itemId: existing?.id ?? null
    };
  }

  async createBusinessItem(businessSlug: string, body: CreateBusinessItemBody): Promise<BusinessItem> {
    validateCreateItemBody(body);
    const business = await this.getBusinessBySlug(businessSlug);
    const barcode = normalizeBarcode(body.barcode);
    const priceCurrency = resolveItemPriceCurrency(body);

    if (barcode) {
      await this.assertBarcodeAvailable(business.id, barcode);
    }

    const category = await this.findOrCreateCategory(business.id, body.categoryName || "ອື່ນໆ");
    const itemId = randomUUID();
    const metadata = {
      currentStock: body.currentStock ?? 0,
      soldCount: 0,
      bestSeller: Boolean(body.bestSeller),
      priceListName: normalizeOptionalText(body.priceListName),
      brand: normalizeOptionalText(body.brand),
      sizeVolume: normalizeOptionalText(body.sizeVolume),
      variant: normalizeOptionalText(body.variant),
      color: normalizeOptionalText(body.color),
      conditionType: normalizeOptionalText(body.conditionType),
      optionGroups: normalizeOptionGroups(body.optionGroups)
    };

    await this.database.sql`
      INSERT INTO items (
        id,
        business_id,
        name,
        local_name,
        item_type,
        category_id,
        selling_price,
        selling_currency,
        cost_price,
        cost_currency,
        wholesale_price,
        wholesale_currency,
        reseller_price,
        reseller_currency,
        min_wholesale_quantity,
        image_url,
        description,
        sku,
        barcode,
        unit,
        available_for_sale,
        status,
        metadata,
        sort_order,
        created_at,
        updated_at
      )
      VALUES (
        ${itemId},
        ${business.id},
        ${body.name || "New Item"},
        ${body.localName || body.name || "ສິນຄ້າໃໝ່"},
        ${body.itemType || "menu_item"},
        ${category.id},
        ${body.sellingPrice ?? 0},
        ${priceCurrency},
        ${body.costPrice ?? null},
        ${priceCurrency},
        ${body.wholesalePrice ?? null},
        ${priceCurrency},
        ${body.resellerPrice ?? null},
        ${priceCurrency},
        ${body.minWholesaleQuantity ?? null},
        ${body.imageUrl ?? null},
        ${body.description ?? null},
        ${body.sku ?? null},
        ${barcode},
        ${body.unit || "ອັນ"},
        ${body.availableForSale ?? true},
        ${body.status || "active"},
        ${this.database.sql.json(metadata)},
        999,
        now(),
        now()
      )
    `;

    return this.getBusinessItem(businessSlug, itemId);
  }

  async updateBusinessItem(
    businessSlug: string,
    itemId: string,
    body: CreateBusinessItemBody
  ): Promise<BusinessItem> {
    validateUpdateItemBody(body);
    const business = await this.getBusinessBySlug(businessSlug);
    const current = await this.getBusinessItem(businessSlug, itemId);
    const barcode = body.barcode === undefined ? current.barcode : normalizeBarcode(body.barcode);
    const priceCurrency = hasCurrencyUpdate(body)
      ? resolveItemPriceCurrency(body)
      : current.sellingCurrency;

    if (barcode) {
      await this.assertBarcodeAvailable(business.id, barcode, itemId);
    }

    const category = body.categoryName
      ? await this.findOrCreateCategory(business.id, body.categoryName)
      : null;
    const metadata = {
      currentStock: body.currentStock ?? current.currentStock,
      soldCount: current.soldCount,
      bestSeller: body.bestSeller ?? current.bestSeller,
      priceListName: body.priceListName === undefined
        ? current.priceListName
        : normalizeOptionalText(body.priceListName),
      brand: body.brand === undefined ? current.brand : normalizeOptionalText(body.brand),
      sizeVolume: body.sizeVolume === undefined
        ? current.sizeVolume
        : normalizeOptionalText(body.sizeVolume),
      variant: body.variant === undefined ? current.variant : normalizeOptionalText(body.variant),
      color: body.color === undefined ? current.color : normalizeOptionalText(body.color),
      conditionType: body.conditionType === undefined
        ? current.conditionType
        : normalizeOptionalText(body.conditionType),
      optionGroups: body.optionGroups === undefined
        ? current.optionGroups
        : normalizeOptionGroups(body.optionGroups)
    };

    await this.database.sql`
      UPDATE items
      SET
        name = ${body.name ?? current.name},
        local_name = ${body.localName ?? current.localName},
        item_type = ${body.itemType ?? current.itemType},
        category_id = COALESCE(${category?.id ?? null}, category_id),
        selling_price = ${body.sellingPrice ?? current.sellingPrice},
        selling_currency = ${priceCurrency},
        cost_price = ${body.costPrice ?? current.costPrice},
        cost_currency = ${priceCurrency},
        wholesale_price = ${body.wholesalePrice ?? current.wholesalePrice},
        wholesale_currency = ${priceCurrency},
        reseller_price = ${body.resellerPrice ?? current.resellerPrice},
        reseller_currency = ${priceCurrency},
        min_wholesale_quantity = ${body.minWholesaleQuantity ?? current.minWholesaleQuantity},
        image_url = ${body.imageUrl ?? current.imageUrl},
        description = ${body.description ?? current.description},
        sku = ${body.sku ?? current.sku},
        barcode = ${barcode},
        unit = ${body.unit ?? current.unit},
        available_for_sale = ${body.availableForSale ?? current.availableForSale},
        status = ${body.status ?? current.status},
        metadata = ${this.database.sql.json(metadata)},
        updated_at = now()
      WHERE business_id = ${business.id}
        AND id = ${itemId}
        AND deleted_at IS NULL
    `;

    return this.getBusinessItem(businessSlug, itemId);
  }

  async deleteBusinessItem(
    businessSlug: string,
    itemId: string
  ): Promise<DeleteBusinessItemResponse> {
    const business = await this.getBusinessBySlug(businessSlug);

    await this.getBusinessItem(businessSlug, itemId);

    await this.database.sql`
      UPDATE items
      SET
        status = 'archived',
        available_for_sale = false,
        deleted_at = now(),
        updated_at = now()
      WHERE business_id = ${business.id}
        AND id = ${itemId}
        AND deleted_at IS NULL
    `;

    return {
      id: itemId,
      deleted: true
    };
  }

  private async getPagedItems(
    businessId: string,
    search: string | null,
    category: string | null,
    itemStatus: string | null,
    pageSize: number,
    offset: number
  ) {
    return await this.database.sql<ItemRow[]>`
      SELECT ${this.itemSelectFields()}
      FROM items i
      INNER JOIN categories c ON c.id = i.category_id
      WHERE i.business_id = ${businessId}
        AND i.deleted_at IS NULL
        AND (
          ${search}::text IS NULL
          OR i.name ILIKE ${search}
          OR i.local_name ILIKE ${search}
          OR i.sku ILIKE ${search}
          OR i.barcode ILIKE ${search}
        )
        AND (${category}::text IS NULL OR c.name = ${category})
        AND (${itemStatus}::text IS NULL OR i.status = ${itemStatus})
      ORDER BY i.sort_order NULLS LAST, i.created_at DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `;
  }

  private async countItems(
    businessId: string,
    search: string | null,
    category: string | null,
    itemStatus: string | null
  ) {
    const [{ count }] = await this.database.sql<{ count: string }[]>`
      SELECT count(*)::text
      FROM items i
      INNER JOIN categories c ON c.id = i.category_id
      WHERE i.business_id = ${businessId}
        AND i.deleted_at IS NULL
        AND (
          ${search}::text IS NULL
          OR i.name ILIKE ${search}
          OR i.local_name ILIKE ${search}
          OR i.sku ILIKE ${search}
          OR i.barcode ILIKE ${search}
        )
        AND (${category}::text IS NULL OR c.name = ${category})
        AND (${itemStatus}::text IS NULL OR i.status = ${itemStatus})
    `;

    return Number(count);
  }

  private async getAllItems(businessId: string) {
    return await this.database.sql<ItemRow[]>`
      SELECT ${this.itemSelectFields()}
      FROM items i
      INNER JOIN categories c ON c.id = i.category_id
      WHERE i.business_id = ${businessId}
        AND i.deleted_at IS NULL
      ORDER BY i.sort_order NULLS LAST, i.created_at DESC
    `;
  }

  private itemSelectFields() {
    return this.database.sql`
      i.id,
      i.name,
      i.local_name,
      i.item_type,
      c.name AS category_name,
      i.selling_price::text,
      i.selling_currency,
      i.cost_price::text,
      i.cost_currency,
      i.wholesale_price::text,
      i.wholesale_currency,
      i.reseller_price::text,
      i.reseller_currency,
      i.min_wholesale_quantity::text,
      i.metadata->>'priceListName' AS price_list_name,
      i.metadata->>'brand' AS brand,
      i.metadata->>'sizeVolume' AS size_volume,
      i.metadata->>'variant' AS variant,
      i.metadata->>'color' AS color,
      COALESCE(i.metadata->>'conditionType', i.metadata->>'sealType') AS condition_type,
      i.metadata->'optionGroups' AS option_groups,
      i.image_url,
      i.description,
      i.sku,
      i.barcode,
      i.unit,
      i.metadata->>'currentStock' AS current_stock,
      i.metadata->>'soldCount' AS sold_count,
      (i.metadata->>'bestSeller')::boolean AS best_seller,
      i.available_for_sale,
      i.status,
      i.created_at,
      i.updated_at
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

  private async findOrCreateCategory(businessId: string, name: string) {
    const [existing] = await this.database.sql<{ id: string }[]>`
      SELECT id
      FROM categories
      WHERE business_id = ${businessId}
        AND lower(name) = lower(${name})
        AND deleted_at IS NULL
      LIMIT 1
    `;

    if (existing) {
      return existing;
    }

    const id = randomUUID();

    await this.database.sql`
      INSERT INTO categories (id, business_id, name, pos_type, status, sort_order, created_at, updated_at)
      VALUES (${id}, ${businessId}, ${name}, 'cafe', 'active', 999, now(), now())
    `;

    return { id };
  }

  private async findItemByBarcode(
    businessId: string,
    barcode: string,
    excludeItemId?: string
  ) {
    const rows = excludeItemId
      ? await this.database.sql<{ id: string }[]>`
          SELECT id
          FROM items
          WHERE business_id = ${businessId}
            AND lower(barcode) = lower(${barcode})
            AND id <> ${excludeItemId}
            AND deleted_at IS NULL
          LIMIT 1
        `
      : await this.database.sql<{ id: string }[]>`
          SELECT id
          FROM items
          WHERE business_id = ${businessId}
            AND lower(barcode) = lower(${barcode})
            AND deleted_at IS NULL
          LIMIT 1
        `;

    return rows[0] ?? null;
  }

  private async assertBarcodeAvailable(
    businessId: string,
    barcode: string,
    excludeItemId?: string
  ) {
    const existing = await this.findItemByBarcode(businessId, barcode, excludeItemId);

    if (existing) {
      throw new ConflictException("Barcode already exists");
    }
  }

  private async ensureCatalogSchema() {
    await this.database.sql`
      CREATE TABLE IF NOT EXISTS categories (
        id uuid PRIMARY KEY,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        branch_id uuid NULL,
        name varchar NOT NULL,
        parent_category_id uuid NULL REFERENCES categories(id),
        pos_type varchar NULL,
        image_url text NULL,
        sort_order int NULL,
        status varchar NOT NULL DEFAULT 'active',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz NULL
      )
    `;

    await this.database.sql`
      CREATE TABLE IF NOT EXISTS items (
        id uuid PRIMARY KEY,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        branch_id uuid NULL,
        name varchar NOT NULL,
        local_name varchar NULL,
        item_type varchar NOT NULL,
        category_id uuid NOT NULL REFERENCES categories(id),
        selling_price numeric(14,2) NOT NULL,
        selling_currency varchar NOT NULL DEFAULT 'LAK',
        cost_price numeric(14,2) NULL,
        cost_currency varchar NOT NULL DEFAULT 'LAK',
        wholesale_price numeric(14,2) NULL,
        wholesale_currency varchar NOT NULL DEFAULT 'LAK',
        reseller_price numeric(14,2) NULL,
        reseller_currency varchar NOT NULL DEFAULT 'LAK',
        min_wholesale_quantity numeric(14,3) NULL,
        image_url text NULL,
        description text NULL,
        sku varchar NULL,
        barcode varchar NULL,
        unit varchar NOT NULL,
        tax_id uuid NULL,
        available_for_sale boolean NOT NULL DEFAULT true,
        sort_order int NULL,
        status varchar NOT NULL DEFAULT 'active',
        metadata jsonb NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz NULL
      )
    `;

    await this.database.sql`
      ALTER TABLE items
      ADD COLUMN IF NOT EXISTS selling_currency varchar NOT NULL DEFAULT 'LAK'
    `;

    await this.database.sql`
      ALTER TABLE items
      ADD COLUMN IF NOT EXISTS cost_currency varchar NOT NULL DEFAULT 'LAK'
    `;

    await this.database.sql`
      ALTER TABLE items
      ADD COLUMN IF NOT EXISTS wholesale_currency varchar NOT NULL DEFAULT 'LAK'
    `;

    await this.database.sql`
      ALTER TABLE items
      ADD COLUMN IF NOT EXISTS reseller_currency varchar NOT NULL DEFAULT 'LAK'
    `;

    await this.database.sql`
      CREATE UNIQUE INDEX IF NOT EXISTS items_business_barcode_unique
      ON items (business_id, lower(barcode))
      WHERE barcode IS NOT NULL
        AND deleted_at IS NULL
    `;
  }
}

function normalizeBarcode(value?: string | null) {
  const barcode = value?.trim();

  return barcode ? barcode : null;
}

function normalizeOptionalText(value?: string | null) {
  const text = value?.trim();

  return text ? text : null;
}

function normalizeCurrency(value?: string | null): ItemCurrency {
  return value === "THB" ? "THB" : "LAK";
}

function validateCreateItemBody(body: CreateBusinessItemBody) {
  if (!body.name?.trim()) {
    throw new BadRequestException("Item name is required");
  }

  if (!body.categoryName?.trim()) {
    throw new BadRequestException("Category name is required");
  }

  validateItemBodyNumbers(body);
  normalizeOptionGroups(body.optionGroups);
}

function validateUpdateItemBody(body: CreateBusinessItemBody) {
  validateItemBodyNumbers(body);
  normalizeOptionGroups(body.optionGroups);
}

function validateItemBodyNumbers(body: CreateBusinessItemBody) {
  assertNonNegativeNumber(body.sellingPrice, "sellingPrice");
  assertNonNegativeNumber(body.costPrice, "costPrice");
  assertNonNegativeNumber(body.wholesalePrice, "wholesalePrice");
  assertNonNegativeNumber(body.resellerPrice, "resellerPrice");
  assertNonNegativeNumber(body.minWholesaleQuantity, "minWholesaleQuantity");
  assertNonNegativeNumber(body.currentStock, "currentStock");
}

function assertNonNegativeNumber(value: number | null | undefined, fieldName: string) {
  if (value === null || value === undefined) {
    return;
  }

  if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
    throw new BadRequestException(`${fieldName} must be a non-negative number`);
  }
}

function normalizeOptionGroups(value: unknown): ItemOptionGroup[] {
  if (value === null || value === undefined) {
    return [];
  }

  const groups = parseOptionGroups(value);

  return groups.map((group) => {
    const groupName = group.name?.trim();

    if (!groupName) {
      throw new BadRequestException("Option group name is required");
    }

    const priceMode = group.priceMode === "override" ? "override" : "addon";
    const choices = Array.isArray(group.choices) ? group.choices : [];

    if (choices.length === 0) {
      throw new BadRequestException("Option group must have at least one choice");
    }

    const normalizedChoices = choices.map((choice) => {
      const choiceName = choice.name?.trim();

      if (!choiceName) {
        throw new BadRequestException("Option choice name is required");
      }

      assertNonNegativeNumber(choice.price, "optionChoice.price");

      return {
        id: choice.id?.trim() || randomUUID(),
        name: choiceName,
        price: choice.price ?? 0,
        default: Boolean(choice.default)
      };
    });

    if (!group.multiple && normalizedChoices.filter((choice) => choice.default).length > 1) {
      throw new BadRequestException("Single-select option group can have only one default choice");
    }

    return {
      id: group.id?.trim() || randomUUID(),
      name: groupName,
      required: Boolean(group.required),
      multiple: Boolean(group.multiple),
      priceMode,
      choices: normalizedChoices
    };
  });
}

function parseOptionGroups(value: unknown): ItemOptionGroup[] {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (!Array.isArray(parsed)) {
        throw new BadRequestException("optionGroups must be an array");
      }

      return parsed;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException("optionGroups must be valid JSON");
    }
  }

  if (!Array.isArray(value)) {
    throw new BadRequestException("optionGroups must be an array");
  }

  return value as ItemOptionGroup[];
}

function isItemStatus(value?: string | null): value is "active" | "inactive" | "archived" {
  return value === "active" || value === "inactive" || value === "archived";
}

function hasCurrencyUpdate(body: CreateBusinessItemBody) {
  return Boolean(
    body.sellingCurrency ||
    body.costCurrency ||
    body.wholesaleCurrency ||
    body.resellerCurrency
  );
}

function resolveItemPriceCurrency(body: CreateBusinessItemBody): ItemCurrency {
  return normalizeCurrency(
    body.sellingCurrency ||
    body.costCurrency ||
    body.wholesaleCurrency ||
    body.resellerCurrency
  );
}

function toBusinessItem(row: ItemRow): BusinessItem {
  return {
    id: row.id,
    name: row.name,
    localName: row.local_name || row.name,
    itemType: row.item_type,
    categoryName: row.category_name,
    sellingPrice: Number(row.selling_price),
    sellingCurrency: normalizeCurrency(row.selling_currency),
    costPrice: row.cost_price === null ? null : Number(row.cost_price),
    costCurrency: normalizeCurrency(row.cost_currency),
    wholesalePrice: row.wholesale_price === null ? null : Number(row.wholesale_price),
    wholesaleCurrency: normalizeCurrency(row.wholesale_currency),
    resellerPrice: row.reseller_price === null ? null : Number(row.reseller_price),
    resellerCurrency: normalizeCurrency(row.reseller_currency),
    minWholesaleQuantity: row.min_wholesale_quantity === null ? null : Number(row.min_wholesale_quantity),
    priceListName: row.price_list_name,
    brand: row.brand,
    sizeVolume: row.size_volume,
    variant: row.variant,
    color: row.color,
    conditionType: row.condition_type,
    optionGroups: normalizeOptionGroups(row.option_groups),
    imageUrl: row.image_url,
    description: row.description,
    sku: row.sku,
    barcode: row.barcode,
    unit: row.unit,
    currentStock: row.current_stock ? Number(row.current_stock) : 0,
    soldCount: row.sold_count ? Number(row.sold_count) : 0,
    bestSeller: row.best_seller ?? false,
    availableForSale: row.available_for_sale,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString()
  };
}

function buildKpis(items: BusinessItem[]) {
  return {
    totalItems: items.length,
    activeItems: items.filter((item) => item.status === "active" && item.availableForSale).length,
    lowStockItems: items.filter((item) => item.currentStock > 0 && item.currentStock < lowStockThreshold).length,
    outOfStockItems: items.filter((item) => item.currentStock === 0).length,
    inventoryValue: items.reduce((sum, item) => sum + item.currentStock * (item.costPrice ?? 0), 0)
  };
}

function buildCategorySummary(rows: CategorySummaryRow[]): CategorySummary[] {
  const total = rows.reduce((sum, row) => sum + Number(row.count), 0);

  return rows.map((row) => ({
    name: row.name,
    count: Number(row.count),
    percentage: total > 0 ? Math.round((Number(row.count) / total) * 100) : 0
  }));
}
