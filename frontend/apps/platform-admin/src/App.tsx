import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";

import { AdminShell } from "./features/platform-admin/layouts/admin-shell";
import {
  ForgotPasswordPage,
  LoginPage,
  ResetPasswordPage
} from "./features/platform-admin/pages/auth-pages";
import {
  AssignPlanPage,
  BusinessDetailPage,
  BusinessesPage,
  BusinessFormPage
} from "./features/platform-admin/pages/business-pages";
import { DashboardPage } from "./features/platform-admin/pages/dashboard-page";
import {
  AddOnsPage,
  GlobalModulesCatalogPage,
  OwnerDetailPage,
  PaymentSettingsPage,
  PaymentsPage,
  PlansPage,
  SubscriptionsPage,
  UsersPage
} from "./features/platform-admin/pages/management-pages";
import {
  ContactRequestDetailPage,
  ContactRequestsPage,
  SupportTicketDetailPage,
  SupportTicketsPage
} from "./features/platform-admin/pages/operation-pages";
import {
  AuditLogsPage,
  NotificationTemplatesPage,
  ProfileSecurityPage,
  SystemSettingsPage
} from "./features/platform-admin/pages/system-pages";

function AdminRoute({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/platform-admin/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/platform-admin"
          element={
            <AdminRoute>
              <DashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/dashboard"
          element={
            <AdminRoute>
              <DashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/businesses"
          element={
            <AdminRoute>
              <BusinessesPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/businesses/create"
          element={
            <AdminRoute>
              <BusinessFormPage mode="create" />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/businesses/:businessId"
          element={
            <AdminRoute>
              <BusinessDetailPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/businesses/:businessId/edit"
          element={
            <AdminRoute>
              <BusinessFormPage mode="edit" />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/contact-requests"
          element={
            <AdminRoute>
              <ContactRequestsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/contact-requests/:requestId"
          element={
            <AdminRoute>
              <ContactRequestDetailPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/users"
          element={
            <AdminRoute>
              <UsersPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/users/:userId"
          element={
            <AdminRoute>
              <OwnerDetailPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/plans"
          element={
            <AdminRoute>
              <PlansPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/plans/:planId"
          element={
            <AdminRoute>
              <AssignPlanPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/subscriptions"
          element={
            <AdminRoute>
              <SubscriptionsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/subscriptions/:subscriptionId"
          element={
            <AdminRoute>
              <SubscriptionsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/payments"
          element={
            <AdminRoute>
              <PaymentsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/payments/settings"
          element={
            <AdminRoute>
              <PaymentSettingsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/add-ons"
          element={
            <AdminRoute>
              <AddOnsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/add-ons/catalog"
          element={
            <AdminRoute>
              <GlobalModulesCatalogPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/support-tickets"
          element={
            <AdminRoute>
              <SupportTicketsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/support-tickets/:ticketId"
          element={
            <AdminRoute>
              <SupportTicketDetailPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/system-settings"
          element={
            <AdminRoute>
              <SystemSettingsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/system-settings/notification-templates"
          element={
            <AdminRoute>
              <NotificationTemplatesPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/audit-logs"
          element={
            <AdminRoute>
              <AuditLogsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/platform-admin/profile-security"
          element={
            <AdminRoute>
              <ProfileSecurityPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/platform-admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
