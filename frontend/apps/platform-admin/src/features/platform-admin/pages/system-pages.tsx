import {
  Database,
  Download,
  KeyRound,
  Lock,
  Mail,
  type LucideIcon
} from "lucide-react";
import Image from "../../../compat/image";

import {
  AdminButton,
  AdminCard,
  FilterBar,
  FormField,
  PageHeader,
  Pagination,
  PanelTitle,
  SettingsRow,
  StatusBadge
} from "../components/admin-primitives";
import { adminUser, auditRows } from "../data/mock-platform-admin";
import { toLaoText } from "../utils/lao-labels";

export function SystemSettingsPage() {
  return (
    <>
      <PageHeader
        title="ຕັ້ງຄ່າ Platform"
        description="ກຳນົດ platform defaults, security policy, backup ແລະ operational settings."
        action={<AdminButton>ບັນທຶກການແກ້ໄຂ</AdminButton>}
      />
      <div className="grid gap-5 xl:grid-cols-2">
        <AdminCard className="p-5">
          <PanelTitle title="ຕັ້ງຄ່າທົ່ວໄປ" />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="ຊື່ Platform" value="TJ POS" />
            <FormField label="ສະກຸນເງິນຕັ້ງຕົ້ນ" value="LAK" />
            <FormField label="ປະເທດຕັ້ງຕົ້ນ" value="Laos" />
            <FormField label="Support Email" value="support@tjpos.la" />
          </div>
        </AdminCard>
        <AdminCard className="p-5">
          <PanelTitle title="ຄວາມປອດໄພ & ການດຳເນີນງານ" />
          <SettingsRow
            title="ບັງຄັບໃຊ້ 2FA"
            description="Platform Admin ຕ້ອງໃຊ້ 2FA."
          />
          <SettingsRow title="Audit Log" description="ບັນທຶກການກະທຳສຳຄັນຂອງ admin." />
          <SettingsRow
            title="API Rate Limit"
            description="ປ້ອງກັນ API ຈາກການໃຊ້ງານເກີນ."
          />
        </AdminCard>
        <AdminCard className="p-5">
          <PanelTitle title="ສຳຮອງຂໍ້ມູນ" />
          <SettingsRow title="ສຳຮອງຂໍ້ມູນທຸກມື້" description="ສຳຮອງ database ທຸກຄືນ." />
          <SettingsRow
            title="ແຈ້ງເຕືອນ Backup"
            description="ແຈ້ງທີມ TJ POS ຖ້າ backup ລົ້ມເຫຼວ."
          />
        </AdminCard>
        <AdminCard className="p-5">
          <PanelTitle title="ສະຖານະ System" />
          {[
            ["API", "ໃຊ້ງານປົກກະຕິ"],
            ["Database", "ໃຊ້ງານປົກກະຕິ"],
            ["Queue Worker", "ພ້ອມ"],
            ["Redis", "ພ້ອມ"]
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between border-b border-blue-50 py-4 last:border-b-0"
            >
              <span className="font900 text-sm">{label}</span>
              <span className="font800 text-sm text-emerald-700">{value}</span>
            </div>
          ))}
        </AdminCard>
      </div>
    </>
  );
}

