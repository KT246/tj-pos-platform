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
import { useState } from "react";
import { Link } from "react-router-dom";

import { StaffBottomNav } from "../components/staff-bottom-nav";
import { StaffOrderHeader } from "../components/staff-order-header";
import { StaffMobileShell, StaffScrollArea } from "../components/staff-mobile-shell";
import { useStaffOrderStore } from "../stores/staff-order-store";
import type { StaffOrderRecord } from "../types";
import { formatMoney, getStaffOrderPath, statusColor } from "../utils";
import { lo } from "../utils/lao-labels";

type OrdersTab = "tables" | "orders" | "ready";

const orderTabs: { id: OrdersTab; label: string }[] = [
  { id: "tables", label: "Tables" },
  { id: "orders", label: "Orders" },
  { id: "ready", label: "Ready" }
];

export function StaffOrdersPage({ businessSlug }: { businessSlug: string }) {
  const [activeTab, setActiveTab] = useState<OrdersTab>("tables");
  const selectedTableId = useStaffOrderStore((state) => state.selectedTableId);
  const activeOrders = useStaffOrderStore((state) => state.activeOrders);
  const markServed = useStaffOrderStore((state) => state.markServed);
  const setSelectedTable = useStaffOrderStore((state) => state.setSelectedTable);
  const showNotice = useStaffOrderStore((state) => state.showNotice);
  const readyCount = activeOrders.filter(
    (order) => order.status === "Ready to Serve"
  ).length;
  const openBills = activeOrders.filter(
    (order) => order.status === "Waiting Bill"
  ).length;
  const displayedOrders = activeOrders.filter((order) => {
    if (activeTab === "ready") {
      return order.status === "Ready to Serve";
    }

    if (activeTab === "orders") {
      return order.status === "Preparing" || order.status === "Sent";
    }

    return true;
  });

  function handleSelectOrderTable(tableId: string) {
    setSelectedTable(tableId);
  }

  function handleGenerateBill(order: StaffOrderRecord) {
    setSelectedTable(order.tableId);
    showNotice(`${order.id} ກຳລັງເປີດການອອກບິນສຳລັບໂຕະ ${order.tableId}.`);
  }

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
      <StaffScrollArea className="pb-3">
        <section className="mt-3 grid grid-cols-3 divide-x divide-blue-50 rounded-lg border border-blue-100 bg-white p-2 shadow-[0_8px_18px_rgba(15,23,42,0.035)]">
          <StatBlock label="Active" value={String(activeOrders.length)} />
          <StatBlock label="Ready" value={String(readyCount)} tone="green" />
          <StatBlock label="Open Bills" value={String(openBills)} tone="orange" />
        </section>

        <div className="mt-2.5 grid grid-cols-3 rounded-lg border border-blue-100 bg-white p-1 shadow-[0_7px_16px_rgba(15,23,42,0.03)]">
          {orderTabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`h-9 cursor-pointer rounded-lg text-[12px] font-black ${
                activeTab === item.id ? "bg-blue-600 text-white" : "text-slate-500"
              }`}
            >
              {lo(item.label)}
            </button>
          ))}
        </div>

        <label className="relative mt-2.5 block">
          <Search className="absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
          <input
            className="h-10 w-full rounded-lg border border-blue-100 bg-white pr-10 pl-10 text-[12px] font-bold shadow-[0_7px_16px_rgba(15,23,42,0.03)] transition outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
            placeholder={lo("Search table or order")}
          />
          <Filter className="absolute top-1/2 right-3 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />
        </label>

        <div className="mt-2.5 space-y-2.5">
          {displayedOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              businessSlug={businessSlug}
              onSelectTable={() => handleSelectOrderTable(order.tableId)}
              onGenerateBill={() => handleGenerateBill(order)}
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
    <div className="grid min-w-0 grid-cols-[32px_minmax(0,1fr)] items-center gap-1.5 px-1.5">
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneClass}`}
      >
        <ClipboardCheck className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[10px] font-bold text-slate-500">{lo(label)}</span>
        <span className="text-[16px] leading-5 font-black text-slate-950">{value}</span>
      </span>
    </div>
  );
}

function OrderCard({
  order,
  businessSlug,
  onSelectTable,
  onGenerateBill,
  onMarkServed
}: {
  order: StaffOrderRecord;
  businessSlug: string;
  onSelectTable: () => void;
  onGenerateBill: () => void;
  onMarkServed: () => void;
}) {
  const actionLabel =
    order.status === "Ready to Serve"
      ? "Mark Served"
      : order.status === "Waiting Bill"
        ? "Generate Bill"
        : "Add Item";

  return (
    <article className="rounded-lg border border-blue-100 bg-white p-2.5 shadow-[0_9px_22px_rgba(15,23,42,0.045)] transition hover:-translate-y-0.5 hover:border-blue-200">
      <div className="grid grid-cols-[44px_1fr_auto] gap-2.5">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Table2 className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <h3 className="text-[21px] leading-6 font-black text-slate-950">
              {order.tableId}
            </h3>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-black text-blue-600">
              {lo(order.type)}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-3 text-[10px] font-bold text-slate-500">
            <span className="flex items-center gap-1">
              <ClipboardCheck className="h-3.5 w-3.5" />
              {order.items} {lo("items")}
            </span>
            <span className="flex items-center gap-1">
              <Timer className="h-3.5 w-3.5" />
              {order.elapsed}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`rounded-full px-2 py-0.5 text-[9px] font-black ${statusColor(order.status)}`}
          >
            {lo(order.status)}
          </span>
          <p className="mt-3 text-[13px] font-black text-slate-950">
            {formatMoney(order.total)}
          </p>
        </div>
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-2 border-t border-blue-50 pt-2.5">
        <Link
          to={getStaffOrderPath(businessSlug, `/table/${order.tableId}`)}
          onClick={onSelectTable}
          className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-blue-100 text-[12px] font-black text-blue-600 hover:bg-blue-50"
        >
          <ClipboardCheck className="h-3.5 w-3.5" />
          {lo("Open")}
        </Link>
        {order.status === "Ready to Serve" ? (
          <button
            type="button"
            onClick={onMarkServed}
            className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-[12px] font-black text-emerald-600"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {lo(actionLabel)}
          </button>
        ) : order.status === "Waiting Bill" ? (
          <button
            type="button"
            onClick={onGenerateBill}
            className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 text-[12px] font-black text-violet-600"
          >
            <WalletCards className="h-3.5 w-3.5" />
            {lo(actionLabel)}
          </button>
        ) : (
          <Link
            to={getStaffOrderPath(businessSlug, `/table/${order.tableId}`)}
            onClick={onSelectTable}
            className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-blue-100 text-[12px] font-black text-blue-600 hover:bg-blue-50"
          >
            <Plus className="h-3.5 w-3.5" />
            {lo(actionLabel)}
          </Link>
        )}
      </div>
    </article>
  );
}
