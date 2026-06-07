import {
  CheckCircle2,
  ClipboardCheck,
  Filter,
  Plus,
  Search,
  Table2,
  Timer,
  WalletCards
} from "lucide-react";
import { Link } from "react-router-dom";

import { StaffBottomNav } from "../components/staff-bottom-nav";
import { StaffOrderHeader } from "../components/staff-order-header";
import { StaffMobileShell, StaffScrollArea } from "../components/staff-mobile-shell";
import { useStaffOrderStore } from "../stores/staff-order-store";
import type { StaffOrderRecord } from "../types";
import { formatMoney, getStaffOrderPath, statusColor } from "../utils";

export function StaffOrdersPage({ businessSlug }: { businessSlug: string }) {
  const selectedTableId = useStaffOrderStore((state) => state.selectedTableId);
  const activeOrders = useStaffOrderStore((state) => state.activeOrders);
  const markServed = useStaffOrderStore((state) => state.markServed);
  const readyCount = activeOrders.filter(
    (order) => order.status === "Ready to Serve"
  ).length;
  const openBills = activeOrders.filter(
    (order) => order.status === "Waiting Bill"
  ).length;

  return (
    <StaffMobileShell
      bottomNav={
        <StaffBottomNav
          businessSlug={businessSlug}
          active="orders"
          selectedTableId={selectedTableId}
        />
      }
    >
      <StaffOrderHeader title="Active Orders" showFilter />
      <StaffScrollArea>
        <section className="mt-4 grid grid-cols-3 divide-x divide-blue-50 rounded-lg border border-blue-100 bg-white p-3 shadow-[0_10px_26px_rgba(15,23,42,0.045)]">
          <StatBlock label="Active" value={String(activeOrders.length)} />
          <StatBlock label="Ready" value={String(readyCount)} tone="green" />
          <StatBlock label="Open Bills" value={String(openBills)} tone="orange" />
        </section>

        <div className="mt-4 grid grid-cols-3 rounded-lg border border-blue-100 bg-white p-1 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
          {["Tables", "Orders", "Ready"].map((item, index) => (
            <button
              key={item}
              type="button"
              className={`h-11 rounded-lg text-[14px] font-black ${
                index === 0 ? "bg-blue-600 text-white" : "text-slate-500"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="relative mt-4 block">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            className="h-12 w-full rounded-lg border border-blue-100 bg-white pr-12 pl-12 text-[14px] font-bold shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
            placeholder="Search table or order"
          />
          <Filter className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-500" />
        </label>

        <div className="mt-4 space-y-3">
          {activeOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              businessSlug={businessSlug}
              onMarkServed={() => markServed(order.id)}
            />
          ))}
        </div>
      </StaffScrollArea>
    </StaffMobileShell>
  );
}

function StatBlock({
  label,
  value,
  tone = "blue"
}: {
  label: string;
  value: string;
  tone?: "blue" | "green" | "orange";
}) {
  const toneClass =
    tone === "green"
      ? "bg-emerald-50 text-emerald-600"
      : tone === "orange"
        ? "bg-orange-50 text-orange-600"
        : "bg-blue-50 text-blue-600";

  return (
    <div className="flex items-center gap-3 px-2">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-lg ${toneClass}`}
      >
        <ClipboardCheck className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-[13px] font-bold text-slate-500">{label}</span>
        <span className="text-[18px] font-black text-slate-950">{value}</span>
      </span>
    </div>
  );
}

function OrderCard({
  order,
  businessSlug,
  onMarkServed
}: {
  order: StaffOrderRecord;
  businessSlug: string;
  onMarkServed: () => void;
}) {
  const actionLabel =
    order.status === "Ready to Serve"
      ? "Mark Served"
      : order.status === "Waiting Bill"
        ? "Generate Bill"
        : "Add Item";

  return (
    <article className="rounded-lg border border-blue-100 bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.055)] transition hover:-translate-y-0.5 hover:border-blue-200">
      <div className="grid grid-cols-[58px_1fr_auto] gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Table2 className="h-7 w-7" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[26px] leading-7 font-black text-slate-950">
              {order.tableId}
            </h3>
            <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-black text-blue-600">
              {order.type}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-4 text-[12px] font-bold text-slate-500">
            <span className="flex items-center gap-1">
              <ClipboardCheck className="h-4 w-4" />
              {order.items} items
            </span>
            <span className="flex items-center gap-1">
              <Timer className="h-4 w-4" />
              {order.elapsed}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-black ${statusColor(order.status)}`}
          >
            {order.status}
          </span>
          <p className="mt-5 text-[16px] font-black text-slate-950">
            {formatMoney(order.total)}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-blue-50 pt-3">
        <Link
          to={getStaffOrderPath(businessSlug, `/table/${order.tableId}`)}
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-blue-100 text-[14px] font-black text-blue-600 hover:bg-blue-50"
        >
          <ClipboardCheck className="h-4 w-4" />
          Open
        </Link>
        <button
          type="button"
          onClick={order.status === "Ready to Serve" ? onMarkServed : undefined}
          className={`flex h-11 items-center justify-center gap-2 rounded-lg border text-[14px] font-black ${
            order.status === "Ready to Serve"
              ? "border-emerald-200 bg-emerald-50 text-emerald-600"
              : order.status === "Waiting Bill"
                ? "border-violet-200 bg-violet-50 text-violet-600"
                : "border-blue-100 text-blue-600 hover:bg-blue-50"
          }`}
        >
          {order.status === "Ready to Serve" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : order.status === "Waiting Bill" ? (
            <WalletCards className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {actionLabel}
        </button>
      </div>
    </article>
  );
}
