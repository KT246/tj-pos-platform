import {
  Clock3,
  MonitorSmartphone,
  ReceiptText,
  Store,
  UserRound
} from "lucide-react";

import type {
  CustomerBusinessBrand,
  CustomerDisplayDevice,
  CustomerDisplayOrder,
  CustomerDisplayScreen
} from "../types";

function HeaderPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[68px] items-center gap-4 rounded-[18px] border border-blue-100 bg-white px-7 text-[22px] font-bold text-slate-700 shadow-[0_8px_28px_rgba(13,91,255,0.08)]">
      {children}
    </div>
  );
}

export function DisplayHeader({
  brand,
  device,
  order,
  screen
}: {
  brand: CustomerBusinessBrand;
  device: CustomerDisplayDevice;
  order: CustomerDisplayOrder;
  screen: CustomerDisplayScreen;
}) {
  const isIdle = screen === "idle";
  const isPair = screen === "pair";
  const isSuccess = screen === "success";

  return (
    <header className="flex shrink-0 items-center justify-between gap-8">
      <div className="flex min-w-0 items-center gap-6">
        <img
          src={brand.logo}
          alt="TJ POS"
          className="h-[62px] w-[220px] shrink-0 object-contain object-left"
        />
        <div className="h-11 w-px bg-blue-100" />
        <div className="flex min-w-0 items-center gap-3 text-[24px] font-bold text-[#071633]">
          <Store className="h-7 w-7 shrink-0 text-slate-600" strokeWidth={2.4} />
          <span className="truncate">{brand.branch}</span>
        </div>
      </div>

      {isSuccess ? (
        <div className="h-[68px] w-[520px]" />
      ) : isPair ? (
        <HeaderPill>
          <MonitorSmartphone className="h-7 w-7 text-blue-600" strokeWidth={2.5} />
          <span>{device.name}</span>
          <span className="h-8 w-px bg-blue-100" />
          <span className="text-emerald-600">Pairing</span>
        </HeaderPill>
      ) : isIdle ? (
        <HeaderPill>
          <Clock3 className="h-8 w-8 text-slate-600" strokeWidth={2.5} />
          <span>{device.time}</span>
          <span className="h-8 w-px bg-blue-100" />
          <span className="h-4 w-4 rounded-full bg-emerald-500" />
          <span>{brand.status}</span>
        </HeaderPill>
      ) : (
        <HeaderPill>
          <ReceiptText className="h-7 w-7 text-slate-600" strokeWidth={2.5} />
          <span>
            Order <span className="text-blue-600">{order.id}</span>
          </span>
          <span className="h-8 w-px bg-blue-100" />
          <Clock3 className="h-7 w-7 text-slate-600" strokeWidth={2.5} />
          <span>{device.time}</span>
          <span className="h-8 w-px bg-blue-100" />
          <UserRound className="h-7 w-7 text-slate-600" strokeWidth={2.5} />
          <span>{device.cashier}</span>
        </HeaderPill>
      )}
    </header>
  );
}
