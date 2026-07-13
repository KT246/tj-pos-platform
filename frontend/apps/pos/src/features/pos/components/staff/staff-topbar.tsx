import {
  CalendarDays,
  ChevronDown,
  Clock3,
  Menu,
  Search,
  Store,
} from "lucide-react"
import type { ComponentType } from "react"

import { formatCurrentDate, formatCurrentTime } from "@/features/pos/lib/current-date-time"

export function StaffTopbar() {
  const now = new Date()

  return (
    <header className="flex h-[86px] shrink-0 items-center justify-between gap-4 border-b border-[#eadfce] bg-[#fbf7ef]/92 px-6 backdrop-blur">
      <button
        type="button"
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-[#4b321a] transition hover:bg-[#efe3d2]"
        aria-label="Menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="relative min-w-[360px] max-w-[520px] flex-1">
        <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b7258]" />
        <input
          className="h-[54px] w-full rounded-xl border border-[#eadfce] bg-white pl-14 pr-16 text-[15px] font-semibold text-[#3b2511] shadow-[0_12px_30px_rgba(80,54,27,0.06)] outline-none transition placeholder:text-[#b8aa9a] focus:border-[#b98b56] focus:ring-4 focus:ring-[#f4dec2]"
          placeholder="ຄົ້ນຫາພະນັກງານ..."
        />
        <kbd className="absolute right-4 top-1/2 flex h-8 -translate-y-1/2 items-center rounded-lg border border-[#eadfce] bg-[#fbf7ef] px-2 text-xs font-black text-[#7c6448]">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-3">
        <TopbarButton icon={Store} title="ສາຂາ 1" />
        <TopbarButton icon={CalendarDays} title={formatCurrentDate(now)} />
        <div className="flex h-[54px] items-center gap-3 px-2 text-sm font-black text-[#5f4a35]">
          <Clock3 className="h-5 w-5" />
          {formatCurrentTime(now)}
        </div>
      </div>
    </header>
  )
}

function TopbarButton({
  icon: Icon,
  title,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
}) {
  return (
    <button
      type="button"
      className="flex h-[54px] cursor-pointer items-center gap-3 rounded-xl bg-[#efe5d8] px-5 text-left text-sm font-bold text-[#4b321a] transition hover:bg-[#e5d6c4]"
    >
      <Icon className="h-5 w-5" />
      {title}
      <ChevronDown className="h-4 w-4 text-[#8a7560]" />
    </button>
  )
}
