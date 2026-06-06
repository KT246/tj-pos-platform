import { ArrowRight, Check, Minus, Plus } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { formatMoney } from "../../pos-terminal/utils";
import { StaffBottomNav } from "../components/staff-bottom-nav";
import { StaffMobileShell, StaffScrollArea } from "../components/staff-mobile-shell";
import { StaffOrderHeader } from "../components/staff-order-header";
import { staffProducts } from "../data/staff-order-data";
import { useStaffOrderStore } from "../stores/staff-order-store";
import { getStaffOrderPath } from "../utils";

export function StaffCustomizePage({ businessSlug }: { businessSlug: string }) {
  const navigate = useNavigate();
  const params = useParams();
  const selectedTableId = useStaffOrderStore((state) => state.selectedTableId);
  const addCustomizedProduct = useStaffOrderStore(
    (state) => state.addCustomizedProduct
  );
  const tableId = params.tableId ?? selectedTableId;
  const product =
    staffProducts.find((item) => item.id === params.itemId) ?? staffProducts[0];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    addCustomizedProduct(product, {
      size: String(formData.get("size") ?? "Medium"),
      sugar: String(formData.get("sugar") ?? "50%"),
      ice: String(formData.get("ice") ?? "Regular"),
      milk: String(formData.get("milk") ?? "Full Cream Milk"),
      note: String(formData.get("note") ?? "")
    });
    navigate(getStaffOrderPath(businessSlug, `/table/${tableId}`));
  }

  return (
    <StaffMobileShell
      bottomNav={
        <StaffBottomNav
          businessSlug={businessSlug}
          active="menu"
          selectedTableId={tableId}
        />
      }
    >
      <StaffOrderHeader
        title="Customize Item"
        backHref={getStaffOrderPath(businessSlug, `/table/${tableId}`)}
      />
      <form onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-hidden">
        <StaffScrollArea>
          <section className="mt-4 grid grid-cols-[128px_1fr] gap-4 rounded-lg border border-blue-100 bg-white p-4 shadow-[0_10px_26px_rgba(15,23,42,0.045)]">
            <img
              src={product.image}
              alt=""
              className="h-32 w-full rounded-lg object-cover"
            />
            <div className="min-w-0 py-3">
              <h2 className="text-[22px] font-black text-slate-950">
                {product.name}
              </h2>
              <p className="mt-1 text-[17px] font-black text-blue-600">
                {formatMoney(product.price)}
              </p>
              <p className="mt-3 text-[13px] font-bold text-slate-500">
                {product.category}
              </p>
            </div>
          </section>

          <OptionSection title="Size">
            <OptionCard name="size" value="Small" label="Small" helper="LAK 24,000" />
            <OptionCard name="size" value="Medium" label="Medium" helper="LAK 28,000" defaultChecked />
            <OptionCard name="size" value="Large" label="Large" helper="LAK 32,000" />
          </OptionSection>

          <OptionSection title="Sugar Level">
            <OptionCard name="sugar" value="0%" label="0%" helper="No Sugar" />
            <OptionCard name="sugar" value="25%" label="25%" helper="Less Sweet" />
            <OptionCard name="sugar" value="50%" label="50%" helper="Regular" defaultChecked />
            <OptionCard name="sugar" value="100%" label="100%" helper="Extra Sweet" />
          </OptionSection>

          <OptionSection title="Ice Level">
            <OptionCard name="ice" value="No Ice" label="No Ice" helper="None" />
            <OptionCard name="ice" value="Less Ice" label="Less Ice" helper="Less" />
            <OptionCard name="ice" value="Regular" label="Regular" helper="Normal" defaultChecked />
            <OptionCard name="ice" value="Extra Ice" label="Extra Ice" helper="More Ice" />
          </OptionSection>

          <section className="mt-3 rounded-lg border border-blue-100 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
            <h3 className="text-[15px] font-black text-slate-950">Add-ons</h3>
            {[
              ["Extra Shot", "+8,000"],
              ["Whipped Cream", "+6,000"],
              ["Oat Milk", "+10,000"]
            ].map(([label, price]) => (
              <label
                key={label}
                className="mt-3 flex items-center justify-between text-[14px] font-bold text-slate-600"
              >
                <span className="flex items-center gap-3">
                  <input type="checkbox" className="h-5 w-5 accent-blue-600" />
                  {label}
                </span>
                <span className="font-black text-blue-600">{price}</span>
              </label>
            ))}
          </section>

          <label className="mt-3 block rounded-lg border border-blue-100 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
            <span className="text-[15px] font-black text-slate-950">Note</span>
            <textarea
              name="note"
              className="mt-3 h-24 w-full resize-none rounded-lg border border-blue-100 p-3 text-[13px] font-bold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              placeholder="Add note for kitchen or bar..."
            />
          </label>
        </StaffScrollArea>

        <div className="grid shrink-0 grid-cols-[110px_1fr_auto] items-center gap-3 border-t border-blue-50 bg-white px-4 py-3 shadow-[0_-14px_34px_rgba(15,23,42,0.08)] sm:px-5">
          <div className="flex h-11 items-center justify-between overflow-hidden rounded-lg border border-blue-200 bg-white text-blue-600">
            <span className="flex h-full w-9 items-center justify-center">
              <Minus className="h-4 w-4" />
            </span>
            <span className="text-[16px] font-black text-slate-950">1</span>
            <span className="flex h-full w-9 items-center justify-center">
              <Plus className="h-4 w-4" />
            </span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500">Subtotal</p>
            <p className="text-[16px] font-black text-slate-950">
              {formatMoney(product.price)}
            </p>
          </div>
          <button
            type="submit"
            className="flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-[13px] font-black text-white shadow-[0_12px_22px_rgba(37,99,235,0.22)] transition hover:bg-blue-700"
          >
            Add
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </StaffMobileShell>
  );
}

function OptionSection({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-3 rounded-lg border border-blue-100 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
      <h3 className="text-[15px] font-black text-slate-950">{title}</h3>
      <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(76px,1fr))] gap-2">
        {children}
      </div>
    </section>
  );
}

function OptionCard({
  name,
  value,
  label,
  helper,
  defaultChecked = false
}: {
  name: string;
  value: string;
  label: string;
  helper: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="relative">
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="flex min-h-[76px] flex-col items-center justify-center rounded-lg border border-blue-100 bg-white px-2 text-center transition hover:bg-blue-50 peer-checked:border-blue-600 peer-checked:bg-blue-50">
        <span className="text-[13px] font-black text-slate-950">{label}</span>
        <span className="mt-1 text-[11px] font-bold text-slate-500">{helper}</span>
      </span>
      <span className="absolute -top-1 -right-1 hidden h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white peer-checked:flex">
        <Check className="h-3.5 w-3.5" />
      </span>
    </label>
  );
}
