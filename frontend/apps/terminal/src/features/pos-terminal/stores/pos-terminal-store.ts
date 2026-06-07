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
  PaymentStatus,
  Product
} from "../types";
import { getCartSummary, nowReceiptTime, nowTimeLabel } from "../utils";
import { lo } from "../utils/lao-labels";

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
  paymentStatus: "paid",
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
  paymentStatus: PaymentStatus;
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
  setPaymentStatus: (status: PaymentStatus) => void;
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

function resolveLinePricing(product: Product, customer: Customer | null, quantity: number) {
  const minQuantity = product.minWholesaleQuantity ?? 1;
  const base = {
    price: product.price,
    retailPrice: product.price,
    priceType: "retail" as const,
    priceList: product.priceList,
    minWholesaleQuantity: product.minWholesaleQuantity
  };

  if (!customer || quantity < minQuantity) return base;

  if (customer.customerType === "reseller" && product.resellerPrice) {
    return {
      ...base,
      price: product.resellerPrice,
      priceType: "reseller" as const,
      priceList: customer.priceList
    };
  }

  if (
    (customer.customerType === "wholesale" || customer.customerType === "vip") &&
    product.wholesalePrice
  ) {
    return {
      ...base,
      price: product.wholesalePrice,
      priceType: "wholesale" as const,
      priceList: customer.priceList
    };
  }

  return base;
}

function repriceCart(cart: CartLine[], customer: Customer | null) {
  return cart.map((line) => {
    const product = products.find((item) => item.id === line.productId);
    if (!product) return line;

    return {
      ...line,
      ...resolveLinePricing(product, customer, line.quantity)
    };
  });
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
  paymentStatus,
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
  paymentStatus?: PaymentStatus;
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
    paymentStatus,
    receivedAmount,
    createdAt: nowReceiptTime()
  };
}

