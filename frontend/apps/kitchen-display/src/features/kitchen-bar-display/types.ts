import type { LucideIcon } from "lucide-react";

export type KitchenBoardMode = "ຄົວ" | "ບາ";

export type KitchenTicketStatus =
  | "ໃໝ່"
  | "ກຳລັງກຽມ"
  | "ພ້ອມ"
  | "done"
  | "cancelled";

export type KitchenVisibleStatus = Exclude<KitchenTicketStatus, "done" | "cancelled">;

export type KitchenStationId = "all" | "ຄົວ" | "ບາ" | "ເບເກີຣີ" | "ຈຸດສົ່ງອາຫານ";

export type KitchenPriority = "ດ່ວນ" | "ປົກກະຕິ";

export type KitchenOrderType = "ນັ່ງກິນທີ່ຮ້ານ" | "ສັ່ງກັບບ້ານ";

export type KitchenSortMode = "longest" | "newest" | "priority";

export type KitchenDisplayDensity = "comfortable" | "compact";

export type KitchenBusiness = {
  name: string;
  logo: string;
  branch: string;
  currentTime: string;
  currentDate: string;
};

export type KitchenStation = {
  id: KitchenStationId;
  label: string;
  icon: LucideIcon;
};

export type KitchenTicketItem = {
  id: string;
  orderItemId: string;
  quantity: number;
  name: string;
  note?: string;
  modifiers?: string[];
  unitPrice: number;
  status: "ໃໝ່" | "ກຳລັງກຽມ" | "done" | "cancelled";
};

export type KitchenTicket = {
  id: string;
  businessId: string;
  branchId: string;
  ticketNumber: string;
  orderId: string;
  orderNo: string;
  tableId?: string | null;
  table: string;
  type: KitchenOrderType;
  station: Exclude<KitchenStationId, "all">;
  status: KitchenTicketStatus;
  priority: KitchenPriority;
  elapsedMinutes: number;
  assignedTo: string;
  receivedAt: string;
  createdAt: string;
  completedAt?: string | null;
  customerName: string;
  customerNote: string;
  kitchenNote: string;
  items: KitchenTicketItem[];
};

export type KitchenSettings = {
  enabledStationIds: Exclude<KitchenStationId, "all">[];
  autoRefreshSeconds: 5 | 10 | 15;
  density: KitchenDisplayDensity;
  showItemNotes: boolean;
  showElapsedTime: boolean;
  autoPrintTickets: boolean;
  largePrintText: boolean;
};
