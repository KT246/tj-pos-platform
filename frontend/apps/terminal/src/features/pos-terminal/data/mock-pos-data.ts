import {
  Archive,
  BedDouble,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Ellipsis,
  Receipt,
  ScanBarcode,
  SplitSquareHorizontal,
  Utensils
} from "lucide-react";

import type {
  CartLine,
  Category,
  Customer,
  DiningTable,
  OpenOrder,
  Product,
  QuickAction,
  TerminalBusinessProfile,
  TerminalCapabilities
} from "../types";

export const businessName = "TJ Cafe Vientiane";
export const branchName = "TJ Cafe Vientiane";
export const cashierName = "Somchai P.";
export const shiftName = "S001";

const baseCapabilities: TerminalCapabilities = {
  hasBarcode: false,
  hasInventory: false,
  hasTables: false,
  hasModifiers: false,
  hasKitchen: false,
  hasAppointments: false,
  hasRooms: false,
  hasCheckIn: false,
  hasSplitBill: false,
  hasServiceCharge: false,
  hasWholesale: false,
  hasDebt: false
};

function capability(overrides: Partial<TerminalCapabilities>): TerminalCapabilities {
  return { ...baseCapabilities, ...overrides };
}

export const categories: Category[] = [
  { id: "all", label: "ເມນູທັງໝົດ" },
  { id: "coffee", label: "ກາເຟ" },
  { id: "non-coffee", label: "ບໍ່ແມ່ນກາເຟ" },
  { id: "tea", label: "ຊາ" },
  { id: "pastry", label: "ເບເກີຣີ" },
  { id: "snacks", label: "ອາຫານວ່າງ" },
  { id: "combos", label: "ຊຸດຄອມໂບ" },
  { id: "beverages", label: "ເຄື່ອງດື່ມ" },
  { id: "add-ons", label: "ເພີ່ມເຕີມ" }
];

export const products: Product[] = [
  {
    id: "iced-latte",
    name: "ລາເຕ້ເຢັນ",
    category: "coffee",
    sku: "CF-1001",
    price: 26000,
    wholesalePrice: 22000,
    resellerPrice: 21000,
    minWholesaleQuantity: 12,
    priceList: "ລາຄາສົ່ງກາເຟ",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "americano",
    name: "ອາເມຣິກາໂນ",
    category: "coffee",
    sku: "CF-1002",
    price: 22000,
    wholesalePrice: 18500,
    resellerPrice: 17800,
    minWholesaleQuantity: 12,
    priceList: "ລາຄາສົ່ງກາເຟ",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "cappuccino",
    name: "ຄາປູຊິໂນ",
    category: "coffee",
    sku: "CF-1003",
    price: 25000,
    wholesalePrice: 21000,
    resellerPrice: 20000,
    minWholesaleQuantity: 12,
    priceList: "ລາຄາສົ່ງກາເຟ",
    image:
      "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "thai-milk-tea",
    name: "ຊານົມໄທ",
    category: "tea",
    sku: "TE-2001",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "croissant",
    name: "ຄຣົວຊອງ",
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
    name: "ເຄັກຊັອກໂກແລັດ",
    category: "pastry",
    sku: "BK-3002",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "club-sandwich",
    name: "ແຊນວິດຄລັບ",
    category: "snacks",
    sku: "FD-4001",
    price: 32000,
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "mineral-water",
    name: "ນ້ຳດື່ມ",
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
    name: "ໂຄລາກະປ໋ອງ",
    category: "beverages",
    sku: "BV-5002",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "sprite-can",
    name: "ສະໄປຣທ໌ກະປ໋ອງ",
    category: "beverages",
    sku: "BV-5003",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "orange-juice",
    name: "ນ້ຳສົ້ມ",
    category: "non-coffee",
    sku: "NC-6001",
    price: 20000,
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "green-tea",
    name: "ຊາຂຽວ",
    category: "tea",
    sku: "TE-2002",
    price: 18000,
    image:
      "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "latte-caramel",
    name: "ລາເຕ້ຄາຣາເມວ",
    category: "coffee",
    sku: "CF-1004",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1579888071069-c107a6f79d82?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "mocha",
    name: "ໂມຄາ",
    category: "coffee",
    sku: "CF-1005",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "hot-latte",
    name: "ລາເຕ້ຮ້ອນ",
    category: "coffee",
    sku: "CF-1006",
    price: 26000,
    image:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "affogato",
    name: "ອາຟໂຟກາໂຕ",
    category: "coffee",
    sku: "CF-1007",
    price: 30000,
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "flat-white",
    name: "ຟລັດໄວທ໌",
    category: "coffee",
    sku: "CF-1008",
    price: 26000,
    image:
      "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "cold-brew",
    name: "ຄອລດ໌ບຣູ",
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
    name: "ລາເຕ້ເຢັນ",
    price: 26000,
    retailPrice: 26000,
    priceType: "ຂາຍຍ່ອຍ",
    quantity: 1,
    image: products[0].image
  },
  {
    id: "cart-croissant",
    productId: "croissant",
    name: "ຄຣົວຊອງ",
    price: 18000,
    retailPrice: 18000,
    priceType: "ຂາຍຍ່ອຍ",
    quantity: 1,
    image: products[4].image,
    note: "ບໍ່ໃສ່ງາ"
  },
  {
    id: "cart-thai-tea",
    productId: "thai-milk-tea",
    name: "ຊານົມໄທ",
    price: 22000,
    retailPrice: 22000,
    priceType: "ຂາຍຍ່ອຍ",
    quantity: 1,
    image: products[3].image,
    note: "ເພີ່ມໄຂ່ມຸກ"
  }
];

