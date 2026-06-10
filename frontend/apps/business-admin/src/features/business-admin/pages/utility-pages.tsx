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
  const devices = [
    { name: "Main POS Terminal", model: "Sunmi T2s", type: "POS Terminal", branch: "ສາຂາຫຼັກ", ip: "192.168.1.10", status: "Online", lastSeen: "Now" },
    { name: "Receipt Printer 01", model: "Epson TM-T82", type: "Printer", branch: "ສາຂາຫຼັກ", ip: "192.168.1.11", status: "Online", lastSeen: "2 min ago" },
    { name: "Kitchen Display", model: "Sunmi D2s", type: "Display", branch: "ສາຂາສີຫອມ", ip: "192.168.2.14", status: "Offline", lastSeen: "Yesterday 8:30 PM" },
    { name: "BCEL QR Counter", model: "BCEL QR V3", type: "Payment", branch: "ທຸກສາຂາ", ip: "—", status: "ເປີດໃຊ້", lastSeen: "18 ພຶດສະພາ 2025" },
    { name: "Backup Printer 02", model: "Xprinter XP-Q200", type: "Printer", branch: "ສາຂາປາກເຊ", ip: "192.168.3.22", status: "Online", lastSeen: "5 min ago" },
    { name: "Customer Display", model: "Sunmi D2", type: "Display", branch: "ສາຂາຫຼັກ", ip: "192.168.1.15", status: "Online", lastSeen: "Now" }
  ];

  return (
    <BusinessAdminShell active="ອຸປະກອນ">
      <PageHeader
        title="ອຸປະກອນ"
        description="Manage POS terminals, printers, displays, and payment devices."
        actions={
          <button type="button" className="flex h-10 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-black text-white shadow-[0_8px_18px_rgba(37,99,235,0.2)] transition hover:bg-blue-700">
            <Printer className="h-4 w-4" />
            Add Device
          </button>
        }
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-5">
        {[
          { label: "ທັງໝົດ", value: "12", color: "bg-blue-50 text-blue-600" },
          { label: "Online", value: "9", color: "bg-emerald-50 text-emerald-600" },
          { label: "Offline", value: "2", color: "bg-rose-50 text-rose-600" },
          { label: "ທຸກສາຂາ", value: "4", color: "bg-violet-50 text-violet-600" }
        ].map((s) => (
          <div key={s.label} className={`flex flex-col items-center justify-center gap-1 rounded-lg p-5 ${s.color}`}>
            <span className="text-2xl font-black">{s.value}</span>
            <span className="text-[11px] font-bold">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-blue-100 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)] overflow-x-auto">
        <div className="flex items-center justify-between border-b border-blue-50 px-4 py-3">
          <h2 className="text-[15px] font-black text-slate-950">Device List</h2>
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-400" />Online</span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><span className="h-2 w-2 rounded-full bg-rose-400" />Offline</span>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              {["Device Name", "Model", "ປະເພດ", "ສາຂາ", "IP Address", "ສະຖານະ", "Last Seen", "ການດຳເນີນການ"].map((h) => (
                <th key={h} className="border-b border-blue-50 px-4 py-3 text-left text-[11px] font-black text-slate-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.name} className="border-b border-blue-50 last:border-b-0 transition hover:bg-blue-50/30">
                <td className="px-4 py-3 text-sm font-black text-slate-950 whitespace-nowrap">{device.name}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-600 whitespace-nowrap">{device.model}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge tone="blue">{device.type}</Badge>
                </td>
                <td className="px-4 py-3 text-xs font-bold text-slate-600 whitespace-nowrap">{device.branch}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-500 font-mono">{device.ip}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge tone={device.status === "Offline" ? "red" : "emerald"}>{device.status}</Badge>
                </td>
                <td className="px-4 py-3 text-xs font-bold text-slate-500 whitespace-nowrap">{device.lastSeen}</td>
                <td className="px-4 py-3 text-right">
                  <ActionButtons />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BusinessAdminShell>
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
  const sections = [
    {
      title: "Business Profile",
      icon: Settings,
      items: [
        ["Business Name", "TJ Cafe Vientiane"],
        ["Business Type", "Café & Restaurant"],
        ["Registration No.", "LAO-BIZ-2022-48821"],
        ["Tax ID", "0102558012345"],
        ["Address", "Sikhottabong, Vientiane"]
      ]
    },
    {
      title: "Notifications",
      icon: BellRing,
      items: [
        ["Low Stock Alerts", "Enabled"],
        ["Order Notifications", "Enabled"],
        ["Daily Sales Summary", "08:00 PM"],
        ["Staff Login Alerts", "Enabled"]
      ]
    },
    {
      title: "Security",
      icon: ShieldCheck,
      items: [
        ["PIN Lock", "Enabled (4-digit)"],
        ["Session Timeout", "30 minutes"],
        ["2FA", "Enabled"],
        ["Data Backup", "Daily at midnight"]
      ]
    }
  ];

  return (
    <BusinessAdminShell active="ຕັ້ງຄ່າ">
      <PageHeader
        title="ຕັ້ງຄ່າ"
        description="Manage business preferences, security, notifications, and workspace defaults."
      />
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="rounded-lg border border-blue-100 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
              <div className="flex items-center gap-3 border-b border-blue-50 px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon className="h-4 w-4" />
                </span>
                <h2 className="text-[15px] font-black text-slate-950">{section.title}</h2>
              </div>
              <div className="divide-y divide-blue-50">
                {section.items.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs font-bold text-slate-500">{label}</span>
                    <span className="text-xs font-black text-slate-950">{value}</span>
                  </div>
                ))}
                <div className="px-4 py-3">
                  <button type="button" className="text-xs font-black text-blue-600 hover:underline">
                    Edit Section →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </BusinessAdminShell>
  );
}

