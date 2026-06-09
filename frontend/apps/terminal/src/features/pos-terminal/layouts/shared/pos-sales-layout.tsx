import { ActionBar } from "../../components/action-bar";
import { CartPanel } from "../../components/cart-panel";
import { CategoryRail } from "../../components/category-rail";
import { ProductGrid } from "../../components/product-grid";
import type {
  CartLine,
  Category,
  Discount,
  OrderType,
  Product,
  TerminalBusinessProfile
} from "../../types";

export type LayoutContextItem = {
  label: string;
  value: string;
  tone?: "blue" | "emerald" | "orange" | "violet" | "slate";
};

const toneClasses: Record<NonNullable<LayoutContextItem["tone"]>, string> = {
  blue: "border-blue-100 bg-blue-50 text-blue-700",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
  orange: "border-orange-100 bg-orange-50 text-orange-700",
  violet: "border-violet-100 bg-violet-50 text-violet-700",
  slate: "border-slate-100 bg-white text-slate-700"
};

export function PosSalesLayout({
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
  onAction,
  contextItems
}: {
  business: TerminalBusinessProfile;
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
  products: Product[];
  query: string;
  onQueryChange: (value: string) => void;
  onAddProduct: (product: Product) => void;
  onOpenScan: () => void;
  cart: CartLine[];
  discount: Discount | null;
  selectedTable: string | null;
  orderType: OrderType;
  customerName: string | null;
  onIncrement: (lineId: string) => void;
  onDecrement: (lineId: string) => void;
  onRemove: (lineId: string) => void;
  onClear: () => void;
  onDiscount: () => void;
  onCustomer: () => void;
  onAction: (label: string) => void;
  contextItems: LayoutContextItem[];
}) {
  return (
    <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_44px] gap-2 lg:gap-3">
      <div className="grid h-full min-h-0 overflow-hidden grid-cols-[112px_minmax(0,1fr)_300px] gap-2 lg:grid-cols-[132px_minmax(0,1fr)_330px] xl:grid-cols-[150px_minmax(0,1fr)_360px]">
        <CategoryRail
          categories={categories}
          activeCategory={activeCategory}
          onSelect={onSelectCategory}
        />
        <div className="grid min-h-0 grid-rows-[42px_minmax(0,1fr)] gap-2">
          <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
            {contextItems.map((item) => (
              <div
                key={`${item.label}-${item.value}`}
                className={`min-w-0 rounded-lg border px-3 py-2 ${toneClasses[item.tone ?? "blue"]}`}
              >
                <p className="truncate text-[10px] font-black leading-3 opacity-75">
                  {item.label}
                </p>
                <p className="truncate text-[12px] font-black leading-4">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <ProductGrid
            products={products}
            posType={business.posType}
            query={query}
            onQueryChange={onQueryChange}
            onAddProduct={onAddProduct}
            onOpenScan={onOpenScan}
            searchPlaceholder={business.searchPlaceholder}
            searchFilterLabel={business.searchFilterLabel}
            showScanButton={business.capabilities.hasBarcode}
          />
        </div>
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

      <div className="min-h-0">
        <ActionBar
          businessSlug={business.slug}
          actions={business.quickActions}
          onAction={onAction}
        />
      </div>
    </div>
  );
}
