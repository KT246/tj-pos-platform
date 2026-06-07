import {
  Boxes,
  Building2,
  ChevronLeft,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Image as ImageIcon,
  MapPin,
  Palette,
  Percent,
  Power,
  Printer,
  Save,
  Settings,
  Trash2,
  Upload
} from "lucide-react";

import {
  Badge,
  Button,
  Card,
  Field,
  FormCard,
  KpiGrid,
  PageHeader,
  QuickActionsCard,
  RightRail,
  SummaryCard,
  Tabs
} from "../components/business-admin-primitives";
import { BusinessAdminLink } from "../components/business-admin-link";
import { importExportActions, pageKpis } from "../data/mock-business-admin";
import { BusinessAdminShell } from "../layouts/business-admin-shell";
import type { BusinessMenuKey, Kpi } from "../types";

export function BranchFormPage() {
  return (
    <BusinessAdminShell active="Branches">
      <PageHeader
        title="Edit Branch"
        description="Update branch details, settings and assignments."
        breadcrumb={
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <BusinessAdminLink
              href="/business-admin/branches"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50"
              aria-label="Back to branches"
            >
              <ChevronLeft className="h-4 w-4" />
            </BusinessAdminLink>
            <BusinessAdminLink href="/business-admin/branches" className="text-blue-600">
              Branches
            </BusinessAdminLink>
            <span>/</span>
            <span>Branch Form</span>
          </div>
        }
        actions={
          <>
            <Button variant="secondary">Cancel</Button>
            <Button variant="secondary">Save & Continue</Button>
            <Button icon={Save}>Save Changes</Button>
          </>
        }
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Card title="Branch Information">
            <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
              <Field label="Branch Name" value="Thadluang Branch" />
              <Field label="Branch Code" value="VTE-THDT" />
              <Field label="Branch Type" value="Flagship" type="select" />
              <Field label="Status" value="Active" type="select" />
              <Field label="Manager" value="Latsamy Phdeng" type="select" />
              <Field label="Phone" value="+856 20 5555 1234" />
              <Field label="Email" value="thadluang@tjcafe.la" />
              <Field label="Tax ID / Registration No." value="0205567890123" />
              <Field
                label="Address"
                value="123 Thadluang Road, Sisattanak District"
                full
              />
              <Field label="City / Province" value="Vientiane Capital" type="select" />
              <Field label="Postal Code" value="01000" />
              <div className="md:col-span-2">
                <span className="mb-1.5 block text-xs font-black text-slate-600">
                  Location (Map)
                </span>
                <div className="grid gap-3 md:grid-cols-[1fr_170px]">
                  <div className="rounded-md border border-blue-100 bg-white p-3 text-xs font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2 py-1 font-black text-emerald-600">
                      <MapPin className="h-3.5 w-3.5" />
                      Location set
                    </span>
                    <p className="mt-2">17.9754 N, 102.6331 E</p>
                    <p>Thadluang Road, Sisattanak, Vientiane Capital, Laos</p>
                  </div>
                  <div className="overflow-hidden rounded-md border border-blue-100 bg-blue-50">
                    <div
                      className="h-full min-h-[82px] bg-cover bg-center"
                      style={{
                        backgroundImage:
                          "url(https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=320&q=80)"
                      }}
                    />
                  </div>
                </div>
              </div>
              <Field
                label="Time Zone"
                value="(GMT+07:00) Indochina Time (ICT)"
                type="select"
                full
              />
            </div>
          </Card>

          <Card title="Business & Receipt Settings">
            <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_260px]">
              <Field label="Receipt Header Name" value="TJ Cafe - Thadluang" />
              <Field label="Currency" value="LAK (K)" type="select" />
              <Field label="Default Price List" value="Retail Price" type="select" />
              <div>
                <span className="mb-1.5 block text-xs font-black text-slate-600">
                  Branch Logo / Image
                </span>
                <div className="flex items-center gap-3">
                  <div
                    className="h-14 w-24 rounded-md border border-blue-100 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url(https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=240&q=80)"
                    }}
                  />
                  <div className="space-y-2">
                    <button
                      type="button"
                      className="flex h-8 items-center gap-2 rounded-md border border-blue-100 px-3 text-xs font-black text-blue-600 hover:bg-blue-50"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      Change Image
                    </button>
                    <button
                      type="button"
                      className="flex h-8 items-center gap-2 rounded-md border border-red-100 px-3 text-xs font-black text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Operational Settings">
            <div className="space-y-4 p-4">
              <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
                {[
                  ["Cash Drawer", true],
                  ["Allow Negative Stock", false],
                  ["Track Stock By Batch", true],
                  ["Require Price on Sale", true],
                  ["Loyalty Program", true]
                ].map(([label, enabled]) => (
                  <SwitchSetting
                    key={label as string}
                    label={label as string}
                    enabled={enabled as boolean}
                  />
                ))}
              </div>
              <div className="border-t border-blue-50 pt-4">
                <p className="mb-2 text-xs font-black text-slate-600">
                  Payment Methods (QR / Digital)
                </p>
                <div className="grid gap-3 text-xs font-bold text-slate-700 md:grid-cols-3 xl:grid-cols-6">
                  {["Lao QR", "OnePay", "BCEL One", "VISA / MasterCard", "Alipay", "WeChat Pay"].map(
                    (item, index) => (
                      <label key={item} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked={index < 4}
                          className="h-4 w-4 accent-blue-600"
                        />
                        {item}
                      </label>
                    )
                  )}
                </div>
              </div>
              <div className="grid gap-4 border-t border-blue-50 pt-4 md:grid-cols-4">
                <SwitchSetting label="Service Types Available" enabled />
                <SwitchSetting label="Takeaway" enabled />
                <SwitchSetting label="Delivery" enabled />
                <Field label="Default Order Type" value="Dine-in" type="select" />
              </div>
            </div>
          </Card>

          <Card title="Operating Hours">
            <div className="grid gap-4 p-4 xl:grid-cols-[1fr_360px]">
              <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-7">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                  (day, index) => (
                    <div
                      key={day}
                      className="rounded-md border border-blue-100 bg-white p-3"
                    >
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-black text-slate-600">
                          {day}
                        </span>
                        <span
                          className={`h-5 w-9 rounded-full p-0.5 ${
                            index === 6 ? "bg-slate-200" : "bg-blue-600"
                          }`}
                        >
                          <span
                            className={`block h-4 w-4 rounded-full bg-white ${
                              index === 6 ? "" : "translate-x-4"
                            }`}
                          />
                        </span>
                      </div>
                      <button
                        type="button"
                        className="mb-2 flex h-8 w-full items-center justify-between rounded-md border border-blue-100 px-2 text-[11px] font-bold text-slate-700"
                      >
                        06:30 AM
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                      <button
                        type="button"
                        className="flex h-8 w-full items-center justify-between rounded-md border border-blue-100 px-2 text-[11px] font-bold text-slate-700"
                      >
                        {index === 6 ? "Closed" : "09:30 PM"}
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    </div>
                  )
                )}
              </div>
              <Field
                label="Notes"
                value="Main flagship branch located near Thatluang Stupa. High foot traffic area. Offers dine-in, takeaway and delivery services."
                type="textarea"
              />
            </div>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button icon={Trash2} variant="secondary">
              Delete Branch
            </Button>
            <div className="flex gap-3">
              <Button variant="secondary">Cancel</Button>
              <Button variant="secondary">Save & Continue</Button>
              <Button icon={Save}>Save Changes</Button>
            </div>
          </div>
        </div>

        <RightRail>
          <SummaryCard
            title="Branch Status"
            items={[
              { label: "Branch Code", value: "VTE-THDT", tone: "slate" },
              { label: "Branch Type", value: "Flagship", tone: "slate" },
              { label: "Created On", value: "Mar 15, 2024", tone: "slate" },
              { label: "Last Updated", value: "May 12, 2025", tone: "slate" }
            ]}
            action={<Badge>Active</Badge>}
          />
          <SummaryCard
            title="Assigned Devices"
            items={[
              { label: "POS Terminals", value: "3", tone: "blue" },
              { label: "Kitchen Printers", value: "2", tone: "slate" },
              { label: "Receipt Printers", value: "1", tone: "slate" },
              { label: "Cash Drawers", value: "2", tone: "slate" }
            ]}
            action={<span className="text-sm font-black">6</span>}
          />
          <SummaryCard
            title="Staff & Operations"
            items={[
              { label: "Total Staff", value: "10", tone: "blue" },
              { label: "Active Staff", value: "9", tone: "emerald" },
              { label: "Opening Hours", value: "06:30 AM - 09:30 PM", tone: "slate" },
              { label: "Time Zone", value: "ICT (GMT+07:00)", tone: "slate" }
            ]}
            action={<span className="text-sm font-black">10</span>}
          />
          <QuickActionsCard
            actions={[
              { label: "View Branch", description: "View branch details", icon: MapPin, tone: "blue" },
              { label: "Assign Manager", description: "Change branch manager", icon: Building2, tone: "emerald" },
              { label: "Configure Devices", description: "Manage devices & printers", icon: Printer, tone: "violet" },
              { label: "Opening Hours", description: "Manage daily opening hours", icon: Power, tone: "blue" },
              { label: "Duplicate Branch", description: "Create a copy of this branch", icon: Copy, tone: "emerald" }
            ]}
          />
        </RightRail>
      </div>
    </BusinessAdminShell>
  );
}

