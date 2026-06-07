import type { LucideIcon } from "lucide-react";

export type PosScreen =
  | "sales"
  | "new-sale"
  | "open-orders"
  | "held-orders"
  | "checkout"
  | "receipt-preview"
  | "refund";

export type Category = {
  id: string;
  label: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  wholesalePrice?: number;
  resellerPrice?: number;
  minWholesaleQuantity?: number;
  priceList?: string;
  image: string;
  badge?: string;
};

export type CartLine = {
  id: string;
  productId: string;
  name: string;
  price: number;
  retailPrice?: number;
  priceType?: "retail" | "wholesale" | "reseller";
  priceList?: string;
  minWholesaleQuantity?: number;
  quantity: number;
  image: string;
  note?: string;
};

export type OrderType = "Dine In" | "Take Away";

export type Discount = {
  mode: "percent" | "amount";
  value: number;
  reason: string;
};

export type Customer = {
  id: string;
  name: string;
  subtitle: string;
  customerType: "retail" | "wholesale" | "reseller" | "vip";
  priceList: string;
  debtBalance: number;
  creditLimit: number;
  paymentTerm: string;
  phone?: string;
  points: number;
  avatar: string;
};

export type PaymentStatus = "paid" | "partial" | "debt";

export type PaymentMethodId =
  | "cash"
  | "card"
  | "m-pos"
  | "bank-transfer"
  | "qr-code"
  | "e-wallet";

export type OpenOrder = {
  id: string;
  table: string;
  type: OrderType;
  customer: string;
  items: number;
  amount: number;
  time: string;
  status: "In Progress" | "Held" | "Completed";
  cart?: CartLine[];
  customerRecord?: Customer | null;
  discount?: Discount | null;
  paymentMethod?: PaymentMethodId;
  paymentStatus?: PaymentStatus;
  receivedAmount?: number;
  createdAt?: string;
};

export type DiningTable = {
  id: string;
  seats: number;
  area: "Indoor" | "Outdoor" | "VIP Room" | "Terrace";
  status: "Available" | "Occupied" | "Reserved";
  elapsed?: string;
};

export type QuickAction = {
  label: string;
  tone: "blue" | "orange" | "violet" | "slate";
  icon: LucideIcon;
  href?: string;
};
