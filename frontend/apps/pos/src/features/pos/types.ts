import type { LucideIcon } from "lucide-react"

import type { OptionGroup } from "@/features/pos/components/products/product-options"

export type PosType = "cafe" | "retail" | "restaurant" | "beauty" | "hospitality"

export type PosCategory = {
  id: string
  label: string
  icon: LucideIcon
}

export type PosProduct = {
  id: string
  name: string
  price: number
  categoryId: string
  image: string
  subtitle?: string
  stock?: number
  unit?: string
  status?: "active" | "inactive" | "archived"
  availableForSale?: boolean
  optionGroups?: OptionGroup[]
}

export type SidebarItem = {
  id: string
  label: string
  icon: LucideIcon
  href: string
}

export type SidebarGroup = {
  id: string
  label: string
  items: SidebarItem[]
}

export type QuickAction = {
  id: string
  label: string
  icon: LucideIcon
}

export type PosTypeConfig = {
  type: PosType
  brandName: string
  brandSubtitle: string
  cashierName: string
  cashierRole: string
  tableLabel: string
  sidebarItems: SidebarItem[]
  sidebarGroups?: SidebarGroup[]
  categories: PosCategory[]
  quickActions: QuickAction[]
}
