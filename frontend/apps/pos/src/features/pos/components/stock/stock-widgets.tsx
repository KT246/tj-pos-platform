import {
  ChevronDown,
  Edit2,
  PackagePlus,
  Pencil,
  Trash2,
  XCircle,
} from "lucide-react"
import type { ComponentType, ReactNode } from "react"

import type {
  CafeStockItem,
  SaveStockItemBody,
  StockCategory,
  StockKpi,
  StockMovementPoint,
  StockMovementType,
  StockStatus,
} from "@/features/pos/api/pos-stock-api"
import { formatVnd } from "@/features/pos/lib/format"
import { cn } from "@/lib/utils"

const fallbackImage = "/images/pos-login-hero.png"

const statusLabel: Record<StockStatus, string> = {
  "in-stock": "ຍັງມີສິນຄ້າ",
  "low-stock": "ໃກ້ໝົດ",
  "out-of-stock": "ໝົດສິນຄ້າ",
  ordering: "ກຳລັງສັ່ງຊື້",
}

const statusClass: Record<StockStatus, string> = {
  "in-stock": "border-[#d8eadb] bg-[#eef9f0] text-[#2f8748]",
  "low-stock": "border-[#ffe0bc] bg-[#fff5e8] text-[#c36b14]",
  "out-of-stock": "border-[#ffd9d4] bg-[#fff0ee] text-[#d33c32]",
  ordering: "border-[#d8e8ff] bg-[#eef6ff] text-[#2f75bd]",
}

const kpiToneClass: Record<StockKpi["tone"], string> = {
  brown: "bg-[#f1e4d4] text-[#5a3718]",
  green: "bg-[#e6f7e9] text-[#2f8748]",
  amber: "bg-[#fff3d9] text-[#ef7b17]",
  red: "bg-[#ffe6e4] text-[#d33c32]",
  blue: "bg-[#e8f0ff] text-[#2f65d9]",
}

const categoryOptions: Array<{ value: StockCategory; label: string }> = [
  { value: "ingredient", label: "ວັດຖຸດິບ" },
  { value: "supply", label: "ອຸປະກອນ" },
  { value: "product", label: "ສິນຄ້າ" },
]

const movementOptions: Array<{ value: StockMovementType; label: string }> = [
  { value: "import", label: "ນຳເຂົ້າເພີ່ມ" },
  { value: "export", label: "ນຳອອກຈາກຄັງ" },
  { value: "adjust", label: "ປັບຍອດຄົງເຫຼືອ" },
]

export type StockFormDraft = SaveStockItemBody
export type StockMovementDraft = {
  type: StockMovementType
  quantity: number
  note: string
}

type StockKpiCardProps = {
  kpi: StockKpi
  icon: ComponentType<{ className?: string }>
}

