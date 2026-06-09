import type { ComponentProps } from "react";
import {
  BedDouble,
  CalendarDays,
  ClipboardList,
  Clock3,
  FolderOpen,
  PackageCheck,
  Plus,
  Receipt,
  Search,
  Users,
  X
} from "lucide-react";

import { ActionBar } from "../../components/action-bar";
import { CartPanel } from "../../components/cart-panel";
import { TerminalBrand } from "../../components/terminal-brand";
import type { Product } from "../../types";
import { formatMoney } from "../../utils";
import { PosSalesLayout } from "../shared/pos-sales-layout";

type Props = Omit<ComponentProps<typeof PosSalesLayout>, "contextItems">;
type RoomStatus = NonNullable<Product["hospitality"]>["roomStatus"];

export function HospitalityPosLayout({
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
    "ຫ້ອງ ແລະ ບໍລິການທັງໝົດ";
  const rooms = business.products.filter((product) => product.itemType === "room");
  const roomItems = products.filter((product) => product.itemType === "room");
  const extraServices = products.filter(
    (product) => product.itemType === "extra_service"
  );
  const availableRooms = rooms.filter(
    (product) => product.hospitality?.roomStatus === "available"
  ).length;
  const reservedRooms = rooms.filter(
    (product) => product.hospitality?.roomStatus === "reserved"
  ).length;
  const occupiedRooms = rooms.filter(
    (product) => product.hospitality?.roomStatus === "occupied"
  ).length;

  return (
    <div className="-m-2 -mt-[65px] grid h-screen min-h-0 grid-cols-[286px_minmax(0,1fr)] overflow-hidden lg:-m-3 lg:-mt-[69px]">
      <aside className="sticky top-0 left-0 z-30 grid h-screen min-h-0 grid-rows-[auto_auto_auto_minmax(0,1fr)_auto] gap-2 overflow-hidden border-r border-cyan-100 bg-[#f3f8fb] p-2 shadow-[12px_0_28px_rgba(15,23,42,0.04)] lg:p-3">
        <div className="rounded-xl border border-cyan-100 bg-white p-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <TerminalBrand />
        </div>

        <div className="overflow-hidden rounded-xl border border-cyan-200 bg-white shadow-[0_12px_28px_rgba(8,145,178,0.1)]">
          <div className="bg-gradient-to-br from-cyan-600 via-sky-700 to-slate-900 p-4 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <BedDouble className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-black">
                  {"ໜ້າເຄົາເຕີໂຮງແຮມ"}
                </p>
                <p className="text-[11px] font-bold text-cyan-100">
                  {"ຂັ້ນຕອນຫ້ອງ ແລະ ບັນຊີແຂກ"}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 divide-x divide-white/15 rounded-lg bg-white/10 p-3">
              <HospitalityStat label="ຫ້ອງວ່າງ" value={String(availableRooms)} />
              <HospitalityStat label="ຫ້ອງຈອງ" value={String(reservedRooms)} />
              <HospitalityStat label="ຫ້ອງມີແຂກ" value={String(occupiedRooms)} />
            </div>
            <button
              type="button"
              onClick={() => onAction("ຫ້ອງ / ເຂົ້າພັກ")}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white text-[13px] font-black text-cyan-700 shadow-[0_14px_24px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-cyan-50"
            >
              <CalendarDays className="h-4 w-4" />
              {"ເປີດຂັ້ນຕອນໜ້າເຄົາເຕີ"}
            </button>
          </div>
        </div>

        <label className="relative block">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="h-11 w-full rounded-lg border border-cyan-100 bg-white pr-10 pl-9 text-[13px] font-bold text-slate-800 shadow-[0_8px_20px_rgba(15,23,42,0.035)] outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-50"
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

        <div className="min-h-0 overflow-y-auto rounded-xl border border-cyan-100 bg-white p-2 shadow-[0_10px_24px_rgba(15,23,42,0.04)] [scrollbar-width:thin]">
          <div className="mb-2 flex items-center gap-2 px-1">
            <FolderOpen className="h-4 w-4 text-cyan-600" />
            <p className="text-[12px] font-black text-slate-950">
              {"ກຸ່ມຫ້ອງ ແລະ ບໍລິການ"}
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
                      ? "bg-cyan-600 text-white shadow-[0_10px_20px_rgba(8,145,178,0.2)]"
                      : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-700"
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
              {"ໜ້າເຄົາເຕີພ້ອມ"}
            </p>
          </div>
          <p className="mt-1 text-[11px] font-bold leading-4 text-emerald-700/80">
            {"ຈັດຫ້ອງ, ເພີ່ມບໍລິການແຂກ, ຈັດການມັດຈຳ ແລະ ປິດບັນຊີແຂກ."}
          </p>
        </div>
      </aside>

      <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_44px] gap-2 overflow-hidden p-2 pt-16 lg:gap-3 lg:p-3 lg:pt-16">
        <div className="grid h-full min-h-0 grid-cols-[minmax(0,1fr)_330px] gap-2 overflow-hidden xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-2 overflow-hidden">
            <div className="rounded-xl border border-cyan-100 bg-white p-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[18px] font-black leading-6 text-slate-950">
                    {"ກະດານຫ້ອງ ແລະ ບັນຊີແຂກ"}
                  </p>
                  <p className="truncate text-[12px] font-bold text-slate-500">
                    {"ກຸ່ມທີ່ເລືອກ"}: {selectedCategory}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <HospitalityChip
                    icon={BedDouble}
                    label="ລາຍການຫ້ອງ"
                    value={roomItems.length}
                  />
                  <HospitalityChip
                    icon={Receipt}
                    label="ຄ່າໃຊ້ຈ່າຍເພີ່ມ"
                    value={extraServices.length}
                    tone="orange"
                  />
                  <HospitalityChip
                    icon={Users}
                    label="ແຂກ"
                    value={business.openOrders.length}
                    tone="emerald"
                  />
                </div>
              </div>
            </div>

            <div className="min-h-0 overflow-y-auto rounded-xl border border-cyan-100 bg-white p-2 shadow-[0_12px_28px_rgba(15,23,42,0.045)] [scrollbar-width:thin]">
              <div className="grid content-start gap-3 [grid-template-columns:repeat(auto-fill,minmax(210px,1fr))]">
                {products.length > 0 ? (
                  products.map((product) => (
                    <HospitalityItemCard
                      key={product.id}
                      product={product}
                      onAddProduct={onAddProduct}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex min-h-64 items-center justify-center rounded-lg border border-dashed border-cyan-100 bg-cyan-50/40 text-center">
                    <div>
                      <p className="text-[14px] font-black text-slate-700">
                        {"ບໍ່ມີຫ້ອງ ຫຼື ບໍລິການທີ່ກົງກັບຕົວກອງນີ້."}
                      </p>
                      <p className="mt-1 text-[12px] font-bold text-slate-500">
                        {"ລອງເລືອກກຸ່ມຫ້ອງອື່ນ ຫຼື ຄົ້ນຫາຊື່ແຂກ."}
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

function HospitalityItemCard({
  product,
  onAddProduct
}: {
  product: Product;
  onAddProduct: (product: Product) => void;
}) {
  const room = product.hospitality;
  const isRoom = product.itemType === "room";
  const roomStatus = room?.roomStatus;
  const status = roomStatus ? toRoomStatusLabel(roomStatus) : null;

  return (
    <button
      type="button"
      onClick={() => onAddProduct(product)}
      className="group overflow-hidden rounded-xl border border-cyan-100 bg-[#fbfdff] text-left shadow-[0_10px_22px_rgba(15,23,42,0.045)] transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white hover:shadow-[0_14px_30px_rgba(8,145,178,0.14)]"
    >
      <span className="relative block">
        <span
          className="block h-28 bg-slate-100 bg-cover bg-center"
          style={{ backgroundImage: `url(${product.image})` }}
        />
        <span className="absolute top-2 left-2 rounded-full bg-white/95 px-2 py-1 text-[10px] font-black text-cyan-700 shadow-sm">
          {isRoom ? `${"ຫ້ອງ"} ${room?.roomNumber ?? product.sku}` : "ບໍລິການເພີ່ມ"}
        </span>
        {roomStatus && status ? (
          <span className={`absolute top-2 right-2 rounded-full px-2 py-1 text-[10px] font-black shadow-sm ${getRoomStatusClass(roomStatus)}`}>
            {status}
          </span>
        ) : null}
      </span>
      <span className="block p-3">
        <span className="flex items-start justify-between gap-2">
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-black leading-5 text-slate-950">
              {product.name}
            </span>
            <span className="mt-0.5 flex items-center gap-1 truncate text-[11px] font-bold text-slate-500">
              {isRoom ? (
                <>
                  <Users className="h-3.5 w-3.5 shrink-0 text-cyan-600" />
                  <span className="truncate">
                    {"ຈຳນວນແຂກ"}: {room?.capacity ?? "-"} - {room?.bedType ?? "-"}
                  </span>
                </>
              ) : (
                <>
                  <ClipboardList className="h-3.5 w-3.5 shrink-0 text-cyan-600" />
                  <span className="truncate">{product.unit ?? "ບໍລິການເພີ່ມ"}</span>
                </>
              )}
            </span>
          </span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 transition group-hover:bg-cyan-600 group-hover:text-white">
            <Plus className="h-4 w-4" />
          </span>
        </span>
        <span className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[14px] font-black text-blue-600">
            {formatMoney(product.price)}
          </span>
          <span className="rounded-full bg-slate-50 px-2 py-1 text-[10px] font-black text-slate-600">
            {isRoom ? room?.priceMode ?? "ຄືນ" : product.sku}
          </span>
        </span>
      </span>
    </button>
  );
}

function HospitalityStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 text-center">
      <p className="text-[15px] font-black leading-5 text-white">{value}</p>
      <p className="mt-0.5 text-[9px] font-black leading-3 text-cyan-100">
        {label}
      </p>
    </div>
  );
}

function HospitalityChip({
  icon: Icon,
  label,
  value,
  tone = "cyan"
}: {
  icon: typeof BedDouble;
  label: string;
  value: string | number;
  tone?: "cyan" | "orange" | "emerald";
}) {
  const toneClass = {
    cyan: "border-cyan-100 bg-cyan-50 text-cyan-700",
    orange: "border-orange-100 bg-orange-50 text-orange-600",
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-600"
  }[tone];

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
  if (categoryId === "rooms") {
    return <BedDouble className="h-4 w-4 shrink-0" />;
  }

  if (categoryId === "deposit") {
    return <Receipt className="h-4 w-4 shrink-0" />;
  }

  if (categoryId === "laundry" || categoryId === "extra-services") {
    return <ClipboardList className="h-4 w-4 shrink-0" />;
  }

  if (categoryId === "transport") {
    return <Clock3 className="h-4 w-4 shrink-0" />;
  }

  return <CalendarDays className="h-4 w-4 shrink-0" />;
}

function toRoomStatusLabel(status: RoomStatus) {
  if (status === "available") {
    return "ວ່າງ";
  }

  if (status === "reserved") {
    return "ຈອງໄວ້";
  }

  if (status === "occupied") {
    return "ມີລູກຄ້າ";
  }

  return "ກຳລັງທຳຄວາມສະອາດ";
}

function getRoomStatusClass(status: RoomStatus) {
  if (status === "available") {
    return "bg-emerald-50 text-emerald-600";
  }

  if (status === "reserved") {
    return "bg-violet-50 text-violet-600";
  }

  if (status === "occupied") {
    return "bg-orange-50 text-orange-600";
  }

  return "bg-slate-50 text-slate-600";
}
