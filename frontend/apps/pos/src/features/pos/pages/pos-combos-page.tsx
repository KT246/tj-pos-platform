import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  CheckCircle2,
  ChevronDown,
  PackageOpen,
  PauseCircle,
  Search,
  SquarePen,
  XCircle,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  createPosCombo,
  deletePosCombo,
  listPosCombos,
  updatePosCombo,
  type CafeCombo,
  type ComboKpi,
  type ComboProduct,
  type ComboStatus,
  type SaveComboBody,
} from "@/features/pos/api/pos-combos-api"
import { listPosCategories } from "@/features/pos/api/pos-categories-api"
import { listPosItems } from "@/features/pos/api/pos-items-api"
import { PosConfirmDialog } from "@/features/pos/components/notifications/pos-notification-ui"
import { showPosToast } from "@/features/pos/components/notifications/pos-toast-store"
import { PosTopbar } from "@/features/pos/components/pos-topbar"
import {
  type ComboFormDraft,
  type ComboProductOption,
  ComboDetailPanel,
  ComboKpiCard,
  ComboTable,
} from "@/features/pos/components/combos/combo-widgets"
import type { SearchForm } from "@/features/pos/pages/pos-home-page"

type ComboPanelMode = "view" | "create" | "edit"
type ComboStatusFilter = "all" | ComboStatus
type ComboSortMode = "sortOrder" | "priceAsc" | "priceDesc" | "name"

const comboKpiIcons = [PackageOpen, CheckCircle2, PauseCircle, XCircle]
const searchSchema = z.object({
  q: z.string().max(80),
})
const emptyCombos: CafeCombo[] = []
const emptyKpis: ComboKpi[] = []
const defaultProductImage =
  "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=520&q=80"
const emptyComboDraft: ComboFormDraft = {
  name: "",
  subtitle: "",
  price: 0,
  status: "active",
  sortOrder: 999,
  image: defaultProductImage,
  description: "",
  products: [],
}

