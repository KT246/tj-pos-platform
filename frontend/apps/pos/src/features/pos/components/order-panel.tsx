import { Edit3, Plus, Printer, Save, ShoppingCart, SquarePen, Trash2, X } from "lucide-react"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"

import {
  UNSELECTED_TABLE_LABEL,
  type CartLine,
  type OrderDiscount,
} from "@/features/pos/stores/pos-store"
import type { PosCafeCustomer } from "@/features/pos/api/pos-customers-api"
import { PosConfirmDialog } from "@/features/pos/components/notifications/pos-notification-ui"
import { formatVnd } from "@/features/pos/lib/format"
import { calculateOrderTotals } from "@/features/pos/lib/order-totals"

const retailCustomerLabel = "ລູກຄ້າທົ່ວໄປ"

type OrderPanelProps = {
  tableLabel: string
  tableCount: number
  cart: CartLine[]
  orderDiscount: OrderDiscount | null
  selectedCustomer: PosCafeCustomer | null
  customerMode: "retail" | "member"
  customerSearch: string
  customerMatches: PosCafeCustomer[]
  quickCustomerName: string
  maxRedeemPoints: number
  redeemPoints: number
  loyaltyDiscountAmount: number
  earnedPoints: number
  pointEarnAmount: number
  pointValue: number
  maxRedeemRate: number
  customerCodePrefix: string
  customerFeatureEnabled: boolean
  orderNote: string
  onChangeCustomerSearch: (value: string) => void
  onChangeTableLabel: (tableLabel: string) => void
  onChangeCustomerMode: (mode: "retail" | "member") => void
  onChangeQuickCustomerName: (value: string) => void
  onSelectCustomer: (customer: PosCafeCustomer) => void
  onClearCustomer: () => void
  onCreateQuickCustomer: () => void
  creatingQuickCustomer?: boolean
  onApplyMaxPoints: () => void
  onClearRedeemPoints: () => void
  onChangeNote: (note: string) => void
  onIncrement: (lineId: string) => void
  onDecrement: (lineId: string) => void
  onEditLine: (lineId: string) => void
  onClear: () => void
  onClearDiscount: () => void
  onSaveOrder: () => void
  onPrintTemporaryReceipt: () => void
  onCheckout: () => void
  showOrderNote: boolean
  onShowOrderNote: () => void
  savingOrder?: boolean
  readOnly?: boolean
}

