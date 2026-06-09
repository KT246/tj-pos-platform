import {
  BadgePercent,
  CheckCircle2,
  Save,
  Settings,
  TicketPercent
} from "lucide-react";

import {
  Button,
  Card,
  Field,
  FormCard,
  KpiGrid,
  PageHeader,
  QuickActionsCard,
  RightRail,
  SummaryCard
} from "../components/business-admin-primitives";
import { pageKpis } from "../data/mock-business-admin";
import { BusinessAdminShell } from "../layouts/business-admin-shell";

export function PromotionFormPage() {
  return (
    <BusinessAdminShell active="ໂປຣໂມຊັນ">
      <PageHeader
        title="Promotion Form"
        description="Create or edit promotion rules, target customers, schedule, limits, and preview."
        actions={
          <>
            <Button variant="secondary">Cancel</Button>
            <Button icon={Save}>Save Promotion</Button>
          </>
        }
      />
      <KpiGrid kpis={pageKpis.promotions} />
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <FormCard title="Basic Information">
            <Field label="Promotion Name" value="Happy Hour 15% Off Drinks" />
            <Field label="Promotion Code" value="HAPPY15" />
            <Field label="Promotion Type" value="Time-based Discount" type="select" />
            <Field label="ສະຖານະ" value="ເປີດໃຊ້" type="select" />
            <Field
              label="Description"
              value="15% off selected drinks during afternoon slow hours."
              type="textarea"
              full
            />
          </FormCard>
          <FormCard title="Discount Rules">
            <Field label="Discount Method" value="ເປີເຊັນ" type="select" />
            <Field label="Discount Value" value="15%" />
            <Field label="Minimum Order Amount" value="LAK 50,000" />
            <Field label="Maximum Discount" value="LAK 30,000" />
          </FormCard>
          <Card title="Eligibility Conditions">
            <div className="space-y-3 p-4">
              {[
                "Order total is at least LAK 50,000",
                "Item category is Coffee or Drinks",
                "Customer group is All Customers",
                "Time range is 2:00 PM - 5:00 PM",
                "Branch is Main Branch or Sihom Branch"
              ].map((rule) => (
                <div
                  key={rule}
                  className="flex items-center gap-3 rounded-md border border-blue-100 bg-blue-50/40 px-4 py-3 text-sm font-bold text-slate-800"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {rule}
                </div>
              ))}
            </div>
          </Card>
          <FormCard title="Schedule & Usage Limits">
            <Field label="Start Date" value="May 1, 2025" />
            <Field label="End Date" value="May 31, 2025" />
            <Field label="Usage Limit" value="1,000 redemptions" />
            <Field label="Per Customer Limit" value="2 redemptions" />
            <Field label="Stackable" value="No" type="select" />
            <Field label="Auto Apply" value="Yes" type="select" />
          </FormCard>
        </div>
        <RightRail>
          <SummaryCard
            title="Promotion Preview"
            items={[
              { label: "Customer Sees", value: "15% off drinks", tone: "blue" },
              { label: "Eligible Items", value: "42 items", tone: "emerald" },
              { label: "Estimated Discount", value: "LAK 56.4M", tone: "amber" },
              { label: "Validation", value: "Passed", tone: "emerald" }
            ]}
          />
          <QuickActionsCard
            actions={[
              { label: "ບັນທຶກໂປຣໂມຊັນ", icon: Save, tone: "blue" },
              { label: "Create Coupon", icon: TicketPercent, tone: "violet" },
              { label: "Preview POS", icon: BadgePercent, tone: "emerald" },
              { label: "Advanced Rules", icon: Settings, tone: "amber" }
            ]}
          />
        </RightRail>
      </div>
    </BusinessAdminShell>
  );
}
