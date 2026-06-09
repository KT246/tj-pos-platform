import type { ReactNode } from "react";
import Image from "../../../compat/image";
import Link from "../../../compat/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Download,
  MoreVertical,
  Plus,
  Search,
  Star,
  type LucideIcon
} from "lucide-react";

import type { AdminStatus, Business, StatCard as StatCardType } from "../types";
import { getStatusClass, getStatusLabel } from "../utils/status";

type CardProps = {
  children: ReactNode;
  className?: string;
};

const toneClasses = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  purple: "bg-violet-50 text-violet-600",
  orange: "bg-orange-50 text-orange-600",
  red: "bg-red-50 text-red-600"
};

export function AdminCard({ children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-[10px] border border-blue-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.035)] ${className}`}
    >
      {children}
    </section>
  );
}

export function PageHeader({
  eyebrow = "ໜ້າຫຼັກ",
  title,
  description,
  action
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-2.5 flex items-center gap-2 text-xs text-slate-500">
          <span>{eyebrow}</span>
          <ArrowRight className="h-3.5 w-3.5" />
          <span className="font800 text-slate-700">{title}</span>
        </div>
        <h1 className="font900 text-[26px] leading-tight text-slate-950">
          {title}
        </h1>
        <p className="mt-1.5 text-sm leading-5 text-slate-600">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function AdminButton({
  children,
  href,
  variant = "primary",
  icon: Icon
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  icon?: LucideIcon;
}) {
  const className =
    variant === "primary"
      ? "bg-blue-600 text-white shadow-[0_8px_16px_rgba(13,91,255,0.18)] hover:bg-blue-700"
      : variant === "secondary"
        ? "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
        : "text-blue-700 hover:bg-blue-50";

  const content = (
    <>
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`font800 inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md px-4 text-sm transition ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={`font800 inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md px-4 text-sm transition ${className}`}
    >
      {content}
    </button>
  );
}

