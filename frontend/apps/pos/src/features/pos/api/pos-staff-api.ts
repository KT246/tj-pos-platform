import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/http"

export type PosStaffStatus = "active" | "inactive" | "on-leave"

export type PosStaffMember = {
  id: string
  username: string
  canLogin: boolean
  name: string
  email: string
  phone: string
  role: string
  shift: string
  shiftTime: string
  status: PosStaffStatus
  avatar?: string
  gender: string
  birthday: string
  address: string
  identityNumber: string
  joinDate: string
  note: string
  revenue: number
  orders: number
  rating: number
  createdAt: string
  updatedAt: string
}

export type PosStaffKpi = {
  id: string
  title: string
  value: string
  subtitle: string
  tone: "brown" | "green" | "amber" | "purple"
}

export type PosStaffListResponse = {
  staff: PosStaffMember[]
  kpis: PosStaffKpi[]
}

export type SavePosStaffBody = {
  name: string
  username: string
  password?: string
  confirmPassword?: string
  canLogin: boolean
  email: string
  phone: string
  role: string
  shift: string
  shiftTime: string
  status: PosStaffStatus
  gender: string
  birthday: string
  address: string
  identityNumber: string
  joinDate: string
  note: string
}

export type PosStaffFilters = {
  q?: string
  role?: string
  status?: string
}

export function listPosStaff(filters: PosStaffFilters = {}) {
  const params = new URLSearchParams()

  if (filters.q) params.set("q", filters.q)
  if (filters.role && filters.role !== "all") params.set("role", filters.role)
  if (filters.status && filters.status !== "all") params.set("status", filters.status)

  const query = params.toString()

  return apiGet<PosStaffListResponse>(`/pos/staff${query ? `?${query}` : ""}`)
}

export function createPosStaff(body: SavePosStaffBody) {
  return apiPost<PosStaffMember, SavePosStaffBody>("/pos/staff", body)
}

export function updatePosStaff(staffId: string, body: SavePosStaffBody) {
  return apiPatch<PosStaffMember, SavePosStaffBody>(`/pos/staff/${staffId}`, body)
}

export function deletePosStaff(staffId: string) {
  return apiDelete<{ id: string; deleted: true }>(`/pos/staff/${staffId}`)
}
