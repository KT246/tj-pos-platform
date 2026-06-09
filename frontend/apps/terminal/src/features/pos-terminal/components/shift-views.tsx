import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  CheckCircle2,
  PlugZap,
  RotateCcw,
  ShieldCheck
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { getTerminalBusiness } from "../data/mock-pos-data";
import { getPosScreenConfig } from "../screens/pos-screen-config";
import type { PosType } from "../types";
import { formatMoney, getBusinessPath } from "../utils";
import { getTerminalCopy } from "../utils/terminal-copy";

export function OpenShiftView({
  businessSlug,
  screenPosType
}: {
  businessSlug: string;
  screenPosType?: PosType;
}) {
  const navigate = useNavigate();
  const business = getTerminalBusiness(businessSlug);
  const copy = getTerminalCopy(business.posType);
  const screenConfig = getPosScreenConfig(screenPosType ?? business.posType);
  const theme = screenConfig.theme;
  const ShiftIcon = screenConfig.shiftIcon;

  return (
    <section className="grid h-full min-h-0 gap-3 overflow-hidden lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className={`flex min-h-0 items-center justify-center rounded-lg border bg-white p-4 ${theme.border} ${theme.shadow}`}>
        <div className="w-full max-w-xl">
          <span className={`flex h-16 w-16 items-center justify-center rounded-2xl ${theme.iconBox}`}>
            <ShiftIcon className="h-8 w-8" />
          </span>
          <h1 className="mt-5 text-3xl font-black tracking-normal text-slate-950">
            {screenConfig.shift.openTitle}
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-500">
            {screenConfig.shift.openDescription}
          </p>

          <div className={`mt-5 rounded-lg border p-3 ${theme.border} ${theme.softerBg}`}>
            <p className={`text-[12px] font-black ${theme.activeText}`}>
              {screenConfig.shift.focusLabel}
            </p>
            <p className="mt-1 text-sm font-black text-slate-950">
              {screenConfig.shift.focusValue}
            </p>
          </div>

          <label className={`mt-5 block rounded-lg border p-4 ${theme.border} ${theme.softerBg}`}>
            <span className="text-[12px] font-black text-slate-500">
              {"ເງິນຕົ້ນກະ"}
            </span>
            <input
              type="number"
              defaultValue={500000}
              min={0}
              className="mt-2 h-12 w-full bg-transparent text-3xl font-black text-slate-950 outline-none"
            />
          </label>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {screenConfig.shift.startStats.map((stat, index) => (
              <ShiftStat
                key={`${stat.label}-${stat.value}`}
                icon={[Banknote, ShieldCheck, PlugZap][index] ?? Banknote}
                label={stat.label}
                value={stat.value}
                theme={theme}
              />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-[140px_1fr] gap-3">
            <Link
              to={getBusinessPath(businessSlug, "")}
              className={`flex h-12 items-center justify-center gap-2 rounded-lg border bg-white text-sm font-black text-slate-600 transition ${theme.border} ${theme.rowHover}`}
            >
              <ArrowLeft className="h-4 w-4" />
              {"ກັບຄືນ"}
            </Link>
            <button
              type="button"
              onClick={() => navigate(getBusinessPath(businessSlug, ""))}
              className={`h-12 rounded-lg text-sm font-black text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition ${theme.activeBg} ${theme.activeHoverBg}`}
            >
              {copy.startShiftActionLabel}
            </button>
          </div>
        </div>
      </div>

      <ShiftInfoPanel businessSlug={businessSlug} screenPosType={screenPosType} />
    </section>
  );
}

export function CloseShiftView({
  businessSlug,
  screenPosType
}: {
  businessSlug: string;
  screenPosType?: PosType;
}) {
  const business = getTerminalBusiness(businessSlug);
  const copy = getTerminalCopy(business.posType);
  const screenConfig = getPosScreenConfig(screenPosType ?? business.posType);
  const theme = screenConfig.theme;
  const ShiftIcon = screenConfig.shiftIcon;

  return (
    <section className="grid h-full min-h-0 gap-3 overflow-hidden lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className={`min-h-0 overflow-y-auto rounded-lg border bg-white p-4 ${theme.border} ${theme.shadow}`}>
        <div className="flex items-center gap-3">
          <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${theme.iconBox}`}>
            <ShiftIcon className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-950">
              {screenConfig.shift.closeTitle}
            </h1>
            <p className="text-[12px] font-bold text-slate-500">
              {screenConfig.shift.closeDescription}
            </p>
          </div>
        </div>

        <div className={`mt-5 rounded-lg border p-3 ${theme.border} ${theme.softerBg}`}>
          <p className={`text-[12px] font-black ${theme.activeText}`}>
            {screenConfig.shift.focusLabel}
          </p>
          <p className="mt-1 text-sm font-black text-slate-950">
            {screenConfig.shift.focusValue}
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label={copy.shiftTotalLabel} value={formatMoney(1850000)} theme={theme} />
          <SummaryCard label="ເງິນສົດ" value={formatMoney(760000)} theme={theme} />
          <SummaryCard label="ໂອນທະນາຄານ" value={formatMoney(640000)} theme={theme} />
          <SummaryCard label="QR Code" value={formatMoney(450000)} theme={theme} />
        </div>

        <div className={`mt-5 overflow-hidden rounded-lg border ${theme.border}`}>
          {[
            ["ເງິນຕົ້ນກະ", formatMoney(500000)],
            ["ເງິນສົດທີ່ຄວນມີ", formatMoney(1260000)],
            ["ເງິນສົດທີ່ນັບໄດ້", formatMoney(1260000)],
            ["ສ່ວນຕ່າງ", formatMoney(0)]
          ].map(([label, value]) => (
            <div
              key={label}
              className={`flex items-center justify-between border-b px-4 py-3 last:border-b-0 ${theme.border}`}
            >
              <span className="text-[12px] font-bold text-slate-500">{label}</span>
              <span className="text-sm font-black text-slate-950">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <p className="text-sm font-black text-emerald-700">
              {"ຍອດໃນລິ້ນຊັກກົງກັບຍອດທີ່ຄວນມີ."}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-[140px_1fr] gap-3">
          <Link
            to={getBusinessPath(businessSlug, "")}
            className={`flex h-12 items-center justify-center rounded-lg border text-sm font-black text-slate-600 ${theme.border} ${theme.rowHover}`}
          >
            {"ຍົກເລີກ"}
          </Link>
          <button
            type="button"
            className="h-12 rounded-lg bg-emerald-600 text-sm font-black text-white shadow-[0_12px_24px_rgba(16,185,129,0.2)] hover:bg-emerald-700"
          >
            {"ຢືນຢັນປິດກະ"}
          </button>
        </div>
      </div>

      <ShiftInfoPanel businessSlug={businessSlug} screenPosType={screenPosType} />
    </section>
  );
}

export function OfflineStateView({
  businessSlug,
  screenPosType
}: {
  businessSlug: string;
  screenPosType?: PosType;
}) {
  const business = getTerminalBusiness(businessSlug);
  const copy = getTerminalCopy(business.posType);
  const screenConfig = getPosScreenConfig(screenPosType ?? business.posType);
  const theme = screenConfig.theme;
  const OfflineIcon = screenConfig.offlineIcon;

  return (
    <section className="grid h-full min-h-0 gap-3 overflow-hidden lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className={`flex min-h-0 items-center justify-center rounded-lg border bg-white p-4 ${theme.border} ${theme.shadow}`}>
        <div className="w-full max-w-2xl text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-600">
            <OfflineIcon className="h-10 w-10" />
          </span>
          <h1 className="mt-5 text-3xl font-black text-slate-950">
            {screenConfig.offline.title}
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm font-bold text-slate-500">
            {screenConfig.offline.description}
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <OfflineStat label={copy.queuedRecordsLabel} value="4" theme={theme} />
            <OfflineStat label="sync ຫຼ້າສຸດ" value="10:28 AM" theme={theme} />
            <OfflineStat label="ການເຊື່ອມຕໍ່" value="ອອບລາຍ" warning />
          </div>
          <p className={`mx-auto mt-4 max-w-xl rounded-lg border px-4 py-3 text-[12px] font-black ${theme.border} ${theme.softerBg} ${theme.activeText}`}>
            {screenConfig.offline.syncNote}
          </p>

          <div className="mt-6 grid grid-cols-[140px_1fr] gap-3">
            <Link
              to={getBusinessPath(businessSlug, "")}
              className={`flex h-12 items-center justify-center gap-2 rounded-lg border bg-white text-sm font-black text-slate-600 ${theme.border} ${theme.rowHover}`}
            >
              <ArrowLeft className="h-4 w-4" />
              {"ກັບຄືນ"}
            </Link>
            <button
              type="button"
              className={`flex h-12 items-center justify-center gap-2 rounded-lg text-sm font-black text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] ${theme.activeBg} ${theme.activeHoverBg}`}
            >
              <RotateCcw className="h-4 w-4" />
              {"ລອງເຊື່ອມຕໍ່ໃໝ່"}
            </button>
          </div>
        </div>
      </div>

      <div className={`min-h-0 overflow-y-auto rounded-lg border bg-white p-4 ${theme.border} ${theme.shadow}`}>
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <h2 className="text-[16px] font-black text-slate-950">
            {screenConfig.offline.queueTitle}
          </h2>
        </div>
        <div className="mt-4 space-y-2">
          {copy.offlineQueueIds.map((recordId) => (
            <div
              key={recordId}
              className="flex items-center justify-between rounded-lg border border-orange-100 bg-orange-50/40 px-3 py-2"
            >
              <span className="text-sm font-black text-slate-950">{recordId}</span>
              <span className="text-[11px] font-black text-orange-600">
                {"ລໍຖ້າ sync"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShiftInfoPanel({
  businessSlug,
  screenPosType
}: {
  businessSlug: string;
  screenPosType?: PosType;
}) {
  const business = getTerminalBusiness(businessSlug);
  const screenConfig = getPosScreenConfig(screenPosType ?? business.posType);
  const theme = screenConfig.theme;

  return (
    <aside className={`min-h-0 overflow-y-auto rounded-lg border bg-white p-4 ${theme.border} ${theme.shadow}`}>
      <h2 className="text-[16px] font-black text-slate-950">{"ຂໍ້ມູນກະ"}</h2>
      <div className="mt-4 space-y-3 text-[12px] font-bold">
        <InfoRow label="ສາຂາ" value={business.branchName} />
        <InfoRow label="ແຄັດເຊຍ" value={business.cashierName} />
        <InfoRow label="ກະ" value={business.shiftName} />
        <InfoRow label="ເລີ່ມເວລາ" value="09:00 AM" />
        <InfoRow label="ການເຊື່ອມຕໍ່" value="ອອນລາຍ" />
      </div>
    </aside>
  );
}

function ShiftStat({
  icon: Icon,
  label,
  value,
  theme
}: {
  icon: typeof Banknote;
  label: string;
  value: string;
  theme: ReturnType<typeof getPosScreenConfig>["theme"];
}) {
  return (
    <div className={`rounded-lg border bg-white p-3 ${theme.border}`}>
      <Icon className={`h-4 w-4 ${theme.activeText}`} />
      <p className="mt-2 text-[11px] font-bold text-slate-500">{label}</p>
      <p className="text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  theme
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof getPosScreenConfig>["theme"];
}) {
  return (
    <div className={`rounded-lg border p-3 ${theme.border} ${theme.softerBg}`}>
      <p className="text-[11px] font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}

function OfflineStat({
  label,
  value,
  warning = false,
  theme
}: {
  label: string;
  value: string;
  warning?: boolean;
  theme?: ReturnType<typeof getPosScreenConfig>["theme"];
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        warning
          ? "border-orange-100 bg-orange-50"
          : `${theme?.border ?? "border-blue-100"} ${theme?.softerBg ?? "bg-blue-50/40"}`
      }`}
    >
      <p className="text-[11px] font-bold text-slate-500">{label}</p>
      <p
        className={`mt-1 text-xl font-black ${
          warning ? "text-orange-600" : "text-slate-950"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-blue-50 pb-2 last:border-b-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-black text-slate-950">{value}</span>
    </div>
  );
}
