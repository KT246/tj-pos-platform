import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/http"

export type PosStaffShift = {
  id: string
  name: string
  startTime: string
  endTime: string
  color: string
  active: boolean
}

export type PosStaffSchedule = {
  id: string
  staffId: string
  shiftId: string
  workDate: string
  status: "scheduled" | "off"
  note: string
}

export type PosStaffAttendance = {
  id: string
  staffId: string
  workDate: string
  checkIn: string | null
  checkOut: string | null
  note: string
}

export type PosStaffLeave = {
  id: string
  staffId: string
  leaveType: "annual" | "sick" | "unpaid" | "other"
  startDate: string
  endDate: string
  status: "pending" | "approved" | "rejected"
  note: string
  reviewNote: string
}

export type PosStaffHrOverview = {
  shifts: PosStaffShift[]
  schedules: PosStaffSchedule[]
  attendance: PosStaffAttendance[]
  leaveRequests: PosStaffLeave[]
  summary: {
    scheduledToday: number
    checkedInToday: number
    pendingLeaveRequests: number
  }
}

export function getPosStaffHrOverview(date: string) {
  return apiGet<PosStaffHrOverview>(`/pos/staff/hr/overview?date=${encodeURIComponent(date)}`)
}

export function createPosStaffShift(body: Omit<PosStaffShift, "id">) {
  return apiPost<PosStaffShift, Omit<PosStaffShift, "id">>("/pos/staff/hr/shifts", body)
}

export function savePosStaffSchedule(body: Omit<PosStaffSchedule, "id">) {
  return apiPost<PosStaffSchedule, Omit<PosStaffSchedule, "id">>("/pos/staff/hr/schedules", body)
}

export function deletePosStaffSchedule(scheduleId: string) {
  return apiDelete<{ id: string; deleted: true }>(`/pos/staff/hr/schedules/${scheduleId}`)
}

export function savePosStaffAttendance(body: Omit<PosStaffAttendance, "id">) {
  return apiPost<PosStaffAttendance, Omit<PosStaffAttendance, "id">>("/pos/staff/hr/attendance", body)
}

export function createPosStaffLeave(body: Omit<PosStaffLeave, "id">) {
  return apiPost<PosStaffLeave, Omit<PosStaffLeave, "id">>("/pos/staff/hr/leave-requests", body)
}

export function updatePosStaffLeave(leaveId: string, body: Partial<Omit<PosStaffLeave, "id">>) {
  return apiPatch<PosStaffLeave, Partial<Omit<PosStaffLeave, "id">>>(
    `/pos/staff/hr/leave-requests/${leaveId}`,
    body,
  )
}
