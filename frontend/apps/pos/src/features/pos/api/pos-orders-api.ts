import { apiGet, apiPatch, apiPost } from "@/lib/http"

export type PosOrderStatus =
  | "draft"
  | "open"
  | "held"
  | "paid"
  | "partially_paid"
  | "debt"
  | "cancelled"
  | "voided"
  | "refunded"

export type PosPaymentStatus =
  | "unpaid"
  | "paid"
  | "partially_paid"
  | "debt"
  | "voided"
  | "refunded"
export type PosPaymentMethod = "cash" | "bank-transfer" | "qr-code"

export type CreatePosOrderItemBody = {
  itemId?: string | null
  name: string
  price: number
  quantity: number
  note?: string | null
}

export type CreatePosOrderBody = {
  clientRequestId?: string | null
  posType?: string
  orderType?: string
  status?: PosOrderStatus
  paymentStatus?: PosPaymentStatus
  tableLabel?: string | null
  customerId?: string | null
  customerName?: string | null
  cashierName?: string | null
  note?: string | null
  discountAmount?: number
  discountLabel?: string | null
  loyaltyPointsRedeemed?: number
  loyaltyDiscountAmount?: number
  taxAmount?: number
  items: CreatePosOrderItemBody[]
}

export type PosBusinessOrderItem = {
  id: string
  itemId: string | null
  name: string
  imageUrl: string | null
  price: number
  quantity: number
  lineTotal: number
  note: string | null
}

export type PosBusinessPayment = {
  id: string
  method: PosPaymentMethod
  status: PosPaymentStatus
  amountPaid: number
  changeAmount: number
  debtAmount: number
  paidAt: string
}

export type PosBusinessOrder = {
  id: string
  orderNo: string
  posType: string
  orderType: string
  status: PosOrderStatus
  paymentStatus: PosPaymentStatus
  subtotal: number
  discountAmount: number
  discountLabel: string | null
  taxAmount: number
  total: number
  tableLabel: string | null
  customerId: string | null
  customerName: string | null
  cashierName: string | null
  loyaltyPointsRedeemed: number
  loyaltyPointsEarned: number
  loyaltyDiscountAmount: number
  note: string | null
  clientRequestId: string | null
  createdAt: string
  updatedAt: string
  items: PosBusinessOrderItem[]
  payments: PosBusinessPayment[]
}

export type PosOrdersResponse = {
  orders: PosBusinessOrder[]
}

export type CreatePosOrderPaymentBody = {
  method?: PosPaymentMethod
  paymentStatus?: PosPaymentStatus
  amountPaid?: number
  cashierName?: string | null
  payments?: Array<{
    method: PosPaymentMethod
    amountPaid: number
  }>
}

export type PosOrderReceipt = {
  businessName: string
  businessSlug: string
  order: PosBusinessOrder
}

export function createPosOrder(body: CreatePosOrderBody) {
  return apiPost<PosBusinessOrder, CreatePosOrderBody>(
    `/pos/${getBusinessSlug()}/orders`,
    body,
  )
}

export function payPosOrder(orderId: string, body: CreatePosOrderPaymentBody) {
  return apiPost<PosBusinessOrder, CreatePosOrderPaymentBody>(
    `/pos/${getBusinessSlug()}/orders/${orderId}/payments`,
    body,
  )
}

export function updatePosOrderDraft(orderId: string, body: CreatePosOrderBody) {
  return apiPatch<PosBusinessOrder, CreatePosOrderBody>(
    `/pos/${getBusinessSlug()}/orders/${orderId}/draft`,
    body,
  )
}

export function listPosOrders(status?: PosOrderStatus) {
  const query = status ? `?status=${encodeURIComponent(status)}` : ""

  return apiGet<PosOrdersResponse>(`/pos/${getBusinessSlug()}/orders${query}`)
}

export function getPosOrder(orderId: string) {
  return apiGet<PosBusinessOrder>(`/pos/${getBusinessSlug()}/orders/${orderId}`)
}

export function getPosOrderReceipt(orderId: string) {
  return apiGet<PosOrderReceipt>(`/pos/${getBusinessSlug()}/orders/${orderId}/receipt`)
}

export function updatePosOrderStatus(orderId: string, status: PosOrderStatus) {
  return apiPatch<PosBusinessOrder, { status: PosOrderStatus }>(
    `/pos/${getBusinessSlug()}/orders/${orderId}/status`,
    { status },
  )
}

export function sendPosOrderToKitchen(orderId: string) {
  return apiPost<PosBusinessOrder, Record<string, never>>(
    `/pos/${getBusinessSlug()}/orders/${orderId}/send-to-kitchen`,
    {},
  )
}

export function cancelPosOrder(orderId: string) {
  return apiPost<PosBusinessOrder, Record<string, never>>(
    `/pos/${getBusinessSlug()}/orders/${orderId}/cancel`,
    {},
  )
}

export function voidPosOrder(orderId: string) {
  return apiPost<PosBusinessOrder, Record<string, never>>(
    `/pos/${getBusinessSlug()}/orders/${orderId}/void`,
    {},
  )
}

export function refundPosOrder(orderId: string) {
  return apiPost<PosBusinessOrder, Record<string, never>>(
    `/pos/${getBusinessSlug()}/orders/${orderId}/refund`,
    {},
  )
}

function getBusinessSlug() {
  return (
    window.localStorage.getItem("tj_pos_business_slug") ||
    import.meta.env.VITE_POS_BUSINESS_SLUG ||
    "tj-cafe-vientiane"
  )
}