export const customers: Customer[] = [
  {
    id: "CUS-0032",
    name: "ສຸກສະຫວັນ ພົມມະຈັນ",
    subtitle: "ລະຫັດສະມາຊິກ: CUS-0032",
    customerType: "VIP",
    priceList: "ລາຄາ VIP",
    debtBalance: 0,
    creditLimit: 2000000,
    paymentTerm: "ຈ່າຍທັນທີ",
    phone: "+856 20 5555 0032",
    points: 1250,
    avatar: "https://i.pravatar.cc/96?img=12"
  },
  {
    id: "CUS-0018",
    name: "ຄຳຫຼ້າ ວົງສະນາ",
    subtitle: "ລະຫັດສະມາຊິກ: CUS-0018",
    customerType: "ຂາຍສົ່ງ",
    priceList: "ລາຄາສົ່ງກາເຟ",
    debtBalance: 1850000,
    creditLimit: 8000000,
    paymentTerm: "ຈ່າຍພາຍໃນ 15 ມື້",
    phone: "+856 20 5555 0018",
    points: 680,
    avatar: "https://i.pravatar.cc/96?img=13"
  },
  {
    id: "CUS-0027",
    name: "ເພັດສະໝອນ ອິນທິລາດ",
    subtitle: "ລະຫັດສະມາຊິກ: CUS-0027",
    customerType: "ຜູ້ຂາຍຕໍ່",
    priceList: "ລາຄາຜູ້ຂາຍຕໍ່ເຄື່ອງດື່ມ",
    debtBalance: 920000,
    creditLimit: 5000000,
    paymentTerm: "ຈ່າຍພາຍໃນ 7 ມື້",
    phone: "+856 20 5555 0027",
    points: 2340,
    avatar: "https://i.pravatar.cc/96?img=14"
  },
  {
    id: "WALK-IN",
    name: "ລູກຄ້າທົ່ວໄປ",
    subtitle: "ບໍ່ມີສະມາຊິກ",
    customerType: "ຂາຍຍ່ອຍ",
    priceList: "ລາຄາຂາຍຍ່ອຍປົກກະຕິ",
    debtBalance: 0,
    creditLimit: 0,
    paymentTerm: "ຈ່າຍທັນທີ",
    points: 0,
    avatar: "https://i.pravatar.cc/96?img=15"
  }
];

