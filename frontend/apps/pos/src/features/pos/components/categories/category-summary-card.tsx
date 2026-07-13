import type { CafeCategory } from "@/features/pos/data/cafe-categories"
import { cn } from "@/lib/utils"

type CategorySummaryCardProps = {
  category?: CafeCategory
  label: string
  countLabel: string
  active: boolean
  onClick: () => void
}

export function CategorySummaryCard({
  label,
  countLabel,
  active,
  onClick,
}: CategorySummaryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-[64px] min-w-[170px] cursor-pointer items-center rounded-md border bg-white px-4 text-left transition",
        active
          ? "border-[#2f2419] bg-[#fffdfa] ring-2 ring-[#d8c0a2]"
          : "border-[#ded4c8] hover:border-[#bcae9b] hover:bg-[#fffdfa]",
      )}
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-[#2f2419]">{label}</span>
        <span className="mt-1 block truncate text-xs font-semibold text-[#6f5c49]">
          {countLabel}
        </span>
      </span>
    </button>
  )
}
