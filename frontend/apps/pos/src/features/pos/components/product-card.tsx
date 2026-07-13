import { Plus } from "lucide-react"

import { formatVnd } from "@/features/pos/lib/format"
import type { PosProduct } from "@/features/pos/types"

type ProductCardProps = {
  product: PosProduct
  onAdd: (product: PosProduct) => void
  readOnly?: boolean
}

export function ProductCard({ product, onAdd, readOnly = false }: ProductCardProps) {
  const outOfStock = typeof product.stock === "number" && product.stock <= 0
  const disabled = outOfStock || readOnly

  function addProduct() {
    if (disabled) return
    onAdd(product)
  }

  return (
    <article
      className={`group overflow-hidden rounded-md border border-[#ded4c8] bg-white transition ${
        disabled
          ? "cursor-not-allowed opacity-55"
          : "cursor-pointer hover:border-[#bcae9b] hover:bg-[#fffdfa]"
      }`}
      onClick={addProduct}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") addProduct()
      }}
    >
      <div className="aspect-[1.38] overflow-hidden bg-[#f5ede3]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
      <div className="flex items-end justify-between gap-3 p-3">
        <div className="min-w-0">
          <h3 className="truncate text-[14px] font-bold text-[#2f2419]">
            {product.name}
          </h3>
          <p className="mt-1 text-sm font-semibold text-[#756656]">
            {formatVnd(product.price)}
          </p>
          {outOfStock ? (
            <p className="mt-1 text-xs font-black text-[#d04433]">ໝົດສິນຄ້າ</p>
          ) : null}
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation()
            addProduct()
          }}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md bg-[#2f2419] text-white transition hover:bg-[#4a3726] disabled:cursor-not-allowed disabled:bg-[#cbbba8]"
          aria-label={`ເພີ່ມ ${product.name}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </article>
  )
}
