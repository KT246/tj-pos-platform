import { CheckCircle2 } from "lucide-react";

import type {
  CustomerPaymentMethod,
  CustomerPaymentMethodId
} from "../types";

const toneClass = {
  green: "text-emerald-500",
  blue: "text-blue-600",
  violet: "text-violet-500"
};

export function PaymentMethods({
  methods,
  selected,
  compact = false,
  size
}: {
  methods: CustomerPaymentMethod[];
  selected?: CustomerPaymentMethodId;
  compact?: boolean;
  size?: "large" | "medium" | "small";
}) {
  const resolvedSize = size ?? (compact ? "small" : "large");
  const sizeClass = {
    large: {
      box: "h-[clamp(108px,15.5vh,150px)] px-[clamp(10px,1.3vw,16px)]",
      icon: "h-[clamp(34px,4.7vh,48px)] w-[clamp(34px,4.7vh,48px)]",
      label: "mt-[clamp(10px,1.8vh,20px)] text-[clamp(14px,1.18vw,18px)]"
    },
    medium: {
      box: "h-[clamp(74px,11vh,98px)] px-3",
      icon: "h-[clamp(24px,3.6vh,32px)] w-[clamp(24px,3.6vh,32px)]",
      label: "mt-2 text-[clamp(12px,1vw,15px)]"
    },
    small: {
      box: "h-[clamp(44px,6.8vh,58px)] px-2",
      icon: "h-[clamp(18px,2.8vh,22px)] w-[clamp(18px,2.8vh,22px)]",
      label: "mt-1 text-[clamp(9px,0.8vw,11px)]"
    }
  }[resolvedSize];

  const gridClass = methods.length === 3 ? "grid-cols-3" : "grid-cols-4";

  return (
    <div className={`grid ${gridClass} ${resolvedSize === "large" ? "gap-[clamp(12px,1.6vw,20px)]" : resolvedSize === "medium" ? "gap-3" : "gap-2"}`}>
      {methods.map((method) => {
        const Icon = method.icon;
        const isSelected = method.id === selected;

        return (
          <div
            key={method.id}
            className={`relative flex flex-col items-center justify-center rounded-[14px] border bg-white text-center shadow-[0_8px_22px_rgba(13,91,255,0.06)] ${
              sizeClass.box
            } ${
              isSelected
                ? "border-blue-500 bg-blue-50/50 text-blue-600"
                : "border-blue-100 text-slate-700"
            }`}
          >
            {isSelected ? (
              <CheckCircle2
                className={`${resolvedSize === "small" ? "h-6 w-6 -top-2 -right-2" : "h-7 w-7 -top-2.5 -right-2.5"} absolute rounded-full bg-blue-600 text-white`}
                strokeWidth={2.6}
              />
            ) : null}
            <Icon
              className={`${sizeClass.icon} ${toneClass[method.tone]}`}
              strokeWidth={2.4}
            />
            <span className={`${sizeClass.label} font-semibold leading-tight`}>
              {method.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
