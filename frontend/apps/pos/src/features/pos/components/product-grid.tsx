import type { PosProduct } from "@/features/pos/types"

import { ProductCard } from "./product-card"

type ProductGridProps = {
  products: PosProduct[]
  onAddProduct: (product: PosProduct) => void
  readOnly?: boolean
}

export function ProductGrid({ products, onAddProduct, readOnly = false }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 p-4 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={onAddProduct}
          readOnly={readOnly}
        />
      ))}
    </div>
  )
}
