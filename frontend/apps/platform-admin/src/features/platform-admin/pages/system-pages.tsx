import { useState, useEffect } from "react";
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

export function SystemSettingsPage() {
  return (
    <>
      <PageHeader
        title="ຕັ້ງຄ່າ Platform"
        description="ກຳນົດຂໍ້ມູນພື້ນຖານ, subscription defaults, ຄວາມປອດໄພ ແລະ maintenance mode."
        action={<AdminButton>ບັນທຶກການແກ້ໄຂ</AdminButton>}
      />
      <div className="grid gap-5 xl:grid-cols-2">
        {/* 1. General Settings */}
        <AdminCard className="p-5">
          <PanelTitle title="ຕັ້ງຄ່າທົ່ວໄປ" />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Platform Name" value="TJ POS" />
            <FormField label="Company Name" value="TJ Group" />
            <FormField label="Support Email" value="support@tjpos.la" />
            <FormField label="Support Phone" value="+856 21 123456" />
            <FormField label="Default Language" value="Lao" />
            <FormField label="Timezone" value="Asia/Vientiane" />
          </div>
        </AdminCard>

        {/* 2. Subscription Settings */}
        <AdminCard className="p-5">
          <PanelTitle title="Subscription Settings" />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Default Trial Days" value="14" />
            <FormField label="Grace Period Days" value="7" />
            <FormField label="Invoice Prefix" value="TJP" />
            <div className="md:col-span-2">
              <SettingsRow
                title="Auto Suspend Expired Business"
                description="ປິດການເຂົ້າເຖິງອັດຕະໂນມັດຫຼັງໝົດອາຍຸແລ້ວ."
              />
            </div>
          </div>
        </AdminCard>

        {/* 3. Security Settings */}
        <AdminCard className="p-5">
          <PanelTitle title="Security Settings" />
          <SettingsRow
            title="Require 2FA for Platform Admin"
            description="Platform Admin ຕ້ອງໃຊ້ two-factor authentication."
          />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FormField label="Session Timeout (minutes)" value="60" />
            <FormField label="Password Minimum Length" value="8" />
          </div>
        </AdminCard>

        {/* 4. Maintenance Mode */}
        <AdminCard className="p-5">
          <PanelTitle title="Maintenance Mode" />
          <SettingsRow
            title="Maintenance Mode"
            description="บັງຄັບໃຊ້ maintenance mode ສຳລັບທັງລະບົບ."
          />
          <div className="mt-4 space-y-4">
            <FormField
              label="Maintenance Message"
              value="ລະບົບກຳລັງອັບເດດ. ກະລຸນາລໍຖ້າ..."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Start Time" value="2025-05-20 02:00" />
              <FormField label="End Time" value="2025-05-20 04:00" />
            </div>
          </div>
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
                  {head}
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
                    {cell}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <StatusBadge status="active" />
                </td>
                <td className="px-4 py-3">{"ພຶດສະພາ 18, 2025"}</td>
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
                    {head}
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
                    {cell}
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
            src={user.avatarUrl}
            alt={user.name}
            width={112}
            height={112}
            className="mx-auto h-24 w-24 rounded-full object-cover ring-8 ring-emerald-50"
          />
          <h2 className="font900 mt-5 text-2xl">{user.name}</h2>
          <p className="text-sm text-slate-500">{user.role}</p>
          <div className="mt-5 flex justify-center">
            <StatusBadge status="active" />
          </div>
        </AdminCard>
        <div className="space-y-5">
          <AdminCard className="p-5">
            <PanelTitle title="ຂໍ້ມູນ Profile" />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="ຊື່ເຕັມ" value={user.name} />
              <FormField label="Email" value={user.email} />
              <FormField label="ເບີໂທ" value="+856 20 5555 7890" />
              <FormField label="ບົດບາດ" value={user.role} />
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
