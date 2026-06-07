import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import {
  customerBankDetails,
  customerBusinessBrand,
  customerDisplayDevice,
  customerPaymentMethods
} from "../data/customer-display-data";
import { DisplayFooterNote } from "../components/display-footer-note";
import { DisplayHeader } from "../components/display-header";
import { OrderReview } from "../components/order-review";
import {
  BankDetailsCard,
  OrderSummaryCard,
  PaymentMethodCard
} from "../components/payment-panel";
import { PaymentMethods } from "../components/payment-methods";
import { CustomerDisplayShell } from "../components/customer-display-shell";
import { CafeLineArt, SuccessConfetti } from "../components/display-illustrations";
import { useCustomerDisplayStore } from "../stores/customer-display-store";
import type {
  CustomerDisplayRouteMode,
  CustomerDisplayScreen
} from "../types";
import { formatDisplayMoney } from "../utils";
import { resolveDisplayScreen } from "../utils";
import { lo } from "../utils/lao-labels";
import {
  Banknote,
  BadgeCheck,
  CheckCircle2,
  Coffee,
  MonitorSmartphone,
  QrCode,
  ReceiptText,
  ShieldCheck,
  Timer
} from "lucide-react";

function IdleScreen() {
  return (
    <>
      <div className="grid h-full min-h-0 grid-cols-[minmax(0,1.28fr)_minmax(520px,0.82fr)] items-center gap-12 overflow-hidden">
        <section className="min-w-0">
          <h1 className="text-[88px] font-black leading-[0.98] tracking-normal text-[#071633]">
            {lo("Welcome to TJ POS")}
          </h1>
          <p className="mt-7 text-[30px] font-medium text-slate-600">
            {lo("Your order details will appear here during checkout.")}
          </p>

          <div className="relative mt-9 h-[356px] overflow-hidden rounded-[26px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-[0_16px_42px_rgba(13,91,255,0.08)]">
            <div className="absolute inset-x-8 bottom-2 top-6 opacity-70">
              <CafeLineArt />
            </div>
            <Coffee
              className="absolute right-12 bottom-9 h-[112px] w-[112px] text-blue-300"
              strokeWidth={1.5}
            />
          </div>
        </section>

        <section className="rounded-[24px] border border-blue-100 bg-white p-9 shadow-[0_18px_44px_rgba(13,91,255,0.1)]">
          <div className="flex items-center gap-6">
            <div className="flex h-[78px] w-[78px] items-center justify-center rounded-[18px] border border-blue-100 bg-blue-50 text-blue-600">
              <ReceiptText className="h-12 w-12" strokeWidth={2.4} />
            </div>
            <div>
              <h2 className="text-[40px] font-black leading-none text-[#071633]">
                {lo("We Accept")}
              </h2>
              <p className="mt-4 text-[22px] font-medium text-slate-600">
                {lo("Multiple payment options for your convenience.")}
              </p>
            </div>
          </div>
          <div className="mt-9">
            <PaymentMethods methods={customerPaymentMethods} />
          </div>
          <div className="mt-8 flex items-center gap-4 border-t border-blue-100 pt-7 text-[21px] font-medium text-slate-600">
            <ShieldCheck className="h-8 w-8 text-blue-600" strokeWidth={2.5} />
            <span>{lo("All payments are secure and protected.")}</span>
          </div>
        </section>
      </div>

      <DisplayFooterNote
        icon={MonitorSmartphone}
        title="Please review your order on this screen during payment."
        subtitle="This customer display updates automatically from the cashier POS."
      />
    </>
  );
}

function ReviewScreen() {
  const order = useCustomerDisplayStore((state) => state.order);
  const selectedPaymentMethod = useCustomerDisplayStore(
    (state) => state.selectedPaymentMethod
  );

  return (
    <>
      <div className="grid h-full min-h-0 grid-cols-[minmax(0,1.12fr)_600px] gap-9 overflow-hidden">
        <section className="flex min-h-0 min-w-0 flex-col">
          <h1 className="shrink-0 text-[66px] font-black leading-none text-[#071633]">
            {lo("Review Your Order")}
          </h1>
          <p className="mt-4 shrink-0 text-[27px] font-medium text-slate-600">
            {lo("Please confirm your items before payment.")}
          </p>
          <div className="mt-7 min-h-0 flex-1">
            <OrderReview order={order} />
          </div>
        </section>

        <aside className="flex min-h-0 flex-col justify-center gap-6 overflow-hidden">
          <OrderSummaryCard order={order} />
          <PaymentMethodCard
            selected={selectedPaymentMethod}
            note="QR Code is available and ready"
          />
        </aside>
      </div>

      <DisplayFooterNote
        icon={MonitorSmartphone}
        title="Please review your order on the cashier screen"
        subtitle="Tap nothing here - this display is for customer viewing only."
      />
    </>
  );
}

