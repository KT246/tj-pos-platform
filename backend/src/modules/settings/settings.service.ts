import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "crypto";

import { DatabaseService } from "../../database/database.service";
import type {
  PosAppearanceSetting,
  PosCustomerSetting,
  PosNotificationSetting,
  PosOpeningHour,
  PosPaymentMethodSetting,
  PosPrinterSetting,
  PosReceiptSetting,
  PosSettingsOverview,
  PosTableSetting,
  PosTaxSetting,
  UpdateAppearanceBody,
  UpdateBusinessSettingsBody,
  UpdateCustomerBody,
  UpdateNotificationBody,
  UpdateOpeningHoursBody,
  UpdatePaymentsBody,
  UpdatePrinterBody,
  UpdateReceiptBody,
  UpdateTableBody,
  UpdateTaxBody
} from "./settings.dto";

type BusinessRow = {
  id: string;
  slug: string;
  name: string;
  type: string;
  status: string;
};

type SettingsRow = {
  business_id: string;
  business_slug: string;
  business_name: string;
  business_type: string;
  business_status: string;
  phone: string;
  email: string;
  address: string;
  cover_image_url: string;
  logo_url: string;
  opening_hours: unknown;
  table_settings: unknown;
  customer_settings: unknown;
  payment_methods: unknown;
  printer_settings: unknown;
  vat_rate: string;
  service_fee_rate: string;
  rounding_mode: string;
  receipt_prefix: string;
  receipt_footer: string;
  receipt_paper_size: string;
  receipt_show_logo: boolean;
  receipt_show_tax: boolean;
  receipt_show_qr: boolean;
  receipt_qr_image_url: string;
  theme_mode: string;
  accent_color: string;
  notifications: unknown;
  last_backup_at: Date | null;
  updated_at: Date;
};

const defaultCoverImage =
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=640&q=80";
const defaultLogoImage =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=320&q=80";

const defaultOpeningHours: PosOpeningHour[] = [
  { id: "mon", day: "Thứ 2", open: true, start: "06:30", end: "22:30" },
  { id: "tue", day: "Thứ 3", open: true, start: "06:30", end: "22:30" },
  { id: "wed", day: "Thứ 4", open: true, start: "06:30", end: "22:30" },
  { id: "thu", day: "Thứ 5", open: true, start: "06:30", end: "22:30" },
  { id: "fri", day: "Thứ 6", open: true, start: "06:30", end: "23:00" },
  { id: "sat", day: "Thứ 7", open: true, start: "06:30", end: "23:00" },
  { id: "sun", day: "Chủ nhật", open: true, start: "06:30", end: "22:30" }
];

const defaultPayments: PosPaymentMethodSetting[] = [
  { id: "cash", label: "Tiền mặt", enabled: true, note: "Nhận tiền tại quầy" },
  { id: "bank-transfer", label: "Chuyển khoản", enabled: true, note: "Tài khoản ngân hàng của quán" },
  { id: "qr-code", label: "QR", enabled: true, note: "Quét mã thanh toán nhanh" },
  { id: "debt", label: "Ghi nợ", enabled: false, note: "Dùng cho khách quen" }
];

const defaultTables: PosTableSetting = {
  tableCount: 12
};

const defaultCustomers: PosCustomerSetting = {
  enabled: true,
  codePrefix: "CM",
  earnAmount: 10000,
  pointValue: 1000,
  maxRedeemRate: 20
};

const defaultPrinter: PosPrinterSetting = {
  receiptPrinter: "Máy in quầy thu ngân",
  kitchenPrinter: "Máy in bếp/bar",
  autoPrintReceipt: true,
  autoPrintKitchen: true
};

const defaultTax: PosTaxSetting = {
  vatRate: 10,
  serviceFeeRate: 0,
  roundingMode: "nearest-1000"
};

const defaultReceipt: PosReceiptSetting = {
  prefix: "TJ",
  footer: "Cảm ơn quý khách và hẹn gặp lại.",
  paperSize: "80mm",
  showLogo: true,
  showTax: true,
  showQr: false,
  qrImageUrl: ""
};

const defaultAppearance: PosAppearanceSetting = {
  themeMode: "light",
  accentColor: "#8A5425"
};

