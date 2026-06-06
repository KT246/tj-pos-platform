import {
  Bell,
  ChevronDown,
  Command,
  HelpCircle,
  MapPin,
  Menu,
  Monitor,
  Search,
  Store
} from "lucide-react";
import type { ReactNode } from "react";

import { activeBranch, businessName, sidebarItems } from "../data/mock-business-admin";
import type { BusinessMenuKey } from "../types";
import { BusinessAdminLink } from "../components/business-admin-link";
import { TjLogo } from "../components/business-admin-primitives";

export function BusinessAdminShell({
  active,
  children
}: {
  active: BusinessMenuKey;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[256px] border-r border-blue-100 bg-white xl:block">
        <div className="flex h-[68px] items-center justify-between border-b border-blue-100 px-5">
          <TjLogo />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
            aria-label="Collapse sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <nav className="h-[calc(100vh-68px)] overflow-y-auto px-3.5 py-4">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.label === active;

              return (
                <BusinessAdminLink
                  key={item.label}
                  href={item.href}
                  className={`flex h-9 items-center gap-2.5 rounded-md px-2.5 text-[12px] font-extrabold transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-800 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span className="truncate">{item.label}</span>
                </BusinessAdminLink>
              );
            })}
          </div>
          <div className="mt-6 rounded-lg bg-blue-50/70 p-4">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-600">
                <HelpCircle className="h-5 w-5" />
              </span>
              <span className="text-[13px] font-black text-slate-950">Need Help?</span>
            </div>
            <p className="text-xs leading-5 font-semibold text-slate-600">
              Visit our Help Center for guides and tutorials.
            </p>
            <button
              type="button"
              className="mt-4 flex h-9 w-full items-center justify-between rounded-md bg-white px-3 text-xs font-black text-blue-600"
            >
              Go to Help Center
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </nav>
      </aside>

      <div className="xl:pl-[256px]">
        <header className="sticky top-0 z-20 border-b border-blue-100 bg-white/95 backdrop-blur">
          <div className="flex h-[68px] items-center gap-3 px-5 2xl:px-7">
            <div className="xl:hidden">
              <TjLogo />
            </div>
            <button
              type="button"
              className="hidden h-10 w-10 items-center justify-center rounded-md border border-blue-100 text-slate-500 md:flex xl:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <TopSelect icon={Store} label={businessName} className="ml-auto" />
            <TopSelect icon={MapPin} label={activeBranch} />
            <BusinessAdminLink
              href="/business-admin/pos"
              className="hidden h-10 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-black text-white shadow-[0_8px_18px_rgba(37,99,235,0.2)] transition hover:bg-blue-700 lg:flex"
            >
              <Monitor className="h-4 w-4" />
              Open POS
            </BusinessAdminLink>
            <label className="relative hidden w-[330px] 2xl:flex">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="h-10 w-full rounded-md border border-blue-100 bg-white px-12 text-sm font-semibold outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                placeholder="Search items, orders, customers..."
              />
              <span className="absolute top-1/2 right-3 flex h-6 -translate-y-1/2 items-center gap-0.5 rounded border border-blue-100 px-2 text-[11px] font-black text-slate-400">
                <Command className="h-3 w-3" />K
              </span>
            </label>
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
                6
              </span>
            </button>
            <button
              type="button"
              className="flex min-w-[198px] items-center gap-3 rounded-md px-2 py-1 text-left transition hover:bg-blue-50"
            >
              <span
                aria-hidden="true"
                className="h-11 w-11 rounded-full border-4 border-emerald-50 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=96&q=80)"
                }}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-black text-slate-950">
                  Somchai Phommaseanh
                </span>
                <span className="block truncate text-xs font-semibold text-slate-500">
                  Business Owner
                </span>
              </span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </header>
        <main className="px-6 py-5 2xl:px-7">{children}</main>
      </div>
    </div>
  );
}

function TopSelect({
  icon: Icon,
  label,
  className = ""
}: {
  icon: typeof Store;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`hidden h-10 min-w-[190px] items-center gap-3 rounded-md border border-blue-100 bg-white px-3 text-left text-sm font-black text-slate-950 transition hover:border-blue-200 hover:bg-blue-50/50 md:flex ${className}`}
    >
      <Icon className="h-5 w-5 text-blue-600" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <ChevronDown className="h-4 w-4 text-slate-400" />
    </button>
  );
}
