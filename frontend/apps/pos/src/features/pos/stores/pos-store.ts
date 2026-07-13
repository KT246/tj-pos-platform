import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { PosProduct } from "@/features/pos/types"

export type CartLineOptions = {
  groups: Array<{
    groupId: string
    groupName: string
    multiple: boolean
    priceMode: "override" | "addon"
    choices: Array<{
      id: string
      name: string
      price: number
    }>
  }>
  itemNote: string
}

export type CartLine = {
  id: string
  productId: string
  name: string
  basePrice?: number
  price: number
  image: string
  note: string
  quantity: number
  options?: CartLineOptions
}

export type OrderDiscount = {
  id: string
  source: "promotion" | "manual"
  label: string
  mode: "amount" | "percent"
  value: number
  maxAmount?: number
  reason?: string
}

type ConfiguredProductInput = {
  product: PosProduct
  quantity: number
  unitPrice: number
  note: string
  options?: CartLineOptions
}

type CartLineUpdate = {
  quantity: number
  unitPrice: number
  note: string
  options?: CartLineOptions
}

type PosState = {
  activeCategoryId: string
  search: string
  orderNote: string
  tableLabel: string
  customerMode: "retail" | "member"
  cart: CartLine[]
  orderDiscount: OrderDiscount | null
  activeOrderId: string | null
  activeOrderNo: string | null
  setActiveCategoryId: (categoryId: string) => void
  setSearch: (search: string) => void
  setOrderNote: (note: string) => void
  setTableLabel: (tableLabel: string) => void
  setCustomerMode: (mode: "retail" | "member") => void
  setOrderDiscount: (discount: OrderDiscount) => void
  clearOrderDiscount: () => void
  addProduct: (product: PosProduct) => void
  addConfiguredProduct: (input: ConfiguredProductInput) => void
  updateLine: (lineId: string, update: CartLineUpdate) => void
  loadCartFromOrder: (
    cart: CartLine[],
    order?: {
      id: string
      orderNo: string
      note?: string | null
      discountAmount?: number
      discountLabel?: string | null
    },
  ) => void
  incrementLine: (lineId: string) => void
  decrementLine: (lineId: string) => void
  removeLine: (lineId: string) => void
  clearCart: () => void
}

export const POS_CART_STORAGE_KEY = "tj_pos_cart"
export const UNSELECTED_TABLE_LABEL = "ໂຕະ"