const defaultNotifications: PosNotificationSetting = {
  stockAlerts: true,
  orderAlerts: true,
  dailyReportEmail: false
};

const roundingModes = new Set(["none", "nearest-500", "nearest-1000"]);
const themeModes = new Set(["light", "dark", "system"]);
const receiptPaperSizes = new Set(["58mm", "80mm"]);

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(private readonly database: DatabaseService) {}

  async onModuleInit() {
    await this.ensureSettingsSchema();
  }

  async getBusinessSettings(businessSlug: string): Promise<PosSettingsOverview> {
    const business = await this.getBusinessBySlug(businessSlug);
    await this.ensureSettingsRow(business);

    return this.getSettingsOverviewByBusiness(business);
  }

  async updateBusiness(
    businessSlug: string,
    body: UpdateBusinessSettingsBody
  ): Promise<PosSettingsOverview> {
    const business = await this.getBusinessBySlug(businessSlug);
    const current = await this.getSettingsOverviewByBusiness(await this.ensureSettingsRow(business));
    const nextName = normalizeText(body.name) ?? current.business.name;
    const nextPhone = keepText(body.phone, current.business.phone);
    const nextEmail = keepText(body.email, current.business.email);
    const nextAddress = keepText(body.address, current.business.address);
    const nextCoverImageUrl = keepText(body.coverImageUrl, current.business.coverImageUrl);
    const nextLogoUrl = keepText(body.logoUrl, current.business.logoUrl);

    await this.database.sql`
      UPDATE businesses
      SET name = ${nextName},
          updated_at = now()
      WHERE id = ${business.id}
    `;

    await this.database.sql`
      UPDATE pos_business_settings
      SET phone = ${nextPhone},
          email = ${nextEmail},
          address = ${nextAddress},
          cover_image_url = ${nextCoverImageUrl},
          logo_url = ${nextLogoUrl},
          updated_at = now()
      WHERE business_id = ${business.id}
    `;

    return this.getBusinessSettings(businessSlug);
  }

  async updateOpeningHours(
    businessSlug: string,
    body: UpdateOpeningHoursBody
  ): Promise<PosSettingsOverview> {
    const business = await this.getBusinessBySlug(businessSlug);
    await this.ensureSettingsRow(business);
    const openingHours = normalizeOpeningHours(body.openingHours);

    await this.database.sql`
      UPDATE pos_business_settings
      SET opening_hours = ${JSON.stringify(openingHours)}::jsonb,
          updated_at = now()
      WHERE business_id = ${business.id}
    `;

    return this.getBusinessSettings(businessSlug);
  }

  async updatePayments(
    businessSlug: string,
    body: UpdatePaymentsBody
  ): Promise<PosSettingsOverview> {
    const business = await this.getBusinessBySlug(businessSlug);
    const payments = normalizePayments(body.payments);

    await this.ensureSettingsRow(business);
    await this.database.sql`
      UPDATE pos_business_settings
      SET payment_methods = ${JSON.stringify(payments)}::jsonb,
          updated_at = now()
      WHERE business_id = ${business.id}
    `;

    return this.getBusinessSettings(businessSlug);
  }

  async updateTables(businessSlug: string, body: UpdateTableBody): Promise<PosSettingsOverview> {
    const business = await this.getBusinessBySlug(businessSlug);
    const current = await this.getSettingsOverviewByBusiness(await this.ensureSettingsRow(business));
    const tables: PosTableSetting = {
      tableCount: keepInteger(body.tableCount, current.tables.tableCount, "tableCount", 1, 200)
    };

    await this.database.sql`
      UPDATE pos_business_settings
      SET table_settings = ${JSON.stringify(tables)}::jsonb,
          updated_at = now()
      WHERE business_id = ${business.id}
    `;

    return this.getBusinessSettings(businessSlug);
  }

  async updateCustomers(
    businessSlug: string,
    body: UpdateCustomerBody
  ): Promise<PosSettingsOverview> {
    const business = await this.getBusinessBySlug(businessSlug);
    const current = await this.getSettingsOverviewByBusiness(await this.ensureSettingsRow(business));
    const customers: PosCustomerSetting = {
      enabled: keepBoolean(body.enabled, current.customers.enabled),
      codePrefix: normalizeCustomerCodePrefix(body.codePrefix, current.customers.codePrefix),
      earnAmount: keepInteger(body.earnAmount, current.customers.earnAmount, "earnAmount", 1, 100000000),
      pointValue: keepInteger(body.pointValue, current.customers.pointValue, "pointValue", 1, 100000000),
      maxRedeemRate: keepRate(body.maxRedeemRate, current.customers.maxRedeemRate, "maxRedeemRate")
    };

    await this.database.sql`
      UPDATE pos_business_settings
      SET customer_settings = ${JSON.stringify(customers)}::jsonb,
          updated_at = now()
      WHERE business_id = ${business.id}
    `;

    return this.getBusinessSettings(businessSlug);
  }

  async updatePrinter(businessSlug: string, body: UpdatePrinterBody): Promise<PosSettingsOverview> {
    const business = await this.getBusinessBySlug(businessSlug);
    const current = await this.getSettingsOverviewByBusiness(await this.ensureSettingsRow(business));
    const printer: PosPrinterSetting = {
      receiptPrinter: keepText(body.receiptPrinter, current.printer.receiptPrinter),
      kitchenPrinter: keepText(body.kitchenPrinter, current.printer.kitchenPrinter),
      autoPrintReceipt: keepBoolean(body.autoPrintReceipt, current.printer.autoPrintReceipt),
      autoPrintKitchen: keepBoolean(body.autoPrintKitchen, current.printer.autoPrintKitchen)
    };

    await this.database.sql`
      UPDATE pos_business_settings
      SET printer_settings = ${JSON.stringify(printer)}::jsonb,
          updated_at = now()
      WHERE business_id = ${business.id}
    `;

    return this.getBusinessSettings(businessSlug);
  }

  async updateTax(businessSlug: string, body: UpdateTaxBody): Promise<PosSettingsOverview> {
    const business = await this.getBusinessBySlug(businessSlug);
    const current = await this.getSettingsOverviewByBusiness(await this.ensureSettingsRow(business));
    const tax: PosTaxSetting = {
      vatRate: keepRate(body.vatRate, current.tax.vatRate, "vatRate"),
      serviceFeeRate: keepRate(body.serviceFeeRate, current.tax.serviceFeeRate, "serviceFeeRate"),
      roundingMode: normalizeRoundingMode(body.roundingMode, current.tax.roundingMode)
    };

    await this.database.sql`
      UPDATE pos_business_settings
      SET vat_rate = ${tax.vatRate},
          service_fee_rate = ${tax.serviceFeeRate},
          rounding_mode = ${tax.roundingMode},
          updated_at = now()
      WHERE business_id = ${business.id}
    `;

    return this.getBusinessSettings(businessSlug);
  }

  async updateReceipt(
    businessSlug: string,
    body: UpdateReceiptBody
  ): Promise<PosSettingsOverview> {
    const business = await this.getBusinessBySlug(businessSlug);
    const current = await this.getSettingsOverviewByBusiness(await this.ensureSettingsRow(business));
    const receipt: PosReceiptSetting = {
      prefix: keepText(body.prefix, current.receipt.prefix),
      footer: keepText(body.footer, current.receipt.footer),
      paperSize: normalizeReceiptPaperSize(body.paperSize, current.receipt.paperSize),
      showLogo: keepBoolean(body.showLogo, current.receipt.showLogo),
      showTax: keepBoolean(body.showTax, current.receipt.showTax),
      showQr: keepBoolean(body.showQr, current.receipt.showQr),
      qrImageUrl: keepText(body.qrImageUrl, current.receipt.qrImageUrl)
    };

    await this.database.sql`
      UPDATE pos_business_settings
      SET receipt_prefix = ${receipt.prefix},
          receipt_footer = ${receipt.footer},
          receipt_paper_size = ${receipt.paperSize},
          receipt_show_logo = ${receipt.showLogo},
          receipt_show_tax = ${receipt.showTax},
          receipt_show_qr = ${receipt.showQr},
          receipt_qr_image_url = ${receipt.qrImageUrl},
          updated_at = now()
      WHERE business_id = ${business.id}
    `;

    return this.getBusinessSettings(businessSlug);
  }

  async updateAppearance(
    businessSlug: string,
    body: UpdateAppearanceBody
  ): Promise<PosSettingsOverview> {
    const business = await this.getBusinessBySlug(businessSlug);
    const current = await this.getSettingsOverviewByBusiness(await this.ensureSettingsRow(business));
    const appearance: PosAppearanceSetting = {
      themeMode: normalizeThemeMode(body.themeMode, current.appearance.themeMode),
      accentColor: normalizeColor(body.accentColor, current.appearance.accentColor)
    };

    await this.database.sql`
      UPDATE pos_business_settings
      SET theme_mode = ${appearance.themeMode},
          accent_color = ${appearance.accentColor},
          updated_at = now()
      WHERE business_id = ${business.id}
    `;

    return this.getBusinessSettings(businessSlug);
  }

  async updateNotifications(
    businessSlug: string,
    body: UpdateNotificationBody
  ): Promise<PosSettingsOverview> {
    const business = await this.getBusinessBySlug(businessSlug);
    const current = await this.getSettingsOverviewByBusiness(await this.ensureSettingsRow(business));
    const notifications: PosNotificationSetting = {
      stockAlerts: keepBoolean(body.stockAlerts, current.notifications.stockAlerts),
      orderAlerts: keepBoolean(body.orderAlerts, current.notifications.orderAlerts),
      dailyReportEmail: keepBoolean(body.dailyReportEmail, current.notifications.dailyReportEmail)
    };

    await this.database.sql`
      UPDATE pos_business_settings
      SET notifications = ${JSON.stringify(notifications)}::jsonb,
          updated_at = now()
      WHERE business_id = ${business.id}
    `;

    return this.getBusinessSettings(businessSlug);
  }

  async runBackup(businessSlug: string): Promise<PosSettingsOverview> {
    const business = await this.getBusinessBySlug(businessSlug);

    await this.ensureSettingsRow(business);
    await this.database.sql`
      UPDATE pos_business_settings
      SET last_backup_at = now(),
          updated_at = now()
      WHERE business_id = ${business.id}
    `;

    return this.getBusinessSettings(businessSlug);
  }

  private async getSettingsOverviewByBusiness(business: BusinessRow): Promise<PosSettingsOverview> {
    const [row] = await this.database.sql<SettingsRow[]>`
      SELECT
        ps.business_id,
        b.slug AS business_slug,
        b.name AS business_name,
        b.type AS business_type,
        b.status AS business_status,
        ps.phone,
        ps.email,
        ps.address,
        ps.cover_image_url,
        ps.logo_url,
        ps.opening_hours,
        ps.table_settings,
        ps.customer_settings,
        ps.payment_methods,
        ps.printer_settings,
        ps.vat_rate::text,
        ps.service_fee_rate::text,
        ps.rounding_mode,
        ps.receipt_prefix,
        ps.receipt_footer,
        ps.receipt_paper_size,
        ps.receipt_show_logo,
        ps.receipt_show_tax,
        ps.receipt_show_qr,
        ps.receipt_qr_image_url,
        ps.theme_mode,
        ps.accent_color,
        ps.notifications,
        ps.last_backup_at,
        ps.updated_at
      FROM pos_business_settings ps
      JOIN businesses b ON b.id = ps.business_id
      WHERE ps.business_id = ${business.id}
      LIMIT 1
    `;

    if (!row) {
      throw new NotFoundException("Business settings not found");
    }

    return toOverview(row);
  }

  private async getBusinessBySlug(slug: string): Promise<BusinessRow> {
    const [business] = await this.database.sql<BusinessRow[]>`
      SELECT id, slug, name, type, status
      FROM businesses
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (!business) {
      throw new NotFoundException("Business not found");
    }

    return business;
  }

  private async ensureSettingsRow(business: BusinessRow): Promise<BusinessRow> {
    await this.database.sql`
      INSERT INTO pos_business_settings (
        id,
        business_id,
        phone,
        email,
        address,
        cover_image_url,
        logo_url,
        opening_hours,
        table_settings,
        customer_settings,
        payment_methods,
        printer_settings,
        vat_rate,
        service_fee_rate,
        rounding_mode,
        receipt_prefix,
        receipt_footer,
        receipt_paper_size,
        receipt_show_logo,
        receipt_show_tax,
        receipt_show_qr,
        receipt_qr_image_url,
        theme_mode,
        accent_color,
        notifications
      )
      VALUES (
        ${randomUUID()},
        ${business.id},
        '020 9999 8888',
        'owner@tjcafe.la',
        'Vientiane, Lào',
        ${defaultCoverImage},
        ${defaultLogoImage},
        ${JSON.stringify(defaultOpeningHours)}::jsonb,
        ${JSON.stringify(defaultTables)}::jsonb,
        ${JSON.stringify(defaultCustomers)}::jsonb,
        ${JSON.stringify(defaultPayments)}::jsonb,
        ${JSON.stringify(defaultPrinter)}::jsonb,
        ${defaultTax.vatRate},
        ${defaultTax.serviceFeeRate},
        ${defaultTax.roundingMode},
        ${defaultReceipt.prefix},
        ${defaultReceipt.footer},
        ${defaultReceipt.paperSize},
        ${defaultReceipt.showLogo},
        ${defaultReceipt.showTax},
        ${defaultReceipt.showQr},
        ${defaultReceipt.qrImageUrl},
        ${defaultAppearance.themeMode},
        ${defaultAppearance.accentColor},
        ${JSON.stringify(defaultNotifications)}::jsonb
      )
      ON CONFLICT (business_id) DO NOTHING
    `;

    return business;
  }

  private async ensureSettingsSchema() {
    await this.database.sql`
      CREATE TABLE IF NOT EXISTS pos_business_settings (
        id uuid PRIMARY KEY,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        phone varchar NOT NULL DEFAULT '',
        email varchar NOT NULL DEFAULT '',
        address text NOT NULL DEFAULT '',
        cover_image_url text NOT NULL DEFAULT '',
        logo_url text NOT NULL DEFAULT '',
        opening_hours jsonb NOT NULL DEFAULT '[]'::jsonb,
        table_settings jsonb NOT NULL DEFAULT '{}'::jsonb,
        customer_settings jsonb NOT NULL DEFAULT '{}'::jsonb,
        payment_methods jsonb NOT NULL DEFAULT '[]'::jsonb,
        printer_settings jsonb NOT NULL DEFAULT '{}'::jsonb,
        vat_rate numeric(6, 2) NOT NULL DEFAULT 0,
        service_fee_rate numeric(6, 2) NOT NULL DEFAULT 0,
        rounding_mode varchar NOT NULL DEFAULT 'none',
        receipt_prefix varchar NOT NULL DEFAULT '',
        receipt_footer text NOT NULL DEFAULT '',
        receipt_paper_size varchar NOT NULL DEFAULT '80mm',
        receipt_show_logo boolean NOT NULL DEFAULT true,
        receipt_show_tax boolean NOT NULL DEFAULT true,
        receipt_show_qr boolean NOT NULL DEFAULT false,
        receipt_qr_image_url text NOT NULL DEFAULT '',
        theme_mode varchar NOT NULL DEFAULT 'light',
        accent_color varchar NOT NULL DEFAULT '#8A5425',
        notifications jsonb NOT NULL DEFAULT '{}'::jsonb,
        last_backup_at timestamptz NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    await this.database.sql`
      CREATE UNIQUE INDEX IF NOT EXISTS pos_business_settings_business_unique
      ON pos_business_settings (business_id)
    `;

    await this.database.sql`
      ALTER TABLE pos_business_settings
      ADD COLUMN IF NOT EXISTS opening_hours jsonb NOT NULL DEFAULT '[]'::jsonb
    `;

    await this.database.sql`
      ALTER TABLE pos_business_settings
      ADD COLUMN IF NOT EXISTS table_settings jsonb NOT NULL DEFAULT '{}'::jsonb
    `;

    await this.database.sql`
      ALTER TABLE pos_business_settings
      ADD COLUMN IF NOT EXISTS customer_settings jsonb NOT NULL DEFAULT '{}'::jsonb
    `;

    await this.database.sql`
      ALTER TABLE pos_business_settings
      ADD COLUMN IF NOT EXISTS receipt_show_qr boolean NOT NULL DEFAULT false
    `;

    await this.database.sql`
      ALTER TABLE pos_business_settings
      ADD COLUMN IF NOT EXISTS receipt_qr_image_url text NOT NULL DEFAULT ''
    `;

    await this.database.sql`
      ALTER TABLE pos_business_settings
      ADD COLUMN IF NOT EXISTS receipt_paper_size varchar NOT NULL DEFAULT '80mm'
    `;
  }
}

