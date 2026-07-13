import { motion } from "framer-motion"
import { Banknote, Clock3, ReceiptText, ShieldCheck } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import type { ComponentType } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useSearchParams } from "react-router-dom"

import {
  cancelPosOrder,
  listPosOrders,
  payPosOrder,
  refundPosOrder,
  sendPosOrderToKitchen,
  voidPosOrder,
} from "@/features/pos/api/pos-orders-api"
import type { PosBusinessOrder, PosOrderStatus } from "@/features/pos/api/pos-orders-api"
import { getPosSettings } from "@/features/pos/api/pos-settings-api"
import { OrderDetailPanel } from "@/features/pos/components/orders/order-detail-panel"
import { OrderFilterBar } from "@/features/pos/components/orders/order-filter-bar"
import type {
  OrderStatusFilter,
  OrderTypeFilter,
} from "@/features/pos/components/orders/order-filter-bar"
import { OrdersTable } from "@/features/pos/components/orders/orders-table"
import { OrdersTopbar } from "@/features/pos/components/orders/orders-topbar"
import { PosConfirmDialog } from "@/features/pos/components/notifications/pos-notification-ui"
import { showPosToast } from "@/features/pos/components/notifications/pos-toast-store"
import type { CafeOrder, CafeOrderStatus, CafeOrderType } from "@/features/pos/data/cafe-orders"
import { formatVnd } from "@/features/pos/lib/format"
import { getPosSession } from "@/features/pos/lib/pos-session"
import { printOrderReceipt } from "@/features/pos/lib/print-order-receipt"
import { cafePosConfig } from "@/features/pos/pos-types/cafe/config"
import { usePosStore } from "@/features/pos/stores/pos-store"

const fallbackOrderImage = "/images/pos-login-hero.png"
const todayDateValue = getDateInputValue(new Date())

type PendingOrderConfirm =
  | {
      kind: "workflow"
      title: string
      description: string
      confirmLabel: string
      tone: "danger" | "default"
    }
  | {
      kind: "payment"
      title: string
      description: string
      confirmLabel: string
      tone: "danger" | "default"
    }

