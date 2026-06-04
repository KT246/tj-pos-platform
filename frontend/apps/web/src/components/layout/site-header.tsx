"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Globe } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";

import { revealSection, scrollToSection } from "../animations/animated-content";
import type { ActiveNav } from "../../lib/routes";
import { navItems } from "../../lib/routes";
import { useI18n, type Language } from "../../lib/i18n";
import { Logo } from "./logo";

const ACTIVE_NAV_STORAGE_KEY = "tj-pos-web-active-section";

const languageOptions: { value: Language; label: string; shortLabel: string }[] = [
  { value: "en", label: "English", shortLabel: "EN" },
  { value: "lo", label: "ລາວ", shortLabel: "ລາວ" }
];

function getNavItemBySection(sectionId: string) {
  return navItems.find((item) => item.sectionId === sectionId);
}

export function SiteHeader({ active }: { active: ActiveNav }) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useI18n();
  const [currentActive, setCurrentActive] = useState<ActiveNav>(active);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const currentLanguage = languageOptions.find((item) => item.value === language);

  useEffect(() => {
    if (pathname !== "/") {
      return undefined;
    }

    let frameId = 0;

    const setActiveSection = (
      sectionId: string,
      options: { updateHash?: boolean } = {}
    ) => {
      const item = getNavItemBySection(sectionId);

      if (!item) {
        return;
      }

      setCurrentActive(item.label);
      window.localStorage.setItem(ACTIVE_NAV_STORAGE_KEY, sectionId);

      if (options.updateHash && window.location.hash !== `#${sectionId}`) {
        window.history.replaceState(null, "", `/#${sectionId}`);
      }
    };

    const setActiveFromHash = () => {
      const sectionId = window.location.hash.slice(1);

      if (sectionId) {
        setActiveSection(sectionId);
      }
    };

    const setActiveFromScroll = (updateHash = false) => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const targetLine = 96;
        const activeEntry = navItems
          .map((item) => {
            const element = document.getElementById(item.sectionId);

            if (!element) {
              return null;
            }

            return { item, rect: element.getBoundingClientRect() };
          })
          .filter((entry) => entry && entry.rect.bottom > targetLine)
          .find((entry) => entry!.rect.top <= targetLine);

        if (activeEntry) {
          setActiveSection(activeEntry.item.sectionId, { updateHash });
          return;
        }

        const firstVisible = navItems.find((item) => {
          const element = document.getElementById(item.sectionId);

          if (!element) {
            return false;
          }

          return element.getBoundingClientRect().bottom > targetLine;
        });

        if (firstVisible) {
          setActiveSection(firstVisible.sectionId, { updateHash });
        }
      });
    };
    const handleScroll = () => setActiveFromScroll(true);

    setActiveFromHash();
    if (!window.location.hash) {
      const storedSectionId = window.localStorage.getItem(ACTIVE_NAV_STORAGE_KEY);

      if (window.scrollY > 100 && storedSectionId) {
        setActiveSection(storedSectionId);
      } else {
        setActiveFromScroll();
      }
    }

    window.addEventListener("hashchange", setActiveFromHash);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("hashchange", setActiveFromHash);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [active, pathname]);

  const displayActive = pathname === "/" ? currentActive : active;

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    const item = getNavItemBySection(sectionId);

    if (item) {
      setCurrentActive(item.label);
      window.localStorage.setItem(ACTIVE_NAV_STORAGE_KEY, sectionId);
    }

    if (pathname !== "/") {
      return;
    }

    if (!scrollToSection(sectionId)) {
      return;
    }

    event.preventDefault();
    window.history.pushState(null, "", `/#${sectionId}`);
    revealSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1320px] items-center justify-between px-6 lg:px-8">
        <Logo />
        <nav className="hidden h-full items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(event) => handleNavClick(event, item.sectionId)}
              className={`font800 relative flex h-full items-center gap-1 px-4 text-sm transition ${
                displayActive === item.label
                  ? "text-blue-600"
                  : "text-slate-900 hover:text-blue-600"
              }`}
            >
              {t(item.label)}
              {displayActive === item.label ? (
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
