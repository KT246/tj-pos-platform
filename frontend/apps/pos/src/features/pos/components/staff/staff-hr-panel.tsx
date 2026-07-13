import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CalendarDays, Check, Clock3, FilePlus2, Plus, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import {
  createPosStaffLeave,
  createPosStaffShift,
  deletePosStaffSchedule,
  getPosStaffHrOverview,
  savePosStaffAttendance,
  savePosStaffSchedule,
  updatePosStaffLeave,
} from "@/features/pos/api/pos-staff-hr-api"
import type { PosStaffHrOverview } from "@/features/pos/api/pos-staff-hr-api"
import type { PosStaffMember } from "@/features/pos/api/pos-staff-api"
import { showPosToast } from "@/features/pos/components/notifications/pos-toast-store"
import { cn } from "@/lib/utils"

export type StaffHrTab = "schedule" | "attendance" | "leave"

type Props = {
  tab: StaffHrTab
  staff: PosStaffMember[]
}

const emptyOverview: PosStaffHrOverview = {
  shifts: [],
  schedules: [],
  attendance: [],
  leaveRequests: [],
  summary: { scheduledToday: 0, checkedInToday: 0, pendingLeaveRequests: 0 },
}

export function StaffHrPanel({ tab, staff }: Props) {
  const queryClient = useQueryClient()
  const [date, setDate] = useState(today())
  const overviewQuery = useQuery({
    queryKey: ["pos-staff-hr", date],
    queryFn: () => getPosStaffHrOverview(date),
  })
  const overview = overviewQuery.data ?? emptyOverview
  const staffById = useMemo(() => new Map(staff.map((member) => [member.id, member])), [staff])

  function refresh() {
    return queryClient.invalidateQueries({ queryKey: ["pos-staff-hr"] })
  }

  const shiftMutation = useMutation({
    mutationFn: createPosStaffShift,
    onSuccess: async () => {
      await refresh()
      showPosToast({ type: "success", title: "ເພີ່ມກະວຽກແລ້ວ", description: "ສາມາດນຳໄປຈັດຕາຕະລາງໄດ້." })
    },
  })
  const scheduleMutation = useMutation({ mutationFn: savePosStaffSchedule, onSuccess: refresh })
  const deleteScheduleMutation = useMutation({ mutationFn: deletePosStaffSchedule, onSuccess: refresh })
  const attendanceMutation = useMutation({ mutationFn: savePosStaffAttendance, onSuccess: refresh })
  const leaveMutation = useMutation({ mutationFn: createPosStaffLeave, onSuccess: refresh })
  const reviewLeaveMutation = useMutation({
    mutationFn: ({ leaveId, status }: { leaveId: string; status: "approved" | "rejected" }) =>
      updatePosStaffLeave(leaveId, { status }),
    onSuccess: refresh,
  })

  return (
    <section className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#eadfce] bg-white">
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#eadfce] bg-[#fbf7ef] px-5 py-3">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-[#8a5425]" />
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-9 rounded-md border border-[#dfd0bd] bg-white px-3 text-sm font-bold text-[#3b2511] outline-none focus:border-[#8a5425]"
          />
        </div>
        <div className="flex items-center gap-4 text-xs font-black text-[#7c6448]">
          <span>{overview.summary.scheduledToday} ຄົນມີກະ</span>
          <span>{overview.summary.checkedInToday} ຄົນເຂົ້າວຽກ</span>
          <span>{overview.summary.pendingLeaveRequests} ຄຳຂໍລໍຖ້າ</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {overviewQuery.isLoading ? (
          <div className="flex h-full min-h-[240px] items-center justify-center text-sm font-bold text-[#8a7560]">ກຳລັງໂຫຼດ...</div>
        ) : null}
        {!overviewQuery.isLoading && tab === "schedule" ? (
          <ScheduleTab
            date={date}
            staff={staff}
            overview={overview}
            onCreateShift={(body) => shiftMutation.mutate(body)}
            onSaveSchedule={(body) => scheduleMutation.mutate(body)}
            onDeleteSchedule={(scheduleId) => deleteScheduleMutation.mutate(scheduleId)}
            saving={shiftMutation.isPending || scheduleMutation.isPending || deleteScheduleMutation.isPending}
            staffById={staffById}
          />
        ) : null}
        {!overviewQuery.isLoading && tab === "attendance" ? (
          <AttendanceTab
            date={date}
            staff={staff}
            attendance={overview.attendance}
            onSave={(body) => attendanceMutation.mutate(body)}
            saving={attendanceMutation.isPending}
          />
        ) : null}
        {!overviewQuery.isLoading && tab === "leave" ? (
          <LeaveTab
            staff={staff}
            leaves={overview.leaveRequests}
            onCreate={(body) => leaveMutation.mutate(body)}
            onReview={(leaveId, status) => reviewLeaveMutation.mutate({ leaveId, status })}
            saving={leaveMutation.isPending || reviewLeaveMutation.isPending}
            staffById={staffById}
          />
        ) : null}
      </div>
    </section>
  )
}

function ScheduleTab({
  date,
  staff,
  overview,
  onCreateShift,
  onSaveSchedule,
  onDeleteSchedule,
  saving,
  staffById,
}: {
  date: string
  staff: PosStaffMember[]
  overview: PosStaffHrOverview
  onCreateShift: (body: { name: string; startTime: string; endTime: string; color: string; active: boolean }) => void
  onSaveSchedule: (body: { staffId: string; shiftId: string; workDate: string; status: "scheduled"; note: string }) => void
  onDeleteSchedule: (scheduleId: string) => void
  saving: boolean
  staffById: Map<string, PosStaffMember>
}) {
  const [shiftName, setShiftName] = useState("")
  const [shiftStart, setShiftStart] = useState("08:00")
  const [shiftEnd, setShiftEnd] = useState("17:00")
  const [staffId, setStaffId] = useState("")
  const [shiftId, setShiftId] = useState("")

  useEffect(() => {
    if (!staffId && staff[0]) setStaffId(staff[0].id)
    if (!shiftId && overview.shifts[0]) setShiftId(overview.shifts[0].id)
  }, [overview.shifts, shiftId, staff, staffId])

  const weekSchedules = overview.schedules.filter((item) => item.status === "scheduled")

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <HrPanel title="ສ້າງກະວຽກ">
          <div className="grid grid-cols-[minmax(0,1fr)_110px_110px] gap-2">
            <HrInput value={shiftName} onChange={setShiftName} placeholder="ຊື່ກະ" />
            <HrInput type="time" value={shiftStart} onChange={setShiftStart} />
            <HrInput type="time" value={shiftEnd} onChange={setShiftEnd} />
          </div>
          <button
            type="button"
            disabled={saving || !shiftName.trim()}
            onClick={() => {
              onCreateShift({ name: shiftName.trim(), startTime: shiftStart, endTime: shiftEnd, color: "#8A5425", active: true })
              setShiftName("")
            }}
            className="mt-3 inline-flex h-9 items-center gap-2 rounded-md bg-[#5a3718] px-3 text-xs font-black text-white disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> ເພີ່ມກະ
          </button>
        </HrPanel>
        <HrPanel title="ຈັດກະໃຫ້ພະນັກງານ">
          <div className="grid grid-cols-3 gap-2">
            <HrSelect value={staffId} onChange={setStaffId} options={staff.map((member) => [member.id, member.name])} />
            <HrSelect value={shiftId} onChange={setShiftId} options={overview.shifts.map((shift) => [shift.id, `${shift.name} (${shift.startTime}-${shift.endTime})`])} />
            <HrInput type="date" value={date} onChange={() => undefined} disabled />
          </div>
          <button
            type="button"
            disabled={saving || !staffId || !shiftId}
            onClick={() => onSaveSchedule({ staffId, shiftId, workDate: date, status: "scheduled", note: "" })}
            className="mt-3 inline-flex h-9 items-center gap-2 rounded-md bg-[#5a3718] px-3 text-xs font-black text-white disabled:opacity-60"
          >
            <CalendarDays className="h-4 w-4" /> ບັນທຶກກະ
          </button>
        </HrPanel>
      </div>

      <HrPanel title="ຕາຕະລາງກະປະຈຳອາທິດ">
        <div className="divide-y divide-[#eadfce] overflow-hidden rounded-lg border border-[#eadfce]">
          {weekSchedules.length ? weekSchedules.map((schedule) => {
            const shift = overview.shifts.find((item) => item.id === schedule.shiftId)
            const member = staffById.get(schedule.staffId)
            return (
              <div key={schedule.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <p className="text-sm font-black text-[#3b2511]">{member?.name ?? "-"}</p>
                  <p className="mt-1 text-xs font-semibold text-[#8a7560]">{schedule.workDate} · {shift?.name ?? "-"} · {shift?.startTime} - {shift?.endTime}</p>
                </div>
                <button type="button" onClick={() => onDeleteSchedule(schedule.id)} className="flex h-8 w-8 items-center justify-center rounded-md text-[#bf4239] hover:bg-[#fff0ed]" aria-label="ລຶບກະ">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )
          }) : <EmptyState label="ຍັງບໍ່ມີກະໃນອາທິດນີ້" />}
        </div>
      </HrPanel>
    </div>
  )
}

function AttendanceTab({ date, staff, attendance, onSave, saving }: {
  date: string
  staff: PosStaffMember[]
  attendance: PosStaffHrOverview["attendance"]
  onSave: (body: { staffId: string; workDate: string; checkIn: string | null; checkOut: string | null; note: string }) => void
  saving: boolean
}) {
  const attendanceByStaffId = new Map(attendance.filter((item) => item.workDate === date).map((item) => [item.staffId, item]))

  return (
    <HrPanel title="ຊ່ວງເວລາເຮັດວຽກ">
      <div className="divide-y divide-[#eadfce] overflow-hidden rounded-lg border border-[#eadfce]">
        {staff.map((member) => {
          const entry = attendanceByStaffId.get(member.id)
          const nextAction = !entry?.checkIn ? "in" : !entry.checkOut ? "out" : null
          return (
            <div key={member.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm font-black text-[#3b2511]">{member.name}</p>
                <p className="mt-1 text-xs font-semibold text-[#8a7560]">ເຂົ້າ: {entry?.checkIn ?? "-"} · ອອກ: {entry?.checkOut ?? "-"}</p>
              </div>
              {nextAction ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => onSave({
                    staffId: member.id,
                    workDate: date,
                    checkIn: nextAction === "in" ? currentTime() : null,
                    checkOut: nextAction === "out" ? currentTime() : null,
                    note: entry?.note ?? "",
                  })}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-[#d8eadb] bg-[#eef9f0] px-3 text-xs font-black text-[#2f8748] disabled:opacity-60"
                >
                  <Clock3 className="h-4 w-4" /> {nextAction === "in" ? "ເຂົ້າວຽກ" : "ອອກວຽກ"}
                </button>
              ) : <span className="inline-flex h-8 items-center gap-1 text-xs font-black text-[#2f8748]"><Check className="h-4 w-4" /> ຄົບແລ້ວ</span>}
            </div>
          )
        })}
      </div>
    </HrPanel>
  )
}

function LeaveTab({ staff, leaves, onCreate, onReview, saving, staffById }: {
  staff: PosStaffMember[]
  leaves: PosStaffHrOverview["leaveRequests"]
  onCreate: (body: { staffId: string; leaveType: "annual" | "sick" | "unpaid" | "other"; startDate: string; endDate: string; status: "pending"; note: string; reviewNote: string }) => void
  onReview: (leaveId: string, status: "approved" | "rejected") => void
  saving: boolean
  staffById: Map<string, PosStaffMember>
}) {
  const [staffId, setStaffId] = useState("")
  const [leaveType, setLeaveType] = useState<"annual" | "sick" | "unpaid" | "other">("annual")
  const [startDate, setStartDate] = useState(today())
  const [endDate, setEndDate] = useState(today())
  const [note, setNote] = useState("")

  useEffect(() => {
    if (!staffId && staff[0]) setStaffId(staff[0].id)
  }, [staff, staffId])

  return (
    <div className="space-y-5">
      <HrPanel title="ສ້າງຄຳຂໍພັກ">
        <div className="grid grid-cols-[minmax(180px,1fr)_150px_140px_140px] gap-2">
          <HrSelect value={staffId} onChange={setStaffId} options={staff.map((member) => [member.id, member.name])} />
          <HrSelect value={leaveType} onChange={(value) => setLeaveType(value as typeof leaveType)} options={[["annual", "ພັກປະຈຳປີ"], ["sick", "ພັກເຈັບ"], ["unpaid", "ພັກບໍ່ໄດ້ຄ່າແຮງ"], ["other", "ອື່ນໆ"]]} />
          <HrInput type="date" value={startDate} onChange={setStartDate} />
          <HrInput type="date" value={endDate} onChange={setEndDate} />
        </div>
        <div className="mt-2 flex gap-2">
          <HrInput value={note} onChange={setNote} placeholder="ໝາຍເຫດ" />
          <button
            type="button"
            disabled={saving || !staffId}
            onClick={() => {
              onCreate({ staffId, leaveType, startDate, endDate, status: "pending", note, reviewNote: "" })
              setNote("")
            }}
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md bg-[#5a3718] px-3 text-xs font-black text-white disabled:opacity-60"
          >
            <FilePlus2 className="h-4 w-4" /> ສົ່ງຄຳຂໍ
          </button>
        </div>
      </HrPanel>

      <HrPanel title="ລາຍການພັກ">
        <div className="divide-y divide-[#eadfce] overflow-hidden rounded-lg border border-[#eadfce]">
          {leaves.length ? leaves.map((leave) => (
            <div key={leave.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm font-black text-[#3b2511]">{staffById.get(leave.staffId)?.name ?? "-"}</p>
                <p className="mt-1 text-xs font-semibold text-[#8a7560]">{leaveLabel(leave.leaveType)} · {leave.startDate} - {leave.endDate}{leave.note ? ` · ${leave.note}` : ""}</p>
              </div>
              {leave.status === "pending" ? (
                <div className="flex items-center gap-2">
                  <button type="button" disabled={saving} onClick={() => onReview(leave.id, "approved")} className="h-8 rounded-md bg-[#eef9f0] px-3 text-xs font-black text-[#2f8748]">ອະນຸມັດ</button>
                  <button type="button" disabled={saving} onClick={() => onReview(leave.id, "rejected")} className="h-8 rounded-md bg-[#fff0ed] px-3 text-xs font-black text-[#bf4239]">ປະຕິເສດ</button>
                </div>
              ) : <LeaveStatus status={leave.status} />}
            </div>
          )) : <EmptyState label="ຍັງບໍ່ມີຄຳຂໍພັກ" />}
        </div>
      </HrPanel>
    </div>
  )
}

function HrPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-lg border border-[#eadfce] bg-[#fffdf9] p-4"><h3 className="text-sm font-black text-[#3b2511]">{title}</h3><div className="mt-3">{children}</div></section>
}

function HrInput({ value, onChange, type = "text", placeholder, disabled = false }: { value: string; onChange: (value: string) => void; type?: string; placeholder?: string; disabled?: boolean }) {
  return <input type={type} value={value} placeholder={placeholder} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="h-9 min-w-0 rounded-md border border-[#dfd0bd] bg-white px-3 text-sm font-semibold text-[#3b2511] outline-none focus:border-[#8a5425] disabled:bg-[#f5efe7]" />
}

function HrSelect({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: Array<[string, string]> }) {
  return <select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 min-w-0 rounded-md border border-[#dfd0bd] bg-white px-2 text-sm font-semibold text-[#3b2511] outline-none focus:border-[#8a5425]">{options.map(([optionValue, label]) => <option key={optionValue} value={optionValue}>{label}</option>)}</select>
}

function EmptyState({ label }: { label: string }) {
  return <div className="p-8 text-center text-sm font-bold text-[#8a7560]">{label}</div>
}

function LeaveStatus({ status }: { status: "approved" | "rejected" | "pending" }) {
  return <span className={cn("inline-flex h-8 items-center rounded-md px-3 text-xs font-black", status === "approved" ? "bg-[#eef9f0] text-[#2f8748]" : status === "rejected" ? "bg-[#fff0ed] text-[#bf4239]" : "bg-[#fff2dc] text-[#a35d00]")}>{status === "approved" ? "ອະນຸມັດ" : status === "rejected" ? "ປະຕິເສດ" : "ລໍຖ້າ"}</span>
}

function leaveLabel(type: "annual" | "sick" | "unpaid" | "other") {
  return { annual: "ພັກປະຈຳປີ", sick: "ພັກເຈັບ", unpaid: "ພັກບໍ່ໄດ້ຄ່າແຮງ", other: "ອື່ນໆ" }[type]
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function currentTime() {
  return new Date().toTimeString().slice(0, 5)
}
