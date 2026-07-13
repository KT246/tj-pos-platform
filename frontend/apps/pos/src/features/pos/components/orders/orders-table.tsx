import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import type { ReactNode } from "react"

import type {
  CafeOrder,
  CafeOrderStatus,
  CafeOrderType,
  CafePaymentStatus,
} from "@/features/pos/data/cafe-orders"
import { formatVnd } from "@/features/pos/lib/format"
import { cn } from "@/lib/utils"

type OrdersTableProps = {
  orders: CafeOrder[]
  selectedOrderId: string
  totalOrders: number
  page: number
  pageSize: number
  onSelectOrder: (orderId: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function OrdersTable({
  orders,
  selectedOrderId,
  totalOrders,
  page,
  pageSize,
  onSelectOrder,
  onPageChange,
  onPageSizeChange,
}: OrdersTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalOrders / pageSize))
  const firstItem = totalOrders ? (page - 1) * pageSize + 1 : 0
  const lastItem = totalOrders ? Math.min(page * pageSize, totalOrders) : 0
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).slice(
    Math.max(0, page - 3),
    Math.max(0, page - 3) + 5,
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[900px] border-separate border-spacing-0 text-left">
          <thead className="sticky top-0 z-10 bg-[#fbfaf7]">
            <tr className="text-xs font-black uppercase text-[#756656]">
              <HeaderCell>#</HeaderCell>
              <HeaderCell>ເລກບິນ</HeaderCell>
              <HeaderCell>ເວລາ</HeaderCell>
              <HeaderCell>ປະເພດ</HeaderCell>
              <HeaderCell>ໂຕະ / ລູກຄ້າ</HeaderCell>
              <HeaderCell>ລາຍການ</HeaderCell>
              <HeaderCell>ການຊຳລະ</HeaderCell>
              <HeaderCell>ສະຖານະ</HeaderCell>
              <HeaderCell>ລວມເງິນ</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const orderKey = order.backendId ?? order.id
              const selected = selectedOrderId === orderKey
              const orderNumber = (page - 1) * pageSize + index + 1

              return (
                <tr
                  key={orderKey}
                  onClick={() => onSelectOrder(orderKey)}
                  className={cn(
                    "group cursor-pointer transition",
                    selected ? "bg-[#f6efe5]" : "bg-white hover:bg-[#fbfaf7]",
                  )}
                >
                  <BodyCell className="font-black text-[#756656]">
                    {orderNumber}
                  </BodyCell>
                  <BodyCell className="font-black">
                    {order.orderNo ?? order.id}
                  </BodyCell>
                  <BodyCell>
                    <div className="whitespace-nowrap font-bold">
                      {order.date} - {order.time}
                    </div>
                  </BodyCell>
                  <BodyCell>
                    <OrderTypeBadge type={order.type} />
                  </BodyCell>
                  <BodyCell>
                    <div className="font-bold">{order.tableOrCustomer}</div>
                    {order.phone ? (
                      <div className="mt-1 text-[#7c6448]">{order.phone}</div>
                    ) : null}
                  </BodyCell>
                  <BodyCell>
                    <span className="font-bold">{order.itemCount}</span>
                  </BodyCell>
                  <BodyCell>
                    <PaymentBadge status={order.paymentStatus} />
                  </BodyCell>
                  <BodyCell>
                    <StatusBadge status={order.status} />
                  </BodyCell>
                  <BodyCell className="text-right font-black">{formatVnd(order.total)}</BodyCell>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex h-[58px] shrink-0 items-center justify-between border-t border-[#ded4c8] bg-[#fbfaf7] px-5 text-sm font-bold text-[#4f4032]">
        <span>
          ສະແດງ {firstItem} - {lastItem} ຈາກ {totalOrders} ອໍເດີ
        </span>
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
        </div>
        <label className="flex h-9 cursor-pointer items-center gap-3 rounded-lg border border-[#ded4c8] bg-white px-3 transition hover:bg-[#f7f1e9]">
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
          <ChevronRight className="h-4 w-4 rotate-90 text-[#8a5f36]" />
        </label>
      </div>
    </div>
  )
}

function HeaderCell({
  children,
  align = "left",
}: {
  children: ReactNode
  align?: "left" | "right"
}) {
  return (
    <th
      className={cn(
        "border-b border-[#ded4c8] px-4 py-3",
        align === "right" ? "text-right" : "text-left",
      )}
    >
      {children}
    </th>
  )
}

function BodyCell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <td className={cn("h-[58px] border-b border-[#eee6dc] px-4 py-2.5 text-sm text-[#2f2419]", className)}>
      {children}
    </td>
  )
}

