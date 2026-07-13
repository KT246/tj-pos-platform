import { CheckSquare, Eye, PauseCircle, PlayCircle, SquarePen, Trash2, X } from "lucide-react"
import type { ComponentType, ReactNode } from "react"

import type {
  CafePromotion,
  PromotionApplyScope,
  PromotionKpi,
  PromotionStatus,
  PromotionType,
  SavePromotionBody,
} from "@/features/pos/api/pos-promotions-api"
import { getPosSession } from "@/features/pos/lib/pos-session"
import { cn } from "@/lib/utils"

const statusLabel: Record<PromotionStatus, string> = {
  active: "ກຳລັງໃຊ້ງານ",
  paused: "ຢຸດຊົ່ວຄາວ",
  ended: "ສິ້ນສຸດແລ້ວ",
  upcoming: "ກຳລັງຈະເລີ່ມ",
}

const statusClass: Record<PromotionStatus, string> = {
  active: "bg-[#e8f7ed] text-[#2e7a46]",
  paused: "bg-[#fff3df] text-[#a95710]",
  ended: "bg-[#eee9e3] text-[#5f5144]",
  upcoming: "bg-[#eaf3ff] text-[#286aa8]",
}

const typeClass = {
  percent: "bg-[#fff4e5] text-[#8d501d]",
  amount: "bg-[#fff4e5] text-[#8d501d]",
  bogo: "bg-[#e8f7ed] text-[#2e7a46]",
  "free-shipping": "bg-[#e8f7ed] text-[#2e7a46]",
  combo: "bg-[#fff4e5] text-[#8d501d]",
}

const kpiToneClass: Record<PromotionKpi["tone"], string> = {
  green: "text-[#2e7a46]",
  amber: "text-[#9c5a10]",
  red: "text-[#a83224]",
}

const promotionTypeOptions: Array<{ value: PromotionType; label: string }> = [
  { value: "percent", label: "ຫຼຸດ %" },
  { value: "amount", label: "ຫຼຸດເປັນເງິນ" },
  { value: "bogo", label: "ຊື້ X ແຖມ Y" },
  { value: "free-shipping", label: "ສົ່ງຟຣີ" },
  { value: "combo", label: "ຄອມໂບ" },
]

const promotionStatusOptions: Array<{ value: PromotionStatus; label: string }> = [
  { value: "active", label: "ກຳລັງໃຊ້ງານ" },
  { value: "paused", label: "ຢຸດຊົ່ວຄາວ" },
  { value: "upcoming", label: "ກຳລັງຈະເລີ່ມ" },
  { value: "ended", label: "ສິ້ນສຸດແລ້ວ" },
]

const applyScopeOptions: Array<{ value: PromotionApplyScope; label: string }> = [
  { value: "all_order", label: "ທັງອໍເດີ" },
  { value: "category", label: "ໝວດສິນຄ້າ" },
  { value: "product", label: "ສິນຄ້າ" },
  { value: "combo", label: "ຄອມໂບ" },
  { value: "customer_group", label: "ກຸ່ມລູກຄ້າ" },
]

const dayOptions = [
  { value: 1, label: "ຈ", fullLabel: "ວັນຈັນ" },
  { value: 2, label: "ອ", fullLabel: "ວັນອັງຄານ" },
  { value: 3, label: "ພ", fullLabel: "ວັນພຸດ" },
  { value: 4, label: "ພຫ", fullLabel: "ວັນພະຫັດ" },
  { value: 5, label: "ສກ", fullLabel: "ວັນສຸກ" },
  { value: 6, label: "ສ", fullLabel: "ວັນເສົາ" },
  { value: 0, label: "ອທ", fullLabel: "ວັນອາທິດ" },
]

export type PromotionFormDraft = SavePromotionBody & {
  startDate?: string
  endDate?: string
}

export type PromotionFormErrors = Partial<Record<"name" | "code" | "value", string>>

export type PromotionTargetOption = {
  id: string
  label: string
}

type PromotionKpiCardProps = {
  kpi: PromotionKpi
  icon: ComponentType<{ className?: string }>
}