function PaymentScreen() {
  const order = useCustomerDisplayStore((state) => state.order);
  const selectedPaymentMethod = useCustomerDisplayStore(
    (state) => state.selectedPaymentMethod
  );

  return (
    <>
      <div className="grid h-full min-h-0 grid-cols-[minmax(0,1.18fr)_650px] gap-9 overflow-hidden">
        <section className="flex min-h-0 min-w-0 flex-col">
          <h1 className="shrink-0 text-[66px] font-black leading-none text-[#071633]">
            {lo("Scan to Pay")}
          </h1>
          <p className="mt-4 shrink-0 text-[27px] font-medium text-slate-600">
            {lo("Please complete your payment using QR code or bank transfer.")}
          </p>

          <div className="mt-7 flex min-h-0 flex-1 flex-col items-center justify-center rounded-[24px] border border-blue-100 bg-white p-6 shadow-[0_18px_44px_rgba(13,91,255,0.1)]">
            <h2 className="text-[28px] font-black text-[#071633]">
              {lo("Scan with your banking app")}
            </h2>
            <div className="relative mt-5">
              <img
                src={customerBankDetails.qrImageUrl}
                alt="Payment QR code"
                className="h-[330px] w-[330px] object-contain 2xl:h-[370px] 2xl:w-[370px]"
              />
              <div className="absolute top-1/2 left-1/2 flex h-[104px] w-[104px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[24px] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.2)]">
                <img
                  src={customerBusinessBrand.logo}
                  alt="TJ POS"
                  className="h-10 w-20 object-contain"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 text-[19px] font-bold text-blue-600">
              <ShieldCheck className="h-7 w-7" strokeWidth={2.5} />
              <span>{lo("Secure payment - Powered by TJ POS")}</span>
            </div>
          </div>
        </section>

        <aside className="flex min-h-0 flex-col gap-4 overflow-hidden">
          <OrderSummaryCard order={order} density="compact" />
          <BankDetailsCard bank={customerBankDetails} />
          <PaymentMethodCard selected={selectedPaymentMethod} size="small" />
        </aside>
      </div>

      <DisplayFooterNote
        icon={Timer}
        title="After payment, please wait for cashier confirmation."
        subtitle="Thank you for your payment!"
      />
    </>
  );
}

