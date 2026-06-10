import {
  Archive,
  BadgePercent,
  BedDouble,
  BellRing,
  Boxes,
  Building2,
  CalendarCheck,
  CalendarDays,
  ChartNoAxesCombined,
  ChefHat,
  Clock3,
  Coffee,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  DoorOpen,
  Download,
  FileDown,
  FileSpreadsheet,
  Gift,
  GitMerge,
  HandCoins,
  HeartPulse,
  Hotel,
  History,
  LayoutDashboard,
  Map,
  Monitor,
  Package,
  PackageCheck,
  PackagePlus,
  Percent,
  Printer,
  ReceiptText,
  RefreshCcw,
  ScanLine,
  Settings,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Split,
  Sparkles,
  Store,
  Tag,
  TicketPercent,
  Upload,
  UserPlus,
  Users,
  WalletCards,
  Warehouse
} from "lucide-react";

import type { BusinessMenuKey, Kpi, QuickAction, SummaryItem, Tone } from "../types";

export const businessName = "TJ Cafe Vientiane";
export const activeBranch = "ສາຂາຫຼັກ";

type StoreType = "all" | "cafe" | "restaurant" | "retail" | "beauty" | "hospitality";

export const sidebarItems: {
  label: BusinessMenuKey;
  href: string;
  icon: typeof LayoutDashboard;
  storeTypes: StoreType[];
}[] = [
  // ─── Shared (all store types) ───────────────────────────────────────────────
  { label: "ແດຊບອດ", href: "/business-admin", icon: LayoutDashboard, storeTypes: ["all"] },
  { label: "POS", href: "/business-admin/pos", icon: Monitor, storeTypes: ["all"] },
  { label: "ອໍເດີ", href: "/business-admin/orders", icon: ClipboardList, storeTypes: ["all"] },
  { label: "ສິນຄ້າ", href: "/business-admin/items", icon: Package, storeTypes: ["all"] },
  { label: "ໝວດໝູ່", href: "/business-admin/categories", icon: Boxes, storeTypes: ["all"] },

  // ─── Cafe ───────────────────────────────────────────────────────────────────
  { label: "ແຜນຜັງໂຕະ", href: "/business-admin/tables", icon: Map, storeTypes: ["cafe", "restaurant"] },
  { label: "ຕົວເລືອກເພີ່ມ", href: "/business-admin/modifiers", icon: SlidersHorizontal, storeTypes: ["cafe"] },
  { label: "ຄິວ Barista", href: "/business-admin/barista-queue", icon: Coffee, storeTypes: ["cafe"] },
  { label: "ຈໍຮັບອໍເດີ", href: "/terminal/b/[businessSlug]/pickup-display", icon: Monitor, storeTypes: ["cafe", "restaurant"] },
  { label: "Happy Hour", href: "/business-admin/happy-hour", icon: Clock3, storeTypes: ["cafe"] },
  { label: "ພາບລວມຮ້ານກາເຟ", href: "/business-admin/cafe-daily-view", icon: ChartNoAxesCombined, storeTypes: ["cafe"] },

  // ─── Restaurant ─────────────────────────────────────────────────────────────
  { label: "ການຈອງໂຕະ", href: "/business-admin/reservations", icon: CalendarCheck, storeTypes: ["restaurant"] },
  { label: "ລຳດັບຄົວ", href: "/business-admin/kitchen-courses", icon: ChefHat, storeTypes: ["restaurant"] },
  { label: "ແຍກບິນ", href: "/business-admin/split-bill", icon: Split, storeTypes: ["restaurant"] },
  { label: "ຄ່າບໍລິການ", href: "/business-admin/service-charge", icon: Percent, storeTypes: ["restaurant"] },
  { label: "ລວມ / ຍ້າຍ", href: "/business-admin/merge-transfer-table", icon: GitMerge, storeTypes: ["restaurant"] },
  { label: "ປິດຮອບມື້", href: "/business-admin/end-of-day", icon: ReceiptText, storeTypes: ["restaurant"] },

  // ─── Beauty / Salon ─────────────────────────────────────────────────────────
  { label: "ນັດໝາຍ", href: "/business-admin/appointments", icon: CalendarCheck, storeTypes: ["beauty"] },
  { label: "ປະຕິທິນ", href: "/business-admin/calendar", icon: CalendarDays, storeTypes: ["beauty"] },
  { label: "ລູກຄ້າ Walk-in", href: "/business-admin/walk-in", icon: UserPlus, storeTypes: ["beauty"] },
  { label: "ບໍລິການ", href: "/business-admin/services", icon: Sparkles, storeTypes: ["beauty"] },
  { label: "ຕາຕະລາງພະນັກງານ", href: "/business-admin/staff-schedule", icon: CalendarDays, storeTypes: ["beauty"] },
  { label: "ແພັກເກດ", href: "/business-admin/packages", icon: Sparkles, storeTypes: ["beauty"] },
  { label: "ນະໂຍບາຍມັດຈຳ", href: "/business-admin/deposit-policy", icon: HandCoins, storeTypes: ["beauty"] },
  { label: "ພາບລວມຮ້ານຄວາມງາມ", href: "/business-admin/beauty-daily-schedule", icon: HeartPulse, storeTypes: ["beauty"] },

  // ─── Hospitality / Hotel ────────────────────────────────────────────────────
  { label: "ການຈອງ", href: "/business-admin/bookings", icon: ClipboardList, storeTypes: ["hospitality"] },
  { label: "ຫ້ອງ", href: "/business-admin/rooms", icon: BedDouble, storeTypes: ["hospitality"] },
  { label: "ປະຕິທິນຫ້ອງ", href: "/business-admin/room-calendar", icon: CalendarDays, storeTypes: ["hospitality"] },
  { label: "ຟຣອນດ໌ເດສກ໌", href: "/business-admin/front-desk", icon: Hotel, storeTypes: ["hospitality"] },
  { label: "Check-in", href: "/business-admin/check-in", icon: DoorOpen, storeTypes: ["hospitality"] },
  { label: "Check-out", href: "/business-admin/check-out", icon: CreditCard, storeTypes: ["hospitality"] },
  { label: "ແຂກ", href: "/business-admin/guests", icon: Users, storeTypes: ["hospitality"] },
  { label: "ຕັ້ງຄ່າຫ້ອງ", href: "/business-admin/room-settings", icon: Settings, storeTypes: ["hospitality"] },
  { label: "ແມ່ບ້ານ", href: "/business-admin/housekeeping", icon: ClipboardCheck, storeTypes: ["hospitality"] },
  { label: "ບັນຊີແຂກ", href: "/business-admin/guest-folio", icon: ReceiptText, storeTypes: ["hospitality"] },

  // ─── Retail & Inventory ────────────────────────────────────────────────────
  { label: "ສະຕັອກ", href: "/business-admin/inventory", icon: Warehouse, storeTypes: ["retail", "cafe", "restaurant"] },
  { label: "ການເຄື່ອນໄຫວສະຕັອກ", href: "/business-admin/stock-movements", icon: History, storeTypes: ["retail"] },
  { label: "ນັບສະຕັອກ", href: "/business-admin/stock-count", icon: ClipboardCheck, storeTypes: ["retail"] },
  { label: "ຮັບສິນຄ້າ", href: "/business-admin/goods-receiving", icon: PackagePlus, storeTypes: ["retail"] },
  { label: "ຄືນສິນຄ້າ", href: "/business-admin/returns", icon: RefreshCcw, storeTypes: ["retail"] },
  { label: "ສະຕັອກຕ່ຳ / ໃກ້ໝົດອາຍຸ", href: "/business-admin/low-stock-expiry", icon: BellRing, storeTypes: ["retail"] },
  { label: "ປ້າຍ Barcode", href: "/business-admin/barcode-labels", icon: ScanLine, storeTypes: ["retail"] },

  // ─── CRM / Marketing ────────────────────────────────────────────────────────
  { label: "ຜູ້ສະໜອງ", href: "/business-admin/suppliers", icon: Building2, storeTypes: ["retail", "cafe", "restaurant"] },
  { label: "ລູກຄ້າ", href: "/business-admin/customers", icon: Users, storeTypes: ["all"] },
  { label: "ສະສົມແຕ້ມ", href: "/business-admin/loyalty", icon: Gift, storeTypes: ["all"] },
  { label: "ໂປຣໂມຊັນ", href: "/business-admin/promotions", icon: BadgePercent, storeTypes: ["all"] },

  // ─── HR & Settings ──────────────────────────────────────────────────────────
  { label: "ພະນັກງານ", href: "/business-admin/staff", icon: UserPlus, storeTypes: ["all"] },
  { label: "ບົດບາດ ແລະ ສິດ", href: "/business-admin/roles-permissions", icon: ShieldCheck, storeTypes: ["all"] },
  { label: "ສາຂາ", href: "/business-admin/branches", icon: Store, storeTypes: ["all"] },
  { label: "ລາຍງານ", href: "/business-admin/reports", icon: ChartNoAxesCombined, storeTypes: ["all"] },
  { label: "ໃບຮັບເງິນ / ບິນ", href: "/business-admin/receipt-bill", icon: ReceiptText, storeTypes: ["all"] },
  { label: "ແບຣນດ໌", href: "/business-admin/branding", icon: Sparkles, storeTypes: ["all"] },
  { label: "ວິທີຊຳລະ", href: "/business-admin/payment-methods", icon: CreditCard, storeTypes: ["all"] },
  { label: "ອຸປະກອນ", href: "/business-admin/devices", icon: Printer, storeTypes: ["all"] },
  { label: "ໂມດູນ", href: "/business-admin/modules", icon: ScanLine, storeTypes: ["all"] },
  { label: "ນຳເຂົ້າ / ສົ່ງອອກ", href: "/business-admin/import", icon: Upload, storeTypes: ["all"] },
  { label: "ຊ່ວຍເຫຼືອ", href: "/business-admin/support", icon: BellRing, storeTypes: ["all"] },
  { label: "ບັນທຶກກວດສອບ", href: "/business-admin/audit-logs", icon: ClipboardCheck, storeTypes: ["all"] },
  { label: "ຕັ້ງຄ່າ", href: "/business-admin/settings", icon: Settings, storeTypes: ["all"] }
];

