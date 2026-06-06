import type { LucideIcon } from "lucide-react";

export type CustomerDisplayRouteMode = "idle" | "device" | "pair";

export type CustomerDisplayScreen = "idle" | "review" | "payment" | "success" | "pair";

export type CustomerPaymentMethodId =
  | "cash"
  | "bank-transfer"
  | "qr-code"
  | "card";

export type CustomerBusinessBrand = {
  name: string;
  logo: string;
  branch: string;
  status: "Ready" | "Pairing" | "Connected";
};

export type CustomerDisplayDevice = {
  id: string;
  name: string;
  cashier: string;
  time: string;
  pairCode: string;
};

export type CustomerOrderLine = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  image: string;
};

export type CustomerOrderSummary = {
  subtotal: number;
  serviceCharge: number;
  discount: number;
  total: number;
};

export type CustomerDisplayOrder = {
  id: string;
  customer: string;
  table: string;
  lines: CustomerOrderLine[];
  summary: CustomerOrderSummary;
  paymentMethod: CustomerPaymentMethodId;
};

export type CustomerBankDetails = {
  bankName: string;
  accountName: string;
  accountNo: string;
  reference: string;
  qrImageUrl: string;
};

export type CustomerPaymentMethod = {
  id: CustomerPaymentMethodId;
  label: string;
  icon: LucideIcon;
  tone: "green" | "blue" | "violet";
};