export function PosCombosPage() {
  const queryClient = useQueryClient()
  const topbarForm = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { q: "" },
  })
  const topbarSearch = topbarForm.watch("q")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<ComboStatusFilter>("all")
  const [sortMode, setSortMode] = useState<ComboSortMode>("sortOrder")
  const [selectedComboId, setSelectedComboId] = useState("")
  const [panelMode, setPanelMode] = useState<ComboPanelMode>("view")
  const [draftCombo, setDraftCombo] = useState<ComboFormDraft>(emptyComboDraft)
  const [deleteComboId, setDeleteComboId] = useState<string | null>(null)

  const combosQuery = useQuery({
    queryKey: ["pos-combos", { search, statusFilter }],
    queryFn: () =>
      listPosCombos({
        q: search.trim() || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        page: 1,
        pageSize: 50,
      }),
    refetchOnMount: "always",
  })
  const itemsQuery = useQuery({
    queryKey: ["pos-items"],
    queryFn: listPosItems,
    staleTime: 60_000,
  })
  const categoriesQuery = useQuery({
    queryKey: ["pos-categories", "combo-product-picker"],
    queryFn: listPosCategories,
    staleTime: 60_000,
  })
  const combos = combosQuery.data?.combos ?? emptyCombos
  const kpis = combosQuery.data?.kpis ?? emptyKpis
  const totalCombos = combosQuery.data?.pagination.total ?? combos.length
  const isDefaultComboView = !search.trim() && statusFilter === "all"
  const shouldShowCreateForm =
    combosQuery.isSuccess && isDefaultComboView && totalCombos === 0
  const productOptions = useMemo<ComboProductOption[]>(
    () =>
      (itemsQuery.data?.items ?? []).map((item) => ({
        name: item.name,
        price: item.sellingPrice,
        image: item.imageUrl || defaultProductImage,
        categoryName: item.categoryName || "ອື່ນໆ",
      })),
    [itemsQuery.data?.items],
  )
  const productCategoryOptions = useMemo(
    () => categoriesQuery.data?.categories.map((category) => category.name) ?? [],
    [categoriesQuery.data?.categories],
  )
  const visibleCombos = useMemo(() => sortCombos(combos, sortMode), [combos, sortMode])
  const selectedCombo =
    visibleCombos.find((combo) => combo.id === selectedComboId) ??
    visibleCombos[0] ??
    null
  const deletingCombo =
    visibleCombos.find((combo) => combo.id === deleteComboId) ?? null

  const createMutation = useMutation({ mutationFn: createPosCombo })
  const updateMutation = useMutation({
    mutationFn: ({
      comboId,
      combo,
    }: {
      comboId: string
      combo: SaveComboBody
    }) => updatePosCombo(comboId, combo),
  })
  const deleteMutation = useMutation({ mutationFn: deletePosCombo })
  const savingCombo = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (!visibleCombos.length) {
      setSelectedComboId("")

      return
    }

    if (!visibleCombos.some((combo) => combo.id === selectedComboId)) {
      setSelectedComboId(visibleCombos[0].id)
    }
  }, [selectedComboId, visibleCombos])

  useEffect(() => {
    if (panelMode === "view" && selectedCombo) {
      setDraftCombo(mapComboToDraft(selectedCombo))
    }
  }, [panelMode, selectedCombo])

  useEffect(() => {
    if (!shouldShowCreateForm || panelMode !== "view") {
      return
    }

    setSelectedComboId("")
    setDraftCombo({
      ...emptyComboDraft,
      sortOrder: 1,
    })
    setPanelMode("create")
  }, [panelMode, shouldShowCreateForm])

  useEffect(() => {
    setSearch(topbarSearch)
  }, [topbarSearch])

  function openCreatePanel() {
    setPanelMode("create")
    setSelectedComboId("")
    setDraftCombo({
      ...emptyComboDraft,
      sortOrder: Math.max(1, combos.length + 1),
    })
  }

  function cancelPanel() {
    if (shouldShowCreateForm) {
      setSelectedComboId("")
      setDraftCombo({
        ...emptyComboDraft,
        sortOrder: 1,
      })
      setPanelMode("create")

      return
    }

    setPanelMode("view")
  }

  function selectCombo(comboId: string) {
    setSelectedComboId(comboId)
    setPanelMode("view")
  }

  function openEditPanel(combo: CafeCombo | null) {
    if (!combo) return

    setSelectedComboId(combo.id)
    setPanelMode("edit")
    setDraftCombo(mapComboToDraft(combo))
  }

  function updateDraft(combo: Partial<ComboFormDraft>) {
    setDraftCombo((current) => ({ ...current, ...combo }))
  }

  function updateDraftProduct(index: number, product: Partial<ComboProduct>) {
    setDraftCombo((current) => ({
      ...current,
      products: (current.products ?? []).map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...product } : item,
      ),
    }))
  }

  function applyDraftProducts(selectedProducts: ComboProductOption[]) {
    setDraftCombo((current) => {
      const currentProducts = current.products ?? []

      return {
        ...current,
        products: selectedProducts.map((product) => {
          const currentProduct = currentProducts.find((item) => item.name === product.name)

          return {
            name: product.name,
            price: product.price,
            quantity: currentProduct?.quantity ?? 1,
            image: product.image,
          }
        }),
      }
    })
  }

  function removeDraftProduct(index: number) {
    setDraftCombo((current) => {
      const products = (current.products ?? []).filter((_, itemIndex) => itemIndex !== index)

      return {
        ...current,
        products,
      }
    })
  }

  async function saveCombo() {
    const body = normalizeComboDraft(draftCombo)

    if (!body.name || !body.price || !body.products?.length) {
      showPosToast({
        type: "warning",
        title: "ຂາດຂໍ້ມູນຄອມໂບ",
        description: "ຈຳເປັນຕ້ອງມີຊື່, ລາຄາຂາຍ ແລະ ຢ່າງນ້ອຍໜຶ່ງສິນຄ້າ.",
      })
      return
    }

    try {
      if (panelMode === "create") {
        const createdCombo = await createMutation.mutateAsync(body)

        await queryClient.invalidateQueries({ queryKey: ["pos-combos"] })
        setSelectedComboId(createdCombo.id)
        setPanelMode("view")
        showPosToast({
          type: "success",
          title: "ເພີ່ມຄອມໂບແລ້ວ",
          description: `${createdCombo.name} ຢູ່ໃນລາຍການແລ້ວ.`,
        })
        return
      }

      if (!selectedCombo) return

      const updatedCombo = await updateMutation.mutateAsync({
        comboId: selectedCombo.id,
        combo: body,
      })

      await queryClient.invalidateQueries({ queryKey: ["pos-combos"] })
      setSelectedComboId(updatedCombo.id)
      setPanelMode("view")
      showPosToast({
        type: "success",
        title: "ອັບເດດຄອມໂບແລ້ວ",
        description: `${updatedCombo.name} ຖືກບັນທຶກແລ້ວ.`,
      })
    } catch (error) {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດບັນທຶກຄອມໂບໄດ້",
        description: getApiErrorMessage(error),
      })
    }
  }
  async function confirmDeleteCombo() {
    if (!deleteComboId) return

    try {
      await deleteMutation.mutateAsync(deleteComboId)
      await queryClient.invalidateQueries({ queryKey: ["pos-combos"] })
      if (selectedComboId === deleteComboId) {
        setSelectedComboId("")
      }
      setDeleteComboId(null)
      setPanelMode("view")
      showPosToast({
        type: "success",
        title: "ລຶບຄອມໂບແລ້ວ",
        description: "ຄອມໂບຖືກນຳອອກຈາກລາຍການແລ້ວ.",
      })
    } catch (error) {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດລຶບຄອມໂບໄດ້",
        description: getApiErrorMessage(error),
      })
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-[#efe7dc] text-[#3b2511]">
      <div className="flex h-full min-w-[1280px]">
        <section className="flex min-w-0 flex-1 flex-col">
          <PosTopbar form={topbarForm} placeholder="ຄົ້ນຫາຄອມໂບ..." />

          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_410px] gap-3 p-3">
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex min-h-0 flex-col overflow-hidden bg-white"
            >
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#eadfce] bg-[#fbfaf7] px-5 py-4">
                <div>
                  <h1 className="text-2xl font-black tracking-normal text-[#3b2511]">
                    ຄອມໂບ
                  </h1>
                  <p className="mt-1 text-sm font-semibold text-[#8a7560]">
                    ຈັດການຊຸດສິນຄ້າ, ລາຄາຂາຍ, ສ່ວນປະຢັດ ແລະ ສະຖານະການຂາຍ.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openCreatePanel}
                  className="flex h-10 cursor-pointer items-center gap-2 rounded-md bg-[#3b2511] px-4 text-sm font-bold text-white transition hover:bg-[#5a3718]"
                >
                  <SquarePen className="h-4 w-4" />
                  ເພີ່ມຄອມໂບ
                </button>
              </div>

              <div className="grid h-[92px] shrink-0 grid-cols-4 border-b border-[#eadfce] bg-white">
                {kpis.map((kpi, index) => {
                  const Icon = comboKpiIcons[index] ?? comboKpiIcons[0]

                  return <ComboKpiCard key={kpi.id} kpi={kpi} icon={Icon} />
                })}
              </div>

              <div className="flex h-[58px] shrink-0 items-center gap-3 border-b border-[#eadfce] bg-[#fbfaf7] px-4">
                <label className="relative w-[330px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a8064]" />
                  <input
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value)
                      topbarForm.setValue("q", event.target.value)
                    }}
                    className="h-10 w-full rounded-md border border-[#eadfce] bg-white pl-10 pr-3 text-sm font-medium text-[#3b2511] outline-none transition placeholder:text-[#b8aa9a] focus:border-[#b98b56] focus:ring-2 focus:ring-[#f4dec2]"
                    placeholder="ຄົ້ນຫາຊື່ ຫຼື ລາຍລະອຽດຄອມໂບ..."
                  />
                </label>

                <SelectBox
                  value={statusFilter}
                  options={[
                    ["all", "ທຸກສະຖານະ"],
                    ["active", "ເປີດ"],
                    ["paused", "ປິດ"],
                  ]}
                  onChange={(value) => setStatusFilter(value as ComboStatusFilter)}
                />
                <SelectBox
                  value={sortMode}
                  options={[
                    ["sortOrder", "ລຳດັບສະແດງ"],
                    ["name", "ຊື່ A-Z"],
                    ["priceAsc", "ລາຄາຕ່ຳຫາສູງ"],
                    ["priceDesc", "ລາຄາສູງຫາຕ່ຳ"],
                  ]}
                  onChange={(value) => setSortMode(value as ComboSortMode)}
                />
              </div>

              <ComboTable
                combos={visibleCombos}
                selectedComboId={selectedCombo?.id ?? ""}
                totalCombos={totalCombos}
                loading={combosQuery.isLoading}
                onSelectCombo={selectCombo}
                onEditCombo={openEditPanel}
              />
            </motion.section>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="h-full min-h-0"
            >
              <ComboDetailPanel
                combo={selectedCombo}
                mode={panelMode}
                draft={draftCombo}
                productOptions={productOptions}
                productCategoryOptions={productCategoryOptions}
                saving={savingCombo}
                onChange={updateDraft}
                onProductChange={updateDraftProduct}
                onConfirmProducts={applyDraftProducts}
                onRemoveProduct={removeDraftProduct}
                onSave={saveCombo}
                onCancel={cancelPanel}
                onEdit={() => openEditPanel(selectedCombo)}
                onDelete={() => selectedCombo && setDeleteComboId(selectedCombo.id)}
              />
            </motion.div>
          </div>
        </section>
      </div>

      <PosConfirmDialog
        open={Boolean(deletingCombo)}
        title="ລຶບຄອມໂບນີ້ບໍ?"
        description={
          deletingCombo
            ? `${deletingCombo.name} ຈະບໍ່ສະແດງໃນລາຍການຄອມໂບອີກ.`
            : ""
        }
        confirmLabel={deleteMutation.isPending ? "ກຳລັງລຶບ" : "ລຶບ"}
        onCancel={() => setDeleteComboId(null)}
        onConfirm={confirmDeleteCombo}
      />
    </main>
  )
}

