import {
  BadgePercent,
  Boxes,
  Building2,
  Download,
  Filter,
  Gift,
  Package,
  PackagePlus,
  Plus,
  Upload,
  UserPlus,
  Users,
  Warehouse
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
  ActionButtons,
  Badge,
  Button,
  Card,
  CreateButton,
  DataTable,
  ExportButton,
  FilterBar,
  ItemIdentity,
  KpiGrid,
  PageHeader,
  QuickActionsCard,
  RightRail,
  SummaryCard
} from "../components/business-admin-primitives";
import {
  branches,
  customers,
  items,
  pageKpis,
  promotions,
  purchaseReceipts,
  staff,
  stockMovements,
  suppliers
} from "../data/mock-business-admin";
import { BusinessAdminShell } from "../layouts/business-admin-shell";
import type { BusinessMenuKey, Kpi, TableColumn } from "../types";

type Row = string[];

export function ItemsListPage() {
  return (
    <ListShell
      active="Items"
      title="Items"
      description="Manage your products, menu items, and services."
      kpis={pageKpis.items}
      search="Search items by name, SKU, or barcode..."
      filters={["All Categories", "All Statuses", "All Branches"]}
      primaryAction={
        <CreateButton href="/business-admin/items/create" label="Add Item" />
      }
      actionPlacement="filter"
      secondaryAction={
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-blue-100 bg-white text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
          aria-label="Import items"
          title="Import items"
        >
          <Upload className="h-4 w-4" />
        </button>
      }
      rows={items}
      columns={itemColumns}
      right={<ItemsRightRail />}
      footerLabel="Showing 1 to 8 of 342 items"
    />
  );
}

const itemColumns: TableColumn<Row>[] = [
  {
    key: "item",
    label: "Item",
    render: (row) => <ItemIdentity title={row[0]} subtitle={row[1]} image={row[8]} />
  },
  {
    key: "sku",
    label: "SKU / Barcode",
    render: (row) => (
      <span>
        {row[2]}
        <br />
        <span className="text-xs text-slate-500">
          885000{row[2].replace(/\D/g, "")}
        </span>
      </span>
    )
  },
  {
    key: "category",
    label: "Category",
    render: (row) => <Badge tone={categoryTone(row[3])}>{row[3]}</Badge>
  },
  { key: "price", label: "Unit Price", render: (row) => row[4] },
  {
    key: "stock",
    label: "Stock",
    render: (row) => (
      <span>
        {row[5]}
        <span
          className={`block text-xs ${Number(row[5]) < 10 ? "text-red-500" : Number(row[5]) < 20 ? "text-amber-600" : "text-emerald-600"}`}
        >
          {Number(row[5]) === 0
            ? "Out of Stock"
            : Number(row[5]) < 20
              ? "Low Stock"
              : "In Stock"}
        </span>
      </span>
    )
  },
  { key: "status", label: "Status", render: (row) => <Badge>{row[6]}</Badge> },
  { key: "branch", label: "Branch", render: (row) => row[7] },
  {
    key: "actions",
    label: "Actions",
    align: "right",
    render: () => <ActionButtons editHref="/business-admin/items/create" />
  }
];

export function CustomersListPage() {
  return (
    <ListShell
      active="Customers"
      title="Customers"
      description="Manage your customers and members."
      kpis={pageKpis.customers}
      search="Search customers by name, phone, email or code..."
      filters={["All Status", "All Member Levels", "All Branches"]}
      primaryAction={
        <CreateButton href="/business-admin/customers/new" label="Add Customer" />
      }
      secondaryAction={
        <Button icon={Upload} variant="secondary">
          Import
        </Button>
      }
      rows={customers}
      columns={customerColumns}
      right={<CustomersRightRail />}
      footerLabel="Showing 1 to 8 of 1,248 customers"
    />
  );
}

