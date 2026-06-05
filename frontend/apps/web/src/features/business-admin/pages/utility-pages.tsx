import {
  BellRing,
  ChartNoAxesCombined,
  ClipboardList,
  Monitor,
  Printer,
  Settings,
  ShieldCheck
} from "lucide-react";

import {
  ActionButtons,
  Badge,
  DataTable,
  FilterBar,
  KpiGrid,
  PageHeader,
  QuickActionsCard,
  RightRail,
  SummaryCard
} from "../components/business-admin-primitives";
import { dashboardKpis, pageKpis } from "../data/mock-business-admin";
import { BusinessAdminShell } from "../layouts/business-admin-shell";
import type { BusinessMenuKey, TableColumn } from "../types";

type UtilityRow = {
  name: string;
  type: string;
  branch: string;
  status: string;
  updated: string;
};

const utilityRows: UtilityRow[] = [
  {
    name: "Main POS Terminal",
    type: "POS Terminal",
    branch: "Main Branch",
    status: "Online",
    updated: "Today 10:24 AM"
  },
  {
    name: "Receipt Printer 01",
    type: "Printer",
    branch: "Main Branch",
    status: "Online",
    updated: "Today 10:18 AM"
  },
  {
    name: "Kitchen Display",
    type: "Display",
    branch: "Sihom Branch",
    status: "Offline",
    updated: "Yesterday 8:30 PM"
  },
  {
    name: "BCEL QR Counter",
    type: "Payment",
    branch: "All Branches",
    status: "Active",
    updated: "May 18, 2025"
  }
];

const utilityColumns: TableColumn<UtilityRow>[] = [
  { key: "name", label: "Name", render: (row) => row.name },
  { key: "type", label: "Type", render: (row) => row.type },
  { key: "branch", label: "Branch", render: (row) => row.branch },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Badge tone={row.status === "Offline" ? "red" : "emerald"}>{row.status}</Badge>
    )
  },
  { key: "updated", label: "Last Updated", render: (row) => row.updated },
  { key: "actions", label: "Actions", align: "right", render: () => <ActionButtons /> }
];

export function DevicesPage() {
  return (
    <UtilityPage
      active="Devices"
      title="Device Management"
      description="Manage POS terminals, printers, cash drawers, online status, pairing, and sync health."
      icon={Printer}
    />
  );
}

export function ReportsPage() {
  return (
    <UtilityPage
      active="Reports"
      title="Reports"
      description="Review sales, inventory, staff, customer, branch, and payment reports."
      icon={ChartNoAxesCombined}
    />
  );
}

export function SettingsPage() {
  return (
    <UtilityPage
      active="Settings"
      title="Settings"
      description="Manage business preferences, security, notifications, and workspace defaults."
      icon={Settings}
    />
  );
}

export function PosPlaceholderPage() {
  return (
    <UtilityPage
      active="POS"
      title="POS"
      description="Open the POS terminal workspace for cashier sales and payment flows."
      icon={Monitor}
    />
  );
}

export function OrdersPage() {
  return (
    <UtilityPage
      active="Orders"
      title="Orders"
      description="Track dine-in, takeaway, delivery, and pending order activity."
      icon={ClipboardList}
    />
  );
}

export function SupportPage() {
  return (
    <UtilityPage
      active="Support"
      title="Support"
      description="View help center resources, support tickets, and product updates."
      icon={BellRing}
    />
  );
}

export function AuditLogsPage() {
  return (
    <UtilityPage
      active="Audit Logs"
      title="Audit Logs"
      description="Review important business account activity and staff actions."
      icon={ShieldCheck}
    />
  );
}

function UtilityPage({
  active,
  title,
  description,
  icon: Icon
}: {
  active: BusinessMenuKey;
  title: string;
  description: string;
  icon: typeof Settings;
}) {
  return (
    <BusinessAdminShell active={active}>
      <PageHeader title={title} description={description} />
      <KpiGrid
        kpis={active === "Devices" ? pageKpis.stock : dashboardKpis.slice(0, 4)}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div>
          <FilterBar
            searchPlaceholder={`Search ${title.toLowerCase()}...`}
            filters={["All Branches", "All Statuses", "May 12 - May 18, 2025"]}
          />
          <DataTable columns={utilityColumns} rows={utilityRows} />
        </div>
        <RightRail>
          <SummaryCard
            title={`${title} Overview`}
            items={[
              { label: "Main Branch", value: "Healthy", tone: "emerald" },
              { label: "Sihom Branch", value: "Review", tone: "amber" },
              { label: "Pakse Branch", value: "Stable", tone: "blue" },
              { label: "Last Sync", value: "10:24 AM", tone: "slate" }
            ]}
          />
          <QuickActionsCard
            actions={[
              {
                label: `Open ${title}`,
                description: "Continue workflow",
                icon: Icon,
                tone: "blue"
              },
              {
                label: "Export Data",
                description: "Download current list",
                icon: ChartNoAxesCombined,
                tone: "emerald"
              },
              {
                label: "Configure",
                description: "Adjust settings",
                icon: Settings,
                tone: "violet"
              }
            ]}
          />
        </RightRail>
      </div>
    </BusinessAdminShell>
  );
}
