import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/http"

export type ComboStatus = "active" | "paused" | "stopped"

export type ComboProduct = {
  name: string
  price: number
  quantity: number
  image: string
}

export type CafeCombo = {
  id: string
  name: string
  subtitle: string
  price: number
  status: ComboStatus
  sortOrder: number
  image: string
  description: string
  products: ComboProduct[]
  createdAt: string
  updatedAt: string
}

export type ComboKpi = {
  id: string
  title: string
  value: string
  subtitle: string
  tone: "brown" | "green" | "amber" | "red"
}

export type CombosResponse = {
  combos: CafeCombo[]
  kpis: ComboKpi[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

export type SaveComboBody = {
  name?: string
  subtitle?: string
  price?: number
  status?: ComboStatus
  sortOrder?: number
  image?: string
  description?: string
  products?: ComboProduct[]
}

export type ComboFilters = {
  q?: string
  status?: ComboStatus
  page?: number
  pageSize?: number
}

export function listPosCombos(filters: ComboFilters = {}) {
  const params = new URLSearchParams()

  if (filters.q) params.set("q", filters.q)
  if (filters.status) params.set("status", filters.status)
  if (filters.page) params.set("page", String(filters.page))
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize))

  const query = params.toString()

  return apiGet<CombosResponse>(`/pos/combos${query ? `?${query}` : ""}`)
}

export function getPosCombo(comboId: string) {
  return apiGet<CafeCombo>(`/pos/combos/${comboId}`)
}

export function createPosCombo(body: SaveComboBody) {
  return apiPost<CafeCombo, SaveComboBody>("/pos/combos", body)
}

export function updatePosCombo(comboId: string, body: SaveComboBody) {
  return apiPatch<CafeCombo, SaveComboBody>(`/pos/combos/${comboId}`, body)
}

export function deletePosCombo(comboId: string) {
  return apiDelete<{ id: string; deleted: true }>(`/pos/combos/${comboId}`)
}
