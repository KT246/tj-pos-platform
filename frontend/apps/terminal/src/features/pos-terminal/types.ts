import type { LucideIcon } from "lucide-react";

export type PosType = "retail" | "cafe" | "restaurant" | "beauty" | "hospitality";

export type ItemType = "product" | "menu_item" | "service" | "room" | "extra_service";

export type PosScreen =
  | "sales"
  | "new-sale"
  | "open-orders"
  | "held-orders"
  | "checkout"
  | "receipt-preview"
  | "refund"
  | "open-shift"
  | "close-shift"
  | "offline";

export type Category = {
  id: string;
  label: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  posType?: PosType;
  itemType?: ItemType;
  sku: string;
  barcode?: string;
  price: number;
  wholesalePrice?: number;
  resellerPrice?: number;
  minWholesaleQuantity?: number;
  priceList?: string;
  unit?: string;
  stock?: number;
  lowStockThreshold?: number;
  image: string;
  badge?: string;
  retail?: {
    supplier?: string;
    brand?: string;
    expiryDate?: string;
    batchNo?: string;
    trackStock?: boolean;
  };
  food?: {
    kitchenStation?: string;
    hasModifiers?: boolean;
    hasToppings?: boolean;
    prepMinutes?: number;
  };
  beauty?: {
    durationMinutes?: number;
    assignedStaff?: string[];
    commissionRate?: number;
    bookingRequired?: boolean;
  };
  hospitality?: {
    roomNumber?: string;
    roomType?: string;
    capacity?: number;
    bedType?: string;
    roomStatus?: "available" | "occupied" | "reserved" | "cleaning";
    priceMode?: "ຄືນ" | "ຊົ່ວໂມງ";
  };
};

export type CartLine = {
  id: string;
  productId: string;
  name: string;
  price: number;
  retailPrice?: number;
  priceType?: "ຂາຍຍ່ອຍ" | "ຂາຍສົ່ງ" | "ຜູ້ຂາຍຕໍ່";
  priceList?: string;
  minWholesaleQuantity?: number;
  quantity: number;
  image: string;
  note?: string;
};

export type OrderType =
  | "ຂາຍປີກ"
  | "ຂາຍສົ່ງ"
  | "ຄືນສິນຄ້າ"
  | "ນັ່ງກິນທີ່ຮ້ານ"
  | "ສັ່ງກັບບ້ານ"
  | "ບໍລິການ"
  | "ຫ້ອງ";

export type Discount = {
  mode: "percent" | "amount";
  value: number;
  reason: string;
};

export type Customer = {
  id: string;
  name: string;
  subtitle: string;
  customerType: "ຂາຍຍ່ອຍ" | "ຂາຍສົ່ງ" | "ຜູ້ຂາຍຕໍ່" | "VIP";
  priceList: string;
  debtBalance: number;
  creditLimit: number;
  paymentTerm: string;
  phone?: string;
  points: number;
  avatar: string;
};

export type PaymentStatus = "ຈ່າຍແລ້ວ" | "ຈ່າຍບາງສ່ວນ" | "ຕິດໜີ້";

export type PaymentMethodId =
  | "cash"
  | "bank-transfer"
  | "qr-code";

export type OpenOrder = {
  id: string;
  table: string;
  type: OrderType;
  posType?: PosType;
  orderType?: OrderType;
  tableId?: string | null;
  roomId?: string | null;
  appointmentId?: string | null;
  customer: string;
  items: number;
  amount: number;
  time: string;
  status: "ກຳລັງເຮັດ" | "ພັກໄວ້" | "ສຳເລັດ";
  cart?: CartLine[];
  customerRecord?: Customer | null;
  discount?: Discount | null;
  paymentMethod?: PaymentMethodId;
  paymentStatus?: PaymentStatus;
  receivedAmount?: number;
  createdAt?: string;
};

export type DiningTable = {
  id: string;
  seats: number;
  area: "ພາຍໃນ" | "ພາຍນອກ" | "ຫ້ອງ VIP" | "ລານນອກ";
  status: "ວ່າງ" | "ມີລູກຄ້າ" | "ຈອງໄວ້";
  elapsed?: string;
};

export type QuickAction = {
  label: string;
  tone: "blue" | "orange" | "violet" | "slate";
  icon: LucideIcon;
  href?: string;
};

export type TerminalCapabilities = {
  hasBarcode: boolean;
  hasInventory: boolean;
  hasTables: boolean;
  hasModifiers: boolean;
  hasKitchen: boolean;
  hasAppointments: boolean;
  hasRooms: boolean;
  hasCheckIn: boolean;
  hasSplitBill: boolean;
  hasServiceCharge: boolean;
  hasWholesale: boolean;
  hasDebt: boolean;
};

export type TerminalBusinessProfile = {
  slug: string;
  name: string;
  branchName: string;
  cashierName: string;
  shiftName: string;
  posType: PosType;
  posTypeLabel: string;
  layoutTitle: string;
  layoutDescription: string;
  searchPlaceholder: string;
  searchFilterLabel: string;
  defaultOrderType: OrderType;
  capabilities: TerminalCapabilities;
  categories: Category[];
  products: Product[];
  initialCart: CartLine[];
  openOrders: OpenOrder[];
  tables?: DiningTable[];
  quickActions: QuickAction[];
};
