import {
  CheckCircle2,
  Clock3,
  MessageCircle,
  MoreHorizontal,
  Printer,
  ShoppingBag,
  Timer,
  UserRound,
  Utensils,
  X
} from "lucide-react";

import type { KitchenTicket } from "../types";
import {
  formatKitchenMoney,
  getElapsedLabel,
  getTicketItemCount,
  getTicketSubtotal
} from "../utils";

type TicketDetailModalProps = {
  ticket: KitchenTicket;
  onClose: () => void;
  onStartPreparing: (ticketId: string) => void;
  onMarkReady: (ticketId: string) => void;
  onCompletePickup: (ticketId: string) => void;
  onPrint: (ticketId: string) => void;
};

function DetailStat({
  label,
  value,
  tone = "default"
}: {
  label: string;
  value: string;
  tone?: "default" | "warning" | "success";
}) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/40 px-4 py-3">
      <div className="text-[12px] font-black tracking-wide text-slate-500 uppercase">
        {label}
      </div>
      <div
        className={`mt-1 text-[19px] font-black ${
          tone === "warning"
            ? "text-orange-600"
            : tone === "success"
              ? "text-emerald-600"
              : "text-[#0b1736]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export function TicketDetailModal({
  ticket,
  onClose,
  onStartPreparing,
  onMarkReady,
  onCompletePickup,
  onPrint
}: TicketDetailModalProps) {
  const subtotal = getTicketSubtotal(ticket);
  const tax = Math.round(subtotal * 0.07);
  const total = subtotal + tax;
  const LocationIcon = ticket.type === "Take Away" ? ShoppingBag : Utensils;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#071633]/50 p-6 backdrop-blur-[2px]">
      <section className="flex h-[min(860px,calc(100vh-48px))] w-[min(1160px,calc(100vw-48px))] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_28px_90px_rgba(7,22,51,0.28)]">
        <header className="flex items-center justify-between border-b border-blue-100 px-7 py-5">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[32px] leading-none font-black text-[#0b1736]">
                {ticket.id}
              </h2>
              <span
                className={`rounded-md px-3 py-1 text-[12px] font-black ${
                  ticket.priority === "High"
                    ? "bg-red-50 text-red-600"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {ticket.priority} Priority
              </span>
            </div>
            <div className="mt-3 flex items-center gap-5 text-[15px] font-bold text-slate-600">
              <span className="flex items-center gap-2">
                <LocationIcon className="h-5 w-5 text-[#0b1736]" strokeWidth={2.2} />
                {ticket.table}
              </span>
              <span className="flex items-center gap-2 text-red-500">
                <Timer className="h-5 w-5" strokeWidth={2.2} />
                {getElapsedLabel(ticket.elapsedMinutes)} elapsed
              </span>
              <span className="flex items-center gap-2">
                <Clock3 className="h-5 w-5 text-[#0b1736]" strokeWidth={2.2} />
                Received {ticket.receivedAt}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-white text-[#0b1736] transition hover:border-blue-300 hover:bg-blue-50"
            aria-label="Close ticket detail"
          >
            <X className="h-6 w-6" strokeWidth={2.4} />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] gap-6 overflow-hidden bg-[#f7faff] p-6">
          <aside className="min-h-0 space-y-5 overflow-auto pr-1">
            <div className="grid grid-cols-2 gap-4">
              <DetailStat label="Station" value={ticket.station} />
              <DetailStat
                label="Status"
                value={ticket.status}
                tone={ticket.status === "ready" ? "success" : "warning"}
              />
              <DetailStat label="Order Type" value={ticket.type} />
              <DetailStat label="Items" value={`${getTicketItemCount(ticket)} items`} />
            </div>

            <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 text-[18px] font-black text-[#0b1736]">
                <UserRound className="h-6 w-6 text-blue-600" strokeWidth={2.4} />
                Order Information
              </div>
              <dl className="mt-5 space-y-4 text-[14px]">
                <div className="flex justify-between gap-4">
                  <dt className="font-bold text-slate-500">Customer</dt>
                  <dd className="font-black text-[#0b1736]">{ticket.customerName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-bold text-slate-500">Assigned To</dt>
                  <dd className="font-black text-[#0b1736]">{ticket.assignedTo}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-bold text-slate-500">Ticket No.</dt>
                  <dd className="font-black text-[#0b1736]">{ticket.orderNo}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 text-[18px] font-black text-[#0b1736]">
                <MessageCircle className="h-6 w-6 text-blue-600" strokeWidth={2.4} />
                Notes
              </div>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl bg-blue-50 px-4 py-3">
                  <div className="text-[12px] font-black text-slate-500 uppercase">
                    Customer Note
                  </div>
                  <div className="mt-1 text-[14px] font-bold text-[#0b1736]">
                    {ticket.customerNote}
                  </div>
                </div>
                <div className="rounded-xl bg-orange-50 px-4 py-3">
                  <div className="text-[12px] font-black text-orange-500 uppercase">
                    Kitchen Note
                  </div>
                  <div className="mt-1 text-[14px] font-bold text-[#0b1736]">
                    {ticket.kitchenNote}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm">
            <div className="border-b border-blue-100 px-5 py-4">
              <h3 className="text-[20px] font-black text-[#0b1736]">Ticket Items</h3>
            </div>
            <div className="min-h-0 flex-1 overflow-auto px-5 py-2">
              {ticket.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[46px_minmax(0,1fr)_110px] gap-4 border-b border-slate-100 py-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[15px] font-black text-blue-600">
                    {item.quantity}
                  </div>
                  <div>
                    <div className="text-[16px] font-black text-[#0b1736]">
                      {item.name}
                    </div>
                    {item.modifiers?.length ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.modifiers.map((modifier) => (
                          <span
                            key={modifier}
                            className="rounded-md bg-slate-100 px-2 py-1 text-[12px] font-bold text-slate-600"
                          >
                            {modifier}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {item.note ? (
                      <div className="mt-2 text-[13px] font-semibold text-orange-600">
                        Note: {item.note}
                      </div>
                    ) : null}
                  </div>
                  <div className="text-right text-[15px] font-black text-[#0b1736]">
                    {formatKitchenMoney(item.unitPrice * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-blue-100 bg-blue-50/45 px-5 py-4">
              <div className="space-y-2 text-[14px] font-bold">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatKitchenMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span>{formatKitchenMoney(tax)}</span>
                </div>
                <div className="flex justify-between text-[20px] font-black text-[#0b1736]">
                  <span>Total</span>
                  <span>{formatKitchenMoney(total)}</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onPrint(ticket.id)}
                  className="flex h-12 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white text-[14px] font-black text-blue-600 transition hover:border-blue-400 hover:bg-blue-50"
                >
                  <Printer className="h-5 w-5" strokeWidth={2.35} />
                  Print Ticket
                </button>
                <button
                  type="button"
                  className="flex h-12 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white text-[14px] font-black text-[#0b1736] transition hover:border-blue-400 hover:bg-blue-50"
                >
                  <MoreHorizontal className="h-5 w-5" strokeWidth={2.35} />
                  More Actions
                </button>
                {ticket.status === "new" ? (
                  <button
                    type="button"
                    onClick={() => onStartPreparing(ticket.id)}
                    className="col-span-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 text-[15px] font-black text-white transition hover:bg-blue-700"
                  >
                    <Timer className="h-5 w-5" strokeWidth={2.35} />
                    Start Preparing
                  </button>
                ) : ticket.status === "preparing" ? (
                  <button
                    type="button"
                    onClick={() => onMarkReady(ticket.id)}
                    className="col-span-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 text-[15px] font-black text-white transition hover:bg-orange-600"
                  >
                    <CheckCircle2 className="h-5 w-5" strokeWidth={2.35} />
                    Mark Ready
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onCompletePickup(ticket.id)}
                    className="col-span-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-500 text-[15px] font-black text-white transition hover:bg-emerald-600"
                  >
                    <CheckCircle2 className="h-5 w-5" strokeWidth={2.35} />
                    Complete Pickup
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
