import Image from "next/image";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  Filter,
  MoreVertical,
  Pencil,
  Plus,
  Search
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { toneClasses } from "../data/mock-business-admin";
import type { Kpi, QuickAction, SummaryItem, TableColumn, Tone } from "../types";
import { BusinessAdminLink } from "./business-admin-link";

export function TjLogo() {
  return (
    <BusinessAdminLink href="/business-admin" className="flex items-center">
      <Image
        src="/business-admin-logo.png"
        alt="TJ POS"
        width={198}
        height={43}
        className="h-[38px] w-auto"
        priority
      />
    </BusinessAdminLink>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        {breadcrumb ? <div className="mb-3">{breadcrumb}</div> : null}
        <h1 className="text-[26px] leading-tight font-black text-slate-950">{title}</h1>
        <p className="mt-1 text-[13px] leading-5 font-medium text-slate-600">
          {description}
        </p>
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export function Button({
  children,
  icon: Icon,
  variant = "primary",
  href
}: {
  children: ReactNode;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
}) {
  const className =
    variant === "primary"
      ? "bg-blue-600 text-white shadow-[0_8px_18px_rgba(37,99,235,0.2)] hover:bg-blue-700"
      : variant === "secondary"
        ? "border border-blue-100 bg-white text-slate-900 hover:border-blue-200 hover:bg-blue-50"
        : "text-slate-600 hover:bg-slate-50";
  const content = (
    <>
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </>
  );

  if (href) {
    return (
      <BusinessAdminLink
        href={href}
        className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-extrabold transition ${className}`}
      >
        {content}
      </BusinessAdminLink>
    );
  }

  return (
    <button
      type="button"
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-extrabold transition ${className}`}
    >
      {content}
    </button>
  );
}

export function KpiGrid({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="mb-5 grid grid-cols-[repeat(auto-fit,minmax(188px,1fr))] gap-4">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} kpi={kpi} />
      ))}
    </div>
  );
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const tone = toneClasses[kpi.tone];
  const Icon = kpi.icon;

  return (
    <div className="rounded-lg border border-blue-100 bg-white p-3.5 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${tone.soft} ${tone.text}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-bold text-slate-500">{kpi.label}</p>
          <p className="mt-1 text-[19px] leading-6 font-black whitespace-nowrap text-slate-950">
            {kpi.value}
          </p>
          {kpi.change ? (
            <p
              className={`mt-1 text-[11px] font-extrabold ${
                kpi.tone === "red" ? "text-red-500" : "text-emerald-600"
              }`}
            >
              + {kpi.change}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function Card({
  title,
  action,
  children,
  className = ""
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`min-w-0 rounded-lg border border-blue-100 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.035)] ${className}`}
    >
      {title || action ? (
        <div className="flex items-center justify-between gap-3 border-b border-blue-50 px-4 py-3">
          {title ? (
            <h2 className="shrink-0 text-[15px] font-black whitespace-nowrap text-slate-950">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function FilterBar({
  searchPlaceholder,
  filters,
  showFilterButton = true,
  actions,
  labels = []
}: {
  searchPlaceholder: string;
  filters: string[];
  showFilterButton?: boolean;
  actions?: ReactNode;
  labels?: string[];
}) {
  return (
    <Card className="mb-4">
      <div className="grid gap-3 p-4 xl:grid-cols-[minmax(260px,1.4fr)_repeat(3,minmax(150px,0.6fr))_auto]">
        <label>
          <span className="mb-1.5 block text-[11px] font-black text-slate-600">
            Search
          </span>
          <span className="relative block">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-10 w-full rounded-md border border-blue-100 bg-white pr-4 pl-11 text-[13px] font-semibold text-slate-800 transition outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              placeholder={searchPlaceholder}
            />
          </span>
        </label>
        {filters.slice(0, 3).map((filter, index) => (
          <LabeledSelect
            key={filter}
            label={labels[index] ?? defaultFilterLabel(filter)}
          >
            {filter}
          </LabeledSelect>
        ))}
        <div className="flex items-end justify-end gap-2">
          {showFilterButton ? (
            <Button icon={Filter} variant="primary">
              Filter
            </Button>
          ) : null}
          {actions}
        </div>
        {filters.slice(3).map((filter, index) => (
          <LabeledSelect
            key={filter}
            label={labels[index + 3] ?? defaultFilterLabel(filter)}
          >
            {filter}
          </LabeledSelect>
        ))}
      </div>
    </Card>
  );
}

function LabeledSelect({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label>
      <span className="mb-1.5 block text-[11px] font-black text-slate-600">
        {label}
      </span>
      <SelectButton>{children}</SelectButton>
    </label>
  );
}

function defaultFilterLabel(value: string) {
  const normalized = value.toLowerCase();

  if (normalized.includes("categor")) return "Category";
  if (normalized.includes("status")) return "Status";
  if (normalized.includes("branch")) return "Branch";
  if (normalized.includes("type")) return "Type";
  if (normalized.includes("audience")) return "Target Audience";
  if (normalized.includes("may")) return "Date Range";

  return "Filter";
}

export function SelectButton({
  children,
  icon: Icon
}: {
  children: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <button
      type="button"
      className="flex h-10 min-w-[150px] items-center justify-between gap-3 rounded-md border border-blue-100 bg-white px-3 text-left text-[13px] font-extrabold text-slate-900 transition hover:border-blue-300 hover:bg-blue-50/60"
    >
      <span className="flex min-w-0 items-center gap-2 truncate">
        {Icon ? <Icon className="h-4 w-4 text-blue-500" /> : null}
        <span className="truncate">{children}</span>
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
    </button>
  );
}

export function DateRangeButton() {
  return <SelectButton icon={CalendarDays}>May 12 - May 18, 2025</SelectButton>;
}

export function Badge({
  children,
  tone = "emerald"
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  const toneClass = toneClasses[tone];

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-extrabold ${toneClass.soft} ${toneClass.text} ${toneClass.border}`}
    >
      {children}
    </span>
  );
}

export function ActionButtons({
  viewHref,
  editHref
}: {
  viewHref?: string;
  editHref?: string;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      {viewHref ? <IconButton href={viewHref} icon={Eye} label="View" /> : null}
      {editHref ? <IconButton href={editHref} icon={Pencil} label="Edit" /> : null}
      <IconButton icon={MoreVertical} label="More" tone="slate" />
    </div>
  );
}

export function IconButton({
  icon: Icon,
  label,
  href,
  tone = "blue"
}: {
  icon: LucideIcon;
  label: string;
  href?: string;
  tone?: Tone;
}) {
  const toneClass = toneClasses[tone];
  const hoverClass = iconHoverClasses[tone];
  const className = `inline-flex h-8 w-8 items-center justify-center rounded-md border ${toneClass.border} bg-white ${toneClass.text} transition hover:-translate-y-0.5 hover:shadow-sm ${hoverClass}`;
  const content = <Icon className="h-4 w-4" />;

  if (href) {
    return (
      <BusinessAdminLink
        href={href}
        className={className}
        aria-label={label}
        title={label}
      >
        {content}
      </BusinessAdminLink>
    );
  }

  return (
    <button type="button" className={className} aria-label={label} title={label}>
      {content}
    </button>
  );
}

const iconHoverClasses: Record<Tone, string> = {
  blue: "hover:bg-blue-50",
  emerald: "hover:bg-emerald-50",
  amber: "hover:bg-amber-50",
  red: "hover:bg-red-50",
  violet: "hover:bg-violet-50",
  cyan: "hover:bg-cyan-50",
  slate: "hover:bg-slate-50"
};

export function DataTable<T>({
  columns,
  rows,
  footer
}: {
  columns: TableColumn<T>[];
  rows: T[];
  footer?: ReactNode;
}) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-[12px]">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`border-b border-blue-100 px-3 py-2.5 text-[11px] font-black whitespace-nowrap text-slate-600 ${
                    column.align === "right"
                      ? "text-right"
                      : column.align === "center"
                        ? "text-center"
                        : ""
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-blue-50 last:border-b-0">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-3 py-2.5 font-bold whitespace-normal text-slate-800 ${
                      column.align === "right"
                        ? "text-right"
                        : column.align === "center"
                          ? "text-center"
                          : ""
                    }`}
                  >
                    {column.render(row, rowIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer === undefined ? <Pagination /> : footer}
    </Card>
  );
}

export function Pagination({
  label = "Showing 1 to 8 of 342 records"
}: {
  label?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-50 px-4 py-3">
      <p className="text-[13px] font-semibold text-slate-600">{label}</p>
      <div className="flex flex-wrap items-center gap-2">
        {["<", "1", "2", "3", "...", "43", ">"].map((item, index) => (
          <button
            key={`${item}-${index}`}
            type="button"
            className={`h-8 min-w-8 rounded-md border text-sm font-extrabold ${
              item === "1"
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-blue-100 bg-white text-slate-700 hover:bg-blue-50"
            }`}
          >
            {item}
          </button>
        ))}
        <button
          type="button"
          className="flex h-8 min-w-[92px] items-center justify-between gap-2 rounded-md border border-blue-100 bg-white px-3 text-[12px] font-extrabold text-slate-700 transition hover:bg-blue-50"
        >
          10 / page
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>
    </div>
  );
}

export function ItemIdentity({
  title,
  subtitle,
  image,
  size = "md"
}: {
  title: string;
  subtitle?: string;
  image?: string;
  size?: "sm" | "md";
}) {
  const imageClass = size === "sm" ? "h-8 w-8 rounded-md" : "h-10 w-10 rounded-lg";

  return (
    <div className="flex items-center gap-3">
      {image ? (
        <span
          aria-hidden="true"
          className={`${imageClass} shrink-0 border border-blue-100 bg-cover bg-center`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ) : (
        <span
          className={`${imageClass} flex shrink-0 items-center justify-center bg-blue-50 text-xs font-black text-blue-600`}
        >
          {title.slice(0, 2).toUpperCase()}
        </span>
      )}
      <span className="min-w-0">
        <span className="block font-black text-slate-950">{title}</span>
        {subtitle ? (
          <span className="mt-0.5 block text-xs font-semibold text-slate-500">
            {subtitle}
          </span>
        ) : null}
      </span>
    </div>
  );
}

export function RightRail({ children }: { children: ReactNode }) {
  return <aside className="space-y-4">{children}</aside>;
}

export function SummaryCard({
  title,
  items,
  action
}: {
  title: string;
  items: SummaryItem[];
  action?: ReactNode;
}) {
  return (
    <Card title={title} action={action}>
      <div className="space-y-3 p-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4">
            <span className="text-[13px] font-semibold text-slate-600">
              {item.label}
            </span>
            <span
              className={`text-right text-[13px] font-black ${
                item.tone ? toneClasses[item.tone].text : "text-slate-950"
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function QuickActionsCard({
  title = "Quick Actions",
  actions
}: {
  title?: string;
  actions: QuickAction[];
}) {
  return (
    <Card title={title}>
      <div className="space-y-2 p-4">
        {actions.map((action) => {
          const Icon = action.icon;
          const tone = toneClasses[action.tone];
          const body = (
            <>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone.soft} ${tone.text}`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-black text-slate-950">
                  {action.label}
                </span>
                {action.description ? (
                  <span className="mt-0.5 block truncate text-xs font-semibold text-slate-500">
                    {action.description}
                  </span>
                ) : null}
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </>
          );

          if (action.href) {
            return (
              <BusinessAdminLink
                href={action.href}
                key={action.label}
                className="flex items-center gap-3 rounded-md border border-transparent p-2 transition hover:border-blue-100 hover:bg-blue-50/50"
              >
                {body}
              </BusinessAdminLink>
            );
          }

          return (
            <button
              key={action.label}
              type="button"
              className="flex w-full items-center gap-3 rounded-md border border-transparent p-2 text-left transition hover:border-blue-100 hover:bg-blue-50/50"
            >
              {body}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export function Tabs({ tabs, active }: { tabs: string[]; active: string }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2 rounded-lg border border-blue-100 bg-white p-1.5">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={`h-9 rounded-md px-4 text-sm font-extrabold transition ${
            tab === active
              ? "bg-blue-600 text-white"
              : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export function FormCard({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <div className="border-b border-blue-50 px-4 py-3">
        <h2 className="text-[15px] font-black text-slate-950">{title}</h2>
        {description ? (
          <p className="mt-1 text-xs font-semibold text-slate-500">{description}</p>
        ) : null}
      </div>
      <div className="grid gap-4 p-4 md:grid-cols-2">{children}</div>
    </Card>
  );
}

export function Field({
  label,
  value,
  type = "text",
  full = false
}: {
  label: string;
  value: string;
  type?: "text" | "textarea" | "select";
  full?: boolean;
}) {
  return (
    <label className={full ? "md:col-span-2" : ""}>
      <span className="mb-1.5 block text-xs font-black text-slate-600">{label}</span>
      {type === "textarea" ? (
        <textarea
          className="min-h-24 w-full resize-none rounded-md border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
          defaultValue={value}
        />
      ) : type === "select" ? (
        <button
          type="button"
          className="flex h-10 w-full items-center justify-between rounded-md border border-blue-100 bg-white px-3 text-left text-sm font-extrabold text-slate-900"
        >
          {value}
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
      ) : (
        <input
          className="h-10 w-full rounded-md border border-blue-100 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
          defaultValue={value}
        />
      )}
    </label>
  );
}

export function ExportButton() {
  return (
    <Button icon={Download} variant="secondary">
      Export
    </Button>
  );
}

export function CreateButton({ href, label }: { href: string; label: string }) {
  return (
    <Button href={href} icon={Plus}>
      {label}
    </Button>
  );
}
