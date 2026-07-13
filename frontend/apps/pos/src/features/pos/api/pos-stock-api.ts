import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/http"

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock" | "ordering"
export type StockCategory = "ingredient" | "supply" | "product"
export type StockMovementType = "import" | "export" | "adjust"

export type CafeStockItem = {
  id: string
  name: string
  category: StockCategory
  categoryLabel: string
  sku: string
  unit: string
  currentStock: number
  availableStock: number
  minStock: number
  orderingStock: number
  status: StockStatus
  costPrice: number
  inventoryValue: number
  supplier: string
  lastImportAt: string
  expiryDate: string
  image: string
  createdAt: string
  updatedAt: string
}

export type StockKpi = {
  id: string
  title: string
  value: string
  subtitle: string
  tone: "brown" | "green" | "amber" | "red" | "blue"
  helper?: string
}

export type StockMovementPoint = {
  date: string
  importQty: number
  exportQty: number
}

export type StockItemsResponse = {
  items: CafeStockItem[]
  kpis: StockKpi[]
  movement7d: StockMovementPoint[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

export type SaveStockItemBody = {
  name?: string
  category?: StockCategory
  sku?: string
  unit?: string
  currentStock?: number
  minStock?: number
  orderingStock?: number
  costPrice?: number
  supplier?: string
  expiryDate?: string
  image?: string
}

export type StockMovementBody = {
  type: StockMovementType
  quantity: number
  note?: string
}

export type StockFilters = {
  q?: string
  category?: StockCategory
  status?: StockStatus
  page?: number
  pageSize?: number
}

export function listPosStockItems(filters: StockFilters = {}) {
  const params = new URLSearchParams()

  if (filters.q) params.set("q", filters.q)
  if (filters.category) params.set("category", filters.category)
  if (filters.status) params.set("status", filters.status)
  if (filters.page) params.set("page", String(filters.page))
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize))

  const query = params.toString()

  return apiGet<StockItemsResponse>(`/pos/stock${query ? `?${query}` : ""}`)
}

export function getPosStockItem(itemId: string) {
  return apiGet<CafeStockItem>(`/pos/stock/${itemId}`)
}

export function createPosStockItem(body: SaveStockItemBody) {
  return apiPost<CafeStockItem, SaveStockItemBody>("/pos/stock", body)
}

export function updatePosStockItem(itemId: string, body: SaveStockItemBody) {
  return apiPatch<CafeStockItem, SaveStockItemBody>(`/pos/stock/${itemId}`, body)
}

export function createPosStockMovement(itemId: string, body: StockMovementBody) {
  return apiPost<CafeStockItem, StockMovementBody>(`/pos/stock/${itemId}/movements`, body)
}

export function deletePosStockItem(itemId: string) {
  return apiDelete<{ id: string; deleted: true }>(`/pos/stock/${itemId}`)
}
