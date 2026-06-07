import { ChevronDown, Menu, Wifi } from "lucide-react";

import { branchName, cashierName, shiftName } from "../data/mock-pos-data";
import { usePosTerminalStore } from "../stores/pos-terminal-store";
import { lo } from "../utils/lao-labels";
import { TerminalBrand } from "./terminal-brand";

export function TerminalTopBar() {
  const showNotice = usePosTerminalStore((state) => state.showNotice);

  return (
    <header className="z-20 shrink-0 border-b border-blue-100 bg-white/95 backdrop-blur">
      <div className="grid h-14 grid-cols-[196px_1fr_44px] items-center gap-3 px-4">
        <TerminalBrand />
        <div className="hidden min-w-0 items-center divide-x divide-blue-100 overflow-hidden rounded-lg border border-blue-100 bg-[#f8fbff] lg:flex">
          <TopMeta label="Branch" value={branchName} />
          <TopCashier />
          <TopMeta label="Shift" value={`${shiftName} - 09:00 AM`} />
          <span className="flex h-10 items-center gap-2 px-4 text-[12px] font-black text-emerald-600">
            {lo("Online")}
            <Wifi className="h-4 w-4" />
          </span>
        </div>
        <button
          type="button"
          onClick={() => showNotice(lo("Terminal menu will open here."))}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-white text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
          aria-label={lo("Open terminal menu")}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

function TopMeta({ label, value }: { label: string; value: string }) {
  return (
    <button
      type="button"
      className="flex h-10 min-w-40 items-center justify-between gap-3 px-4 text-left transition hover:bg-blue-50"
    >
      <span className="min-w-0">
        <span className="block text-[10px] font-black text-slate-500">{lo(label)}</span>
        <span className="block truncate text-[12px] font-black text-slate-950">
          {lo(value)}
        </span>
      </span>
      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
    </button>
  );
}

function TopCashier() {
  return (
    <button
      type="button"
      className="flex h-10 min-w-44 items-center gap-3 px-4 text-left transition hover:bg-blue-50"
    >
      <img
        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80"
        alt=""
        className="h-7 w-7 rounded-full border border-blue-100 object-cover"
      />
      <span className="min-w-0">
        <span className="block text-[10px] font-black text-slate-500">{lo("Cashier")}</span>
        <span className="block truncate text-[12px] font-black text-slate-950">
          {cashierName}
        </span>
      </span>
    </button>
  );
}
