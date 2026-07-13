export type ComboStatus = "active" | "paused" | "stopped";

export type ComboProduct = {
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type CafeCombo = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  status: ComboStatus;
  sortOrder: number;
  image: string;
  description: string;
  products: ComboProduct[];
  createdAt: string;
  updatedAt: string;
};

export type ComboKpi = {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  tone: "brown" | "green" | "amber" | "red";
};

export type CombosResponse = {
  combos: CafeCombo[];
  kpis: ComboKpi[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
};

export type SaveComboBody = {
  name?: string;
  subtitle?: string;
  price?: number;
  status?: ComboStatus;
  sortOrder?: number;
  image?: string;
  description?: string;
  products?: ComboProduct[];
};

export type DeleteComboResponse = {
  id: string;
  deleted: true;
};
