import {
  Banknote,
  Building2,
  CheckCircle2,
  CreditCard,
  Printer,
  QrCode,
  ReceiptText,
  RotateCcw,
  Smartphone,
  WalletCards
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { branchName, cashierName } from "../data/mock-pos-data";
import { usePosTerminalStore } from "../stores/pos-terminal-store";
import type { OpenOrder, PaymentMethodId, PaymentStatus } from "../types";
import { formatMoney, getBusinessPath, getCartSummary } from "../utils";

const paymentMethods: {
  id: PaymentMethodId;
  icon: typeof Banknote;
  label: string;
}[] = [
  { id: "cash", icon: Banknote, label: "Cash" },
  { id: "card", icon: CreditCard, label: "Card" },
  { id: "m-pos", icon: Smartphone, label: "M-POS" },
  { id: "bank-transfer", icon: Building2, label: "Bank Transfer" },
  { id: "qr-code", icon: QrCode, label: "QR Code" },
  { id: "e-wallet", icon: WalletCards, label: "e-Wallet" }
];

const paymentStatuses: { id: PaymentStatus; label: string; description: string }[] = [
  { id: "paid", label: "Paid", description: "Full payment now" },
  { id: "partial", label: "Partial", description: "Pay part now" },
  { id: "debt", label: "Debt", description: "Customer pays later" }
];

export function CheckoutView({ businessSlug }: { businessSlug: string }) {
  const navigate = useNavigate();
  const cart = usePosTerminalStore((state) => state.cart);
  const discount = usePosTerminalStore((state) => state.discount);
  const selectedTable = usePosTerminalStore((state) => state.selectedTable);
  const orderType = usePosTerminalStore((state) => state.orderType);
  const customer = usePosTerminalStore((state) => state.customer);
  const activeOrderId = usePosTerminalStore((state) => state.activeOrderId);
  const paymentMethod = usePosTerminalStore((state) => state.paymentMethod);
  const paymentStatus = usePosTerminalStore((state) => state.paymentStatus);
  const receivedAmount = usePosTerminalStore((state) => state.receivedAmount);
  const setPaymentMethod = usePosTerminalStore((state) => state.setPaymentMethod);
  const setPaymentStatus = usePosTerminalStore((state) => state.setPaymentStatus);
  const setReceivedAmount = usePosTerminalStore(
    (state) => state.setReceivedAmount
  );
  const confirmPayment = usePosTerminalStore((state) => state.confirmPayment);
  const summary = getCartSummary(cart, discount);
  const paidAmount =
    paymentStatus === "debt"
      ? 0
      : paymentStatus === "partial"
        ? Math.min(receivedAmount, summary.total)
        : summary.total;
  const debtAmount = Math.max(summary.total - paidAmount, 0);
  const change =
    paymentMethod === "cash" && paymentStatus === "paid"
      ? Math.max(receivedAmount - summary.total, 0)
      : 0;
  const canPay = cart.length > 0 && (paymentStatus !== "debt" || Boolean(customer));

  function handleConfirmPayment() {
    if (!canPay) return;

    confirmPayment();
    navigate(getBusinessPath(businessSlug, "/receipt-preview"));
  }

  return (
    <section className="grid h-full min-h-0 gap-4 overflow-y-auto xl:grid-cols-[330px_1fr_320px] xl:overflow-hidden">
      <div className="min-h-0 overflow-y-auto rounded-lg border border-blue-100 bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.055)]">
        <h2 className="text-[16px] font-black text-slate-950">Order Summary</h2>
        <div className="mt-4 space-y-2">
          <PaymentSummary label="Subtotal" value={summary.subtotal} />
          <PaymentSummary label="Discount" value={summary.discount} accent />
          <PaymentSummary label="Tax (10%)" value={summary.tax} />
          <div className="flex items-center justify-between border-t border-blue-50 pt-3">
            <span className="text-sm font-black text-slate-950">Total</span>
            <span className="text-xl font-black">{formatMoney(summary.total)}</span>
          </div>
        </div>
        <label className="mt-5 block rounded-lg border border-blue-100 bg-blue-50/40 p-3">
          <span className="text-[12px] font-black text-slate-500">
            Received Now
          </span>
          <input
            type="number"
            min={0}
            disabled={paymentStatus === "debt"}
            value={paymentStatus === "debt" ? 0 : receivedAmount}
            onChange={(event) =>
              setReceivedAmount(Number(event.currentTarget.value))
            }
            className="mt-1 h-10 w-full bg-transparent text-2xl font-black text-slate-950 outline-none disabled:text-slate-400"
          />
        </label>
        <div className="mt-4 rounded-lg bg-emerald-50 p-3">
          <p className="text-[12px] font-black text-emerald-600">
            {paymentStatus === "debt" ? "Debt Balance" : "Change"}
          </p>
          <p className="mt-1 text-2xl font-black text-emerald-600">
            {formatMoney(paymentStatus === "debt" ? debtAmount : change)}
          </p>
        </div>
      </div>

      <div className="min-h-0 overflow-y-auto rounded-lg border border-blue-100 bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.055)]">
        <h2 className="text-[16px] font-black text-slate-950">
          Payment Method
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {paymentStatuses.map((status) => (
            <button
              key={status.id}
              type="button"
              onClick={() => setPaymentStatus(status.id)}
              className={`rounded-lg border p-3 text-left transition ${
                paymentStatus === status.id
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-blue-100 bg-white text-slate-700 hover:bg-blue-50"
              }`}
            >
              <span className="block text-sm font-black">{status.label}</span>
              <span className="mt-1 block text-[11px] font-bold text-slate-500">
                {status.description}
              </span>
            </button>
          ))}
        </div>
        {paymentStatus === "debt" && !customer ? (
          <p className="mt-3 rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs font-bold text-amber-700">
            Debt checkout requires a customer profile with credit terms.
          </p>
        ) : null}
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {paymentMethods.map((method) => (
            <PaymentMethod
              key={method.id}
              active={paymentMethod === method.id}
              icon={method.icon}
              label={method.label}
              onClick={() => setPaymentMethod(method.id)}
            />
          ))}
        </div>
        <button
          type="button"
          className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white text-[13px] font-black text-slate-700 transition hover:bg-blue-50"
        >
          <CreditCard className="h-4 w-4 text-blue-600" />
          Split Payment
        </button>
        <div className="mt-5 grid grid-cols-[140px_1fr] gap-3">
          <Link
            to={getBusinessPath(businessSlug, "")}
            className="flex h-12 items-center justify-center rounded-lg border border-blue-100 bg-white text-sm font-black text-slate-600 transition hover:bg-slate-50"
          >
            Back to Cart
          </Link>
          <button
            type="button"
            disabled={!canPay}
            onClick={handleConfirmPayment}
            className="flex h-12 items-center justify-center rounded-lg bg-blue-600 text-sm font-black text-white shadow-[0_12px_24px_rgba(37,99,235,0.24)] transition hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            {paymentStatus === "debt" ? "Save Debt" : "Confirm Payment"}:{" "}
            {formatMoney(paymentStatus === "debt" ? debtAmount : paidAmount)}
          </button>
        </div>
      </div>

      <div className="min-h-0 overflow-y-auto rounded-lg border border-blue-100 bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.055)]">
        <h2 className="text-[16px] font-black text-slate-950">Order Info</h2>
        <div className="mt-4 space-y-3 text-[12px] font-bold">
          <InfoRow label="Order ID" value={activeOrderId ?? "New Order"} />
          <InfoRow
            label="Table"
            value={orderType === "Take Away" ? "Counter" : selectedTable ?? "No Table"}
          />
          <InfoRow label="Type" value={orderType} />
          <InfoRow label="Cashier" value={cashierName} />
          <InfoRow label="Branch" value={branchName} />
          <InfoRow label="Items" value={String(summary.itemCount)} />
          <InfoRow label="Payment Status" value={paymentStatus.toUpperCase()} />
          <InfoRow label="Paid Now" value={formatMoney(paidAmount)} />
          <InfoRow label="Debt" value={formatMoney(debtAmount)} />
        </div>
        <div className="mt-5 rounded-lg bg-blue-50 p-3">
          <p className="text-[12px] font-black text-blue-600">Customer</p>
          <p className="mt-1 text-sm font-black text-slate-950">
            {customer?.name ?? "Walk-in Customer"}
          </p>
          <p className="text-[11px] font-bold text-slate-500">
            {customer
              ? `${customer.subtitle} - ${customer.customerType} - ${customer.priceList}`
              : "No member selected"}
          </p>
          {customer ? (
            <p className="mt-1 text-[11px] font-bold text-slate-500">
              Debt {formatMoney(customer.debtBalance)} / Limit{" "}
              {formatMoney(customer.creditLimit)} / {customer.paymentTerm}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function ReceiptPreviewView({ businessSlug }: { businessSlug: string }) {
  const navigate = useNavigate();
  const order = usePosTerminalStore((state) => state.lastPaidOrder);
  const startNewSale = usePosTerminalStore((state) => state.startNewSale);

  function handleNewSale() {
    startNewSale();
    navigate(getBusinessPath(businessSlug, "/new-sale"));
  }

  return (
    <section className="grid h-full min-h-0 gap-4 overflow-y-auto xl:grid-cols-[1fr_380px] xl:overflow-hidden">
      <div className="flex min-h-0 items-center justify-center overflow-y-auto rounded-lg border border-blue-100 bg-white p-8 shadow-[0_12px_28px_rgba(15,23,42,0.055)]">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-11 w-11" />
          </div>
          <h1 className="mt-5 text-3xl font-black text-slate-950">
            {order?.paymentStatus === "debt"
              ? "Debt Saved"
              : order?.paymentStatus === "partial"
                ? "Partial Payment Saved"
                : "Payment Successful"}
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-500">
            {order
              ? `Order ${order.id} is ready to print.`
              : "The last paid order is not available."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="flex h-12 items-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-black text-white hover:bg-blue-700"
            >
              <Printer className="h-4 w-4" />
              Print Bill
            </button>
            <button
              type="button"
              onClick={handleNewSale}
              className="flex h-12 items-center gap-2 rounded-lg border border-blue-100 bg-white px-5 text-sm font-black text-blue-600 hover:bg-blue-50"
            >
              <ReceiptText className="h-4 w-4" />
              New Sale
            </button>
          </div>
        </div>
      </div>
      <ReceiptCard order={order} />
    </section>
  );
}

export function RefundView({ businessSlug }: { businessSlug: string }) {
  const refundSearch = usePosTerminalStore((state) => state.refundSearch);
  const refundOrderId = usePosTerminalStore((state) => state.refundOrderId);
  const refundSelectedLineIds = usePosTerminalStore(
    (state) => state.refundSelectedLineIds
  );
  const orders = usePosTerminalStore((state) => state.orders);
  const setRefundSearch = usePosTerminalStore((state) => state.setRefundSearch);
  const selectRefundOrder = usePosTerminalStore(
    (state) => state.selectRefundOrder
  );
  const toggleRefundLine = usePosTerminalStore(
    (state) => state.toggleRefundLine
  );
  const confirmRefund = usePosTerminalStore((state) => state.confirmRefund);
  const order = orders.find((item) => item.id === refundOrderId) ?? null;
  const refundLines = order?.cart ?? [];
  const refundAmount = refundLines
    .filter((line) => refundSelectedLineIds.includes(line.id))
    .reduce((sum, line) => sum + line.price * line.quantity, 0);

  return (
    <section className="grid h-full min-h-0 gap-4 overflow-y-auto xl:grid-cols-[1fr_340px] xl:overflow-hidden">
      <div className="min-h-0 overflow-y-auto rounded-lg border border-blue-100 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.055)]">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
            <RotateCcw className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-950">
              Refund / Return
            </h1>
            <p className="text-[12px] font-bold text-slate-500">
              Search receipt, select items, and confirm refund approval.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_150px]">
          <input
            value={refundSearch}
            onChange={(event) => setRefundSearch(event.currentTarget.value)}
            className="h-12 rounded-lg border border-blue-100 px-4 text-sm font-bold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
            placeholder="Search receipt number or customer"
          />
          <button
            type="button"
            onClick={selectRefundOrder}
            className="h-12 rounded-lg bg-blue-600 text-sm font-black text-white hover:bg-blue-700"
          >
            Find Receipt
          </button>
        </div>
        <div className="mt-5 overflow-hidden rounded-lg border border-blue-100">
          {refundLines.length > 0 ? (
            refundLines.map((line) => (
              <label
                key={line.id}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-blue-50 px-4 py-3 last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={refundSelectedLineIds.includes(line.id)}
                  onChange={() => toggleRefundLine(line.id)}
                  className="h-4 w-4 accent-blue-600"
                />
                <span>
                  <span className="block font-black text-slate-900">
                    {line.name}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {line.quantity} x {formatMoney(line.price)}
                  </span>
                </span>
                <span className="font-black text-slate-700">
                  {formatMoney(line.price * line.quantity)}
                </span>
              </label>
            ))
          ) : (
            <div className="p-5 text-sm font-bold text-slate-500">
              No completed receipt selected.
            </div>
          )}
        </div>
      </div>
      <div className="min-h-0 overflow-y-auto rounded-lg border border-blue-100 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.055)]">
        <h2 className="text-[16px] font-black text-slate-950">
          Refund Summary
        </h2>
        <div className="mt-4 space-y-3">
          <InfoRow label="Receipt" value={order?.id ?? "-"} />
          <InfoRow label="Refund Items" value={String(refundSelectedLineIds.length)} />
          <InfoRow label="Refund Amount" value={formatMoney(refundAmount)} />
          <InfoRow label="Approval" value="Manager required" />
        </div>
        <button
          type="button"
          onClick={confirmRefund}
          className="mt-5 h-12 w-full rounded-lg bg-orange-500 text-sm font-black text-white hover:bg-orange-600"
        >
          Confirm Refund
        </button>
        <Link
          to={getBusinessPath(businessSlug, "")}
          className="mt-3 flex h-12 items-center justify-center rounded-lg border border-blue-100 text-sm font-black text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>
    </section>
  );
}

function PaymentMethod({
  icon: Icon,
  label,
  active = false,
  onClick
}: {
  icon: typeof Banknote;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border text-[12px] font-black transition hover:-translate-y-0.5 ${
        active
          ? "border-emerald-300 bg-emerald-50 text-emerald-600"
          : "border-blue-100 bg-white text-blue-600 hover:bg-blue-50"
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}

function PaymentSummary({
  label,
  value,
  accent = false
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] font-bold text-slate-500">{label}</span>
      <span
        className={`text-[13px] font-black ${
          accent ? "text-emerald-600" : "text-slate-800"
        }`}
      >
        {accent && value > 0 ? "-" : ""}
        {formatMoney(value)}
      </span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-black text-slate-950">{value}</span>
    </div>
  );
}

function ReceiptCard({ order }: { order: OpenOrder | null }) {
  const lines = order?.cart ?? [];
  const summary = getCartSummary(lines, order?.discount ?? null);
  const paidAmount = order?.receivedAmount ?? 0;
  const debtAmount = Math.max(summary.total - paidAmount, 0);
  const paymentLabel =
    paymentMethods.find((method) => method.id === order?.paymentMethod)?.label ??
    "Cash";

  return (
    <div className="h-full min-h-0 overflow-y-auto rounded-lg border border-blue-100 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.055)]">
      <div className="text-center">
        <p className="text-xl font-black text-slate-950">TJ Cafe Vientiane</p>
        <p className="text-[11px] font-bold text-slate-500">
          Rue Setthathirath, Vientiane
        </p>
      </div>
      <div className="my-4 border-t border-dashed border-slate-200" />
      <div className="space-y-2 text-[12px] font-bold">
        <InfoRow label="Receipt" value={order?.id ?? "-"} />
        <InfoRow label="Cashier" value={cashierName} />
        <InfoRow label="Payment" value={paymentLabel} />
        <InfoRow label="Status" value={(order?.paymentStatus ?? "paid").toUpperCase()} />
        <InfoRow label="Time" value={order?.createdAt ?? "-"} />
      </div>
      <div className="my-4 border-t border-dashed border-slate-200" />
      {lines.map((line) => (
        <div key={line.id} className="mb-2 flex items-center justify-between text-[12px]">
          <span className="font-bold text-slate-700">
            {line.quantity} x {line.name}
          </span>
          <span className="font-black text-slate-950">
            {formatMoney(line.price * line.quantity)}
          </span>
        </div>
      ))}
      <div className="my-4 border-t border-dashed border-slate-200" />
      <InfoRow label="Subtotal" value={formatMoney(summary.subtotal)} />
      <InfoRow label="Discount" value={`-${formatMoney(summary.discount)}`} />
      <InfoRow label="Tax" value={formatMoney(summary.tax)} />
      <InfoRow label="Total" value={formatMoney(summary.total)} />
      <InfoRow label="Paid" value={formatMoney(paidAmount)} />
      <InfoRow label="Debt" value={formatMoney(debtAmount)} />
    </div>
  );
}