function toOverview(row: SettingsRow): PosSettingsOverview {
  const openingHours = normalizeOpeningHours(readArray(row.opening_hours, defaultOpeningHours));
  const tables = normalizeTables(row.table_settings);
  const customers = normalizeCustomers(row.customer_settings);
  const payments = normalizePayments(readArray(row.payment_methods, defaultPayments));
  const printer = normalizePrinter(row.printer_settings);
  const tax: PosTaxSetting = {
    vatRate: Number(row.vat_rate),
    serviceFeeRate: Number(row.service_fee_rate),
    roundingMode: normalizeRoundingMode(row.rounding_mode, defaultTax.roundingMode)
  };
  const receipt: PosReceiptSetting = {
    prefix: row.receipt_prefix || defaultReceipt.prefix,
    footer: row.receipt_footer || defaultReceipt.footer,
    paperSize: normalizeReceiptPaperSize(row.receipt_paper_size, defaultReceipt.paperSize),
    showLogo: Boolean(row.receipt_show_logo),
    showTax: Boolean(row.receipt_show_tax),
    showQr: Boolean(row.receipt_show_qr),
    qrImageUrl: row.receipt_qr_image_url || defaultReceipt.qrImageUrl
  };
  const appearance: PosAppearanceSetting = {
    themeMode: normalizeThemeMode(row.theme_mode, defaultAppearance.themeMode),
    accentColor: normalizeColor(row.accent_color, defaultAppearance.accentColor)
  };
  const notifications = normalizeNotifications(row.notifications);

  return {
    business: {
      name: row.business_name,
      type: row.business_type,
      status: row.business_status,
      phone: row.phone,
      email: row.email,
      address: row.address,
      coverImageUrl: row.cover_image_url || defaultCoverImage,
      logoUrl: row.logo_url || defaultLogoImage
    },
    openingHours,
    tables,
    customers,
    payments,
    printer,
    tax,
    receipt,
    appearance,
    notifications,
    backup: {
      lastBackupAt: row.last_backup_at?.toISOString() ?? null
    },
    modules: buildModuleCards({ tables, customers, payments, printer, tax, receipt, appearance, notifications, lastBackupAt: row.last_backup_at }),
    updatedAt: row.updated_at.toISOString()
  };
}

