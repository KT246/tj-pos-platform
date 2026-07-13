export type CafeOrderType = "dine-in" | "takeaway" | "delivery"
export type CafePaymentStatus = "unpaid" | "paid" | "voided" | "refunded"
export type CafeOrderStatus =
  | "new"
  | "completed"
  | "delivering"
  | "preparing"
  | "cancelled"
  | "voided"
  | "refunded"

export type CafeOrderItem = {
  id: string
  name: string
  note: string
  quantity: number
  price: number
  image: string
}

export type CafeOrderPayment = {
  id: string
  method: "cash" | "bank-transfer" | "qr-code" | string
  amountPaid: number
  changeAmount: number
  debtAmount: number
  paidAt: string
}

export type CafeOrder = {
  id: string
  backendId?: string
  orderNo?: string
  orderDate?: string
  date: string
  time: string
  type: CafeOrderType
  tableOrCustomer: string
  phone?: string
  itemCount: number
  paymentStatus: CafePaymentStatus
  status: CafeOrderStatus
  subtotal?: number
  discountAmount?: number
  discountLabel?: string | null
  taxAmount?: number
  loyaltyPointsRedeemed?: number
  loyaltyPointsEarned?: number
  loyaltyDiscountAmount?: number
  total: number
  employee: string
  note: string
  items: CafeOrderItem[]
  payments?: CafeOrderPayment[]
}

const coffeeImage =
  "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=180&q=80"
const latteImage =
  "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=180&q=80"
const teaImage =
  "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=180&q=80"
const cakeImage =
  "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=180&q=80"

export const cafeOrders: CafeOrder[] = [
  {
    id: "#DH00045",
    date: "20/05/2024",
    time: "10:28",
    type: "dine-in",
    tableOrCustomer: "B\u00e0n 03",
    itemCount: 4,
    paymentStatus: "unpaid",
    status: "new",
    total: 143000,
    employee: "Nguy\u1ec5n Minh",
    note: "Kh\u00f4ng \u1ed1ng h\u00fat, c\u1ea3m \u01a1n!",
    items: [
      {
        id: "milk-coffee",
        name: "C\u00e0 ph\u00ea s\u1eefa",
        note: "\u00cdt \u0111\u00e1, \u00edt ng\u1ecdt",
        quantity: 1,
        price: 28000,
        image: coffeeImage,
      },
      {
        id: "latte",
        name: "Latte",
        note: "N\u00f3ng, B\u00ecnh th\u01b0\u1eddng",
        quantity: 1,
        price: 35000,
        image: latteImage,
      },
      {
        id: "peach-tea",
        name: "Tr\u00e0 \u0111\u00e0o",
        note: "\u00cdt \u0111\u00e1, B\u00ecnh th\u01b0\u1eddng",
        quantity: 1,
        price: 35000,
        image: teaImage,
      },
      {
        id: "cheesecake",
        name: "Cheesecake",
        note: "",
        quantity: 1,
        price: 45000,
        image: cakeImage,
      },
    ],
  },
  {
    id: "#DH00044",
    date: "20/05/2024",
    time: "10:15",
    type: "takeaway",
    tableOrCustomer: "Kh\u00e1ch l\u1ebb",
    itemCount: 2,
    paymentStatus: "paid",
    status: "completed",
    total: 70000,
    employee: "Nguy\u1ec5n Minh",
    note: "",
    items: [
      {
        id: "latte",
        name: "Latte",
        note: "\u0110\u00e1 ri\u00eang",
        quantity: 1,
        price: 35000,
        image: latteImage,
      },
      {
        id: "peach-tea",
        name: "Tr\u00e0 \u0111\u00e0o",
        note: "\u00cdt ng\u1ecdt",
        quantity: 1,
        price: 35000,
        image: teaImage,
      },
    ],
  },
  {
    id: "#DH00043",
    date: "20/05/2024",
    time: "10:02",
    type: "delivery",
    tableOrCustomer: "Anh Ho\u00e0ng",
    phone: "0988 123 456",
    itemCount: 5,
    paymentStatus: "paid",
    status: "delivering",
    total: 185000,
    employee: "Nguy\u1ec5n Minh",
    note: "Giao trong gi\u1edd ngh\u1ec9 tr\u01b0a.",
    items: [
      {
        id: "black-coffee",
        name: "C\u00e0 ph\u00ea \u0111en",
        note: "Kh\u00f4ng \u0111\u01b0\u1eddng",
        quantity: 2,
        price: 25000,
        image: coffeeImage,
      },
      {
        id: "cake",
        name: "Cheesecake",
        note: "",
        quantity: 3,
        price: 45000,
        image: cakeImage,
      },
    ],
  },
  {
    id: "#DH00042",
    date: "20/05/2024",
    time: "09:47",
    type: "dine-in",
    tableOrCustomer: "B\u00e0n 01",
    itemCount: 3,
    paymentStatus: "paid",
    status: "completed",
    total: 115000,
    employee: "Nguy\u1ec5n Minh",
    note: "",
    items: [],
  },
  {
    id: "#DH00041",
    date: "20/05/2024",
    time: "09:30",
    type: "takeaway",
    tableOrCustomer: "Kh\u00e1ch l\u1ebb",
    itemCount: 2,
    paymentStatus: "unpaid",
    status: "preparing",
    total: 65000,
    employee: "Nguy\u1ec5n Minh",
    note: "",
    items: [],
  },
  {
    id: "#DH00040",
    date: "20/05/2024",
    time: "09:12",
    type: "delivery",
    tableOrCustomer: "Ch\u1ecb Linh",
    phone: "0944 567 890",
    itemCount: 4,
    paymentStatus: "paid",
    status: "completed",
    total: 160000,
    employee: "Nguy\u1ec5n Minh",
    note: "",
    items: [],
  },
  {
    id: "#DH00039",
    date: "20/05/2024",
    time: "08:58",
    type: "dine-in",
    tableOrCustomer: "B\u00e0n 05",
    itemCount: 3,
    paymentStatus: "paid",
    status: "completed",
    total: 125000,
    employee: "Nguy\u1ec5n Minh",
    note: "",
    items: [],
  },
  {
    id: "#DH00038",
    date: "20/05/2024",
    time: "08:40",
    type: "takeaway",
    tableOrCustomer: "Kh\u00e1ch l\u1ebb",
    itemCount: 1,
    paymentStatus: "paid",
    status: "completed",
    total: 30000,
    employee: "Nguy\u1ec5n Minh",
    note: "",
    items: [],
  },
  {
    id: "#DH00037",
    date: "20/05/2024",
    time: "08:25",
    type: "delivery",
    tableOrCustomer: "Anh Tu\u1ea5n",
    phone: "0977 111 222",
    itemCount: 3,
    paymentStatus: "unpaid",
    status: "cancelled",
    total: 95000,
    employee: "Nguy\u1ec5n Minh",
    note: "",
    items: [],
  },
  {
    id: "#DH00036",
    date: "20/05/2024",
    time: "08:10",
    type: "dine-in",
    tableOrCustomer: "B\u00e0n 02",
    itemCount: 2,
    paymentStatus: "paid",
    status: "completed",
    total: 75000,
    employee: "Nguy\u1ec5n Minh",
    note: "",
    items: [],
  },
]
