import {
  ArrowLeft,
  Bell,
  Building2,
  Search,
  SlidersHorizontal,
  Sun,
  Table2,
  UserRound
} from "lucide-react";
import { Link } from "react-router-dom";

export function StaffOrderHeader({
  title,
  backHref,
  showFilter = false
}: {
  title: string;
  backHref?: string;
  showFilter?: boolean;
}) {
  return (
    <header className="shrink-0 border-b border-blue-50 bg-white/96 px-2.5 py-2 shadow-[0_1px_0_rgba(219,234,254,0.85)] backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="grid h-10 grid-cols-[88px_minmax(0,1fr)_auto] items-center gap-1.5">
        <div className="flex min-w-0 items-center">
          {backHref ? (
            <Link
              to={backHref}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
              aria-label="ກັບຄືນ"
            >
              <ArrowLeft className="h-[18px] w-[18px]" />
            </Link>
          ) : (
            <Link to="/" className="flex min-w-0 cursor-pointer items-center gap-1.5">
              <img
                src="/brand/tj-pos-mark.png"
                alt=""
                className="h-7 w-7 shrink-0 rounded-md object-contain"
              />
              <span className="truncate text-[12px] font-black text-slate-950">
                TJ POS
              </span>
            </Link>
          )}
        </div>
        <h1 className="min-w-0 truncate text-center text-[15px] font-black text-slate-950">
          {title}
        </h1>
        <div className="flex items-center justify-end gap-1">
          <span className="hidden h-7 items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-50 px-2 text-[9px] font-black leading-none text-emerald-600 min-[375px]:inline-flex">
            <span>{"ອອນລາຍ"}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <button
            type="button"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
            aria-label="ຄົ້ນຫາ"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
            aria-label={showFilter ? "ຕົວກອງ" : "ແຈ້ງເຕືອນ"}
          >
            {showFilter ? (
              <SlidersHorizontal className="h-[18px] w-[18px]" strokeWidth={2.25} />
            ) : (
              <>
                <Bell className="h-[18px] w-[18px]" strokeWidth={2.25} />
                <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white ring-2 ring-white">
                  6
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export function StaffContextCard({
  branch,
  staff,
  shift,
  table
}: {
  branch: string;
  staff: string;
  shift?: string;
  table?: string;
}) {
  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-blue-100 bg-white shadow-[0_8px_18px_rgba(15,23,42,0.035)]">
      <div className="grid grid-cols-3 divide-x divide-blue-50">
        <ContextItem icon={Building2} label="ສາຂາ" value={branch} />
        <ContextItem icon={UserRound} label="ພະນັກງານ" value={staff} />
        <ContextItem icon={Sun} label="ກະ" value={shift ?? "ກະເຊົ້າ"} />
      </div>
      {table ? (
        <div className="border-t border-blue-50 px-2.5 py-2">
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-black text-blue-600">
            <Table2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{table}</span>
          </span>
        </div>
      ) : null}
    </div>
  );
}

function ContextItem({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 px-2.5 py-2.5">
      <Icon className="mb-1 h-3.5 w-3.5 text-slate-500" />
      <p className="text-[10px] font-bold text-slate-500">{label}</p>
      <p className="truncate text-[12px] font-black text-slate-950">{value}</p>
    </div>
  );
}
