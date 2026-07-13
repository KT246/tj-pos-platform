import { AnimatePresence, motion } from "framer-motion"
import {
  Banknote,
  Building2,
  Check,
  Info,
  Plus,
  Trash2,
  X,
} from "lucide-react"
import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"

import { formatVnd } from "@/features/pos/lib/format"
import { calculateOrderTotals } from "@/features/pos/lib/order-totals"
import type { CartLine, OrderDiscount } from "@/features/pos/stores/pos-store"
import type { PosCafeCustomer } from "@/features/pos/api/pos-customers-api"
import { cn } from "@/lib/utils"

type PaymentMethod = "cash" | "transfer"

type PaymentLine = {
  id: string
  method: PaymentMethod
  amount: number
}

export type PaymentConfirmationPayload = {
  payments: Array<{
    method: PaymentMethod
    amount: number
  }>
  paidTotal: number
  changeAmount: number
  printReceipt: boolean
  openCashDrawer: boolean
  sendToKitchen: boolean
}

type PaymentDrawerProps = {
  open: boolean
  cart: CartLine[]
  orderDiscount: OrderDiscount | null
  selectedCustomer: PosCafeCustomer | null
  loyaltyDiscountAmount: number
  redeemPoints: number
  earnedPoints: number
  tableLabel: string
  taxAmount?: number
  taxLabel?: string
  onClose: () => void
  onConfirm: (payload: PaymentConfirmationPayload) => void
  confirming?: boolean
}

const paymentMethods: Array<{
  id: PaymentMethod
  label: string
  icon: typeof Banknote
}> = [
  { id: "cash", label: "ເງິນສົດ", icon: Banknote },
  { id: "transfer", label: "ໂອນເງິນ", icon: Building2 },
]

