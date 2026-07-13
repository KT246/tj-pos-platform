import {
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Phone,
  Search,
  Trash2,
  UserPen,
  UserRound,
  Users,
  Wallet,
} from "lucide-react"
import type { ComponentType, ReactNode } from "react"

import type {
  PosCafeCustomer,
  PosCustomerKpi,
} from "@/features/pos/api/pos-customers-api"
import { formatVnd } from "@/features/pos/lib/format"
import { cn } from "@/lib/utils"

const kpiIcons: Record<PosCustomerKpi["tone"], ComponentType<{ className?: string }>> = {
  brown: Users,
  green: BadgeCheck,
  amber: Wallet,
  purple: UserRound,
}

const kpiToneClasses: Record<PosCustomerKpi["tone"], string> = {
  brown: "bg-[#f5f1eb] text-[#4f4032]",
  green: "bg-[#eef8f0] text-[#2e7a46]",
  amber: "bg-[#fff4e3] text-[#af6418]",
  purple: "bg-[#edf4ff] text-[#2f68b1]",
}

export function CustomerKpiCard({ kpi }: { kpi: PosCustomerKpi }) {
  const Icon = kpiIcons[kpi.tone]

  return (
    <article className="border border-[#ded4c8] bg-white p-4">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", kpiToneClasses[kpi.tone])}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase text-[#756656]">{kpi.title}</div>
          <div className="mt-1 truncate text-xl font-black leading-7 text-[#2f2419]">{kpi.value}</div>
          <div className="mt-1 truncate text-xs font-semibold text-[#756656]">{kpi.subtitle}</div>
        </div>
      </div>
    </article>
  )
}

export function CustomerFilters({
  search,
  onSearchChange,
}: {
  search: string
  onSearchChange: (value: string) => void
}) {
  return (
    <div className="flex h-16 shrink-0 items-center gap-3 border-b border-[#ded4c8] bg-[#fbfaf7] px-4">
      <label className="relative w-[320px]">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a8064]" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-10 w-full rounded-lg border border-[#ded4c8] bg-white pl-10 pr-4 text-sm font-semibold text-[#2f2419] outline-none transition placeholder:text-[#a59686] focus:border-[#a97743] focus:ring-3 focus:ring-[#ead7bf]"
          placeholder="ຄົ້ນຫາຊື່, ເບີໂທ, ລະຫັດລູກຄ້າ..."
        />
      </label>
    </div>
  )
}

