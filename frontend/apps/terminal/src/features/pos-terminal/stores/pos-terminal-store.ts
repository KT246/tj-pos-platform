import { create } from "zustand";

import { showTerminalNotice } from "../../../lib/terminal-toasts";
import { defaultTerminalBusiness } from "../data/mock-pos-data";
import type {
  CartLine,
  Customer,
  Discount,
  OpenOrder,
  OrderType,
  PaymentMethodId,
  PaymentStatus,
  Product,
  TerminalBusinessProfile
} from "../types";
import { getCartSummary, nowReceiptTime, nowTimeLabel } from "../utils";
import { getTerminalCopy } from "../utils/terminal-copy";

const samplePaidSummary = getCartSummary(defaultTerminalBusiness.initialCart);
const samplePaidOrder: OpenOrder = {
  id: "#ORD-0050",
  table: "T01",
  type: "ນັ່ງກິນທີ່ຮ້ານ",
  customer: "ສຸກສະຫວັນ ພົມມະຈັນ",
  items: samplePaidSummary.itemCount,
  amount: samplePaidSummary.total,
  time: "09:58 AM",
  status: "ສຳເລັດ",
  cart: defaultTerminalBusiness.initialCart,
  paymentMethod: "cash",
  paymentStatus: "ຈ່າຍແລ້ວ",
  receivedAmount: 100000,
  createdAt: "Mar 18, 2025, 09:58 AM"
};