function buildModuleCards(input: {
  tables: PosTableSetting;
  customers: PosCustomerSetting;
  payments: PosPaymentMethodSetting[];
  printer: PosPrinterSetting;
  tax: PosTaxSetting;
  receipt: PosReceiptSetting;
  appearance: PosAppearanceSetting;
  notifications: PosNotificationSetting;
  lastBackupAt: Date | null;
}) {
  const enabledPayments = input.payments.filter((payment) => payment.enabled).length;

  return [
    {
      id: "branches" as const,
      title: "Chi nhánh",
      description: "Thông tin chi nhánh chính của quán",
      status: "1 chi nhánh đang hoạt động",
      tone: "green" as const,
      actionLabel: "Xem"
    },
    {
      id: "tables" as const,
      title: "Bàn",
      description: "Số bàn dùng trong màn hình bán hàng",
      status: `${input.tables.tableCount} bàn`,
      tone: "cyan" as const,
      actionLabel: "Cấu hình"
    },
    {
      id: "customers" as const,
      title: "ລູກຄ້າ",
      description: "ກຳນົດການສະສົມ ແລະ ໃຊ້ຄະແນນ",
      status: `1 ຄະແນນ / ${formatMoney(input.customers.earnAmount)}`,
      tone: "pink" as const,
      actionLabel: "ຕັ້ງຄ່າ"
    },
    {
      id: "payments" as const,
      title: "Thanh toán",
      description: "Phương thức thanh toán đang nhận tại POS",
      status: `${enabledPayments}/${input.payments.length} phương thức đang bật`,
      tone: "amber" as const,
      actionLabel: "Cấu hình"
    },
    {
      id: "printers" as const,
      title: "Máy in",
      description: "Máy in hóa đơn và bếp/bar",
      status: input.printer.autoPrintReceipt || input.printer.autoPrintKitchen ? "Đang tự động in" : "In thủ công",
      tone: "purple" as const,
      actionLabel: "Cấu hình"
    },
    {
      id: "invoices" as const,
      title: "Hóa đơn",
      description: "Tiền tố mã hóa đơn và nội dung cuối bill",
      status: `Tiền tố ${input.receipt.prefix || "POS"}`,
      tone: "blue" as const,
      actionLabel: "Cấu hình"
    },
    {
      id: "taxes" as const,
      title: "Thuế / Phí",
      description: "VAT, phí dịch vụ và làm tròn tiền",
      status: `VAT ${input.tax.vatRate}%`,
      tone: "red" as const,
      actionLabel: "Cấu hình"
    },
    {
      id: "permissions" as const,
      title: "Phân quyền",
      description: "Vai trò và quyền thao tác của nhân viên",
      status: "Theo trang nhân viên",
      tone: "amber" as const,
      actionLabel: "Xem"
    },
    {
      id: "appearance" as const,
      title: "Giao diện",
      description: "Chế độ màu và màu nhấn",
      status: input.appearance.themeMode === "dark" ? "Chế độ tối" : "Chế độ sáng",
      tone: "cyan" as const,
      actionLabel: "Cấu hình"
    },
    {
      id: "backup" as const,
      title: "Sao lưu dữ liệu",
      description: "Ghi nhận thời điểm sao lưu gần nhất",
      status: input.lastBackupAt ? `Gần nhất ${formatDate(input.lastBackupAt)}` : "Chưa sao lưu",
      tone: "blue" as const,
      actionLabel: "Sao lưu"
    },
    {
      id: "notifications" as const,
      title: "Thông báo",
      description: "Cảnh báo tồn kho, đơn mới và báo cáo ngày",
      status: input.notifications.stockAlerts || input.notifications.orderAlerts ? "Đang bật" : "Đang tắt",
      tone: "purple" as const,
      actionLabel: "Cấu hình"
    }
  ];
}