export function NotificationTemplatesPage() {
  return (
    <>
      <PageHeader
        title="ແມ່ແບບແຈ້ງເຕືອນ"
        description="ຈັດການ template ສຳລັບ Email, SMS, system alert ແລະ support notification."
        action={<AdminButton>ເພີ່ມແມ່ແບບ</AdminButton>}
      />
      <AdminCard className="overflow-hidden">
        <FilterBar
          searchPlaceholder="ຄົ້ນຫາ template..."
          filters={["Channel", "ສະຖານະ", "Trigger"]}
        />
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs text-slate-500">
            <tr>
              {[
                "ແມ່ແບບ",
                "Channel",
                "Trigger",
                "ພາສາ",
                "ສະຖານະ",
                "ອັບເດດເມື່ອ",
                "ການກະທຳ"
              ].map((head) => (
                <th key={head} className="font900 border-b border-blue-100 px-4 py-3">
                  {toLaoText(head)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {[
              ["ຕ້ອນຮັບເຈົ້າຂອງ", "Email", "ສ້າງທຸລະກິດ", "lo / en"],
              ["ຮັບການຊຳລະແລ້ວ", "Email", "ຢືນຢັນການຊຳລະ", "lo / en"],
              ["ຕັ້ງລະຫັດຜ່ານໃໝ່", "Email", "Auth", "lo / en"],
              ["ຕອບ Support", "Email", "ອັບເດດ Ticket", "lo / en"]
            ].map((row) => (
              <tr key={row[0]} className="hover:bg-blue-50/40">
                {row.map((cell) => (
                  <td key={cell} className="px-4 py-3">
                    {toLaoText(cell)}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <StatusBadge status="active" />
                </td>
                <td className="px-4 py-3">{toLaoText("May 18, 2025")}</td>
                <td className="px-4 py-3">
                  <AdminButton variant="secondary">ແກ້ໄຂ</AdminButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination />
      </AdminCard>
    </>
  );
}

export function AuditLogsPage() {
  return (
    <>
      <PageHeader
        title="ບັນທຶກການກວດສອບ"
        description="ບັນທຶກການກະທຳສຳຄັນຂອງ Platform Admin ແລະ system."
        action={<AdminButton icon={Download}>ສົ່ງອອກ Logs</AdminButton>}
      />
      <AdminCard className="overflow-hidden">
        <FilterBar
          searchPlaceholder="ຄົ້ນຫາ audit logs..."
          filters={["ຜູ້ກະທຳ", "ການກະທຳ", "Resource"]}
        />
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs text-slate-500">
            <tr>
              {["ເວລາ", "ຜູ້ກະທຳ", "ການກະທຳ", "Resource", "ແຫຼ່ງທີ່ມາ", "ສະຖານະ"].map(
                (head) => (
                  <th key={head} className="font900 border-b border-blue-100 px-4 py-3">
                  {toLaoText(head)}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {auditRows.map((row) => (
              <tr key={`${row[0]}-${row[2]}`} className="hover:bg-blue-50/40">
                {row.map((cell) => (
                  <td key={cell} className="px-4 py-3 text-slate-700">
                    {toLaoText(cell)}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <StatusBadge status="resolved" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination />
      </AdminCard>
    </>
  );
}

export function ProfileSecurityPage() {
  return (
    <>
      <PageHeader
        title="Profile & ຄວາມປອດໄພ"
        description="ຈັດການ profile, password, sessions ແລະ security ຂອງ Platform Admin."
        action={<AdminButton>ບັນທຶກການແກ້ໄຂ</AdminButton>}
      />
      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <AdminCard className="p-6 text-center">
          <Image
            src={adminUser.avatarUrl}
            alt={adminUser.name}
            width={112}
            height={112}
            className="mx-auto h-24 w-24 rounded-full object-cover ring-8 ring-emerald-50"
          />
          <h2 className="font900 mt-5 text-2xl">{adminUser.name}</h2>
          <p className="text-sm text-slate-500">Platform Admin</p>
          <div className="mt-5 flex justify-center">
            <StatusBadge status="active" />
          </div>
        </AdminCard>
        <div className="space-y-5">
          <AdminCard className="p-5">
            <PanelTitle title="ຂໍ້ມູນ Profile" />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="ຊື່ເຕັມ" value={adminUser.name} />
              <FormField label="Email" value={adminUser.email} />
              <FormField label="Phone" value="+856 20 5555 7890" />
              <FormField label="ບົດບາດ" value="Platform Admin" />
            </div>
          </AdminCard>
          <AdminCard className="p-5">
            <PanelTitle title="ຄວາມປອດໄພ" />
            <SettingsRow
              title="Two-Factor Authentication"
              description="ໃຊ້ authenticator app ສຳລັບ login."
            />
            <SettingsRow
              title="ແຈ້ງເຕືອນ Login"
              description="ແຈ້ງຜ່ານ Email ເມື່ອມີ device ໃໝ່ login."
            />
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {(
                [
                  { label: "ລະຫັດຜ່ານ", icon: Lock },
                  { label: "API Keys", icon: KeyRound },
                  { label: "Email", icon: Mail },
                  { label: "Sessions", icon: Database }
                ] satisfies { label: string; icon: LucideIcon }[]
              ).map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    type="button"
                    className="font900 flex h-14 items-center justify-center gap-2 rounded-md border border-blue-100 text-blue-700 hover:bg-blue-50"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </AdminCard>
        </div>
      </div>
    </>
  );
}
