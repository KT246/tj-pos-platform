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
      <div className="grid h-full min-h-0 grid-cols-[minmax(0,1.28fr)_minmax(420px,0.82fr)] items-center gap-[clamp(24px,3vw,48px)] overflow-hidden">
        <section className="min-w-0">
          <h1 className="pt-1 pl-1 text-[clamp(52px,5.2vw,88px)] font-black leading-[1.05] tracking-normal text-[#071633]">
            {lo("Welcome to TJ POS")}
          </h1>
          <p className="mt-[clamp(14px,2.3vh,28px)] text-[clamp(21px,2vw,30px)] font-medium text-slate-600">
            {lo("Your order details will appear here during checkout.")}
          </p>

          <div className="relative mt-[clamp(18px,2.8vh,36px)] h-[clamp(220px,34vh,356px)] overflow-hidden rounded-[26px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-[0_16px_42px_rgba(13,91,255,0.08)]">
            <div className="absolute inset-x-8 bottom-2 top-6 opacity-70">
              <CafeLineArt />
            </div>
            <Coffee
              className="absolute right-12 bottom-9 h-[clamp(74px,10vh,112px)] w-[clamp(74px,10vh,112px)] text-blue-300"
              strokeWidth={1.5}
            />
          </div>
        </section>

        <section className="rounded-[24px] border border-blue-100 bg-white p-[clamp(24px,2.7vw,36px)] shadow-[0_18px_44px_rgba(13,91,255,0.1)]">
          <div className="flex items-center gap-[clamp(18px,2vw,24px)]">
            <div className="flex h-[clamp(60px,7.6vh,78px)] w-[clamp(60px,7.6vh,78px)] items-center justify-center rounded-[18px] border border-blue-100 bg-blue-50 text-blue-600">
              <ReceiptText className="h-[clamp(36px,4.8vh,48px)] w-[clamp(36px,4.8vh,48px)]" strokeWidth={2.4} />
            </div>
            <div>
              <h2 className="text-[clamp(30px,2.7vw,40px)] font-black leading-none text-[#071633]">
                {lo("We Accept")}
              </h2>
              <p className="mt-[clamp(10px,1.6vh,16px)] text-[clamp(17px,1.45vw,22px)] font-medium text-slate-600">
                {lo("Multiple payment options for your convenience.")}
              </p>
            </div>
          </div>
          <div className="mt-[clamp(20px,3vh,36px)]">
            <PaymentMethods methods={customerPaymentMethods} />
          </div>
          <div className="mt-[clamp(18px,2.6vh,32px)] flex items-center gap-4 border-t border-blue-100 pt-[clamp(16px,2.4vh,28px)] text-[clamp(17px,1.4vw,21px)] font-medium text-slate-600">
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
      <div className="grid h-full min-h-0 grid-cols-[minmax(0,1.12fr)_minmax(470px,0.72fr)] gap-[clamp(20px,2.4vw,36px)] overflow-hidden">
        <section className="flex min-h-0 min-w-0 flex-col">
          <h1 className="shrink-0 pt-1 pl-[clamp(12px,1.2vw,18px)] text-[clamp(36px,3.5vw,58px)] font-black leading-[1.1] text-[#071633]">
            {lo("Review Your Order")}
          </h1>
          <p className="mt-[clamp(6px,1.2vh,14px)] shrink-0 text-[clamp(17px,1.55vw,24px)] font-medium text-slate-600">
            {lo("Please confirm your items before payment.")}
          </p>
          <div className="mt-[clamp(10px,1.8vh,20px)] min-h-0 flex-1">
            <OrderReview order={order} />
          </div>
        </section>

        <aside className="flex min-h-0 flex-col justify-center gap-[clamp(16px,2.3vh,24px)] overflow-hidden">
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
      <div className="grid h-full min-h-0 grid-cols-[minmax(0,1.18fr)_minmax(500px,0.78fr)] gap-[clamp(20px,2.4vw,36px)] overflow-hidden">
        <section className="flex min-h-0 min-w-0 flex-col">
          <h1 className="shrink-0 pt-1 pl-[clamp(12px,1.2vw,18px)] text-[clamp(36px,3.5vw,58px)] font-black leading-[1.1] text-[#071633]">
            {lo("Scan to Pay")}
          </h1>
          <p className="mt-[clamp(6px,1.2vh,14px)] shrink-0 text-[clamp(17px,1.55vw,24px)] font-medium text-slate-600">
            {lo("Please complete your payment using QR code or bank transfer.")}
          </p>

          <div className="mt-[clamp(8px,1.25vh,18px)] flex min-h-0 flex-1 flex-col items-center justify-center rounded-[24px] border border-blue-100 bg-white p-[clamp(10px,1.4vw,18px)] shadow-[0_18px_44px_rgba(13,91,255,0.1)]">
            <h2 className="text-[clamp(18px,1.6vw,24px)] font-black text-[#071633]">
              {lo("Scan with your banking app")}
            </h2>
            <div className="relative mt-[clamp(6px,1vh,12px)]">
              <img
                src={customerBankDetails.qrImageUrl}
                alt="Payment QR code"
                className="h-[clamp(210px,35vh,310px)] w-[clamp(210px,35vh,310px)] object-contain"
              />
              <div className="absolute top-1/2 left-1/2 flex h-[clamp(58px,8vh,82px)] w-[clamp(58px,8vh,82px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[20px] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.2)]">
                <img
                  src={customerBusinessBrand.logo}
                  alt="TJ POS"
                  className="h-[clamp(22px,3vh,32px)] w-[clamp(46px,6.2vh,64px)] object-contain"
                />
              </div>
            </div>
            <div className="mt-[clamp(6px,1vh,12px)] flex items-center gap-2 text-[clamp(12px,1vw,15px)] font-bold text-blue-600">
              <ShieldCheck className="h-7 w-7" strokeWidth={2.5} />
              <span>{lo("Secure payment - Powered by TJ POS")}</span>
            </div>
          </div>
        </section>

        <aside className="flex min-h-0 flex-col gap-[clamp(8px,1.1vh,12px)] overflow-hidden">
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
        <div className="flex h-[clamp(108px,17vh,166px)] w-[clamp(108px,17vh,166px)] items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_78px_rgba(16,185,129,0.35)]">
          <CheckCircle2 className="h-[clamp(76px,11.8vh,116px)] w-[clamp(76px,11.8vh,116px)]" strokeWidth={2.3} />
        </div>
        <h1 className="mt-[clamp(16px,2.6vh,28px)] pt-1 text-[clamp(50px,4.8vw,74px)] font-black leading-[1.08] text-[#071633]">
          {lo("Payment Successful")}
        </h1>
        <p className="mt-[clamp(10px,2vh,24px)] text-[clamp(25px,2.7vw,38px)] font-medium text-slate-600">
          {lo("Thank you for your purchase!")}
        </p>

        <div className="mt-[clamp(18px,3vh,36px)] grid w-[min(1180px,84vw)] max-w-full grid-cols-4 rounded-[22px] border border-blue-100 bg-white px-[clamp(18px,2vw,32px)] py-[clamp(18px,2.6vh,28px)] shadow-[0_18px_44px_rgba(13,91,255,0.1)]">
          {stats.map(({ label, value, icon: Icon }, index) => (
            <div
              key={label}
              className={`px-[clamp(14px,2vw,32px)] ${index === 0 ? "" : "border-l border-blue-100"}`}
            >
              <Icon className="mx-auto h-9 w-9 text-blue-600" strokeWidth={2.4} />
              <div className="mt-[clamp(8px,1.4vh,12px)] text-[clamp(16px,1.35vw,21px)] font-medium text-slate-600">
                {lo(label)}
              </div>
              <div
                className={`mt-[clamp(10px,1.8vh,16px)] text-[clamp(20px,1.9vw,28px)] font-black ${
                  label === "Status" ? "text-emerald-500" : "text-blue-600"
                }`}
              >
                {lo(value)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[clamp(16px,2.6vh,32px)] flex items-center gap-4 text-[clamp(18px,1.7vw,24px)] font-medium text-slate-600">
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
    <section className="grid h-full min-h-0 place-items-center overflow-hidden">
      <div className="grid max-h-full w-[min(1080px,90vw)] max-w-full grid-cols-[minmax(0,1fr)_minmax(300px,360px)] gap-[clamp(18px,2.4vw,32px)] rounded-[28px] border border-blue-100 bg-white p-[clamp(18px,2.2vw,30px)] shadow-[0_24px_70px_rgba(13,91,255,0.12)]">
        <div>
          <div className="flex h-[clamp(56px,7.2vh,72px)] w-[clamp(56px,7.2vh,72px)] items-center justify-center rounded-[22px] border border-blue-100 bg-blue-50 text-blue-600">
            <MonitorSmartphone className="h-[clamp(34px,4.4vh,44px)] w-[clamp(34px,4.4vh,44px)]" strokeWidth={2.5} />
          </div>
          <h1 className="mt-[clamp(16px,2.5vh,28px)] pt-1 text-[clamp(34px,3.5vw,52px)] font-black leading-[1.1] text-[#071633]">
            {lo("Pair Customer Display")}
          </h1>
          <p className="mt-[clamp(10px,1.6vh,16px)] max-w-[620px] text-[clamp(17px,1.5vw,23px)] font-medium leading-relaxed text-slate-600">
            {lo("Connect this display to the cashier POS device for live order and payment updates.")}
          </p>

          <div className="mt-[clamp(18px,3vh,32px)] grid grid-cols-3 gap-[clamp(10px,1.3vw,16px)]">
            {["Counter Display", "Live POS Sync", "Secure Session"].map((item) => (
              <div
                key={item}
                className="rounded-[18px] border border-blue-100 bg-blue-50/50 px-[clamp(12px,1.4vw,18px)] py-[clamp(10px,1.4vh,14px)] text-[clamp(13px,1.1vw,17px)] font-black text-blue-600"
              >
                {lo(item)}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-blue-100 bg-blue-50/45 p-[clamp(14px,1.8vw,24px)] text-center">
          <div className="text-[clamp(12px,1vw,15px)] font-black uppercase tracking-[0.16em] text-slate-500">
            {lo("Pairing Code")}
          </div>
          <div className="mt-[clamp(8px,1.2vh,14px)] rounded-[20px] bg-white px-[clamp(14px,1.6vw,24px)] py-[clamp(12px,1.8vh,18px)] text-[clamp(34px,3.4vw,46px)] font-black tracking-[0.16em] text-blue-600 shadow-[0_12px_30px_rgba(13,91,255,0.1)]">
            {customerDisplayDevice.pairCode}
          </div>
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=12&data=TJ-POS%7CCD-COUNTER-01%7C824519"
            alt="Pairing QR code"
            className="mx-auto mt-[clamp(12px,2vh,20px)] h-[clamp(150px,23vh,190px)] w-[clamp(150px,23vh,190px)] rounded-[18px] bg-white p-3 shadow-[0_12px_30px_rgba(13,91,255,0.1)]"
          />
          <p className="mt-[clamp(10px,1.6vh,16px)] text-[clamp(13px,1.1vw,16px)] font-bold text-slate-600">
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
