import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "crypto";

import { DatabaseService } from "../../database/database.service";
import type {
  CafeStockItem,
  DeleteStockItemResponse,
  SaveStockItemBody,
  StockCategory,
  StockItemsResponse,
  StockKpi,
  StockMovementBody,
  StockMovementPoint,
  StockMovementType,
  StockStatus
} from "./inventory.dto";

type BusinessRow = {
  id: string;
};

type StockRow = {
  id: string;
  name: string;
  category: StockCategory;
  sku: string;
  unit: string;
  current_stock: string;
  min_stock: string;
  ordering_stock: string;
  cost_price: string;
  supplier: string;
  last_import_at: string | null;
  expiry_date: string | null;
  image_url: string;
  created_at: Date;
  updated_at: Date;
};

type MovementRow = {
  date_label: string;
  import_qty: string;
  export_qty: string;
};

const defaultPageSize = 50;
const stockCategories = new Set<StockCategory>(["ingredient", "supply", "product"]);
const stockStatuses = new Set<StockStatus>(["in-stock", "low-stock", "out-of-stock", "ordering"]);
const movementTypes = new Set<StockMovementType>(["import", "export", "adjust"]);
const categoryLabelByCategory: Record<StockCategory, string> = {
  ingredient: "Nguyên liệu",
  supply: "Vật tư",
  product: "Sản phẩm"
};

const seedStockItems: Required<SaveStockItemBody>[] = [
  {
    name: "Hạt cà phê Robusta",
    category: "ingredient",
    sku: "ING-0001",
    unit: "kg",
    currentStock: 28.5,
    minStock: 10,
    orderingStock: 5,
    costPrice: 120000,
    supplier: "Công ty TNHH Cà phê Việt",
    expiryDate: "2026-11-18",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=160&q=80"
  },
  {
    name: "Sữa tươi Vinamilk",
    category: "ingredient",
    sku: "ING-0002",
    unit: "hộp",
    currentStock: 15,
    minStock: 10,
    orderingStock: 0,
    costPrice: 32000,
    supplier: "Vinamilk Distribution",
    expiryDate: "2026-07-28",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=160&q=80"
  },
  {
    name: "Siro Caramel",
    category: "ingredient",
    sku: "ING-0003",
    unit: "chai",
    currentStock: 5,
    minStock: 8,
    orderingStock: 3,
    costPrice: 85000,
    supplier: "Coffee Ingredient Laos",
    expiryDate: "2026-11-12",
    image: "https://images.unsplash.com/photo-1608877907149-a206d75ba011?auto=format&fit=crop&w=160&q=80"
  },
  {
    name: "Ly giấy 12oz",
    category: "supply",
    sku: "SUP-0001",
    unit: "cái",
    currentStock: 120,
    minStock: 50,
    orderingStock: 0,
    costPrice: 1200,
    supplier: "Bao bì Vientiane",
    expiryDate: "",
    image: "https://images.unsplash.com/photo-1522992319-0365e5f11656?auto=format&fit=crop&w=160&q=80"
  },
  {
    name: "Nắp ly 12oz",
    category: "supply",
    sku: "SUP-0002",
    unit: "cái",
    currentStock: 45,
    minStock: 50,
    orderingStock: 0,
    costPrice: 800,
    supplier: "Bao bì Vientiane",
    expiryDate: "",
    image: "https://images.unsplash.com/photo-1599458252573-56ae36120de1?auto=format&fit=crop&w=160&q=80"
  },
  {
    name: "Ống hút giấy",
    category: "supply",
    sku: "SUP-0003",
    unit: "cái",
    currentStock: 0,
    minStock: 100,
    orderingStock: 0,
    costPrice: 300,
    supplier: "Bao bì Vientiane",
    expiryDate: "",
    image: "https://images.unsplash.com/photo-1607668478747-14c53552d978?auto=format&fit=crop&w=160&q=80"
  },
  {
    name: "Đường cát trắng",
    category: "ingredient",
    sku: "ING-0004",
    unit: "kg",
    currentStock: 25,
    minStock: 15,
    orderingStock: 0,
    costPrice: 18000,
    supplier: "Chợ đầu mối Vientiane",
    expiryDate: "2026-12-16",
    image: "https://images.unsplash.com/photo-1605286978633-2dec93ff88a2?auto=format&fit=crop&w=160&q=80"
  },
  {
    name: "Trà đen",
    category: "ingredient",
    sku: "ING-0005",
    unit: "gói",
    currentStock: 12,
    minStock: 10,
    orderingStock: 0,
    costPrice: 45000,
    supplier: "Tea House Supply",
    expiryDate: "2026-11-15",
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=160&q=80"
  }
];

