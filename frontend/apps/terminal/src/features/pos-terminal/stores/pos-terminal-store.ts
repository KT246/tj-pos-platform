import { create } from "zustand";

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
  notice: string | null;
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
  clearNotice: () => void;
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
  notice: null,
  setActiveCategory: (categoryId) => set({ activeCategory: categoryId }),
  setQuery: (query) => set({ query }),
  addProduct: (product) =>
    set((state) => ({
      cart: addProductToCart(state.cart, product),
      notice: `${product.name} added to cart.`
    })),
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
        return {
          scanOpen: false,
          notice: `No item found for ${barcode || "this barcode"}.`
        };
      }

      return {
        cart: addProductToCart(state.cart, product),
        scanOpen: false,
        notice: `${product.name} scanned and added.`
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
    set({
      cart: [],
      discount: null,
      activeOrderId: null,
      notice: "Cart cleared."
    }),
  startNewSale: () =>
    set({
      cart: [],
      activeOrderId: null,
      selectedTable: null,
      orderType: "Dine In",
      customer: null,
      discount: null,
      paymentMethod: "cash",
      receivedAmount: 0,
      notice: "New sale ready."
    }),
  holdOrder: () =>
    set((state) => {
      if (state.cart.length === 0) {
        return { notice: "Cart is empty. Add items before holding an order." };
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

      return {
        orders: [order, ...state.orders.filter((item) => item.id !== order.id)],
        cart: [],
        activeOrderId: null,
        selectedTable: null,
        orderType: "Dine In",
        customer: null,
        discount: null,
        notice: `${order.id} held for later checkout.`
      };
    }),
  resumeOrder: (orderId) =>
    set((state) => {
      const order = state.orders.find((item) => item.id === orderId);

      if (!order) {
        return { notice: "Order was not found." };
      }

      return {
        activeOrderId: order.id,
        cart: cloneCart(order.cart ?? []),
        selectedTable: order.type === "Dine In" ? order.table : null,
        orderType: order.type,
        customer: order.customerRecord ?? null,
        discount: order.discount ?? null,
        paymentMethod: order.paymentMethod ?? "cash",
        receivedAmount: order.receivedAmount ?? order.amount,
        notice: `${order.id} loaded into cart.`
      };
    }),
  setOrderSearch: (query) => set({ orderSearch: query }),
  setSelectedTable: (tableId) =>
    set({
      selectedTable: tableId,
      orderType: tableId ? "Dine In" : "Take Away",
      tableOpen: false,
      notice: tableId ? `${tableId} selected.` : "Take away selected."
    }),
  setOrderType: (orderType) =>
    set({
      orderType,
      selectedTable: orderType === "Take Away" ? null : get().selectedTable,
      notice:
        orderType === "Take Away"
          ? "Take away order selected."
          : "Dine in order selected."
    }),
  setCustomer: (customer) =>
    set({
      customer,
      customerOpen: false,
      notice: `${customer?.name ?? "Walk-in Customer"} selected.`
    }),
  applyDiscount: (discount) =>
    set((state) => {
      if (state.cart.length === 0) {
        return { notice: "Cart is empty. Add items before discount." };
      }

      return {
        discount,
        discountOpen: false,
        notice:
          discount.mode === "percent"
            ? `${discount.value}% discount applied.`
            : `${discount.value.toLocaleString("en-US")} LAK discount applied.`
      };
    }),
  clearDiscount: () => set({ discount: null, notice: "Discount removed." }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setReceivedAmount: (amount) => set({ receivedAmount: Math.max(amount, 0) }),
  confirmPayment: () =>
    set((state) => {
      if (state.cart.length === 0) {
        return { notice: "Cart is empty. Add items before payment." };
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
        refundSelectedLineIds: order.cart?.map((line) => line.id) ?? [],
        notice: `${order.id} payment completed.`
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
        return {
          refundOrderId: null,
          refundSelectedLineIds: [],
          notice: "No completed receipt found."
        };
      }

      return {
        refundOrderId: order.id,
        refundSelectedLineIds: order.cart?.map((line) => line.id) ?? [],
        notice: `${order.id} ready for refund review.`
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
        return { notice: "Select at least one paid item to refund." };
      }

      return {
        refundSelectedLineIds: [],
        notice: `${state.refundOrderId} refund request created.`
      };
    }),
  setScanOpen: (open) => set({ scanOpen: open }),
  setDiscountOpen: (open) => set({ discountOpen: open }),
  setCustomerOpen: (open) => set({ customerOpen: open }),
  setTableOpen: (open) => set({ tableOpen: open }),
  showNotice: (message) => set({ notice: message }),
  clearNotice: () => set({ notice: null })
}));
