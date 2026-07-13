import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/http"

export type PromotionStatus = "active" | "paused" | "ended" | "upcoming"
export type PromotionType = "percent" | "amount" | "bogo" | "free-shipping" | "combo"
export type PromotionApplyScope = "all_order" | "category" | "product" | "combo" | "customer_group"

export type CafePromotion = {
  id: string
  name: string
  code: string
  type: PromotionType
  typeLabel: string
  value: string
  valueNote: string
  period: string
  remaining: string
  status: PromotionStatus
  image: string
  appliesTo: string
  scope: string
  condition: string
  exclusion: string
  description: string
  createdAt: string
  createdBy: string
  applyScope: PromotionApplyScope
  targetIds: string[]
  minSubtotal: number
  discountValue: number
  maxDiscountAmount: number | null
  startDate: string | null
  endDate: string | null
  startTime: string | null
  endTime: string | null
  daysOfWeek: number[]
}

export type PromotionKpi = {
  id: string
  title: string
  value: string
  subtitle: string
  tone: "green" | "amber" | "red"
}

export type BusinessPromotionsResponse = {
  promotions: CafePromotion[]
  kpis: PromotionKpi[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

export type SavePromotionBody = {
  name?: string
  code?: string
  type?: PromotionType
  typeLabel?: string
  value?: string
  valueNote?: string
  period?: string
  remaining?: string
  status?: PromotionStatus
  image?: string | null
  appliesTo?: string
  scope?: string
  condition?: string
  exclusion?: string
  description?: string
  createdBy?: string
  applyScope?: PromotionApplyScope
  targetIds?: string[]
  minSubtotal?: number
  discountValue?: number
  maxDiscountAmount?: number | null
  startDate?: string | null
  endDate?: string | null
  startTime?: string | null
  endTime?: string | null
  daysOfWeek?: number[]
}

export type PosPromotionFilters = {
  q?: string
  status?: PromotionStatus
  page?: number
  pageSize?: number
}

export function listPosPromotions(filters: PosPromotionFilters = {}) {
  const params = new URLSearchParams()

  if (filters.q) params.set("q", filters.q)
  if (filters.status) params.set("status", filters.status)
  if (filters.page) params.set("page", String(filters.page))
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize))

  const query = params.toString()

  return apiGet<BusinessPromotionsResponse>(`/pos/promotions${query ? `?${query}` : ""}`)
}

export function getPosPromotion(promotionId: string) {
  return apiGet<CafePromotion>(`/pos/promotions/${promotionId}`)
}

export function createPosPromotion(body: SavePromotionBody) {
  return apiPost<CafePromotion, SavePromotionBody>("/pos/promotions", body)
}

export function updatePosPromotion(promotionId: string, body: SavePromotionBody) {
  return apiPatch<CafePromotion, SavePromotionBody>(`/pos/promotions/${promotionId}`, body)
}

export function deletePosPromotion(promotionId: string) {
  return apiDelete<{ id: string; deleted: true }>(`/pos/promotions/${promotionId}`)
}
