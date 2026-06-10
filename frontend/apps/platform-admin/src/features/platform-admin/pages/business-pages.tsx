import {
  ArrowRight,
  Building2,
  CheckSquare,
  Mail,
  Plus,
  Trash2,
  User
} from "lucide-react";

import {
  AdminButton,
  AdminCard,
  BusinessTable,
  Donut,
  FormField,
  FormSection,
  PageHeader,
  PanelTitle,
  SettingsRow,
  SimpleList,
  StatGrid,
  StatusBadge
} from "../components/admin-primitives";
import { businesses, businessStats, planCards } from "../data/mock-platform-admin";

export function BusinessesPage() {
  return (
    <>
      <PageHeader
        title="ທຸລະກິດ"
        description="ຈັດການ ແລະ monitor ທຸລະກິດທັງໝົດໃນ TJ POS Platform."
      />
      <StatGrid stats={businessStats} />
      <BusinessTable rows={businesses} />
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <AdminCard className="p-5">
          <PanelTitle
            title="ການລົງທະບຽນຫຼ້າສຸດ"
            action={<AdminButton variant="ghost">ເບິ່ງທັງໝົດ</AdminButton>}
          />
          <SimpleList
            records={businesses.slice(0, 3).map((business) => ({
              title: business.name,
              subtitle: `${business.location} • ${business.owner}`,
              meta: business.joinedOn,
              status: business.status
            }))}
          />
        </AdminCard>
        <AdminCard className="p-5">
          <PanelTitle title="ຂໍ້ມູນວິເຄາະທຸລະກິດ" />
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <div className="flex items-center justify-center">
              <Donut />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ["ທຸລະກິດໃໝ່", "32"],
                ["ອັບເກຣດ", "18"],
                ["ຢຸດໃຊ້", "6"],
                ["ສາຂາສະເລ່ຍ / ທຸລະກິດ", "2.7"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-blue-100 p-4">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="font900 mt-1 text-2xl text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </AdminCard>
      </div>
    </>
  );
}

export function BusinessDetailPage() {
  const business = businesses[0];

  return (
    <>
      <PageHeader
        title={business.name}
        description="ລາຍລະອຽດທຸລະກິດ, ເຈົ້າຂອງ, ແພັກເກດ, module ແລະ ຄ່າການຊຳລະ."
        action={
          <div className="flex gap-3">
            <AdminButton
              variant="secondary"
              href="/platform-admin/ທຸລະກິດ/BUS-001/edit"
            >
              ແກ້ໄຂ
            </AdminButton>
            <AdminButton>ກຳນົດແພັກເກດ</AdminButton>
          </div>
        }
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <AdminCard className="p-5">
            <PanelTitle title="ພາບລວມທຸລະກິດ" />
            <div className="grid gap-4 md:grid-cols-4">
              {[
                ["Business ID", business.id],
                ["ປະເພດ", business.type],
                ["ແພັກເກດ", business.plan],
                ["ສະຖານະ", "ໃຊ້ງານ"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-blue-50/60 p-4">
                  <p className="font800 text-xs text-slate-500">{label}</p>
                  <p className="font900 mt-2 text-lg text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard className="p-5">
            <PanelTitle title="ບັນຊີເຈົ້າຂອງ" />
            <div className="grid gap-4 md:grid-cols-3">
              <InfoTile icon={User} label="ເຈົ້າຂອງ" value={business.owner} />
              <InfoTile icon={Mail} label="Email" value={business.ownerEmail} />
              <InfoTile icon={Building2} label="ສາຂາ" value={`${business.branches}`} />
            </div>
          </AdminCard>

          <AdminCard className="p-5">
            <PanelTitle title="ໂມດູນ / Add-ons ທີ່ເປີດໃຊ້" />
            <div className="grid gap-3 md:grid-cols-2">
              {[
                "ຂາຍໜ້າຮ້ານ (POS)",
                "ຈັດການສາງ",
                "ຈັດການລູກຄ້າ",
                "ການຂາຍ & ລາຍງານ",
                "ລາຍງານຂັ້ນສູງ",
                "ໂປຣແກຣມສະສົມແຕ້ມ"
              ].map((module) => (
                <div
                  key={module}
                  className="flex items-center gap-3 rounded-lg border border-blue-100 p-3"
                >
                  <CheckSquare className="h-5 w-5 text-blue-600" />
                  <span className="font800 text-sm">{module}</span>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
        <AdminCard className="p-5">
          <PanelTitle title="ສະຫຼຸບທຸລະກິດ" />
          <div className="space-y-4 text-sm">
            {[
              ["ຊື່ທຸລະກິດ", business.name],
              ["ປະເພດທຸລະກິດ", business.type],
              ["ເຈົ້າຂອງ", business.owner],
              ["ແພັກເກດ", "ແພັກເກດ Pro"],
              ["ສາຂາ", "3"],
              ["ໂມດູນໃຊ້ງານ", "6"],
              ["ລາຄາລາຍເດືອນ", "K 1,200,000"]
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <span className="text-slate-500">{label}</span>
                <span className="font900 text-right text-slate-950">{value}</span>
              </div>
            ))}
            <div className="border-t border-blue-100 pt-4 text-center">
              <StatusBadge status="active" />
            </div>
          </div>
        </AdminCard>
      </div>
    </>
  );
}

export function BusinessFormPage({ mode }: { mode: "create" | "edit" }) {
  return (
    <>
      <PageHeader
        title={mode === "create" ? "ສ້າງທຸລະກິດໃໝ່" : "ແກ້ໄຂທຸລະກິດ"}
        description="ກຳນົດຂໍ້ມູນທຸລະກິດ, ບັນຊີເຈົ້າຂອງ, ແພັກເກດ, ສາຂາ ແລະ module."
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5 pb-24">
          <FormSection index={1} title="ຂໍ້ມູນທຸລະກິດ">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="ຊື່ທຸລະກິດ" value="ViengTiane Coffee" required />
              <FormField label="Business Slug" value="vientiane-coffee" required />
              <FormField label="ປະເພດທຸລະກິດ" value="ຮ້ານກາເຟ" required />
              <FormField label="ເບີໂທ" value="+856 20 5555 7890" required />
              <FormField label="Email" value="somkheo.phan@vtcoffee.la" required />
              <FormField label="ເວັບໄຊ" value="https://vtcoffee.la" />
              <FormField label="ທີ່ຢູ່" value="Unit 15, Nongbone Road" required wide />
              <FormField label="ເມືອງ" value="ນະຄອນຫຼວງວຽງຈັນ" required />
              <FormField label="ປະເທດ" value="ລາວ" required />
              <FormField
                label="Timezone"
                value="(GMT+07:00) Indochina Time (ICT)"
                wide
              />
              <div className="rounded-lg border border-blue-100 p-4 md:col-span-2">
                <SettingsRow
                  title="ສະຖານະໃຊ້ງານ"
                  description="ທຸລະກິດຈະເປີດໃຊ້ຫຼັງສ້າງສຳເລັດ."
                />
              </div>
            </div>
          </FormSection>

          <FormSection index={2} title="ບັນຊີເຈົ້າຂອງ">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="ຊື່ເຈົ້າຂອງ" value="Somkheo Phan" required />
              <FormField
                label="Email ເຈົ້າຂອງ"
                value="somkheo.phan@vtcoffee.la"
                required
              />
              <FormField label="ເບີໂທ" value="+856 20 5555 7890" required />
              <FormField label="ລະຫັດຜ່ານຊົ່ວຄາວ" value="VtCoffee@2025!" required />
              <div className="rounded-lg border border-blue-100 p-4 md:col-span-2">
                <SettingsRow
                  title="ສົ່ງ Email ຕ້ອນຮັບ"
                  description="ສົ່ງລາຍລະອຽດ login ໄປຫາເຈົ້າຂອງ."
                />
              </div>
            </div>
          </FormSection>

          <FormSection index={3} title="ແພັກເກດ & ການສະໝັກໃຊ້">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <FormField label="ເລືອກແພັກເກດ" value="ແພັກເກດ Pro" required />
              <FormField label="ຮອບບິນ" value="ລາຍເດືອນ" required />
              <FormField label="ຕໍ່ອາຍຸຄັ້ງຕໍ່ໄປ" value="June 17, 2025" />
              <FormField label="ລາຄາລາຍເດືອນ" value="K 1,200,000" />
            </div>
          </FormSection>

          <div className="grid gap-5 xl:grid-cols-2">
            <FormSection index={4} title="ຕັ້ງຄ່າສາຂາ">
              <div className="space-y-3">
                {["VTC Downtown", "VTC Thatluang"].map((branch, index) => (
                  <div key={branch} className="grid grid-cols-[1fr_1fr_40px] gap-3">
                    <input
                      className="h-9 rounded-md border border-blue-100 px-3 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                      defaultValue={branch}
                      placeholder="ຊື່ສາຂາ"
                    />
                    <input
                      className="h-9 rounded-md border border-blue-100 px-3 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                      defaultValue="ນະຄອນຫຼວງວຽງຈັນ"
                      placeholder="ສະຖານທີ່"
                    />
                    <button
                      type="button"
                      className="flex h-9 w-10 cursor-pointer items-center justify-center rounded-md border border-blue-100 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      {index === 0 ? (
                        <Plus className="h-4 w-4" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))}
                <div className="font800 flex items-center justify-between rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
                  <span>ລວມທັງໝົດ</span>
                  <span>2 ສາຂາ</span>
                </div>
              </div>
            </FormSection>

            <FormSection index={5} title="ໂມດູນ / Add-ons ທີ່ເປີດໃຊ້">
              <div className="space-y-2">
                {[
                  "ຂາຍໜ້າຮ້ານ (POS)",
                  "ຈັດການສາງ",
                  "ຈັດການລູກຄ້າ",
                  "ການຂາຍ & ລາຍງານ",
                  "ໂປຣແກຣມສະສົມແຕ້ມ",
                  "Kitchen Display System"
                ].map((item, index) => (
                  <label
                    key={item}
                    className="font800 flex items-center gap-3 rounded-lg border border-blue-100 p-3 text-sm text-slate-800 transition hover:bg-blue-50"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={index < 4}
                      className="h-4 w-4 accent-blue-600"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </FormSection>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <FormSection index={6} title="ບິນ / ການຊຳລະ">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="ວິທີຊຳລະ" value="ໂອນທະນາຄານ" required />
                <FormField label="ທະນາຄານ" value="LAOVIET Bank" required />
                <FormField label="ເລກບັນຊີ" value="1234 5678 9012" required />
                <FormField
                  label="ຊື່ບັນຊີ"
                  value="ViengTiane Coffee Co., Ltd."
                  required
                />
              </div>
            </FormSection>

            <FormSection index={7} title="Notes (ບໍ່ບັງຄັບ)">
              <textarea
                className="min-h-32 w-full rounded-md border border-blue-100 p-3 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                placeholder="ໝາຍເຫດເພີ່ມເຕີມກ່ຽວກັບທຸລະກິດນີ້..."
                defaultValue="ຮ້ານກາເຟໃໝ່ໃນນະຄອນຫຼວງວຽງຈັນ. ເຈົ້າຂອງມີປະສົບການໃຊ້ retail POS."
              />
              <p className="mt-2 text-right text-xs text-slate-400">100 / 500</p>
            </FormSection>
          </div>
        </div>

        <aside className="sticky top-24 h-fit space-y-5">
          <AdminCard className="p-5">
            <PanelTitle title="ສະຫຼຸບທຸລະກິດ" />
            <p className="mb-4 text-sm leading-5 text-slate-500">
              ກວດລາຍລະອຽດກ່ອນສ້າງທຸລະກິດໃໝ່.
            </p>
            <div className="space-y-3 text-sm">
              {[
                ["ຊື່ທຸລະກິດ", "ViengTiane Coffee"],
                ["ປະເພດທຸລະກິດ", "ຮ້ານກາເຟ"],
                ["ເຈົ້າຂອງ", "Somkheo Phan"],
                ["ແພັກເກດ", "ແພັກເກດ Pro"],
                ["ສາຂາ", "2"],
                ["ໂມດູນໃຊ້ງານ", "5"],
                ["ລາຄາລາຍເດືອນ", "K 1,200,000"]
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-slate-500">{label}</span>
                  <strong className="font900 text-right text-slate-950">{value}</strong>
                </div>
              ))}
              <div className="border-t border-blue-100 pt-3 text-center">
                <StatusBadge status="active" />
              </div>
            </div>
          </AdminCard>

          <AdminCard className="p-5">
            <PanelTitle title="ຕ້ອງການຊ່ວຍເຫຼືອ?" />
            <p className="text-sm leading-5 text-slate-500">
              ສາມາດແກ້ໄຂການຕັ້ງຄ່າໄດ້ພາຍຫຼັງຈາກໜ້າລາຍລະອຽດທຸລະກິດ.
            </p>
            <AdminButton variant="ghost" icon={ArrowRight}>
              ເບິ່ງເພີ່ມ
            </AdminButton>
          </AdminCard>
        </aside>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed right-0 bottom-0 left-0 z-30 flex justify-between border-t border-blue-100 bg-white/95 px-6 py-4 backdrop-blur xl:left-[230px]">
        <AdminButton variant="secondary" href="/platform-admin/businesses">
          ຍົກເລີກ
        </AdminButton>
        <div className="flex gap-3">
          <AdminButton variant="secondary">ບັນທຶກເປັນ Draft</AdminButton>
          <AdminButton icon={ArrowRight}>
            {mode === "create" ? "ສ້າງທຸລະກິດ" : "ບັນທຶກການແກ້ໄຂ"}
          </AdminButton>
        </div>
      </div>
    </>
  );
}

export function AssignPlanPage() {
  return (
    <>
      <PageHeader
        title="ກຳນົດແພັກເກດ"
        description="ເລືອກແພັກເກດ ແລະ billing cycle ໃຫ້ business."
      />
      <div className="grid gap-5 lg:grid-cols-4">
        {planCards.map((plan) => (
          <AdminCard key={plan.name} className="p-5">
            <p className="font900 text-xl text-slate-950">{plan.name}</p>
            <p className="font900 mt-3 text-3xl text-blue-600">{plan.price}</p>
            <p className="mt-2 text-sm text-slate-500">
              {`${plan.businesses} businesses`}
            </p>
            <p className="mt-4 rounded-md bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">
              {plan.modules}
            </p>
            <button
              type="button"
              className="font900 mt-5 h-11 w-full rounded-md bg-blue-600 text-white"
            >
              ກຳນົດແພັກເກດ
            </button>
          </AdminCard>
        ))}
      </div>
    </>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-blue-100 p-4">
      <Icon className="h-5 w-5 text-blue-600" />
      <p className="font800 mt-3 text-xs text-slate-500">{label}</p>
      <p className="font900 mt-1 text-slate-950">{value}</p>
    </div>
  );
}