const customerColumns: TableColumn<Row>[] = [
  { key: "index", label: "#", render: (_, index) => index + 1 },
  {
    key: "customer",
    label: "Customer",
    render: (row) => <ItemIdentity title={row[0]} subtitle={row[1]} />
  },
  { key: "phone", label: "Phone", render: (row) => row[2] },
  {
    key: "level",
    label: "Member Level",
    render: (row) => <Badge tone={levelTone(row[3])}>{row[3]}</Badge>
  },
  { key: "points", label: "Points", render: (row) => row[4] },
  { key: "spend", label: "Total Spend", render: (row) => row[5] },
  { key: "orders", label: "Orders", render: (row) => row[6] },
  {
    key: "lastOrder",
    label: "Last Order",
    render: (_, index) => `May ${12 - index}, 2025`
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Badge tone={row[7] === "Inactive" ? "slate" : "emerald"}>{row[7]}</Badge>
    )
  },
  {
    key: "actions",
    label: "Actions",
    align: "right",
    render: (_, index) => (
      <ActionButtons viewHref={`/business-admin/customers/${index + 1}`} />
    )
  }
];

export function PromotionsListPage() {
  return (
    <ListShell
      active="Promotions"
      title="Promotions"
      description="Create, manage, and track your promotional campaigns."
      kpis={pageKpis.promotions}
      search="Search by promotion name, code..."
      filters={[
        "All Types",
        "All Statuses",
        "May 12 - May 18, 2025",
        "All Branches",
        "All Audiences"
      ]}
      primaryAction={
        <CreateButton
          href="/business-admin/promotions/create"
          label="Create Promotion"
        />
      }
      actionPlacement="none"
      filterActions={
        <>
          <Button variant="secondary">Reset</Button>
          <Button icon={Filter} variant="primary">
            Filter
          </Button>
        </>
      }
      rows={promotions}
      columns={promotionColumns}
      right={<PromotionsRightRail />}
      footerLabel="Showing 1 to 8 of 25 promotions"
    />
  );
}

const promotionColumns: TableColumn<Row>[] = [
  {
    key: "name",
    label: "Promotion Name",
    render: (row) => <ItemIdentity title={row[0]} />
  },
  {
    key: "type",
    label: "Type",
    render: (row) => <Badge tone={categoryTone(row[1])}>{row[1]}</Badge>
  },
  { key: "target", label: "Target", render: (row) => row[2] },
  { key: "discount", label: "Discount", render: (row) => row[3] },
  { key: "range", label: "Date Range", render: (row) => row[4] },
  { key: "usage", label: "Usage", render: (row) => row[5] },
  {
    key: "status",
    label: "Status",
    render: (row) => <Badge tone={statusTone(row[6])}>{row[6]}</Badge>
  },
  { key: "branch", label: "Branch", render: (row) => row[7] },
  {
    key: "updated",
    label: "Updated At",
    render: (_, index) => `May ${16 - index}, 2025`
  },
  { key: "actions", label: "Actions", align: "right", render: () => <ActionButtons /> }
];

export function BranchesListPage() {
  return (
    <ListShell
      active="Branches"
      title="Branches"
      description="Manage business branches, opening hours, and branch staff."
      kpis={pageKpis.branches}
      search="Search branches by name, city, or manager..."
      filters={["All Cities", "All Statuses", "All Branch Types"]}
      primaryAction={
        <CreateButton href="/business-admin/branches/create" label="Add Branch" />
      }
      rows={branches}
      columns={branchColumns}
      right={<GenericRightRail title="Branch Overview" icon={Building2} />}
      footerLabel="Showing 1 to 4 of 4 branches"
    />
  );
}

const branchColumns: TableColumn<Row>[] = [
  {
    key: "branch",
    label: "Branch",
    render: (row) => <ItemIdentity title={row[0]} subtitle={row[1]} />
  },
  { key: "address", label: "Address", render: (row) => row[2] },
  { key: "phone", label: "Phone", render: (row) => row[3] },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Badge tone={row[4] === "Closed" ? "slate" : "emerald"}>{row[4]}</Badge>
    )
  },
  { key: "sales", label: "Weekly Sales", render: (row) => row[5] },
  { key: "staff", label: "Staff", render: (row) => row[6] },
  {
    key: "actions",
    label: "Actions",
    align: "right",
    render: () => <ActionButtons editHref="/business-admin/branches/create" />
  }
];

