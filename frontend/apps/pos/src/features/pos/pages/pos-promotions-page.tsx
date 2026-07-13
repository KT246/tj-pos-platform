import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  ChevronDown,
  PauseCircle,
  PlayCircle,
  Plus,
  Search,
  Tag,
  XCircle,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

import {
  createPosPromotion,
  deletePosPromotion,
  listPosPromotions,
  updatePosPromotion,
  type CafePromotion,
  type PromotionKpi,
  type PromotionStatus,
  type PromotionType,
  type SavePromotionBody,
} from "@/features/pos/api/pos-promotions-api"
import { listPosCategories } from "@/features/pos/api/pos-categories-api"
import { listPosItems } from "@/features/pos/api/pos-items-api"
import { PosConfirmDialog } from "@/features/pos/components/notifications/pos-notification-ui"
import { showPosToast } from "@/features/pos/components/notifications/pos-toast-store"
import { getCategoryKey } from "@/features/pos/lib/category-key"
import { getPosSession } from "@/features/pos/lib/pos-session"
import {
  type PromotionFormDraft,
  PromotionDetailPanel,
  type PromotionFormErrors,
  PromotionKpiCard,
  PromotionTable,
  type PromotionTargetOption,
} from "@/features/pos/components/promotions/promotion-widgets"
import { PromotionsTopbar } from "@/features/pos/components/promotions/promotions-topbar"
import { promoTabs } from "@/features/pos/data/cafe-promotions"

type PromotionTab = (typeof promoTabs)[number]
type PromotionPanelMode = "view" | "create" | "edit"
const systemCreatorLabel = "ລະບົບ"

const tabStatusMap: Partial<Record<PromotionTab, PromotionStatus>> = {
  "ກຳລັງໃຊ້ງານ": "active",
  "ຢຸດຊົ່ວຄາວ": "paused",
  "ກຳລັງຈະເລີ່ມ": "upcoming",
  "ສິ້ນສຸດແລ້ວ": "ended",
}

const promotionKpiIcons = [Tag, PlayCircle, PauseCircle, XCircle]
const emptyPromotions: CafePromotion[] = []
const emptyKpis: PromotionKpi[] = []
const typeLabelByType: Record<PromotionType, string> = {
  percent: "ຫຼຸດ %",
  amount: "ຫຼຸດເປັນເງິນ",
  bogo: "ຊື້ X ແຖມ Y",
  "free-shipping": "ສົ່ງຟຣີ",
  combo: "ຄອມໂບ",
}
const applyScopeLabelByScope: Record<string, string> = {
  all_order: "ທັງອໍເດີ",
  category: "ໝວດສິນຄ້າ",
  product: "ສິນຄ້າ",
  combo: "ຄອມໂບ",
  customer_group: "ກຸ່ມລູກຄ້າ",
}
const promotionDayLabels = [
  { value: 1, label: "ວັນຈັນ" },
  { value: 2, label: "ວັນອັງຄານ" },
  { value: 3, label: "ວັນພຸດ" },
  { value: 4, label: "ວັນພະຫັດ" },
  { value: 5, label: "ວັນສຸກ" },
  { value: 6, label: "ວັນເສົາ" },
  { value: 0, label: "ວັນອາທິດ" },
]

const emptyPromotionDraft: PromotionFormDraft = {
  name: "",
  code: "",
  type: "percent",
  typeLabel: "ຫຼຸດ %",
  value: "",
  valueNote: "",
  period: "",
  remaining: "",
  status: "active",
  image: "",
  appliesTo: "",
  scope: "",
  condition: "",
  exclusion: "",
  description: "",
  createdBy: systemCreatorLabel,
  applyScope: "all_order",
  targetIds: [],
  minSubtotal: 0,
  discountValue: 0,
  maxDiscountAmount: null,
  startTime: null,
  endTime: null,
  daysOfWeek: [],
  startDate: getTodayInputValue(),
  endDate: addDaysInputValue(getTodayInputValue(), 7),
}

