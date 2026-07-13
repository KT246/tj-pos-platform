import { create } from "zustand"

export type PosToastType = "success" | "error" | "warning" | "info"

export type PosToast = {
  id: string
  type: PosToastType
  title: string
  description?: string
  durationMs: number
}

type PosToastStore = {
  toasts: PosToast[]
  push: (toast: Omit<PosToast, "id" | "durationMs"> & { durationMs?: number }) => void
  dismiss: (toastId: string) => void
}

export const usePosToastStore = create<PosToastStore>((set) => ({
  toasts: [],
  push: (toast) =>
    set((state) => ({
      toasts: [
        {
          id: `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          durationMs: toast.durationMs ?? 3200,
          ...toast,
        },
        ...state.toasts,
      ].slice(0, 4),
    })),
  dismiss: (toastId) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId),
    })),
}))

export function showPosToast(
  toast: Omit<PosToast, "id" | "durationMs"> & { durationMs?: number },
) {
  usePosToastStore.getState().push(toast)
}