export const usePosStore = create<PosState>()(
  persist(
    (set) => ({
  activeCategoryId: "all",
  search: "",
  orderNote: "",
  tableLabel: UNSELECTED_TABLE_LABEL,
  customerMode: "retail",
  cart: [],
  orderDiscount: null,
  activeOrderId: null,
  activeOrderNo: null,
  setActiveCategoryId: (categoryId) => set({ activeCategoryId: categoryId }),
  setSearch: (search) => set({ search }),
  setOrderNote: (orderNote) => set({ orderNote }),
  setTableLabel: (tableLabel) => set({ tableLabel }),
  setCustomerMode: (customerMode) => set({ customerMode }),
  setOrderDiscount: (orderDiscount) => set({ orderDiscount }),
  clearOrderDiscount: () => set({ orderDiscount: null }),
  addProduct: (product) =>
    set((state) => {
      const existing = state.cart.find(
        (line) => line.productId === product.id && !line.options,
      )

      if (existing) {
        return {
          cart: state.cart.map((line) =>
            line.id === existing.id ? { ...line, quantity: line.quantity + 1 } : line,
          ),
        }
      }

      return {
        cart: [
          ...state.cart,
          {
            id: `cart-${product.id}`,
            productId: product.id,
            name: product.name,
            basePrice: product.price,
            price: product.price,
            image: product.image,
            note: product.subtitle ?? "ປົກກະຕິ",
            quantity: 1,
          },
        ],
      }
    }),
  addConfiguredProduct: ({ product, quantity, unitPrice, note, options }) =>
    set((state) => {
      const normalizedQuantity = Math.max(1, Math.round(quantity || 1))
      const existing = state.cart.find((line) =>
        line.productId === product.id &&
        line.price === unitPrice &&
        line.note === note &&
        areCartLineOptionsEqual(line.options, options)
      )

      if (existing) {
        return {
          cart: state.cart.map((line) =>
            line.id === existing.id
              ? { ...line, quantity: line.quantity + normalizedQuantity }
              : line,
          ),
        }
      }

      return {
        cart: [
          ...state.cart,
          {
            id: `cart-${product.id}-${Date.now()}`,
            productId: product.id,
            name: product.name,
            basePrice: product.price,
            price: unitPrice,
            image: product.image,
            note,
            quantity: normalizedQuantity,
            options,
          },
        ],
      }
    }),
  updateLine: (lineId, update) =>
    set((state) => ({
      cart: state.cart.map((line) =>
        line.id === lineId
          ? {
              ...line,
              price: update.unitPrice,
              note: update.note,
              quantity: update.quantity,
              options: update.options,
            }
          : line,
      ),
    })),
  loadCartFromOrder: (cart, order) =>
    set({
      cart,
      orderNote: order?.note ?? "",
      orderDiscount:
        order?.discountAmount && order.discountAmount > 0
          ? {
              id: `order-${order.id}-discount`,
              source: "manual",
              label: order.discountLabel || "ສ່ວນຫຼຸດທີ່ບັນທຶກໄວ້",
              mode: "amount",
              value: order.discountAmount,
              reason: order.discountLabel || undefined,
            }
          : null,
      activeOrderId: order?.id ?? null,
      activeOrderNo: order?.orderNo ?? null,
    }),
  incrementLine: (lineId) =>
    set((state) => ({
      cart: state.cart.map((line) =>
        line.id === lineId ? { ...line, quantity: line.quantity + 1 } : line,
      ),
    })),
  decrementLine: (lineId) =>
    set((state) => ({
      cart: state.cart
        .map((line) =>
          line.id === lineId
            ? { ...line, quantity: Math.max(0, line.quantity - 1) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    })),
  removeLine: (lineId) =>
    set((state) => ({
      cart: state.cart.filter((line) => line.id !== lineId),
    })),
  clearCart: () =>
    set({
      cart: [],
      orderNote: "",
      tableLabel: UNSELECTED_TABLE_LABEL,
      orderDiscount: null,
      activeOrderId: null,
      activeOrderNo: null,
    }),
    }),
    {
      name: POS_CART_STORAGE_KEY,
      storage: createJSONStorage(() => window.localStorage),
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as Partial<PosState>
        const hasOpenOrder = Boolean(state.activeOrderId || state.cart?.length)

        if (!hasOpenOrder && (!state.tableLabel || state.tableLabel === "ໂຕະ 03")) {
          return {
            ...state,
            tableLabel: UNSELECTED_TABLE_LABEL,
          }
        }

        return state
      },
      partialize: (state) => ({
        cart: state.cart,
        orderNote: state.orderNote,
        tableLabel: state.tableLabel,
        customerMode: state.customerMode,
        orderDiscount: state.orderDiscount,
        activeOrderId: state.activeOrderId,
        activeOrderNo: state.activeOrderNo,
      }),
    },
  ),
)

function areCartLineOptionsEqual(
  left: CartLineOptions | undefined,
  right: CartLineOptions | undefined,
) {
  return stableStringifyCartOptions(left) === stableStringifyCartOptions(right)
}

function stableStringifyCartOptions(options: CartLineOptions | undefined) {
  if (!options) return ""

  return JSON.stringify({
    itemNote: options.itemNote,
    groups: options.groups.map((group) => ({
      groupId: group.groupId,
      groupName: group.groupName,
      multiple: group.multiple,
      priceMode: group.priceMode,
      choices: group.choices.map((choice) => ({
        id: choice.id,
        name: choice.name,
        price: choice.price,
      })),
    })),
  })
}