@Injectable()
export class InventoryService implements OnModuleInit {
  constructor(private readonly database: DatabaseService) {}

  async onModuleInit() {
    await this.ensureInventorySchema();
  }

  async listBusinessStockItems(
    businessSlug: string,
    query: { q?: string; category?: string; status?: string; page?: number; pageSize?: number }
  ): Promise<StockItemsResponse> {
    const business = await this.getBusinessBySlug(businessSlug);
    await this.seedDefaultStockItems(business.id);

    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || defaultPageSize));
    const offset = (page - 1) * pageSize;
    const search = query.q?.trim() ? `%${query.q.trim()}%` : null;
    const category = isStockCategory(query.category) ? query.category : null;
    const status = isStockStatus(query.status) ? query.status : null;
    const allRows = await this.getAllStockRows(business.id);
    const allItems = allRows.map(toCafeStockItem);
    const filteredRows = allRows.filter((row) => {
      const item = toCafeStockItem(row);
      const searchMatched =
        !search ||
        item.name.toLowerCase().includes(query.q?.trim().toLowerCase() ?? "") ||
        item.sku.toLowerCase().includes(query.q?.trim().toLowerCase() ?? "") ||
        item.supplier.toLowerCase().includes(query.q?.trim().toLowerCase() ?? "");
      const categoryMatched = !category || item.category === category;
      const statusMatched = !status || item.status === status;

      return searchMatched && categoryMatched && statusMatched;
    });
    const rows = filteredRows.slice(offset, offset + pageSize);

    return {
      items: rows.map(toCafeStockItem),
      kpis: buildStockKpis(allItems, await this.countTodayImports(business.id)),
      movement7d: await this.getMovement7d(business.id),
      pagination: {
        page,
        pageSize,
        total: filteredRows.length
      }
    };
  }

  async getBusinessStockItem(businessSlug: string, itemId: string): Promise<CafeStockItem> {
    const business = await this.getBusinessBySlug(businessSlug);
    const row = await this.findStockRow(business.id, itemId);

    if (!row) {
      throw new NotFoundException("Stock item not found");
    }

    return toCafeStockItem(row);
  }

  async createBusinessStockItem(
    businessSlug: string,
    body: SaveStockItemBody
  ): Promise<CafeStockItem> {
    const business = await this.getBusinessBySlug(businessSlug);
    const normalized = normalizeStockBody(body, true);
    const itemId = randomUUID();

    await this.database.sql`
      INSERT INTO pos_stock_items (
        id,
        business_id,
        name,
        category,
        sku,
        unit,
        current_stock,
        min_stock,
        ordering_stock,
        cost_price,
        supplier,
        last_import_at,
        expiry_date,
        image_url,
        created_at,
        updated_at
      )
      VALUES (
        ${itemId},
        ${business.id},
        ${normalized.name ?? ""},
        ${normalized.category ?? "ingredient"},
        ${normalized.sku ?? ""},
        ${normalized.unit ?? "cái"},
        ${normalized.currentStock ?? 0},
        ${normalized.minStock ?? 0},
        ${normalized.orderingStock ?? 0},
        ${normalized.costPrice ?? 0},
        ${normalized.supplier ?? ""},
        ${normalized.currentStock && normalized.currentStock > 0 ? new Date().toISOString().slice(0, 10) : null},
        ${normalizeDate(normalized.expiryDate)},
        ${normalized.image ?? ""},
        now(),
        now()
      )
    `;

    if ((normalized.currentStock ?? 0) > 0) {
      await this.createMovementRecord(business.id, itemId, "import", normalized.currentStock ?? 0, "Tồn đầu kỳ");
    }

    return this.getBusinessStockItem(businessSlug, itemId);
  }

  async updateBusinessStockItem(
    businessSlug: string,
    itemId: string,
    body: SaveStockItemBody
  ): Promise<CafeStockItem> {
    const business = await this.getBusinessBySlug(businessSlug);
    const current = await this.findStockRow(business.id, itemId);

    if (!current) {
      throw new NotFoundException("Stock item not found");
    }

    const normalized = normalizeStockBody(body, false);

    await this.database.sql`
      UPDATE pos_stock_items
      SET
        name = ${normalized.name ?? current.name},
        category = ${normalized.category ?? current.category},
        sku = ${normalized.sku ?? current.sku},
        unit = ${normalized.unit ?? current.unit},
        current_stock = ${normalized.currentStock ?? Number(current.current_stock)},
        min_stock = ${normalized.minStock ?? Number(current.min_stock)},
        ordering_stock = ${normalized.orderingStock ?? Number(current.ordering_stock)},
        cost_price = ${normalized.costPrice ?? Number(current.cost_price)},
        supplier = ${normalized.supplier ?? current.supplier},
        expiry_date = ${normalized.expiryDate === undefined ? current.expiry_date : normalizeDate(normalized.expiryDate)},
        image_url = ${normalized.image ?? current.image_url},
        updated_at = now()
      WHERE id = ${itemId}
        AND business_id = ${business.id}
        AND deleted_at IS NULL
    `;

    return this.getBusinessStockItem(businessSlug, itemId);
  }

  async createBusinessStockMovement(
    businessSlug: string,
    itemId: string,
    body: StockMovementBody
  ): Promise<CafeStockItem> {
    const business = await this.getBusinessBySlug(businessSlug);
    const current = await this.findStockRow(business.id, itemId);

    if (!current) {
      throw new NotFoundException("Stock item not found");
    }

    if (!movementTypes.has(body.type)) {
      throw new BadRequestException("Invalid stock movement type");
    }

    const quantity = normalizeRequiredPositiveNumber(body.quantity, "quantity");
    const currentStock = Number(current.current_stock);
    const nextStock =
      body.type === "import"
        ? currentStock + quantity
        : body.type === "export"
          ? currentStock - quantity
          : quantity;

    if (nextStock < 0) {
      throw new BadRequestException("Stock cannot be negative");
    }

    await this.database.sql`
      UPDATE pos_stock_items
      SET current_stock = ${nextStock},
        last_import_at = CASE WHEN ${body.type} = 'import' THEN CURRENT_DATE ELSE last_import_at END,
        updated_at = now()
      WHERE id = ${itemId}
        AND business_id = ${business.id}
        AND deleted_at IS NULL
    `;

    await this.createMovementRecord(business.id, itemId, body.type, quantity, body.note ?? "");

    return this.getBusinessStockItem(businessSlug, itemId);
  }

  async deleteBusinessStockItem(
    businessSlug: string,
    itemId: string
  ): Promise<DeleteStockItemResponse> {
    const business = await this.getBusinessBySlug(businessSlug);
    const [row] = await this.database.sql<{ id: string }[]>`
      UPDATE pos_stock_items
      SET deleted_at = now(),
        updated_at = now()
      WHERE id = ${itemId}
        AND business_id = ${business.id}
        AND deleted_at IS NULL
      RETURNING id
    `;

    if (!row) {
      throw new NotFoundException("Stock item not found");
    }

    return {
      id: row.id,
      deleted: true
    };
  }

  private stockSelectFields() {
    return this.database.sql`
      psi.id,
      psi.name,
      psi.category,
      psi.sku,
      psi.unit,
      psi.current_stock::text,
      psi.min_stock::text,
      psi.ordering_stock::text,
      psi.cost_price::text,
      psi.supplier,
      psi.last_import_at::text,
      psi.expiry_date::text,
      psi.image_url,
      psi.created_at,
      psi.updated_at
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

  private async findStockRow(businessId: string, itemId: string) {
    const [row] = await this.database.sql<StockRow[]>`
      SELECT ${this.stockSelectFields()}
      FROM pos_stock_items psi
      WHERE psi.business_id = ${businessId}
        AND psi.id = ${itemId}
        AND psi.deleted_at IS NULL
      LIMIT 1
    `;

    return row ?? null;
  }

  private async getAllStockRows(businessId: string) {
    return await this.database.sql<StockRow[]>`
      SELECT ${this.stockSelectFields()}
      FROM pos_stock_items psi
      WHERE psi.business_id = ${businessId}
        AND psi.deleted_at IS NULL
      ORDER BY psi.category ASC, psi.name ASC
    `;
  }

  private async countTodayImports(businessId: string) {
    const [{ count }] = await this.database.sql<{ count: string }[]>`
      SELECT count(*)::text
      FROM pos_stock_movements psm
      WHERE psm.business_id = ${businessId}
        AND psm.movement_type = 'import'
        AND psm.created_at::date = CURRENT_DATE
    `;

    return Number(count);
  }

  private async getMovement7d(businessId: string): Promise<StockMovementPoint[]> {
    const rows = await this.database.sql<MovementRow[]>`
      WITH days AS (
        SELECT generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, INTERVAL '1 day')::date AS day
      )
      SELECT
        to_char(days.day, 'DD/MM') AS date_label,
        COALESCE(SUM(CASE WHEN psm.movement_type = 'import' THEN psm.quantity ELSE 0 END), 0)::text AS import_qty,
        COALESCE(SUM(CASE WHEN psm.movement_type = 'export' THEN psm.quantity ELSE 0 END), 0)::text AS export_qty
      FROM days
      LEFT JOIN pos_stock_movements psm
        ON psm.business_id = ${businessId}
       AND psm.created_at::date = days.day
      GROUP BY days.day
      ORDER BY days.day ASC
    `;

    return rows.map((row) => ({
      date: row.date_label,
      importQty: Number(row.import_qty),
      exportQty: Number(row.export_qty)
    }));
  }

  private async createMovementRecord(
    businessId: string,
    itemId: string,
    type: StockMovementType,
    quantity: number,
    note: string
  ) {
    await this.database.sql`
      INSERT INTO pos_stock_movements (
        id,
        business_id,
        stock_item_id,
        movement_type,
        quantity,
        note,
        created_at
      )
      VALUES (
        ${randomUUID()},
        ${businessId},
        ${itemId},
        ${type},
        ${quantity},
        ${note},
        now()
      )
    `;
  }

  private async seedDefaultStockItems(businessId: string) {
    const [{ count }] = await this.database.sql<{ count: string }[]>`
      SELECT count(*)::text
      FROM pos_stock_items
      WHERE business_id = ${businessId}
        AND deleted_at IS NULL
    `;

    if (Number(count) > 0) {
      return;
    }

    for (const stockItem of seedStockItems) {
      const created = await this.createSeedStockItem(businessId, stockItem);

      await this.createMovementRecord(businessId, created.id, "import", stockItem.currentStock, "Seed tồn kho");
      await this.createMovementRecord(
        businessId,
        created.id,
        "export",
        Math.max(1, Math.round(stockItem.currentStock / 5)),
        "Seed xuất kho"
      );
    }
  }

  private async createSeedStockItem(businessId: string, stockItem: Required<SaveStockItemBody>) {
    const itemId = randomUUID();

    await this.database.sql`
      INSERT INTO pos_stock_items (
        id,
        business_id,
        name,
        category,
        sku,
        unit,
        current_stock,
        min_stock,
        ordering_stock,
        cost_price,
        supplier,
        last_import_at,
        expiry_date,
        image_url,
        created_at,
        updated_at
      )
      VALUES (
        ${itemId},
        ${businessId},
        ${stockItem.name},
        ${stockItem.category},
        ${stockItem.sku},
        ${stockItem.unit},
        ${stockItem.currentStock},
        ${stockItem.minStock},
        ${stockItem.orderingStock},
        ${stockItem.costPrice},
        ${stockItem.supplier},
        CURRENT_DATE,
        ${normalizeDate(stockItem.expiryDate)},
        ${stockItem.image},
        now(),
        now()
      )
    `;

    return { id: itemId };
  }

  private async ensureInventorySchema() {
    await this.database.sql`
      CREATE TABLE IF NOT EXISTS pos_stock_items (
        id uuid PRIMARY KEY,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        name varchar NOT NULL,
        category varchar NOT NULL DEFAULT 'ingredient',
        sku varchar NOT NULL DEFAULT '',
        unit varchar NOT NULL DEFAULT 'cái',
        current_stock numeric(14, 3) NOT NULL DEFAULT 0,
        min_stock numeric(14, 3) NOT NULL DEFAULT 0,
        ordering_stock numeric(14, 3) NOT NULL DEFAULT 0,
        cost_price numeric(14, 2) NOT NULL DEFAULT 0,
        supplier varchar NOT NULL DEFAULT '',
        last_import_at date NULL,
        expiry_date date NULL,
        image_url text NOT NULL DEFAULT '',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz NULL
      )
    `;

    await this.database.sql`
      CREATE TABLE IF NOT EXISTS pos_stock_movements (
        id uuid PRIMARY KEY,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        stock_item_id uuid NOT NULL REFERENCES pos_stock_items(id) ON DELETE CASCADE,
        movement_type varchar NOT NULL,
        quantity numeric(14, 3) NOT NULL DEFAULT 0,
        note text NOT NULL DEFAULT '',
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    await this.database.sql`
      CREATE INDEX IF NOT EXISTS pos_stock_items_business_category_idx
      ON pos_stock_items (business_id, category)
      WHERE deleted_at IS NULL
    `;

    await this.database.sql`
      CREATE INDEX IF NOT EXISTS pos_stock_movements_business_created_idx
      ON pos_stock_movements (business_id, created_at)
    `;
  }
}

