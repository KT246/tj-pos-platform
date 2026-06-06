import {
  CheckCircle2,
  ChefHat,
  ClipboardList,
  ListFilter,
  Timer
} from "lucide-react";

import { kitchenStations } from "../data/kitchen-display-data";
import type {
  KitchenSortMode,
  KitchenStationId,
  KitchenVisibleStatus
} from "../types";

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
  { id: "new", label: "New", icon: ClipboardList },
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

function getStationClass(stationId: KitchenStationId, selected: boolean) {
  if (selected) {
    return stationId === "all"
      ? "border-orange-500 bg-orange-50 text-orange-600"
      : "border-blue-500 bg-blue-50 text-blue-600";
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
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {statusOptions.map(({ id, label, icon: Icon }) => {
          const active = activeStatus === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onStatusChange(id)}
              className={`flex h-[96px] items-center justify-between rounded-xl border px-8 transition ${getStatusClass(
                id,
                active
              )}`}
            >
              <span className="flex items-center gap-4">
                <Icon className="h-9 w-9" strokeWidth={2.3} />
                <span className="text-[27px] font-black">{label}</span>
              </span>
              <span className="text-[40px] font-black leading-none">
                {counts[id]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-5">
        <div className="flex flex-wrap gap-3">
          {kitchenStations.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onStationChange(id)}
              className={`flex h-[54px] min-w-[128px] items-center justify-center gap-3 rounded-xl border px-5 text-[15px] font-black transition ${getStationClass(
                id,
                selectedStation === id
              )}`}
            >
              <Icon className="h-5 w-5" strokeWidth={2.3} />
              {label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[228px]">
          <ListFilter
            className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#0b1736]"
            strokeWidth={2.25}
          />
          <select
            value={sortMode}
            onChange={(event) =>
              onSortChange(event.currentTarget.value as KitchenSortMode)
            }
            className="h-[54px] w-full appearance-none rounded-xl border border-blue-100 bg-white pr-10 pl-12 text-[15px] font-black text-[#0b1736] shadow-sm outline-none transition hover:border-blue-300 focus:border-blue-500"
          >
            <option value="longest">Longest Waiting</option>
            <option value="priority">Priority First</option>
            <option value="newest">Newest First</option>
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
