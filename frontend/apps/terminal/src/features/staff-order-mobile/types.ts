import type { Product } from "../pos-terminal/types";

export type StaffOrderScreen =
  | "login"
  | "tables"
  | "menu"
  | "customize"
  | "review"
  | "success"
  | "orders"
  | "profile";

export type StaffOrderLine = {
  id: string;
  productId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  milk: string;
  sugar: string;
  ice: string;
  note?: string;
};

export type StaffOrderRecord = {
  id: string;
  tableId: string;
  guests: number;
  status: "Preparing" | "Sent" | "Ready to Serve" | "Waiting Bill";
  items: number;
  total: number;
  elapsed: string;
  type: "Dine In" | "Take Away";
  lines: StaffOrderLine[];
};

export type StaffOrderProduct = Product & {
  label?: string;
};
