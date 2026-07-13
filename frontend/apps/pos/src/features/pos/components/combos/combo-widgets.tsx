import {
  Check,
  Edit2,
  Eye,
  PackageOpen,
  SquarePen,
  Trash2,
  XCircle,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState, type ComponentType, type ReactNode } from "react"

import type {
  CafeCombo,
  ComboKpi,
  ComboProduct,
  ComboStatus,
  SaveComboBody,
} from "@/features/pos/api/pos-combos-api"
import { formatVnd } from "@/features/pos/lib/format"
import { cn } from "@/lib/utils"

const fallbackImage =
  "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=520&q=80"

const statusLabel: Record<ComboStatus, string> = {
  active: "ເປີດ",
  paused: "ປິດ",
  stopped: "ປິດ",
}

const statusClass: Record<ComboStatus, string> = {
  active: "border-[#d8eadb] bg-[#eef9f0] text-[#2f8748]",
  paused: "border-[#ffd9d4] bg-[#fff0ee] text-[#d33c32]",
  stopped: "border-[#ffd9d4] bg-[#fff0ee] text-[#d33c32]",
}

const kpiToneClass: Record<ComboKpi["tone"], string> = {
  brown: "bg-[#f7ead9] text-[#5a3718]",
  green: "bg-[#e6f7e9] text-[#2f8748]",
  amber: "bg-[#fff3d9] text-[#b86a14]",
  red: "bg-[#ffe6e4] text-[#d33c32]",
}

const statusOptions: Array<{ value: ComboStatus; label: string }> = [
  { value: "active", label: statusLabel.active },
  { value: "paused", label: statusLabel.paused },
]

export type ComboFormDraft = SaveComboBody

export type ComboProductOption = {
  name: string
  price: number
  image: string
  categoryName: string
}

type ComboKpiCardProps = {
  kpi: ComboKpi
  icon: ComponentType<{ className?: string }>
}