export const toneClasses: Record<
  Tone,
  { soft: string; text: string; border: string; solid: string }
> = {
  blue: {
    soft: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    solid: "bg-blue-600"
  },
  emerald: {
    soft: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
    solid: "bg-emerald-500"
  },
  amber: {
    soft: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
    solid: "bg-amber-500"
  },
  red: {
    soft: "bg-red-50",
    text: "text-red-600",
    border: "border-red-100",
    solid: "bg-red-500"
  },
  violet: {
    soft: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-100",
    solid: "bg-violet-500"
  },
  cyan: {
    soft: "bg-cyan-50",
    text: "text-cyan-600",
    border: "border-cyan-100",
    solid: "bg-cyan-500"
  },
  slate: {
    soft: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-100",
    solid: "bg-slate-600"
  }
};

export const itemImages = [
  "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1562967915-92ae0c320a01?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=120&q=80"
];

export const dashboardKpis: Kpi[] = [
  {
    label: "Today's Sales",
    value: "LAK 8,950,000",
    change: "+18.6% vs yesterday",
    tone: "blue",
    icon: WalletCards
  },
  {
    label: "Orders Today",
    value: "186",
    change: "+12.3% vs yesterday",
    tone: "emerald",
    icon: ReceiptText
  },
  {
    label: "Average Order Value",
    value: "LAK 48,118",
    change: "+5.7% vs yesterday",
    tone: "violet",
    icon: ShoppingCart
  },
  {
    label: "Low Stock Alerts",
    value: "12",
    change: "3 new alerts",
    tone: "amber",
    icon: PackageCheck
  },
  {
    label: "Active Customers",
    value: "1,245",
    change: "+9.8% vs last 7 days",
    tone: "cyan",
    icon: Users
  },
  {
    label: "Staff on Shift",
    value: "8 / 12",
    change: "8 present, 4 scheduled",
    tone: "blue",
    icon: UserPlus
  }
];

