import {
  AlertTriangle,
  ChartNoAxesCombined,
  CircleDollarSign,
  ReceiptText,
  RotateCcw,
  Tags
} from "lucide-react";

import {
  Badge,
  Card,
  ItemIdentity,
  KpiGrid,
  PageHeader,
  QuickActionsCard,
  RightRail,
  SelectButton,
} from "../components/business-admin-primitives";
import {
  dashboardKpis,
  defaultQuickActions,
  itemImages,
  items,
  toneClasses
} from "../data/mock-business-admin";
import { BusinessAdminShell } from "../layouts/business-admin-shell";

type Order = {
  id: string;
  customer: string;
  type: string;
  amount: string;
  status: string;
  time: string;
};

const recentOrders: Order[] = [
  {
    id: "#ORD-05018",
    customer: "Souksavanh Ph.",
    type: "Dine In",
    amount: "LAK 135,000",
    status: "Completed",
    time: "10:24 AM"
  },
  {
    id: "#ORD-05017",
    customer: "Vientiane Co., Ltd.",
    type: "Take Away",
    amount: "LAK 85,000",
    status: "Completed",
    time: "10:15 AM"
  },
  {
    id: "#ORD-05016",
    customer: "Khamla Vongsa",
    type: "Dine In",
    amount: "LAK 62,000",
    status: "Completed",
    time: "10:02 AM"
  },
  {
    id: "#ORD-05015",
    customer: "Sisouphone K.",
    type: "Take Away",
    amount: "LAK 45,000",
    status: "Completed",
    time: "9:48 AM"
  },
  {
    id: "#ORD-05014",
    customer: "Phetsamone L.",
    type: "Delivery",
    amount: "LAK 120,000",
    status: "Preparing",
    time: "9:31 AM"
  }
];

export function BusinessDashboardPage() {
  return (
    <BusinessAdminShell active="Dashboard">
      <PageHeader
        title="Business Dashboard"
        description="Overview of your business performance and operations."
        actions={<SelectButton>May 12 - May 18, 2025</SelectButton>}
      />
      <KpiGrid kpis={dashboardKpis} />
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="grid gap-4 2xl:grid-cols-[0.95fr_1.05fr]">
            <SalesOverview />
            <RecentOrdersCard />
          </div>
          <div className="grid gap-4 2xl:grid-cols-3">
            <TopSellingItems />
            <InventoryAlerts />
            <BranchPerformance />
          </div>
        </div>
        <RightRail>
          <BusinessGlanceCard />
          <QuickActionsCard
            title="Help & Support"
            actions={[
              {
                label: "Visit Help Center",
                description: "Guides, tutorials, and articles",
                icon: ReceiptText,
                tone: "blue"
              },
              {
                label: "Contact Support",
                description: "Get help from our team",
                icon: AlertTriangle,
                tone: "violet"
              },
              {
                label: "What's New",
                description: "See latest features and updates",
                icon: ChartNoAxesCombined,
                tone: "emerald"
              }
            ]}
          />
        </RightRail>
      </div>
      <div className="mt-4">
        <DashboardQuickActions />
      </div>
    </BusinessAdminShell>
  );
}

