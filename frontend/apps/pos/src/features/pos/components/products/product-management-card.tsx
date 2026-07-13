import { MoreVertical } from "lucide-react"

import type { CafeProductCatalogItem } from "@/features/pos/data/cafe-product-catalog"
import { formatVnd } from "@/features/pos/lib/format"
import { cn } from "@/lib/utils"

type ProductManagementCardProps = {
  product: CafeProductCatalogItem
  selected: boolean
  onSelect: (productId: string) => void
}

export function ProductManagementCard({
  product,
  selected,
  onSelect,
}: ProductManagementCardProps) {
  return (
    <article
      onClick={() => onSelect(product.id)}
      className={cn(
        "group relative overflow-hidden rounded-md border bg-white transition hover:border-[#bcae9b] hover:bg-[#fffdfa]",
        selected ? "border-[#2f2419] ring-2 ring-[#d8c0a2]" : "border-[#ded4c8]",
      )}
    >
      <button
        type="button"
        className="absolute right-2 top-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-white/86 text-[#4f4032] transition hover:bg-white"
        aria-label={`ເປີດການຈັດການ ${product.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      <button type="button" className="block w-full cursor-pointer text-left">
        <div className="aspect-[1.15] overflow-hidden bg-[#f5ede3]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
        <div className="p-3">
          <h3 className="truncate text-[14px] font-bold text-[#2f2419]">
            {product.name}
          </h3>
          <p className="mt-1 text-sm font-semibold text-[#4f4032]">
            {formatVnd(product.price)}
          </p>
          <p className="mt-2 text-xs font-semibold text-[#2e7a46]">
            {product.visibleOnSales ? "ກຳລັງສະແດງໃນ POS" : "ຖືກເຊື່ອງຈາກ POS"}
          </p>
        </div>
      </button>
    </article>
  )
}