function addProductToCart(cart: CartLine[], product: Product, customer: Customer | null) {
  const existing = cart.find((line) => line.productId === product.id);

  if (existing) {
    const nextQuantity = existing.quantity + 1;
    const pricing = resolveLinePricing(product, customer, nextQuantity);

    return cart.map((line) =>
      line.id === existing.id ? { ...line, quantity: nextQuantity, ...pricing } : line
    );
  }

  const pricing = resolveLinePricing(product, customer, 1);

  return [
    ...cart,
    {
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      ...pricing,
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
  paymentStatus: "paid",
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
      showTerminalNotice(`${lo(product.name)} ຖືກເພີ່ມເຂົ້າກະຕ່າແລ້ວ.`, "success");

      return {
        cart: addProductToCart(state.cart, product, state.customer)
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
          `ບໍ່ພົບສິນຄ້າສຳລັບ ${barcode || "Barcode ນີ້"}.`,
          "error"
        );

        return {
          scanOpen: false
        };
      }

      showTerminalNotice(`${lo(product.name)} ຖືກສະແກນ ແລະ ເພີ່ມແລ້ວ.`, "success");

      return {
        cart: addProductToCart(state.cart, product, state.customer),
        scanOpen: false
      };
    }),
  incrementLine: (lineId) =>
    set((state) => ({
      cart: repriceCart(
        state.cart.map((line) =>
          line.id === lineId ? { ...line, quantity: line.quantity + 1 } : line
        ),
        state.customer
      )
    })),
  decrementLine: (lineId) =>
    set((state) => ({
      cart: repriceCart(
        state.cart
          .map((line) =>
            line.id === lineId
              ? { ...line, quantity: Math.max(0, line.quantity - 1) }
              : line
          )
          .filter((line) => line.quantity > 0),
        state.customer
      )
    })),
  removeLine: (lineId) =>
    set((state) => ({
      cart: state.cart.filter((line) => line.id !== lineId)
    })),
  clearCart: () =>
    set(() => {
      showTerminalNotice("ລ້າງກະຕ່າແລ້ວ.", "info");

      return {
        cart: [],
        discount: null,
        activeOrderId: null
      };
    }),
  startNewSale: () =>
    set(() => {
      showTerminalNotice("ພ້ອມເລີ່ມການຂາຍໃໝ່.", "info");

      return {
        cart: [],
        activeOrderId: null,
        selectedTable: null,
        orderType: "Dine In",
        customer: null,
        discount: null,
        paymentMethod: "cash",
        paymentStatus: "paid",
        receivedAmount: 0
      };
    }),
  holdOrder: () =>
    set((state) => {
      if (state.cart.length === 0) {
        showTerminalNotice(
          "ກະຕ່າຍັງວ່າງ. ເພີ່ມສິນຄ້າກ່ອນພັກອໍເດີ.",
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

      showTerminalNotice(`${order.id} ຖືກພັກໄວ້ເພື່ອຊຳລະພາຍຫຼັງ.`, "success");

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
        showTerminalNotice("ບໍ່ພົບອໍເດີ.", "error");
        return {};
      }

      showTerminalNotice(`${order.id} ໂຫຼດເຂົ້າກະຕ່າແລ້ວ.`, "info");

      return {
        activeOrderId: order.id,
        cart: cloneCart(order.cart ?? []),
        selectedTable: order.type === "Dine In" ? order.table : null,
        orderType: order.type,
        customer: order.customerRecord ?? null,
        discount: order.discount ?? null,
        paymentMethod: order.paymentMethod ?? "cash",
        paymentStatus: order.paymentStatus ?? "paid",
        receivedAmount: order.receivedAmount ?? order.amount
      };
    }),
  setOrderSearch: (query) => set({ orderSearch: query }),
  setSelectedTable: (tableId) =>
    set(() => {
      showTerminalNotice(
        tableId ? `ເລືອກ ${tableId} ແລ້ວ.` : "ເລືອກສັ່ງກັບບ້ານແລ້ວ.",
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
          ? "ເລືອກອໍເດີສັ່ງກັບບ້ານແລ້ວ."
          : "ເລືອກອໍເດີນັ່ງກິນທີ່ຮ້ານແລ້ວ.",
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
        `${lo(customer?.name ?? "Walk-in Customer")} ຖືກເລືອກແລ້ວ.`,
        "info"
      );

      return {
        customer,
        cart: repriceCart(get().cart, customer),
        customerOpen: false
      };
    }),
  applyDiscount: (discount) =>
    set((state) => {
      if (state.cart.length === 0) {
        showTerminalNotice("ກະຕ່າຍັງວ່າງ. ເພີ່ມສິນຄ້າກ່ອນໃຊ້ສ່ວນຫຼຸດ.", "warning");
        return {};
      }

      showTerminalNotice(
        discount.mode === "percent"
          ? `ໃຊ້ສ່ວນຫຼຸດ ${discount.value}% ແລ້ວ.`
          : `ໃຊ້ສ່ວນຫຼຸດ ${discount.value.toLocaleString("en-US")} LAK ແລ້ວ.`,
        "success"
      );

      return {
        discount,
        discountOpen: false
      };
    }),
  clearDiscount: () =>
    set(() => {
      showTerminalNotice("ລຶບສ່ວນຫຼຸດແລ້ວ.", "info");
      return { discount: null };
    }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setPaymentStatus: (status) => set({ paymentStatus: status }),
  setReceivedAmount: (amount) => set({ receivedAmount: Math.max(amount, 0) }),
  confirmPayment: () =>
    set((state) => {
      if (state.cart.length === 0) {
        showTerminalNotice("ກະຕ່າຍັງວ່າງ. ເພີ່ມສິນຄ້າກ່ອນຊຳລະ.", "warning");
        return {};
      }

      const summary = getCartSummary(state.cart, state.discount);
      const paidAmount =
        state.paymentStatus === "debt"
          ? 0
          : state.paymentStatus === "partial"
            ? Math.min(state.receivedAmount, summary.total)
            : summary.total;
      const order = createOrderSnapshot({
        id: state.activeOrderId ?? createOrderId(state.orders),
        cart: state.cart,
        selectedTable: state.selectedTable,
        orderType: state.orderType,
        customer: state.customer,
        discount: state.discount,
        status: "Completed",
        paymentMethod: state.paymentMethod,
        paymentStatus: state.paymentStatus,
        receivedAmount: paidAmount
      });

      showTerminalNotice(
        state.paymentStatus === "debt"
          ? `${order.id} ຖືກບັນທຶກເປັນໜີ້ລູກຄ້າ.`
          : state.paymentStatus === "partial"
            ? `${order.id} ບັນທຶກການຈ່າຍບາງສ່ວນແລ້ວ.`
            : `${order.id} ຊຳລະສຳເລັດແລ້ວ.`,
        "success"
      );

      return {
        orders: [order, ...state.orders.filter((item) => item.id !== order.id)],
        lastPaidOrder: order,
        cart: [],
        activeOrderId: null,
        selectedTable: null,
        orderType: "Dine In",
        customer: null,
        discount: null,
        paymentStatus: "paid",
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
        showTerminalNotice("ບໍ່ພົບບິນທີ່ສຳເລັດ.", "error");
        return {
          refundOrderId: null,
          refundSelectedLineIds: []
        };
      }

      showTerminalNotice(`${order.id} ພ້ອມໃຫ້ກວດການຄືນເງິນ.`, "info");

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
        showTerminalNotice("ເລືອກຢ່າງໜ້ອຍ 1 ລາຍການທີ່ຈ່າຍແລ້ວເພື່ອຄືນເງິນ.", "warning");
        return {};
      }

      showTerminalNotice(`${state.refundOrderId} ສ້າງຄຳຂໍຄືນເງິນແລ້ວ.`, "success");

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