function RecentOrdersCard() {
  return (
    <Card
      title="Recent Orders"
      action={
        <a href="/business-admin/orders" className="text-xs font-black text-blue-600">
          View all orders
        </a>
      }
    >
      <table className="w-full border-collapse text-left text-[11px]">
        <thead>
          <tr>
            {["Order #", "Customer", "Type", "Amount", "Status", "Time"].map((head) => (
              <th
                key={head}
                className="border-b border-blue-100 px-2 py-2.5 text-[10px] font-black text-slate-500"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recentOrders.map((order) => (
            <tr key={order.id} className="border-b border-blue-50 last:border-b-0">
              <td className="px-2 py-2.5 font-black text-blue-600">{order.id}</td>
              <td className="px-2 py-2.5 font-bold text-slate-800">{order.customer}</td>
              <td className="px-2 py-2.5 font-bold text-slate-800">{order.type}</td>
              <td className="px-2 py-2.5 font-bold text-slate-800">{order.amount}</td>
              <td className="px-2 py-2.5">
                <Badge tone={order.status === "Preparing" ? "amber" : "emerald"}>
                  {order.status}
                </Badge>
              </td>
              <td className="px-2 py-2.5 font-bold text-slate-800">{order.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function DashboardQuickActions() {
  return (
    <Card title="Quick Actions">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 p-4">
        {defaultQuickActions.map((action) => {
          const Icon = action.icon;
          const tone = toneClasses[action.tone];

          return (
            <a
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 rounded-lg border border-blue-100 bg-white p-3 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/70 hover:shadow-sm"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone.soft} ${tone.text}`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-black text-slate-950">
                  {action.label}
                </span>
                <span className="mt-0.5 block truncate text-xs font-semibold text-slate-500">
                  {action.description}
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </Card>
  );
}

function SalesOverview() {
  return (
    <Card title="Sales Overview" action={<SelectButton>This Week</SelectButton>}>
      <div className="h-[270px] p-4">
        <div className="relative h-full overflow-hidden rounded-lg bg-gradient-to-b from-white to-blue-50/60">
          <div className="absolute inset-x-4 top-4 bottom-9 grid grid-rows-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="border-t border-dashed border-blue-100" />
            ))}
          </div>
          <div className="absolute inset-x-8 bottom-9 flex h-[190px] items-end justify-between gap-3">
            {[118, 152, 92, 124, 144, 158, 188].map((height, index) => (
              <div key={index} className="flex flex-1 items-end justify-center">
                <div
                  className="w-full max-w-[38px] rounded-t-lg bg-blue-200/80"
                  style={{ height }}
                />
              </div>
            ))}
          </div>
          <svg className="absolute inset-x-8 bottom-9 h-[190px] w-[calc(100%-4rem)] overflow-visible">
            <polyline
              fill="none"
              points="0,130 86,88 172,116 258,104 344,98 430,82 516,48"
              stroke="#2563eb"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[0, 86, 172, 258, 344, 430, 516].map((x, index) => (
              <circle
                key={x}
                cx={x}
                cy={[130, 88, 116, 104, 98, 82, 48][index]}
                r="5"
                fill="#2563eb"
              />
            ))}
          </svg>
          <div className="absolute inset-x-8 bottom-2 flex justify-between text-[11px] font-bold text-slate-500">
            {["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"].map(
              (day) => (
                <span key={day}>{day}</span>
              )
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

const businessGlanceRows: {
  label: string;
  value: string;
  tone: keyof typeof toneClasses;
  icon: typeof ReceiptText;
}[] = [
  { label: "Taxes Collected", value: "LAK 3,985,000", tone: "emerald", icon: ReceiptText },
  { label: "Discounts Given", value: "LAK 1,125,000", tone: "amber", icon: Tags },
  { label: "Refunds", value: "LAK 320,000", tone: "red", icon: RotateCcw },
  { label: "Net Sales", value: "LAK 51,310,000", tone: "blue", icon: CircleDollarSign }
];

function BusinessGlanceCard() {
  return (
    <Card title="Business at a Glance">
      <div className="space-y-3 p-4">
        <div className="rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4">
          <p className="text-xs font-bold text-slate-600">Gross Sales (This Week)</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <div>
              <p className="text-xl font-black text-slate-950">LAK 56,420,000</p>
              <p className="mt-1 text-xs font-black text-emerald-600">
                + 16.2% vs last week
              </p>
            </div>
            <svg className="h-10 w-24" viewBox="0 0 96 40" aria-hidden="true">
              <polyline
                fill="none"
                points="0,30 18,25 34,18 51,23 68,10 84,15 96,6"
                stroke="#2563eb"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
        {businessGlanceRows.map(({ label, value, tone, icon: MetricIcon }) => {
          const toneClass = toneClasses[tone];

          return (
            <div key={label} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-md ${toneClass.soft} ${toneClass.text}`}
                >
                  <MetricIcon className="h-4 w-4" />
                </span>
                <span className="text-xs font-bold text-slate-600">{label}</span>
              </div>
              <span className={`text-right text-xs font-black ${toneClass.text}`}>
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function TopSellingItems() {
  return (
    <Card title="Top Selling Items">
      <div className="p-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[11px] font-black text-slate-500">
              <th className="pb-2">Item</th>
              <th className="pb-2 text-right">Sold</th>
              <th className="pb-2 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {items.slice(0, 5).map((item, index) => (
              <tr key={item[0]} className="border-t border-blue-50">
                <td className="py-2">
                  <ItemIdentity title={item[0]} image={item[8]} size="sm" />
                </td>
                <td className="py-2 text-right font-black text-slate-700">
                  {[512, 438, 367, 289, 245][index]}
                </td>
                <td className="py-2 text-right font-black text-slate-700">
                  {
                    [
                      "LAK 8,960,000",
                      "LAK 6,570,000",
                      "LAK 4,585,000",
                      "LAK 2,890,000",
                      "LAK 2,450,000"
                    ][index]
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function InventoryAlerts() {
  return (
    <Card title="Inventory Alerts">
      <div className="p-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[11px] font-black text-slate-500">
              <th className="pb-2">Item</th>
              <th className="pb-2 text-center">Current Stock</th>
              <th className="pb-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Fresh Milk 1L", "3", "Critical"],
              ["Croissant", "6", "Low"],
              ["Brown Sugar Syrup", "2", "Critical"],
              ["Coffee Beans", "4", "Low"],
              ["Paper Cup 12oz", "18", "Low"]
            ].map((row, index) => (
              <tr key={row[0]} className="border-t border-blue-50">
                <td className="py-2">
                  <ItemIdentity title={row[0]} image={itemImages[index]} size="sm" />
                </td>
                <td className="py-2 text-center font-black">{row[1]}</td>
                <td className="py-2 text-right">
                  <Badge tone={row[2] === "Critical" ? "red" : "amber"}>
                    {row[2]}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function BranchPerformance() {
  return (
    <Card title="Branch Performance">
      <div className="p-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[11px] font-black text-slate-500">
              <th className="pb-2">Branch</th>
              <th className="pb-2 text-right">Sales (This Week)</th>
              <th className="pb-2 text-right">vs Last Week</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Main Branch", "LAK 56,420,000", "+16.2%"],
              ["Sihom Branch", "LAK 18,750,000", "+11.4%"],
              ["Tha Dong Branch", "LAK 12,980,000", "-4.3%"],
              ["Pak Ngum Branch", "LAK 9,240,000", "+3.7%"]
            ].map((row) => (
              <tr key={row[0]} className="border-t border-blue-50">
                <td className="py-3 font-black text-slate-950">{row[0]}</td>
                <td className="py-3 text-right font-bold text-slate-700">{row[1]}</td>
                <td
                  className={`py-3 text-right font-black ${
                    row[2].startsWith("-") ? "text-red-500" : "text-emerald-600"
                  }`}
                >
                  {row[2]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