export function ComboKpiCard({ kpi, icon: Icon }: ComboKpiCardProps) {
  return (
    <article className="flex h-[92px] min-w-0 items-center gap-4 border-r border-[#eadfce] px-4 last:border-r-0">
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-md",
          kpiToneClass[kpi.tone],
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-bold uppercase tracking-normal text-[#7c6448]">
          {localizeComboText(kpi.title)}
        </p>
        <p className="mt-1 text-2xl font-black leading-none text-[#3b2511]">
          {kpi.value}
        </p>
        <p className="mt-1 truncate text-xs font-bold text-[#7c6448]">
          {localizeComboText(kpi.subtitle)}
        </p>
      </div>
    </article>
  )
}

type ComboTableProps = {
  combos: CafeCombo[]
  selectedComboId: string
  totalCombos: number
  loading?: boolean
  onSelectCombo: (comboId: string) => void
  onEditCombo: (combo: CafeCombo) => void
}

export function ComboTable({
  combos,
  selectedComboId,
  totalCombos,
  loading = false,
  onSelectCombo,
  onEditCombo,
}: ComboTableProps) {
  const hasCombos = combos.length > 0

  return (
    <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden border border-[#eadfce] bg-white">
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[860px] border-separate border-spacing-0 text-left">
          <thead className="sticky top-0 z-10 bg-[#fbfaf7]">
            <tr className="text-xs font-bold uppercase tracking-normal text-[#6f5c49]">
              <HeaderCell>#</HeaderCell>
              <HeaderCell>ຄອມໂບ</HeaderCell>
              <HeaderCell>ລາຄາຂາຍ</HeaderCell>
              <HeaderCell>ລາຄາລາຍການ</HeaderCell>
              <HeaderCell>ສິນຄ້າ</HeaderCell>
              <HeaderCell>ສະຖານະ</HeaderCell>
              <HeaderCell align="right">ຈັດການ</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <BodyCell className="h-[220px] text-center" colSpan={7}>
                  ກຳລັງໂຫຼດຄອມໂບ...
                </BodyCell>
              </tr>
            )}

            {!loading && !hasCombos && (
              <tr>
                <BodyCell className="h-[220px] text-center" colSpan={7}>
                  ຍັງບໍ່ມີຄອມໂບທີ່ກົງເງື່ອນໄຂ.
                </BodyCell>
              </tr>
            )}

            {!loading &&
              combos.map((combo, index) => {
                const selected = selectedComboId === combo.id
                const productTotal = getComboProductsTotal(combo.products)

                return (
                  <tr
                    key={combo.id}
                    onClick={() => onSelectCombo(combo.id)}
                    className={cn(
                      "group cursor-pointer transition",
                      selected ? "bg-[#fff4e5]" : "bg-white hover:bg-[#fbf7ef]",
                    )}
                  >
                    <BodyCell className="font-black text-[#7c6448]">
                      {index + 1}
                    </BodyCell>
                    <BodyCell>
                      <div className="min-w-0">
                        <p className="truncate font-black text-[#3b2511]">
                          {localizeComboText(combo.name)}
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-[#7c6448]">
                          {localizeComboText(combo.subtitle)}
                        </p>
                      </div>
                    </BodyCell>
                    <BodyCell className="font-black">{formatVnd(combo.price)}</BodyCell>
                    <BodyCell>
                      <span className="font-black text-[#3b2511]">
                        {formatVnd(productTotal)}
                      </span>
                      {productTotal > combo.price ? (
                        <span className="ml-2 text-xs font-bold text-[#2f8748]">
                          -{formatVnd(productTotal - combo.price)}
                        </span>
                      ) : null}
                    </BodyCell>
                    <BodyCell>
                      <span className="inline-flex items-center gap-2 font-bold text-[#7c6448]">
                        <PackageOpen className="h-4 w-4" />
                        {combo.products.length} ລາຍການ
                      </span>
                    </BodyCell>
                    <BodyCell>
                      <ComboStatusBadge status={combo.status} />
                    </BodyCell>
                    <BodyCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <ActionIcon
                          label={`ເບິ່ງ ${combo.name}`}
                          icon={Eye}
                          onClick={() => onSelectCombo(combo.id)}
                        />
                        <ActionIcon
                          label={`ແກ້ໄຂ ${combo.name}`}
                          icon={Edit2}
                          onClick={() => onEditCombo(combo)}
                        />
                      </div>
                    </BodyCell>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      <div className="flex h-[58px] shrink-0 items-center justify-between border-t border-[#eadfce] bg-[#fbfaf7] px-4 text-sm font-bold text-[#5f4a35]">
        <span>
          ສະແດງ {hasCombos ? 1 : 0} - {combos.length} ຈາກ {totalCombos} ຄອມໂບ
        </span>
        <span>50 / ໜ້າ</span>
      </div>
    </div>
  )
}

type ComboDetailPanelProps = {
  combo: CafeCombo | null
  mode: "view" | "create" | "edit"
  draft: ComboFormDraft
  productOptions: ComboProductOption[]
  productCategoryOptions: string[]
  saving?: boolean
  onChange: (combo: Partial<ComboFormDraft>) => void
  onProductChange: (index: number, product: Partial<ComboProduct>) => void
  onConfirmProducts: (products: ComboProductOption[]) => void
  onRemoveProduct: (index: number) => void
  onSave: () => void
  onCancel: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ComboDetailPanel({
  combo,
  mode,
  draft,
  productOptions,
  productCategoryOptions,
  saving = false,
  onChange,
  onProductChange,
  onConfirmProducts,
  onRemoveProduct,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: ComboDetailPanelProps) {
  const [productModalOpen, setProductModalOpen] = useState(false)

  if (mode === "create" || mode === "edit") {
    const productTotal = getComboProductsTotal(draft.products ?? [])
    const comboPrice = Number(draft.price) || 0
    const savings = Math.max(0, productTotal - comboPrice)
    const showPriceSummary = mode === "edit" || (draft.products ?? []).length > 0

    return (
      <aside className="flex h-full min-h-0 flex-col border-l border-[#eadfce] bg-[#fbfaf7]">
        <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-[#eadfce] bg-[#fbfaf7] px-4">
          <h2 className="text-base font-black text-[#3b2511]">
            {mode === "create" ? "ສ້າງຄອມໂບໃໝ່" : "ແກ້ໄຂຄອມໂບ"}
          </h2>
          {mode === "edit" ? <ComboStatusBadge status={draft.status ?? "active"} /> : null}
        </div>

        <form
          noValidate
          className="min-h-0 flex-1 overflow-y-auto p-4"
          onSubmit={(event) => {
            event.preventDefault()
            onSave()
          }}
        >
          <div className="space-y-4">
            <section className="rounded-md border border-[#eadfce] bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <PackageOpen className="h-4 w-4 text-[#6b4423]" />
                <SectionTitle title="ຂໍ້ມູນຄອມໂບ" />
              </div>
              <div className="mt-3 space-y-3">
                <TextField
                  label="ຊື່ຄອມໂບ"
                  value={draft.name ?? ""}
                  required
                  onChange={(value) => onChange({ name: value })}
                />
                <TextField
                  label="ຄຳອະທິບາຍສັ້ນ"
                  value={draft.subtitle ?? ""}
                  placeholder="ຕົວຢ່າງ: ກາເຟ + ເຄັກ"
                  onChange={(value) => onChange({ subtitle: value })}
                />
              </div>

              {mode === "edit" ? (
                <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[#eadfce] pt-3">
                  <NumberField
                    label="ລຳດັບ"
                    value={draft.sortOrder ?? 999}
                    onChange={(value) => onChange({ sortOrder: value })}
                  />
                  <SelectField
                    label="ສະຖານະ"
                    value={draft.status ?? "active"}
                    options={statusOptions}
                    onChange={(value) => onChange({ status: value })}
                  />
                </div>
              ) : null}
            </section>
          </div>

          <section className="mt-4 rounded-md border border-[#eadfce] bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <SectionTitle title="ສິນຄ້າໃນຄອມໂບ" />
                <p className="mt-1 text-xs font-semibold text-[#8a7560]">
                  ເລືອກສິນຄ້າ ແລະ ກຳນົດຈຳນວນ
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProductModalOpen(true)}
                className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-[#eadfce] bg-white px-3 text-sm font-bold text-[#5f4a35] transition hover:bg-[#fbf4ea]"
              >
                <SquarePen className="h-4 w-4" />
                ເພີ່ມ
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {(draft.products ?? []).length ? (
                (draft.products ?? []).map((product, index) => (
                <div key={index} className="rounded-md bg-[#fbfaf7] p-3">
                  <div className="rounded-md bg-white p-2">
                    <div className="flex gap-3">
                      <img
                        src={product.image || fallbackImage}
                        alt={product.name || "combo product"}
                        className="h-16 w-16 shrink-0 rounded-md object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-[#3b2511]">
                              {product.name ? localizeComboText(product.name) : "ຍັງບໍ່ໄດ້ເລືອກສິນຄ້າ"}
                            </p>
                            <p className="mt-1 whitespace-nowrap text-xs font-bold text-[#7c6448]">
                              {formatVnd(product.price)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveProduct(index)}
                            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#d33c32] transition hover:bg-[#fff0ee]"
                            aria-label="ລຶບສິນຄ້າອອກຈາກຄອມໂບ"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-2 flex items-end justify-between gap-3">
                          <QuantityStepper
                            value={product.quantity}
                            onChange={(quantity) => onProductChange(index, { quantity })}
                          />
                          <div className="shrink-0 text-right">
                            <p className="text-[11px] font-bold uppercase text-[#8a7560]">
                              ລວມ
                            </p>
                            <p className="mt-1 whitespace-nowrap text-sm font-black text-[#3b2511]">
                              {formatVnd(product.price * product.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                ))
              ) : (
                <div className="rounded-md border border-dashed border-[#d8c8b4] bg-[#fbfaf7] px-4 py-6 text-center text-sm font-semibold text-[#8a7560]">
                  ກົດເພີ່ມ ແລ້ວເລືອກສິນຄ້າຈາກເມນູ.
                </div>
              )}
            </div>
          </section>

          {showPriceSummary ? (
            <PriceSummaryCard
              productTotal={productTotal}
              comboPrice={comboPrice}
              savings={savings}
              onPriceChange={(value) => onChange({ price: value })}
            />
          ) : null}

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#eadfce] pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="h-11 cursor-pointer rounded-md border border-[#eadfce] bg-white text-sm font-bold text-[#5f4a35] transition hover:bg-[#fbf4ea]"
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-11 cursor-pointer rounded-md bg-[#3b2511] text-sm font-bold text-white transition hover:bg-[#5a3718] disabled:cursor-wait disabled:opacity-70"
            >
              {saving ? "ກຳລັງບັນທຶກ" : "ບັນທຶກ"}
            </button>
          </div>
        </form>

        <ProductPickerModal
          open={productModalOpen}
          options={productOptions}
          categoryOptions={productCategoryOptions}
          selectedProducts={draft.products ?? []}
          onClose={() => setProductModalOpen(false)}
          onConfirm={(products) => {
            onConfirmProducts(products)
            setProductModalOpen(false)
          }}
        />
      </aside>
    )
  }

  if (!combo) {
    return (
      <aside className="flex h-full min-h-0 flex-col border-l border-[#eadfce] bg-white">
        <div className="flex h-[58px] shrink-0 items-center border-b border-[#eadfce] bg-[#fbfaf7] px-4">
          <h2 className="text-base font-black text-[#3b2511]">ລາຍລະອຽດຄອມໂບ</h2>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 text-center text-sm font-semibold text-[#7c6448]">
          ເລືອກຄອມໂບໜຶ່ງເພື່ອເບິ່ງລາຍລະອຽດ.
        </div>
      </aside>
    )
  }

  const productTotal = getComboProductsTotal(combo.products)
  const savings = Math.max(0, productTotal - combo.price)

  return (
    <aside className="flex h-full min-h-0 flex-col border-l border-[#eadfce] bg-white">
      <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-[#eadfce] bg-[#fbfaf7] px-4">
        <h2 className="truncate text-base font-black text-[#3b2511]">
          ລາຍລະອຽດຄອມໂບ
        </h2>
        <ComboStatusBadge status={combo.status} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-px overflow-hidden border border-[#eadfce] bg-[#eadfce]">
          <MetricTile label="ລາຄາຂາຍ" value={formatVnd(combo.price)} />
          <MetricTile label="ລາຄາລາຍການ" value={formatVnd(productTotal)} />
          <MetricTile label="ປະຢັດ" value={formatVnd(savings)} />
        </div>

        <dl className="mt-4 space-y-0 text-sm">
          <DetailRow label="ຊື່ຄອມໂບ" value={localizeComboText(combo.name) || "-"} />
          <DetailRow label="ຄຳອະທິບາຍສັ້ນ" value={localizeComboText(combo.subtitle) || "-"} />
          <DetailRow label="ລາຍລະອຽດ" value={localizeComboText(combo.description) || "-"} />
          <DetailRow label="ລຳດັບ" value={String(combo.sortOrder)} />
        </dl>

        <div className="mt-5">
          <h3 className="text-sm font-black text-[#3b2511]">ສິນຄ້າໃນຄອມໂບ</h3>
          <div className="mt-3 overflow-hidden border border-[#eadfce]">
            {combo.products.map((product, index) => (
              <div
                key={`${product.name}-${index}`}
                className="flex items-center gap-3 border-b border-[#eadfce] bg-white p-3 last:border-b-0"
              >
                <img
                  src={product.image || fallbackImage}
                  alt={product.name}
                  className="h-12 w-14 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-[#3b2511]">
                    {localizeComboText(product.name)}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#7c6448]">
                    {formatVnd(product.price)}
                  </p>
                </div>
                <span className="text-sm font-black text-[#3b2511]">
                  x{product.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 gap-3 border-t border-[#eadfce] bg-[#fbfaf7] p-4">
        <button
          type="button"
          onClick={onEdit}
          className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#eadfce] bg-white text-sm font-bold text-[#5f4a35] transition hover:bg-[#fbf4ea]"
        >
          <Edit2 className="h-4 w-4" />
          ແກ້ໄຂ
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#ffd9d4] bg-white text-sm font-bold text-[#d33c32] transition hover:bg-[#fff0ee]"
        >
          <XCircle className="h-4 w-4" />
          ລຶບຄອມໂບ
        </button>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="hidden"
      >
        <XCircle className="h-4 w-4" />
        ລຶບຄອມໂບ
      </button>
    </aside>
  )
}

export function ComboStatusBadge({ status }: { status: ComboStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-bold",
        statusClass[status],
      )}
    >
      {statusLabel[status]}
    </span>
  )
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-white p-3">
      <p className="truncate text-[11px] font-bold uppercase tracking-normal text-[#7c6448]">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-black text-[#3b2511]">{value}</p>
    </div>
  )
}

function PriceSummaryCard({
  productTotal,
  comboPrice,
  savings,
  onPriceChange,
}: {
  productTotal: number
  comboPrice: number
  savings: number
  onPriceChange: (value: number) => void
}) {
  return (
    <section className="mt-4 rounded-md border border-[#eadfce] bg-white p-4 shadow-sm">
      <SectionTitle title="ສະຫຼຸບລາຄາ" />
      <div className="mt-4 space-y-3 text-sm">
        <SummaryLine label="ລາຄາລວມສິນຄ້າ" value={formatVnd(productTotal)} />
        <div className="border-t border-dashed border-[#d8c8b4] pt-3">
          <NumberField
            label="ລາຄາຂາຍ"
            value={comboPrice}
            required
            format="kip"
            onChange={onPriceChange}
          />
        </div>
        <div className="border-t border-dashed border-[#d8c8b4] pt-3">
          <SummaryLine label="ລູກຄ້າປະຢັດ" value={formatVnd(savings)} strong />
        </div>
      </div>
    </section>
  )
}

function SummaryLine({
  label,
  value,
  strong = false,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={cn("font-semibold text-[#7c6448]", strong && "text-[#3b2511]")}>
        {label}
      </span>
      <span className={cn("font-black text-[#3b2511]", strong && "text-xl")}>
        {value}
      </span>
    </div>
  )
}

function QuantityStepper({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  const quantity = Math.max(1, Number(value) || 1)

  return (
    <div>
      <p className="text-[11px] font-bold uppercase text-[#8a7560]">ຈຳນວນ</p>
      <div className="mt-1 flex h-8 overflow-hidden rounded-md border border-[#eadfce] bg-white">
        <button
          type="button"
          className="h-8 w-8 cursor-pointer text-base font-bold text-[#5f4a35] transition hover:bg-[#fbf4ea]"
          onClick={() => onChange(Math.max(1, quantity - 1))}
        >
          -
        </button>
        <div className="flex h-8 min-w-9 items-center justify-center border-x border-[#eadfce] px-2 text-sm font-black text-[#3b2511]">
          {quantity}
        </div>
        <button
          type="button"
          className="h-8 w-8 cursor-pointer text-base font-bold text-[#5f4a35] transition hover:bg-[#fbf4ea]"
          onClick={() => onChange(quantity + 1)}
        >
          +
        </button>
      </div>
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="text-[13px] font-black uppercase tracking-normal text-[#3b2511]">
      {title}
    </h3>
  )
}

function ProductPickerModal({
  open,
  options,
  categoryOptions,
  selectedProducts,
  onClose,
  onConfirm,
}: {
  open: boolean
  options: ComboProductOption[]
  categoryOptions: string[]
  selectedProducts: ComboProduct[]
  onClose: () => void
  onConfirm: (products: ComboProductOption[]) => void
}) {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [selectedNames, setSelectedNames] = useState<Set<string>>(
    () => new Set(selectedProducts.map((product) => product.name)),
  )
  const [activeCategory, setActiveCategory] = useState("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    if (open) {
      setSelectedNames(new Set(selectedProducts.map((product) => product.name)))
      setActiveCategory("all")
      setQuery("")
      setDebouncedQuery("")
      setPage(1)
    }
  }, [open, selectedProducts])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query)
      setPage(1)
    }, 500)

    return () => window.clearTimeout(timer)
  }, [query])

  const categories = buildProductCategories(options, categoryOptions)
  const selectedOptions = options.filter((option) => selectedNames.has(option.name))
  const normalizedQuery = debouncedQuery.trim().toLowerCase()
  const visibleOptions = options.filter((option) => {
    const categoryMatched = activeCategory === "all" || option.categoryName === activeCategory
    const searchMatched =
      !normalizedQuery ||
      option.name.toLowerCase().includes(normalizedQuery) ||
      option.categoryName.toLowerCase().includes(normalizedQuery)

    return categoryMatched && searchMatched
  })
  const totalPages = Math.max(1, Math.ceil(visibleOptions.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedOptions = visibleOptions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  function toggleOption(option: ComboProductOption) {
    setSelectedNames((current) => {
      const next = new Set(current)

      if (next.has(option.name)) {
        next.delete(option.name)
      } else {
        next.add(option.name)
      }

      return next
    })
  }

  function changeCategory(categoryName: string) {
    setActiveCategory(categoryName)
    setPage(1)
  }

  function changeQuery(value: string) {
    setQuery(value)
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-[#2a1c10]/45 backdrop-blur-[1px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            className="h-full w-[1040px] max-w-[calc(100vw-32px)] bg-[#fbfaf7] shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 34, mass: 0.9 }}
            onClick={(event) => event.stopPropagation()}
          >
        <div className="flex h-[58px] items-center justify-between border-b border-[#eadfce] bg-white px-4">
          <div>
            <h2 className="text-base font-black text-[#3b2511]">ເລືອກສິນຄ້າເຂົ້າຄອມໂບ</h2>
            <p className="mt-1 text-xs font-semibold text-[#8a7560]">
              ເລືອກໄດ້ຫຼາຍລາຍການ ແລ້ວກົດ OK
            </p>
          </div>
        </div>

        <div className="grid h-[calc(100%-122px)] grid-cols-[190px_minmax(0,1fr)]">
          <aside className="border-r border-[#eadfce] bg-white p-3">
            <button
              type="button"
              onClick={() => changeCategory("all")}
              className={cn(
                "mb-2 flex h-10 w-full items-center justify-between rounded-md px-3 text-sm font-bold transition",
                activeCategory === "all"
                  ? "bg-[#3b2511] text-white"
                  : "text-[#5f4a35] hover:bg-[#fbf4ea]",
              )}
            >
              <span>ທັງໝົດ</span>
              <span>{options.length}</span>
            </button>
            <div className="max-h-[calc(100vh-190px)] space-y-1 overflow-y-auto">
              {categories.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => changeCategory(category.name)}
                  className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md px-3 text-left text-sm font-bold transition",
                    activeCategory === category.name
                      ? "bg-[#f1e3d1] text-[#3b2511]"
                      : "text-[#5f4a35] hover:bg-[#fbf4ea]",
                  )}
                >
                  <span className="truncate">{localizeComboText(category.name)}</span>
                  <span>{category.count}</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="flex min-h-0 flex-col p-4">
            <input
              value={query}
              onChange={(event) => changeQuery(event.target.value)}
              placeholder="ຄົ້ນຫາສິນຄ້າ..."
              className="h-10 w-full rounded-md border border-[#eadfce] bg-white px-3 text-sm font-medium text-[#3b2511] outline-none transition placeholder:text-[#b8aa9a] focus:border-[#b98b56] focus:ring-2 focus:ring-[#f4dec2]"
            />

            <div className="mt-3 min-h-0 flex-1 overflow-y-auto bg-transparent p-1">
              {options.length && visibleOptions.length ? (
                <div className="grid grid-cols-5 gap-3">
                  {pagedOptions.map((option) => (
                  <button
                    key={`${option.name}-${option.price}`}
                    type="button"
                    onClick={() => toggleOption(option)}
                    className={cn(
                      "relative min-w-0 cursor-pointer overflow-hidden rounded-md border bg-white text-left transition hover:border-[#b98b56] hover:bg-[#fbf4ea]",
                      selectedNames.has(option.name)
                        ? "border-[#6b4423] ring-2 ring-[#ead8c1]"
                        : "border-[#eadfce]",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-md border",
                        selectedNames.has(option.name)
                          ? "border-[#6b4423] bg-[#6b4423] text-white"
                          : "border-[#d8c8b4] bg-white text-transparent",
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </span>
                    <img
                      src={option.image || fallbackImage}
                      alt={option.name}
                      className="h-28 w-full object-cover"
                    />
                    <span className="block min-w-0 p-3">
                      <span className="block truncate text-sm font-black leading-5 text-[#3b2511]">
                        {localizeComboText(option.name)}
                      </span>
                      <span className="mt-1 block text-xs font-bold text-[#7c6448]">
                        {localizeComboText(option.categoryName)}
                      </span>
                      <span className="mt-2 block text-sm font-black text-[#3b2511]">
                        {formatVnd(option.price)}
                      </span>
                    </span>
                  </button>
                  ))}
                </div>
              ) : (
                <div className="flex h-full min-h-[260px] items-center justify-center px-4 text-center text-sm font-semibold text-[#8a7560]">
                  {options.length ? "ບໍ່ພົບສິນຄ້າທີ່ຄົ້ນຫາ." : "ຍັງບໍ່ມີສິນຄ້າໃນເມນູ."}
                </div>
              )}
            </div>

            <div className="mt-3 flex h-10 shrink-0 items-center justify-between text-sm font-bold text-[#5f4a35]">
              <span>
                ໜ້າ {currentPage} / {totalPages} · {visibleOptions.length} ລາຍການ
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value))
                    setPage(1)
                  }}
                  className="h-9 rounded-md border border-[#eadfce] bg-white px-3 text-sm font-bold text-[#5f4a35] outline-none transition focus:border-[#b98b56] focus:ring-2 focus:ring-[#f4dec2]"
                >
                  <option value={5}>5 / ໜ້າ</option>
                  <option value={10}>10 / ໜ້າ</option>
                  <option value={15}>15 / ໜ້າ</option>
                </select>
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="h-9 rounded-md border border-[#eadfce] bg-white px-3 transition hover:bg-[#fbf4ea] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  ກ່ອນໜ້າ
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  className="h-9 rounded-md border border-[#eadfce] bg-white px-3 transition hover:bg-[#fbf4ea] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  ຕໍ່ໄປ
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="flex h-16 items-center justify-between border-t border-[#eadfce] bg-white px-4">
          <span className="text-sm font-bold text-[#5f4a35]">
            ເລືອກແລ້ວ {selectedOptions.length} ລາຍການ
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 min-w-[110px] rounded-md border border-[#eadfce] bg-white px-4 text-sm font-bold text-[#5f4a35] transition hover:bg-[#fbf4ea]"
            >
              ຍົກເລີກ
            </button>
            <button
              type="button"
              onClick={() => onConfirm(selectedOptions)}
              className="h-10 min-w-[130px] rounded-md bg-[#3b2511] px-4 text-sm font-bold text-white transition hover:bg-[#5a3718]"
            >
              OK
            </button>
          </div>
        </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function buildProductCategories(options: ComboProductOption[], categoryOptions: string[]) {
  const categoryMap = new Map<string, number>()

  for (const categoryName of categoryOptions) {
    categoryMap.set(categoryName, 0)
  }

  for (const option of options) {
    categoryMap.set(option.categoryName, (categoryMap.get(option.categoryName) ?? 0) + 1)
  }

  return Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }))
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-3 border-b border-[#eadfce] py-3 last:border-b-0">
      <dt className="font-semibold text-[#7c6448]">{label}</dt>
      <dd className="text-right font-bold leading-6 text-[#3b2511]">{value}</dd>
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
        "border-b border-[#eadfce] px-4 py-3",
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
  colSpan,
}: {
  children: ReactNode
  className?: string
  colSpan?: number
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn("border-b border-[#eadfce] px-4 py-3 text-sm text-[#3b2511]", className)}
    >
      {children}
    </td>
  )
}

function TextField({
  label,
  value,
  onChange,
  required = false,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#5f4a35]">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <input
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-md border border-[#eadfce] bg-white px-3 text-sm font-medium text-[#3b2511] outline-none transition placeholder:text-[#b8aa9a] focus:border-[#b98b56] focus:ring-2 focus:ring-[#f4dec2]"
      />
    </label>
  )
}

function NumberField({
  label,
  value,
  onChange,
  required = false,
  min = 0,
  format = "number",
}: {
  label: string
  value: number
  onChange: (value: number) => void
  required?: boolean
  min?: number
  format?: "number" | "kip"
}) {
  const safeValue = Number.isFinite(value) ? Math.max(min, value) : min
  const displayValue =
    format === "kip" ? formatKipInput(safeValue) : String(Math.round(safeValue))

  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#5f4a35]">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        required={required}
        onChange={(event) => onChange(Math.max(min, parseNumberInput(event.target.value)))}
        className="mt-2 h-10 w-full rounded-md border border-[#eadfce] bg-white px-3 text-sm font-medium text-[#3b2511] outline-none transition focus:border-[#b98b56] focus:ring-2 focus:ring-[#f4dec2]"
      />
    </label>
  )
}

function formatKipInput(value: number) {
  const numeric = Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0

  return numeric.toLocaleString("en-US")
}

function parseNumberInput(value: string) {
  const numeric = Number(value.replace(/[^\d]/g, ""))

  return Number.isFinite(numeric) ? numeric : 0
}

function SelectField<TValue extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: TValue
  options: Array<{ value: TValue; label: string }>
  onChange: (value: TValue) => void
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#5f4a35]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as TValue)}
        className="mt-2 h-10 w-full cursor-pointer rounded-md border border-[#eadfce] bg-white px-3 text-sm font-medium text-[#3b2511] outline-none transition focus:border-[#b98b56] focus:ring-2 focus:ring-[#f4dec2]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function ActionIcon({
  label,
  icon: Icon,
  onClick,
}: {
  label: string
  icon: ComponentType<{ className?: string }>
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#4b321a] transition hover:bg-[#fbf4ea]"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation()
        onClick?.()
      }}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

function getComboProductsTotal(products: ComboProduct[]) {
  return products.reduce((sum, product) => sum + product.price * product.quantity, 0)
}

function localizeComboText(value: string) {
  const normalized = value.toLowerCase()

  if (!value) return value
  if (normalized.includes("total") || normalized.includes("tá»•ng")) return "ຄອມໂບທັງໝົດ"
  if (normalized.includes("active") || normalized.includes("hoáº¡t")) return "ເປີດ"
  if (normalized.includes("paused") || normalized.includes("táº¡m")) return "ປິດ"
  if (normalized.includes("stopped") || normalized.includes("ngá»«ng")) return "ປິດ"
  if (normalized.includes("combo c") || normalized.includes("breakfast")) return "ຄອມໂບກາເຟເຊົ້າ"
  if (normalized.includes("combo tr")) return "ຄອມໂບຊາບ່າຍ"
  if (normalized.includes("nÄƒng") || normalized.includes("energy")) return "ຄອມໂບເພີ່ມພະລັງງານ"
  if (normalized.includes("healthy")) return "ຄອມໂບສຸຂະພາບ"
  if (normalized.includes("tiáº¿t") || normalized.includes("saving")) return "ຄອມໂບປະຢັດ"
  if (normalized.includes("detox")) return "ຄອມໂບດີທັອກ"
  if (normalized.includes("gá»“m") || normalized.includes("phÃ¹")) return "ຄອມໂບສຳລັບຕອນເຊົ້າ ກິນຄູ່ກັບຂອງຫວານ."
  if (normalized.includes("trÃ¡i cÃ¢y") && normalized.includes("bÃ¡nh")) return "ຊາເຢັນຫອມສົດຊື່ນ ກັບເຄັກນຸ່ມສຳລັບຕອນບ່າຍ."
  if (normalized.includes("tá»‰nh") || normalized.includes("tÆ°Æ¡i")) return "ເຄື່ອງດື່ມສອງຢ່າງສຳລັບມື້ທີ່ຕ້ອງການຄວາມສົດຊື່ນ."
  if (normalized.includes("lÃ nh") || normalized.includes("máº¡nh")) return "ເມນູເບົາໆ ດື່ມງ່າຍ ເໝາະກັບລູກຄ້າສາຍສຸຂະພາບ."
  if (normalized.includes("giÃ¡") || normalized.includes("mua nhanh")) return "ລາຄາດີ ສັ່ງໄວ ເໝາະກັບລູກຄ້າປະຈຳ."
  if (normalized.includes("ngá»«ng bÃ¡n") || normalized.includes("sinh tá»‘")) return "ເຄີຍເປັນເມນູຍອດນິຍົມ ແຕ່ຢຸດຂາຍຊົ່ວຄາວ."
  if (normalized.includes("cÃ  phÃª Ä‘en")) return "ກາເຟດຳ"
  if (normalized.includes("cÃ  phÃª sá»¯a")) return "ກາເຟນົມ"
  if (normalized.includes("trÃ  Ä‘Ã o")) return "ຊາພີດ"
  if (normalized.includes("trÃ  xanh latte")) return "ຊາຂຽວລາເຕ້"
  if (normalized.includes("nÆ°á»›c cam")) return "ນ້ຳສົ້ມ"
  if (normalized.includes("sinh tá»‘ dÃ¢u")) return "ສະມູດຕີ້ສະຕໍເບີຣີ"
  if (normalized.includes("trÃ¡i cÃ¢y")) return "ໝາກໄມ້"
  if (normalized.includes("cÃ  phÃª") || normalized.includes("coffee")) return value.replace(/cÃ  phÃª|coffee/gi, "ກາເຟ")
  if (normalized.includes("trÃ ") || normalized.includes("tea")) return value.replace(/trÃ |tea/gi, "ຊາ")
  if (normalized.includes("bÃ¡nh") || normalized.includes("cake")) return value.replace(/bÃ¡nh|cake/gi, "ເຄັກ")
  if (normalized.includes("nÆ°á»›c") || normalized.includes("juice")) return value.replace(/nÆ°á»›c|juice/gi, "ນ້ຳ")
  if (normalized.includes("sáº£n pháº©m")) return "ສິນຄ້າ"

  return value
}
