import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  HeartPulse,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Star,
  Timer,
  UserRound,
  Users,
  WalletCards
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { BusinessAdminLink } from "../components/business-admin-link";
import { PageHeader } from "../components/business-admin-primitives";
import { BusinessAdminShell } from "../layouts/business-admin-shell";
import type { BusinessMenuKey } from "../types";

const beautyBusiness = "TJ Beauty & Spa";

const appointmentStats = [
  ["Total Appointments", "28", CalendarCheck, "bg-pink-50 text-pink-600"],
  ["Confirmed", "24", CheckCircle2, "bg-emerald-50 text-emerald-600"],
  ["ກຳລັງດຳເນີນ", "5", Timer, "bg-amber-50 text-amber-600"],
  ["ສຳເລັດ", "12", CheckCircle2, "bg-emerald-50 text-emerald-600"],
  ["No Show", "1", Users, "bg-rose-50 text-rose-600"]
] as const;

const staffMembers = [
  {
    name: "Nina",
    role: "ຊ່າງເລັບ",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80",
    appointments: 6
  },
  {
    name: "Mali",
    role: "ຊ່າງຜົມ",
    image:
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=96&q=80",
    appointments: 8
  },
  {
    name: "Pim",
    role: "ນັກບຳບັດ",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=96&q=80",
    appointments: 7
  },
  {
    name: "Aommin",
    role: "ນັກບຳບັດ",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=96&q=80",
    appointments: 5
  }
];

const appointmentBlocks = [
  {
    staff: "Nina",
    time: "09:50",
    customer: "Somchay K.",
    service: "ແຕ່ງເລັບມື",
    top: "22%",
    color: "border-amber-200 bg-amber-50 text-amber-700"
  },
  {
    staff: "Mali",
    time: "10:00",
    customer: "Kanya L.",
    service: "ຕັດຜົມ & ເປົ່າຜົມ",
    top: "32%",
    color: "border-pink-200 bg-pink-50 text-pink-700"
  },
  {
    staff: "Aommin",
    time: "10:30",
    customer: "Natthavone P.",
    service: "ບຳລຸງໜ້າ",
    top: "36%",
    color: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700"
  },
  {
    staff: "Nina",
    time: "12:20",
    customer: "ລູກຄ້າ Walk-in",
    service: "ທາສີເລັບ Gel",
    top: "56%",
    color: "border-violet-200 bg-violet-50 text-violet-700"
  },
  {
    staff: "Mali",
    time: "13:00",
    customer: "Phutsada M.",
    service: "ຍ້ອມຜົມ",
    top: "66%",
    color: "border-sky-200 bg-sky-50 text-sky-700"
  },
  {
    staff: "Pim",
    time: "13:00",
    customer: "Phanousa S.",
    service: "ນວດໄທ",
    top: "66%",
    color: "border-emerald-200 bg-emerald-50 text-emerald-700"
  },
  {
    staff: "Nina",
    time: "15:20",
    customer: "Thida K.",
    service: "ຕໍ່ເລັບ Acrylic",
    top: "84%",
    color: "border-orange-200 bg-orange-50 text-orange-700"
  },
  {
    staff: "Aommin",
    time: "16:00",
    customer: "Kritsana J.",
    service: "ບຳລຸງຜົມ",
    top: "90%",
    color: "border-pink-300 bg-pink-100 text-pink-800"
  }
];

const services = [
  ["ຕັດຜົມ", "ຜົມ", "45 min", "120,000", "ເປີດໃຊ້"],
  ["ຕັດຜົມ & ເປົ່າຜົມ", "ຜົມ", "60 min", "180,000", "ເປີດໃຊ້"],
  ["ຍ້ອມຜົມ", "ຜົມ", "120 min", "350,000", "ເປີດໃຊ້"],
  ["ບຳລຸງຜົມ", "ຜົມ", "60 min", "200,000", "ເປີດໃຊ້"],
  ["ຕໍ່ເລັບ Acrylic", "ເລັບ", "120 min", "250,000", "ເປີດໃຊ້"],
  ["ທາສີເລັບ Gel", "ເລັບ", "60 min", "120,000", "ເປີດໃຊ້"],
  ["ແຕ່ງເລັບມື", "ເລັບ", "45 min", "80,000", "ເປີດໃຊ້"],
  ["ແຕ່ງເລັບຕີນ", "ເລັບ", "60 min", "100,000", "ເປີດໃຊ້"],
  ["ນວດໄທ", "ສະປາ & ຮ່າງກາຍ", "90 min", "220,000", "ເປີດໃຊ້"],
  ["ນວດ Aroma", "ສະປາ & ຮ່າງກາຍ", "60 min", "180,000", "ເປີດໃຊ້"],
  ["ບຳລຸງໜ້າ", "ໃບໜ້າ", "60 min", "200,000", "ເປີດໃຊ້"],
  ["ແຕ່ງຄິ້ວ", "ໃບໜ້າ", "20 min", "50,000", "ເປີດໃຊ້"]
];

