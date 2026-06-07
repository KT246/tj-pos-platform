import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";

import {
  AppointmentCalendarPage,
  BeautyCommissionPage,
  BeautyCustomerHistoryPage,
  BeautyDailySchedulePage,
  BeautyPackagesPage,
  BeautyServicesPage,
  BeautyStaffSchedulePage,
  CreateAppointmentPage,
  DepositPolicyPage
} from "./features/business-admin/pages/beauty-specific-pages";
import {
  BaristaQueueDetailPage,
  CafeDailyQuickViewPage,
  CafeFloorTableMapPage,
  CoffeeModifiersPage,
  HappyHourComboSetupPage
} from "./features/business-admin/pages/cafe-specific-pages";
import { BusinessDashboardPage } from "./features/business-admin/pages/dashboard-page";
import {
  BarcodeLabelsPage,
  GoodsReceivingPage,
  LowStockExpiryPage,
  ReturnExchangeCounterPage,
  StockCountPage
} from "./features/business-admin/pages/retail-specific-pages";
import {
  BranchFormPage,
  BrandingThemePage,
  BusinessProfilePage,
  CategoryFormPage,
  CustomerDetailPage,
  ExportCenterPage,
  ImportCenterPage,
  ItemFormPage,
  ItemVariantsPage,
  LoyaltySettingsPage,
  ModuleSettingsPage,
  PaymentMethodsPage,
  PurchaseReceiptDetailPage,
  ReceiptBillSettingsPage,
  RolesPermissionsPage,
  StaffDetailPage,
  StockAdjustmentPage,
  StockInPage,
  SupplierFormPage
} from "./features/business-admin/pages/form-pages";
import {
  BranchesListPage,
  CategoriesListPage,
  CustomersListPage,
  InventoryOverviewPage,
  ItemsListPage,
  PromotionsListPage,
  PurchaseReceiptsPage,
  StaffListPage,
  StockMovementsPage,
  SuppliersListPage
} from "./features/business-admin/pages/list-pages";
import { PromotionFormPage } from "./features/business-admin/pages/promotion-form-page";
import {
  BookingListPage,
  CheckInPage,
  CheckOutPage,
  CreateBookingPage,
  DepositCancellationPolicyPage,
  GuestFolioPage,
  RoomCalendarPage,
  RoomSettingsHousekeepingPage
} from "./features/business-admin/pages/hospitality-specific-pages";
import {
  KitchenCourseManagementPage,
  MergeTransferTablePage,
  ReservationBookPage,
  RestaurantAreasTablesPage,
  RestaurantEndOfDaySummaryPage,
  ServiceChargeTaxPreviewPage,
  SplitBillPage
} from "./features/business-admin/pages/restaurant-specific-pages";
import {
  AuditLogsPage,
  DevicesPage,
  OrdersPage,
  PosPlaceholderPage,
  ReportsPage,
  SettingsPage,
  SupportPage
} from "./features/business-admin/pages/utility-pages";

