import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useStaffOrderStore } from "../stores/staff-order-store";
import type { StaffOrderScreen } from "../types";
import { StaffCustomizePage } from "./customize-page";
import { StaffLoginPage } from "./login-page";
import { StaffMenuPage } from "./menu-page";
import { StaffOrdersPage } from "./orders-page";
import { StaffProfilePage } from "./profile-page";
import { StaffReviewPage } from "./review-page";
import { StaffSuccessPage } from "./success-page";
import { StaffTablesPage } from "./tables-page";

export function StaffOrderPage({ screen }: { screen: StaffOrderScreen }) {
  const { businessSlug = "tj-cafe-vientiane" } = useParams();
  const notice = useStaffOrderStore((state) => state.notice);
  const clearNotice = useStaffOrderStore((state) => state.clearNotice);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(clearNotice, 2200);
    return () => window.clearTimeout(timer);
  }, [clearNotice, notice]);

  return (
    <>
      {screen === "login" ? (
        <StaffLoginPage businessSlug={businessSlug} />
      ) : screen === "tables" ? (
        <StaffTablesPage businessSlug={businessSlug} />
      ) : screen === "menu" ? (
        <StaffMenuPage businessSlug={businessSlug} />
      ) : screen === "customize" ? (
        <StaffCustomizePage businessSlug={businessSlug} />
      ) : screen === "review" ? (
        <StaffReviewPage businessSlug={businessSlug} />
      ) : screen === "success" ? (
        <StaffSuccessPage businessSlug={businessSlug} />
      ) : screen === "orders" ? (
        <StaffOrdersPage businessSlug={businessSlug} />
      ) : (
        <StaffProfilePage businessSlug={businessSlug} />
      )}

      {notice ? (
        <div className="fixed top-4 left-1/2 z-50 w-[min(390px,calc(100vw-32px))] -translate-x-1/2 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-center text-[12px] font-black text-emerald-600 shadow-lg">
          {notice}
        </div>
      ) : null}
    </>
  );
}