export function PosPromotionsPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<PromotionTab>("ທັງໝົດ")
  const [selectedPromotionId, setSelectedPromotionId] = useState("")
  const [search, setSearch] = useState("")
  const [panelMode, setPanelMode] = useState<PromotionPanelMode>("view")
  const [draftPromotion, setDraftPromotion] =
    useState<PromotionFormDraft>(buildDefaultPromotionDraft())
  const [promotionErrors, setPromotionErrors] = useState<PromotionFormErrors>({})
  const pendingErrorFocusRef = useRef<keyof PromotionFormErrors | null>(null)
  const [deletePromotionId, setDeletePromotionId] = useState<string | null>(null)
  const tabStatus = tabStatusMap[activeTab]
  const promotionsQuery = useQuery({
    queryKey: ["pos-promotions", { activeTab, search }],
    queryFn: () =>
      listPosPromotions({
        q: search.trim() || undefined,
        status: tabStatus,
        page: 1,
        pageSize: 50,
      }),
    refetchOnMount: "always",
  })
  const categoriesQuery = useQuery({
    queryKey: ["pos-categories", "promotion-targets"],
    queryFn: listPosCategories,
  })
  const itemsQuery = useQuery({
    queryKey: ["pos-items", "promotion-targets"],
    queryFn: listPosItems,
  })
  const visiblePromotions = promotionsQuery.data?.promotions ?? emptyPromotions
  const promotionKpis = promotionsQuery.data?.kpis ?? emptyKpis
  const totalPromotions = promotionsQuery.data?.pagination.total ?? visiblePromotions.length
  const selectedPromotion =
    visiblePromotions.find((promotion) => promotion.id === selectedPromotionId) ??
    visiblePromotions[0] ??
    null
  const deletingPromotion =
    visiblePromotions.find((promotion) => promotion.id === deletePromotionId) ?? null
  const categoryOptions: PromotionTargetOption[] =
    categoriesQuery.data?.categories.map((category) => ({
      id: getCategoryKey(category.name),
      label: category.name,
    })) ?? []
  const productOptions: PromotionTargetOption[] =
    itemsQuery.data?.items.map((item) => ({
      id: item.id,
      label: item.name,
    })) ?? []

  const createMutation = useMutation({
    mutationFn: createPosPromotion,
  })
  const updateMutation = useMutation({
    mutationFn: ({
      promotionId,
      promotion,
    }: {
      promotionId: string
      promotion: SavePromotionBody
    }) => updatePosPromotion(promotionId, promotion),
  })
  const deleteMutation = useMutation({
    mutationFn: deletePosPromotion,
  })
  const savingPromotion = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (!visiblePromotions.length) {
      setSelectedPromotionId("")
      if (!promotionsQuery.isLoading && panelMode === "view") {
        setPanelMode("create")
        setDraftPromotion(buildDefaultPromotionDraft())
      }

      return
    }

    const stillVisible = visiblePromotions.some(
      (promotion) => promotion.id === selectedPromotionId,
    )

    if (!stillVisible) {
      setSelectedPromotionId(visiblePromotions[0].id)
    }
  }, [panelMode, promotionsQuery.isLoading, selectedPromotionId, visiblePromotions])

  useEffect(() => {
    if (panelMode === "view" && selectedPromotion) {
      setDraftPromotion(mapPromotionToDraft(selectedPromotion))
    }
  }, [panelMode, selectedPromotion])

  useEffect(() => {
    if (!pendingErrorFocusRef.current) return

    const field = pendingErrorFocusRef.current
    pendingErrorFocusRef.current = null
    window.requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>(`[data-promotion-field="${field}"]`)
        ?.focus()
    })
  }, [promotionErrors])

  function openCreatePanel() {
    setPanelMode("create")
    setSelectedPromotionId("")
    setPromotionErrors({})
    setDraftPromotion(buildDefaultPromotionDraft())
  }

  function selectPromotion(promotionId: string) {
    setSelectedPromotionId(promotionId)
    setPanelMode("view")
    setPromotionErrors({})
  }

  function openEditPanel(promotion: CafePromotion | null) {
    if (!promotion) return

    setSelectedPromotionId(promotion.id)
    setPanelMode("edit")
    setPromotionErrors({})
    setDraftPromotion(mapPromotionToDraft(promotion))
  }

  function updateDraft(promotion: Partial<PromotionFormDraft>) {
    setPromotionErrors((current) => {
      const next = { ...current }

      if (promotion.name !== undefined) delete next.name
      if (promotion.code !== undefined) delete next.code
      if (promotion.value !== undefined) delete next.value

      return next
    })
    setDraftPromotion((current) => {
      const nextType = promotion.type ?? current.type ?? "percent"
      const nextDiscountValue =
        promotion.discountValue ??
        (promotion.value !== undefined && (nextType === "percent" || nextType === "amount")
          ? parsePromotionValue(promotion.value)
          : current.discountValue)
      const nextDraft = {
        ...current,
        ...promotion,
        discountValue: nextDiscountValue,
        typeLabel:
          promotion.type && !promotion.typeLabel
            ? typeLabelByType[nextType]
            : promotion.typeLabel ?? current.typeLabel,
      }
      const nextPeriod = buildPeriodLabel(nextDraft.startDate, nextDraft.endDate)
      const nextRemaining = buildRemainingLabel(nextDraft.status, nextDraft.endDate)

      return {
        ...nextDraft,
        period: nextPeriod,
        remaining: nextRemaining,
      }
    })
  }

  async function savePromotion() {
    const body = normalizePromotionDraft(draftPromotion, {
      categoryOptions,
      productOptions,
    })
    const nextErrors: PromotionFormErrors = {}

    if (!body.name) nextErrors.name = "ກະລຸນາປ້ອນຊື່ໂປຣໂມຊັນ."
    if (!body.code) nextErrors.code = "ກະລຸນາປ້ອນລະຫັດໂປຣໂມຊັນ."
    if (!body.value) nextErrors.value = "ກະລຸນາປ້ອນມູນຄ່າໂປຣໂມຊັນ."

    if (Object.keys(nextErrors).length) {
      pendingErrorFocusRef.current =
        !body.name ? "name" : !body.code ? "code" : "value"
      setPromotionErrors(nextErrors)
      return
    }

    try {
      setPromotionErrors({})
      if (panelMode === "create") {
        const createdPromotion = await createMutation.mutateAsync(body)

        await queryClient.invalidateQueries({ queryKey: ["pos-promotions"] })
        setSelectedPromotionId(createdPromotion.id)
        setPanelMode("view")
        showPosToast({
          type: "success",
          title: "ສ້າງໂປຣໂມຊັນແລ້ວ",
          description: `${createdPromotion.name} ຖືກບັນທຶກແລ້ວ.`,
        })
        return
      }

      if (!selectedPromotion) return

      const updatedPromotion = await updateMutation.mutateAsync({
        promotionId: selectedPromotion.id,
        promotion: body,
      })

      await queryClient.invalidateQueries({ queryKey: ["pos-promotions"] })
      setSelectedPromotionId(updatedPromotion.id)
      setPanelMode("view")
      showPosToast({
        type: "success",
        title: "ອັບເດດໂປຣໂມຊັນແລ້ວ",
        description: `${updatedPromotion.name} ຖືກບັນທຶກແລ້ວ.`,
      })
    } catch (error) {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດບັນທຶກໂປຣໂມຊັນໄດ້",
        description: getApiErrorMessage(error),
      })
    }
  }

  async function togglePromotionStatus() {
    if (!selectedPromotion) return

    const nextStatus: PromotionStatus =
      selectedPromotion.status === "paused" ? "active" : "paused"

    try {
      const updatedPromotion = await updateMutation.mutateAsync({
        promotionId: selectedPromotion.id,
        promotion: {
          ...mapPromotionToDraft(selectedPromotion),
          status: nextStatus,
          remaining:
            nextStatus === "paused" ? "ຢຸດຊົ່ວຄາວ" : selectedPromotion.remaining,
        },
      })

      await queryClient.invalidateQueries({ queryKey: ["pos-promotions"] })
      setSelectedPromotionId(updatedPromotion.id)
      showPosToast({
        type: "success",
        title: nextStatus === "paused" ? "ຢຸດຊົ່ວຄາວແລ້ວ" : "ເປີດໃຊ້ງານແລ້ວ",
        description: updatedPromotion.name,
      })
    } catch (error) {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດປ່ຽນສະຖານະໄດ້",
        description: getApiErrorMessage(error),
      })
    }
  }

  async function confirmDeletePromotion() {
    if (!deletePromotionId) return

    try {
      await deleteMutation.mutateAsync(deletePromotionId)
      await queryClient.invalidateQueries({ queryKey: ["pos-promotions"] })
      if (selectedPromotionId === deletePromotionId) {
        setSelectedPromotionId("")
      }
      setDeletePromotionId(null)
      setPanelMode("view")
      showPosToast({
        type: "success",
        title: "ລຶບໂປຣໂມຊັນແລ້ວ",
        description: "ໂປຣໂມຊັນຖືກນຳອອກຈາກລາຍການແລ້ວ.",
      })
    } catch (error) {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດລຶບໂປຣໂມຊັນໄດ້",
        description: getApiErrorMessage(error),
      })
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-[#f3efe7] text-[#2f2419]">
      <div className="flex h-full min-w-[1280px]">
        <section className="flex min-w-0 flex-1 flex-col">
          <PromotionsTopbar />

          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_390px] gap-3 p-3">
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#ded4c8] bg-white shadow-[0_12px_28px_rgba(52,40,28,0.08)]"
            >
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#ded4c8] bg-[#fbfaf7] px-5 py-4">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-normal text-[#2f2419]">
                    ໂປຣໂມຊັນ
                  </h1>
                  <p className="mt-1 text-sm font-semibold text-[#6f5c49]">
                    ຈັດການໂປຣໂມຊັນ ແລະ ລະຫັດສ່ວນຫຼຸດ.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openCreatePanel}
                  className="flex h-10 cursor-pointer items-center gap-2 rounded-md bg-[#2f2419] px-4 text-sm font-semibold text-white transition hover:bg-[#4a3726]"
                >
                  <Plus className="h-4 w-4" />
                  ສ້າງໂປຣໂມຊັນ
                </button>
              </div>

              <div className="grid h-[84px] shrink-0 grid-cols-4 border-b border-[#ded4c8] bg-white py-3">
                {promotionKpis.map((kpi, index) => {
                  const Icon = promotionKpiIcons[index] ?? promotionKpiIcons[0]

                  return <PromotionKpiCard key={kpi.id} kpi={kpi} icon={Icon} />
                })}
              </div>

              <div className="flex h-[58px] shrink-0 items-center gap-3 border-b border-[#ded4c8] bg-[#fbfaf7] px-4">
                <label className="relative w-[330px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7560]" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-10 w-full rounded-md border border-[#ded4c8] bg-white pl-10 pr-3 text-sm font-medium text-[#2f2419] outline-none transition placeholder:text-[#8a7560] focus:border-[#8d7157] focus:ring-2 focus:ring-[#e5d7c7]"
                    placeholder="ຄົ້ນຫາຊື່ ຫຼື ລະຫັດໂປຣໂມຊັນ..."
                  />
                </label>

                <SelectBox
                  value={activeTab}
                  options={promoTabs}
                  onChange={(value) => setActiveTab(value as PromotionTab)}
                />
              </div>

              <PromotionTable
                promotions={visiblePromotions}
                selectedPromotionId={selectedPromotion?.id ?? ""}
                totalPromotions={totalPromotions}
                loading={promotionsQuery.isLoading}
                onSelectPromotion={selectPromotion}
                onEditPromotion={openEditPanel}
              />
            </motion.section>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="h-full min-h-0"
            >
              <PromotionDetailPanel
                promotion={selectedPromotion}
                mode={panelMode}
                draft={draftPromotion}
                errors={promotionErrors}
                saving={savingPromotion}
                onChange={updateDraft}
                onSave={savePromotion}
                onCancel={() => {
                  if (!visiblePromotions.length) {
                    setPromotionErrors({})
                    setDraftPromotion(buildDefaultPromotionDraft())
                    return
                  }

                  setPromotionErrors({})
                  setPanelMode("view")
                }}
                onEdit={() => openEditPanel(selectedPromotion)}
                onDelete={() => selectedPromotion && setDeletePromotionId(selectedPromotion.id)}
                onToggleStatus={togglePromotionStatus}
                categoryOptions={categoryOptions}
                productOptions={productOptions}
              />
            </motion.div>
          </div>
        </section>
      </div>

      <PosConfirmDialog
        open={Boolean(deletingPromotion)}
        title="ລຶບໂປຣໂມຊັນນີ້ບໍ?"
        description={
          deletingPromotion
            ? `${deletingPromotion.name} ຈະບໍ່ສະແດງໃນລາຍການໂປຣໂມຊັນອີກ.`
            : ""
        }
        confirmLabel={deleteMutation.isPending ? "ກຳລັງລຶບ" : "ລຶບ"}
        onCancel={() => setDeletePromotionId(null)}
        onConfirm={confirmDeletePromotion}
      />
    </main>
  )
}

