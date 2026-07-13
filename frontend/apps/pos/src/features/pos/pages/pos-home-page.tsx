import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { Layers3, SquarePen } from "lucide-react"

import { CategoryTabs } from "@/features/pos/components/category-tabs"
import { ItemOptionsModal } from "@/features/pos/components/item-options-modal"
import {
  ComboPickerModal,
  PromotionPickerModal,
} from "@/features/pos/components/order-quick-action-modals"
import { OrderPanel } from "@/features/pos/components/order-panel"
import { PaymentDrawer } from "@/features/pos/components/payment-drawer"
import type { PaymentConfirmationPayload } from "@/features/pos/components/payment-drawer"
import { PosActionBar } from "@/features/pos/components/pos-action-bar"
import { PosTopbar } from "@/features/pos/components/pos-topbar"
import { ProductGrid } from "@/features/pos/components/product-grid"
import {
  listPosItems,
  mapPosItemToCatalogItem,
} from "@/features/pos/api/pos-items-api"
import { listPosCategories } from "@/features/pos/api/pos-categories-api"
import { getPosSettings } from "@/features/pos/api/pos-settings-api"
import {
  createPosOrder,
  payPosOrder,
  updatePosOrderDraft,
} from "@/features/pos/api/pos-orders-api"
import type { CreatePosOrderBody } from "@/features/pos/api/pos-orders-api"
import {
  createPosCustomer,
  listPosCustomers,
} from "@/features/pos/api/pos-customers-api"
import { listPosPromotions, type CafePromotion } from "@/features/pos/api/pos-promotions-api"
import { listPosCombos, type CafeCombo } from "@/features/pos/api/pos-combos-api"
import type { PosCafeCustomer } from "@/features/pos/api/pos-customers-api"
import { showPosToast } from "@/features/pos/components/notifications/pos-toast-store"
import { buildPosCategories } from "@/features/pos/lib/category-options"
import { getPosSession, isSalesReadOnlySession } from "@/features/pos/lib/pos-session"
import { calculateOrderTotals } from "@/features/pos/lib/order-totals"
import { printOrderReceipt } from "@/features/pos/lib/print-order-receipt"
import { printTemporaryReceipt } from "@/features/pos/lib/print-temporary-receipt"
import { cafePosConfig } from "@/features/pos/pos-types/cafe/config"
import { UNSELECTED_TABLE_LABEL, usePosStore } from "@/features/pos/stores/pos-store"
import type { OrderDiscount } from "@/features/pos/stores/pos-store"
import type { PosProduct } from "@/features/pos/types"

const searchSchema = z.object({
  q: z.string().max(80),
})

export type SearchForm = z.infer<typeof searchSchema>

const EMPTY_PRODUCTS: PosProduct[] = []
const EMPTY_CUSTOMERS: PosCafeCustomer[] = []
const DEFAULT_POINT_EARN_AMOUNT = 10_000
const DEFAULT_POINT_VALUE = 1_000
const DEFAULT_MAX_REDEEM_RATE = 20

