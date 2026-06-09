import { useEffect } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { StaffBottomNav } from "../components/staff-bottom-nav";
import { StaffCartSummary } from "../components/staff-cart-summary";
import { StaffContextCard, StaffOrderHeader } from "../components/staff-order-header";
import { StaffMobileShell, StaffScrollArea } from "../components/staff-mobile-shell";
import { staffCategories, staffName, staffProducts } from "../data/staff-order-data";
import { useStaffOrderStore } from "../stores/staff-order-store";
import type { StaffOrderProduct } from "../types";
import { formatMoney, getStaffOrderPath } from "../utils";

export function StaffMenuPage({ businessSlug }: { businessSlug: string }) {
  const params = useParams();
  const routeTableId = params.tableId;
  const selectedBranch = useStaffOrderStore((state) => state.selectedBranch);
  const selectedTableId = useStaffOrderStore((state) => state.selectedTableId);
  const guests = useStaffOrderStore((state) => state.guests);
  const activeCategory = useStaffOrderStore((state) => state.activeCategory);
  const query = useStaffOrderStore((state) => state.query);
  const cart = useStaffOrderStore((state) => state.cart);
  const addProduct = useStaffOrderStore((state) => state.addProduct);
  const setSelectedTable = useStaffOrderStore((state) => state.setSelectedTable);
  const setActiveCategory = useStaffOrderStore((state) => state.setActiveCategory);
  const setQuery = useStaffOrderStore((state) => state.setQuery);
  const tableId = routeTableId ?? selectedTableId;

  useEffect(() => {
    if (routeTableId && routeTableId !== selectedTableId) {
      setSelectedTable(routeTableId);
    }
  }, [routeTableId, selectedTableId, setSelectedTable]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredProducts = staffProducts.filter((product) => {
    const categoryMatches =
      activeCategory === "all" || product.category === activeCategory;
    const queryMatches =
      !normalizedQuery ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.sku.toLowerCase().includes(normalizedQuery);

    return categoryMatches && queryMatches;
  });

  return (
    <StaffMobileShell
      bottomNav={
        <>
          <StaffCartSummary businessSlug={businessSlug} cart={cart} />
          <StaffBottomNav
            businessSlug={businessSlug}
            active="menu"
            selectedTableId={tableId}
          />
        </>
      }
    >
      <StaffOrderHeader title="ຮັບອໍເດີ" />
      <StaffScrollArea className="pb-3">
        <StaffContextCard
          branch={selectedBranch}
          staff={staffName}
          shift="ກະເຊົ້າ"
          table={`${tableId} - ${guests} ${"ລູກຄ້າ"}`}
        />

        <label className="relative mt-3 block">
          <Search className="absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            className="h-10 w-full rounded-lg border border-blue-100 bg-white pr-11 pl-10 text-[12px] font-bold shadow-[0_7px_16px_rgba(15,23,42,0.03)] transition outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
            placeholder={"ຄົ້ນຫາລາຍການເມນູ"}
          />
          <button
            type="button"
            className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
            aria-label="Filter menu"
          >
            <SlidersHorizontal className="h-[18px] w-[18px]" />
          </button>
        </label>

        <div className="mt-2.5 flex [scrollbar-width:none] gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          {staffCategories.map((category) => {
            const isActive = category.id === activeCategory;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`h-8 shrink-0 cursor-pointer rounded-full border px-3 text-[12px] font-black transition ${
                  isActive
                    ? "border-blue-600 bg-white text-blue-600"
                    : "border-blue-100 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="mt-2.5 grid grid-cols-2 gap-2 pb-2">
          {filteredProducts.map((product) => (
            <MenuProductCard
              key={product.id}
              businessSlug={businessSlug}
              tableId={tableId}
              product={product}
              onAdd={() => addProduct(product)}
            />
          ))}
        </div>
      </StaffScrollArea>
    </StaffMobileShell>
  );
}

function MenuProductCard({
  businessSlug,
  tableId,
  product,
  onAdd
}: {
  businessSlug: string;
  tableId: string;
  product: StaffOrderProduct;
  onAdd: () => void;
}) {
  return (
    <article className="min-h-[132px] rounded-lg border border-blue-100 bg-white p-2 shadow-[0_8px_18px_rgba(15,23,42,0.035)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_14px_26px_rgba(37,99,235,0.1)]">
      <Link
        to={getStaffOrderPath(businessSlug, `/table/${tableId}/item/${product.id}`)}
        className="grid cursor-pointer grid-cols-[64px_minmax(0,1fr)] gap-2"
      >
        <img
          src={product.image}
          alt=""
          className="h-20 w-16 rounded-lg object-cover"
        />
        <div className="min-w-0 pt-1">
          {product.label ? (
            <span className="mb-1.5 inline-flex rounded-md bg-blue-50 px-1.5 py-0.5 text-[9px] font-black text-blue-600">
              {product.label}
            </span>
          ) : null}
          <p className="line-clamp-2 text-[13px] leading-4 font-black text-slate-950">
            {product.name}
          </p>
          <p className="mt-0.5 truncate text-[10px] font-bold text-slate-500">
            {product.category === "ເບເກີຣີ" ? "ເບເກີຣີ" : product.category}
          </p>
        </div>
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-[13px] font-black text-slate-950">
          {formatMoney(product.price)}
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-blue-100 bg-white text-blue-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
          aria-label={`Add ${product.name}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
