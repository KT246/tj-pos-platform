import { Grid2X2, LayoutGrid, Plus, Search, ScanBarcode, X } from "lucide-react";

import type { PosType, Product } from "../types";
import { formatMoney } from "../utils";

export function ProductGrid({
  products,
  posType,
  query,
  onQueryChange,
  onAddProduct,
  onOpenScan,
  searchPlaceholder = "ຄົ້ນຫາສິນຄ້າ ຫຼື ສະແກນ Barcode",
  searchFilterLabel = "ສິນຄ້າທັງໝົດ",
  showScanButton = true,
  dense = false
}: {
  products: Product[];
  posType: PosType;
  query: string;
  onQueryChange: (value: string) => void;
  onAddProduct: (product: Product) => void;
  onOpenScan: () => void;
  searchPlaceholder?: string;
  searchFilterLabel?: string;
  showScanButton?: boolean;
  dense?: boolean;
}) {
  const hasSearchAction = Boolean(query || showScanButton);

  return (
    <section className="flex h-full min-w-0 flex-col">
      <div className="mb-2 grid shrink-0 grid-cols-[minmax(0,1fr)_106px] gap-2 xl:grid-cols-[minmax(260px,1fr)_120px_auto]">
        <label className="relative block">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className={`h-10 w-full rounded-lg border border-blue-100 bg-white pl-10 text-[13px] font-bold text-slate-800 shadow-[0_8px_20px_rgba(15,23,42,0.03)] outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 ${
              hasSearchAction ? "pr-10" : "pr-4"
            }`}
            placeholder={searchPlaceholder}
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
          ) : showScanButton ? (
            <button
              type="button"
              onClick={onOpenScan}
              className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:bg-blue-50 hover:text-blue-600"
              aria-label="Scan barcode"
            >
              <ScanBarcode className="h-4 w-4" />
            </button>
          ) : null}
        </label>
        <button
          type="button"
          className="flex h-10 min-w-0 items-center justify-between gap-2 rounded-lg border border-blue-100 bg-white px-2.5 text-[12px] font-black text-slate-800 shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition hover:border-blue-300 hover:bg-blue-50"
        >
          <span className="truncate">{searchFilterLabel}</span>
          <Grid2X2 className="h-4 w-4 text-blue-500" />
        </button>
        <div className="hidden items-center gap-2 xl:flex">
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
            ? "grid-cols-[repeat(auto-fill,minmax(112px,1fr))]"
            : "grid-cols-[repeat(auto-fill,minmax(118px,1fr))]"
        }`}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            posType={posType}
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
  posType,
  onAddProduct,
  dense
}: {
  product: Product;
  posType: PosType;
  onAddProduct: (product: Product) => void;
  dense: boolean;
}) {
  const meta = getProductMeta(product, posType);

  return (
    <button
      type="button"
      onClick={() => onAddProduct(product)}
      className="group min-h-[132px] overflow-hidden rounded-lg border border-blue-100 bg-white text-left shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_14px_28px_rgba(37,99,235,0.1)]"
    >
      <span className="block p-2 pb-0">
        <span
          className={`block rounded-md bg-slate-100 bg-cover bg-center ${
            dense ? "h-[64px]" : "h-[72px]"
          }`}
          style={{ backgroundImage: `url(${product.image})` }}
        />
      </span>
      <span className="block px-2.5 py-2">
        <span className="flex items-start justify-between gap-2">
          <span className="min-w-0">
            <span className="block truncate text-[11px] font-black leading-4 text-slate-950">
              {product.name}
            </span>
            <span className="mt-0.5 block truncate text-[10px] font-bold leading-3 text-slate-400">
              {meta.eyebrow}
            </span>
          </span>
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
            <Plus className="h-3.5 w-3.5" />
          </span>
        </span>
        <span className="mt-1 flex items-center justify-between gap-2">
          <span className="min-w-0 truncate text-[10px] font-black leading-3 text-slate-500">
            {meta.detail}
          </span>
          {meta.badge ? (
            <span
              className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-black ${meta.badgeClass}`}
            >
              {meta.badge}
            </span>
          ) : null}
        </span>
        <span className="mt-1 block text-[12px] font-black leading-4 text-slate-800">
          {formatMoney(product.price)}
        </span>
      </span>
    </button>
  );
}

function getProductMeta(product: Product, posType: PosType) {
  if (posType === "retail") {
    const lowStock =
      typeof product.stock === "number" &&
      typeof product.lowStockThreshold === "number" &&
      product.stock <= product.lowStockThreshold;

    return {
      eyebrow: product.sku,
      detail:
        typeof product.stock === "number"
          ? `${"ຄັງສິນຄ້າ"} ${product.stock}${product.unit ? ` ${product.unit}` : ""}`
          : "ຕິດຕາມຄັງສິນຄ້າ",
      badge: lowStock ? "ຄັງສິນຄ້າຕ່ຳ" : null,
      badgeClass: "bg-orange-50 text-orange-600"
    };
  }

  if (posType === "cafe") {
    const station = product.food?.kitchenStation ?? "ເຄົາເຕີ";
    const prep = product.food?.prepMinutes
      ? `${product.food.prepMinutes} ${"ນາທີ"}`
      : "ກຽມໄວ";

    return {
      eyebrow: station,
      detail: prep,
      badge: product.food?.hasModifiers ? "ຕົວເລືອກ" : null,
      badgeClass: "bg-emerald-50 text-emerald-600"
    };
  }

  if (posType === "restaurant") {
    const station = product.food?.kitchenStation ?? "ຄົວ";
    const prep = product.food?.prepMinutes
      ? `${product.food.prepMinutes} ${"ນາທີ"}`
      : "ລາຍການຄົວ";

    return {
      eyebrow: station,
      detail: prep,
      badge: product.food?.hasModifiers ? "ຕົວເລືອກ" : null,
      badgeClass: "bg-violet-50 text-violet-600"
    };
  }

  if (posType === "beauty") {
    const staff = product.beauty?.assignedStaff?.slice(0, 2).join(", ");
    const duration = product.beauty?.durationMinutes
      ? `${product.beauty.durationMinutes} ${"ນາທີ"}`
      : "ບໍລິການ";

    return {
      eyebrow: duration,
      detail: staff ? `${"ພະນັກງານ"}: ${staff}` : "ຮັບລູກຄ້າໜ້າຮ້ານ",
      badge: product.beauty?.bookingRequired ? "ການຈອງ" : null,
      badgeClass: "bg-fuchsia-50 text-fuchsia-600"
    };
  }

  if (product.hospitality?.roomNumber) {
    const status = product.hospitality.roomStatus
      ? toTitleCase(product.hospitality.roomStatus)
      : "ວ່າງ";
    const priceMode = product.hospitality.priceMode
      ? product.hospitality.priceMode
      : "ຄືນ";

    return {
      eyebrow: `${"ຫ້ອງ"} ${product.hospitality.roomNumber}`,
      detail: `${product.hospitality.roomType ?? "ຫ້ອງ"} · ${
        product.hospitality.capacity ?? 1
      } ${"ແຂກ"} · ${priceMode}`,
      badge: status,
      badgeClass:
        product.hospitality.roomStatus === "available"
          ? "bg-emerald-50 text-emerald-600"
          : "bg-orange-50 text-orange-600"
    };
  }

  return {
    eyebrow: "ບໍລິການເພີ່ມ",
    detail: product.unit ? product.unit : product.sku,
    badge: null,
    badgeClass: "bg-blue-50 text-blue-600"
  };
}

function toTitleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