export function PosHomePage() {
  const config = cafePosConfig
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const session = getPosSession()
  const cashierName = session?.userName || config.cashierName
  const isSalesReadOnly = isSalesReadOnlySession()
  const activeCategoryId = usePosStore((state) => state.activeCategoryId)
  const tableLabel = usePosStore((state) => state.tableLabel)
  const customerMode = usePosStore((state) => state.customerMode)
  const cart = usePosStore((state) => state.cart)
  const orderDiscount = usePosStore((state) => state.orderDiscount)
  const orderNote = usePosStore((state) => state.orderNote)
  const activeOrderId = usePosStore((state) => state.activeOrderId)
  const setActiveCategoryId = usePosStore((state) => state.setActiveCategoryId)
  const setOrderNote = usePosStore((state) => state.setOrderNote)
  const setTableLabel = usePosStore((state) => state.setTableLabel)
  const setCustomerMode = usePosStore((state) => state.setCustomerMode)
  const clearOrderDiscount = usePosStore((state) => state.clearOrderDiscount)
  const addProduct = usePosStore((state) => state.addProduct)
  const addConfiguredProduct = usePosStore((state) => state.addConfiguredProduct)
  const updateLine = usePosStore((state) => state.updateLine)
  const incrementLine = usePosStore((state) => state.incrementLine)
  const decrementLine = usePosStore((state) => state.decrementLine)
  const clearCart = usePosStore((state) => state.clearCart)
  const [optionProduct, setOptionProduct] = useState<PosProduct | null>(null)
  const [editingLineId, setEditingLineId] = useState<string | null>(null)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [customerSearch, setCustomerSearch] = useState("")
  const [quickCustomerName, setQuickCustomerName] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<PosCafeCustomer | null>(null)
  const [redeemPoints, setRedeemPoints] = useState(0)
  const [showOrderNote, setShowOrderNote] = useState(false)
  const [quickActionModal, setQuickActionModal] = useState<
    "combo" | "promotion" | null
  >(null)
  const form = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { q: "" },
  })
  const search = form.watch("q")
  const productsQuery = useQuery({
    queryKey: ["pos-items"],
    queryFn: listPosItems,
    select: (data) =>
      data.items
        .map(mapPosItemToCatalogItem)
        .filter(
          (product) =>
            product.status === "active" &&
            product.availableForSale !== false,
        ),
  })
  const categoriesQuery = useQuery({
    queryKey: ["pos-categories"],
    queryFn: listPosCategories,
  })
  const settingsQuery = useQuery({
    queryKey: ["pos-settings"],
    queryFn: getPosSettings,
  })
  const customerFeatureEnabled = settingsQuery.data?.customers.enabled ?? true
  const customerLookupQuery = useQuery({
    queryKey: ["pos-customers", "lookup", customerSearch.trim()],
    queryFn: () => listPosCustomers({ q: customerSearch.trim() }),
    enabled: customerFeatureEnabled && customerSearch.trim().length >= 2 && !selectedCustomer,
  })
  const promotionsQuery = useQuery({
    queryKey: ["pos-promotions", "active", "pos"],
    queryFn: () => listPosPromotions({ status: "active", pageSize: 50 }),
  })
  const combosQuery = useQuery({
    queryKey: ["pos-combos", "active", "pos"],
    queryFn: () => listPosCombos({ status: "active", pageSize: 50 }),
  })
  const createQuickCustomerMutation = useMutation({
    mutationFn: () =>
      createPosCustomer({
        name: quickCustomerName.trim(),
        phone: customerSearch.trim(),
        status: "active",
      }),
    onSuccess: (customer) => {
      setSelectedCustomer(customer)
      setCustomerSearch(customer.phone)
      setQuickCustomerName("")
      showPosToast({
        type: "success",
        title: "ເພີ່ມລູກຄ້າສະສົມຄະແນນແລ້ວ",
        description: `${customer.name} ຖືກນຳໃຊ້ກັບອໍເດີນີ້ແລ້ວ.`,
      })
      void queryClient.invalidateQueries({ queryKey: ["pos-customers"] })
    },
    onError: () => {
      showPosToast({
        type: "error",
        title: "ເພີ່ມລູກຄ້າບໍ່ໄດ້",
        description: "ເບີໂທອາດມີຢູ່ແລ້ວ ຫຼື ຂໍ້ມູນບໍ່ຖືກຕ້ອງ.",
      })
    },
  })
  const saveOrderMutation = useMutation({
    mutationFn: (body: CreatePosOrderBody) =>
      activeOrderId
        ? updatePosOrderDraft(activeOrderId, body)
        : createPosOrder(body),
    onSuccess: (order) => {
      showPosToast({
        type: "success",
        title: "ບັນທຶກອໍເດີແລ້ວ",
        description: `${order.orderNo} ຖືກບັນທຶກເຂົ້າອໍເດີທີ່ເປີດຢູ່ແລ້ວ.`,
      })
      clearCart()
      clearCustomerSelection()
    },
    onError: (error) => {
      showPosToast({
        type: "error",
        title: "ບັນທຶກອໍເດີບໍ່ໄດ້",
        description:
          error instanceof Error ? error.message : "ກະລຸນາກວດສອບ backend ແລ້ວລອງໃໝ່.",
      })
    },
  })
  const checkoutMutation = useMutation({
    mutationFn: async (payment: PaymentConfirmationPayload) => {
      const order = activeOrderId
        ? await updatePosOrderDraft(activeOrderId, buildOrderBody())
        : await createPosOrder(buildOrderBody(`checkout-${Date.now()}`))
      const paidOrder = await payPosOrder(order.id, {
        paymentStatus: "paid",
        amountPaid: payment.paidTotal,
        cashierName,
        payments: payment.payments.map((line) => ({
          method: line.method === "transfer" ? "bank-transfer" : "cash",
          amountPaid: line.amount,
        })),
      })

      return {
        order: paidOrder,
        printReceipt: payment.printReceipt,
      }
    },
    onSuccess: async ({ order, printReceipt }) => {
      if (printReceipt) {
        const settings = await getLatestSettings()
        const opened = printOrderReceipt({
          businessName: settings?.business.name || config.brandName,
          order,
          settings,
        })

        if (!opened) {
          showPosToast({
            type: "warning",
            title: "ເປີດໜ້າຕ່າງພິມບໍ່ໄດ້",
            description: "ບິນຖືກບັນທຶກແລ້ວ ແຕ່ browser ອາດກຳລັງບລັອກ pop-up.",
          })
        }
      }

      clearCart()
      clearCustomerSelection()
      setIsPaymentOpen(false)
      void queryClient.invalidateQueries({ queryKey: ["pos-orders"] })
      showPosToast({
        type: "success",
        title: "ຊຳລະເງິນສຳເລັດ",
        description: `${order.orderNo} ຖືກສ້າງເປັນບິນແລ້ວ.`,
      })
      navigate(`/pos/orders?orderId=${order.id}`)
    },
    onError: (error) => {
      showPosToast({
        type: "error",
        title: "ຊຳລະເງິນບໍ່ສຳເລັດ",
        description:
          error instanceof Error ? error.message : "ກະລຸນາກວດສອບ backend ແລ້ວລອງໃໝ່.",
      })
    },
  })
  const products = productsQuery.data ?? EMPTY_PRODUCTS
  const posCategories = useMemo(
    () => buildPosCategories(categoriesQuery.data?.categories, config.categories),
    [categoriesQuery.data, config.categories],
  )
  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return products.filter((product) => {
      const categoryMatched =
        activeCategoryId === "all" || product.categoryId === activeCategoryId
      const searchMatched = !keyword || product.name.toLowerCase().includes(keyword)

      return categoryMatched && searchMatched
    })
  }, [activeCategoryId, products, search])
  const orderTotals = useMemo(
    () => calculateOrderTotals(cart, orderDiscount),
    [cart, orderDiscount],
  )
  const autoPromotionDiscount = useMemo(
    () =>
      calculateAutoPromotionDiscount(
        cart,
        products,
        promotionsQuery.data?.promotions ?? [],
        orderTotals.subtotal,
      ),
    [cart, orderTotals.subtotal, products, promotionsQuery.data?.promotions],
  )
  const effectiveOrderDiscount = orderDiscount ?? autoPromotionDiscount
  const effectiveOrderTotals = useMemo(
    () => calculateOrderTotals(cart, effectiveOrderDiscount),
    [cart, effectiveOrderDiscount],
  )
  const loyaltySettings = settingsQuery.data?.customers
  const customerCodePrefix = loyaltySettings?.codePrefix || "CM"
  const pointEarnAmount = Math.max(1, Math.round(loyaltySettings?.earnAmount ?? DEFAULT_POINT_EARN_AMOUNT))
  const pointValue = Math.max(1, Math.round(loyaltySettings?.pointValue ?? DEFAULT_POINT_VALUE))
  const maxRedeemRate = Math.max(
    0,
    Math.min(100, loyaltySettings?.maxRedeemRate ?? DEFAULT_MAX_REDEEM_RATE),
  ) / 100
  const maxRedeemPoints = selectedCustomer
    ? Math.min(
        selectedCustomer.points,
        Math.floor((effectiveOrderTotals.total * maxRedeemRate) / pointValue),
      )
    : 0
  const normalizedRedeemPoints = Math.min(redeemPoints, maxRedeemPoints)
  const loyaltyDiscountAmount = normalizedRedeemPoints * pointValue
  const receiptTaxAmount = useMemo(() => {
    if (!settingsQuery.data?.receipt.showTax) return 0

    const taxableAmount = Math.max(0, effectiveOrderTotals.total - loyaltyDiscountAmount)
    const { serviceFeeRate, vatRate } = settingsQuery.data.tax

    return Math.round((taxableAmount * (serviceFeeRate + vatRate)) / 100)
  }, [effectiveOrderTotals.total, loyaltyDiscountAmount, settingsQuery.data])
  const receiptTaxLabel = useMemo(() => {
    const tax = settingsQuery.data?.tax

    if (!tax) return "ອາກອນ / ຄ່າບໍລິການ"

    return [
      tax.serviceFeeRate > 0 ? `ຄ່າບໍລິການ ${tax.serviceFeeRate}%` : null,
      tax.vatRate > 0 ? `ອາກອນ ${tax.vatRate}%` : null,
    ].filter(Boolean).join(" + ") || "ອາກອນ / ຄ່າບໍລິການ"
  }, [settingsQuery.data?.tax])
  const earnedPoints = selectedCustomer
    ? Math.floor(effectiveOrderTotals.total / pointEarnAmount)
    : 0
  const customerMatches = customerLookupQuery.data?.customers ?? EMPTY_CUSTOMERS
  const editingLine = cart.find((line) => line.id === editingLineId) ?? null
  const quickActions = useMemo(
    () => [
      ...config.quickActions.filter((action) => action.id !== "logout"),
      { id: "combo", label: "ຄອມໂບ", icon: Layers3 },
      { id: "note", label: "ໝາຍເຫດ", icon: SquarePen },
    ],
    [config.quickActions],
  )
  const showOrderNoteInput = useCallback(() => {
    setShowOrderNote(true)
  }, [])

  useEffect(() => {
    if (customerFeatureEnabled || customerMode !== "member") return

    setCustomerMode("retail")
    clearCustomerSelection()
  }, [customerFeatureEnabled, customerMode, setCustomerMode])

  useEffect(() => {
    if (redeemPoints > maxRedeemPoints) {
      setRedeemPoints(maxRedeemPoints)
    }
  }, [maxRedeemPoints, redeemPoints])

  useEffect(() => {
    if (!posCategories.some((category) => category.id === activeCategoryId)) {
      setActiveCategoryId("all")
    }
  }, [activeCategoryId, posCategories, setActiveCategoryId])

  function buildOrderBody(clientRequestId?: string): CreatePosOrderBody {
    return {
      clientRequestId,
      posType: config.type,
      orderType: "ກິນຢູ່ຮ້ານ",
      status: "open",
      paymentStatus: "unpaid",
      tableLabel: getSelectedTableLabel(tableLabel),
      customerId: selectedCustomer?.id ?? null,
      customerName:
        selectedCustomer?.name ??
        (customerFeatureEnabled && customerMode === "member" ? "ສະມາຊິກ" : "ລູກຄ້າທົ່ວໄປ"),
      cashierName,
      note: orderNote.trim() || null,
      discountAmount: effectiveOrderTotals.discountAmount + loyaltyDiscountAmount,
      discountLabel:
        [
          effectiveOrderDiscount ? effectiveOrderDiscount.reason || effectiveOrderDiscount.label : null,
          loyaltyDiscountAmount > 0 ? `ໃຊ້ ${normalizedRedeemPoints} ຄະແນນ` : null,
        ]
          .filter(Boolean)
          .join(" + ") || null,
      loyaltyPointsRedeemed: normalizedRedeemPoints,
      loyaltyDiscountAmount,
      taxAmount: receiptTaxAmount,
      items: cart.map((line) => ({
        itemId: line.productId,
        name: line.name,
        price: line.price,
        quantity: line.quantity,
        note: line.note || null,
      })),
    }
  }

  function clearCustomerSelection() {
    setSelectedCustomer(null)
    setCustomerSearch("")
    setQuickCustomerName("")
    setRedeemPoints(0)
  }

  function hasOptions(product: PosProduct) {
    return Boolean(product.optionGroups?.some((group) => group.choices.length > 0))
  }

  function canSellProduct(product: PosProduct) {
    return typeof product.stock !== "number" || product.stock > 0
  }

  function handleProductClick(product: PosProduct) {
    if (isSalesReadOnly) return
    if (!canSellProduct(product)) return

    if (!hasOptions(product)) {
      addProduct(product)
      return
    }

    setEditingLineId(null)
    setOptionProduct(product)
  }

  function handleComboClick(combo: CafeCombo) {
    if (isSalesReadOnly) return

    addProduct({
      id: `combo-${combo.id}`,
      name: combo.name,
      price: combo.price,
      categoryId: "combo",
      image: combo.image,
      subtitle: combo.subtitle || "ຄອມໂບ",
      status: "active",
      availableForSale: true,
    })
    setQuickActionModal(null)
    showPosToast({
      type: "success",
      title: "ເພີ່ມຄອມໂບເຂົ້າອໍເດີແລ້ວ",
      description: combo.name,
    })
  }

  function handleEditLine(lineId: string) {
    if (isSalesReadOnly) return
    const line = cart.find((item) => item.id === lineId)
    if (!line) return

    const product = products.find((item) => item.id === line.productId)
    if (!product || !hasOptions(product)) return

    setEditingLineId(lineId)
    setOptionProduct(product)
  }

  function closeItemOptions() {
    setOptionProduct(null)
    setEditingLineId(null)
  }

  function handleSaveOrder() {
    if (isSalesReadOnly) {
      showPosToast({
        type: "warning",
        title: "ເບິ່ງໄດ້ຢ່າງດຽວ",
        description: "ມີພຽງບົດບາດແຄດເຊຍເທົ່ານັ້ນທີ່ຂາຍໄດ້.",
      })
      return
    }

    if (!cart.length) {
      showPosToast({
        type: "warning",
        title: "ອໍເດີຍັງຫວ່າງ",
        description: "ກະລຸນາເພີ່ມລາຍການກ່ອນບັນທຶກອໍເດີ.",
      })
      return
    }

    if (!validateVipCustomer()) return

    saveOrderMutation.mutate(buildOrderBody(activeOrderId ? undefined : `pos-${Date.now()}`))
  }

  function validateVipCustomer() {
    if (!customerFeatureEnabled) return true
    if (customerMode !== "member" || selectedCustomer) return true

    showPosToast({
      type: "warning",
      title: "ຕ້ອງເລືອກລູກຄ້າສະມາຊິກ",
      description: "ກະລຸນາໃສ່ເບີໂທ ແລະ ເລືອກ ຫຼື ສ້າງລູກຄ້າສະມາຊິກກ່ອນ.",
    })

    return false
  }

  function handleCreateQuickCustomer() {
    if (isSalesReadOnly || !customerFeatureEnabled) return

    if (!isValidMemberPhone(customerSearch)) {
      showPosToast({
        type: "warning",
        title: "ເບີໂທບໍ່ຖືກ",
        description: "ເບີໂທຕ້ອງຂຶ້ນຕົ້ນ 209, 207, 205 ຫຼື 202 ແລະຄົບ 10 ໂຕເລກ.",
      })
      return
    }

    if (!customerSearch.trim() || !quickCustomerName.trim()) {
      showPosToast({
        type: "warning",
        title: "ຂໍ້ມູນລູກຄ້າບໍ່ຄົບ",
        description: "ກະລຸນາໃສ່ເບີໂທ ແລະ ຊື່ລູກຄ້າເພື່ອສະສົມຄະແນນ.",
      })
      return
    }

    createQuickCustomerMutation.mutate()
  }

  async function handlePrintTemporaryReceipt() {
    if (isSalesReadOnly) return

    if (!cart.length) {
      showPosToast({
        type: "warning",
        title: "ອໍເດີຍັງຫວ່າງ",
        description: "ກະລຸນາເພີ່ມລາຍການກ່ອນພິມໃບບິນຊົ່ວຄາວ.",
      })
      return
    }

    const settings = await getLatestSettings()
    const opened = printTemporaryReceipt({
      businessName: settings?.business.name || config.brandName,
      tableLabel: getReceiptTableLabel(tableLabel),
      cart,
      orderDiscount: effectiveOrderDiscount,
      orderNote,
      loyaltyDiscountAmount,
      taxAmount: receiptTaxAmount,
      taxLabel: receiptTaxLabel,
      settings,
    })

    showPosToast(
      opened
        ? {
            type: "info",
            title: "ເປີດໃບບິນຊົ່ວຄາວແລ້ວ",
            description: "ກວດເບິ່ງໜ້າຕ່າງພິມຂອງ browser.",
          }
        : {
            type: "error",
            title: "ເປີດໜ້າຕ່າງພິມບໍ່ໄດ້",
            description: "Browser ອາດກຳລັງບລັອກ pop-up.",
          },
    )
  }

  async function getLatestSettings() {
    try {
      return await queryClient.fetchQuery({
        queryKey: ["pos-settings"],
        queryFn: getPosSettings,
      })
    } catch {
      return settingsQuery.data
    }
  }

  function handleQuickAction(actionId: string) {
    if (isSalesReadOnly) return

    if (actionId === "promotion" || actionId === "combo") {
      setQuickActionModal(actionId)
      return
    }

    if (actionId === "return") {
      navigate("/pos/orders")
      return
    }

    if (actionId === "print") {
      navigate("/pos/orders")
      return
    }

    if (actionId === "note") {
      setShowOrderNote((value) => !value)
      return
    }

    if (actionId === "logout") {
      showPosToast({
        type: "info",
        title: "ອອກລະບົບຈະເຮັດພາຍຫຼັງ",
        description: "ຂັ້ນຕອນອອກລະບົບຕ້ອງຢືນຢັນກະກ່ອນອອກຈາກ POS.",
      })
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-[#f3efe7] text-[#2f2419]">
      <div className="flex h-full min-w-[1024px]">
        <section className="flex min-w-0 flex-1 flex-col">
          <PosTopbar form={form} />

          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_clamp(360px,29vw,430px)] gap-3 p-3">
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#ded4c8] bg-white shadow-[0_12px_28px_rgba(52,40,28,0.08)]"
            >
              <CategoryTabs
                categories={posCategories}
                activeCategoryId={activeCategoryId}
                onChange={setActiveCategoryId}
              />
              <div className="min-h-0 flex-1 overflow-y-auto bg-[#f7f3ec]">
                {productsQuery.isLoading ? (
                  <div className="grid grid-cols-2 gap-4 p-5 xl:grid-cols-3 2xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-[196px] animate-pulse rounded-lg bg-white/80"
                      />
                    ))}
                  </div>
                ) : (
                  <ProductGrid
                    products={filteredProducts}
                    onAddProduct={handleProductClick}
                    readOnly={isSalesReadOnly}
                  />
                )}
                {!productsQuery.isLoading && filteredProducts.length === 0 ? (
                  <div className="p-5">
                    <div className="rounded-lg border border-dashed border-[#ded4c8] bg-white p-8 text-center text-sm font-black text-[#756656]">
                      ບໍ່ພົບສິນຄ້າທີ່ພ້ອມຂາຍ.
                    </div>
                  </div>
                ) : null}
              </div>
              <PosActionBar
                actions={quickActions}
                onAction={handleQuickAction}
                activeActionId={showOrderNote ? "note" : quickActionModal}
                readOnly={isSalesReadOnly}
              />
            </motion.section>

            <OrderPanel
              tableLabel={tableLabel}
              tableCount={settingsQuery.data?.tables.tableCount ?? 12}
              cart={cart}
              orderDiscount={effectiveOrderDiscount}
              selectedCustomer={selectedCustomer}
              customerMode={customerMode}
              customerSearch={customerSearch}
              customerMatches={customerMatches}
              quickCustomerName={quickCustomerName}
              maxRedeemPoints={maxRedeemPoints}
              redeemPoints={normalizedRedeemPoints}
              loyaltyDiscountAmount={loyaltyDiscountAmount}
              earnedPoints={earnedPoints}
              pointEarnAmount={pointEarnAmount}
              pointValue={pointValue}
              maxRedeemRate={maxRedeemRate * 100}
              customerCodePrefix={customerCodePrefix}
              customerFeatureEnabled={customerFeatureEnabled}
              orderNote={orderNote}
              onChangeCustomerSearch={(value) => {
                setCustomerSearch(normalizeMemberPhone(value))
                setSelectedCustomer(null)
                setRedeemPoints(0)
              }}
              onChangeTableLabel={setTableLabel}
              onChangeCustomerMode={setCustomerMode}
              onChangeQuickCustomerName={setQuickCustomerName}
              onSelectCustomer={(customer) => {
                setSelectedCustomer(customer)
                setCustomerSearch(customer.phone)
                setRedeemPoints(0)
              }}
              onClearCustomer={clearCustomerSelection}
              onCreateQuickCustomer={handleCreateQuickCustomer}
              creatingQuickCustomer={createQuickCustomerMutation.isPending}
              onApplyMaxPoints={() => setRedeemPoints(maxRedeemPoints)}
              onClearRedeemPoints={() => setRedeemPoints(0)}
              onChangeNote={setOrderNote}
              onIncrement={incrementLine}
              onDecrement={decrementLine}
              onEditLine={handleEditLine}
              onClear={clearCart}
              onClearDiscount={clearOrderDiscount}
              onSaveOrder={handleSaveOrder}
              onPrintTemporaryReceipt={handlePrintTemporaryReceipt}
              onCheckout={() => {
                if (!isSalesReadOnly && validateVipCustomer()) setIsPaymentOpen(true)
              }}
              showOrderNote={showOrderNote}
              onShowOrderNote={showOrderNoteInput}
              savingOrder={saveOrderMutation.isPending}
              readOnly={isSalesReadOnly}
            />
          </div>
        </section>
      </div>

      <PaymentDrawer
        open={isPaymentOpen && !isSalesReadOnly}
        cart={cart}
        orderDiscount={effectiveOrderDiscount}
        selectedCustomer={selectedCustomer}
        loyaltyDiscountAmount={loyaltyDiscountAmount}
        redeemPoints={normalizedRedeemPoints}
        earnedPoints={earnedPoints}
        tableLabel={getReceiptTableLabel(tableLabel)}
        taxAmount={receiptTaxAmount}
        taxLabel={receiptTaxLabel}
        onClose={() => setIsPaymentOpen(false)}
        onConfirm={(payment) => {
          if (!isSalesReadOnly) checkoutMutation.mutate(payment)
        }}
        confirming={checkoutMutation.isPending}
      />

      <PromotionPickerModal
        open={quickActionModal === "promotion" && !isSalesReadOnly}
        promotions={promotionsQuery.data?.promotions ?? []}
        isLoading={promotionsQuery.isLoading}
        onClose={() => setQuickActionModal(null)}
      />

      <ComboPickerModal
        open={quickActionModal === "combo" && !isSalesReadOnly}
        combos={combosQuery.data?.combos ?? []}
        isLoading={combosQuery.isLoading}
        onClose={() => setQuickActionModal(null)}
        onSelectCombo={handleComboClick}
      />

      <ItemOptionsModal
        product={optionProduct}
        line={editingLine}
        open={Boolean(optionProduct) && !isSalesReadOnly}
        onClose={closeItemOptions}
        onSave={({ product, lineId, quantity, unitPrice, note, options }) => {
          if (isSalesReadOnly) return

          if (lineId) {
            updateLine(lineId, { quantity, unitPrice, note, options })
          } else {
            addConfiguredProduct({ product, quantity, unitPrice, note, options })
          }
          closeItemOptions()
        }}
      />
    </main>
  )
}

