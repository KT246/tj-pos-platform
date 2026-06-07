import { ArrowRight, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

import type { StaffOrderLine } from "../types";
import { formatMoney, getStaffCartSummary, getStaffOrderPath } from "../utils";

export function StaffCartSummary({
  businessSlug,
  cart
}: {
  businessSlug: string;
  cart: StaffOrderLine[];
}) {
  const summary = getStaffCartSummary(cart);

  return (
    <div className="mx-3 mt-3 mb-2 grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-blue-100 bg-white px-3 py-3 shadow-[0_14px_34px_rgba(15,23,42,0.1)]">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
        <ShoppingCart className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-black text-white ring-2 ring-white">
          {summary.itemCount}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-[15px] font-black text-slate-950">
          Cart - {summary.itemCount} items
        </p>
        <p className="text-[12px] font-bold text-slate-500">View items</p>
      </div>
      <Link
        to={getStaffOrderPath(businessSlug, "/review")}
        className="flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-[13px] font-black text-white shadow-[0_12px_22px_rgba(37,99,235,0.22)] hover:bg-blue-700"
      >
        Review Order
        <ArrowRight className="h-4 w-4" />
      </Link>
      <div className="col-span-3 -mt-1 flex items-center justify-between border-t border-blue-50 px-1 pt-2">
        <span className="text-[11px] font-bold text-slate-500">Subtotal</span>
        <span className="text-[15px] font-black text-slate-950">
          {formatMoney(summary.subtotal)}
        </span>
      </div>
    </div>
  );
}
