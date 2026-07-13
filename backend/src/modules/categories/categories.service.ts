import { BadRequestException, ConflictException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "crypto";

import { DatabaseService } from "../../database/database.service";
import type {
  BusinessCategoriesResponse,
  BusinessCategory,
  CreateBusinessCategoryBody,
  DeleteBusinessCategoryResponse,
  UpdateBusinessCategoryBody
} from "./categories.dto";

type BusinessRow = {
  id: string;
  slug: string;
};

type CategoryRow = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number | null;
  item_count: string;
  status: "active" | "inactive" | "archived";
  created_at: Date;
  updated_at: Date;
};

type StoreType = "cafe" | "restaurant" | "retail" | "beauty" | "hospitality";
type CategoryStatus = "active" | "inactive" | "archived";

const defaultCategoriesByStoreType: Record<StoreType, string[]> = {
  cafe: ["ກາເຟ", "ຊາ", "ເຄື່ອງດື່ມເຢັນ", "ເຄັກ", "ຂອງຫວານ", "ອາຫານວ່າງ"],
  restaurant: ["ອາຫານຈານຫຼັກ", "ອາຫານວ່າງ", "ເຄື່ອງດື່ມ", "ຂອງຫວານ", "ເມນູແນະນຳ"],
  retail: ["ເຄື່ອງດື່ມ", "ຂອງກິນຫຼິ້ນ", "ຂອງໃຊ້", "ເຄື່ອງສຳອາງ", "ວັດສະດຸກໍ່ສ້າງ", "ອື່ນໆ"],
  beauty: ["ບໍລິການຜົມ", "ບໍລິການເລັບ", "ນວດ", "ສະປາ", "ສິນຄ້າຂາຍ", "ແພັກເກດ"],
  hospitality: ["ຫ້ອງພັກ", "ອາຫານເຊົ້າ", "ບໍລິການເພີ່ມ", "ມິນິບາ", "ຊັກລີດ", "ອື່ນໆ"]
};

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(private readonly database: DatabaseService) {}

  async onModuleInit() {
    await this.ensureCategoriesSchema();
  }

  async listBusinessCategories(businessSlug: string): Promise<BusinessCategoriesResponse> {
    const business = await this.getBusinessBySlug(businessSlug);
    let rows = await this.getCategoryRows(business.id);

    if (rows.length === 0) {
      await this.seedDefaultCategories(business.id, getStoreType(business.slug));
      rows = await this.getCategoryRows(business.id);
    }

    return {
      categories: rows.map(toBusinessCategory)
    };
  }

  private async getCategoryRows(businessId: string) {
    return await this.database.sql<CategoryRow[]>`
      SELECT
        c.id,
        c.name,
        c.description,
        c.image_url,
        c.sort_order,
        count(i.id)::text AS item_count,
        c.status,
        c.created_at,
        c.updated_at
      FROM categories c
      LEFT JOIN items i ON i.category_id = c.id
        AND i.deleted_at IS NULL
      WHERE c.business_id = ${businessId}
        AND c.deleted_at IS NULL
      GROUP BY c.id, c.name, c.description, c.image_url, c.sort_order, c.status, c.created_at, c.updated_at
      ORDER BY c.sort_order NULLS LAST, c.name
    `;
  }

  async createBusinessCategory(
    businessSlug: string,
    body: CreateBusinessCategoryBody
  ): Promise<BusinessCategory> {
    const business = await this.getBusinessBySlug(businessSlug);
    const name = body.name?.trim();
    const description = normalizeNullableText(body.description);
    const imageUrl = normalizeNullableText(body.imageUrl);
    const sortOrder = normalizeSortOrder(body.sortOrder);
    const status = body.status ?? "active";

    if (!name) {
      throw new BadRequestException("Category name is required");
    }

    if (!isCategoryStatus(status)) {
      throw new BadRequestException("Invalid category status");
    }

    const existing = await this.findCategoryByName(business.id, name);

    if (existing) {
      return toBusinessCategory(existing);
    }

    const categoryId = randomUUID();

    await this.database.sql`
      INSERT INTO categories (
        id,
        business_id,
        name,
        description,
        image_url,
        pos_type,
        status,
        sort_order,
        created_at,
        updated_at
      )
      VALUES (
        ${categoryId},
        ${business.id},
        ${name},
        ${description},
        ${imageUrl},
        'all',
        ${status},
        ${sortOrder ?? 999},
        now(),
        now()
      )
    `;

    const created = await this.findCategoryByName(business.id, name);

    if (!created) {
      throw new NotFoundException("Category not found");
    }

    return toBusinessCategory(created);
  }

  async updateBusinessCategory(
    businessSlug: string,
    categoryId: string,
    body: UpdateBusinessCategoryBody
  ): Promise<BusinessCategory> {
    const business = await this.getBusinessBySlug(businessSlug);
    const current = await this.findCategoryById(business.id, categoryId);

    if (!current) {
      throw new NotFoundException("Category not found");
    }

    const nextName = body.name === undefined ? current.name : body.name.trim();
    const nextStatus = body.status === undefined ? current.status : body.status;
    const nextDescription =
      body.description === undefined ? current.description : normalizeNullableText(body.description);
    const nextImageUrl =
      body.imageUrl === undefined ? current.image_url : normalizeNullableText(body.imageUrl);
    const nextSortOrder =
      body.sortOrder === undefined ? current.sort_order : normalizeSortOrder(body.sortOrder);

    if (!nextName) {
      throw new BadRequestException("Category name is required");
    }

    if (!isCategoryStatus(nextStatus)) {
      throw new BadRequestException("Invalid category status");
    }

    const existing = await this.findCategoryByName(business.id, nextName);

    if (existing && existing.id !== categoryId) {
      throw new ConflictException("Category name already exists");
    }

    await this.database.sql`
      UPDATE categories
      SET
        name = ${nextName},
        description = ${nextDescription},
        image_url = ${nextImageUrl},
        sort_order = ${nextSortOrder},
        status = ${nextStatus},
        updated_at = now()
      WHERE id = ${categoryId}
        AND business_id = ${business.id}
        AND deleted_at IS NULL
    `;

    const updated = await this.findCategoryById(business.id, categoryId);

    if (!updated) {
      throw new NotFoundException("Category not found");
    }

    return toBusinessCategory(updated);
  }

  async deleteBusinessCategory(
    businessSlug: string,
    categoryId: string
  ): Promise<DeleteBusinessCategoryResponse> {
    const business = await this.getBusinessBySlug(businessSlug);
    const current = await this.findCategoryById(business.id, categoryId);

    if (!current) {
      throw new NotFoundException("Category not found");
    }

    if (Number(current.item_count) > 0) {
      throw new ConflictException("Category has items and cannot be deleted");
    }

    await this.database.sql`
      UPDATE categories
      SET
        status = 'archived',
        deleted_at = now(),
        updated_at = now()
      WHERE id = ${categoryId}
        AND business_id = ${business.id}
        AND deleted_at IS NULL
    `;

    return {
      id: categoryId,
      deleted: true
    };
  }

  private async getBusinessBySlug(slug: string) {
    const [business] = await this.database.sql<BusinessRow[]>`
      SELECT id, slug
      FROM businesses
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (!business) {
      throw new NotFoundException("Business not found");
    }

    return business;
  }

  private async seedDefaultCategories(businessId: string, storeType: StoreType) {
    const names = defaultCategoriesByStoreType[storeType] ?? defaultCategoriesByStoreType.cafe;

    for (const [index, name] of names.entries()) {
      const existing = await this.findCategoryByName(businessId, name);

      if (existing) {
        continue;
      }

      await this.database.sql`
        INSERT INTO categories (id, business_id, name, pos_type, status, sort_order, created_at, updated_at)
        VALUES (${randomUUID()}, ${businessId}, ${name}, ${storeType}, 'active', ${index + 1}, now(), now())
      `;
    }
  }

  private async findCategoryByName(businessId: string, name: string) {
    const [category] = await this.database.sql<CategoryRow[]>`
      SELECT
        c.id,
        c.name,
        c.description,
        c.image_url,
        c.sort_order,
        count(i.id)::text AS item_count,
        c.status,
        c.created_at,
        c.updated_at
      FROM categories c
      LEFT JOIN items i ON i.category_id = c.id
        AND i.deleted_at IS NULL
      WHERE c.business_id = ${businessId}
        AND lower(c.name) = lower(${name})
        AND c.deleted_at IS NULL
      GROUP BY c.id, c.name, c.description, c.image_url, c.sort_order, c.status, c.created_at, c.updated_at
      LIMIT 1
    `;

    return category ?? null;
  }

  private async findCategoryById(businessId: string, categoryId: string) {
    const [category] = await this.database.sql<CategoryRow[]>`
      SELECT
        c.id,
        c.name,
        c.description,
        c.image_url,
        c.sort_order,
        count(i.id)::text AS item_count,
        c.status,
        c.created_at,
        c.updated_at
      FROM categories c
      LEFT JOIN items i ON i.category_id = c.id
        AND i.deleted_at IS NULL
      WHERE c.business_id = ${businessId}
        AND c.id = ${categoryId}
        AND c.deleted_at IS NULL
      GROUP BY c.id, c.name, c.description, c.image_url, c.sort_order, c.status, c.created_at, c.updated_at
      LIMIT 1
    `;

    return category ?? null;
  }

  private async ensureCategoriesSchema() {
    await this.database.sql`
      CREATE TABLE IF NOT EXISTS categories (
        id uuid PRIMARY KEY,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        branch_id uuid NULL,
        name varchar NOT NULL,
        parent_category_id uuid NULL REFERENCES categories(id),
        pos_type varchar NULL,
        description text NULL,
        image_url text NULL,
        sort_order int NULL,
        status varchar NOT NULL DEFAULT 'active',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz NULL
      )
    `;
    await this.database.sql`
      ALTER TABLE categories
      ADD COLUMN IF NOT EXISTS description text NULL
    `;
    await this.database.sql`
      ALTER TABLE categories
      ADD COLUMN IF NOT EXISTS image_url text NULL
    `;
    await this.database.sql`
      ALTER TABLE categories
      ADD COLUMN IF NOT EXISTS sort_order int NULL
    `;
  }
}

function toBusinessCategory(row: CategoryRow): BusinessCategory {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
    itemCount: Number(row.item_count),
    status: row.status,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString()
  };
}

function getStoreType(slug: string): StoreType {
  const s = slug.toLowerCase();

  if (s.includes("restaurant")) return "restaurant";
  if (s.includes("retail") || s.includes("shop") || s.includes("mart")) return "retail";
  if (s.includes("beauty") || s.includes("spa") || s.includes("salon")) return "beauty";
  if (s.includes("hotel") || s.includes("resort") || s.includes("hostel")) return "hospitality";

  return "cafe";
}

function isCategoryStatus(value: unknown): value is CategoryStatus {
  return value === "active" || value === "inactive" || value === "archived";
}

function normalizeNullableText(value: string | null | undefined) {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

function normalizeSortOrder(value: number | null | undefined) {
  if (value === null || value === undefined) return null;

  const normalized = Number(value);

  return Number.isFinite(normalized) && normalized > 0 ? Math.floor(normalized) : null;
}