export function CustomerTable({
  customers,
  selectedCustomerId,
  totalCustomers,
  page,
  pageSize,
  totalPages,
  onSelectCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onPageChange,
  onPageSizeChange,
}: {
  customers: PosCafeCustomer[]
  selectedCustomerId: string
  totalCustomers: number
  page: number
  pageSize: number
  totalPages: number
  onSelectCustomer: (customerId: string) => void
  onEditCustomer: (customerId: string) => void
  onDeleteCustomer: (customerId: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}) {
  const firstItem = totalCustomers ? (page - 1) * pageSize + 1 : 0
  const lastItem = totalCustomers ? Math.min(page * pageSize, totalCustomers) : 0
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).slice(
    Math.max(0, page - 3),
    Math.max(0, page - 3) + 5,
  )

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <div className="grid h-11 shrink-0 grid-cols-[44px_82px_minmax(150px,1.4fr)_minmax(110px,0.8fr)_90px_minmax(100px,0.8fr)_84px] items-center gap-2 border-b border-[#ded4c8] bg-[#fbfaf7] px-4 text-xs font-black uppercase text-[#756656]">
        <span>#</span>
        <span>ລະຫັດ</span>
        <span>ລູກຄ້າ</span>
        <span>ເບີໂທ</span>
        <span>ຄະແນນ</span>
        <span>ຍອດໃຊ້</span>
        <span>ຈັດການ</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {customers.length ? customers.map((customer, index) => {
          const selected = customer.id === selectedCustomerId

          return (
            <div
              key={customer.id}
              onClick={() => onSelectCustomer(customer.id)}
              className={cn(
                "grid min-h-[58px] cursor-pointer grid-cols-[44px_82px_minmax(150px,1.4fr)_minmax(110px,0.8fr)_90px_minmax(100px,0.8fr)_84px] items-center gap-2 border-b border-[#eee6dc] px-4 text-sm transition last:border-b-0",
                selected ? "bg-[#f6efe5]" : "bg-white hover:bg-[#fbfaf7]",
              )}
            >
              <span className="font-black text-[#756656]">{(page - 1) * pageSize + index + 1}</span>
              <span className="font-black text-[#2f2419]">{customer.code}</span>
              <div className="min-w-0">
                <div className="truncate font-black text-[#2f2419]">{customer.name}</div>
                <div className="mt-1 truncate text-xs font-semibold text-[#756656]">
                  ລູກຄ້າສະສົມຄະແນນ
                </div>
              </div>
              <span className="truncate font-semibold text-[#2f2419]">{customer.phone || "-"}</span>
              <span className="truncate font-black text-[#2f2419]">{customer.points.toLocaleString("vi-VN")}</span>
              <span className="truncate font-black text-[#2f2419]">{formatVnd(customer.totalSpent)}</span>
              <span className="flex items-center justify-end gap-2">
                <IconButton
                  ariaLabel={`ແກ້ໄຂ ${customer.name}`}
                  icon={UserPen}
                  onClick={() => onEditCustomer(customer.id)}
                />
                <IconButton
                  ariaLabel={`ລຶບ ${customer.name}`}
                  icon={Trash2}
                  danger
                  onClick={() => onDeleteCustomer(customer.id)}
                />
              </span>
            </div>
          )
        }) : (
          <div className="flex h-full min-h-[220px] items-center justify-center text-sm font-bold text-[#756656]">
            ບໍ່ພົບລູກຄ້າທີ່ກົງເງື່ອນໄຂ.
          </div>
        )}
      </div>

      <div className="flex h-[58px] shrink-0 items-center justify-between border-t border-[#ded4c8] bg-[#fbfaf7] px-4 text-sm font-bold text-[#4f4032]">
        <span>ສະແດງ {firstItem} - {lastItem} ຈາກ {totalCustomers} ລູກຄ້າ</span>
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
          <PageButton disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </PageButton>
          <label className="ml-2 flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-[#ded4c8] bg-white px-3 transition hover:bg-[#f7f1e9]">
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="cursor-pointer bg-transparent text-sm font-bold text-[#4f4032] outline-none"
            >
              {[5, 10, 15, 20].map((size) => (
                <option key={size} value={size}>{size} / ໜ້າ</option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 text-[#8a5f36]" />
          </label>
        </div>
      </div>
    </section>
  )
}

export function CustomerProfilePanel({
  customer,
  onEdit,
  onDelete,
}: {
  customer: PosCafeCustomer
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <aside className="flex h-full min-h-0 w-full shrink-0 flex-col rounded-xl border border-[#ded4c8] bg-white p-4 shadow-[0_12px_28px_rgba(52,40,28,0.08)]">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <section>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-black text-[#2f2419]">{customer.name}</h2>
              <p className="mt-2 text-sm font-semibold text-[#756656]">ລະຫັດ: {customer.code}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <ContactLine icon={Phone} text={customer.phone} />
          </div>
        </section>

        <DetailSection title="ຄະແນນສະສົມ">
          <InfoRow label="ຄະແນນປັດຈຸບັນ" value={`${customer.points.toLocaleString("vi-VN")} ຄະແນນ`} />
        </DetailSection>

        <DetailSection title="ປະຫວັດການຊື້">
          <InfoRow label="ອໍເດີລວມ" value={`${customer.ordersCount} ອໍເດີ`} />
          <InfoRow label="ຍອດໃຊ້ລວມ" value={formatVnd(customer.totalSpent)} />
          <InfoRow label="ອໍເດີຫຼ້າສຸດ" value={customer.lastOrderAt || "-"} />
        </DetailSection>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#ded4c8] bg-white text-sm font-black text-[#4f4032] transition hover:bg-[#f7f1e9]"
          >
            <UserPen className="h-4 w-4" />
            ແກ້ໄຂ
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 text-sm font-black text-red-600 transition hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            ລຶບ
          </button>
        </div>
      </div>
    </aside>
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
        "flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border bg-white transition hover:bg-[#f7f1e9]",
        danger ? "border-red-100 text-red-600 hover:bg-red-50" : "border-[#ded4c8] text-[#4f4032]",
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
        active ? "border-[#2f2419] bg-[#2f2419] text-white" : "border-[#ded4c8] bg-white text-[#4f4032] hover:bg-[#f7f1e9]",
      )}
    >
      {children}
    </button>
  )
}

function ContactLine({
  icon: Icon,
  text,
}: {
  icon: ComponentType<{ className?: string }>
  text: string
}) {
  if (!text) return null

  return (
    <div className="flex items-center gap-3 text-sm font-semibold text-[#4f4032]">
      <Icon className="h-4 w-4 text-[#8a5425]" />
      <span className="truncate">{text}</span>
    </div>
  )
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-5 rounded-lg border border-[#ded4c8] bg-[#fbfaf7] p-4">
      <h3 className="text-sm font-black text-[#2f2419]">{title}</h3>
      <div className="mt-4 space-y-4 text-sm">{children}</div>
    </section>
  )
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-4">
      <span className="font-semibold text-[#756656]">{label}</span>
      <span className="min-w-0 font-semibold text-[#2f2419]">{value}</span>
    </div>
  )
}
