import { useEffect } from "react";
import { SystemToastViewport } from "@workspace/ui";
import type { SystemToastMessage, SystemToastType } from "@workspace/ui";
import { create } from "zustand";

type KitchenDisplayToast = SystemToastMessage & {
  durationMs: number;
};

type KitchenDisplayToastInput = {
  type?: SystemToastType;
  title: string;
  description?: string;
  durationMs?: number;
};

type KitchenDisplayToastState = {
  toasts: KitchenDisplayToast[];
  addToast: (toast: KitchenDisplayToastInput) => void;
  removeToast: (toastId: string) => void;
  clearToasts: () => void;
};

const defaultDurationMs = 4200;
let toastSequence = 0;

function createToastId() {
  toastSequence += 1;
  return `kitchen-display-toast-${Date.now()}-${toastSequence}`;
}

function inferToastType(message: string): SystemToastType {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("failed") ||
    normalized.includes("not found") ||
    normalized.includes("no completed") ||
    normalized.includes("invalid") ||
    normalized.includes("unable")
  ) {
    return "error";
  }

  if (
    normalized.includes("empty") ||
    normalized.includes("select at least") ||
    normalized.includes("low stock") ||
    normalized.includes("pending") ||
    normalized.includes("no new order")
  ) {
    return "warning";
  }

  if (
    normalized.includes("refreshed") ||
    normalized.includes("loaded") ||
    normalized.includes("ready") ||
    normalized.includes("selected") ||
    normalized.includes("opens") ||
    normalized.includes("scanner")
  ) {
    return "info";
  }

  return "success";
}

function titleForToast(type: SystemToastType, message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("payment completed")) return "Payment completed";
  if (normalized.includes("marked ready")) return "Order marked ready";
  if (normalized.includes("settings saved")) return "Settings saved";
  if (normalized.includes("settings reset")) return "Settings reset";
  if (normalized.includes("refreshed")) return "Data refreshed";
  if (normalized.includes("not found")) return "Not found";
  if (normalized.includes("empty")) return "Please review";
  if (normalized.includes("failed")) return "Action failed";

  if (type === "success") return "Action completed";
  if (type === "warning") return "Please review";
  if (type === "error") return "Unable to complete action";
  return "Information";
}

export const useKitchenDisplayToastStore = create<KitchenDisplayToastState>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        {
          id: createToastId(),
          type: toast.type ?? "info",
          title: toast.title,
          description: toast.description,
          timestamp: "Just now",
          durationMs: toast.durationMs ?? defaultDurationMs
        },
        ...state.toasts
      ].slice(0, 5)
    })),
  removeToast: (toastId) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId)
    })),
  clearToasts: () => set({ toasts: [] })
}));

export function pushKitchenDisplayToast(toast: KitchenDisplayToastInput) {
  useKitchenDisplayToastStore.getState().addToast(toast);
}

export function showKitchenDisplayNotice(
  message: string,
  explicitType?: SystemToastType
) {
  const type = explicitType ?? inferToastType(message);

  pushKitchenDisplayToast({
    type,
    title: titleForToast(type, message),
    description: message
  });
}

export function KitchenDisplayToastHost() {
  const toasts = useKitchenDisplayToastStore((state) => state.toasts);
  const removeToast = useKitchenDisplayToastStore((state) => state.removeToast);

  useEffect(() => {
    const timers = toasts.map((toast) =>
      window.setTimeout(() => removeToast(toast.id), toast.durationMs)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [removeToast, toasts]);

  return <SystemToastViewport toasts={toasts} onDismiss={removeToast} />;
}
