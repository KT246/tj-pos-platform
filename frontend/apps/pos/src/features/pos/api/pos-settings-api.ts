import { apiGet, apiPatch, apiPost } from "@/lib/http"

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
  | "notifications"
  | "pos-accounts"

export type PosOpeningHour = {
  id: string
  day: string
  open: boolean
  start: string
  end: string
}

export type PosPaymentMethodSetting = {
  id: string
  label: string
  enabled: boolean
  note: string
}

export type PosTableSetting = {
  tableCount: number
}

export type PosCustomerSetting = {
  enabled: boolean
  codePrefix: string
  earnAmount: number
  pointValue: number
  maxRedeemRate: number
}

export type PosPrinterSetting = {
  receiptPrinter: string
  kitchenPrinter: string
  autoPrintReceipt: boolean
  autoPrintKitchen: boolean
}

export type PosTaxSetting = {
  vatRate: number
  serviceFeeRate: number
  roundingMode: "none" | "nearest-500" | "nearest-1000"
}

export type PosReceiptSetting = {
  prefix: string
  footer: string
  paperSize: "58mm" | "80mm"
  showLogo: boolean
  showTax: boolean
  showQr: boolean
  qrImageUrl: string
}

export type PosAppearanceSetting = {
  themeMode: "light" | "dark" | "system"
  accentColor: string
}

export type PosNotificationSetting = {
  stockAlerts: boolean
  orderAlerts: boolean
  dailyReportEmail: boolean
}

export type PosSettingsBusiness = {
  name: string
  type: string
  status: string
  phone: string
  email: string
  address: string
  coverImageUrl: string
  logoUrl: string
}

export type PosSettingModuleCard = {
  id: SettingSectionId
  title: string
  description: string
  status: string
  tone: "green" | "amber" | "blue" | "purple" | "cyan" | "pink" | "red" | "gray"
  actionLabel: string
}

export type PosSettingsOverview = {
  business: PosSettingsBusiness
  openingHours: PosOpeningHour[]
  tables: PosTableSetting
  customers: PosCustomerSetting
  payments: PosPaymentMethodSetting[]
  printer: PosPrinterSetting
  tax: PosTaxSetting
  receipt: PosReceiptSetting
  appearance: PosAppearanceSetting
  notifications: PosNotificationSetting
  backup: {
    lastBackupAt: string | null
  }
  modules: PosSettingModuleCard[]
  updatedAt: string
}

export function getPosSettings() {
  return apiGet<PosSettingsOverview>("/pos/settings")
}

export function updatePosBusinessSettings(body: Partial<PosSettingsBusiness>) {
  return apiPatch<PosSettingsOverview, Partial<PosSettingsBusiness>>("/pos/settings/business", body)
}

export function updatePosOpeningHours(openingHours: PosOpeningHour[]) {
  return apiPatch<PosSettingsOverview, { openingHours: PosOpeningHour[] }>(
    "/pos/settings/hours",
    { openingHours },
  )
}

export function updatePosPaymentSettings(payments: PosPaymentMethodSetting[]) {
  return apiPatch<PosSettingsOverview, { payments: PosPaymentMethodSetting[] }>(
    "/pos/settings/payments",
    { payments },
  )
}

export function updatePosTableSettings(body: Partial<PosTableSetting>) {
  return apiPatch<PosSettingsOverview, Partial<PosTableSetting>>("/pos/settings/tables", body)
}

export function updatePosCustomerSettings(body: Partial<PosCustomerSetting>) {
  return apiPatch<PosSettingsOverview, Partial<PosCustomerSetting>>("/pos/settings/customers", body)
}

export function updatePosPrinterSettings(body: Partial<PosPrinterSetting>) {
  return apiPatch<PosSettingsOverview, Partial<PosPrinterSetting>>("/pos/settings/printers", body)
}

export function updatePosTaxSettings(body: Partial<PosTaxSetting>) {
  return apiPatch<PosSettingsOverview, Partial<PosTaxSetting>>("/pos/settings/tax", body)
}

export function updatePosReceiptSettings(body: Partial<PosReceiptSetting>) {
  return apiPatch<PosSettingsOverview, Partial<PosReceiptSetting>>("/pos/settings/receipt", body)
}

export function updatePosAppearanceSettings(body: Partial<PosAppearanceSetting>) {
  return apiPatch<PosSettingsOverview, Partial<PosAppearanceSetting>>(
    "/pos/settings/appearance",
    body,
  )
}

export function updatePosNotificationSettings(body: Partial<PosNotificationSetting>) {
  return apiPatch<PosSettingsOverview, Partial<PosNotificationSetting>>(
    "/pos/settings/notifications",
    body,
  )
}

export function runPosSettingsBackup() {
  return apiPost<PosSettingsOverview, Record<string, never>>("/pos/settings/backup", {})
}
