import {
  Bed,
  Coffee,
  Eye,
  EyeOff,
  Info,
  LockKeyhole,
  ShoppingBag,
  Soup,
  User,
  Utensils,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { showPosToast } from "@/features/pos/components/notifications/pos-toast-store"
import {
  getFirstAllowedPosPath,
  getPosSession,
  savePosSession,
} from "@/features/pos/lib/pos-session"
import { apiPost } from "@/lib/http"
import { cn } from "@/lib/utils"

const businessTypes = [
  {
    label: "ຮ້ານກາເຟ",
    icon: Coffee,
    className: "left-[7%] top-[39%]",
  },
  {
    label: "ຮ້ານອາຫານ",
    icon: Soup,
    className: "left-[43%] top-[22%]",
  },
  {
    label: "ຂາຍຍ່ອຍ",
    icon: ShoppingBag,
    className: "right-[8%] top-[42%]",
  },
  {
    label: "ຄວາມງາມ",
    icon: User,
    className: "left-[5%] bottom-[21%]",
  },
  {
    label: "ໂຮງແຮມ",
    icon: Bed,
    className: "right-[6%] bottom-[23%]",
  },
]

export function PosLoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(() => Boolean(window.localStorage.getItem("tj_pos_username")))
  const [username, setUsername] = useState(() => window.localStorage.getItem("tj_pos_username") ?? "")
  const [password, setPassword] = useState("")
  const [loggingIn, setLoggingIn] = useState(false)

  useEffect(() => {
    const session = getPosSession()

    if (session) {
      navigate(getFirstAllowedPosPath(session), { replace: true })
    }
  }, [navigate])

  async function handleLogin() {
    if (!username.trim() || !password) {
      showPosToast({
        type: "warning",
        title: "ຂໍ້ມູນເຂົ້າລະບົບບໍ່ຄົບ",
        description: "ກະລຸນາໃສ່ຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ.",
      })
      return
    }

    setLoggingIn(true)

    try {
      const session = await apiPost<{
        accessToken: string
        business: { slug: string }
        user: { name: string; email: string; username: string | null }
        role: string
        permissions: string[]
        accountType?: "admin" | "pos"
      }, { username: string; password: string; rememberMe: boolean }>("/auth/business/login", {
        username: username.trim(),
        password,
        rememberMe: remember,
      })

      savePosSession({
        accessToken: session.accessToken,
        businessSlug: session.business.slug,
        userName: session.user.name,
        username: session.user.username ?? username.trim(),
        role: session.role,
        permissions: session.permissions,
        accountType: session.accountType ?? "admin",
      })

      if (remember) {
        window.localStorage.setItem("tj_pos_username", username.trim())
      } else {
        window.localStorage.removeItem("tj_pos_username")
      }

      navigate(getFirstAllowedPosPath())
    } catch {
      showPosToast({
        type: "error",
        title: "ເຂົ້າລະບົບບໍ່ສຳເລັດ",
        description: "ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ.",
      })
    } finally {
      setLoggingIn(false)
    }
  }

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#f7f0e7] text-[#3b2511]">
      <div className="grid min-h-[100dvh] lg:grid-cols-[1.05fr_1fr]">
        <section className="relative hidden min-h-screen overflow-hidden bg-[radial-gradient(circle_at_50%_44%,#fffaf4_0%,#f4e6d5_52%,#ead8c3_100%)] px-10 py-7 lg:block">
          <div className="absolute -left-[20%] top-[3%] h-[88%] w-[96%] rounded-full border border-white/80 bg-white/22" />
          <div className="absolute left-4 top-32 grid grid-cols-4 gap-3 opacity-50">
            {Array.from({ length: 12 }).map((_, index) => (
              <span
                key={index}
                className="h-1.5 w-1.5 rounded-full bg-[#c9a77c]"
              />
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(135deg,rgba(255,255,255,0.66)_0%,rgba(255,255,255,0)_55%)]" />

          <div className="relative z-10 mx-auto flex h-full max-w-[720px] flex-col items-center">
            <div className="mt-9 flex flex-col items-center text-center">
              <Coffee className="h-[52px] w-[52px] text-[#5a3718]" strokeWidth={1.5} />
              <h1 className="mt-3 font-serif text-[58px] font-black leading-none tracking-[0.02em] text-[#3b2511] drop-shadow-sm">
                TJ POS
              </h1>
              <div className="mt-4 flex items-center gap-3 text-[#8a5f36]">
                <span className="h-px w-10 bg-[#b98b56]" />
                <span className="h-2.5 w-2.5 rotate-45 rounded-sm bg-[#8a5f36]" />
                <span className="h-px w-10 bg-[#b98b56]" />
              </div>
              <p className="mt-4 max-w-[350px] text-[20px] font-semibold leading-7 text-[#3b2511]">
                ຈັດການການຂາຍໃຫ້ງ່າຍ, ໄວ ແລະ ມີປະສິດທິຜົນ
              </p>
            </div>

            <div className="relative mt-1 h-[500px] w-full max-w-[700px] flex-1">
              <div className="absolute inset-x-[8%] top-[15%] h-[390px] rounded-full border border-dashed border-[#caa47d]/50" />
              <div className="absolute inset-x-[16%] top-[25%] h-[285px] rounded-full border border-white/70" />
              <div className="absolute inset-x-[22%] bottom-[4%] h-24 rounded-full bg-[#8a5f36]/10 blur-3xl" />
              <img
                src="/images/pos-login-hero.png"
                alt="TJ POS hardware"
                className="absolute bottom-[10px] left-1/2 z-10 h-[430px] w-[720px] max-w-none -translate-x-1/2 object-contain opacity-95 mix-blend-multiply drop-shadow-[0_30px_46px_rgba(70,45,22,0.18)] [mask-image:radial-gradient(ellipse_at_center,black_52%,rgba(0,0,0,0.85)_64%,transparent_78%)]"
              />

              {businessTypes.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.label}
                    className={cn(
                      "absolute z-20 flex h-[86px] w-[108px] flex-col items-center justify-center rounded-xl border border-[#eadfce] bg-white/92 text-center shadow-[0_18px_34px_rgba(80,54,27,0.13)] backdrop-blur",
                      item.className,
                    )}
                  >
                    <Icon className="h-7 w-7 text-[#8a5f36]" strokeWidth={1.7} />
                    <span className="mt-2 text-sm font-black text-[#3b2511]">
                      {item.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="relative flex min-h-[100dvh] items-center justify-center bg-[radial-gradient(circle_at_50%_12%,#fffaf4_0%,#f8f1e8_42%,#f2e7da_100%)] px-4 py-6 sm:px-5 sm:py-8">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(255,255,255,0.18))]" />

          <div className="relative z-10 w-full max-w-[540px]">
            <div className="mb-5 flex items-center justify-center gap-3 sm:mb-7 lg:hidden">
              <Coffee className="h-9 w-9 text-[#5a3718] sm:h-10 sm:w-10" />
              <div>
                <h1 className="font-serif text-[28px] font-black leading-none text-[#3b2511] sm:text-3xl">
                  TJ POS
                </h1>
                <p className="mt-1 text-sm font-semibold text-[#7c6448]">
                  ຈັດການການຂາຍໃຫ້ງ່າຍ
                </p>
              </div>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                void handleLogin()
              }}
              className="rounded-xl border border-[#ded0bf] bg-white/88 px-5 py-7 shadow-[0_24px_70px_rgba(80,54,27,0.14)] backdrop-blur sm:rounded-[24px] sm:px-8 sm:py-10 md:px-12 md:py-12"
            >
              <div className="flex flex-col items-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f3eadf] text-[#5a3718] sm:h-20 sm:w-20">
                  <LockKeyhole className="h-8 w-8 sm:h-9 sm:w-9" strokeWidth={1.8} />
                </span>
                <h2 className="mt-5 text-[28px] font-black leading-tight text-[#3b2511] sm:mt-7 sm:text-[32px] md:text-[36px]">
                  ເຂົ້າລະບົບ
                </h2>
              </div>

              <div className="mt-7 space-y-5 sm:mt-10 sm:space-y-6">
                <label className="block">
                  <span className="text-sm font-black text-[#3b2511] sm:text-base">
                    ຊື່ຜູ້ໃຊ້
                  </span>
                  <span className="mt-2 flex h-14 items-center rounded-xl border border-[#d8c8b8] bg-white px-4 text-[#7c6448] transition focus-within:border-[#8a5f36] focus-within:ring-4 focus-within:ring-[#ead7c1] sm:mt-3 sm:h-16 sm:px-5">
                    <User className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={1.8} />
                    <input
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="ໃສ່ຊື່ຜູ້ໃຊ້"
                      className="ml-3 min-w-0 flex-1 bg-transparent text-base font-semibold text-[#3b2511] outline-none placeholder:text-[#b3a394] sm:ml-4 sm:text-lg"
                      autoComplete="username"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="text-sm font-black text-[#3b2511] sm:text-base">
                    ລະຫັດຜ່ານ
                  </span>
                  <span className="mt-2 flex h-14 items-center rounded-xl border border-[#d8c8b8] bg-white px-4 text-[#7c6448] transition focus-within:border-[#8a5f36] focus-within:ring-4 focus-within:ring-[#ead7c1] sm:mt-3 sm:h-16 sm:px-5">
                    <LockKeyhole className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={1.8} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="ໃສ່ລະຫັດຜ່ານ"
                      className="ml-3 min-w-0 flex-1 bg-transparent text-base font-semibold text-[#3b2511] outline-none placeholder:text-[#b3a394] sm:ml-4 sm:text-lg"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="ml-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#8a5f36] transition hover:bg-[#f7efe5] sm:ml-3 sm:h-10 sm:w-10"
                      aria-label={showPassword ? "ເຊື່ອງລະຫັດຜ່ານ" : "ສະແດງລະຫັດຜ່ານ"}
                    >
                      {showPassword ? (
                        <Eye className="h-5 w-5" />
                      ) : (
                        <EyeOff className="h-5 w-5" />
                      )}
                    </button>
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setRemember((value) => !value)}
                  className="flex cursor-pointer items-center gap-3 text-sm font-bold text-[#3b2511] sm:text-base"
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-md border transition",
                      remember
                        ? "border-[#5a3718] bg-[#5a3718] text-white"
                        : "border-[#cbb8a4] bg-white text-transparent",
                    )}
                  >
                    <Utensils className="h-3.5 w-3.5" />
                  </span>
                  ຈື່ການເຂົ້າລະບົບ
                </button>

                <button
                  type="submit"
                  disabled={loggingIn}
                  className="h-14 w-full cursor-pointer rounded-xl bg-[linear-gradient(135deg,#6d421f_0%,#3b2511_100%)] text-lg font-black text-white shadow-[0_18px_32px_rgba(80,54,27,0.22)] transition hover:brightness-110 sm:h-16 sm:text-xl"
                >
                  {loggingIn ? "ກຳລັງເຂົ້າລະບົບ..." : "ເຂົ້າລະບົບ"}
                </button>

                <div className="flex items-center gap-3 rounded-xl bg-[#fff7ee] px-4 py-3 text-xs font-semibold text-[#7c6448] sm:px-5 sm:py-4 sm:text-sm">
                  <Info className="h-5 w-5 shrink-0 text-[#8a5f36]" />
                  ກະລຸນາໃສ່ບັນຊີ ແລະ ລະຫັດຜ່ານໃຫ້ຖືກຕ້ອງ
                </div>
              </div>
            </form>

            <p className="mt-6 text-center text-sm font-semibold text-[#9b8a7b] sm:mt-9 sm:text-base">
              © 2026 TJ POS
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
