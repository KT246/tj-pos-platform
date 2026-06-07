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
import { toLaoNode, toLaoText } from "../utils/lao-labels";

const beautyBusiness = "TJ Beauty & Spa";

const appointmentStats = [
  ["Total Appointments", "28", CalendarCheck, "bg-pink-50 text-pink-600"],
  ["Confirmed", "24", CheckCircle2, "bg-emerald-50 text-emerald-600"],
  ["In Progress", "5", Timer, "bg-amber-50 text-amber-600"],
  ["Completed", "12", CheckCircle2, "bg-emerald-50 text-emerald-600"],
  ["No Show", "1", Users, "bg-rose-50 text-rose-600"]
] as const;

const staffMembers = [
  {
    name: "Nina",
    role: "Nail Tech",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80",
    appointments: 6
  },
  {
    name: "Mali",
    role: "Hair Stylist",
    image:
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=96&q=80",
    appointments: 8
  },
  {
    name: "Pim",
    role: "Therapist",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=96&q=80",
    appointments: 7
  },
  {
    name: "Aommin",
    role: "Therapist",
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
    service: "Manicure",
    top: "22%",
    color: "border-amber-200 bg-amber-50 text-amber-700"
  },
  {
    staff: "Mali",
    time: "10:00",
    customer: "Kanya L.",
    service: "Hair Cut & Blow",
    top: "32%",
    color: "border-pink-200 bg-pink-50 text-pink-700"
  },
  {
    staff: "Aommin",
    time: "10:30",
    customer: "Natthavone P.",
    service: "Facial Treatment",
    top: "36%",
    color: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700"
  },
  {
    staff: "Nina",
    time: "12:20",
    customer: "Walk-in",
    service: "Gel Polish",
    top: "56%",
    color: "border-violet-200 bg-violet-50 text-violet-700"
  },
  {
    staff: "Mali",
    time: "13:00",
    customer: "Phutsada M.",
    service: "Hair Coloring",
    top: "66%",
    color: "border-sky-200 bg-sky-50 text-sky-700"
  },
  {
    staff: "Pim",
    time: "13:00",
    customer: "Phanousa S.",
    service: "Thai Massage",
    top: "66%",
    color: "border-emerald-200 bg-emerald-50 text-emerald-700"
  },
  {
    staff: "Nina",
    time: "15:20",
    customer: "Thida K.",
    service: "Acrylic Extension",
    top: "84%",
    color: "border-orange-200 bg-orange-50 text-orange-700"
  },
  {
    staff: "Aommin",
    time: "16:00",
    customer: "Kritsana J.",
    service: "Hair Treatment",
    top: "90%",
    color: "border-pink-300 bg-pink-100 text-pink-800"
  }
];

const services = [
  ["Hair Cut", "Hair", "45 min", "120,000", "Active"],
  ["Hair Cut & Blow Dry", "Hair", "60 min", "180,000", "Active"],
  ["Hair Coloring", "Hair", "120 min", "350,000", "Active"],
  ["Hair Treatment", "Hair", "60 min", "200,000", "Active"],
  ["Acrylic Extension", "Nail", "120 min", "250,000", "Active"],
  ["Gel Polish", "Nail", "60 min", "120,000", "Active"],
  ["Manicure", "Nail", "45 min", "80,000", "Active"],
  ["Pedicure", "Nail", "60 min", "100,000", "Active"],
  ["Thai Massage", "Spa & Body", "90 min", "220,000", "Active"],
  ["Aroma Massage", "Spa & Body", "60 min", "180,000", "Active"],
  ["Facial Treatment", "Face", "60 min", "200,000", "Active"],
  ["Eye Brow Shaping", "Face", "20 min", "50,000", "Active"]
];

const packages = [
  ["Hair Care Package", "Hair", "1,200,000", "5", "90 days", "Active"],
  ["Nail Lover Package", "Nail", "800,000", "5", "60 days", "Active"],
  ["Thai Massage Package", "Spa & Body", "1,500,000", "5", "90 days", "Active"],
  ["Facial Glow Package", "Face", "1,000,000", "5", "60 days", "Active"]
];

