import { useEffect } from "react";
import { CheckCircle2, Coffee, MonitorSmartphone, PackageCheck, ShoppingBag } from "lucide-react";

import { pickupSteps } from "../data/cafe-pickup-data";
import { useCafePickupStore } from "../stores/cafe-pickup-store";

const cupImage =
  "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=420&q=80";
const phoneImage =
  "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=420&q=80";

export function CafePickupDisplayPage() {
  const preparing = useCafePickupStore((state) => state.preparing);
  const ready = useCafePickupStore((state) => state.ready);
  const currentTime = useCafePickupStore((state) => state.currentTime);
  const currentDate = useCafePickupStore((state) => state.currentDate);
  const updateClock = useCafePickupStore((state) => state.updateClock);

  useEffect(() => {
    updateClock();
    const timer = window.setInterval(updateClock, 30_000);

    return () => window.clearInterval(timer);
  }, [updateClock]);

  return (
    <main className="min-h-screen bg-[#f5f9ff] p-5 text-[#0b1736]">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] max-w-[1680px] flex-col gap-5">
        <header className="flex items-center justify-between rounded-2xl border border-blue-100 bg-white px-6 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Coffee className="h-7 w-7" />
            </span>
            <div>
              <h1 className="text-2xl font-black leading-tight">TJ Cafe Vientiane</h1>
              <p className="text-sm font-bold text-slate-500">ຈໍຄິວຮັບເຄື່ອງດື່ມ</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-blue-600">{currentTime}</p>
            <p className="text-sm font-bold text-slate-500">{currentDate}</p>
          </div>
        </header>

        <section className="grid flex-1 gap-5 xl:grid-cols-[1fr_1.05fr_1.05fr]">
          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="bg-gradient-to-br from-[#08204a] to-[#16427c] px-6 py-5 text-white">
              <p className="text-xl font-black">ກຳລັງຈັດກຽມ</p>
              <p className="mt-1 text-sm font-bold text-blue-100">Order ທີ່ Barista ກຳລັງເຮັດ</p>
            </div>
            <div className="divide-y divide-blue-50">
              {preparing.map((ticket, index) => (
                <div
                  key={ticket.code}
                  className={`flex items-center justify-between px-6 py-5 ${
                    index === 0 ? "bg-blue-50/70" : "bg-white"
                  }`}
                >
                  <div>
                    <p className="text-5xl font-black tracking-tight text-[#0b356f]">
                      {ticket.code}
                    </p>
                    <p className="mt-2 text-lg font-black text-slate-700">{ticket.item}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-600">
                    {ticket.wait}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-xl font-black text-emerald-700">ພ້ອມຮັບແລ້ວ</p>
                  <p className="mt-1 text-sm font-bold text-slate-500">ກະລຸນາຮັບທີ່ counter</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <PackageCheck className="h-7 w-7" />
                </span>
              </div>
              <div className="grid flex-1 grid-cols-[1fr_190px] items-center gap-6">
                <div className="space-y-3">
                  {ready.map((ticket) => (
                    <p
                      key={ticket.code}
                      className="text-6xl font-black tracking-tight text-emerald-800"
                    >
                      {ticket.code}
                    </p>
                  ))}
                </div>
                <div
                  className="h-52 rounded-2xl bg-cover bg-center shadow-[0_20px_45px_rgba(16,185,129,0.22)]"
                  style={{ backgroundImage: `url(${cupImage})` }}
                />
              </div>
              <p className="mt-8 max-w-sm text-center text-lg font-black leading-8 text-emerald-700">
                ກະລຸນາຮັບເຄື່ອງດື່ມຂອງທ່ານທີ່ counter.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="grid h-full grid-cols-[1fr_180px]">
              <div className="p-8">
                <p className="text-xl font-black text-slate-950">ວິທີຮັບ Order</p>
                <p className="mt-1 text-sm font-bold text-slate-500">ຂັ້ນຕອນສຳລັບລູກຄ້າ</p>
                <div className="mt-8 space-y-5">
                  {pickupSteps.map((step, index) => (
                    <div key={step} className="flex items-center gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-lg font-black text-white">
                        {index + 1}
                      </span>
                      <p className="text-lg font-black leading-7 text-slate-800">{step}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10 rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                    <p className="text-sm font-black text-blue-700">
                      ເມື່ອເຫັນເລກຂອງທ່ານ ກະລຸນາມາຮັບທີ່ counter.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-5">
                <div className="relative h-[360px] w-[150px] rounded-[2rem] border-[8px] border-slate-900 bg-white shadow-[0_24px_50px_rgba(15,23,42,0.22)]">
                  <div
                    className="absolute inset-2 rounded-[1.45rem] bg-cover bg-center"
                    style={{ backgroundImage: `url(${phoneImage})` }}
                  />
                  <span className="absolute top-2 left-1/2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-slate-900" />
                </div>
                <span className="absolute right-7 bottom-8 flex h-14 w-14 items-center justify-center rounded-full bg-white text-blue-600 shadow-lg">
                  <MonitorSmartphone className="h-7 w-7" />
                </span>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex items-center justify-between rounded-2xl bg-[#08204a] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-6 w-6 text-blue-200" />
            <p className="text-lg font-black">
              ຂອບໃຈທີ່ໃຊ້ບໍລິການ TJ Cafe Vientiane. ກະລຸນາກວດເບິ່ງເລກຄິວຂອງທ່ານ.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-black">{currentTime}</p>
            <p className="text-xs font-bold text-blue-100">{currentDate}</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
