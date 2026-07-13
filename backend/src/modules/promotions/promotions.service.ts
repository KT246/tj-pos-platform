import { BadRequestException, ConflictException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "crypto";

import { DatabaseService } from "../../database/database.service";
import type {
  BusinessPromotion,
  BusinessPromotionsResponse,
  DeletePromotionResponse,
  PromotionKpi,
  PromotionApplyScope,
  PromotionStatus,
  PromotionType,
  SavePromotionBody
} from "./promotions.dto";

type BusinessRow = {
  id: string;
};

type PromotionRow = {
  id: string;
  name: string;
  code: string;
  promotion_type: PromotionType;
  type_label: string;
  value_label: string;
  value_note: string;
  period_label: string;
  remaining_label: string;
  status: PromotionStatus;
  image_url: string;
  applies_to: string;
  scope_label: string;
  condition_text: string;
  exclusion_text: string;
  description: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  apply_scope: string;
  target_ids: string[];
  min_subtotal: string;
  discount_value: string;
  max_discount_amount: string | null;
  start_date: string | null;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  days_of_week: number[];
};

const defaultPageSize = 50;
const promotionStatuses = new Set<PromotionStatus>(["active", "paused", "ended", "upcoming"]);
const promotionTypes = new Set<PromotionType>(["percent", "amount", "bogo", "free-shipping", "combo"]);
const promotionApplyScopes = new Set<PromotionApplyScope>(["all_order", "category", "product", "combo", "customer_group"]);

const seedPromotions: Array<Omit<SavePromotionBody, "image"> & { image: string }> = [
  {
    name: "ຫຼຸດ 20% ເຄື່ອງດື່ມ",
    code: "SAVE20",
    type: "percent",
    typeLabel: "ຫຼຸດ %",
    value: "20%",
    valueNote: "ສູງສຸດ 50.000 ກີບ",
    period: "15/05/2024 - 31/05/2024",
    remaining: "ເຫຼືອ 11 ມື້",
    status: "active",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=180&q=80",
    appliesTo: "ເຄື່ອງດື່ມທັງໝົດ",
    scope: "ທຸກສາຂາ",
    condition: "ບິນຕັ້ງແຕ່ 50.000 ກີບ",
    exclusion: "ຢາສູບ, ບັດເຕີມເງິນໂທລະສັບ",
    description: "ຫຼຸດ 20% ສຳລັບເຄື່ອງດື່ມທັງໝົດ.",
    createdBy: "?????"
  },
  {
    name: "ຫຼຸດ 30.000 ກີບ ບິນຕັ້ງແຕ່ 100K",
    code: "COFFEE30",
    type: "amount",
    typeLabel: "ຫຼຸດເປັນເງິນ",
    value: "30.000 ກີບ",
    valueNote: "ບິນຕັ້ງແຕ່ 100.000 ກີບ",
    period: "10/05/2024 - 25/05/2024",
    remaining: "ເຫຼືອ 5 ມື້",
    status: "active",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=180&q=80",
    appliesTo: "ເມນູທັງໝົດ",
    scope: "ສາຂາ 1",
    condition: "ບິນຂັ້ນຕ່ຳ 100.000 ກີບ",
    exclusion: "ຄອມໂບທີ່ກຳລັງຫຼຸດລາຄາ",
    description: "ຫຼຸດທັນທີ 30.000 ກີບ ສຳລັບບິນຕັ້ງແຕ່ 100.000 ກີບ.",
    createdBy: "?????"
  },
  {
    name: "ຊື້ 2 ແຖມ 1 ກາເຟ",
    code: "BUY2GET1",
    type: "bogo",
    typeLabel: "ຊື້ X ແຖມ Y",
    value: "ຊື້ 2 ແຖມ 1",
    valueNote: "ກາເຟດຳ",
    period: "01/05/2024 - 31/05/2024",
    remaining: "ເຫຼືອ 11 ມື້",
    status: "active",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=180&q=80",
    appliesTo: "ກາເຟ",
    scope: "ທຸກສາຂາ",
    condition: "ຊື້ 2 ແກ້ວປະເພດດຽວກັນ",
    exclusion: "ບໍ່ໃຊ້ຮ່ວມກັບວອຊເຊີອື່ນ",
    description: "ຊື້ກາເຟ 2 ແກ້ວ ແຖມກາເຟດຳ 1 ແກ້ວ.",
    createdBy: "?????"
  },
  {
    name: "ສົ່ງຟຣີ ບິນຕັ້ງແຕ່ 50K",
    code: "FREESHIP50",
    type: "free-shipping",
    typeLabel: "ສົ່ງຟຣີ",
    value: "ຟຣີ",
    valueNote: "ບິນຕັ້ງແຕ່ 50.000 ກີບ",
    period: "01/05/2024 - 31/05/2024",
    remaining: "ເຫຼືອ 11 ມື້",
    status: "active",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=180&q=80",
    appliesTo: "ອໍເດີຈັດສົ່ງ",
    scope: "ລັດສະໝີ 5km",
    condition: "ອໍເດີຈັດສົ່ງຕັ້ງແຕ່ 50.000 ກີບ",
    exclusion: "ພື້ນທີ່ນອກລັດສະໝີທີ່ຮອງຮັບ",
    description: "ສົ່ງຟຣີສຳລັບບິນຕັ້ງແຕ່ 50.000 ກີບ.",
    createdBy: "?????"
  },
  {
    name: "Happy Hour 14h - 16h",
    code: "HH1416",
    type: "percent",
    typeLabel: "ຫຼຸດ %",
    value: "15%",
    valueNote: "ສູງສຸດ 30.000 ກີບ",
    period: "01/05/2024 - 31/05/2024",
    remaining: "ເຫຼືອ 11 ມື້",
    status: "paused",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=180&q=80",
    appliesTo: "ເຄື່ອງດື່ມ",
    scope: "ສາຂາ 1",
    condition: "ໃຊ້ໄດ້ສະເພາະ 14h - 16h",
    exclusion: "ບໍ່ໃຊ້ໃນມື້ພັກ",
    description: "ໂປຣໂມຊັນຊ່ວງເວລາລູກຄ້ານ້ອຍສຳລັບເຄື່ອງດື່ມ.",
    createdBy: "?????"
  },
  {
    name: "ສ່ວນຫຼຸດວັນຈັນປະຈຳອາທິດ",
    code: "MONDAY20",
    type: "percent",
    typeLabel: "ຫຼຸດ %",
    value: "20%",
    valueNote: "ສູງສຸດ 40.000 ກີບ",
    period: "01/05/2024 - 30/06/2024",
    remaining: "ເຫຼືອ 41 ມື້",
    status: "paused",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=180&q=80",
    appliesTo: "ເມນູທັງໝົດ",
    scope: "ທຸກສາຂາ",
    condition: "ໃຊ້ໃນວັນຈັນ",
    exclusion: "ບໍ່ໃຊ້ຮ່ວມກັບໂປຣໂມຊັນອື່ນ",
    description: "ສ່ວນຫຼຸດປະຈຳທຸກວັນຈັນ.",
    createdBy: "?????"
  },
  {
    name: "ສ່ວນຫຼຸດລູກຄ້າໃໝ່",
    code: "NEW20",
    type: "amount",
    typeLabel: "ຫຼຸດເປັນເງິນ",
    value: "20.000 ກີບ",
    valueNote: "ບິນຕັ້ງແຕ່ 80.000 ກີບ",
    period: "01/04/2024 - 30/04/2024",
    remaining: "ສິ້ນສຸດແລ້ວ",
    status: "ended",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=180&q=80",
    appliesTo: "ລູກຄ້າໃໝ່",
    scope: "ທຸກສາຂາ",
    condition: "ລູກຄ້າທີ່ສ້າງໃໝ່",
    exclusion: "ບໍ່ໃຊ້ກັບລູກຄ້າເກົ່າ",
    description: "ສ່ວນຫຼຸດສຳລັບລູກຄ້າໃໝ່.",
    createdBy: "?????"
  },
  {
    name: "ຄອມໂບເຊົ້າ 49K",
    code: "CB49K",
    type: "combo",
    typeLabel: "Combo",
    value: "49.000 ກີບ",
    valueNote: "ເຄື່ອງດື່ມ 1 + ເຂົ້າໜົມ 1",
    period: "01/04/2024 - 30/04/2024",
    remaining: "ສິ້ນສຸດແລ້ວ",
    status: "ended",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=180&q=80",
    appliesTo: "ຄອມໂບເຊົ້າ",
    scope: "ສາຂາ 1",
    condition: "ໃຊ້ກ່ອນ 10h",
    exclusion: "ບໍ່ໃຊ້ໃນທ້າຍອາທິດ",
    description: "ຄອມໂບເຊົ້າລາຄາດີ.",
    createdBy: "?????"
  }
];

@Injectable()
export class PromotionsService implements OnModuleInit {
  constructor(private readonly database: DatabaseService) {}

  async onModuleInit() {
    await this.ensurePromotionsSchema();
  }

  async listBusinessPromotions(
    businessSlug: string,
    query: { q?: string; status?: string; page?: number; pageSize?: number }
  ): Promise<BusinessPromotionsResponse> {
    const business = await this.getBusinessBySlug(businessSlug);
    await this.seedDefaultPromotions(business.id);

    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || defaultPageSize));
    const offset = (page - 1) * pageSize;
    const search = query.q?.trim() ? `%${query.q.trim()}%` : null;
    const status = isPromotionStatus(query.status) ? query.status : null;
    const rows = await this.database.sql<PromotionRow[]>`
      SELECT ${this.promotionSelectFields()}
      FROM pos_promotions pp
      WHERE pp.business_id = ${business.id}
        AND pp.deleted_at IS NULL
        AND (${search}::text IS NULL OR pp.name ILIKE ${search} OR pp.code ILIKE ${search})
        AND (${status}::text IS NULL OR pp.status = ${status})
      ORDER BY pp.created_at DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `;
    const allRows = await this.getAllPromotionRows(business.id);
    const total = await this.countPromotions(business.id, search, status);
    const allPromotions = allRows.map(toBusinessPromotion);

    return {
      promotions: rows.map(toBusinessPromotion),
      kpis: buildPromotionKpis(allPromotions),
      pagination: {
        page,
        pageSize,
        total
      }
    };
  }

  async getBusinessPromotion(businessSlug: string, promotionId: string): Promise<BusinessPromotion> {
    const business = await this.getBusinessBySlug(businessSlug);
    const row = await this.findPromotionRow(business.id, promotionId);

    if (!row) {
      throw new NotFoundException("Promotion not found");
    }

    return toBusinessPromotion(row);
  }

  async createBusinessPromotion(businessSlug: string, body: SavePromotionBody): Promise<BusinessPromotion> {
    const business = await this.getBusinessBySlug(businessSlug);
    const normalized = normalizePromotionBody(body, true);
    const promotionId = randomUUID();

    await this.assertCodeAvailable(business.id, normalized.code ?? "");

    await this.database.sql`
      INSERT INTO pos_promotions (
        id,
        business_id,
        name,
        code,
        promotion_type,
        type_label,
        value_label,
        value_note,
        period_label,
        remaining_label,
        status,
        image_url,
        applies_to,
        scope_label,
        condition_text,
        exclusion_text,
        description,
        created_by,
        apply_scope,
        target_ids,
        min_subtotal,
        discount_value,
        max_discount_amount,
        start_date,
        end_date,
        start_time,
        end_time,
        days_of_week,
        created_at,
        updated_at
      )
      VALUES (
        ${promotionId},
        ${business.id},
        ${normalized.name ?? ""},
        ${normalized.code ?? ""},
        ${normalized.type ?? "percent"},
        ${normalized.typeLabel ?? "ຫຼຸດ %"},
        ${normalized.value ?? "0%"},
        ${normalized.valueNote ?? ""},
        ${normalized.period ?? ""},
        ${normalized.remaining ?? ""},
        ${normalized.status ?? "active"},
        ${normalized.image ?? ""},
        ${normalized.appliesTo ?? ""},
        ${normalized.scope ?? ""},
        ${normalized.condition ?? ""},
        ${normalized.exclusion ?? ""},
        ${normalized.description ?? ""},
        ${normalized.createdBy ?? "?????"},
        ${normalized.applyScope ?? "all_order"},
        ${normalized.targetIds ?? []},
        ${normalized.minSubtotal ?? 0},
        ${normalized.discountValue ?? 0},
        ${normalized.maxDiscountAmount ?? null},
        ${normalized.startDate ?? null},
        ${normalized.endDate ?? null},
        ${normalized.startTime ?? null},
        ${normalized.endTime ?? null},
        ${normalized.daysOfWeek ?? []},
        now(),
        now()
      )
    `;

    return this.getBusinessPromotion(businessSlug, promotionId);
  }

  async updateBusinessPromotion(
    businessSlug: string,
    promotionId: string,
    body: SavePromotionBody
  ): Promise<BusinessPromotion> {
    const business = await this.getBusinessBySlug(businessSlug);
    const current = await this.findPromotionRow(business.id, promotionId);

    if (!current) {
      throw new NotFoundException("Promotion not found");
    }

    const normalized = normalizePromotionBody(body, false);
    const nextCode = normalized.code ?? current.code;

    await this.assertCodeAvailable(business.id, nextCode, promotionId);

    await this.database.sql`
      UPDATE pos_promotions
      SET
        name = ${normalized.name ?? current.name},
        code = ${nextCode},
        promotion_type = ${normalized.type ?? current.promotion_type},
        type_label = ${normalized.typeLabel ?? current.type_label},
        value_label = ${normalized.value ?? current.value_label},
        value_note = ${normalized.valueNote ?? current.value_note},
        period_label = ${normalized.period ?? current.period_label},
        remaining_label = ${normalized.remaining ?? current.remaining_label},
        status = ${normalized.status ?? current.status},
        image_url = ${normalized.image ?? current.image_url},
        applies_to = ${normalized.appliesTo ?? current.applies_to},
        scope_label = ${normalized.scope ?? current.scope_label},
        condition_text = ${normalized.condition ?? current.condition_text},
        exclusion_text = ${normalized.exclusion ?? current.exclusion_text},
        description = ${normalized.description ?? current.description},
        created_by = ${normalized.createdBy ?? current.created_by},
        apply_scope = ${normalized.applyScope ?? current.apply_scope},
        target_ids = ${normalized.targetIds ?? current.target_ids},
        min_subtotal = ${normalized.minSubtotal ?? current.min_subtotal},
        discount_value = ${normalized.discountValue ?? current.discount_value},
        max_discount_amount = ${normalized.maxDiscountAmount === undefined ? current.max_discount_amount : normalized.maxDiscountAmount},
        start_date = ${normalized.startDate === undefined ? current.start_date : normalized.startDate},
        end_date = ${normalized.endDate === undefined ? current.end_date : normalized.endDate},
        start_time = ${normalized.startTime === undefined ? current.start_time : normalized.startTime},
        end_time = ${normalized.endTime === undefined ? current.end_time : normalized.endTime},
        days_of_week = ${normalized.daysOfWeek ?? current.days_of_week},
        updated_at = now()
      WHERE id = ${promotionId}
        AND business_id = ${business.id}
        AND deleted_at IS NULL
    `;

    return this.getBusinessPromotion(businessSlug, promotionId);
  }

  async deleteBusinessPromotion(
    businessSlug: string,
    promotionId: string
  ): Promise<DeletePromotionResponse> {
    const business = await this.getBusinessBySlug(businessSlug);
    const [row] = await this.database.sql<{ id: string }[]>`
      UPDATE pos_promotions
      SET deleted_at = now(),
        status = 'ended',
        updated_at = now()
      WHERE id = ${promotionId}
        AND business_id = ${business.id}
        AND deleted_at IS NULL
      RETURNING id
    `;

    if (!row) {
      throw new NotFoundException("Promotion not found");
    }

    return {
      id: row.id,
      deleted: true
    };
  }

  private promotionSelectFields() {
    return this.database.sql`
      pp.id,
      pp.name,
      pp.code,
      pp.promotion_type,
      pp.type_label,
      pp.value_label,
      pp.value_note,
      pp.period_label,
      pp.remaining_label,
      pp.status,
      pp.image_url,
      pp.applies_to,
      pp.scope_label,
      pp.condition_text,
      pp.exclusion_text,
      pp.description,
      pp.created_by,
      pp.apply_scope,
      pp.target_ids,
      pp.min_subtotal::text,
      pp.discount_value::text,
      pp.max_discount_amount::text,
      pp.start_date::text,
      pp.end_date::text,
      pp.start_time::text,
      pp.end_time::text,
      pp.days_of_week,
      pp.created_at,
      pp.updated_at
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

  private async findPromotionRow(businessId: string, promotionId: string) {
    const [row] = await this.database.sql<PromotionRow[]>`
      SELECT ${this.promotionSelectFields()}
      FROM pos_promotions pp
      WHERE pp.business_id = ${businessId}
        AND pp.id = ${promotionId}
        AND pp.deleted_at IS NULL
      LIMIT 1
    `;

    return row ?? null;
  }

  private async getAllPromotionRows(businessId: string) {
    return await this.database.sql<PromotionRow[]>`
      SELECT ${this.promotionSelectFields()}
      FROM pos_promotions pp
      WHERE pp.business_id = ${businessId}
        AND pp.deleted_at IS NULL
      ORDER BY pp.created_at DESC
    `;
  }

  private async countPromotions(
    businessId: string,
    search: string | null,
    status: PromotionStatus | null
  ) {
    const [{ count }] = await this.database.sql<{ count: string }[]>`
      SELECT count(*)::text
      FROM pos_promotions pp
      WHERE pp.business_id = ${businessId}
        AND pp.deleted_at IS NULL
        AND (${search}::text IS NULL OR pp.name ILIKE ${search} OR pp.code ILIKE ${search})
        AND (${status}::text IS NULL OR pp.status = ${status})
    `;

    return Number(count);
  }

  private async assertCodeAvailable(
    businessId: string,
    code: string,
    excludePromotionId?: string
  ) {
    if (!code) {
      return;
    }

    const [existing] = await this.database.sql<{ id: string }[]>`
      SELECT id
      FROM pos_promotions
      WHERE business_id = ${businessId}
        AND lower(code) = lower(${code})
        AND deleted_at IS NULL
        AND (${excludePromotionId ?? null}::uuid IS NULL OR id <> ${excludePromotionId ?? null})
      LIMIT 1
    `;

    if (existing) {
      throw new ConflictException("Promotion code already exists");
    }
  }

  private async seedDefaultPromotions(businessId: string) {
    const [{ count }] = await this.database.sql<{ count: string }[]>`
      SELECT count(*)::text
      FROM pos_promotions
      WHERE business_id = ${businessId}
    `;

    if (Number(count) > 0) {
      return;
    }

    for (const promotion of seedPromotions) {
      const normalized = normalizePromotionBody(promotion, true);

      await this.database.sql`
        INSERT INTO pos_promotions (
          id,
          business_id,
          name,
          code,
          promotion_type,
          type_label,
          value_label,
          value_note,
          period_label,
          remaining_label,
          status,
          image_url,
          applies_to,
          scope_label,
          condition_text,
          exclusion_text,
          description,
          created_by,
          apply_scope,
          target_ids,
          min_subtotal,
          discount_value,
          max_discount_amount,
          start_date,
          end_date,
          start_time,
          end_time,
          days_of_week,
          created_at,
          updated_at
        )
        VALUES (
          ${randomUUID()},
          ${businessId},
          ${normalized.name ?? ""},
          ${normalized.code ?? ""},
          ${normalized.type ?? "percent"},
          ${normalized.typeLabel ?? "ຫຼຸດ %"},
          ${normalized.value ?? "0%"},
          ${normalized.valueNote ?? ""},
          ${normalized.period ?? ""},
          ${normalized.remaining ?? ""},
          ${normalized.status ?? "active"},
          ${normalized.image ?? ""},
          ${normalized.appliesTo ?? ""},
          ${normalized.scope ?? ""},
          ${normalized.condition ?? ""},
          ${normalized.exclusion ?? ""},
          ${normalized.description ?? ""},
          ${normalized.createdBy ?? "?????"},
          ${normalized.applyScope ?? "all_order"},
          ${normalized.targetIds ?? []},
          ${normalized.minSubtotal ?? 0},
          ${normalized.discountValue ?? 0},
          ${normalized.maxDiscountAmount ?? null},
          ${normalized.startDate ?? null},
          ${normalized.endDate ?? null},
          ${normalized.startTime ?? null},
          ${normalized.endTime ?? null},
          ${normalized.daysOfWeek ?? []},
          now(),
          now()
        )
      `;
    }
  }

  private async ensurePromotionsSchema() {
    await this.database.sql`
      CREATE TABLE IF NOT EXISTS pos_promotions (
        id uuid PRIMARY KEY,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        name varchar NOT NULL,
        code varchar NOT NULL,
        promotion_type varchar NOT NULL,
        type_label varchar NOT NULL,
        value_label varchar NOT NULL,
        value_note varchar NOT NULL DEFAULT '',
        period_label varchar NOT NULL DEFAULT '',
        remaining_label varchar NOT NULL DEFAULT '',
        status varchar NOT NULL DEFAULT 'active',
        image_url text NOT NULL DEFAULT '',
        applies_to varchar NOT NULL DEFAULT '',
        scope_label varchar NOT NULL DEFAULT '',
        condition_text text NOT NULL DEFAULT '',
        exclusion_text text NOT NULL DEFAULT '',
        description text NOT NULL DEFAULT '',
        created_by varchar NOT NULL DEFAULT '',
        apply_scope varchar NOT NULL DEFAULT 'all_order',
        target_ids text[] NOT NULL DEFAULT '{}',
        min_subtotal numeric NOT NULL DEFAULT 0,
        discount_value numeric NOT NULL DEFAULT 0,
        max_discount_amount numeric NULL,
        start_date date NULL,
        end_date date NULL,
        start_time time NULL,
        end_time time NULL,
        days_of_week int[] NOT NULL DEFAULT '{}',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz NULL
      )
    `;

    await this.database.sql`
      ALTER TABLE pos_promotions
        ADD COLUMN IF NOT EXISTS apply_scope varchar NOT NULL DEFAULT 'all_order',
        ADD COLUMN IF NOT EXISTS target_ids text[] NOT NULL DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS min_subtotal numeric NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS discount_value numeric NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS max_discount_amount numeric NULL,
        ADD COLUMN IF NOT EXISTS start_date date NULL,
        ADD COLUMN IF NOT EXISTS end_date date NULL,
        ADD COLUMN IF NOT EXISTS start_time time NULL,
        ADD COLUMN IF NOT EXISTS end_time time NULL,
        ADD COLUMN IF NOT EXISTS days_of_week int[] NOT NULL DEFAULT '{}'
    `;

    await this.database.sql`
      CREATE UNIQUE INDEX IF NOT EXISTS pos_promotions_business_code_idx
      ON pos_promotions (business_id, lower(code))
      WHERE deleted_at IS NULL
    `;
  }
}

function normalizePromotionBody(body: SavePromotionBody, creating: boolean) {
  const name = normalizeText(body.name);
  const code = normalizeText(body.code)?.toUpperCase();
  const type = isPromotionType(body.type) ? body.type : undefined;
  const status = isPromotionStatus(body.status) ? body.status : undefined;
  const applyScope = isPromotionApplyScope(body.applyScope) ? body.applyScope : undefined;

  if (creating && !name) {
    throw new BadRequestException("Promotion name is required");
  }

  if (creating && !code) {
    throw new BadRequestException("Promotion code is required");
  }

  return {
    name,
    code,
    type: type ?? (creating ? "percent" : undefined),
    typeLabel: normalizeText(body.typeLabel) ?? (creating ? "ຫຼຸດ %" : undefined),
    value: normalizeText(body.value) ?? (creating ? "0%" : undefined),
    valueNote: normalizeText(body.valueNote) ?? (creating ? "" : undefined),
    period: normalizeText(body.period) ?? (creating ? "" : undefined),
    remaining: normalizeText(body.remaining) ?? (creating ? "" : undefined),
    status: status ?? (creating ? "active" : undefined),
    image: normalizeText(body.image) ?? (creating ? "" : undefined),
    appliesTo: normalizeText(body.appliesTo) ?? (creating ? "" : undefined),
    scope: normalizeText(body.scope) ?? (creating ? "" : undefined),
    condition: normalizeText(body.condition) ?? (creating ? "" : undefined),
    exclusion: normalizeText(body.exclusion) ?? (creating ? "" : undefined),
    description: normalizeText(body.description) ?? (creating ? "" : undefined),
    createdBy: normalizeText(body.createdBy) ?? (creating ? "?????" : undefined),
    applyScope: applyScope ?? (creating ? "all_order" : undefined),
    targetIds: normalizeStringArray(body.targetIds) ?? (creating ? [] : undefined),
    minSubtotal: normalizeMoney(body.minSubtotal) ?? (creating ? 0 : undefined),
    discountValue: normalizeMoney(body.discountValue) ?? (creating ? 0 : undefined),
    maxDiscountAmount: normalizeNullableMoney(body.maxDiscountAmount),
    startDate: normalizeNullableText(body.startDate),
    endDate: normalizeNullableText(body.endDate),
    startTime: normalizeNullableText(body.startTime),
    endTime: normalizeNullableText(body.endTime),
    daysOfWeek: normalizeNumberArray(body.daysOfWeek) ?? (creating ? [] : undefined)
  };
}

function normalizeText(value?: string | null) {
  const text = value?.trim();

  return text ? text : undefined;
}

function isPromotionStatus(value?: string): value is PromotionStatus {
  return Boolean(value && promotionStatuses.has(value as PromotionStatus));
}

function isPromotionType(value?: string): value is PromotionType {
  return Boolean(value && promotionTypes.has(value as PromotionType));
}

function isPromotionApplyScope(value?: string): value is PromotionApplyScope {
  return Boolean(value && promotionApplyScopes.has(value as PromotionApplyScope));
}

function normalizeMoney(value?: number | null) {
  if (value === undefined || value === null) return undefined;
  const numeric = Number(value);

  return Number.isFinite(numeric) ? Math.max(0, numeric) : undefined;
}

function normalizeNullableMoney(value?: number | null) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  return normalizeMoney(value) ?? null;
}

function normalizeNullableText(value?: string | null) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  return normalizeText(value) ?? null;
}

function normalizeStringArray(values?: string[] | null) {
  if (!Array.isArray(values)) return undefined;

  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function normalizeNumberArray(values?: number[] | null) {
  if (!Array.isArray(values)) return undefined;

  return [...new Set(values.map(Number).filter((value) => Number.isInteger(value) && value >= 0 && value <= 6))];
}

function toBusinessPromotion(row: PromotionRow): BusinessPromotion {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    type: row.promotion_type,
    typeLabel: row.type_label,
    value: row.value_label,
    valueNote: row.value_note,
    period: row.period_label,
    remaining: row.remaining_label,
    status: row.status,
    image: row.image_url,
    appliesTo: row.applies_to,
    scope: row.scope_label,
    condition: row.condition_text,
    exclusion: row.exclusion_text,
    description: row.description,
    createdAt: row.created_at.toISOString(),
    createdBy: row.created_by,
    applyScope: isPromotionApplyScope(row.apply_scope) ? row.apply_scope : "all_order",
    targetIds: row.target_ids ?? [],
    minSubtotal: Number(row.min_subtotal),
    discountValue: Number(row.discount_value),
    maxDiscountAmount: row.max_discount_amount === null ? null : Number(row.max_discount_amount),
    startDate: row.start_date,
    endDate: row.end_date,
    startTime: row.start_time,
    endTime: row.end_time,
    daysOfWeek: row.days_of_week ?? []
  };
}

function buildPromotionKpis(promotions: BusinessPromotion[]): PromotionKpi[] {
  const active = promotions.filter((promotion) => promotion.status === "active").length;
  const paused = promotions.filter((promotion) => promotion.status === "paused").length;
  const ended = promotions.filter((promotion) => promotion.status === "ended").length;

  return [
    {
      id: "total",
      title: "ລວມໂປຣໂມຊັນ",
      value: String(promotions.length),
      subtitle: "ໂປຣໂມຊັນ",
      tone: "green"
    },
    {
      id: "active",
      title: "ກຳລັງໃຊ້ງານ",
      value: String(active),
      subtitle: "ໂປຣໂມຊັນ",
      tone: "green"
    },
    {
      id: "paused",
      title: "ຢຸດຊົ່ວຄາວ",
      value: String(paused),
      subtitle: "ໂປຣໂມຊັນ",
      tone: "amber"
    },
    {
      id: "ended",
      title: "ສິ້ນສຸດແລ້ວ",
      value: String(ended),
      subtitle: "ໂປຣໂມຊັນ",
      tone: "red"
    }
  ];
}