type CartState = ReturnType<typeof usePosStore.getState>["cart"]

function calculateAutoPromotionDiscount(
  cart: CartState,
  products: PosProduct[],
  promotions: CafePromotion[],
  subtotal: number,
): OrderDiscount | null {
  if (!cart.length || subtotal <= 0) return null

  const now = new Date()
  const eligibleDiscounts = promotions
    .filter((promotion) => promotion.status === "active")
    .filter((promotion) => promotion.type === "percent" || promotion.type === "amount")
    .filter((promotion) => isPromotionActiveNow(promotion, now))
    .map((promotion) => {
      const eligibleSubtotal = getEligibleSubtotal(cart, products, promotion)

      if (eligibleSubtotal <= 0) return null
      if (subtotal < promotion.minSubtotal) return null

      const rawAmount =
        promotion.type === "percent"
          ? Math.round((eligibleSubtotal * promotion.discountValue) / 100)
          : promotion.discountValue
      const cappedAmount =
        promotion.maxDiscountAmount && promotion.maxDiscountAmount > 0
          ? Math.min(rawAmount, promotion.maxDiscountAmount)
          : rawAmount
      const amount = Math.min(subtotal, Math.max(0, cappedAmount))

      if (amount <= 0) return null

      return {
        promotion,
        amount,
      }
    })
    .filter((item): item is { promotion: CafePromotion; amount: number } => Boolean(item))
    .sort((left, right) => right.amount - left.amount)

  const best = eligibleDiscounts[0]

  if (!best) return null

  return {
    id: `auto-${best.promotion.id}`,
    source: "promotion",
    label: best.promotion.code || best.promotion.name,
    mode: "amount",
    value: best.amount,
    reason: formatPromotionDiscountValue(best.promotion),
  }
}