const packages = [
  ["ແພັກເກດດູແລຜົມ", "ຜົມ", "1,200,000", "5", "90 days", "ເປີດໃຊ້"],
  ["ແພັກເກດຄົນຮັກເລັບ", "ເລັບ", "800,000", "5", "60 days", "ເປີດໃຊ້"],
  ["ແພັກເກດນວດໄທ", "ສະປາ & ຮ່າງກາຍ", "1,500,000", "5", "90 days", "ເປີດໃຊ້"],
  ["ແພັກເກດໜ້າໃສ", "ໃບໜ້າ", "1,000,000", "5", "60 days", "ເປີດໃຊ້"]
];

const packageSessions = [
  [
    "Kanya Phongsavath",
    "ແພັກເກດດູແລຜົມ",
    "2 / 5",
    "May 10, 2025",
    "May 24, 2025",
    "ເປີດໃຊ້"
  ],
  [
    "Somchay Keomany",
    "ແພັກເກດນວດໄທ",
    "1 / 5",
    "May 02, 2025",
    "May 23, 2025",
    "ເປີດໃຊ້"
  ],
  [
    "Natthavone Phommala",
    "ແພັກເກດໜ້າໃສ",
    "3 / 5",
    "May 14, 2025",
    "May 28, 2025",
    "ເປີດໃຊ້"
  ]
];

const customerHistory = [
  ["May 10, 2025", "ຕັດຜົມ & ເປົ່າຜົມ", "Mali", "LAK 180,000"],
  ["May 02, 2025", "ຍ້ອມຜົມ", "Mali", "LAK 350,000"],
  ["Apr 20, 2025", "ຕໍ່ເລັບ Acrylic", "Nina", "LAK 250,000"],
  ["Apr 12, 2025", "ນວດໄທ", "Pim", "LAK 220,000"],
  ["Mar 25, 2025", "ບຳລຸງໜ້າ", "Aommin", "LAK 200,000"]
];

const upcomingAppointments = [
  ["10:30 AM", "Kanya Phongsavath", "ຕັດຜົມ & ເປົ່າຜົມ", "Mali"],
  ["11:30 AM", "Somchay Keomany", "ຍ້ອມຜົມ", "Mali"],
  ["01:00 PM", "Natthavone Phommala", "ບຳລຸງໜ້າ", "Aommin"],
  ["02:30 PM", "ລູກຄ້າ Walk-in", "ທາສີເລັບ Gel", "Nina"],
  ["03:30 PM", "Thida Review", "ນວດໄທ", "Pim"]
];

function BeautyPage({
  active,
  title,
  description,
  actions,
  children
}: {
  active: BusinessMenuKey;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <BusinessAdminShell active={active} businessLabel={beautyBusiness}>
      <PageHeader title={title} description={description} actions={actions} />
      {children}
    </BusinessAdminShell>
  );
}

