import { useEffect } from "react";
import { CheckCircle2, Clock3, Coffee, MonitorSmartphone, PackageCheck } from "lucide-react";

import { pickupSteps } from "../data/cafe-pickup-data";
import { useCafePickupStore } from "../stores/cafe-pickup-store";

const cupImage =
  "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=520&q=80";

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
    <main className="h-screen overflow-hidden bg-[#f5f9ff] p-[clamp(10px,1.4vw,20px)] text-[#071633]">
      <div className="mx-auto grid h-full max-w-[1780px] grid-rows-[clamp(64px,9.8vh,88px)_minmax(0,1fr)_clamp(56px,8.8vh,76px)] gap-[clamp(10px,1.2vw,18px)]">
        <header className="flex items-center justify-between rounded-[22px] border border-blue-100 bg-white px-[clamp(16px,1.8vw,28px)] shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-[clamp(12px,1.5vw,20px)]">
            <span className="flex h-[clamp(42px,6.5vh,56px)] w-[clamp(42px,6.5vh,56px)] items-center justify-center rounded-[16px] bg-blue-600 text-white">
              <Coffee className="h-[clamp(28px,4vh,32px)] w-[clamp(28px,4vh,32px)]" />
            </span>
            <div>
              <h1 className="text-[clamp(24px,2.2vw,32px)] font-black leading-tight">TJ Cafe Vientiane</h1>
              <p className="text-[clamp(13px,1.15vw,18px)] font-bold text-slate-500">ຈໍຄິວຮັບເຄື່ອງດື່ມ</p>
            </div>
          </div>
          <div className="flex items-center gap-[clamp(9px,1vw,16px)] rounded-[18px] border border-blue-100 bg-blue-50/60 px-[clamp(14px,1.5vw,20px)] py-[clamp(8px,1.1vh,12px)]">
            <Clock3 className="h-[clamp(25px,3.7vh,32px)] w-[clamp(25px,3.7vh,32px)] text-blue-600" />
            <div className="text-right">
              <p className="text-[clamp(21px,2vw,30px)] font-black text-blue-600">{currentTime}</p>
              <p className="text-[clamp(11px,0.9vw,14px)] font-bold text-slate-500">{currentDate}</p>
            </div>
          </div>
        </header>

        <section className="grid min-h-0 grid-cols-[minmax(300px,0.9fr)_minmax(390px,1.08fr)_minmax(300px,0.82fr)] gap-[clamp(10px,1.2vw,18px)]">
          <section className="overflow-hidden rounded-[24px] border border-blue-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="bg-[#08204a] px-[clamp(14px,1.7vw,28px)] py-[clamp(10px,1.5vh,18px)] text-white">
              <p className="text-[clamp(19px,1.85vw,27px)] font-black">ກຳລັງຈັດກຽມ</p>
              <p className="mt-1 text-[clamp(12px,1.1vw,17px)] font-bold text-blue-100">
                ອໍເດີທີ່ Barista ກຳລັງເຮັດ
              </p>
            </div>
            <div className="divide-y divide-blue-50">
              {preparing.map((ticket, index) => (
                <div
                  key={ticket.code}
                  className={`grid grid-cols-[1fr_auto] items-center gap-3 px-[clamp(14px,1.6vw,26px)] py-[clamp(8px,1.25vh,13px)] ${
                    index === 0 ? "bg-blue-50/80" : "bg-white"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-[clamp(30px,3.15vw,44px)] font-black leading-none tracking-tight text-[#0b356f]">
                      {ticket.code}
                    </p>
                    <p className="mt-1 truncate text-[clamp(13px,1.18vw,18px)] font-black text-slate-700">
                      {ticket.item}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-[clamp(8px,0.9vw,14px)] py-1.5 text-[clamp(11px,0.85vw,14px)] font-black text-slate-600">
                    {ticket.wait}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[24px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-[clamp(16px,2vw,30px)] shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[clamp(21px,2vw,30px)] font-black text-emerald-700">ພ້ອມຮັບແລ້ວ</p>
                  <p className="mt-1 text-[clamp(13px,1.15vw,18px)] font-bold text-slate-500">
                    ກະລຸນາຮັບທີ່ເຄົາເຕີ
                  </p>
                </div>
                <span className="flex h-[clamp(44px,6.2vh,64px)] w-[clamp(44px,6.2vh,64px)] items-center justify-center rounded-[18px] bg-emerald-600 text-white shadow-[0_12px_28px_rgba(16,185,129,0.2)]">
                  <PackageCheck className="h-[clamp(26px,3.8vh,36px)] w-[clamp(26px,3.8vh,36px)]" />
                </span>
              </div>

              <div className="mt-[clamp(12px,2vh,26px)] grid flex-1 grid-cols-[1fr_minmax(140px,200px)] items-center gap-[clamp(12px,1.4vw,24px)]">
                <div className="space-y-[clamp(5px,0.85vh,10px)]">
                  {ready.map((ticket) => (
                    <div key={ticket.code}>
                      <p className="text-[clamp(34px,3.65vw,54px)] font-black leading-none tracking-tight text-emerald-800">
                        {ticket.code}
                      </p>
                      <p className="text-[clamp(12px,1.1vw,17px)] font-black text-emerald-700">{ticket.item}</p>
                    </div>
                  ))}
                </div>
                <div
                  className="h-[clamp(150px,25vh,230px)] rounded-[24px] bg-cover bg-center shadow-[0_20px_45px_rgba(16,185,129,0.22)]"
                  style={{ backgroundImage: `url(${cupImage})` }}
                />
              </div>

              <p className="mt-[clamp(8px,1.2vh,16px)] rounded-[16px] bg-white/85 px-4 py-[clamp(7px,1vh,12px)] text-center text-[clamp(12px,1vw,17px)] font-black leading-6 text-emerald-700">
                ເມື່ອເຫັນເລກຄິວຂອງທ່ານ ກະລຸນາມາຮັບທີ່ເຄົາເຕີ.
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-[24px] border border-blue-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="p-[clamp(16px,2vw,30px)]">
              <p className="text-[clamp(20px,1.9vw,28px)] font-black text-slate-950">ວິທີຮັບອໍເດີ</p>
              <p className="mt-1 text-[clamp(12px,1.1vw,17px)] font-bold text-slate-500">
                ຂັ້ນຕອນສຳລັບລູກຄ້າ
              </p>
              <div className="mt-[clamp(18px,2.8vh,32px)] space-y-[clamp(10px,1.7vh,20px)]">
                {pickupSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-[clamp(10px,1.2vw,16px)]">
                    <span className="flex h-[clamp(34px,5.1vh,48px)] w-[clamp(34px,5.1vh,48px)] items-center justify-center rounded-full bg-blue-600 text-[clamp(15px,1.3vw,20px)] font-black text-white">
                      {index + 1}
                    </span>
                    <p className="text-[clamp(14px,1.28vw,20px)] font-black leading-7 text-slate-800">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-[clamp(18px,3vh,36px)] rounded-[18px] border border-blue-100 bg-blue-50 p-[clamp(12px,1.5vw,20px)]">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-7 w-7 text-blue-600" />
                  <p className="text-[clamp(12px,1.05vw,17px)] font-black leading-6 text-blue-700">
                    ກະລຸນາກວດເບິ່ງເລກຄິວຂອງທ່ານກ່ອນມາຮັບ.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </section>

        <footer className="flex items-center justify-between rounded-[22px] bg-[#08204a] px-[clamp(16px,1.8vw,28px)] text-white">
          <div className="flex items-center gap-[clamp(12px,1.4vw,16px)]">
            <MonitorSmartphone className="h-7 w-7 text-blue-200" />
            <p className="text-[clamp(16px,1.45vw,22px)] font-black">
              ຂອບໃຈທີ່ໃຊ້ບໍລິການ TJ Cafe Vientiane.
            </p>
          </div>
          <p className="text-[clamp(16px,1.4vw,20px)] font-black text-blue-100">{currentTime}</p>
        </footer>
      </div>
    </main>
  );
}
