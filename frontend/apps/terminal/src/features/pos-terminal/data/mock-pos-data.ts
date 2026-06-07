import {
  Archive,
  ClipboardList,
  Ellipsis,
  Utensils
} from "lucide-react";

import type {
  CartLine,
  Category,
  Customer,
  DiningTable,
  OpenOrder,
  Product,
  QuickAction
} from "../types";

export const businessName = "TJ Cafe Vientiane";
export const branchName = "TJ Cafe Vientiane";
export const cashierName = "Somchai P.";
export const shiftName = "S001";

export const categories: Category[] = [
  { id: "all", label: "All Items" },
  { id: "coffee", label: "Coffee" },
  { id: "non-coffee", label: "Non Coffee" },
  { id: "tea", label: "Tea" },
  { id: "pastry", label: "Pastry & Bakery" },
  { id: "snacks", label: "Snacks" },
  { id: "combos", label: "Combos" },
  { id: "beverages", label: "Beverages" },
  { id: "add-ons", label: "Add-ons" }
];

export const products: Product[] = [
  {
    id: "iced-latte",
    name: "Iced Latte",
    category: "coffee",
    sku: "CF-1001",
    price: 26000,
    wholesalePrice: 22000,
    resellerPrice: 21000,
    minWholesaleQuantity: 12,
    priceList: "Cafe Wholesale",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "americano",
    name: "Americano",
    category: "coffee",
    sku: "CF-1002",
    price: 22000,
    wholesalePrice: 18500,
    resellerPrice: 17800,
    minWholesaleQuantity: 12,
    priceList: "Cafe Wholesale",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    category: "coffee",
    sku: "CF-1003",
    price: 25000,
    wholesalePrice: 21000,
    resellerPrice: 20000,
    minWholesaleQuantity: 12,
    priceList: "Cafe Wholesale",
    image:
      "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "thai-milk-tea",
    name: "Thai Milk Tea",
    category: "tea",
    sku: "TE-2001",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "croissant",
    name: "Croissant",
    category: "pastry",
    sku: "BK-3001",
    price: 18000,
    wholesalePrice: 15000,
    resellerPrice: 14500,
    minWholesaleQuantity: 24,
    priceList: "Bakery Reseller",
    image:
      "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "chocolate-cake",
    name: "Chocolate Cake",
    category: "pastry",
    sku: "BK-3002",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "club-sandwich",
    name: "Club Sandwich",
    category: "snacks",
    sku: "FD-4001",
    price: 32000,
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "mineral-water",
    name: "Mineral Water",
    category: "beverages",
    sku: "BV-5001",
    price: 10000,
    wholesalePrice: 8000,
    resellerPrice: 7600,
    minWholesaleQuantity: 48,
    priceList: "Beverage Wholesale",
    image:
      "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "cola-can",
    name: "Cola Can",
    category: "beverages",
    sku: "BV-5002",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "sprite-can",
    name: "Sprite Can",
    category: "beverages",
    sku: "BV-5003",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "orange-juice",
    name: "Orange Juice",
    category: "non-coffee",
    sku: "NC-6001",
    price: 20000,
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "green-tea",
    name: "Green Tea",
    category: "tea",
    sku: "TE-2002",
    price: 18000,
    image:
      "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "latte-caramel",
    name: "Latte Caramel",
    category: "coffee",
    sku: "CF-1004",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1579888071069-c107a6f79d82?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "mocha",
    name: "Mocha",
    category: "coffee",
    sku: "CF-1005",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "hot-latte",
    name: "Hot Latte",
    category: "coffee",
    sku: "CF-1006",
    price: 26000,
    image:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "affogato",
    name: "Affogato",
    category: "coffee",
    sku: "CF-1007",
    price: 30000,
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "flat-white",
    name: "Flat White",
    category: "coffee",
    sku: "CF-1008",
    price: 26000,
    image:
      "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    category: "coffee",
    sku: "CF-1009",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=360&q=80"
  }
];

export const initialCart: CartLine[] = [
  {
    id: "cart-iced-latte",
    productId: "iced-latte",
    name: "Iced Latte",
    price: 26000,
    retailPrice: 26000,
    priceType: "retail",
    quantity: 1,
    image: products[0].image
  },
  {
    id: "cart-croissant",
    productId: "croissant",
    name: "Croissant",
    price: 18000,
    retailPrice: 18000,
    priceType: "retail",
    quantity: 1,
    image: products[4].image,
    note: "No sesame"
  },
  {
    id: "cart-thai-tea",
    productId: "thai-milk-tea",
    name: "Thai Milk Tea",
    price: 22000,
    retailPrice: 22000,
    priceType: "retail",
    quantity: 1,
    image: products[3].image,
    note: "Extra pearl"
  }
];

