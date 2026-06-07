import { useEffect } from "react";
import { SystemToastViewport } from "@workspace/ui";
import type { SystemToastMessage, SystemToastType } from "@workspace/ui";
import { create } from "zustand";

type StaffOrderToast = SystemToastMessage & {
  durationMs: number;
};

type StaffOrderToastInput = {
  type?: SystemToastType;
  title: string;
  description?: string;
  durationMs?: number;
};

type StaffOrderToastState = {
  toasts: StaffOrderToast[];
  addToast: (toast: StaffOrderToastInput) => void;
  removeToast: (toastId: string) => void;
  clearToasts: () => void;
};

const defaultDurationMs = 4200;
let toastSequence = 0;

function createToastId() {
  toastSequence += 1;
  return `staff-order-toast-${Date.now()}-${toastSequence}`;
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

  if (normalized.includes("payment completed")) return "ຊຳລະສຳເລັດ";
  if (normalized.includes("marked ready")) return "ອໍເດີພ້ອມແລ້ວ";
  if (normalized.includes("settings saved")) return "ບັນທຶກການຕັ້ງຄ່າແລ້ວ";
  if (normalized.includes("settings reset")) return "ຣີເຊັດການຕັ້ງຄ່າແລ້ວ";
  if (normalized.includes("refreshed")) return "ໂຫຼດຂໍ້ມູນໃໝ່ແລ້ວ";
  if (normalized.includes("not found")) return "ບໍ່ພົບຂໍ້ມູນ";
  if (normalized.includes("empty")) return "ກວດສອບກ່ອນ";
  if (normalized.includes("failed")) return "ດຳເນີນການບໍ່ສຳເລັດ";

  if (type === "success") return "ດຳເນີນການສຳເລັດ";
  if (type === "warning") return "ກວດສອບກ່ອນ";
  if (type === "error") return "ບໍ່ສາມາດດຳເນີນການ";
  return "ຂໍ້ມູນ";
}

export const useStaffOrderToastStore = create<StaffOrderToastState>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        {
          id: createToastId(),
          type: toast.type ?? "info",
          title: toast.title,
          description: toast.description,
          timestamp: "ຕອນນີ້",
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

export function pushStaffOrderToast(toast: StaffOrderToastInput) {
  useStaffOrderToastStore.getState().addToast(toast);
}

export function showStaffOrderNotice(message: string, explicitType?: SystemToastType) {
  const type = explicitType ?? inferToastType(message);

  pushStaffOrderToast({
    type,
    title: titleForToast(type, message),
    description: message
  });
}

export function StaffOrderToastHost() {
  const toasts = useStaffOrderToastStore((state) => state.toasts);
  const removeToast = useStaffOrderToastStore((state) => state.removeToast);

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
