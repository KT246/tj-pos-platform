"use client";

import Image from "../../../compat/image";
import Link from "../../../compat/link";
import { usePathname } from "../../../compat/navigation";
import { type ReactNode, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Plus, Search, LogOut, User, Settings } from "lucide-react";

import { adminNavGroups, adminUser } from "../data/mock-platform-admin";
import { Logo } from "../../../components/layout/logo";

function getActiveHref(pathname: string) {
  const allItems = adminNavGroups.flatMap((g) => g.items);
  const matches = allItems
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
  const navigate = useNavigate();
  const [user, setUser] = useState(adminUser);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("active_platform_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_42%)] text-slate-900">
      <header className="fixed top-0 right-0 left-0 z-40 flex h-[64px] items-center border-b border-blue-100 bg-white/95 backdrop-blur">
        <div className="flex h-full w-[230px] shrink-0 items-center justify-between border-r border-blue-100 px-7">
          <Logo
            href="/platform-admin/dashboard"
            markClassName="h-9 w-9"
            textClassName="text-xl"
            taglineClassName="text-[6px]"
            priority
          />
        </div>

        <div className="relative flex h-full min-w-0 flex-1 items-center px-6">
          <label className="absolute top-1/2 left-1/2 hidden w-[420px] -translate-x-1/2 -translate-y-1/2 lg:block 2xl:w-[520px]">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-10 w-full rounded-lg border border-blue-100 bg-white pr-16 pl-11 text-sm outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              placeholder="ຄົ້ນຫາທຸລະກິດ, ຜູ້ໃຊ້, tickets..."
            />
            <span className="font800 absolute top-1/2 right-3 -translate-y-1/2 rounded border border-blue-100 px-2 py-0.5 text-xs text-slate-500">
              ⌘K
            </span>
          </label>

          <div className="ml-auto flex items-center gap-4">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-blue-50"
            >
              <Bell className="h-5 w-5" />
              <span className="font900 absolute top-0 right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
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
            
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 rounded-lg p-1.5 transition hover:bg-blue-50/50"
              >
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="h-10 w-10 rounded-full object-cover ring-4 ring-emerald-50"
                />
                <span className="hidden text-left xl:block">
                  <span className="font900 block text-sm text-slate-950">
                    {user.name}
                  </span>
                  <span className="block text-xs text-slate-500">{user.role}</span>
                </span>
                <ChevronDown className={`hidden h-4 w-4 text-slate-500 transition-transform xl:block ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-[280px] rounded-xl border border-blue-100 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.12)] backdrop-blur z-50">
                  {/* User info head */}
                  <div className="mb-3 flex items-center gap-3">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-50"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="font900 block text-sm text-slate-950 truncate leading-tight">
                        {user.name}
                      </span>
                      <span className="block text-[11px] text-slate-500 font-bold mt-0.5">
                        {user.role}
                      </span>
                      <span className="block text-[10px] text-slate-400 truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <div className="my-2 border-t border-slate-100" />

                  {/* Actions list */}
                  <div className="space-y-1">
                    <Link
                      href="/platform-admin/profile-security"
                      onClick={() => setIsProfileOpen(false)}
                      className="font800 flex h-9 items-center gap-2.5 rounded-md px-2.5 text-xs text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <User className="h-4 w-4 text-slate-400 animate-pulse" />
                      <span>ແກ້ໄຂ Profile / ຄວາມປອດໄພ</span>
                    </Link>

                    {user.role === "Platform Admin" && (
                      <Link
                        href="/platform-admin/system-settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="font800 flex h-9 items-center gap-2.5 rounded-md px-2.5 text-xs text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Settings className="h-4 w-4 text-slate-400" />
                        <span>ຕັ້ງຄ່າ Platform</span>
                      </Link>
                    )}
                  </div>

                  <div className="my-2 border-t border-slate-100" />

                  {/* Logout action */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/login");
                    }}
                    className="font800 flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-xs text-red-500 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span>ອອກຈາກລະບົບ (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <aside className="fixed top-[64px] bottom-0 left-0 z-30 hidden w-[230px] border-r border-blue-100 bg-white xl:block">
        <nav className="flex h-full flex-col px-3 py-4">
          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1 space-y-5">
            {adminNavGroups
              .map((group) => {
                const filteredItems = group.items.filter(
                  (item) => !item.allowedRoles || item.allowedRoles.includes(user.role)
                );
                return { ...group, items: filteredItems };
              })
              .filter((group) => group.items.length > 0)
              .map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-0.5">
                  {group.label && (
                    <h4 className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 select-none">
                      {group.label}
                    </h4>
                  )}
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = activeHref === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`font800 flex h-[40px] items-center gap-3 rounded-lg px-3 text-[13px] transition-all duration-150 ${
                          active
                            ? "bg-blue-50 text-blue-700 shadow-[inset_2px_0_0_#3b82f6]"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-blue-600" : "text-slate-400"}`} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font800 flex h-[40px] w-full items-center gap-3 rounded-lg px-3 text-[13px] text-red-500 transition-all duration-150 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              <span className="truncate">ອອກຈາກລະບົບ</span>
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
