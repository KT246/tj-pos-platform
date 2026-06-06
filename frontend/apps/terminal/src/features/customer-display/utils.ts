import type { CustomerDisplayScreen } from "./types";

export function formatDisplayMoney(value: number) {
  return `LAK ${value.toLocaleString("en-US")}`;
}

export function formatDisplayMoneyCompact(value: number) {
  return value.toLocaleString("en-US");
}

export function resolveDisplayScreen(
  value: string | null,
  fallback: CustomerDisplayScreen
): CustomerDisplayScreen {
  if (value === "idle" || value === "review" || value === "payment" || value === "success") {
    return value;
  }

  return fallback;
}