const packageSessions = [
  [
    "Kanya Phongsavath",
    "Hair Care Package",
    "2 / 5",
    "May 10, 2025",
    "May 24, 2025",
    "Active"
  ],
  [
    "Somchay Keomany",
    "Thai Massage Package",
    "1 / 5",
    "May 02, 2025",
    "May 23, 2025",
    "Active"
  ],
  [
    "Natthavone Phommala",
    "Facial Glow Package",
    "3 / 5",
    "May 14, 2025",
    "May 28, 2025",
    "Active"
  ]
];

const customerHistory = [
  ["May 10, 2025", "Hair Cut & Blow Dry", "Mali", "LAK 180,000"],
  ["May 02, 2025", "Hair Coloring", "Mali", "LAK 350,000"],
  ["Apr 20, 2025", "Acrylic Extension", "Nina", "LAK 250,000"],
  ["Apr 12, 2025", "Thai Massage", "Pim", "LAK 220,000"],
  ["Mar 25, 2025", "Facial Treatment", "Aommin", "LAK 200,000"]
];

const upcomingAppointments = [
  ["10:30 AM", "Kanya Phongsavath", "Hair Cut & Blow Dry", "Mali"],
  ["11:30 AM", "Somchay Keomany", "Hair Coloring", "Mali"],
  ["01:00 PM", "Natthavone Phommala", "Facial Treatment", "Aommin"],
  ["02:30 PM", "Walk-in", "Gel Polish", "Nina"],
  ["03:30 PM", "Thida Review", "Thai Massage", "Pim"]
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
      {toLaoNode(children)}
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
              {toLaoText(title)}
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
          {toLaoText(tab)}
        </button>
      ))}
    </div>
  );
}

function BeautyIconButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button
      type="button"
      aria-label={toLaoText(label)}
      title={toLaoText(label)}
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
          {toLaoText(staff.role)}
        </span>
      </span>
    </div>
  );
}

function StatusPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-600">
      {toLaoNode(children)}
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
            {toLaoText("May 2025")}
          </span>
          <button type="button" className="text-slate-400">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
            <span key={day}>{toLaoText(day)}</span>
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
          ["All Areas", "3", "bg-pink-500"],
          ["Nail Zone", "3", "bg-emerald-400"],
          ["Hair Station", "4", "bg-sky-400"],
          ["Spa Room 1", "2", "bg-emerald-300"],
          ["Spa Room 2", "1", "bg-rose-300"],
          ["VIP Room", "1", "bg-pink-300"]
        ].map(([label, count, dot]) => (
          <div
            key={label}
            className="flex items-center justify-between text-xs font-black text-slate-600"
          >
            <span className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
              {toLaoText(label)}
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
      active="Calendar"
      title="Appointment Calendar"
      description="Manage your salon appointments and schedule."
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
                  {toLaoText("May 18, 2025")}
                </span>
                <button
                  className="rounded-md border border-pink-100 p-2 text-slate-500"
                  type="button"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <BeautyTabs tabs={["Day", "Week", "Month", "Today"]} active="Week" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[880px]">
              <div className="grid grid-cols-[76px_repeat(4,1fr)] border-b border-pink-50">
                <span className="px-4 py-3 text-xs font-black text-slate-400">
                  {toLaoText("Time")}
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
                            {toLaoText(block.service)}
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
              ["In Progress", "bg-amber-400"],
              ["Completed", "bg-sky-400"],
              ["Cancelled", "bg-pink-400"],
              ["No Show", "bg-slate-300"]
            ].map(([label, dot]) => (
              <span key={label} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                {toLaoText(label)}
              </span>
            ))}
          </div>
        </BeautyCard>
      </div>
    </BeautyPage>
  );
}

