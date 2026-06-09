import { create } from "zustand";
import type { SystemToastType } from "@workspace/ui";

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
  showNotice: (message: string, type?: SystemToastType) => void;
};

function assignStaff(ticket: KitchenTicket) {
  if (ticket.assignedTo !== "ຍັງບໍ່ມອບໝາຍ") return ticket.assignedTo;
  if (ticket.station === "ບາ") return "Khamphou V.";
  if (ticket.station === "ເບເກີຣີ") return "Souvanna L.";
  if (ticket.station === "ຈຸດສົ່ງອາຫານ") return "ສະຖານີສົ່ງອາຫານ";
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
  boardMode: "ຄົວ",
  activeStatus: "ໃໝ່",
  selectedStation: "all",
  sortMode: "longest",
  soundEnabled: true,
  settingsOpen: false,
  alertOpen: false,
  alertTicketId: "#ORD-05029",
  selectedTicketId: null,
  tickets: kitchenTickets,
  settings: defaultKitchenSettings,
  setBoardMode: (mode) => set({ boardMode: mode, selectedStation: "all" }),
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
        showKitchenDisplayNotice("ບໍ່ພົບອໍເດີ.", "error");
        return {};
      }

      showKitchenDisplayNotice(`${ticketId} ຖືກຍ້າຍໄປກຳລັງກຽມ.`, "success");

      return {
        tickets: updateTicketStatus(state.tickets, ticketId, {
          status: "ກຳລັງກຽມ",
          assignedTo: assignStaff(ticket),
          items: ticket.items.map((item) => ({ ...item, status: "ກຳລັງກຽມ" }))
        }),
        activeStatus: "ກຳລັງກຽມ",
        alertOpen: state.alertTicketId === ticketId ? false : state.alertOpen
      };
    }),
  markReady: (ticketId) =>
    set((state) => {
      const ticket = state.tickets.find((item) => item.id === ticketId);
      if (!ticket) {
        showKitchenDisplayNotice("ບໍ່ພົບອໍເດີ.", "error");
        return {};
      }

      showKitchenDisplayNotice(`${ticketId} ພ້ອມແລ້ວ.`, "success");

      return {
        tickets: updateTicketStatus(state.tickets, ticketId, {
          status: "ພ້ອມ",
          items: ticket.items.map((item) => ({ ...item, status: "done" }))
        }),
        activeStatus: "ພ້ອມ"
      };
    }),
  completePickup: (ticketId) =>
    set((state) => {
      showKitchenDisplayNotice(`${ticketId} ສຳເລັດແລ້ວ.`, "success");

      return {
        tickets: updateTicketStatus(state.tickets, ticketId, {
          status: "done",
          completedAt: new Date().toISOString()
        }),
        selectedTicketId: null
      };
    }),
  recallTicket: (ticketId) =>
    set((state) => {
      const ticket = state.tickets.find((item) => item.id === ticketId);
      if (!ticket) {
        showKitchenDisplayNotice("ບໍ່ພົບອໍເດີ.", "error");
        return {};
      }

      showKitchenDisplayNotice(`${ticketId} ຖືກດຶງກັບໄປກຳລັງກຽມ.`, "info");

      return {
        tickets: updateTicketStatus(state.tickets, ticketId, {
          status: "ກຳລັງກຽມ",
          completedAt: null,
          items: ticket.items.map((item) => ({ ...item, status: "ກຳລັງກຽມ" }))
        }),
        activeStatus: "ກຳລັງກຽມ"
      };
    }),
  dismissAlert: () => set({ alertOpen: false }),
  showNotice: (message, type) => showKitchenDisplayNotice(message, type)
}));