export const openOrders: OpenOrder[] = [
  {
    id: "#ORD-0052",
    table: "T03",
    type: "ນັ່ງກິນທີ່ຮ້ານ",
    customer: "ລູກຄ້າທົ່ວໄປ",
    items: 3,
    amount: 85000,
    time: "10:24 AM",
    status: "ກຳລັງເຮັດ",
    cart: initialCart
  },
  {
    id: "#ORD-0051",
    table: "T05",
    type: "ນັ່ງກິນທີ່ຮ້ານ",
    customer: "ທ່ານ ຄຳຫຼ້າ",
    items: 4,
    amount: 145000,
    time: "10:10 AM",
    status: "ກຳລັງເຮັດ",
    cart: [
      { ...initialCart[0], id: "cart-0051-latte", quantity: 2 },
      { ...initialCart[1], id: "cart-0051-croissant", quantity: 1 },
      { ...initialCart[2], id: "cart-0051-tea", quantity: 1 }
    ],
    customerRecord: customers[1]
  },
  {
    id: "#ORD-0049",
    table: "ສັ່ງກັບບ້ານ",
    type: "ສັ່ງກັບບ້ານ",
    customer: "ລູກຄ້າທົ່ວໄປ",
    items: 1,
    amount: 28000,
    time: "09:41 AM",
    status: "ພັກໄວ້",
    cart: [
      {
        id: "cart-0049-mocha",
        productId: "mocha",
        name: "ໂມຄາ",
        price: 28000,
        quantity: 1,
        image: products[13].image
      }
    ]
  },
  {
    id: "#ORD-0048",
    table: "T02",
    type: "ນັ່ງກິນທີ່ຮ້ານ",
    customer: "ທ່ານ ພົງສະຫວັນ",
    items: 5,
    amount: 192000,
    time: "09:15 AM",
    status: "ພັກໄວ້",
    cart: [
      { ...initialCart[0], id: "cart-0048-latte", quantity: 2 },
      { ...initialCart[1], id: "cart-0048-croissant", quantity: 2 },
      { ...initialCart[2], id: "cart-0048-tea", quantity: 1 }
    ],
    customerRecord: customers[2]
  }
];

export const tables: DiningTable[] = [
  { id: "T01", seats: 2, area: "ພາຍໃນ", status: "ວ່າງ" },
  { id: "T02", seats: 4, area: "ພາຍໃນ", status: "ວ່າງ" },
  { id: "T03", seats: 4, area: "ພາຍໃນ", status: "ມີລູກຄ້າ", elapsed: "00:45" },
  { id: "T04", seats: 2, area: "ພາຍໃນ", status: "ວ່າງ" },
  { id: "T05", seats: 6, area: "ພາຍໃນ", status: "ມີລູກຄ້າ", elapsed: "01:15" },
  { id: "T06", seats: 4, area: "ພາຍນອກ", status: "ວ່າງ" },
  { id: "T07", seats: 2, area: "ພາຍນອກ", status: "ວ່າງ" },
  { id: "T08", seats: 4, area: "ຫ້ອງ VIP", status: "ວ່າງ" },
  { id: "T09", seats: 2, area: "ຫ້ອງ VIP", status: "ຈອງໄວ້", elapsed: "15:30" },
  { id: "T10", seats: 6, area: "ລານນອກ", status: "ວ່າງ" },
  { id: "T11", seats: 2, area: "ລານນອກ", status: "ວ່າງ" },
  { id: "T12", seats: 4, area: "ລານນອກ", status: "ວ່າງ" },
  { id: "T13", seats: 4, area: "ພາຍນອກ", status: "ວ່າງ" },
  { id: "T14", seats: 2, area: "ພາຍນອກ", status: "ມີລູກຄ້າ" },
  { id: "T15", seats: 4, area: "ພາຍໃນ", status: "ວ່າງ" }
];

export const quickActions: QuickAction[] = [
  { label: "ພັກອໍເດີ", tone: "orange", icon: Archive },
  {
    label: "ອໍເດີເປີດຢູ່",
    tone: "blue",
    icon: ClipboardList,
    href: "/open-orders"
  },
  { label: "ໂຕະ / ນັ່ງກິນ", tone: "violet", icon: Utensils },
  { label: "ເພີ່ມເຕີມ", tone: "slate", icon: Ellipsis }
];

const cafeProducts: Product[] = products.map((product) => ({
  ...product,
  posType: "cafe",
  itemType: "menu_item",
  food: {
    kitchenStation: product.category === "coffee" ? "ບາຣິສຕ້າ" : "ເຄົາເຕີ",
    hasModifiers: ["coffee", "tea", "non-coffee"].includes(product.category),
    hasToppings: ["coffee", "tea", "non-coffee"].includes(product.category),
    prepMinutes: product.category === "pastry" ? 4 : 3
  }
}));

