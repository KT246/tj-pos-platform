import Link from "next/link";
import { ArrowRight, ChevronDown, Globe, User } from "lucide-react";

import type { ActiveNav } from "../../lib/routes";
import { navItems } from "../../lib/routes";
import { Logo } from "./logo";

export function SiteHeader({ active }: { active: ActiveNav }) {
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
              {item.label}
              {item.hasMenu ? <ChevronDown className="h-3.5 w-3.5" /> : null}
              {active === item.label ? (
                <span className="absolute inset-x-4 bottom-0 h-1 rounded-t bg-blue-600" />
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button className="font800 hidden h-9 items-center gap-2 rounded-md px-3 text-sm text-slate-900 md:flex">
            <Globe className="h-4 w-4" />
            EN
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <Link
            href="/login"
            className="font800 hidden h-9 items-center gap-2 rounded-md border border-blue-300 bg-white px-5 text-sm text-blue-600 md:flex"
          >
            <User className="h-4 w-4" />
            Login
          </Link>
          <Link
            href="/request-demo"
            className="font800 inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm text-white shadow-sm"
          >
            Request Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
