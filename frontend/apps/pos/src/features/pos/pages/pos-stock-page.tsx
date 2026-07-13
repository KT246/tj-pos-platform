import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileInput,
  PackageCheck,
  PackageX,
  Plus,
} from "lucide-react"
import { useEffect, useState } from "react"

import {
  createPosStockItem,
  createPosStockMovement,
  deletePosStockItem,
  listPosStockItems,
  updatePosStockItem,
  type CafeStockItem,
  type SaveStockItemBody,
  type StockCategory,
  type StockKpi,
  type StockMovementBody,
  type StockMovementType,
  type StockStatus,
} from "@/features/pos/api/pos-stock-api"
import { PosConfirmDialog } from "@/features/pos/components/notifications/pos-notification-ui"
import { showPosToast } from "@/features/pos/components/notifications/pos-toast-store"
import { StockTopbar } from "@/features/pos/components/stock/stock-topbar"
import {
  type StockFormDraft,
  type StockMovementDraft,
  SelectFilter,
  StockDetailPanel,
  StockKpiCard,
  StockMovementChart,
  StockTable,
} from "@/features/pos/components/stock/stock-widgets"

type CategoryFilter = "all" | StockCategory
type StatusFilter = "all" | StockStatus
type StockPanelMode = "view" | "create" | "edit" | "movement"

const stockKpiIcons = [
  PackageCheck,
  CheckCircle2,
  AlertTriangle,
  PackageX,
  FileInput,
]

const categoryOptions = [
  { label: "ທຸກໝວດໝູ່", value: "all" },
  { label: "ວັດຖຸດິບ", value: "ingredient" },
  { label: "ອຸປະກອນ", value: "supply" },
  { label: "ສິນຄ້າ", value: "product" },
]

const statusOptions = [
  { label: "ທຸກສະຖານະ", value: "all" },
  { label: "ຍັງມີສິນຄ້າ", value: "in-stock" },
  { label: "ໃກ້ໝົດ", value: "low-stock" },
  { label: "ໝົດສິນຄ້າ", value: "out-of-stock" },
  { label: "ກຳລັງສັ່ງຊື້", value: "ordering" },
]

const emptyItems: CafeStockItem[] = []
const emptyKpis: StockKpi[] = []
const defaultStockImage =
  "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=160&q=80"
const emptyStockDraft: StockFormDraft = {
  name: "",
  category: "ingredient",
  sku: "",
  unit: "cái",
  currentStock: 0,
  minStock: 0,
  orderingStock: 0,
  costPrice: 0,
  supplier: "",
  expiryDate: "",
  image: defaultStockImage,
}
const emptyMovementDraft: StockMovementDraft = {
  type: "import",
  quantity: 1,
  note: "",
}

