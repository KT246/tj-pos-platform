export type SettingSectionId =
  | "business"
  | "branches"
  | "tables"
  | "customers"
  | "payments"
  | "printers"
  | "invoices"
  | "taxes"
  | "permissions"
  | "appearance"
  | "backup"
  | "notifications";

export type PosOpeningHour = {
  id: string;
  day: string;
  open: boolean;
  start: string;
  end: string;
};

export type PosPaymentMethodSetting = {
  id: string;
  label: string;
  enabled: boolean;
  note: string;
};

export type PosPrinterSetting = {
  receiptPrinter: string;
  kitchenPrinter: string;
  autoPrintReceipt: boolean;
  autoPrintKitchen: boolean;
};

export type PosTaxSetting = {
  vatRate: number;
  serviceFeeRate: number;
  roundingMode: "none" | "nearest-500" | "nearest-1000";
};

export type PosReceiptSetting = {
  prefix: string;
  footer: string;
  paperSize: "58mm" | "80mm";
  showLogo: boolean;
  showTax: boolean;
  showQr: boolean;
  qrImageUrl: string;
};

export type PosAppearanceSetting = {
  themeMode: "light" | "dark" | "system";
  accentColor: string;
};

export type PosNotificationSetting = {
  stockAlerts: boolean;
  orderAlerts: boolean;
  dailyReportEmail: boolean;
};

export type PosTableSetting = {
  tableCount: number;
};

export type PosCustomerSetting = {
  enabled: boolean;
  codePrefix: string;
  earnAmount: number;
  pointValue: number;
  maxRedeemRate: number;
};

export type PosSettingsBusiness = {
  name: string;
  type: string;
  status: string;
  phone: string;
  email: string;
  address: string;
  coverImageUrl: string;
  logoUrl: string;
};

export type PosSettingModuleCard = {
  id: SettingSectionId;
  title: string;
  description: string;
  status: string;
  tone: "green" | "amber" | "blue" | "purple" | "cyan" | "pink" | "red" | "gray";
  actionLabel: string;
};

export type PosSettingsOverview = {
  business: PosSettingsBusiness;
  openingHours: PosOpeningHour[];
  tables: PosTableSetting;
  customers: PosCustomerSetting;
  payments: PosPaymentMethodSetting[];
  printer: PosPrinterSetting;
  tax: PosTaxSetting;
  receipt: PosReceiptSetting;
  appearance: PosAppearanceSetting;
  notifications: PosNotificationSetting;
  backup: {
    lastBackupAt: string | null;
  };
  modules: PosSettingModuleCard[];
  updatedAt: string;
};

export type UpdateBusinessSettingsBody = Partial<PosSettingsBusiness>;

export type UpdateOpeningHoursBody = {
  openingHours?: PosOpeningHour[];
};

export type UpdatePaymentsBody = {
  payments?: PosPaymentMethodSetting[];
};

export type UpdateTableBody = Partial<PosTableSetting>;

export type UpdateCustomerBody = Partial<PosCustomerSetting>;

export type UpdatePrinterBody = Partial<PosPrinterSetting>;

export type UpdateTaxBody = Partial<PosTaxSetting>;

export type UpdateReceiptBody = Partial<PosReceiptSetting>;

export type UpdateAppearanceBody = Partial<PosAppearanceSetting>;

export type UpdateNotificationBody = Partial<PosNotificationSetting>;
