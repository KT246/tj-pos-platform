import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import {
  BarcodeScanDialog,
  CustomerDialog,
  DiscountDialog,
  TableDialog
} from "../components/terminal-dialogs";
import { TerminalTopBar } from "../components/terminal-top-bar";
import { getTerminalBusiness } from "../data/mock-pos-data";
import { BeautyPosLayout } from "../layouts/beauty/beauty-pos-layout";
import { CafePosLayout } from "../layouts/cafe/cafe-pos-layout";
import { HospitalityPosLayout } from "../layouts/hospitality/hospitality-pos-layout";
import { RestaurantPosLayout } from "../layouts/restaurant/restaurant-pos-layout";
import { RetailPosLayout } from "../layouts/retail/retail-pos-layout";
import { getPosScreenBundle } from "../screens/pos-screen-registry";
import { usePosTerminalStore } from "../stores/pos-terminal-store";
import type { PosScreen, TerminalBusinessProfile } from "../types";
import { getTerminalCopy } from "../utils/terminal-copy";

export function PosTerminalPage({ screen }: { screen: PosScreen }) {
  const { businessSlug = "tj-cafe-vientiane" } = useParams();
  const business = useMemo(
    () => getTerminalBusiness(businessSlug),
    [businessSlug]
  );
  const screenBundle = useMemo(
    () => getPosScreenBundle(business.posType),
    [business.posType]
  );
  const CheckoutScreen = screenBundle.CheckoutView;
  const CloseShiftScreen = screenBundle.CloseShiftView;
  const OfflineScreen = screenBundle.OfflineStateView;
  const OpenShiftScreen = screenBundle.OpenShiftView;
  const OrdersScreen = screenBundle.OrdersView;
  const ReceiptScreen = screenBundle.ReceiptPreviewView;
  const RefundScreen = screenBundle.RefundView;
  const configureBusiness = usePosTerminalStore(
    (state) => state.configureBusiness
  );
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
    configureBusiness(business);
  }, [business, configureBusiness]);

  useEffect(() => {
    if (screen === "new-sale") {
      startNewSale();
    }
  }, [screen, startNewSale]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return business.products.filter((product) => {
      const isLowStock =
        typeof product.stock === "number" &&
        typeof product.lowStockThreshold === "number" &&
        product.stock <= product.lowStockThreshold;
      const categoryMatches =
        activeCategory === "all" ||
        product.category === activeCategory ||
        (activeCategory === "low-stock" && isLowStock);
      const queryMatches =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.sku.toLowerCase().includes(normalizedQuery) ||
        product.barcode?.toLowerCase().includes(normalizedQuery);

      return categoryMatches && queryMatches;
    });
  }, [activeCategory, business.products, query]);

  const hasPinnedSalesSidebar =
    (
      business.posType === "retail" ||
      business.posType === "cafe" ||
      business.posType === "restaurant" ||
      business.posType === "beauty" ||
      business.posType === "hospitality"
    ) &&
    (screen === "sales" || screen === "new-sale");

  function handleAction(label: string) {
    const copy = getTerminalCopy(business.posType);

    if (label === "ສະແກນ Barcode") {
      if (business.capabilities.hasBarcode) {
        setScanOpen(true);
      } else {
        showNotice("ການສະແກນ Barcode ໃຊ້ສຳລັບ POS ຂາຍປີກເທົ່ານັ້ນ.");
      }
      return;
    }

    if (label === "ໂຕະ / ນັ່ງກິນ" && business.capabilities.hasTables) {
      setTableOpen(true);
      return;
    }

    if (label === "ພັກອໍເດີ") {
      holdOrder();
      return;
    }

    if (label === "ແບ່ງບິນ") {
      showNotice("ຂັ້ນຕອນແບ່ງບິນຈະເປີດຈາກບິນຂອງໂຕະ.");
      return;
    }

    if (label === "ນັດໝາຍ") {
      showNotice("ຂໍ້ມູນນັດໝາຍຈະເປີດຈາກຕາຕະລາງຮ້ານຄວາມງາມ.");
      return;
    }

    if (label === "ຫ້ອງ / ເຂົ້າພັກ") {
      showNotice("ຂໍ້ມູນຫ້ອງ ແລະ ເຂົ້າພັກຈະເປີດຈາກໜ້າເຄົາເຕີ.");
      return;
    }

    if (label === "ບັນຊີແຂກ") {
      showNotice("ບັນຊີແຂກຈະລວມຄ່າຫ້ອງ ແລະ ບໍລິການເພີ່ມ.");
      return;
    }

    if (label === "ລູກຄ້າ") {
      setCustomerOpen(true);
      return;
    }

    if (label === "ເພີ່ມເຕີມ") {
      showNotice(`${copy.currentDraftTitle}: ${"ຄຳສັ່ງເພີ່ມເຕີມຈະເປີດຢູ່ນີ້."}`);
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f3f7fb] text-slate-950">
      <TerminalTopBar insetLeft={hasPinnedSalesSidebar} />
      <main
        className={`min-h-0 flex-1 p-2 lg:p-3 ${
          hasPinnedSalesSidebar ? "overflow-visible" : "overflow-hidden"
        }`}
      >
        {screen === "open-shift" ? (
          <OpenShiftScreen businessSlug={businessSlug} />
        ) : screen === "close-shift" ? (
          <CloseShiftScreen businessSlug={businessSlug} />
        ) : screen === "offline" ? (
          <OfflineScreen businessSlug={businessSlug} />
        ) : screen === "checkout" ? (
          <CheckoutScreen businessSlug={businessSlug} />
        ) : screen === "receipt-preview" ? (
          <ReceiptScreen businessSlug={businessSlug} />
        ) : screen === "refund" ? (
          <RefundScreen businessSlug={businessSlug} />
        ) : screen === "open-orders" || screen === "held-orders" ? (
          <OrdersScreen businessSlug={businessSlug} mode={screen} />
        ) : (
          <PosTypeSalesLayout
            business={business}
            categories={business.categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            products={visibleProducts}
            query={query}
            onQueryChange={setQuery}
            onAddProduct={addProduct}
            onOpenScan={() => setScanOpen(true)}
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
            onAction={handleAction}
          />
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
          tables={business.tables ?? []}
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

type SalesLayoutProps = Parameters<typeof RetailPosLayout>[0];

function PosTypeSalesLayout(props: SalesLayoutProps & {
  business: TerminalBusinessProfile;
}) {
  switch (props.business.posType) {
    case "retail":
      return <RetailPosLayout {...props} />;
    case "restaurant":
      return <RestaurantPosLayout {...props} />;
    case "beauty":
      return <BeautyPosLayout {...props} />;
    case "hospitality":
      return <HospitalityPosLayout {...props} />;
    case "cafe":
    default:
      return <CafePosLayout {...props} />;
  }
}