function normalizeTables(value: unknown): PosTableSetting {
  const parsedValue = parseJsonValue(value);
  const tables = isRecord(parsedValue) ? parsedValue : {};

  return {
    tableCount: keepInteger(tables.tableCount, defaultTables.tableCount, "tableCount", 1, 200)
  };
}

function normalizeCustomers(value: unknown): PosCustomerSetting {
  const parsedValue = parseJsonValue(value);
  const customers = isRecord(parsedValue) ? parsedValue : {};

  return {
    enabled: keepBoolean(customers.enabled, defaultCustomers.enabled),
    codePrefix: normalizeCustomerCodePrefix(customers.codePrefix, defaultCustomers.codePrefix),
    earnAmount: keepInteger(customers.earnAmount, defaultCustomers.earnAmount, "earnAmount", 1, 100000000),
    pointValue: keepInteger(customers.pointValue, defaultCustomers.pointValue, "pointValue", 1, 100000000),
    maxRedeemRate: keepRate(customers.maxRedeemRate, defaultCustomers.maxRedeemRate, "maxRedeemRate")
  };
}

function normalizeOpeningHours(value?: PosOpeningHour[]) {
  const source = Array.isArray(value) && value.length ? value : defaultOpeningHours;

  return source.map((hour, index) => ({
    id: normalizeText(hour.id) ?? defaultOpeningHours[index]?.id ?? `day-${index + 1}`,
    day: normalizeText(hour.day) ?? defaultOpeningHours[index]?.day ?? `Ngày ${index + 1}`,
    open: normalizeBoolean(hour.open, defaultOpeningHours[index]?.open ?? true),
    start: normalizeTime(hour.start, defaultOpeningHours[index]?.start ?? "06:30"),
    end: normalizeTime(hour.end, defaultOpeningHours[index]?.end ?? "22:30")
  }));
}