export function BusinessProfilePage() {
  return (
    <FormShell
      active="Settings"
      title="Business Profile"
      description="Manage business identity, contact details, tax information, and default preferences."
      kpis={pageKpis.branches}
      right={<ValidationRail title="Profile Completion" />}
    >
      <FormCard title="Business Details">
        <Field label="Business Name" value="TJ Cafe Vientiane" />
        <Field label="Business Type" value="Cafe / Restaurant" type="select" />
        <Field label="Phone" value="020 5555 1234" />
        <Field label="Email" value="owner@tjcafe.la" />
        <Field
          label="Address"
          value="Vientiane Center, Sisattanak, Vientiane Capital"
          full
        />
      </FormCard>
      <FormCard title="Tax & Currency">
        <Field label="Tax ID" value="LA-010-245-998" />
        <Field label="Currency" value="LAK - Lao Kip" type="select" />
        <Field label="Default Language" value="English" type="select" />
        <Field label="Receipt Prefix" value="TJ" />
      </FormCard>
    </FormShell>
  );
}

export function ItemFormPage() {
  return (
    <FormShell
      active="Items"
      title="Item Form"
      description="Create or edit item details, pricing, SKU, inventory, modifiers, and branch availability."
      kpis={pageKpis.items}
      right={<ValidationRail title="Item Preview" />}
    >
      <FormCard title="Basic Information">
        <Field label="Item Name" value="Iced Latte" />
        <Field label="Lao Name" value="ກາເຟລາເຕ້" />
        <Field label="SKU" value="CF-1001" />
        <Field label="Barcode" value="8850001001" />
        <Field label="Category" value="Coffee" type="select" />
        <Field
          label="Description"
          value="Cold espresso with fresh milk and ice."
          type="textarea"
          full
        />
      </FormCard>
      <FormCard title="Pricing & Inventory">
        <Field label="Default Retail Price" value="LAK 25,000" />
        <Field label="Wholesale Price" value="LAK 21,000" />
        <Field label="Reseller Price" value="LAK 20,000" />
        <Field label="Min Wholesale Quantity" value="12" />
        <Field label="Price List" value="Cafe Wholesale" type="select" />
        <Field label="Cost Price" value="LAK 11,500" />
        <Field label="Current Stock" value="48" />
        <Field label="Low Stock Alert" value="12" />
      </FormCard>
    </FormShell>
  );
}

