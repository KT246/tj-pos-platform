import type { CustomerDisplayOrder } from "../types";
import { formatDisplayMoney } from "../utils";

export function OrderReview({ order }: { order: CustomerDisplayOrder }) {
  return (
    <section className="flex h-full min-h-0 flex-col rounded-[20px] border border-blue-100 bg-white p-[clamp(12px,1.5vw,18px)] shadow-[0_14px_38px_rgba(13,91,255,0.08)]">
      <div className="grid grid-cols-[minmax(0,1.55fr)_clamp(78px,7vw,118px)_clamp(112px,9.5vw,162px)_clamp(112px,9.5vw,162px)] border-b border-blue-100 px-2 pb-[clamp(8px,1.1vh,12px)] text-[clamp(13px,1vw,16px)] font-bold text-slate-500">
        <span>{"ລາຍການ"}</span>
        <span className="text-center">{"ຈຳນວນ"}</span>
        <span className="text-right">{"ລາຄາຕໍ່ໜ່ວຍ"}</span>
        <span className="text-right">{"ຈຳນວນເງິນ"}</span>
      </div>

      <div className="min-h-0 overflow-hidden">
        {order.lines.map((line) => (
          <div
            key={line.id}
            className="grid grid-cols-[minmax(0,1.55fr)_clamp(78px,7vw,118px)_clamp(112px,9.5vw,162px)_clamp(112px,9.5vw,162px)] items-center border-b border-blue-50 px-2 py-[clamp(7px,1.15vh,10px)] last:border-b-0"
          >
            <div className="flex min-w-0 items-center gap-[clamp(10px,1.4vw,18px)]">
              <img
                src={line.image}
                alt={line.name}
                className="h-[clamp(42px,5.8vh,54px)] w-[clamp(42px,5.8vh,54px)] shrink-0 rounded-[12px] object-cover shadow-[0_8px_18px_rgba(15,23,42,0.12)]"
              />
              <span className="truncate text-[clamp(16px,1.35vw,21px)] font-black text-[#071633]">
                {line.name}
              </span>
            </div>
            <span className="text-center text-[clamp(16px,1.3vw,20px)] font-bold text-slate-700">
              x{line.quantity}
            </span>
            <span className="text-right text-[clamp(14px,1.18vw,18px)] font-semibold text-slate-700">
              {formatDisplayMoney(line.unitPrice)}
            </span>
            <span className="text-right text-[clamp(16px,1.3vw,20px)] font-black text-[#071633]">
              {formatDisplayMoney(line.unitPrice * line.quantity)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