function mapPromotionToDraft(promotion: CafePromotion): PromotionFormDraft {
  const parsedRange = parsePeriodLabel(promotion.period)

  return {
    name: promotion.name,
    code: promotion.code,
    type: promotion.type,
    typeLabel: promotion.typeLabel,
    value: promotion.value,
    valueNote: promotion.valueNote,
    period: promotion.period,
    remaining: promotion.remaining,
    status: promotion.status,
    image: promotion.image,
    appliesTo: promotion.appliesTo,
    scope: promotion.scope,
    condition: promotion.condition,
    exclusion: promotion.exclusion,
    description: promotion.description,
    createdBy: promotion.createdBy,
    applyScope: promotion.applyScope,
    targetIds: promotion.targetIds,
    minSubtotal: promotion.minSubtotal,
    discountValue: promotion.discountValue,
    maxDiscountAmount: promotion.maxDiscountAmount,
    startTime: promotion.startTime,
    endTime: promotion.endTime,
    daysOfWeek: promotion.daysOfWeek,
    startDate: promotion.startDate ?? parsedRange.startDate,
    endDate: promotion.endDate ?? parsedRange.endDate,
  }
}

function normalizePromotionDraft(
  draft: PromotionFormDraft,
  targetOptions: {
    categoryOptions: PromotionTargetOption[]
    productOptions: PromotionTargetOption[]
  },
): SavePromotionBody {
  const type = draft.type ?? "percent"
  const period = buildPeriodLabel(draft.startDate, draft.endDate)
  const remaining = buildRemainingLabel(draft.status, draft.endDate)
  const autoCopy = buildPromotionAutoCopy(draft, type, period, targetOptions)

  return {
    name: draft.name?.trim() ?? "",
    code: draft.code?.trim().toUpperCase() ?? "",
    type,
    typeLabel: draft.typeLabel?.trim() || typeLabelByType[type],
    value: draft.value?.trim() ?? "",
    valueNote: draft.valueNote?.trim() ?? "",
    period,
    remaining,
    status: draft.status ?? "active",
    image: draft.image ?? "",
    appliesTo: autoCopy.appliesTo,
    scope: autoCopy.scope,
    condition: autoCopy.condition,
    exclusion: autoCopy.exclusion,
    description: autoCopy.description,
    createdBy: draft.createdBy?.trim() || getPromotionCreatorName(),
    applyScope: draft.applyScope ?? "all_order",
    targetIds: draft.applyScope === "all_order" ? [] : draft.targetIds ?? [],
    minSubtotal: draft.minSubtotal ?? 0,
    discountValue: draft.discountValue ?? 0,
    maxDiscountAmount: draft.maxDiscountAmount ?? null,
    startDate: draft.startDate || null,
    endDate: draft.endDate || null,
    startTime: draft.startTime || null,
    endTime: draft.endTime || null,
    daysOfWeek: draft.daysOfWeek ?? [],
  }
}

