"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Globe } from "lucide-react";
import { useState } from "react";

import type { ActiveNav } from "../../lib/routes";
import { navItems } from "../../lib/routes";
import { useI18n, type Language } from "../../lib/i18n";
import { Logo } from "./logo";

const languageOptions: { value: Language; label: string; shortLabel: string }[] = [
  { value: "en", label: "English", shortLabel: "EN" },
  { value: "lo", label: "ລາວ", shortLabel: "ລາວ" }
];

export function SiteHeader({ active }: { active: ActiveNav }) {
  const { language, setLanguage, t } = useI18n();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const currentLanguage = languageOptions.find((item) => item.value === language);

  return (
    <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1320px] items-center justify-between px-6 lg:px-8">
        <Logo />
        <nav className="hidden h-full items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`font800 relative flex h-full items-center gap-1 px-4 text-sm transition ${
                active === item.label
                  ? "text-blue-600"
                  : "text-slate-900 hover:text-blue-600"
              }`}
            >
              {t(item.label)}
              {active === item.label ? (
                <span className="absolute inset-x-4 bottom-0 h-1 rounded-t bg-blue-600" />
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <button
              type="button"
              aria-expanded={isLanguageMenuOpen}
              className="font800 flex h-9 items-center gap-2 rounded-md px-3 text-sm text-slate-900"
              onClick={() => setIsLanguageMenuOpen((isOpen) => !isOpen)}
            >
              <Globe className="h-4 w-4" />
              {currentLanguage?.shortLabel}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {isLanguageMenuOpen ? (
              <div className="absolute top-11 right-0 z-50 w-36 rounded-md border border-blue-100 bg-white p-1 shadow-lg">
                {languageOptions.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`font800 flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm ${
                      item.value === language
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                    onClick={() => {
                      setLanguage(item.value);
                      setIsLanguageMenuOpen(false);
                    }}
                  >
                    {item.label}
                    <span className="text-xs text-slate-400">{item.shortLabel}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <Link
            href="/request-demo"
            className="font800 inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm text-white shadow-sm"
          >
            {t("Request Demo")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
