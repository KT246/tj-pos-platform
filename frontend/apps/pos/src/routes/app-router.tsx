import { useQuery } from "@tanstack/react-query"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom"
import type { ReactNode } from "react"
import { lazy, Suspense, useEffect, useState } from "react"

import { getPosSettings } from "@/features/pos/api/pos-settings-api"
import {
  canAccessPosPath,
  getFirstAllowedPosPath,
  getPosSession,
  savePosSession,
} from "@/features/pos/lib/pos-session"
import { apiGet } from "@/lib/http"

const PosLayout = lazy(async () => ({
  default: (await import("@/features/pos/components/pos-layout")).PosLayout,
}))
const PosCategoriesPage = lazy(async () => ({
  default: (await import("@/features/pos/pages/pos-categories-page")).PosCategoriesPage,
}))
const PosCombosPage = lazy(async () => ({
  default: (await import("@/features/pos/pages/pos-combos-page")).PosCombosPage,
}))
const PosCustomersPage = lazy(async () => ({
  default: (await import("@/features/pos/pages/pos-customers-page")).PosCustomersPage,
}))
const PosHomePage = lazy(async () => ({
  default: (await import("@/features/pos/pages/pos-home-page")).PosHomePage,
}))
const PosLoginPage = lazy(async () => ({
  default: (await import("@/features/pos/pages/pos-login-page")).PosLoginPage,
}))
const PosOrdersPage = lazy(async () => ({
  default: (await import("@/features/pos/pages/pos-orders-page")).PosOrdersPage,
}))
const PosPlaceholderPage = lazy(async () => ({
  default: (await import("@/features/pos/pages/pos-placeholder-page")).PosPlaceholderPage,
}))
const PosProductsPage = lazy(async () => ({
  default: (await import("@/features/pos/pages/pos-products-page")).PosProductsPage,
}))
const PosPromotionsPage = lazy(async () => ({
  default: (await import("@/features/pos/pages/pos-promotions-page")).PosPromotionsPage,
}))
const PosReportsPage = lazy(async () => ({
  default: (await import("@/features/pos/pages/pos-reports-page")).PosReportsPage,
}))
const PosSettingsPage = lazy(async () => ({
  default: (await import("@/features/pos/pages/pos-settings-page")).PosSettingsPage,
}))
const PosStaffPage = lazy(async () => ({
  default: (await import("@/features/pos/pages/pos-staff-page")).PosStaffPage,
}))
const PosStockPage = lazy(async () => ({
  default: (await import("@/features/pos/pages/pos-stock-page")).PosStockPage,
}))

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Navigate to="/pos" replace />} />
          <Route path="/pos/login" element={<PosLoginPage />} />
          <Route element={<RequirePosAccess><PosLayout /></RequirePosAccess>}>
            <Route path="/pos" element={<PosHomePage />} />
            <Route path="/pos/orders" element={<PosOrdersPage />} />
            <Route path="/pos/customers" element={<PosCustomersPage />} />
            <Route path="/pos/products" element={<PosProductsPage />} />
            <Route path="/pos/categories" element={<PosCategoriesPage />} />
            <Route path="/pos/combos" element={<PosCombosPage />} />
            <Route path="/pos/promotions" element={<PosPromotionsPage />} />
            <Route path="/pos/stock" element={<PosStockPage />} />
            <Route path="/pos/reports" element={<PosReportsPage />} />
            <Route path="/pos/staff" element={<PosStaffPage />} />
            <Route path="/pos/settings" element={<PosSettingsPage />} />
            <Route path="/pos/:module" element={<PosPlaceholderPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/pos" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

function RouteLoading() {
  return <div className="min-h-[100dvh] bg-[#f7f0e7]" aria-label="Loading" />
}

function RequirePosAccess({ children }: { children: ReactNode }) {
  const [, setSessionVersion] = useState(0)
  const session = getPosSession()
  const pathname = useLocation().pathname
  const isCustomersPath = pathname === "/pos/customers"
  const settingsQuery = useQuery({
    queryKey: ["pos-settings"],
    queryFn: getPosSettings,
    enabled: Boolean(session) && isCustomersPath,
    staleTime: 60_000,
  })

  useEffect(() => {
    if (!session) return

    let cancelled = false

    apiGet<{
      accessToken: string
      business: { slug: string }
      user: { name: string; username: string | null }
      role: string
      permissions: string[]
      accountType?: "admin" | "pos"
    }>("/auth/me")
      .then((nextSession) => {
        if (cancelled) return

        savePosSession({
          accessToken: nextSession.accessToken,
          businessSlug: nextSession.business.slug,
          userName: nextSession.user.name,
          username: nextSession.user.username ?? session.username,
          role: nextSession.role,
          permissions: nextSession.permissions,
          accountType: nextSession.accountType ?? "admin",
        })
        setSessionVersion((version) => version + 1)
      })
      .catch(() => {
        // Keep the existing local session; route guards will handle missing tokens.
      })

    return () => {
      cancelled = true
    }
  }, [session?.accessToken])

  if (!session) {
    return <Navigate to="/pos/login" replace />
  }

  if (!canAccessPosPath(pathname, session)) {
    return <Navigate to={getFirstAllowedPosPath(session)} replace />
  }

  if (isCustomersPath && settingsQuery.isLoading) {
    return null
  }

  if (
    isCustomersPath &&
    settingsQuery.data?.customers.enabled === false &&
    !canManageCustomersWhenDisabled(session.role)
  ) {
    return <Navigate to={getFirstAllowedPosPath(session)} replace />
  }

  return children
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
