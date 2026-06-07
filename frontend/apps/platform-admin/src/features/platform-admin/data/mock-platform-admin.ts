import {
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Package,
  Puzzle,
  ReceiptText,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Ticket,
  Users,
  WalletCards
} from "lucide-react";

import type { AdminNavItem, Business, SimpleRecord, StatCard } from "../types";

export const adminUser = {
  name: "Somchai Phommasenh",
  role: "Platform Admin",
  email: "somchai@tjpos.la",
  avatarUrl:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80"
};

export const adminNavItems: AdminNavItem[] = [
  {
    href: "/platform-admin/dashboard",
    label: "ແດຊບອດ",
    icon: LayoutDashboard,
    match: ["/platform-admin", "/platform-admin/dashboard"]
  },
  {
    href: "/platform-admin/businesses",
    label: "ທຸລະກິດ",
    icon: Building2,
    match: ["/platform-admin/businesses"]
  },
  {
    href: "/platform-admin/users",
    label: "ເຈົ້າຂອງ / ຜູ້ໃຊ້",
    icon: Users,
    match: ["/platform-admin/users"]
  },
  {
    href: "/platform-admin/plans",
    label: "ແພັກເກດ",
    icon: WalletCards,
    match: ["/platform-admin/plans"]
  },
  {
    href: "/platform-admin/subscriptions",
    label: "ການສະໝັກໃຊ້",
    icon: FileCheck2,
    match: ["/platform-admin/subscriptions"]
  },
  {
    href: "/platform-admin/add-ons",
    label: "ໂມດູນເສີມ",
    icon: Puzzle,
    match: ["/platform-admin/add-ons"]
  },
  {
    href: "/platform-admin/payments",
    label: "ການຊຳລະເງິນ",
    icon: CreditCard,
    match: ["/platform-admin/payments"]
  },
  {
    href: "/platform-admin/contact-requests",
    label: "ຄຳຂໍຕິດຕໍ່",
    icon: Mail,
    match: ["/platform-admin/contact-requests"]
  },
  {
    href: "/platform-admin/support-tickets",
    label: "ຕິດຕາມການຊ່ວຍເຫຼືອ",
    icon: Ticket,
    match: ["/platform-admin/support-tickets"]
  },
  {
    href: "/platform-admin/add-ons/catalog",
    label: "ໂມດູນກາງ",
    icon: SlidersHorizontal,
    match: ["/platform-admin/add-ons/catalog"]
  },
  {
    href: "/platform-admin/payments/settings",
    label: "ຕັ້ງຄ່າການຊຳລະຫຼັກ",
    icon: ReceiptText,
    match: ["/platform-admin/payments/settings"]
  },
  {
    href: "/platform-admin/system-settings/notification-templates",
    label: "ແມ່ແບບແຈ້ງເຕືອນ",
    icon: Bell,
    match: ["/platform-admin/system-settings/notification-templates"]
  },
  {
    href: "/platform-admin/audit-logs",
    label: "ບັນທຶກການກວດສອບ",
    icon: ShieldCheck,
    match: ["/platform-admin/audit-logs"]
  },
  {
    href: "/platform-admin/system-settings",
    label: "ຕັ້ງຄ່າ Platform",
    icon: Settings,
    match: ["/platform-admin/system-settings", "/platform-admin/profile-security"]
  }
];

export const dashboardStats: StatCard[] = [
  {
    label: "ທຸລະກິດທັງໝົດ",
    value: "1,256",
    change: "↑ 12.4% ຈາກອາທິດກ່ອນ",
    tone: "blue",
    icon: Building2
  },
  {
    label: "ການສະໝັກໃຊ້ທີ່ໃຊ້ງານ",
    value: "1,102",
    change: "↑ 9.8% ຈາກອາທິດກ່ອນ",
    tone: "green",
    icon: CheckCircle2
  },
  {
    label: "ລາຍຮັບປະຈຳເດືອນ",
    value: "K 1,256,000,000",
    change: "↑ 15.3% ຈາກເດືອນກ່ອນ",
    tone: "purple",
    icon: Package
  },
  {
    label: "ຕິດຕາມການຊ່ວຍເຫຼືອເປີດຢູ່",
    value: "48",
    change: "↘ 8.5% ຈາກອາທິດກ່ອນ",
    tone: "orange",
    icon: LifeBuoy
  }
];

