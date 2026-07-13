import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"
import type { ComponentType, ReactNode } from "react"

import type {
  BreakdownItem,
  RevenuePoint,
  StaffShiftReportItem,
  TopProductReportItem,
  TopStaffReportItem,
} from "@/features/pos/api/pos-reports-api"
import { formatVnd } from "@/features/pos/lib/format"
import { cn } from "@/lib/utils"

export function ReportCard({
  title,
  action,
  children,
  className,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-[#eadfce] bg-white p-4 shadow-[0_12px_28px_rgba(80,54,27,0.06)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-black text-[#3b2511]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export function KpiCard({
  title,
  value,
  change,
  icon: Icon,
  accentClass,
}: {
  title: string
  value: string
  change: string
  icon: ComponentType<{ className?: string }>
  accentClass: string
}) {
  const changeValue = change.split(" ")[0] ?? "0%"
  const changeSuffix = change.replace(changeValue, "").trim()
  const isDown = changeValue.startsWith("-")
  const isUp = changeValue.startsWith("+")
  const TrendIcon = isDown ? ArrowDownRight : isUp ? ArrowUpRight : Minus

  return (
    <article className="rounded-xl border border-[#eadfce] bg-white p-4 shadow-[0_12px_28px_rgba(80,54,27,0.06)]">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white",
            accentClass,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-[#5f4a35]">{title}</div>
          <div className="mt-1 text-[26px] font-black leading-7 text-[#111]">
            {value}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs font-bold text-[#5f4a35]">
            <span
              className={cn(
                "inline-flex items-center gap-1",
                isDown ? "text-[#c43d2c]" : isUp ? "text-[#178a38]" : "text-[#6b6258]",
              )}
            >
              <TrendIcon className="h-3.5 w-3.5" />
              {changeValue}
            </span>
            {changeSuffix}
          </div>
        </div>
      </div>
    </article>
  )
}

export function HourlyRevenueChart({ data }: { data: RevenuePoint[] }) {
  const max = Math.max(1, ...data.map((item) => item.value))
  const labelIndexes = new Set([0, 2, 4, 7, 9, 10, 12])

  return (
    <div className="mt-5 h-[210px]">
      <div className="grid h-[176px] grid-cols-[44px_minmax(0,1fr)]">
        <div className="flex flex-col justify-between pb-6 text-xs font-semibold text-[#8a7560]">
          <span>1.2M</span>
          <span>900K</span>
          <span>600K</span>
          <span>300K</span>
          <span>0</span>
        </div>
        <div className="relative flex items-end gap-3 border-b border-[#eadfce]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#eadfce]" />
          <div className="pointer-events-none absolute inset-x-0 top-1/4 h-px bg-[#eadfce]" />
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-[#eadfce]" />
          <div className="pointer-events-none absolute inset-x-0 top-3/4 h-px bg-[#eadfce]" />
          {data.map((item) => (
            <div key={item.label} className="relative flex h-full flex-1 items-end justify-center">
              <div
                className="w-full max-w-[18px] rounded-t bg-[linear-gradient(180deg,#8a5425_0%,#5a3718_100%)] shadow-[0_8px_16px_rgba(90,55,24,0.18)]"
                style={{ height: `${Math.max(4, (item.value / max) * 100)}%` }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="ml-11 mt-2 flex justify-between text-xs font-semibold text-[#5f4a35]">
        {data.map((item, index) => (
          <span key={item.label} className={labelIndexes.has(index) ? "" : "invisible"}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export function WeeklyLineChart({ data }: { data: RevenuePoint[] }) {
  const max = Math.max(1, ...data.map((item) => item.value))
  const width = 420
  const height = 190
  const points = data
    .map((item, index) => {
      const x = 24 + (index / Math.max(1, data.length - 1)) * (width - 48)
      const y = height - 26 - (item.value / max) * (height - 52)

      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="mt-4 h-[210px]">
      <div className="grid h-[176px] grid-cols-[44px_minmax(0,1fr)]">
        <div className="flex flex-col justify-between pb-5 text-xs font-semibold text-[#8a7560]">
          <span>8M</span>
          <span>6M</span>
          <span>4M</span>
          <span>2M</span>
          <span>0</span>
        </div>
        <div className="relative border-b border-[#eadfce]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#eadfce]" />
          <div className="pointer-events-none absolute inset-x-0 top-1/4 h-px bg-[#eadfce]" />
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-[#eadfce]" />
          <div className="pointer-events-none absolute inset-x-0 top-3/4 h-px bg-[#eadfce]" />
          <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
            <defs>
              <linearGradient id="weekly-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#5ca454" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#5ca454" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline
              points={`${points} ${width - 24},${height - 26} 24,${height - 26}`}
              fill="url(#weekly-fill)"
              stroke="none"
            />
            <polyline
              points={points}
              fill="none"
              stroke="#5ca454"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            {data.map((item, index) => {
              const x = 24 + (index / Math.max(1, data.length - 1)) * (width - 48)
              const y = height - 26 - (item.value / max) * (height - 52)

              return <circle key={item.label} cx={x} cy={y} r="4" fill="#5ca454" />
            })}
          </svg>
        </div>
      </div>
      <div className="ml-11 mt-2 flex justify-between text-xs font-semibold text-[#5f4a35]">
        {data.map((item) => (
          <span key={item.label}>{item.label}</span>
        ))}
      </div>
    </div>
  )
}

export function DonutBreakdown({
  items,
  centerLabel,
  centerValue,
  compact = false,
}: {
  items: BreakdownItem[]
  centerLabel?: string
  centerValue?: string
  compact?: boolean
}) {
  const gradient = buildConicGradient(items)

  return (
    <div className={cn("mt-5 flex items-center gap-6", compact ? "gap-5" : "gap-8")}>
      <div
        className={cn(
          "relative shrink-0 rounded-full",
          compact ? "h-[132px] w-[132px]" : "h-[152px] w-[152px]",
        )}
        style={{ background: gradient }}
      >
        <div className="absolute inset-[28px] flex flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
          {centerLabel ? (
            <span className="text-xs font-bold text-[#5f4a35]">{centerLabel}</span>
          ) : null}
          {centerValue ? (
            <span className="mt-1 text-sm font-black text-[#111]">{centerValue}</span>
          ) : null}
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-3 font-semibold text-[#5f4a35]">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate">{localizeReportText(item.label)}</span>
            </span>
            <span className="shrink-0 font-bold text-[#3b2511]">
              {item.percent}% ({formatVnd(item.value)})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PaymentBreakdown({ items }: { items: BreakdownItem[] }) {
  return (
    <div className="mt-4">
      <DonutBreakdown items={items} compact />
      <div className="mt-5 flex items-center justify-between border-t border-[#eadfce] pt-4 text-sm font-black">
        <span>ລວມ</span>
        <span>{formatVnd(items.reduce((sum, item) => sum + item.value, 0))}</span>
      </div>
    </div>
  )
}

export function TopProductsList({ items }: { items: TopProductReportItem[] }) {
  return (
    <div className="mt-4 space-y-3">
      {items.map((item) => (
        <div
          key={item.rank}
          className="grid grid-cols-[24px_44px_minmax(0,1fr)_auto] items-center gap-3 border-b border-[#eadfce] pb-3 last:border-b-0 last:pb-0"
        >
          <RankBadge rank={item.rank} />
          <img
            src={item.image}
            alt={item.name}
            className="h-11 w-11 rounded-lg object-cover"
            loading="lazy"
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-black text-[#3b2511]">{item.name}</div>
            <div className="mt-1 text-xs font-semibold text-[#8a7560]">
              {localizeReportText(item.quantity)}
            </div>
          </div>
          <div className="text-right text-sm font-black text-[#3b2511]">
            {formatVnd(item.revenue)}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ShiftTable({ items }: { items: StaffShiftReportItem[] }) {
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-[#eadfce]">
      <div className="grid h-11 grid-cols-[minmax(0,1.35fr)_1fr_0.85fr_0.75fr_0.8fr] items-center bg-[#fbf7ef] px-4 text-xs font-black text-[#3b2511]">
        <span>ກະເຮັດວຽກ</span>
        <span>ພະນັກງານ</span>
        <span>ລາຍຮັບ</span>
        <span>ອໍເດີ</span>
        <span>ສະຖານະ</span>
      </div>
      {items.map((item) => (
        <div
          key={item.shift}
          className="grid min-h-[55px] grid-cols-[minmax(0,1.35fr)_1fr_0.85fr_0.75fr_0.8fr] items-center border-t border-[#eadfce] px-4 text-sm"
        >
          <span className="font-semibold text-[#3b2511]">{localizeReportText(item.shift)}</span>
          <span className="font-semibold text-[#5f4a35]">{localizeReportText(item.employee)}</span>
          <span className="font-black text-[#3b2511]">{formatVnd(item.revenue)}</span>
          <span className="font-semibold text-[#5f4a35]">{item.orders}</span>
          <span>
            <span
              className={cn(
                "inline-flex h-7 items-center rounded-lg px-3 text-xs font-black",
                item.status === "active"
                  ? "bg-[#e8f7e4] text-[#2d8a33]"
                  : "bg-[#f0efec] text-[#6b6258]",
              )}
            >
              {item.status === "active" ? "ກຳລັງເຮັດວຽກ" : "ຍັງບໍ່ເລີ່ມ"}
            </span>
          </span>
        </div>
      ))}
    </div>
  )
}

export function TopStaffList({ items }: { items: TopStaffReportItem[] }) {
  return (
    <div className="mt-4 space-y-4">
      {items.map((item) => (
        <div key={item.rank} className="grid grid-cols-[24px_42px_minmax(0,1fr)_auto] items-center gap-3">
          <RankBadge rank={item.rank} />
          <img
            src={item.avatar}
            alt={item.name}
            className="h-10 w-10 rounded-full object-cover"
            loading="lazy"
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-black text-[#3b2511]">
              {localizeReportText(item.name)}
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="font-black text-[#3b2511]">{formatVnd(item.revenue)}</div>
            <div className="mt-1 font-semibold text-[#5f4a35]">{item.orders} ອໍເດີ</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <span
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-black",
        rank === 1
          ? "bg-[#f0b429] text-white"
          : rank === 2
            ? "bg-[#d9d7d2] text-white"
            : rank === 3
              ? "bg-[#d98b35] text-white"
              : "bg-white text-[#3b2511] ring-1 ring-[#eadfce]",
      )}
    >
      {rank}
    </span>
  )
}

function buildConicGradient(items: BreakdownItem[]) {
  let start = 0
  const stops = items.map((item) => {
    const end = start + item.percent
    const stop = `${item.color} ${start}% ${end}%`
    start = end

    return stop
  })

  return `conic-gradient(${stops.join(", ")})`
}

function localizeReportText(value: string) {
  const text = value.trim()
  const normalized = text.toLowerCase()

  if (normalized.includes("tien") || normalized.includes("cash")) return "???????"
  if (normalized.includes("ca sang")) return "??????? (06:00 - 14:00)"
  if (normalized.includes("ca chieu")) return "?????? (14:00 - 22:00)"
  if (normalized.includes("ca toi")) return "???????? (22:00 - 06:00)"
  if (normalized.includes("thu ngan")) return "?????? POS"
  if (normalized.includes("nhan vien")) return "???????? POS"
  if (normalized.includes("chuyen") || normalized.includes("transfer")) return "???????"
  if (normalized.includes("the") || normalized.includes("card")) return "???"
  if (normalized.includes("qr")) return "QR"
  if (normalized.includes("vi ") || normalized.includes("wallet")) return "?????????????????"
  if (normalized.includes("chua") || normalized.includes("no data")) return "??????????????"
  if (normalized.includes("coffee")) return "????"
  if (normalized.includes("tea")) return "??"
  if (normalized.includes("cake")) return "????"
  if (normalized.includes("juice")) return "?????????"
  if (normalized.includes("khac") || normalized.includes("other")) return "?????"
  if (normalized.includes("mon") || normalized.includes("item")) {
    return text.replace(/mon|item/gi, "??????")
  }

  return text
}