export function SuppliersListPage() {
  return (
    <ListShell
      active="Suppliers"
      title="Suppliers"
      description="Manage vendors, supplier contacts, balances, and purchase history."
      kpis={pageKpis.suppliers}
      search="Search suppliers by name, phone, or category..."
      filters={["All Categories", "All Statuses", "All Branches"]}
      primaryAction={
        <CreateButton href="/business-admin/suppliers/create" label="Add Supplier" />
      }
      rows={suppliers}
      columns={supplierColumns}
      right={<GenericRightRail title="Supplier Overview" icon={Building2} />}
      footerLabel="Showing 1 to 5 of 48 suppliers"
    />
  );
}

const supplierColumns: TableColumn<Row>[] = [
  {
    key: "supplier",
    label: "Supplier",
    render: (row) => <ItemIdentity title={row[0]} subtitle={row[1]} />
  },
  { key: "phone", label: "Phone", render: (row) => row[2] },
  { key: "balance", label: "Open Balance", render: (row) => row[3] },
  {
    key: "status",
    label: "Status",
    render: (row) => <Badge tone={statusTone(row[4])}>{row[4]}</Badge>
  },
  { key: "last", label: "Last Delivery", render: (row) => row[5] },
  {
    key: "actions",
    label: "Actions",
    align: "right",
    render: () => <ActionButtons editHref="/business-admin/suppliers/create" />
  }
];

export function StaffListPage() {
  return (
    <ListShell
      active="Staff"
      title="Staff"
      description="Manage employees, roles, shifts, and access permissions."
      kpis={pageKpis.staff}
      search="Search staff by name, role, or branch..."
      filters={["All Roles", "All Branches", "All Statuses"]}
      primaryAction={
        <CreateButton href="/business-admin/staff/new" label="Add Staff" />
      }
      rows={staff}
      columns={staffColumns}
      right={<GenericRightRail title="Staff Overview" icon={Users} />}
      footerLabel="Showing 1 to 5 of 42 staff"
    />
  );
}

const staffColumns: TableColumn<Row>[] = [
  {
    key: "staff",
    label: "Staff",
    render: (row) => <ItemIdentity title={row[0]} subtitle={row[1]} />
  },
  { key: "branch", label: "Branch", render: (row) => row[2] },
  {
    key: "access",
    label: "Access",
    render: (row) => (
      <Badge tone={row[3] === "Full Access" ? "blue" : "slate"}>{row[3]}</Badge>
    )
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Badge tone={row[4] === "Offline" ? "slate" : "emerald"}>{row[4]}</Badge>
    )
  },
  { key: "last", label: "Last Active", render: (row) => row[5] },
  {
    key: "actions",
    label: "Actions",
    align: "right",
    render: (_, index) => (
      <ActionButtons viewHref={`/business-admin/staff/${index + 1}`} />
    )
  }
];

export function StockMovementsPage() {
  return (
    <ListShell
      active="Stock Movements"
      title="Stock Movements"
      description="Track stock in, stock out, transfers, and adjustments."
      kpis={pageKpis.stock}
      search="Search movements by item, reference, or note..."
      filters={["All Movement Types", "All Branches", "All Statuses"]}
      primaryAction={<CreateButton href="/business-admin/stock-in" label="Stock In" />}
      rows={stockMovements}
      columns={stockColumns}
      right={<GenericRightRail title="Stock Health" icon={Warehouse} />}
      footerLabel="Showing 1 to 5 of 326 movements"
    />
  );
}

const stockColumns: TableColumn<Row>[] = [
  {
    key: "ref",
    label: "Reference",
    render: (row) => <span className="text-blue-600">{row[0]}</span>
  },
  { key: "item", label: "Item", render: (row) => row[1] },
  {
    key: "type",
    label: "Type",
    render: (row) => <Badge tone={categoryTone(row[2])}>{row[2]}</Badge>
  },
  { key: "qty", label: "Qty", render: (row) => row[3] },
  { key: "branch", label: "Branch", render: (row) => row[4] },
  { key: "note", label: "Note", render: (row) => row[5] },
  { key: "date", label: "Date", render: (row) => row[6] },
  { key: "actions", label: "Actions", align: "right", render: () => <ActionButtons /> }
];

