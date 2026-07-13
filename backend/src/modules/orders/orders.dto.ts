export type OrderStatus =
  | "draft"
  | "open"
  | "held"
  | "paid"
  | "partially_paid"
  | "debt"
  | "cancelled"
  | "voided"
  | "refunded";
export type PaymentStatus =
  | "unpaid"
  | "paid"
  | "partially_paid"
  | "debt"
  | "voided"
  | "refunded";
export type PaymentMethod = "cash" | "bank-transfer" | "qr-code";

export type CreateOrderItemBody = {
  itemId?: string;
  name?: string;
  price?: number;
  quantity?: number;
  note?: string | null;
};

export type UpdateOrderItemBody = {
  quantity?: number;
  note?: string | null;
};

export type CreateBusinessOrderBody = {
  clientRequestId?: string | null;
  posType?: string;
  orderType?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  tableLabel?: string | null;
  customerId?: string | null;
  customerName?: string | null;
  cashierName?: string | null;
  note?: string | null;
  discountAmount?: number;
  discountLabel?: string | null;
  loyaltyPointsRedeemed?: number;
  loyaltyDiscountAmount?: number;
  taxAmount?: number;
  items?: CreateOrderItemBody[];
};

export type CreateOrderPaymentBody = {
  method?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  amountPaid?: number;
  cashierName?: string | null;
  payments?: Array<{
    method?: PaymentMethod;
    amountPaid?: number;
  }>;
};

export type BusinessOrderItem = {
  id: string;
  itemId: string | null;
  name: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
  lineTotal: number;
  note: string | null;
};

export type BusinessPayment = {
  id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amountPaid: number;
  changeAmount: number;
  debtAmount: number;
  paidAt: string;
};

export type BusinessOrder = {
  id: string;
  orderNo: string;
  posType: string;
  orderType: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discountAmount: number;
  discountLabel: string | null;
  taxAmount: number;
  total: number;
  tableLabel: string | null;
  customerId: string | null;
  customerName: string | null;
  cashierName: string | null;
  loyaltyPointsRedeemed: number;
  loyaltyPointsEarned: number;
  loyaltyDiscountAmount: number;
  note: string | null;
  clientRequestId: string | null;
  createdAt: string;
  updatedAt: string;
  items: BusinessOrderItem[];
  payments: BusinessPayment[];
};

export type BusinessOrdersResponse = {
  orders: BusinessOrder[];
};

export type BusinessOrderReceipt = {
  businessName: string;
  businessSlug: string;
  order: BusinessOrder;
};
