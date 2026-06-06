import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { ActionBar } from "../components/action-bar";
import { CartPanel } from "../components/cart-panel";
import { CategoryRail } from "../components/category-rail";
import { OrdersView } from "../components/order-views";
import {
  CheckoutView,
  ReceiptPreviewView,
  RefundView
} from "../components/payment-views";
import { ProductGrid } from "../components/product-grid";
import {
  BarcodeScanDialog,
  CustomerDialog,
  DiscountDialog,
  TableDialog
} from "../components/terminal-dialogs";
import { TerminalTopBar } from "../components/terminal-top-bar";
import {
  categories,
  products,
  quickActions
} from "../data/mock-pos-data";
import { usePosTerminalStore } from "../stores/pos-terminal-store";
import type { PosScreen } from "../types";

export function PosTerminalPage({ screen }: { screen: PosScreen }) {
  const { businessSlug = "tj-cafe-vientiane" } = useParams();
  const activeCategory = usePosTerminalStore((state) => state.activeCategory);
  const query = usePosTerminalStore((state) => state.query);
  const cart = usePosTerminalStore((state) => state.cart);
  const selectedTable = usePosTerminalStore((state) => state.selectedTable);
  const orderType = usePosTerminalStore((state) => state.orderType);
  const customer = usePosTerminalStore((state) => state.customer);
  const discount = usePosTerminalStore((state) => state.discount);
  const scanOpen = usePosTerminalStore((state) => state.scanOpen);
  const discountOpen = usePosTerminalStore((state) => state.discountOpen);
  const customerOpen = usePosTerminalStore((state) => state.customerOpen);
  const tableOpen = usePosTerminalStore((state) => state.tableOpen);
  const setActiveCategory = usePosTerminalStore(
    (state) => state.setActiveCategory
  );
  const setQuery = usePosTerminalStore((state) => state.setQuery);
  const addProduct = usePosTerminalStore((state) => state.addProduct);
  const incrementLine = usePosTerminalStore((state) => state.incrementLine);
  const decrementLine = usePosTerminalStore((state) => state.decrementLine);
  const removeLine = usePosTerminalStore((state) => state.removeLine);
  const clearCart = usePosTerminalStore((state) => state.clearCart);
  const startNewSale = usePosTerminalStore((state) => state.startNewSale);
  const scanBarcode = usePosTerminalStore((state) => state.scanBarcode);
  const holdOrder = usePosTerminalStore((state) => state.holdOrder);
  const setSelectedTable = usePosTerminalStore(
    (state) => state.setSelectedTable
  );
  const setOrderType = usePosTerminalStore((state) => state.setOrderType);
  const setCustomer = usePosTerminalStore((state) => state.setCustomer);
  const applyDiscount = usePosTerminalStore((state) => state.applyDiscount);
  const setScanOpen = usePosTerminalStore((state) => state.setScanOpen);
  const setDiscountOpen = usePosTerminalStore((state) => state.setDiscountOpen);
  const setCustomerOpen = usePosTerminalStore((state) => state.setCustomerOpen);
  const setTableOpen = usePosTerminalStore((state) => state.setTableOpen);
  const showNotice = usePosTerminalStore((state) => state.showNotice);

  useEffect(() => {
    if (screen === "new-sale") {
      startNewSale();
    }
  }, [screen, startNewSale]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const categoryMatches =
        activeCategory === "all" || product.category === activeCategory;
      const queryMatches =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.sku.toLowerCase().includes(normalizedQuery);

      return categoryMatches && queryMatches;
    });
  }, [activeCategory, query]);

  function handleAction(label: string) {
    if (label === "Scan Barcode") {
      setScanOpen(true);
      return;
    }

    if (label === "Table / Dine In") {
      setTableOpen(true);
      return;
    }

    if (label === "Hold Order") {
      holdOrder();
      return;
    }

    if (label === "More") {
      showNotice("More terminal actions will open here.");
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f3f7fb] text-slate-950">
      <TerminalTopBar />
      <main className="min-h-0 flex-1 overflow-hidden p-3">
        {screen === "checkout" ? (
          <CheckoutView businessSlug={businessSlug} />
        ) : screen === "receipt-preview" ? (
          <ReceiptPreviewView businessSlug={businessSlug} />
        ) : screen === "refund" ? (
          <RefundView businessSlug={businessSlug} />
        ) : screen === "open-orders" || screen === "held-orders" ? (
          <OrdersView businessSlug={businessSlug} mode={screen} />
        ) : (
          <div className="grid h-full grid-rows-[minmax(0,1fr)_44px] gap-3">
            <div className="grid min-h-0 gap-3 xl:grid-cols-[150px_minmax(0,1fr)_360px]">
              <CategoryRail
                categories={categories}
                activeCategory={activeCategory}
                onSelect={setActiveCategory}
              />
              <ProductGrid
                products={visibleProducts}
                query={query}
                onQueryChange={setQuery}
                onAddProduct={addProduct}
                onOpenScan={() => setScanOpen(true)}
              />
              <CartPanel
                businessSlug={businessSlug}
                cart={cart}
                discount={discount}
                selectedTable={selectedTable}
                orderType={orderType}
                customerName={customer?.name ?? null}
                onIncrement={incrementLine}
                onDecrement={decrementLine}
                onRemove={removeLine}
                onClear={clearCart}
                onDiscount={() => setDiscountOpen(true)}
                onCustomer={() => setCustomerOpen(true)}
              />
            </div>
            <div className="min-h-0">
              <ActionBar
                businessSlug={businessSlug}
                actions={quickActions}
                onAction={handleAction}
              />
            </div>
          </div>
        )}
      </main>

      {scanOpen ? (
        <BarcodeScanDialog
          onClose={() => setScanOpen(false)}
          onScan={scanBarcode}
        />
      ) : null}
      {discountOpen ? (
        <DiscountDialog
          cart={cart}
          discount={discount}
          onClose={() => setDiscountOpen(false)}
          onApply={applyDiscount}
        />
      ) : null}
      {customerOpen ? (
        <CustomerDialog
          onClose={() => setCustomerOpen(false)}
          onSelect={setCustomer}
        />
      ) : null}
      {tableOpen ? (
        <TableDialog
          selectedTable={selectedTable}
          orderType={orderType}
          onClose={() => setTableOpen(false)}
          onSelectTable={setSelectedTable}
          onSetOrderType={setOrderType}
        />
      ) : null}
    </div>
  );
}
