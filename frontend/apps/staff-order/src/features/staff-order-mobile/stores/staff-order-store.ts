import { create } from "zustand";

import { showStaffOrderNotice } from "../../../lib/staff-order-toasts";
import {
  activeStaffOrders,
  selectedBranch,
  staffName,
  starterStaffCart
} from "../data/staff-order-data";
import type { StaffOrderLine, StaffOrderProduct, StaffOrderRecord } from "../types";
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
    size: "ຂະໜາດປົກກະຕິ",
    milk: product.category === "ກາເຟ" ? "ນົມ Full Cream" : "-",
    sugar: product.category === "ກາເຟ" || product.category === "ຊາ" ? "ປົກກະຕິ" : "-",
    ice:
      product.category === "ກາເຟ" || product.category === "ຊາ" ? "ນ້ຳກ້ອນປົກກະຕິ" : "-"
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
    setSelectedBranch: (branch) => set({ selectedBranch: branch }),
    setSelectedTable: (tableId) => set({ selectedTableId: tableId }),
    incrementGuests: () => set((state) => ({ guests: Math.min(state.guests + 1, 12) })),
    decrementGuests: () => set((state) => ({ guests: Math.max(state.guests - 1, 1) })),
    setActiveCategory: (categoryId) => set({ activeCategory: categoryId }),
    setQuery: (query) => set({ query }),
    addProduct: (product) =>
      set((state) => {
        const existing = state.cart.find((line) => line.productId === product.id);

        if (existing) {
          showStaffOrderNotice(`${product.name} ຖືກເພີ່ມແລ້ວ.`, "success");

          return {
            cart: state.cart.map((line) =>
              line.id === existing.id ? { ...line, quantity: line.quantity + 1 } : line
            )
          };
        }

        showStaffOrderNotice(`${product.name} ຖືກເພີ່ມແລ້ວ.`, "success");

        return {
          cart: [...state.cart, createLine(product)]
        };
      }),
    addCustomizedProduct: (product, options) =>
      set((state) => {
        showStaffOrderNotice(`${product.name} ຖືກປັບແຕ່ງ ແລະ ເພີ່ມແລ້ວ.`, "success");

        return {
          cart: [...state.cart, { ...createLine(product), ...options }]
        };
      }),
    updateLine: (lineId, patch) =>
      set((state) => {
        showStaffOrderNotice("ອັບເດດຕົວເລືອກລາຍການແລ້ວ.", "success");

        return {
          cart: state.cart.map((line) =>
            line.id === lineId ? { ...line, ...patch } : line
          )
        };
      }),
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
    saveDraft: () => {
      showStaffOrderNotice("ບັນທຶກຮ່າງອໍເດີແລ້ວ.", "success");
    },
    sendOrder: () =>
      set((state) => {
        const summary = getStaffCartSummary(state.cart);
        const order: StaffOrderRecord = {
          id: createOrderId(state.activeOrders),
          tableId: state.selectedTableId,
          guests: state.guests,
          status: "ສົ່ງແລ້ວ",
          items: summary.itemCount,
          total: summary.total,
          elapsed: "Just now",
          type: "ນັ່ງກິນທີ່ຮ້ານ",
          lines: cloneLines(state.cart)
        };

        showStaffOrderNotice(`${order.id} ຖືກສົ່ງໄປຄົວ ແລະ ບາແລ້ວ.`, "success");

        return {
          activeOrders: [order, ...state.activeOrders],
          lastSentOrder: order
        };
      }),
    startNewOrder: () =>
      set(() => {
        showStaffOrderNotice("ພ້ອມເລີ່ມອໍເດີພະນັກງານໃໝ່.", "info");

        return {
          selectedTableId: "T03",
          guests: 3,
          cart: [],
          activeCategory: "all",
          query: ""
        };
      }),
    markServed: (orderId) =>
      set((state) => {
        showStaffOrderNotice(`${orderId} ຖືກໝາຍວ່າເສີບແລ້ວ.`, "success");

        return {
          activeOrders: state.activeOrders.map((order) =>
            order.id === orderId ? { ...order, status: "ລໍຖ້າອອກບິນ" } : order
          )
        };
      }),
    showNotice: (message) => showStaffOrderNotice(message)
  })
);
