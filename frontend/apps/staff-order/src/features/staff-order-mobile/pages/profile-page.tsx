import {
  ChevronRight,
  CircleHelp,
  Info,
  LogOut,
  Printer,
  RefreshCw,
  Repeat2,
  Store,
  Volume2
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { StaffBottomNav } from "../components/staff-bottom-nav";
import { StaffOrderHeader } from "../components/staff-order-header";
import { StaffMobileShell, StaffScrollArea } from "../components/staff-mobile-shell";
import { staffId, staffRole } from "../data/staff-order-data";
import { useStaffOrderStore } from "../stores/staff-order-store";
import { getStaffOrderPath } from "../utils";
import { lo } from "../utils/lao-labels";

export function StaffProfilePage({ businessSlug }: { businessSlug: string }) {
  const selectedBranch = useStaffOrderStore((state) => state.selectedBranch);
  const selectedTableId = useStaffOrderStore((state) => state.selectedTableId);
  const staffName = useStaffOrderStore((state) => state.staffName);

  return (
    <StaffMobileShell
      bottomNav={
        <StaffBottomNav
          businessSlug={businessSlug}
          active="profile"
          selectedTableId={selectedTableId}
        />
      }
    >
      <StaffOrderHeader title="Profile" />
      <StaffScrollArea className="pb-3">
        <section className="mt-3 rounded-lg border border-blue-100 bg-white p-3 shadow-[0_12px_28px_rgba(15,23,42,0.055)]">
          <div className="grid grid-cols-[64px_1fr] items-center gap-3">
            <img
              src="https://i.pravatar.cc/180?img=11"
              alt=""
              className="h-16 w-16 rounded-full object-cover ring-4 ring-blue-50"
            />
            <div className="min-w-0">
              <h2 className="truncate text-[16px] leading-5 font-black text-slate-950">
                Somchai Phommaseanh
              </h2>
              <p className="mt-1 truncate text-[12px] font-bold text-slate-500">
                {lo(staffRole)}
              </p>
              <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-600">
                {lo("On Shift")}
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <ProfileInfoCard label="Branch" value={selectedBranch} />
            <ProfileInfoCard label="Employee ID" value={staffId} />
          </div>
        </section>

        <h3 className="mt-4 text-[15px] font-black text-slate-500">{lo("Settings")}</h3>
        <section className="mt-3 overflow-hidden rounded-lg border border-blue-100 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.045)]">
          <SettingsRow
            icon={Store}
            title="Branch & Device"
            subtitle="View branch details and device info"
          />
          <SettingsRow
            icon={Printer}
            title="Printer Settings"
            subtitle="Manage printers and print options"
          />
          <SettingsRow
            icon={Volume2}
            title="Sound & Notifications"
            subtitle="Configure sounds and alerts"
            trailing={<Toggle />}
          />
        </section>

        <h3 className="mt-4 text-[15px] font-black text-slate-500">{lo("System")}</h3>
        <section className="mt-3 overflow-hidden rounded-lg border border-blue-100 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.045)]">
          <SettingsRow
            icon={CircleHelp}
            title="Help Center"
            subtitle="FAQs and support"
          />
          <SettingsRow
            icon={RefreshCw}
            title="Sync Status"
            subtitle="Keep data in sync across devices"
            trailing={<Toggle />}
          />
          <SettingsRow
            icon={Info}
            title="About App"
            subtitle="App information and version"
            trailing={
              <span className="text-[12px] font-bold text-slate-600">v1.0.8</span>
            }
          />
        </section>

        <Link
          to={getStaffOrderPath(businessSlug, "")}
          className="mt-4 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white text-[13px] font-black text-blue-600 shadow-sm transition hover:bg-blue-50"
        >
          <Repeat2 className="h-4 w-4" />
          {lo("Switch Branch")}
        </Link>
        <Link
          to={getStaffOrderPath(businessSlug, "")}
          className="mt-2 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 bg-white text-[13px] font-black text-red-500 shadow-sm transition hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          {lo("Logout")}
        </Link>
      </StaffScrollArea>
    </StaffMobileShell>
  );
}

function ProfileInfoCard({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg bg-blue-50/55 px-3 py-2">
      <p className="text-[10px] font-bold text-slate-500">{lo(label)}</p>
      <p className="mt-0.5 truncate text-[12px] font-black text-slate-950">
        {lo(value)}
      </p>
    </div>
  );
}

function SettingsRow({
  icon: Icon,
  title,
  subtitle,
  trailing
}: {
  icon: typeof Store;
  title: string;
  subtitle: string;
  trailing?: ReactNode;
}) {
  return (
    <button
      type="button"
      className="grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-blue-50 px-3 py-3 text-left transition last:border-b-0 hover:bg-blue-50/50"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-black text-slate-950">{lo(title)}</span>
        <span className="text-[12px] font-bold text-slate-500">{lo(subtitle)}</span>
      </span>
      <span className="flex items-center gap-2">
        {trailing}
        <ChevronRight className="h-5 w-5 text-slate-400" />
      </span>
    </button>
  );
}

function Toggle() {
  return (
    <span className="flex h-8 w-[52px] items-center justify-end rounded-full bg-blue-600 p-1">
      <span className="h-6 w-6 rounded-full bg-white" />
    </span>
  );
}
