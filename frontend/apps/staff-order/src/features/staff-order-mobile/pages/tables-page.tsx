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
      bottomNav={
        <StaffBottomNav
          businessSlug={businessSlug}
          active="tables"
          selectedTableId={selectedTableId}
        />
      }
    >
      <StaffOrderHeader title="Select Table" />
      <StaffScrollArea>
        <StaffContextCard branch={selectedBranch} staff={staffName} shift="Morning" />

        <div className="mt-4 flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          {areaFilters.map((area, index) => (
            <button
              key={area}
              type="button"
              className={`h-11 shrink-0 rounded-full px-5 text-[14px] font-black transition ${
                index === 0
                  ? "bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.18)]"
                  : "border border-blue-100 bg-white text-slate-500 hover:bg-blue-50"
              }`}
            >
              {lo(area)}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {staffTables.slice(0, 6).map((table) => (
            <TableCard
              key={table.id}
              table={table}
              guests={guests}
              selected={selectedTableId === table.id}
              onClick={() => setSelectedTable(table.id)}
            />
          ))}
        </div>

        <div className="mt-4 grid h-16 grid-cols-[1fr_auto] items-center rounded-lg border border-blue-100 bg-white px-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
          <p className="text-[15px] font-black text-slate-950">{lo("Number of Guests")}</p>
          <div className="flex items-center gap-4">
            <StepperButton
              label="Decrease guests"
              onClick={decrementGuests}
              icon={Minus}
            />
            <span className="min-w-5 text-center text-xl font-black text-slate-950">
              {guests}
            </span>
            <StepperButton
              label="Increase guests"
              onClick={incrementGuests}
              icon={Plus}
              active
            />
          </div>
        </div>

        <Link
          to={getStaffOrderPath(businessSlug, `/table/${selectedTableId}`)}
          className="mt-4 flex h-14 items-center justify-center gap-3 rounded-lg bg-blue-600 text-[16px] font-black text-white shadow-[0_16px_28px_rgba(37,99,235,0.26)] transition hover:bg-blue-700"
        >
          {lo("Continue with")} {selectedTableId}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </StaffScrollArea>
    </StaffMobileShell>
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
      className={`relative min-h-[172px] rounded-lg border bg-white p-3 text-left shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-blue-200 ${
        selected
          ? "border-blue-600 bg-blue-50/45 ring-2 ring-blue-100"
          : "border-blue-100"
      }`}
    >
      {selected ? (
        <span className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_8px_18px_rgba(37,99,235,0.24)]">
          <Check className="h-5 w-5" />
        </span>
      ) : null}
      <img
        src={`https://images.unsplash.com/photo-${
          table.id === "T03"
            ? "1519710164239-da123dc03ef4"
            : "1533090481720-856c6e3c1fdc"
        }?auto=format&fit=crop&w=260&q=80`}
        alt=""
        className="h-20 w-full rounded-lg object-cover"
      />
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-[27px] leading-7 font-black text-slate-950">{table.id}</p>
          <p className="mt-1 flex items-center gap-1 text-[12px] font-bold text-slate-500">
            <Users className="h-4 w-4" />
            {table.seats} {lo("Seats")}
          </p>
        </div>
        <StatusPill status={table.status} />
      </div>
      {table.elapsed ? (
        <p className="mt-2 text-right text-[12px] font-bold text-blue-600">
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
      className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${
        active
          ? "border-blue-100 text-blue-600 hover:bg-blue-50"
          : "border-blue-100 text-slate-600 hover:bg-blue-50"
      }`}
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
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
    <span className={`rounded-lg px-2 py-1 text-[11px] font-black ${className}`}>
      {lo(status)}
    </span>
  );
}
