import {
  BellRing,
  ChefHat,
  ChevronDown,
  Clock3,
  RefreshCw,
  Settings,
  Store,
  Volume2,
  VolumeX
} from "lucide-react";

import { kitchenBusiness, kitchenStations } from "../data/kitchen-display-data";
import type { KitchenBoardMode, KitchenStationId } from "../types";
import { lo } from "../utils/lao-labels";

type KitchenTopbarProps = {
  mode: KitchenBoardMode;
  selectedStation: KitchenStationId;
  soundEnabled: boolean;
  alertCount: number;
  autoRefreshSeconds: number;
  onStationChange: (stationId: KitchenStationId) => void;
  onToggleSound: () => void;
  onOpenAlert: () => void;
  onOpenSettings: () => void;
  onRefresh: () => void;
};

export function KitchenTopbar({
  mode,
  selectedStation,
  soundEnabled,
  alertCount,
  autoRefreshSeconds,
  onStationChange,
  onToggleSound,
  onOpenAlert,
  onOpenSettings,
  onRefresh
}: KitchenTopbarProps) {
  return (
    <header className="shrink-0 border-b border-blue-100 bg-white shadow-[0_1px_0_rgba(37,99,235,0.06)]">
      <div className="grid min-h-[72px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-4 py-2 2xl:px-6">
        <div className="flex min-w-0 shrink-0 items-center gap-4 border-r border-blue-100 pr-4">
          <img
            src={kitchenBusiness.logo}
            alt="TJ POS"
            className="h-10 w-[142px] object-contain object-left 2xl:h-11 2xl:w-[164px]"
          />
          <div className="hidden shrink-0 items-center gap-3 text-[#0b1736] lg:flex">
            <ChefHat className="h-6 w-6 text-blue-600" strokeWidth={2.4} />
            <h1 className="whitespace-nowrap text-[18px] font-black 2xl:text-[19px]">
              {mode === "bar" ? "ຈໍບາ" : "ແດຊບອດຄົວ"}
            </h1>
          </div>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <button
            type="button"
            className="flex h-11 min-w-[190px] max-w-[260px] flex-1 cursor-pointer items-center justify-between gap-3 rounded-lg border border-blue-100 bg-white px-4 text-[15px] font-black text-[#0b1736] shadow-sm transition hover:border-blue-300 hover:bg-blue-50/60"
          >
            <span className="flex min-w-0 items-center gap-3">
              <Store className="h-5 w-5 shrink-0 text-[#0b1736]" strokeWidth={2.25} />
              <span className="truncate">{kitchenBusiness.branch}</span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2.4} />
          </button>

          <div className="flex h-11 shrink-0 items-center gap-3 rounded-lg border border-blue-100 bg-white px-3 shadow-sm">
            <Clock3 className="h-7 w-7 text-[#0b1736]" strokeWidth={2.3} />
            <div className="leading-none">
              <div className="text-[18px] font-black text-[#0b1736]">
                {kitchenBusiness.currentTime}
              </div>
              <div className="mt-1 text-[11px] font-semibold text-slate-500">
                {kitchenBusiness.currentDate}
              </div>
            </div>
          </div>

          <label className="relative flex h-11 min-w-[180px] max-w-[230px] flex-1 cursor-pointer items-center rounded-lg border border-blue-100 bg-white shadow-sm transition hover:border-blue-300">
            <ChefHat
              className="pointer-events-none absolute left-4 h-5 w-5 text-[#0b1736]"
              strokeWidth={2.25}
            />
            <select
              value={selectedStation}
              onChange={(event) =>
                onStationChange(event.currentTarget.value as KitchenStationId)
              }
              className="h-full w-full cursor-pointer appearance-none rounded-lg bg-transparent pr-10 pl-12 text-[15px] font-black text-[#0b1736] outline-none"
            >
              {kitchenStations.map((station) => (
                <option key={station.id} value={station.id}>
                  {lo(station.label)}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 h-4 w-4 text-slate-400"
              strokeWidth={2.4}
            />
          </label>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onToggleSound}
            className="flex h-11 cursor-pointer items-center gap-2 rounded-lg px-2 text-[14px] font-black text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
          >
            {soundEnabled ? (
              <Volume2 className="h-7 w-7" strokeWidth={2.5} />
            ) : (
              <VolumeX className="h-7 w-7 text-slate-500" strokeWidth={2.5} />
            )}
            <span className="hidden 2xl:inline">
              {soundEnabled ? "ເປີດສຽງ" : "ປິດສຽງ"}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenAlert}
            className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-blue-100 bg-white text-[#0b1736] shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
            aria-label="Open new order alert"
          >
            <BellRing className="h-6 w-6" strokeWidth={2.4} />
            {alertCount > 0 ? (
              <span className="absolute -top-2 -right-2 grid h-6 min-w-6 place-items-center rounded-full bg-red-500 px-1 text-[11px] font-black text-white shadow-sm">
                {alertCount}
              </span>
            ) : null}
          </button>

          <div className="hidden h-11 items-center gap-3 rounded-lg px-2 xl:flex">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <div className="text-right leading-tight">
              <div className="text-[12px] font-black text-[#0b1736]">
                ເຊື່ອມຕໍ່ແລ້ວ
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                {lo("Auto Refresh")} {autoRefreshSeconds}s
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50"
            aria-label="Refresh kitchen tickets"
          >
            <RefreshCw className="h-6 w-6" strokeWidth={2.5} />
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-blue-100 bg-white text-[#0b1736] shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
            aria-label="Open kitchen settings"
          >
            <Settings className="h-6 w-6" strokeWidth={2.35} />
          </button>
        </div>
      </div>
    </header>
  );
}
