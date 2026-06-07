import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useParams,
  useSearchParams
} from "react-router-dom";

import {
  PublicBookingPage,
  PublicBusinessLanding,
  PublicInfoPage,
  PublicMenuItemPage,
  PublicMenuPage,
  PublicQrPage,
  PublicSearchResultsPage
} from "./features/public-business/pages/public-business-pages";

const defaultBusinessSlug = "tj-cafe-vientiane";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={`/b/${defaultBusinessSlug}/menu`} replace />}
        />
        <Route path="/b/:businessSlug" element={<BusinessLandingRoute />} />
        <Route path="/b/:businessSlug/menu" element={<MenuRoute />} />
        <Route path="/b/:businessSlug/menu/:itemSlug" element={<MenuItemRoute />} />
        <Route path="/b/:businessSlug/info" element={<InfoRoute />} />
        <Route path="/b/:businessSlug/book" element={<BookingRoute />} />
        <Route
          path="/b/:businessSlug/branch/:branchSlug/menu"
          element={<BranchMenuRoute />}
        />
        <Route path="/q/:qrCode" element={<QrRoute />} />
        <Route
          path="*"
          element={<Navigate to={`/b/${defaultBusinessSlug}/menu`} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

function BusinessLandingRoute() {
  const { businessSlug = defaultBusinessSlug } = useParams<{ businessSlug: string }>();

  return <PublicBusinessLanding businessSlug={businessSlug} />;
}

function MenuRoute() {
  const { businessSlug = defaultBusinessSlug } = useParams<{ businessSlug: string }>();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search") ?? searchParams.get("q") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  if (query) {
    return (
      <PublicSearchResultsPage
        businessSlug={businessSlug}
        query={query}
        category={category}
      />
    );
  }

  return <PublicMenuPage businessSlug={businessSlug} category={category} />;
}

function MenuItemRoute() {
  const { businessSlug = defaultBusinessSlug, itemSlug = "iced-latte" } = useParams<{
    businessSlug: string;
    itemSlug: string;
  }>();

  return <PublicMenuItemPage businessSlug={businessSlug} itemSlug={itemSlug} />;
}

function InfoRoute() {
  const { businessSlug = defaultBusinessSlug } = useParams<{ businessSlug: string }>();

  return <PublicInfoPage businessSlug={businessSlug} />;
}

function BookingRoute() {
  const { businessSlug = defaultBusinessSlug } = useParams<{ businessSlug: string }>();

  return <PublicBookingPage businessSlug={businessSlug} />;
}

function BranchMenuRoute() {
  const { businessSlug = defaultBusinessSlug, branchSlug } = useParams<{
    businessSlug: string;
    branchSlug: string;
  }>();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") ?? undefined;

  return (
    <PublicMenuPage
      businessSlug={businessSlug}
      branchSlug={branchSlug}
      category={category}
    />
  );
}

function QrRoute() {
  const { qrCode = "table-t03" } = useParams<{ qrCode: string }>();

  return <PublicQrPage qrCode={qrCode} />;
}
