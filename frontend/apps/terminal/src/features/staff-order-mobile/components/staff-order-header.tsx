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
    <header className="shrink-0 border-b border-blue-50 bg-white/96 px-4 py-3 shadow-[0_1px_0_rgba(219,234,254,0.85)] backdrop-blur supports-[backdrop-filter]:bg-white/90 sm:px-5">
      <div className="grid h-11 grid-cols-[1fr_auto_1fr] items-center">
        <div className="flex items-center gap-2">
          {backHref ? (
            <Link
              to={backHref}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          ) : (
            <img
              src="/terminal-logo.png"
              alt="TJ POS"
              className="h-9 w-auto object-contain"
            />
          )}
        </div>
        <h1 className="text-center text-[17px] font-black text-slate-950">
          {title}
        </h1>
        <div className="flex items-center justify-end gap-2">
          <span className="hidden items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-600 min-[390px]:flex">
            Online
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            aria-label={showFilter ? "Filters" : "Notifications"}
          >
            {showFilter ? (
              <SlidersHorizontal className="h-5 w-5" />
            ) : (
              <>
                <Bell className="h-5 w-5" />
                <span className="absolute top-0.5 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white ring-2 ring-white">
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
    <div className="mt-4 overflow-hidden rounded-lg border border-blue-100 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.045)]">
      <div className="grid grid-cols-3 divide-x divide-blue-50">
        <ContextItem icon={Building2} label="Branch" value={branch} />
        <ContextItem icon={UserRound} label="Staff" value={staff} />
        <ContextItem icon={Sun} label="Shift" value={shift ?? "Morning"} />
      </div>
      {table ? (
        <div className="border-t border-blue-50 px-3 py-2.5">
          <span className="inline-flex max-w-full items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-[12px] font-black text-blue-600">
            <Table2 className="h-4 w-4 shrink-0" />
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
    <div className="min-w-0 px-3 py-3">
      <Icon className="mb-1 h-4 w-4 text-slate-500" />
      <p className="text-[10px] font-bold text-slate-500">{label}</p>
      <p className="truncate text-[12px] font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}