export const pageKpis: Record<string, Kpi[]> = {
  items: [
    {
      label: "Total Items",
      value: "342",
      change: "+18 this month",
      tone: "blue",
      icon: Package
    },
    {
      label: "Active Items",
      value: "298",
      change: "87.1% of total",
      tone: "emerald",
      icon: PackageCheck
    },
    {
      label: "Low Stock Items",
      value: "17",
      change: "Needs attention",
      tone: "amber",
      icon: BellRing
    },
    {
      label: "Out of Stock Items",
      value: "6",
      change: "Currently out",
      tone: "red",
      icon: Archive
    },
    {
      label: "Inventory Value",
      value: "LAK 52,430,000",
      change: "Across all branches",
      tone: "violet",
      icon: Warehouse
    }
  ],
  customers: [
    {
      label: "Total Customers",
      value: "1,248",
      change: "+15.6% vs last 30 days",
      tone: "violet",
      icon: Users
    },
    {
      label: "Active Members",
      value: "842",
      change: "+12.3% vs last 30 days",
      tone: "emerald",
      icon: ShieldCheck
    },
    {
      label: "Points Earned",
      value: "158,320",
      change: "+18.7% vs last 30 days",
      tone: "blue",
      icon: Gift
    },
    {
      label: "Total Spend",
      value: "LAK 85,430,000",
      change: "+10.8% this month",
      tone: "amber",
      icon: ShoppingCart
    },
    {
      label: "New Customers",
      value: "36",
      change: "+28.6% this month",
      tone: "red",
      icon: UserPlus
    }
  ],
  promotions: [
    {
      label: "Active Promotions",
      value: "18",
      change: "+12.5% vs last 30 days",
      tone: "emerald",
      icon: BadgePercent
    },
    {
      label: "Scheduled Promotions",
      value: "7",
      change: "+16.7% vs last 30 days",
      tone: "blue",
      icon: ClipboardList
    },
    {
      label: "Expired Promotions",
      value: "32",
      change: "-18.4% vs last 30 days",
      tone: "amber",
      icon: History
    },
    {
      label: "Total Redemptions",
      value: "2,458",
      change: "+14.6% vs last 30 days",
      tone: "violet",
      icon: TicketPercent
    },
    {
      label: "Discount Given",
      value: "LAK 56,420,000",
      change: "+22.3% vs last 30 days",
      tone: "cyan",
      icon: Percent
    }
  ],
  branches: [
    {
      label: "Total Branches",
      value: "4",
      change: "3 active locations",
      tone: "blue",
      icon: Store
    },
    {
      label: "Open Today",
      value: "3",
      change: "Main, Sihom, Pakse",
      tone: "emerald",
      icon: ClipboardCheck
    },
    {
      label: "Staff Assigned",
      value: "42",
      change: "Across branches",
      tone: "violet",
      icon: Users
    },
    {
      label: "Weekly Sales",
      value: "LAK 97,390,000",
      change: "+13.8% vs last week",
      tone: "amber",
      icon: ChartNoAxesCombined
    }
  ],
  stock: [
    {
      label: "Stock Value",
      value: "LAK 52,430,000",
      change: "Across all branches",
      tone: "blue",
      icon: Warehouse
    },
    {
      label: "Stock In Today",
      value: "84",
      change: "18 purchase lines",
      tone: "emerald",
      icon: PackagePlus
    },
    {
      label: "Adjustments",
      value: "12",
      change: "This week",
      tone: "amber",
      icon: RefreshCcw
    },
    {
      label: "Critical Items",
      value: "6",
      change: "Needs reorder",
      tone: "red",
      icon: BellRing
    }
  ],
  suppliers: [
    {
      label: "Total Suppliers",
      value: "48",
      change: "12 preferred",
      tone: "blue",
      icon: Building2
    },
    {
      label: "Active POs",
      value: "16",
      change: "LAK 23.4M pending",
      tone: "emerald",
      icon: ClipboardList
    },
    {
      label: "Due Payments",
      value: "LAK 7,850,000",
      change: "5 invoices",
      tone: "amber",
      icon: HandCoins
    },
    {
      label: "On-time Delivery",
      value: "94%",
      change: "+3.1% this month",
      tone: "violet",
      icon: ClipboardCheck
    }
  ],
  staff: [
    {
      label: "Total Staff",
      value: "42",
      change: "8 on shift now",
      tone: "blue",
      icon: Users
    },
    {
      label: "Managers",
      value: "6",
      change: "Across 4 branches",
      tone: "violet",
      icon: ShieldCheck
    },
    {
      label: "Cashiers",
      value: "18",
      change: "12 active today",
      tone: "emerald",
      icon: WalletCards
    },
    {
      label: "Pending Invites",
      value: "3",
      change: "Sent this week",
      tone: "amber",
      icon: UserPlus
    }
  ],
  loyalty: [
    {
      label: "Active Members",
      value: "842",
      change: "+12.3% this month",
      tone: "emerald",
      icon: Users
    },
    {
      label: "Points Issued",
      value: "158,320",
      change: "+18.7% this month",
      tone: "blue",
      icon: Gift
    },
    {
      label: "Rewards Claimed",
      value: "1,128",
      change: "+9.4% this month",
      tone: "violet",
      icon: TicketPercent
    },
    {
      label: "Discount Value",
      value: "LAK 12,450,000",
      change: "Customer rewards",
      tone: "amber",
      icon: Percent
    }
  ]
};

