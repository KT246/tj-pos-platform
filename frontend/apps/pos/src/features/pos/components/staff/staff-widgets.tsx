import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  UserRound,
  Users,
  UserX,
} from "lucide-react"
import type { ComponentType, ReactNode } from "react"

import type {
  PosStaffKpi,
  PosStaffMember,
  PosStaffStatus,
} from "@/features/pos/api/pos-staff-api"
import { cn } from "@/lib/utils"

const kpiIcons: Record<PosStaffKpi["tone"], ComponentType<{ className?: string }>> = {
  brown: Users,
  green: CheckCircle2,
  amber: UserX,
  purple: UserRound,
}

const kpiToneClasses: Record<PosStaffKpi["tone"], string> = {
  brown: "bg-[#fff2df] text-[#5a3718]",
  green: "bg-[#e9f8e6] text-[#2d8a33]",
  amber: "bg-[#fff2dc] text-[#e69b19]",
  purple: "bg-[#f1eafb] text-[#7256bc]",
}

const kpiLabels: Record<string, { title: string; subtitle: string }> = {
  total: { title: "ພະນັກງານທັງໝົດ", subtitle: "ຄົນ" },
  active: { title: "ກຳລັງເຮັດວຽກ", subtitle: "ຄົນ" },
  inactive: { title: "ອອກວຽກ", subtitle: "ຄົນ" },
  leave: { title: "ພັກຊົ່ວຄາວ", subtitle: "ຄົນ" },
}

const staffRoleLabels: Record<string, string> = {
  "Chủ quán": "ເຈົ້າຂອງຮ້ານ",
  "Quản lý": "ຜູ້ຈັດການ",
  "Thu ngân": "ພະນັກງານເກັບເງິນ",
  "Pha chế": "ພະນັກງານຊົງເຄື່ອງດື່ມ",
  "Phục vụ": "ພະນັກງານບໍລິການ",
  "Nhân viên chung": "ພະນັກງານທົ່ວໄປ",
  Kho: "ຄັງສິນຄ້າ",
}

const staffShiftLabels: Record<string, string> = {
  "Ca sáng": "ກະເຊົ້າ",
  "Ca chiều": "ກະບ່າຍ",
  "Ca tối": "ກະກາງຄືນ",
  "Linh hoạt": "ຍືດຫຍຸ່ນ",
}

export function StaffKpiCard({ kpi }: { kpi: PosStaffKpi }) {
  const Icon = kpiIcons[kpi.tone]
  const labels = kpiLabels[kpi.id]

  return (
    <article className="rounded-xl border border-[#eadfce] bg-white p-4 shadow-[0_12px_28px_rgba(80,54,27,0.06)]">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
            kpiToneClasses[kpi.tone],
          )}
        >
          <Icon className="h-8 w-8" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[#5f4a35]">{labels?.title ?? kpi.title}</div>
          <div className="mt-1 text-[28px] font-black leading-8 text-[#111]">
            {kpi.value}
          </div>
          <div className="mt-1 text-sm font-semibold text-[#5f4a35]">{labels?.subtitle ?? kpi.subtitle}</div>
        </div>
      </div>
    </article>
  )
}

export function StaffFilters({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
}: {
  search: string
  onSearchChange: (value: string) => void
  role: string
  onRoleChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
}) {
  return (
    <div className="mt-5 flex h-11 shrink-0 items-center gap-3">
      <label className="relative w-[300px]">
        <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a8064]" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-11 w-full rounded-lg border border-[#eadfce] bg-white pl-11 pr-4 text-sm font-semibold text-[#3b2511] outline-none transition placeholder:text-[#b8aa9a] focus:border-[#b98b56] focus:ring-4 focus:ring-[#f4dec2]"
          placeholder="ຄົ້ນຫາຊື່, ເບີໂທ, email..."
        />
      </label>
      <SelectFilter
        value={role}
        onChange={onRoleChange}
        options={[
          ["all", "ທຸກຕຳແໜ່ງ"],
          ["Chủ quán", "ເຈົ້າຂອງຮ້ານ"],
          ["Quản lý", "ຜູ້ຈັດການ"],
          ["Thu ngân", "ພະນັກງານເກັບເງິນ"],
          ["Pha chế", "ພະນັກງານຊົງເຄື່ອງດື່ມ"],
          ["Phục vụ", "ພະນັກງານບໍລິການ"],
          ["Nhân viên chung", "ພະນັກງານທົ່ວໄປ"],
          ["Kho", "ຄັງສິນຄ້າ"],
        ]}
      />
      <SelectFilter
        value={status}
        onChange={onStatusChange}
        options={[
          ["all", "ທຸກສະຖານະ"],
          ["active", "ກຳລັງເຮັດວຽກ"],
          ["on-leave", "ພັກຊົ່ວຄາວ"],
          ["inactive", "ອອກວຽກ"],
        ]}
      />
    </div>
  )
}

