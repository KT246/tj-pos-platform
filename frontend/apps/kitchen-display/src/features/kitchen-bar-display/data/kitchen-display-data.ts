import {
  ChefHat,
  Coffee,
  CookingPot,
  PackageCheck,
  Utensils,
  Wine
} from "lucide-react";

import type {
  KitchenBusiness,
  KitchenSettings,
  KitchenStation,
  KitchenTicket,
  KitchenTicketItem
} from "../types";

type KitchenTicketSeed = Omit<
  KitchenTicket,
  | "businessId"
  | "branchId"
  | "ticketNumber"
  | "orderId"
  | "tableId"
  | "createdAt"
  | "completedAt"
  | "items"
> & {
  items: Array<
    Omit<KitchenTicketItem, "orderItemId" | "status"> &
      Partial<Pick<KitchenTicketItem, "orderItemId" | "status">>
  >;
};

const businessId = "biz-tj-cafe-vientiane";
const branchId = "branch-vientiane-center";

function createKitchenTicket(seed: KitchenTicketSeed): KitchenTicket {
  const ticketNumber = seed.orderNo.replace(/^#/, "");
  const tableId =
    seed.type === "ນັ່ງກິນທີ່ຮ້ານ"
      ? seed.table.toLowerCase().replace(/\s+/g, "-")
      : null;

  return {
    businessId,
    branchId,
    ticketNumber,
    orderId: `order-${ticketNumber.toLowerCase()}`,
    tableId,
    createdAt: `2025-05-18T${seed.receivedAt.replace(" AM", ":00+07:00")}`,
    completedAt: seed.status === "done" ? "2025-05-18T10:35:00+07:00" : null,
    ...seed,
    items: seed.items.map((item, index) => ({
      orderItemId: item.orderItemId ?? `${seed.orderNo}-${index + 1}`,
      status: item.status ?? (seed.status === "ພ້ອມ" ? "done" : seed.status),
      ...item
    }))
  };
}

export const kitchenBusiness: KitchenBusiness = {
  name: "TJ POS",
  logo: "/terminal-logo.png",
  branch: "TJ Cafe Vientiane",
  currentTime: "10:24 AM",
  currentDate: "May 18, 2025"
};

export const kitchenStations: KitchenStation[] = [
  { id: "all", label: "ທຸກສະຖານີ", icon: ChefHat },
  { id: "ຄົວ", label: "ຄົວ", icon: CookingPot },
  { id: "ບາ", label: "ບາ", icon: Wine },
  { id: "ເບເກີຣີ", label: "ເບເກີຣີ", icon: Coffee },
  { id: "ຈຸດສົ່ງອາຫານ", label: "ຈຸດສົ່ງອາຫານ", icon: PackageCheck }
];

export const defaultKitchenSettings: KitchenSettings = {
  enabledStationIds: ["ຄົວ", "ບາ", "ເບເກີຣີ", "ຈຸດສົ່ງອາຫານ"],
  autoRefreshSeconds: 5,
  density: "comfortable",
  showItemNotes: true,
  showElapsedTime: true,
  autoPrintTickets: false,
  largePrintText: true
};

const kitchenTicketSeeds: KitchenTicketSeed[] = [
  {
    id: "#ORD-05029",
    orderNo: "ORD-05029",
    table: "Table 06",
    type: "ນັ່ງກິນທີ່ຮ້ານ",
    station: "ຄົວ",
    status: "ໃໝ່",
    priority: "ດ່ວນ",
    elapsedMinutes: 2,
    assignedTo: "ຍັງບໍ່ມອບໝາຍ",
    receivedAt: "10:22 AM",
    customerName: "Khampheng L.",
    customerNote: "ລູກຄ້າຂໍໃຫ້ເຮັດໄວ.",
    kitchenNote: "ເຮັດອາຫານຫຼັກພ້ອມກັນ ແລະ ລໍຖ້າເອີ້ນກ່ອນສົ່ງຂອງຫວານ.",
    items: [
      {
        id: "item-05029-1",
        quantity: 2,
        name: "ຜັດໄທໄກ່",
        modifiers: ["ບໍ່ໃສ່ຖົ່ວດິນ", "ເຜັດປານກາງ"],
        note: "One plate no bean sprouts",
        unitPrice: 45000
      },
      {
        id: "item-05029-2",
        quantity: 1,
        name: "ປໍເປີຍສົດໝູ",
        note: "Extra dipping sauce",
        unitPrice: 32000
      },
      {
        id: "item-05029-3",
        quantity: 1,
        name: "ໂຊດາໝາກນາວ",
        modifiers: ["ນ້ຳກ້ອນໜ້ອຍ"],
        unitPrice: 18000
      }
    ]
  },
  {
    id: "#ORD-05018",
    orderNo: "ORD-05018",
    table: "Table 12",
    type: "ນັ່ງກິນທີ່ຮ້ານ",
    station: "ຄົວ",
    status: "ໃໝ່",
    priority: "ດ່ວນ",
    elapsedMinutes: 11,
    assignedTo: "ຍັງບໍ່ມອບໝາຍ",
    receivedAt: "10:13 AM",
    customerName: "ລູກຄ້າທົ່ວໄປ",
    customerNote: "Birthday table.",
    kitchenNote: "ຂໍເຜັດພິເສດ.",
    items: [
      { id: "item-05018-1", quantity: 1, name: "ຕົ້ມຍຳກຸ້ງ", unitPrice: 55000 },
      {
        id: "item-05018-2",
        quantity: 1,
        name: "ມັດຊະລາເຕ້ຊາຂຽວ",
        note: "Less sugar",
        unitPrice: 30000
      },
      { id: "item-05018-3", quantity: 1, name: "ເຂົ້າສວຍ", unitPrice: 10000 },
      { id: "item-05018-4", quantity: 1, name: "ເຂົ້າໜຽວມ່ວງ", unitPrice: 28000 }
    ]
  },
  {
    id: "#ORD-05017",
    orderNo: "ORD-05017",
    table: "ສັ່ງກັບບ້ານ",
    type: "ສັ່ງກັບບ້ານ",
    station: "ເບເກີຣີ",
    status: "ໃໝ່",
    priority: "ປົກກະຕິ",
    elapsedMinutes: 9,
    assignedTo: "ຍັງບໍ່ມອບໝາຍ",
    receivedAt: "10:15 AM",
    customerName: "Vilayphone S.",
    customerNote: "Packing for takeaway.",
    kitchenNote: "ບໍ່ເອົາຫຼອດ.",
    items: [
      { id: "item-05017-1", quantity: 2, name: "ຄຣົວຊອງ", unitPrice: 18000 },
      { id: "item-05017-2", quantity: 1, name: "ມັບຟິນຊັອກໂກແລັດ", unitPrice: 22000 },
      {
        id: "item-05017-3",
        quantity: 1,
        name: "ອາເມຣິກາໂນເຢັນ",
        modifiers: ["ນ້ຳກ້ອນໜ້ອຍ"],
        unitPrice: 25000
      }
    ]
  },
  {
    id: "#ORD-05016",
    orderNo: "ORD-05016",
    table: "Table 09",
    type: "ນັ່ງກິນທີ່ຮ້ານ",
    station: "ບາ",
    status: "ໃໝ່",
    priority: "ປົກກະຕິ",
    elapsedMinutes: 7,
    assignedTo: "ຍັງບໍ່ມອບໝາຍ",
    receivedAt: "10:17 AM",
    customerName: "Souvanna L.",
    customerNote: "Two guests waiting.",
    kitchenNote: "1 ຈອກບໍ່ໃສ່ນ້ຳກ້ອນ.",
    items: [
      { id: "item-05016-1", quantity: 2, name: "ລາເຕ້ເຢັນ", unitPrice: 28000 },
      {
        id: "item-05016-2",
        quantity: 1,
        name: "ຊີສເຄັກບລູເບີຣີ",
        unitPrice: 34000
      },
      { id: "item-05016-3", quantity: 1, name: "ຈອກເຈ້ຍ 12oz", unitPrice: 0 }
    ]
  },
  {
    id: "#ORD-05021",
    orderNo: "ORD-05021",
    table: "Table 03",
    type: "ນັ່ງກິນທີ່ຮ້ານ",
    station: "ຄົວ",
    status: "ໃໝ່",
    priority: "ປົກກະຕິ",
    elapsedMinutes: 6,
    assignedTo: "ຍັງບໍ່ມອບໝາຍ",
    receivedAt: "10:18 AM",
    customerName: "ລູກຄ້າທົ່ວໄປ",
    customerNote: "Family table.",
    kitchenNote: "ບໍ່ໃສ່ຫົວບົ່ວໃນແກງ.",
    items: [
      { id: "item-05021-1", quantity: 1, name: "ເຂົ້າປຽກເສັ້ນ", unitPrice: 42000 },
      { id: "item-05021-2", quantity: 1, name: "ລາເຕ້ເຢັນ", unitPrice: 28000 },
      { id: "item-05021-3", quantity: 1, name: "ປໍເປີຍສົດໝູ", unitPrice: 32000 }
    ]
  },
  {
    id: "#ORD-05022",
    orderNo: "ORD-05022",
    table: "ສັ່ງກັບບ້ານ",
    type: "ສັ່ງກັບບ້ານ",
    station: "ບາ",
    status: "ໃໝ່",
    priority: "ປົກກະຕິ",
    elapsedMinutes: 7,
    assignedTo: "ຍັງບໍ່ມອບໝາຍ",
    receivedAt: "10:17 AM",
    customerName: "ອໍເດີ Online",
    customerNote: "Pickup at counter.",
    kitchenNote: "ຂໍນ້ຳກ້ອນໜ້ອຍ.",
    items: [
      { id: "item-05022-1", quantity: 2, name: "ອາເມຣິກາໂນເຢັນ", unitPrice: 25000 },
      { id: "item-05022-2", quantity: 1, name: "ຄຣົວຊອງ", unitPrice: 18000 },
      { id: "item-05022-3", quantity: 1, name: "ມັບຟິນຊັອກໂກແລັດ", unitPrice: 22000 }
    ]
  },
  {
    id: "#ORD-05024",
    orderNo: "ORD-05024",
    table: "ສັ່ງກັບບ້ານ",
    type: "ສັ່ງກັບບ້ານ",
    station: "ບາ",
    status: "ໃໝ່",
    priority: "ປົກກະຕິ",
    elapsedMinutes: 11,
    assignedTo: "ຍັງບໍ່ມອບໝາຍ",
    receivedAt: "10:13 AM",
    customerName: "ຄູ່ຄ້າຈັດສົ່ງ",
    customerNote: "Driver waiting near counter.",
    kitchenNote: "ບໍ່ເອົາຫຼອດ.",
    items: [
      { id: "item-05024-1", quantity: 1, name: "ຄາຣາເມວມັກຄີອາໂຕ", unitPrice: 30000 },
      { id: "item-05024-2", quantity: 1, name: "ເຄັກກ້ວຍ", unitPrice: 22000 },
      { id: "item-05024-3", quantity: 1, name: "ນ້ຳດື່ມຂວດ", unitPrice: 8000 }
    ]
  },
  {
    id: "#ORD-05025",
    orderNo: "ORD-05025",
    table: "Table 12",
    type: "ນັ່ງກິນທີ່ຮ້ານ",
    station: "ຄົວ",
    status: "ໃໝ່",
    priority: "ດ່ວນ",
    elapsedMinutes: 12,
    assignedTo: "ຍັງບໍ່ມອບໝາຍ",
    receivedAt: "10:12 AM",
    customerName: "ລູກຄ້າທົ່ວໄປ",
    customerNote: "ລູກຄ້າມີອາການແພ້.",
    kitchenNote: "ແພ້ຖົ່ວດິນ",
    items: [
      { id: "item-05025-1", quantity: 1, name: "ຜັດໄທໄກ່", unitPrice: 45000 },
      { id: "item-05025-2", quantity: 1, name: "ຊາໄທເຢັນ", unitPrice: 25000 },
      { id: "item-05025-3", quantity: 1, name: "ໂຊດາໝາກນາວ", unitPrice: 18000 }
    ]
  },
  {
    id: "#ORD-05019",
    orderNo: "ORD-05019",
    table: "Table 02",
    type: "ນັ່ງກິນທີ່ຮ້ານ",
    station: "ຄົວ",
    status: "ກຳລັງກຽມ",
    priority: "ດ່ວນ",
    elapsedMinutes: 18,
    assignedTo: "Sone K.",
    receivedAt: "10:06 AM",
    customerName: "Phonephip P.",
    customerNote: "Regular guest.",
    kitchenNote: "ຂໍເຜັດພິເສດ.",
    items: [
      { id: "item-05019-1", quantity: 1, name: "ຕົ້ມຍຳກຸ້ງ", unitPrice: 55000 },
      {
        id: "item-05019-2",
        quantity: 1,
        name: "ມັດຊະລາເຕ້ຊາຂຽວ",
        unitPrice: 30000
      },
      { id: "item-05019-3", quantity: 1, name: "ເຂົ້າສວຍ", unitPrice: 10000 },
      { id: "item-05019-4", quantity: 1, name: "ເຂົ້າໜຽວມ່ວງ", unitPrice: 28000 }
    ]
  },
  {
    id: "#ORD-05012",
    orderNo: "ORD-05012",
    table: "ສັ່ງກັບບ້ານ",
    type: "ສັ່ງກັບບ້ານ",
    station: "ບາ",
    status: "ກຳລັງກຽມ",
    priority: "ປົກກະຕິ",
    elapsedMinutes: 16,
    assignedTo: "Souvanna L.",
    receivedAt: "10:08 AM",
    customerName: "ອໍເດີ Online",
    customerNote: "Pickup counter.",
    kitchenNote: "ຂໍນ້ຳກ້ອນໜ້ອຍ.",
    items: [
      { id: "item-05012-1", quantity: 2, name: "ອາເມຣິກາໂນເຢັນ", unitPrice: 25000 },
      { id: "item-05012-2", quantity: 1, name: "ຄຣົວຊອງ", unitPrice: 18000 },
      { id: "item-05012-3", quantity: 1, name: "ມັບຟິນຊັອກໂກແລັດ", unitPrice: 22000 }
    ]
  },
  {
    id: "#ORD-05023",
    orderNo: "ORD-05023",
    table: "Table 07",
    type: "ນັ່ງກິນທີ່ຮ້ານ",
    station: "ຄົວ",
    status: "ກຳລັງກຽມ",
    priority: "ດ່ວນ",
    elapsedMinutes: 14,
    assignedTo: "Phonephip P.",
    receivedAt: "10:10 AM",
    customerName: "ລູກຄ້າທົ່ວໄປ",
    customerNote: "Family table.",
    kitchenNote: "ບໍ່ໃສ່ຫົວບົ່ວໃນແກງ.",
    items: [
      {
        id: "item-05023-1",
        quantity: 1,
        name: "ຜັດໄທໄກ່",
        modifiers: ["ບໍ່ໃສ່ຫົວບົ່ວ"],
        unitPrice: 45000
      },
      { id: "item-05023-2", quantity: 1, name: "ຊາໄທເຢັນ", unitPrice: 25000 },
      { id: "item-05023-3", quantity: 1, name: "ໂຊດາໝາກນາວ", unitPrice: 18000 },
      {
        id: "item-05023-4",
        quantity: 1,
        name: "ປໍເປີຍສົດໝູ",
        unitPrice: 32000
      }
    ]
  },
  {
    id: "#ORD-05027",
    orderNo: "ORD-05027",
    table: "ສັ່ງກັບບ້ານ",
    type: "ສັ່ງກັບບ້ານ",
    station: "ບາ",
    status: "ກຳລັງກຽມ",
    priority: "ປົກກະຕິ",
    elapsedMinutes: 13,
    assignedTo: "Khamphou V.",
    receivedAt: "10:11 AM",
    customerName: "ຄູ່ຄ້າຈັດສົ່ງ",
    customerNote: "Driver waiting near counter.",
    kitchenNote: "1 ຈອກບໍ່ໃສ່ນ້ຳກ້ອນ.",
    items: [
      { id: "item-05027-1", quantity: 2, name: "ລາເຕ້ເຢັນ", unitPrice: 28000 },
      {
        id: "item-05027-2",
        quantity: 1,
        name: "ຊີສເຄັກບລູເບີຣີ",
        unitPrice: 34000
      },
      { id: "item-05027-3", quantity: 1, name: "ຈອກເຈ້ຍ 12oz", unitPrice: 0 }
    ]
  },
  {
    id: "#ORD-05031",
    orderNo: "ORD-05031",
    table: "Table 03",
    type: "ນັ່ງກິນທີ່ຮ້ານ",
    station: "ຈຸດສົ່ງອາຫານ",
    status: "ພ້ອມ",
    priority: "ປົກກະຕິ",
    elapsedMinutes: 5,
    assignedTo: "ສະຖານີສົ່ງອາຫານ",
    receivedAt: "10:19 AM",
    customerName: "ລູກຄ້າທົ່ວໄປ",
    customerNote: "Runner should confirm table.",
    kitchenNote: "Ready for pickup",
    items: [
      { id: "item-05031-1", quantity: 1, name: "ເຂົ້າປຽກເສັ້ນ", unitPrice: 42000 },
      { id: "item-05031-2", quantity: 1, name: "ລາເຕ້ເຢັນ", unitPrice: 28000 }
    ]
  },
  {
    id: "#ORD-05030",
    orderNo: "ORD-05030",
    table: "ເຄົາເຕີ",
    type: "ສັ່ງກັບບ້ານ",
    station: "ຈຸດສົ່ງອາຫານ",
    status: "ພ້ອມ",
    priority: "ດ່ວນ",
    elapsedMinutes: 8,
    assignedTo: "ສະຖານີສົ່ງອາຫານ",
    receivedAt: "10:16 AM",
    customerName: "Noy M.",
    customerNote: "Call customer name clearly.",
    kitchenNote: "Package soup separately",
    items: [
      {
        id: "item-05030-1",
        quantity: 1,
        name: "ແກງມັດສະມັນໄກ່",
        unitPrice: 52000
      },
      { id: "item-05030-2", quantity: 1, name: "ເຂົ້າຫອມມະລິ", unitPrice: 10000 },
      { id: "item-05030-3", quantity: 1, name: "ນ້ຳປັ່ນມະພ້າວ", unitPrice: 24000 }
    ]
  }
];

export const kitchenTickets: KitchenTicket[] = kitchenTicketSeeds.map(createKitchenTicket);