export const businessStats: StatCard[] = [
  dashboardStats[0],
  {
    label: "ທຸລະກິດໃຊ້ງານ",
    value: "1,102",
    change: "↑ 9.8% ຈາກອາທິດກ່ອນ",
    tone: "green",
    icon: CheckCircle2
  },
  {
    label: "ທຸລະກິດທົດລອງ",
    value: "98",
    change: "↑ 6.3% ຈາກອາທິດກ່ອນ",
    tone: "purple",
    icon: CalendarDays
  },
  {
    label: "ທຸລະກິດຖືກລະງັບ",
    value: "56",
    change: "↓ 4.2% ຈາກອາທິດກ່ອນ",
    tone: "orange",
    icon: ShieldCheck
  }
];

export const businesses: Business[] = [
  {
    id: "BUS-001",
    name: "Joma Bakery Cafe",
    location: "Vientiane Capital",
    type: "ຮ້ານກາເຟ",
    owner: "Khamla Vongsa",
    ownerEmail: "khamla@jomabakery.la",
    logoUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=96&q=80",
    ownerAvatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=96&q=80",
    branches: 3,
    plan: "Pro",
    status: "active",
    lastActivity: "10:24 AM\nMay 18, 2025",
    joinedOn: "May 18, 2025"
  },
  {
    id: "BUS-002",
    name: "ViengTiane Coffee",
    location: "Vientiane Capital",
    type: "ຮ້ານກາເຟ",
    owner: "Somkheo Phan",
    ownerEmail: "somkheo@vtcoffee.la",
    logoUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=96&q=80",
    ownerAvatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80",
    branches: 2,
    plan: "Business",
    status: "active",
    lastActivity: "9:41 AM\nMay 18, 2025",
    joinedOn: "May 17, 2025"
  },
  {
    id: "BUS-003",
    name: "Paksan Laos",
    location: "Bolikhamxay",
    type: "ຮ້ານຄ້າ",
    owner: "Bounleu Saysayone",
    ownerEmail: "bounleu@paksanlao.la",
    logoUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=96&q=80",
    ownerAvatarUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=96&q=80",
    branches: 1,
    plan: "Enterprise",
    status: "active",
    lastActivity: "Yesterday\n8:15 PM",
    joinedOn: "May 17, 2025"
  },
  {
    id: "BUS-004",
    name: "BFL Group",
    location: "Vientiane Capital",
    type: "ຮ້ານຄ້າ",
    owner: "Pheng Phetsouvanh",
    ownerEmail: "pheng@bflgroup.la",
    logoUrl:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=96&q=80",
    ownerAvatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&q=80",
    branches: 8,
    plan: "Pro",
    status: "active",
    lastActivity: "May 16, 2025\n5:32 PM",
    joinedOn: "May 16, 2025"
  },
  {
    id: "BUS-005",
    name: "Sabai Dee Hotel",
    location: "Vientiane Capital",
    type: "ໂຮງແຮມ / ບໍລິການ",
    owner: "Vilaykham S.",
    ownerEmail: "vilaykham@sabaideehotel.la",
    logoUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=96&q=80",
    ownerAvatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80",
    branches: 2,
    plan: "Business",
    status: "trial",
    lastActivity: "May 16, 2025\n11:02 AM",
    joinedOn: "May 16, 2025"
  },
  {
    id: "BUS-006",
    name: "Beauty Up Salon",
    location: "Savannakhet Province",
    type: "ຄວາມງາມ",
    owner: "Nittaya Khamphou",
    ownerEmail: "nittaya@beautyup.la",
    logoUrl:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=96&q=80",
    ownerAvatarUrl:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=96&q=80",
    branches: 1,
    plan: "Starter",
    status: "suspended",
    lastActivity: "May 15, 2025\n4:20 PM",
    joinedOn: "May 14, 2025"
  }
];

