import type { CustomerDisplayOrder } from "../types";
import { formatDisplayMoney } from "../utils";
import { lo } from "../utils/lao-labels";

export function OrderReview({ order }: { order: CustomerDisplayOrder }) {
  return (
    <section className="flex h-full min-h-0 flex-col rounded-[20px] border border-blue-100 bg-white p-6 shadow-[0_14px_38px_rgba(13,91,255,0.08)]">
      <div className="grid grid-cols-[minmax(0,1.55fr)_128px_176px_176px] border-b border-blue-100 px-2 pb-4 text-[17px] font-bold text-slate-500">
        <span>{lo("Item")}</span>
        <span className="text-center">{lo("Quantity")}</span>
        <span className="text-right">{lo("Unit Price")}</span>
        <span className="text-right">{lo("Amount")}</span>
      </div>

      <div className="min-h-0 overflow-hidden">
        {order.lines.map((line) => (
          <div
            key={line.id}
            className="grid grid-cols-[minmax(0,1.55fr)_128px_176px_176px] items-center border-b border-blue-50 px-2 py-4 last:border-b-0"
          >
            <div className="flex min-w-0 items-center gap-6">
              <img
                src={line.image}
                alt={line.name}
                className="h-16 w-16 shrink-0 rounded-[14px] object-cover shadow-[0_8px_18px_rgba(15,23,42,0.12)]"
              />
              <span className="truncate text-[24px] font-black text-[#071633]">
                {lo(line.name)}
              </span>
            </div>
            <span className="text-center text-[23px] font-bold text-slate-700">
              x{line.quantity}
            </span>
            <span className="text-right text-[21px] font-semibold text-slate-700">
              {formatDisplayMoney(line.unitPrice)}
            </span>
            <span className="text-right text-[23px] font-black text-[#071633]">
              {formatDisplayMoney(line.unitPrice * line.quantity)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
