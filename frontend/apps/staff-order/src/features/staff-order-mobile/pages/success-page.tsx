import {
  BookOpen,
  Check,
  ClipboardList,
  Clock,
  ReceiptText,
  Table2,
  WalletCards,
  X
} from "lucide-react";
import { Link } from "react-router-dom";

import { StaffBottomNav } from "../components/staff-bottom-nav";
import { StaffMobileShell, StaffScrollArea } from "../components/staff-mobile-shell";
import { useStaffOrderStore } from "../stores/staff-order-store";
import { formatMoney, getStaffOrderPath } from "../utils";

export function StaffSuccessPage({ businessSlug }: { businessSlug: string }) {
  const selectedTableId = useStaffOrderStore((state) => state.selectedTableId);
  const lastSentOrder = useStaffOrderStore((state) => state.lastSentOrder);
  const startNewOrder = useStaffOrderStore((state) => state.startNewOrder);
  const order = lastSentOrder ?? {
    id: "#SO-1058",
    tableId: selectedTableId,
    items: 4,
    total: 109000,
    elapsed: "Just now"
  };

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
      <StaffScrollArea className="pt-3">
        <section className="grid grid-cols-[auto_1fr_auto] items-start gap-2 rounded-lg border border-emerald-100 border-l-4 border-l-emerald-500 bg-white px-3 py-2.5 shadow-[0_12px_30px_rgba(15,23,42,0.1)]">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Check className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[12px] font-black text-slate-950">
              {"ສົ່ງອໍເດີສຳເລັດ"}
            </span>
            <span className="mt-0.5 block truncate text-[10px] font-bold text-slate-500">
              {order.id} {"ຄົວ ແລະ ບາໄດ້ຮັບອໍເດີສຳລັບໂຕະ"}{" "}
              {order.tableId}.
            </span>
          </span>
          <button
            type="button"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </section>

        <section className="flex min-h-[220px] flex-col items-center justify-center text-center">
          <div className="flex h-[104px] w-[104px] items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-[0_16px_40px_rgba(34,197,94,0.08)]">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_16px_30px_rgba(34,197,94,0.24)]">
              <Check className="h-9 w-9" />
            </span>
          </div>
          <h2 className="mt-4 text-[21px] font-black text-emerald-600">
            {"ສົ່ງອໍເດີສຳເລັດ"}
          </h2>
          <p className="mt-2 max-w-[300px] text-[13px] leading-5 font-bold text-slate-500">
            {"ຄົວ ແລະ ບາໄດ້ຮັບອໍເດີສຳລັບໂຕະ"}{" "}
            <span className="font-black text-blue-600">{order.tableId}</span>.
          </p>
        </section>

        <section className="rounded-lg border border-blue-100 bg-white px-3 py-2 shadow-[0_9px_22px_rgba(15,23,42,0.045)]">
          <SuccessRow icon={ReceiptText} label="ເລກອໍເດີ" value={order.id} />
          <SuccessRow icon={Table2} label="ໂຕະ" value={order.tableId} />
          <SuccessRow icon={ClipboardList} label="ລາຍການ" value={String(order.items)} />
          <SuccessRow
            icon={WalletCards}
            label="ລວມທັງໝົດ"
            value={formatMoney(order.total)}
          />
          <SuccessRow icon={Clock} label="ເວລາສົ່ງ" value="10:24 AM" />
        </section>

        <Link
          to={getStaffOrderPath(businessSlug, `/table/${selectedTableId}`)}
          className="mt-4 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 text-[13px] font-black text-white shadow-[0_14px_24px_rgba(37,99,235,0.22)] hover:bg-blue-700"
        >
          <BookOpen className="h-4 w-4" />
          {"ກັບໄປເມນູ"}
        </Link>
        <Link
          to={getStaffOrderPath(businessSlug, "/orders")}
          className="mt-2 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-200 text-[13px] font-black text-blue-600 hover:bg-blue-50"
        >
          <ClipboardList className="h-4 w-4" />
          {"ເບິ່ງອໍເດີທີ່ເປີດຢູ່"}
        </Link>
        <button
          type="button"
          onClick={startNewOrder}
          className="mt-2 flex h-9 w-full cursor-pointer items-center justify-center text-[12px] font-black text-blue-600"
        >
          {"ເລີ່ມອໍເດີໃໝ່"}
        </button>
      </StaffScrollArea>
    </StaffMobileShell>
  );
}

function SuccessRow({
  icon: Icon,
  label,
  value
}: {
  icon: typeof ReceiptText;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-blue-50 py-2.5 last:border-b-0">
      <span className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
        <Icon className="h-4 w-4 text-emerald-600" />
        {label}
      </span>
      <span className="text-[13px] font-black text-blue-600">{value}</span>
    </div>
  );
}
