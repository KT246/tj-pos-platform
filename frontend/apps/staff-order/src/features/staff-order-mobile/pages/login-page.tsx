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
      <StaffOrderHeader title="ເຂົ້າລະບົບພະນັກງານ" />
      <StaffScrollArea>
        <section className="mt-3 rounded-lg border border-blue-100 bg-white p-3 shadow-[0_12px_28px_rgba(15,23,42,0.045)]">
          <div className="flex gap-4">
            <img
              src="https://i.pravatar.cc/160?img=47"
              alt=""
              className="h-20 w-20 rounded-full bg-blue-50 object-cover"
            />
            <div className="min-w-0 flex-1 py-1">
              <h2 className="text-[17px] leading-5 font-black text-slate-950">
                {"ຍິນດີຕ້ອນຮັບກັບ, Somchai!"}
              </h2>
              <p className="mt-1 text-[12px] font-bold text-slate-500">
                {"ກຽມພ້ອມຮັບອໍເດີຢ່າງດີ."}
              </p>
              <div className="mt-3 grid grid-cols-2 divide-x divide-blue-50">
                <SmallMeta icon={CalendarDays} label="ວັນທີ" value="May 20, 2024" />
                <SmallMeta icon={Clock} label="ເວລາ" value="9:41 AM" />
              </div>
            </div>
          </div>
        </section>

        <div className="mt-3 space-y-2.5">
          <LoginRow icon={Store} label="ສາຂາ" value={selectedBranch} hasChevron />
          <LoginRow icon={UserRound} label="ບົດບາດ" value={staffRole} hasChevron />
          <LoginRow icon={IdCard} label="ລະຫັດພະນັກງານ" value={staffId} />
          <LoginRow icon={Lock} label="PIN" value="••••" trailingIcon={BadgeCheck} />
        </div>

        <section className="mt-3 rounded-lg border border-blue-100 bg-blue-50/35 p-3">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
              <Sun className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-slate-500">{"ກະວຽກມື້ນີ້"}</p>
              <h3 className="text-[16px] font-black text-slate-950">{"ກະເຊົ້າ"}</h3>
              <p className="mt-1.5 flex items-center gap-2 text-[12px] font-bold text-slate-500">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-600">
                  {"ເປີດ"}
                </span>
                {"ຊັ້ນຫຼັກ"}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-3 rounded-lg border border-blue-100 bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[15px] font-black text-slate-950">
              {"ປ່ຽນສາຂາດ່ວນ"}
            </h3>
            <button
              type="button"
              onClick={() => showNotice("ການຈັດການສາຂາຈະເປີດໃນ Admin.")}
              className="cursor-pointer text-[12px] font-black text-blue-600"
            >
              {"ຈັດການສາຂາ"}
            </button>
          </div>
          <div className="overflow-hidden rounded-lg border border-blue-50">
            {branchOptions.map((branch) => (
              <button
                key={branch.name}
                type="button"
                onClick={() => setSelectedBranch(branch.name)}
                className="grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-blue-50 px-3 py-2.5 text-left last:border-b-0 hover:bg-blue-50/60"
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

        <section className="mt-3 grid grid-cols-2 divide-x divide-blue-50 rounded-lg border border-blue-100 bg-white px-3 py-3">
          <SmallMeta icon={Smartphone} label="ອຸປະກອນ" value={staffDevice} />
          <SmallMeta icon={ScanLine} label="ການເຊື່ອມຕໍ່" value="ອອນລາຍ" />
        </section>

        <Link
          to={getStaffOrderPath(businessSlug, "/tables")}
          className="mt-3 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 text-[13px] font-black text-white shadow-[0_14px_24px_rgba(37,99,235,0.22)] transition hover:bg-blue-700"
        >
          {"ເຂົ້າລະບົບ ແລະ ເລີ່ມຮັບອໍເດີ"}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={() => showNotice("ພ້ອມສະແກນ QR ພະນັກງານ.")}
          className="mt-2 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white text-[13px] font-black text-blue-600 hover:bg-blue-50"
        >
          <QrCode className="h-4 w-4" />
          {"ສະແກນ QR ພະນັກງານ"}
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
      className="grid h-[52px] w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-blue-100 bg-white px-3 text-left"
    >
      <Icon className="h-[18px] w-[18px] text-slate-500" />
      <span>
        <span className="block text-[11px] font-bold text-slate-500">{label}</span>
        <span className="text-[13px] font-black text-slate-950">{value}</span>
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
