import { ReceiptText } from "lucide-react";

import type { KitchenTicket } from "../types";
import { TicketCard } from "./ticket-card";

type TicketGridProps = {
  tickets: KitchenTicket[];
  showItemNotes: boolean;
  showElapsedTime: boolean;
  density: "comfortable" | "compact";
  onStartPreparing: (ticketId: string) => void;
  onMarkReady: (ticketId: string) => void;
  onCompletePickup: (ticketId: string) => void;
  onRecall: (ticketId: string) => void;
  onViewDetail: (ticketId: string) => void;
};

export function TicketGrid({
  tickets,
  showItemNotes,
  showElapsedTime,
  density,
  onStartPreparing,
  onMarkReady,
  onCompletePickup,
  onRecall,
  onViewDetail
}: TicketGridProps) {
  if (tickets.length === 0) {
    return (
      <div className="grid h-full min-h-[320px] place-items-center rounded-2xl border border-dashed border-blue-200 bg-white/70 px-4 text-center 2xl:min-h-[420px]">
        <div>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <ReceiptText className="h-10 w-10" strokeWidth={2.2} />
          </div>
          <h2 className="mt-5 text-[25px] font-black text-[#0b1736]">
            ບໍ່ມີ ticket ໃນຄິວນີ້
          </h2>
          <p className="mt-2 text-[15px] font-semibold text-slate-500">
            ລອງປ່ຽນສະຖານີ ຫຼື ສະຖານະເພື່ອເບິ່ງອໍເດີອື່ນ.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 pb-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-4 2xl:pb-5">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          showItemNotes={showItemNotes}
          showElapsedTime={showElapsedTime}
          density={density}
          onStartPreparing={onStartPreparing}
          onMarkReady={onMarkReady}
          onCompletePickup={onCompletePickup}
          onRecall={onRecall}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  );
}
