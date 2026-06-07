import type { LucideIcon } from "lucide-react";

export type KitchenBoardMode = "kitchen" | "bar";

export type KitchenTicketStatus = "new" | "preparing" | "ready" | "done";

export type KitchenVisibleStatus = Exclude<KitchenTicketStatus, "done">;

export type KitchenStationId = "all" | "kitchen" | "bar" | "bakery" | "pass";

export type KitchenPriority = "High" | "Normal";

export type KitchenOrderType = "Dine In" | "Take Away";

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
  quantity: number;
  name: string;
  note?: string;
  modifiers?: string[];
  unitPrice: number;
};

export type KitchenTicket = {
  id: string;
  orderNo: string;
  table: string;
  type: KitchenOrderType;
  station: Exclude<KitchenStationId, "all">;
  status: KitchenTicketStatus;
  priority: KitchenPriority;
  elapsedMinutes: number;
  assignedTo: string;
  receivedAt: string;
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