const defaultBusinessSlug = "tj-cafe-vientiane";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={`/business-admin/${defaultBusinessSlug}`} replace />}
        />
        <Route
          path="/business-admin"
          element={<Navigate to={`/business-admin/${defaultBusinessSlug}`} replace />}
        />
        <Route
          path="/business-admin/:businessSlug"
          element={<BusinessDashboardPage />}
        />
        <Route
          path="/business-admin/:businessSlug/profile"
          element={<BusinessProfilePage />}
        />
        <Route path="/business-admin/:businessSlug/orders" element={<OrdersPage />} />
        <Route
          path="/business-admin/:businessSlug/appointments"
          element={<AppointmentCalendarPage />}
        />
        <Route
          path="/business-admin/:businessSlug/appointments/create"
          element={<CreateAppointmentPage />}
        />
        <Route
          path="/business-admin/:businessSlug/calendar"
          element={<AppointmentCalendarPage />}
        />
        <Route
          path="/business-admin/:businessSlug/bookings"
          element={<AppointmentCalendarPage />}
        />
        <Route
          path="/business-admin/:businessSlug/walk-in"
          element={<CreateAppointmentPage />}
        />
        <Route
          path="/business-admin/:businessSlug/services"
          element={<BeautyServicesPage />}
        />
        <Route
          path="/business-admin/:businessSlug/staff-schedule"
          element={<BeautyStaffSchedulePage />}
        />
        <Route
          path="/business-admin/:businessSlug/packages"
          element={<BeautyPackagesPage />}
        />
        <Route
          path="/business-admin/:businessSlug/commission"
          element={<BeautyCommissionPage />}
        />
        <Route
          path="/business-admin/:businessSlug/customer-history"
          element={<BeautyCustomerHistoryPage />}
        />
        <Route
          path="/business-admin/:businessSlug/deposit-policy"
          element={<DepositPolicyPage />}
        />
        <Route
          path="/business-admin/:businessSlug/beauty-daily-schedule"
          element={<BeautyDailySchedulePage />}
        />
        <Route
          path="/business-admin/:businessSlug/rooms"
          element={<RoomSettingsHousekeepingPage />}
        />
        <Route
          path="/business-admin/:businessSlug/room-calendar"
          element={<RoomCalendarPage />}
        />
        <Route
          path="/business-admin/:businessSlug/bookings"
          element={<BookingListPage />}
        />
        <Route
          path="/business-admin/:businessSlug/bookings/create"
          element={<CreateBookingPage />}
        />
        <Route
          path="/business-admin/:businessSlug/front-desk"
          element={<BookingListPage />}
        />
        <Route
          path="/business-admin/:businessSlug/check-in"
          element={<CheckInPage />}
        />
        <Route
          path="/business-admin/:businessSlug/check-out"
          element={<CheckOutPage />}
        />
        <Route
          path="/business-admin/:businessSlug/guests"
          element={<GuestFolioPage />}
        />
        <Route
          path="/business-admin/:businessSlug/housekeeping"
          element={<RoomSettingsHousekeepingPage />}
        />
        <Route
          path="/business-admin/:businessSlug/room-settings"
          element={<RoomSettingsHousekeepingPage />}
        />
        <Route
          path="/business-admin/:businessSlug/guest-folio"
          element={<GuestFolioPage />}
        />
        <Route
          path="/business-admin/:businessSlug/deposit-cancellation-policy"
          element={<DepositCancellationPolicyPage />}
        />
        <Route path="/business-admin/:businessSlug/items" element={<ItemsListPage />} />
        <Route
          path="/business-admin/:businessSlug/items/create"
          element={<ItemFormPage />}
        />
        <Route
          path="/business-admin/:businessSlug/items/variants"
          element={<ItemVariantsPage />}
        />
        <Route
          path="/business-admin/:businessSlug/categories"
          element={<CategoriesListPage />}
        />
        <Route
          path="/business-admin/:businessSlug/categories/create"
          element={<CategoryFormPage />}
        />
        <Route
          path="/business-admin/:businessSlug/inventory"
          element={<InventoryOverviewPage />}
        />
        <Route
          path="/business-admin/:businessSlug/stock-movements"
          element={<StockMovementsPage />}
        />
        <Route
          path="/business-admin/:businessSlug/stock-in"
          element={<StockInPage />}
        />
        <Route
          path="/business-admin/:businessSlug/stock-adjustment"
          element={<StockAdjustmentPage />}
        />
        <Route
          path="/business-admin/:businessSlug/stock-count"
          element={<StockCountPage />}
        />
        <Route
          path="/business-admin/:businessSlug/low-stock-expiry"
          element={<LowStockExpiryPage />}
        />
        <Route
          path="/business-admin/:businessSlug/goods-receiving"
          element={<GoodsReceivingPage />}
        />
        <Route
          path="/business-admin/:businessSlug/returns"
          element={<ReturnExchangeCounterPage />}
        />
        <Route
          path="/business-admin/:businessSlug/barcode-labels"
          element={<BarcodeLabelsPage />}
        />
        <Route
          path="/business-admin/:businessSlug/suppliers"
          element={<SuppliersListPage />}
        />
        <Route
          path="/business-admin/:businessSlug/suppliers/create"
          element={<SupplierFormPage />}
        />
        <Route
          path="/business-admin/:businessSlug/purchase-receipts"
          element={<PurchaseReceiptsPage />}
        />
        <Route
          path="/business-admin/:businessSlug/purchase-receipts/:receiptId"
          element={<PurchaseReceiptDetailPage />}
        />
        <Route
          path="/business-admin/:businessSlug/customers"
          element={<CustomersListPage />}
        />
        <Route
          path="/business-admin/:businessSlug/customers/:customerId"
          element={<CustomerDetailPage />}
        />
        <Route
          path="/business-admin/:businessSlug/loyalty"
          element={<LoyaltySettingsPage />}
        />
        <Route
          path="/business-admin/:businessSlug/promotions"
          element={<PromotionsListPage />}
        />
        <Route
          path="/business-admin/:businessSlug/promotions/create"
          element={<PromotionFormPage />}
        />
        <Route path="/business-admin/:businessSlug/staff" element={<StaffListPage />} />
        <Route
          path="/business-admin/:businessSlug/staff/:staffId"
          element={<StaffDetailPage />}
        />
        <Route
          path="/business-admin/:businessSlug/roles-permissions"
          element={<RolesPermissionsPage />}
        />
        <Route
          path="/business-admin/:businessSlug/branches"
          element={<BranchesListPage />}
        />
        <Route
          path="/business-admin/:businessSlug/branches/create"
          element={<BranchFormPage />}
        />
        <Route path="/business-admin/:businessSlug/devices" element={<DevicesPage />} />
        <Route path="/business-admin/:businessSlug/reports" element={<ReportsPage />} />
        <Route
          path="/business-admin/:businessSlug/receipt-bill"
          element={<ReceiptBillSettingsPage />}
        />
        <Route
          path="/business-admin/:businessSlug/branding"
          element={<BrandingThemePage />}
        />
        <Route
          path="/business-admin/:businessSlug/payment-methods"
          element={<PaymentMethodsPage />}
        />
        <Route
          path="/business-admin/:businessSlug/modules"
          element={<ModuleSettingsPage />}
        />
        <Route
          path="/business-admin/:businessSlug/import"
          element={<ImportCenterPage />}
        />
        <Route
          path="/business-admin/:businessSlug/export"
          element={<ExportCenterPage />}
        />
        <Route
          path="/business-admin/:businessSlug/settings"
          element={<SettingsPage />}
        />
        <Route path="/business-admin/:businessSlug/support" element={<SupportPage />} />
        <Route
          path="/business-admin/:businessSlug/audit-logs"
          element={<AuditLogsPage />}
        />
        <Route
          path="/business-admin/:businessSlug/pos"
          element={<PosPlaceholderPage />}
        />
        <Route
          path="/business-admin/:businessSlug/tables"
          element={<RestaurantOrCafeTables />}
        />
        <Route
          path="/business-admin/:businessSlug/modifiers"
          element={<CoffeeModifiersPage />}
        />
        <Route
          path="/business-admin/:businessSlug/barista-queue"
          element={<BaristaQueueDetailPage />}
        />
        <Route
          path="/business-admin/:businessSlug/happy-hour"
          element={<HappyHourComboSetupPage />}
        />
        <Route
          path="/business-admin/:businessSlug/cafe-daily-view"
          element={<CafeDailyQuickViewPage />}
        />
        <Route
          path="/business-admin/:businessSlug/reservations"
          element={<ReservationBookPage />}
        />
        <Route
          path="/business-admin/:businessSlug/kitchen-courses"
          element={<KitchenCourseManagementPage />}
        />
        <Route
          path="/business-admin/:businessSlug/split-bill"
          element={<SplitBillPage />}
        />
        <Route
          path="/business-admin/:businessSlug/service-charge"
          element={<ServiceChargeTaxPreviewPage />}
        />
        <Route
          path="/business-admin/:businessSlug/merge-transfer-table"
          element={<MergeTransferTablePage />}
        />
        <Route
          path="/business-admin/:businessSlug/end-of-day"
          element={<RestaurantEndOfDaySummaryPage />}
        />
        <Route
          path="*"
          element={<Navigate to={`/business-admin/${defaultBusinessSlug}`} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

function RestaurantOrCafeTables() {
  const { businessSlug = "" } = useParams<{ businessSlug: string }>();

  if (businessSlug.toLowerCase().includes("restaurant")) {
    return <RestaurantAreasTablesPage />;
  }

  return <CafeFloorTableMapPage />;
}
