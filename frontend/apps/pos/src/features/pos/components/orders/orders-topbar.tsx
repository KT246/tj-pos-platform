import { Barcode, Clock3, Menu, Search } from "lucide-react"

import { formatCurrentDate, formatCurrentTime } from "@/features/pos/lib/current-date-time"

type OrdersTopbarProps = {
  search?: string
  onSearchChange?: (search: string) => void
}

export function OrdersTopbar({
  search,
  onSearchChange,
}: OrdersTopbarProps) {
  const now = new Date()

  return (
    <header className="flex h-[78px] shrink-0 items-center justify-between gap-4 border-b border-[#ded4c8] bg-[#fbfaf7]/95 px-5 backdrop-blur">
      <button
        type="button"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[#4f4032] transition hover:bg-[#f1e8dd]"
        aria-label="Menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="relative min-w-[360px] max-w-[520px] flex-1">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b7258]" />
        <input
          value={search ?? ""}
          onChange={(event) => onSearchChange?.(event.target.value)}
          className="h-11 w-full rounded-lg border border-[#ded4c8] bg-white pl-12 pr-14 text-sm font-semibold text-[#2f2419] outline-none transition placeholder:text-[#a59686] focus:border-[#a97743] focus:ring-3 focus:ring-[#ead7bf]"
          placeholder="ຄົ້ນຫາເລກບິນ, ໂຕະ, ລູກຄ້າ..."
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg bg-[#f5f1eb] text-[#4f4032] transition hover:bg-[#f1e8dd]"
          aria-label="ສະແກນບາໂຄດ"
        >
          <Barcode className="h-5 w-5" />
        </button>
      </div>

      <div className="flex h-11 items-center gap-3 px-2 text-sm font-bold text-[#756656]">
        <span>{formatCurrentDate(now)}</span>
        <span>{formatCurrentTime(now)}</span>
        <Clock3 className="h-5 w-5" />
      </div>
    </header>
  )
}
