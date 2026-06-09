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
    <div className="mx-3 my-2 grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-xl border border-blue-100 bg-white px-2.5 py-2 shadow-[0_12px_28px_rgba(15,23,42,0.09)]">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
        <ShoppingCart className="h-[18px] w-[18px]" />
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-black text-white ring-2 ring-white">
          {summary.itemCount}
        </span>
      </div>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-black text-slate-950">
          {"ກະຕ່າ"} - {summary.itemCount} {"ລາຍການ"}
        </p>
        <p className="text-[10px] font-bold text-slate-500">{"ເບິ່ງລາຍການ"}</p>
      </div>
      <Link
        to={getStaffOrderPath(businessSlug, "/review")}
        className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-[12px] font-black whitespace-nowrap text-white shadow-[0_10px_18px_rgba(37,99,235,0.2)] hover:bg-blue-700"
      >
        {"ກວດອໍເດີ"}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
      <div className="col-span-3 -mt-0.5 flex items-center justify-between border-t border-blue-50 px-1 pt-1.5">
        <span className="text-[10px] font-bold text-slate-500">{"ຍອດກ່ອນຫຼຸດ"}</span>
        <span className="text-[13px] font-black text-slate-950">
          {formatMoney(summary.subtotal)}
        </span>
      </div>
    </div>
  );
}
