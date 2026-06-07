import { Search, UserPlus, X } from "lucide-react";
import type { FormEvent, ReactNode } from "react";

import { customers, tables } from "../data/mock-pos-data";
import type { CartLine, Customer, Discount, OrderType } from "../types";
import { formatMoney, getCartSummary } from "../utils";
import { lo, loCustomerType } from "../utils/lao-labels";

export function TerminalModal({
  title,
  width = "max-w-2xl",
  children,
  onClose
}: {
  title: string;
  width?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/55 p-5 backdrop-blur-sm">
      <section
        className={`flex max-h-[calc(100vh-40px)] w-full ${width} flex-col overflow-hidden rounded-xl border border-blue-100 bg-white shadow-[0_26px_70px_rgba(15,23,42,0.28)]`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-blue-50 px-5 py-4">
          <h2 className="text-[16px] font-black text-slate-950">{lo(title)}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto">{children}</div>
      </section>
    </div>
  );
}

export function BarcodeScanDialog({
  onClose,
  onScan
}: {
  onClose: () => void;
  onScan: (barcode: string) => void;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onScan(String(formData.get("barcode") ?? ""));
  }

  return (
    <TerminalModal title="Scanning barcode" width="max-w-xl" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        <div className="flex items-center gap-4 rounded-lg border border-blue-100 bg-blue-50/60 p-4">
          <div className="flex h-16 w-24 items-center justify-center rounded-md bg-white text-slate-900 shadow-sm">
            <span className="font-mono text-3xl font-black tracking-[-0.18em]">
              |||||
            </span>
          </div>
          <div>
            <p className="text-[18px] font-black text-slate-950">
              {lo("Scan or type SKU")}
            </p>
            <p className="text-[12px] font-bold text-slate-500">
              {lo("Try CF-1001, BK-3001, or TE-2001.")}
            </p>
          </div>
        </div>
        <input
          name="barcode"
          autoFocus
          defaultValue="CF-1001"
          className="h-11 w-full rounded-md border border-blue-100 px-3 text-sm font-black outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
        />
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-md border border-blue-100 text-sm font-black text-slate-600 transition hover:bg-slate-50"
          >
            {lo("Cancel")}
          </button>
          <button
            type="submit"
            className="h-11 rounded-md bg-blue-600 text-sm font-black text-white transition hover:bg-blue-700"
          >
            {lo("Add Item")}
          </button>
        </div>
      </form>
    </TerminalModal>
  );
}

export function DiscountDialog({
  cart,
  discount,
  onClose,
  onApply
}: {
  cart: CartLine[];
  discount: Discount | null;
  onClose: () => void;
  onApply: (discount: Discount) => void;
}) {
  const summary = getCartSummary(cart, discount);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const mode = String(formData.get("mode")) === "amount" ? "amount" : "percent";
    const value = Number(formData.get("value") ?? 0);
    const reason = String(formData.get("reason") ?? "Member Discount");

    onApply({ mode, value, reason });
  }

  return (
    <TerminalModal title="Apply Discount" width="max-w-xl" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-[12px] font-black text-slate-600">
              {lo("Discount Mode")}
            </span>
            <select
              name="mode"
              defaultValue={discount?.mode ?? "percent"}
              className="h-11 w-full rounded-md border border-blue-100 px-3 text-sm font-black outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
            >
              <option value="percent">{lo("By Percent (%)")}</option>
              <option value="amount">{lo("By Amount (LAK)")}</option>
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-[12px] font-black text-slate-600">
              {lo("Discount Value")}
            </span>
            <input
              name="value"
              type="number"
              min={0}
              defaultValue={discount?.value ?? 10}
              className="h-11 w-full rounded-md border border-blue-100 px-3 text-sm font-black outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
            />
          </label>
          <label className="md:col-span-2">
            <span className="mb-1.5 block text-[12px] font-black text-slate-600">
              {lo("Reason")}
            </span>
            <select
              name="reason"
              defaultValue={discount?.reason ?? "Member Discount"}
              className="h-11 w-full rounded-md border border-blue-100 px-3 text-sm font-black outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
            >
              <option value="Member Discount">{lo("Member Discount")}</option>
              <option value="Manager Approval">{lo("Manager Approval")}</option>
              <option value="Promotion Campaign">{lo("Promotion Campaign")}</option>
            </select>
          </label>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-[12px] font-black text-slate-500">
            {lo("Current Order")}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <PreviewStat label="Subtotal" value={formatMoney(summary.subtotal)} />
            <PreviewStat label="Current Total" value={formatMoney(summary.total)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-md border border-blue-100 text-sm font-black text-slate-600 transition hover:bg-slate-50"
          >
            {lo("Cancel")}
          </button>
          <button
            type="submit"
            className="h-11 rounded-md bg-blue-600 text-sm font-black text-white transition hover:bg-blue-700"
          >
            {lo("Apply Discount")}
          </button>
        </div>
      </form>
    </TerminalModal>
  );
}

export function CustomerDialog({
  onClose,
  onSelect
}: {
  onClose: () => void;
  onSelect: (customer: Customer | null) => void;
}) {
  return (
    <TerminalModal title="Select Customer" width="max-w-3xl" onClose={onClose}>
      <div className="space-y-4 p-5">
        <label className="relative block">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-11 w-full rounded-md border border-blue-100 pr-4 pl-11 text-sm font-bold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
            placeholder={lo("Search by name, phone, or member ID")}
          />
        </label>
        <div className="overflow-hidden rounded-lg border border-blue-100">
          {customers.map((customer) => (
            <button
              key={customer.id}
              type="button"
              onClick={() =>
                onSelect(customer.id === "WALK-IN" ? null : customer)
              }
              className="grid w-full grid-cols-[1fr_auto] items-center gap-4 border-b border-blue-50 px-4 py-3 text-left last:border-b-0 hover:bg-blue-50/60"
            >
              <span className="flex min-w-0 items-center gap-3">
                <img
                  src={customer.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full border border-blue-100 object-cover"
                />
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-black text-slate-950">
                    {lo(customer.name)}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {lo(customer.subtitle)}
                  </span>
                  <span className="mt-1 block text-[10px] font-black text-emerald-600">
                    {loCustomerType(customer.customerType)} - {lo(customer.priceList)}
                  </span>
                  {customer.creditLimit > 0 ? (
                    <span className="mt-0.5 block text-[10px] font-bold text-slate-500">
                      {lo("Debt")} {formatMoney(customer.debtBalance)} / {lo("Limit")}{" "}
                      {formatMoney(customer.creditLimit)}
                    </span>
                  ) : null}
                </span>
              </span>
              <span className="text-right text-[12px] font-black text-blue-600">
                {customer.points.toLocaleString("en-US")}
                <span className="block text-[10px] text-slate-400">{lo("Points")}</span>
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="flex h-11 items-center justify-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-4 text-sm font-black text-blue-600 transition hover:bg-blue-100"
        >
          <UserPlus className="h-4 w-4" />
          {lo("New Customer")}
        </button>
      </div>
    </TerminalModal>
  );
}

export function TableDialog({
  selectedTable,
  orderType,
  onClose,
  onSelectTable,
  onSetOrderType
}: {
  selectedTable: string | null;
  orderType: OrderType;
  onClose: () => void;
  onSelectTable: (tableId: string | null) => void;
  onSetOrderType: (orderType: OrderType) => void;
}) {
  return (
    <TerminalModal title="Select Table" width="max-w-5xl" onClose={onClose}>
      <div className="space-y-4 p-5">
        <div className="grid gap-3 md:grid-cols-[auto_1fr_auto]">
          <div className="flex rounded-lg border border-blue-100 bg-white p-1">
            {(["Dine In", "Take Away"] as OrderType[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  item === "Take Away" ? onSelectTable(null) : onSetOrderType(item)
                }
                className={`h-9 rounded-md px-4 text-[12px] font-black ${
                  orderType === item ? "bg-blue-600 text-white" : "text-slate-600"
                }`}
              >
                {lo(item)}
              </button>
            ))}
          </div>
          <label className="relative block">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-11 w-full rounded-lg border border-blue-100 pr-4 pl-11 text-sm font-bold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              placeholder={lo("Search table")}
            />
          </label>
          <button
            type="button"
            className="h-11 rounded-lg border border-blue-100 px-4 text-[12px] font-black text-slate-700 hover:bg-blue-50"
          >
            {lo("Floor")}
          </button>
        </div>
        <div className="grid grid-cols-[130px_1fr] gap-4">
          <div className="space-y-1">
            {["All Areas", "Indoor", "Outdoor", "VIP Room", "Terrace"].map(
              (area, index) => (
                <button
                  key={area}
                  type="button"
                  className={`h-10 w-full rounded-md px-3 text-left text-[12px] font-black ${
                    index === 0
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-blue-50"
                  }`}
                >
                  {lo(area)}
                </button>
              )
            )}
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(116px,1fr))] gap-3">
            {tables.map((table) => (
              <button
                key={table.id}
                type="button"
                onClick={() => onSelectTable(table.id)}
                className={`rounded-lg border p-3 text-left transition hover:-translate-y-0.5 ${
                  selectedTable === table.id
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                    : table.status === "Available"
                      ? "border-blue-100 bg-white hover:border-blue-300"
                      : table.status === "Occupied"
                        ? "border-orange-200 bg-orange-50"
                        : "border-blue-200 bg-blue-50"
                }`}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="text-[14px] font-black text-slate-950">
                    {table.id}
                  </span>
                  {table.elapsed ? (
                    <span className="text-[10px] font-black text-slate-400">
                      {table.elapsed}
                    </span>
                  ) : null}
                </span>
                <span className="mt-1 block text-[11px] font-bold text-slate-500">
                  {table.seats} {lo("Seats")}
                </span>
                <span
                  className={`mt-3 inline-flex rounded-full px-2 py-1 text-[10px] font-black ${
                    table.status === "Available"
                      ? "bg-emerald-50 text-emerald-600"
                      : table.status === "Occupied"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {lo(table.status)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </TerminalModal>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-slate-500">{lo(label)}</p>
      <p className="mt-1 text-[18px] font-black text-slate-950">{value}</p>
    </div>
  );
}
