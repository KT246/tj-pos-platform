import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { StaffOrderPage } from "./features/staff-order-mobile/pages/staff-order-page";
import type { StaffOrderScreen } from "./features/staff-order-mobile/types";
import { StaffOrderToastHost } from "./lib/staff-order-toasts";

const defaultBusinessSlug = "tj-cafe-vientiane";

function StaffOrderRoute({ screen }: { screen: StaffOrderScreen }) {
  return <StaffOrderPage screen={screen} />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={`/staff-order/b/${defaultBusinessSlug}`} replace />}
        />
        <Route
          path="/staff-order/b/:businessSlug"
          element={<StaffOrderRoute screen="login" />}
        />
        <Route
          path="/staff-order/b/:businessSlug/tables"
          element={<StaffOrderRoute screen="tables" />}
        />
        <Route
          path="/staff-order/b/:businessSlug/table/:tableId"
          element={<StaffOrderRoute screen="menu" />}
        />
        <Route
          path="/staff-order/b/:businessSlug/table/:tableId/item/:itemId"
          element={<StaffOrderRoute screen="customize" />}
        />
        <Route
          path="/staff-order/b/:businessSlug/review"
          element={<StaffOrderRoute screen="review" />}
        />
        <Route
          path="/staff-order/b/:businessSlug/success"
          element={<StaffOrderRoute screen="success" />}
        />
        <Route
          path="/staff-order/b/:businessSlug/orders"
          element={<StaffOrderRoute screen="orders" />}
        />
        <Route
          path="/staff-order/b/:businessSlug/profile"
          element={<StaffOrderRoute screen="profile" />}
        />
        <Route
          path="*"
          element={<Navigate to={`/staff-order/b/${defaultBusinessSlug}`} replace />}
        />
      </Routes>
      <StaffOrderToastHost />
    </BrowserRouter>
  );
}
