import { useParams } from "react-router-dom";

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
    </>
  );
}
