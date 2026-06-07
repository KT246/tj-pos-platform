import { create } from "zustand";

import { showKitchenDisplayNotice } from "../../../lib/kitchen-display-toasts";
import { defaultKitchenSettings, kitchenTickets } from "../data/kitchen-display-data";
import type {
  KitchenBoardMode,
  KitchenSettings,
  KitchenSortMode,
  KitchenStationId,
  KitchenTicket,
  KitchenVisibleStatus
} from "../types";

type KitchenDisplayState = {
  boardMode: KitchenBoardMode;
  activeStatus: KitchenVisibleStatus;
  selectedStation: KitchenStationId;
  sortMode: KitchenSortMode;
  soundEnabled: boolean;
  settingsOpen: boolean;
  alertOpen: boolean;
  alertTicketId: string | null;
  selectedTicketId: string | null;
  tickets: KitchenTicket[];
  settings: KitchenSettings;
};

type KitchenDisplayActions = {
  setBoardMode: (mode: KitchenBoardMode) => void;
  setActiveStatus: (status: KitchenVisibleStatus) => void;
  setSelectedStation: (stationId: KitchenStationId) => void;
  setSortMode: (sortMode: KitchenSortMode) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setAlertOpen: (open: boolean) => void;
  setSelectedTicketId: (ticketId: string | null) => void;
  updateSettings: (patch: Partial<KitchenSettings>) => void;
  resetSettings: () => void;
  toggleStationEnabled: (stationId: Exclude<KitchenStationId, "all">) => void;
  startPreparing: (ticketId: string) => void;
  markReady: (ticketId: string) => void;
  completePickup: (ticketId: string) => void;
  recallTicket: (ticketId: string) => void;
  dismissAlert: () => void;
  showNotice: (message: string) => void;
};

function assignStaff(ticket: KitchenTicket) {
  if (ticket.assignedTo !== "Unassigned") return ticket.assignedTo;
  if (ticket.station === "bar") return "Khamphou V.";
  if (ticket.station === "bakery") return "Souvanna L.";
  if (ticket.station === "pass") return "Pass Station";
  return "Sone K.";
}

function updateTicketStatus(
  tickets: KitchenTicket[],
  ticketId: string,
  patch: Partial<KitchenTicket>
) {
  return tickets.map((ticket) =>
    ticket.id === ticketId ? { ...ticket, ...patch } : ticket
  );
}

// Kitchen/bar display state is in-memory only. Persisting order workflow state
// must wait for backend realtime sync and offline conflict rules.
export const useKitchenDisplayStore = create<
  KitchenDisplayState & KitchenDisplayActions
>((set) => ({
  boardMode: "kitchen",
  activeStatus: "new",
  selectedStation: "all",
  sortMode: "longest",
  soundEnabled: true,
  settingsOpen: false,
  alertOpen: false,
  alertTicketId: "#ORD-05029",
  selectedTicketId: null,
  tickets: kitchenTickets,
  settings: defaultKitchenSettings,
  setBoardMode: (mode) =>
    set((state) => ({
      boardMode: mode,
      selectedStation:
        mode === "bar" && state.selectedStation === "all"
          ? "bar"
          : mode === "kitchen" && state.selectedStation === "bar"
            ? "all"
            : state.selectedStation
    })),
  setActiveStatus: (status) => set({ activeStatus: status }),
  setSelectedStation: (stationId) => set({ selectedStation: stationId }),
  setSortMode: (sortMode) => set({ sortMode }),
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setSettingsOpen: (open) => set({ settingsOpen: open }),
  setAlertOpen: (open) => set({ alertOpen: open }),
  setSelectedTicketId: (ticketId) => set({ selectedTicketId: ticketId }),
  updateSettings: (patch) =>
    set((state) => ({ settings: { ...state.settings, ...patch } })),
  resetSettings: () => set({ settings: defaultKitchenSettings }),
  toggleStationEnabled: (stationId) =>
    set((state) => {
      const exists = state.settings.enabledStationIds.includes(stationId);
      const nextStations = exists
        ? state.settings.enabledStationIds.filter((id) => id !== stationId)
        : [...state.settings.enabledStationIds, stationId];

      return {
        settings: {
          ...state.settings,
          enabledStationIds:
            nextStations.length > 0 ? nextStations : state.settings.enabledStationIds
        }
      };
    }),
  startPreparing: (ticketId) =>
    set((state) => {
      const ticket = state.tickets.find((item) => item.id === ticketId);
      if (!ticket) {
        showKitchenDisplayNotice("ບໍ່ພົບ Ticket.", "error");
        return {};
      }

      showKitchenDisplayNotice(`${ticketId} ຖືກຍ້າຍໄປກຳລັງກຽມ.`, "success");

      return {
        tickets: updateTicketStatus(state.tickets, ticketId, {
          status: "preparing",
          assignedTo: assignStaff(ticket)
        }),
        activeStatus: "preparing",
        alertOpen: state.alertTicketId === ticketId ? false : state.alertOpen
      };
    }),
  markReady: (ticketId) =>
    set((state) => {
      showKitchenDisplayNotice(`${ticketId} ຖືກໝາຍວ່າພ້ອມແລ້ວ.`, "success");

      return {
        tickets: updateTicketStatus(state.tickets, ticketId, { status: "ready" }),
        activeStatus: "ready"
      };
    }),
  completePickup: (ticketId) =>
    set((state) => {
      showKitchenDisplayNotice(
        `${ticketId} ສຳເລັດ ແລະ ຖືກຍ້າຍອອກຈາກຄິວພ້ອມ.`,
        "success"
      );

      return {
        tickets: updateTicketStatus(state.tickets, ticketId, { status: "done" }),
        selectedTicketId: null
      };
    }),
  recallTicket: (ticketId) =>
    set((state) => {
      showKitchenDisplayNotice(`${ticketId} ຖືກດຶງກັບໄປກຳລັງກຽມ.`, "info");

      return {
        tickets: updateTicketStatus(state.tickets, ticketId, {
          status: "preparing"
        }),
        activeStatus: "preparing"
      };
    }),
  dismissAlert: () => set({ alertOpen: false }),
  showNotice: (message) => showKitchenDisplayNotice(message)
}));