export const items = [
  [
    "ລາເຕ້ເຢັນ",
    "ກາເຟລາເຕ້",
    "CF-1001",
    "Coffee",
    "LAK 25,000",
    "48",
    "ເປີດໃຊ້",
    "ສາຂາຫຼັກ",
    itemImages[0]
  ],
  [
    "Hot Cappuccino",
    "ກາເຟຄາປູຊິໂນ",
    "CF-1002",
    "Coffee",
    "LAK 22,000",
    "36",
    "ເປີດໃຊ້",
    "ທຸກສາຂາ",
    itemImages[1]
  ],
  [
    "Butter Croissant",
    "ຄົວຊອງເນີຍ",
    "BK-2001",
    "Bakery",
    "LAK 18,000",
    "22",
    "ເປີດໃຊ້",
    "ທຸກສາຂາ",
    itemImages[2]
  ],
  [
    "Ham & Cheese Sandwich",
    "ແຊນວິດແຮມຊີສ",
    "FD-3001",
    "ອາຫານ",
    "LAK 32,000",
    "15",
    "ເປີດໃຊ້",
    "ທຸກສາຂາ",
    itemImages[3]
  ],
  [
    "Larb Chicken",
    "ລາບໄກ່",
    "FD-3002",
    "ອາຫານ",
    "LAK 30,000",
    "9",
    "ເປີດໃຊ້",
    "TJ Cafe Vientiane",
    itemImages[4]
  ],
  [
    "Fresh Orange Juice",
    "ນ້ຳສົ້ມຄັ້ນສົດ",
    "DR-4001",
    "Drinks",
    "LAK 20,000",
    "0",
    "ເປີດໃຊ້",
    "ທຸກສາຂາ",
    itemImages[5]
  ],
  [
    "Mineral Water 500ml",
    "ນ້ຳດື່ມ 500ml",
    "DR-4002",
    "Drinks",
    "LAK 7,000",
    "120",
    "ເປີດໃຊ້",
    "ທຸກສາຂາ",
    itemImages[6]
  ],
  [
    "Matcha Green Tea",
    "ຊາມັດທະ",
    "DR-4003",
    "Drinks",
    "LAK 26,000",
    "8",
    "ເປີດໃຊ້",
    "TJ Cafe Pakse",
    itemImages[7]
  ]
];