export function PurchaseReceiptsPage() {
  return (
    <ListShell
      active="Suppliers"
      title="Purchase Receipts"
      description="Review received supplier orders, costs, and inventory updates."
      kpis={pageKpis.suppliers}
      search="Search purchase receipt number, supplier, or item..."
      filters={["All Suppliers", "All Statuses", "All Branches"]}
      primaryAction={
        <CreateButton
          href="/business-admin/purchase-receipts/new"
          label="Create Receipt"
        />
      }
      rows={purchaseReceipts}
      columns={purchaseColumns}
      right={<GenericRightRail title="Purchasing Summary" icon={Download} />}
      footerLabel="Showing 1 to 4 of 64 purchase receipts"
    />
  );
}

const purchaseColumns: TableColumn<Row>[] = [
  {
    key: "ref",
    label: "Receipt #",
    render: (row, index) => (
      <a
        className="text-blue-600"
        href={`/business-admin/purchase-receipts/${index + 1}`}
      >
        {row[0]}
      </a>
    )
  },
  { key: "supplier", label: "Supplier", render: (row) => row[1] },
  { key: "amount", label: "Amount", render: (row) => row[2] },
  { key: "items", label: "Items", render: (row) => row[3] },
  {
    key: "status",
    label: "Status",
    render: (row) => <Badge tone={statusTone(row[4])}>{row[4]}</Badge>
  },
  { key: "date", label: "Date", render: (row) => row[5] },
  { key: "actions", label: "Actions", align: "right", render: () => <ActionButtons /> }
];

export function CategoriesListPage() {
  return (
    <ListShell
      active="Categories"
      title="Categories"
      description="Organize menu items and retail products into clear groups."
      kpis={pageKpis.items}
      search="Search categories..."
      filters={["All Departments", "All Statuses", "All Branches"]}
      primaryAction={
        <CreateButton href="/business-admin/categories/create" label="Add Category" />
      }
      rows={[
        ["Coffee", "82 items", "Active", "All Branches"],
        ["Food", "96 items", "Active", "All Branches"],
        ["Drinks", "76 items", "Active", "All Branches"],
        ["Bakery", "48 items", "Active", "All Branches"],
        ["Merchandise", "28 items", "Active", "Main Branch"]
      ]}
      columns={[
        {
          key: "name",
          label: "Category",
          render: (row) => <ItemIdentity title={row[0]} />
        },
        { key: "count", label: "Items", render: (row) => row[1] },
        { key: "status", label: "Status", render: (row) => <Badge>{row[2]}</Badge> },
        { key: "branch", label: "Branch", render: (row) => row[3] },
        {
          key: "actions",
          label: "Actions",
          align: "right",
          render: () => <ActionButtons />
        }
      ]}
      right={<GenericRightRail title="Category Overview" icon={Boxes} />}
      footerLabel="Showing 1 to 5 of 12 categories"
    />
  );
}

export function InventoryOverviewPage() {
  return (
    <ListShell
      active="Inventory"
      title="Inventory Overview"
      description="Monitor stock value, low stock alerts, and inventory movements."
      kpis={pageKpis.stock}
      search="Search inventory by item or SKU..."
      filters={["All Categories", "All Branches", "Stock Status"]}
      primaryAction={
        <CreateButton href="/business-admin/stock-adjustment" label="Adjust Stock" />
      }
      rows={items}
      columns={itemColumns}
      right={<GenericRightRail title="Inventory Alerts" icon={Warehouse} />}
      footerLabel="Showing 1 to 8 of 342 inventory items"
    />
  );
}

function ListShell<T>({
  active,
  title,
  description,
  kpis,
  search,
  filters,
  primaryAction,
  secondaryAction,
  actionPlacement = "header",
  filterActions,
  rows,
  columns,
  right,
  footerLabel
}: {
  active: BusinessMenuKey;
  title: string;
  description: string;
  kpis: Kpi[];
  search: string;
  filters: string[];
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  actionPlacement?: "header" | "filter" | "none";
  filterActions?: ReactNode;
  rows: T[];
  columns: TableColumn<T>[];
  right: ReactNode;
  footerLabel: string;
}) {
  return (
    <BusinessAdminShell active={active}>
      <PageHeader
        title={title}
        description={description}
        actions={
          actionPlacement === "header" ? (
            <>
              {secondaryAction}
              {primaryAction}
            </>
          ) : null
        }
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <KpiGrid kpis={kpis} />
          <FilterBar
            searchPlaceholder={search}
            filters={filters}
            showFilterButton={actionPlacement === "header"}
            actions={
              actionPlacement === "filter" ? (
                <>
                  {primaryAction}
                  {secondaryAction ?? <ExportButton />}
                </>
              ) : (
                filterActions
              )
            }
          />
          <DataTable
            columns={columns}
            rows={rows}
            footer={<TablePaginationLabel label={footerLabel} />}
          />
        </div>
        {right}
      </div>
    </BusinessAdminShell>
  );
}

