import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { PosTerminalPage } from "./features/pos-terminal/pages/pos-terminal-page";
import type { PosScreen } from "./features/pos-terminal/types";

const defaultBusinessSlug = "tj-cafe-vientiane";

function PosRoute({ screen }: { screen: PosScreen }) {
  return <PosTerminalPage screen={screen} />;
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
          path="*"
          element={
            <Navigate to={`/terminal/b/${defaultBusinessSlug}/pos`} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