export const customers = [
  [
    "Phonexay Silavong",
    "CUS-0001",
    "020 5555 1234",
    "Gold",
    "12,450",
    "LAK 8,450,000",
    "28",
    "ເປີດໃຊ້",
    "PS"
  ],
  [
    "Nouthida Thongmixay",
    "CUS-0002",
    "020 5566 8899",
    "Silver",
    "6,820",
    "LAK 4,230,000",
    "16",
    "ເປີດໃຊ້",
    "NT"
  ],
  [
    "Khamla Philavong",
    "CUS-0003",
    "020 2233 4455",
    "Gold",
    "15,200",
    "LAK 12,680,000",
    "42",
    "ເປີດໃຊ້",
    "KP"
  ],
  [
    "Somsack Vongsavanh",
    "CUS-0004",
    "020 5599 7788",
    "Bronze",
    "1,250",
    "LAK 980,000",
    "5",
    "ເປີດໃຊ້",
    "SV"
  ],
  [
    "Bounleuth Luangxay",
    "CUS-0005",
    "020 5678 3344",
    "Silver",
    "7,560",
    "LAK 5,120,000",
    "18",
    "ເປີດໃຊ້",
    "BL"
  ],
  [
    "Manivanh Phothisane",
    "CUS-0006",
    "020 9888 1122",
    "Gold",
    "10,300",
    "LAK 7,430,000",
    "24",
    "ເປີດໃຊ້",
    "MP"
  ],
  [
    "Touline Xayyaseng",
    "CUS-0007",
    "020 5544 6677",
    "Bronze",
    "850",
    "LAK 620,000",
    "3",
    "ປິດໃຊ້",
    "TL"
  ],
  [
    "Phetsamone Inthavong",
    "CUS-0008",
    "020 9977 8899",
    "Silver",
    "5,600",
    "LAK 3,980,000",
    "11",
    "ເປີດໃຊ້",
    "PI"
  ]
];