function normalizeStockBody(body: SaveStockItemBody, creating: boolean) {
  const name = normalizeText(body.name);

  if (creating && !name) {
    throw new BadRequestException("Stock item name is required");
  }

  return {
    name,
    category: isStockCategory(body.category) ? body.category : creating ? "ingredient" : undefined,
    sku: normalizeText(body.sku) ?? (creating ? "" : undefined),
    unit: normalizeText(body.unit) ?? (creating ? "cái" : undefined),
    currentStock: normalizeNonNegativeNumber(body.currentStock) ?? (creating ? 0 : undefined),
    minStock: normalizeNonNegativeNumber(body.minStock) ?? (creating ? 0 : undefined),
    orderingStock: normalizeNonNegativeNumber(body.orderingStock) ?? (creating ? 0 : undefined),
    costPrice: normalizeNonNegativeNumber(body.costPrice) ?? (creating ? 0 : undefined),
    supplier: normalizeText(body.supplier) ?? (creating ? "" : undefined),
    expiryDate: body.expiryDate,
    image: normalizeText(body.image) ?? (creating ? "" : undefined)
  };
}

function normalizeText(value?: string | null) {
  const text = value?.trim();

  return text ? text : undefined;
}

function normalizeNonNegativeNumber(value?: number | null) {
  if (value === undefined || value === null) return undefined;
  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : undefined;
}