export function PosOrdersPage() {
  const config = cafePosConfig
  const session = getPosSession()
  const cashierName = session?.userName || config.cashierName
  const loadCartFromOrder = usePosStore((state) => state.loadCartFromOrder)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState("")
  const [startDate, setStartDate] = useState(todayDateValue)
  const [endDate, setEndDate] = useState(todayDateValue)
  const [typeFilter, setTypeFilter] = useState<OrderTypeFilter>("all")
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all")
  const [selectedOrderId, setSelectedOrderId] = useState("")
  const [pendingConfirm, setPendingConfirm] = useState<PendingOrderConfirm | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const ordersQuery = useQuery({
    queryKey: ["pos-orders"],
    queryFn: () => listPosOrders(),
  })
  const settingsQuery = useQuery({
    queryKey: ["pos-settings"],
    queryFn: getPosSettings,
  })
  const workflowMutation = useMutation({
    mutationFn: ({
      orderId,
      action,
    }: {
      orderId: string
      action: "send-to-kitchen" | "cancel" | "void" | "refund"
    }) => {
      if (action === "send-to-kitchen") return sendPosOrderToKitchen(orderId)
      if (action === "cancel") return cancelPosOrder(orderId)
      if (action === "void") return voidPosOrder(orderId)

      return refundPosOrder(orderId)
    },
    onSuccess: (order) => {
      void queryClient.invalidateQueries({ queryKey: ["pos-orders"] })
      showPosToast({
        type: "success",
        title: "ດຳເນີນອໍເດີແລ້ວ",
        description: `${order.orderNo} ຖືກອັບເດດຕາມ workflow ແລ້ວ.`,
      })
    },
    onError: (error) => {
      showPosToast({
        type: "error",
        title: "ດຳເນີນອໍເດີບໍ່ສຳເລັດ",
        description:
          error instanceof Error ? error.message : "ກະລຸນາກວດສອບ backend ແລ້ວລອງໃໝ່.",
      })
    },
  })
  const payOrderMutation = useMutation({
    mutationFn: (order: PosBusinessOrder) =>
      payPosOrder(order.id, {
        paymentStatus: "paid",
        method: "cash",
        amountPaid: order.total,
        cashierName,
      }),
    onSuccess: (order) => {
      void queryClient.invalidateQueries({ queryKey: ["pos-orders"] })
      showPosToast({
        type: "success",
        title: "ຊຳລະອໍເດີແລ້ວ",
        description: `${order.orderNo} ຖືກອັບເດດເປັນຊຳລະແລ້ວ.`,
      })
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
  const orders = useMemo(
    () => (ordersQuery.data?.orders ?? []).map(mapBusinessOrderToCafeOrder),
    [ordersQuery.data?.orders],
  )
  const businessOrders = ordersQuery.data?.orders ?? []
  useEffect(() => {
    const orderId = searchParams.get("orderId")

    if (orderId) {
      setSelectedOrderId(orderId)
      return
    }

    if (!selectedOrderId && orders[0]) {
      setSelectedOrderId(orders[0].backendId ?? orders[0].id)
    }
  }, [orders, searchParams, selectedOrderId])

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return orders.filter((order) => {
      const typeMatched = typeFilter === "all" || order.type === typeFilter
      const dateMatched =
        (!startDate || (order.orderDate ?? "") >= startDate) &&
        (!endDate || (order.orderDate ?? "") <= endDate)
      const statusMatched =
        statusFilter === "all" ||
        order.paymentStatus === statusFilter ||
        order.status === statusFilter ||
        (statusFilter === "open" && order.status === "new") ||
        (statusFilter === "voided" && order.status === "voided") ||
        (statusFilter === "refunded" && order.status === "refunded")
      const searchMatched =
        !keyword ||
        [
          order.id,
          order.orderNo,
          order.date,
          order.time,
          order.tableOrCustomer,
          order.phone,
          order.employee,
          order.note,
          order.type,
          order.status,
          order.paymentStatus,
          order.total.toString(),
          ...order.items.flatMap((item) => [item.name, item.note]),
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(keyword))

      return typeMatched && dateMatched && statusMatched && searchMatched
    })
  }, [endDate, orders, search, startDate, statusFilter, typeFilter])
  const orderMetrics = useMemo(() => {
    const activeOrders = orders.filter((order) =>
      ["new", "preparing", "delivering"].includes(order.status),
    ).length
    const unpaidOrders = orders.filter((order) => order.paymentStatus === "unpaid").length
    const paidOrders = orders.filter((order) => order.paymentStatus === "paid")
    const paidTotal = paidOrders.reduce((sum, order) => sum + order.total, 0)

    return [
      {
        id: "total",
        label: "ອໍເດີທັງໝົດ",
        value: orders.length.toLocaleString("vi-VN"),
        helper: `ກຳລັງສະແດງ ${filteredOrders.length.toLocaleString("vi-VN")}`,
        icon: ReceiptText,
        tone: "neutral" as const,
      },
      {
        id: "active",
        label: "ກຳລັງດຳເນີນ",
        value: activeOrders.toLocaleString("vi-VN"),
        helper: "ຕ້ອງຕິດຕາມ",
        icon: Clock3,
        tone: "blue" as const,
      },
      {
        id: "unpaid",
        label: "ຍັງບໍ່ຊຳລະ",
        value: unpaidOrders.toLocaleString("vi-VN"),
        helper: "ຄວນປິດກ່ອນ",
        icon: Banknote,
        tone: "amber" as const,
      },
      {
        id: "paid",
        label: "ຮັບເງິນແລ້ວ",
        value: paidTotal.toLocaleString("vi-VN"),
        helper: `${paidOrders.length.toLocaleString("vi-VN")} ອໍເດີຊຳລະແລ້ວ`,
        icon: ShieldCheck,
        tone: "green" as const,
      },
    ]
  }, [filteredOrders.length, orders])
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize))
  const paginatedOrders = useMemo(
    () => filteredOrders.slice((page - 1) * pageSize, page * pageSize),
    [filteredOrders, page, pageSize],
  )
  const selectedOrder =
    filteredOrders.find((order) => (order.backendId ?? order.id) === selectedOrderId) ??
    null
  const selectedBusinessOrder = selectedOrder
    ? businessOrders.find((order) => order.id === selectedOrder.backendId)
    : null
  const workflowAction = selectedBusinessOrder
    ? getWorkflowAction(selectedBusinessOrder)
    : null

  useEffect(() => {
    setPage(1)
  }, [endDate, search, startDate, statusFilter, typeFilter])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  async function handlePrintReceipt() {
    if (!selectedBusinessOrder) return

    if (selectedBusinessOrder.paymentStatus !== "paid") {
      showPosToast({
        type: "warning",
        title: "ຍັງພິມໃບບິນບໍ່ໄດ້",
        description: "ອໍເດີນີ້ຍັງບໍ່ຊຳລະ. ກະລຸນາຊຳລະກ່ອນພິມໃບບິນ.",
      })
      return
    }

    const settings = await getLatestSettings()
    const opened = printOrderReceipt({
      businessName: settings?.business.name || config.brandName,
      order: selectedBusinessOrder,
      settings,
    })

    showPosToast(
      opened
        ? {
            type: "info",
            title: "ເປີດໃບບິນແລ້ວ",
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

  function handleWorkflowAction() {
    if (!selectedBusinessOrder || !workflowAction) return

    if (workflowAction.confirmMessage) {
      setPendingConfirm({
        kind: "workflow",
        title: "ຢືນຢັນການດຳເນີນອໍເດີ",
        description: workflowAction.confirmMessage,
        confirmLabel: workflowAction.label,
        tone: workflowAction.action === "cancel" ? "danger" : "default",
      })
      return
    }

    workflowMutation.mutate({
      orderId: selectedBusinessOrder.id,
      action: workflowAction.action,
    })
  }

  function handlePayOrder() {
    if (!selectedBusinessOrder) return

    if (selectedBusinessOrder.paymentStatus === "paid") {
      showPosToast({
        type: "info",
        title: "ອໍເດີຊຳລະແລ້ວ",
        description: `${selectedBusinessOrder.orderNo} ຢູ່ສະຖານະຊຳລະແລ້ວ.`,
      })
      return
    }

    if (["cancelled", "voided", "refunded"].includes(selectedBusinessOrder.status)) {
      showPosToast({
        type: "warning",
        title: "ຊຳລະອໍເດີນີ້ບໍ່ໄດ້",
        description: `${selectedBusinessOrder.orderNo} ຖືກຍົກເລີກ, void ຫຼື ຄືນເງິນແລ້ວ.`,
      })
      return
    }

    setPendingConfirm({
      kind: "payment",
      title: "ຢືນຢັນການຊຳລະ",
      description: `ຢືນຢັນການຊຳລະ ${selectedBusinessOrder.orderNo} ລວມ ${formatVnd(selectedBusinessOrder.total)}?`,
      confirmLabel: "ຊຳລະ",
      tone: "default",
    })
  }

  function handleContinueSale() {
    if (!selectedBusinessOrder) return

    if (
      selectedBusinessOrder.paymentStatus !== "unpaid" ||
      ["cancelled", "voided", "refunded"].includes(selectedBusinessOrder.status)
    ) {
      showPosToast({
        type: "warning",
        title: "ຂາຍຕໍ່ບໍ່ໄດ້",
        description: `${selectedBusinessOrder.orderNo} ບໍ່ຢູ່ສະຖານະທີ່ແກ້ໄຂລາຍການໄດ້ແລ້ວ.`,
      })
      return
    }

    loadCartFromOrder(
      selectedBusinessOrder.items.map((item) => ({
        id: `order-${selectedBusinessOrder.id}-${item.id}`,
        productId: item.itemId ?? item.id,
        name: item.name,
        basePrice: item.price,
        price: item.price,
        image: item.imageUrl || fallbackOrderImage,
        note: item.note ?? "",
        quantity: item.quantity,
      })),
      {
        id: selectedBusinessOrder.id,
        orderNo: selectedBusinessOrder.orderNo,
        note: selectedBusinessOrder.note,
        discountAmount: selectedBusinessOrder.discountAmount,
        discountLabel: selectedBusinessOrder.discountLabel,
      },
    )
    setSelectedOrderId("")
    showPosToast({
      type: "info",
      title: "ເອົາອໍເດີເຂົ້າ cart ແລ້ວ",
      description: `${selectedBusinessOrder.orderNo} ພ້ອມໃຫ້ເພີ່ມ ຫຼື ແກ້ໄຂລາຍການແລ້ວ.`,
    })
    navigate("/pos")
  }

  function handleConfirmAction() {
    if (!pendingConfirm || !selectedBusinessOrder) return

    if (pendingConfirm.kind === "payment") {
      payOrderMutation.mutate(selectedBusinessOrder)
      setPendingConfirm(null)
      return
    }

    if (!workflowAction) return

    workflowMutation.mutate({
      orderId: selectedBusinessOrder.id,
      action: workflowAction.action,
    })
    setPendingConfirm(null)
  }

  return (
    <main className="h-screen overflow-hidden bg-[#f3efe7] text-[#2f2419]">
      <div className="flex h-full min-w-[1180px]">
        <section className="flex min-w-0 flex-1 flex-col">
          <OrdersTopbar search={search} onSearchChange={setSearch} />

          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_410px] gap-3 p-3">
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#ded4c8] bg-white shadow-[0_12px_28px_rgba(52,40,28,0.08)]"
            >
              <OrderMetricStrip metrics={orderMetrics} />
              <OrderFilterBar
                search={search}
                startDate={startDate}
                endDate={endDate}
                typeFilter={typeFilter}
                statusFilter={statusFilter}
                onSearchChange={setSearch}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onTypeFilterChange={setTypeFilter}
                onStatusFilterChange={setStatusFilter}
                onCreateOrder={() => navigate("/pos")}
              />
              {ordersQuery.isLoading ? (
                <div className="flex min-h-0 flex-1 items-center justify-center text-sm font-black text-[#8a7560]">
                  ກຳລັງໂຫຼດບິນ...
                </div>
              ) : ordersQuery.isError ? (
                <div className="flex min-h-0 flex-1 items-center justify-center p-6">
                  <div className="rounded-xl border border-[#f2c8bd] bg-[#fff5f2] px-5 py-4 text-sm font-black text-[#c23d2a]">
                    ໂຫຼດບິນບໍ່ສຳເລັດ. ກວດ backend ແລະ database ກ່ອນ.
                  </div>
                </div>
            ) : (
                <OrdersTable
                  orders={paginatedOrders}
                  selectedOrderId={selectedOrder?.backendId ?? selectedOrder?.id ?? ""}
                  totalOrders={filteredOrders.length}
                  page={page}
                  pageSize={pageSize}
                  onSelectOrder={setSelectedOrderId}
                  onPageChange={setPage}
                  onPageSizeChange={(nextPageSize) => {
                    setPageSize(nextPageSize)
                    setPage(1)
                  }}
                />
              )}
            </motion.section>

            {selectedOrder ? (
              <div className="h-full min-h-0">
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22 }}
                  className="h-full min-h-0"
                >
                <OrderDetailPanel
                  order={selectedOrder}
                  onClose={() => setSelectedOrderId("")}
                  onPrintReceipt={handlePrintReceipt}
                  workflowActionLabel={workflowAction?.label ?? "ອໍເດີຖືກລັອກແລ້ວ"}
                  onWorkflowAction={handleWorkflowAction}
                  onPayOrder={handlePayOrder}
                  onContinueSale={handleContinueSale}
                  updatingStatus={workflowMutation.isPending}
                  payingOrder={payOrderMutation.isPending}
                  workflowActionDisabled={!workflowAction}
                />
                </motion.div>
              </div>
              ) : (
                <aside className="flex h-full min-h-0 items-center justify-center rounded-2xl border border-[#eadfce] bg-white p-6 text-center text-sm font-black text-[#8a7560] shadow-[0_18px_42px_rgba(80,54,27,0.12)]">
                  ຍັງບໍ່ມີບິນ.
                </aside>
              )}
            <PosConfirmDialog
              open={Boolean(pendingConfirm)}
              title={pendingConfirm?.title ?? ""}
              description={pendingConfirm?.description ?? ""}
              tone={pendingConfirm?.tone ?? "default"}
              confirmLabel={pendingConfirm?.confirmLabel ?? "ຢືນຢັນ"}
              onCancel={() => setPendingConfirm(null)}
              onConfirm={handleConfirmAction}
            />
          </div>
        </section>
      </div>
    </main>
  )
}