const retailCategories: Category[] = [
  { id: "all", label: "ສິນຄ້າທັງໝົດ" },
  { id: "grocery", label: "ຂອງກິນຂອງໃຊ້" },
  { id: "drinks", label: "ເຄື່ອງດື່ມ" },
  { id: "household", label: "ຂອງໃຊ້ໃນບ້ານ" },
  { id: "beauty-care", label: "ດູແລຄວາມງາມ" },
  { id: "low-stock", label: "ຄັງສິນຄ້າຕ່ຳ" }
];

const retailProducts: Product[] = [
  {
    id: "jasmine-rice-5kg",
    name: "ເຂົ້າຫອມ 5kg",
    category: "grocery",
    posType: "retail",
    itemType: "product",
    sku: "RT-1001",
    barcode: "8851001001",
    price: 78000,
    wholesalePrice: 70000,
    resellerPrice: 68000,
    minWholesaleQuantity: 10,
    priceList: "Retail Wholesale",
    unit: "ຖົງ",
    stock: 42,
    lowStockThreshold: 12,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=360&q=80",
    retail: { supplier: "Lao Food Supply", brand: "Dok Champa", trackStock: true }
  },
  {
    id: "fish-sauce",
    name: "ນ້ຳປາ",
    category: "grocery",
    posType: "retail",
    itemType: "product",
    sku: "RT-1002",
    barcode: "8851001002",
    price: 18000,
    unit: "ຂວດ",
    stock: 8,
    lowStockThreshold: 10,
    image: "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=360&q=80",
    badge: "Low stock",
    retail: { supplier: "Vientiane Market", brand: "Golden Fish", trackStock: true }
  },
  {
    id: "laundry-detergent",
    name: "ຜົງຊັກຟອກ",
    category: "household",
    posType: "retail",
    itemType: "product",
    sku: "RT-2001",
    barcode: "8852001001",
    price: 42000,
    unit: "ແພັກ",
    stock: 25,
    lowStockThreshold: 8,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=360&q=80",
    retail: { supplier: "Home Goods Lao", trackStock: true }
  },
  {
    id: "green-tea-bottle",
    name: "ຊາຂຽວຂວດ",
    category: "drinks",
    posType: "retail",
    itemType: "product",
    sku: "RT-3001",
    barcode: "8853001001",
    price: 12000,
    wholesalePrice: 9500,
    resellerPrice: 9000,
    minWholesaleQuantity: 24,
    priceList: "Drink Reseller",
    unit: "ຂວດ",
    stock: 120,
    lowStockThreshold: 24,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=360&q=80",
    retail: { supplier: "Drink Distributor", trackStock: true }
  },
  {
    id: "shampoo",
    name: "ແຊມພູ",
    category: "beauty-care",
    posType: "retail",
    itemType: "product",
    sku: "RT-4001",
    barcode: "8854001001",
    price: 35000,
    unit: "ຂວດ",
    stock: 18,
    lowStockThreshold: 6,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=360&q=80",
    retail: { supplier: "Beauty Supply Lao", trackStock: true }
  }
];

const restaurantCategories: Category[] = [
  { id: "all", label: "ເມນູທັງໝົດ" },
  { id: "lao-food", label: "ອາຫານລາວ" },
  { id: "noodles", label: "ເສັ້ນ/ເຝີ" },
  { id: "grill", label: "ປີ້ງຍ່າງ" },
  { id: "drinks", label: "ເຄື່ອງດື່ມ" },
  { id: "sets", label: "ເມນູຊຸດ" }
];

const restaurantProducts: Product[] = [
  {
    id: "laap-beef",
    name: "ລາບຊີ້ນງົວ",
    category: "lao-food",
    posType: "restaurant",
    itemType: "menu_item",
    sku: "RS-1001",
    price: 55000,
    unit: "ຈານ",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=360&q=80",
    food: { kitchenStation: "ຄົວຮ້ອນ", hasModifiers: true, prepMinutes: 12 }
  },
  {
    id: "pho-beef",
    name: "ເຝີຊີ້ນງົວ",
    category: "noodles",
    posType: "restaurant",
    itemType: "menu_item",
    sku: "RS-2001",
    price: 38000,
    unit: "ຖ້ວຍ",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=360&q=80",
    food: { kitchenStation: "ເຝີ", hasModifiers: true, prepMinutes: 8 }
  },
  {
    id: "grilled-chicken",
    name: "ໄກ່ປີ້ງ",
    category: "grill",
    posType: "restaurant",
    itemType: "menu_item",
    sku: "RS-3001",
    price: 68000,
    unit: "ຈານ",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=360&q=80",
    food: { kitchenStation: "ປີ້ງຍ່າງ", hasModifiers: true, prepMinutes: 18 }
  },
  {
    id: "family-set",
    name: "ຊຸດຄອບຄົວ",
    category: "sets",
    posType: "restaurant",
    itemType: "menu_item",
    sku: "RS-4001",
    price: 180000,
    unit: "ຊຸດ",
    image: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=360&q=80",
    food: { kitchenStation: "ຄົວ", hasModifiers: true, prepMinutes: 20 }
  }
];