export function StockKpiCard({ kpi, icon: Icon }: StockKpiCardProps) {
  const isWarning = kpi.tone === "amber" || kpi.tone === "red"

  return (
    <article className="flex h-[88px] min-w-0 items-center gap-3 border-r border-[#eadfce] px-3 last:border-r-0">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
          kpiToneClass[kpi.tone],
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-bold uppercase tracking-normal text-[#7c6448]">
          {kpi.title}
        </p>
        <p className="mt-1 truncate text-xl font-black leading-none text-[#3b2511]">
          {kpi.value}
        </p>
        <p
          className={cn(
            "mt-1 truncate text-xs font-bold",
            kpi.helper
              ? "text-[#2f8748]"
              : isWarning
                ? "text-[#e3362c]"
                : "text-[#7c6448]",
          )}
        >
          {kpi.helper ? `${kpi.helper} ${kpi.subtitle}` : kpi.subtitle}
        </p>
      </div>
    </article>
  )
}

type StockTableProps = {
  items: CafeStockItem[]
  selectedItemId: string
  totalItems: number
  loading?: boolean
  onSelectItem: (itemId: string) => void
  onEditItem: (item: CafeStockItem) => void
}

export function StockTable({
  items,
  selectedItemId,
  totalItems,
  loading = false,
  onSelectItem,
  onEditItem,
}: StockTableProps) {
  const hasItems = items.length > 0

  return (
    <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden border border-[#eadfce] bg-white">
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[960px] border-separate border-spacing-0 text-left">
          <thead className="sticky top-0 z-10 bg-[#fbfaf7]">
            <tr className="text-xs font-bold uppercase tracking-normal text-[#6f5c49]">
              <HeaderCell>ລາຍການ</HeaderCell>
              <HeaderCell>ໝວດໝູ່</HeaderCell>
              <HeaderCell>SKU</HeaderCell>
              <HeaderCell>ຫົວໜ່ວຍ</HeaderCell>
              <HeaderCell>ຍອດຄົງເຫຼືອ</HeaderCell>
              <HeaderCell>ຂັ້ນຕ່ຳ</HeaderCell>
              <HeaderCell>ສະຖານະ</HeaderCell>
              <HeaderCell>ຕົ້ນທຶນ</HeaderCell>
              <HeaderCell align="right">ຈັດການ</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <BodyCell className="h-[220px] text-center" colSpan={9}>
                  ກຳລັງໂຫຼດຄັງສິນຄ້າ...
                </BodyCell>
              </tr>
            )}

            {!loading && !hasItems && (
              <tr>
                <BodyCell className="h-[220px] text-center" colSpan={9}>
                  ຍັງບໍ່ມີລາຍການທີ່ກົງເງື່ອນໄຂ.
                </BodyCell>
              </tr>
            )}

            {!loading &&
              items.map((item) => {
                const selected = selectedItemId === item.id

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectItem(item.id)}
                    className={cn(
                      "group cursor-pointer transition",
                      selected ? "bg-[#fff4e5]" : "bg-white hover:bg-[#fbf7ef]",
                    )}
                  >
                    <BodyCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || fallbackImage}
                          alt={item.name}
                          className="h-11 w-11 rounded-md object-cover"
                        />
                        <span className="font-black text-[#3b2511]">{item.name}</span>
                      </div>
                    </BodyCell>
                    <BodyCell>{item.categoryLabel}</BodyCell>
                    <BodyCell className="font-bold">{item.sku || "-"}</BodyCell>
                    <BodyCell>{item.unit}</BodyCell>
                    <BodyCell className="font-black">{formatQuantity(item.currentStock)}</BodyCell>
                    <BodyCell className="font-bold">{formatQuantity(item.minStock)}</BodyCell>
                    <BodyCell>
                      <StockStatusBadge status={item.status} />
                    </BodyCell>
                    <BodyCell className="font-black">{formatVnd(item.costPrice)}</BodyCell>
                    <BodyCell className="text-right">
                      <ActionIcon
                        label={`ແກ້ໄຂ ${item.name}`}
                        icon={Edit2}
                        onClick={() => onEditItem(item)}
                      />
                    </BodyCell>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      <div className="flex h-[58px] shrink-0 items-center justify-between border-t border-[#eadfce] bg-[#fbfaf7] px-4 text-sm font-bold text-[#5f4a35]">
        <span>
          ສະແດງ {hasItems ? 1 : 0} - {items.length} ຈາກ {totalItems} ລາຍການ
        </span>
        <span>50 / ໜ້າ</span>
      </div>
    </div>
  )
}

type StockDetailPanelProps = {
  item: CafeStockItem | null
  mode: "view" | "create" | "edit" | "movement"
  draft: StockFormDraft
  movement: StockMovementDraft
  saving?: boolean
  onChange: (item: Partial<StockFormDraft>) => void
  onMovementChange: (movement: Partial<StockMovementDraft>) => void
  onSave: () => void
  onSaveMovement: () => void
  onCancel: () => void
  onEdit: () => void
  onOpenMovement: (type: StockMovementType) => void
  onDelete: () => void
}

export function StockDetailPanel({
  item,
  mode,
  draft,
  movement,
  saving = false,
  onChange,
  onMovementChange,
  onSave,
  onSaveMovement,
  onCancel,
  onEdit,
  onOpenMovement,
  onDelete,
}: StockDetailPanelProps) {
  if (mode === "create" || mode === "edit") {
    return (
      <aside className="flex h-full min-h-0 flex-col border-l border-[#eadfce] bg-white">
        <div className="flex h-[58px] shrink-0 items-center border-b border-[#eadfce] bg-[#fbfaf7] px-4">
          <h2 className="text-base font-black text-[#3b2511]">
            {mode === "create" ? "ເພີ່ມລາຍການຄັງ" : "ແກ້ໄຂຍອດຄົງເຫຼືອ"}
          </h2>
        </div>

        <form
          className="min-h-0 flex-1 overflow-y-auto p-4"
          onSubmit={(event) => {
            event.preventDefault()
            onSave()
          }}
        >
          <div className="space-y-3">
            <TextField
              label="ຊື່ລາຍການ"
              value={draft.name ?? ""}
              required
              onChange={(value) => onChange({ name: value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="ໝວດໝູ່"
                value={draft.category ?? "ingredient"}
                options={categoryOptions}
                onChange={(value) => onChange({ category: value })}
              />
              <TextField
                label="SKU"
                value={draft.sku ?? ""}
                onChange={(value) => onChange({ sku: value.toUpperCase() })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="ຫົວໜ່ວຍ"
                value={draft.unit ?? ""}
                required
                onChange={(value) => onChange({ unit: value })}
              />
              <NumberField
                label="ຕົ້ນທຶນ"
                value={draft.costPrice ?? 0}
                onChange={(value) => onChange({ costPrice: value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <NumberField
                label="ຍອດຄົງເຫຼືອ"
                value={draft.currentStock ?? 0}
                onChange={(value) => onChange({ currentStock: value })}
              />
              <NumberField
                label="ຂັ້ນຕ່ຳ"
                value={draft.minStock ?? 0}
                onChange={(value) => onChange({ minStock: value })}
              />
              <NumberField
                label="ກຳລັງສັ່ງ"
                value={draft.orderingStock ?? 0}
                onChange={(value) => onChange({ orderingStock: value })}
              />
            </div>
            <TextField
              label="ຜູ້ສະໜອງ"
              value={draft.supplier ?? ""}
              onChange={(value) => onChange({ supplier: value })}
            />
            <DateField
              label="ວັນໝົດອາຍຸ"
              value={draft.expiryDate ?? ""}
              onChange={(value) => onChange({ expiryDate: value })}
            />
            <TextField
              label="ຮູບພາບ"
              value={draft.image ?? ""}
              onChange={(value) => onChange({ image: value })}
            />
          </div>

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
      </aside>
    )
  }

  if (mode === "movement" && item) {
    return (
      <aside className="flex h-full min-h-0 flex-col border-l border-[#eadfce] bg-white">
        <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-[#eadfce] bg-[#fbfaf7] px-4">
          <h2 className="text-base font-black text-[#3b2511]">ອັບເດດຍອດຄົງເຫຼືອ</h2>
          <StockStatusBadge status={item.status} />
        </div>

        <form
          className="min-h-0 flex-1 overflow-y-auto p-4"
          onSubmit={(event) => {
            event.preventDefault()
            onSaveMovement()
          }}
        >
          <div className="flex items-start gap-3 border-b border-[#eadfce] pb-4">
            <img
              src={item.image || fallbackImage}
              alt={item.name}
              className="h-14 w-14 rounded-md object-cover"
            />
            <div>
              <h3 className="font-black text-[#3b2511]">{item.name}</h3>
              <p className="mt-1 text-sm font-semibold text-[#7c6448]">
                ປັດຈຸບັນມີ {formatQuantity(item.currentStock)} {item.unit}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <SelectField
              label="ປະເພດການດຳເນີນການ"
              value={movement.type}
              options={movementOptions}
              onChange={(value) => onMovementChange({ type: value })}
            />
            <NumberField
              label={movement.type === "adjust" ? "ຍອດຄົງເຫຼືອໃໝ່" : "ຈຳນວນ"}
              value={movement.quantity}
              min={movement.type === "adjust" ? 0 : 0.001}
              onChange={(value) => onMovementChange({ quantity: value })}
            />
            <TextAreaField
              label="ໝາຍເຫດ"
              value={movement.note}
              onChange={(value) => onMovementChange({ note: value })}
            />
          </div>

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
              {saving ? "ກຳລັງບັນທຶກ" : "ອັບເດດ"}
            </button>
          </div>
        </form>
      </aside>
    )
  }

  if (!item) {
    return (
      <aside className="flex h-full min-h-0 flex-col border-l border-[#eadfce] bg-white">
        <div className="flex h-[58px] shrink-0 items-center border-b border-[#eadfce] bg-[#fbfaf7] px-4">
          <h2 className="text-base font-black text-[#3b2511]">ລາຍລະອຽດຍອດຄົງເຫຼືອ</h2>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 text-center text-sm font-semibold text-[#7c6448]">
          ເລືອກລາຍການໜຶ່ງເພື່ອເບິ່ງຍອດຄົງເຫຼືອ.
        </div>
      </aside>
    )
  }

  return (
    <aside className="flex h-full min-h-0 flex-col border-l border-[#eadfce] bg-white">
      <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-[#eadfce] bg-[#fbfaf7] px-4">
        <h2 className="text-base font-black text-[#3b2511]">ລາຍລະອຽດຍອດຄົງເຫຼືອ</h2>
        <StockStatusBadge status={item.status} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="flex items-start gap-4">
          <img
            src={item.image || fallbackImage}
            alt={item.name}
            className="h-[72px] w-[72px] rounded-md object-cover"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-black leading-tight text-[#3b2511]">
              {item.name}
            </h3>
            <p className="mt-2 text-xs font-bold text-[#7c6448]">
              SKU: {item.sku || "-"} ・ {item.categoryLabel}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 border-b border-[#eadfce] pb-5">
          <Metric label="ຍອດຄົງເຫຼືອປັດຈຸບັນ" value={`${formatQuantity(item.currentStock)} ${item.unit}`} />
          <Metric label="ຈຳນວນຂັ້ນຕ່ຳ" value={`${formatQuantity(item.minStock)} ${item.unit}`} />
          <Metric label="ຍອດທີ່ໃຊ້ໄດ້" value={`${formatQuantity(item.availableStock)} ${item.unit}`} />
          <Metric label="ກຳລັງສັ່ງຊື້" value={`${formatQuantity(item.orderingStock)} ${item.unit}`} />
        </div>

        <dl className="mt-5 space-y-0 text-sm">
          <DetailRow label="ຫົວໜ່ວຍ" value={item.unit} />
          <DetailRow label="ຕົ້ນທຶນ" value={`${formatVnd(item.costPrice)} / ${item.unit}`} />
          <DetailRow label="ມູນຄ່າຄົງເຫຼືອ" value={formatVnd(item.inventoryValue)} />
          <DetailRow label="ຜູ້ສະໜອງ" value={item.supplier || "-"} />
          <DetailRow label="ວັນທີນຳເຂົ້າຫຼ້າສຸດ" value={item.lastImportAt} />
          <DetailRow label="ວັນໝົດອາຍຸ" value={item.expiryDate} />
        </dl>
      </div>

      <div className="grid shrink-0 grid-cols-3 gap-2 border-t border-[#eadfce] bg-[#fbfaf7] p-4">
        <SmallActionButton label="ນຳເຂົ້າ" icon={PackagePlus} onClick={() => onOpenMovement("import")} />
        <SmallActionButton label="ນຳອອກ" icon={XCircle} onClick={() => onOpenMovement("export")} />
        <SmallActionButton label="ແກ້ໄຂ" icon={Pencil} onClick={onEdit} />
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 border-t border-[#eadfce] bg-white text-sm font-bold text-[#d33c32] transition hover:bg-[#fff0ee]"
      >
        <Trash2 className="h-4 w-4" />
        ລຶບລາຍການ
      </button>
    </aside>
  )
}

export function StockMovementChart({ data }: { data: StockMovementPoint[] }) {
  const maxValue = Math.max(1, ...data.flatMap((point) => [point.importQty, point.exportQty]))

  return (
    <section className="h-[220px] shrink-0 border-t border-[#eadfce] bg-white p-4">
      <h3 className="text-base font-black text-[#3b2511]">ນຳເຂົ້າ - ນຳອອກ 7 ມື້</h3>
      <div className="mt-4 flex items-center justify-between text-xs font-bold text-[#7c6448]">
        <span>ຈຳນວນ</span>
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#8fce77]" />
            ນຳເຂົ້າ
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#f4a44f]" />
            ນຳອອກ
          </span>
        </span>
      </div>
      <div className="mt-3 grid h-[130px] grid-cols-[32px_minmax(0,1fr)] gap-3">
        <div className="flex flex-col justify-between text-xs font-bold text-[#8a7560]">
          <span>{Math.ceil(maxValue)}</span>
          <span>{Math.ceil(maxValue / 2)}</span>
          <span>0</span>
        </div>
        <div className="relative flex items-end justify-between border-b border-l border-[#eadfce] pl-3">
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-[#eadfce]" />
          {data.map((point) => (
            <div key={point.date} className="relative z-10 flex h-full flex-col items-center justify-end gap-2">
              <div className="flex h-[92px] items-end gap-1.5">
                <span
                  className="w-2.5 rounded-t bg-[#8fce77]"
                  style={{ height: `${(point.importQty / maxValue) * 100}%` }}
                />
                <span
                  className="w-2.5 rounded-t bg-[#f4a44f]"
                  style={{ height: `${(point.exportQty / maxValue) * 100}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-[#8a7560]">{point.date}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function StockStatusBadge({ status }: { status: StockStatus }) {
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

type SelectFilterOption = {
  label: string
  value: string
}

export function SelectFilter({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: SelectFilterOption[]
}) {
  return (
    <label className="relative w-[210px]">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full cursor-pointer appearance-none rounded-md border border-[#eadfce] bg-white px-3 pr-9 text-sm font-bold text-[#5f4a35] outline-none transition focus:border-[#b98b56] focus:ring-2 focus:ring-[#f4dec2]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a5f36]" />
    </label>
  )
}

function SmallActionButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string
  icon: ComponentType<{ className?: string }>
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#eadfce] bg-white text-sm font-bold text-[#5f4a35] transition hover:bg-[#fbf4ea]"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-bold text-[#7c6448]">{label}</p>
      <p className="mt-2 text-base font-black text-[#3b2511]">{value}</p>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[128px_minmax(0,1fr)] gap-4 border-b border-[#f1e8dc] py-3 last:border-b-0">
      <dt className="font-bold text-[#7c6448]">{label}</dt>
      <dd className="text-right font-black leading-6 text-[#3b2511]">{value}</dd>
    </div>
  )
}

function TextField({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#5f4a35]">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <input
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-md border border-[#eadfce] bg-white px-3 text-sm font-medium text-[#3b2511] outline-none transition focus:border-[#b98b56] focus:ring-2 focus:ring-[#f4dec2]"
      />
    </label>
  )
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#5f4a35]">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-md border border-[#eadfce] bg-white px-3 text-sm font-medium text-[#3b2511] outline-none transition focus:border-[#b98b56] focus:ring-2 focus:ring-[#f4dec2]"
      />
    </label>
  )
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#5f4a35]">{label}</span>
      <input
        type="number"
        min={min}
        step="0.001"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 h-10 w-full rounded-md border border-[#eadfce] bg-white px-3 text-sm font-medium text-[#3b2511] outline-none transition focus:border-[#b98b56] focus:ring-2 focus:ring-[#f4dec2]"
      />
    </label>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#5f4a35]">{label}</span>
      <textarea
        value={value}
        rows={3}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full resize-none rounded-md border border-[#eadfce] bg-white px-3 py-2 text-sm font-medium leading-5 text-[#3b2511] outline-none transition focus:border-[#b98b56] focus:ring-2 focus:ring-[#f4dec2]"
      />
    </label>
  )
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

function formatQuantity(value: number) {
  return Number.isInteger(value)
    ? value.toLocaleString("vi-VN")
    : value.toLocaleString("vi-VN", { maximumFractionDigits: 3 })
}
