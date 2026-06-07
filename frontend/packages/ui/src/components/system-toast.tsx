import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle
} from "lucide-react";
import type { ReactNode } from "react";

export type SystemToastType = "success" | "warning" | "error" | "info";

export type SystemToastMessage = {
  id: string;
  type: SystemToastType;
  title: string;
  description?: string;
  timestamp?: string;
};

type SystemToastViewportProps = {
  toasts: SystemToastMessage[];
  onDismiss: (toastId: string) => void;
};

const toastTone: Record<
  SystemToastType,
  {
    border: string;
    panel: string;
    iconWrap: string;
    icon: ReactNode;
  }
> = {
  success: {
    border: "border-l-emerald-500",
    panel: "bg-white",
    iconWrap: "bg-emerald-500 text-white",
    icon: <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
  },
  warning: {
    border: "border-l-amber-500",
    panel: "bg-white",
    iconWrap: "bg-amber-500 text-white",
    icon: <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />
  },
  error: {
    border: "border-l-red-500",
    panel: "bg-white",
    iconWrap: "bg-red-500 text-white",
    icon: <XCircle className="h-5 w-5" strokeWidth={2.5} />
  },
  info: {
    border: "border-l-blue-500",
    panel: "bg-white",
    iconWrap: "bg-blue-500 text-white",
    icon: <Info className="h-5 w-5" strokeWidth={2.5} />
  }
};

export function SystemToastViewport({
  toasts,
  onDismiss
}: SystemToastViewportProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[90] flex w-[min(390px,calc(100vw-24px))] flex-col gap-2.5 max-sm:right-3 max-sm:left-3 max-sm:w-auto">
      {toasts.map((toast) => {
        const tone = toastTone[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex gap-3 rounded-xl border border-slate-200 border-l-4 ${tone.border} ${tone.panel} px-4 py-3 shadow-[0_16px_38px_rgba(15,23,42,0.13)] ring-1 ring-slate-950/[0.02]`}
            role="status"
            aria-live={toast.type === "error" ? "assertive" : "polite"}
          >
            <span
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tone.iconWrap}`}
            >
              {tone.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-[14px] font-black leading-5 text-[#0b1736]">
                  {toast.title}
                </h2>
                {toast.timestamp ? (
                  <span className="shrink-0 text-[11px] font-semibold text-slate-500">
                    {toast.timestamp}
                  </span>
                ) : null}
              </div>
              {toast.description ? (
                <p className="mt-1 text-[13px] font-semibold leading-5 text-slate-600">
                  {toast.description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-[#0b1736]"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" strokeWidth={2.4} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
