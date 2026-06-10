import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  Store,
  Tag,
  Users
} from "lucide-react";
import { TjLogo } from "../components/business-admin-primitives";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("owner@tjcafe.la");
  const [password, setPassword] = useState("VtCoffee@2025!");
  const [storeType, setStoreType] = useState<"cafe" | "restaurant" | "retail">("cafe");
  const [role, setRole] = useState<"owner" | "manager" | "cashier" | "barista">("owner");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Resolve slug based on selected storeType
    let slug = "tj-cafe-vientiane";
    if (storeType === "restaurant") {
      slug = "tj-restaurant-vientiane";
    } else if (storeType === "retail") {
      slug = "tj-retail-vientiane";
    }

    // Direct Cashier / Barista directly to the POS page
    if (role === "cashier" || role === "barista") {
      navigate(`/business-admin/${slug}/pos`);
    } else {
      // Owner or Manager redirects to the dashboard
      navigate(`/business-admin/${slug}`);
    }
  };

  const fillCredentials = (demoEmail: string, demoRole: "owner" | "manager" | "cashier" | "barista") => {
    setEmail(demoEmail);
    setPassword("VtCoffee@2025!");
    setRole(demoRole);
  };

  return (
    <AuthLayout hideChrome>
      <div className="mb-7 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Store className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-black text-slate-950">ເຂົ້າລະບົບ Business Admin</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          ຈັດການຮ້ានຄ້າ, ຍອດຂາຍ, ສາງສິນຄ້າ ແລະ ພະນັກງານຂອງທ່ານ
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {/* Store Type Selector */}
        <div className="block">
          <span className="mb-2 block text-xs font-black text-slate-700">ປະເພດຮ້ານ (Loại cửa hàng)</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "cafe", label: "Cafe", icon: Store },
              { id: "restaurant", label: "Restaurant", icon: Store },
              { id: "retail", label: "Retail", icon: Tag }
            ].map((store) => {
              const StoreIcon = store.icon;
              return (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => setStoreType(store.id as any)}
                  className={`flex h-10 items-center justify-center gap-1.5 rounded-lg border text-xs font-black transition cursor-pointer ${
                    storeType === store.id
                      ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-50"
                      : "border-slate-100 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <StoreIcon className="h-4 w-4" />
                  {store.label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-black text-slate-700">Email ເຂົ້າໃຊ້</span>
          <span className="relative block">
            <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-md border border-blue-100 bg-white pr-4 pl-12 text-sm font-semibold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              placeholder="owner@example.com"
            />
          </span>
        </label>
        
        <label className="block">
          <span className="mb-2 block text-xs font-black text-slate-700">ລະຫັດຜ່ານ</span>
          <span className="relative block">
            <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-md border border-blue-100 bg-white pr-12 pl-12 text-sm font-semibold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </span>
        </label>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-blue-600" />
            ຈື່ການເຂົ້າໃຊ້
          </label>
          <Link to="/business-admin/forgot-password" className="text-xs font-black text-blue-600 hover:underline">
            ລືມລະຫັດຜ່ານ?
          </Link>
        </div>

        <button
          type="submit"
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-600 text-sm font-black text-white shadow-[0_8px_18px_rgba(37,99,235,0.2)] transition hover:bg-blue-700"
        >
          <ArrowRight className="h-4 w-4" />
          ເຂົ້າສູ່ລະບົບ
        </button>
      </form>

      {/* Demo Credentials Section */}
      <div className="mt-8 border-t border-blue-50 pt-5">
        <p className="text-xs font-black text-slate-500 mb-3">ເລືອກບັນຊີຕົວຢ່າງເພື່ອທົດລອງ:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: "Owner (ເຈົ້າຂອງຮ້ານ)", email: "owner@tjcafe.la", role: "owner" as const },
            { label: "Manager (ຜູ້ຈັດການ)", email: "manager@tjcafe.la", role: "manager" as const },
            { label: "Cashier (ພະນັກງານເກັບເງິນ)", email: "cashier@tjcafe.la", role: "cashier" as const },
            { label: "Barista (ພະນັກງານຊົງ)", email: "barista@tjcafe.la", role: "barista" as const }
          ].map((cred) => (
            <button
              key={cred.email}
              type="button"
              onClick={() => fillCredentials(cred.email, cred.role)}
              className={`rounded-lg border px-3 py-2 text-left transition cursor-pointer ${
                role === cred.role
                  ? "border-blue-300 bg-blue-50/40"
                  : "border-blue-100 bg-blue-50/20 hover:bg-blue-50 hover:border-blue-200"
              }`}
            >
              <span className="block font-black text-slate-900">{cred.label}</span>
              <span className="block text-[10px] text-slate-500 truncate">{cred.email}</span>
            </button>
          ))}
        </div>
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
        <h1 className="text-3xl font-black text-slate-950">ລືມລະຫັດຜ່ານ</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          ປ້ອນ Email ເພື່ອຮັບ link ຕັ້ງລະຫັດຜ່ານໃໝ່.
        </p>
      </div>
      <label className="block w-full">
        <span className="mb-2 block text-xs font-black text-slate-700">Email</span>
        <input
          defaultValue="owner@tjcafe.la"
          className="h-12 w-full rounded-md border border-blue-100 px-4 text-sm font-semibold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
        />
      </label>
      <button
        type="button"
        className="mt-6 flex h-12 w-full items-center justify-center rounded-md bg-blue-600 text-sm font-black text-white shadow-[0_8px_18px_rgba(37,99,235,0.2)]"
      >
        ສົ່ງ reset link
      </button>
      <Link
        to="/business-admin/login"
        className="mt-5 block text-center text-sm font-black text-blue-600 hover:underline"
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
        <h1 className="text-3xl font-black text-slate-950">ຕັ້ງລະຫັດຜ່ານໃໝ່</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          ຕັ້ງລະຫັດຜ່ານໃໝ່ສຳລັບ Business Admin.
        </p>
      </div>
      {["ລະຫັດຜ່ານໃໝ່", "ຢືນຢັນລະຫັດຜ່ານ"].map((label) => (
        <label key={label} className="mb-5 block w-full">
          <span className="mb-2 block text-xs font-black text-slate-700">{label}</span>
          <input
            type="password"
            className="h-12 w-full rounded-md border border-blue-100 px-4 text-sm font-semibold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
          />
        </label>
      ))}
      <button
        type="button"
        className="flex h-12 w-full items-center justify-center rounded-md bg-blue-600 text-sm font-black text-white shadow-[0_8px_18px_rgba(37,99,235,0.2)]"
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
          <TjLogo />
          <div className="flex items-center gap-6">
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 text-sm font-black text-slate-800"
            >
              <Globe className="h-5 w-5" />
              ລາວ
            </button>
            <a
              href="/"
              className="flex items-center gap-2 text-sm font-black text-blue-600"
            >
              ໄປໜ້າເວັບຫຼັກ
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </header>
      ) : null}
      <section
        className={`mx-auto grid max-w-[1448px] gap-10 px-14 py-12 ${
          compact ? "place-items-center" : "lg:grid-cols-[1.05fr_0.95fr] lg:items-start"
        }`}
      >
        {!compact ? (
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-black text-blue-600">
              <Store className="h-4 w-4" />
              TJ POS Business Admin
            </span>
            <h2 className="mt-4 max-w-2xl text-[40px] leading-[1.12] font-black text-slate-950">
              ຈັດການຮ້ານງ່າຍໆ.
              <br />
              ເພີ່ມຍອດຂາຍໃຫ້ <span className="text-blue-600">ເຕີບໂຕໄວ.</span>
            </h2>
            <p className="mt-4 max-w-[620px] text-base leading-7 font-medium text-slate-600">
              TJ POS Business Admin ຊ່ວຍໃຫ້ເຈົ້າຂອງທຸລະກິດ ແລະ ຜູ້ຈັດການຕິດຕາມຍອດຂາຍ, ຈັດການສາງສິນຄ້າ, ພະນັກງານ ແລະ ລູກຄ້າໄດ້ທຸກທີ່ທຸກເວລາ.
            </p>
            
            {/* Visual Dashboard Mockup Card */}
            <div className="mt-8 rounded-xl border border-blue-100 bg-white p-4 shadow-[0_18px_60px_rgba(13,91,255,0.12)]">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "ຍອດຂາຍມື້ນີ້", val: "K 4,250,000" },
                  { label: "ຈຳນວນບິນ", val: "48 ບິນ" },
                  { label: "... ໃໝ່", val: "+12 ຄົນ" },
                  { label: "ສິນຄ້າໃກ້ໝົດ", val: "5 ລາຍການ" }
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-blue-50 p-3 bg-slate-50/50">
                    <p className="text-[11px] font-black text-slate-500">{item.label}</p>
                    <p className="mt-1.5 text-base font-black text-slate-950 truncate">
                      {item.val}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 grid gap-4 rounded-lg border border-blue-50 p-3 md:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-1.5">
                  {["ພາບລວມ", "ລາຍການຂາຍ", "ສາງສິນຄ້າ", "ພະນັກງານ", "ລາຍງານ"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className={`rounded-md px-3 py-1.5 text-xs font-black ${
                          index === 0 ? "bg-blue-600 text-white" : "text-slate-600"
                        }`}
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
                <div className="rounded-lg bg-blue-50/40 p-3 flex items-center justify-center">
                  {/* Mock chart */}
                  <svg className="h-24 w-full" viewBox="0 0 360 150" aria-hidden="true">
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
            
            {/* Value Props */}
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { title: "ລາຍງານຮອບດ້ານ", text: "ຕິດຕາມທຸກການເຄື່ອນໄຫວໃນຮ້ານ.", icon: Store },
                { title: "ຈັດການສາງອັດສະລິຍະ", text: "ແຈ້ງເຕືອນເມື່ອສິນຄ້າໃກ້ໝົດ.", icon: BriefcaseBusiness },
                { title: "ບໍລິຫານພະນັກງານ", text: "ກວດສອບການເຂົ້າງານ ແລະ ຍອດຂາຍ.", icon: Users }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="border-r border-blue-100 pr-4 last:border-r-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <p className="mt-2 text-xs font-black text-slate-950">{item.title}</p>
                    <p className="mt-1 text-[11px] leading-4 text-slate-500">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        <div className="w-full max-w-[520px] rounded-2xl border border-blue-100 bg-white p-8 shadow-[0_18px_70px_rgba(15,23,42,0.08)]">
          {children}
        </div>
      </section>
    </main>
  );
}
