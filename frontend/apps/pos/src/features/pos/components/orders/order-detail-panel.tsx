import {
  Banknote,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Coffee,
  Edit3,
  Printer,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Utensils,
  X,
} from "lucide-react"
import type { ComponentType } from "react"

import type { CafeOrder } from "@/features/pos/data/cafe-orders"
import { formatVnd } from "@/features/pos/lib/format"
import { cn } from "@/lib/utils"

type OrderDetailPanelProps = {
  order: CafeOrder
  onClose: () => void
  onPrintReceipt: () => void
  workflowActionLabel: string
  onWorkflowAction: () => void
  onPayOrder?: () => void
  onContinueSale?: () => void
  updatingStatus?: boolean
  payingOrder?: boolean
  workflowActionDisabled?: boolean
}

export function OrderDetailPanel({
  order,
  onClose,
  onPrintReceipt,
  workflowActionLabel,
  onWorkflowAction,
  onPayOrder,
  onContinueSale,
  updatingStatus = false,
  payingOrder = false,
  workflowActionDisabled = false,
}: OrderDetailPanelProps) {
  const subtotal = order.subtotal ?? (order.items.length
    ? order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : order.total)
  const discount = order.discountAmount ?? 0
  const discountLabel = order.discountLabel || (discount > 0 ? "ຍັງບໍ່ມີຂໍ້ມູນ" : "")
  const taxAmount = order.taxAmount ?? 0
  const loyaltyDiscountAmount = order.loyaltyDiscountAmount ?? 0
  const loyaltyPointsRedeemed = order.loyaltyPointsRedeemed ?? 0
  const loyaltyPointsEarned = order.loyaltyPointsEarned ?? 0
  const payments = order.payments ?? []
  const total = order.total
  const canPayOrder =
    order.paymentStatus === "unpaid" &&
    !["cancelled", "voided", "refunded"].includes(order.status)

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-[#ded4c8] bg-white shadow-[0_12px_28px_rgba(52,40,28,0.08)]">
      <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-[#ded4c8] bg-[#fbfaf7] px-5">
        <h2 className="text-base font-black text-[#2f2419]">
          ລາຍລະອຽດອໍເດີ
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#4f4032] transition hover:bg-[#f1e8dd]"
          aria-label="ປິດລາຍລະອຽດ"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <section className="rounded-lg border border-[#eee6dc] bg-[#fbfaf7] p-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black tracking-normal text-[#2f2419]">
              {order.orderNo ?? order.id}
            </h3>
            <span className="rounded-lg border border-[#d7e5f7] bg-[#edf4ff] px-3 py-1 text-xs font-black text-[#2f68b1]">
              {getOrderStatusLabel(order.status)}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-bold text-[#756656]">
            <OrderTypeMeta order={order} />
            <span className="h-4 w-px bg-[#dfd4c4]" />
            <Utensils className="h-4 w-4 text-[#9a8064]" />
            <span>{order.tableOrCustomer}</span>
          </div>

          <div className="mt-3 flex items-center gap-3 text-sm font-bold text-[#756656]">
            <CalendarDays className="h-4 w-4 text-[#9a8064]" />
            <span>{order.date}</span>
            <span>{order.time}</span>
            <span className="h-4 w-px bg-[#dfd4c4]" />
            <span className="min-w-0 truncate">ພະນັກງານ: {order.employee}</span>
          </div>
        </section>

        <section className="mt-3 rounded-lg bg-white">
          <h3 className="px-1 py-3 text-sm font-black text-[#2f2419]">
            ລາຍການອາຫານ/ເຄື່ອງດື່ມ
          </h3>
          <div className="space-y-0">
            {order.items.length ? (
              order.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[48px_minmax(0,1fr)_auto] gap-3 border-b border-[#eee6dc] py-3 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold text-[#2f2419]">
                      {item.name}
                    </div>
                    <div className="mt-1 text-xs font-bold leading-5 text-[#9a8064]">
                      {item.note ? `ໝາຍເຫດ: ${item.note}` : "ປົກກະຕິ"}
                    </div>
                  </div>
                  <div className="text-right text-sm font-black text-[#2f2419]">
                    <div>{formatVnd(item.price * item.quantity)}</div>
                    <div className="mt-1 text-xs font-bold text-[#7c6448]">
                      {formatVnd(item.price)} x {item.quantity}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-[#ded4c8] p-5 text-center text-sm font-bold text-[#756656]">
                ຍັງບໍ່ມີລາຍລະອຽດລາຍການສຳລັບອໍເດີນີ້.
              </div>
            )}
          </div>
        </section>

        <label className="relative mt-4 block">
          <textarea
            value={order.note || "ບໍ່ມີໝາຍເຫດ."}
            readOnly
            className="h-[72px] w-full resize-none rounded-lg border border-[#ded4c8] bg-white px-4 py-3 pr-12 text-sm font-semibold text-[#2f2419] outline-none"
          />
          <Edit3 className="absolute right-4 top-5 h-5 w-5 text-[#8a5f36]" />
        </label>

        <div className="mt-4 space-y-3 border-b border-[#ded4c8] pb-4 text-sm font-semibold text-[#4f4032]">
          <SummaryRow label="ລວມ" value={formatVnd(subtotal)} />
          <SummaryRow
            label={discountLabel ? `ສ່ວນຫຼຸດ (${discountLabel})` : "ສ່ວນຫຼຸດ"}
            value={`- ${formatVnd(discount)}`}
          />
          {loyaltyDiscountAmount > 0 ? (
            <SummaryRow
              label={`ໃຊ້ຄະແນນ (${loyaltyPointsRedeemed.toLocaleString("vi-VN")} ຄະແນນ)`}
              value={`- ${formatVnd(loyaltyDiscountAmount)}`}
            />
          ) : null}
          {taxAmount > 0 ? (
            <SummaryRow label="ອາກອນ / ຄ່າບໍລິການ" value={formatVnd(taxAmount)} />
          ) : null}
          {loyaltyPointsEarned > 0 ? (
            <SummaryRow
              label="ຄະແນນທີ່ໄດ້"
              value={`${loyaltyPointsEarned.toLocaleString("vi-VN")} ຄະແນນ`}
            />
          ) : null}
        </div>

        <div className="flex items-center justify-between py-4">
          <span className="text-base font-extrabold text-[#2f2419]">ລວມທັງໝົດ</span>
          <span className="text-[28px] font-black tracking-normal text-[#2f2419]">
            {formatVnd(total)}
          </span>
        </div>

        <section className="border-b border-[#ded4c8] pb-4">
          <div className="flex items-center justify-between pb-3">
            <span className="text-sm font-bold text-[#4f4032]">ການຊຳລະ</span>
            <span
              className={cn(
                "rounded-lg border px-3 py-2 text-xs font-black",
                order.paymentStatus === "paid"
                  ? "border-[#d8eadb] bg-[#eef9f0] text-[#2f8748]"
                  : order.paymentStatus === "refunded"
                    ? "border-[#d8e4ff] bg-[#eef4ff] text-[#3869c7]"
                    : order.paymentStatus === "voided"
                      ? "border-[#e2e0da] bg-[#f1f0ed] text-[#6b6258]"
                  : "border-[#ffd9d4] bg-[#fff0ee] text-[#d33c32]",
              )}
            >
              {getPaymentStatusLabel(order.paymentStatus)}
            </span>
          </div>

          {payments.length ? (
            <div className="space-y-2 text-sm font-semibold text-[#4f4032]">
              {payments.map((payment) => (
                <div key={payment.id} className="rounded-lg border border-[#eee6dc] bg-[#fbfaf7] p-3">
                  <SummaryRow
                    label={getPaymentMethodLabel(payment.method)}
                    value={formatVnd(payment.amountPaid)}
                  />
                  {payment.changeAmount > 0 ? (
                    <SummaryRow label="ເງິນທອນ" value={formatVnd(payment.changeAmount)} />
                  ) : null}
                  {payment.debtAmount > 0 ? (
                    <SummaryRow label="ຕິດໜີ້" value={formatVnd(payment.debtAmount)} />
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[#ded4c8] bg-[#fbfaf7] p-3 text-sm font-bold text-[#756656]">
              ຍັງບໍ່ມີລາຍການຊຳລະ.
            </div>
          )}
        </section>

        <div className="mt-4 space-y-2">
          <DetailActionButton
            icon={Printer}
            label="ພິມໃບບິນ"
            onClick={onPrintReceipt}
          />
          {canPayOrder && onContinueSale ? (
            <DetailActionButton
              icon={ShoppingCart}
              label="ຂາຍຕໍ່"
              onClick={onContinueSale}
            />
          ) : null}
          {canPayOrder && onPayOrder ? (
            <DetailActionButton
              dark
              icon={Banknote}
              label={payingOrder ? "ກຳລັງຊຳລະ..." : "ຊຳລະອໍເດີ"}
              onClick={onPayOrder}
              disabled={payingOrder}
            />
          ) : null}
          <DetailActionButton
            accent
            icon={RefreshCw}
            label={updatingStatus ? "ກຳລັງດຳເນີນ..." : workflowActionLabel}
            onClick={onWorkflowAction}
            disabled={updatingStatus || workflowActionDisabled}
          />
        </div>
      </div>
    </aside>
  )
}

function getOrderStatusLabel(status: CafeOrder["status"]) {
  const labels: Record<CafeOrder["status"], string> = {
    new: "ໃໝ່",
    completed: "ສຳເລັດ",
    delivering: "ກຳລັງຈັດສົ່ງ",
    preparing: "ກຳລັງກະກຽມ",
    cancelled: "ຍົກເລີກແລ້ວ",
    voided: "void ແລ້ວ",
    refunded: "ຄືນເງິນແລ້ວ",
  }

  return labels[status]
}

function getPaymentStatusLabel(status: CafeOrder["paymentStatus"]) {
  const labels: Record<CafeOrder["paymentStatus"], string> = {
    paid: "ຊຳລະແລ້ວ",
    unpaid: "ຍັງບໍ່ຊຳລະ",
    voided: "void ແລ້ວ",
    refunded: "ຄືນເງິນແລ້ວ",
  }

  return labels[status]
}

function getPaymentMethodLabel(method: string) {
  const labels: Record<string, string> = {
    cash: "ເງິນສົດ",
    "bank-transfer": "ໂອນເງິນ",
    "qr-code": "QR",
  }

  return labels[method] ?? method
}

function OrderTypeMeta({ order }: { order: CafeOrder }) {
  const Icon =
    order.type === "dine-in" ? Coffee : order.type === "takeaway" ? ShoppingBag : Truck
  const label =
    order.type === "dine-in"
      ? "ກິນຢູ່ຮ້ານ"
      : order.type === "takeaway"
        ? "ເອົາກັບບ້ານ"
        : "ຈັດສົ່ງ"

  return (
    <>
      <Icon className="h-4 w-4 text-[#9a8064]" />
      <span>{label}</span>
    </>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="min-w-0 flex-1">{label}</span>
      <span className="shrink-0 font-bold text-[#2f2419]">{value}</span>
    </div>
  )
}

function DetailActionButton({
  icon: Icon,
  label,
  onClick,
  dark = false,
  accent = false,
  disabled = false,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  onClick: () => void
  dark?: boolean
  accent?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-12 w-full cursor-pointer items-center justify-between rounded-lg px-4 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-55",
        dark
          ? "bg-[#2f2419] text-white shadow-[0_10px_22px_rgba(47,36,25,0.18)] hover:bg-[#4a3726]"
          : accent
            ? "border border-[#ead6bb] bg-[#fff6e8] text-[#8d531c] hover:bg-[#ffefd7]"
            : "border border-[#ded4c8] bg-white text-[#4f4032] hover:bg-[#f7f1e9]",
      )}
    >
      <span className="flex items-center gap-3">
        <Icon className="h-5 w-5" />
        {label}
      </span>
      {accent ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  )
}
