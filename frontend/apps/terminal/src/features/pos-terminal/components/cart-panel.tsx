import { Minus, Pencil, Plus, Tag, Trash2, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import type { CartLine, Discount, OrderType } from "../types";
import { formatMoney, getBusinessPath, getCartSummary } from "../utils";

export function CartPanel({
  businessSlug,
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
  onCustomer
}: {
  businessSlug: string;
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
}) {
  const summary = getCartSummary(cart, discount);

  return (
    <aside className="flex h-full min-h-0 flex-col rounded-lg border border-blue-100 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.045)]">
      <div className="flex items-center justify-between border-b border-blue-50 px-4 py-2.5">
        <div>
          <h2 className="text-[15px] font-black text-slate-950">
            Cart ({summary.itemCount})
          </h2>
          <p className="text-[11px] font-bold text-slate-500">
            {orderType} - {orderType === "Take Away" ? "Counter" : selectedTable ?? "No Table"}
          </p>
          {customerName ? (
            <p className="text-[10px] font-bold text-blue-600">{customerName}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-[12px] font-black text-blue-600 transition hover:text-blue-700"
        >
          Clear
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 [scrollbar-width:thin]">
        {cart.length > 0 ? (
          cart.map((line) => (
            <CartLineRow
              key={line.id}
              line={line}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onRemove={onRemove}
            />
          ))
        ) : (
          <div className="flex h-full min-h-52 items-center justify-center rounded-lg border border-dashed border-blue-100 bg-blue-50/30 text-center">
            <div>
              <p className="text-[13px] font-black text-slate-700">
                Cart is empty
              </p>
              <p className="mt-1 text-[11px] font-bold text-slate-500">
                Add items from the product grid to start a sale.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-blue-50 p-3">
        <div className="mb-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onCustomer}
            className="flex h-9 items-center justify-center gap-2 rounded-md border border-blue-100 bg-blue-50/60 text-[12px] font-black text-blue-600 transition hover:border-blue-300 hover:bg-blue-50"
          >
            <UserRound className="h-4 w-4" />
            Customer
          </button>
          <button
            type="button"
            onClick={onDiscount}
            className="flex h-9 items-center justify-center gap-2 rounded-md border border-amber-100 bg-amber-50/70 text-[12px] font-black text-amber-700 transition hover:border-amber-300"
          >
            <Tag className="h-4 w-4" />
            Discount
          </button>
        </div>
        <SummaryRow label="Subtotal" value={summary.subtotal} />
        <SummaryRow label="Discount" value={summary.discount} muted />
        <SummaryRow label="Tax (10%)" value={summary.tax} />
        <div className="mt-2 flex items-center justify-between border-t border-blue-50 pt-3">
          <span className="text-[13px] font-black text-slate-950">Total</span>
          <span className="text-[20px] leading-6 font-black text-slate-950">
            {formatMoney(summary.total)}
          </span>
        </div>
        <Link
          to={getBusinessPath(businessSlug, "/checkout")}
          className={`mt-3 flex h-[52px] items-center justify-center rounded-lg text-[15px] font-black shadow-[0_12px_24px_rgba(37,99,235,0.24)] transition ${
            cart.length === 0
              ? "pointer-events-none bg-slate-200 text-slate-400 shadow-none"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Pay {formatMoney(summary.total)}
        </Link>
      </div>
    </aside>
  );
}

function CartLineRow({
  line,
  onIncrement,
  onDecrement,
  onRemove
}: {
  line: CartLine;
  onIncrement: (lineId: string) => void;
  onDecrement: (lineId: string) => void;
  onRemove: (lineId: string) => void;
}) {
  return (
    <div className="rounded-lg border border-blue-50 bg-[#fbfdff] p-2.5 transition hover:border-blue-200">
      <div className="flex gap-2.5">
        <img
          src={line.image}
          alt=""
          className="h-11 w-11 rounded-md border border-blue-100 object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[12px] leading-4 font-black text-slate-950">
                {line.name}
              </p>
              <p className="text-[10px] leading-3 font-bold text-slate-500">
                {line.quantity} x {formatMoney(line.price)}
              </p>
              {line.priceType && line.priceType !== "retail" ? (
                <p className="mt-1 text-[10px] leading-3 font-black text-emerald-600">
                  {line.priceType.toUpperCase()} price
                  {line.priceList ? ` - ${line.priceList}` : ""}
                </p>
              ) : line.minWholesaleQuantity ? (
                <p className="mt-1 text-[10px] leading-3 font-bold text-slate-400">
                  Wholesale at {line.minWholesaleQuantity}+ pcs
                </p>
              ) : null}
            </div>
            <p className="text-[12px] leading-4 font-black text-slate-950">
              {formatMoney(line.price * line.quantity)}
            </p>
          </div>
          {line.note ? (
            <p className="mt-1 flex items-center gap-1 text-[10px] leading-3 font-bold text-orange-500">
              <Pencil className="h-3 w-3" />
              Note: {line.note}
            </p>
          ) : null}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center rounded-md border border-blue-100 bg-white">
              <QtyButton
                label="Decrease quantity"
                onClick={() => onDecrement(line.id)}
                icon={Minus}
              />
              <span className="min-w-8 text-center text-[12px] font-black">
                {line.quantity}
              </span>
              <QtyButton
                label="Increase quantity"
                onClick={() => onIncrement(line.id)}
                icon={Plus}
              />
            </div>
            <button
              type="button"
              onClick={() => onRemove(line.id)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QtyButton({
  label,
  onClick,
  icon: Icon
}: {
  label: string;
  onClick: () => void;
  icon: typeof Plus;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md text-blue-600 transition hover:bg-blue-50"
      aria-label={label}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function SummaryRow({
  label,
  value,
  muted = false
}: {
  label: string;
  value: number;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[12px] font-bold text-slate-500">{label}</span>
      <span
        className={`text-[12px] font-black ${
          muted ? "text-emerald-600" : "text-slate-800"
        }`}
      >
        {muted && value > 0 ? "-" : ""}
        {formatMoney(value)}
      </span>
    </div>
  );
}
