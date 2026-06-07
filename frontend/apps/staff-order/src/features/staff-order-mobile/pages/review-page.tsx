import {
  ArrowRight,
  ChefHat,
  FileText,
  Minus,
  Pencil,
  Plus,
  UserRound
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { StaffBottomNav } from "../components/staff-bottom-nav";
import { StaffOrderHeader } from "../components/staff-order-header";
import { StaffMobileShell, StaffScrollArea } from "../components/staff-mobile-shell";
import { staffName } from "../data/staff-order-data";
import { useStaffOrderStore } from "../stores/staff-order-store";
import type { StaffOrderLine } from "../types";
import { formatMoney, getStaffCartSummary, getStaffOrderPath } from "../utils";
import { lo } from "../utils/lao-labels";

export function StaffReviewPage({ businessSlug }: { businessSlug: string }) {
  const navigate = useNavigate();
  const selectedTableId = useStaffOrderStore((state) => state.selectedTableId);
  const guests = useStaffOrderStore((state) => state.guests);
  const cart = useStaffOrderStore((state) => state.cart);
  const incrementLine = useStaffOrderStore((state) => state.incrementLine);
  const decrementLine = useStaffOrderStore((state) => state.decrementLine);
  const saveDraft = useStaffOrderStore((state) => state.saveDraft);
  const sendOrder = useStaffOrderStore((state) => state.sendOrder);
  const summary = getStaffCartSummary(cart);

  function handleSendOrder() {
    sendOrder();
    navigate(getStaffOrderPath(businessSlug, "/success"));
  }

  return (
    <StaffMobileShell
      bottomNav={
        <StaffBottomNav
          businessSlug={businessSlug}
          active="menu"
          selectedTableId={selectedTableId}
        />
      }
    >
      <StaffOrderHeader
        title="Review Order"
        backHref={getStaffOrderPath(businessSlug, `/table/${selectedTableId}`)}
      />
      <StaffScrollArea>
        <section className="mt-4 grid grid-cols-4 divide-x divide-blue-50 rounded-lg border border-blue-100 bg-white px-2 py-3 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
          <ReviewMeta label="Table" value={selectedTableId} />
          <ReviewMeta label="Guests" value={String(guests)} />
          <ReviewMeta label="Staff" value={staffName} />
          <ReviewMeta label="Type" value="Dine In" />
        </section>

        <section className="mt-4 overflow-hidden rounded-lg border border-blue-100 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.045)]">
          {cart.length > 0 ? (
            cart.map((line) => (
              <ReviewLine
                key={line.id}
                line={line}
                businessSlug={businessSlug}
                tableId={selectedTableId}
                onIncrement={() => incrementLine(line.id)}
                onDecrement={() => decrementLine(line.id)}
              />
            ))
          ) : (
            <div className="p-6 text-center text-[13px] font-bold text-slate-500">
              {lo("No items in this order yet.")}
            </div>
          )}

          <div className="border-t border-blue-50 p-4">
            <SummaryRow label="Subtotal" value={summary.subtotal} />
            <SummaryRow label="Service Charge (5%)" value={summary.serviceCharge} />
            <SummaryRow label="Discount" value={summary.discount} discount />
            <div className="mt-3 flex items-center justify-between border-t border-blue-50 pt-3">
              <span className="text-[18px] font-black text-slate-950">{lo("Total")}</span>
              <span className="text-[20px] font-black text-slate-950">
                {formatMoney(summary.total)}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-blue-100 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-slate-500">
              <UserRound className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-black text-slate-950">
                {lo("Walk-in Customer")}
              </span>
              <span className="text-[12px] font-bold text-slate-500">
                {lo("No member attached")}
              </span>
            </span>
          </span>
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-lg border border-blue-100 px-3 text-[13px] font-black text-blue-600 transition hover:bg-blue-50"
          >
            <Plus className="h-4 w-4" />
            {lo("Add")}
          </button>
        </section>

        <div className="mt-4 grid grid-cols-[0.9fr_1.4fr] gap-3">
          <button
            type="button"
            onClick={saveDraft}
            className="flex h-[52px] items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white text-[14px] font-black text-blue-600 transition hover:bg-blue-50"
          >
            <FileText className="h-4 w-4" />
            {lo("Save Draft")}
          </button>
          <button
            type="button"
            onClick={handleSendOrder}
            disabled={cart.length === 0}
            className="flex h-[52px] items-center justify-center gap-2 rounded-lg bg-blue-600 text-[14px] font-black text-white shadow-[0_16px_28px_rgba(37,99,235,0.24)] transition hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            <ChefHat className="h-4 w-4" />
            {lo("Send Order")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </StaffScrollArea>
    </StaffMobileShell>
  );
}

function ReviewMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 px-2">
      <p className="text-[10px] font-bold text-slate-500">{lo(label)}</p>
      <p className="truncate text-[12px] font-black text-slate-950">{lo(value)}</p>
    </div>
  );
}

function ReviewLine({
  line,
  businessSlug,
  tableId,
  onIncrement,
  onDecrement
}: {
  line: StaffOrderLine;
  businessSlug: string;
  tableId: string;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <div className="grid grid-cols-[72px_1fr_auto] gap-3 border-b border-blue-50 p-4 last:border-b-0">
      <img src={line.image} alt="" className="h-20 w-[72px] rounded-lg object-cover" />
      <div className="min-w-0">
        <p className="text-[15px] font-black text-slate-950">{lo(line.name)}</p>
        <p className="mt-1 text-[12px] font-bold text-slate-500">
          {lo(line.size)} - {lo(line.milk)}
        </p>
        {line.note ? (
          <p className="mt-2 inline-flex max-w-full rounded-md bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-600">
            <span className="truncate">{lo("Note")}: {lo(line.note)}</span>
          </p>
        ) : null}
        <p className="mt-3 text-[14px] font-black text-slate-950">
          {formatMoney(line.price * line.quantity)}
        </p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <div className="flex h-9 overflow-hidden rounded-lg border border-blue-100 bg-white">
          <button
            type="button"
            onClick={onDecrement}
            className="flex w-9 items-center justify-center text-blue-600 transition hover:bg-blue-50"
            aria-label="Decrease item"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="flex w-9 items-center justify-center border-x border-blue-100 text-[14px] font-black">
            {line.quantity}
          </span>
          <button
            type="button"
            onClick={onIncrement}
            className="flex w-9 items-center justify-center text-blue-600 transition hover:bg-blue-50"
            aria-label="Increase item"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <Link
          to={getStaffOrderPath(
            businessSlug,
            `/table/${tableId}/item/${line.productId}`
          )}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
          aria-label="Edit item"
        >
          <Pencil className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  discount = false
}: {
  label: string;
  value: number;
  discount?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1 text-[14px] font-bold">
      <span className="text-slate-500">{lo(label)}</span>
      <span className={discount ? "text-emerald-600" : "text-slate-950"}>
        {discount && value > 0 ? "-" : ""}
        {formatMoney(value)}
      </span>
    </div>
  );
}
