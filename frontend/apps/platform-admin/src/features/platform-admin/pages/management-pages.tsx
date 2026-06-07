import {
  Banknote,
  Box,
  CheckCircle2,
  CreditCard,
  Landmark,
  Puzzle,
  Smartphone,
  XCircle
} from "lucide-react";
import Image from "../../../compat/image";

import {
  AdminButton,
  AdminCard,
  Donut,
  FilterBar,
  PageHeader,
  PanelTitle,
  Pagination,
  SettingsRow,
  SimpleList,
  StatusBadge
} from "../components/admin-primitives";
import { businesses, paymentMethods, planCards } from "../data/mock-platform-admin";

export function UsersPage() {
  return (
    <>
      <PageHeader
        title="ເຈົ້າຂອງ / ຜູ້ໃຊ້"
        description="ຈັດການ owner, staff ແລະ platform user accounts."
        action={<AdminButton>ເພີ່ມຜູ້ໃຊ້</AdminButton>}
      />
      <AdminCard className="overflow-hidden">
        <FilterBar
          searchPlaceholder="ຄົ້ນຫາຜູ້ໃຊ້..."
          filters={["ບົດບາດທັງໝົດ", "ສະຖານະທັງໝົດ", "ທຸລະກິດທັງໝົດ"]}
        />
        <GenericTable
          headers={[
            "ຜູ້ໃຊ້",
            "ທຸລະກິດ",
            "ບົດບາດ",
            "Email",
            "ສະຖານະ",
            "Login ຫຼ້າສຸດ",
            "ການກະທຳ"
          ]}
          rows={businesses.map((business) => [
            business.owner,
            business.name,
            "ເຈົ້າຂອງ",
            business.ownerEmail,
            <StatusBadge key="status" status={business.status} />,
            business.lastActivity,
            "ເບິ່ງລາຍລະອຽດ"
          ])}
        />
      </AdminCard>
    </>
  );
}

export function OwnerDetailPage() {
  const business = businesses[1];

  return (
    <>
      <PageHeader
        title={business.owner}
        description="User profile, business access, login history ແລະ security status."
        action={<AdminButton variant="secondary">ຕັ້ງລະຫັດຜ່ານໃໝ່</AdminButton>}
      />
      <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <AdminCard className="p-6 text-center">
          <Image
            src={business.ownerAvatarUrl}
            alt={business.owner}
            width={112}
            height={112}
            className="mx-auto h-24 w-24 rounded-full object-cover ring-8 ring-emerald-50"
          />
          <h2 className="font900 mt-5 text-2xl">{business.owner}</h2>
          <p className="text-sm text-slate-500">{business.ownerEmail}</p>
          <div className="mt-5 flex justify-center">
            <StatusBadge status="active" />
          </div>
        </AdminCard>
        <AdminCard className="p-5">
          <PanelTitle title="ລາຍລະອຽດບັນຊີ" />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["ບົດບາດ", "ເຈົ້າຂອງທຸລະກິດ"],
              ["ທຸລະກິດ", business.name],
              ["Phone", "+856 20 5555 7890"],
              ["Last Login IP", "IP 10.0.2.18"],
              ["2FA", "ເປີດໃຊ້"],
              ["ສ້າງເມື່ອ", business.joinedOn]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-blue-100 p-4">
                <p className="font800 text-xs text-slate-500">{label}</p>
                <p className="font900 mt-1 text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
      <AdminCard className="mt-5 p-5">
        <PanelTitle title="ກິດຈະກຳຫຼ້າສຸດ" />
        <SimpleList
          records={[
            {
              title: "Login ສຳເລັດ",
              subtitle: "Platform Admin",
              meta: "Today 10:24 AM",
              status: "active"
            },
            {
              title: "ອັບເດດ profile ທຸລະກິດ",
              subtitle: business.name,
              meta: "Yesterday",
              status: "resolved"
            },
            {
              title: "ປ່ຽນແພັກເກດ",
              subtitle: "Business -> Pro",
              meta: "May 16, 2025",
              status: "inProgress"
            }
          ]}
        />
      </AdminCard>
    </>
  );
}