export const requests: SimpleRecord[] = [
  {
    id: "REQ-2025-118",
    title: "ສົນໃຈລະບົບສຳລັບທຸລະກິດໃໝ່",
    subtitle: "Vientiane Capital",
    status: "new",
    meta: "May 18, 2025, 10:24 AM"
  },
  {
    id: "REQ-2025-117",
    title: "ສອບຖາມເລື່ອງລາຄາ",
    subtitle: "Savannakhet Province",
    status: "new",
    meta: "May 18, 2025, 09:03 AM"
  },
  {
    id: "REQ-2025-116",
    title: "ຂໍເພີ່ມຟີເຈີ",
    subtitle: "Luang Prabang Province",
    status: "inProgress",
    meta: "May 17, 2025, 03:25 PM"
  }
];

export const tickets: SimpleRecord[] = [
  {
    id: "TK-2025-118",
    title: "Printer ບໍ່ພິມບິນ",
    subtitle: "Joma Bakery Cafe",
    status: "inProgress",
    meta: "ຄວາມສຳຄັນ: ສູງ"
  },
  {
    id: "TK-2025-117",
    title: "Payment QR ບໍ່ສະແດງ",
    subtitle: "ViengTiane Coffee",
    status: "pending",
    meta: "ຄວາມສຳຄັນ: ກາງ"
  },
  {
    id: "TK-2025-116",
    title: "ຂໍເພີ່ມບັນຊີທະນາຄານ",
    subtitle: "Sabai Dee Hotel",
    status: "resolved",
    meta: "ຄວາມສຳຄັນ: ຕ່ຳ"
  }
];

export const planCards = [
  {
    name: "Starter",
    price: "K 120,000",
    businesses: 47,
    modules: "Core POS",
    color: "blue"
  },
  {
    name: "Pro",
    price: "K 250,000",
    businesses: 523,
    modules: "POS + ລາຍງານ",
    color: "green"
  },
  {
    name: "Business",
    price: "K 500,000",
    businesses: 388,
    modules: "ຫຼາຍສາຂາ",
    color: "purple"
  },
  {
    name: "Enterprise",
    price: "Custom",
    businesses: 178,
    modules: "Support ສະເພາະ",
    color: "orange"
  }
];

export const paymentMethods = [
  ["BCEL One", "Bank / QR", "Mobile Banking", "BCEL", "ທຸລະກິດທັງໝົດ", "active"],
  ["LaoViet QR", "Bank / QR", "QR Code", "LaoViet Bank", "ທຸລະກິດທັງໝົດ", "active"],
  [
    "BIDV SmartBanking",
    "Bank / QR",
    "Mobile Banking",
    "BIDV Laos",
    "ທຸລະກິດທັງໝົດ",
    "active"
  ],
  [
    "ACLEDA iPay",
    "Bank / QR",
    "Mobile Banking",
    "ACLEDA Bank",
    "ທຸລະກິດທັງໝົດ",
    "active"
  ],
  ["Cash", "Cash", "In-Store", "ຊຳລະເງິນສົດ", "ທຸລະກິດທັງໝົດ", "active"],
  [
    "VISA / MasterCard",
    "Card",
    "POS Terminal",
    "Card Network",
    "ທຸລະກິດທັງໝົດ",
    "active"
  ],
  ["UnionPay", "Card", "POS Terminal", "UnionPay", "ທຸລະກິດທັງໝົດ", "active"],
  ["PromptPay QR", "QR", "QR Code", "PromptPay (TH)", "ທຸລະກິດທີ່ເລືອກ", "active"],
  ["WeChat Pay", "QR", "QR Code", "WeChat Pay", "ທຸລະກິດທີ່ເລືອກ", "inactive"],
  ["AliPay", "QR", "QR Code", "AliPay", "ທຸລະກິດທີ່ເລືອກ", "inactive"]
];

export const auditRows = [
  ["10:24 AM", "Somchai Phommasenh", "ສ້າງທຸລະກິດ", "Joma Bakery Cafe", "IP 10.0.2.18"],
  ["9:41 AM", "Vannapha Support", "ອັບເດດ Ticket", "TK-2025-118", "IP 10.0.2.21"],
  ["Yesterday", "System", "ຮັບການຊຳລະ", "ViengTiane Coffee", "API"],
  ["May 16, 2025", "Somchai Phommasenh", "ກຳນົດແພັກເກດ", "Paksan Laos", "IP 10.0.2.18"]
];