export function PosPlaceholderPage() {
  return (
    <BusinessAdminShell active="POS">
      <PageHeader
        title="POS"
        description="Open the POS terminal workspace for cashier sales and payment flows."
      />
      <div className="flex flex-col items-center justify-center gap-6 py-20">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Monitor className="h-10 w-10" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-black text-slate-950">ເປີດ POS Terminal</h2>
          <p className="mt-2 max-w-md text-sm font-semibold text-slate-500">
            ໜ້າ POS ຈະໂຫຼດໃນໜ້າຕ່າງໃໝ່ — ເລືອກໂຕະ ຫຼື ເລີ່ມຂາຍທັນທີ.
          </p>
        </div>
        <button type="button" className="flex h-12 items-center gap-3 rounded-xl bg-blue-600 px-8 text-sm font-black text-white shadow-[0_8px_24px_rgba(37,99,235,0.3)] transition hover:bg-blue-700">
          <Monitor className="h-5 w-5" />
          Open POS Workspace
        </button>
      </div>
    </BusinessAdminShell>
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
  const tickets = [
    { id: "TK-0089", subject: "ເຄື່ອງປິ໊ນ Printer ສາຂາສີຫອມ offline", status: "Open", priority: "High", date: "18 ພຶດສະພາ 2025" },
    { id: "TK-0088", subject: "ສິນຄ້າ sync ບໍ່ໄດ້ກັບ POS", status: "In Progress", priority: "Medium", date: "17 ພຶດສະພາ 2025" },
    { id: "TK-0087", subject: "ຂໍ reset PIN ພະນັກງານ", status: "Resolved", priority: "Low", date: "16 ພຶດສະພາ 2025" }
  ];
  const faqs = [
    ["ຂ້ອຍ reset PIN ຂອງພະນັກງານໄດ້ແນວໃດ?", "ໄປທີ່ ພະນັກງານ → ເລືອກພະນັກງານ → Reset PIN."],
    ["ຂໍ້ມູນ sync ອັດຕະໂນມັດທຸກໆ?", "ທຸກໆ 15 ນາທີ, ຫຼື sync ດ້ວຍຕົນເອງໃນ Settings → Sync."],
    ["ຂ້ອຍເພີ່ມ User ໃໝ່ໄດ້ແນວໃດ?", "ໄປທີ່ ພະນັກງານ → Add Staff → ເລືອກ Role."]
  ];

  return (
    <BusinessAdminShell active="ຊ່ວຍເຫຼືອ">
      <PageHeader
        title="ຊ່ວຍເຫຼືອ"
        description="View help center resources, support tickets, and product updates."
        actions={
          <button type="button" className="flex h-10 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-black text-white shadow-[0_8px_18px_rgba(37,99,235,0.2)] transition hover:bg-blue-700">
            <BellRing className="h-4 w-4" />
            Submit Ticket
          </button>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          {/* FAQ */}
          <div className="rounded-lg border border-blue-100 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <div className="border-b border-blue-50 px-4 py-3">
              <h2 className="text-[15px] font-black text-slate-950">ຄຳຖາມທີ່ພົບບ່ອຍ</h2>
            </div>
            <div className="divide-y divide-blue-50">
              {faqs.map(([q, a]) => (
                <div key={q} className="px-4 py-4">
                  <p className="text-sm font-black text-slate-950">{q}</p>
                  <p className="mt-1.5 text-xs font-semibold text-slate-500">{a}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Tickets */}
          <div className="rounded-lg border border-blue-100 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <div className="border-b border-blue-50 px-4 py-3">
              <h2 className="text-[15px] font-black text-slate-950">Support Tickets</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  {["Ticket ID", "Subject", "Status", "Priority", "Date"].map((h) => (
                    <th key={h} className="border-b border-blue-50 px-4 py-3 text-left text-[11px] font-black text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} className="border-b border-blue-50 last:border-b-0 hover:bg-blue-50/30 transition">
                    <td className="px-4 py-3 text-xs font-black text-blue-600">{t.id}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-700">{t.subject}</td>
                    <td className="px-4 py-3">
                      <Badge tone={t.status === "Open" ? "amber" : t.status === "Resolved" ? "emerald" : "blue"}>{t.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={t.priority === "High" ? "red" : t.priority === "Medium" ? "amber" : "slate"}>{t.priority}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-500">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-4">
            <h3 className="text-sm font-black text-slate-950">ຕ້ອງການຊ່ວຍດ່ວນ?</h3>
            <p className="mt-2 text-xs font-semibold text-slate-600">ໂທຫາ support ຂອງ TJ POS ໄດ້ທຸກເວລາ.</p>
            <a href="tel:02055501234" className="mt-3 flex items-center gap-2 text-sm font-black text-blue-600">
              📞 020 5550 1234
            </a>
          </div>
        </aside>
      </div>
    </BusinessAdminShell>
  );
}

export function AuditLogsPage() {
  const logs = [
    { time: "10:24 AM", user: "Somchai (Manager)", action: "ລຶບສິນຄ້າ", detail: "Deleted item: Matcha Latte (CF-1009)", type: "danger" },
    { time: "10:18 AM", user: "Nina (Cashier)", action: "ເປີດ POS", detail: "Opened POS session on Terminal 1", type: "info" },
    { time: "09:55 AM", user: "Somchai (Manager)", action: "ປ່ຽນລາຄາ", detail: "Updated price: Iced Latte → LAK 27,000", type: "warning" },
    { time: "09:40 AM", user: "Admin", action: "ເພີ່ມພະນັກງານ", detail: "Added staff: Mali Phim (Cashier)", type: "success" },
    { time: "09:12 AM", user: "Bounlie (Cashier)", action: "ລ໊ອກອອກ", detail: "Logged out from POS Terminal 2", type: "info" },
    { time: "08:59 AM", user: "Somchai (Manager)", action: "ຕັ້ງຄ່າ Printer", detail: "Changed receipt printer branch Sihom", type: "info" },
    { time: "08:30 AM", user: "Admin", action: "ລ໊ອກອິນ", detail: "Admin login from 192.168.1.1", type: "success" }
  ];

  const typeStyle: Record<string, string> = {
    danger: "border-rose-200 bg-rose-50 text-rose-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    info: "border-blue-100 bg-blue-50 text-blue-600"
  };

  return (
    <BusinessAdminShell active="ບັນທຶກກວດສອບ">
      <PageHeader
        title="ບັນທຶກກວດສອບ"
        description="Review important business account activity and staff actions."
        actions={
          <button type="button" className="flex h-10 items-center gap-2 rounded-md border border-blue-100 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-blue-50">
            <ChartNoAxesCombined className="h-4 w-4" />
            Export Logs
          </button>
        }
      />
      <div className="grid gap-4 mb-5 grid-cols-2 md:grid-cols-4">
        {[
          { label: "ລາຍການທັງໝົດ", value: "248", color: "bg-blue-50 text-blue-600" },
          { label: "ດ່ວນ / ສ່ຽງ", value: "3", color: "bg-rose-50 text-rose-600" },
          { label: "ປ່ຽນລາຄາ", value: "12", color: "bg-amber-50 text-amber-600" },
          { label: "Login Events", value: "86", color: "bg-emerald-50 text-emerald-600" }
        ].map((s) => (
          <div key={s.label} className={`flex flex-col items-center justify-center gap-1 rounded-lg p-5 ${s.color}`}>
            <span className="text-2xl font-black">{s.value}</span>
            <span className="text-[11px] font-bold text-center">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-blue-100 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between border-b border-blue-50 px-4 py-3">
          <h2 className="text-[15px] font-black text-slate-950">Activity Timeline</h2>
          <div className="flex gap-2">
            {["ທຸກສະຖານະ", "18 ພຶດສະພາ 2025", "ທຸກ User"].map((f) => (
              <button key={f} type="button" className="h-8 rounded-md border border-blue-100 bg-white px-3 text-[11px] font-black text-slate-600 hover:bg-blue-50">
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-blue-50">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-4 px-4 py-3 transition hover:bg-blue-50/30">
              <div className="flex-shrink-0 pt-0.5 text-[11px] font-bold text-slate-400 w-[70px]">{log.time}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-slate-950">{log.user}</span>
                  <span className={`rounded border px-2 py-0.5 text-[10px] font-black ${typeStyle[log.type]}`}>{log.action}</span>
                </div>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">{log.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-blue-50 px-4 py-3">
          <p className="text-[13px] font-semibold text-slate-600">ສະແດງ 7 ຈາກ 248 ລາຍການ</p>
          <button type="button" className="text-xs font-black text-blue-600 hover:underline">View All Logs →</button>
        </div>
      </div>
    </BusinessAdminShell>
  );
}

