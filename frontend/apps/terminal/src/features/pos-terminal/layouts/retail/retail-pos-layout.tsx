import type { ComponentProps } from "react";
import {
  AlertTriangle,
  Barcode,
  Boxes,
  FolderOpen,
  PackageCheck,
  Plus,
  ScanBarcode,
  Search,
  ShoppingBasket,
  Tags,
  X
} from "lucide-react";

import { ActionBar } from "../../components/action-bar";
import { CartPanel } from "../../components/cart-panel";
import type { Product } from "../../types";
import { formatMoney } from "../../utils";
import { PosSalesLayout } from "../shared/pos-sales-layout";

type Props = Omit<ComponentProps<typeof PosSalesLayout>, "contextItems">;

export function RetailPosLayout({
  business,
  categories,
  activeCategory,
  onSelectCategory,
  products,
  query,
  onQueryChange,
  onAddProduct,
  onOpenScan,
  cart,
  discount,
  selectedTable,
  orderType,
  customerName,
  onIncrement,
  onDecrement,
  onRemove,
  onClear,
  onDiscount,
  onCustomer,
  onAction
}: Props) {
  const totalStock = business.products.reduce(
    (sum, product) => sum + (product.stock ?? 0),
    0
  );
  const lowStockCount = business.products.filter((product) =>
    isLowStock(product)
  ).length;
  const wholesaleCount = business.products.filter(
    (product) => product.wholesalePrice
  ).length;
  const selectedCategory =
    categories.find((category) => category.id === activeCategory)?.label ??
    "ສິນຄ້າທັງໝົດ";

  return (
    <div className="-m-2 -mt-[65px] grid h-screen min-h-0 grid-cols-[286px_minmax(0,1fr)] overflow-hidden lg:-m-3 lg:-mt-[69px]">
      <aside className="sticky top-0 left-0 z-30 grid h-screen min-h-0 grid-rows-[auto_auto_minmax(0,1fr)_auto] gap-2 overflow-hidden border-r border-blue-100 bg-[#f3f7fb] p-2 shadow-[12px_0_28px_rgba(15,23,42,0.04)] lg:p-3">
          <div className="overflow-hidden rounded-xl border border-blue-200 bg-white shadow-[0_12px_28px_rgba(37,99,235,0.08)]">
            <div className="bg-blue-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <Barcode className="h-7 w-7" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-black">
                    {"ເຄົາເຕີຂາຍປີກ"}
                  </p>
                  <p className="text-[11px] font-bold text-blue-100">
                    {"ຊຳລະແບບສະແກນ Barcode"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenScan}
                aria-label="Scan barcode"
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white text-[14px] font-black text-blue-600 shadow-[0_14px_24px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                <ScanBarcode className="h-5 w-5" />
                {"ສະແກນ Barcode ສິນຄ້າ"}
              </button>
            </div>
            <div className="grid grid-cols-3 divide-x divide-blue-50 p-3">
              <RetailStat
                label="ຄັງລວມ"
                value={String(totalStock)}
                tone="blue"
              />
              <RetailStat
                label="ສິນຄ້າຄັງຕ່ຳ"
                value={String(lowStockCount)}
                tone="orange"
              />
              <RetailStat
                label="ສິນຄ້າລາຄາສົ່ງ"
                value={String(wholesaleCount)}
                tone="emerald"
              />
            </div>
          </div>

          <label className="relative block">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              className="h-11 w-full rounded-lg border border-blue-100 bg-white pr-10 pl-9 text-[13px] font-bold text-slate-800 shadow-[0_8px_20px_rgba(15,23,42,0.035)] outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              placeholder={business.searchPlaceholder}
            />
            {query ? (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </label>

          <div className="min-h-0 overflow-y-auto rounded-xl border border-blue-100 bg-white p-2 shadow-[0_10px_24px_rgba(15,23,42,0.04)] [scrollbar-width:thin]">
            <div className="mb-2 flex items-center gap-2 px-1">
              <FolderOpen className="h-4 w-4 text-blue-600" />
              <p className="text-[12px] font-black text-slate-950">
                {"ກຸ່ມຂາຍປີກ"}
              </p>
            </div>
            <div className="space-y-1.5">
              {categories.map((category) => {
                const active = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => onSelectCategory(category.id)}
                    className={`flex h-10 w-full items-center justify-between gap-2 rounded-lg px-3 text-left text-[12px] font-black transition ${
                      active
                        ? "bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.2)]"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <span className="truncate">{category.label}</span>
                    {category.id === "low-stock" ? (
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                    ) : (
                      <ShoppingBasket className="h-4 w-4 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
            <div className="flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-emerald-600" />
              <p className="text-[12px] font-black text-emerald-700">
                {"ພ້ອມຂາຍປີກ"}
              </p>
            </div>
            <p className="mt-1 text-[11px] font-bold leading-4 text-emerald-700/80">
              {"ສະແກນ, ກວດຄັງ, ໃຊ້ລາຄາສົ່ງ ແລະ ຊຳລະໄດ້ໄວ."}
            </p>
          </div>
        </aside>

      <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_44px] gap-2 overflow-hidden p-2 pt-16 lg:gap-3 lg:p-3 lg:pt-16">
        <div className="grid h-full min-h-0 overflow-hidden grid-cols-[minmax(0,1fr)_330px] gap-2 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-2 overflow-hidden">
          <div className="rounded-xl border border-blue-100 bg-white p-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[18px] font-black leading-6 text-slate-950">
                  {"ລາຍການສິນຄ້າຂາຍປີກ"}
                </p>
                <p className="truncate text-[12px] font-bold text-slate-500">
                  {"ກຸ່ມທີ່ເລືອກ"}: {selectedCategory}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <RetailChip icon={Boxes} label="ພົບສິນຄ້າ" value={products.length} />
                <RetailChip
                  icon={AlertTriangle}
                  label="ແຈ້ງເຕືອນຄັງ"
                  value={products.filter((product) => isLowStock(product)).length}
                  tone="orange"
                />
              </div>
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto rounded-xl border border-blue-100 bg-white p-2 shadow-[0_12px_28px_rgba(15,23,42,0.045)] [scrollbar-width:thin]">
            <div className="grid min-w-[720px] grid-cols-[minmax(240px,1fr)_120px_110px_128px_112px] border-b border-blue-50 px-3 pb-2 text-[10px] font-black uppercase tracking-normal text-slate-400">
              <span>{"ສິນຄ້າ"}</span>
              <span>{"SKU"}</span>
              <span>{"ຈຳນວນຄັງ"}</span>
              <span>{"ລາຄາຂາຍປີກ"}</span>
              <span className="text-right">{"ການດຳເນີນການ"}</span>
            </div>
            <div className="min-w-[720px] space-y-2 pt-2">
              {products.length > 0 ? (
                products.map((product) => (
                  <RetailProductRow
                    key={product.id}
                    product={product}
                    onAddProduct={onAddProduct}
                  />
                ))
              ) : (
                <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-blue-100 bg-blue-50/40 text-center">
                  <div>
                    <p className="text-[14px] font-black text-slate-700">
                      {"ບໍ່ມີສິນຄ້າທີ່ກົງກັບຕົວກອງນີ້."}
                    </p>
                    <p className="mt-1 text-[12px] font-bold text-slate-500">
                      {"ລອງເລືອກກຸ່ມສິນຄ້າອື່ນ ຫຼື ຄົ້ນຫາດ້ວຍ Barcode."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          </section>

          <CartPanel
            businessSlug={business.slug}
            posType={business.posType}
            cart={cart}
            discount={discount}
            selectedTable={selectedTable}
            orderType={orderType}
            customerName={customerName}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onRemove={onRemove}
            onClear={onClear}
            onDiscount={onDiscount}
            onCustomer={onCustomer}
          />
        </div>

        <ActionBar
          businessSlug={business.slug}
          actions={business.quickActions}
          onAction={onAction}
        />
      </div>
    </div>
  );
}

function RetailProductRow({
  product,
  onAddProduct
}: {
  product: Product;
  onAddProduct: (product: Product) => void;
}) {
  const lowStock = isLowStock(product);

  return (
    <div className="grid grid-cols-[minmax(240px,1fr)_120px_110px_128px_112px] items-center gap-3 rounded-lg border border-blue-50 bg-[#fbfdff] px-3 py-2 transition hover:border-blue-300 hover:bg-white hover:shadow-[0_12px_24px_rgba(37,99,235,0.08)]">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={product.image}
          alt=""
          className="h-14 w-14 rounded-lg border border-blue-100 object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-black leading-5 text-slate-950">
            {product.name}
          </p>
          <p className="truncate text-[11px] font-bold text-slate-500">
            {"ເລກ Barcode"}: {product.barcode ?? "-"}
          </p>
          {product.wholesalePrice ? (
            <p className="mt-0.5 flex items-center gap-1 text-[10px] font-black text-emerald-600">
              <Tags className="h-3 w-3" />
              {"ຂາຍສົ່ງ"} {formatMoney(product.wholesalePrice)}
            </p>
          ) : null}
        </div>
      </div>

      <p className="truncate text-[12px] font-black text-slate-700">
        {product.sku}
      </p>

      <div>
        <p
          className={`inline-flex rounded-full px-2 py-1 text-[11px] font-black ${
            lowStock
              ? "bg-orange-50 text-orange-600"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {product.stock ?? 0} {product.unit ? product.unit : ""}
        </p>
        {lowStock ? (
          <p className="mt-1 text-[10px] font-black text-orange-500">
            {"ຄັງສິນຄ້າຕ່ຳ"}
          </p>
        ) : null}
      </div>

      <p className="text-[14px] font-black text-blue-600">
        {formatMoney(product.price)}
      </p>

      <button
        type="button"
        onClick={() => onAddProduct(product)}
        className="ml-auto flex h-10 min-w-20 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 text-[12px] font-black whitespace-nowrap text-white shadow-[0_10px_18px_rgba(37,99,235,0.2)] transition hover:-translate-y-0.5 hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" />
        {"ເພີ່ມ"}
      </button>
    </div>
  );
}

function RetailStat({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: "blue" | "orange" | "emerald";
}) {
  const toneClass = {
    blue: "text-blue-600",
    orange: "text-orange-600",
    emerald: "text-emerald-600"
  }[tone];

  return (
    <div className="px-2 text-center">
      <p className={`text-[15px] font-black leading-5 ${toneClass}`}>{value}</p>
      <p className="mt-0.5 text-[9px] font-black leading-3 text-slate-500">
        {label}
      </p>
    </div>
  );
}

function RetailChip({
  icon: Icon,
  label,
  value,
  tone = "blue"
}: {
  icon: typeof Boxes;
  label: string;
  value: number;
  tone?: "blue" | "orange";
}) {
  const toneClass =
    tone === "orange"
      ? "border-orange-100 bg-orange-50 text-orange-600"
      : "border-blue-100 bg-blue-50 text-blue-600";

  return (
    <div
      className={`flex h-10 items-center gap-2 rounded-lg border px-3 ${toneClass}`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-[11px] font-black">{label}</span>
      <span className="text-[13px] font-black">{value}</span>
    </div>
  );
}

function isLowStock(product: Product) {
  return (
    typeof product.stock === "number" &&
    typeof product.lowStockThreshold === "number" &&
    product.stock <= product.lowStockThreshold
  );
}