function ItemsRightRail() {
  return (
    <RightRail>
      <CategoryDonut />
      <ItemsTopSellingCard />
      <QuickActionsCard
        actions={[
          {
            label: "Add New Item",
            description: "Create product or service",
            icon: Plus,
            href: "/business-admin/items/create",
            tone: "blue"
          },
          {
            label: "Import Items",
            description: "Import from CSV or Excel",
            icon: Upload,
            tone: "emerald"
          },
          {
            label: "Bulk Update",
            description: "Update prices, stock, or status",
            icon: PackagePlus,
            tone: "amber"
          },
          {
            label: "Export Items",
            description: "Export items to CSV or Excel",
            icon: Download,
            tone: "blue"
          }
        ]}
      />
    </RightRail>
  );
}

function ItemsTopSellingCard() {
  return (
    <Card
      title="Top Selling Items"
      action={<span className="text-xs font-black text-blue-600">View All</span>}
    >
      <div className="space-y-3 p-4">
        {[
          ["Iced Latte", "K 375,000", "1,250 sold", items[0][8]],
          ["Hot Cappuccino", "K 286,000", "1,030 sold", items[1][8]],
          ["Larb Chicken", "K 240,000", "890 sold", items[4][8]],
          ["Butter Croissant", "K 198,000", "780 sold", items[2][8]],
          ["Ham & Cheese Sandwich", "K 185,000", "640 sold", items[3][8]]
        ].map((item) => (
          <div key={item[0]} className="flex items-center justify-between gap-3">
            <ItemIdentity title={item[0]} subtitle={item[1]} image={item[3]} size="sm" />
            <span className="text-right text-xs font-bold text-slate-600">
              {item[2]}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function CustomersRightRail() {
  return (
    <RightRail>
      <CustomerOverviewChart />
      <TopCustomersCard />
      <QuickActionsCard
        actions={[
          {
            label: "Add New Customer",
            description: "Create a new customer",
            icon: UserPlus,
            tone: "blue"
          },
          {
            label: "Import Customers",
            description: "Import from CSV or Excel",
            icon: Upload,
            tone: "amber"
          },
          {
            label: "Customer Groups",
            description: "Manage customer groups",
            icon: Users,
            tone: "red"
          },
          {
            label: "Send Promotion",
            description: "Send SMS or Email campaign",
            icon: BadgePercent,
            tone: "violet"
          }
        ]}
      />
    </RightRail>
  );
}

function TopCustomersCard() {
  return (
    <Card
      title="Top Customers by Spend"
      action={<span className="text-xs font-black text-blue-600">View All</span>}
    >
      <div className="space-y-3 p-4">
        {[
          ["Khamla Philavong", "K 12,680,000"],
          ["Phonexay Silavong", "K 8,450,000"],
          ["Manivanh Phothisane", "K 7,430,000"],
          ["Dala Keomany", "K 6,780,000"],
          ["Bounleuth Luangxay", "K 5,120,000"]
        ].map((item, index) => (
          <div key={item[0]} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-3">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black ${
                  index === 0
                    ? "bg-emerald-100 text-emerald-600"
                    : index === 1
                      ? "bg-slate-200 text-slate-600"
                      : index === 2
                        ? "bg-amber-100 text-amber-600"
                        : "bg-blue-50 text-blue-600"
                }`}
              >
                {index + 1}
              </span>
              <span className="text-xs font-black text-slate-950">{item[0]}</span>
            </span>
            <span className="text-xs font-black text-slate-700">{item[1]}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function CustomerOverviewChart() {
  return (
    <Card title="Customer Overview">
      <div className="grid grid-cols-[120px_1fr] items-center gap-4 p-4">
        <div className="relative h-28 w-28 rounded-full bg-[conic-gradient(#22c55e_0_67%,#94a3b8_67%_86%,#3b82f6_86%_89%,#f97316_89%_100%)] p-7">
          <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white text-center">
            <span className="text-lg font-black text-slate-950">1,248</span>
            <span className="text-[10px] font-bold text-slate-500">Total</span>
          </div>
        </div>
        <div className="space-y-3 text-xs font-bold text-slate-600">
          {[
            ["Active", "842 (67.6%)", "bg-emerald-500"],
            ["Inactive", "248 (19.9%)", "bg-slate-400"],
            ["New This Month", "36 (2.9%)", "bg-blue-500"],
            ["VIP Gold", "258 (20.7%)", "bg-orange-500"]
          ].map((item) => (
            <p key={item[0]} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${item[2]}`} />
                {item[0]}
              </span>
              <span>{item[1]}</span>
            </p>
          ))}
        </div>
      </div>
    </Card>
  );
}

function PromotionsRightRail() {
  return (
    <RightRail>
      <PromotionPerformanceChart />
      <Card
        title="Upcoming Promotions"
        action={<span className="text-xs font-black text-blue-600">View all</span>}
      >
        <div className="space-y-3 p-4">
          {[
            ["Iced Latte Day", "May 20, 2025 - All Day", "In 2 days"],
            ["VIP Members Double Points", "May 18 - May 25, 2025", "In 1 day"],
            ["Pay Day Special", "May 25, 2025 - All Day", "In 7 days"]
          ].map((item) => (
            <div key={item[0]} className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black text-slate-950">{item[0]}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                  {item[1]}
                </p>
              </div>
              <Badge tone="blue">{item[2]}</Badge>
            </div>
          ))}
        </div>
      </Card>
      <QuickActionsCard
        actions={[
          { label: "Create Promotion", icon: BadgePercent, tone: "emerald" },
          { label: "Create Coupon", icon: Gift, tone: "blue" },
          { label: "Bulk Disable", icon: Package, tone: "amber" },
          { label: "Export Promotions", icon: Download, tone: "violet" }
        ]}
      />
      <Card title="Tips">
        <div className="p-4 text-sm leading-6 font-semibold text-slate-600">
          Use promotions during peak hours to drive more sales and customer engagement.
        </div>
      </Card>
    </RightRail>
  );
}

function PromotionPerformanceChart() {
  return (
    <Card
      title="Promotion Performance"
      action={
        <button
          type="button"
          className="h-8 rounded-md border border-blue-100 bg-white px-3 text-xs font-black whitespace-nowrap text-slate-700 hover:bg-blue-50"
        >
          This Month
        </button>
      }
    >
      <div className="grid grid-cols-[120px_1fr] items-center gap-4 p-4">
        <div className="h-28 w-28 rounded-full bg-[conic-gradient(#22c55e_0_35%,#3b82f6_35%_60%,#8b5cf6_60%_75%,#f97316_75%_88%,#94a3b8_88%_100%)] p-7">
          <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white text-center">
            <span className="text-lg font-black text-slate-950">2,458</span>
            <span className="text-[10px] font-bold text-slate-500">Redemptions</span>
          </div>
        </div>
        <div className="space-y-3 text-xs font-bold text-slate-600">
          {[
            ["Time-based", "35.2%", "bg-emerald-500"],
            ["Percentage", "24.7%", "bg-blue-500"],
            ["BOGO", "15.3%", "bg-violet-500"],
            ["Fixed Amount", "13.1%", "bg-orange-500"],
            ["Others", "11.7%", "bg-slate-400"]
          ].map((item) => (
            <p key={item[0]} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${item[2]}`} />
                {item[0]}
              </span>
              <span>{item[1]}</span>
            </p>
          ))}
        </div>
      </div>
    </Card>
  );
}

function GenericRightRail({ title, icon: Icon }: { title: string; icon: LucideIcon }) {
  return (
    <RightRail>
      <SummaryCard
        title={title}
        items={[
          { label: "Main Branch", value: "Healthy", tone: "emerald" },
          { label: "Sihom Branch", value: "Needs review", tone: "amber" },
          { label: "Pakse Branch", value: "Stable", tone: "blue" },
          { label: "Last Sync", value: "10:24 AM", tone: "slate" }
        ]}
      />
      <QuickActionsCard
        actions={[
          {
            label: "Create New",
            description: "Add a new record",
            icon: Icon,
            tone: "blue"
          },
          {
            label: "Import Data",
            description: "Upload CSV or Excel",
            icon: Upload,
            tone: "emerald"
          },
          {
            label: "Export List",
            description: "Download current data",
            icon: Download,
            tone: "violet"
          },
          {
            label: "View Report",
            description: "Open analytics",
            icon: Warehouse,
            tone: "amber"
          }
        ]}
      />
    </RightRail>
  );
}

export function PaginationLabel({ label }: { label: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-50 px-4 py-3">
      <p className="text-[13px] font-semibold text-slate-600">{label}</p>
      <div className="flex flex-wrap items-center gap-2">
        {["‹", "1", "2", "3", "›"].map((item) => (
          <button
            key={item}
            type="button"
            className={`h-8 min-w-8 rounded-md border text-sm font-extrabold ${
              item === "1"
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-blue-100 bg-white text-slate-700 hover:bg-blue-50"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function TablePaginationLabel({ label }: { label: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-50 px-4 py-3">
      <p className="text-[13px] font-semibold text-slate-600">{label}</p>
      <div className="flex flex-wrap items-center gap-2">
        {["<", "1", "2", "3", "...", "43", ">"].map((item, index) => (
          <button
            key={`${item}-${index}`}
            type="button"
            className={`h-8 min-w-8 rounded-md border text-sm font-extrabold ${
              item === "1"
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-blue-100 bg-white text-slate-700 hover:bg-blue-50"
            }`}
          >
            {item}
          </button>
        ))}
        <button
          type="button"
          className="flex h-8 min-w-[92px] items-center justify-between gap-2 rounded-md border border-blue-100 bg-white px-3 text-[12px] font-extrabold text-slate-700 transition hover:bg-blue-50"
        >
          10 / page
          <span className="text-slate-400">v</span>
        </button>
      </div>
    </div>
  );
}

function CategoryDonut() {
  return (
    <Card title="Categories Overview">
      <div className="grid grid-cols-[120px_1fr] items-center gap-4 p-4">
        <div className="h-28 w-28 rounded-full bg-[conic-gradient(#22c55e_0_28%,#3b82f6_28%_50%,#f59e0b_50%_64%,#a855f7_64%_72%,#94a3b8_72%_100%)] p-7">
          <div className="h-full w-full rounded-full bg-white" />
        </div>
        <div className="space-y-2 text-xs font-bold text-slate-600">
          {[
            ["Coffee", "24% (82)", "bg-amber-700"],
            ["Food", "28% (96)", "bg-emerald-500"],
            ["Drinks", "22% (76)", "bg-blue-500"],
            ["Bakery", "14% (48)", "bg-amber-500"],
            ["Other", "12% (40)", "bg-slate-400"]
          ].map((item) => (
            <p key={item[0]} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${item[2]}`} />
                {item[0]}
              </span>
              <span>{item[1]}</span>
            </p>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-blue-50 px-4 py-3 text-sm font-black">
        <span>Total</span>
        <span>342</span>
      </div>
    </Card>
  );
}

function categoryTone(value: string) {
  if (value.includes("Coffee") || value.includes("Time")) return "blue";
  if (
    value.includes("Food") ||
    value.includes("Percentage") ||
    value.includes("Stock In")
  )
    return "emerald";
  if (
    value.includes("Bakery") ||
    value.includes("Fixed") ||
    value.includes("Adjustment")
  )
    return "amber";
  if (value.includes("BOGO") || value.includes("Bundle")) return "violet";
  return "slate";
}

function levelTone(value: string) {
  if (value === "Gold") return "amber";
  if (value === "Silver") return "slate";
  return "red";
}

function statusTone(value: string) {
  if (value.includes("Active") || value.includes("Received")) return "emerald";
  if (value.includes("Scheduled") || value.includes("Pending")) return "blue";
  if (value.includes("Expired") || value.includes("Paused")) return "red";
  if (value.includes("Partial")) return "amber";
  return "slate";
}
