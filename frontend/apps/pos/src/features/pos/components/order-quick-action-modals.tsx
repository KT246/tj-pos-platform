import { AnimatePresence, motion } from "framer-motion"
import { BadgePercent, Layers3, Tag, X } from "lucide-react"
import type { ReactNode } from "react"
import { useMemo, useState } from "react"

import type { CafePromotion } from "@/features/pos/api/pos-promotions-api"
import type { CafeCombo } from "@/features/pos/api/pos-combos-api"
import { formatKipAmount, formatVnd } from "@/features/pos/lib/format"
import type { OrderDiscount } from "@/features/pos/stores/pos-store"
import { cn } from "@/lib/utils"

export function ComboPickerModal({
  open,
  combos,
  isLoading = false,
  onClose,
  onSelectCombo,
}: {
  open: boolean
  combos: CafeCombo[]
  isLoading?: boolean
  onClose: () => void
  onSelectCombo: (combo: CafeCombo) => void
}) {
  return (
    <BaseModal
      open={open}
      title="ຄອມໂບ"
      onClose={onClose}
      maxWidthClassName="max-w-[980px]"
    >
      {isLoading ? (
        <div className="rounded-xl border border-[#eadfce] bg-white p-5 text-center text-sm font-black text-[#7c6448]">
          ກຳລັງໂຫຼດຄອມໂບ...
        </div>
      ) : null}
      {!isLoading && combos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#eadfce] bg-white p-5 text-center text-sm font-black text-[#7c6448]">
          ຍັງບໍ່ມີຄອມໂບທີ່ເປີດໃຊ້.
        </div>
      ) : null}
      <div className="grid grid-cols-3 gap-3">
        {!isLoading && combos.map((combo) => {
          const productTotal = combo.products.reduce(
            (sum, product) => sum + product.price * product.quantity,
            0,
          )
          const savings = Math.max(0, productTotal - combo.price)

          return (
            <button
              key={combo.id}
              type="button"
              onClick={() => onSelectCombo(combo)}
              className="min-w-0 cursor-pointer overflow-hidden rounded-md border border-[#ded4c8] bg-white text-left shadow-[0_10px_24px_rgba(80,54,27,0.06)] transition hover:border-[#b88b5c] hover:bg-[#fffaf4]"
            >
              <img
                src={combo.image}
                alt={combo.name}
                className="h-32 w-full object-cover"
              />
              <span className="block p-4">
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black text-[#3b2511]">
                      {combo.name}
                    </span>
                    <span className="mt-1 block truncate text-xs font-bold text-[#8a7560]">
                      {combo.subtitle || `${combo.products.length} ລາຍການ`}
                    </span>
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#f4ece3] text-[#5a3718]">
                    <Layers3 className="h-5 w-5" />
                  </span>
                </span>
                <span className="mt-3 grid grid-cols-2 gap-2 border-t border-[#f0e6da] pt-3 text-xs font-bold text-[#6f5a43]">
                  <span>
                    <span className="block text-[#9a8064]">ລາຄາ</span>
                    <span className="mt-1 block text-sm font-black text-[#3b2511]">
                      {formatVnd(combo.price)}
                    </span>
                  </span>
                  <span>
                    <span className="block text-[#9a8064]">ປະຢັດ</span>
                    <span className="mt-1 block text-sm font-black text-[#2f8748]">
                      {formatVnd(savings)}
                    </span>
                  </span>
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </BaseModal>
  )
}

export function PromotionPickerModal({
  open,
  promotions,
  isLoading = false,
  onClose,
}: {
  open: boolean
  promotions: CafePromotion[]
  isLoading?: boolean
  onClose: () => void
}) {
  return (
    <BaseModal
      open={open}
      title="ໂປຣໂມຊັນ"
      onClose={onClose}
      maxWidthClassName="max-w-[980px]"
    >
      <div className="mb-4 rounded-xl border border-[#f8d7a6] bg-[#fff8e8] px-4 py-3 text-sm font-bold text-[#8a5f36]">
        ລາຍການນີ້ໃຊ້ເພື່ອເບິ່ງເງື່ອນໄຂເທົ່ານັ້ນ. ລະບົບຈະຄຳນວນ ແລະ ນຳໃຊ້ໂປຣໂມຊັນອັດຕະໂນມັດ.
      </div>
      {isLoading ? (
        <div className="rounded-xl border border-[#eadfce] bg-white p-5 text-center text-sm font-black text-[#7c6448]">
          ກຳລັງໂຫຼດໂປຣໂມຊັນ...
        </div>
      ) : null}
      {!isLoading && promotions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#eadfce] bg-white p-5 text-center text-sm font-black text-[#7c6448]">
          ຍັງບໍ່ມີໂປຣໂມຊັນທີ່ເປີດໃຊ້.
        </div>
      ) : null}
      <div className="grid grid-cols-3 gap-3">
        {!isLoading && promotions.map((promotion) => (
            <article
              key={promotion.id}
              className="min-w-0 rounded-md border border-[#ded4c8] bg-white p-4 text-left shadow-[0_10px_24px_rgba(80,54,27,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#fff3dd] text-[#8a5f36]">
                  <BadgePercent className="h-5 w-5" />
                </span>
                <span className="min-w-0 truncate rounded-full bg-[#f4ece3] px-3 py-1 text-xs font-black text-[#5a3718]">
                  {promotion.code || promotion.typeLabel}
                </span>
              </div>
              <h3 className="mt-3 line-clamp-2 text-sm font-black leading-5 text-[#3b2511]">
                {promotion.name}
              </h3>
              <p className="mt-1 text-xs font-bold text-[#8a7560]">{promotion.typeLabel}</p>
              <dl className="mt-3 space-y-2 border-t border-[#f0e6da] pt-3 text-xs font-bold text-[#6f5a43]">
                <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-2">
                  <dt className="text-[#9a8064]">ມູນຄ່າ</dt>
                  <dd className="min-w-0 truncate text-[#3b2511]">
                    {formatPromotionDiscount(promotion)}
                  </dd>
                </div>
                <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-2">
                  <dt className="text-[#9a8064]">ໃຊ້ກັບ</dt>
                  <dd className="min-w-0 truncate text-[#3b2511]">
                    {promotion.appliesTo || formatApplyScope(promotion.applyScope)}
                  </dd>
                </div>
                <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-2">
                  <dt className="text-[#9a8064]">ເງື່ອນໄຂ</dt>
                  <dd className="min-w-0 leading-5 text-[#3b2511]">
                    {buildPromotionRuleText(promotion)}
                  </dd>
                </div>
              </dl>
            </article>
        ))}
      </div>
    </BaseModal>
  )
}

export function ManualDiscountModal({
  open,
  subtotal,
  onClose,
  onApply,
}: {
  open: boolean
  subtotal: number
  onClose: () => void
  onApply: (discount: OrderDiscount) => void
}) {
  const [mode, setMode] = useState<"amount" | "percent">("amount")
  const [value, setValue] = useState("")
  const [reason, setReason] = useState("")
  const numericValue = Number(value.replace(/\D/g, ""))
  const previewAmount = useMemo(() => {
    const amount =
      mode === "percent"
        ? Math.round((subtotal * Math.min(numericValue, 100)) / 100)
        : numericValue

    return Math.min(subtotal, Math.max(0, amount))
  }, [mode, numericValue, subtotal])
  const canApply = subtotal > 0 && previewAmount > 0

  function applyDiscount() {
    if (!canApply) return

    onApply({
      id: `manual-${Date.now()}`,
      source: "manual",
      label: mode === "percent" ? `ຫຼຸດ ${Math.min(numericValue, 100)}%` : "ຫຼຸດແບບກຳນົດເອງ",
      mode,
      value: mode === "percent" ? Math.min(numericValue, 100) : previewAmount,
      reason: reason.trim() || undefined,
    })
    setValue("")
    setReason("")
    setMode("amount")
    onClose()
  }

  return (
    <BaseModal open={open} title="ຫຼຸດລາຄາອໍເດີ" onClose={onClose}>
      {subtotal <= 0 ? (
        <div className="mb-4 rounded-xl border border-[#f8d7a6] bg-[#fff8e8] px-4 py-3 text-sm font-bold text-[#8a5f36]">
          ອໍເດີຍັງຫວ່າງ. ເພີ່ມລາຍການໃສ່ອໍເດີກ່ອນຫຼຸດລາຄາ.
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-3">
        <ModeButton active={mode === "amount"} onClick={() => setMode("amount")}>
          ຫຼຸດເປັນເງິນ
        </ModeButton>
        <ModeButton active={mode === "percent"} onClick={() => setMode("percent")}>
          ຫຼຸດ %
        </ModeButton>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-bold text-[#5f4a35]">
          {mode === "amount" ? "ຈຳນວນເງິນທີ່ຫຼຸດ" : "ເປີເຊັນທີ່ຫຼຸດ"}
        </span>
        <span className="mt-2 flex h-12 items-center rounded-xl border border-[#eadfce] bg-white px-4 focus-within:border-[#b98b56] focus-within:ring-4 focus-within:ring-[#f4dec2]">
          <input
            value={
              value
                ? mode === "amount"
                  ? formatKipAmount(numericValue)
                  : numericValue.toLocaleString("en-US")
                : ""
            }
            onChange={(event) => setValue(event.target.value)}
            inputMode="numeric"
            className="min-w-0 flex-1 bg-transparent text-base font-black text-[#3b2511] outline-none"
          />
          <span className="ml-2 text-sm font-black text-[#7c6448]">
            {mode === "amount" ? "ກີບ" : "%"}
          </span>
        </span>
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-bold text-[#5f4a35]">ເຫດຜົນການຫຼຸດລາຄາ</span>
        <input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className="mt-2 h-12 w-full rounded-xl border border-[#eadfce] bg-white px-4 text-sm font-semibold text-[#3b2511] outline-none focus:border-[#b98b56] focus:ring-4 focus:ring-[#f4dec2]"
          placeholder="ຕົວຢ່າງ: ລູກຄ້າ VIP, ບໍລິການຜິດພາດ..."
        />
      </label>

      <div className="mt-4 rounded-xl bg-[#fffaf4] p-4 text-sm font-bold text-[#5f4a35]">
        <div className="flex justify-between">
          <span>ລວມ</span>
          <span>{formatVnd(subtotal)}</span>
        </div>
        <div className="mt-2 flex justify-between text-[#c23d2a]">
          <span>ຈະຫຼຸດ</span>
          <span>- {formatVnd(previewAmount)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={applyDiscount}
        disabled={!canApply}
        className="mt-5 h-12 w-full cursor-pointer rounded-xl bg-[linear-gradient(135deg,#5a3718_0%,#3b2511_100%)] text-sm font-black text-white shadow-[0_16px_30px_rgba(75,50,26,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ນຳໃຊ້ສ່ວນຫຼຸດ
      </button>
    </BaseModal>
  )
}

function BaseModal({
  open,
  title,
  children,
  onClose,
  maxWidthClassName = "max-w-[470px]",
}: {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  maxWidthClassName?: string
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#2a1c10]/48 p-5 backdrop-blur-[2px]"
          onClick={onClose}
        >
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className={cn(
              "max-h-[88vh] w-full overflow-y-auto rounded-2xl border border-[#eadfce] bg-white p-5 shadow-[0_24px_70px_rgba(36,22,10,0.28)]",
              maxWidthClassName,
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-black text-[#3b2511]">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#7c6448] transition hover:bg-[#fbf4ea]"
                aria-label="ປິດ"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5">{children}</div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function ModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-black transition",
        active
          ? "border-[#5a3718] bg-[#5a3718] text-white"
          : "border-[#eadfce] bg-white text-[#5f4a35] hover:bg-[#fbf4ea]",
      )}
    >
      <Tag className="h-4 w-4" />
      {children}
    </button>
  )
}

function formatApplyScope(value: CafePromotion["applyScope"]) {
  const labels: Record<CafePromotion["applyScope"], string> = {
    all_order: "ທັງອໍເດີ",
    category: "ໝວດສິນຄ້າ",
    product: "ສິນຄ້າ",
    combo: "ຄອມໂບ",
    customer_group: "ກຸ່ມລູກຄ້າ",
  }

  return labels[value]
}

function buildPromotionRuleText(promotion: CafePromotion) {
  if (promotion.condition) return promotion.condition

  const parts = [
    promotion.minSubtotal > 0
      ? `ຍອດຂັ້ນຕ່ຳ ${formatKip(promotion.minSubtotal)}`
      : null,
    promotion.period || null,
    promotion.startTime && promotion.endTime
      ? `ເວລາ ${promotion.startTime} - ${promotion.endTime}`
      : null,
    promotion.daysOfWeek.length ? formatPromotionDays(promotion.daysOfWeek) : null,
  ].filter(Boolean)

  return parts.join(" / ") || "-"
}

function formatPromotionDiscount(promotion: CafePromotion) {
  if (promotion.type === "percent") return `${promotion.discountValue.toLocaleString("vi-VN")}%`
  if (promotion.type === "bogo") return promotion.discountValue.toLocaleString("vi-VN")

  return formatKip(promotion.discountValue)
}

function formatKip(value: number) {
  return `${Math.round(value).toLocaleString("en-US")} ກີບ`
}

function formatPromotionDays(values: number[]) {
  const labels = [
    { value: 1, label: "ວັນຈັນ" },
    { value: 2, label: "ວັນອັງຄານ" },
    { value: 3, label: "ວັນພຸດ" },
    { value: 4, label: "ວັນພະຫັດ" },
    { value: 5, label: "ວັນສຸກ" },
    { value: 6, label: "ວັນເສົາ" },
    { value: 0, label: "ວັນອາທິດ" },
  ]

  return labels
    .filter((day) => values.includes(day.value))
    .map((day) => day.label)
    .join(", ")
}