export const itemPriceProfiles = [
  {
    retailPrice: "LAK 25,000",
    wholesalePrice: "LAK 21,000",
    resellerPrice: "LAK 20,000",
    minWholesaleQty: "12",
    priceList: "ລາຄາສົ່ງຮ້ານກາເຟ"
  },
  {
    retailPrice: "LAK 22,000",
    wholesalePrice: "LAK 18,500",
    resellerPrice: "LAK 17,800",
    minWholesaleQty: "12",
    priceList: "ລາຄາສົ່ງຮ້ານກາເຟ"
  },
  {
    retailPrice: "LAK 18,000",
    wholesalePrice: "LAK 15,000",
    resellerPrice: "LAK 14,500",
    minWholesaleQty: "24",
    priceList: "Bakery Reseller"
  },
  {
    retailPrice: "LAK 32,000",
    wholesalePrice: "LAK 28,000",
    resellerPrice: "LAK 26,500",
    minWholesaleQty: "10",
    priceList: "Lunch Box"
  },
  {
    retailPrice: "LAK 30,000",
    wholesalePrice: "LAK 26,000",
    resellerPrice: "LAK 25,000",
    minWholesaleQty: "10",
    priceList: "Food Reseller"
  },
  {
    retailPrice: "LAK 20,000",
    wholesalePrice: "LAK 16,500",
    resellerPrice: "LAK 15,500",
    minWholesaleQty: "24",
    priceList: "Beverage Wholesale"
  },
  {
    retailPrice: "LAK 7,000",
    wholesalePrice: "LAK 5,500",
    resellerPrice: "LAK 5,200",
    minWholesaleQty: "48",
    priceList: "Beverage Wholesale"
  },
  {
    retailPrice: "LAK 26,000",
    wholesalePrice: "LAK 22,000",
    resellerPrice: "LAK 21,000",
    minWholesaleQty: "12",
    priceList: "ລາຄາສົ່ງຮ້ານກາເຟ"
  }
];

export const customerWholesaleProfiles = [
  {
    customerType: "VIP",
    priceList: "ລາຄາ VIP",
    debtBalance: "LAK 0",
    creditLimit: "LAK 2,000,000",
    paymentTerm: "Pay now",
    debtStatus: "ປົກກະຕິ"
  },
  {
    customerType: "ລູກຄ້າຂາຍຍ່ອຍ",
    priceList: "ລາຄາຂາຍຍ່ອຍພື້ນຖານ",
    debtBalance: "LAK 0",
    creditLimit: "LAK 0",
    paymentTerm: "Pay now",
    debtStatus: "ປົກກະຕິ"
  },
  {
    customerType: "ລູກຄ້າຂາຍສົ່ງ",
    priceList: "ລາຄາສົ່ງຮ້ານກາເຟ",
    debtBalance: "LAK 1,850,000",
    creditLimit: "LAK 8,000,000",
    paymentTerm: "Net 15",
    debtStatus: "ຈ່າຍບາງສ່ວນ"
  },
  {
    customerType: "ຜູ້ຂາຍຕໍ່",
    priceList: "ລາຄາຜູ້ຂາຍຕໍ່ເຄື່ອງດື່ມ",
    debtBalance: "LAK 920,000",
    creditLimit: "LAK 5,000,000",
    paymentTerm: "Net 7",
    debtStatus: "ຕິດໜີ້"
  },
  {
    customerType: "ລູກຄ້າຂາຍສົ່ງ",
    priceList: "ລາຄາສົ່ງເບເກີຣີ",
    debtBalance: "LAK 0",
    creditLimit: "LAK 6,000,000",
    paymentTerm: "Net 15",
    debtStatus: "ປົກກະຕິ"
  },
  {
    customerType: "VIP",
    priceList: "ລາຄາ VIP",
    debtBalance: "LAK 0",
    creditLimit: "LAK 2,000,000",
    paymentTerm: "Pay now",
    debtStatus: "ປົກກະຕິ"
  },
  {
    customerType: "ລູກຄ້າຂາຍຍ່ອຍ",
    priceList: "ລາຄາຂາຍຍ່ອຍພື້ນຖານ",
    debtBalance: "LAK 0",
    creditLimit: "LAK 0",
    paymentTerm: "Pay now",
    debtStatus: "ປົກກະຕິ"
  },
  {
    customerType: "ຜູ້ຂາຍຕໍ່",
    priceList: "Retail Partner",
    debtBalance: "LAK 420,000",
    creditLimit: "LAK 3,000,000",
    paymentTerm: "Net 7",
    debtStatus: "ຈ່າຍບາງສ່ວນ"
  }
];

