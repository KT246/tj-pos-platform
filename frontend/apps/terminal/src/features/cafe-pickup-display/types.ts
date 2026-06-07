export type PickupTicketStatus = "preparing" | "ready";

export type PickupTicket = {
  code: string;
  item: string;
  wait: string;
  status: PickupTicketStatus;
};

export type PickupDisplayState = {
  preparing: PickupTicket[];
  ready: PickupTicket[];
  currentTime: string;
  currentDate: string;
  updateClock: () => void;
};