export function OrderPanel({
  tableLabel,
  tableCount,
  cart,
  orderDiscount,
  selectedCustomer,
  customerMode,
  customerSearch,
  customerMatches,
  quickCustomerName,
  maxRedeemPoints,
  redeemPoints,
  loyaltyDiscountAmount,
  earnedPoints,
  pointEarnAmount,
  pointValue,
  maxRedeemRate,
  customerCodePrefix,
  customerFeatureEnabled,
  orderNote,
  onChangeCustomerSearch,
  onChangeTableLabel,
  onChangeCustomerMode,
  onChangeQuickCustomerName,
  onSelectCustomer,
  onClearCustomer,
  onCreateQuickCustomer,
  creatingQuickCustomer = false,
  onApplyMaxPoints,
  onClearRedeemPoints,
  onChangeNote,
  onIncrement,
  onDecrement,
  onEditLine,
  onClear,
  onClearDiscount,
  onSaveOrder,
  onPrintTemporaryReceipt,
  onCheckout,
  showOrderNote,
  onShowOrderNote,
  savingOrder = false,
  readOnly = false,
}: OrderPanelProps) {
  const [showTablePicker, setShowTablePicker] = useState(false)
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)
  const [confirmUsePointsOpen, setConfirmUsePointsOpen] = useState(false)
  const { subtotal, discountAmount, total: beforeLoyaltyTotal } = calculateOrderTotals(
    cart,
    orderDiscount,
  )
  const total = Math.max(0, beforeLoyaltyTotal - loyaltyDiscountAmount)
  const customerLabel = selectedCustomer?.name ?? retailCustomerLabel
  const tableOptions = Array.from(
    { length: Math.max(1, Math.min(200, Math.round(tableCount || 12))) },
    (_, index) => `ໂຕະ ${String(index + 1).padStart(2, "0")}`,
  )
  const hasSelectedTable = tableLabel !== UNSELECTED_TABLE_LABEL
  const validMemberPhone = isValidMemberPhone(customerSearch)
  const hasMemberPhoneInput = customerSearch.trim().length > 0

  useEffect(() => {
    if (orderNote.trim()) onShowOrderNote()
  }, [onShowOrderNote, orderNote])

  function handleClearCart() {
    if (readOnly || cart.length === 0) return
    setConfirmClearOpen(true)
  }

  return (
    <>
    <aside className="flex min-h-0 w-full min-w-0 shrink-0 flex-col rounded-lg border border-[#ded4c8] bg-white">
      <div className="flex h-[58px] shrink-0 items-center justify-between gap-3 border-b border-[#ded4c8] bg-[#fbfaf7] px-4">
        <h2 className="flex items-center text-base font-bold text-[#2f2419]" aria-label="ກະຕ່່າ">
          <ShoppingCart className="h-5 w-5" />
        </h2>
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onChangeCustomerMode("retail")
              setShowTablePicker(false)
            }}
            disabled={readOnly}
            className={`flex h-10 min-w-0 max-w-[130px] cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-55 ${
              customerMode === "retail"
                ? "border-[#2f2419] bg-[#2f2419] text-white"
                : "border-[#ded4c8] bg-white text-[#4f4032] hover:bg-[#f7f1e9]"
            }`}
            title={customerLabel}
          >
            <span className="truncate">{customerLabel}</span>
          </button>
          {customerFeatureEnabled ? (
            <button
              type="button"
              onClick={() => {
                onChangeCustomerMode("member")
                setShowTablePicker(false)
              }}
              disabled={readOnly}
              className={`flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-55 ${
                customerMode === "member"
                  ? "border-[#2f2419] bg-[#2f2419] text-white"
                  : "border-[#ded4c8] bg-white text-[#4f4032] hover:bg-[#f7f1e9]"
              }`}
              title="ສະມາຊິກ"
            >
              <span>ສະມາຊິກ</span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setShowTablePicker((value) => !value)}
            disabled={readOnly}
            className={`flex h-10 min-w-0 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-55 ${
              showTablePicker || hasSelectedTable
                ? "border-[#2f2419] bg-[#2f2419] text-white"
                : "border-[#ded4c8] bg-white text-[#4f4032] hover:bg-[#f7f1e9]"
            }`}
            title={tableLabel}
          >
            <span className="truncate">{tableLabel}</span>
          </button>
          <button
            type="button"
            onClick={handleClearCart}
            disabled={readOnly || cart.length === 0}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="ລຶບອໍເດີ"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {cart.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#ded4c8] p-6 text-center text-sm font-bold text-[#756656]">
            ຍັງບໍ່ມີສິນຄ້າໃນອໍເດີ.
          </div>
        ) : null}
        {cart.map((line) => (
          <CartLineItem
            key={line.id}
            line={line}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onEdit={onEditLine}
            readOnly={readOnly}
          />
        ))}
      </div>

      <div className="shrink-0 border-t border-[#ded4c8] px-4 pb-4 pt-3">
        {showTablePicker ? (
          <section className="mb-3 rounded-lg border border-[#ded4c8] bg-[#fbfaf7] p-3">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2f2419]">ໂຕະ</h3>
              <span className="text-xs font-black text-[#8a7560]">{tableLabel}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  onChangeTableLabel(UNSELECTED_TABLE_LABEL)
                  setShowTablePicker(false)
                }}
                disabled={readOnly}
                className={`col-span-2 h-10 cursor-pointer rounded-lg border px-2 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-55 ${
                  tableLabel === UNSELECTED_TABLE_LABEL
                    ? "border-[#2f2419] bg-[#2f2419] text-white"
                    : "border-[#ded4c8] bg-white text-[#4f4032] hover:bg-[#f7f1e9]"
                }`}
              >
                ບໍ່ມີໂຕະ
              </button>
              {tableOptions.map((option) => {
                const selected = option === tableLabel

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChangeTableLabel(option)
                      setShowTablePicker(false)
                    }}
                    disabled={readOnly}
                    className={`h-10 cursor-pointer rounded-lg border px-2 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-55 ${
                      selected
                        ? "border-[#2f2419] bg-[#2f2419] text-white"
                        : "border-[#ded4c8] bg-white text-[#4f4032] hover:bg-[#f7f1e9]"
                    }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </section>
        ) : null}

        {customerFeatureEnabled && customerMode === "member" ? (
        <section className="mb-3 rounded-lg border border-[#ded4c8] bg-[#fbfaf7] p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2f2419]">ລູກຄ້າ</h3>
            {selectedCustomer ? (
              <button
                type="button"
                onClick={onClearCustomer}
                disabled={readOnly}
                className="text-xs font-black text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-45"
              >
                ລຶບ
              </button>
            ) : null}
          </div>

          <div className="mb-2 rounded-lg border border-[#eadfce] bg-white px-3 py-2 text-xs font-bold leading-5 text-[#756656]">
            <div>
              ລະຫັດລູກຄ້າໃໝ່: {customerCodePrefix || "CM"}0001
            </div>
            <div>
              ສະສົມອັດຕະໂນມັດ: 1 ຄະແນນ / {formatVnd(pointEarnAmount)}
            </div>
            <div>
              ໃຊ້ຫຼຸດລາຄາ: 1 ຄະແນນ = {formatVnd(pointValue)} · ສູງສຸດ {maxRedeemRate.toLocaleString("vi-VN")}%
            </div>
          </div>

          {selectedCustomer ? (
            <div>
              <div className="rounded-lg border border-[#ded4c8] bg-white p-3 text-sm">
                <div className="truncate font-bold text-[#2f2419]">{selectedCustomer.name}</div>
                <div className="mt-1 truncate font-semibold text-[#756656]">{selectedCustomer.phone}</div>
                <div className="mt-2 text-xs font-black text-[#2d8a33]">
                  ຄະແນນປັດຈຸບັນ: {selectedCustomer.points.toLocaleString("vi-VN")}
                </div>
              </div>
              <div className="mt-3 rounded-lg border border-[#ded4c8] bg-white p-3 text-xs font-bold text-[#4f4032]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span>ໃຊ້ຫຼຸດໄດ້ສູງສຸດ {maxRedeemPoints.toLocaleString("vi-VN")} ຄະແນນ</span>
                  {redeemPoints > 0 ? (
                    <button
                      type="button"
                      onClick={onClearRedeemPoints}
                      disabled={readOnly}
                      className="font-black text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      ຍົກເລີກຄະແນນ
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmUsePointsOpen(true)}
                      disabled={readOnly || maxRedeemPoints <= 0}
                      className="font-black text-[#2f2419] hover:underline disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      ໃຊ້ຄະແນນ
                    </button>
                  )}
                </div>
                <div className="mt-2">
                  ຈະໄດ້ຫຼັງຊຳລະ: +{earnedPoints.toLocaleString("vi-VN")} ຄະແນນ
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                value={customerSearch}
                onChange={(event) => onChangeCustomerSearch(event.target.value)}
                disabled={readOnly}
                inputMode="numeric"
                maxLength={10}
                className="h-10 w-full rounded-lg border border-[#ded4c8] bg-white px-3 text-sm font-bold text-[#2f2419] outline-none transition placeholder:text-[#a59686] focus:border-[#a97743] focus:ring-3 focus:ring-[#ead7bf]"
                placeholder="ໃສ່ເບີໂທ / ຄົ້ນຫາລູກຄ້າສະສົມຄະແນນ"
              />
              {hasMemberPhoneInput && !validMemberPhone ? (
                <p className="text-xs font-bold text-red-500">
                  ເບີໂທຕ້ອງຂຶ້ນຕົ້ນ 209, 207, 205 ຫຼື 202 ແລະຄົບ 10 ໂຕເລກ.
                </p>
              ) : null}
              {customerMatches.length ? (
                <div className="max-h-28 overflow-y-auto rounded-lg border border-[#ded4c8] bg-white">
                  {customerMatches.slice(0, 4).map((customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      onClick={() => onSelectCustomer(customer)}
                      disabled={readOnly}
                      className="flex w-full cursor-pointer items-center justify-between gap-3 border-b border-[#eee6dc] px-3 py-2 text-left text-sm last:border-b-0 hover:bg-[#fbfaf7] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <span>
                        <span className="block font-black text-[#2f2419]">{customer.name}</span>
                        <span className="text-xs font-semibold text-[#756656]">{customer.phone}</span>
                      </span>
                      <span className="text-xs font-black text-[#2d8a33]">
                        {customer.points} ຄະແນນ
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
              {validMemberPhone ? (
                <div className="grid grid-cols-1 gap-2 2xl:grid-cols-[minmax(0,1fr)_auto]">
                  <input
                    value={quickCustomerName}
                    onChange={(event) => onChangeQuickCustomerName(event.target.value)}
                    disabled={readOnly}
                    className="h-10 min-w-0 rounded-lg border border-[#ded4c8] bg-white px-3 text-sm font-bold text-[#2f2419] outline-none transition placeholder:text-[#a59686] focus:border-[#a97743] focus:ring-3 focus:ring-[#ead7bf]"
                    placeholder="ຊື່ລູກຄ້າໃໝ່"
                  />
                  <button
                    type="button"
                    onClick={onCreateQuickCustomer}
                    disabled={readOnly || creatingQuickCustomer}
                    className="h-10 cursor-pointer rounded-lg bg-[#2f2419] px-3 text-xs font-black text-white transition hover:bg-[#4a3726] disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {creatingQuickCustomer ? "ກຳລັງເພີ່ມ" : "ເພີ່ມ & ໃຊ້"}
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </section>
        ) : null}

        {showOrderNote ? (
          <label className="relative block">
            <input
              value={orderNote}
              onChange={(event) => onChangeNote(event.target.value)}
              disabled={readOnly}
              className="h-11 w-full rounded-lg border border-[#ded4c8] bg-white px-4 pr-12 text-sm font-semibold text-[#2f2419] outline-none placeholder:text-[#a59686] focus:border-[#a97743] focus:ring-3 focus:ring-[#ead7bf]"
              placeholder="ໝາຍເຫດອໍເດີ..."
            />
            <Edit3 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9a8064]" />
          </label>
        ) : null}

        <div className="mt-3 space-y-2.5 border-b border-[#ded4c8] pb-3 text-sm font-semibold text-[#4f4032]">
          <SummaryRow label="ລວມ" value={formatVnd(subtotal)} />
          <SummaryRow
            label={
              orderDiscount ? (
                <span className="flex min-w-0 flex-wrap items-center gap-2">
                  <span>ສ່ວນຫຼຸດ</span>
                  <span className="max-w-[160px] truncate rounded-md bg-[#fff1dc] px-2 py-1 text-xs font-black text-[#8a5f36]">
                    {orderDiscount.reason || orderDiscount.label}
                  </span>
                </span>
              ) : (
                "ສ່ວນຫຼຸດ"
              )
            }
            value={`- ${formatVnd(discountAmount)}`}
            valueTone="danger"
            onClear={!readOnly && orderDiscount?.source === "manual" ? onClearDiscount : undefined}
          />
          {loyaltyDiscountAmount > 0 ? (
            <SummaryRow
              label={`ໃຊ້ຄະແນນ (${redeemPoints.toLocaleString("vi-VN")} ຄະແນນ)`}
              value={`- ${formatVnd(loyaltyDiscountAmount)}`}
              valueTone="danger"
              onClear={readOnly ? undefined : onClearRedeemPoints}
            />
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 py-3">
          <span className="text-base font-bold text-[#2f2419]">ລວມທັງໝົດ</span>
          <span className="text-[26px] font-extrabold tracking-normal text-[#2f2419]">
            {formatVnd(total)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onSaveOrder}
            disabled={readOnly || cart.length === 0 || savingOrder}
            className="flex h-12 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#ded4c8] bg-white px-2 text-xs font-bold text-[#4f4032] transition hover:bg-[#f7f1e9] disabled:cursor-not-allowed disabled:opacity-55"
          >
            <Save className="h-4 w-4 shrink-0" />
            <span className="min-w-0 truncate">
              {savingOrder ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກອໍເດີ"}
            </span>
          </button>
          <button
            type="button"
            onClick={onPrintTemporaryReceipt}
            disabled={readOnly || cart.length === 0}
            className="flex h-12 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#ded4c8] bg-white px-2 text-xs font-bold text-[#4f4032] transition hover:bg-[#f7f1e9] disabled:cursor-not-allowed disabled:opacity-55"
          >
            <Printer className="h-4 w-4 shrink-0" />
            <span className="min-w-0 truncate">ພິມໃບບິນຊົ່ວຄາວ</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onCheckout}
          className="mt-3 flex h-14 w-full cursor-pointer items-center justify-between rounded-md bg-[#2f2419] px-5 text-white transition hover:bg-[#4a3726] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={readOnly || cart.length === 0}
        >
          <span className="text-lg font-bold">ຊຳລະເງິນ</span>
          <span className="flex min-w-0 items-center gap-3 text-lg font-bold">
            {formatVnd(total)}
            <span className="text-2xl">→</span>
          </span>
        </button>
      </div>
    </aside>
    <PosConfirmDialog
      open={confirmClearOpen}
      title="ລຶບກະຕ່່ານີ້ບໍ?"
      description="ລາຍການສິນຄ້າ, ໝາຍເຫດ ແລະ ສ່ວນຫຼຸດໃນ ກະຕ່່າ ຈະຖືກລຶບອອກ."
      confirmLabel="ລຶບກະຕ່່າ"
      cancelLabel="ຍົກເລີກ"
      onCancel={() => setConfirmClearOpen(false)}
      onConfirm={() => {
        setConfirmClearOpen(false)
        onClear()
      }}
    />
    <PosConfirmDialog
      open={confirmUsePointsOpen}
      tone="default"
      title="ໃຊ້ຄະແນນລູກຄ້າບໍ?"
      description={`ຈະໃຊ້ ${maxRedeemPoints.toLocaleString("vi-VN")} ຄະແນນ ເພື່ອຫຼຸດ ${formatVnd(maxRedeemPoints * pointValue)} ໃນບິນນີ້.`}
      confirmLabel="ໃຊ້ຄະແນນ"
      cancelLabel="ບໍ່ໃຊ້"
      onCancel={() => setConfirmUsePointsOpen(false)}
      onConfirm={() => {
        setConfirmUsePointsOpen(false)
        onApplyMaxPoints()
      }}
    />
    </>
  )
}

function CartLineItem({
  line,
  onIncrement,
  onDecrement,
  onEdit,
  readOnly = false,
}: {
  line: CartLine
  onIncrement: (lineId: string) => void
  onDecrement: (lineId: string) => void
  onEdit: (lineId: string) => void
  readOnly?: boolean
}) {
  return (
    <div className="grid grid-cols-[52px_minmax(0,1fr)_auto] gap-3 border-b border-[#eee6dc] py-3 last:border-b-0">
      <img
        src={line.image}
        alt={line.name}
        className="h-[52px] w-[52px] rounded-lg object-cover"
      />
      <div className="min-w-0">
        <h3 className="truncate text-[15px] font-extrabold text-[#2f2419]">
          {line.name}
        </h3>
        {line.note ? (
          <p className="mt-1 truncate text-[13px] font-semibold text-[#756656]">
            {line.note}
          </p>
        ) : null}
        <div className="mt-3 flex items-center gap-3">
          <QuantityButton
            onClick={() => onDecrement(line.id)}
            label="-"
            disabled={readOnly}
          />
          <span className="min-w-5 text-center text-sm font-extrabold text-[#2f2419]">
            {line.quantity}
          </span>
          <QuantityButton
            onClick={() => onIncrement(line.id)}
            label="+"
            disabled={readOnly}
          />
        </div>
      </div>
      <div className="flex flex-col items-end justify-between gap-2 pl-2">
        <button
          type="button"
          onClick={() => onEdit(line.id)}
          disabled={readOnly}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#756656] transition hover:bg-[#f1e8dd] hover:text-[#2f2419] disabled:cursor-not-allowed disabled:opacity-45"
          aria-label={`ແກ້ໄຂ ${line.name}`}
        >
          <SquarePen className="h-4.5 w-4.5" />
        </button>
        <div className="whitespace-nowrap text-[15px] font-black text-[#2f2419]">
          {formatVnd(line.price * line.quantity)}
        </div>
      </div>
    </div>
  )
}

function QuantityButton({
  label,
  onClick,
  disabled = false,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        if (disabled) return
        onClick()
      }}
      disabled={disabled}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#ded4c8] bg-white text-lg font-black text-[#4f4032] transition hover:bg-[#f7f1e9] disabled:cursor-not-allowed disabled:opacity-45"
      aria-label={label}
    >
      {label === "+" ? <Plus className="h-4 w-4" /> : label}
    </button>
  )
}

function SummaryRow({
  label,
  value,
  valueTone = "default",
  arrow = false,
  onClear,
}: {
  label: ReactNode
  value: string
  valueTone?: "default" | "danger"
  arrow?: boolean
  onClear?: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="min-w-0 flex-1">{label}</span>
      <span className={`flex shrink-0 items-center gap-2 font-bold ${
        valueTone === "danger" ? "text-[#d7272f]" : "text-[#2f2419]"
      }`}>
        {value} {arrow ? <span className="text-[#9a8064]">›</span> : null}
        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-[#756656] transition hover:bg-[#f1e8dd] hover:text-red-500"
            aria-label="ລຶບສ່ວນຫຼຸດ"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </span>
    </div>
  )
}

function isValidMemberPhone(value: string) {
  return /^(209|207|205|202)\d{7}$/.test(value.replace(/[^\d]/g, ""))
}