type PosTerminalState = {
  businessSlug: string;
  posType: TerminalBusinessProfile["posType"];
  defaultOrderType: OrderType;
  products: Product[];
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
  configureBusiness: (profile: TerminalBusinessProfile) => void;
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

function createPaidSampleOrder(profile: TerminalBusinessProfile): OpenOrder {
  const summary = getCartSummary(profile.initialCart);
  const paidId =
    profile.posType === "retail"
      ? "#RT-0103"
      : profile.posType === "restaurant"
        ? "#RS-0210"
        : profile.posType === "beauty"
          ? "#BT-0036"
          : profile.posType === "hospitality"
            ? "#HT-0087"
            : "#ORD-0050";

  return {
    id: paidId,
    posType: profile.posType,
    orderType: profile.defaultOrderType,
    table:
      profile.defaultOrderType === "ນັ່ງກິນທີ່ຮ້ານ"
        ? profile.tables?.[0]?.id ?? "T01"
        : profile.defaultOrderType === "ຫ້ອງ"
          ? "ໜ້າເຄົາເຕີ"
          : profile.defaultOrderType === "ບໍລິການ"
            ? "ນັດໝາຍ"
            : "ເຄົາເຕີ",
    type: profile.defaultOrderType,
    customer: profile.posType === "beauty" ? "Ms. Vilayphone" : "ລູກຄ້າທົ່ວໄປ",
    items: summary.itemCount,
    amount: summary.total,
    time: "09:58 AM",
    status: "ສຳເລັດ",
    cart: cloneCart(profile.initialCart),
    paymentMethod: "cash",
    paymentStatus: "ຈ່າຍແລ້ວ",
    receivedAmount: summary.total,
    createdAt: "Mar 18, 2025, 09:58 AM"
  };
}

function resolveLinePricing(product: Product, customer: Customer | null, quantity: number) {
  const minQuantity = product.minWholesaleQuantity ?? 1;
  const base = {
    price: product.price,
    retailPrice: product.price,
    priceType: "ຂາຍຍ່ອຍ" as const,
    priceList: product.priceList,
    minWholesaleQuantity: product.minWholesaleQuantity
  };

  if (!customer || quantity < minQuantity) return base;

  if (customer.customerType === "ຜູ້ຂາຍຕໍ່" && product.resellerPrice) {
    return {
      ...base,
      price: product.resellerPrice,
      priceType: "ຜູ້ຂາຍຕໍ່" as const,
      priceList: customer.priceList
    };
  }

  if (
    (customer.customerType === "ຂາຍສົ່ງ" || customer.customerType === "VIP") &&
    product.wholesalePrice
  ) {
    return {
      ...base,
      price: product.wholesalePrice,
      priceType: "ຂາຍສົ່ງ" as const,
      priceList: customer.priceList
    };
  }

  return base;
}

function repriceCart(
  cart: CartLine[],
  customer: Customer | null,
  products: Product[]
) {
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
  posType,
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
  posType: TerminalBusinessProfile["posType"];
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
  const place =
    orderType === "ສັ່ງກັບບ້ານ"
      ? "ສັ່ງກັບບ້ານ"
      : orderType === "ຂາຍປີກ" || orderType === "ຂາຍສົ່ງ" || orderType === "ຄືນສິນຄ້າ"
        ? "ເຄົາເຕີ"
        : orderType === "ບໍລິການ"
          ? "ນັດໝາຍ"
          : orderType === "ຫ້ອງ"
            ? "ໜ້າເຄົາເຕີ"
            : selectedTable ?? "ບໍ່ເລືອກໂຕະ";

  return {
    id,
    posType,
    orderType,
    table: place,
    type: orderType,
    tableId: orderType === "ນັ່ງກິນທີ່ຮ້ານ" ? selectedTable : null,
    roomId: orderType === "ຫ້ອງ" ? selectedTable : null,
    appointmentId: orderType === "ບໍລິການ" ? selectedTable : null,
    customer: customer?.name ?? "ລູກຄ້າທົ່ວໄປ",
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
  businessSlug: defaultTerminalBusiness.slug,
  posType: defaultTerminalBusiness.posType,
  defaultOrderType: defaultTerminalBusiness.defaultOrderType,
  products: defaultTerminalBusiness.products,
  activeCategory: "all",
  query: "",
  cart: defaultTerminalBusiness.initialCart,
  activeOrderId: null,
  selectedTable:
    defaultTerminalBusiness.tables?.find((table) => table.status === "ມີລູກຄ້າ")
      ?.id ?? null,
  orderType: defaultTerminalBusiness.defaultOrderType,
  customer: null,
  discount: null,
  orders: [...defaultTerminalBusiness.openOrders, samplePaidOrder],
  orderSearch: "",
  lastPaidOrder: samplePaidOrder,
  paymentMethod: "cash",
  paymentStatus: "ຈ່າຍແລ້ວ",
  receivedAmount: 100000,
  refundSearch: "#ORD-0050",
  refundOrderId: samplePaidOrder.id,
  refundSelectedLineIds: samplePaidOrder.cart?.map((line) => line.id) ?? [],
  scanOpen: false,
  discountOpen: false,
  customerOpen: false,
  tableOpen: false,
  configureBusiness: (profile) =>
    set((state) => {
      if (state.businessSlug === profile.slug) return {};

      const nextPaidOrder = createPaidSampleOrder(profile);

      return {
        businessSlug: profile.slug,
        posType: profile.posType,
        defaultOrderType: profile.defaultOrderType,
        products: profile.products,
        activeCategory: profile.categories[0]?.id ?? "all",
        query: "",
        cart: cloneCart(profile.initialCart),
        activeOrderId: null,
        selectedTable:
          profile.defaultOrderType === "ນັ່ງກິນທີ່ຮ້ານ"
            ? profile.openOrders[0]?.tableId ?? profile.tables?.[0]?.id ?? null
            : null,
        orderType: profile.defaultOrderType,
        customer: null,
        discount: null,
        orders: [...profile.openOrders, nextPaidOrder],
        orderSearch: "",
        lastPaidOrder: nextPaidOrder,
        paymentMethod: "cash",
        paymentStatus: "ຈ່າຍແລ້ວ",
        receivedAmount: nextPaidOrder.amount,
        refundSearch: nextPaidOrder.id,
        refundOrderId: nextPaidOrder.id,
        refundSelectedLineIds: nextPaidOrder.cart?.map((line) => line.id) ?? [],
        scanOpen: false,
        discountOpen: false,
        customerOpen: false,
        tableOpen: false
      };
    }),
  setActiveCategory: (categoryId) => set({ activeCategory: categoryId }),
  setQuery: (query) => set({ query }),
  addProduct: (product) =>
    set((state) => {
      const copy = getTerminalCopy(state.posType);
      showTerminalNotice(
        `${product.name} ${copy.addedToCartNotice}`,
        "success"
      );

      return {
        cart: addProductToCart(state.cart, product, state.customer)
      };
    }),
  scanBarcode: (barcode) =>
    set((state) => {
      const normalized = barcode.trim().toLowerCase();
      const product = state.products.find(
        (item) =>
          item.sku.toLowerCase() === normalized ||
          item.barcode?.toLowerCase() === normalized ||
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

      showTerminalNotice(`${product.name} ຖືກສະແກນ ແລະ ເພີ່ມແລ້ວ.`, "success");

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
        state.customer,
        state.products
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
        state.customer,
        state.products
      )
    })),
  removeLine: (lineId) =>
    set((state) => ({
      cart: state.cart.filter((line) => line.id !== lineId)
    })),
  clearCart: () =>
    set((state) => {
      const copy = getTerminalCopy(state.posType);
      showTerminalNotice(copy.clearedCartNotice, "info");

      return {
        cart: [],
        discount: null,
        activeOrderId: null
      };
    }),
  startNewSale: () =>
    set((state) => {
      const copy = getTerminalCopy(state.posType);
      showTerminalNotice(copy.startNewNotice, "info");

      return {
        cart: [],
        activeOrderId: null,
        selectedTable: null,
        orderType: state.defaultOrderType,
        customer: null,
        discount: null,
        paymentMethod: "cash",
        paymentStatus: "ຈ່າຍແລ້ວ",
        receivedAmount: 0
      };
    }),
  holdOrder: () =>
    set((state) => {
      const copy = getTerminalCopy(state.posType);

      if (state.cart.length === 0) {
        showTerminalNotice(copy.emptyHoldWarning, "warning");
        return {};
      }

      const order = createOrderSnapshot({
        id: state.activeOrderId ?? createOrderId(state.orders),
        posType: state.posType,
        cart: state.cart,
        selectedTable: state.selectedTable,
        orderType: state.orderType,
        customer: state.customer,
        discount: state.discount,
        status: "ພັກໄວ້"
      });

      showTerminalNotice(`${order.id} ${copy.heldNotice}`, "success");

      return {
        orders: [order, ...state.orders.filter((item) => item.id !== order.id)],
        cart: [],
        activeOrderId: null,
        selectedTable: null,
        orderType: state.defaultOrderType,
        customer: null,
        discount: null
      };
    }),
  resumeOrder: (orderId) =>
    set((state) => {
      const copy = getTerminalCopy(state.posType);
      const order = state.orders.find((item) => item.id === orderId);

      if (!order) {
        showTerminalNotice(copy.notFoundNotice, "error");
        return {};
      }

      showTerminalNotice(`${order.id} ${copy.loadedNotice}`, "info");

      return {
        activeOrderId: order.id,
        cart: cloneCart(order.cart ?? []),
        selectedTable: order.type === "ນັ່ງກິນທີ່ຮ້ານ" ? order.table : null,
        orderType: order.type,
        customer: order.customerRecord ?? null,
        discount: order.discount ?? null,
        paymentMethod: order.paymentMethod ?? "cash",
        paymentStatus: order.paymentStatus ?? "ຈ່າຍແລ້ວ",
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
        orderType: tableId ? "ນັ່ງກິນທີ່ຮ້ານ" : "ສັ່ງກັບບ້ານ",
        tableOpen: false
      };
    }),
  setOrderType: (orderType) =>
    set(() => {
      showTerminalNotice(
        orderType === "ສັ່ງກັບບ້ານ"
          ? "ເລືອກອໍເດີສັ່ງກັບບ້ານແລ້ວ."
          : "ເລືອກອໍເດີນັ່ງກິນທີ່ຮ້ານແລ້ວ.",
        "info"
      );

      return {
        orderType,
        selectedTable: orderType === "ສັ່ງກັບບ້ານ" ? null : get().selectedTable
      };
    }),
  setCustomer: (customer) =>
    set((state) => {
      const copy = getTerminalCopy(state.posType);
      showTerminalNotice(
        `${customer?.name ?? copy.walkInLabel} ${"ຖືກເລືອກແລ້ວ."}`,
        "info"
      );

      return {
        customer,
        cart: repriceCart(get().cart, customer, get().products),
        customerOpen: false
      };
    }),
  applyDiscount: (discount) =>
    set((state) => {
      const copy = getTerminalCopy(state.posType);

      if (state.cart.length === 0) {
        showTerminalNotice(copy.emptyDiscountWarning, "warning");
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
      const copy = getTerminalCopy(state.posType);

      if (state.cart.length === 0) {
        showTerminalNotice(copy.emptyPaymentWarning, "warning");
        return {};
      }

      const summary = getCartSummary(state.cart, state.discount);
      const paidAmount =
        state.paymentStatus === "ຕິດໜີ້"
          ? 0
          : state.paymentStatus === "ຈ່າຍບາງສ່ວນ"
            ? Math.min(state.receivedAmount, summary.total)
            : summary.total;
      const order = createOrderSnapshot({
        id: state.activeOrderId ?? createOrderId(state.orders),
        posType: state.posType,
        cart: state.cart,
        selectedTable: state.selectedTable,
        orderType: state.orderType,
        customer: state.customer,
        discount: state.discount,
        status: "ສຳເລັດ",
        paymentMethod: state.paymentMethod,
        paymentStatus: state.paymentStatus,
        receivedAmount: paidAmount
      });

      showTerminalNotice(
        state.paymentStatus === "ຕິດໜີ້"
          ? `${order.id} ${copy.debtSavedNotice}`
          : state.paymentStatus === "ຈ່າຍບາງສ່ວນ"
            ? `${order.id} ${copy.partialPaymentSavedNotice}`
            : `${order.id} ${copy.paymentSuccessNotice}`,
        "success"
      );

      return {
        orders: [order, ...state.orders.filter((item) => item.id !== order.id)],
        lastPaidOrder: order,
        cart: [],
        activeOrderId: null,
        selectedTable: null,
        orderType: state.defaultOrderType,
        customer: null,
        discount: null,
        paymentStatus: "ຈ່າຍແລ້ວ",
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
          item.status === "ສຳເລັດ" &&
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
