import { ArrowRight, Check, Minus, Plus, Users } from "lucide-react";
import { Link } from "react-router-dom";

import { StaffBottomNav } from "../components/staff-bottom-nav";
import { StaffContextCard, StaffOrderHeader } from "../components/staff-order-header";
import { StaffMobileShell, StaffScrollArea } from "../components/staff-mobile-shell";
import { staffName, staffTables } from "../data/staff-order-data";
import { useStaffOrderStore } from "../stores/staff-order-store";
import type { DiningTable } from "../types";
import { getStaffOrderPath } from "../utils";
import { lo } from "../utils/lao-labels";

const areaFilters = ["All Areas", "Indoor", "Outdoor", "VIP Room", "Terrace"];

export function StaffTablesPage({ businessSlug }: { businessSlug: string }) {
  const selectedBranch = useStaffOrderStore((state) => state.selectedBranch);
  const selectedTableId = useStaffOrderStore((state) => state.selectedTableId);
  const guests = useStaffOrderStore((state) => state.guests);
  const setSelectedTable = useStaffOrderStore((state) => state.setSelectedTable);
  const incrementGuests = useStaffOrderStore((state) => state.incrementGuests);
  const decrementGuests = useStaffOrderStore((state) => state.decrementGuests);

  return (
    <StaffMobileShell
      fixedAction={
        <TableActionPanel
          businessSlug={businessSlug}
          selectedTableId={selectedTableId}
          guests={guests}
          incrementGuests={incrementGuests}
          decrementGuests={decrementGuests}
        />
      }
      bottomNav={
        <StaffBottomNav
          businessSlug={businessSlug}
          active="tables"
          selectedTableId={selectedTableId}
        />
      }
    >
      <StaffOrderHeader title="Select Table" />
      <StaffScrollArea className="pb-3">
        <StaffContextCard branch={selectedBranch} staff={staffName} shift="Morning" />

        <div className="mt-2.5 flex [scrollbar-width:none] gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          {areaFilters.map((area, index) => (
            <button
              key={area}
              type="button"
              className={`h-8 shrink-0 cursor-pointer rounded-full border px-3 text-[12px] font-black transition ${
                index === 0
                  ? "border-blue-600 bg-white text-blue-600"
                  : "border-blue-100 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {lo(area)}
            </button>
          ))}
        </div>

        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          {staffTables.slice(0, 9).map((table) => (
            <TableCard
              key={table.id}
              table={table}
              guests={guests}
              selected={selectedTableId === table.id}
              onClick={() => setSelectedTable(table.id)}
            />
          ))}
        </div>

      </StaffScrollArea>
    </StaffMobileShell>
  );
}

function TableActionPanel({
  businessSlug,
  selectedTableId,
  guests,
  incrementGuests,
  decrementGuests
}: {
  businessSlug: string;
  selectedTableId: string;
  guests: number;
  incrementGuests: () => void;
  decrementGuests: () => void;
}) {
  return (
    <div className="mx-3 my-2 grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-xl border border-blue-100 bg-white px-2.5 py-2 shadow-[0_12px_28px_rgba(15,23,42,0.09)]">
      <div className="min-w-0">
        <p className="truncate text-[10px] font-bold text-slate-500">
          {lo("Number of Guests")}
        </p>
        <p className="truncate text-[13px] font-black text-slate-950">
          {guests} {lo("Guests")}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <StepperButton
          label="Decrease guests"
          onClick={decrementGuests}
          icon={Minus}
        />
        <span className="min-w-4 text-center text-[16px] font-black text-slate-950">
          {guests}
        </span>
        <StepperButton
          label="Increase guests"
          onClick={incrementGuests}
          icon={Plus}
          active
        />
      </div>
      <Link
        to={getStaffOrderPath(businessSlug, `/table/${selectedTableId}`)}
        className="flex h-9 cursor-pointer items-center justify-center gap-1 rounded-lg bg-blue-600 px-2.5 text-[12px] font-black whitespace-nowrap text-white shadow-[0_10px_18px_rgba(37,99,235,0.2)] transition hover:bg-blue-700"
      >
        <span className="hidden min-[410px]:inline">{lo("Continue with")}</span>
        {selectedTableId}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function TableCard({
  table,
  selected,
  guests,
  onClick
}: {
  table: DiningTable;
  selected: boolean;
  guests: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative min-h-[116px] cursor-pointer rounded-lg border bg-white p-1.5 text-left shadow-[0_7px_14px_rgba(15,23,42,0.035)] transition hover:-translate-y-0.5 hover:border-blue-200 ${
        selected
          ? "border-blue-600 text-blue-600 ring-1 ring-blue-100"
          : "border-blue-100"
      }`}
    >
      {selected ? (
        <span className="absolute top-1.5 right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-600 shadow-sm">
          <Check className="h-3 w-3" />
        </span>
      ) : null}
      <img
        src={`https://images.unsplash.com/photo-${
          table.id === "T03"
            ? "1519710164239-da123dc03ef4"
            : "1533090481720-856c6e3c1fdc"
        }?auto=format&fit=crop&w=260&q=80`}
        alt=""
        className="h-12 w-full rounded-md object-cover"
      />
      <div className="mt-1.5 min-w-0">
        <div className="flex min-w-0 items-start justify-between gap-1">
          <p className="truncate text-[20px] leading-6 font-black text-slate-950">{table.id}</p>
          <StatusPill status={table.status} />
        </div>
        <p className="mt-0.5 flex min-w-0 items-center gap-1 text-[10px] font-bold text-slate-500">
          <Users className="h-3 w-3 shrink-0" />
          {table.seats} {lo("Seats")}
        </p>
      </div>
      {table.elapsed ? (
        <p className="mt-0.5 truncate text-right text-[10px] font-bold text-blue-600">
          {table.id === "T03" ? `${guests} ${lo("Guests")}` : `2 ${lo("Guests")}`} - {table.elapsed}
        </p>
      ) : null}
    </button>
  );
}

function StepperButton({
  label,
  onClick,
  icon: Icon,
  active = false
}: {
  label: string;
  onClick: () => void;
  icon: typeof Plus;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition ${
        active
          ? "border-blue-100 text-blue-600 hover:bg-blue-50"
          : "border-blue-100 text-slate-600 hover:bg-blue-50"
      }`}
      aria-label={label}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function StatusPill({ status }: { status: string }) {
  const className =
    status === "Available"
      ? "bg-emerald-50 text-emerald-600"
      : status === "Reserved"
        ? "bg-amber-50 text-amber-600"
        : "bg-blue-50 text-blue-600";

  return (
    <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-black ${className}`}>
      {lo(status)}
    </span>
  );
}
