import { Grid2X2, LayoutGrid, Plus, Search, ScanBarcode, X } from "lucide-react";

import type { Product } from "../types";
import { formatMoney } from "../utils";
import { lo } from "../utils/lao-labels";

export function ProductGrid({
  products,
  query,
  onQueryChange,
  onAddProduct,
  onOpenScan,
  dense = false
}: {
  products: Product[];
  query: string;
  onQueryChange: (value: string) => void;
  onAddProduct: (product: Product) => void;
  onOpenScan: () => void;
  dense?: boolean;
}) {
  return (
    <section className="flex h-full min-w-0 flex-col">
      <div className="mb-3 grid shrink-0 gap-3 lg:grid-cols-[minmax(260px,1fr)_120px_auto]">
        <label className="relative block">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="h-10 w-full rounded-lg border border-blue-100 bg-white pr-11 pl-11 text-[13px] font-bold text-slate-800 shadow-[0_8px_20px_rgba(15,23,42,0.03)] outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
            placeholder={lo("Search item or scan barcode")}
          />
          {query ? (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenScan}
              className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:bg-blue-50 hover:text-blue-600"
              aria-label="Scan barcode"
            >
              <ScanBarcode className="h-4 w-4" />
            </button>
          )}
        </label>
        <button
          type="button"
          className="flex h-10 items-center justify-between gap-2 rounded-lg border border-blue-100 bg-white px-3 text-[12px] font-black text-slate-800 shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition hover:border-blue-300 hover:bg-blue-50"
        >
          {lo("All Items")}
          <Grid2X2 className="h-4 w-4 text-blue-500" />
        </button>
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600"
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-100 bg-white text-slate-500 transition hover:bg-blue-50"
            aria-label="Compact view"
          >
            <Grid2X2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        className={`min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:thin] grid content-start gap-3 ${
          dense
            ? "grid-cols-[repeat(auto-fill,minmax(132px,1fr))]"
            : "grid-cols-[repeat(auto-fill,minmax(138px,1fr))]"
        }`}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddProduct={onAddProduct}
            dense={dense}
          />
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  onAddProduct,
  dense
}: {
  product: Product;
  onAddProduct: (product: Product) => void;
  dense: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onAddProduct(product)}
      className="group min-h-[150px] overflow-hidden rounded-lg border border-blue-100 bg-white text-left shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_14px_28px_rgba(37,99,235,0.1)]"
    >
      <span className="block p-2 pb-0">
        <span
          className={`block rounded-md bg-slate-100 bg-cover bg-center ${
            dense ? "h-[72px]" : "h-[88px]"
          }`}
          style={{ backgroundImage: `url(${product.image})` }}
        />
      </span>
      <span className="block px-3 py-2">
        <span className="flex items-start justify-between gap-2">
          <span className="min-w-0">
            <span className="block truncate text-[12px] font-black leading-4 text-slate-950">
              {lo(product.name)}
            </span>
            <span className="mt-0.5 block text-[10px] font-bold leading-3 text-slate-400">
              {product.sku}
            </span>
          </span>
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
            <Plus className="h-3.5 w-3.5" />
          </span>
        </span>
        <span className="mt-1.5 block text-[12px] font-black leading-4 text-slate-800">
          {formatMoney(product.price)}
        </span>
      </span>
    </button>
  );
}
