import type { StaffOrderLine } from "./types";

export function getStaffOrderPath(businessSlug: string, path = "") {
  return `/terminal/b/${businessSlug}/staff-order${path}`;
}

export function getStaffCartSummary(lines: StaffOrderLine[]) {
  const subtotal = lines.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0
  );
  const serviceCharge = Math.round(subtotal * 0.05);
  const discount = subtotal > 100000 ? 5000 : 0;
  const total = subtotal + serviceCharge - discount;
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  return { subtotal, serviceCharge, discount, total, itemCount };
}

export function statusColor(status: string) {
  if (status === "Ready to Serve") {
    return "bg-emerald-50 text-emerald-600";
  }

  if (status === "Waiting Bill") {
    return "bg-violet-50 text-violet-600";
  }

  if (status === "Sent") {
    return "bg-orange-50 text-orange-600";
  }

  return "bg-blue-50 text-blue-600";
}