type OrderMetric = {
  id: string
  label: string
  value: string
  helper: string
  icon: ComponentType<{ className?: string }>
  tone: "neutral" | "blue" | "amber" | "green"
}

function OrderMetricStrip({ metrics }: { metrics: OrderMetric[] }) {
  return (
    <div className="grid shrink-0 grid-cols-4 gap-px border-b border-[#ded4c8] bg-[#ded4c8]">
      {metrics.map((metric) => (
        <OrderMetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  )
}

function OrderMetricCard({ metric }: { metric: OrderMetric }) {
  const Icon = metric.icon
  const toneClass: Record<OrderMetric["tone"], string> = {
    neutral: "bg-[#f5f1eb] text-[#4f4032]",
    blue: "bg-[#edf4ff] text-[#2f68b1]",
    amber: "bg-[#fff4e3] text-[#af6418]",
    green: "bg-[#eef8f0] text-[#2e7a46]",
  }

  return (
    <article className="min-w-0 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneClass[metric.tone]}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-bold uppercase text-[#756656]">{metric.label}</p>
          <p className="mt-1 truncate text-xl font-black tracking-normal text-[#2f2419]">
            {metric.value}
          </p>
        </div>
      </div>
      <p className="mt-2 truncate text-xs font-bold text-[#756656]">{metric.helper}</p>
    </article>
  )
}

function mapBusinessOrderToCafeOrder(order: PosBusinessOrder): CafeOrder {
  const createdAt = new Date(order.createdAt)

  return {
    id: order.orderNo,
    backendId: order.id,
    orderNo: order.orderNo,
    orderDate: getDateInputValue(createdAt),
    date: new Intl.DateTimeFormat("vi-VN").format(createdAt),
    time: new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(createdAt),
    type: mapOrderType(order.orderType),
    tableOrCustomer: order.tableLabel || order.customerName || "ລູກຄ້າທົ່ວໄປ",
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    paymentStatus: mapPaymentStatus(order.paymentStatus),
    status: mapOrderStatus(order.status),
    subtotal: order.subtotal,
    discountAmount: order.discountAmount,
    discountLabel: order.discountLabel,
    taxAmount: order.taxAmount,
    loyaltyPointsRedeemed: order.loyaltyPointsRedeemed,
    loyaltyPointsEarned: order.loyaltyPointsEarned,
    loyaltyDiscountAmount: order.loyaltyDiscountAmount,
    total: order.total,
    employee: order.cashierName || getPosSession()?.userName || "ແຄດເຊຍ",
    note: order.note || "",
    items: order.items.map((item) => ({
      id: item.id,
      name: item.name,
      note: item.note || "",
      quantity: item.quantity,
      price: item.price,
      image: item.imageUrl || fallbackOrderImage,
    })),
    payments: order.payments.map((payment) => ({
      id: payment.id,
      method: payment.method,
      amountPaid: payment.amountPaid,
      changeAmount: payment.changeAmount,
      debtAmount: payment.debtAmount,
      paidAt: payment.paidAt,
    })),
  }
}

function getDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function mapOrderType(orderType: string): CafeOrderType {
  const normalized = orderType.toLowerCase()

  if (normalized.includes("mang") || normalized.includes("take")) return "takeaway"
  if (normalized.includes("giao") || normalized.includes("delivery")) return "delivery"

  return "dine-in"
}

function mapOrderStatus(status: PosOrderStatus): CafeOrderStatus {
  if (status === "cancelled") return "cancelled"
  if (status === "voided") return "voided"
  if (status === "refunded") return "refunded"
  if (status === "paid") return "completed"
  if (status === "draft" || status === "open" || status === "held") return "new"

  return "preparing"
}

function mapPaymentStatus(status: PosBusinessOrder["paymentStatus"]): CafeOrder["paymentStatus"] {
  if (status === "paid") return "paid"
  if (status === "voided") return "voided"
  if (status === "refunded") return "refunded"

  return "unpaid"
}

function getWorkflowAction(order: PosBusinessOrder): {
  action: "send-to-kitchen" | "cancel" | "void" | "refund"
  label: string
  confirmMessage?: string
} | null {
  if (order.status === "draft") {
    return {
      action: "send-to-kitchen",
      label: "ສົ່ງໄປ bar/ຄົວ",
    }
  }

  if (order.status === "open" || order.status === "held") {
    return {
      action: "cancel",
      label: "ຍົກເລີກອໍເດີ",
      confirmMessage: `ທ່ານແນ່ໃຈບໍວ່າຕ້ອງການຍົກເລີກ ${order.orderNo}?`,
    }
  }

  if (order.status === "paid" && order.paymentStatus === "paid") {
    return {
      action: "refund",
      label: "ຄືນເງິນ",
      confirmMessage: `ທ່ານແນ່ໃຈບໍວ່າຕ້ອງການຄືນເງິນ ${order.orderNo}?`,
    }
  }

  return null
}