export function PosStockPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [selectedItemId, setSelectedItemId] = useState("")
  const [panelMode, setPanelMode] = useState<StockPanelMode>("view")
  const [draftItem, setDraftItem] = useState<StockFormDraft>(emptyStockDraft)
  const [movementDraft, setMovementDraft] =
    useState<StockMovementDraft>(emptyMovementDraft)
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)

  const stockQuery = useQuery({
    queryKey: ["pos-stock", { search, categoryFilter, statusFilter }],
    queryFn: () =>
      listPosStockItems({
        q: search.trim() || undefined,
        category: categoryFilter === "all" ? undefined : categoryFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
        page: 1,
        pageSize: 50,
      }),
    refetchOnMount: "always",
  })
  const stockItems = stockQuery.data?.items ?? emptyItems
  const stockKpis = stockQuery.data?.kpis ?? emptyKpis
  const stockMovement7d = stockQuery.data?.movement7d ?? []
  const totalItems = stockQuery.data?.pagination.total ?? stockItems.length
  const selectedItem =
    stockItems.find((item) => item.id === selectedItemId) ?? stockItems[0] ?? null
  const deletingItem = stockItems.find((item) => item.id === deleteItemId) ?? null

  const createMutation = useMutation({ mutationFn: createPosStockItem })
  const updateMutation = useMutation({
    mutationFn: ({
      itemId,
      item,
    }: {
      itemId: string
      item: SaveStockItemBody
    }) => updatePosStockItem(itemId, item),
  })
  const movementMutation = useMutation({
    mutationFn: ({
      itemId,
      movement,
    }: {
      itemId: string
      movement: StockMovementBody
    }) => createPosStockMovement(itemId, movement),
  })
  const deleteMutation = useMutation({ mutationFn: deletePosStockItem })
  const saving =
    createMutation.isPending ||
    updateMutation.isPending ||
    movementMutation.isPending

  useEffect(() => {
    if (!stockItems.length) {
      setSelectedItemId("")

      return
    }

    if (!stockItems.some((item) => item.id === selectedItemId)) {
      setSelectedItemId(stockItems[0].id)
    }
  }, [selectedItemId, stockItems])

  useEffect(() => {
    if (panelMode === "view" && selectedItem) {
      setDraftItem(mapStockItemToDraft(selectedItem))
    }
  }, [panelMode, selectedItem])

  function openCreatePanel() {
    setPanelMode("create")
    setSelectedItemId("")
    setDraftItem({
      ...emptyStockDraft,
      sku: buildDraftSku(stockItems.length + 1),
    })
  }

  function selectItem(itemId: string) {
    setSelectedItemId(itemId)
    setPanelMode("view")
  }

  function openEditPanel(item: CafeStockItem | null) {
    if (!item) return

    setSelectedItemId(item.id)
    setPanelMode("edit")
    setDraftItem(mapStockItemToDraft(item))
  }

  function openMovementPanel(type: StockMovementType) {
    if (!selectedItem) return

    setPanelMode("movement")
    setMovementDraft({
      type,
      quantity: type === "adjust" ? selectedItem.currentStock : 1,
      note: "",
    })
  }

  async function saveStockItem() {
    const body = normalizeStockDraft(draftItem)

    if (!body.name || !body.unit) {
      showPosToast({
        type: "warning",
        title: "ຂາດຂໍ້ມູນຄັງສິນຄ້າ",
        description: "ຈຳເປັນຕ້ອງມີຊື່ລາຍການ ແລະ ຫົວໜ່ວຍ.",
      })
      return
    }

    try {
      if (panelMode === "create") {
        const createdItem = await createMutation.mutateAsync(body)

        await queryClient.invalidateQueries({ queryKey: ["pos-stock"] })
        setSelectedItemId(createdItem.id)
        setPanelMode("view")
        showPosToast({
          type: "success",
          title: "ເພີ່ມລາຍການແລ້ວ",
          description: `${createdItem.name} ຢູ່ໃນຄັງແລ້ວ.`,
        })
        return
      }

      if (!selectedItem) return

      const updatedItem = await updateMutation.mutateAsync({
        itemId: selectedItem.id,
        item: body,
      })

      await queryClient.invalidateQueries({ queryKey: ["pos-stock"] })
      setSelectedItemId(updatedItem.id)
      setPanelMode("view")
      showPosToast({
        type: "success",
        title: "ອັບເດດຄັງສິນຄ້າແລ້ວ",
        description: `${updatedItem.name} ຖືກບັນທຶກແລ້ວ.`,
      })
    } catch (error) {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດບັນທຶກຄັງສິນຄ້າໄດ້",
        description: getApiErrorMessage(error),
      })
    }
  }

  async function saveMovement() {
    if (!selectedItem) return

    if (movementDraft.quantity <= 0 && movementDraft.type !== "adjust") {
      showPosToast({
        type: "warning",
        title: "ຈຳນວນບໍ່ຖືກຕ້ອງ",
        description: "ຈຳນວນນຳເຂົ້າ/ນຳອອກຕ້ອງຫຼາຍກວ່າ 0.",
      })
      return
    }

    try {
      const updatedItem = await movementMutation.mutateAsync({
        itemId: selectedItem.id,
        movement: movementDraft,
      })

      await queryClient.invalidateQueries({ queryKey: ["pos-stock"] })
      setSelectedItemId(updatedItem.id)
      setPanelMode("view")
      showPosToast({
        type: "success",
        title: "ອັບເດດຍອດຄົງເຫຼືອແລ້ວ",
        description: `${updatedItem.name}: ຍັງເຫຼືອ ${formatQuantity(updatedItem.currentStock)} ${updatedItem.unit}.`,
      })
    } catch (error) {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດອັບເດດຍອດຄົງເຫຼືອໄດ້",
        description: getApiErrorMessage(error),
      })
    }
  }

  async function confirmDeleteItem() {
    if (!deleteItemId) return

    try {
      await deleteMutation.mutateAsync(deleteItemId)
      await queryClient.invalidateQueries({ queryKey: ["pos-stock"] })
      if (selectedItemId === deleteItemId) {
        setSelectedItemId("")
      }
      setDeleteItemId(null)
      setPanelMode("view")
      showPosToast({
        type: "success",
        title: "ລຶບລາຍການແລ້ວ",
        description: "ລາຍການຖືກນຳອອກຈາກລາຍການຄັງແລ້ວ.",
      })
    } catch (error) {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດລຶບລາຍການໄດ້",
        description: getApiErrorMessage(error),
      })
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-[#efe7dc] text-[#3b2511]">
      <div className="flex h-full min-w-[1280px]">
        <section className="flex min-w-0 flex-1 flex-col">
          <StockTopbar search={search} onSearchChange={setSearch} />

          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_390px] gap-3 p-3">
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex min-h-0 flex-col overflow-hidden bg-white"
            >
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#eadfce] bg-[#fbfaf7] px-5 py-4">
                <div>
                  <h1 className="text-2xl font-black tracking-normal text-[#3b2511]">
                    ຄັງສິນຄ້າ
                  </h1>
                  <p className="mt-1 text-sm font-semibold text-[#8a7560]">
                    ຈັດການຍອດຄົງເຫຼືອ, ນຳເຂົ້າ/ນຳອອກ ແລະ ແຈ້ງເຕືອນສິນຄ້າໝົດ.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => exportStockCsv(stockItems)}
                    className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-[#eadfce] bg-white px-4 text-sm font-bold text-[#5f4a35] transition hover:bg-[#fbf4ea]"
                  >
                    <Download className="h-4 w-4" />
                    ສົ່ງອອກໄຟລ໌
                  </button>
                  <button
                    type="button"
                    onClick={openCreatePanel}
                    className="flex h-10 cursor-pointer items-center gap-2 rounded-md bg-[#3b2511] px-4 text-sm font-bold text-white transition hover:bg-[#5a3718]"
                  >
                    <Plus className="h-4 w-4" />
                    ເພີ່ມລາຍການ
                  </button>
                </div>
              </div>

              <div className="grid h-[88px] shrink-0 grid-cols-5 border-b border-[#eadfce] bg-white">
                {stockKpis.map((kpi, index) => {
                  const Icon = stockKpiIcons[index] ?? PackageCheck

                  return <StockKpiCard key={kpi.id} kpi={kpi} icon={Icon} />
                })}
              </div>

              <div className="flex h-[58px] shrink-0 items-center gap-3 border-b border-[#eadfce] bg-[#fbfaf7] px-4">
                <SelectFilter
                  value={categoryFilter}
                  onChange={(value) => setCategoryFilter(value as CategoryFilter)}
                  options={categoryOptions}
                />
                <SelectFilter
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value as StatusFilter)}
                  options={statusOptions}
                />
                <button
                  type="button"
                  disabled={!selectedItem}
                  onClick={() => openMovementPanel("import")}
                  className="ml-auto flex h-10 cursor-pointer items-center gap-2 rounded-md border border-[#eadfce] bg-white px-4 text-sm font-bold text-[#5f4a35] transition hover:bg-[#fbf4ea] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <FileInput className="h-4 w-4" />
                  ນຳເຂົ້າສິນຄ້າ
                </button>
              </div>

              <StockTable
                items={stockItems}
                selectedItemId={selectedItem?.id ?? ""}
                totalItems={totalItems}
                loading={stockQuery.isLoading}
                onSelectItem={selectItem}
                onEditItem={openEditPanel}
              />
            </motion.section>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="flex h-full min-h-0 flex-col bg-white"
            >
              <div className="min-h-0 flex-1">
                <StockDetailPanel
                  item={selectedItem}
                  mode={panelMode}
                  draft={draftItem}
                  movement={movementDraft}
                  saving={saving}
                  onChange={(item) =>
                    setDraftItem((current) => ({ ...current, ...item }))
                  }
                  onMovementChange={(movement) =>
                    setMovementDraft((current) => ({ ...current, ...movement }))
                  }
                  onSave={saveStockItem}
                  onSaveMovement={saveMovement}
                  onCancel={() => setPanelMode("view")}
                  onEdit={() => openEditPanel(selectedItem)}
                  onOpenMovement={openMovementPanel}
                  onDelete={() => selectedItem && setDeleteItemId(selectedItem.id)}
                />
              </div>
              <StockMovementChart data={stockMovement7d} />
            </motion.div>
          </div>
        </section>
      </div>

      <PosConfirmDialog
        open={Boolean(deletingItem)}
        title="ລຶບລາຍການອອກຈາກຄັງບໍ?"
        description={
          deletingItem
            ? `${deletingItem.name} ຈະບໍ່ສະແດງໃນລາຍການຄັງອີກ.`
            : ""
        }
        confirmLabel={deleteMutation.isPending ? "ກຳລັງລຶບ" : "ລຶບ"}
        onCancel={() => setDeleteItemId(null)}
        onConfirm={confirmDeleteItem}
      />
    </main>
  )
}

