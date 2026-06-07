import {
  BookOpen,
  Check,
  ClipboardList,
  Clock,
  ReceiptText,
  Table2,
  WalletCards
} from "lucide-react";
import { Link } from "react-router-dom";

import { StaffBottomNav } from "../components/staff-bottom-nav";
import { StaffOrderHeader } from "../components/staff-order-header";
import { StaffMobileShell, StaffScrollArea } from "../components/staff-mobile-shell";
import { useStaffOrderStore } from "../stores/staff-order-store";
import { formatMoney, getStaffOrderPath } from "../utils";
import { lo } from "../utils/lao-labels";

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
      <StaffOrderHeader title="Order Sent" />
      <StaffScrollArea>
        <section className="flex min-h-[270px] flex-col items-center justify-center text-center">
          <div className="flex h-[124px] w-[124px] items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-[0_16px_40px_rgba(34,197,94,0.08)]">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_16px_30px_rgba(34,197,94,0.24)]">
              <Check className="h-11 w-11" />
            </span>
          </div>
          <h2 className="mt-5 text-[24px] font-black text-emerald-600">
            {lo("Order sent successfully")}
          </h2>
          <p className="mt-3 max-w-[320px] text-[16px] leading-6 font-bold text-slate-500">
            {lo("The kitchen and bar have received the order for Table")}{" "}
            <span className="font-black text-blue-600">{order.tableId}</span>.
          </p>
        </section>

        <section className="rounded-lg border border-blue-100 bg-white p-4 shadow-[0_10px_26px_rgba(15,23,42,0.045)]">
          <SuccessRow icon={ReceiptText} label="Order No." value={order.id} />
          <SuccessRow icon={Table2} label="Table" value={order.tableId} />
          <SuccessRow icon={ClipboardList} label="Items" value={String(order.items)} />
          <SuccessRow
            icon={WalletCards}
            label="Total"
            value={formatMoney(order.total)}
          />
          <SuccessRow icon={Clock} label="Sent Time" value="10:24 AM" />
        </section>

        <Link
          to={getStaffOrderPath(businessSlug, `/table/${selectedTableId}`)}
          className="mt-5 flex h-14 items-center justify-center gap-3 rounded-lg bg-blue-600 text-[17px] font-black text-white shadow-[0_16px_28px_rgba(37,99,235,0.24)] hover:bg-blue-700"
        >
          <BookOpen className="h-5 w-5" />
          {lo("Back to Menu")}
        </Link>
        <Link
          to={getStaffOrderPath(businessSlug, "/orders")}
          className="mt-3 flex h-[52px] items-center justify-center gap-3 rounded-lg border border-blue-200 text-[16px] font-black text-blue-600 hover:bg-blue-50"
        >
          <ClipboardList className="h-5 w-5" />
          {lo("View Active Orders")}
        </Link>
        <button
          type="button"
          onClick={startNewOrder}
          className="mt-4 flex h-11 w-full items-center justify-center text-[15px] font-black text-blue-600"
        >
          {lo("Start New Order")}
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
    <div className="flex items-center justify-between border-b border-blue-50 py-3 last:border-b-0">
      <span className="flex items-center gap-3 text-[14px] font-bold text-slate-500">
        <Icon className="h-5 w-5 text-emerald-600" />
        {lo(label)}
      </span>
      <span className="text-[16px] font-black text-blue-600">{value}</span>
    </div>
  );
}
