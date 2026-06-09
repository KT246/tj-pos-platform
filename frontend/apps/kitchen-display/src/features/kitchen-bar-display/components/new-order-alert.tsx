import { BellRing, ChefHat, Eye, PackageCheck, Timer, VolumeX, X } from "lucide-react";

import type { KitchenTicket } from "../types";
import { getElapsedLabel, getTicketItemCount } from "../utils";
import { lo } from "../utils/lao-labels";

type NewOrderAlertProps = {
  ticket: KitchenTicket;
  soundEnabled: boolean;
  onViewTicket: (ticketId: string) => void;
  onStartPreparing: (ticketId: string) => void;
  onMute: () => void;
  onDismiss: () => void;
};

export function NewOrderAlert({
  ticket,
  soundEnabled,
  onViewTicket,
  onStartPreparing,
  onMute,
  onDismiss
}: NewOrderAlertProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071633]/55 p-6 backdrop-blur-[2px]">
      <section className="w-[min(640px,calc(100vw-48px))] overflow-hidden rounded-2xl bg-white shadow-[0_28px_90px_rgba(7,22,51,0.3)]">
        <header className="relative bg-blue-600 px-8 py-7 text-white">
          <button
            type="button"
            onClick={onDismiss}
            className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 transition hover:bg-white/25"
            aria-label="Dismiss new order alert"
          >
            <X className="h-5 w-5" strokeWidth={2.4} />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
              <BellRing className="h-10 w-10" strokeWidth={2.35} />
            </div>
            <div>
              <h2 className="text-[34px] leading-none font-black">
                ມີອໍເດີໃໝ່
              </h2>
              <p className="mt-2 text-[16px] font-semibold text-blue-100">
                ກວດອໍເດີນີ້ກ່ອນສົ່ງໄປການກຽມ.
              </p>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/45 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[32px] font-black text-[#0b1736]">{ticket.id}</div>
                <div className="mt-2 flex items-center gap-3 text-[15px] font-bold text-slate-600">
                  <span>{lo(ticket.table)}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  <span>{lo(ticket.type)}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  <span>{lo(ticket.station)}</span>
                </div>
              </div>
              <span
                className={`rounded-md px-3 py-1 text-[12px] font-black ${
                  ticket.priority === "High"
                    ? "bg-red-50 text-red-600"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {lo(ticket.priority)}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white px-4 py-3">
                <div className="flex items-center gap-2 text-[12px] font-black text-slate-500 uppercase">
                  <ChefHat className="h-4 w-4" strokeWidth={2.2} />
                  {lo("Station")}
                </div>
                <div className="mt-1 text-[18px] font-black text-[#0b1736] capitalize">
                  {lo(ticket.station)}
                </div>
              </div>
              <div className="rounded-xl bg-white px-4 py-3">
                <div className="flex items-center gap-2 text-[12px] font-black text-slate-500 uppercase">
                  <PackageCheck className="h-4 w-4" strokeWidth={2.2} />
                  {lo("Items")}
                </div>
                <div className="mt-1 text-[18px] font-black text-[#0b1736]">
                  {getTicketItemCount(ticket)}
                </div>
              </div>
              <div className="rounded-xl bg-white px-4 py-3">
                <div className="flex items-center gap-2 text-[12px] font-black text-slate-500 uppercase">
                  <Timer className="h-4 w-4" strokeWidth={2.2} />
                  ຮັບເມື່ອ
                </div>
                <div className="mt-1 text-[18px] font-black text-red-500">
                  {getElapsedLabel(ticket.elapsedMinutes)}
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {ticket.items.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-white px-4 py-3 text-[15px] font-bold text-[#0b1736]"
                >
                  <span>
                    {item.quantity} x {lo(item.name)}
                  </span>
                  {item.note ? (
                    <span className="text-[12px] font-semibold text-orange-500">
                      {lo(item.note)}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-blue-100 bg-white px-5 py-4 text-[15px] font-bold text-[#0b1736] shadow-sm">
            ສຽງແຈ້ງເຕືອນ:{" "}
            <span className={soundEnabled ? "text-blue-600" : "text-slate-500"}>
              {soundEnabled ? "ກຳລັງເປີດ" : "ປິດສຽງ"}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onViewTicket(ticket.id)}
              className="flex h-12 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white text-[15px] font-black text-blue-600 transition hover:border-blue-400 hover:bg-blue-50"
            >
              <Eye className="h-5 w-5" strokeWidth={2.35} />
              ເບິ່ງອໍເດີ
            </button>
            <button
              type="button"
              onClick={() => onStartPreparing(ticket.id)}
              className="flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 text-[15px] font-black text-white transition hover:bg-blue-700"
            >
              <Timer className="h-5 w-5" strokeWidth={2.35} />
              {lo("Start Preparing")}
            </button>
            <button
              type="button"
              onClick={onMute}
              className="flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-[15px] font-black text-[#0b1736] transition hover:border-slate-300 hover:bg-slate-50"
            >
              <VolumeX className="h-5 w-5" strokeWidth={2.35} />
              ປິດສຽງແຈ້ງເຕືອນ
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="flex h-12 items-center justify-center rounded-lg border border-slate-200 bg-white text-[15px] font-black text-[#0b1736] transition hover:border-slate-300 hover:bg-slate-50"
            >
              ປິດ
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
