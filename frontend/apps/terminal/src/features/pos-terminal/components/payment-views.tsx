import {
  Banknote,
  Building2,
  Printer,
  QrCode,
  ReceiptText,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getTerminalBusiness } from "../data/mock-pos-data";
import { getPosScreenConfig } from "../screens/pos-screen-config";
import { usePosTerminalStore } from "../stores/pos-terminal-store";
import type {
  OpenOrder,
  PaymentMethodId,
  PaymentStatus,
  PosType,
  TerminalBusinessProfile
} from "../types";
import { formatMoney, getBusinessPath, getCartSummary } from "../utils";
import {
  getTerminalCopy,
  getTerminalLocationValue
} from "../utils/terminal-copy";

const paymentMethods: {
  id: PaymentMethodId;
  icon: typeof Banknote;
  label: string;
}[] = [
  { id: "cash", icon: Banknote, label: "ເງິນສົດ" },
  { id: "bank-transfer", icon: Building2, label: "ໂອນທະນາຄານ" },
  { id: "qr-code", icon: QrCode, label: "QR Code" }
];

const paymentStatuses: { id: PaymentStatus; label: string; description: string }[] = [
  { id: "ຈ່າຍແລ້ວ", label: "ຈ່າຍແລ້ວ", description: "ຈ່າຍເຕັມຈຳນວນທັນທີ" },
  { id: "ຈ່າຍບາງສ່ວນ", label: "ຈ່າຍບາງສ່ວນ", description: "ຈ່າຍບາງສ່ວນກ່ອນ" },
  { id: "ຕິດໜີ້", label: "ຕິດໜີ້", description: "ລູກຄ້າຈ່າຍພາຍຫຼັງ" }
];

