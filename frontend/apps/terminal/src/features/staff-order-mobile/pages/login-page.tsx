import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  ChevronDown,
  Clock,
  IdCard,
  Lock,
  QrCode,
  ScanLine,
  Smartphone,
  Store,
  Sun,
  UserRound
} from "lucide-react";
import { Link } from "react-router-dom";

import { useStaffOrderStore } from "../stores/staff-order-store";
import {
  branchOptions,
  staffDevice,
  staffId,
  staffRole
} from "../data/staff-order-data";
import { getStaffOrderPath } from "../utils";
import { StaffMobileShell, StaffScrollArea } from "../components/staff-mobile-shell";
import { StaffOrderHeader } from "../components/staff-order-header";

export function StaffLoginPage({ businessSlug }: { businessSlug: string }) {
  const selectedBranch = useStaffOrderStore((state) => state.selectedBranch);
  const staffName = useStaffOrderStore((state) => state.staffName);
  const setSelectedBranch = useStaffOrderStore((state) => state.setSelectedBranch);
  const showNotice = useStaffOrderStore((state) => state.showNotice);

  return (
    <StaffMobileShell>
      <StaffOrderHeader title="Staff Login" />
      <StaffScrollArea>
        <section className="mt-5 rounded-lg border border-blue-100 bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.045)]">
          <div className="flex gap-4">
            <img
              src="https://i.pravatar.cc/160?img=47"
              alt=""
              className="h-24 w-24 rounded-full bg-blue-50 object-cover"
            />
            <div className="min-w-0 flex-1 py-1">
              <h2 className="text-[20px] leading-6 font-black text-slate-950">
                Welcome back, Somchai!
              </h2>
              <p className="mt-1 text-[13px] font-bold text-slate-500">
                Let's get ready to take great orders.
              </p>
              <div className="mt-4 grid grid-cols-2 divide-x divide-blue-50">
                <SmallMeta icon={CalendarDays} label="Date" value="May 20, 2024" />
                <SmallMeta icon={Clock} label="Time" value="9:41 AM" />
              </div>
            </div>
          </div>
        </section>

        <div className="mt-4 space-y-3">
          <LoginRow icon={Store} label="Branch" value={selectedBranch} hasChevron />
          <LoginRow icon={UserRound} label="Role" value={staffRole} hasChevron />
          <LoginRow icon={IdCard} label="Employee ID" value={staffId} />
          <LoginRow icon={Lock} label="PIN" value="••••" trailingIcon={BadgeCheck} />
        </div>

        <section className="mt-4 rounded-lg border border-blue-100 bg-blue-50/35 p-4">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
              <Sun className="h-8 w-8" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-slate-500">
                Today's Shift
              </p>
              <h3 className="text-[19px] font-black text-slate-950">
                Morning Shift
              </h3>
              <p className="mt-2 flex items-center gap-3 text-[12px] font-bold text-slate-500">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-600">
                  Open
                </span>
                Main Floor
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-lg border border-blue-100 bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[15px] font-black text-slate-950">
              Quick Branch Switch
            </h3>
            <button
              type="button"
              onClick={() => showNotice("Branch management opens in admin.")}
              className="text-[12px] font-black text-blue-600"
            >
              Manage Branches
            </button>
          </div>
          <div className="overflow-hidden rounded-lg border border-blue-50">
            {branchOptions.map((branch) => (
              <button
                key={branch.name}
                type="button"
                onClick={() => setSelectedBranch(branch.name)}
                className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-blue-50 px-3 py-3 text-left last:border-b-0 hover:bg-blue-50/60"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Building2 className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[13px] font-black text-slate-950">
                    {branch.name}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {branch.location}
                  </span>
                </span>
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                    branch.name === selectedBranch
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200"
                  }`}
                >
                  {branch.name === selectedBranch ? (
                    <BadgeCheck className="h-4 w-4" />
                  ) : null}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 divide-x divide-blue-50 rounded-lg border border-blue-100 bg-white px-3 py-3">
          <SmallMeta icon={Smartphone} label="Device" value={staffDevice} />
          <SmallMeta icon={ScanLine} label="Connection" value="Online" />
        </section>

        <Link
          to={getStaffOrderPath(businessSlug, "/tables")}
          className="mt-4 flex h-14 items-center justify-center gap-3 rounded-lg bg-blue-600 text-[16px] font-black text-white shadow-[0_16px_28px_rgba(37,99,235,0.26)] transition hover:bg-blue-700"
        >
          Login & Start Taking Orders
          <ArrowRight className="h-5 w-5" />
        </Link>
        <button
          type="button"
          onClick={() => showNotice("Staff QR scanner ready.")}
          className="mt-3 flex h-[52px] w-full items-center justify-center gap-3 rounded-lg border border-blue-200 bg-white text-[15px] font-black text-blue-600 hover:bg-blue-50"
        >
          <QrCode className="h-5 w-5" />
          Scan Staff QR
        </button>
      </StaffScrollArea>
    </StaffMobileShell>
  );
}

function LoginRow({
  icon: Icon,
  label,
  value,
  hasChevron,
  trailingIcon: TrailingIcon
}: {
  icon: typeof Store;
  label: string;
  value: string;
  hasChevron?: boolean;
  trailingIcon?: typeof Store;
}) {
  return (
    <button
      type="button"
      className="grid h-16 w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-blue-100 bg-white px-4 text-left"
    >
      <Icon className="h-5 w-5 text-slate-500" />
      <span>
        <span className="block text-[11px] font-bold text-slate-500">{label}</span>
        <span className="text-[14px] font-black text-slate-950">{value}</span>
      </span>
      {hasChevron ? (
        <ChevronDown className="h-5 w-5 text-slate-400" />
      ) : TrailingIcon ? (
        <TrailingIcon className="h-5 w-5 text-slate-500" />
      ) : null}
    </button>
  );
}

function SmallMeta({
  icon: Icon,
  label,
  value
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 px-2">
      <Icon className="h-5 w-5 shrink-0 text-slate-500" />
      <span className="min-w-0">
        <span className="block text-[10px] font-bold text-slate-500">{label}</span>
        <span className="block truncate text-[12px] font-black text-slate-950">
          {value}
        </span>
      </span>
    </div>
  );
}
