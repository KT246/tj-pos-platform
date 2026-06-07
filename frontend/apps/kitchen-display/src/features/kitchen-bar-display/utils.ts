import type {
  KitchenSettings,
  KitchenSortMode,
  KitchenStationId,
  KitchenTicket,
  KitchenVisibleStatus
} from "./types";

export function formatKitchenMoney(amount: number) {
  return `K ${amount.toLocaleString("en-US")}`;
}

export function getTicketSubtotal(ticket: KitchenTicket) {
  return ticket.items.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0
  );
}

export function getTicketItemCount(ticket: KitchenTicket) {
  return ticket.items.reduce((total, item) => total + item.quantity, 0);
}

export function getElapsedLabel(minutes: number) {
  if (minutes < 1) return "Just now";
  return `${minutes}m`;
}

export function getTicketRouteId(ticketId: string) {
  return ticketId.replace(/^#/, "");
}

export function findTicketByRouteId(
  tickets: KitchenTicket[],
  ticketRouteId: string | undefined
) {
  if (!ticketRouteId) return null;

  const normalized = ticketRouteId.replace(/^#/, "").toLowerCase();
  return (
    tickets.find(
      (ticket) => ticket.id.replace(/^#/, "").toLowerCase() === normalized
    ) ?? null
  );
}

export function getVisibleKitchenTickets({
  tickets,
  activeStatus,
  selectedStation,
  sortMode,
  settings
}: {
  tickets: KitchenTicket[];
  activeStatus: KitchenVisibleStatus;
  selectedStation: KitchenStationId;
  sortMode: KitchenSortMode;
  settings: KitchenSettings;
}) {
  const enabled = new Set(settings.enabledStationIds);
  const visible = tickets.filter((ticket) => {
    if (ticket.status !== activeStatus) return false;
    if (!enabled.has(ticket.station)) return false;
    if (selectedStation !== "all" && ticket.station !== selectedStation) {
      return false;
    }

    return true;
  });

  return visible.sort((left, right) => {
    if (sortMode === "newest") {
      return right.receivedAt.localeCompare(left.receivedAt);
    }

    if (sortMode === "priority") {
      const priorityScore = { High: 2, Normal: 1 };
      return (
        priorityScore[right.priority] - priorityScore[left.priority] ||
        right.elapsedMinutes - left.elapsedMinutes
      );
    }

    return right.elapsedMinutes - left.elapsedMinutes;
  });
}

export function getKitchenStatusCounts(tickets: KitchenTicket[]) {
  return {
    new: tickets.filter((ticket) => ticket.status === "new").length,
    preparing: tickets.filter((ticket) => ticket.status === "preparing").length,
    ready: tickets.filter((ticket) => ticket.status === "ready").length
  };
}
