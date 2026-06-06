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
      box: "h-[150px] px-4",
      icon: "h-12 w-12",
      label: "mt-5 text-[18px]"
    },
    medium: {
      box: "h-[98px] px-3",
      icon: "h-8 w-8",
      label: "mt-2 text-[15px]"
    },
    small: {
      box: "h-[64px] px-2",
      icon: "h-6 w-6",
      label: "mt-1 text-[12px]"
    }
  }[resolvedSize];

  return (
    <div className={`grid grid-cols-4 ${resolvedSize === "large" ? "gap-5" : resolvedSize === "medium" ? "gap-3" : "gap-2"}`}>
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
