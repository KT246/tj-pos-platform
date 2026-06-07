import { ArrowLeft, Grid2X2, List, RefreshCw, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { usePosTerminalStore } from "../stores/pos-terminal-store";
import type { OpenOrder } from "../types";
import { formatMoney, getBusinessPath } from "../utils";
import { lo } from "../utils/lao-labels";

export function OrdersView({
  businessSlug,
  mode
}: {
  businessSlug: string;
  mode: "open-orders" | "held-orders";
}) {
  const navigate = useNavigate();
  const orders = usePosTerminalStore((state) => state.orders);
  const orderSearch = usePosTerminalStore((state) => state.orderSearch);
  const setOrderSearch = usePosTerminalStore((state) => state.setOrderSearch);
  const resumeOrder = usePosTerminalStore((state) => state.resumeOrder);
  const startNewSale = usePosTerminalStore((state) => state.startNewSale);
  const showNotice = usePosTerminalStore((state) => state.showNotice);
  const openCount = orders.filter((order) => order.status === "In Progress").length;
  const heldCount = orders.filter((order) => order.status === "Held").length;
  const completedCount = orders.filter((order) => order.status === "Completed").length;
  const normalizedSearch = orderSearch.trim().toLowerCase();
  const rows = orders
    .filter((order) =>
      mode === "held-orders"
        ? order.status === "Held"
        : order.status === "In Progress"
    )
    .filter((order) => {
      if (!normalizedSearch) return true;

      return [order.id, order.table, order.type, order.customer]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });

  function handleOpenOrder(orderId: string) {
    resumeOrder(orderId);
    navigate(getBusinessPath(businessSlug, ""));
  }

  function handleNewOrder() {
    startNewSale();
    navigate(getBusinessPath(businessSlug, "/new-sale"));
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-blue-100 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.055)]">
      <div className="shrink-0 border-b border-blue-50 p-4">
        <div className="mb-4 grid gap-3 md:grid-cols-[auto_1fr_auto]">
          <Link
            to={getBusinessPath(businessSlug, "")}
            className="flex h-10 items-center justify-center gap-2 rounded-md border border-blue-100 bg-white px-4 text-[12px] font-black text-slate-700 transition hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4" />
            {lo("Back to POS")}
          </Link>
          <div className="flex rounded-lg border border-blue-100 bg-white p-1">
            <OrderTab
              active={mode === "open-orders"}
              href={getBusinessPath(businessSlug, "/open-orders")}
              label={`${lo("Open Orders")} (${openCount})`}
            />
            <OrderTab
              active={mode === "held-orders"}
              href={getBusinessPath(businessSlug, "/held-orders")}
              label={`${lo("Held Orders")} (${heldCount})`}
            />
            <button
              type="button"
              onClick={() => showNotice(`${completedCount} completed receipts.`)}
              className="h-9 min-w-36 rounded-md px-4 text-[12px] font-black text-slate-400 hover:bg-slate-50"
            >
              {lo("Completed")} ({completedCount})
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded-md border border-blue-100 bg-white px-3 text-[12px] font-black text-blue-600 hover:bg-blue-50"
            >
              <Grid2X2 className="h-4 w-4" />
              {lo("Grid")}
            </button>
            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded-md border border-blue-100 bg-white px-3 text-[12px] font-black text-slate-600 hover:bg-blue-50"
            >
              <List className="h-4 w-4" />
              {lo("List")}
            </button>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <label className="relative block">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={orderSearch}
              onChange={(event) => setOrderSearch(event.currentTarget.value)}
              className="h-11 w-full rounded-lg border border-blue-100 pr-4 pl-11 text-[13px] font-bold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              placeholder={lo("Search order, table, or customer")}
            />
          </label>
          <button
            type="button"
            onClick={() => setOrderSearch("")}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white px-4 text-[12px] font-black text-blue-600 hover:bg-blue-50"
          >
            <RefreshCw className="h-4 w-4" />
            {lo("Refresh")}
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="min-w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-blue-50 text-[11px] font-black text-slate-500">
              {["Order", "Table / Type", "Customer", "Items", "Amount", "Time", "Status", "Action"].map(
                (heading) => (
                  <th key={heading} className="px-4 py-3">
                    {lo(heading)}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onOpen={() => handleOpenOrder(order.id)}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-sm font-bold text-slate-500"
                >
                  {lo("No orders match this view.")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="shrink-0 flex items-center justify-between border-t border-blue-50 px-4 py-3">
        <p className="text-[12px] font-bold text-slate-500">
          {lo("Total")} {rows.length} {lo("orders")}
        </p>
        <button
          type="button"
          onClick={handleNewOrder}
          className="flex h-9 items-center justify-center rounded-md border border-blue-100 bg-blue-50 px-4 text-[12px] font-black text-blue-600 hover:bg-blue-100"
        >
          {lo("New Order")}
        </button>
      </div>
    </section>
  );
}

function OrderTab({
  active,
  href,
  label
}: {
  active: boolean;
  href: string;
  label: string;
}) {
  return (
    <Link
      to={href}
      className={`flex h-9 min-w-36 items-center justify-center rounded-md px-4 text-[12px] font-black ${
        active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-blue-50"
      }`}
    >
      {label}
    </Link>
  );
}

function OrderRow({ order, onOpen }: { order: OpenOrder; onOpen: () => void }) {
  return (
    <tr className="border-b border-blue-50 last:border-b-0 hover:bg-blue-50/40">
      <td className="px-4 py-3 font-black text-blue-600">{order.id}</td>
      <td className="px-4 py-3 font-bold text-slate-800">
        {order.table}
        <span className="block text-[11px] text-slate-500">{lo(order.type)}</span>
      </td>
      <td className="px-4 py-3 font-bold text-slate-700">{lo(order.customer)}</td>
      <td className="px-4 py-3 font-black text-slate-800">{order.items}</td>
      <td className="px-4 py-3 font-black text-slate-800">
        {formatMoney(order.amount)}
      </td>
      <td className="px-4 py-3 font-bold text-slate-600">{order.time}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex rounded-md px-2 py-1 text-[11px] font-black ${
            order.status === "Held"
              ? "bg-amber-50 text-amber-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {lo(order.status)}
        </span>
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={onOpen}
          className="h-8 rounded-md border border-blue-200 bg-blue-50 px-3 text-[12px] font-black text-blue-600 hover:bg-blue-100"
        >
          {lo("Open")}
        </button>
      </td>
    </tr>
  );
}