function formatPromotionDiscountValue(promotion: CafePromotion) {
  if (promotion.type === "percent") {
    return `${promotion.discountValue.toLocaleString("vi-VN")}%`
  }

  if (promotion.type === "bogo") {
    return promotion.discountValue.toLocaleString("vi-VN")
  }

  return `${Math.round(promotion.discountValue).toLocaleString("en-US")} ກີບ`
}

function getSelectedTableLabel(value: string) {
  return value && value !== UNSELECTED_TABLE_LABEL ? value : null
}

function getReceiptTableLabel(value: string) {
  return getSelectedTableLabel(value) ?? "ບໍ່ມີໂຕະ"
}

function normalizeMemberPhone(value: string) {
  return value.replace(/[^\d]/g, "").slice(0, 10)
}

function isValidMemberPhone(value: string) {
  return /^(209|207|205|202)\d{7}$/.test(normalizeMemberPhone(value))
}

function getEligibleSubtotal(
  cart: CartState,
  products: PosProduct[],
  promotion: CafePromotion,
) {
  if (promotion.applyScope === "all_order") {
    return cart.reduce((sum, line) => sum + line.price * line.quantity, 0)
  }

  if (!promotion.targetIds.length) return 0

  return cart.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.productId)
    const productMatched =
      promotion.applyScope === "product" && promotion.targetIds.includes(line.productId)
    const categoryMatched =
      promotion.applyScope === "category" &&
      product &&
      promotion.targetIds.includes(product.categoryId)

    return productMatched || categoryMatched ? sum + line.price * line.quantity : sum
  }, 0)
}

function isPromotionActiveNow(promotion: CafePromotion, now: Date) {
  if (promotion.startDate && stripTime(now) < stripTime(new Date(`${promotion.startDate}T00:00:00`))) {
    return false
  }

  if (promotion.endDate && stripTime(now) > stripTime(new Date(`${promotion.endDate}T00:00:00`))) {
    return false
  }

  if (promotion.daysOfWeek.length && !promotion.daysOfWeek.includes(now.getDay())) {
    return false
  }

  if (promotion.startTime && promotion.endTime) {
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

    if (currentTime < promotion.startTime || currentTime > promotion.endTime) {
      return false
    }
  }

  return true
}

function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
