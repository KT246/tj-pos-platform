import { create } from "zustand";

import { pickupPreparingTickets, pickupReadyTickets } from "../data/cafe-pickup-data";
import type { PickupDisplayState } from "../types";

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

// Display state mirrors live POS/barista data in memory only.
// Do not persist queue state to localStorage because it must come from backend later.
export const useCafePickupStore = create<PickupDisplayState>((set) => ({
  preparing: pickupPreparingTickets,
  ready: pickupReadyTickets,
  currentTime: formatTime(new Date()),
  currentDate: formatDate(new Date()),
  updateClock: () => {
    const now = new Date();
    set({
      currentTime: formatTime(now),
      currentDate: formatDate(now)
    });
  }
}));