function buildPromotionAutoCopy(
  draft: PromotionFormDraft,
  type: PromotionType,
  period: string,
  targetOptions: {
    categoryOptions: PromotionTargetOption[]
    productOptions: PromotionTargetOption[]
  },
) {
  const applyScope = draft.applyScope ?? "all_order"
  const targetIds = applyScope === "all_order" ? [] : draft.targetIds ?? []
  const targetLabel = buildPromotionTargetLabel(applyScope, targetIds, targetOptions)
  const typeLabel = typeLabelByType[type]
  const valueLabel = draft.value?.trim() || typeLabel
  const minSubtotalLabel = draft.minSubtotal
    ? `ຍອດຂັ້ນຕ່ຳ ${formatKipAmount(draft.minSubtotal)} ກີບ`
    : "ບໍ່ມີຍອດຂັ້ນຕ່ຳ"
  const timeLabel =
    draft.startTime && draft.endTime
      ? `ເວລາ ${draft.startTime} - ${draft.endTime}`
      : "ບໍ່ຈຳກັດເວລາ"
  const dayLabel = formatPromotionDays(draft.daysOfWeek ?? [])
  const periodLabel = period || "ບໍ່ຈຳກັດວັນທີ"

  return {
    appliesTo: targetLabel,
    scope: `ໃຊ້ກັບ ${targetLabel}`,
    condition: [minSubtotalLabel, periodLabel, timeLabel, dayLabel].join(" / "),
    exclusion:
      applyScope !== "all_order" && !targetIds.length
        ? "ຍັງບໍ່ໄດ້ເລືອກເປົ້າໝາຍ"
        : "ບໍ່ມີຂໍ້ຍົກເວັ້ນ",
    description: `${typeLabel} ${valueLabel} ສຳລັບ ${targetLabel}.`,
  }
}

