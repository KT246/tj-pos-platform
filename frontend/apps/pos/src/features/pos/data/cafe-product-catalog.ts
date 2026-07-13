import { cafeProducts } from "@/features/pos/data/cafe-products"
import type { OptionGroup } from "@/features/pos/components/products/product-options"
import type { PosProduct } from "@/features/pos/types"

export type ServiceMode = "dine-in" | "takeaway" | "both"

export type CafeProductCatalogItem = PosProduct & {
  sku: string
  costPrice: number
  stock?: number
  unit: string
  description: string
  bestSeller: boolean
  visibleOnSales: boolean
  serviceMode: ServiceMode
  optionGroups?: OptionGroup[]
}

const costById: Record<string, number> = {
  "black-coffee": 12000,
  "milk-coffee": 15000,
  latte: 18000,
  cappuccino: 18000,
  americano: 14000,
  mocha: 21000,
  "caramel-macchiato": 22000,
  "chocolate-frappe": 26000,
  "peach-tea": 16000,
  "lychee-tea": 17000,
  "bac-xiu": 15000,
  "matcha-latte": 19000,
  cookies: 12000,
  cheesecake: 24000,
  croissant: 15000,
  "orange-juice": 18000,
}

const skuById: Record<string, string> = {
  latte: "CF-LATTE-001",
}

const productDisplayOrder = [
  "black-coffee",
  "milk-coffee",
  "latte",
  "cappuccino",
  "americano",
  "mocha",
  "caramel-macchiato",
  "chocolate-frappe",
  "peach-tea",
  "lychee-tea",
  "bac-xiu",
  "matcha-latte",
  "cookies",
  "cheesecake",
  "croissant",
  "orange-juice",
]

const orderedCafeProducts = [...cafeProducts].sort(
  (left, right) =>
    productDisplayOrder.indexOf(left.id) - productDisplayOrder.indexOf(right.id),
)

export const cafeProductCatalog: CafeProductCatalogItem[] = orderedCafeProducts.map(
  (product, index) => ({
    ...product,
    sku:
      skuById[product.id] ??
      `CF-${product.id.toUpperCase()}-${String(index + 1).padStart(3, "0")}`,
    costPrice: costById[product.id] ?? Math.round(product.price * 0.52),
    unit: product.categoryId === "cake" ? "C\u00e1i" : "Ly",
    description:
      product.id === "latte"
        ? "C\u00e0 ph\u00ea espresso k\u1ebft h\u1ee3p v\u1edbi s\u1eefa t\u01b0\u01a1i, v\u1ecb b\u00e9o ng\u1eady nh\u1eb9 nh\u00e0ng."
        : `${product.name} \u0111\u01b0\u1ee3c chu\u1ea9n b\u1ecb theo c\u00f4ng th\u1ee9c chu\u1ea9n c\u1ee7a qu\u00e1n.`,
    bestSeller: ["latte", "milk-coffee", "peach-tea", "cheesecake"].includes(product.id),
    visibleOnSales: true,
    serviceMode: "dine-in",
  }),
)