export function PlansPage() {
  return (
    <>
      <PageHeader
        title="ແພັກເກດ"
        description="ຈັດການ pricing plans, limits ແລະ subscription rules."
        action={<AdminButton>ສ້າງແພັກເກດ</AdminButton>}
      />
      <div className="grid gap-5 lg:grid-cols-4">
        {planCards.map((plan) => (
          <AdminCard key={plan.name} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font900 text-xl text-slate-950">{plan.name}</p>
                <p className="mt-1 text-sm text-slate-500">{plan.modules}</p>
              </div>
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <p className="font900 mt-5 text-3xl text-blue-600">{plan.price}</p>
            <p className="mt-3 text-sm text-slate-500">
              {plan.businesses} ທຸລະກິດທີ່ໃຊ້ງານ
            </p>
            <div className="mt-5 space-y-2 text-sm">
              {["ຈຳກັດສາຂາ", "ຈຳກັດ POS device", "ຈຳກັດພະນັກງານ"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>
          </AdminCard>
        ))}
      </div>
    </>
  );
}

export function SubscriptionsPage() {
  return (
    <>
      <PageHeader
        title="ການສະໝັກໃຊ້"
        description="ຕິດຕາມ plan, renewal date, payment status ແລະ lifecycle."
      />
      <AdminCard className="overflow-hidden">
        <FilterBar
          searchPlaceholder="ຄົ້ນຫາການສະໝັກໃຊ້..."
          filters={["ແພັກເກດທັງໝົດ", "ສະຖານະທັງໝົດ", "ວັນຕໍ່ອາຍຸ"]}
        />
        <GenericTable
          headers={[
            "ທຸລະກິດ",
            "ແພັກເກດ",
            "ຮອບບິນ",
            "ຕໍ່ອາຍຸຄັ້ງຕໍ່ໄປ",
            "ຈຳນວນເງິນ",
            "ສະຖານະ",
            "ການກະທຳ"
          ]}
          rows={businesses.map((business) => [
            business.name,
            business.plan,
            "ລາຍເດືອນ",
            "June 17, 2025",
            "K 1,200,000",
            <StatusBadge key="status" status={business.status} />,
            "ຕໍ່ອາຍຸ"
          ])}
        />
      </AdminCard>
    </>
  );
}

export function AddOnsPage() {
  return (
    <>
      <PageHeader
        title="ໂມດູນເສີມ"
        description="ເປີດ/ປິດ add-ons ແລະຈັດການ module access ຂອງ business."
        action={
          <AdminButton href="/platform-admin/add-ons/catalog">ໂມດູນກາງ</AdminButton>
        }
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Customer Display", "1,048 ທຸລະກິດ", "active"],
          ["Staff Order Mobile", "784 ທຸລະກິດ", "active"],
          ["Kitchen Display System", "512 ທຸລະກິດ", "active"],
          ["Advanced Reporting", "388 ທຸລະກິດ", "active"]
        ].map(([title, subtitle, status]) => (
          <AdminCard key={title} className="p-5">
            <Puzzle className="h-8 w-8 text-blue-600" />
            <h2 className="font900 mt-4 text-lg">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
            <div className="mt-5">
              <StatusBadge status={status === "active" ? "active" : "inactive"} />
            </div>
          </AdminCard>
        ))}
      </div>
      <AdminCard className="mt-5 overflow-hidden">
        <FilterBar
          searchPlaceholder="ຄົ້ນຫາ add-on..."
          filters={["ປະເພດໂມດູນ", "ສະຖານະ", "ຂອບເຂດທຸລະກິດ"]}
        />
        <GenericTable
          headers={[
            "Add-on",
            "ໝວດໝູ່",
            "ທຸລະກິດທີ່ເປີດໃຊ້",
            "ຄ່າລາຍເດືອນ",
            "ສະຖານະ",
            "ການກະທຳ"
          ]}
          rows={[
            [
              "Customer Display",
              "Display",
              "1,048",
              "K 20,000",
              <StatusBadge key="s" status="active" />,
              "ຕັ້ງຄ່າ"
            ],
            [
              "Kitchen Display System",
              "Kitchen",
              "512",
              "K 50,000",
              <StatusBadge key="s" status="active" />,
              "ຕັ້ງຄ່າ"
            ],
            [
              "Loyalty Program",
              "CRM",
              "388",
              "K 20,000",
              <StatusBadge key="s" status="active" />,
              "ຕັ້ງຄ່າ"
            ],
            [
              "Online Ordering",
              "Public",
              "214",
              "K 120,000",
              <StatusBadge key="s" status="trial" />,
              "ຕັ້ງຄ່າ"
            ]
          ]}
        />
      </AdminCard>
    </>
  );
}

