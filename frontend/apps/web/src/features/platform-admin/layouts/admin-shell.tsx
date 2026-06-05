"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Bell,
  ChevronDown,
  Headphones,
  Menu,
  Plus,
  Search
} from "lucide-react";

import { adminNavItems, adminUser } from "../data/mock-platform-admin";
import { Logo } from "../../../components/layout/logo";

function getActiveHref(pathname: string) {
  const matches = adminNavItems
    .filter((item) =>
      item.match.some((match) => pathname === match || pathname.startsWith(`${match}/`))
    )
    .sort((a, b) => b.match[0].length - a.match[0].length);

  if (pathname === "/platform-admin") {
    return "/platform-admin/dashboard";
  }

  return matches[0]?.href ?? "/platform-admin/dashboard";
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const activeHref = getActiveHref(pathname);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_42%)] text-slate-900">
      <header className="fixed left-0 right-0 top-0 z-40 flex h-[64px] items-center border-b border-blue-100 bg-white/95 backdrop-blur">
        <div className="flex h-full w-[230px] shrink-0 items-center justify-between border-r border-blue-100 px-7">
          <Logo
            href="/platform-admin/dashboard"
            markClassName="h-9 w-9"
            textClassName="text-xl"
            taglineClassName="text-[6px]"
            priority
          />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-blue-50"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="relative flex h-full min-w-0 flex-1 items-center px-6">
          <label className="absolute left-1/2 top-1/2 hidden w-[420px] -translate-x-1/2 -translate-y-1/2 lg:block 2xl:w-[520px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-10 w-full rounded-lg border border-blue-100 bg-white pl-11 pr-16 text-sm outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              placeholder="ຄົ້ນຫາທຸລະກິດ, ຜູ້ໃຊ້, tickets..."
            />
            <span className="font800 absolute right-3 top-1/2 -translate-y-1/2 rounded border border-blue-100 px-2 py-0.5 text-xs text-slate-500">
              ⌘K
            </span>
          </label>

          <div className="ml-auto flex items-center gap-4">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-blue-50"
            >
              <Bell className="h-5 w-5" />
              <span className="font900 absolute right-1 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
                8
              </span>
            </button>
            <Link
              href="/platform-admin/businesses/create"
              className="font900 hidden h-10 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm text-white shadow-[0_8px_20px_rgba(13,91,255,0.22)] hover:bg-blue-700 md:inline-flex"
            >
              <Plus className="h-4 w-4" />
              ສ້າງທຸລະກິດ
            </Link>
            <button type="button" className="flex items-center gap-3">
              <Image
                src={adminUser.avatarUrl}
                alt={adminUser.name}
                width={48}
                height={48}
                className="h-10 w-10 rounded-full object-cover ring-4 ring-emerald-50"
              />
              <span className="hidden text-left xl:block">
                <span className="font900 block text-sm text-slate-950">{adminUser.name}</span>
                <span className="block text-xs text-slate-500">{adminUser.role}</span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-slate-500 xl:block" />
            </button>
          </div>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-[64px] z-30 hidden w-[230px] border-r border-blue-100 bg-white xl:block">
        <nav className="flex h-full flex-col px-3 py-4">
          <div className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const active = activeHref === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font800 flex h-[43px] items-center gap-4 rounded-lg px-4 text-[13px] transition ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-800 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto rounded-xl border border-blue-100 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <div className="flex gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Headphones className="h-7 w-7" />
              </span>
              <div>
                <p className="font900 text-sm text-slate-950">ຕ້ອງການຊ່ວຍເຫຼືອ?</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  ທີມ support ຂອງພວກເຮົາພ້ອມຊ່ວຍ.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="font900 mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-blue-100 text-sm text-blue-700 hover:bg-blue-50"
            >
              ຕິດຕໍ່ Support
            </button>
          </div>
        </nav>
      </aside>

      <main className="pt-[64px] xl:pl-[230px]">
        <div className="px-5 py-4 lg:px-6">{children}</div>
      </main>
    </div>
  );
}