const beautyCategories: Category[] = [
  { id: "all", label: "ບໍລິການທັງໝົດ" },
  { id: "hair", label: "ບໍລິການຜົມ" },
  { id: "nails", label: "ເລັບ" },
  { id: "spa", label: "ສະປາ" },
  { id: "packages", label: "ແພັກເກດ" },
  { id: "products", label: "ສິນຄ້າ" }
];

const beautyProducts: Product[] = [
  {
    id: "hair-cut",
    name: "ຕັດຜົມ",
    category: "hair",
    posType: "beauty",
    itemType: "service",
    sku: "BT-1001",
    price: 65000,
    unit: "ຄັ້ງ",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=360&q=80",
    beauty: { durationMinutes: 45, assignedStaff: ["Noy", "Mai"], commissionRate: 10, bookingRequired: false }
  },
  {
    id: "gel-manicure",
    name: "ເຮັດເລັບເຈວ",
    category: "nails",
    posType: "beauty",
    itemType: "service",
    sku: "BT-2001",
    price: 90000,
    unit: "ຄັ້ງ",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=360&q=80",
    beauty: { durationMinutes: 60, assignedStaff: ["Phet"], commissionRate: 12, bookingRequired: true }
  },
  {
    id: "aroma-massage",
    name: "ນວດນ້ຳມັນຫອມ",
    category: "spa",
    posType: "beauty",
    itemType: "service",
    sku: "BT-3001",
    price: 180000,
    unit: "ຄັ້ງ",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=360&q=80",
    beauty: { durationMinutes: 90, assignedStaff: ["Noy"], commissionRate: 15, bookingRequired: true }
  },
  {
    id: "spa-package",
    name: "ແພັກເກດຜ່ອນຄາຍ",
    category: "packages",
    posType: "beauty",
    itemType: "service",
    sku: "BT-4001",
    price: 420000,
    unit: "ແພັກເກດ",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=360&q=80",
    beauty: { durationMinutes: 180, assignedStaff: ["Noy", "Phet"], commissionRate: 15, bookingRequired: true }
  }
];

const hospitalityCategories: Category[] = [
  { id: "all", label: "ຫ້ອງ ແລະ ບໍລິການທັງໝົດ" },
  { id: "rooms", label: "ຫ້ອງ" },
  { id: "extra-services", label: "ບໍລິການເພີ່ມ" },
  { id: "deposit", label: "ມັດຈຳ" },
  { id: "laundry", label: "ຊັກລີດ" },
  { id: "transport", label: "ລົດຮັບສົ່ງ" }
];

const hospitalityProducts: Product[] = [
  {
    id: "standard-room",
    name: "ຫ້ອງມາດຕະຖານ",
    category: "rooms",
    posType: "hospitality",
    itemType: "room",
    sku: "HT-101",
    price: 280000,
    unit: "ຄືນ",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=360&q=80",
    hospitality: { roomNumber: "101", roomType: "ມາດຕະຖານ", capacity: 2, bedType: "ຕຽງຄວີນ", roomStatus: "available", priceMode: "ຄືນ" }
  },
  {
    id: "deluxe-room",
    name: "ຫ້ອງດີລັກ",
    category: "rooms",
    posType: "hospitality",
    itemType: "room",
    sku: "HT-202",
    price: 420000,
    unit: "ຄືນ",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=360&q=80",
    hospitality: { roomNumber: "202", roomType: "ດີລັກ", capacity: 3, bedType: "ຕຽງຄິງ", roomStatus: "reserved", priceMode: "ຄືນ" }
  },
  {
    id: "airport-transfer",
    name: "ລົດຮັບສົ່ງສະໜາມບິນ",
    category: "transport",
    posType: "hospitality",
    itemType: "extra_service",
    sku: "HT-TR01",
    price: 150000,
    unit: "ຖ້ຽວ",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "laundry-service",
    name: "ບໍລິການຊັກລີດ",
    category: "laundry",
    posType: "hospitality",
    itemType: "extra_service",
    sku: "HT-LD01",
    price: 25000,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=360&q=80"
  }
];