function normalizePayments(value?: PosPaymentMethodSetting[]) {
  const source = Array.isArray(value) && value.length ? value : defaultPayments;

  return source.map((payment, index) => ({
    id: normalizeText(payment.id) ?? defaultPayments[index]?.id ?? `payment-${index + 1}`,
    label: normalizeText(payment.label) ?? defaultPayments[index]?.label ?? `Thanh toán ${index + 1}`,
    enabled: Boolean(payment.enabled),
    note: normalizeText(payment.note) ?? ""
  }));
}

function normalizePrinter(value: unknown): PosPrinterSetting {
  const parsedValue = parseJsonValue(value);
  const printer = isRecord(parsedValue) ? parsedValue : {};

  return {
    receiptPrinter: normalizeText(printer.receiptPrinter) ?? defaultPrinter.receiptPrinter,
    kitchenPrinter: normalizeText(printer.kitchenPrinter) ?? defaultPrinter.kitchenPrinter,
    autoPrintReceipt: keepBoolean(printer.autoPrintReceipt, defaultPrinter.autoPrintReceipt),
    autoPrintKitchen: keepBoolean(printer.autoPrintKitchen, defaultPrinter.autoPrintKitchen)
  };
}

function normalizeReceiptPaperSize(value: unknown, current: PosReceiptSetting["paperSize"]) {
  if (typeof value !== "string") return current;

  return receiptPaperSizes.has(value) ? value as PosReceiptSetting["paperSize"] : current;
}

