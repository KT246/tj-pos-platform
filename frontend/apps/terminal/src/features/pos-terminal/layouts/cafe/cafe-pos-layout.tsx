import type { ComponentProps } from "react";
import {
  Coffee,
  CupSoda,
  Flame,
  FolderOpen,
  PackageCheck,
  Plus,
  Search,
  Sparkles,
  Timer,
  Utensils,
  X
} from "lucide-react";

import { ActionBar } from "../../components/action-bar";
import { CartPanel } from "../../components/cart-panel";
import { TerminalBrand } from "../../components/terminal-brand";
import type { Product } from "../../types";
import { formatMoney } from "../../utils";
import { PosSalesLayout } from "../shared/pos-sales-layout";

type Props = Omit<ComponentProps<typeof PosSalesLayout>, "contextItems">;

export function CafePosLayout({
  business,
  categories,
  activeCategory,
  onSelectCategory,
  products,
  query,
  onQueryChange,
  onAddProduct,
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
  const selectedCategory =
    categories.find((category) => category.id === activeCategory)?.label ??
    "ເມນູທັງໝົດ";
  const baristaItems = business.products.filter(
    (product) => product.food?.kitchenStation === "ບາຣິສຕ້າ"
  ).length;
  const modifierItems = business.products.filter(
    (product) => product.food?.hasModifiers
  ).length;
  const avgPrepMinutes = Math.max(
    1,
    Math.round(
      business.products.reduce(
        (sum, product) => sum + (product.food?.prepMinutes ?? 0),
        0
      ) / business.products.length
    )
  );

  return (
    <div className="-m-2 -mt-[65px] grid h-screen min-h-0 grid-cols-[286px_minmax(0,1fr)] overflow-hidden lg:-m-3 lg:-mt-[69px]">
      <aside className="sticky top-0 left-0 z-30 grid h-screen min-h-0 grid-rows-[auto_auto_auto_minmax(0,1fr)_auto] gap-2 overflow-hidden border-r border-blue-100 bg-[#f3f7fb] p-2 shadow-[12px_0_28px_rgba(15,23,42,0.04)] lg:p-3">
        <div className="rounded-xl border border-blue-100 bg-white p-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <TerminalBrand />
        </div>

        <div className="overflow-hidden rounded-xl border border-amber-200 bg-white shadow-[0_12px_28px_rgba(245,158,11,0.1)]">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Coffee className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-black">
                  {"ເຄົາເຕີຮ້ານກາເຟ"}
                </p>
                <p className="text-[11px] font-bold text-amber-100">
                  {"ເມນູ ແລະ ຂັ້ນຕອນຮັບເຄື່ອງດື່ມ"}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 divide-x divide-white/15 rounded-lg bg-white/10 p-3">
              <CafeStat label="ລາຍການບາຣິສຕ້າ" value={String(baristaItems)} />
              <CafeStat label="ຕົວເລືອກ" value={String(modifierItems)} />
              <CafeStat label="ເວລາກຽມສະເລ່ຍ" value={`${avgPrepMinutes}m`} />
            </div>
          </div>
        </div>

        <label className="relative block">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="h-11 w-full rounded-lg border border-amber-100 bg-white pr-10 pl-9 text-[13px] font-bold text-slate-800 shadow-[0_8px_20px_rgba(15,23,42,0.035)] outline-none transition placeholder:text-slate-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-50"
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
            <FolderOpen className="h-4 w-4 text-amber-600" />
            <p className="text-[12px] font-black text-slate-950">
              {"ກຸ່ມເມນູກາເຟ"}
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
                      ? "bg-amber-500 text-white shadow-[0_10px_20px_rgba(245,158,11,0.2)]"
                      : "text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                  }`}
                >
                  <span className="truncate">{category.label}</span>
                  {getCategoryIcon(category.id)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-4 w-4 text-emerald-600" />
            <p className="text-[12px] font-black text-emerald-700">
              {"ພ້ອມຮັບອໍເດີກາເຟ"}
            </p>
          </div>
          <p className="mt-1 text-[11px] font-bold leading-4 text-emerald-700/80">
            {"ຮັບອໍເດີ, ເພີ່ມຕົວເລືອກ ແລະ ສົ່ງເຄື່ອງດື່ມໃຫ້ບາຣິສຕ້າ."}
          </p>
        </div>
      </aside>

      <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_44px] gap-2 overflow-hidden p-2 pt-16 lg:gap-3 lg:p-3 lg:pt-16">
        <div className="grid h-full min-h-0 overflow-hidden grid-cols-[minmax(0,1fr)_330px] gap-2 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-2 overflow-hidden">
            <div className="rounded-xl border border-amber-100 bg-white p-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[18px] font-black leading-6 text-slate-950">
                    {"ກະດານເມນູກາເຟ"}
                  </p>
                  <p className="truncate text-[12px] font-bold text-slate-500">
                    {"ກຸ່ມທີ່ເລືອກ"}: {selectedCategory}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CafeChip icon={Coffee} label="ລາຍການເມນູ" value={products.length} />
                  <CafeChip
                    icon={Timer}
                    label="ຂັ້ນຕອນກຽມ"
                    value={`${avgPrepMinutes} ${"ນາທີ"}`}
                    tone="emerald"
                  />
                </div>
              </div>
            </div>

            <div className="min-h-0 overflow-y-auto rounded-xl border border-blue-100 bg-white p-2 shadow-[0_12px_28px_rgba(15,23,42,0.045)] [scrollbar-width:thin]">
              <div className="grid content-start gap-3 [grid-template-columns:repeat(auto-fill,minmax(164px,1fr))]">
                {products.length > 0 ? (
                  products.map((product) => (
                    <CafeMenuCard
                      key={product.id}
                      product={product}
                      onAddProduct={onAddProduct}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex min-h-64 items-center justify-center rounded-lg border border-dashed border-amber-100 bg-amber-50/40 text-center">
                    <div>
                      <p className="text-[14px] font-black text-slate-700">
                        {"ບໍ່ມີເມນູທີ່ກົງກັບຕົວກອງນີ້."}
                      </p>
                      <p className="mt-1 text-[12px] font-bold text-slate-500">
                        {"ລອງເລືອກກຸ່ມເມນູອື່ນ ຫຼື ຄົ້ນຫາຊື່ເຄື່ອງດື່ມ."}
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

function CafeMenuCard({
  product,
  onAddProduct
}: {
  product: Product;
  onAddProduct: (product: Product) => void;
}) {
  const station = product.food?.kitchenStation ?? "ເຄົາເຕີ";
  const prep = product.food?.prepMinutes ?? 3;

  return (
    <button
      type="button"
      onClick={() => onAddProduct(product)}
      className="group overflow-hidden rounded-xl border border-blue-100 bg-[#fbfdff] text-left shadow-[0_10px_22px_rgba(15,23,42,0.045)] transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-white hover:shadow-[0_14px_30px_rgba(245,158,11,0.13)]"
    >
      <span className="relative block">
        <span
          className="block h-24 bg-slate-100 bg-cover bg-center"
          style={{ backgroundImage: `url(${product.image})` }}
        />
        <span className="absolute top-2 right-2 rounded-full bg-white/95 px-2 py-1 text-[10px] font-black text-amber-600 shadow-sm">
          {prep} {"ນາທີ"}
        </span>
      </span>
      <span className="block p-3">
        <span className="flex items-start justify-between gap-2">
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-black leading-5 text-slate-950">
              {product.name}
            </span>
            <span className="mt-0.5 block truncate text-[11px] font-bold text-slate-500">
              {station}
            </span>
          </span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white">
            <Plus className="h-4 w-4" />
          </span>
        </span>
        <span className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[14px] font-black text-blue-600">
            {formatMoney(product.price)}
          </span>
          {product.food?.hasModifiers ? (
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-600">
              {"ຕົວເລືອກ"}
            </span>
          ) : null}
        </span>
      </span>
    </button>
  );
}

function CafeStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 text-center">
      <p className="text-[15px] font-black leading-5 text-white">{value}</p>
      <p className="mt-0.5 text-[9px] font-black leading-3 text-amber-100">
        {label}
      </p>
    </div>
  );
}

function CafeChip({
  icon: Icon,
  label,
  value,
  tone = "amber"
}: {
  icon: typeof Coffee;
  label: string;
  value: string | number;
  tone?: "amber" | "emerald";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-100 bg-emerald-50 text-emerald-600"
      : "border-amber-100 bg-amber-50 text-amber-700";

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

function getCategoryIcon(categoryId: string) {
  if (categoryId === "coffee") {
    return <Coffee className="h-4 w-4 shrink-0" />;
  }

  if (categoryId === "tea" || categoryId === "non-coffee") {
    return <CupSoda className="h-4 w-4 shrink-0" />;
  }

  if (categoryId === "pastry" || categoryId === "snacks") {
    return <Utensils className="h-4 w-4 shrink-0" />;
  }

  if (categoryId === "combos") {
    return <Sparkles className="h-4 w-4 shrink-0" />;
  }

  if (categoryId === "add-ons") {
    return <Flame className="h-4 w-4 shrink-0" />;
  }

  return <Coffee className="h-4 w-4 shrink-0" />;
}