export const promotions = [
  [
    "Happy Hour 15% Off Drinks",
    "Time-based",
    "All Customers",
    "15% off",
    "May 1 - May 31, 2025",
    "342 / 1,000",
    "ເປີດໃຊ້",
    "ທຸກສາຂາ"
  ],
  [
    "Buy 1 Get 1 Free Coffee",
    "BOGO",
    "All Customers",
    "BOGO",
    "May 10 - May 24, 2025",
    "128 / 300",
    "ເປີດໃຊ້",
    "ທຸກສາຂາ"
  ],
  [
    "Student 10% Discount",
    "ເປີເຊັນ",
    "Students",
    "10% off",
    "Apr 20 - May 31, 2025",
    "256 / ∞",
    "ເປີດໃຊ້",
    "ທຸກສາຂາ"
  ],
  [
    "Mother's Day Special",
    "Fixed Amount",
    "All Customers",
    "LAK 20,000 off",
    "May 8 - May 12, 2025",
    "215 / 250",
    "Expired",
    "ທຸກສາຂາ"
  ],
  [
    "Weekend Combo Deal",
    "Bundle",
    "All Customers",
    "15% off set menu",
    "May 3 - May 31, 2025",
    "89 / 500",
    "ເປີດໃຊ້",
    "ສາຂາຫຼັກ"
  ],
  [
    "New Customer 20% Off",
    "ເປີເຊັນ",
    "New Customers",
    "20% off",
    "May 1 - May 31, 2025",
    "178 / 400",
    "ເປີດໃຊ້",
    "ທຸກສາຂາ"
  ],
  [
    "Iced Latte Day",
    "Flash Sale",
    "All Customers",
    "25% off",
    "May 20, 2025",
    "0 / 200",
    "Scheduled",
    "ສາຂາຫຼັກ"
  ],
  [
    "VIP Members Double Points",
    "Loyalty Bonus",
    "VIP Members",
    "2x Points",
    "May 18 - May 25, 2025",
    "-",
    "Scheduled",
    "ທຸກສາຂາ"
  ]
];

export const branches = [
  [
    "ສາຂາຫຼັກ",
    "Vientiane Center",
    "Sisattanak, Vientiane",
    "020 5555 1234",
    "Open",
    "LAK 56,420,000",
    "18 staff"
  ],
  [
    "ສາຂາສີຫອມ",
    "Sihom Cafe",
    "Chanthabouly, Vientiane",
    "020 5599 7788",
    "Open",
    "LAK 18,750,000",
    "9 staff"
  ],
  [
    "Pakse Branch",
    "TJ Cafe Pakse",
    "Pakxe, Champasak",
    "020 2255 8899",
    "Open",
    "LAK 9,240,000",
    "7 staff"
  ],
  [
    "ສາຂາທ່າດົງ",
    "TJ Mini Cafe",
    "Xaysettha, Vientiane",
    "020 5577 3311",
    "Closed",
    "LAK 12,980,000",
    "8 staff"
  ]
];

export const suppliers = [
  [
    "Lao Coffee Supply",
    "ເມັດກາເຟ",
    "020 5588 1212",
    "LAK 4,200,000",
    "ເປີດໃຊ້",
    "18 ພຶດສະພາ 2025"
  ],
  [
    "Vientiane Fresh Milk",
    "Dairy",
    "020 5521 4455",
    "LAK 1,850,000",
    "ເປີດໃຊ້",
    "May 17, 2025"
  ],
  [
    "Mekong Bakery Co.",
    "Bakery",
    "020 5533 9988",
    "LAK 3,120,000",
    "ເປີດໃຊ້",
    "May 16, 2025"
  ],
  [
    "BCEL Merchant Services",
    "Payment",
    "021 222 222",
    "LAK 0",
    "ເປີດໃຊ້",
    "May 15, 2025"
  ],
  [
    "Pakse Produce Market",
    "Fresh Produce",
    "020 2299 7788",
    "LAK 2,950,000",
    "Paused",
    "May 14, 2025"
  ]
];

export const staff = [
  [
    "Somchai Phommaseanh",
    "Owner",
    "ສາຂາຫຼັກ",
    "Full Access",
    "Online",
    "Today 10:24 AM"
  ],
  [
    "Ketsana Vongdala",
    "Manager",
    "ສາຂາສີຫອມ",
    "Manager",
    "Online",
    "Today 10:18 AM"
  ],
  [
    "Anousone Keomany",
    "Cashier",
    "ສາຂາຫຼັກ",
    "POS Only",
    "On Shift",
    "Today 09:58 AM"
  ],
  [
    "Mayphone Souliyavong",
    "Barista",
    "ສາຂາຫຼັກ",
    "ພະນັກງານ",
    "On Shift",
    "Today 09:40 AM"
  ],
  [
    "Daovone Phanthavong",
    "ສະຕັອກ",
    "Pakse Branch",
    "ສະຕັອກ",
    "Offline",
    "Yesterday 06:12 PM"
  ]
];

