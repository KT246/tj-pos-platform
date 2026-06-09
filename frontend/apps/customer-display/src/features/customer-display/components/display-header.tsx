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
    <div className="flex h-[clamp(52px,7vh,68px)] items-center gap-[clamp(10px,1.2vw,16px)] rounded-[18px] border border-blue-100 bg-white px-[clamp(16px,2vw,28px)] text-[clamp(17px,1.35vw,22px)] font-bold text-slate-700 shadow-[0_8px_28px_rgba(13,91,255,0.08)]">
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
    <header className="flex min-w-0 shrink-0 items-center justify-between gap-[clamp(16px,2vw,32px)]">
      <div className="flex min-w-0 items-center gap-[clamp(14px,1.6vw,24px)]">
        <img
          src={brand.logo}
          alt="TJ POS"
          className="h-[clamp(44px,6.5vh,62px)] w-[clamp(155px,13vw,220px)] shrink-0 object-contain object-left"
        />
        <div className="h-11 w-px bg-blue-100" />
        <div className="flex min-w-0 items-center gap-3 text-[clamp(19px,1.55vw,24px)] font-bold text-[#071633]">
          <Store className="h-7 w-7 shrink-0 text-slate-600" strokeWidth={2.4} />
          <span className="truncate">{brand.branch}</span>
        </div>
      </div>

      {isSuccess ? (
        <div className="h-[clamp(52px,7vh,68px)] w-[clamp(360px,31vw,520px)]" />
      ) : isPair ? (
        <HeaderPill>
          <MonitorSmartphone className="h-7 w-7 text-blue-600" strokeWidth={2.5} />
          <span>{device.name}</span>
          <span className="h-8 w-px bg-blue-100" />
          <span className="text-emerald-600">{"ກຳລັງຈັບຄູ່"}</span>
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
            {"ອໍເດີ"} <span className="text-blue-600">{order.id}</span>
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
