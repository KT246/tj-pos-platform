import { create } from "zustand";

import { showTerminalNotice } from "../../../lib/terminal-toasts";
import { initialCart, openOrders, products } from "../data/mock-pos-data";
import type {
  CartLine,
  Customer,
  Discount,
  OpenOrder,
  OrderType,
  PaymentMethodId,
  Product
} from "../types";
import { getCartSummary, nowReceiptTime, nowTimeLabel } from "../utils";

const samplePaidSummary = getCartSummary(initialCart);
const samplePaidOrder: OpenOrder = {
  id: "#ORD-0050",
  table: "T01",
  type: "Dine In",
  customer: "Souksavanh Phommachanh",
  items: samplePaidSummary.itemCount,
  amount: samplePaidSummary.total,
  time: "09:58 AM",
  status: "Completed",
  cart: initialCart,
  paymentMethod: "cash",
  receivedAmount: 100000,
  createdAt: "Mar 18, 2025, 09:58 AM"
};

type PosTerminalState = {
  activeCategory: string;
  query: string;
  cart: CartLine[];
  activeOrderId: string | null;
  selectedTable: string | null;
  orderType: OrderType;
  customer: Customer | null;
  discount: Discount | null;
  orders: OpenOrder[];
  orderSearch: string;
  lastPaidOrder: OpenOrder | null;
  paymentMethod: PaymentMethodId;
  receivedAmount: number;
  refundSearch: string;
  refundOrderId: string | null;
  refundSelectedLineIds: string[];
  scanOpen: boolean;
  discountOpen: boolean;
  customerOpen: boolean;
  tableOpen: boolean;
};

type PosTerminalActions = {
  setActiveCategory: (categoryId: string) => void;
  setQuery: (query: string) => void;
  addProduct: (product: Product) => void;
  scanBarcode: (barcode: string) => void;
  incrementLine: (lineId: string) => void;
  decrementLine: (lineId: string) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  startNewSale: () => void;
  holdOrder: () => void;
  resumeOrder: (orderId: string) => void;
  setOrderSearch: (query: string) => void;
  setSelectedTable: (tableId: string | null) => void;
  setOrderType: (orderType: OrderType) => void;
  setCustomer: (customer: Customer | null) => void;
  applyDiscount: (discount: Discount) => void;
  clearDiscount: () => void;
  setPaymentMethod: (method: PaymentMethodId) => void;
  setReceivedAmount: (amount: number) => void;
  confirmPayment: () => void;
  setRefundSearch: (query: string) => void;
  selectRefundOrder: () => void;
  toggleRefundLine: (lineId: string) => void;
  confirmRefund: () => void;
  setScanOpen: (open: boolean) => void;
  setDiscountOpen: (open: boolean) => void;
  setCustomerOpen: (open: boolean) => void;
  setTableOpen: (open: boolean) => void;
  showNotice: (message: string) => void;
};

function cloneCart(cart: CartLine[]) {
  return cart.map((line) => ({ ...line }));
}

function createOrderId(orders: OpenOrder[]) {
  const nextNumber =
    Math.max(
      0,
      ...orders.map((order) => Number(order.id.replace(/\D/g, ""))).filter(Boolean)
    ) + 1;

  return `#ORD-${String(nextNumber).padStart(4, "0")}`;
}

function createOrderSnapshot({
  id,
  cart,
  selectedTable,
  orderType,
  customer,
  discount,
  status,
  paymentMethod,
  receivedAmount
}: {
  id: string;
  cart: CartLine[];
  selectedTable: string | null;
  orderType: OrderType;
  customer: Customer | null;
  discount: Discount | null;
  status: OpenOrder["status"];
  paymentMethod?: PaymentMethodId;
  receivedAmount?: number;
}): OpenOrder {
  const summary = getCartSummary(cart, discount);

  return {
    id,
    table: orderType === "Take Away" ? "Take Away" : selectedTable ?? "No Table",
    type: orderType,
    customer: customer?.name ?? "Walk-in Customer",
    items: summary.itemCount,
    amount: summary.total,
    time: nowTimeLabel(),
    status,
    cart: cloneCart(cart),
    customerRecord: customer,
    discount,
    paymentMethod,
    receivedAmount,
    createdAt: nowReceiptTime()
  };
}

