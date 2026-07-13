import { Barcode, Clock3, Menu, Search } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

import { PosNotificationButton } from "@/features/pos/components/notifications/pos-notification-ui"
import { formatCurrentDate, formatCurrentTime } from "@/features/pos/lib/current-date-time"
import type { SearchForm } from "@/features/pos/pages/pos-home-page"

type PosTopbarProps = {
  form: UseFormReturn<SearchForm>
  tableLabel?: string
  placeholder?: string
}

const searchPlaceholder = "ຄົ້ນຫາສິນຄ້າ..."

export function PosTopbar({ form, placeholder }: PosTopbarProps) {
  const now = new Date()

  return (
    <header className="flex h-[78px] shrink-0 items-center justify-between gap-3 border-b border-[#ded4c8] bg-[#fbfaf7]/95 px-4 backdrop-blur xl:px-5">
      <button
        type="button"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[#4f4032] transition hover:bg-[#f1e8dd]"
        aria-label="Menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      <form
        className="relative min-w-[240px] max-w-[520px] flex-1"
        onSubmit={(event) => event.preventDefault()}
      >
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b7258]" />
        <input
          {...form.register("q")}
          className="h-10 w-full rounded-md border border-[#ded4c8] bg-white pl-12 pr-14 text-sm font-medium text-[#2f2419] outline-none transition placeholder:text-[#a59686] focus:border-[#a97743] focus:ring-2 focus:ring-[#ead7bf]"
          placeholder={placeholder ?? searchPlaceholder}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md bg-[#f5f1eb] text-[#4f4032] transition hover:bg-[#f1e8dd]"
          aria-label="ສະແກນບາໂຄດ"
        >
          <Barcode className="h-5 w-5" />
        </button>
      </form>

      <div className="flex min-w-0 items-center gap-2 xl:gap-3">
        <div className="flex h-11 items-center gap-2 px-1 text-sm font-bold text-[#756656] xl:gap-3 xl:px-2">
          <PosNotificationButton />
          <span className="hidden xl:inline">{formatCurrentDate(now)}</span>
          <span>{formatCurrentTime(now)}</span>
          <Clock3 className="hidden h-5 w-5 xl:block" />
        </div>
      </div>
    </header>
  )
}