export function ItemVariantsPage() {
  return (
    <FormShell
      active="Items"
      title="Item Variants & Options"
      description="Manage sizes, modifiers, add-ons, option groups, and branch-specific item variations."
      kpis={pageKpis.items}
      right={<ValidationRail title="Variant Rules" />}
    >
      <FormCard title="Size Variants">
        <Field label="Small" value="LAK 22,000" />
        <Field label="Regular" value="LAK 25,000" />
        <Field label="Large" value="LAK 30,000" />
        <Field label="Default Size" value="Regular" type="select" />
      </FormCard>
      <FormCard title="Modifier Options">
        <Field label="Milk Options" value="Fresh Milk, Oat Milk, Soy Milk" full />
        <Field label="Sugar Level" value="0%, 25%, 50%, 75%, 100%" full />
      </FormCard>
    </FormShell>
  );
}

export function CategoryFormPage() {
  return (
    <FormShell
      active="Categories"
      title="Category Form"
      description="Create or edit product and menu categories, branch visibility, and ordering rules."
      kpis={pageKpis.items}
      right={<ValidationRail title="Category Rules" />}
    >
      <FormCard title="Category Details">
        <Field label="Category Name" value="Coffee" />
        <Field label="Lao Name" value="ກາເຟ" />
        <Field label="Department" value="Beverage" type="select" />
        <Field label="Status" value="Active" type="select" />
        <Field
          label="Description"
          value="Coffee drinks, espresso-based drinks, and iced coffee menu items."
          type="textarea"
          full
        />
      </FormCard>
      <FormCard title="Display Settings">
        <Field label="Branch Visibility" value="All Branches" type="select" />
        <Field label="Public Menu Visibility" value="Visible" type="select" />
        <Field label="Sort Order" value="1" />
        <Field label="Icon" value="Coffee Cup" type="select" />
      </FormCard>
      <QuickActionsCard
        actions={[
          { label: "Preview Category", icon: Boxes, tone: "blue" },
          { label: "Apply to Public Menu", icon: CheckCircle2, tone: "emerald" }
        ]}
      />
    </FormShell>
  );
}

