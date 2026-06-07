import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { CafePickupDisplayPage } from "./features/cafe-pickup-display/pages/cafe-pickup-display-page";
import { CustomerDisplayPage } from "./features/customer-display/pages/customer-display-page";
import type { CustomerDisplayRouteMode } from "./features/customer-display/types";

const defaultBusinessSlug = "tj-cafe-vientiane";

function CustomerDisplayRoute({ mode }: { mode: CustomerDisplayRouteMode }) {
  return <CustomerDisplayPage mode={mode} />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={`/display/b/${defaultBusinessSlug}`} replace />}
        />
        <Route
          path="/display/b/:businessSlug"
          element={<CustomerDisplayRoute mode="idle" />}
        />
        <Route
          path="/display/b/:businessSlug/pair"
          element={<CustomerDisplayRoute mode="pair" />}
        />
        <Route
          path="/display/b/:businessSlug/pickup-display"
          element={<CafePickupDisplayPage />}
        />
        <Route
          path="/display/b/:businessSlug/:deviceId"
          element={<CustomerDisplayRoute mode="device" />}
        />
        <Route
          path="*"
          element={<Navigate to={`/display/b/${defaultBusinessSlug}`} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