function createPaymentLineId() {
  return `payment-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function parseMoneyInput(value: string) {
  return Number(value.replace(/\D/g, ""))
}

function getPaymentMethod(method: PaymentMethod) {
  return paymentMethods.find((item) => item.id === method) ?? paymentMethods[0]
}

export function PaymentDrawer({
  open,
  cart,
  orderDiscount,
  selectedCustomer,
  loyaltyDiscountAmount,
  redeemPoints,
  earnedPoints,
  tableLabel,
  taxAmount = 0,
  taxLabel = "ອາກອນ / ຄ່າບໍລິການ",
  onClose,
  onConfirm,
  confirming = false,
}: PaymentDrawerProps) {
  const { subtotal, discountAmount, total: orderTotal } = calculateOrderTotals(
    cart,
    orderDiscount,
  )
  const total = Math.max(0, orderTotal - loyaltyDiscountAmount + taxAmount)
  const [payments, setPayments] = useState<PaymentLine[]>([])
  const [printReceipt, setPrintReceipt] = useState(true)
  const [openCashDrawer, setOpenCashDrawer] = useState(true)
  const [sendToKitchen, setSendToKitchen] = useState(true)

  useEffect(() => {
    if (!open) return

    setPayments([
      {
        id: createPaymentLineId(),
        method: "cash",
        amount: total,
      },
    ])
  }, [open, total])

  const paidTotal = useMemo(
    () => payments.reduce((sum, payment) => sum + payment.amount, 0),
    [payments],
  )
  const cashPaid = useMemo(
    () =>
      payments
        .filter((payment) => payment.method === "cash")
        .reduce((sum, payment) => sum + payment.amount, 0),
    [payments],
  )
  const missingAmount = Math.max(0, total - paidTotal)
  const overPaidAmount = Math.max(0, paidTotal - total)
  const change = Math.min(overPaidAmount, cashPaid)
  const canConfirm = total > 0 && paidTotal >= total && !confirming
  const usedPaymentMethods = useMemo(
    () => new Set(payments.map((payment) => payment.method)),
    [payments],
  )
  const canAddPaymentLine = payments.length < paymentMethods.length

  useEffect(() => {
    if (cashPaid <= 0) setOpenCashDrawer(false)
  }, [cashPaid])

  const updatePaymentLine = (
    paymentId: string,
    nextPayment: Partial<Pick<PaymentLine, "amount" | "method">>,
  ) => {
    setPayments((currentPayments) => {
      const nextPayments = currentPayments.map((payment) =>
        payment.id === paymentId ? { ...payment, ...nextPayment } : payment,
      )

      if (typeof nextPayment.amount !== "number" || nextPayments.length !== 2) {
        return nextPayments
      }

      return nextPayments.map((payment) =>
        payment.id === paymentId
          ? payment
          : { ...payment, amount: Math.max(0, total - nextPayment.amount!) },
      )
    })
  }

  const removePaymentLine = (paymentId: string) => {
    setPayments((currentPayments) =>
      currentPayments.length > 1
        ? currentPayments.filter((payment) => payment.id !== paymentId)
        : currentPayments,
    )
  }

  const addPaymentLine = () => {
    const nextMethod =
      paymentMethods.find((item) => !usedPaymentMethods.has(item.id))?.id ?? null

    if (!nextMethod) return

    setPayments((currentPayments) => [
      ...currentPayments,
      {
        id: createPaymentLineId(),
        method: nextMethod,
        amount: missingAmount,
      },
    ])
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex justify-end bg-[#2a1c10]/34 p-3 backdrop-blur-[2px]"
          onClick={onClose}
        >
          <motion.aside
            initial={{ opacity: 0, x: 56 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 56 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="flex h-full min-h-0 w-[420px] max-w-[calc(100vw-24px)] shrink-0 flex-col rounded-xl border border-[#ded4c8] bg-white p-5 shadow-[0_22px_56px_rgba(36,22,10,0.24)]"
            role="dialog"
            aria-modal="true"
            aria-label="ຊຳລະເງິນ"
          >
          <div className="flex h-10 shrink-0 items-center justify-between">
            <h2 className="text-lg font-black text-[#2f2419]">ຊຳລະເງິນ</h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#4f4032] transition hover:bg-[#f7f1e9]"
              aria-label="ປິດໜ້າຊຳລະເງິນ"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="rounded-lg border border-[#ded4c8] bg-[#fbfaf7] p-4 text-sm font-bold">
              <SummaryRow label="ເລກບິນ" value="ສ້າງຫຼັງຊຳລະ" strong />
              <SummaryRow label="ໂຕະ" value={tableLabel} strong />
            </div>

            <div className="mt-5 space-y-4 border-b border-dashed border-[#ded4c8] pb-5 text-sm font-semibold text-[#4f4032]">
              <SummaryRow label="ລວມ" value={formatVnd(subtotal)} />
              <SummaryRow
                label={
                  orderDiscount
                    ? `ສ່ວນຫຼຸດ (${orderDiscount.reason || orderDiscount.label})`
                    : "ສ່ວນຫຼຸດ"
                }
                value={formatVnd(discountAmount)}
              />
              {loyaltyDiscountAmount > 0 ? (
                <SummaryRow
                  label={`ໃຊ້ຄະແນນ (${redeemPoints.toLocaleString("vi-VN")} ຄະແນນ)`}
                  value={formatVnd(loyaltyDiscountAmount)}
                />
              ) : null}
              <SummaryRow
                label={
                  <span className="flex items-center gap-1">
                    {taxLabel} <Info className="h-3.5 w-3.5" />
                  </span>
                }
                value={formatVnd(taxAmount)}
              />
            </div>

            <div className="flex items-center justify-between border-b border-[#ded4c8] py-5">
              <span className="text-base font-black text-[#2f2419]">ລວມທັງໝົດ</span>
              <span className="text-[28px] font-black tracking-normal text-[#2f2419]">
                {formatVnd(total)}
              </span>
            </div>

            {selectedCustomer ? (
              <div className="mt-4 rounded-lg border border-[#d8ead0] bg-[#f4fbf1] p-4 text-sm font-bold text-[#315f2d]">
                <div>{selectedCustomer.name} - {selectedCustomer.phone}</div>
                <div className="mt-2">
                  ຄະແນນປັດຈຸບັນ: {selectedCustomer.points.toLocaleString("vi-VN")}
                </div>
                <div className="mt-1">
                  ຈະໄດ້ຫຼັງຊຳລະ: +{earnedPoints.toLocaleString("vi-VN")} ຄະແນນ
                </div>
              </div>
            ) : null}

            <section className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-black text-[#2f2419]">
                  ວິທີຊຳລະເງິນ
                </h3>
                <button
                  type="button"
                  onClick={addPaymentLine}
                  disabled={!canAddPaymentLine}
                  className={cn(
                    "flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[#ded4c8] bg-white px-3 text-xs font-black text-[#2f2419] transition hover:bg-[#f7f1e9]",
                    !canAddPaymentLine
                      ? "cursor-not-allowed opacity-45 hover:bg-white"
                      : "",
                  )}
                >
                  <Plus className="h-4 w-4" />
                  ເພີ່ມ
                </button>
              </div>

              <div className="mt-3 space-y-3">
                {payments.map((payment) => {
                  const method = getPaymentMethod(payment.method)
                  const Icon = method.icon

                  return (
                    <div
                      key={payment.id}
                      className="rounded-lg border border-[#ded4c8] bg-white p-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f5f1eb] text-[#4f4032]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <select
                          value={payment.method}
                          onChange={(event) =>
                            updatePaymentLine(payment.id, {
                              method: event.target.value as PaymentMethod,
                            })
                          }
                          className="h-10 min-w-0 flex-1 cursor-pointer rounded-lg border border-[#ded4c8] bg-[#fbfaf7] px-3 text-sm font-black text-[#2f2419] outline-none transition focus:border-[#a97743] focus:ring-3 focus:ring-[#ead7bf]"
                        >
                          {paymentMethods.map((item) => (
                            <option
                              key={item.id}
                              value={item.id}
                              disabled={
                                item.id !== payment.method &&
                                usedPaymentMethods.has(item.id)
                              }
                            >
                              {item.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removePaymentLine(payment.id)}
                          disabled={payments.length === 1}
                          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[#ded4c8] text-[#c23d2a] transition hover:bg-[#fff1ee] disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="ລຶບວິທີຊຳລະເງິນ"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <label className="mt-3 block">
                        <span className="text-xs font-black text-[#7c6448]">
                          ຈຳນວນເງິນ
                        </span>
                        <span className="mt-1 flex h-10 items-center rounded-lg border border-[#ded4c8] bg-white px-3 focus-within:border-[#a97743] focus-within:ring-3 focus-within:ring-[#ead7bf]">
                          <input
                            value={
                              payment.amount
                                ? payment.amount.toLocaleString("vi-VN")
                                : ""
                            }
                            onChange={(event) =>
                              updatePaymentLine(payment.id, {
                                amount: parseMoneyInput(event.target.value),
                              })
                            }
                            inputMode="numeric"
                            className="min-w-0 flex-1 bg-transparent text-right text-base font-black text-[#2f2419] outline-none"
                          />
                          <span className="ml-2 text-sm font-black text-[#7c6448]">
                            ກີບ
                          </span>
                        </span>
                      </label>
                    </div>
                  )
                })}
              </div>
            </section>

            <div className="mt-5 rounded-lg border border-[#ded4c8] bg-[#fbfaf7] p-4 text-sm font-bold text-[#4f4032]">
              <SummaryRow label="ຊຳລະແລ້ວ" value={formatVnd(paidTotal)} />
              <SummaryRow
                label="ຍັງຂາດ"
                value={formatVnd(missingAmount)}
                valueClassName={missingAmount > 0 ? "text-[#c23d2a]" : "text-[#2f9b45]"}
              />
              <SummaryRow
                label="ເງິນທອນ"
                value={formatVnd(change)}
                valueClassName={change > 0 ? "text-[#2f9b45]" : ""}
              />
            </div>

            {missingAmount > 0 ? (
              <div className="mt-3 rounded-lg border border-[#f2c8bd] bg-[#fff5f2] px-4 py-3 text-sm font-bold text-[#c23d2a]">
                ຍັງຂາດ {formatVnd(missingAmount)}. ແຄດເຊຍຕ້ອງຮັບເງິນສົດ
                ຫຼື ການໂອນເພີ່ມ.
              </div>
            ) : null}

            <div className="mt-5 space-y-3">
              <CheckOption
                checked={printReceipt}
                onChange={() => setPrintReceipt((value) => !value)}
                label="ພິມໃບບິນ"
              />
              <CheckOption
                checked={openCashDrawer}
                onChange={() => setOpenCashDrawer((value) => !value)}
                label="ເປີດລິ້ນຊັກເງິນ"
                disabled={cashPaid <= 0}
              />
              <CheckOption
                checked={sendToKitchen}
                onChange={() => setSendToKitchen((value) => !value)}
                label="ສົ່ງອໍເດີໄປ bar/ຄົວ"
              />
            </div>

            <div className="mt-5 flex gap-3 rounded-lg border border-[#ded4c8] bg-[#fbfaf7] p-4 text-sm font-semibold text-[#756656]">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#8a5f36]" />
              ຫຼັງຈາກຢືນຢັນ, ອໍເດີຈະສຳເລັດ, ຖືກຊຳລະເງິນ ແລະສົ່ງ
              ໄປ bar/ຄົວ.
            </div>
          </div>

          <div className="mt-5 grid shrink-0 grid-cols-[0.9fr_1.35fr] gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-12 cursor-pointer rounded-lg border border-[#ded4c8] bg-white text-sm font-black text-[#4f4032] transition hover:bg-[#f7f1e9]"
            >
              ກັບຄືນ
            </button>
            <button
              type="button"
              onClick={() =>
                onConfirm({
                  payments: payments.map((payment) => ({
                    method: payment.method,
                    amount: payment.amount,
                  })),
                  paidTotal,
                  changeAmount: change,
                  printReceipt,
                  openCashDrawer,
                  sendToKitchen,
                })
              }
              disabled={!canConfirm}
              className={cn(
                "h-12 cursor-pointer rounded-lg text-sm font-black text-white shadow-[0_12px_26px_rgba(47,36,25,0.2)] transition",
                canConfirm
                  ? "bg-[#2f2419] hover:bg-[#4a3726]"
                  : "cursor-not-allowed bg-[#c8b9a6] shadow-none",
              )}
            >
              {confirming ? "ກຳລັງຊຳລະ..." : "ຢືນຢັນການຊຳລະ"}
            </button>
          </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function SummaryRow({
  label,
  value,
  strong = false,
  valueClassName,
}: {
  label: ReactNode
  value: string
  strong?: boolean
  valueClassName?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span>{label}</span>
      <span
        className={cn(
          "text-right",
          strong ? "font-black text-[#2f2419]" : "",
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  )
}

function CheckOption({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean
  onChange: () => void
  label: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={cn(
        "flex cursor-pointer items-center gap-3 text-sm font-bold text-[#5f4a35]",
        disabled ? "cursor-not-allowed opacity-45" : "",
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded border",
          checked
            ? "border-[#2f2419] bg-[#2f2419] text-white"
            : "border-[#d7c4ab] bg-white text-transparent",
        )}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
      {label}
    </button>
  )
}