function OrderTypeBadge({ type }: { type: CafeOrderType }) {
  const label =
    type === "dine-in"
      ? "ກິນຢູ່ຮ້ານ"
      : type === "takeaway"
        ? "ເອົາກັບບ້ານ"
        : "ຈັດສົ່ງ"
  const className =
    type === "dine-in"
      ? "border-[#f4dfc4] bg-[#fff7ed] text-[#9a5d24]"
      : type === "takeaway"
        ? "border-[#d7ead7] bg-[#eef9ee] text-[#318747]"
        : "border-[#f5ddb9] bg-[#fff4e5] text-[#c06d16]"

  return (
    <span
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-lg border px-3 text-xs font-black",
        className,
      )}
    >
      {label}
    </span>
  )
}

function PaymentBadge({ status }: { status: CafePaymentStatus }) {
  const label: Record<CafePaymentStatus, string> = {
    paid: "ຊຳລະແລ້ວ",
    unpaid: "ຍັງບໍ່ຊຳລະ",
    voided: "void ແລ້ວ",
    refunded: "ຄືນເງິນແລ້ວ",
  }
  const className: Record<CafePaymentStatus, string> = {
    paid: "border-[#d8eadb] bg-[#eef9f0] text-[#2f8748]",
    unpaid: "border-[#ffd9d4] bg-[#fff0ee] text-[#d33c32]",
    voided: "border-[#e2e0da] bg-[#f1f0ed] text-[#6b6258]",
    refunded: "border-[#d8e4ff] bg-[#eef4ff] text-[#3869c7]",
  }

  return (
    <span
      className={cn(
        "inline-flex h-8 items-center rounded-lg border px-3 text-xs font-black",
        className[status],
      )}
    >
      {label[status]}
    </span>
  )
}

function StatusBadge({ status }: { status: CafeOrderStatus }) {
  const statusClass: Record<CafeOrderStatus, string> = {
    new: "border-[#d6e8ff] bg-[#eef6ff] text-[#2f75bd]",
    completed: "border-[#d8eadb] bg-[#eef9f0] text-[#2f8748]",
    delivering: "border-[#ffe0bc] bg-[#fff5e8] text-[#c36b14]",
    preparing: "border-[#ffe0bc] bg-[#fff5e8] text-[#c36b14]",
    cancelled: "border-[#e2e0da] bg-[#f1f0ed] text-[#6b6258]",
    voided: "border-[#e2e0da] bg-[#f1f0ed] text-[#6b6258]",
    refunded: "border-[#d8e4ff] bg-[#eef4ff] text-[#3869c7]",
  }
  const label: Record<CafeOrderStatus, string> = {
    new: "ໃໝ່",
    completed: "ສຳເລັດ",
    delivering: "ກຳລັງຈັດສົ່ງ",
    preparing: "ກຳລັງກະກຽມ",
    cancelled: "ຍົກເລີກແລ້ວ",
    voided: "void ແລ້ວ",
    refunded: "ຄືນເງິນແລ້ວ",
  }

  return (
    <span
      className={cn(
        "inline-flex h-8 items-center rounded-lg border px-3 text-xs font-black",
        statusClass[status],
      )}
    >
      {label[status]}
    </span>
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
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg border px-3 font-black transition disabled:cursor-not-allowed disabled:opacity-45",
        active
          ? "border-[#2f2419] bg-[#2f2419] text-white"
          : "border-[#ded4c8] bg-white text-[#4f4032] hover:bg-[#f7f1e9]",
      )}
    >
      {children}
    </button>
  )
}
