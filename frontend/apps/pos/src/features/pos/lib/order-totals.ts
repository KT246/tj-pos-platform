import type { CartLine, OrderDiscount } from "@/features/pos/stores/pos-store"

export type OrderTotals = {
  subtotal: number
  discountAmount: number
  total: number
}

export function calculateOrderTotals(
  cart: CartLine[],
  discount: OrderDiscount | null,
): OrderTotals {
  const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0)
  const rawDiscount = discount
    ? discount.mode === "percent"
      ? Math.round((subtotal * discount.value) / 100)
      : discount.value
    : 0
  const cappedDiscount =
    discount?.maxAmount && discount.maxAmount > 0
      ? Math.min(rawDiscount, discount.maxAmount)
      : rawDiscount
  const discountAmount = Math.min(subtotal, Math.max(0, cappedDiscount))

  return {
    subtotal,
    discountAmount,
    total: Math.max(0, subtotal - discountAmount),
  }
}
