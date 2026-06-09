import { Info, Landmark, ShieldCheck } from "lucide-react";

import { customerPaymentMethods } from "../data/customer-display-data";
import type {
  CustomerBankDetails,
  CustomerDisplayOrder,
  CustomerPaymentMethodId
} from "../types";
import {
  formatDisplayMoney,
  formatDisplayMoneyCompact
} from "../utils";
import { PaymentMethods } from "./payment-methods";

export function OrderSummaryCard({
  order,
  density = "regular"
}: {
  order: CustomerDisplayOrder;
  density?: "regular" | "compact";
}) {
  const compact = density === "compact";

  return (
    <section
      className={`rounded-[20px] border border-blue-100 bg-white shadow-[0_14px_38px_rgba(13,91,255,0.08)] ${
        compact ? "p-[clamp(8px,1vw,12px)]" : "p-[clamp(18px,2vw,24px)]"
      }`}
    >
      <div className={compact ? "space-y-1" : "space-y-4"}>
        <div
          className={`flex items-center justify-between font-medium text-slate-600 ${
            compact ? "text-[clamp(12px,0.98vw,15px)]" : "text-[clamp(17px,1.35vw,20px)]"
          }`}
        >
          <span>{"ຍອດກ່ອນຫຼຸດ"}</span>
          <strong className="font-black text-[#071633]">
            {formatDisplayMoney(order.summary.subtotal)}
          </strong>
        </div>
        <div
          className={`flex items-center justify-between font-medium text-slate-600 ${
            compact ? "text-[clamp(12px,0.98vw,15px)]" : "text-[clamp(17px,1.35vw,20px)]"
          }`}
        >
          <span className="flex items-center gap-2">
            {"ຄ່າບໍລິການ (5%)"}
            <Info className="h-5 w-5 text-slate-400" strokeWidth={2.4} />
          </span>
          <strong className="font-black text-[#071633]">
            {formatDisplayMoney(order.summary.serviceCharge)}
          </strong>
        </div>
        <div
          className={`flex items-center justify-between font-medium text-emerald-600 ${
            compact ? "text-[clamp(12px,0.98vw,15px)]" : "text-[clamp(17px,1.35vw,20px)]"
          }`}
        >
          <span>{"ສ່ວນຫຼຸດ"}</span>
          <strong>-{formatDisplayMoney(order.summary.discount)}</strong>
        </div>
      </div>

      <div className={compact ? "mt-1.5 border-t border-blue-100 pt-1.5" : "mt-5 border-t border-blue-100 pt-5"}>
        <div className={`${compact ? "text-[clamp(13px,1.05vw,16px)]" : "text-[clamp(18px,1.5vw,22px)]"} font-black text-[#071633]`}>
          {"ຍອດຕ້ອງຊຳລະ"}
        </div>
        <div className={`${compact ? "text-[clamp(27px,2.65vw,36px)]" : "text-[clamp(42px,4.4vw,58px)]"} text-right font-black leading-none text-blue-600`}>
          LAK {formatDisplayMoneyCompact(order.summary.total)}
        </div>
      </div>
    </section>
  );
}

export function BankDetailsCard({ bank }: { bank: CustomerBankDetails }) {
  const rows = [
    ["ທະນາຄານ:", bank.bankName],
    ["ຊື່ບັນຊີ:", bank.accountName],
    ["ເລກບັນຊີ:", bank.accountNo],
    ["ອ້າງອີງ:", bank.reference]
  ];

  return (
    <section className="rounded-[20px] border border-blue-100 bg-white p-[clamp(10px,1.2vw,14px)] shadow-[0_14px_38px_rgba(13,91,255,0.08)]">
      <div className="flex items-start gap-[clamp(12px,1.2vw,16px)]">
        <div className="flex h-[clamp(44px,6vh,56px)] w-[clamp(44px,6vh,56px)] shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-600">
          <Landmark className="h-[clamp(26px,3.6vh,32px)] w-[clamp(26px,3.6vh,32px)]" strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[clamp(15px,1.3vw,19px)] font-black text-blue-600">
            {"ຂໍ້ມູນໂອນເງິນ"}
          </h3>
          <div className="mt-[clamp(6px,0.9vh,10px)] space-y-1">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[clamp(100px,8.7vw,150px)_minmax(0,1fr)] border-b border-dashed border-blue-100 pb-0.5 text-[clamp(11px,0.92vw,14px)] last:border-b-0 last:pb-0"
              >
                <span className="font-medium text-slate-500">{label}</span>
                <strong className="truncate text-right font-black text-[#071633]">
                  {value}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PaymentMethodCard({
  selected,
  note,
  size = "medium"
}: {
  selected: CustomerPaymentMethodId;
  note?: string;
  size?: "medium" | "small";
}) {
  return (
    <section
      className={`rounded-[20px] border border-blue-100 bg-white shadow-[0_14px_38px_rgba(13,91,255,0.08)] ${
        size === "small" ? "p-[clamp(8px,1vw,10px)]" : "p-[clamp(14px,1.7vw,20px)]"
      }`}
    >
      <h3
        className={`${size === "small" ? "mb-1.5 text-[clamp(15px,1.25vw,18px)]" : "mb-3 text-[clamp(18px,1.55vw,22px)]"} font-black text-[#071633]`}
      >
        {"ວິທີຊຳລະ"}
      </h3>
      <PaymentMethods
        methods={customerPaymentMethods}
        selected={selected}
        size={size}
      />
      {note ? (
        <div
          className={`${size === "small" ? "mt-1.5 text-[clamp(11px,0.9vw,13px)]" : "mt-3 text-[clamp(14px,1.15vw,17px)]"} flex items-center gap-2 font-bold text-blue-600`}
        >
          <ShieldCheck
            className={size === "small" ? "h-5 w-5" : "h-6 w-6"}
            strokeWidth={2.5}
          />
          <span>{note}</span>
        </div>
      ) : null}
    </section>
  );
}
