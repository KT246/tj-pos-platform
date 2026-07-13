import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { ChevronDown, Plus, Search } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  buildSaveCategoryBody,
  createPosCategory,
  deletePosCategory,
  listPosCategories,
  mapCategoryDtoToCafeCategory,
  type SaveBusinessCategoryBody,
  updatePosCategory,
} from "@/features/pos/api/pos-categories-api"
import { CategoryDetailPanel } from "@/features/pos/components/categories/category-detail-panel"
import { CategoryTable } from "@/features/pos/components/categories/category-table"
import { PosConfirmDialog } from "@/features/pos/components/notifications/pos-notification-ui"
import { showPosToast } from "@/features/pos/components/notifications/pos-toast-store"
import { PosTopbar } from "@/features/pos/components/pos-topbar"
import type {
  CafeCategory,
  CafeCategoryStatus,
} from "@/features/pos/data/cafe-categories"
import { usePosStore } from "@/features/pos/stores/pos-store"
import { cn } from "@/lib/utils"

const searchSchema = z.object({
  q: z.string().max(80),
})

type CategorySearchForm = z.infer<typeof searchSchema>
type CategoryPanelMode = "create" | "edit"
type StatusFilter = "all" | CafeCategoryStatus
type SortMode = "manual" | "name"

const emptyCategoryDraft: CafeCategory = {
  id: "",
  name: "",
  description: "",
  productCount: 0,
  sortOrder: 1,
  status: "visible",
  updatedAt: "",
  updatedBy: "API",
  image: "",
}