function buildPromotionTargetLabel(
  applyScope: string,
  targetIds: string[],
  targetOptions: {
    categoryOptions: PromotionTargetOption[]
    productOptions: PromotionTargetOption[]
  },
) {
  if (applyScope === "all_order") return applyScopeLabelByScope.all_order

  const options =
    applyScope === "category"
      ? targetOptions.categoryOptions
      : applyScope === "product"
        ? targetOptions.productOptions
        : []
  const selectedNames =
    options.length > 0
      ? targetIds.map((id) => options.find((option) => option.id === id)?.label ?? id)
      : targetIds

  if (selectedNames.length) {
    return `${applyScopeLabelByScope[applyScope] ?? applyScope}: ${selectedNames.join(", ")}`
  }

  return applyScopeLabelByScope[applyScope] ?? applyScope
}

function formatPromotionDays(values: number[]) {
  if (!values.length) return "ບໍ່ຈຳກັດມື້"

  return promotionDayLabels
    .filter((day) => values.includes(day.value))
    .map((day) => day.label)
    .join(", ")
}

function formatKipAmount(value: number) {
  return Math.round(value).toLocaleString("en-US")
}

function buildDefaultPromotionDraft(): PromotionFormDraft {
  const startDate = getTodayInputValue()
  const endDate = addDaysInputValue(startDate, 7)

  return {
    ...emptyPromotionDraft,
    code: generatePromotionCode(),
    createdBy: getPromotionCreatorName(),
    startDate,
    endDate,
    period: buildPeriodLabel(startDate, endDate),
    remaining: buildRemainingLabel("active", endDate),
  }
}