function addProductToCart(cart: CartLine[], product: Product) {
  const existing = cart.find((line) => line.productId === product.id);

  if (existing) {
    return cart.map((line) =>
      line.id === existing.id ? { ...line, quantity: line.quantity + 1 } : line
    );
  }

  return [
    ...cart,
    {
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    }
  ];
}

// In-memory POS UI/order draft state only. Do not persist until the offline
// order/shift rules are explicitly defined.
export const usePosTerminalStore = create<
  PosTerminalState & PosTerminalActions
>((set, get) => ({
  activeCategory: "all",
  query: "",
  cart: initialCart,
  activeOrderId: null,
  selectedTable: "T03",
  orderType: "Dine In",
  customer: null,
  discount: null,
  orders: [...openOrders, samplePaidOrder],
  orderSearch: "",
  lastPaidOrder: samplePaidOrder,
  paymentMethod: "cash",
  receivedAmount: 100000,
  refundSearch: "#ORD-0050",
  refundOrderId: samplePaidOrder.id,
  refundSelectedLineIds: samplePaidOrder.cart?.map((line) => line.id) ?? [],
  scanOpen: false,
  discountOpen: false,
  customerOpen: false,
  tableOpen: false,
  setActiveCategory: (categoryId) => set({ activeCategory: categoryId }),
  setQuery: (query) => set({ query }),
  addProduct: (product) =>
    set((state) => {
      showTerminalNotice(`${product.name} added to cart.`, "success");

      return {
        cart: addProductToCart(state.cart, product)
      };
    }),
  scanBarcode: (barcode) =>
    set((state) => {
      const normalized = barcode.trim().toLowerCase();
      const product = products.find(
        (item) =>
          item.sku.toLowerCase() === normalized ||
          item.id.toLowerCase() === normalized ||
          item.name.toLowerCase() === normalized
      );

      if (!product) {
        showTerminalNotice(
          `No item found for ${barcode || "this barcode"}.`,
          "error"
        );

        return {
          scanOpen: false
        };
      }

      showTerminalNotice(`${product.name} scanned and added.`, "success");

      return {
        cart: addProductToCart(state.cart, product),
        scanOpen: false
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
            ? { ...line, quantity: Math.max(0, line.quantity - 1) }
            : line
        )
        .filter((line) => line.quantity > 0)
    })),
  removeLine: (lineId) =>
    set((state) => ({
      cart: state.cart.filter((line) => line.id !== lineId)
    })),
  clearCart: () =>
    set(() => {
      showTerminalNotice("Cart cleared.", "info");

      return {
        cart: [],
        discount: null,
        activeOrderId: null
      };
    }),
  startNewSale: () =>
    set(() => {
      showTerminalNotice("New sale ready.", "info");

      return {
        cart: [],
        activeOrderId: null,
        selectedTable: null,
        orderType: "Dine In",
        customer: null,
        discount: null,
        paymentMethod: "cash",
        receivedAmount: 0
      };
    }),
  holdOrder: () =>
    set((state) => {
      if (state.cart.length === 0) {
        showTerminalNotice(
          "Cart is empty. Add items before holding an order.",
          "warning"
        );
        return {};
      }

      const order = createOrderSnapshot({
        id: state.activeOrderId ?? createOrderId(state.orders),
        cart: state.cart,
        selectedTable: state.selectedTable,
        orderType: state.orderType,
        customer: state.customer,
        discount: state.discount,
        status: "Held"
      });

      showTerminalNotice(`${order.id} held for later checkout.`, "success");

      return {
        orders: [order, ...state.orders.filter((item) => item.id !== order.id)],
        cart: [],
        activeOrderId: null,
        selectedTable: null,
        orderType: "Dine In",
        customer: null,
        discount: null
      };
    }),
  resumeOrder: (orderId) =>
    set((state) => {
      const order = state.orders.find((item) => item.id === orderId);

      if (!order) {
        showTerminalNotice("Order was not found.", "error");
        return {};
      }

      showTerminalNotice(`${order.id} loaded into cart.`, "info");

      return {
        activeOrderId: order.id,
        cart: cloneCart(order.cart ?? []),
        selectedTable: order.type === "Dine In" ? order.table : null,
        orderType: order.type,
        customer: order.customerRecord ?? null,
        discount: order.discount ?? null,
        paymentMethod: order.paymentMethod ?? "cash",
        receivedAmount: order.receivedAmount ?? order.amount
      };
    }),
  setOrderSearch: (query) => set({ orderSearch: query }),
  setSelectedTable: (tableId) =>
    set(() => {
      showTerminalNotice(
        tableId ? `${tableId} selected.` : "Take away selected.",
        "info"
      );

      return {
        selectedTable: tableId,
        orderType: tableId ? "Dine In" : "Take Away",
        tableOpen: false
      };
    }),
  setOrderType: (orderType) =>
    set(() => {
      showTerminalNotice(
        orderType === "Take Away"
          ? "Take away order selected."
          : "Dine in order selected.",
        "info"
      );

      return {
        orderType,
        selectedTable: orderType === "Take Away" ? null : get().selectedTable
      };
    }),
  setCustomer: (customer) =>
    set(() => {
      showTerminalNotice(
        `${customer?.name ?? "Walk-in Customer"} selected.`,
        "info"
      );

      return {
        customer,
        customerOpen: false
      };
    }),
  applyDiscount: (discount) =>
    set((state) => {
      if (state.cart.length === 0) {
        showTerminalNotice("Cart is empty. Add items before discount.", "warning");
        return {};
      }

      showTerminalNotice(
        discount.mode === "percent"
          ? `${discount.value}% discount applied.`
          : `${discount.value.toLocaleString("en-US")} LAK discount applied.`,
        "success"
      );

      return {
        discount,
        discountOpen: false
      };
    }),
  clearDiscount: () =>
    set(() => {
      showTerminalNotice("Discount removed.", "info");
      return { discount: null };
    }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setReceivedAmount: (amount) => set({ receivedAmount: Math.max(amount, 0) }),
  confirmPayment: () =>
    set((state) => {
      if (state.cart.length === 0) {
        showTerminalNotice("Cart is empty. Add items before payment.", "warning");
        return {};
      }

      const summary = getCartSummary(state.cart, state.discount);
      const order = createOrderSnapshot({
        id: state.activeOrderId ?? createOrderId(state.orders),
        cart: state.cart,
        selectedTable: state.selectedTable,
        orderType: state.orderType,
        customer: state.customer,
        discount: state.discount,
        status: "Completed",
        paymentMethod: state.paymentMethod,
        receivedAmount:
          state.paymentMethod === "cash"
            ? Math.max(state.receivedAmount, summary.total)
            : summary.total
      });

      showTerminalNotice(`${order.id} payment completed.`, "success");

      return {
        orders: [order, ...state.orders.filter((item) => item.id !== order.id)],
        lastPaidOrder: order,
        cart: [],
        activeOrderId: null,
        selectedTable: null,
        orderType: "Dine In",
        customer: null,
        discount: null,
        receivedAmount: 0,
        refundSearch: order.id,
        refundOrderId: order.id,
        refundSelectedLineIds: order.cart?.map((line) => line.id) ?? []
      };
    }),
  setRefundSearch: (query) => set({ refundSearch: query }),
  selectRefundOrder: () =>
    set((state) => {
      const query = state.refundSearch.trim().toLowerCase();
      const order = state.orders.find(
        (item) =>
          item.status === "Completed" &&
          (item.id.toLowerCase().includes(query) ||
            item.customer.toLowerCase().includes(query))
      );

      if (!order) {
        showTerminalNotice("No completed receipt found.", "error");
        return {
          refundOrderId: null,
          refundSelectedLineIds: []
        };
      }

      showTerminalNotice(`${order.id} ready for refund review.`, "info");

      return {
        refundOrderId: order.id,
        refundSelectedLineIds: order.cart?.map((line) => line.id) ?? []
      };
    }),
  toggleRefundLine: (lineId) =>
    set((state) => ({
      refundSelectedLineIds: state.refundSelectedLineIds.includes(lineId)
        ? state.refundSelectedLineIds.filter((id) => id !== lineId)
        : [...state.refundSelectedLineIds, lineId]
    })),
  confirmRefund: () =>
    set((state) => {
      if (!state.refundOrderId || state.refundSelectedLineIds.length === 0) {
        showTerminalNotice("Select at least one paid item to refund.", "warning");
        return {};
      }

      showTerminalNotice(`${state.refundOrderId} refund request created.`, "success");

      return {
        refundSelectedLineIds: []
      };
    }),
  setScanOpen: (open) => set({ scanOpen: open }),
  setDiscountOpen: (open) => set({ discountOpen: open }),
  setCustomerOpen: (open) => set({ customerOpen: open }),
  setTableOpen: (open) => set({ tableOpen: open }),
  showNotice: (message) => showTerminalNotice(message)
}));
