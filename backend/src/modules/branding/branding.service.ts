import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "crypto";

import { DatabaseService } from "../../database/database.service";
import type {
  BrandingStyleMode,
  BusinessBranding,
  UpdateBusinessBrandingBody
} from "./branding.dto";

type BusinessRow = {
  id: string;
  slug: string;
  name: string;
};

type BrandingRow = {
  id: string;
  business_id: string;
  business_slug: string;
  business_name: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  background_color: string | null;
  banner_url: string | null;
  menu_style: BrandingStyleMode | null;
  customer_display_style: BrandingStyleMode | null;
  receipt_footer: string | null;
  updated_at: Date;
};

const defaultPrimaryColor = "#2563EB";
const defaultSecondaryColor = "#0F172A";
const defaultBackgroundColor = "#F8FBFF";
const defaultStyleMode: BrandingStyleMode = "clean";
const allowedStyleModes = new Set<BrandingStyleMode>(["clean", "compact", "featured"]);

@Injectable()
export class BrandingService implements OnModuleInit {
  constructor(private readonly database: DatabaseService) {}

  async onModuleInit() {
    await this.ensureBrandingSchema();
  }

  async getBusinessBranding(businessSlug: string): Promise<BusinessBranding> {
    const business = await this.getBusinessBySlug(businessSlug);
    const [row] = await this.database.sql<BrandingRow[]>`
      SELECT ${this.brandingSelectFields()}
      FROM branding_settings bs
      INNER JOIN businesses b ON b.id = bs.business_id
      WHERE b.slug = ${businessSlug}
      LIMIT 1
    `;

    return row ? toBusinessBranding(row) : buildDefaultBranding(business);
  }

  async updateBusinessBranding(
    businessSlug: string,
    body: UpdateBusinessBrandingBody
  ): Promise<BusinessBranding> {
    const business = await this.getBusinessBySlug(businessSlug);
    const current = await this.getBusinessBranding(businessSlug);
    const id = current.id ?? randomUUID();
    const logoUrl = body.logoUrl === undefined ? current.logoUrl : normalizeOptionalText(body.logoUrl);
    const bannerUrl = body.bannerUrl === undefined ? current.bannerUrl : normalizeOptionalText(body.bannerUrl);
    const primaryColor = body.primaryColor === undefined
      ? current.primaryColor
      : normalizeColor(body.primaryColor, "primaryColor");
    const secondaryColor = body.secondaryColor === undefined
      ? current.secondaryColor
      : normalizeColor(body.secondaryColor, "secondaryColor");
    const backgroundColor = body.backgroundColor === undefined
      ? current.backgroundColor
      : normalizeColor(body.backgroundColor, "backgroundColor");
    const menuStyle = body.menuStyle === undefined
      ? current.menuStyle
      : normalizeStyleMode(body.menuStyle, "menuStyle");
    const customerDisplayStyle = body.customerDisplayStyle === undefined
      ? current.customerDisplayStyle
      : normalizeStyleMode(body.customerDisplayStyle, "customerDisplayStyle");
    const receiptFooter = body.receiptFooter === undefined
      ? current.receiptFooter
      : normalizeOptionalText(body.receiptFooter);

    await this.database.sql`
      INSERT INTO branding_settings (
        id,
        business_id,
        logo_url,
        primary_color,
        secondary_color,
        background_color,
        banner_url,
        menu_style,
        customer_display_style,
        receipt_footer,
        updated_at
      )
      VALUES (
        ${id},
        ${business.id},
        ${logoUrl},
        ${primaryColor},
        ${secondaryColor},
        ${backgroundColor},
        ${bannerUrl},
        ${menuStyle},
        ${customerDisplayStyle},
        ${receiptFooter},
        now()
      )
      ON CONFLICT (business_id)
      DO UPDATE SET
        logo_url = EXCLUDED.logo_url,
        primary_color = EXCLUDED.primary_color,
        secondary_color = EXCLUDED.secondary_color,
        background_color = EXCLUDED.background_color,
        banner_url = EXCLUDED.banner_url,
        menu_style = EXCLUDED.menu_style,
        customer_display_style = EXCLUDED.customer_display_style,
        receipt_footer = EXCLUDED.receipt_footer,
        updated_at = now()
    `;

    return this.getBusinessBranding(businessSlug);
  }

