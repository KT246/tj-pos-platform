"use client";

import { Bell, LayoutDashboard } from "lucide-react";

import { Logo } from "../../../components/layout/logo";
import { useI18n } from "../../../lib/i18n";

export function DashboardMockup({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();

  const metrics = [
    ["Total Sales", "K 45,680,000", "+16.4%"],
    ["Transactions", "1,256", "+12.4%"],
    ["Average Order Value", "K 36,340", "+8.7%"],
    ["Gross Profit", "K 16,890,000", "+21.3%"]
  ];

  return (
    <div className="rounded-lg border border-blue-100 bg-white p-2.5 shadow-[0_20px_70px_rgba(37,99,235,0.10)]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <Logo />
        <div className="hidden items-center gap-3 md:flex">
          <button className="font800 h-8 rounded-md border border-slate-200 px-3 text-xs text-slate-600">
            {t("Vientiane Cafe")}
          </button>
          <Bell className="h-4 w-4 text-emerald-500" />
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-300 to-blue-500" />
        </div>
      </div>
      <div className="grid gap-3 pt-3 md:grid-cols-[118px_1fr]">
        <aside className="hidden rounded-md bg-slate-50 p-2 md:block">
          {[
            "Dashboard",
            "Sales",
            "Transactions",
            "Products",
            "Customers",
            "Reports",
            "Settings"
          ].map((item, index) => (
            <div
              key={item}
              className={`font800 mb-1 flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] ${
                index === 0 ? "bg-blue-100 text-blue-600" : "text-slate-500"
              }`}
            >
              <LayoutDashboard className="h-3 w-3" />
              {t(item)}
            </div>
          ))}
        </aside>
        <div>
          {!compact ? (
            <div className="grid gap-2 md:grid-cols-4">
              {metrics.map(([label, value, change]) => (
                <div
                  key={label}
                  className="rounded-lg border border-slate-100 bg-white p-2"
                >
                  <p className="font800 text-[10px] text-slate-500">{t(label)}</p>
                  <p className="mt-1 text-sm font-black whitespace-nowrap text-slate-950">
                    {value}
                  </p>
                  <p className="font800 mt-1 text-[9px] leading-3 text-emerald-600">
                    {change} {t("vs last week")}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
          <div
            className={`mt-2 grid gap-2 ${compact ? "md:grid-cols-3" : "md:grid-cols-[1.4fr_1fr_1fr]"}`}
          >
            <div className="rounded-lg border border-slate-100 bg-white p-3">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font900 text-sm text-slate-950">
                  {t("Sales Overview")}
                </h3>
                <span className="font800 rounded-md border border-slate-200 px-2 py-1 text-[10px] text-slate-500">
                  {t("This Week")}
                </span>
              </div>
              <svg viewBox="0 0 320 150" className="h-[94px] w-full">
                <defs>
                  <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[30, 60, 90, 120].map((y) => (
                  <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="#e5eefc" />
                ))}
                <path
                  d="M0 110 L48 72 L96 95 L144 56 L192 40 L240 82 L320 24 L320 150 L0 150 Z"
                  fill="url(#chartFill)"
                />
                <polyline
                  points="0,110 48,72 96,95 144,56 192,40 240,82 320,24"
                  fill="none"
                  stroke="#2563eb"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                />
              </svg>
            </div>
            <div className="rounded-lg border border-slate-100 bg-white p-3">
              <h3 className="font900 text-sm text-slate-950">{t("Top Products")}</h3>
              <div className="mt-3 space-y-2">
                {["Iced Latte", "Green Tea", "Croissant", "Bagel", "Brownie"].map(
                  (item, index) => (
                    <div key={item} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="h-7 w-7 rounded-md bg-gradient-to-br from-amber-200 to-amber-700" />
                        <span className="font800 text-[10px] text-slate-700">
                          {t(item)}
                        </span>
                      </div>
                      <span className="font900 text-[10px] whitespace-nowrap text-slate-900">
                        K {(index + 2) * 840},000
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="rounded-lg border border-slate-100 bg-white p-3">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font900 text-sm text-slate-950">
                  {t("Recent Transactions")}
                </h3>
                <span className="font900 text-[10px] text-blue-600">
                  {t("View all")}
                </span>
              </div>
              <div className="space-y-2">
                {["INV-00155", "INV-00154", "INV-00153", "INV-00152"].map(
                  (item, index) => (
                    <div key={item} className="flex items-center justify-between">
                      <div>
                        <p className="font900 text-[10px] text-blue-600">{item}</p>
                        <p className="text-[10px] text-slate-500">
                          May 18, 11:{25 - index} AM
                        </p>
                      </div>
                      <p className="font900 text-[10px] whitespace-nowrap text-slate-900">
                        K {65 + index * 25},000
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
