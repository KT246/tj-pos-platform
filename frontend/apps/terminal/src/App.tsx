import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { CustomerDisplayPage } from "./features/customer-display/pages/customer-display-page";
import type { CustomerDisplayRouteMode } from "./features/customer-display/types";
import { PosTerminalPage } from "./features/pos-terminal/pages/pos-terminal-page";
import type { PosScreen } from "./features/pos-terminal/types";
import { StaffOrderPage } from "./features/staff-order-mobile/pages/staff-order-page";
import type { StaffOrderScreen } from "./features/staff-order-mobile/types";

const defaultBusinessSlug = "tj-cafe-vientiane";

function PosRoute({ screen }: { screen: PosScreen }) {
  return <PosTerminalPage screen={screen} />;
}

function StaffOrderRoute({ screen }: { screen: StaffOrderScreen }) {
  return <StaffOrderPage screen={screen} />;
}

function CustomerDisplayRoute({ mode }: { mode: CustomerDisplayRouteMode }) {
  return <CustomerDisplayPage mode={mode} />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={`/terminal/b/${defaultBusinessSlug}/pos`} replace />
          }
        />
        <Route
          path="/terminal/b/:businessSlug/pos"
          element={<PosRoute screen="sales" />}
        />
        <Route
          path="/terminal/b/:businessSlug/pos/new-sale"
          element={<PosRoute screen="new-sale" />}
        />
        <Route
          path="/terminal/b/:businessSlug/pos/open-orders"
          element={<PosRoute screen="open-orders" />}
        />
        <Route
          path="/terminal/b/:businessSlug/pos/held-orders"
          element={<PosRoute screen="held-orders" />}
        />
        <Route
          path="/terminal/b/:businessSlug/pos/checkout"
          element={<PosRoute screen="checkout" />}
        />
        <Route
          path="/terminal/b/:businessSlug/pos/receipt-preview"
          element={<PosRoute screen="receipt-preview" />}
        />
        <Route
          path="/terminal/b/:businessSlug/pos/refund"
          element={<PosRoute screen="refund" />}
        />
        <Route
          path="/terminal/b/:businessSlug/staff-order"
          element={<StaffOrderRoute screen="login" />}
        />
        <Route
          path="/terminal/b/:businessSlug/staff-order/tables"
          element={<StaffOrderRoute screen="tables" />}
        />
        <Route
          path="/terminal/b/:businessSlug/staff-order/table/:tableId"
          element={<StaffOrderRoute screen="menu" />}
        />
        <Route
          path="/terminal/b/:businessSlug/staff-order/table/:tableId/item/:itemId"
          element={<StaffOrderRoute screen="customize" />}
        />
        <Route
          path="/terminal/b/:businessSlug/staff-order/review"
          element={<StaffOrderRoute screen="review" />}
        />
        <Route
          path="/terminal/b/:businessSlug/staff-order/success"
          element={<StaffOrderRoute screen="success" />}
        />
        <Route
          path="/terminal/b/:businessSlug/staff-order/orders"
          element={<StaffOrderRoute screen="orders" />}
        />
        <Route
          path="/terminal/b/:businessSlug/staff-order/profile"
          element={<StaffOrderRoute screen="profile" />}
        />
        <Route
          path="/terminal/b/:businessSlug/display"
          element={<CustomerDisplayRoute mode="idle" />}
        />
        <Route
          path="/terminal/b/:businessSlug/display/pair"
          element={<CustomerDisplayRoute mode="pair" />}
        />
        <Route
          path="/terminal/b/:businessSlug/display/:deviceId"
          element={<CustomerDisplayRoute mode="device" />}
        />
        <Route
          path="*"
          element={
            <Navigate to={`/terminal/b/${defaultBusinessSlug}/pos`} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