function mapComboToDraft(combo: CafeCombo): ComboFormDraft {
  return {
    name: combo.name,
    subtitle: combo.subtitle,
    price: combo.price,
    status: combo.status,
    sortOrder: combo.sortOrder,
    image: combo.image,
    description: combo.description,
    products: combo.products.length ? combo.products : emptyComboDraft.products,
  }
}

function normalizeComboDraft(draft: ComboFormDraft): SaveComboBody {
  const products = (draft.products ?? [])
    .map((product) => ({
      name: product.name.trim(),
      price: Number(product.price) || 0,
      quantity: Math.max(1, Number(product.quantity) || 1),
      image: product.image.trim() || defaultProductImage,
    }))
    .filter((product) => product.name)

  return {
    name: draft.name?.trim() ?? "",
    subtitle: draft.subtitle?.trim() || buildComboSubtitle(products),
    price: Number(draft.price) || 0,
    status: draft.status ?? "active",
    sortOrder: Number(draft.sortOrder) || 999,
    image: draft.image?.trim() || defaultProductImage,
    description: buildComboDescription(draft, products),
    products,
  }
}

function buildComboSubtitle(products: ComboProduct[]) {
  const productNames = products.map((product) => product.name).filter(Boolean)

  return productNames.length ? productNames.join(" + ") : ""
}