export const customers: Customer[] = [
  {
    id: "CUS-0032",
    name: "Souksavanh Phommachanh",
    subtitle: "Member ID: CUS-0032",
    customerType: "vip",
    priceList: "VIP Retail",
    debtBalance: 0,
    creditLimit: 2000000,
    paymentTerm: "Pay now",
    phone: "+856 20 5555 0032",
    points: 1250,
    avatar: "https://i.pravatar.cc/96?img=12"
  },
  {
    id: "CUS-0018",
    name: "Khamla Vongsana",
    subtitle: "Member ID: CUS-0018",
    customerType: "wholesale",
    priceList: "Cafe Wholesale",
    debtBalance: 1850000,
    creditLimit: 8000000,
    paymentTerm: "Net 15",
    phone: "+856 20 5555 0018",
    points: 680,
    avatar: "https://i.pravatar.cc/96?img=13"
  },
  {
    id: "CUS-0027",
    name: "Phetsamone Inthilath",
    subtitle: "Member ID: CUS-0027",
    customerType: "reseller",
    priceList: "Beverage Reseller",
    debtBalance: 920000,
    creditLimit: 5000000,
    paymentTerm: "Net 7",
    phone: "+856 20 5555 0027",
    points: 2340,
    avatar: "https://i.pravatar.cc/96?img=14"
  },
  {
    id: "WALK-IN",
    name: "Walk-in Customer",
    subtitle: "No member",
    customerType: "retail",
    priceList: "Default Retail",
    debtBalance: 0,
    creditLimit: 0,
    paymentTerm: "Pay now",
    points: 0,
    avatar: "https://i.pravatar.cc/96?img=15"
  }
];

export const openOrders: OpenOrder[] = [
  {
    id: "#ORD-0052",
    table: "T03",
    type: "Dine In",
    customer: "Walk-in Customer",
    items: 3,
    amount: 85000,
    time: "10:24 AM",
    status: "In Progress",
    cart: initialCart
  },
  {
    id: "#ORD-0051",
    table: "T05",
    type: "Dine In",
    customer: "Mr. Khamla",
    items: 4,
    amount: 145000,
    time: "10:10 AM",
    status: "In Progress",
    cart: [
      { ...initialCart[0], id: "cart-0051-latte", quantity: 2 },
      { ...initialCart[1], id: "cart-0051-croissant", quantity: 1 },
      { ...initialCart[2], id: "cart-0051-tea", quantity: 1 }
    ],
    customerRecord: customers[1]
  },
  {
    id: "#ORD-0049",
    table: "Take Away",
    type: "Take Away",
    customer: "Walk-in Customer",
    items: 1,
    amount: 28000,
    time: "09:41 AM",
    status: "Held",
    cart: [
      {
        id: "cart-0049-mocha",
        productId: "mocha",
        name: "Mocha",
        price: 28000,
        quantity: 1,
        image: products[13].image
      }
    ]
  },
  {
    id: "#ORD-0048",
    table: "T02",
    type: "Dine In",
    customer: "Mr. Phongsavath",
    items: 5,
    amount: 192000,
    time: "09:15 AM",
    status: "Held",
    cart: [
      { ...initialCart[0], id: "cart-0048-latte", quantity: 2 },
      { ...initialCart[1], id: "cart-0048-croissant", quantity: 2 },
      { ...initialCart[2], id: "cart-0048-tea", quantity: 1 }
    ],
    customerRecord: customers[2]
  }
];

export const tables: DiningTable[] = [
  { id: "T01", seats: 2, area: "Indoor", status: "Available" },
  { id: "T02", seats: 4, area: "Indoor", status: "Available" },
  { id: "T03", seats: 4, area: "Indoor", status: "Occupied", elapsed: "00:45" },
  { id: "T04", seats: 2, area: "Indoor", status: "Available" },
  { id: "T05", seats: 6, area: "Indoor", status: "Occupied", elapsed: "01:15" },
  { id: "T06", seats: 4, area: "Outdoor", status: "Available" },
  { id: "T07", seats: 2, area: "Outdoor", status: "Available" },
  { id: "T08", seats: 4, area: "VIP Room", status: "Available" },
  { id: "T09", seats: 2, area: "VIP Room", status: "Reserved", elapsed: "15:30" },
  { id: "T10", seats: 6, area: "Terrace", status: "Available" },
  { id: "T11", seats: 2, area: "Terrace", status: "Available" },
  { id: "T12", seats: 4, area: "Terrace", status: "Available" },
  { id: "T13", seats: 4, area: "Outdoor", status: "Available" },
  { id: "T14", seats: 2, area: "Outdoor", status: "Occupied" },
  { id: "T15", seats: 4, area: "Indoor", status: "Available" }
];

export const quickActions: QuickAction[] = [
  { label: "Hold Order", tone: "orange", icon: Archive },
  {
    label: "Open Orders",
    tone: "blue",
    icon: ClipboardList,
    href: "/open-orders"
  },
  { label: "Table / Dine In", tone: "violet", icon: Utensils },
  { label: "More", tone: "slate", icon: Ellipsis }
];
