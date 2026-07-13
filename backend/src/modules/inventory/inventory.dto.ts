export type StockStatus = "in-stock" | "low-stock" | "out-of-stock" | "ordering";
export type StockCategory = "ingredient" | "supply" | "product";
export type StockMovementType = "import" | "export" | "adjust";

export type CafeStockItem = {
  id: string;
  name: string;
  category: StockCategory;
  categoryLabel: string;
  sku: string;
  unit: string;
  currentStock: number;
  availableStock: number;
  minStock: number;
  orderingStock: number;
  status: StockStatus;
  costPrice: number;
  inventoryValue: number;
  supplier: string;
  lastImportAt: string;
  expiryDate: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export type StockKpi = {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  tone: "brown" | "green" | "amber" | "red" | "blue";
  helper?: string;
};

export type StockMovementPoint = {
  date: string;
  importQty: number;
  exportQty: number;
};

export type StockItemsResponse = {
  items: CafeStockItem[];
  kpis: StockKpi[];
  movement7d: StockMovementPoint[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
};

export type SaveStockItemBody = {
  name?: string;
  category?: StockCategory;
  sku?: string;
  unit?: string;
  currentStock?: number;
  minStock?: number;
  orderingStock?: number;
  costPrice?: number;
  supplier?: string;
  expiryDate?: string;
  image?: string;
};

export type StockMovementBody = {
  type: StockMovementType;
  quantity: number;
  note?: string;
};

export type DeleteStockItemResponse = {
  id: string;
  deleted: true;
};