function SuccessScreen() {
  const order = useCustomerDisplayStore((state) => state.order);

  const stats = [
    { label: "Paid Amount", value: formatDisplayMoney(order.summary.total), icon: Banknote },
    { label: "Payment Method", value: "QR Code", icon: QrCode },
    { label: "Order No.", value: order.id, icon: ReceiptText },
    { label: "Status", value: "Completed", icon: BadgeCheck }
  ];

  return (
    <>
      <section className="relative flex h-full min-h-0 flex-col items-center justify-center text-center">
        <SuccessConfetti />
        <div className="flex h-[166px] w-[166px] items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_78px_rgba(16,185,129,0.35)]">
          <CheckCircle2 className="h-[116px] w-[116px]" strokeWidth={2.3} />
        </div>
        <h1 className="mt-7 text-[74px] font-black leading-none text-[#071633]">
          {lo("Payment Successful")}
        </h1>
        <p className="mt-6 text-[38px] font-medium text-slate-600">
          {lo("Thank you for your purchase!")}
        </p>

        <div className="mt-9 grid w-[1180px] max-w-full grid-cols-4 rounded-[22px] border border-blue-100 bg-white px-8 py-7 shadow-[0_18px_44px_rgba(13,91,255,0.1)]">
          {stats.map(({ label, value, icon: Icon }, index) => (
            <div
              key={label}
              className={`px-8 ${index === 0 ? "" : "border-l border-blue-100"}`}
            >
              <Icon className="mx-auto h-9 w-9 text-blue-600" strokeWidth={2.4} />
              <div className="mt-3 text-[21px] font-medium text-slate-600">
                {lo(label)}
              </div>
              <div
                className={`mt-4 text-[28px] font-black ${
                  label === "Status" ? "text-emerald-500" : "text-blue-600"
                }`}
              >
                {lo(value)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-4 text-[24px] font-medium text-slate-600">
          <ShieldCheck className="h-8 w-8 text-blue-600" strokeWidth={2.5} />
          <span>{lo("Please keep your receipt and wait for your order.")}</span>
        </div>
      </section>

      <DisplayFooterNote
        icon={Coffee}
        title="Thank you and enjoy your meal!"
        subtitle="We appreciate your visit and hope to see you again soon."
      />
    </>
  );
}

function PairScreen() {
  return (
    <section className="grid min-h-0 flex-1 place-items-center">
      <div className="grid w-[1180px] max-w-full grid-cols-[1fr_420px] gap-10 rounded-[28px] border border-blue-100 bg-white p-10 shadow-[0_24px_70px_rgba(13,91,255,0.12)]">
        <div>
          <div className="flex h-20 w-20 items-center justify-center rounded-[22px] border border-blue-100 bg-blue-50 text-blue-600">
            <MonitorSmartphone className="h-12 w-12" strokeWidth={2.5} />
          </div>
          <h1 className="mt-10 text-[64px] font-black leading-none text-[#071633]">
            {lo("Pair Customer Display")}
          </h1>
          <p className="mt-6 max-w-[720px] text-[28px] font-medium leading-relaxed text-slate-600">
            {lo("Connect this display to the cashier POS device for live order and payment updates.")}
          </p>

          <div className="mt-12 grid grid-cols-3 gap-5">
            {["Counter Display", "Live POS Sync", "Secure Session"].map((item) => (
              <div
                key={item}
                className="rounded-[18px] border border-blue-100 bg-blue-50/50 px-6 py-5 text-[20px] font-black text-blue-600"
              >
                {lo(item)}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-blue-100 bg-blue-50/45 p-8 text-center">
          <div className="text-[18px] font-black uppercase tracking-[0.18em] text-slate-500">
            {lo("Pairing Code")}
          </div>
          <div className="mt-4 rounded-[20px] bg-white px-8 py-7 text-[58px] font-black tracking-[0.16em] text-blue-600 shadow-[0_12px_30px_rgba(13,91,255,0.1)]">
            {customerDisplayDevice.pairCode}
          </div>
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=12&data=TJ-POS%7CCD-COUNTER-01%7C824519"
            alt="Pairing QR code"
            className="mx-auto mt-8 h-[250px] w-[250px] rounded-[18px] bg-white p-4 shadow-[0_12px_30px_rgba(13,91,255,0.1)]"
          />
          <p className="mt-7 text-[20px] font-bold text-slate-600">
            {lo("Waiting for POS device confirmation")}
          </p>
        </div>
      </div>
    </section>
  );
}

export function CustomerDisplayPage({ mode }: { mode: CustomerDisplayRouteMode }) {
  const { deviceId } = useParams();
  const [searchParams] = useSearchParams();
  const screenFromStore = useCustomerDisplayStore((state) => state.screen);
  const setScreen = useCustomerDisplayStore((state) => state.setScreen);
  const setDeviceId = useCustomerDisplayStore((state) => state.setDeviceId);
  const order = useCustomerDisplayStore((state) => state.order);

  const routeScreen: CustomerDisplayScreen =
    mode === "pair"
      ? "pair"
      : mode === "idle"
        ? "idle"
        : resolveDisplayScreen(searchParams.get("state"), "review");

  useEffect(() => {
    setScreen(routeScreen);
  }, [routeScreen, setScreen]);

  useEffect(() => {
    if (deviceId) {
      setDeviceId(deviceId);
    }
  }, [deviceId, setDeviceId]);

  const activeScreen = screenFromStore === routeScreen ? screenFromStore : routeScreen;

  return (
    <CustomerDisplayShell>
      <DisplayHeader
        brand={customerBusinessBrand}
        device={customerDisplayDevice}
        order={order}
        screen={activeScreen}
      />
      {activeScreen === "idle" ? (
        <IdleScreen />
      ) : activeScreen === "payment" ? (
        <PaymentScreen />
      ) : activeScreen === "success" ? (
        <SuccessScreen />
      ) : activeScreen === "pair" ? (
        <PairScreen />
      ) : (
        <ReviewScreen />
      )}
    </CustomerDisplayShell>
  );
}
