import type { SidebarGroup, SidebarItem } from "@/features/pos/types"

const posCartStorageKey = "tj_pos_cart"

export type PosSession = {
  accessToken: string
  businessSlug: string
  userName: string
  username: string
  role: string
  permissions: string[]
  accountType: "admin" | "pos"
}

const fullAccessRoles = new Set(["Chủ quán", "Quản lý", "OWNER", "MANAGER", "owner", "manager"])

const roleSidebarItems: Record<string, string[]> = {
  "Thu ngân": ["sales", "orders", "customers", "reports"],
  CASHIER: ["sales", "orders", "customers", "reports"],
  "Pha chế": ["orders"],
  BARISTA: ["orders"],
  "Phục vụ": ["sales", "orders", "customers"],
  WAITER: ["sales", "orders", "customers"],
  Kho: ["products", "categories", "stock"],
  STAFF: ["orders"],
  "Nhân viên chung": ["orders"],
}

const itemPermissionMap: Record<string, string[]> = {
  sales: ["orders:manage", "payments:manage"],
  orders: ["orders:read", "orders:manage", "kitchen:manage"],
  customers: ["orders:manage", "tables:manage"],
  products: ["items:read", "items:manage"],
  categories: ["items:manage"],
  combos: ["items:manage"],
  promotions: ["payments:manage", "orders:manage"],
  stock: ["inventory:manage"],
  reports: ["reports:read"],
  staff: ["staff:manage"],
  settings: ["settings:manage"],
}

export function savePosSession(session: PosSession) {
  window.localStorage.setItem("tj_pos_access_token", session.accessToken)
  window.localStorage.setItem("tj_pos_business_slug", session.businessSlug)
  window.localStorage.setItem("tj_pos_user_name", session.userName)
  window.localStorage.setItem("tj_pos_session_role", session.role)
  window.localStorage.setItem("tj_pos_session_permissions", JSON.stringify(session.permissions))
  window.localStorage.setItem("tj_pos_account_type", session.accountType)

  if (session.username) {
    window.localStorage.setItem("tj_pos_session_username", session.username)
  } else {
    window.localStorage.removeItem("tj_pos_session_username")
  }
}

export function getPosSession(): PosSession | null {
  const accessToken = window.localStorage.getItem("tj_pos_access_token") ?? ""

  if (!accessToken) return null

  return {
    accessToken,
    businessSlug: window.localStorage.getItem("tj_pos_business_slug") ?? "",
    userName: window.localStorage.getItem("tj_pos_user_name") ?? "Nhân viên",
    username: window.localStorage.getItem("tj_pos_session_username") ?? "",
    role: window.localStorage.getItem("tj_pos_session_role") ?? "Nhân viên chung",
    permissions: parseStoredPermissions(),
    accountType: (window.localStorage.getItem("tj_pos_account_type") as "admin" | "pos" | null) ?? "admin",
  }
}

export function clearPosSession() {
  window.localStorage.removeItem("tj_pos_access_token")
  window.localStorage.removeItem("tj_pos_business_slug")
  window.localStorage.removeItem("tj_pos_user_name")
  window.localStorage.removeItem("tj_pos_session_role")
  window.localStorage.removeItem("tj_pos_session_permissions")
  window.localStorage.removeItem("tj_pos_session_username")
  window.localStorage.removeItem("tj_pos_account_type")
  window.localStorage.removeItem(posCartStorageKey)
}

export function canAccessSidebarItem(itemId: string, session = getPosSession()) {
  if (!session) return false
  if (session.accountType === "pos") return itemId === "sales" || itemId === "orders"
  if (fullAccessRoles.has(session.role)) return true

  const roleItems = roleSidebarItems[session.role]

  if (roleItems) {
    return roleItems.includes(itemId)
  }

  const requiredPermissions = itemPermissionMap[itemId]

  if (!requiredPermissions) return true

  return requiredPermissions.some((permission) => session.permissions.includes(permission))
}

export function filterSidebarGroupsBySession(groups: SidebarGroup[], session = getPosSession()) {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessSidebarItem(item.id, session)),
    }))
    .filter((group) => group.items.length > 0)
}

export function filterSidebarItemsBySession(items: SidebarItem[], session = getPosSession()) {
  return items.filter((item) => canAccessSidebarItem(item.id, session))
}

export function getFirstAllowedPosPath(session = getPosSession()) {
  const orderedItems = [
    { id: "sales", href: "/pos" },
    { id: "orders", href: "/pos/orders" },
    { id: "products", href: "/pos/products" },
    { id: "stock", href: "/pos/stock" },
    { id: "reports", href: "/pos/reports" },
    { id: "staff", href: "/pos/staff" },
    { id: "settings", href: "/pos/settings" },
  ]

  return orderedItems.find((item) => canAccessSidebarItem(item.id, session))?.href ?? "/pos/login"
}

export function canAccessPosPath(pathname: string, session = getPosSession()) {
  if (!session) return false

  const itemId = getSidebarItemIdFromPath(pathname)

  return itemId ? canAccessSidebarItem(itemId, session) : true
}

export function canSellInPosSession(session = getPosSession()) {
  if (!session) return false
  if (session.accountType === "pos") return true

  const role = session.role.trim().toLowerCase()

  return (
    role === "cashier" ||
    role.includes("thu ngân") ||
    role.includes("thu ngã¢n") ||
    role.includes("ແຄດເຊຍ") ||
    role.includes("ພະນັກງານເກັບເງິນ")
  )
}

export function isSalesReadOnlySession(session = getPosSession()) {
  return !canSellInPosSession(session)
}

function getSidebarItemIdFromPath(pathname: string) {
  const pathMap: Record<string, string> = {
    "/pos": "sales",
    "/pos/orders": "orders",
    "/pos/customers": "customers",
    "/pos/products": "products",
    "/pos/categories": "categories",
    "/pos/combos": "combos",
    "/pos/promotions": "promotions",
    "/pos/stock": "stock",
    "/pos/reports": "reports",
    "/pos/staff": "staff",
    "/pos/settings": "settings",
  }

  return pathMap[pathname]
}

function parseStoredPermissions() {
  try {
    const value = window.localStorage.getItem("tj_pos_session_permissions")

    if (!value) return []

    const permissions = JSON.parse(value)

    return Array.isArray(permissions) ? permissions.filter((item) => typeof item === "string") : []
  } catch {
    return []
  }
}