export function GlobalModulesCatalogPage() {
  return (
    <>
      <PageHeader
        title="ຄັງໂມດູນກາງ"
        description="ກຳນົດ module catalog ກາງທີ່ business ສາມາດເປີດໃຊ້."
        action={<AdminButton>ເພີ່ມໂມດູນ</AdminButton>}
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[
          ["Point of Sale (POS)", "Core", "ຈຳເປັນ"],
          ["Inventory Management", "Core", "ຄ່າຕັ້ງຕົ້ນ"],
          ["Customer Display", "Add-on", "ເລືອກໄດ້"],
          ["Kitchen Display System", "Add-on", "ເລືອກໄດ້"],
          ["QR Public Menu", "Add-on", "ເລືອກໄດ້"],
          ["Advanced Reporting", "Add-on", "ເລືອກໄດ້"]
        ].map(([title, category, rule]) => (
          <AdminCard key={title} className="p-5">
            <Box className="h-8 w-8 text-blue-600" />
            <div className="mt-4 flex items-start justify-between">
              <div>
                <h2 className="font900 text-lg">{title}</h2>
                <p className="mt-1 text-sm text-slate-500">{category}</p>
              </div>
              <span className="font800 rounded-md bg-blue-50 px-3 py-1 text-xs text-blue-700">
                {rule}
              </span>
            </div>
            <div className="mt-5">
              <SettingsRow
                title="ພ້ອມໃຊ້"
                description="ທຸລະກິດສາມາດຂໍເປີດໃຊ້ໂມດູນນີ້."
              />
            </div>
          </AdminCard>
        ))}
      </div>
    </>
  );
}

export function PaymentsPage() {
  return (
    <>
      <PageHeader
        title="ການຊຳລະເງິນ"
        description="ຕິດຕາມ subscription payments, manual confirmation ແລະ transaction status."
        action={
          <AdminButton href="/platform-admin/payments/settings">
            ຕັ້ງຄ່າການຊຳລະ
          </AdminButton>
        }
      />
      <AdminCard className="overflow-hidden">
        <FilterBar
          searchPlaceholder="ຄົ້ນຫາການຊຳລະ..."
          filters={["ສະຖານະ", "ວິທີຊຳລະ", "ທຸລະກິດ"]}
        />
        <GenericTable
          headers={[
            "Payment ID",
            "ທຸລະກິດ",
            "ວິທີ",
            "ຈຳນວນເງິນ",
            "ສະຖານະ",
            "ຊຳລະເມື່ອ",
            "ການກະທຳ"
          ]}
          rows={businesses.map((business, index) => [
            `PAY-2025-${118 - index}`,
            business.name,
            index % 2 === 0 ? "BCEL One" : "Cash",
            "K 1,200,000",
            <StatusBadge key="s" status={index === 5 ? "pending" : "active"} />,
            business.lastActivity,
            "ເບິ່ງ"
          ])}
        />
      </AdminCard>
    </>
  );
}