export function StockInPage() {
  return (
    <FormShell
      active="Stock Movements"
      title="Stock In"
      description="Record received stock from suppliers and update inventory quantities."
      kpis={pageKpis.stock}
      right={<ValidationRail title="Receiving Summary" />}
    >
      <FormCard title="Receipt Information">
        <Field label="Supplier" value="Lao Coffee Supply" type="select" />
        <Field label="Branch" value="Main Branch" type="select" />
        <Field label="Receipt Date" value="May 18, 2025" />
        <Field label="Reference" value="PR-00218" />
      </FormCard>
      <Card title="Stock Lines">
        <div className="space-y-3 p-4">
          {[
            "Coffee Beans Arabica +120",
            "Fresh Milk 1L +48",
            "Paper Cup 12oz +500"
          ].map((line) => (
            <div
              key={line}
              className="rounded-md border border-blue-100 bg-blue-50/40 px-4 py-3 text-sm font-black text-slate-800"
            >
              {line}
            </div>
          ))}
        </div>
      </Card>
    </FormShell>
  );
}

export function StockAdjustmentPage() {
  return (
    <FormShell
      active="Stock Movements"
      title="Stock Adjustment"
      description="Adjust inventory for damaged, expired, counted, or corrected stock."
      kpis={pageKpis.stock}
      right={<ValidationRail title="Adjustment Check" />}
    >
      <FormCard title="Adjustment Details">
        <Field label="Item" value="Fresh Milk 1L" type="select" />
        <Field label="Branch" value="Main Branch" type="select" />
        <Field label="Adjustment Type" value="Damaged" type="select" />
        <Field label="Quantity" value="-6" />
        <Field
          label="Reason"
          value="Damaged during delivery. Manager approved adjustment."
          type="textarea"
          full
        />
      </FormCard>
    </FormShell>
  );
}

export function LoyaltySettingsPage() {
  return (
    <FormShell
      active="Loyalty"
      title="Loyalty Settings"
      description="Configure points, tiers, rewards, and member benefits."
      kpis={pageKpis.loyalty}
      right={<ValidationRail title="Loyalty Health" />}
    >
      <FormCard title="Points Rules">
        <Field label="Earn Rate" value="1 point per LAK 1,000" />
        <Field label="Redeem Rate" value="100 points = LAK 1,000" />
        <Field label="Minimum Redeem" value="500 points" />
        <Field label="Point Expiry" value="12 months" />
      </FormCard>
      <FormCard title="Member Tiers">
        <Field label="Silver" value="5,000 points" />
        <Field label="Gold" value="10,000 points" />
        <Field label="VIP" value="25,000 points" />
        <Field label="Birthday Reward" value="Free drink coupon" />
      </FormCard>
    </FormShell>
  );
}

