import {
  CheckCircle2,
  MessageCircle,
  MoreHorizontal,
  ShoppingBag,
  Timer,
  UserRound,
  Utensils
} from "lucide-react";

import type { KitchenTicket } from "../types";
import { getElapsedLabel } from "../utils";

type TicketCardProps = {
  ticket: KitchenTicket;
  showItemNotes: boolean;
  showElapsedTime: boolean;
  density: "comfortable" | "compact";
  onStartPreparing: (ticketId: string) => void;
  onMarkReady: (ticketId: string) => void;
  onCompletePickup: (ticketId: string) => void;
  onRecall: (ticketId: string) => void;
  onViewDetail: (ticketId: string) => void;
};

function getCardTone(ticket: KitchenTicket) {
  if (ticket.status === "ກຳລັງກຽມ") {
    return {
      border: "border-orange-100",
      accent: "text-orange-600",
      primary:
        "bg-orange-500 text-white hover:bg-orange-600 shadow-[0_10px_24px_rgba(249,115,22,0.24)]",
      badge:
        ticket.priority === "ດ່ວນ"
          ? "bg-red-50 text-red-600"
          : "bg-orange-50 text-orange-600"
    };
  }

  if (ticket.status === "ພ້ອມ") {
    return {
      border: "border-emerald-100",
      accent: "text-emerald-600",
      primary:
        "bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_10px_24px_rgba(16,185,129,0.22)]",
      badge:
        ticket.priority === "ດ່ວນ"
          ? "bg-red-50 text-red-600"
          : "bg-emerald-50 text-emerald-600"
    };
  }

  return {
    border: "border-blue-100",
    accent: "text-blue-600",
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-[0_10px_24px_rgba(37,99,235,0.22)]",
    badge:
      ticket.priority === "ດ່ວນ" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
  };
}

function TicketLocation({ ticket }: { ticket: KitchenTicket }) {
  const Icon = ticket.type === "ສັ່ງກັບບ້ານ" ? ShoppingBag : Utensils;

  return (
    <span className="flex items-center gap-2 text-[14px] font-bold text-[#0b1736] 2xl:text-[15px]">
      <Icon className="h-5 w-5" strokeWidth={2.2} />
      {ticket.table}
    </span>
  );
}

export function TicketCard({
  ticket,
  showItemNotes,
  showElapsedTime,
  density,
  onStartPreparing,
  onMarkReady,
  onCompletePickup,
  onRecall,
  onViewDetail
}: TicketCardProps) {
  const tone = getCardTone(ticket);
  const compact = density === "compact";

  return (
    <article
      className={`flex min-h-[292px] flex-col rounded-xl border bg-white p-3.5 shadow-[0_3px_12px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(37,99,235,0.12)] 2xl:min-h-[306px] 2xl:p-4 ${tone.border}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className={`text-[20px] leading-none font-black 2xl:text-[21px] ${tone.accent}`}>
            {ticket.id}
          </div>
          <span
            className={`mt-3 inline-flex rounded-md px-3 py-1 text-[12px] font-black ${tone.badge}`}
          >
            {ticket.priority}
          </span>
        </div>

        <div className="text-right">
          <TicketLocation ticket={ticket} />
          {showElapsedTime ? (
            <div className="mt-2 flex items-center justify-end gap-2 text-red-500">
              <Timer className="h-4 w-4" strokeWidth={2.3} />
              <span className="text-[22px] leading-none font-black">
                {getElapsedLabel(ticket.elapsedMinutes)}
              </span>
            </div>
          ) : null}
          {showElapsedTime ? (
            <div className="text-[12px] font-bold text-slate-500">{"ຜ່ານໄປ"}</div>
          ) : null}
        </div>
      </div>

      {ticket.status === "ກຳລັງກຽມ" ? (
        <div className="mt-4 flex items-center gap-2 text-[13px] font-bold text-[#0b1736]">
          <UserRound className="h-4 w-4" strokeWidth={2.3} />
          <span>{"ມອບໝາຍ:"}</span>
          <span className="font-semibold text-slate-600">{ticket.assignedTo}</span>
        </div>
      ) : null}

      <div className={`mt-3 flex-1 2xl:mt-4 ${compact ? "space-y-1.5" : "space-y-2"}`}>
        {ticket.items.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[26px_minmax(0,1fr)] gap-2 text-[14px] leading-snug font-bold text-[#0b1736]"
          >
            <span>{item.quantity}</span>
            <div>
              <div>{item.name}</div>
              {showItemNotes && item.note && compact ? (
                <div className="mt-0.5 truncate text-[12px] font-semibold text-slate-500">
                  {item.note}
                </div>
              ) : null}
            </div>
          </div>
        ))}
        {ticket.items.length > 3 ? (
          <div className="text-[12px] font-black text-slate-500">
            +{ticket.items.length - 3} {"ລາຍການ"}
          </div>
        ) : null}
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="flex min-h-6 items-center gap-2 text-[13px] font-bold text-[#0b1736]">
          <MessageCircle className="h-4 w-4 text-slate-500" strokeWidth={2.2} />
          <span>{"ໝາຍເຫດ:"}</span>
          <span className="truncate font-semibold text-slate-600">
            {ticket.kitchenNote}
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-3">
        {ticket.status === "ໃໝ່" ? (
          <button
            type="button"
            onClick={() => onStartPreparing(ticket.id)}
            className={`flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg text-[14px] font-black transition ${tone.primary}`}
          >
            <Timer className="h-5 w-5" strokeWidth={2.4} />
            {"ເລີ່ມກຽມ"}
          </button>
        ) : ticket.status === "ກຳລັງກຽມ" ? (
          <button
            type="button"
            onClick={() => onMarkReady(ticket.id)}
            className={`flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg text-[14px] font-black transition ${tone.primary}`}
          >
            <CheckCircle2 className="h-5 w-5" strokeWidth={2.4} />
            {"ໝາຍວ່າພ້ອມ"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onCompletePickup(ticket.id)}
            className={`flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg text-[14px] font-black transition ${tone.primary}`}
          >
            <CheckCircle2 className="h-5 w-5" strokeWidth={2.4} />
            {"ຮັບສຳເລັດ"}
          </button>
        )}

        <button
          type="button"
          onClick={() => onViewDetail(ticket.id)}
          className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white text-[14px] font-black text-[#0b1736] transition hover:border-blue-300 hover:bg-blue-50"
        >
          <MoreHorizontal className="h-5 w-5" strokeWidth={2.4} />
          {"ເບິ່ງລາຍລະອຽດ"}
        </button>
      </div>

      {ticket.status === "ພ້ອມ" ? (
        <button
          type="button"
          onClick={() => onRecall(ticket.id)}
          className="mt-3 h-9 cursor-pointer rounded-lg border border-emerald-100 bg-emerald-50 text-[13px] font-black text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
        >
          {"ດຶງກັບໄປກຳລັງກຽມ"}
        </button>
      ) : null}
    </article>
  );
}