export function PaymentSettingsPage() {
  const paymentStats = [
    { label: "ວິທີຊຳລະທັງໝົດ", value: "24", tone: "purple", icon: Banknote },
    { label: "ວິທີທີ່ໃຊ້ງານ", value: "19", tone: "green", icon: CheckCircle2 },
    { label: "ທະນາຄານ / QR", value: "13", tone: "blue", icon: Landmark },
    { label: "ປະເພດ POS Payment", value: "6", tone: "orange", icon: Smartphone },
    { label: "ບໍ່ໃຊ້ງານ", value: "5", tone: "red", icon: XCircle }
  ];

  return (
    <>
      <PageHeader
        title="ຕັ້ງຄ່າທະນາຄານ / ການຊຳລະຫຼັກ"
        description="ຈັດການ payment methods, banks, accounts ແລະ settlement settings ຂອງ TJ POS Platform."
        action={<AdminButton>ເພີ່ມວິທີຊຳລະ</AdminButton>}
      />
      <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {paymentStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <AdminCard key={stat.label} className="p-4">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    stat.tone === "green"
                      ? "bg-emerald-50 text-emerald-600"
                      : stat.tone === "purple"
                        ? "bg-violet-50 text-violet-600"
                        : stat.tone === "orange"
                          ? "bg-orange-50 text-orange-600"
                          : stat.tone === "red"
                            ? "bg-red-50 text-red-600"
                            : "bg-blue-50 text-blue-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font800 text-xs text-slate-500">{stat.label}</p>
                  <p className="font900 mt-1 text-2xl leading-7 text-slate-950">
                    {stat.value}
                  </p>
                </div>
              </div>
              <p
                className={`font800 mt-3 text-xs ${stat.tone === "red" ? "text-red-600" : "text-emerald-600"}`}
              >
                ເພີ່ມ 14.3% ຈາກເດືອນກ່ອນ
              </p>
            </AdminCard>
          );
        })}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
        <AdminCard className="overflow-hidden">
          <div className="flex gap-5 overflow-x-auto border-b border-blue-100 px-4 pt-4">
            {[
              "ວິທີຊຳລະ",
              "ທະນາຄານ & ບັນຊີ",
              "ແມ່ແບບ QR Code",
              "ປະເພດ POS Payment",
              "Payment Gateways",
              "Settlement & Fees",
              "ພາສີ & ຄ່າທຳນຽມ"
            ].map((tab, index) => (
              <button
                key={tab}
                type="button"
                className={`font900 cursor-pointer border-b-2 pb-3 text-xs whitespace-nowrap transition ${
                  index === 0
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-600 hover:text-blue-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <FilterBar
            searchPlaceholder="ຄົ້ນຫາວິທີຊຳລະ..."
            filters={["ປະເພດທັງໝົດ", "ສະຖານະທັງໝົດ", "Channel ທັງໝົດ", "ທຸລະກິດທັງໝົດ"]}
          />
          <GenericTable
            headers={[
              "ວິທີຊຳລະ",
              "ປະເພດ",
              "Channel",
              "Provider / Bank",
              "ຮອງຮັບສຳລັບ",
              "ຄ່າຕັ້ງຕົ້ນ",
              "ສະຖານະ",
              "ອັບເດດເມື່ອ",
              "ການກະທຳ"
            ]}
            rows={paymentMethods.map((row, index) => [
              row[0],
              row[1],
              row[2],
              row[3],
              row[4],
              index < 4 ? "★" : "☆",
              <StatusBadge
                key="s"
                status={row[5] === "active" ? "active" : "inactive"}
              />,
              `May ${19 - index}, 2025`,
              "ແກ້ໄຂ"
            ])}
          />
        </AdminCard>
        <div className="space-y-4">
          <AdminCard className="p-4">
            <PanelTitle title="ພາບລວມວິທີຊຳລະ" />
            <div className="flex justify-center">
              <Donut segments={["#10b981", "#0d5bff", "#f97316", "#8b5cf6"]} />
            </div>
          </AdminCard>
          <AdminCard className="p-4">
            <PanelTitle
              title="ແຍກຕາມ Channel"
              action={<AdminButton variant="ghost">ເບິ່ງທັງໝົດ</AdminButton>}
            />
            <SimpleList
              records={[
                { title: "Mobile Banking", subtitle: "8 ວິທີ", meta: "33.3%" },
                { title: "QR Code", subtitle: "7 ວິທີ", meta: "29.2%" },
                { title: "POS Terminal", subtitle: "4 ວິທີ", meta: "16.7%" }
              ]}
            />
          </AdminCard>
          <AdminCard className="p-4">
            <PanelTitle title="ຕົວຢ່າງທະນາຄານ" />
            <div className="grid grid-cols-2 gap-2">
              {["BCEL", "JDB", "LDB", "LAOVIET"].map((bank) => (
                <div
                  key={bank}
                  className="font900 flex h-12 items-center justify-center rounded-lg border border-blue-100 text-xs text-slate-700"
                >
                  {bank}
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>
    </>
  );
}

function GenericTable({
  headers,
  rows
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[13px]">
          <thead className="text-xs text-slate-500">
            <tr>
              {headers.map((head) => (
                <th
                  key={head}
                  className="font900 border-b border-blue-100 px-3.5 py-2.5 whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-blue-50/40">
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${rowIndex}-${cellIndex}`}
                    className="px-3.5 py-2.5 whitespace-pre-line text-slate-700"
                  >
                    {cellIndex === 0 ? (
                      <span className="font900 text-slate-950">{cell}</span>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination />
    </>
  );
}
