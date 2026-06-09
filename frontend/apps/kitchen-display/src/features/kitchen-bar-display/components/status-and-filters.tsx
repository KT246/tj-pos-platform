import { CheckCircle2, ChefHat, ClipboardList, ListFilter, Timer } from "lucide-react";

import { kitchenStations } from "../data/kitchen-display-data";
import type { KitchenSortMode, KitchenStationId, KitchenVisibleStatus } from "../types";
import { lo } from "../utils/lao-labels";

type StatusAndFiltersProps = {
  activeStatus: KitchenVisibleStatus;
  selectedStation: KitchenStationId;
  sortMode: KitchenSortMode;
  counts: Record<KitchenVisibleStatus, number>;
  onStatusChange: (status: KitchenVisibleStatus) => void;
  onStationChange: (station: KitchenStationId) => void;
  onSortChange: (sort: KitchenSortMode) => void;
};

const statusOptions: Array<{
  id: KitchenVisibleStatus;
  label: string;
  icon: typeof ClipboardList;
}> = [
  { id: "pending", label: "New", icon: ClipboardList },
  { id: "preparing", label: "Preparing", icon: ChefHat },
  { id: "ready", label: "Ready", icon: CheckCircle2 }
];

function getStatusClass(status: KitchenVisibleStatus, active: boolean) {
  if (status === "preparing") {
    return active
      ? "border-orange-500 bg-white text-orange-600 shadow-[0_10px_30px_rgba(249,115,22,0.12)]"
      : "border-blue-100 bg-white text-[#0b1736] hover:border-orange-200 hover:bg-orange-50";
  }

  if (status === "ready") {
    return active
      ? "border-emerald-500 bg-white text-emerald-600 shadow-[0_10px_30px_rgba(16,185,129,0.12)]"
      : "border-blue-100 bg-white text-[#0b1736] hover:border-emerald-200 hover:bg-emerald-50";
  }

  return active
    ? "border-blue-600 bg-white text-blue-600 shadow-[0_10px_30px_rgba(37,99,235,0.12)]"
    : "border-blue-100 bg-white text-[#0b1736] hover:border-blue-300 hover:bg-blue-50";
}

function getStationClass(selected: boolean) {
  if (selected) {
    return "border-blue-500 bg-blue-50 text-blue-600";
  }

  return "border-blue-100 bg-white text-[#0b1736] hover:border-blue-300 hover:bg-blue-50";
}

export function StatusAndFilters({
  activeStatus,
  selectedStation,
  sortMode,
  counts,
  onStatusChange,
  onStationChange,
  onSortChange
}: StatusAndFiltersProps) {
  return (
    <div className="space-y-3 2xl:space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 2xl:gap-4">
        {statusOptions.map(({ id, label, icon: Icon }) => {
          const active = activeStatus === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onStatusChange(id)}
              className={`flex h-[68px] cursor-pointer items-center justify-between rounded-xl border px-4 transition lg:h-[78px] xl:h-[82px] 2xl:h-[86px] 2xl:px-8 ${getStatusClass(
                id,
                active
              )}`}
            >
              <span className="flex min-w-0 items-center gap-3 lg:gap-4">
                <Icon className="h-7 w-7 shrink-0 lg:h-8 lg:w-8" strokeWidth={2.3} />
                <span className="truncate whitespace-nowrap text-[19px] font-black lg:text-[22px] 2xl:text-[26px]">
                  {lo(label)}
                </span>
              </span>
              <span className="ml-3 text-[32px] leading-none font-black lg:text-[36px] 2xl:text-[38px]">
                {counts[id]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 2xl:gap-5">
        <div className="flex flex-wrap gap-3">
          {kitchenStations.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onStationChange(id)}
              className={`flex h-11 min-w-[118px] cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 text-[14px] font-black transition 2xl:h-[48px] 2xl:min-w-[128px] 2xl:gap-3 2xl:px-5 2xl:text-[15px] ${getStationClass(
                selectedStation === id
              )}`}
            >
              <Icon className="h-5 w-5" strokeWidth={2.3} />
              {lo(label)}
            </button>
          ))}
        </div>

        <div className="relative min-w-[210px]">
          <ListFilter
            className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#0b1736]"
            strokeWidth={2.25}
          />
          <select
            value={sortMode}
            onChange={(event) =>
              onSortChange(event.currentTarget.value as KitchenSortMode)
            }
            className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-blue-100 bg-white pr-10 pl-12 text-[14px] font-black text-[#0b1736] shadow-sm transition outline-none hover:border-blue-300 focus:border-blue-500 2xl:h-[48px] 2xl:text-[15px]"
          >
            <option value="longest">{lo("Longest Waiting")}</option>
            <option value="priority">{lo("Priority First")}</option>
            <option value="newest">{lo("Newest First")}</option>
          </select>
          <Timer
            className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-400"
            strokeWidth={2.2}
          />
        </div>
      </div>
    </div>
  );
}
