import { ArrowLeft, Grid2X2, List, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getTerminalBusiness } from "../data/mock-pos-data";
import { getPosScreenConfig } from "../screens/pos-screen-config";
import { usePosTerminalStore } from "../stores/pos-terminal-store";
import type { OpenOrder, PosType } from "../types";
import { formatMoney, getBusinessPath } from "../utils";
import {
  getOrderLocationLabel,
  getTerminalCopy
} from "../utils/terminal-copy";

export function OrdersView({
  businessSlug,
  mode,
  screenPosType
}: {
  businessSlug: string;
  mode: "open-orders" | "held-orders";
  screenPosType?: PosType;
}) {
  const navigate = useNavigate();
  const business = getTerminalBusiness(businessSlug);
  const copy = getTerminalCopy(business.posType);
  const screenConfig = getPosScreenConfig(screenPosType ?? business.posType);
  const theme = screenConfig.theme;
  const OrdersIcon = screenConfig.ordersIcon;
  const orders = usePosTerminalStore((state) => state.orders);
  const orderSearch = usePosTerminalStore((state) => state.orderSearch);
  const setOrderSearch = usePosTerminalStore((state) => state.setOrderSearch);
  const resumeOrder = usePosTerminalStore((state) => state.resumeOrder);
  const startNewSale = usePosTerminalStore((state) => state.startNewSale);
  const showNotice = usePosTerminalStore((state) => state.showNotice);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const openCount = orders.filter((order) => order.status === "ກຳລັງເຮັດ").length;
  const heldCount = orders.filter((order) => order.status === "ພັກໄວ້").length;
  const completedCount = orders.filter((order) => order.status === "ສຳເລັດ").length;
  const normalizedSearch = orderSearch.trim().toLowerCase();
  const rows = orders
    .filter((order) =>
      mode === "held-orders"
        ? order.status === "ພັກໄວ້"
        : order.status === "ກຳລັງເຮັດ"
    )
    .filter((order) => {
      if (!normalizedSearch) return true;

      return [
        order.id,
        order.table,
        getOrderLocationLabel(order),
        order.type,
        order.customer
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });

  function handleOpenOrder(orderId: string) {
    resumeOrder(orderId);
    navigate(getBusinessPath(businessSlug, ""));
  }

  function handleNewOrder() {
    startNewSale();
    navigate(getBusinessPath(businessSlug, "/new-sale"));
  }

  return (
    <section
      className={`flex h-full min-h-0 flex-col overflow-hidden rounded-lg border bg-white ${theme.border} ${theme.shadow}`}
    >
      <div className={`shrink-0 border-b p-4 ${theme.border}`}>
        <div
          className={`mb-4 flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between ${theme.border} ${theme.softerBg}`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${theme.iconBox}`}
            >
              <OrdersIcon className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-black text-slate-950">
                {
                  mode === "held-orders"
                    ? screenConfig.orders.heldTitle
                    : screenConfig.orders.openTitle
                }
              </h1>
              <p className="text-[12px] font-bold text-slate-500">
                {screenConfig.orders.description}
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-white px-3 py-2 text-[12px] font-black text-slate-700">
            <span className={`mr-2 ${theme.activeText}`}>
              {screenConfig.orders.focusLabel}
            </span>
            {screenConfig.orders.focusValue}
          </div>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {screenConfig.orders.workflowBadges.map((badge) => (
            <span
              key={badge}
              className={`rounded-full border px-3 py-1 text-[11px] font-black ${theme.border} ${theme.softBg} ${theme.activeText}`}
            >
              {badge}
            </span>
          ))}
        </div>
        <div className="mb-4 grid gap-3 md:grid-cols-[auto_1fr_auto]">
          <Link
            to={getBusinessPath(businessSlug, "")}
            className={`flex h-10 items-center justify-center gap-2 rounded-md border bg-white px-4 text-[12px] font-black text-slate-700 transition ${theme.border} ${theme.rowHover}`}
          >
            <ArrowLeft className="h-4 w-4" />
            {"ກັບໄປ POS"}
          </Link>
          <div className={`flex rounded-lg border bg-white p-1 ${theme.border}`}>
            <OrderTab
              active={mode === "open-orders"}
              href={getBusinessPath(businessSlug, "/open-orders")}
              label={`${copy.openRecordsLabel} (${openCount})`}
              theme={theme}
            />
            <OrderTab
              active={mode === "held-orders"}
              href={getBusinessPath(businessSlug, "/held-orders")}
              label={`${copy.heldRecordsLabel} (${heldCount})`}
              theme={theme}
            />
            <button
              type="button"
              onClick={() =>
                showNotice(`${completedCount} ${copy.completedRecordsLabel}.`)
              }
              className={`h-9 min-w-36 rounded-md px-4 text-[12px] font-black text-slate-400 ${theme.rowHover}`}
            >
              {"ສຳເລັດ"} ({completedCount})
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex h-10 items-center gap-2 rounded-md border px-3 text-[12px] font-black transition ${
                viewMode === "grid"
                  ? `${theme.borderStrong} ${theme.softBg} ${theme.activeText}`
                  : `${theme.border} bg-white text-slate-600 ${theme.rowHover}`
              }`}
            >
              <Grid2X2 className="h-4 w-4" />
              {"ຕາຕະລາງ"}
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex h-10 items-center gap-2 rounded-md border px-3 text-[12px] font-black transition ${
                viewMode === "list"
                  ? `${theme.borderStrong} ${theme.softBg} ${theme.activeText}`
                  : `${theme.border} bg-white text-slate-600 ${theme.rowHover}`
              }`}
            >
              <List className="h-4 w-4" />
              {"ລາຍການ"}
            </button>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <label className="relative block">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={orderSearch}
              onChange={(event) => setOrderSearch(event.currentTarget.value)}
              className={`h-11 w-full rounded-lg border pr-4 pl-11 text-[13px] font-bold outline-none focus:ring-4 ${theme.border} ${theme.focusRing}`}
              placeholder={copy.searchRecordsPlaceholder}
            />
          </label>
          <button
            type="button"
            onClick={() => setOrderSearch("")}
            className={`flex h-11 items-center justify-center gap-2 rounded-lg border bg-white px-4 text-[12px] font-black ${theme.activeText} ${theme.border} ${theme.rowHover}`}
          >
            <RefreshCw className="h-4 w-4" />
            {"ໂຫຼດໃໝ່"}
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        {viewMode === "list" ? (
          <table className="min-w-full text-left text-[12px]">
            <thead>
              <tr className={`border-b text-[11px] font-black text-slate-500 ${theme.border}`}>
                {[
                  copy.idHeading,
                  copy.locationHeading,
                  copy.customerLabel,
                  "ລາຍການ",
                  "ຈຳນວນເງິນ",
                  "ເວລາ",
                  "ສະຖານະ",
                  "ການດຳເນີນການ"
                ].map((heading) => (
                    <th key={heading} className="px-4 py-3">
                      {heading}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    copy={copy}
                    screenConfig={screenConfig}
                    onOpen={() => handleOpenOrder(order.id)}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm font-bold text-slate-500"
                  >
                    {copy.emptyRecordsMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : rows.length > 0 ? (
          <div className="grid content-start gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                copy={copy}
                screenConfig={screenConfig}
                onOpen={() => handleOpenOrder(order.id)}
              />
            ))}
          </div>
        ) : (
          <div className="px-4 py-10 text-center text-sm font-bold text-slate-500">
            {copy.emptyRecordsMessage}
          </div>
        )}
      </div>
      <div className={`shrink-0 flex items-center justify-between border-t px-4 py-3 ${theme.border}`}>
        <p className="text-[12px] font-bold text-slate-500">
          {"ລວມທັງໝົດ"} {rows.length} {copy.totalRecordsLabel}
        </p>
        <button
          type="button"
          onClick={handleNewOrder}
          className={`flex h-9 items-center justify-center rounded-md border px-4 text-[12px] font-black ${theme.border} ${theme.softBg} ${theme.activeText} ${theme.rowHover}`}
        >
          {copy.newPrimaryActionLabel}
        </button>
      </div>
    </section>
  );
}

function OrderTab({
  active,
  href,
  label,
  theme
}: {
  active: boolean;
  href: string;
  label: string;
  theme: ReturnType<typeof getPosScreenConfig>["theme"];
}) {
  return (
    <Link
      to={href}
      className={`flex h-9 min-w-36 items-center justify-center rounded-md px-4 text-[12px] font-black ${
        active ? `${theme.activeBg} text-white` : `text-slate-600 ${theme.rowHover}`
      }`}
    >
      {label}
    </Link>
  );
}

function OrderCard({
  order,
  copy,
  screenConfig,
  onOpen
}: {
  order: OpenOrder;
  copy: ReturnType<typeof getTerminalCopy>;
  screenConfig: ReturnType<typeof getPosScreenConfig>;
  onOpen: () => void;
}) {
  const theme = screenConfig.theme;

  return (
    <article className={`rounded-lg border bg-white p-4 ${theme.border} ${theme.shadow}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-sm font-black ${theme.activeText}`}>{order.id}</p>
          <p className="mt-1 text-[12px] font-bold text-slate-500">
            {getOrderLocationLabel(order)} - {order.type}
          </p>
        </div>
        <span
          className={`rounded-md px-2 py-1 text-[11px] font-black ${
            order.status === "ພັກໄວ້"
              ? "bg-amber-50 text-amber-600"
              : `${theme.softBg} ${theme.activeText}`
          }`}
        >
          {order.status}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
        <CardStat label={copy.customerLabel} value={order.customer} />
        <CardStat label="ລາຍການ" value={String(order.items)} />
        <CardStat label="ເວລາ" value={order.time} />
        <CardStat label="ຈຳນວນເງິນ" value={formatMoney(order.amount)} strong />
      </div>
      <button
        type="button"
        onClick={onOpen}
        className={`mt-4 h-10 w-full rounded-md border text-[12px] font-black ${theme.borderStrong} ${theme.softBg} ${theme.activeText} ${theme.rowHover}`}
      >
        {"ເປີດ"}
      </button>
    </article>
  );
}

function CardStat({
  label,
  value,
  strong = false
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold text-slate-500">{label}</p>
      <p className={`mt-0.5 truncate ${strong ? "font-black" : "font-bold"} text-slate-950`}>
        {value}
      </p>
    </div>
  );
}

function OrderRow({
  order,
  copy,
  screenConfig,
  onOpen
}: {
  order: OpenOrder;
  copy: ReturnType<typeof getTerminalCopy>;
  screenConfig: ReturnType<typeof getPosScreenConfig>;
  onOpen: () => void;
}) {
  const theme = screenConfig.theme;

  return (
    <tr className={`border-b last:border-b-0 ${theme.border} ${theme.rowHover}`}>
      <td className={`px-4 py-3 font-black ${theme.activeText}`}>{order.id}</td>
      <td className="px-4 py-3 font-bold text-slate-800">
        {getOrderLocationLabel(order)}
        <span className="block text-[11px] text-slate-500">{order.type}</span>
      </td>
      <td className="px-4 py-3 font-bold text-slate-700">{order.customer}</td>
      <td className="px-4 py-3 font-black text-slate-800">{order.items}</td>
      <td className="px-4 py-3 font-black text-slate-800">
        {formatMoney(order.amount)}
      </td>
      <td className="px-4 py-3 font-bold text-slate-600">{order.time}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex rounded-md px-2 py-1 text-[11px] font-black ${
            order.status === "ພັກໄວ້"
              ? "bg-amber-50 text-amber-600"
              : `${theme.softBg} ${theme.activeText}`
          }`}
        >
          {order.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={onOpen}
          className={`h-8 rounded-md border px-3 text-[12px] font-black ${theme.borderStrong} ${theme.softBg} ${theme.activeText} ${theme.rowHover}`}
        >
          {"ເປີດ"}
        </button>
      </td>
    </tr>
  );
}