  private brandingSelectFields() {
    return this.database.sql`
      bs.id,
      bs.business_id,
      b.slug AS business_slug,
      b.name AS business_name,
      bs.logo_url,
      bs.primary_color,
      bs.secondary_color,
      bs.background_color,
      bs.banner_url,
      bs.menu_style,
      bs.customer_display_style,
      bs.receipt_footer,
      bs.updated_at
    `;
  }

  private async getBusinessBySlug(slug: string) {
    const [business] = await this.database.sql<BusinessRow[]>`
      SELECT id, slug, name
      FROM businesses
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (!business) {
      throw new NotFoundException("Business not found");
    }

    return business;
  }

  private async ensureBrandingSchema() {
    await this.database.sql`
      CREATE TABLE IF NOT EXISTS branding_settings (
        id uuid PRIMARY KEY,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        logo_url text NULL,
        primary_color varchar NULL,
        secondary_color varchar NULL,
        background_color varchar NULL,
        banner_url text NULL,
        menu_style varchar NULL,
        customer_display_style varchar NULL,
        receipt_footer text NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    await this.database.sql`
      ALTER TABLE branding_settings
      ADD COLUMN IF NOT EXISTS background_color varchar NULL
    `;

    await this.database.sql`
      CREATE UNIQUE INDEX IF NOT EXISTS branding_settings_business_unique
      ON branding_settings (business_id)
    `;
  }
}

function buildDefaultBranding(business: BusinessRow): BusinessBranding {
  return {
    id: null,
    businessId: business.id,
    businessSlug: business.slug,
    businessName: business.name,
    logoUrl: null,
    primaryColor: defaultPrimaryColor,
    secondaryColor: defaultSecondaryColor,
    backgroundColor: defaultBackgroundColor,
    bannerUrl: null,
    menuStyle: defaultStyleMode,
    customerDisplayStyle: defaultStyleMode,
    receiptFooter: null,
    updatedAt: null
  };
}

function toBusinessBranding(row: BrandingRow): BusinessBranding {
  return {
    id: row.id,
    businessId: row.business_id,
    businessSlug: row.business_slug,
    businessName: row.business_name,
    logoUrl: row.logo_url,
    primaryColor: row.primary_color || defaultPrimaryColor,
    secondaryColor: row.secondary_color || defaultSecondaryColor,
    backgroundColor: row.background_color || defaultBackgroundColor,
    bannerUrl: row.banner_url,
    menuStyle: allowedStyleModes.has(row.menu_style as BrandingStyleMode)
      ? row.menu_style || defaultStyleMode
      : defaultStyleMode,
    customerDisplayStyle: allowedStyleModes.has(row.customer_display_style as BrandingStyleMode)
      ? row.customer_display_style || defaultStyleMode
      : defaultStyleMode,
    receiptFooter: row.receipt_footer,
    updatedAt: row.updated_at.toISOString()
  };
}

function normalizeOptionalText(value?: string | null) {
  const text = value?.trim();

  return text ? text : null;
}

function normalizeColor(value: string | null | undefined, fieldName: string) {
  const color = normalizeOptionalText(value) || getDefaultColor(fieldName);

  if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
    throw new BadRequestException(`${fieldName} must be a valid hex color`);
  }

  return color.toUpperCase();
}

function getDefaultColor(fieldName: string) {
  if (fieldName === "primaryColor") return defaultPrimaryColor;
  if (fieldName === "secondaryColor") return defaultSecondaryColor;

  return defaultBackgroundColor;
}

function normalizeStyleMode(value: BrandingStyleMode | null | undefined, fieldName: string) {
  if (!value) {
    return defaultStyleMode;
  }

  if (!allowedStyleModes.has(value)) {
    throw new BadRequestException(`${fieldName} is invalid`);
  }

  return value;
}