export function RolesPermissionsPage() {
  return (
    <FormShell
      active="Roles & Permissions"
      title="Roles & Permissions"
      description="Control staff access for POS, inventory, reports, settings, and payments."
      kpis={pageKpis.staff}
      right={<ValidationRail title="Security Checklist" />}
    >
      <Card title="Role Matrix">
        <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
          {["Owner", "Manager", "Cashier", "Inventory", "Barista", "Accountant"].map(
            (role) => (
              <div key={role} className="rounded-lg border border-blue-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-black">{role}</h3>
                  <Badge tone={role === "Owner" ? "blue" : "emerald"}>Active</Badge>
                </div>
                <p className="text-xs leading-5 font-semibold text-slate-500">
                  POS access, branch scope, reports, inventory, and approval rules.
                </p>
              </div>
            )
          )}
        </div>
      </Card>
      <FormCard title="Wholesale & Debt Permissions">
        <Field label="View Wholesale Price" value="Owner, Manager" type="select" />
        <Field label="Edit Wholesale Price" value="Owner only" type="select" />
        <Field label="Create Wholesale Order" value="Owner, Manager, Cashier" type="select" />
        <Field label="Approve Customer Debt" value="Owner, Manager approval" type="select" />
        <Field label="Receive Debt Payment" value="Owner, Manager, Cashier" type="select" />
        <Field label="View Cost Price / Profit" value="Owner, Manager" type="select" />
      </FormCard>
    </FormShell>
  );
}

export function ReceiptBillSettingsPage() {
  return (
    <SettingsPage
      active="Receipt/Bill"
      title="Receipt / Bill Settings"
      description="Configure receipt layout, tax display, print settings, QR info, and live preview."
      icon={Printer}
      tabs={[
        "Receipt Layout",
        "Invoice/Bill",
        "Tax & Service Charge",
        "Print Settings",
        "Preview"
      ]}
    />
  );
}

export function BrandingThemePage() {
  return (
    <SettingsPage
      active="Branding"
      title="Branding / Theme"
      description="Manage logo, colors, typography, POS theme, receipt branding, and customer display."
      icon={Palette}
      tabs={["Business Logo", "Brand Colors", "Theme Mode", "POS Display", "Preview"]}
    />
  );
}

export function PaymentMethodsPage() {
  return (
    <SettingsPage
      active="Payment Methods"
      title="Payment Methods"
      description="Configure cash, card, bank transfer, BCEL One, LaoViet QR, settlements, and fees."
      icon={CreditCard}
      tabs={[
        "Payment Methods",
        "Bank Accounts",
        "QR Templates",
        "Debt Terms",
        "Settlement",
        "Fees"
      ]}
    />
  );
}

export function ModuleSettingsPage() {
  return (
    <SettingsPage
      active="Modules"
      title="Module Settings"
      description="Enable modules, manage add-ons, plan locks, branch availability, and dependencies."
      icon={Settings}
      tabs={["Enabled Modules", "Available Modules", "Add-ons", "Locked by Plan"]}
    />
  );
}

export function ImportCenterPage() {
  return (
    <ImportExportPage
      active="Import/Export"
      title="Import Center"
      description="Import items, stock, customers, suppliers, categories, staff, and promotions from XLSX or CSV."
      mode="import"
    />
  );
}

export function ExportCenterPage() {
  return (
    <ImportExportPage
      active="Import/Export"
      title="Export Center"
      description="Export datasets, schedule exports, and download XLSX, CSV, or PDF files."
      mode="export"
    />
  );
}

export function StaffDetailPage() {
  return (
    <FormShell
      active="Staff"
      title="Staff Form / Detail"
      description="Manage staff profile, assigned branch, role, permissions, and login status."
      kpis={pageKpis.staff}
      right={<ValidationRail title="Staff Access" />}
    >
      <FormCard title="Staff Profile">
        <Field label="Full Name" value="Ketsana Vongdala" />
        <Field label="Role" value="Manager" type="select" />
        <Field label="Branch" value="Sihom Branch" type="select" />
        <Field label="Phone" value="020 5544 8899" />
        <Field label="Email" value="ketsana@tjcafe.la" />
        <Field label="Status" value="Active" type="select" />
      </FormCard>
    </FormShell>
  );
}

