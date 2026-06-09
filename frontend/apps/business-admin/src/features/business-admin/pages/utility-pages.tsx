import {
  BellRing,
  ChartNoAxesCombined,
  ClipboardList,
  CreditCard,
  Monitor,
  Printer,
  Settings,
  ShieldCheck
} from "lucide-react";

import {
  ActionButtons,
  Badge,
  Card,
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

type OrderRow = {
  order: string;
  customer: string;
  customerType: string;
  orderType: string;
  priceList: string;
  paymentStatus: string;
  debtStatus: string;
  deliveryStatus: string;
  amount: string;
};

type ReportRow = {
  report: string;
  filter: string;
  metric: string;
  value: string;
  trend: string;
};

const utilityRows: UtilityRow[] = [
  {
    name: "Main POS Terminal",
    type: "POS Terminal",
    branch: "ສາຂາຫຼັກ",
    status: "Online",
    updated: "Today 10:24 AM"
  },
  {
    name: "Receipt Printer 01",
    type: "Printer",
    branch: "ສາຂາຫຼັກ",
    status: "Online",
    updated: "Today 10:18 AM"
  },
  {
    name: "Kitchen Display",
    type: "Display",
    branch: "ສາຂາສີຫອມ",
    status: "Offline",
    updated: "Yesterday 8:30 PM"
  },
  {
    name: "BCEL QR Counter",
    type: "Payment",
    branch: "ທຸກສາຂາ",
    status: "ເປີດໃຊ້",
    updated: "18 ພຶດສະພາ 2025"
  }
];

const wholesaleOrderRows: OrderRow[] = [
  {
    order: "ORD-2025-1188",
    customer: "Khamla Distribution",
    customerType: "ລູກຄ້າຂາຍສົ່ງ",
    orderType: "ຂາຍສົ່ງ",
    priceList: "ລາຄາສົ່ງຮ້ານກາເຟ",
    paymentStatus: "ຈ່າຍບາງສ່ວນ",
    debtStatus: "ຕິດໜີ້",
    deliveryStatus: "ລໍຖ້າ",
    amount: "LAK 4,850,000"
  },
  {
    order: "ORD-2025-1187",
    customer: "Vientiane Mini Mart",
    customerType: "ຜູ້ຂາຍຕໍ່",
    orderType: "ຂາຍສົ່ງ",
    priceList: "ລາຄາຜູ້ຂາຍຕໍ່ເຄື່ອງດື່ມ",
    paymentStatus: "ຈ່າຍແລ້ວ",
    debtStatus: "ປົກກະຕິ",
    deliveryStatus: "Delivered",
    amount: "LAK 2,420,000"
  },
  {
    order: "ORD-2025-1186",
    customer: "ລູກຄ້າທົ່ວໄປ",
    customerType: "ລູກຄ້າຂາຍຍ່ອຍ",
    orderType: "ຂາຍຍ່ອຍ",
    priceList: "ລາຄາຂາຍຍ່ອຍພື້ນຖານ",
    paymentStatus: "ຈ່າຍແລ້ວ",
    debtStatus: "ປົກກະຕິ",
    deliveryStatus: "Not required",
    amount: "LAK 185,000"
  },
  {
    order: "ORD-2025-1185",
    customer: "Sabaidee Hotel",
    customerType: "VIP",
    orderType: "ຂາຍສົ່ງ",
    priceList: "ລາຄາ VIP",
    paymentStatus: "ຍັງບໍ່ຈ່າຍ",
    debtStatus: "ຕິດໜີ້",
    deliveryStatus: "ລໍຖ້າ",
    amount: "LAK 1,760,000"
  }
];

const reportRows: ReportRow[] = [
  {
    report: "Sales by Customer Type",
    filter: "Retail / Wholesale / Reseller",
    metric: "Wholesale Sales",
    value: "LAK 42,850,000",
    trend: "+18.4%"
  },
  {
    report: "Top Wholesale Customers",
    filter: "Customer Type = Wholesale",
    metric: "Top Customer",
    value: "Khamla Distribution",
    trend: "LAK 18.2M"
  },
  {
    report: "Debt Report",
    filter: "Debt Status = Debt",
    metric: "Outstanding",
    value: "LAK 7,920,000",
    trend: "12 invoices"
  },
  {
    report: "Profit by Price Type",
    filter: "Retail / Wholesale / Reseller",
    metric: "Gross Profit",
    value: "LAK 16,430,000",
    trend: "+9.1%"
  }
];

const utilityColumns: TableColumn<UtilityRow>[] = [
  { key: "name", label: "Name", render: (row) => row.name },
  { key: "type", label: "ປະເພດ", render: (row) => row.type },
  { key: "branch", label: "ສາຂາ", render: (row) => row.branch },
  {
    key: "status",
    label: "ສະຖານະ",
    render: (row) => (
      <Badge tone={row.status === "Offline" ? "red" : "emerald"}>{row.status}</Badge>
    )
  },
  { key: "updated", label: "Last Updated", render: (row) => row.updated },
  { key: "actions", label: "ການດຳເນີນການ", align: "right", render: () => <ActionButtons /> }
];

const orderColumns: TableColumn<OrderRow>[] = [
  { key: "order", label: "Order", render: (row) => row.order },
  {
    key: "customer",
    label: "Customer / Type",
    render: (row) => (
      <div>
        <p className="font-black text-slate-950">{row.customer}</p>
        <p className="mt-1 text-xs font-bold text-slate-500">{row.customerType}</p>
      </div>
    )
  },
  { key: "orderType", label: "Order Type", render: (row) => <Badge tone="blue">{row.orderType}</Badge> },
  { key: "priceList", label: "Price List", render: (row) => row.priceList },
  {
    key: "payment",
    label: "Payment / Debt",
    render: (row) => (
      <div className="space-y-1">
        <Badge tone={row.paymentStatus === "ຈ່າຍແລ້ວ" ? "emerald" : "amber"}>
          {row.paymentStatus}
        </Badge>
        <Badge tone={row.debtStatus === "ຕິດໜີ້" ? "red" : "emerald"}>
          {row.debtStatus}
        </Badge>
      </div>
    )
  },
  {
    key: "delivery",
    label: "ຈັດສົ່ງ",
    render: (row) => <Badge tone={row.deliveryStatus === "ລໍຖ້າ" ? "amber" : "slate"}>{row.deliveryStatus}</Badge>
  },
  { key: "amount", label: "ຈຳນວນເງິນ", align: "right", render: (row) => row.amount },
  { key: "actions", label: "ການດຳເນີນການ", align: "right", render: () => <ActionButtons /> }
];

const reportColumns: TableColumn<ReportRow>[] = [
  { key: "report", label: "Report", render: (row) => row.report },
  { key: "filter", label: "ກັ່ນຕອງ", render: (row) => row.filter },
  { key: "metric", label: "Metric", render: (row) => row.metric },
  { key: "value", label: "Value", render: (row) => row.value },
  { key: "trend", label: "Trend", align: "right", render: (row) => <Badge tone="emerald">{row.trend}</Badge> }
];

export function DevicesPage() {
  return (
    <UtilityPage
      active="ອຸປະກອນ"
      title="Device Management"
      description="Manage POS terminals, printers, cash drawers, online status, pairing, and sync health."
      icon={Printer}
    />
  );
}

export function ReportsPage() {
  return (
    <BusinessAdminShell active="ລາຍງານ">
      <PageHeader
        title="ລາຍງານ"
        description="Review sales, wholesale, customer balance, debt, bank payment, and profit reports."
      />
      <KpiGrid kpis={dashboardKpis.slice(0, 4)} />
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div>
          <FilterBar
            searchPlaceholder="Search reports, customer type, order type..."
            filters={[
              "ທຸກປະເພດລູກຄ້າ",
              "All Order Types",
              "ທຸກປະເພດລາຄາ",
              "ທຸກສະຖານະໜີ້"
            ]}
          />
          <DataTable columns={reportColumns} rows={reportRows} />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              ["Wholesale Sales", "LAK 42,850,000", "Order Type = Wholesale"],
              ["Customer Balance", "LAK 7,920,000", "Debt Status = Debt"],
              ["Payment by Bank", "LAK 31,400,000", "Bank Transfer / QR"],
              ["Profit by Price Type", "LAK 16,430,000", "Retail vs Wholesale"]
            ].map(([title, value, detail]) => (
              <Card key={title} title={title}>
                <div className="p-4">
                  <p className="text-2xl font-black text-slate-950">{value}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{detail}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <RightRail>
          <SummaryCard
            title="Report Filters"
            items={[
              { label: "Customer Type", value: "Retail / Wholesale", tone: "blue" },
              { label: "Order Type", value: "Retail / Wholesale", tone: "emerald" },
              { label: "Debt Status", value: "Debt / Partial", tone: "amber" },
              { label: "Price Type", value: "Retail / Reseller", tone: "violet" }
            ]}
          />
        </RightRail>
      </div>
    </BusinessAdminShell>
  );
}

export function SettingsPage() {
  return (
    <UtilityPage
      active="ຕັ້ງຄ່າ"
      title="ຕັ້ງຄ່າ"
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
    <BusinessAdminShell active="ອໍເດີ">
      <PageHeader
        title="ອໍເດີ"
        description="Track retail, wholesale, purchase, return, payment, debt, and delivery status."
      />
      <KpiGrid kpis={dashboardKpis.slice(0, 4)} />
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div>
          <FilterBar
            searchPlaceholder="Search order, customer, reseller, invoice..."
            filters={[
              "All Order Types",
              "ທຸກປະເພດລູກຄ້າ",
              "ທຸກສະຖານະຊຳລະ",
              "ທຸກສະຖານະໜີ້",
              "ທຸກສະຖານະຈັດສົ່ງ"
            ]}
          />
          <DataTable columns={orderColumns} rows={wholesaleOrderRows} />
        </div>
        <RightRail>
          <SummaryCard
            title="Wholesale Snapshot"
            items={[
              { label: "Wholesale Orders", value: "18", tone: "emerald" },
              { label: "Debt Balance", value: "LAK 7.92M", tone: "amber" },
              { label: "Pending Delivery", value: "6 orders", tone: "blue" },
              { label: "Top Price List", value: "ລາຄາສົ່ງຮ້ານກາເຟ", tone: "violet" }
            ]}
          />
          <QuickActionsCard
            actions={[
              {
                label: "Create Wholesale Order",
                description: "Use customer price list",
                icon: ClipboardList,
                tone: "blue"
              },
              {
                label: "Receive Debt Payment",
                description: "Record partial or full payment",
                icon: CreditCard,
                tone: "emerald"
              },
              {
                label: "Export Wholesale Orders",
                description: "Download XLSX report",
                icon: ChartNoAxesCombined,
                tone: "violet"
              }
            ]}
          />
        </RightRail>
      </div>
    </BusinessAdminShell>
  );
}

export function SupportPage() {
  return (
    <UtilityPage
      active="ຊ່ວຍເຫຼືອ"
      title="ຊ່ວຍເຫຼືອ"
      description="View help center resources, support tickets, and product updates."
      icon={BellRing}
    />
  );
}

export function AuditLogsPage() {
  return (
    <UtilityPage
      active="ບັນທຶກກວດສອບ"
      title="ບັນທຶກກວດສອບ"
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
        kpis={active === "ອຸປະກອນ" ? pageKpis.stock : dashboardKpis.slice(0, 4)}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div>
          <FilterBar
            searchPlaceholder={`Search ${title.toLowerCase()}...`}
            filters={["ທຸກສາຂາ", "ທຸກສະຖານະ", "12 - 18 ພຶດສະພາ 2025"]}
          />
          <DataTable columns={utilityColumns} rows={utilityRows} />
        </div>
        <RightRail>
          <SummaryCard
            title={`${title} Overview`}
            items={[
              { label: "ສາຂາຫຼັກ", value: "Healthy", tone: "emerald" },
              { label: "ສາຂາສີຫອມ", value: "Review", tone: "amber" },
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