export function StaffTable({
  staff,
  selectedStaffId,
  totalStaff,
  page,
  pageSize,
  totalPages,
  onSelectStaff,
  onEditStaff,
  onDeleteStaff,
  onPageChange,
  onPageSizeChange,
}: {
  staff: PosStaffMember[]
  selectedStaffId: string
  totalStaff: number
  page: number
  pageSize: number
  totalPages: number
  onSelectStaff: (staffId: string) => void
  onEditStaff: (staffId: string) => void
  onDeleteStaff: (staffId: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}) {
  const firstItem = totalStaff ? (page - 1) * pageSize + 1 : 0
  const lastItem = totalStaff ? Math.min(page * pageSize, totalStaff) : 0
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).slice(
    Math.max(0, page - 3),
    Math.max(0, page - 3) + 5,
  )

  return (
    <section className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#eadfce] bg-white">
      <div className="grid h-12 shrink-0 grid-cols-[56px_minmax(250px,1fr)_120px_130px_140px_145px_100px] items-center border-b border-[#eadfce] bg-[#fbf7ef] px-4 text-sm font-black text-[#3b2511]">
        <span>#</span>
        <span>ພະນັກງານ</span>
        <span>ບົດບາດ</span>
        <span>ເບີໂທ</span>
        <span>ກະເຮັດວຽກ</span>
        <span>ສະຖານະ</span>
        <span>ຈັດການ</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {staff.length ? staff.map((member, index) => {
          const selected = member.id === selectedStaffId

          return (
            <div
              key={member.id}
              onClick={() => onSelectStaff(member.id)}
              className={cn(
                "grid min-h-[72px] cursor-pointer grid-cols-[56px_minmax(250px,1fr)_120px_130px_140px_145px_100px] items-center border-b border-[#eadfce] px-4 text-sm transition last:border-b-0",
                selected ? "bg-[#fff8ee]" : "bg-white hover:bg-[#fbf7ef]",
              )}
            >
              <span className="font-black text-[#8a7560]">
                {(page - 1) * pageSize + index + 1}
              </span>
              <div className="flex min-w-0 items-center">
                <div className="min-w-0">
                  <div className="truncate font-black text-[#3b2511]">{member.name}</div>
                  <div className="mt-1 truncate text-xs font-semibold text-[#8a7560]">
                    {[member.email, member.phone].filter(Boolean).join(" · ")}
                  </div>
                </div>
              </div>
              <span>
                <RoleBadge role={member.role} />
              </span>
              <span className="font-semibold text-[#3b2511]">{member.phone}</span>
              <span>
                <span className="block font-black text-[#3b2511]">{localizeStaffShift(member.shift)}</span>
                <span className="mt-1 block text-xs font-semibold text-[#5f4a35]">
                  {member.shiftTime}
                </span>
              </span>
              <span>
                <StaffStatusBadge status={member.status} />
              </span>
              <span className="flex items-center gap-2">
                <IconButton
                  ariaLabel={`ແກ້ໄຂ ${member.name}`}
                  icon={Edit3}
                  onClick={() => onEditStaff(member.id)}
                />
                <IconButton
                  ariaLabel={`ລຶບ ${member.name}`}
                  icon={Trash2}
                  danger
                  onClick={() => onDeleteStaff(member.id)}
                />
              </span>
            </div>
          )
        }) : (
          <div className="flex h-full min-h-[220px] items-center justify-center text-sm font-bold text-[#8a7560]">
            ບໍ່ມີພະນັກງານທີ່ກົງກັບຕົວກອງ.
          </div>
        )}
      </div>

      <div className="flex h-14 shrink-0 items-center justify-between border-t border-[#eadfce] px-4 text-sm font-bold text-[#5f4a35]">
        <span>ສະແດງ {firstItem} - {lastItem} ຈາກ {totalStaff} ພະນັກງານ</span>
        <div className="flex items-center gap-2">
          <PageButton disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </PageButton>
          {pages.map((pageNumber) => (
            <PageButton
              key={pageNumber}
              active={pageNumber === page}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </PageButton>
          ))}
          <PageButton
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </PageButton>
          <label className="ml-2 flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-[#eadfce] bg-white px-3 transition hover:bg-[#fbf4ea]">
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="cursor-pointer bg-transparent text-sm font-bold text-[#5f4a35] outline-none"
            >
              {[5, 10, 15, 20].map((size) => (
                <option key={size} value={size}>
                  {size} / ໜ້າ
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 text-[#8a5f36]" />
          </label>
        </div>
      </div>
    </section>
  )
}

export function StaffDetailPanel({
  staff,
  onEdit,
  onDelete,
  onClose,
}: {
  staff: PosStaffMember
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}) {
  return (
    <aside className="flex max-h-[92vh] min-h-0 w-full max-w-[720px] flex-col rounded-2xl border border-[#eadfce] bg-white p-6 shadow-[0_24px_70px_rgba(36,22,10,0.28)]">
      <div className="flex shrink-0 items-center justify-between">
        <h2 className="text-xl font-black text-[#3b2511]">ຂໍ້ມູນພະນັກງານ</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#7c6448] transition hover:bg-[#fbf4ea]"
          aria-label="ປິດຂໍ້ມູນພະນັກງານ"
        >
          {"×"}
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pt-7">
        <DetailSection title="ຂໍ້ມູນພື້ນຖານ">
          <InfoRow label="ຊື່ ແລະ ນາມສະກຸນ" value={staff.name} />
          <InfoRow label="ເບີໂທ" value={staff.phone} />
          <InfoRow label="ເພດ" value={localizeGender(staff.gender)} />
          <InfoRow label="ວັນເກີດ" value={staff.birthday} />
          <InfoRow label="ເລກບັດປະຈຳຕົວ" value={staff.identityNumber} />
        </DetailSection>

        <DetailSection title="ການຕິດຕໍ່">
          <InfoRow label="Email" value={staff.email} />
          <InfoRow label="ທີ່ຢູ່" value={staff.address} />
        </DetailSection>

        <DetailSection title="ຕຳແໜ່ງວຽກ">
          <InfoRow label="ຕຳແໜ່ງ" value={localizeStaffRole(staff.role)} />
        </DetailSection>

        <DetailSection title="ກະເຮັດວຽກ">
          <InfoRow label="ກະຫຼັກ" value={localizeStaffShift(staff.shift)} />
          <InfoRow label="ເວລາເຮັດວຽກ" value={staff.shiftTime} />
          <InfoRow label="ວັນທີເຂົ້າວຽກ" value={staff.joinDate} />
        </DetailSection>

        <DetailSection title="ສະຖານະ">
          <div className="grid grid-cols-[160px_minmax(0,1fr)] gap-4 text-sm">
            <span className="font-semibold text-[#5f4a35]">ສະຖານະ</span>
            <span>
              <StaffStatusBadge status={staff.status} />
            </span>
          </div>
        </DetailSection>

        <DetailSection title="ໝາຍເຫດ">
          <InfoRow label="ໝາຍເຫດພາຍໃນ" value={staff.note} />
        </DetailSection>

        <button
          type="button"
          onClick={onEdit}
          className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-[#eadfce] bg-white text-sm font-black text-[#4b321a] transition hover:bg-[#fbf4ea]"
        >
          ແກ້ໄຂ
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="mt-7 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 text-sm font-black text-red-600 transition hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
          ຢຸດໃຊ້ງານພະນັກງານ
        </button>
      </div>
    </aside>
  )
}

function SelectFilter({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: Array<[string, string]>
}) {
  return (
    <label className="relative w-[190px]">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-[#eadfce] bg-white px-4 pr-10 text-sm font-bold text-[#5f4a35] outline-none transition focus:border-[#b98b56] focus:ring-4 focus:ring-[#f4dec2]"
      >
        {options.map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a5f36]" />
    </label>
  )
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex h-7 items-center rounded-lg bg-[#f0efec] px-3 text-xs font-black text-[#5f4a35]">
      {localizeStaffRole(role)}
    </span>
  )
}

function localizeStaffRole(role: string) {
  return staffRoleLabels[role] ?? role
}

function localizeStaffShift(shift: string) {
  return staffShiftLabels[shift] ?? shift
}

function localizeGender(gender: string) {
  return ({ Nam: "ຊາຍ", "Nữ": "ຍິງ", Khác: "ອື່ນໆ" }[gender] ?? gender)
}

function StaffStatusBadge({ status }: { status: PosStaffStatus }) {
  const label: Record<PosStaffStatus, string> = {
    active: "ກຳລັງເຮັດວຽກ",
    inactive: "ອອກວຽກ",
    "on-leave": "ພັກຊົ່ວຄາວ",
  }

  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-lg px-3 text-xs font-black",
        status === "active"
          ? "bg-[#e8f7e4] text-[#2d8a33]"
          : status === "on-leave"
            ? "bg-[#fff2dc] text-[#c6760a]"
            : "bg-[#ffe9e8] text-[#d93636]",
      )}
    >
      {label[status]}
    </span>
  )
}

function IconButton({
  icon: Icon,
  ariaLabel,
  onClick,
  danger = false,
}: {
  icon: ComponentType<{ className?: string }>
  ariaLabel: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border bg-white transition hover:bg-[#fbf4ea]",
        danger
          ? "border-red-100 text-red-600 hover:bg-red-50"
          : "border-[#eadfce] text-[#4b321a]",
      )}
      aria-label={ariaLabel}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

function PageButton({
  children,
  active = false,
  disabled = false,
  onClick,
}: {
  children: ReactNode
  active?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg border px-3 font-black transition disabled:cursor-not-allowed disabled:opacity-45",
        active
          ? "border-[#5a3718] bg-[#5a3718] text-white"
          : "border-[#eadfce] bg-white text-[#5f4a35] hover:bg-[#fbf4ea]",
      )}
    >
      {children}
    </button>
  )
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-[#eadfce] bg-[#fffdf9] p-4">
      <h3 className="text-sm font-black text-[#3b2511]">{title}</h3>
      <div className="mt-4 space-y-4 text-sm">{children}</div>
    </section>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[160px_minmax(0,1fr)] gap-4">
      <span className="font-semibold text-[#5f4a35]">{label}</span>
      <span className="font-semibold text-[#111]">{value || "-"}</span>
    </div>
  )
}