export const stockMovements = [
  [
    "SM-50018",
    "ລາເຕ້ເຢັນ",
    "Stock In",
    "+120",
    "ສາຂາຫຼັກ",
    "Lao Coffee Supply",
    "18 ພຶດສະພາ 2025"
  ],
  [
    "SM-50017",
    "ນົມສົດ 1L",
    "Adjustment",
    "-6",
    "ສາຂາຫຼັກ",
    "Damaged",
    "18 ພຶດສະພາ 2025"
  ],
  [
    "SM-50016",
    "ຄຣົວຊອງ",
    "Stock Out",
    "-42",
    "ສາຂາສີຫອມ",
    "Sales",
    "May 17, 2025"
  ],
  [
    "SM-50015",
    "ຈອກເຈ້ຍ 12oz",
    "Stock In",
    "+500",
    "ທຸກສາຂາ",
    "Mekong Packaging",
    "May 17, 2025"
  ],
  [
    "SM-50014",
    "ນ້ຳເຊື່ອມນ້ຳຕານແດງ",
    "Adjustment",
    "-2",
    "ສາຂາຫຼັກ",
    "Expired",
    "May 16, 2025"
  ]
];

export const purchaseReceipts = [
  [
    "PR-00218",
    "Lao Coffee Supply",
    "LAK 4,200,000",
    "8 items",
    "Received",
    "18 ພຶດສະພາ 2025"
  ],
  [
    "PR-00217",
    "Vientiane Fresh Milk",
    "LAK 1,850,000",
    "4 items",
    "Received",
    "May 17, 2025"
  ],
  [
    "PR-00216",
    "Mekong Bakery Co.",
    "LAK 3,120,000",
    "12 items",
    "Partially Received",
    "May 16, 2025"
  ],
  [
    "PR-00215",
    "Pakse Produce Market",
    "LAK 2,950,000",
    "9 items",
    "ລໍຖ້າ",
    "May 15, 2025"
  ]
];

export const dashboardSummary: SummaryItem[] = [
  { label: "ຍອດຂາຍລວມ (ອາທິດນີ້)", value: "LAK 56,420,000", tone: "blue" },
  { label: "ພາສີທີ່ເກັບໄດ້", value: "LAK 3,985,000", tone: "emerald" },
  { label: "ສ່ວນຫຼຸດທີ່ໃຫ້", value: "LAK 1,125,000", tone: "amber" },
  { label: "ການຄືນເງິນ", value: "LAK 320,000", tone: "red" },
  { label: "ຍອດຂາຍສຸດທິ", value: "LAK 51,310,000", tone: "blue" }
];

export const defaultQuickActions: QuickAction[] = [
  {
    label: "New Sale",
    description: "Start a new sale",
    icon: Monitor,
    href: "/business-admin/pos",
    tone: "blue"
  },
  {
    label: "ສ້າງ Order",
    description: "Create a new order",
    icon: ReceiptText,
    href: "/business-admin/orders",
    tone: "emerald"
  },
  {
    label: "Add Item",
    description: "Add new item",
    icon: Tag,
    href: "/business-admin/items/create",
    tone: "blue"
  },
  {
    label: "Add Customer",
    description: "Register new customer",
    icon: UserPlus,
    href: "/business-admin/customers",
    tone: "violet"
  },
  {
    label: "Adjust Stock",
    description: "Update inventory",
    icon: PackagePlus,
    href: "/business-admin/stock-adjustment",
    tone: "amber"
  },
  {
    label: "Create Promotion",
    description: "Launch promotion",
    icon: BadgePercent,
    href: "/business-admin/promotions",
    tone: "red"
  },
  {
    label: "View Reports",
    description: "Business insights",
    icon: ChartNoAxesCombined,
    href: "/business-admin/reports",
    tone: "cyan"
  }
];

export const importExportActions: QuickAction[] = [
  {
    label: "Import Items",
    description: "Upload XLSX or CSV",
    icon: Upload,
    tone: "blue"
  },
  {
    label: "Export Customers",
    description: "Download customer list",
    icon: Download,
    tone: "emerald"
  },
  {
    label: "Download Template",
    description: "Get a clean import file",
    icon: FileSpreadsheet,
    tone: "amber"
  },
  {
    label: "Export PDF",
    description: "Create printable report",
    icon: FileDown,
    tone: "violet"
  }
];
