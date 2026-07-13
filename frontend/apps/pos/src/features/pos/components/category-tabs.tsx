import type { PosCategory } from "@/features/pos/types"
import { cn } from "@/lib/utils"

type CategoryTabsProps = {
  categories: PosCategory[]
  activeCategoryId: string
  onChange: (categoryId: string) => void
}

export function CategoryTabs({
  categories,
  activeCategoryId,
  onChange,
}: CategoryTabsProps) {
  return (
    <div className="relative h-16 shrink-0 overflow-hidden border-b border-[#ded4c8] bg-[#fbfaf7]">
      <div className="scrollbar-none flex h-full items-center gap-2 overflow-x-auto px-4 pr-10">
        {categories.map((category) => {
          const active = activeCategoryId === category.id

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(category.id)}
              className={cn(
                "flex h-10 shrink-0 cursor-pointer items-center rounded-lg px-4 text-sm font-bold transition",
                active
                  ? "bg-[#2f2419] text-white"
                  : "border border-[#ded4c8] bg-white text-[#4f4032] hover:bg-[#f7f1e9]",
              )}
            >
              {category.label}
            </button>
          )
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />
    </div>
  )
}
