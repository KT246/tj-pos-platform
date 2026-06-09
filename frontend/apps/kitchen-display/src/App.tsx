import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { KitchenDisplayPage } from "./features/kitchen-bar-display/pages/kitchen-display-page";
import type { KitchenBoardMode } from "./features/kitchen-bar-display/types";
import { KitchenDisplayToastHost } from "./lib/kitchen-display-toasts";

const defaultBusinessSlug = "tj-cafe-vientiane";

function KitchenDisplayRoute({ mode }: { mode: KitchenBoardMode }) {
  return <KitchenDisplayPage mode={mode} />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={`/kitchen/b/${defaultBusinessSlug}`} replace />}
        />
        <Route
          path="/kitchen/b/:businessSlug"
          element={<KitchenDisplayRoute mode="kitchen" />}
        />
        <Route
          path="/kitchen/b/:businessSlug/ticket/:ticketId"
          element={<KitchenDisplayRoute mode="kitchen" />}
        />
        <Route
          path="/bar/b/:businessSlug"
          element={<KitchenDisplayRoute mode="bar" />}
        />
        <Route
          path="/bar/b/:businessSlug/ticket/:ticketId"
          element={<KitchenDisplayRoute mode="bar" />}
        />
        <Route
          path="*"
          element={<Navigate to={`/kitchen/b/${defaultBusinessSlug}`} replace />}
        />
      </Routes>
      <KitchenDisplayToastHost />
    </BrowserRouter>
  );
}
