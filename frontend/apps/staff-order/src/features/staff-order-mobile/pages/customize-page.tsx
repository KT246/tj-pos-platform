import { ArrowRight, Check, Minus, Plus } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { StaffBottomNav } from "../components/staff-bottom-nav";
import { StaffMobileShell, StaffScrollArea } from "../components/staff-mobile-shell";
import { StaffOrderHeader } from "../components/staff-order-header";
import { staffProducts } from "../data/staff-order-data";
import { useStaffOrderStore } from "../stores/staff-order-store";
import { formatMoney, getStaffOrderPath } from "../utils";

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
      size: String(formData.get("size") ?? "ກາງ"),
      sugar: String(formData.get("sugar") ?? "50%"),
      ice: String(formData.get("ice") ?? "Regular"),
      milk: String(formData.get("milk") ?? "ນົມ Full Cream"),
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
        title="ປັບແຕ່ງລາຍການ"
        backHref={getStaffOrderPath(businessSlug, `/table/${tableId}`)}
      />
      <form onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-hidden">
        <StaffScrollArea className="pb-3">
          <section className="mt-3 grid grid-cols-[104px_1fr] gap-3 rounded-lg border border-blue-100 bg-white p-3 shadow-[0_10px_26px_rgba(15,23,42,0.045)]">
            <img
              src={product.image}
              alt=""
              className="h-[104px] w-full rounded-lg object-cover"
            />
            <div className="min-w-0 py-2">
              <h2 className="text-[17px] font-black text-slate-950">{product.name}</h2>
              <p className="mt-1 text-[14px] font-black text-blue-600">
                {formatMoney(product.price)}
              </p>
              <p className="mt-2 text-[12px] font-bold text-slate-500">
                {product.category}
              </p>
            </div>
          </section>

          <OptionSection title="ຂະໜາດ">
            <OptionCard name="size" value="ນ້ອຍ" label="ນ້ອຍ" helper="LAK 24,000" />
            <OptionCard
              name="size"
              value="ກາງ"
              label="ກາງ"
              helper="LAK 28,000"
              defaultChecked
            />
            <OptionCard name="size" value="ໃຫຍ່" label="ໃຫຍ່" helper="LAK 32,000" />
          </OptionSection>

          <OptionSection title="ລະດັບນ້ຳຕານ">
            <OptionCard name="sugar" value="0%" label="0%" helper="ບໍ່ໃສ່ນ້ຳຕານ" />
            <OptionCard name="sugar" value="25%" label="25%" helper="ຫວານນ້ອຍ" />
            <OptionCard
              name="sugar"
              value="50%"
              label="50%"
              helper="Regular"
              defaultChecked
            />
            <OptionCard name="sugar" value="100%" label="100%" helper="ຫວານຫຼາຍ" />
          </OptionSection>

          <OptionSection title="ລະດັບນ້ຳກ້ອນ">
            <OptionCard name="ice" value="ບໍ່ໃສ່ນ້ຳກ້ອນ" label="ບໍ່ໃສ່ນ້ຳກ້ອນ" helper="ບໍ່ມີ" />
            <OptionCard name="ice" value="ນ້ຳກ້ອນນ້ອຍ" label="ນ້ຳກ້ອນນ້ອຍ" helper="ນ້ອຍ" />
            <OptionCard
              name="ice"
              value="Regular"
              label="Regular"
              helper="ປົກກະຕິ"
              defaultChecked
            />
            <OptionCard
              name="ice"
              value="ເພີ່ມນ້ຳກ້ອນ"
              label="ເພີ່ມນ້ຳກ້ອນ"
              helper="ນ້ຳກ້ອນຫຼາຍ"
            />
          </OptionSection>

          <section className="mt-3 rounded-lg border border-blue-100 bg-white p-3 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
            <h3 className="text-[15px] font-black text-slate-950">{"ເພີ່ມເຕີມ"}</h3>
            {[
              ["ເພີ່ມ shot", "+8,000"],
              ["ວິບຄຣີມ", "+6,000"],
              ["ນົມ Oat", "+10,000"]
            ].map(([label, price]) => (
              <label
                key={label}
                className="mt-3 flex items-center justify-between text-[13px] font-bold text-slate-600"
              >
                <span className="flex items-center gap-3">
                  <input type="checkbox" className="h-5 w-5 accent-blue-600" />
                  {label}
                </span>
                <span className="font-black text-blue-600">{price}</span>
              </label>
            ))}
          </section>

          <label className="mt-3 block rounded-lg border border-blue-100 bg-white p-3 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
            <span className="text-[15px] font-black text-slate-950">{"ໝາຍເຫດ"}</span>
            <textarea
              name="note"
              className="mt-3 h-20 w-full resize-none rounded-lg border border-blue-100 p-3 text-[12px] font-bold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              placeholder={"ເພີ່ມໝາຍເຫດໃຫ້ຄົວ ຫຼື ບາ..."}
            />
          </label>
        </StaffScrollArea>

        <div className="grid shrink-0 grid-cols-[96px_1fr_auto] items-center gap-2 border-t border-blue-50 bg-white px-3 py-2 shadow-[0_-14px_34px_rgba(15,23,42,0.08)]">
          <div className="flex h-10 items-center justify-between overflow-hidden rounded-lg border border-blue-200 bg-white text-blue-600">
            <span className="flex h-full w-9 items-center justify-center">
              <Minus className="h-4 w-4" />
            </span>
            <span className="text-[15px] font-black text-slate-950">1</span>
            <span className="flex h-full w-9 items-center justify-center">
              <Plus className="h-4 w-4" />
            </span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500">{"ຍອດກ່ອນຫຼຸດ"}</p>
            <p className="text-[15px] font-black text-slate-950">
              {formatMoney(product.price)}
            </p>
          </div>
          <button
            type="submit"
            className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-3 text-[13px] font-black text-white shadow-[0_12px_22px_rgba(37,99,235,0.22)] transition hover:bg-blue-700"
          >
            {"ເພີ່ມ"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </StaffMobileShell>
  );
}

function OptionSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-3 rounded-lg border border-blue-100 bg-white p-3 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
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
      <span className="flex min-h-[76px] flex-col items-center justify-center rounded-lg border border-blue-100 bg-white px-2 text-center transition peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:bg-blue-50">
        <span className="text-[13px] font-black text-slate-950">{label}</span>
        <span className="mt-1 text-[10px] font-bold text-slate-500">{helper}</span>
      </span>
      <span className="absolute -top-1 -right-1 hidden h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white peer-checked:flex">
        <Check className="h-3.5 w-3.5" />
      </span>
    </label>
  );
}