export function PosCategoriesPage() {
  const tableLabel = usePosStore((state) => state.tableLabel)
  const queryClient = useQueryClient()
  const [activeCategoryId, setActiveCategoryId] = useState("all")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [panelMode, setPanelMode] = useState<CategoryPanelMode>("edit")
  const [draftCategory, setDraftCategory] = useState<CafeCategory>(emptyCategoryDraft)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sortMode, setSortMode] = useState<SortMode>("manual")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [draggingCategoryId, setDraggingCategoryId] = useState<string | null>(null)
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)
  const skipNextPageResetRef = useRef(false)
  const form = useForm<CategorySearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { q: "" },
  })
  const search = form.watch("q")

  const categoriesQuery = useQuery({
    queryKey: ["pos-categories"],
    queryFn: listPosCategories,
    refetchOnMount: "always",
  })
  const categories = useMemo(
    () =>
      categoriesQuery.data?.categories.map((category, index) =>
        mapCategoryDtoToCafeCategory(category, index),
      ) ?? [],
    [categoriesQuery.data],
  )

  const createMutation = useMutation({
    mutationFn: createPosCategory,
  })
  const updateMutation = useMutation({
    mutationFn: ({
      categoryId,
      category,
    }: {
      categoryId: string
      category: Partial<SaveBusinessCategoryBody>
    }) => updatePosCategory(categoryId, category),
  })
  const deleteMutation = useMutation({
    mutationFn: deletePosCategory,
  })
  const savingCategory = createMutation.isPending || updateMutation.isPending

  const orderedCategories = useMemo(() => {
    const nextCategories = [...categories]

    if (sortMode === "name") {
      return nextCategories.sort((a, b) => a.name.localeCompare(b.name, "vi"))
    }

    return nextCategories.sort((a, b) => a.sortOrder - b.sortOrder)
  }, [categories, sortMode])

  const visibleCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return orderedCategories.filter((category) => {
      const categoryMatched =
        activeCategoryId === "all" || category.id === activeCategoryId
      const searchMatched = !keyword || category.name.toLowerCase().includes(keyword)
      const statusMatched = statusFilter === "all" || category.status === statusFilter

      return categoryMatched && searchMatched && statusMatched
    })
  }, [activeCategoryId, orderedCategories, search, statusFilter])
  const selectedCategory =
    categories.find((category) => category.id === selectedCategoryId) ??
    visibleCategories[0] ??
    categories[0] ??
    null
  const totalPages = Math.max(1, Math.ceil(visibleCategories.length / pageSize))
  const pagedCategories = useMemo(() => {
    const start = (page - 1) * pageSize

    return visibleCategories.slice(start, start + pageSize)
  }, [page, pageSize, visibleCategories])
  const deletingCategory =
    categories.find((category) => category.id === deleteCategoryId) ?? null

  useEffect(() => {
    if (!selectedCategoryId && categories[0]) {
      setSelectedCategoryId(categories[0].id)
    }
  }, [categories, selectedCategoryId])

  useEffect(() => {
    if (panelMode === "edit" && selectedCategory) {
      setDraftCategory({ ...selectedCategory })
    }
  }, [panelMode, selectedCategory])

  useEffect(() => {
    if (sortMode !== "manual") {
      setDraggingCategoryId(null)
    }
  }, [sortMode])

  useEffect(() => {
    if (skipNextPageResetRef.current) {
      skipNextPageResetRef.current = false
      return
    }

    setPage(1)
  }, [activeCategoryId, pageSize, search, sortMode, statusFilter])

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages))
  }, [totalPages])

  function openCreatePanel() {
    setPanelMode("create")
    setSelectedCategoryId(null)
    setActiveCategoryId("all")
    setDraftCategory({
      ...emptyCategoryDraft,
      sortOrder: categories.length + 1,
    })
  }

  function selectCategory(categoryId: string) {
    setSelectedCategoryId(categoryId)
    setPanelMode("edit")
  }

  async function saveCategory() {
    const normalizedName = draftCategory.name.trim()

    if (!normalizedName) {
      showPosToast({
        type: "warning",
        title: "ຍັງບໍ່ໄດ້ໃສ່ຊື່ໝວດໝູ່",
        description: "ຊື່ໝວດໝູ່ເປັນຂໍ້ມູນທີ່ຈຳເປັນ.",
      })
      return
    }

    const body = buildSaveCategoryBody({
      ...draftCategory,
      name: normalizedName,
      sortOrder:
        Number.isFinite(Number(draftCategory.sortOrder)) && draftCategory.sortOrder > 0
          ? Number(draftCategory.sortOrder)
          : categories.length + 1,
    })

    try {
      if (panelMode === "create") {
        const createdCategory = await createMutation.mutateAsync(body)

        await queryClient.invalidateQueries({ queryKey: ["pos-categories"] })
        skipNextPageResetRef.current = true
        form.setValue("q", "")
        setActiveCategoryId("all")
        setStatusFilter("all")
        setSortMode("manual")
        setPage(Math.max(1, Math.ceil((categories.length + 1) / pageSize)))
        setSelectedCategoryId(createdCategory.id)
        setPanelMode("edit")
        showPosToast({
          type: "success",
          title: "ເພີ່ມໝວດໝູ່ແລ້ວ",
          description: `${createdCategory.name} ຖືກເພີ່ມເຂົ້າລາຍການໝວດໝູ່ແລ້ວ.`,
        })
        return
      }

      if (!draftCategory.id) return

      const updatedCategory = await updateMutation.mutateAsync({
        categoryId: draftCategory.id,
        category: body,
      })

      await queryClient.invalidateQueries({ queryKey: ["pos-categories"] })
      setSelectedCategoryId(updatedCategory.id)
      showPosToast({
        type: "success",
        title: "ບັນທຶກໝວດໝູ່ແລ້ວ",
        description: `ຂໍ້ມູນ ${updatedCategory.name} ຖືກອັບເດດແລ້ວ.`,
      })
    } catch (error) {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດບັນທຶກໝວດໝູ່ໄດ້",
        description: getApiErrorMessage(error),
      })
    }
  }

  async function persistCategoryOrder(targetCategoryId: string) {
    if (
      sortMode !== "manual" ||
      !draggingCategoryId ||
      draggingCategoryId === targetCategoryId
    ) {
      return
    }

    const ordered = [...categories].sort((a, b) => a.sortOrder - b.sortOrder)
    const sourceIndex = ordered.findIndex((category) => category.id === draggingCategoryId)
    const targetIndex = ordered.findIndex((category) => category.id === targetCategoryId)

    if (sourceIndex < 0 || targetIndex < 0) return

    const [movedCategory] = ordered.splice(sourceIndex, 1)
    ordered.splice(targetIndex, 0, movedCategory)

    try {
      await Promise.all(
        ordered.map((category, index) =>
          updatePosCategory(category.id, { sortOrder: index + 1 }),
        ),
      )
      await queryClient.invalidateQueries({ queryKey: ["pos-categories"] })
      showPosToast({
        type: "success",
        title: "ອັບເດດລຳດັບແລ້ວ",
        description: "ລຳດັບໝວດໝູ່ຖືກບັນທຶກແລ້ວ.",
      })
    } catch (error) {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດບັນທຶກລຳດັບໄດ້",
        description: getApiErrorMessage(error),
      })
    }
  }

  async function confirmDeleteCategory() {
    if (!deletingCategory) return

    try {
      await deleteMutation.mutateAsync(deletingCategory.id)
      await queryClient.invalidateQueries({ queryKey: ["pos-categories"] })
      setDeleteCategoryId(null)
      setActiveCategoryId((currentId) =>
        currentId === deletingCategory.id ? "all" : currentId,
      )

      if (selectedCategoryId === deletingCategory.id) {
        setSelectedCategoryId(null)
      }

      showPosToast({
        type: "success",
        title: "ລຶບໝວດໝູ່ແລ້ວ",
        description: `${deletingCategory.name} ຖືກນຳອອກຈາກລາຍການແລ້ວ.`,
      })
    } catch (error) {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດລຶບໝວດໝູ່ໄດ້",
        description: getApiErrorMessage(error),
      })
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-[#f3efe7] text-[#2f2419]">
      <div className="flex h-full min-w-[1280px]">
        <section className="flex min-w-0 flex-1 flex-col">
          <PosTopbar
            form={form}
            tableLabel={tableLabel}
            placeholder="ຄົ້ນຫາສິນຄ້າ, ໝວດໝູ່..."
          />

          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_360px] gap-3 p-3">
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex min-h-0 flex-col overflow-hidden bg-white"
            >
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#ded4c8] bg-[#fbfaf7] px-5 py-4">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-normal text-[#2f2419]">
                    ໝວດໝູ່
                  </h1>
                  <p className="mt-1 text-sm font-semibold text-[#6f5c49]">
                    ຈັດລຳດັບກຸ່ມສິນຄ້າ ແລະ ຕັ້ງຄ່າການສະແດງໃນໜ້າຂາຍ.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openCreatePanel}
                  className="flex h-10 cursor-pointer items-center gap-2 rounded-md bg-[#2f2419] px-4 text-sm font-semibold text-white transition hover:bg-[#4a3726]"
                >
                  <Plus className="h-4 w-4" />
                  ເພີ່ມໝວດໝູ່
                </button>
              </div>

              {categoriesQuery.isError ? (
                <div className="border-b border-[#ffd2cb] bg-[#fff7f5] px-5 py-3 text-sm font-semibold text-[#d04433]">
                  ບໍ່ສາມາດໂຫຼດໝວດໝູ່ຈາກ API ໄດ້. ກວດສອບ backend ແລ້ວລອງໃໝ່.
                </div>
              ) : null}

              <div className="flex h-[58px] shrink-0 items-center gap-3 border-b border-[#ded4c8] bg-[#fbfaf7] px-4">
                <label className="relative w-[330px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7560]" />
                  <input
                    value={search}
                    onChange={(event) => form.setValue("q", event.target.value)}
                    className="h-10 w-full rounded-md border border-[#ded4c8] bg-white pl-10 pr-3 text-sm font-medium text-[#2f2419] outline-none transition placeholder:text-[#ad9d8c] focus:border-[#8d7157] focus:ring-2 focus:ring-[#e5d7c7]"
                    placeholder="ຄົ້ນຫາໝວດໝູ່..."
                  />
                </label>

                <SelectControl
                  value={activeCategoryId}
                  onChange={(value) => {
                    setActiveCategoryId(value)

                    if (value !== "all") {
                      selectCategory(value)
                    }
                  }}
                  options={[
                    { label: "ໝວດໝູ່ທັງໝົດ", value: "all" },
                    ...orderedCategories.map((category) => ({
                      label: category.name,
                      value: category.id,
                    })),
                  ]}
                />

                <SelectControl
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value as StatusFilter)}
                  options={[
                    { label: "ທຸກສະຖານະ", value: "all" },
                    { label: "ກຳລັງສະແດງ", value: "visible" },
                    { label: "ຖືກເຊື່ອງ", value: "hidden" },
                  ]}
                />

                <SelectControl
                  className="ml-auto"
                  value={sortMode}
                  onChange={(value) => setSortMode(value as SortMode)}
                  options={[
                    { label: "ລຳດັບສະແດງ", value: "manual" },
                    { label: "ຊື່ A-Z", value: "name" },
                  ]}
                />
              </div>

              <CategoryTable
                categories={pagedCategories}
                totalCategories={visibleCategories.length}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                selectedCategoryId={selectedCategory?.id ?? ""}
                draggingCategoryId={draggingCategoryId}
                dragDisabled={sortMode !== "manual" || categoriesQuery.isLoading}
                onSelect={selectCategory}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                onDragStart={setDraggingCategoryId}
                onDragEnd={() => setDraggingCategoryId(null)}
                onDropOnCategory={(targetCategoryId) => {
                  void persistCategoryOrder(targetCategoryId)
                  setDraggingCategoryId(null)
                }}
              />
            </motion.section>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="h-full min-h-0"
            >
              <CategoryDetailPanel
                category={draftCategory}
                mode={panelMode}
                saving={savingCategory}
                onChange={(nextCategory) =>
                  setDraftCategory((currentCategory) => ({
                    ...currentCategory,
                    ...nextCategory,
                  }))
                }
                onCancel={() => {
                  if (selectedCategory) {
                    setPanelMode("edit")
                    setDraftCategory({ ...selectedCategory })
                    return
                  }

                  openCreatePanel()
                }}
                onSave={() => void saveCategory()}
                onDelete={
                  panelMode === "edit" && selectedCategory
                    ? () => setDeleteCategoryId(selectedCategory.id)
                    : undefined
                }
              />
            </motion.div>
          </div>

          <PosConfirmDialog
            open={Boolean(deletingCategory)}
            title="ທ່ານແນ່ໃຈບໍວ່າຕ້ອງການລຶບໝວດໝູ່ນີ້?"
            description={
              deletingCategory
                ? `${deletingCategory.name} ມີ ${deletingCategory.productCount} ສິນຄ້າ. Backend ຈະບລັອກການລຶບຖ້າໝວດໝູ່ຍັງມີສິນຄ້າ.`
                : ""
            }
            confirmLabel="ລຶບໝວດໝູ່"
            onCancel={() => setDeleteCategoryId(null)}
            onConfirm={() => void confirmDeleteCategory()}
          />
        </section>
      </div>
    </main>
  )
}

function SelectControl({
  value,
  options,
  className,
  onChange,
}: {
  value: string
  options: Array<{ label: string; value: string }>
  className?: string
  onChange: (value: string) => void
}) {
  return (
    <label className={cn("relative w-[200px]", className)}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full cursor-pointer appearance-none rounded-md border border-[#ded4c8] bg-white px-3 pr-9 text-sm font-medium text-[#4f4032] outline-none transition focus:border-[#8d7157] focus:ring-2 focus:ring-[#e5d7c7]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f5c49]" />
    </label>
  )
}

function getApiErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return "ກະລຸນາກວດສອບ backend ແລ້ວລອງໃໝ່."
}
