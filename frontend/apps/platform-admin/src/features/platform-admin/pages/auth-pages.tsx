import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { demoPlatformUsers } from "../data/mock-platform-admin";
import Link from "../../../compat/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ExternalLink,
  Eye,
  Globe,
  Headphones,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck
} from "lucide-react";

import { Logo } from "../../../components/layout/logo";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@tjpos.la");
  const [password, setPassword] = useState("VtCoffee@2025!");

  const handleLogin = (selectedEmail: string) => {
    const matched = demoPlatformUsers.find((u) => u.email === selectedEmail) || demoPlatformUsers[0];
    localStorage.setItem("active_platform_user", JSON.stringify(matched));
    navigate("/platform-admin/dashboard");
  };

  return (
    <AuthLayout hideChrome>
      <div className="mb-7 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <ShieldCheck className="h-12 w-12" />
        </div>
        <h1 className="font900 text-3xl text-slate-950">ເຂົ້າລະບົບ Platform Admin</h1>
        <p className="mt-2 text-base leading-7 text-slate-600">
          ເຂົ້າໃຊ້ TJ POS admin platform
          <br />
          ສຳລັບທີມ TJ POS ທີ່ໄດ້ຮັບສິດເທົ່ານັ້ນ.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/20 p-4">
        <p className="font900 mb-3 text-xs uppercase tracking-wider text-slate-400">
          ເລືອກບັນຊີທົດລອງ (Demo Accounts)
        </p>
        <div className="grid gap-2">
          {demoPlatformUsers.map((user) => (
            <button
              key={user.email}
              type="button"
              onClick={() => {
                setEmail(user.email);
                handleLogin(user.email);
              }}
              className="flex items-center gap-3 rounded-lg border border-blue-100 bg-white p-3 text-left transition hover:border-blue-300 hover:bg-blue-50/50"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-50"
              />
              <div className="min-w-0 flex-1">
                <span className="font900 block text-sm text-slate-950 leading-tight">
                  {user.name}
                </span>
                <span className="block text-[11px] text-slate-500 font-bold">
                  {user.role} • {user.email}
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-blue-600 shrink-0 opacity-60" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <label>
          <span className="font800 mb-2 block text-sm text-slate-700">Email</span>
          <span className="relative block">
            <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 w-full rounded-md border border-blue-100 pr-4 pl-12 text-base outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
            />
          </span>
        </label>
        <label>
          <span className="font800 mb-2 block text-sm text-slate-700">ລະຫັດຜ່ານ</span>
          <span className="relative block">
            <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="h-14 w-full rounded-md border border-blue-100 pr-12 pl-12 text-base outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
            />
            <Eye className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-500" />
          </span>
        </label>

        <div className="flex items-center justify-between">
          <label className="font800 flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-blue-600" />
            ຈື່ການເຂົ້າໃຊ້
          </label>
          <Link href="/forgot-password" className="font900 text-sm text-blue-700">
            ລືມລະຫັດຜ່ານ?
          </Link>
        </div>

        <button
          type="button"
          onClick={() => handleLogin(email)}
          className="font900 flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-md bg-blue-600 text-base text-white shadow-[0_10px_24px_rgba(13,91,255,0.2)] transition hover:bg-blue-700"
        >
          <ArrowRight className="h-5 w-5" />
          ເຂົ້າ Platform Admin
        </button>

        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span className="h-px flex-1 bg-blue-100" />
          ຫຼື
          <span className="h-px flex-1 bg-blue-100" />
        </div>

        <button
          type="button"
          className="font900 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-blue-200 text-sm text-blue-700 transition hover:bg-blue-50"
        >
          <ShieldCheck className="h-4 w-4" />
          SSO Login (ກຳລັງພັດທະນາ)
        </button>
      </div>

      <div className="mt-7 flex items-start gap-3 rounded-lg bg-emerald-50 p-4 text-sm text-slate-600">
        <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
        <p>
          ການເຂົ້າໃຊ້ປອດໄພດ້ວຍການເຂົ້າລະຫັດລະດັບອົງກອນ. ກິດຈະກຳທັງໝົດຖືກຕິດຕາມ
          ແລະບັນທຶກ.
        </p>
      </div>
    </AuthLayout>
  );
}

export function ForgotPasswordPage() {
  return (
    <AuthLayout compact>
      <div className="mb-7 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Mail className="h-10 w-10" />
        </div>
        <h1 className="font900 text-3xl text-slate-950">ລືມລະຫັດຜ່ານ</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          ປ້ອນ Email ເພື່ອຮັບ link ຕັ້ງລະຫັດຜ່ານໃໝ່.
        </p>
      </div>
      <label>
        <span className="font800 mb-2 block text-sm text-slate-700">Email</span>
        <input
          defaultValue="admin@tjpos.la"
          className="h-14 w-full rounded-md border border-blue-100 px-4 text-base outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
        />
      </label>
      <button
        type="button"
        className="font900 mt-6 flex h-14 w-full items-center justify-center rounded-md bg-blue-600 text-white"
      >
        ສົ່ງ reset link
      </button>
      <Link
        href="/login"
        className="font900 mt-5 block text-center text-sm text-blue-700"
      >
        ກັບໄປ Login
      </Link>
    </AuthLayout>
  );
}

export function ResetPasswordPage() {
  return (
    <AuthLayout compact>
      <div className="mb-7 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Lock className="h-10 w-10" />
        </div>
        <h1 className="font900 text-3xl text-slate-950">ຕັ້ງລະຫັດຜ່ານໃໝ່</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          ຕັ້ງລະຫັດຜ່ານໃໝ່ສຳລັບ Platform Admin.
        </p>
      </div>
      {["ລະຫັດຜ່ານໃໝ່", "ຢືນຢັນລະຫັດຜ່ານ"].map((label) => (
        <label key={label} className="mb-5 block">
          <span className="font800 mb-2 block text-sm text-slate-700">{label}</span>
          <input
            type="password"
            defaultValue="VtCoffee@2025!"
            className="h-14 w-full rounded-md border border-blue-100 px-4 text-base outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
          />
        </label>
      ))}
      <button
        type="button"
        className="font900 flex h-14 w-full items-center justify-center rounded-md bg-blue-600 text-white"
      >
        ບັນທຶກລະຫັດຜ່ານໃໝ່
      </button>
    </AuthLayout>
  );
}

function AuthLayout({
  children,
  compact = false,
  hideChrome = false
}: {
  children: React.ReactNode;
  compact?: boolean;
  hideChrome?: boolean;
}) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_55%,#ffffff_100%)] text-slate-900">
      {!hideChrome ? (
        <header className="flex h-[78px] items-center justify-between border-b border-blue-100 px-14">
          <Logo
            href="/"
            markClassName="h-11 w-11"
            textClassName="text-2xl"
            taglineClassName="text-[7px]"
            priority
          />
          <div className="flex items-center gap-6">
            <button
              type="button"
              className="font900 flex cursor-pointer items-center gap-2 text-sm text-slate-800"
            >
              <Globe className="h-5 w-5" />
              ລາວ
            </button>
            <Link
              href="/"
              className="font900 flex items-center gap-2 text-sm text-blue-700"
            >
              ໄປໜ້າເວັບຫຼັກ
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </header>
      ) : null}
      <section
        className={`mx-auto grid max-w-[1448px] gap-10 px-14 py-8 ${
          compact ? "place-items-center" : "lg:grid-cols-[1.05fr_0.95fr] lg:items-start"
        }`}
      >
        {!compact ? (
          <div>
            <span className="font900 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm text-blue-700">
              <ShieldCheck className="h-4 w-4" />
              TJ POS Platform Admin
            </span>
            <h2 className="font900 mt-4 max-w-2xl text-[40px] leading-[1.12] text-slate-950">
              ຈັດການ. ຕິດຕາມ.
              <br />
              ເພີ່ມພະລັງໃຫ້ <span className="text-blue-600">ທຸກທຸລະກິດ.</span>
            </h2>
            <p className="mt-4 max-w-[620px] text-base leading-7 text-slate-600">
              TJ POS Platform Admin ໃຫ້ທີມງານຈັດການລູກຄ້າ, ຕິດຕາມ performance ແລະປັບປຸງ
              POS experience ທົ່ວລາວ.
            </p>
            <div className="mt-5 rounded-xl border border-blue-100 bg-white p-3 shadow-[0_18px_60px_rgba(13,91,255,0.12)]">
              <div className="grid grid-cols-4 gap-3">
                {["ແດຊບອດ", "ທຸລະກິດ", "ຜູ້ໃຊ້", "ລາຍງານ"].map((item, index) => (
                  <div key={item} className="rounded-lg border border-blue-50 p-2.5">
                    <p className="font900 text-sm text-slate-900">{item}</p>
                    <p className="font900 mt-3 text-2xl text-slate-950">
                      {["1,256", "384", "9,850", "K 1.2B"][index]}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid gap-3 rounded-lg border border-blue-50 p-2.5 md:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-1.5">
                  {["ແດຊບອດ", "ທຸລະກິດ", "ສາຂາ", "ຜູ້ໃຊ້", "ການສະໝັກ"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className={`font900 rounded-md px-3 py-1.5 text-xs ${
                          index === 0 ? "bg-blue-50 text-blue-700" : "text-slate-600"
                        }`}
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
                <div className="rounded-lg bg-blue-50/40 p-3">
                  <svg className="h-20 w-full" viewBox="0 0 360 150" aria-hidden="true">
                    {[35, 70, 105].map((y) => (
                      <line key={y} x1="10" x2="350" y1={y} y2={y} stroke="#dbeafe" />
                    ))}
                    <path
                      d="M12 128 C62 88 88 108 132 76 S196 36 236 72 292 94 350 30"
                      fill="none"
                      stroke="#0d5bff"
                      strokeLinecap="round"
                      strokeWidth="5"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              {[
                {
                  title: "ຄວບຄຸມສູນກາງ",
                  text: "ຈັດການທຸລະກິດ, ສາຂາ ແລະສິດ.",
                  icon: BriefcaseBusiness
                },
                {
                  title: "ຂໍ້ມູນທັນທີ",
                  text: "ຕິດຕາມຍອດຂາຍ ແລະການສະໝັກ.",
                  icon: ChartNoAxesCombined
                },
                {
                  title: "ປອດໄພ & ເຊື່ອຖືໄດ້",
                  text: "ຄວາມປອດໄພລະດັບອົງກອນ.",
                  icon: ShieldCheck
                },
                {
                  title: "ພ້ອມເຕີບໂຕ",
                  text: "ຂະຫຍາຍການດຳເນີນງານທົ່ວລາວ.",
                  icon: Headphones
                }
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="border-r border-blue-100 pr-4 last:border-r-0"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="font900 mt-2 text-[13px] text-slate-950">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[11px] leading-4 text-slate-500">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 rounded-xl border border-blue-100 bg-white px-5 py-3">
              <p className="font900 text-sm text-slate-950">
                ໄດ້ຮັບຄວາມໄວ້ໃຈຈາກທຸລະກິດຊັ້ນນຳໃນລາວ
              </p>
              <div className="mt-3 grid grid-cols-5 items-center gap-3 text-center">
                {["Joma", "Vientiane Center", "BFL", "Sabaidee Hotel", "PARKSON"].map(
                  (logo) => (
                    <span key={logo} className="font900 text-base text-slate-700">
                      {logo}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        ) : null}
        <div className="w-full max-w-[520px] rounded-2xl border border-blue-100 bg-white p-10 shadow-[0_18px_70px_rgba(15,23,42,0.08)]">
          {children}
        </div>
      </section>
      {!compact && !hideChrome ? (
        <footer className="border-t border-blue-100 px-14 py-4">
          <div className="mx-auto grid max-w-[1220px] gap-8 text-xs text-slate-600 md:grid-cols-[1.2fr_0.8fr_1fr_1fr]">
            <div>
              <Logo
                href="/"
                markClassName="h-9 w-9"
                textClassName="text-xl"
                taglineClassName="text-[6px]"
              />
              <p className="mt-2 max-w-xs leading-5">
                TJ POS is a modern, cloud-based point-of-sale platform designed for
                businesses in Laos.
              </p>
            </div>
            <div>
              <p className="font900 mb-3 text-slate-950">Support</p>
              <p className="leading-6">FAQ / ຊ່ວຍເຫຼືອ</p>
              <p className="leading-6">ຄູ່ມືຜູ້ໃຊ້</p>
              <p className="leading-6">ຂໍ Support</p>
            </div>
            <div>
              <p className="font900 mb-3 text-slate-950">ຕິດຕໍ່ພວກເຮົາ</p>
              <p className="flex items-center gap-2 leading-6">
                <Phone className="h-4 w-4" /> +856 20 55 888 999
              </p>
              <p className="flex items-center gap-2 leading-6">
                <Mail className="h-4 w-4" /> info@tjpos.la
              </p>
              <p className="flex items-center gap-2 leading-6">
                <MapPin className="h-4 w-4" /> Vientiane Capital, Laos
              </p>
            </div>
            <div>
              <p className="font900 mb-3 text-slate-950">ປອດໄພ & ມີມາດຕະຖານ</p>
              <div className="grid grid-cols-2 gap-3">
                {["ISO 27001", "PCI DSS"].map((item) => (
                  <div
                    key={item}
                    className="font900 rounded-lg border border-blue-100 px-3 py-2.5 text-xs text-slate-800"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mx-auto mt-4 flex max-w-[1220px] justify-between border-t border-blue-50 pt-3 text-xs text-slate-500">
            <span>(c) 2025 TJ POS Co., Ltd. ສະຫງວນລິຂະສິດ.</span>
            <span>ເງື່ອນໄຂການໃຊ້ງານ | ນະໂຍບາຍຄວາມລັບ</span>
          </div>
        </footer>
      ) : null}
    </main>
  );
}