export function CreateAppointmentPage() {
  return (
    <BeautyPage
      active="Calendar"
      title="New Appointment"
      description="Create an appointment with customer, service, staff, and deposit details."
    >
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="space-y-4">
          <BeautyCard title="Customer">
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
              <BeautyField label="Time" value="10:30 AM" />
              <BeautyField label="Service" value="Hair Cut & Blow Dry" />
              <BeautyField label="Duration" value="60 min" />
              <BeautyField label="Staff" value="Mali (Hair Stylist)" />
              <BeautyField label="Room / Area" value="Hair Station 1" />
              <BeautyField
                label="Notes"
                value="Customer prefers layered cut."
                full
                textarea
              />
            </div>
          </BeautyCard>
          <BeautyCard title="Deposit Policy">
            <div className="grid gap-4 p-4 md:grid-cols-3">
              <ToggleLine title="Deposit Required" enabled />
              <BeautyField label="Deposit Type" value="Percentage (%)" />
              <BeautyField label="Amount" value="20% (LAK 36,000)" />
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
      active="Services"
      title="Services"
      description="Manage your salon services and durations."
      actions={<BeautyButton>Add Service</BeautyButton>}
    >
      <BeautyCard>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-50 p-4">
          <BeautyTabs
            tabs={["All Service", "Hair", "Nail", "Spa & Body", "Face", "Children"]}
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
            "Category",
            "Duration",
            "Price (LAK)",
            "Status",
            "Actions"
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
      active="Staff Schedule"
      title="Staff Schedule"
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
            {toLaoText("May 18 - May 24, 2025")}
            <button
              className="rounded-md border border-pink-100 p-2 text-slate-500"
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <BeautyTabs tabs={["Week", "Month"]} active="Week" />
        </div>
        <div className="overflow-x-auto p-4">
          <div className="min-w-[920px]">
            <div className="grid grid-cols-[170px_repeat(7,1fr)] gap-2 text-xs font-black text-slate-500">
              <span>{toLaoText("Staff")}</span>
              {[
                "Sun 18",
                "Mon 19",
                "Tue 20",
                "Wed 21",
                "Thu 22",
                "Fri 23",
                "Sat 24"
              ].map((day) => (
                <span key={day} className="text-center">
                  {toLaoText(day)}
                </span>
              ))}
            </div>
            <div className="mt-3 space-y-3">
              {staffMembers
                .concat([
                  {
                    name: "May",
                    role: "Nail Tech",
                    image:
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&q=80",
                    appointments: 3
                  },
                  {
                    name: "Bounlie",
                    role: "Hair Stylist",
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
                            ? toLaoText("Day Off")
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
            {toLaoText("Working")}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />{" "}
            {toLaoText("Day Off")}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />{" "}
            {toLaoText("Time Off")}
          </span>
        </div>
      </BeautyCard>
    </BeautyPage>
  );
}

export function BeautyPackagesPage() {
  return (
    <BeautyPage
      active="Packages"
      title="Packages"
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
              "Category",
              "Price (LAK)",
              "Sessions",
              "Validity",
              "Status",
              "Actions"
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
              "Customer",
              "Package",
              "Used / Total",
              "Last Session",
              "Next Session",
              "Status"
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
      active="Customers"
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
              tabs={["History", "Notes", "Package", "Preferences"]}
              active="History"
            />
          </div>
          <BeautyTable
            headers={["Date", "Service", "Staff", "Amount"]}
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
      active="Deposit Policy"
      title="Deposit & Cancellation Policy"
      description="Configure deposit requirements and cancellation rules."
      actions={<BeautyButton icon={WalletCards}>Save Deposit Policy</BeautyButton>}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <BeautyCard>
          <div className="border-b border-pink-50 p-4">
            <BeautyTabs
              tabs={["Deposit Policy", "Cancellation Policy"]}
              active="Deposit Policy"
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
      active="Beauty Daily"
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
                    role: "Nail Tech",
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
                ["Hair Cut & Blow Dry", "8"],
                ["Thai Massage", "6"],
                ["Hair Coloring", "4"]
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
      active="Staff"
      title="Commission"
      description="Track staff commission by service, package, and payment status."
    >
      <BeautyCard>
        <BeautyTable
          headers={[
            "Staff",
            "Role",
            "Services",
            "Sales",
            "Commission",
            "Status",
            "Actions"
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
        {toLaoText(label)}
      </span>
      {textarea ? (
        <textarea
          className="min-h-24 w-full resize-none rounded-md border border-pink-100 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-50"
          defaultValue={toLaoText(value)}
        />
      ) : (
        <input
          className="h-10 w-full rounded-md border border-pink-100 px-3 text-sm font-semibold text-slate-800 outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-50"
          defaultValue={toLaoText(value)}
        />
      )}
    </label>
  );
}

function ToggleLine({ title, enabled }: { title: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-pink-100 bg-white p-3">
      <span className="text-sm font-black text-slate-700">{toLaoText(title)}</span>
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
      <BeautyIconButton icon={Pencil} label="Edit" />
      <BeautyIconButton icon={MoreVertical} label="More" />
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
                {toLaoText(header)}
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
                  {toLaoNode(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