function normalizeRequiredPositiveNumber(value: number | undefined, fieldName: string) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    throw new BadRequestException(`${fieldName} must be greater than 0`);
  }

  return numberValue;
}

function normalizeDate(value?: string | null) {
  const text = normalizeText(value);

  return text ? text : null;
}

function isStockCategory(value?: string): value is StockCategory {
  return Boolean(value && stockCategories.has(value as StockCategory));
}

function isStockStatus(value?: string): value is StockStatus {
  return Boolean(value && stockStatuses.has(value as StockStatus));
}

function toCafeStockItem(row: StockRow): CafeStockItem {
  const currentStock = Number(row.current_stock);
  const minStock = Number(row.min_stock);
  const orderingStock = Number(row.ordering_stock);
  const costPrice = Number(row.cost_price);

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    categoryLabel: categoryLabelByCategory[row.category] ?? row.category,
    sku: row.sku,
    unit: row.unit,
    currentStock,
    availableStock: currentStock,
    minStock,
    orderingStock,
    status: resolveStockStatus(currentStock, minStock, orderingStock),
    costPrice,
    inventoryValue: currentStock * costPrice,
    supplier: row.supplier,
    lastImportAt: formatDate(row.last_import_at),
    expiryDate: formatDate(row.expiry_date),
    image: row.image_url || "/images/pos-login-hero.png",
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString()
  };
}