function normalizeNotifications(value: unknown): PosNotificationSetting {
  const parsedValue = parseJsonValue(value);
  const notifications = isRecord(parsedValue) ? parsedValue : {};

  return {
    stockAlerts: keepBoolean(notifications.stockAlerts, defaultNotifications.stockAlerts),
    orderAlerts: keepBoolean(notifications.orderAlerts, defaultNotifications.orderAlerts),
    dailyReportEmail: keepBoolean(notifications.dailyReportEmail, defaultNotifications.dailyReportEmail)
  };
}

function readArray<T>(value: unknown, fallback: T[]) {
  const parsedValue = parseJsonValue(value);

  return Array.isArray(parsedValue) ? parsedValue as T[] : fallback;
}

function parseJsonValue(value: unknown) {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function normalizeText(value: unknown) {
  if (typeof value !== "string") return undefined;
  const text = value.trim();

  return text || undefined;
}

function keepText(value: unknown, current: string) {
  return typeof value === "string" ? value.trim() : current;
}

function keepBoolean(value: unknown, current: boolean) {
  return typeof value === "boolean" ? value : current;
}

function normalizeBoolean(value: unknown, current: boolean) {
  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    const text = value.trim().toLowerCase();

    if (["true", "1", "yes", "on"].includes(text)) return true;
    if (["false", "0", "no", "off"].includes(text)) return false;
  }

  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }

  return current;
}

