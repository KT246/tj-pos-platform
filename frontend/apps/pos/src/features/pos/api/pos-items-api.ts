import type { CafeProductCatalogItem } from "@/features/pos/data/cafe-product-catalog"
import type { OptionGroup } from "@/features/pos/components/products/product-options"
import { getCategoryKey } from "@/features/pos/lib/category-key"
import { api, apiDelete, apiGet, apiPatch, apiPost } from "@/lib/http"

export type PosItemStatus = "active" | "inactive" | "archived"
export type PosItemCurrency = "LAK" | "THB"

export type PosItemDto = {
  id: string
  name: string
  localName: string
  itemType: string
  categoryName: string
  sellingPrice: number
  sellingCurrency: PosItemCurrency
  costPrice: number | null
  costCurrency: PosItemCurrency
  wholesalePrice: number | null
  wholesaleCurrency: PosItemCurrency
  resellerPrice: number | null
  resellerCurrency: PosItemCurrency
  minWholesaleQuantity: number | null
  priceListName: string | null
  brand: string | null
  sizeVolume: string | null
  variant: string | null
  color: string | null
  conditionType: string | null
  imageUrl: string | null
  description: string | null
  sku: string | null
  barcode: string | null
  unit: string
  currentStock?: number
  soldCount: number
  bestSeller: boolean
  availableForSale: boolean
  status: PosItemStatus
  optionGroups: OptionGroup[]
  createdAt: string
  updatedAt: string
}

export type PosItemsResponse = {
  items: PosItemDto[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

export type SavePosItemBody = {
  name: string
  localName?: string
  itemType?: string
  categoryName: string
  sellingPrice: number
  sellingCurrency?: PosItemCurrency
  costPrice?: number | null
  costCurrency?: PosItemCurrency
  imageUrl?: string | null
  description?: string | null
  sku?: string | null
  barcode?: string | null
  unit: string
  currentStock?: number
  bestSeller?: boolean
  availableForSale?: boolean
  status?: PosItemStatus
  optionGroups: OptionGroup[]
}

export function listPosItems() {
  return apiGet<PosItemsResponse>("/pos/items?page=1&pageSize=200")
}

export function createPosItem(body: SavePosItemBody) {
  return apiPost<PosItemDto, SavePosItemBody>("/pos/items", body)
}

export function updatePosItem(itemId: string, body: Partial<SavePosItemBody>) {
  return apiPatch<PosItemDto, Partial<SavePosItemBody>>(`/pos/items/${itemId}`, body)
}

export function deletePosItem(itemId: string) {
  return apiDelete<{ id: string; deleted: true }>(`/pos/items/${itemId}`)
}

export async function uploadPosItemImage(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await api.post<{
    url: string
    path: string
    originalName: string
    mimeType: string
    size: number
  }>("/files/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export function mapPosItemToCatalogItem(item: PosItemDto): CafeProductCatalogItem {
  return {
    id: item.id,
    name: item.name,
    price: item.sellingPrice,
    categoryId: getCategoryKey(item.categoryName),
    image: item.imageUrl || "/images/pos-login-hero.png",
    sku: item.sku || "",
    costPrice: item.costPrice ?? 0,
    unit: item.unit,
    description: item.description || "",
    bestSeller: item.bestSeller,
    visibleOnSales: item.availableForSale,
    availableForSale: item.availableForSale,
    status: item.status,
    serviceMode: "dine-in",
    optionGroups: item.optionGroups ?? [],
  }
}

export function buildSaveItemBody(product: {
  name: string
  sku: string
  category: string
  unit: string
  basePrice: number
  costPrice: number
  description: string
  image: string | null
  optionGroups: OptionGroup[]
  status?: PosItemStatus
  bestSeller?: boolean
  availableForSale?: boolean
}): SavePosItemBody {
  return {
    name: product.name.trim(),
    localName: product.name.trim(),
    itemType: "menu_item",
    categoryName: product.category,
    sellingPrice: product.basePrice,
    sellingCurrency: "LAK",
    costPrice: product.costPrice,
    costCurrency: "LAK",
    imageUrl: product.image,
    description: product.description,
    sku: product.sku || null,
    unit: product.unit,
    bestSeller: product.bestSeller ?? false,
    availableForSale: product.availableForSale ?? true,
    status: product.status ?? "active",
    optionGroups: product.optionGroups,
  }
}

export function normalizeCategoryId(categoryName: string) {
  const normalized = categoryName.trim().toLowerCase()

  if (normalized.includes("cà") || normalized.includes("coffee")) return "coffee"
  if (normalized.includes("trà") || normalized.includes("tea")) return "tea"
  if (normalized.includes("đá") || normalized.includes("frappe")) return "frappe"
  if (normalized.includes("nước") || normalized.includes("juice")) return "juice"
  if (normalized.includes("bánh") || normalized.includes("cake")) return "cake"

  return "other"
}
