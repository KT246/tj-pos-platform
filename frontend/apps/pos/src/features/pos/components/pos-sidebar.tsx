import { useQuery } from "@tanstack/react-query"
import { ChevronDown, Coffee, LogOut } from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react"

import { getPosSettings } from "@/features/pos/api/pos-settings-api"
import {
  clearPosSession,
  filterSidebarGroupsBySession,
  filterSidebarItemsBySession,
  getPosSession,
} from "@/features/pos/lib/pos-session"
import type { PosTypeConfig } from "@/features/pos/types"
import { cn } from "@/lib/utils"

type PosSidebarProps = {
  config: PosTypeConfig
}

export function PosSidebar({ config }: PosSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const activeItemRef = useRef<HTMLAnchorElement>(null)
  const session = getPosSession()
  const settingsQuery = useQuery({
    queryKey: ["pos-settings"],
    queryFn: getPosSettings,
    staleTime: 60_000,
  })
  const customerFeatureEnabled = settingsQuery.data?.customers.enabled ?? true
  const rawSidebarGroups = config.sidebarGroups ?? [
    {
      id: "main",
      label: "",
      items: config.sidebarItems,
    },
  ]
  const sessionSidebarGroups = config.sidebarGroups
    ? filterSidebarGroupsBySession(rawSidebarGroups, session)
    : [
        {
          id: "main",
          label: "",
          items: filterSidebarItemsBySession(config.sidebarItems, session),
        },
  ]
  const sidebarGroups = customerFeatureEnabled || canManageCustomersWhenDisabled(session?.role)
    ? sessionSidebarGroups
    : sessionSidebarGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item.id !== "customers"),
        }))
        .filter((group) => group.items.length > 0)
  const cashierName = session?.userName || config.cashierName
  const cashierRole = session?.role || config.cashierRole
  const business = settingsQuery.data?.business
  const brandName = normalizeSidebarBrandName(business?.name, config.brandName)
  const brandLogoUrl = business?.logoUrl

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ block: "nearest" })
  }, [location.pathname])

  return (
    <aside className="flex h-screen w-[218px] shrink-0 flex-col overflow-hidden border-r border-[#261b12] bg-[#2d2218] text-white">
      <div className="shrink-0 px-4 pb-4 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/14 text-white/82">
            {brandLogoUrl ? (
              <img
                src={brandLogoUrl}
                alt=""
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <Coffee className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-extrabold leading-5">
              {brandName}
            </h1>
            <p className="mt-0.5 truncate text-[11px] font-semibold uppercase tracking-normal text-white/48">
              {config.brandSubtitle}
            </p>
          </div>
        </div>
      </div>

      <nav className="pos-sidebar-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-3">
        {sidebarGroups.map((group, groupIndex) => (
          <div
            key={group.id}
            className={cn(groupIndex > 0 && "mt-2 border-t border-white/[0.08] pt-2")}
          >
            {group.label ? (
              <p className="mb-1 flex h-5 items-center px-3 text-[10px] font-bold uppercase tracking-normal text-white/38">
                {group.label}
              </p>
            ) : null}

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const currentPath = location.pathname.replace(/\/$/, "") || "/"
                const itemPath = item.href.replace(/\/$/, "") || "/"
                const isActive = currentPath === itemPath

                return (
                  <NavLink
                    key={item.id}
                    ref={isActive ? activeItemRef : undefined}
                    to={item.href}
                    end={item.href === "/pos"}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative flex h-10 w-full cursor-pointer items-center gap-3 rounded-md px-3 text-[13px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8c0a2]",
                      isActive
                        ? "bg-white/[0.14] text-white before:absolute before:bottom-1.5 before:left-0 before:top-1.5 before:w-[3px] before:rounded-r before:bg-[#d8c0a2]"
                        : "text-white/66 hover:bg-white/[0.055] hover:text-white/88",
                    )}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 truncate">{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto space-y-2 border-t border-white/[0.08] p-3">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-2.5 text-left transition hover:bg-white/[0.055]"
        >
          <span className="flex min-w-0 items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80"
              alt=""
              className="h-8 w-8 rounded-md object-cover"
            />
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-semibold">{cashierName}</span>
              <span className="block text-[11px] font-medium text-white/45">
                {cashierRole}
              </span>
            </span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-white/55" />
        </button>

        <button
          type="button"
          onClick={() => {
            clearPosSession()
            navigate("/pos/login")
          }}
          className="flex h-9 w-full cursor-pointer items-center gap-3 rounded-md px-2 text-[13px] font-semibold text-white/62 transition hover:bg-white/[0.055] hover:text-white/86"
        >
          <LogOut className="h-4 w-4" />
          ອອກຈາກລະບົບ
        </button>
      </div>
    </aside>
  )
}

function normalizeSidebarBrandName(name: string | undefined, fallback: string) {
  const trimmedName = name?.trim()

  if (!trimmedName || trimmedName === "TJ Cafe Vientiane") {
    return fallback
  }

  return trimmedName
}

function canManageCustomersWhenDisabled(role: string | undefined) {
  const normalized = role?.trim().toLowerCase() ?? ""

  return (
    normalized === "owner" ||
    normalized === "admin" ||
    normalized === "administrator" ||
    normalized === "chủ quán" ||
    normalized === "quan ly" ||
    normalized === "quản lý" ||
    normalized.includes("ເຈົ້າຂອງ")
  )
}