export function CustomerDetailPage() {
  return (
    <FormShell
      active="Customers"
      title="Customer Detail"
      description="View customer profile, purchase history, loyalty points, notes, and promotion eligibility."
      kpis={pageKpis.customers}
      right={<ValidationRail title="Customer Snapshot" />}
    >
      <FormCard title="Customer Profile">
        <Field label="Customer Name" value="Khamla Philavong" />
        <Field label="Customer Type" value="Wholesale Customer" type="select" />
        <Field label="Price List" value="Cafe Wholesale" type="select" />
        <Field label="Member Level" value="Gold" type="select" />
        <Field label="Phone" value="020 2233 4455" />
        <Field label="Points" value="15,200" />
        <Field label="Debt Balance" value="LAK 1,850,000" />
        <Field label="Credit Limit" value="LAK 8,000,000" />
        <Field label="Payment Term" value="Net 15" type="select" />
        <Field label="Purchase History" value="42 orders / LAK 12,680,000" />
        <Field label="Wholesale Order History" value="8 wholesale orders this quarter" />
        <Field
          label="Notes"
          value="Prefers iced drinks. Uses Cafe Wholesale price list. Manager approval required when debt exceeds limit."
          type="textarea"
          full
        />
      </FormCard>
    </FormShell>
  );
}

export function PurchaseReceiptDetailPage() {
  return (
    <FormShell
      active="Suppliers"
      title="Purchase Receipt Detail / Form"
      description="Review supplier receipt lines, costs, received quantities, and stock update result."
      kpis={pageKpis.suppliers}
      right={<ValidationRail title="Receipt Summary" />}
    >
      <FormCard title="Purchase Receipt">
        <Field label="Receipt Number" value="PR-00218" />
        <Field label="Supplier" value="Lao Coffee Supply" type="select" />
        <Field label="Branch" value="Main Branch" type="select" />
        <Field label="Status" value="Received" type="select" />
        <Field
          label="Notes"
          value="Coffee beans and paper supplies received in good condition."
          type="textarea"
          full
        />
      </FormCard>
    </FormShell>
  );
}

export function SupplierFormPage() {
  return (
    <FormShell
      active="Suppliers"
      title="Supplier Form"
      description="Create or update supplier contact, category, payment terms, and delivery notes."
      kpis={pageKpis.suppliers}
      right={<ValidationRail title="Supplier Status" />}
    >
      <FormCard title="Supplier Details">
        <Field label="Supplier Name" value="Lao Coffee Supply" />
        <Field label="Category" value="Coffee Beans" type="select" />
        <Field label="Phone" value="020 5588 1212" />
        <Field label="Payment Terms" value="Net 15" />
        <Field
          label="Address"
          value="Ban Phonthan, Sisattanak, Vientiane Capital"
          full
        />
      </FormCard>
    </FormShell>
  );
}