export function PromotionKpiCard({ kpi, icon: Icon }: PromotionKpiCardProps) {
  return (
    <article className="flex min-w-0 items-center gap-3 border-r border-[#ded4c8] px-3 last:border-r-0">
      <Icon className={cn("h-5 w-5 shrink-0", kpiToneClass[kpi.tone])} />
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase leading-4 tracking-normal text-[#6f5c49]">
          {kpi.title}
        </p>
        <p className="mt-1 text-xl font-extrabold leading-none text-[#2f2419]">
          {kpi.value}
        </p>
      </div>
    </article>
  )
}

type PromotionTableProps = {
  promotions: CafePromotion[]
  selectedPromotionId: string
  totalPromotions: number
  loading?: boolean
  onSelectPromotion: (promotionId: string) => void
  onEditPromotion: (promotion: CafePromotion) => void
}

export function PromotionTable({
  promotions,
  selectedPromotionId,
  totalPromotions,
  loading = false,
  onSelectPromotion,
  onEditPromotion,
}: PromotionTableProps) {
  const hasPromotions = promotions.length > 0

  return (
    <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[820px] border-separate border-spacing-0 text-left">
          <thead className="sticky top-0 z-10 bg-[#fbfaf7]">
            <tr className="text-xs font-bold uppercase tracking-normal text-[#6f5c49]">
              <HeaderCell>#</HeaderCell>
              <HeaderCell>ໂປຣໂມຊັນ</HeaderCell>
              <HeaderCell>ປະເພດ</HeaderCell>
              <HeaderCell>ມູນຄ່າ</HeaderCell>
              <HeaderCell>ໄລຍະເວລາໃຊ້ງານ</HeaderCell>
              <HeaderCell>ສະຖານະ</HeaderCell>
              <HeaderCell align="right">ຈັດການ</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <BodyCell className="h-[220px] text-center" colSpan={7}>
                  ກຳລັງໂຫຼດໂປຣໂມຊັນ...
                </BodyCell>
              </tr>
            )}

            {!loading && !hasPromotions && (
              <tr>
                <BodyCell className="h-[220px] text-center" colSpan={7}>
                  ຍັງບໍ່ມີໂປຣໂມຊັນທີ່ກົງເງື່ອນໄຂ.
                </BodyCell>
              </tr>
            )}

            {!loading && promotions.map((promotion, index) => {
              const selected = selectedPromotionId === promotion.id

              return (
                <tr
                  key={promotion.id}
                  onClick={() => onSelectPromotion(promotion.id)}
                  className={cn(
                    "group cursor-pointer transition",
                    selected
                      ? "bg-[#f6efe5]"
                      : "bg-white hover:bg-[#fbfaf7]",
                  )}
                >
                  <BodyCell className="font-black text-[#756656]">
                    {index + 1}
                  </BodyCell>
                  <BodyCell>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-[#2f2419]">{promotion.name}</p>
                      <p className="mt-1 text-xs font-semibold text-[#6f5c49]">
                        {promotion.code}
                      </p>
                    </div>
                  </BodyCell>
                  <BodyCell>
                    <span
                      className={cn(
                        "inline-flex h-7 items-center rounded px-2.5 text-xs font-semibold",
                        typeClass[promotion.type],
                      )}
                    >
                      {promotion.typeLabel}
                    </span>
                  </BodyCell>
                  <BodyCell>
                    <p className="font-bold text-[#2f2419]">
                      {formatPromotionDiscountDetail(promotion)}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#6f5c49]">
                      {formatPromotionValueNote(promotion)}
                    </p>
                  </BodyCell>
                  <BodyCell>
                    <p className="font-semibold text-[#2f2419]">{promotion.period}</p>
                    <p className="mt-1 text-xs font-semibold text-[#6f5c49]">
                      {promotion.remaining}
                    </p>
                  </BodyCell>
                  <BodyCell>
                    <PromotionStatusBadge status={promotion.status} />
                  </BodyCell>
                  <BodyCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <ActionIcon
                        label={`ເບິ່ງ ${promotion.name}`}
                        icon={Eye}
                        onClick={() => onSelectPromotion(promotion.id)}
                      />
                      <ActionIcon
                        label={`ແກ້ໄຂ ${promotion.name}`}
                        icon={SquarePen}
                        onClick={() => onEditPromotion(promotion)}
                      />
                    </div>
                  </BodyCell>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex h-[58px] shrink-0 items-center justify-between border-t border-[#ded4c8] bg-[#fbfaf7] px-4 text-sm font-semibold text-[#4f4032]">
        <span>
          ສະແດງ {hasPromotions ? 1 : 0} - {promotions.length} ຈາກ {totalPromotions} ໂປຣໂມຊັນ
        </span>
        <div className="flex items-center gap-2">
          <PageButton disabled>ກ່ອນໜ້າ</PageButton>
          <PageButton active>1</PageButton>
          {totalPromotions > promotions.length && <PageButton>2</PageButton>}
          <PageButton>ຕໍ່ໄປ</PageButton>
          <button
            type="button"
            className="ml-2 h-9 cursor-pointer rounded-md border border-[#ded4c8] bg-white px-3 text-sm font-semibold text-[#4f4032] transition hover:bg-[#f6f1ea]"
          >
            10 / ໜ້າ
          </button>
        </div>
      </div>
    </div>
  )
}

export function PromotionDetailPanel({
  promotion,
  mode = "view",
  draft,
  saving = false,
  onChange,
  onSave,
  onCancel,
  onEdit,
  onDelete,
  onToggleStatus,
  categoryOptions = [],
  productOptions = [],
  errors = {},
}: {
  promotion: CafePromotion | null
  mode?: "view" | "create" | "edit"
  draft?: PromotionFormDraft
  errors?: PromotionFormErrors
  saving?: boolean
  onChange?: (promotion: Partial<PromotionFormDraft>) => void
  onSave?: () => void
  onCancel?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onToggleStatus?: () => void
  categoryOptions?: PromotionTargetOption[]
  productOptions?: PromotionTargetOption[]
}) {
  if (mode === "create" || mode === "edit") {
    const title = mode === "create" ? "ສ້າງໂປຣໂມຊັນ" : "ແກ້ໄຂໂປຣໂມຊັນ"
    const draftType = draft?.type ?? "percent"
    const scopedApplyOptions = getApplyScopeOptionsForType(draftType)

    return (
      <aside className="flex h-full min-h-0 flex-col border-l border-[#ded4c8] bg-white">
        <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-[#ded4c8] bg-[#fbfaf7] px-4">
          <h2 className="text-base font-bold text-[#2f2419]">{title}</h2>
          {draft?.status ? <PromotionStatusBadge status={draft.status} /> : null}
        </div>

        <form
          noValidate
          className="min-h-0 flex-1 overflow-y-auto p-4"
          onSubmit={(event) => {
            event.preventDefault()
            onSave?.()
          }}
        >
          <div className="space-y-3">
            <TextField
              label="ຊື່ໂປຣໂມຊັນ"
              value={draft?.name ?? ""}
              required
              error={errors.name}
              fieldName="name"
              onChange={(value) => onChange?.({ name: value })}
            />
            <TextField
              label="ລະຫັດໂປຣໂມຊັນ"
              value={draft?.code ?? ""}
              required
              error={errors.code}
              fieldName="code"
              onChange={(value) => onChange?.({ code: value.toUpperCase() })}
              onAction={() => onChange?.({ code: generatePromotionCode() })}
            />

            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="ປະເພດ"
                value={draft?.type ?? "percent"}
                options={promotionTypeOptions}
                onChange={(value) => {
                  const type = value as PromotionType

                  onChange?.({
                    type,
                    typeLabel: getPromotionTypeLabel(type),
                    applyScope: getDefaultApplyScope(type),
                    targetIds: [],
                    discountValue: 0,
                    maxDiscountAmount: null,
                  })
                }}
              />
              <SelectField
                label="ສະຖານະ"
                value={draft?.status ?? "active"}
                options={promotionStatusOptions}
                onChange={(value) => onChange?.({ status: value as PromotionStatus })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TextField
                label={getPromotionValueLabel(draftType)}
                value={draft?.value ?? ""}
                required
                error={errors.value}
                fieldName="value"
                onChange={(value) => onChange?.({ value })}
              />
              <TextField
                label={getPromotionValueNoteLabel(draftType)}
                value={draft?.valueNote ?? ""}
                onChange={(value) => onChange?.({ valueNote: value })}
              />
            </div>

            <section className="rounded-md border border-[#ded4c8] bg-[#fbfaf7] p-3">
              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  label="ໃຊ້ກັບ"
                  value={draft?.applyScope ?? "all_order"}
                  options={scopedApplyOptions}
                  onChange={(value) => onChange?.({ applyScope: value, targetIds: [] })}
                />
                <SummaryField
                  label="ເປົ້າໝາຍທີ່ເລືອກ"
                  value={`${draft?.targetIds?.length ?? 0} ລາຍການ`}
                />
              </div>
              <TargetSelector
                scope={draft?.applyScope ?? "all_order"}
                value={draft?.targetIds ?? []}
                categoryOptions={categoryOptions}
                productOptions={productOptions}
                onChange={(targetIds) => onChange?.({ targetIds })}
              />
            </section>

            <PromotionRuleFields type={draftType} draft={draft} onChange={onChange} />

            <section className="rounded-md border border-[#ded4c8] bg-[#fbfaf7] p-3">
              <div className="grid grid-cols-2 gap-3">
                <DateField
                  label="ຈາກວັນທີ"
                  value={draft?.startDate ?? ""}
                  onChange={(value) => onChange?.({ startDate: value })}
                />
                <DateField
                  label="ເຖິງວັນທີ"
                  value={draft?.endDate ?? ""}
                  onChange={(value) => onChange?.({ endDate: value })}
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[#ded4c8] pt-3">
                <SummaryField label="ໄລຍະເວລາໃຊ້ງານ" value={draft?.period || "ຍັງບໍ່ໄດ້ເລືອກ"} />
                <SummaryField label="ເວລາທີ່ເຫຼືອ" value={draft?.remaining || "ຍັງບໍ່ໄດ້ເລືອກ"} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[#ded4c8] pt-3">
                <TimeField
                  label="ເລີ່ມເວລາ"
                  value={draft?.startTime ?? ""}
                  onChange={(value) => onChange?.({ startTime: value || null })}
                />
                <TimeField
                  label="ສິ້ນສຸດເວລາ"
                  value={draft?.endTime ?? ""}
                  onChange={(value) => onChange?.({ endTime: value || null })}
                />
              </div>
            <DaySelector
              value={draft?.daysOfWeek ?? []}
              onChange={(daysOfWeek) => onChange?.({ daysOfWeek })}
            />
          </section>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#ded4c8] pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex h-11 cursor-pointer items-center justify-center rounded-md border border-[#ded4c8] bg-white text-sm font-semibold text-[#4f4032] transition hover:bg-[#f6f1ea]"
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex h-11 cursor-pointer items-center justify-center rounded-md bg-[#2f2419] text-sm font-semibold text-white transition hover:bg-[#3d2e20] disabled:cursor-wait disabled:opacity-70"
            >
              {saving ? "ກຳລັງບັນທຶກ" : "ບັນທຶກ"}
            </button>
          </div>
        </form>
      </aside>
    )
  }

  if (!promotion) {
    return (
      <aside className="flex h-full min-h-0 flex-col border-l border-[#ded4c8] bg-white">
        <div className="flex h-[58px] shrink-0 items-center border-b border-[#ded4c8] bg-[#fbfaf7] px-4">
          <h2 className="text-base font-bold text-[#2f2419]">ລາຍລະອຽດໂປຣໂມຊັນ</h2>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 text-center text-sm font-semibold text-[#6f5c49]">
          ເລືອກໂປຣໂມຊັນໜຶ່ງເພື່ອເບິ່ງລາຍລະອຽດ.
        </div>
      </aside>
    )
  }

  return (
    <aside className="flex h-full min-h-0 flex-col border-l border-[#ded4c8] bg-white">
      <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-[#ded4c8] bg-[#fbfaf7] px-4">
        <h2 className="text-base font-bold text-[#2f2419]">ລາຍລະອຽດໂປຣໂມຊັນ</h2>
        <PromotionStatusBadge status={promotion.status} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <h3 className="text-lg font-extrabold text-[#2f2419]">{promotion.name}</h3>
        <p className="mt-1 text-sm font-semibold text-[#6f5c49]">{promotion.code}</p>

        <dl className="mt-5 space-y-0 text-sm">
          <DetailRow label="ປະເພດໂປຣໂມຊັນ" value={promotion.typeLabel} />
          <DetailRow label="ມູນຄ່າ" value={promotion.value} />
          <DetailRow label="ຫຼຸດສູງສຸດ" value={promotion.valueNote} />
          <DetailRow label="ໃຊ້ກັບ" value={getApplyScopeLabel(promotion.applyScope)} />
          <DetailRow label="ID ເປົ້າໝາຍ" value={promotion.targetIds.length ? promotion.targetIds.join(", ") : "-"} />
          <DetailRow label="ຍອດຂັ້ນຕ່ຳ" value={formatKipDetail(promotion.minSubtotal)} />
          <DetailRow label="ຈຳນວນທີ່ຫຼຸດ" value={formatPromotionDiscountDetail(promotion)} />
          <DetailRow label="ຫຼຸດສູງສຸດ" value={promotion.maxDiscountAmount === null ? "-" : formatKipDetail(promotion.maxDiscountAmount)} />
          <DetailRow label="ໄລຍະເວລາໃຊ້ງານ" value={promotion.period} />
          <DetailRow label="ເວລາ" value={promotion.startTime && promotion.endTime ? `${promotion.startTime} - ${promotion.endTime}` : "-"} />
          <DetailRow label="ມື້" value={formatDays(promotion.daysOfWeek)} />
          <DetailRow label="ຂອບເຂດການໃຊ້" value={promotion.scope} />
          <DetailRow label="ເງື່ອນໄຂການໃຊ້" value={promotion.condition} />
          <DetailRow label="ບໍ່ໃຊ້ກັບ" value={promotion.exclusion} />
          <DetailRow label="ລາຍລະອຽດ" value={promotion.description} />
          <DetailRow label="ວັນທີສ້າງ" value={formatDateTime(promotion.createdAt)} />
          <DetailRow label="ຜູ້ສ້າງ" value={formatCreatorName(promotion.createdBy)} />
        </dl>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-[#ded4c8] bg-[#fbfaf7] p-4">
        <button
          type="button"
          onClick={onEdit}
          className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#ded4c8] bg-white text-sm font-semibold text-[#4f4032] transition hover:bg-[#f6f1ea]"
        >
          <SquarePen className="h-4 w-4" />
          ແກ້ໄຂ
        </button>
        <button
          type="button"
          onClick={onToggleStatus}
          className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-semibold text-[#a83224] transition hover:bg-[#fff7f5]"
        >
          {promotion.status === "paused" ? (
            <PlayCircle className="h-4 w-4" />
          ) : (
            <PauseCircle className="h-4 w-4" />
          )}
          {promotion.status === "paused" ? "ເປີດໃຊ້ງານ" : "ຢຸດຊົ່ວຄາວ"}
        </button>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 border-t border-[#ded4c8] bg-white text-sm font-semibold text-[#a83224] transition hover:bg-[#fff7f5]"
      >
        <Trash2 className="h-4 w-4" />
        ລຶບໂປຣໂມຊັນ
      </button>
    </aside>
  )
}

export function PromotionStatusBadge({ status }: { status: PromotionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded px-2.5 text-xs font-semibold",
        statusClass[status],
      )}
    >
      {statusLabel[status]}
    </span>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_minmax(0,1fr)] gap-4 border-b border-[#eee4d8] py-3 last:border-b-0">
      <dt className="font-semibold text-[#6f5c49]">{label}</dt>
      <dd className="text-right font-bold leading-6 text-[#2f2419]">{value}</dd>
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
  colSpan,
}: {
  children: ReactNode
  className?: string
  colSpan?: number
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn("border-b border-[#eee4d8] px-4 py-3 text-sm text-[#2f2419]", className)}
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
  disabled = false,
  onAction,
  error,
  fieldName,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  onAction?: () => void
  error?: string
  fieldName?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#4f4032]">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <span className="mt-2 flex h-10 rounded-md border border-[#ded4c8] bg-white focus-within:border-[#8d7157] focus-within:ring-2 focus-within:ring-[#e5d7c7]">
        <input
          value={value}
          required={required}
          disabled={disabled}
          data-promotion-field={fieldName}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 rounded-md bg-transparent px-3 text-sm font-medium text-[#2f2419] outline-none placeholder:text-[#ad9d8c] disabled:cursor-not-allowed disabled:bg-[#f1eee9] disabled:text-[#8a7560]"
        />
        {onAction ? (
          <button
            type="button"
            onClick={onAction}
            disabled={disabled}
            className="flex min-w-[74px] shrink-0 cursor-pointer items-center justify-center border-l border-[#ded4c8] px-3 text-xs font-semibold text-[#5a3718] transition hover:bg-[#f6f1ea] disabled:cursor-not-allowed disabled:opacity-50"
          >
            ສ້າງ
          </button>
        ) : null}
      </span>
      {error ? <p className="mt-1 text-xs font-semibold text-[#d04433]">{error}</p> : null}
    </label>
  )
}

function PromotionRuleFields({
  type,
  draft,
  onChange,
}: {
  type: PromotionType
  draft?: PromotionFormDraft
  onChange?: (promotion: Partial<PromotionFormDraft>) => void
}) {
  if (type === "percent") {
    return (
      <div className="grid grid-cols-3 gap-3">
        <NumberField
          label="ເປີເຊັນຫຼຸດ (%)"
          value={draft?.discountValue ?? 0}
          onChange={(value) => onChange?.({ discountValue: value })}
        />
        <NumberField
          label="ຍອດຂັ້ນຕ່ຳ"
          value={draft?.minSubtotal ?? 0}
          format="kip"
          onChange={(value) => onChange?.({ minSubtotal: value })}
        />
        <NumberField
          label="ຫຼຸດສູງສຸດ"
          value={draft?.maxDiscountAmount ?? 0}
          format="kip"
          onChange={(value) => onChange?.({ maxDiscountAmount: value || null })}
        />
      </div>
    )
  }

  if (type === "amount") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="ຈຳນວນເງິນທີ່ຫຼຸດ"
          value={draft?.discountValue ?? 0}
          format="kip"
          onChange={(value) => onChange?.({ discountValue: value })}
        />
        <NumberField
          label="ຍອດຂັ້ນຕ່ຳ"
          value={draft?.minSubtotal ?? 0}
          format="kip"
          onChange={(value) => onChange?.({ minSubtotal: value })}
        />
      </div>
    )
  }

  if (type === "bogo") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="ຈຳນວນທີ່ຕ້ອງຊື້"
          value={draft?.minSubtotal ?? 0}
          onChange={(value) => onChange?.({ minSubtotal: value })}
        />
        <NumberField
          label="ຈຳນວນທີ່ແຖມ"
          value={draft?.discountValue ?? 0}
          onChange={(value) => onChange?.({ discountValue: value })}
        />
      </div>
    )
  }

  if (type === "free-shipping") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="ຍອດຂັ້ນຕ່ຳສຳລັບສົ່ງຟຣີ"
          value={draft?.minSubtotal ?? 0}
          format="kip"
          onChange={(value) => onChange?.({ minSubtotal: value })}
        />
        <NumberField
          label="ຄ່າສົ່ງທີ່ຍົກເວັ້ນ"
          value={draft?.discountValue ?? 0}
          format="kip"
          onChange={(value) => onChange?.({ discountValue: value })}
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <NumberField
        label="ລາຄາຄອມໂບ"
        value={draft?.discountValue ?? 0}
        format="kip"
        onChange={(value) => onChange?.({ discountValue: value })}
      />
      <NumberField
        label="ຈຳນວນຂັ້ນຕ່ຳ"
        value={draft?.minSubtotal ?? 0}
        onChange={(value) => onChange?.({ minSubtotal: value })}
      />
    </div>
  )
}

function NumberField({
  label,
  value,
  onChange,
  format = "number",
}: {
  label: string
  value: number
  onChange: (value: number) => void
  format?: "number" | "kip"
}) {
  const displayValue = format === "kip" ? formatKipInput(value) : String(Number.isFinite(value) ? value : 0)

  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#4f4032]">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={(event) => onChange(parseNumberInput(event.target.value))}
        className="mt-2 h-10 w-full rounded-md border border-[#ded4c8] bg-white px-3 text-sm font-medium text-[#2f2419] outline-none transition focus:border-[#8d7157] focus:ring-2 focus:ring-[#e5d7c7]"
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
      <span className="text-sm font-semibold text-[#4f4032]">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-md border border-[#ded4c8] bg-white px-3 text-sm font-medium text-[#2f2419] outline-none transition focus:border-[#8d7157] focus:ring-2 focus:ring-[#e5d7c7]"
      />
    </label>
  )
}

function TimeField({
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
      <span className="text-sm font-semibold text-[#4f4032]">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        placeholder="00:00"
        maxLength={5}
        value={value}
        onChange={(event) => onChange(formatTimeInput(event.target.value))}
        onBlur={(event) => onChange(normalizeTimeInput(event.target.value))}
        className="mt-2 h-10 w-full rounded-md border border-[#ded4c8] bg-white px-3 text-sm font-medium text-[#2f2419] outline-none transition focus:border-[#8d7157] focus:ring-2 focus:ring-[#e5d7c7]"
      />
    </label>
  )
}

function DaySelector({
  value,
  onChange,
}: {
  value: number[]
  onChange: (value: number[]) => void
}) {
  const selectedDays = new Set(value)

  return (
    <div className="mt-3 border-t border-[#ded4c8] pt-3">
      <p className="text-sm font-semibold text-[#4f4032]">ມື້ທີ່ໃຊ້</p>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {dayOptions.map((day) => {
          const active = selectedDays.has(day.value)

          return (
            <button
              key={day.value}
              type="button"
              onClick={() => {
                const next = active
                  ? value.filter((item) => item !== day.value)
                  : [...value, day.value]

                onChange(next)
              }}
              className={cn(
                "h-9 cursor-pointer rounded-md border text-xs font-black transition",
                active
                  ? "border-[#2f2419] bg-[#2f2419] text-white"
                  : "border-[#ded4c8] bg-white text-[#4f4032] hover:bg-[#f6f1ea]",
              )}
            >
              {day.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TargetSelector({
  scope,
  value,
  categoryOptions,
  productOptions,
  onChange,
}: {
  scope: PromotionApplyScope
  value: string[]
  categoryOptions: PromotionTargetOption[]
  productOptions: PromotionTargetOption[]
  onChange: (value: string[]) => void
}) {
  const options =
    scope === "category" ? categoryOptions : scope === "product" ? productOptions : []

  if (scope === "all_order") {
    return (
      <p className="mt-3 border-t border-[#ded4c8] pt-3 text-xs font-semibold leading-5 text-[#8a7560]">
        ໂປຣໂມຊັນນີ້ໃຊ້ກັບທັງອໍເດີ ບໍ່ຕ້ອງເລືອກສິນຄ້າ.
      </p>
    )
  }

  if (scope !== "category" && scope !== "product") {
    return (
      <p className="mt-3 border-t border-[#ded4c8] pt-3 text-xs font-semibold leading-5 text-[#8a7560]">
        ປະເພດນີ້ຈະຮອງຮັບຕົວເລືອກເປົ້າໝາຍໃນຂັ້ນຕໍ່ໄປ.
      </p>
    )
  }

  if (!options.length) {
    return (
      <p className="mt-3 border-t border-[#ded4c8] pt-3 text-xs font-semibold leading-5 text-[#8a7560]">
        ຍັງບໍ່ມີລາຍການໃຫ້ເລືອກ.
      </p>
    )
  }

  return (
    <div className="mt-3 border-t border-[#ded4c8] pt-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#4f4032]">ເລືອກເປົ້າໝາຍ</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(options.map((option) => option.id))}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#ded4c8] bg-white text-[#5a3718] transition hover:bg-[#f6f1ea]"
            aria-label="ເລືອກທັງໝົດ"
          >
            <CheckSquare className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange([])}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#ffd2cb] bg-[#fff7f5] text-[#d04433] transition hover:bg-[#fff0ed]"
            aria-label="ລ້າງ"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-2 flex max-h-44 flex-wrap gap-2 overflow-y-auto rounded-md border border-[#ded4c8] bg-white p-2">
        {options.map((option) => {
          const active = value.includes(option.id)

          return (
            <label
              key={option.id}
              className={cn(
                "inline-flex max-w-full flex-none cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-xs font-semibold transition",
                active ? "bg-[#f6efe5] text-[#2f2419]" : "text-[#4f4032] hover:bg-[#fbf7f1]",
              )}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => {
                  onChange(
                    active
                      ? value.filter((item) => item !== option.id)
                      : [...value, option.id],
                  )
                }}
                className="h-4 w-4 shrink-0 cursor-pointer rounded border-[#cbbba8] accent-[#2f2419]"
              />
              <span className="min-w-0 flex-1 truncate">{option.label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#6f5c49]">{label}</p>
      <p className="mt-1 min-h-5 text-sm font-bold leading-5 text-[#2f2419]">{value}</p>
    </div>
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
      <span className="text-sm font-semibold text-[#4f4032]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as TValue)}
        className="mt-2 h-10 w-full cursor-pointer rounded-md border border-[#ded4c8] bg-white px-3 text-sm font-medium text-[#2f2419] outline-none focus:border-[#8d7157]"
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
      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#4f4032] transition hover:bg-[#f6f1ea]"
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

function PageButton({
  children,
  active = false,
  disabled = false,
}: {
  children: ReactNode
  active?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md border px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:border-[#ded4c8] disabled:bg-[#eee9e3] disabled:text-[#6f5c49]",
        active
          ? "border-[#2f2419] bg-[#2f2419] text-white"
          : "border-[#ded4c8] bg-white text-[#4f4032] hover:bg-[#f6f1ea]",
      )}
    >
      {children}
    </button>
  )
}

function getPromotionTypeLabel(type: PromotionType) {
  return promotionTypeOptions.find((option) => option.value === type)?.label ?? "ຫຼຸດ %"
}

function getDefaultApplyScope(type: PromotionType): PromotionApplyScope {
  if (type === "bogo") return "product"
  if (type === "combo") return "combo"

  return "all_order"
}

function getApplyScopeOptionsForType(type: PromotionType) {
  if (type === "bogo") {
    return applyScopeOptions.filter((option) =>
      ["product", "category"].includes(option.value),
    )
  }

  if (type === "free-shipping") {
    return applyScopeOptions.filter((option) => option.value === "all_order")
  }

  if (type === "combo") {
    return applyScopeOptions.filter((option) =>
      ["combo", "product", "category"].includes(option.value),
    )
  }

  return applyScopeOptions.filter((option) =>
    ["all_order", "category", "product", "customer_group"].includes(option.value),
  )
}

function getPromotionValueLabel(type: PromotionType) {
  if (type === "percent") return "ຂໍ້ຄວາມສ່ວນຫຼຸດ"
  if (type === "amount") return "ຂໍ້ຄວາມຈຳນວນເງິນ"
  if (type === "bogo") return "ຂໍ້ຄວາມຊື້/ແຖມ"
  if (type === "free-shipping") return "ຂໍ້ຄວາມສົ່ງຟຣີ"

  return "ຂໍ້ຄວາມຄອມໂບ"
}

function getPromotionValueNoteLabel(type: PromotionType) {
  if (type === "percent") return "ຈຳກັດສ່ວນຫຼຸດ"
  if (type === "amount") return "ເງື່ອນໄຂຍອດບິນ"
  if (type === "bogo") return "ສິນຄ້າທີ່ແຖມ"
  if (type === "free-shipping") return "ເງື່ອນໄຂການສົ່ງ"

  return "ລາຍການໃນຄອມໂບ"
}

function generatePromotionCode() {
  const random = Math.random().toString(36).slice(2, 7).toUpperCase().padEnd(5, "0")

  return `PM${random}`
}

function getApplyScopeLabel(value: PromotionApplyScope) {
  return applyScopeOptions.find((option) => option.value === value)?.label ?? value
}

function formatNumber(value: number) {
  return value.toLocaleString("vi-VN")
}

function formatKipDetail(value: number) {
  return `${value.toLocaleString("en-US")} ກີບ`
}

function formatPromotionDiscountDetail(promotion: CafePromotion) {
  if (promotion.type === "percent") return `${formatNumber(promotion.discountValue)}%`
  if (promotion.type === "bogo") return formatNumber(promotion.discountValue)

  return formatKipDetail(promotion.discountValue)
}

function formatPromotionValueNote(promotion: CafePromotion) {
  if (promotion.type === "percent" && promotion.maxDiscountAmount) {
    return `ສູງສຸດ ${formatKipDetail(promotion.maxDiscountAmount)}`
  }

  if (promotion.minSubtotal) {
    return `ຍອດຂັ້ນຕ່ຳ ${formatKipDetail(promotion.minSubtotal)}`
  }

  return promotion.valueNote || "-"
}

function formatDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
}

function formatCreatorName(value: string) {
  if (value !== "API" && value !== "ລະບົບ") return formatCreatorRole(value)

  const session = getPosSession()
  if (session && canShowSessionAsCreator(session.role)) {
    return formatCreatorRole(session.role)
  }

  return "ລະບົບ"
}

function formatCreatorRole(role: string) {
  const normalized = role.trim().toLowerCase()

  if (
    normalized === "owner" ||
    normalized === "chủ quán" ||
    normalized === "chu quan" ||
    normalized.includes("ເຈົ້າຂອງ")
  ) {
    return "ເຈົ້າຂອງຮ້ານ"
  }

  if (normalized === "admin" || normalized === "administrator") {
    return "ຜູ້ດູແລລະບົບ"
  }

  return role
}

function canShowSessionAsCreator(role: string) {
  const normalized = role.trim().toLowerCase()

  return (
    normalized === "owner" ||
    normalized === "admin" ||
    normalized === "administrator" ||
    normalized === "chủ quán" ||
    normalized === "chu quan" ||
    normalized.includes("ເຈົ້າຂອງ")
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

function formatTimeInput(value: string) {
  const digits = value.replace(/[^\d]/g, "").slice(0, 4)

  if (digits.length <= 2) return digits

  return `${digits.slice(0, 2)}:${digits.slice(2)}`
}

function normalizeTimeInput(value: string) {
  const digits = value.replace(/[^\d]/g, "")
  if (!digits) return ""

  const padded = digits.padEnd(4, "0").slice(0, 4)
  const hour = Math.min(23, Number(padded.slice(0, 2)) || 0)
  const minute = Math.min(59, Number(padded.slice(2, 4)) || 0)

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}

function formatDays(values: number[]) {
  if (!values.length) return "ບໍ່ຈຳກັດມື້"

  return dayOptions
    .filter((day) => values.includes(day.value))
    .map((day) => day.fullLabel)
    .join(", ")
}