function BeautyButton({
  children,
  href,
  icon: Icon = Plus,
  variant = "primary"
}: {
  children: ReactNode;
  href?: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "bg-pink-500 text-white shadow-[0_12px_22px_rgba(236,72,153,0.24)] hover:bg-pink-600"
      : "border border-pink-100 bg-white text-slate-900 hover:border-pink-200 hover:bg-pink-50";
  const body = (
    <>
      <Icon className="h-4 w-4" />
      {children}
    </>
  );

  if (href) {
    return (
      <BusinessAdminLink
        href={href}
        className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-black transition ${className}`}
      >
        {body}
      </BusinessAdminLink>
    );
  }

  return (
    <button
      type="button"
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-black transition ${className}`}
    >
      {body}
    </button>
  );
}

function BeautyCard({
  title,
  action,
  children,
  className = ""
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`min-w-0 rounded-lg border border-pink-100 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.045)] ${className}`}
    >
      {title || action ? (
        <div className="flex items-center justify-between gap-3 border-b border-pink-50 px-4 py-3">
          {title ? (
            <h2 className="text-[15px] font-black text-slate-950">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

function BeautyTabs({ tabs, active }: { tabs: string[]; active: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={`h-9 rounded-md px-4 text-xs font-black transition ${
            tab === active
              ? "bg-pink-50 text-pink-600"
              : "bg-white text-slate-500 hover:bg-pink-50 hover:text-pink-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function BeautyIconButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-pink-100 bg-white text-slate-500 transition hover:-translate-y-0.5 hover:bg-pink-50 hover:text-pink-600 hover:shadow-sm"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function StaffAvatar({ staff }: { staff: (typeof staffMembers)[number] }) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="h-9 w-9 rounded-full bg-cover bg-center ring-2 ring-pink-50"
        style={{ backgroundImage: `url(${staff.image})` }}
      />
      <span>
        <span className="block text-xs font-black text-slate-950">{staff.name}</span>
        <span className="block text-[10px] font-bold text-slate-400">
          {staff.role}
        </span>
      </span>
    </div>
  );
}

function StatusPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-600">
      {children}
    </span>
  );
}

function MiniCalendar() {
  const days = Array.from({ length: 31 }, (_, index) => index + 1);

  return (
    <BeautyCard>
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <button type="button" className="text-slate-400">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-black text-slate-950">
            {"ພຶດສະພາ 2025"}
          </span>
          <button type="button" className="text-slate-400">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400">
          {["ຈ", "ອ", "ພ", "ພຫ", "ສ", "ສອ", "ອາ"].map((day) => (
            <span key={day}>{day}</span>
          ))}
          {days.map((day) => (
            <span
              key={day}
              className={`flex h-7 items-center justify-center rounded-full ${
                day === 18
                  ? "bg-pink-500 text-white"
                  : day % 5 === 0
                    ? "text-pink-500"
                    : "text-slate-600"
              }`}
            >
              {day}
            </span>
          ))}
        </div>
      </div>
    </BeautyCard>
  );
}

function AreaSummary() {
  return (
    <BeautyCard>
      <div className="space-y-3 p-4">
        {[
          ["ທຸກໂຊນ", "3", "bg-pink-500"],
          ["ໂຊນເລັບ", "3", "bg-emerald-400"],
          ["ສະຖານີຜົມ", "4", "bg-sky-400"],
          ["ຫ້ອງສະປາ 1", "2", "bg-emerald-300"],
          ["ຫ້ອງສະປາ 2", "1", "bg-rose-300"],
          ["ຫ້ອງ VIP", "1", "bg-pink-300"]
        ].map(([label, count, dot]) => (
          <div
            key={label}
            className="flex items-center justify-between text-xs font-black text-slate-600"
          >
            <span className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
              {label}
            </span>
            <span>{count}</span>
          </div>
        ))}
      </div>
    </BeautyCard>
  );
}

export function AppointmentCalendarPage() {
  return (
    <BeautyPage
      active="ນັດໝາຍ"
      title="ນັດໝາຍ — ປະຈຳມື້"
      description="ຕາຕະລາງນັດໝາຍຂອງພະນັກງານ ແລະ ລູກຄ້າ."
      actions={
        <div className="flex items-center gap-2">
          <BeautyButton variant="secondary" icon={CalendarDays}>
            Filter
          </BeautyButton>
          <BeautyButton href="/business-admin/appointments/create">
            New Appointment
          </BeautyButton>
        </div>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <MiniCalendar />
          <AreaSummary />
        </aside>
        <BeautyCard>
          <div className="border-b border-pink-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  className="rounded-md border border-pink-100 p-2 text-slate-500"
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-black text-slate-950">
                  {"18 ພຶດສະພາ 2025"}
                </span>
                <button
                  className="rounded-md border border-pink-100 p-2 text-slate-500"
                  type="button"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <BeautyTabs tabs={["ມື້", "ອາທິດ", "Month", "Today"]} active="ອາທິດ" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[880px]">
              <div className="grid grid-cols-[76px_repeat(4,1fr)] border-b border-pink-50">
                <span className="px-4 py-3 text-xs font-black text-slate-400">
                  {"ເວລາ"}
                </span>
                {staffMembers.slice(0, 4).map((staff) => (
                  <div key={staff.name} className="px-4 py-3">
                    <StaffAvatar staff={staff} />
                  </div>
                ))}
              </div>
              <div className="relative grid grid-cols-[76px_repeat(4,1fr)]">
                <div className="border-r border-pink-50">
                  {[
                    "09:00",
                    "10:00",
                    "11:00",
                    "12:00",
                    "13:00",
                    "14:00",
                    "15:00",
                    "16:00",
                    "17:00"
                  ].map((time) => (
                    <div
                      key={time}
                      className="h-[68px] border-b border-pink-50 px-4 py-2 text-[11px] font-bold text-slate-400"
                    >
                      {time}
                    </div>
                  ))}
                </div>
                {staffMembers.slice(0, 4).map((staff) => (
                  <div
                    key={staff.name}
                    className="relative border-r border-pink-50 last:border-r-0"
                  >
                    {Array.from({ length: 9 }, (_, index) => (
                      <div key={index} className="h-[68px] border-b border-pink-50" />
                    ))}
                    {appointmentBlocks
                      .filter((block) => block.staff === staff.name)
                      .map((block) => (
                        <div
                          key={`${block.staff}-${block.time}-${block.customer}`}
                          className={`absolute right-3 left-3 rounded-md border p-2 text-[11px] font-black shadow-sm ${block.color}`}
                          style={{ top: block.top }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span>{block.time}</span>
                            <MoreVertical className="h-3 w-3" />
                          </div>
                          <p className="mt-1">{block.customer}</p>
                          <p className="font-bold opacity-75">
                            {block.service}
                          </p>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-5 border-t border-pink-50 p-4 text-[11px] font-black text-slate-500">
            {[
              ["Confirmed", "bg-emerald-400"],
              ["Arrived", "bg-violet-400"],
              ["ກຳລັງດຳເນີນ", "bg-amber-400"],
              ["ສຳເລັດ", "bg-sky-400"],
              ["ຍົກເລີກ", "bg-pink-400"],
              ["No Show", "bg-slate-300"]
            ].map(([label, dot]) => (
              <span key={label} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                {label}
              </span>
            ))}
          </div>
        </BeautyCard>
      </div>
    </BeautyPage>
  );
}

// ── Monthly calendar view — used by /calendar route (ປະຕິທິນ menu)
export function AppointmentCalendarMonthPage() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const startOffset = 2; // May 2025 starts on Thursday (index 2)
  // sample appointments scattered around the month
  const apptDots: Record<number, { color: string; label: string }[]> = {
    2: [{ color: "bg-pink-400", label: "Kanya - Hair" }],
    5: [{ color: "bg-violet-400", label: "Somchay - Nails" }],
    8: [{ color: "bg-amber-400", label: "Natthavone - Facial" }],
    10: [
      { color: "bg-pink-400", label: "Mali - Walk-in" },
      { color: "bg-emerald-400", label: "Pim - Massage" }
    ],
    14: [{ color: "bg-sky-400", label: "Thida - Nails" }],
    18: [
      { color: "bg-pink-400", label: "Kanya - Dye" },
      { color: "bg-fuchsia-400", label: "Walk-in - Nail" },
      { color: "bg-violet-400", label: "Bounlie - Cut" }
    ],
    19: [{ color: "bg-emerald-400", label: "Kritsana - Spa" }],
    22: [{ color: "bg-amber-400", label: "Phanousa - Facial" }],
    24: [
      { color: "bg-pink-400", label: "Mali - Blow" },
      { color: "bg-sky-400", label: "Nina - Gel" }
    ],
    28: [{ color: "bg-rose-400", label: "Natthavone - Wax" }],
    30: [{ color: "bg-pink-400", label: "Kanya - Trim" }]
  };

  const totalCells = startOffset + 31;
  const gridSize = Math.ceil(totalCells / 7) * 7;

  return (
    <BeautyPage
      active="ປະຕິທິນ"
      title="ປະຕິທິນ"
      description="ພາບລວມນັດໝາຍ ແລະ ຖ້ຽວວຽກທຸກວັນໃນເດືອນ."
      actions={
        <div className="flex items-center gap-2">
          <BeautyButton variant="secondary" icon={ChevronLeft}>Prev</BeautyButton>
          <span className="min-w-[150px] text-center text-sm font-black text-slate-950">
            ພຶດສະພາ 2025
          </span>
          <BeautyButton variant="secondary" icon={ChevronRight}>Next</BeautyButton>
          <BeautyButton href="/business-admin/appointments/create">+ ນັດໝາຍ</BeautyButton>
        </div>
      }
    >
      <BeautyCard>
        {/* stats strip */}
        <div className="grid grid-cols-2 gap-4 border-b border-pink-50 p-4 md:grid-cols-4">
          {[
            ["ທັງໝົດ", "86", "text-slate-950"],
            ["Confirmed", "72", "text-emerald-600"],
            ["ກຳລັງດຳເນີນ", "8", "text-amber-600"],
            ["No Show", "6", "text-rose-500"]
          ].map(([label, val, color]) => (
            <div key={label as string} className="text-center">
              <p className={`text-2xl font-black ${color}`}>{val}</p>
              <p className="mt-0.5 text-[11px] font-bold text-slate-400">{label}</p>
            </div>
          ))}
        </div>
        {/* weekday headers */}
        <div className="grid grid-cols-7 border-b border-pink-50">
          {["ຈ", "ອ", "ພ", "ພຫ", "ສ", "ສອ", "ອາ"].map((d) => (
            <div
              key={d}
              className="py-3 text-center text-[11px] font-black text-slate-400"
            >
              {d}
            </div>
          ))}
        </div>
        {/* day grid */}
        <div className="grid grid-cols-7">
          {Array.from({ length: gridSize }, (_, idx) => {
            const dayNum = idx - startOffset + 1;
            const isCurrentMonth = dayNum >= 1 && dayNum <= 31;
            const isToday = dayNum === 18;
            const appts = apptDots[dayNum] ?? [];
            const isWeekend = idx % 7 >= 5;

            return (
              <div
                key={idx}
                className={`relative min-h-[100px] border-b border-r border-pink-50 p-2 transition hover:bg-pink-50/40 ${
                  isWeekend && isCurrentMonth ? "bg-pink-50/20" : ""
                } ${!isCurrentMonth ? "bg-slate-50/40" : ""}`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
                    isToday
                      ? "bg-pink-500 text-white"
                      : isCurrentMonth
                        ? "text-slate-700"
                        : "text-slate-300"
                  }`}
                >
                  {isCurrentMonth ? dayNum : ""}
                </span>
                {isCurrentMonth && appts.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {appts.slice(0, 2).map((a, ai) => (
                      <div
                        key={ai}
                        className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-black ${a.color.replace("bg-", "bg-")}`}
                        style={{ color: "inherit" }}
                      >
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${a.color}`} />
                        <span className="truncate text-slate-700">{a.label}</span>
                      </div>
                    ))}
                    {appts.length > 2 && (
                      <p className="pl-1 text-[10px] font-black text-pink-500">
                        +{appts.length - 2} ເພີ່ມ
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </BeautyCard>
    </BeautyPage>
  );
}

export function CreateAppointmentPage() {
  return (
    <BeautyPage
      active="ປະຕິທິນ"
      title="ສ້າງນັດໝາຍ"
      description="Create an appointment with customer, service, staff, and deposit details."
    >
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="space-y-4">
          <BeautyCard title="ລູກຄ້າ">
            <div className="flex items-center gap-4 p-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-xl font-black text-pink-600">
                KP
              </span>
              <div className="min-w-0 flex-1">
                <label className="relative block">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className="h-11 w-full rounded-md border border-pink-100 pl-10 text-sm font-bold outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-50"
                    defaultValue="Kanya Phongsavath"
                  />
                </label>
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  020 5566 7788 - VIP member
                </p>
              </div>
              <BeautyIconButton icon={Pencil} label="Edit customer" />
            </div>
          </BeautyCard>
          <BeautyCard title="Appointment Details">
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <BeautyField label="Date" value="May 20, 2025" />
              <BeautyField label="ເວລາ" value="10:30 AM" />
              <BeautyField label="Service" value="ຕັດຜົມ & ເປົ່າຜົມ" />
              <BeautyField label="ໄລຍະເວລາ" value="60 min" />
              <BeautyField label="ພະນັກງານ" value="Mali (Hair Stylist)" />
              <BeautyField label="Room / Area" value="Hair Station 1" />
              <BeautyField
                label="ໝາຍເຫດ"
                value="Customer prefers layered cut."
                full
                textarea
              />
            </div>
          </BeautyCard>
          <BeautyCard title="ນະໂຍບາຍມັດຈຳ">
            <div className="grid gap-4 p-4 md:grid-cols-3">
              <ToggleLine title="ຕ້ອງມັດຈຳ" enabled />
              <BeautyField label="Deposit Type" value="Percentage (%)" />
              <BeautyField label="ຈຳນວນເງິນ" value="20% (LAK 36,000)" />
            </div>
          </BeautyCard>
        </div>
        <BeautyCard title="Appointment Preview">
          <div className="space-y-4 p-4">
            <div className="rounded-lg bg-pink-50 p-4">
              <p className="text-xs font-black text-pink-600">
                May 20, 2025 - 10:30 AM
              </p>
              <h3 className="mt-2 text-xl font-black text-slate-950">
                Hair Cut & Blow Dry
              </h3>
              <p className="mt-1 text-sm font-bold text-slate-500">
                Mali - Hair Station 1
              </p>
            </div>
            {[
              ["Service Amount", "LAK 180,000"],
              ["Deposit", "LAK 36,000"],
              ["Balance Due", "LAK 144,000"]
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-500">{label}</span>
                <span className="font-black text-slate-950">{value}</span>
              </div>
            ))}
            <div className="grid gap-3 pt-4">
              <BeautyButton>Create Appointment</BeautyButton>
              <BeautyButton
                variant="secondary"
                icon={ChevronLeft}
                href="/business-admin/calendar"
              >
                Cancel
              </BeautyButton>
            </div>
          </div>
        </BeautyCard>
      </div>
    </BeautyPage>
  );
}

export function BeautyServicesPage() {
  return (
    <BeautyPage
      active="ບໍລິການ"
      title="ບໍລິການ"
      description="Manage your salon services and durations."
      actions={<BeautyButton>Add Service</BeautyButton>}
    >
      <BeautyCard>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-50 p-4">
          <BeautyTabs
            tabs={["All Service", "ຜົມ", "ເລັບ", "ສະປາ & ຮ່າງກາຍ", "ໃບໜ້າ", "Children"]}
            active="All Service"
          />
          <label className="relative w-full max-w-xs">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-10 w-full rounded-md border border-pink-100 pr-3 pl-10 text-sm font-bold outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-50"
              placeholder="Search services..."
            />
          </label>
        </div>
        <BeautyTable
          headers={[
            "Service Name",
            "ໝວດໝູ່",
            "ໄລຍະເວລາ",
            "Price (LAK)",
            "ສະຖານະ",
            "ການດຳເນີນການ"
          ]}
          rows={services.map((service) => [
            <span className="font-black text-slate-950">{service[0]}</span>,
            service[1],
            service[2],
            service[3],
            <StatusPill>{service[4]}</StatusPill>,
            <ActionCell />
          ])}
        />
      </BeautyCard>
    </BeautyPage>
  );
}

export function BeautyStaffSchedulePage() {
  return (
    <BeautyPage
      active="ຕາຕະລາງພະນັກງານ"
      title="ຕາຕະລາງພະນັກງານ"
      description="Manage staff working hours and availability."
      actions={<BeautyButton>Add Shift</BeautyButton>}
    >
      <BeautyCard>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-50 p-4">
          <div className="flex items-center gap-2 text-sm font-black text-slate-950">
            <button
              className="rounded-md border border-pink-100 p-2 text-slate-500"
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {"18 - 24 ພຶດສະພາ 2025"}
            <button
              className="rounded-md border border-pink-100 p-2 text-slate-500"
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <BeautyTabs tabs={["ອາທິດ", "Month"]} active="ອາທິດ" />
        </div>
        <div className="overflow-x-auto p-4">
          <div className="min-w-[920px]">
            <div className="grid grid-cols-[170px_repeat(7,1fr)] gap-2 text-xs font-black text-slate-500">
              <span>{"ພະນັກງານ"}</span>
              {[
                "ອາ 18",
                "ຈ 19",
                "ອ 20",
                "ພ 21",
                "ພຫ 22",
                "ສ 23",
                "ສອ 24"
              ].map((day) => (
                <span key={day} className="text-center">
                  {day}
                </span>
              ))}
            </div>
            <div className="mt-3 space-y-3">
              {staffMembers
                .concat([
                  {
                    name: "May",
                    role: "ຊ່າງເລັບ",
                    image:
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&q=80",
                    appointments: 3
                  },
                  {
                    name: "Bounlie",
                    role: "ຊ່າງຜົມ",
                    image:
                      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=96&q=80",
                    appointments: 4
                  }
                ])
                .map((staff, staffIndex) => (
                  <div
                    key={staff.name}
                    className="grid grid-cols-[170px_repeat(7,1fr)] items-center gap-2"
                  >
                    <StaffAvatar staff={staff} />
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const off = (staffIndex + dayIndex) % 6 === 0;
                      return (
                        <span
                          key={`${staff.name}-${dayIndex}`}
                          className={`flex h-10 items-center justify-center rounded-md text-[11px] font-black ${
                            off
                              ? "bg-slate-50 text-slate-400"
                              : "bg-pink-50 text-pink-600"
                          }`}
                        >
                          {off
                            ? "ມື້ພັກ"
                            : dayIndex % 2 === 0
                              ? "08:00 - 18:00"
                              : "10:00 - 19:00"}
                        </span>
                      );
                    })}
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-6 border-t border-pink-50 p-4 text-xs font-black text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />{" "}
            {"ກຳລັງເຮັດວຽກ"}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />{" "}
            {"ມື້ພັກ"}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />{" "}
            {"ພັກຊົ່ວຄາວ"}
          </span>
        </div>
      </BeautyCard>
    </BeautyPage>
  );
}

export function BeautyPackagesPage() {
  return (
    <BeautyPage
      active="ແພັກເກດ"
      title="ແພັກເກດ"
      description="Manage treatment packages and customer sessions."
      actions={<BeautyButton>New Package</BeautyButton>}
    >
      <div className="space-y-5">
        <BeautyCard>
          <div className="border-b border-pink-50 p-4">
            <BeautyTabs
              tabs={["Active Packages", "Expired Packages"]}
              active="Active Packages"
            />
          </div>
          <BeautyTable
            headers={[
              "Package Name",
              "ໝວດໝູ່",
              "Price (LAK)",
              "Sessions",
              "Validity",
              "ສະຖານະ",
              "ການດຳເນີນການ"
            ]}
            rows={packages.map((pkg) => [
              <span className="font-black text-slate-950">{pkg[0]}</span>,
              pkg[1],
              pkg[2],
              pkg[3],
              pkg[4],
              <StatusPill>{pkg[5]}</StatusPill>,
              <ActionCell />
            ])}
          />
        </BeautyCard>
        <BeautyCard title="Recent Package Sessions">
          <BeautyTable
            headers={[
              "ລູກຄ້າ",
              "Package",
              "Used / Total",
              "Last Session",
              "Next Session",
              "ສະຖານະ"
            ]}
            rows={packageSessions.map((row) => [
              <span className="font-black text-slate-950">{row[0]}</span>,
              row[1],
              row[2],
              row[3],
              row[4],
              <StatusPill>{row[5]}</StatusPill>
            ])}
          />
        </BeautyCard>
      </div>
    </BeautyPage>
  );
}

export function BeautyCustomerHistoryPage() {
  return (
    <BeautyPage
      active="ລູກຄ້າ"
      title="Customer Profile"
      description="Review beauty service history, notes, packages, and preferences."
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <BeautyCard>
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-5">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-100 text-2xl font-black text-pink-600">
                KP
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-black text-slate-950">
                  Kanya Phongsavath
                </h2>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  020 5566 7788 - kanya.personal.com
                </p>
              </div>
              <span className="rounded-md bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">
                VIP
              </span>
              <span className="rounded-md bg-pink-100 px-3 py-1 text-xs font-black text-pink-700">
                Member
              </span>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {[
                ["Total Visits", "24"],
                ["Total Spent", "LAK 3,450,000"],
                ["Outstanding", "LAK 0"],
                ["Loyalty Points", "1,250"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="text-[11px] font-black text-slate-400">{label}</p>
                  <p className="mt-2 text-sm font-black text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="border-y border-pink-50 px-4 py-3">
            <BeautyTabs
              tabs={["History", "ໝາຍເຫດ", "Package", "Preferences"]}
              active="History"
            />
          </div>
          <BeautyTable
            headers={["Date", "Service", "ພະນັກງານ", "ຈຳນວນເງິນ"]}
            rows={customerHistory.map((row) => [row[0], row[1], row[2], row[3]])}
          />
        </BeautyCard>
        <BeautyCard title="Customer Notes">
          <div className="space-y-4 p-4">
            <div className="rounded-lg bg-blue-50 p-4 text-sm leading-6 font-semibold text-slate-700">
              Prefers soft brown color. Sensitive scalp. Avoid strong chemical smell.
            </div>
            <div className="rounded-lg bg-pink-50 p-4">
              <p className="text-xs font-black text-pink-600">Last package</p>
              <p className="mt-2 text-lg font-black text-slate-950">
                Hair Care Package
              </p>
              <p className="mt-1 text-sm font-bold text-slate-500">
                2 of 5 sessions used
              </p>
            </div>
            <p className="text-xs font-semibold text-slate-400">
              Last updated by Mali on May 10, 2025
            </p>
          </div>
        </BeautyCard>
      </div>
    </BeautyPage>
  );
}

export function DepositPolicyPage() {
  return (
    <BeautyPage
      active="ນະໂຍບາຍມັດຈຳ"
      title="Deposit & Cancellation Policy"
      description="Configure deposit requirements and cancellation rules."
      actions={<BeautyButton icon={WalletCards}>Save Deposit Policy</BeautyButton>}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <BeautyCard>
          <div className="border-b border-pink-50 p-4">
            <BeautyTabs
              tabs={["ນະໂຍບາຍມັດຈຳ", "Cancellation Policy"]}
              active="ນະໂຍບາຍມັດຈຳ"
            />
          </div>
          <div className="space-y-5 p-5">
            <ToggleLine title="Require Deposit for Appointments" enabled />
            <div className="grid gap-4 md:grid-cols-2">
              <BeautyField label="Deposit Type" value="Percentage (%)" />
              <BeautyField label="Deposit Percentage" value="20%" />
              <BeautyField label="Minimum Deposit (LAK)" value="50,000" />
              <BeautyField label="Applicable Services" value="All Services" />
            </div>
            <div className="rounded-lg border border-pink-100 bg-pink-50/60 p-4">
              <h3 className="text-sm font-black text-slate-950">Cancellation Rule</h3>
              <p className="mt-2 text-sm leading-6 font-semibold text-slate-600">
                Deposit is refundable when customer cancels at least 12 hours before the
                appointment. Late cancellation keeps the deposit as service credit.
              </p>
            </div>
          </div>
        </BeautyCard>
        <BeautyCard title="Preview">
          <div className="space-y-4 p-4">
            {[
              ["Service Amount", "LAK 180,000"],
              ["Deposit (20%)", "LAK 36,000"],
              ["Balance Due", "LAK 144,000"]
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-500">{label}</span>
                <span className="font-black text-slate-950">{value}</span>
              </div>
            ))}
            <div className="rounded-lg bg-slate-50 p-4 text-xs leading-5 font-semibold text-slate-500">
              This preview appears during appointment creation and payment checkout.
            </div>
          </div>
        </BeautyCard>
      </div>
    </BeautyPage>
  );
}

export function BeautyDailySchedulePage() {
  return (
    <BeautyPage
      active="ພາບລວມຮ້ານຄວາມງາມ"
      title="Daily Schedule"
      description="Overview of today's appointments and walk-ins."
      actions={
        <BeautyButton href="/business-admin/appointments/create">
          New Appointment
        </BeautyButton>
      }
    >
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-5">
          {appointmentStats.map(([label, value, Icon, color]) => (
            <BeautyCard key={label}>
              <div className="flex items-center gap-3 p-4">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[11px] font-black text-slate-400">
                    {label}
                  </span>
                  <span className="mt-1 block text-xl font-black text-slate-950">
                    {value}
                  </span>
                </span>
              </div>
            </BeautyCard>
          ))}
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <BeautyCard title="Appointments by Staff">
            <div className="space-y-4 p-4">
              {staffMembers
                .concat([
                  {
                    name: "May",
                    role: "ຊ່າງເລັບ",
                    image:
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&q=80",
                    appointments: 3
                  }
                ])
                .map((staff) => (
                  <div
                    key={staff.name}
                    className="grid grid-cols-[160px_1fr_28px] items-center gap-3"
                  >
                    <StaffAvatar staff={staff} />
                    <span className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <span
                        className="block h-full rounded-full bg-pink-500"
                        style={{ width: `${staff.appointments * 11}%` }}
                      />
                    </span>
                    <span className="text-right text-xs font-black text-slate-600">
                      {staff.appointments}
                    </span>
                  </div>
                ))}
            </div>
          </BeautyCard>
          <BeautyCard title="Upcoming Appointments">
            <div className="space-y-3 p-4">
              {upcomingAppointments.map(([time, customer, service, staff]) => (
                <div
                  key={`${time}-${customer}`}
                  className="grid grid-cols-[78px_1fr_70px] items-center gap-3 rounded-lg border border-pink-50 p-3 text-sm"
                >
                  <span className="font-black text-slate-950">{time}</span>
                  <span>
                    <span className="block font-black text-slate-950">{customer}</span>
                    <span className="block text-xs font-semibold text-slate-500">
                      {service}
                    </span>
                  </span>
                  <span className="text-right text-xs font-black text-slate-500">
                    {staff}
                  </span>
                </div>
              ))}
            </div>
          </BeautyCard>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <BeautyCard title="Top Services Today">
            <div className="space-y-3 p-4">
              {[
                ["ຕັດຜົມ & ເປົ່າຜົມ", "8"],
                ["ນວດໄທ", "6"],
                ["ຍ້ອມຜົມ", "4"]
              ].map(([label, value], index) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="font-black text-slate-700">
                    {index + 1}. {label}
                  </span>
                  <span className="font-black text-slate-950">{value}</span>
                </div>
              ))}
            </div>
          </BeautyCard>
          <BeautyCard title="Revenue Summary">
            <div className="grid gap-3 p-4 sm:grid-cols-3">
              {[
                ["Total Sales", "LAK 4,250,000"],
                ["Average Ticket", "LAK 151,786"],
                ["Outstanding", "LAK 0"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-slate-50 p-4">
                  <p className="text-[11px] font-black text-slate-400">{label}</p>
                  <p className="mt-2 text-sm font-black text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </BeautyCard>
        </div>
      </div>
    </BeautyPage>
  );
}

export function BeautyCommissionPage() {
  return (
    <BeautyPage
      active="ພະນັກງານ"
      title="Commission"
      description="Track staff commission by service, package, and payment status."
    >
      <BeautyCard>
        <BeautyTable
          headers={[
            "ພະນັກງານ",
            "Role",
            "ບໍລິການ",
            "Sales",
            "Commission",
            "ສະຖານະ",
            "ການດຳເນີນການ"
          ]}
          rows={staffMembers.map((staff) => [
            <StaffAvatar key={staff.name} staff={staff} />,
            staff.role,
            `${staff.appointments} services`,
            `LAK ${staff.appointments * 420_000}`,
            `LAK ${staff.appointments * 42_000}`,
            <StatusPill>Ready</StatusPill>,
            <ActionCell />
          ])}
        />
      </BeautyCard>
    </BeautyPage>
  );
}

function BeautyField({
  label,
  value,
  full = false,
  textarea = false
}: {
  label: string;
  value: string;
  full?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className={full ? "md:col-span-2" : ""}>
      <span className="mb-1.5 block text-xs font-black text-slate-600">
        {label}
      </span>
      {textarea ? (
        <textarea
          className="min-h-24 w-full resize-none rounded-md border border-pink-100 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-50"
          defaultValue={value}
        />
      ) : (
        <input
          className="h-10 w-full rounded-md border border-pink-100 px-3 text-sm font-semibold text-slate-800 outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-50"
          defaultValue={value}
        />
      )}
    </label>
  );
}

function ToggleLine({ title, enabled }: { title: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-pink-100 bg-white p-3">
      <span className="text-sm font-black text-slate-700">{title}</span>
      <span
        className={`relative h-6 w-11 rounded-full ${enabled ? "bg-blue-600" : "bg-slate-200"}`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow ${enabled ? "left-6" : "left-1"}`}
        />
      </span>
    </div>
  );
}

function ActionCell() {
  return (
    <div className="flex justify-end gap-2">
      <BeautyIconButton icon={Pencil} label="ແກ້ໄຂ" />
      <BeautyIconButton icon={MoreVertical} label="ເພີ່ມເຕີມ" />
    </div>
  );
}

function BeautyTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-[12px]">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={header}
                className={`border-b border-pink-100 px-4 py-3 text-[11px] font-black whitespace-nowrap text-slate-500 ${
                  index === headers.length - 1 ? "text-right" : ""
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-pink-50 last:border-b-0">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-4 py-3 font-bold whitespace-nowrap text-slate-700 ${
                    cellIndex === row.length - 1 ? "text-right" : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
