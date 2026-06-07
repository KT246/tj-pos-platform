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
        compact ? "p-4" : "p-6"
      }`}
    >
      <div className={compact ? "space-y-2" : "space-y-4"}>
        <div
          className={`flex items-center justify-between font-medium text-slate-600 ${
            compact ? "text-[18px]" : "text-[20px]"
          }`}
        >
          <span>Subtotal</span>
          <strong className="font-black text-[#071633]">
            {formatDisplayMoney(order.summary.subtotal)}
          </strong>
        </div>
        <div
          className={`flex items-center justify-between font-medium text-slate-600 ${
            compact ? "text-[18px]" : "text-[20px]"
          }`}
        >
          <span className="flex items-center gap-2">
            Service Charge (5%)
            <Info className="h-5 w-5 text-slate-400" strokeWidth={2.4} />
          </span>
          <strong className="font-black text-[#071633]">
            {formatDisplayMoney(order.summary.serviceCharge)}
          </strong>
        </div>
        <div
          className={`flex items-center justify-between font-medium text-emerald-600 ${
            compact ? "text-[18px]" : "text-[20px]"
          }`}
        >
          <span>Discount</span>
          <strong>-{formatDisplayMoney(order.summary.discount)}</strong>
        </div>
      </div>

      <div className={compact ? "mt-2.5 border-t border-blue-100 pt-2.5" : "mt-5 border-t border-blue-100 pt-5"}>
        <div className={`${compact ? "text-[20px]" : "text-[22px]"} font-black text-[#071633]`}>
          Total Due
        </div>
        <div className={`${compact ? "text-[44px]" : "text-[58px]"} text-right font-black leading-none text-blue-600`}>
          LAK {formatDisplayMoneyCompact(order.summary.total)}
        </div>
      </div>
    </section>
  );
}

export function BankDetailsCard({ bank }: { bank: CustomerBankDetails }) {
  const rows = [
    ["Bank Name:", bank.bankName],
    ["Account Name:", bank.accountName],
    ["Account No.:", bank.accountNo],
    ["Reference:", bank.reference]
  ];

  return (
    <section className="rounded-[20px] border border-blue-100 bg-white p-5 shadow-[0_14px_38px_rgba(13,91,255,0.08)]">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-600">
          <Landmark className="h-8 w-8" strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[22px] font-black text-blue-600">
            Bank Transfer Details
          </h3>
          <div className="mt-3 space-y-2">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[170px_minmax(0,1fr)] border-b border-dashed border-blue-100 pb-1.5 text-[17px] last:border-b-0 last:pb-0"
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
        size === "small" ? "p-3" : "p-5"
      }`}
    >
      <h3
        className={`${size === "small" ? "mb-2 text-[20px]" : "mb-3 text-[22px]"} font-black text-[#071633]`}
      >
        Payment Method
      </h3>
      <PaymentMethods
        methods={customerPaymentMethods}
        selected={selected}
        size={size}
      />
      {note ? (
        <div
          className={`${size === "small" ? "mt-2 text-[14px]" : "mt-3 text-[17px]"} flex items-center gap-2 font-bold text-blue-600`}
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
