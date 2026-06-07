import {
  BellRing,
  ChefHat,
  Clock3,
  RefreshCw,
  Settings,
  Store,
  Volume2,
  VolumeX
} from "lucide-react";

import { kitchenBusiness } from "../data/kitchen-display-data";
import type { KitchenBoardMode } from "../types";

type KitchenTopbarProps = {
  mode: KitchenBoardMode;
  soundEnabled: boolean;
  alertCount: number;
  autoRefreshSeconds: number;
  onToggleSound: () => void;
  onOpenAlert: () => void;
  onOpenSettings: () => void;
  onRefresh: () => void;
};

export function KitchenTopbar({
  mode,
  soundEnabled,
  alertCount,
  autoRefreshSeconds,
  onToggleSound,
  onOpenAlert,
  onOpenSettings,
  onRefresh
}: KitchenTopbarProps) {
  return (
    <header className="flex h-[76px] shrink-0 items-center border-b border-blue-100 bg-white px-8 shadow-[0_1px_0_rgba(37,99,235,0.06)]">
      <div className="flex h-full items-center gap-7 border-r border-blue-100 pr-8">
        <img
          src={kitchenBusiness.logo}
          alt="TJ POS"
          className="h-[44px] w-[178px] object-contain object-left"
        />
      </div>

      <div className="ml-7 flex items-center gap-3 text-[#0b1736]">
        <ChefHat className="h-7 w-7 text-blue-600" strokeWidth={2.4} />
        <h1 className="text-[21px] font-black">
          {mode === "bar" ? "Bar Display" : "Kitchen Dashboard"}
        </h1>
      </div>

      <div className="ml-auto flex h-full items-center gap-5">
        <button
          type="button"
          className="flex h-12 min-w-[240px] items-center justify-between gap-4 rounded-xl border border-blue-100 bg-white px-4 text-[15px] font-black text-[#0b1736] shadow-sm transition hover:border-blue-300 hover:bg-blue-50/60"
        >
          <span className="flex items-center gap-3">
            <Store className="h-6 w-6 text-[#0b1736]" strokeWidth={2.25} />
            {kitchenBusiness.branch}
          </span>
          <span className="text-lg text-slate-400">⌄</span>
        </button>

        <div className="flex items-center gap-3 border-l border-blue-100 pl-5">
          <Clock3 className="h-9 w-9 text-[#0b1736]" strokeWidth={2.3} />
          <div>
            <div className="text-[20px] leading-none font-black text-[#0b1736]">
              {kitchenBusiness.currentTime}
            </div>
            <div className="mt-1 text-[12px] font-semibold text-slate-500">
              {kitchenBusiness.currentDate}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleSound}
          className="flex h-12 items-center gap-3 border-l border-blue-100 pl-5 text-[15px] font-black text-blue-600 transition hover:text-blue-700"
        >
          {soundEnabled ? (
            <Volume2 className="h-7 w-7" strokeWidth={2.5} />
          ) : (
            <VolumeX className="h-7 w-7 text-slate-500" strokeWidth={2.5} />
          )}
          {soundEnabled ? "Sound ON" : "Sound OFF"}
        </button>

        <button
          type="button"
          onClick={onOpenAlert}
          className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-white text-[#0b1736] shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
          aria-label="Open new order alert"
        >
          <BellRing className="h-6 w-6" strokeWidth={2.4} />
          {alertCount > 0 ? (
            <span className="absolute -top-2 -right-2 grid h-6 min-w-6 place-items-center rounded-full bg-red-500 px-1 text-[11px] font-black text-white shadow-sm">
              {alertCount}
            </span>
          ) : null}
        </button>

        <div className="flex items-center gap-3 border-l border-blue-100 pl-5">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          <div className="text-right">
            <div className="text-[13px] font-black text-[#0b1736]">Connected</div>
            <div className="text-[12px] font-semibold text-slate-500">
              Auto-refresh {autoRefreshSeconds}s
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="flex h-12 w-12 items-center justify-center rounded-xl text-blue-600 transition hover:bg-blue-50"
          aria-label="Refresh kitchen tickets"
        >
          <RefreshCw className="h-6 w-6" strokeWidth={2.5} />
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-white text-[#0b1736] shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
          aria-label="Open kitchen settings"
        >
          <Settings className="h-6 w-6" strokeWidth={2.35} />
        </button>
      </div>
    </header>
  );
}