function resolveStockStatus(currentStock: number, minStock: number, orderingStock: number): StockStatus {
  if (currentStock <= 0) return "out-of-stock";
  if (orderingStock > 0 && currentStock <= minStock) return "ordering";
  if (currentStock <= minStock) return "low-stock";

  return "in-stock";
}

function buildStockKpis(items: CafeStockItem[], todayImports: number): StockKpi[] {
  const inventoryValue = items.reduce((sum, item) => sum + item.inventoryValue, 0);

  return [
    {
      id: "value",
      title: "Tổng giá trị tồn kho",
      value: formatCurrency(inventoryValue),
      subtitle: "giá vốn hiện tại",
      tone: "brown"
    },
    {
      id: "products",
      title: "Tổng mặt hàng",
      value: String(items.length),
      subtitle: "SKU",
      tone: "green"
    },
    {
      id: "low",
      title: "Sắp hết hàng",
      value: String(items.filter((item) => item.status === "low-stock" || item.status === "ordering").length),
      subtitle: "cần xử lý",
      tone: "amber"
    },
    {
      id: "out",
      title: "Hết hàng",
      value: String(items.filter((item) => item.status === "out-of-stock").length),
      subtitle: "không còn tồn",
      tone: "red"
    },
    {
      id: "imports",
      title: "Nhập hàng hôm nay",
      value: String(todayImports),
      subtitle: "phiếu nhập",
      tone: "blue"
    }
  ];
}

function formatCurrency(value: number) {
  return `${Math.round(value).toLocaleString("vi-VN")}đ`;
}

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
