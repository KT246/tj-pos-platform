import { ChevronDown, Plus, Search } from "lucide-react"

export type OrderTypeFilter = "all" | "dine-in" | "takeaway" | "delivery"
export type OrderStatusFilter =
  | "all"
  | "unpaid"
  | "paid"
  | "open"
  | "completed"
  | "cancelled"
  | "voided"
  | "refunded"

type OrderFilterBarProps = {
  search: string
  startDate: string
  endDate: string
  typeFilter: OrderTypeFilter
  statusFilter: OrderStatusFilter
  onSearchChange: (search: string) => void
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onTypeFilterChange: (filter: OrderTypeFilter) => void
  onStatusFilterChange: (filter: OrderStatusFilter) => void
  onCreateOrder: () => void
}

export function OrderFilterBar({
  search,
  startDate,
  endDate,
  typeFilter,
  statusFilter,
  onSearchChange,
  onStartDateChange,
  onEndDateChange,
  onTypeFilterChange,
  onStatusFilterChange,
  onCreateOrder,
}: OrderFilterBarProps) {
  return (
    <div className="flex h-16 shrink-0 items-center gap-3 border-b border-[#ded4c8] bg-[#fbfaf7] px-4">
      <label className="relative w-[240px]">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a8064]" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-10 w-full rounded-lg border border-[#ded4c8] bg-white pl-10 pr-4 text-sm font-semibold text-[#2f2419] outline-none transition placeholder:text-[#a59686] focus:border-[#a97743] focus:ring-3 focus:ring-[#ead7bf]"
          placeholder="ຄົ້ນຫາອໍເດີ..."
        />
      </label>

      <DateFilterInput
        value={startDate}
        onChange={onStartDateChange}
        ariaLabel="ວັນທີ່ເລີ່ມ"
      />
      <DateFilterInput
        value={endDate}
        onChange={onEndDateChange}
        ariaLabel="ວັນທີ່ສິ້ນສຸດ"
      />

      <FilterSelect
        value={typeFilter}
        onChange={(value) => onTypeFilterChange(value as OrderTypeFilter)}
        options={[
          ["all", "ທຸກປະເພດ"],
          ["dine-in", "ກິນຢູ່ຮ້ານ"],
          ["takeaway", "ເອົາກັບບ້ານ"],
          ["delivery", "ຈັດສົ່ງ"],
        ]}
      />
      <FilterSelect
        value={statusFilter}
        onChange={(value) => onStatusFilterChange(value as OrderStatusFilter)}
        options={[
          ["all", "ທຸກສະຖານະ"],
          ["unpaid", "ຍັງບໍ່ຊຳລະ"],
          ["paid", "ຊຳລະແລ້ວ"],
          ["open", "ອໍເດີໃໝ່"],
          ["completed", "ສຳເລັດ"],
          ["cancelled", "ຍົກເລີກແລ້ວ"],
          ["voided", "void ແລ້ວ"],
          ["refunded", "ຄືນເງິນແລ້ວ"],
        ]}
      />

      <button
        type="button"
        onClick={onCreateOrder}
        className="ml-auto flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#2f2419] px-4 text-sm font-black text-white shadow-[0_8px_18px_rgba(47,36,25,0.18)] transition hover:bg-[#4a3726]"
        aria-label="ສ້າງອໍເດີໃໝ່"
      >
        <Plus className="h-5 w-5" />
        <span>ເພີ່ມອໍເດີ</span>
      </button>
    </div>
  )
}

function FilterSelect({
  value,
  options,
  onChange,
}: {
  value: string
  options: Array<[string, string]>
  onChange: (value: string) => void
}) {
  return (
    <label className="relative flex h-10 w-[168px] items-center rounded-lg border border-[#ded4c8] bg-white transition focus-within:border-[#a97743] focus-within:ring-3 focus-within:ring-[#ead7bf] hover:border-[#b88b5c] hover:bg-[#f7f1e9]">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full cursor-pointer appearance-none bg-transparent px-4 pr-10 text-sm font-bold text-[#4f4032] outline-none"
      >
        {options.map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDown className="h-4 w-4 text-[#8a5f36]" />
    </label>
  )
}

function DateFilterInput({
  value,
  ariaLabel,
  onChange,
}: {
  value: string
  ariaLabel: string
  onChange: (value: string) => void
}) {
  return (
    <label className="relative flex h-10 min-w-[160px] items-center rounded-lg border border-[#ded4c8] bg-white transition focus-within:border-[#a97743] focus-within:ring-3 focus-within:ring-[#ead7bf] hover:border-[#b88b5c] hover:bg-[#f7f1e9]">
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full cursor-pointer bg-transparent px-4 text-sm font-bold text-[#4f4032] outline-none"
        aria-label={ariaLabel}
      />
    </label>
  )
}