export function CheckoutView({
  businessSlug,
  screenPosType
}: {
  businessSlug: string;
  screenPosType?: PosType;
}) {
  const navigate = useNavigate();
  const [splitPaymentOpen, setSplitPaymentOpen] = useState(false);
  const business = getTerminalBusiness(businessSlug);
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
  const copy = getTerminalCopy(business.posType);
  const screenConfig = getPosScreenConfig(screenPosType ?? business.posType);
  const theme = screenConfig.theme;
  const CheckoutIcon = screenConfig.checkoutIcon;
  const locationValue = getTerminalLocationValue(
    business.posType,
    orderType,
    selectedTable
  );
  const paidAmount =
    paymentStatus === "ຕິດໜີ້"
      ? 0
      : paymentStatus === "ຈ່າຍບາງສ່ວນ"
        ? Math.min(receivedAmount, summary.total)
        : summary.total;
  const debtAmount = Math.max(summary.total - paidAmount, 0);
  const change =
    paymentMethod === "cash" && paymentStatus === "ຈ່າຍແລ້ວ"
      ? Math.max(receivedAmount - summary.total, 0)
      : 0;
  const canPay = cart.length > 0 && (paymentStatus !== "ຕິດໜີ້" || Boolean(customer));

  function handleConfirmPayment() {
    if (!canPay) return;

    confirmPayment();
    navigate(getBusinessPath(businessSlug, "/receipt-preview"));
  }

  return (
    <section className="grid h-full min-h-0 gap-3 overflow-y-auto lg:grid-cols-[300px_minmax(0,1fr)_300px] lg:overflow-hidden xl:grid-cols-[330px_minmax(0,1fr)_320px]">
      <div className={`min-h-0 overflow-y-auto rounded-lg border bg-white p-4 ${theme.border} ${theme.shadow}`}>
        <h2 className="text-[16px] font-black text-slate-950">
          {copy.summaryTitle}
        </h2>
        <div className="mt-4 space-y-2">
          <PaymentSummary label="ຍອດກ່ອນຫຼຸດ" value={summary.subtotal} />
          <PaymentSummary label="ສ່ວນຫຼຸດ" value={summary.discount} accent />
          <PaymentSummary label="ອາກອນ (10%)" value={summary.tax} />
          <div className={`flex items-center justify-between border-t pt-3 ${theme.border}`}>
            <span className="text-sm font-black text-slate-950">{"ລວມທັງໝົດ"}</span>
            <span className="text-xl font-black">{formatMoney(summary.total)}</span>
          </div>
        </div>
        <label className={`mt-5 block rounded-lg border p-3 ${theme.border} ${theme.softerBg}`}>
          <span className="text-[12px] font-black text-slate-500">
            {"ຮັບເງິນຕອນນີ້"}
          </span>
          <input
            type="number"
            min={0}
            disabled={paymentStatus === "ຕິດໜີ້"}
            value={paymentStatus === "ຕິດໜີ້" ? 0 : receivedAmount}
            onChange={(event) =>
              setReceivedAmount(Number(event.currentTarget.value))
            }
            className="mt-1 h-10 w-full bg-transparent text-2xl font-black text-slate-950 outline-none disabled:text-slate-400"
          />
        </label>
        <div className="mt-4 rounded-lg bg-emerald-50 p-3">
          <p className="text-[12px] font-black text-emerald-600">
            {paymentStatus === "ຕິດໜີ້" ? "ຍອດໜີ້" : "ເງິນທອນ"}
          </p>
          <p className="mt-1 text-2xl font-black text-emerald-600">
            {formatMoney(paymentStatus === "ຕິດໜີ້" ? debtAmount : change)}
          </p>
        </div>
      </div>

      <div className={`min-h-0 overflow-y-auto rounded-lg border bg-white p-4 ${theme.border} ${theme.shadow}`}>
        <div className={`rounded-lg border p-3 ${theme.border} ${theme.softerBg}`}>
          <div className="flex items-start gap-3">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${theme.iconBox}`}>
              <CheckoutIcon className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-black text-slate-950">
                {screenConfig.checkout.title}
              </h1>
              <p className="text-[12px] font-bold text-slate-500">
                {screenConfig.checkout.description}
              </p>
            </div>
          </div>
          <div className="mt-3 rounded-md bg-white px-3 py-2 text-[12px] font-black text-slate-700">
            <span className={`mr-2 ${theme.activeText}`}>
              {screenConfig.checkout.focusLabel}
            </span>
            {screenConfig.checkout.focusValue}
          </div>
        </div>
        <h2 className="mt-4 text-[16px] font-black text-slate-950">
          {"ວິທີຊຳລະ"}
        </h2>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          {screenConfig.checkout.contextCards.map((card) => (
            <div
              key={`${card.label}-${card.value}`}
              className={`rounded-lg border p-3 ${theme.border} ${theme.softerBg}`}
            >
              <p className={`text-[11px] font-black ${theme.activeText}`}>
                {card.label}
              </p>
              <p className="mt-1 text-[12px] font-black text-slate-950">
                {card.value}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          {paymentStatuses.map((status) => (
            <button
              key={status.id}
              type="button"
              onClick={() => setPaymentStatus(status.id)}
              className={`rounded-lg border p-3 text-left transition ${
                paymentStatus === status.id
                  ? `${theme.borderStrong} ${theme.softBg} ${theme.text}`
                  : `${theme.border} bg-white text-slate-700 ${theme.rowHover}`
              }`}
            >
              <span className="block text-sm font-black">{status.label}</span>
              <span className="mt-1 block text-[11px] font-bold text-slate-500">
                {status.description}
              </span>
            </button>
          ))}
        </div>
        {paymentStatus === "ຕິດໜີ້" && !customer ? (
          <p className="mt-3 rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs font-bold text-amber-700">
            {copy.debtRequiresCustomerMessage}
          </p>
        ) : null}
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {paymentMethods.map((method) => (
            <PaymentMethod
              key={method.id}
              active={paymentMethod === method.id}
              icon={method.icon}
              label={method.label}
              theme={theme}
              onClick={() => setPaymentMethod(method.id)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSplitPaymentOpen((value) => !value)}
          className={`mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg border text-[13px] font-black transition ${
            splitPaymentOpen
              ? `${theme.borderStrong} ${theme.softBg} ${theme.text}`
              : `${theme.border} bg-white text-slate-700 ${theme.rowHover}`
          }`}
        >
          <Banknote className={`h-4 w-4 ${theme.activeText}`} />
          {"ແບ່ງການຊຳລະ"}
        </button>
        {splitPaymentOpen ? (
          <div className={`mt-3 rounded-lg border p-3 ${theme.border} ${theme.softerBg}`}>
            <p className={`text-[12px] font-black ${theme.text}`}>
              {"ແບ່ງການຊຳລະ"}
            </p>
            <div className="mt-2 space-y-2">
              <SplitRow label="ເງິນສົດ" value={formatMoney(Math.round(summary.total * 0.4))} />
              <SplitRow
                label="ໂອນທະນາຄານ"
                value={formatMoney(Math.round(summary.total * 0.35))}
              />
              <SplitRow
                label="QR Code"
                value={formatMoney(
                  summary.total -
                    Math.round(summary.total * 0.4) -
                    Math.round(summary.total * 0.35)
                )}
              />
            </div>
          </div>
        ) : null}
        <div className="mt-5 grid grid-cols-[140px_1fr] gap-3">
          <Link
            to={getBusinessPath(businessSlug, "")}
            className={`flex h-12 items-center justify-center rounded-lg border bg-white text-sm font-black text-slate-600 transition ${theme.border} ${theme.rowHover}`}
          >
            {copy.backToCartLabel}
          </Link>
          <button
            type="button"
            disabled={!canPay}
            onClick={handleConfirmPayment}
            className={`flex h-12 items-center justify-center rounded-lg text-sm font-black text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition ${theme.activeBg} ${theme.activeHoverBg} disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none`}
          >
            {paymentStatus === "ຕິດໜີ້" ? "ບັນທຶກໜີ້" : "ຢືນຢັນການຊຳລະ"}:{" "}
            {formatMoney(paymentStatus === "ຕິດໜີ້" ? debtAmount : paidAmount)}
          </button>
        </div>
      </div>

      <div className={`min-h-0 overflow-y-auto rounded-lg border bg-white p-4 ${theme.border} ${theme.shadow}`}>
        <h2 className="text-[16px] font-black text-slate-950">
          {copy.infoTitle}
        </h2>
        <div className="mt-4 space-y-3 text-[12px] font-bold">
          <InfoRow
            label={copy.primaryIdLabel}
            value={activeOrderId ?? copy.newRecordLabel}
          />
          <InfoRow label={copy.locationLabel} value={locationValue} />
          <InfoRow label="ປະເພດ" value={orderType} />
          <InfoRow label="ແຄັດເຊຍ" value={business.cashierName} />
          <InfoRow label="ສາຂາ" value={business.branchName} />
          <InfoRow label="ລາຍການ" value={String(summary.itemCount)} />
          <InfoRow label="ສະຖານະຊຳລະ" value={paymentStatus} />
          <InfoRow label="ຈ່າຍແລ້ວ" value={formatMoney(paidAmount)} />
          <InfoRow label="ຕິດໜີ້" value={formatMoney(debtAmount)} />
        </div>
        <div className={`mt-5 rounded-lg p-3 ${theme.softBg}`}>
          <p className={`text-[12px] font-black ${theme.activeText}`}>
            {copy.customerLabel}
          </p>
          <p className="mt-1 text-sm font-black text-slate-950">
            {customer?.name ?? copy.walkInLabel}
          </p>
          <p className="text-[11px] font-bold text-slate-500">
            {customer
              ? `${customer.subtitle} - ${customer.customerType} - ${customer.priceList}`
              : copy.noCustomerSelectedLabel}
          </p>
          {customer ? (
            <p className="mt-1 text-[11px] font-bold text-slate-500">
              {"ຕິດໜີ້"} {formatMoney(customer.debtBalance)} / {"ວົງເງິນ"}{" "}
              {formatMoney(customer.creditLimit)} / {customer.paymentTerm}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function ReceiptPreviewView({
  businessSlug,
  screenPosType
}: {
  businessSlug: string;
  screenPosType?: PosType;
}) {
  const navigate = useNavigate();
  const business = getTerminalBusiness(businessSlug);
  const copy = getTerminalCopy(business.posType);
  const screenConfig = getPosScreenConfig(screenPosType ?? business.posType);
  const theme = screenConfig.theme;
  const order = usePosTerminalStore((state) => state.lastPaidOrder);
  const startNewSale = usePosTerminalStore((state) => state.startNewSale);
  const ReceiptIcon = screenConfig.receiptIcon;
  const receiptTitle =
    order?.paymentStatus === "ຕິດໜີ້"
      ? screenConfig.receipt.debtTitle
      : order?.paymentStatus === "ຈ່າຍບາງສ່ວນ"
        ? screenConfig.receipt.partialTitle
        : screenConfig.receipt.title;

  function handleNewSale() {
    startNewSale();
    navigate(getBusinessPath(businessSlug, "/new-sale"));
  }

  return (
    <section className="grid h-full min-h-0 gap-3 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_340px] lg:overflow-hidden xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className={`flex min-h-0 items-center justify-center overflow-y-auto rounded-lg border bg-white p-8 ${theme.border} ${theme.shadow}`}>
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <ReceiptIcon className="h-10 w-10" />
          </div>
          <h1 className="mt-5 text-3xl font-black text-slate-950">
            {receiptTitle}
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-500">
            {order
              ? `${copy.receiptEntityLabel} ${order.id}. ${screenConfig.receipt.description}`
              : copy.missingPaidRecordMessage}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className={`flex h-12 items-center gap-2 rounded-lg px-5 text-sm font-black text-white ${theme.activeBg} ${theme.activeHoverBg}`}
            >
              <Printer className="h-4 w-4" />
              {"ພິມບິນ"}
            </button>
            <button
              type="button"
              onClick={handleNewSale}
              className={`flex h-12 items-center gap-2 rounded-lg border bg-white px-5 text-sm font-black ${theme.border} ${theme.activeText} ${theme.rowHover}`}
            >
              <ReceiptText className="h-4 w-4" />
              {copy.newPrimaryActionLabel}
            </button>
          </div>
          <div className={`mt-6 rounded-lg border p-4 text-left ${theme.border} ${theme.softerBg}`}>
            <p className={`text-[12px] font-black ${theme.activeText}`}>
              {"ຂັ້ນຕອນຕໍ່ໄປ"}
            </p>
            <div className="mt-3 space-y-2">
              {screenConfig.receipt.nextSteps.map((step) => (
                <div key={step} className="flex items-center gap-2 text-[12px] font-black text-slate-700">
                  <span className={`h-2 w-2 rounded-full ${theme.activeBg}`} />
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ReceiptCard order={order} business={business} screenPosType={screenPosType} />
    </section>
  );
}

export function RefundView({
  businessSlug,
  screenPosType
}: {
  businessSlug: string;
  screenPosType?: PosType;
}) {
  const business = getTerminalBusiness(businessSlug);
  const screenConfig = getPosScreenConfig(screenPosType ?? business.posType);
  const theme = screenConfig.theme;
  const RefundIcon = screenConfig.refundIcon;
  const [refundType, setRefundType] = useState<"full" | "ຈ່າຍບາງສ່ວນ">("ຈ່າຍບາງສ່ວນ");
  const [restockReturnedItems, setRestockReturnedItems] = useState(true);
  const [refundReason, setRefundReason] = useState("ລູກຄ້າຮ້ອງຂໍ");
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
    <section className="grid h-full min-h-0 gap-3 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_320px] lg:overflow-hidden xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className={`min-h-0 overflow-y-auto rounded-lg border bg-white p-5 ${theme.border} ${theme.shadow}`}>
        <div className="flex items-center gap-3">
          <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${theme.iconBox}`}>
            <RefundIcon className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-950">
              {screenConfig.refund.title}
            </h1>
            <p className="text-[12px] font-bold text-slate-500">
              {screenConfig.refund.description}
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_150px]">
          <input
            value={refundSearch}
            onChange={(event) => setRefundSearch(event.currentTarget.value)}
            className={`h-12 rounded-lg border px-4 text-sm font-bold outline-none focus:ring-4 ${theme.border} ${theme.focusRing}`}
            placeholder={"ຄົ້ນຫາເລກບິນ ຫຼື ລູກຄ້າ"}
          />
          <button
            type="button"
            onClick={selectRefundOrder}
            className={`h-12 rounded-lg text-sm font-black text-white ${theme.activeBg} ${theme.activeHoverBg}`}
          >
            {"ຄົ້ນຫາບິນ"}
          </button>
        </div>
        <div className={`mt-5 overflow-hidden rounded-lg border ${theme.border}`}>
          {refundLines.length > 0 ? (
            refundLines.map((line) => (
              <label
                key={line.id}
                className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b px-4 py-3 last:border-b-0 ${theme.border}`}
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
              {"ຍັງບໍ່ເລືອກບິນທີ່ສຳເລັດ."}
            </div>
          )}
        </div>
      </div>
      <div className={`min-h-0 overflow-y-auto rounded-lg border bg-white p-5 ${theme.border} ${theme.shadow}`}>
        <h2 className="text-[16px] font-black text-slate-950">
          {"ສະຫຼຸບການຄືນເງິນ"}
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {(["ຈ່າຍບາງສ່ວນ", "full"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setRefundType(type)}
              className={`h-10 rounded-lg border text-[12px] font-black ${
                refundType === type
                  ? `${theme.borderStrong} ${theme.softBg} ${theme.activeText}`
                  : `${theme.border} bg-white text-slate-600 ${theme.rowHover}`
              }`}
            >
              {type === "full" ? "ຄືນເງິນທັງໝົດ" : "ຄືນເງິນບາງສ່ວນ"}
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          <InfoRow label="ບິນ" value={order?.id ?? "-"} />
          <InfoRow label="ລາຍການຄືນ" value={String(refundSelectedLineIds.length)} />
          <InfoRow label="ຈຳນວນເງິນຄືນ" value={formatMoney(refundAmount)} />
          <InfoRow label="ອະນຸມັດ" value="ຕ້ອງໃຫ້ຜູ້ຈັດການອະນຸມັດ" />
        </div>
        <label className={`mt-4 flex items-start gap-3 rounded-lg border p-3 ${theme.border} ${theme.softerBg}`}>
          <input
            type="checkbox"
            checked={restockReturnedItems}
            onChange={(event) => setRestockReturnedItems(event.currentTarget.checked)}
            className="mt-1 h-4 w-4 accent-blue-600"
          />
          <span>
            <span className="block text-[12px] font-black text-slate-900">
              {"ນຳລາຍການຄືນເຂົ້າສະຕັອກ"}
            </span>
            <span className="mt-1 block text-[11px] font-bold text-slate-500">
              {screenConfig.refund.restockHint}
            </span>
          </span>
        </label>
        <label className="mt-4 block">
          <span className="text-[12px] font-black text-slate-500">
            {"ເຫດຜົນຄືນເງິນ"}
          </span>
          <select
            value={refundReason}
            onChange={(event) => setRefundReason(event.currentTarget.value)}
            className={`mt-2 h-11 w-full rounded-lg border bg-white px-3 text-sm font-bold outline-none focus:ring-4 ${theme.border} ${theme.focusRing}`}
          >
            {["ລູກຄ້າຮ້ອງຂໍ", "ລາຍການຜິດ", "ສິນຄ້າເສຍຫາຍ", "ແກ້ໄຂລາຄາ"].map(
              (reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              )
            )}
          </select>
        </label>
        <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-3 text-[12px] font-bold text-amber-700">
          {screenConfig.refund.approvalHint}
        </div>
        <div className="mt-4 grid gap-2">
          {screenConfig.refund.ruleCards.map((rule) => (
            <div
              key={`${rule.label}-${rule.value}`}
              className={`rounded-lg border p-3 ${theme.border} ${theme.softerBg}`}
            >
              <p className={`text-[11px] font-black ${theme.activeText}`}>
                {rule.label}
              </p>
              <p className="mt-1 text-[12px] font-black text-slate-950">
                {rule.value}
              </p>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={confirmRefund}
          className={`mt-5 h-12 w-full rounded-lg text-sm font-black text-white ${theme.activeBg} ${theme.activeHoverBg}`}
        >
          {"ຢືນຢັນຄືນເງິນ"}
        </button>
        <Link
          to={getBusinessPath(businessSlug, "")}
          className={`mt-3 flex h-12 items-center justify-center rounded-lg border text-sm font-black text-slate-600 ${theme.border} ${theme.rowHover}`}
        >
          {"ຍົກເລີກ"}
        </Link>
      </div>
    </section>
  );
}

function PaymentMethod({
  icon: Icon,
  label,
  active = false,
  theme,
  onClick
}: {
  icon: typeof Banknote;
  label: string;
  active?: boolean;
  theme: ReturnType<typeof getPosScreenConfig>["theme"];
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border text-[12px] font-black transition hover:-translate-y-0.5 ${
        active
          ? `${theme.borderStrong} ${theme.softBg} ${theme.activeText}`
          : `${theme.border} bg-white ${theme.activeText} ${theme.rowHover}`
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}

function SplitRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-white px-3 py-2">
      <span className="text-[12px] font-bold text-slate-500">{label}</span>
      <span className="text-[12px] font-black text-slate-950">{value}</span>
    </div>
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

function ReceiptCard({
  order,
  business,
  screenPosType
}: {
  order: OpenOrder | null;
  business: TerminalBusinessProfile;
  screenPosType?: PosType;
}) {
  const lines = order?.cart ?? [];
  const summary = getCartSummary(lines, order?.discount ?? null);
  const paidAmount = order?.receivedAmount ?? 0;
  const debtAmount = Math.max(summary.total - paidAmount, 0);
  const paymentLabel =
    paymentMethods.find((method) => method.id === order?.paymentMethod)?.label ??
    "ເງິນສົດ";
  const copy = getTerminalCopy(business.posType);
  const screenConfig = getPosScreenConfig(screenPosType ?? business.posType);
  const theme = screenConfig.theme;

  return (
    <div className={`h-full min-h-0 overflow-y-auto rounded-lg border bg-white p-5 ${theme.border} ${theme.shadow}`}>
      <div className="text-center">
        <p className="text-xl font-black text-slate-950">{business.name}</p>
        <p className="text-[11px] font-bold text-slate-500">
          {"ຖະໜົນເສດຖາທິລາດ, ວຽງຈັນ"}
        </p>
      </div>
      <div className="my-4 border-t border-dashed border-slate-200" />
      <div className="space-y-2 text-[12px] font-bold">
        <InfoRow label={copy.primaryIdLabel} value={order?.id ?? "-"} />
        <InfoRow label="ແຄັດເຊຍ" value={business.cashierName} />
        <InfoRow label="ການຊຳລະ" value={paymentLabel} />
        <InfoRow label="ສະຖານະ" value={order?.paymentStatus ?? "ຈ່າຍແລ້ວ"} />
        <InfoRow label="ເວລາ" value={order?.createdAt ?? "-"} />
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
      <InfoRow label="ຍອດກ່ອນຫຼຸດ" value={formatMoney(summary.subtotal)} />
      <InfoRow label="ສ່ວນຫຼຸດ" value={`-${formatMoney(summary.discount)}`} />
      <InfoRow label="ອາກອນ" value={formatMoney(summary.tax)} />
      <InfoRow label="ລວມທັງໝົດ" value={formatMoney(summary.total)} />
      <InfoRow label="ຈ່າຍແລ້ວ" value={formatMoney(paidAmount)} />
      <InfoRow label="ຕິດໜີ້" value={formatMoney(debtAmount)} />
    </div>
  );
}