const retailInitialCart: CartLine[] = [
  {
    id: "cart-retail-rice",
    productId: "jasmine-rice-5kg",
    name: "ເຂົ້າຫອມ 5kg",
    price: 78000,
    retailPrice: 78000,
    priceType: "ຂາຍຍ່ອຍ",
    quantity: 1,
    image: retailProducts[0].image
  }
];

const restaurantInitialCart: CartLine[] = [
  {
    id: "cart-restaurant-laap",
    productId: "laap-beef",
    name: "ລາບຊີ້ນງົວ",
    price: 55000,
    retailPrice: 55000,
    priceType: "ຂາຍຍ່ອຍ",
    quantity: 1,
    image: restaurantProducts[0].image,
    note: "ເຜັດປານກາງ"
  },
  {
    id: "cart-restaurant-pho",
    productId: "pho-beef",
    name: "ເຝີຊີ້ນງົວ",
    price: 38000,
    retailPrice: 38000,
    priceType: "ຂາຍຍ່ອຍ",
    quantity: 1,
    image: restaurantProducts[1].image
  }
];

const beautyInitialCart: CartLine[] = [
  {
    id: "cart-beauty-hair-cut",
    productId: "hair-cut",
    name: "ຕັດຜົມ",
    price: 65000,
    retailPrice: 65000,
    priceType: "ຂາຍຍ່ອຍ",
    quantity: 1,
    image: beautyProducts[0].image,
    note: "ພະນັກງານ: Noy"
  }
];

const hospitalityInitialCart: CartLine[] = [
  {
    id: "cart-hospitality-standard",
    productId: "standard-room",
    name: "ຫ້ອງມາດຕະຖານ",
    price: 280000,
    retailPrice: 280000,
    priceType: "ຂາຍຍ່ອຍ",
    quantity: 1,
    image: hospitalityProducts[0].image,
    note: "1 ຄືນ"
  }
];

function createOpenOrder({
  id,
  posType,
  type,
  table,
  customer,
  cart,
  time,
  status = "ກຳລັງເຮັດ",
  tableId,
  roomId,
  appointmentId
}: {
  id: string;
  posType: TerminalBusinessProfile["posType"];
  type: OpenOrder["type"];
  table: string;
  customer: string;
  cart: CartLine[];
  time: string;
  status?: OpenOrder["status"];
  tableId?: string | null;
  roomId?: string | null;
  appointmentId?: string | null;
}): OpenOrder {
  return {
    id,
    posType,
    orderType: type,
    type,
    table,
    tableId,
    roomId,
    appointmentId,
    customer,
    items: cart.reduce((sum, line) => sum + line.quantity, 0),
    amount: cart.reduce((sum, line) => sum + line.quantity * line.price, 0),
    time,
    status,
    cart
  };
}

