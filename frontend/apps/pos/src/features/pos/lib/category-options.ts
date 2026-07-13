import {
  Beef,
  Coffee,
  CupSoda,
  FolderTree,
  Grid2X2,
  IceCreamBowl,
  Package,
  Store,
} from "lucide-react"

import type { BusinessCategoryDto } from "@/features/pos/api/pos-categories-api"
import { getCategoryKey } from "@/features/pos/lib/category-key"
import type { PosCategory } from "@/features/pos/types"

const categoryIconByKey: Partial<Record<string, PosCategory["icon"]>> = {
  coffee: Coffee,
  tea: IceCreamBowl,
  frappe: CupSoda,
  juice: Store,
  cake: Beef,
  other: Package,
}

export function buildPosCategories(
  categories: BusinessCategoryDto[] | undefined,
  fallbackCategories: PosCategory[],
) {
  const activeCategories =
    categories?.filter((category) => category.status === "active") ?? []

  if (!activeCategories.length) {
    return fallbackCategories
  }

  return [
    { id: "all", label: "ທັງໝົດ", icon: Grid2X2 },
    ...activeCategories.map((category) => {
      const categoryKey = getCategoryKey(category.name)

      return {
        id: categoryKey,
        label: category.name,
        icon: categoryIconByKey[categoryKey] ?? FolderTree,
      }
    }),
  ]
}
