import type { CafeCategory } from "@/features/pos/data/cafe-categories"
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/http"

export type BusinessCategoryStatus = "active" | "inactive" | "archived"

export type BusinessCategoryDto = {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  sortOrder: number | null
  itemCount: number
  status: BusinessCategoryStatus
  createdAt: string
  updatedAt: string
}

export type BusinessCategoriesResponse = {
  categories: BusinessCategoryDto[]
}

export type SaveBusinessCategoryBody = {
  name: string
  description?: string | null
  imageUrl?: string | null
  sortOrder?: number | null
  status?: BusinessCategoryStatus
}

export function listPosCategories() {
  return apiGet<BusinessCategoriesResponse>(
    `/businesses/${getBusinessSlug()}/categories`,
  )
}

export function createPosCategory(body: SaveBusinessCategoryBody) {
  return apiPost<BusinessCategoryDto, SaveBusinessCategoryBody>(
    `/businesses/${getBusinessSlug()}/categories`,
    body,
  )
}

export function updatePosCategory(
  categoryId: string,
  body: Partial<SaveBusinessCategoryBody>,
) {
  return apiPatch<BusinessCategoryDto, Partial<SaveBusinessCategoryBody>>(
    `/businesses/${getBusinessSlug()}/categories/${categoryId}`,
    body,
  )
}

export function deletePosCategory(categoryId: string) {
  return apiDelete<{ id: string; deleted: true }>(
    `/businesses/${getBusinessSlug()}/categories/${categoryId}`,
  )
}

export function mapCategoryDtoToCafeCategory(
  category: BusinessCategoryDto,
  index: number,
): CafeCategory {
  return {
    id: category.id,
    name: category.name,
    description: category.description ?? "",
    productCount: category.itemCount,
    sortOrder:
      category.sortOrder && category.sortOrder < 900 ? category.sortOrder : index + 1,
    status: category.status === "active" ? "visible" : "hidden",
    updatedAt: formatCategoryTimestamp(category.updatedAt),
    updatedBy: "API",
    image: category.imageUrl ?? "",
  }
}

export function buildSaveCategoryBody(category: CafeCategory): SaveBusinessCategoryBody {
  return {
    name: category.name.trim(),
    description: category.description.trim() || null,
    imageUrl: category.image || null,
    sortOrder: category.sortOrder || null,
    status: category.status === "visible" ? "active" : "inactive",
  }
}

function getBusinessSlug() {
  return (
    window.localStorage.getItem("tj_pos_business_slug") ||
    import.meta.env.VITE_POS_BUSINESS_SLUG ||
    "tj-cafe-vientiane"
  )
}

function formatCategoryTimestamp(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  const hour = String(date.getHours()).padStart(2, "0")
  const minute = String(date.getMinutes()).padStart(2, "0")

  return `${day}/${month}/${year} ${hour}:${minute}`
}
