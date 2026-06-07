import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type BusinessMenuKey =
  | "Dashboard"
  | "POS"
  | "Orders"
  | "Items"
  | "Categories"
  | "Table Map"
  | "Modifiers"
  | "Barista Queue"
  | "Pickup Display"
  | "Happy Hour"
  | "Cafe Daily View"
  | "Inventory"
  | "Stock Movements"
  | "Stock Count"
  | "Goods Receiving"
  | "Returns"
  | "Low Stock / Expiry"
  | "Barcode Labels"
  | "Suppliers"
  | "Customers"
  | "Loyalty"
  | "Promotions"
  | "Staff"
  | "Roles & Permissions"
  | "Branches"
  | "Reports"
  | "Receipt/Bill"
  | "Branding"
  | "Payment Methods"
  | "Devices"
  | "Modules"
  | "Import/Export"
  | "Support"
  | "Audit Logs"
  | "Settings";

export type Tone = "blue" | "emerald" | "amber" | "red" | "violet" | "cyan" | "slate";

export type Kpi = {
  label: string;
  value: string;
  change?: string;
  tone: Tone;
  icon: LucideIcon;
};

export type TableColumn<T> = {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  render: (row: T, index: number) => ReactNode;
};

export type SummaryItem = {
  label: string;
  value: string;
  tone?: Tone;
};

export type QuickAction = {
  label: string;
  description?: string;
  icon: LucideIcon;
  href?: string;
  tone: Tone;
};
