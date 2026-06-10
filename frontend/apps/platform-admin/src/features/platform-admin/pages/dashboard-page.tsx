import { useState, useEffect } from "react";
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
  tickets,
  adminUser
} from "../data/mock-platform-admin";

export function DashboardPage() {
  const [user, setUser] = useState(adminUser);

  useEffect(() => {
    const stored = localStorage.getItem("active_platform_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Filter KPI Cards based on Role
  const filteredStats = dashboardStats.filter((stat) => {
    if (user.role === "Platform Staff") {
      // Exclude Revenue
      return stat.label !== "ລາຍຮັບປະຈຳເດືອນ";
    }
    if (user.role === "Platform Finance") {
      // Exclude Support Tickets
      return stat.label !== "ຕິດຕາມການຊ່ວຍເຫຼືອເປີດຢູ່";
    }
    return true;
  });

  return (
    <>
      <PageHeader
        title="ແດຊບອດ Platform Admin"
        description={`ພາບລວມ performance ແລະກິດຈະກຳຂອງ Platform (${user.role}).`}
        action={<AdminButton variant="secondary">May 12 - May 18, 2025</AdminButton>}
      />
      <StatGrid stats={filteredStats} />

      <div className="grid gap-4 xl:grid-cols-[1.05fr_1fr]">
        {/* Only Admin & Finance can see Revenue Chart */}
        {user.role !== "Platform Staff" ? (
          <LineChartCard />
        ) : (
          /* Staff sees support ticket distribution for balance */
          <AdminCard className="p-4">
            <PanelTitle title="ຕິດຕາມ Support ຕາມສະຖານະ (Ticket Status)" />
            <div className="flex items-center justify-center py-6">
              <Donut segments={["#ef4444", "#f97316", "#0d5bff", "#10b981"]} />
            </div>
            <div className="border-t border-blue-100 pt-3 text-sm">
              <div className="flex justify-between">
                <span>{"ລວມທັງໝົດ"}</span>
                <strong>120 tickets</strong>
              </div>
            </div>
          </AdminCard>
        )}
        
        {/* Only Admin & Staff can see Recent Businesses */}
        {user.role !== "Platform Finance" ? (
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
        ) : (
          /* Finance sees Plan distribution donut instead of businesses */
          <AdminCard className="p-4">
            <PanelTitle title="ການແຈກຢາຍ Plan (Plan Distribution)" />
            <div className="flex items-center justify-center py-6">
              <Donut />
            </div>
            <div className="border-t border-blue-100 pt-3 text-sm">
              <div className="flex justify-between">
                <span>{"ລວມທັງໝົດ"}</span>
                <strong>1,102 active plans</strong>
              </div>
            </div>
          </AdminCard>
        )}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {/* Admin layout widgets */}
        {user.role === "Platform Admin" && (
          <>
            <AdminCard className="p-4">
              <PanelTitle
                title="ຄຳຂໍຕິດຕໍ່ຫຼ້າສຸດ"
                action={<AdminButton variant="ghost">ເບິ່ງທັງໝົດ</AdminButton>}
              />
              <SimpleList records={requests} />
            </AdminCard>
            <AdminCard className="p-4">
              <PanelTitle
                title="ກິດຈະກຳຫຼ້າສຸດ (Support Tickets)"
                action={<AdminButton variant="ghost">\ເບິ່ງທັງໝົດ</AdminButton>}
              />
              <SimpleList records={tickets} />
            </AdminCard>
          </>
        )}

        {/* Staff sees Contact Requests and Tickets status */}
        {user.role === "Platform Staff" && (
          <>
            <AdminCard className="p-4">
              <PanelTitle
                title="ຄຳຂໍຕິດຕໍ່ຫຼ້າສຸດ"
                action={<AdminButton variant="ghost">ເບິ່ງທັງໝົດ</AdminButton>}
              />
              <SimpleList records={requests} />
            </AdminCard>
            <AdminCard className="p-4">
              <PanelTitle
                title="ກິດຈະກຳຫຼ້າສຸດ (Support Tickets)"
                action={<AdminButton variant="ghost">ເບິ່ງທັງໝົດ</AdminButton>}
              />
              <SimpleList records={tickets} />
            </AdminCard>
          </>
        )}

        {/* Finance layout widgets */}
        {user.role === "Platform Finance" && (
          <>
            <AdminCard className="p-4">
              <PanelTitle
                title="ຄຳຂໍຕິດຕໍ່ຫຼ້າສຸດ"
                action={<AdminButton variant="ghost">ເບິ່ງທັງໝົດ</AdminButton>}
              />
              <SimpleList records={requests} />
            </AdminCard>
            <AdminCard className="p-4">
              <PanelTitle
                title="ກິດຈະກຳຫຼ້າສຸດ (Tickets)"
                action={<AdminButton variant="ghost">ເບິ່ງທັງໝົດ</AdminButton>}
              />
              <SimpleList records={tickets} />
            </AdminCard>
          </>
        )}
      </div>

      <AdminCard className="mt-4 p-4">
        <PanelTitle title="ການກະທຳດ່ວນ" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {/* Staff Quick Actions */}
          {(user.role === "Platform Admin" || user.role === "Platform Staff") && (
            <>
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
                href="/platform-admin/owners"
              />
              <QuickAction
                title="ຈັດການ Add-ons"
                subtitle="ເປີດໃຊ້ ຫຼື ຕັ້ງຄ່າ"
                icon={PackagePlus}
                href="/platform-admin/add-ons"
              />
            </>
          )}

          {/* Finance Quick Actions */}
          {(user.role === "Platform Admin" || user.role === "Platform Finance") && (
            <>
              <QuickAction
                title="ກຳນົດແພັກເກດ"
                subtitle="ເລືອກແຜນສະໝັກໃຊ້"
                icon={CreditCard}
                href="/platform-admin/plans"
              />
              <QuickAction
                title="ເບິ່ງ Payments"
                subtitle="ກວດສອບ transaction"
                icon={Building2}
                href="/platform-admin/payments"
              />
              <QuickAction
                title="ສ້າງລາຍງານ"
                subtitle="ສົ່ງອອກຂໍ້ມູນ platform"
                icon={TrendingUp}
                href="/platform-admin/audit-logs"
              />
            </>
          )}
        </div>
      </AdminCard>
    </>
  );
}