function mapStockItemToDraft(item: CafeStockItem): StockFormDraft {
  return {
    name: item.name,
    category: item.category,
    sku: item.sku,
    unit: item.unit,
    currentStock: item.currentStock,
    minStock: item.minStock,
    orderingStock: item.orderingStock,
    costPrice: item.costPrice,
    supplier: item.supplier,
    expiryDate: parseDisplayDate(item.expiryDate),
    image: item.image,
  }
}

function normalizeStockDraft(draft: StockFormDraft): SaveStockItemBody {
  return {
    name: draft.name?.trim() ?? "",
    category: draft.category ?? "ingredient",
    sku: draft.sku?.trim().toUpperCase() ?? "",
    unit: draft.unit?.trim() ?? "cái",
    currentStock: Number(draft.currentStock) || 0,
    minStock: Number(draft.minStock) || 0,
    orderingStock: Number(draft.orderingStock) || 0,
    costPrice: Number(draft.costPrice) || 0,
    supplier: draft.supplier?.trim() ?? "",
    expiryDate: draft.expiryDate ?? "",
    image: draft.image?.trim() || defaultStockImage,
  }
}

function parseDisplayDate(value: string) {
  if (!value || value === "-") return ""

  const [day, month, year] = value.split("/")
  if (!day || !month || !year) return ""

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}