function buildComboDescription(draft: ComboFormDraft, products: ComboProduct[]) {
  const comboName = draft.name?.trim() || "ຄອມໂບ"
  const comboPrice = Number(draft.price) || 0
  const productTotal = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  )
  const savings = Math.max(0, productTotal - comboPrice)
  const productLabel = products
    .map((product) =>
      product.quantity > 1 ? `${product.name} x${product.quantity}` : product.name,
    )
    .join(", ")

  const parts = productLabel
    ? [`${comboName} ປະກອບມີ ${productLabel}`]
    : [`${comboName} ພ້ອມຈຳໜ່າຍ`]

  if (comboPrice > 0) {
    parts.push(`ລາຄາຄອມໂບ ${formatKipAmount(comboPrice)} ກີບ`)
  }

  if (savings > 0) {
    parts.push(`ລູກຄ້າປະຢັດ ${formatKipAmount(savings)} ກີບ`)
  }

  return `${parts.join(". ")}.`
}

function formatKipAmount(value: number) {
  return Math.round(value).toLocaleString("en-US")
}

function sortCombos(combos: CafeCombo[], sortMode: ComboSortMode) {
  const nextCombos = [...combos]

  if (sortMode === "name") {
    return nextCombos.sort((a, b) => a.name.localeCompare(b.name, "lo"))
  }

  if (sortMode === "priceAsc") {
    return nextCombos.sort((a, b) => a.price - b.price)
  }

  if (sortMode === "priceDesc") {
    return nextCombos.sort((a, b) => b.price - a.price)
  }

  return nextCombos.sort((a, b) => a.sortOrder - b.sortOrder)
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
  value,
  options,
  onChange,
}: {
  value: string
  options: Array<[string, string]>
  onChange: (value: string) => void
}) {
  return (
    <label className="relative w-[190px]">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full cursor-pointer appearance-none rounded-md border border-[#eadfce] bg-white px-3 pr-9 text-sm font-medium text-[#5f4a35] outline-none transition focus:border-[#b98b56] focus:ring-2 focus:ring-[#f4dec2]"
      >
        {options.map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a5f36]" />
    </label>
  )
}