function generatePromotionCode() {
  const random = Math.random().toString(36).slice(2, 7).toUpperCase().padEnd(5, "0")

  return `PM${random}`
}

function getPromotionCreatorName() {
  const session = getPosSession()

  if (!session) return systemCreatorLabel

  return canUseSessionAsPromotionCreator(session.role) ? session.role : systemCreatorLabel
}

function canUseSessionAsPromotionCreator(role: string) {
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

function parsePeriodLabel(period: string) {
  const [startValue, endValue] = period.split(" - ").map((value) => value.trim())

  return {
    startDate: parseDateLabel(startValue),
    endDate: parseDateLabel(endValue),
  }
}

function parseDateLabel(value?: string) {
  if (!value) return ""

  const [day, month, year] = value.split("/")
  if (!day || !month || !year) return ""

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}

function buildPeriodLabel(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) return ""

  return `${formatInputDate(startDate)} - ${formatInputDate(endDate)}`
}

function buildRemainingLabel(status?: PromotionStatus, endDate?: string) {
  if (status === "paused") return "ຢຸດຊົ່ວຄາວ"
  if (status === "ended") return "ສິ້ນສຸດແລ້ວ"
  if (status === "upcoming") return "ກຳລັງຈະເລີ່ມ"
  if (!endDate) return ""

  const today = stripTime(new Date())
  const targetDate = stripTime(new Date(`${endDate}T00:00:00`))
  const days = Math.ceil((targetDate.getTime() - today.getTime()) / 86_400_000)

  if (days < 0) return "ສິ້ນສຸດແລ້ວ"
  if (days === 0) return "ເຫຼືອມື້ນີ້"

  return `ເຫຼືອ ${days} ມື້`
}

function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function formatInputDate(value: string) {
  const [year, month, day] = value.split("-")

  return `${day}/${month}/${year}`
}

function getTodayInputValue() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function parsePromotionValue(value: string) {
  const normalized = value.replace(/[^\d]/g, "")
  const numeric = Number(normalized)

  return Number.isFinite(numeric) ? numeric : 0
}

function addDaysInputValue(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`)

  date.setDate(date.getDate() + days)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function getApiErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data

    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message
    }
  }

  return "ກະລຸນາກວດຂໍ້ມູນ ແລ້ວລອງໃໝ່."
}

function SelectBox({
  label,
  value,
  options,
  onChange,
}: {
  label?: string
  value?: string
  options?: readonly string[]
  onChange?: (value: string) => void
}) {
  return (
    <label className="relative w-[190px]">
      <select
        value={value ?? label}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-10 w-full cursor-pointer appearance-none rounded-md border border-[#ded4c8] bg-white px-3 pr-9 text-sm font-medium text-[#4f4032] outline-none transition focus:border-[#8d7157] focus:ring-2 focus:ring-[#e5d7c7]"
      >
        {(options ?? [label ?? ""]).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f5c49]" />
    </label>
  )
}