const terminalBusinessProfiles: Record<string, TerminalBusinessProfile> = {
  "tj-retail-vientiane": {
    slug: "tj-retail-vientiane",
    name: "TJ Mini Mart Vientiane",
    branchName: "ເຄົາເຕີຫຼັກ",
    cashierName: "Kham P.",
    shiftName: "R001",
    posType: "retail",
    posTypeLabel: "POS ຂາຍປີກ",
    layoutTitle: "ຂາຍປີກແບບເນັ້ນ Barcode",
    layoutDescription: "ສິນຄ້າ, ແຈ້ງເຕືອນຄັງສິນຄ້າ, ລາຄາລູກຄ້າ, ຄືນສິນຄ້າ ແລະ ຊຳລະໄວທີ່ເຄົາເຕີ.",
    searchPlaceholder: "ຄົ້ນຫາສິນຄ້າ ຫຼື ສະແກນ Barcode",
    searchFilterLabel: "ສິນຄ້າທັງໝົດ",
    defaultOrderType: "ຂາຍປີກ",
    capabilities: capability({
      hasBarcode: true,
      hasInventory: true,
      hasWholesale: true,
      hasDebt: true
    }),
    categories: retailCategories,
    products: retailProducts,
    initialCart: retailInitialCart,
    openOrders: [
      createOpenOrder({
        id: "#RT-0104",
        posType: "retail",
        type: "ຂາຍປີກ",
        table: "ເຄົາເຕີ",
        customer: "ລູກຄ້າທົ່ວໄປ",
        cart: retailInitialCart,
        time: "10:18 AM"
      })
    ],
    quickActions: [
      { label: "ສະແກນ Barcode", tone: "blue", icon: ScanBarcode },
      { label: "ການຂາຍທີ່ເປີດຢູ່", tone: "blue", icon: ClipboardList, href: "/open-orders" },
      { label: "ຄືນເງິນ / ຄືນສິນຄ້າ", tone: "orange", icon: Receipt, href: "/refund" },
      { label: "ເພີ່ມເຕີມ", tone: "slate", icon: Ellipsis }
    ]
  },
  "tj-cafe-vientiane": {
    slug: "tj-cafe-vientiane",
    name: businessName,
    branchName,
    cashierName,
    shiftName,
    posType: "cafe",
    posTypeLabel: "POS ຮ້ານກາເຟ",
    layoutTitle: "ເມນູ, ຕົວເລືອກ, ໂຕະ ແລະ ສັ່ງກັບບ້ານ",
    layoutDescription: "ເມນູກາເຟ, ຕົວເລືອກເພີ່ມ, ເລືອກໂຕະໄດ້, ສົ່ງຕໍ່ໃຫ້ຜູ້ຊົງກາເຟ ແລະ ຮອງຮັບຈຸດຮັບຂອງ.",
    searchPlaceholder: "ຄົ້ນຫາເມນູ ຫຼື ຊື່ເຄື່ອງດື່ມ",
    searchFilterLabel: "ເມນູທັງໝົດ",
    defaultOrderType: "ນັ່ງກິນທີ່ຮ້ານ",
    capabilities: capability({
      hasTables: true,
      hasModifiers: true,
      hasKitchen: true,
      hasWholesale: true,
      hasDebt: true
    }),
    categories,
    products: cafeProducts,
    initialCart,
    openOrders,
    tables,
    quickActions
  },
  "tj-restaurant-vientiane": {
    slug: "tj-restaurant-vientiane",
    name: "TJ Riverside Restaurant",
    branchName: "ຫ້ອງອາຫານ",
    cashierName: "Phon S.",
    shiftName: "D001",
    posType: "restaurant",
    posTypeLabel: "POS ຮ້ານອາຫານ",
    layoutTitle: "ບໍລິການຮ້ານອາຫານແບບເນັ້ນໂຕະ",
    layoutDescription: "ແຜນຜັງໂຕະ, ແບ່ງບິນ, ຄ່າບໍລິການ, ລຳດັບອາຫານເຂົ້າຄົວ ແລະ ຄວບຄຸມນັ່ງກິນ.",
    searchPlaceholder: "ຄົ້ນຫາເມນູ ຫຼື ໂຕະ",
    searchFilterLabel: "ເມນູທັງໝົດ",
    defaultOrderType: "ນັ່ງກິນທີ່ຮ້ານ",
    capabilities: capability({
      hasTables: true,
      hasModifiers: true,
      hasKitchen: true,
      hasSplitBill: true,
      hasServiceCharge: true,
      hasDebt: true
    }),
    categories: restaurantCategories,
    products: restaurantProducts,
    initialCart: restaurantInitialCart,
    openOrders: [
      createOpenOrder({
        id: "#RS-0211",
        posType: "restaurant",
        type: "ນັ່ງກິນທີ່ຮ້ານ",
        table: "T08",
        tableId: "T08",
        customer: "ລູກຄ້າທົ່ວໄປ",
        cart: restaurantInitialCart,
        time: "07:42 PM"
      })
    ],
    tables,
    quickActions: [
      { label: "ໂຕະ / ນັ່ງກິນ", tone: "violet", icon: Utensils },
      { label: "ອໍເດີເປີດຢູ່", tone: "blue", icon: ClipboardList, href: "/open-orders" },
      { label: "ແບ່ງບິນ", tone: "orange", icon: SplitSquareHorizontal },
      { label: "ເພີ່ມເຕີມ", tone: "slate", icon: Ellipsis }
    ]
  },
  "tj-beauty-spa": {
    slug: "tj-beauty-spa",
    name: "TJ Beauty Spa",
    branchName: "ພື້ນທີ່ຮ້ານຄວາມງາມ",
    cashierName: "Noy V.",
    shiftName: "B001",
    posType: "beauty",
    posTypeLabel: "POS ຮ້ານຄວາມງາມ",
    layoutTitle: "ຊຳລະຄ່າບໍລິການ ແລະ ນັດໝາຍ",
    layoutDescription: "ບໍລິການ, ພະນັກງານ, ໄລຍະເວລາ, ແພັກເກດ/ຮອບບໍລິການ, ປະຫວັດລູກຄ້າ ແລະ ມັດຈຳ.",
    searchPlaceholder: "ຄົ້ນຫາບໍລິການ, ແພັກເກດ ຫຼື ລູກຄ້າ",
    searchFilterLabel: "ບໍລິການທັງໝົດ",
    defaultOrderType: "ບໍລິການ",
    capabilities: capability({
      hasAppointments: true,
      hasInventory: true,
      hasDebt: true
    }),
    categories: beautyCategories,
    products: beautyProducts,
    initialCart: beautyInitialCart,
    openOrders: [
      createOpenOrder({
        id: "#BT-0037",
        posType: "beauty",
        type: "ບໍລິການ",
        table: "ນັດໝາຍ",
        appointmentId: "APT-0037",
        customer: "Ms. Vilayphone",
        cart: beautyInitialCart,
        time: "02:30 PM"
      })
    ],
    quickActions: [
      { label: "ນັດໝາຍ", tone: "violet", icon: CalendarDays },
      { label: "ບໍລິການທີ່ກຳລັງເປີດ", tone: "blue", icon: ClipboardList, href: "/open-orders" },
      { label: "ລູກຄ້າ", tone: "blue", icon: CreditCard },
      { label: "ເພີ່ມເຕີມ", tone: "slate", icon: Ellipsis }
    ]
  },
  "tj-riverside-hotel": {
    slug: "tj-riverside-hotel",
    name: "TJ Riverside Hotel",
    branchName: "ໜ້າເຄົາເຕີ",
    cashierName: "Somphone K.",
    shiftName: "H001",
    posType: "hospitality",
    posTypeLabel: "POS ທີ່ພັກ/ໂຮງແຮມ",
    layoutTitle: "ຊຳລະຫ້ອງ, ການຈອງ ແລະ ບັນຊີແຂກ",
    layoutDescription: "ກະດານຫ້ອງ, ການຈອງ, ເຂົ້າພັກ/ອອກພັກ, ມັດຈຳ, ຄ່າໃຊ້ຈ່າຍເພີ່ມ ແລະ ໃບເກັບເງິນ.",
    searchPlaceholder: "ຄົ້ນຫາຫ້ອງ, ແຂກ, ການຈອງ ຫຼື ບໍລິການ",
    searchFilterLabel: "ຫ້ອງ ແລະ ບໍລິການທັງໝົດ",
    defaultOrderType: "ຫ້ອງ",
    capabilities: capability({
      hasRooms: true,
      hasCheckIn: true,
      hasDebt: true
    }),
    categories: hospitalityCategories,
    products: hospitalityProducts,
    initialCart: hospitalityInitialCart,
    openOrders: [
      createOpenOrder({
        id: "#HT-0088",
        posType: "hospitality",
        type: "ຫ້ອງ",
        table: "Room 101",
        roomId: "101",
        customer: "Mr. Khamla",
        cart: hospitalityInitialCart,
        time: "03:15 PM"
      })
    ],
    quickActions: [
      { label: "ຫ້ອງ / ເຂົ້າພັກ", tone: "violet", icon: BedDouble },
      { label: "ບັນຊີແຂກທີ່ເປີດຢູ່", tone: "blue", icon: ClipboardList, href: "/open-orders" },
      { label: "ບັນຊີແຂກ", tone: "orange", icon: Receipt },
      { label: "ເພີ່ມເຕີມ", tone: "slate", icon: Ellipsis }
    ]
  }
};

export const defaultTerminalBusiness = terminalBusinessProfiles["tj-cafe-vientiane"];

export function getTerminalBusiness(slug: string) {
  return terminalBusinessProfiles[slug] ?? defaultTerminalBusiness;
}

export const terminalBusinesses = Object.values(terminalBusinessProfiles);
