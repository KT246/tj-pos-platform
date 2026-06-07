import {
  Building2,
  CreditCard,
  FilePlus2,
  PackagePlus,
  TrendingUp,
  UserPlus
} from "lucide-react";

import {
  AdminButton,
  AdminCard,
  Donut,
  LineChartCard,
  PageHeader,
  PanelTitle,
  QuickAction,
  SimpleList,
  StatGrid
} from "../components/admin-primitives";
import {
  businesses,
  dashboardStats,
  requests,
  tickets
} from "../data/mock-platform-admin";
import { toLaoText } from "../utils/lao-labels";

export function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Platform Admin Dashboard"
        description="ພາບລວມ performance ແລະກິດຈະກຳຂອງ Platform."
        action={<AdminButton variant="secondary">May 12 - May 18, 2025</AdminButton>}
      />
      <StatGrid stats={dashboardStats} />

      <div className="grid gap-4 xl:grid-cols-[1.05fr_1fr]">
        <LineChartCard />
        <AdminCard className="p-4">
          <PanelTitle
            title="ທຸລະກິດຫຼ້າສຸດ"
            action={<AdminButton variant="ghost">ເບິ່ງທັງໝົດ</AdminButton>}
          />
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr>
                  {[
                    "ຊື່ທຸລະກິດ",
                    "ເຈົ້າຂອງ",
                    "ແພັກເກດ",
                    "ສະຖານະ",
                    "ເຂົ້າຮ່ວມເມື່ອ"
                  ].map((head) => (
                    <th
                      key={head}
                      className="font900 border-b border-blue-100 px-3 py-3"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {businesses.slice(0, 5).map((business) => (
                  <tr key={business.id}>
                    <td className="font900 px-3 py-3 text-slate-900">
                      {business.name}
                    </td>
                    <td className="px-3 py-3 text-slate-700">{business.owner}</td>
                    <td className="font800 px-3 py-3 text-slate-800">
                      {business.plan}
                    </td>
                    <td className="px-3 py-3">
                      <span className="font800 rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                        ໃຊ້ງານ
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-700">{business.joinedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.8fr_0.95fr_0.85fr_0.95fr]">
        <AdminCard className="p-4">
          <PanelTitle title="ການແຈກຢາຍ Plan" />
          <div className="flex items-center justify-center py-3">
            <Donut />
          </div>
          <div className="border-t border-blue-100 pt-3 text-sm">
            <div className="flex justify-between">
              <span>{toLaoText("Total")}</span>
              <strong>1,102</strong>
            </div>
          </div>
        </AdminCard>
        <AdminCard className="p-4">
          <PanelTitle
            title="ຄຳຂໍຕິດຕໍ່ຫຼ້າສຸດ"
            action={<AdminButton variant="ghost">ເບິ່ງທັງໝົດ</AdminButton>}
          />
          <SimpleList records={requests} />
        </AdminCard>
        <AdminCard className="p-4">
          <PanelTitle title="ຕິດຕາມ Support ຕາມສະຖານະ" />
          <div className="flex items-center justify-center py-3">
            <Donut segments={["#ef4444", "#f97316", "#0d5bff", "#10b981"]} />
          </div>
          <div className="border-t border-blue-100 pt-3 text-sm">
            <div className="flex justify-between">
              <span>{toLaoText("Total")}</span>
              <strong>120</strong>
            </div>
          </div>
        </AdminCard>
        <AdminCard className="p-4">
          <PanelTitle
            title="ກິດຈະກຳຫຼ້າສຸດ"
            action={<AdminButton variant="ghost">ເບິ່ງທັງໝົດ</AdminButton>}
          />
          <SimpleList records={tickets} />
        </AdminCard>
      </div>

      <AdminCard className="mt-4 p-4">
        <PanelTitle title="ການກະທຳດ່ວນ" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <QuickAction
            title="ສ້າງທຸລະກິດ"
            subtitle="ເພີ່ມທຸລະກິດໃໝ່"
            icon={FilePlus2}
            href="/platform-admin/businesses/create"
          />
          <QuickAction
            title="ເພີ່ມຜູ້ໃຊ້"
            subtitle="ເຊີນເຈົ້າຂອງທຸລະກິດ"
            icon={UserPlus}
          />
          <QuickAction
            title="ກຳນົດແພັກເກດ"
            subtitle="ເລືອກແຜນສະໝັກໃຊ້"
            icon={CreditCard}
          />
          <QuickAction
            title="ຈັດການ Add-ons"
            subtitle="ເປີດໃຊ້ ຫຼື ຕັ້ງຄ່າ"
            icon={PackagePlus}
          />
          <QuickAction
            title="ເບິ່ງ Payments"
            subtitle="ກວດສອບ transaction"
            icon={Building2}
          />
          <QuickAction
            title="ສ້າງລາຍງານ"
            subtitle="ສົ່ງອອກຂໍ້ມູນ platform"
            icon={TrendingUp}
          />
        </div>
      </AdminCard>
    </>
  );
}