function keepRate(value: unknown, current: number, fieldName: string) {
  if (value === undefined || value === null || value === "") return current;
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 0 || numberValue > 100) {
    throw new BadRequestException(`${fieldName} must be between 0 and 100`);
  }

  return numberValue;
}

function keepInteger(
  value: unknown,
  current: number,
  fieldName: string,
  min: number,
  max: number
) {
  if (value === undefined || value === null || value === "") return current;
  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue < min || numberValue > max) {
    throw new BadRequestException(`${fieldName} must be an integer between ${min} and ${max}`);
  }

  return numberValue;
}

function normalizeRoundingMode(value: unknown, current: PosTaxSetting["roundingMode"]) {
  return typeof value === "string" && roundingModes.has(value)
    ? value as PosTaxSetting["roundingMode"]
    : current;
}

function normalizeThemeMode(value: unknown, current: PosAppearanceSetting["themeMode"]) {
  return typeof value === "string" && themeModes.has(value)
    ? value as PosAppearanceSetting["themeMode"]
    : current;
}

function normalizeColor(value: unknown, current: string) {
  const color = normalizeText(value);

  if (!color) return current;

  if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
    throw new BadRequestException("accentColor must be a valid hex color");
  }

  return color.toUpperCase();
}

function normalizeCustomerCodePrefix(value: unknown, current: string) {
  const text = normalizeText(value);

  if (!text) return current;

  const prefix = text.toUpperCase();

  if (!/^[A-Z0-9]{1,6}$/.test(prefix)) {
    throw new BadRequestException("codePrefix must contain 1 to 6 letters or numbers");
  }

  return prefix;
}

function normalizeTime(value: unknown, fallback: string) {
  const time = normalizeText(value);

  return time && /^([01]\d|2[0-3]):[0-5]\d$/.test(time) ? time : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function formatDate(value: Date) {
  return value.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("lo-LA").format(value);
}