function buildDraftSku(index: number) {
  return `STK-${String(index).padStart(4, "0")}`
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

function formatQuantity(value: number) {
  return Number.isInteger(value)
    ? value.toLocaleString("vi-VN")
    : value.toLocaleString("vi-VN", { maximumFractionDigits: 3 })
}

function exportStockCsv(items: CafeStockItem[]) {
  const header = [
    "ຊື່ລາຍການ",
    "ໝວດໝູ່",
    "SKU",
    "ຫົວໜ່ວຍ",
    "ຍອດຄົງເຫຼືອ",
    "ຂັ້ນຕ່ຳ",
    "ກຳລັງສັ່ງ",
    "ສະຖານະ",
    "ຕົ້ນທຶນ",
    "ມູນຄ່າຄົງເຫຼືອ",
    "ຜູ້ສະໜອງ",
    "ວັນທີນຳເຂົ້າຫຼ້າສຸດ",
    "ວັນໝົດອາຍຸ",
  ]
  const rows = items.map((item) => [
    item.name,
    item.categoryLabel,
    item.sku,
    item.unit,
    String(item.currentStock),
    String(item.minStock),
    String(item.orderingStock),
    item.status,
    String(item.costPrice),
    String(item.inventoryValue),
    item.supplier,
    item.lastImportAt,
    item.expiryDate,
  ])
  const csv = [header, ...rows]
    .map((row) => row.map(escapeCsvCell).join(","))
    .join("\r\n")
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = `pos-stock-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

function escapeCsvCell(value: string) {
  const escapedValue = value.replace(/"/g, '""')

  return `"${escapedValue}"`
}
