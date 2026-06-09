import { ChevronDown, Menu, Wifi } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getTerminalBusiness } from "../data/mock-pos-data";
import { getPosScreenConfig } from "../screens/pos-screen-config";
import { getBusinessPath } from "../utils";
import { TerminalBrand } from "./terminal-brand";

export function TerminalTopBar({ insetLeft = false }: { insetLeft?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { businessSlug = "tj-cafe-vientiane" } = useParams();
  const business = getTerminalBusiness(businessSlug);
  const screenConfig = getPosScreenConfig(business.posType);
  const theme = screenConfig.theme;
  const PosIcon = screenConfig.icon;

  return (
    <header className={`z-20 shrink-0 border-b bg-white/95 backdrop-blur ${theme.border}`}>
      <div
        className={`grid h-16 items-center gap-3 pr-3 ${
          insetLeft
            ? "grid-cols-[minmax(0,1fr)_44px] pl-[300px]"
            : "grid-cols-[220px_minmax(0,1fr)_44px] px-3"
        }`}
      >
        {insetLeft ? null : (
          <Link
            to={getBusinessPath(businessSlug, "")}
            className={`flex h-12 items-center rounded-lg border bg-white px-3 transition ${theme.border} ${theme.rowHover}`}
          >
            <TerminalBrand compact />
          </Link>
        )}
        <div
          className={`hidden min-w-0 items-center overflow-hidden rounded-lg border bg-white lg:flex ${theme.border}`}
        >
          <div className={`flex h-12 min-w-48 items-center gap-3 px-4 ${theme.softerBg}`}>
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${theme.iconBox}`}>
              <PosIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-black text-slate-500">
                {screenConfig.topbar.contextLabel}
              </span>
              <span className="block truncate text-[12px] font-black text-slate-950">
                {screenConfig.topbar.contextValue}
              </span>
            </span>
          </div>
          <TopMeta
            label={business.posType === "hospitality" ? "ຟຣອນເດສ" : "ສາຂາ"}
            value={business.branchName}
            theme={theme}
          />
          <TopCashier
            label={screenConfig.topbar.roleLabel}
            roleValue={screenConfig.topbar.roleValue}
            cashierName={business.cashierName}
            theme={theme}
          />
          <TopMeta
            label={screenConfig.topbar.shiftLabel}
            value={`${business.shiftName} - ${screenConfig.topbar.shiftContext}`}
            theme={theme}
          />
          <span
            className={`flex h-12 min-w-44 items-center justify-between gap-3 px-4 text-[12px] font-black ${theme.activeText}`}
          >
            <span>
              <span className="block text-[10px] font-black text-slate-500">
                {screenConfig.topbar.statusLabel}
              </span>
              <span className="block text-[12px] font-black">
                {screenConfig.topbar.statusValue}
              </span>
            </span>
            <Wifi className="h-4 w-4" />
          </span>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-slate-700 transition ${theme.border} ${theme.rowHover}`}
            aria-label={"ເປີດເມນູ POS"}
          >
            <Menu className="h-5 w-5" />
          </button>
          {menuOpen ? (
            <div
              className={`absolute top-12 right-0 z-30 w-60 overflow-hidden rounded-lg border bg-white shadow-[0_18px_40px_rgba(15,23,42,0.16)] ${theme.border}`}
            >
              <MenuLink href={getBusinessPath(businessSlug, "/open-orders")} label={screenConfig.orders.openTitle} theme={theme} />
              <MenuLink href={getBusinessPath(businessSlug, "/refund")} label={screenConfig.refund.title} theme={theme} />
              <MenuLink href={getBusinessPath(businessSlug, "/open-shift")} label={screenConfig.shift.openTitle} theme={theme} />
              <MenuLink href={getBusinessPath(businessSlug, "/close-shift")} label={screenConfig.shift.closeTitle} theme={theme} />
              <MenuLink href={getBusinessPath(businessSlug, "/offline")} label={screenConfig.offline.title} theme={theme} />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function MenuLink({
  href,
  label,
  theme
}: {
  href: string;
  label: string;
  theme: ReturnType<typeof getPosScreenConfig>["theme"];
}) {
  return (
    <Link
      to={href}
      className={`block border-b px-4 py-3 text-[12px] font-black text-slate-700 last:border-b-0 hover:text-slate-950 ${theme.border} ${theme.rowHover}`}
    >
      {label}
    </Link>
  );
}

function TopMeta({
  label,
  value,
  theme
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof getPosScreenConfig>["theme"];
}) {
  return (
    <button
      type="button"
      className={`flex h-12 min-w-40 items-center justify-between gap-3 border-l px-4 text-left transition ${theme.border} ${theme.rowHover}`}
    >
      <span className="min-w-0">
        <span className="block text-[10px] font-black text-slate-500">{label}</span>
        <span className="block truncate text-[12px] font-black text-slate-950">
          {value}
        </span>
      </span>
      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
    </button>
  );
}

function TopCashier({
  label,
  roleValue,
  cashierName,
  theme
}: {
  label: string;
  roleValue: string;
  cashierName: string;
  theme: ReturnType<typeof getPosScreenConfig>["theme"];
}) {
  return (
    <button
      type="button"
      className={`flex h-12 min-w-52 items-center gap-3 border-l px-4 text-left transition ${theme.border} ${theme.rowHover}`}
    >
      <img
        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80"
        alt=""
        className="h-7 w-7 rounded-full border border-blue-100 object-cover"
      />
      <span className="min-w-0">
        <span className="block text-[10px] font-black text-slate-500">
          {label} / {roleValue}
        </span>
        <span className="block truncate text-[12px] font-black text-slate-950">
          {cashierName}
        </span>
      </span>
    </button>
  );
}
