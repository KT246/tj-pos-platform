import { create } from "zustand";

import {
  activeStaffOrders,
  selectedBranch,
  staffName,
  starterStaffCart
} from "../data/staff-order-data";
import type {
  StaffOrderLine,
  StaffOrderProduct,
  StaffOrderRecord
} from "../types";
import { getStaffCartSummary } from "../utils";

type StaffOrderState = {
  selectedBranch: string;
  staffName: string;
  selectedTableId: string;
  guests: number;
  activeCategory: string;
  query: string;
  cart: StaffOrderLine[];
  activeOrders: StaffOrderRecord[];
  lastSentOrder: StaffOrderRecord | null;
  notice: string | null;
};

type StaffOrderActions = {
  setSelectedBranch: (branch: string) => void;
  setSelectedTable: (tableId: string) => void;
  incrementGuests: () => void;
  decrementGuests: () => void;
  setActiveCategory: (categoryId: string) => void;
  setQuery: (query: string) => void;
  addProduct: (product: StaffOrderProduct) => void;
  addCustomizedProduct: (
    product: StaffOrderProduct,
    options: Partial<Pick<StaffOrderLine, "size" | "milk" | "sugar" | "ice" | "note">>
  ) => void;
  updateLine: (
    lineId: string,
    patch: Partial<Pick<StaffOrderLine, "size" | "milk" | "sugar" | "ice" | "note">>
  ) => void;
  incrementLine: (lineId: string) => void;
  decrementLine: (lineId: string) => void;
  saveDraft: () => void;
  sendOrder: () => void;
  startNewOrder: () => void;
  markServed: (orderId: string) => void;
  showNotice: (message: string) => void;
  clearNotice: () => void;
};

function cloneLines(lines: StaffOrderLine[]) {
  return lines.map((line) => ({ ...line }));
}

function createLine(product: StaffOrderProduct): StaffOrderLine {
  return {
    id: `staff-line-${product.id}-${Date.now()}`,
    productId: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    quantity: 1,
    image: product.image,
    size: "Regular Size",
    milk: product.category === "coffee" ? "Full Cream Milk" : "-",
    sugar: product.category === "coffee" || product.category === "tea" ? "Normal" : "-",
    ice: product.category === "coffee" || product.category === "tea" ? "Regular Ice" : "-"
  };
}

function createOrderId(orders: StaffOrderRecord[]) {
  const nextNumber =
    Math.max(
      0,
      ...orders.map((order) => Number(order.id.replace(/\D/g, ""))).filter(Boolean)
    ) + 1;

  return `#SO-${String(nextNumber).padStart(4, "0")}`;
}

export const useStaffOrderStore = create<StaffOrderState & StaffOrderActions>(
  (set) => ({
    selectedBranch,
    staffName,
    selectedTableId: "T03",
    guests: 3,
    activeCategory: "all",
    query: "",
    cart: starterStaffCart,
    activeOrders: activeStaffOrders,
    lastSentOrder: null,
    notice: null,
    setSelectedBranch: (branch) => set({ selectedBranch: branch }),
    setSelectedTable: (tableId) => set({ selectedTableId: tableId }),
    incrementGuests: () =>
      set((state) => ({ guests: Math.min(state.guests + 1, 12) })),
    decrementGuests: () =>
      set((state) => ({ guests: Math.max(state.guests - 1, 1) })),
    setActiveCategory: (categoryId) => set({ activeCategory: categoryId }),
    setQuery: (query) => set({ query }),
    addProduct: (product) =>
      set((state) => {
        const existing = state.cart.find((line) => line.productId === product.id);

        if (existing) {
          return {
            cart: state.cart.map((line) =>
              line.id === existing.id
                ? { ...line, quantity: line.quantity + 1 }
                : line
            ),
            notice: `${product.name} added.`
          };
        }

        return {
          cart: [...state.cart, createLine(product)],
          notice: `${product.name} added.`
        };
      }),
    addCustomizedProduct: (product, options) =>
      set((state) => ({
        cart: [...state.cart, { ...createLine(product), ...options }],
        notice: `${product.name} customized and added.`
      })),
    updateLine: (lineId, patch) =>
      set((state) => ({
        cart: state.cart.map((line) =>
          line.id === lineId ? { ...line, ...patch } : line
        ),
        notice: "Item options updated."
      })),
    incrementLine: (lineId) =>
      set((state) => ({
        cart: state.cart.map((line) =>
          line.id === lineId ? { ...line, quantity: line.quantity + 1 } : line
        )
      })),
    decrementLine: (lineId) =>
      set((state) => ({
        cart: state.cart
          .map((line) =>
            line.id === lineId
              ? { ...line, quantity: Math.max(line.quantity - 1, 0) }
              : line
          )
          .filter((line) => line.quantity > 0)
      })),
    saveDraft: () => set({ notice: "Order draft saved." }),
    sendOrder: () =>
      set((state) => {
        const summary = getStaffCartSummary(state.cart);
        const order: StaffOrderRecord = {
          id: createOrderId(state.activeOrders),
          tableId: state.selectedTableId,
          guests: state.guests,
          status: "Sent",
          items: summary.itemCount,
          total: summary.total,
          elapsed: "Just now",
          type: "Dine In",
          lines: cloneLines(state.cart)
        };

        return {
          activeOrders: [order, ...state.activeOrders],
          lastSentOrder: order,
          notice: `${order.id} sent to kitchen and bar.`
        };
      }),
    startNewOrder: () =>
      set({
        selectedTableId: "T03",
        guests: 3,
        cart: [],
        activeCategory: "all",
        query: "",
        notice: "New staff order ready."
      }),
    markServed: (orderId) =>
      set((state) => ({
        activeOrders: state.activeOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Waiting Bill" } : order
        ),
        notice: `${orderId} marked as served.`
      })),
    showNotice: (message) => set({ notice: message }),
    clearNotice: () => set({ notice: null })
  })
);
