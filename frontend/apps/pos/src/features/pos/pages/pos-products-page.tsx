import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Folder, Plus, SlidersHorizontal } from "lucide-react"
import type { ComponentType, ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { PosTopbar } from "@/features/pos/components/pos-topbar"
import {
  PosAlertBannerStack,
  PosConfirmDialog,
} from "@/features/pos/components/notifications/pos-notification-ui"
import { showPosToast } from "@/features/pos/components/notifications/pos-toast-store"
import {
  ProductCreatePanel,
  type ProductPanelFormValue,
} from "@/features/pos/components/products/product-create-panel"
import { ProductDetailEditor } from "@/features/pos/components/products/product-detail-editor"
import { ProductManagementCard } from "@/features/pos/components/products/product-management-card"
import {
  buildSaveItemBody,
  createPosItem,
  deletePosItem,
  listPosItems,
  mapPosItemToCatalogItem,
  updatePosItem,
} from "@/features/pos/api/pos-items-api"
import { listPosCategories } from "@/features/pos/api/pos-categories-api"
import { buildPosCategories } from "@/features/pos/lib/category-options"
import { cafePosConfig } from "@/features/pos/pos-types/cafe/config"
import { usePosStore } from "@/features/pos/stores/pos-store"
import { cn } from "@/lib/utils"

const searchSchema = z.object({
  q: z.string().max(80),
})

type ProductSearchForm = z.infer<typeof searchSchema>

export function PosProductsPage() {
  const config = cafePosConfig
  const queryClient = useQueryClient()
  const tableLabel = usePosStore((state) => state.tableLabel)
  const [activeCategoryId, setActiveCategoryId] = useState("all")
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [panelMode, setPanelMode] = useState<"detail" | "create">("detail")
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const form = useForm<ProductSearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { q: "" },
  })
  const search = form.watch("q")
  const productsQuery = useQuery({
    queryKey: ["pos-items"],
    queryFn: listPosItems,
  })
  const categoriesQuery = useQuery({
    queryKey: ["pos-categories"],
    queryFn: listPosCategories,
  })
  const products = useMemo(
    () => productsQuery.data?.items.map(mapPosItemToCatalogItem) ?? [],
    [productsQuery.data],
  )
  const productCategories = useMemo(
    () => buildPosCategories(categoriesQuery.data?.categories, config.categories),
    [categoriesQuery.data, config.categories],
  )
  const createMutation = useMutation({
    mutationFn: (product: ProductPanelFormValue) =>
      createPosItem(buildSaveItemBody(product)),
    onSuccess: async (createdItem) => {
      await queryClient.invalidateQueries({ queryKey: ["pos-items"] })
      setSelectedProductId(createdItem.id)
      setPanelMode("detail")
      showPosToast({
        type: "success",
        title: "ບັນທຶກສິນຄ້າສຳເລັດແລ້ວ",
        description: "ສິນຄ້າໃໝ່ພ້ອມຂາຍແລ້ວ.",
      })
    },
    onError: () => {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດບັນທຶກສິນຄ້າໄດ້",
        description: "ກະລຸນາກວດສອບ backend ແລ້ວລອງໃໝ່.",
      })
    },
  })
  const updateMutation = useMutation({
    mutationFn: ({
      productId,
      product,
    }: {
      productId: string
      product: ProductPanelFormValue
    }) => updatePosItem(productId, buildSaveItemBody(product)),
    onSuccess: async (updatedItem) => {
      await queryClient.invalidateQueries({ queryKey: ["pos-items"] })
      setSelectedProductId(updatedItem.id)
      setPanelMode("detail")
      showPosToast({
        type: "success",
        title: "ອັບເດດສິນຄ້າແລ້ວ",
        description: "ຂໍ້ມູນສິນຄ້າຖືກບັນທຶກແລ້ວ.",
      })
    },
    onError: () => {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດອັບເດດສິນຄ້າໄດ້",
        description: "ກະລຸນາກວດຂໍ້ມູນແລ້ວລອງໃໝ່.",
      })
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deletePosItem,
    onSuccess: async (_, deletedItemId) => {
      await queryClient.invalidateQueries({ queryKey: ["pos-items"] })
      if (selectedProductId === deletedItemId) {
        setSelectedProductId(null)
      }
      setDeleteProductId(null)
      showPosToast({
        type: "success",
        title: "ລຶບສິນຄ້າແລ້ວ",
        description: "ສິນຄ້າຖືກລຶບອອກຈາກລາຍການຂາຍແລ້ວ.",
      })
    },
    onError: () => {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດລຶບສິນຄ້າໄດ້",
        description: "ສິນຄ້າອາດກຳລັງຖືກໃຊ້ໃນອໍເດີ.",
      })
    },
  })
  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return products.filter((product) => {
      const categoryMatched =
        activeCategoryId === "all" || product.categoryId === activeCategoryId
      const searchMatched = !keyword || product.name.toLowerCase().includes(keyword)

      return categoryMatched && searchMatched
    })
  }, [activeCategoryId, products, search])
  const visibleProducts = filteredProducts.slice(0, 15)
  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ??
    visibleProducts[0] ??
    null
  const productPendingDelete =
    products.find((product) => product.id === deleteProductId) ?? null

  function handleSelectProduct(productId: string) {
    setSelectedProductId(productId)
    setPanelMode("detail")
  }

  function handleDeleteProduct(productId: string) {
    setDeleteProductId(productId)
  }

  useEffect(() => {
    if (!productCategories.some((category) => category.id === activeCategoryId)) {
      setActiveCategoryId("all")
    }
  }, [activeCategoryId, productCategories])

  return (
    <main className="h-screen overflow-hidden bg-[#f3efe7] text-[#2f2419]">
      <div className="flex h-full min-w-[1280px]">
        <section className="flex min-w-0 flex-1 flex-col">
          <PosTopbar form={form} tableLabel={tableLabel} />
          <PosAlertBannerStack />

          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_420px] gap-3 p-3">
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-[#ded4c8] bg-white"
            >
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#ded4c8] bg-[#fbfaf7] px-5 py-4">
                <h1 className="text-2xl font-extrabold tracking-normal text-[#2f2419]">
                  ສິນຄ້າ
                </h1>

                <div className="flex items-center gap-3">
                  <ToolbarButton icon={Folder} label="ຈັດການໝວດໝູ່" />
                  <ToolbarButton icon={SlidersHorizontal} label="ຕົວກອງ" />
                  <button
                    type="button"
                    onClick={() => setPanelMode("create")}
                    className="flex h-10 cursor-pointer items-center gap-2 rounded-md bg-[#2f2419] px-4 text-sm font-semibold text-white transition hover:bg-[#4a3726]"
                  >
                    <Plus className="h-4 w-4" />
                    ເພີ່ມສິນຄ້າ
                  </button>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-[#ded4c8] px-4 py-3">
                {productCategories.map((category) => {
                  const active = activeCategoryId === category.id

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveCategoryId(category.id)}
                      className={cn(
                        "h-9 shrink-0 cursor-pointer rounded-md border px-4 text-sm font-semibold transition",
                        active
                          ? "border-[#2f2419] bg-[#2f2419] text-white"
                          : "border-[#ded4c8] bg-white text-[#4f4032] hover:bg-[#f7f1e9]",
                      )}
                    >
                      {category.label}
                    </button>
                  )
                })}
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto bg-[#f7f3ec] p-4">
                <div className="grid grid-cols-5 gap-3">
                  {visibleProducts.map((product) => (
                    <ProductManagementCard
                      key={product.id}
                      product={product}
                      selected={product.id === selectedProduct?.id}
                      onSelect={handleSelectProduct}
                    />
                  ))}
                </div>
              </div>

              <div className="flex h-[58px] shrink-0 items-center justify-between border-t border-[#ded4c8] bg-[#fbfaf7] px-4 text-sm font-semibold text-[#4f4032]">
                <span>
                  ສະແດງ 1 - {visibleProducts.length} ຈາກ{" "}
                  {productsQuery.data?.pagination.total ?? filteredProducts.length} ສິນຄ້າ
                </span>
                <div className="flex items-center gap-2">
                  <PageButton disabled>{"‹"}</PageButton>
                  <PageButton active>1</PageButton>
                  <PageButton>2</PageButton>
                  <PageButton>3</PageButton>
                  <PageButton>{"›"}</PageButton>
                </div>
              </div>
            </motion.section>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="h-full min-h-0"
            >
              {panelMode === "create" || !selectedProduct ? (
                <ProductCreatePanel
                  categories={productCategories}
                  onCancel={() => setPanelMode("detail")}
                  onSave={async (product) => {
                    await createMutation.mutateAsync(product)
                  }}
                />
              ) : (
                <ProductDetailEditor
                  product={selectedProduct}
                  categories={productCategories}
                  onClose={() => setPanelMode("create")}
                  onSave={async (productId, product) => {
                    await updateMutation.mutateAsync({ productId, product })
                  }}
                  onDelete={handleDeleteProduct}
                />
              )}
            </motion.div>
          </div>

          <PosConfirmDialog
            open={Boolean(productPendingDelete)}
            title="ທ່ານແນ່ໃຈບໍວ່າຕ້ອງການລຶບສິນຄ້ານີ້?"
            description={
              productPendingDelete
                ? `${productPendingDelete.name} ຈະຖືກລຶບອອກຈາກລາຍການຂາຍ.`
                : ""
            }
            confirmLabel="ລຶບສິນຄ້າ"
            onCancel={() => setDeleteProductId(null)}
            onConfirm={() => {
              if (deleteProductId) {
                deleteMutation.mutate(deleteProductId)
              }
            }}
          />
        </section>
      </div>
    </main>
  )
}

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (onClick) {
          onClick()
          return
        }

        if (Icon === Folder) {
          window.location.assign("/pos/categories")
        }
      }}
      className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-[#ded4c8] bg-white px-4 text-sm font-semibold text-[#4f4032] transition hover:border-[#b88b5c] hover:bg-[#f7f1e9]"
    >
      <Icon className="h-4 w-4" />
      {label}
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
        "flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md border px-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-45",
        active
          ? "border-[#2f2419] bg-white text-[#2f2419]"
          : "border-[#ded4c8] bg-white text-[#4f4032] hover:bg-[#f7f1e9]",
      )}
    >
      {children}
    </button>
  )
}
