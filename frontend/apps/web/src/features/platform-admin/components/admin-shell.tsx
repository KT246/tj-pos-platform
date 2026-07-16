"use client"

import {
  BellRing,
  Building2,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Headphones,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageOpen,
  ScrollText,
  Search,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const navigation = [
  {
    label: "ພາບລວມ",
    items: [{ label: "ໜ້າຫຼັກ", href: "/platform-admin", icon: LayoutDashboard }],
  },
  {
    label: "ການບໍລິການ POS",
    items: [
      { label: "POS ລູກຄ້າ", href: "/platform-admin/pos-clients", icon: Building2 },
      { label: "ແພັກເກດ", href: "/platform-admin/plans", icon: PackageOpen },
      { label: "ສະໝັກ ແລະ ຕໍ່ອາຍຸ", href: "/platform-admin/subscriptions", icon: ScrollText },
      { label: "ການຊຳລະເງິນ", href: "/platform-admin/payments", icon: CreditCard },
    ],
  },
  {
    label: "ບໍລິການ",
    items: [
      { label: "ຊ່ວຍເຫຼືອ", href: "/platform-admin/support-tickets", icon: Headphones },
    ],
  },
  {
    label: "ລະບົບ",
    items: [
      { label: "ປະຫວັດການໃຊ້ງານ", href: "/platform-admin/audit-logs", icon: ScrollText },
      { label: "ຕັ້ງຄ່າ", href: "/platform-admin/settings", icon: Settings },
    ],
  },
] as const

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authStatus, setAuthStatus] = useState<"checking" | "ready">("checking")

  useEffect(() => {
    const controller = new AbortController()

    fetch("/api/platform/auth/me", { cache: "no-store", signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Unauthorized")
        setAuthStatus("ready")
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        router.replace("/login")
      })

    return () => controller.abort()
  }, [router])

  async function logout() {
    await fetch("/api/platform/auth/logout", { method: "POST" })
    router.replace("/login")
  }

  if (authStatus === "checking") {
    return <div className="admin-auth-loading"><ShieldCheck size={30} /><span>ກຳລັງກວດສອບສິດ...</span></div>
  }

  return (
    <div className="admin-layout">
      {mobileOpen && <button className="sidebar-backdrop" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}
      <aside className={`admin-sidebar ${mobileOpen ? "admin-sidebar--open" : ""}`}>
        <div className="brand">
          <span className="brand-mark"><ShieldCheck size={24} /></span>
          <span><strong>TJ POS</strong><small>PLATFORM ADMIN</small></span>
          <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>

        <nav className="sidebar-nav" aria-label="Admin navigation">
          {navigation.map((group) => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map(({ label, href, icon: Icon }) => {
                const active = href === "/platform-admin" ? pathname === href : pathname.startsWith(href)
                return (
                  <Link className={active ? "nav-link nav-link--active" : "nav-link"} href={href} key={href} onClick={() => setMobileOpen(false)}>
                    <Icon size={18} strokeWidth={2} /><span>{label}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-help">
          <CircleHelp size={20} />
          <div><strong>ຕ້ອງການຊ່ວຍ?</strong><span>ເບິ່ງຄູ່ມືລະບົບ</span></div>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="menu-button" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={21} /></button>
          <label className="admin-search">
            <Search size={18} />
            <input placeholder="ຄົ້ນຫາຮ້ານ, ຜູ້ໃຊ້..." aria-label="Search" />
            <kbd>⌘ K</kbd>
          </label>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifications"><BellRing size={19} /><span /></button>
            <div className="profile-divider" />
            <button className="profile-button">
              <span className="avatar">TS</span>
              <span className="profile-copy"><strong>TJ Solution</strong><small>Super Admin</small></span>
              <ChevronDown size={16} />
            </button>
            <button className="icon-button" aria-label="Đăng xuất" onClick={() => void logout()}><LogOut size={18} /></button>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}
