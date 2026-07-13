import { GripVertical } from "lucide-react"
import type { ReactNode } from "react"

import type { CafeCategory } from "@/features/pos/data/cafe-categories"
import { cn } from "@/lib/utils"

type CategoryTableProps = {
  categories: CafeCategory[]
  totalCategories: number
  page: number
  pageSize: number
  totalPages: number
  selectedCategoryId: string
  draggingCategoryId: string | null
  dragDisabled: boolean
  onSelect: (categoryId: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onDragStart: (categoryId: string) => void
  onDragEnd: () => void
  onDropOnCategory: (categoryId: string) => void
}

export function CategoryTable({
  categories,
  totalCategories,
  page,
  pageSize,
  totalPages,
  selectedCategoryId,
  draggingCategoryId,
  dragDisabled,
  onSelect,
  onPageChange,
  onPageSizeChange,
  onDragStart,
  onDragEnd,
  onDropOnCategory,
}: CategoryTableProps) {
  const firstVisibleIndex = totalCategories ? (page - 1) * pageSize + 1 : 0
  const lastVisibleIndex = Math.min(page * pageSize, totalCategories)
  const pageNumbers = buildPageNumbers(page, totalPages)

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <div className="grid h-11 shrink-0 grid-cols-[64px_minmax(260px,1fr)_120px_140px_130px] items-center border-b border-[#ded4c8] bg-[#fbfaf7] px-4 text-xs font-bold uppercase tracking-normal text-[#6f5c49]">
        <span />
        <span>ໝວດໝູ່</span>
        <span>ສິນຄ້າ</span>
        <span>ລຳດັບ</span>
        <span>ສະຖານະ</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-[#f7f3ec]">
        {categories.length ? (
          categories.map((category) => {
            const selected = category.id === selectedCategoryId
            const dragging = category.id === draggingCategoryId

            return (
              <div
                key={category.id}
                draggable={!dragDisabled}
                onDragStart={() => {
                  if (!dragDisabled) onDragStart(category.id)
                }}
                onDragOver={(event) => {
                  if (!dragDisabled) event.preventDefault()
                }}
                onDrop={() => {
                  if (!dragDisabled) onDropOnCategory(category.id)
                }}
                onDragEnd={onDragEnd}
                onClick={() => onSelect(category.id)}
                className={cn(
                  "grid min-h-[64px] cursor-pointer grid-cols-[64px_minmax(260px,1fr)_120px_140px_130px] items-center border-b border-[#ded4c8] bg-white px-4 text-sm transition last:border-b-0",
                  selected
                    ? "relative z-[1] bg-[#fffdfa] ring-2 ring-inset ring-[#d8c0a2]"
                    : "hover:bg-[#fbfaf7]",
                  dragging ? "opacity-45" : "opacity-100",
                )}
              >
                <button
                  type="button"
                  disabled={dragDisabled}
                  className="flex h-9 w-9 cursor-grab items-center justify-center rounded-md text-[#6f5c49] transition hover:bg-[#f6f1ea] active:cursor-grabbing disabled:cursor-not-allowed disabled:text-[#8a7560]"
                  aria-label={`ລາກ ${category.name}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <GripVertical className="h-4 w-4" />
                </button>

                <div className="min-w-0">
                  <div className="truncate font-bold text-[#2f2419]">
                    {category.name}
                  </div>
                </div>

                <span className="font-semibold text-[#2f2419]">
                  {category.productCount}
                </span>
                <span>
                  <span className="inline-flex h-8 min-w-10 items-center justify-center rounded-md bg-[#f6f1ea] px-3 font-semibold text-[#4f4032]">
                    {category.sortOrder}
                  </span>
                </span>
                <span>
                  <StatusBadge status={category.status} />
                </span>
              </div>
            )
          })
        ) : (
          <div className="flex h-full min-h-[280px] items-center justify-center bg-white px-6 text-center">
            <div>
              <h3 className="text-base font-bold text-[#2f2419]">
                ບໍ່ພົບໝວດໝູ່ທີ່ກົງເງື່ອນໄຂ
              </h3>
              <p className="mt-1 text-sm font-medium text-[#6f5c49]">
                ລອງປ່ຽນຄຳຄົ້ນຫາ ຫຼື ສະຖານະການກອງ.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex h-[58px] shrink-0 items-center justify-between border-t border-[#ded4c8] bg-[#fbfaf7] px-4 text-sm font-semibold text-[#4f4032]">
        <span>
          ສະແດງ {firstVisibleIndex} - {lastVisibleIndex} ຈາກ {totalCategories} ໝວດໝູ່
        </span>
        <div className="flex items-center gap-2">
          <PageButton disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            ກ່ອນ
          </PageButton>
          {pageNumbers.map((pageNumber) => (
            <PageButton
              key={pageNumber}
              active={pageNumber === page}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </PageButton>
          ))}
          <PageButton
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            ຖັດໄປ
          </PageButton>
          <label className="relative ml-2">
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="h-9 cursor-pointer appearance-none rounded-md border border-[#ded4c8] bg-white px-3 text-sm font-semibold text-[#4f4032] outline-none transition hover:bg-[#f6f1ea] focus:border-[#8d7157] focus:ring-2 focus:ring-[#e5d7c7]"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} / ໜ້າ
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </section>
  )
}

function StatusBadge({ status }: { status: CafeCategory["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded px-2.5 text-xs font-semibold",
        status === "visible"
          ? "bg-[#e8f7ed] text-[#2e7a46]"
          : "bg-[#eee9e3] text-[#6f5c49]",
      )}
    >
      {status === "visible" ? "ກຳລັງສະແດງ" : "ເຊື່ອງ"}
    </span>
  )
}

function PageButton({
  children,
  active = false,
  disabled = false,
  onClick,
}: {
  children: ReactNode
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md border px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:border-[#ded4c8] disabled:bg-[#eee9e3] disabled:text-[#6f5c49]",
        active
          ? "border-[#2f2419] bg-[#2f2419] text-white"
          : "border-[#ded4c8] bg-white text-[#4f4032] hover:bg-[#f6f1ea]",
      )}
    >
      {children}
    </button>
  )
}

function buildPageNumbers(page: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const start = Math.max(1, Math.min(page - 2, totalPages - 4))

  return Array.from({ length: 5 }, (_, index) => start + index)
}