export function StatGrid({ stats }: { stats: StatCardType[] }) {
  return (
    <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}

function StatCard({ stat }: { stat: StatCardType }) {
  const Icon = stat.icon;

  return (
    <AdminCard className="min-h-[112px] overflow-hidden p-4">
      <div className="flex h-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${toneClasses[stat.tone]}`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="font700 text-[13px] leading-4 text-slate-600">
              {stat.label}
            </p>
            <p className="font900 mt-1 text-[23px] leading-7 text-slate-950">
              {stat.value}
            </p>
            <p className="font800 mt-1 text-[11px] leading-4 text-emerald-600">
              {stat.change}
            </p>
          </div>
        </div>
        <MiniSparkline tone={stat.tone} />
      </div>
    </AdminCard>
  );
}

export function MiniSparkline({ tone = "blue" }: { tone?: keyof typeof toneClasses }) {
  const color =
    tone === "green"
      ? "#10b981"
      : tone === "purple"
        ? "#8b5cf6"
        : tone === "orange"
          ? "#f97316"
          : tone === "red"
            ? "#ef4444"
            : "#0d5bff";

  return (
    <svg className="h-12 w-20 shrink-0" viewBox="0 0 96 56" aria-hidden="true">
      <path
        d="M4 44 C18 40 20 34 33 35 S48 18 61 21 76 30 92 14"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="3"
      />
      <circle cx="92" cy="14" r="3" fill={color} />
    </svg>
  );
}

export function StatusBadge({ status }: { status: AdminStatus }) {
  return (
    <span
      className={`font800 inline-flex items-center rounded-md px-2.5 py-1 text-xs ${getStatusClass(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

export function FilterBar({
  searchPlaceholder = "ຄົ້ນຫາ...",
  filters = ["ປະເພດທັງໝົດ", "ແພັກເກດທັງໝົດ", "ສະຖານະທັງໝົດ"],
  showExport = true,
  showCreate = false
}: {
  searchPlaceholder?: string;
  filters?: string[];
  showExport?: boolean;
  showCreate?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2.5 border-b border-blue-100 p-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <label className="relative min-w-[220px] flex-1">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-9 w-full rounded-md border border-blue-100 bg-white pr-3 pl-10 text-sm transition outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
            placeholder={searchPlaceholder}
          />
        </label>
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className="font800 flex h-9 min-w-[145px] cursor-pointer items-center justify-between gap-3 rounded-md border border-blue-100 bg-white px-3 text-left text-sm text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/50"
          >
            {filter}
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        ))}
        <button
          type="button"
          className="font800 flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-blue-100 bg-white px-3 text-sm text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/50"
        >
          <CalendarDays className="h-4 w-4 text-blue-500" />
          {"ພຶດສະພາ 12 - ພຶດສະພາ 18, 2025"}
        </button>
        {showExport ? (
          <AdminButton variant="secondary" icon={Download}>
            ສົ່ງອອກ
          </AdminButton>
        ) : null}
        {showCreate ? (
          <AdminButton href="/platform-admin/ທຸລະກິດ/create" icon={Plus}>
            ສ້າງທຸລະກິດ
          </AdminButton>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2.5">
        {["ທັງໝົດ (1,256)", "ໃຊ້ງານ (1,102)", "ທົດລອງ (98)", "ຖືກລະງັບ (56)"].map(
          (item, index) => (
            <span
              key={item}
              className={`font800 rounded-full px-3.5 py-1.5 text-xs ${
                index === 0
                  ? "bg-blue-50 text-blue-700"
                  : index === 1
                    ? "bg-emerald-50 text-emerald-700"
                    : index === 2
                      ? "bg-violet-50 text-violet-700"
                      : "bg-orange-50 text-orange-700"
              }`}
            >
              {item}
            </span>
          )
        )}
      </div>
    </div>
  );
}

export function BusinessTable({ rows = [] }: { rows: Business[] }) {
  return (
    <AdminCard className="overflow-hidden">
      <FilterBar searchPlaceholder="ຄົ້ນຫາທຸລະກິດ..." showCreate />
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-[13px]">
          <thead className="bg-white text-xs text-slate-500">
            <tr>
              {[
                "ຊື່ທຸລະກິດ",
                "ປະເພດ",
                "ເຈົ້າຂອງ",
                "ສາຂາ",
                "ແພັກເກດ",
                "ສະຖານະ",
                "ກິດຈະກຳຫຼ້າສຸດ",
                "ວັນທີ່ເຂົ້າຮ່ວມ",
                "ການກະທຳ"
              ].map((head) => (
                <th
                  key={head}
                  className="font900 border-b border-blue-100 px-3.5 py-2.5 whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {rows.map((row) => (
              <tr key={row.id} className="bg-white hover:bg-blue-50/40">
                <td className="px-3.5 py-2.5">
                  <div className="flex items-center gap-3">
                    <Image
                      src={row.logoUrl}
                      alt={row.name}
                      width={36}
                      height={36}
                      className="h-8 w-8 rounded-md object-cover"
                    />
                    <div>
                      <p className="font900 text-slate-900">{row.name}</p>
                      <p className="text-xs text-slate-500">{row.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3.5 py-2.5">
                  <span className="font800 rounded-md bg-blue-50 px-2.5 py-1 text-xs text-blue-700">
                    {row.type}
                  </span>
                </td>
                <td className="px-3.5 py-2.5">
                  <p className="font800 text-slate-900">{row.owner}</p>
                  <p className="text-xs text-slate-500">{row.ownerEmail}</p>
                </td>
                <td className="font800 px-3.5 py-2.5 text-slate-800">{row.branches}</td>
                <td className="font800 px-3.5 py-2.5 text-slate-800">{row.plan}</td>
                <td className="px-3.5 py-2.5">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-3.5 py-2.5 whitespace-pre-line text-slate-700">
                  {row.lastActivity}
                </td>
                <td className="px-3.5 py-2.5 text-slate-700">
                  {row.joinedOn}
                </td>
                <td className="px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/platform-admin/businesses/${row.id}`}
                      className="font800 rounded-md border border-blue-100 px-3 py-1.5 text-xs text-blue-700 hover:bg-blue-50"
                    >
                      ເບິ່ງລາຍລະອຽດ
                    </Link>
                    <button
                      type="button"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-blue-100 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination />
    </AdminCard>
  );
}

export function Pagination() {
  return (
    <div className="flex flex-col gap-3 border-t border-blue-100 px-4 py-2.5 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
      <span>ສະແດງ 1 ຫາ 10 ຈາກ 1,256 ລາຍການ</span>
      <div className="flex items-center gap-2">
        {["‹", "1", "2", "3", "...", "126", "›"].map((item) => (
          <button
            key={item}
            type="button"
            className={`font800 flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md border px-2.5 text-sm transition ${
              item === "1"
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-blue-100 bg-white text-slate-700"
            }`}
          >
            {item}
          </button>
        ))}
        <button
          type="button"
          className="font800 flex h-8 cursor-pointer items-center gap-2 rounded-md border border-blue-100 px-3 text-sm transition hover:bg-blue-50"
        >
          10 / ໜ້າ
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function PanelTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <h2 className="font900 text-base text-slate-950">{title}</h2>
      {action}
    </div>
  );
}

export function SimpleList({
  records
}: {
  records: { title: string; subtitle: string; meta: string; status?: AdminStatus }[];
}) {
  return (
    <div className="space-y-2.5">
      {records.map((item) => (
        <div
          key={`${item.title}-${item.meta}`}
          className="flex items-center justify-between gap-4 rounded-lg border border-blue-50 bg-white px-3 py-2.5"
        >
          <div>
            <p className="font900 text-[13px] text-slate-950">{item.title}</p>
            <p className="mt-1 text-xs text-slate-500">{item.subtitle}</p>
          </div>
          <div className="text-right">
            {item.status ? <StatusBadge status={item.status} /> : null}
            <p className="mt-1 text-xs text-slate-500">{item.meta}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Donut({
  segments = ["#0d5bff", "#10b981", "#8b5cf6", "#f97316"]
}: {
  segments?: string[];
}) {
  return (
    <div
      className="h-32 w-32 rounded-full"
      style={{
        background: `conic-gradient(${segments[0]} 0 40%, ${segments[1]} 40% 72%, ${segments[2]} 72% 88%, ${segments[3]} 88% 100%)`
      }}
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-white" />
      </div>
    </div>
  );
}

export function LineChartCard() {
  return (
    <AdminCard className="p-4">
      <PanelTitle
        title="ການເຕີບໂຕຂອງການສະໝັກໃຊ້"
        action={
          <div className="flex gap-2">
            {["ເດືອນນີ້", "ລາຍວັນ"].map((item) => (
              <button
                key={item}
                type="button"
                className="font800 flex h-8 cursor-pointer items-center gap-2 rounded-md border border-blue-100 px-3 text-xs text-slate-700 transition hover:bg-blue-50"
              >
                {item}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        }
      />
      <svg className="h-[238px] w-full" viewBox="0 0 760 260" aria-hidden="true">
        <defs>
          <linearGradient id="line-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0d5bff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0d5bff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[40, 80, 120, 160, 200].map((y) => (
          <line
            key={y}
            x1="24"
            x2="740"
            y1={y}
            y2={y}
            stroke="#dbeafe"
            strokeDasharray="4 6"
          />
        ))}
        {[80, 170, 260, 350, 440, 530, 620, 710].map((x) => (
          <line key={x} x1={x} x2={x} y1="28" y2="220" stroke="#eff6ff" />
        ))}
        <path
          d="M36 214 C120 194 154 184 210 148 S312 130 380 126 460 92 530 84 636 62 734 38 L734 224 L36 224 Z"
          fill="url(#line-fill)"
        />
        <path
          d="M36 214 C120 194 154 184 210 148 S312 130 380 126 460 92 530 84 636 62 734 38"
          fill="none"
          stroke="#0d5bff"
          strokeLinecap="round"
          strokeWidth="4"
        />
      </svg>
    </AdminCard>
  );
}

export function FormField({
  label,
  value,
  required,
  wide
}: {
  label: string;
  value: string;
  required?: boolean;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="font800 mb-1 block text-[10px] text-slate-600">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <input
        defaultValue={value}
        className="h-7 w-full rounded-md border border-blue-100 bg-white px-2.5 text-xs text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
      />
    </label>
  );
}

export function FormSection({
  index,
  title,
  children
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <AdminCard className="p-3">
      <div className="mb-2 flex items-center gap-2.5">
        <span className="font900 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] text-white">
          {index}
        </span>
        <h2 className="font900 text-sm text-slate-950">{title}</h2>
      </div>
      {children}
    </AdminCard>
  );
}

export function QuickAction({
  title,
  subtitle,
  icon: Icon,
  href = "#"
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="flex cursor-pointer items-center gap-3 rounded-lg border border-blue-100 bg-white p-3 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_12px_30px_rgba(13,91,255,0.08)]"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="font900 block text-[13px] leading-4 text-slate-950">
          {title}
        </span>
        <span className="mt-1 block text-xs text-slate-500">{subtitle}</span>
      </span>
    </Link>
  );
}

export function SettingsRow({
  title,
  description,
  enabled = true
}: {
  title: string;
  description: string;
  enabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-blue-50 py-1.5 last:border-b-0">
      <div>
        <p className="font900 text-xs text-slate-950">{title}</p>
        <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
          {description}
        </p>
      </div>
      <button
        type="button"
        className={`relative h-6 w-10 cursor-pointer rounded-full transition ${enabled ? "bg-blue-600" : "bg-slate-200"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
            enabled ? "left-[18px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export function FavoriteStar({ filled = false }: { filled?: boolean }) {
  return (
    <Star
      className={`h-4 w-4 ${filled ? "fill-blue-600 text-blue-600" : "text-slate-400"}`}
    />
  );
}
