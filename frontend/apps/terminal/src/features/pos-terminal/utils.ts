import type { CartLine, Discount } from "./types";

export function formatMoney(value: number) {
  return `LAK ${value.toLocaleString("en-US")}`;
}

export function getBusinessPath(businessSlug: string, path: string) {
  return `/terminal/b/${businessSlug}/pos${path}`;
}

export function titleFromSlug(slug: string | undefined) {
  if (!slug) return "TJ Cafe Vientiane";

  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getCartSummary(cart: CartLine[], discount: Discount | null = null) {
  const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const rawDiscount =
    discount?.mode === "percent"
      ? Math.round(subtotal * (discount.value / 100))
      : discount?.value ?? 0;
  const discountAmount = Math.min(Math.max(rawDiscount, 0), subtotal);
  const tax = Math.round((subtotal - discountAmount) * 0.1);
  const total = subtotal - discountAmount + tax;
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);

  return { subtotal, discount: discountAmount, tax, total, itemCount };
}

export function nowTimeLabel() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date());
}

export function nowReceiptTime() {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date());
}
