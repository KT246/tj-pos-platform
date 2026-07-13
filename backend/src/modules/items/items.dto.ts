export type ItemStatus = "active" | "inactive" | "archived";
export type ItemCurrency = "LAK" | "THB";

export type ItemOptionPriceMode = "override" | "addon";

export type ItemOptionChoice = {
  id?: string;
  name: string;
  price: number;
  default?: boolean;
};

export type ItemOptionGroup = {
  id?: string;
  name: string;
  required: boolean;
  multiple: boolean;
  priceMode: ItemOptionPriceMode;
  choices: ItemOptionChoice[];
};

export type BusinessItem = {
  id: string;
  name: string;
  localName: string;
  itemType: string;
  categoryName: string;
  sellingPrice: number;
  sellingCurrency: ItemCurrency;
  costPrice: number | null;
  costCurrency: ItemCurrency;
  wholesalePrice: number | null;
  wholesaleCurrency: ItemCurrency;
  resellerPrice: number | null;
  resellerCurrency: ItemCurrency;
  minWholesaleQuantity: number | null;
  priceListName: string | null;
  brand: string | null;
  sizeVolume: string | null;
  variant: string | null;
  color: string | null;
  conditionType: string | null;
  imageUrl: string | null;
  description: string | null;
  sku: string | null;
  barcode: string | null;
  unit: string;
  currentStock: number;
  soldCount: number;
  bestSeller: boolean;
  availableForSale: boolean;
  status: ItemStatus;
  optionGroups: ItemOptionGroup[];
  createdAt: string;
  updatedAt: string;
};

export type BusinessItemsKpis = {
  totalItems: number;
  activeItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  inventoryValue: number;
};

export type CategorySummary = {
  name: string;
  count: number;
  percentage: number;
};

export type BusinessItemsResponse = {
  items: BusinessItem[];
  kpis: BusinessItemsKpis;
  categories: CategorySummary[];
  topSellingItems: BusinessItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
};

export type CreateBusinessItemBody = {
  name?: string;
  localName?: string;
  itemType?: string;
  categoryName?: string;
  sellingPrice?: number;
  sellingCurrency?: ItemCurrency;
  costPrice?: number | null;
  costCurrency?: ItemCurrency;
  wholesalePrice?: number | null;
  wholesaleCurrency?: ItemCurrency;
  resellerPrice?: number | null;
  resellerCurrency?: ItemCurrency;
  minWholesaleQuantity?: number | null;
  priceListName?: string | null;
  brand?: string | null;
  sizeVolume?: string | null;
  variant?: string | null;
  color?: string | null;
  conditionType?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  sku?: string | null;
  barcode?: string | null;
  unit?: string;
  currentStock?: number;
  bestSeller?: boolean;
  availableForSale?: boolean;
  status?: ItemStatus;
  optionGroups?: ItemOptionGroup[];
};

export type DeleteBusinessItemResponse = {
  id: string;
  deleted: true;
};
