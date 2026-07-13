import {
  Bell,
  CalendarDays,
  Clock3,
  Menu,
  Store,
} from "lucide-react"
import type { ComponentType } from "react"

import { formatCurrentDate, formatCurrentTime } from "@/features/pos/lib/current-date-time"

export function PromotionsTopbar() {
  const now = new Date()

  return (
    <header className="flex h-[64px] shrink-0 items-center justify-between gap-4 border-b border-[#ded4c8] bg-[#fbfaf7] px-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-[#4f4032] transition hover:bg-[#f6f1ea]"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-bold text-[#2f2419]">Coffee Time</p>
          <p className="text-xs font-semibold text-[#6f5c49]">ໂປຣໂມຊັນ</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold text-[#4f4032]">
        <TopbarPill icon={Store} title="ສາຂາ 1" />
        <TopbarPill icon={CalendarDays} title={formatCurrentDate(now)} />
        <TopbarPill icon={Clock3} title={formatCurrentTime(now)} />
        <button
          type="button"
          className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-[#4f4032] transition hover:bg-[#f6f1ea]"
          aria-label="ແຈ້ງເຕືອນ"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c43128] px-1 text-[10px] font-bold text-white">
            2
          </span>
        </button>
      </div>
    </header>
  )
}

function TopbarPill({
  icon: Icon,
  title,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
}) {
  return (
    <div className="flex h-10 items-center gap-2 rounded-md px-2">
      <Icon className="h-4 w-4 text-[#6f5c49]" />
      {title}
    </div>
  )
}