function SettingsPage({
  active,
  title,
  description,
  icon: Icon,
  tabs
}: {
  active: BusinessMenuKey;
  title: string;
  description: string;
  icon: typeof Settings;
  tabs: string[];
}) {
  return (
    <BusinessAdminShell active={active}>
      <PageHeader
        title={title}
        description={description}
        actions={<Button icon={Save}>Save Settings</Button>}
      />
      <Tabs tabs={tabs} active={tabs[0]} />
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <FormCard title={tabs[0]} description="Business-specific configuration">
            <Field label="Display Name" value="TJ Cafe Vientiane" />
            <Field label="Branch Scope" value="All Branches" type="select" />
            <Field label="Default Option" value="Enabled" type="select" />
            <Field label="Updated By" value="Somchai Phommaseanh" />
          </FormCard>
          <Card title="Live Preview">
            <div className="p-4">
              <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-black text-slate-950">{title}</h3>
                    <p className="text-xs font-semibold text-slate-500">
                      Preview for Main Branch
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {["Admin", "POS", "Receipt"].map((item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-blue-100 bg-white p-4"
                    >
                      <p className="font-black">{item}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Applied configuration preview
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
        <RightRail>
          <SummaryCard
            title="Setup Checklist"
            items={[
              { label: "Business Info", value: "Complete", tone: "emerald" },
              { label: "Branch Scope", value: "All Branches", tone: "blue" },
              { label: "Last Updated", value: "Today", tone: "slate" },
              { label: "Validation", value: "Passed", tone: "emerald" }
            ]}
          />
          <QuickActionsCard
            actions={[
              { label: "Save Settings", icon: Save, tone: "blue" },
              { label: "Upload Asset", icon: Upload, tone: "emerald" },
              { label: "Preview", icon: CheckCircle2, tone: "violet" },
              { label: "Reset Template", icon: Settings, tone: "amber" }
            ]}
          />
        </RightRail>
      </div>
    </BusinessAdminShell>
  );
}

function ImportExportPage({
  active,
  title,
  description,
  mode
}: {
  active: BusinessMenuKey;
  title: string;
  description: string;
  mode: "import" | "export";
}) {
  return (
    <BusinessAdminShell active={active}>
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button icon={mode === "import" ? Upload : Save}>
            {mode === "import" ? "Upload File" : "Create Export"}
          </Button>
        }
      />
      <KpiGrid
        kpis={[
          {
            label: mode === "import" ? "Imports This Month" : "Exports This Month",
            value: "42",
            change: "+12 this month",
            tone: "blue",
            icon: Upload
          },
          {
            label: "Successful Jobs",
            value: "38",
            change: "90.4% success",
            tone: "emerald",
            icon: CheckCircle2
          },
          {
            label: mode === "import" ? "Failed Rows" : "Scheduled Exports",
            value: mode === "import" ? "126" : "8",
            change: "Needs review",
            tone: "amber",
            icon: Settings
          },
          {
            label: "Templates Available",
            value: "12",
            change: "XLSX and CSV",
            tone: "violet",
            icon: Save
          }
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Card title={mode === "import" ? "Import Types" : "Export Datasets"}>
            <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                "Items",
                "Stock",
                "Customers",
                "Suppliers",
                "Categories",
                "Staff",
                "Promotions",
                "Wholesale Price List",
                "Customer Debt Opening Balance",
                "Wholesale Orders"
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="rounded-lg border border-blue-100 bg-white p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/60"
                >
                  <p className="font-black text-slate-950">{item}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {mode === "import"
                      ? "Upload XLSX or CSV template"
                      : "Download as XLSX, CSV, or PDF"}
                  </p>
                </button>
              ))}
            </div>
          </Card>
          <FormCard
            title={mode === "import" ? "Upload & Validation" : "Export Options"}
          >
            <Field label="Dataset" value="Items" type="select" />
            <Field label="Branch" value="All Branches" type="select" />
            <Field
              label="Format"
              value={mode === "import" ? "XLSX" : "XLSX, CSV, PDF"}
              type="select"
            />
            <Field label="Date Range" value="May 12 - May 18, 2025" />
          </FormCard>
        </div>
        <RightRail>
          <QuickActionsCard actions={importExportActions} />
          <ValidationRail
            title={mode === "import" ? "Import Checklist" : "Data Privacy Note"}
          />
        </RightRail>
      </div>
    </BusinessAdminShell>
  );
}

function FormShell({
  active,
  title,
  description,
  kpis,
  children,
  right
}: {
  active: BusinessMenuKey;
  title: string;
  description: string;
  kpis: Kpi[];
  children: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <BusinessAdminShell active={active}>
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            <Button variant="secondary">Cancel</Button>
            <Button icon={Save}>Save</Button>
          </>
        }
      />
      <KpiGrid kpis={kpis} />
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4">{children}</div>
        <RightRail>{right}</RightRail>
      </div>
    </BusinessAdminShell>
  );
}

function SwitchSetting({
  label,
  enabled
}: {
  label: string;
  enabled: boolean;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-black text-slate-600">{label}</p>
      <button
        type="button"
        className="flex items-center gap-2 text-xs font-bold text-slate-500"
      >
        <span
          className={`h-5 w-9 rounded-full p-0.5 transition ${
            enabled ? "bg-blue-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`block h-4 w-4 rounded-full bg-white transition ${
              enabled ? "translate-x-4" : ""
            }`}
          />
        </span>
        {enabled ? "Enabled" : "Disabled"}
      </button>
    </div>
  );
}

function ValidationRail({ title }: { title: string }) {
  return (
    <>
      <SummaryCard
        title={title}
        items={[
          { label: "Required Fields", value: "Complete", tone: "emerald" },
          { label: "Branch Scope", value: "Main + Sihom", tone: "blue" },
          { label: "Permissions", value: "Valid", tone: "violet" },
          { label: "Last Updated", value: "May 18, 2025", tone: "slate" }
        ]}
      />
      <QuickActionsCard
        actions={[
          { label: "Save Changes", icon: Save, tone: "blue" },
          { label: "Preview", icon: CheckCircle2, tone: "emerald" },
          { label: "Apply to Branches", icon: Building2, tone: "violet" },
          { label: "Advanced Rules", icon: Percent, tone: "amber" }
        ]}
      />
    </>
  );
}
