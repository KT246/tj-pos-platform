import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/http"

export type PosCustomerStatus = "active" | "locked"

export type PosCafeCustomer = {
  id: string
  code: string
  name: string
  phone: string
  points: number
  status: PosCustomerStatus
  totalSpent: number
  ordersCount: number
  lastOrderAt: string
  createdAt: string
  updatedAt: string
}

export type PosCustomerKpi = {
  id: string
  title: string
  value: string
  subtitle: string
  tone: "brown" | "green" | "amber" | "purple"
}

export type PosCustomerListResponse = {
  customers: PosCafeCustomer[]
  kpis: PosCustomerKpi[]
}

export type SavePosCustomerBody = {
  name: string
  phone: string
  status: PosCustomerStatus
}

export type PosCustomerFilters = {
  q?: string
  status?: string
}

export function listPosCustomers(filters: PosCustomerFilters = {}) {
  const params = new URLSearchParams()

  if (filters.q) params.set("q", filters.q)
  if (filters.status && filters.status !== "all") params.set("status", filters.status)

  const query = params.toString()

  return apiGet<PosCustomerListResponse>(`/pos/customers${query ? `?${query}` : ""}`)
}

export function createPosCustomer(body: SavePosCustomerBody) {
  return apiPost<PosCafeCustomer, SavePosCustomerBody>("/pos/customers", body)
}

export function updatePosCustomer(customerId: string, body: SavePosCustomerBody) {
  return apiPatch<PosCafeCustomer, SavePosCustomerBody>(`/pos/customers/${customerId}`, body)
}

export function deletePosCustomer(customerId: string) {
  return apiDelete<{ id: string; deleted: true }>(`/pos/customers/${customerId}`)
}
