import {
  BedDouble,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  DoorOpen,
  Filter,
  Hotel,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Sparkles,
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

const hotelName = "TJ Riverside Hotel";

const rooms = [
  ["101", "ຫ້ອງ Standard King", "ຊັ້ນ 1", "ມີແຂກພັກ", "ຕ້ອງທຳຄວາມສະອາດ", "HND"],
  ["102", "ຫ້ອງ Standard Twin", "ຊັ້ນ 1", "ມີແຂກພັກ", "ສະອາດ", ""],
  ["103", "ຫ້ອງ Deluxe King", "ຊັ້ນ 1", "ວ່າງ", "ສະອາດ", "Connecting room"],
  ["104", "ຫ້ອງ Deluxe Twin", "ຊັ້ນ 1", "ວ່າງ", "ກວດແລ້ວ", "VIP"],
  ["201", "ຫ້ອງ Superior King", "ຊັ້ນ 2", "ມີແຂກພັກ", "ພັກຕໍ່", ""],
  ["202", "ຫ້ອງ Superior Twin", "ຊັ້ນ 2", "ມີແຂກພັກ", "ສະອາດ", "King bed"],
  ["203", "ຫ້ອງຄອບຄົວ", "ຊັ້ນ 2", "ວ່າງ", "ຕ້ອງທຳຄວາມສະອາດ", ""],
  ["204", "ຫ້ອງ Suite", "ຊັ້ນ 2", "ວ່າງ", "ສະອາດ", ""],
  ["301", "ຫ້ອງ Suite", "ຊັ້ນ 3", "ວ່າງ", "ສ້ອມບຳລຸງ", "High floor"],
  ["302", "ຫ້ອງ Suite", "ຊັ້ນ 3", "ວ່າງ", "ສະອາດ", ""]
];

const bookings = [
  [
    "BK250516-001",
    "Kanya Phongsavath",
    "May 16, 2025",
    "May 24, 2025",
    "101 / Deluxe King",
    "2",
    "Confirmed",
    "2,800,000"
  ],
  [
    "BK250516-002",
    "Somchai Keomany",
    "18 ພຶດສະພາ 2025",
    "May 22, 2025",
    "104 / Deluxe Twin",
    "2",
    "Checked In",
    "4,200,000"
  ],
  [
    "BK250516-003",
    "Jennifer Anderson",
    "18 ພຶດສະພາ 2025",
    "May 21, 2025",
    "204 / Suite",
    "2",
    "Checked In",
    "7,000,000"
  ],
  [
    "BK250517-001",
    "Mali Phim",
    "May 19, 2025",
    "May 23, 2025",
    "201 / Suite",
    "1",
    "Confirmed",
    "3,600,000"
  ],
  [
    "BK250517-010",
    "Phonmany Vilay",
    "May 19, 2025",
    "May 23, 2025",
    "203 / Family Room",
    "4",
    "Confirmed",
    "4,800,000"
  ],
  [
    "BK250514-005",
    "Nettaphan Phomma",
    "May 19, 2025",
    "May 21, 2025",
    "103 / Standard Twin",
    "2",
    "Checked Out",
    "2,400,000"
  ],
  [
    "BK250514-006",
    "Chanthal Rathana",
    "May 21, 2025",
    "May 22, 2025",
    "102 / Deluxe King",
    "2",
    "Confirmed",
    "2,800,000"
  ],
  [
    "BK250515-004",
    "ລູກຄ້າ Walk-in",
    "18 ພຶດສະພາ 2025",
    "18 ພຶດສະພາ 2025",
    "101 / Standard King",
    "1",
    "Checked Out",
    "1,400,000"
  ]
];

const roomBlocks = [
  ["101", "Malin In", "14%", "w-[34%]", "border-blue-200 bg-blue-50 text-blue-700"],
  ["102", "Nettaphan P.", "36%", "w-[42%]", "border-blue-200 bg-blue-50 text-blue-700"],
  [
    "103",
    "Kanya L.",
    "24%",
    "w-[38%]",
    "border-orange-200 bg-orange-50 text-orange-700"
  ],
  [
    "104",
    "Somchai K.",
    "42%",
    "w-[30%]",
    "border-orange-200 bg-orange-50 text-orange-700"
  ],
  [
    "201",
    "Pernmala S.",
    "23%",
    "w-[28%]",
    "border-emerald-200 bg-emerald-50 text-emerald-700"
  ],
  ["203", "Jennifer A.", "70%", "w-[38%]", "border-blue-200 bg-blue-50 text-blue-700"],
  ["301", "Mark O.", "24%", "w-[54%]", "border-blue-200 bg-blue-50 text-blue-700"],
  ["302", "ສ້ອມບຳລຸງ", "8%", "w-[26%]", "border-rose-200 bg-rose-50 text-rose-700"]
] as const;

const roomStats = [
  ["Total Bookings", "28", Hotel, "bg-blue-50 text-blue-600"],
  ["Confirmed", "16", CheckCircle2, "bg-emerald-50 text-emerald-600"],
  ["Checked In", "7", DoorOpen, "bg-sky-50 text-sky-600"],
  ["Checked Out", "3", CreditCard, "bg-slate-50 text-slate-600"],
  ["Canceled", "2", Users, "bg-rose-50 text-rose-600"]
] as const;

const guestCharges = [
  [
    "18 ພຶດສະພາ 2025",
    "Room Charge",
    "Accommodation",
    "BK250516-002",
    "1,000,000",
    "Posted"
  ],
  ["18 ພຶດສະພາ 2025", "Mini Bar", "F&B", "BK250516-003-01", "120,000", "Posted"],
  [
    "May 19, 2025",
    "Room Charge",
    "Accommodation",
    "BK250516-002",
    "1,000,000",
    "Posted"
  ],
  ["May 19, 2025", "Laundry Service", "Other", "BK250516-003-02", "80,000", "Posted"],
  [
    "May 20, 2025",
    "Room Charge",
    "Accommodation",
    "BK250516-002",
    "1,000,000",
    "Posted"
  ],
  [
    "May 21, 2025",
    "Room Charge",
    "Accommodation",
    "BK250516-002",
    "1,000,000",
    "Posted"
  ]
];

function HospitalityPage({
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
    <BusinessAdminShell active={active} businessLabel={hotelName}>
      <PageHeader title={title} description={description} actions={actions} />
      {children}
    </BusinessAdminShell>
  );
}

function HotelButton({
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
      ? "bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.22)] hover:bg-blue-700"
      : "border border-blue-100 bg-white text-slate-900 hover:border-blue-200 hover:bg-blue-50";
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

function HotelCard({
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
      className={`min-w-0 rounded-lg border border-blue-100 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)] ${className}`}
    >
      {title || action ? (
        <div className="flex items-center justify-between gap-3 border-b border-blue-50 px-4 py-3">
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

function HotelTabs({ tabs, active }: { tabs: string[]; active: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={`h-9 rounded-md px-4 text-xs font-black transition ${
            tab === active
              ? "bg-blue-50 text-blue-600"
              : "bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function HotelIconButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-blue-100 bg-white text-slate-500 transition hover:-translate-y-0.5 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function StatusPill({ status }: { status: string }) {
  const className = statusClass(status);

  return (
    <span className={`rounded-md border px-2 py-1 text-[10px] font-black ${className}`}>
      {status}
    </span>
  );
}

function statusClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("confirmed") || normalized.includes("clean")) {
    return "border-emerald-100 bg-emerald-50 text-emerald-600";
  }
  if (normalized.includes("checked in") || normalized.includes("occupied")) {
    return "border-blue-100 bg-blue-50 text-blue-600";
  }
  if (normalized.includes("checked out") || normalized.includes("inspected")) {
    return "border-sky-100 bg-sky-50 text-sky-600";
  }
  if (normalized.includes("dirty") || normalized.includes("canceled")) {
    return "border-rose-100 bg-rose-50 text-rose-600";
  }
  if (normalized.includes("maintenance") || normalized.includes("stayover")) {
    return "border-amber-100 bg-amber-50 text-amber-600";
  }

  return "border-slate-100 bg-slate-50 text-slate-600";
}

export function RoomCalendarPage() {
  return (
    <HospitalityPage
      active="ປະຕິທິນຫ້ອງ"
      title="ປະຕິທິນຫ້ອງ"
      description="ຕິດຕາມການພັກ ແລະ timeline ການຈອງຫ້ອງ."
      actions={
        <div className="flex items-center gap-2">
          <HotelButton variant="secondary" icon={Filter}>
            Filters
          </HotelButton>
          <HotelButton href="/business-admin/bookings/create">New Booking</HotelButton>
        </div>
      }
    >
      <HotelCard>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-50 p-4">
          <div className="flex items-center gap-2 text-sm font-black text-slate-950">
            <button
              className="rounded-md border border-blue-100 p-2 text-slate-500"
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {"18 - 24 ພຶດສະພາ 2025"}
            <button
              className="rounded-md border border-blue-100 p-2 text-slate-500"
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <HotelTabs tabs={["ມື້", "ອາທິດ", "Month"]} active="ອາທິດ" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-50 px-4 py-3">
          <HotelTabs
            tabs={["ຫ້ອງທັງໝົດ", "ຕາມຊັ້ນ", "ຕາມປະເພດຫ້ອງ"]}
            active="ຫ້ອງທັງໝົດ"
          />
          <div className="flex flex-wrap gap-4 text-[11px] font-black text-slate-500">
            {[
              ["Confirmed", "bg-emerald-400"],
              ["Checked In", "bg-blue-400"],
              ["ຈອງແລ້ວ", "bg-amber-400"],
              ["Check-out", "bg-orange-400"],
              ["ສ້ອມບຳລຸງ", "bg-rose-400"],
              ["ບລັອກ", "bg-violet-400"]
            ].map(([label, dot]) => (
              <span key={label} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto p-4">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-[150px_repeat(7,1fr)] gap-2 text-[11px] font-black text-slate-500">
              <span>{"ຊັ້ນ / ຫ້ອງ"}</span>
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
            <div className="mt-3 space-y-2">
              {[
                "ຊັ້ນ 1",
                "101 Standard King",
                "102 Standard Twin",
                "103 Deluxe King",
                "104 Deluxe Twin",
                "ຊັ້ນ 2",
                "201 Superior King",
                "202 Superior Twin",
                "203 Family Room",
                "204 Suite",
                "ຊັ້ນ 3",
                "301 Suite",
                "302 Suite"
              ].map((label) => {
                const isFloor = label.includes("ຊັ້ນ");
                const roomNo = label.split(" ")[0];
                const block = roomBlocks.find(([room]) => room === roomNo);

                return (
                  <div
                    key={label}
                    className={`relative grid grid-cols-[150px_repeat(7,1fr)] items-center gap-2 ${isFloor ? "pt-2" : ""}`}
                  >
                    <span
                      className={`text-xs ${isFloor ? "font-black text-slate-950" : "font-bold text-slate-600"}`}
                    >
                      {label}
                    </span>
                    {Array.from({ length: 7 }, (_, index) => (
                      <span
                        key={index}
                        className="h-8 rounded border border-blue-50 bg-white"
                      />
                    ))}
                    {block ? (
                      <span
                        className={`absolute top-1 left-[170px] flex h-7 items-center rounded-md border px-3 text-[11px] font-black shadow-sm ${block[4]} ${block[3]}`}
                        style={{ marginLeft: block[2] }}
                      >
                        {block[1]}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </HotelCard>
    </HospitalityPage>
  );
}

export function RoomSettingsHousekeepingPage() {
  return (
    <HospitalityPage
      active="ຕັ້ງຄ່າຫ້ອງ"
      title="ຕັ້ງຄ່າຫ້ອງ & ແມ່ບ້ານ"
      description="ຈັດການຫ້ອງ, ປະເພດຫ້ອງ ແລະ ສະຖານະແມ່ບ້ານ."
      actions={<HotelButton>Add Room</HotelButton>}
    >
      <HotelCard>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-50 p-4">
          <HotelTabs
            tabs={["ລາຍຊື່ຫ້ອງ", "ປະເພດຫ້ອງ", "ແມ່ບ້ານ"]}
            active="ລາຍຊື່ຫ້ອງ"
          />
          <label className="relative w-full max-w-xs">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-10 w-full rounded-md border border-blue-100 pr-3 pl-10 text-sm font-bold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              placeholder="ຄົ້ນຫາຫ້ອງ..."
            />
          </label>
        </div>
        <HotelTable
          headers={[
            "ຫ້ອງ",
            "ປະເພດຫ້ອງ",
            "ຊັ້ນ",
            "ສະຖານະ",
            "ແມ່ບ້ານ",
            "ໝາຍເຫດ",
            "ການດຳເນີນການ"
          ]}
          rows={rooms.map((room) => [
            <span className="font-black text-slate-950">{room[0]}</span>,
            room[1],
            room[2],
            room[3],
            <StatusPill status={room[4]} />,
            room[5] || "-",
            <ActionCell />
          ])}
        />
      </HotelCard>
    </HospitalityPage>
  );
}

export function BookingListPage() {
  return (
    <HospitalityPage
      active="ການຈອງ"
      title="ລາຍການຈອງ"
      description="ເບິ່ງ ແລະ ຈັດການການຈອງທັງໝົດ."
      actions={
        <HotelButton href="/business-admin/bookings/create">New Booking</HotelButton>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-5">
          {roomStats.map(([label, value, Icon, color]) => (
            <HotelCard key={label}>
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
            </HotelCard>
          ))}
        </div>
        <HotelCard>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-50 p-4">
            <div className="flex flex-wrap gap-2">
              <HotelSelect label="May 16 - May 31, 2025" />
              <HotelSelect label="ທຸກສະຖານະ" />
            </div>
            <label className="relative w-full max-w-xs">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="h-10 w-full rounded-md border border-blue-100 pr-3 pl-10 text-sm font-bold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                placeholder="Search guest, reference..."
              />
            </label>
          </div>
          <HotelTable
            headers={[
              "Booking No.",
              "Guest Name",
              "Check-in",
              "Check-out",
              "Room / Type",
              "Pax",
              "ສະຖານະ",
              "Total (LAK)",
              "ການດຳເນີນການ"
            ]}
            rows={bookings.map((booking) => [
              <span className="font-black text-blue-600">{booking[0]}</span>,
              <span className="font-black text-slate-950">{booking[1]}</span>,
              booking[2],
              booking[3],
              booking[4],
              booking[5],
              <StatusPill status={booking[6]} />,
              booking[7],
              <ActionCell />
            ])}
          />
        </HotelCard>
      </div>
    </HospitalityPage>
  );
}

export function CreateBookingPage() {
  return (
    <HospitalityPage
      active="ການຈອງ"
      title="Create Booking"
      description="Create a room booking with guest info and deposit estimate."
    >
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <HotelCard title="Booking Details">
          <div className="grid gap-4 p-4 md:grid-cols-2">
            <HotelField label="Check-in" value="May 20, 2025" />
            <HotelField label="Arrival Time" value="2:00 PM" />
            <HotelField label="Check-out" value="May 22, 2025" />
            <HotelField label="Departure Time" value="12:00 PM" />
            <HotelField label="Nights" value="2" />
            <HotelField label="ປະເພດຫ້ອງ" value="ຫ້ອງ Deluxe King" />
            <HotelField label="ຫ້ອງ" value="103" />
            <HotelField label="Adults" value="2" />
            <HotelField label="Children" value="0" />
            <HotelField label="Source" value="ລູກຄ້າ Walk-in" />
            <HotelField
              label="Special Request"
              value="High floor, non-smoking room"
              full
              textarea
            />
          </div>
        </HotelCard>
        <HotelCard title="Rate & Summary">
          <div className="space-y-4 p-4">
            <HotelField label="Rate Plan" value="Best Available Rate" />
            {[
              ["Room Rate", "LAK 1,400,000"],
              ["Nights", "2"],
              ["ຍອດກ່ອນຄ່າບໍລິການ", "LAK 2,800,000"],
              ["Tax & Service", "LAK 280,000"],
              ["Total (Estimate)", "LAK 3,080,000"]
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-500">{label}</span>
                <span className="font-black text-slate-950">{value}</span>
              </div>
            ))}
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
              <p className="text-xs font-black text-amber-600">Deposit Required</p>
              <p className="mt-2 text-sm font-black text-slate-950">LAK 300,000</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <HotelButton
                variant="secondary"
                icon={ChevronLeft}
                href="/business-admin/bookings"
              >
                Cancel
              </HotelButton>
              <HotelButton icon={UserRound}>Next: Guest Info</HotelButton>
            </div>
          </div>
        </HotelCard>
      </div>
    </HospitalityPage>
  );
}

export function CheckInPage() {
  return (
    <HospitalityPage
      active="Check-in"
      title="Check-in"
      description="Complete guest check-in and assign room."
      actions={<HotelButton icon={DoorOpen}>Complete Check-in</HotelButton>}
    >
      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
        <HotelCard title="Booking Info">
          <div className="space-y-4 p-4 text-sm">
            <InfoLine label="Booking No." value="BK250516-002" />
            <InfoLine label="Guest Name" value="Somchai Keomany" />
            <InfoLine label="Check-in" value="May 18, 2025 - 2:00 PM" />
            <InfoLine label="Check-out" value="May 22, 2025 - 12:00 PM" />
            <InfoLine label="Nights" value="4" />
            <InfoLine label="ປະເພດຫ້ອງ" value="ຫ້ອງ Deluxe Twin" />
            <InfoLine label="ຫ້ອງ" value="104 1st Floor" />
          </div>
        </HotelCard>
        <HotelCard title="Guest Information">
          <div className="grid gap-4 p-4 md:grid-cols-2">
            <HotelField label="Title" value="Mr." />
            <HotelField label="First Name" value="Somchai" />
            <HotelField label="Last Name" value="Keomany" />
            <HotelField label="Phone" value="020 5566 7788" />
            <HotelField label="Email" value="somchai.k@gmail.com" />
            <HotelField label="ID / Passport No." value="P1234567" />
            <HotelField label="Country" value="Laos" />
          </div>
        </HotelCard>
        <HotelCard title="Check-in Details">
          <div className="space-y-4 p-4">
            <HotelField label="Arrival Time" value="2:10 PM" />
            <HotelField label="No. of Adults" value="2" />
            <HotelField label="No. of Children" value="0" />
            <HotelField label="Payment Method" value="Cash" />
            <HotelField label="Deposit Paid" value="LAK 420,000" />
            <HotelField label="Balance Due" value="LAK 3,780,000" />
          </div>
        </HotelCard>
      </div>
    </HospitalityPage>
  );
}

export function CheckOutPage() {
  return (
    <HospitalityPage
      active="Check-out"
      title="Check-out"
      description="Review folio, collect payment, and complete guest check-out."
      actions={<HotelButton icon={CreditCard}>Complete Check-out</HotelButton>}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <HotelCard title="Guest & Stay Info">
          <div className="grid gap-5 p-4 lg:grid-cols-[260px_1fr]">
            <div className="space-y-3 text-sm">
              <InfoLine label="Guest" value="Somchai Keomany" />
              <InfoLine label="ຫ້ອງ" value="104 / Deluxe Twin" />
              <InfoLine label="Stay" value="May 18 - May 22, 2025 (4 Nights)" />
              <InfoLine label="ແຂກ" value="2 Adults" />
            </div>
            <HotelTable
              compact
              headers={["Date", "Description", "Ref No.", "Amount (LAK)"]}
              rows={guestCharges.map((charge) => [
                charge[0],
                charge[1],
                charge[3],
                charge[4]
              ])}
            />
          </div>
        </HotelCard>
        <HotelCard title="Billing Summary">
          <div className="space-y-4 p-4">
            {[
              ["Room Charges", "LAK 4,000,000"],
              ["Extra Charges", "LAK 300,000"],
              ["Tax & Service (7%)", "LAK 340,000"],
              ["Total", "LAK 4,840,000"],
              ["Payments", "- LAK 3,800,000"],
              ["Balance Due", "LAK 640,000"]
            ].map(([label, value], index) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-500">{label}</span>
                <span
                  className={`font-black ${index === 5 ? "text-rose-600" : "text-slate-950"}`}
                >
                  {value}
                </span>
              </div>
            ))}
            <div className="border-t border-blue-50 pt-4">
              <HotelField label="Payment Method" value="Cash" />
              <HotelField label="Amount Received" value="4,840,000" />
              <HotelField label="Change Due" value="0" />
            </div>
          </div>
        </HotelCard>
      </div>
    </HospitalityPage>
  );
}

export function GuestFolioPage() {
  return (
    <HospitalityPage
      active="ບັນຊີແຂກ"
      title="ບັນຊີແຂກ"
      description="View guest folio and post additional charges."
      actions={
        <div className="flex gap-2">
          <HotelButton icon={Plus}>Post Charge</HotelButton>
          <HotelButton icon={WalletCards} variant="secondary">
            Take Payment
          </HotelButton>
        </div>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[250px_minmax(0,1fr)_300px]">
        <HotelCard title="Guest Info">
          <div className="space-y-3 p-4 text-sm">
            <InfoLine label="Guest" value="Somchai Keomany" />
            <InfoLine label="ຫ້ອງ" value="104 / Deluxe Twin" />
            <InfoLine label="Stay" value="May 18 - May 22, 2025" />
            <InfoLine label="Booking No." value="BK250516-002" />
            <StatusPill status="Checked In" />
          </div>
        </HotelCard>
        <HotelCard>
          <div className="border-b border-blue-50 p-4">
            <HotelTabs tabs={["Folio", "Extra Charges", "Payments"]} active="Folio" />
          </div>
          <HotelTable
            headers={[
              "Date",
              "Description",
              "ປະເພດ",
              "Ref No.",
              "Amount (LAK)",
              "ສະຖານະ"
            ]}
            rows={guestCharges.map((charge) => [
              charge[0],
              charge[1],
              charge[2],
              charge[3],
              charge[4],
              <StatusPill status={charge[5]} />
            ])}
          />
        </HotelCard>
        <HotelCard title="Summary">
          <div className="space-y-4 p-4">
            {[
              ["Room Charges", "LAK 4,000,000"],
              ["Extra Charges", "LAK 300,000"],
              ["Tax & Service (7%)", "LAK 340,000"],
              ["Total", "LAK 4,640,000"],
              ["Payments", "- LAK 3,800,000"],
              ["Balance Due", "LAK 640,000"]
            ].map(([label, value], index) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-500">{label}</span>
                <span
                  className={`font-black ${index === 5 ? "text-rose-600" : "text-slate-950"}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </HotelCard>
      </div>
    </HospitalityPage>
  );
}

export function DepositCancellationPolicyPage() {
  return (
    <HospitalityPage
      active="ການຈອງ"
      title="Deposit & Cancellation Policy"
      description="Configure deposit requirements and cancellation rules."
      actions={<HotelButton icon={WalletCards}>Save Policy</HotelButton>}
    >
      <div className="grid gap-5 xl:grid-cols-2">
        <HotelCard title="ນະໂຍບາຍມັດຈຳ">
          <div className="space-y-5 p-5">
            <ToggleLine title="Require Deposit for Bookings" enabled />
            <div className="grid gap-4 md:grid-cols-2">
              <HotelField label="Deposit Type" value="Percentage (%)" />
              <HotelField label="Deposit Percentage" value="10" />
              <HotelField label="Minimum Deposit (LAK)" value="100,000" />
              <HotelField label="Applies To" value="All Bookings" />
            </div>
          </div>
        </HotelCard>
        <HotelCard title="Cancellation Policy">
          <div className="space-y-5 p-5">
            <HotelField label="Free Cancellation Until" value="1 Day before arrival" />
            <HotelField label="Cancellation Fee" value="50% of first night booking" />
            <div className="rounded-lg bg-blue-50 p-4 text-sm leading-6 font-semibold text-slate-600">
              No Show: 100% charge of 1 night stay. Policy appears in booking
              confirmation and guest folio.
            </div>
          </div>
        </HotelCard>
      </div>
    </HospitalityPage>
  );
}

function HotelField({
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
          className="min-h-24 w-full resize-none rounded-md border border-blue-100 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
          defaultValue={value}
        />
      ) : (
        <input
          className="h-10 w-full rounded-md border border-blue-100 px-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
          defaultValue={value}
        />
      )}
    </label>
  );
}

function HotelSelect({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="h-10 rounded-md border border-blue-100 bg-white px-3 text-sm font-black text-slate-700 transition hover:bg-blue-50"
    >
      {label}
    </button>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-black text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

function ToggleLine({ title, enabled }: { title: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-blue-100 bg-white p-3">
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
      <HotelIconButton icon={Pencil} label="ແກ້ໄຂ" />
      <HotelIconButton icon={MoreVertical} label="ເພີ່ມເຕີມ" />
    </div>
  );
}

function HotelTable({
  headers,
  rows,
  compact = false
}: {
  headers: string[];
  rows: ReactNode[][];
  compact?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-[12px]">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={header}
                className={`border-b border-blue-100 px-4 py-3 text-[11px] font-black whitespace-nowrap text-slate-500 ${
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
            <tr key={rowIndex} className="border-b border-blue-50 last:border-b-0">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`${compact ? "px-3 py-2" : "px-4 py-3"} font-bold whitespace-nowrap text-slate-700 ${
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
      {!compact ? <HotelPagination /> : null}
    </div>
  );
}

function HotelPagination() {
  return (
    <div className="flex items-center justify-between border-t border-blue-50 px-4 py-3">
      <p className="text-[13px] font-semibold text-slate-600">
        {"ສະແດງ 1 ຫາ 8 ຈາກ 28 ລາຍການ"}
      </p>
      <div className="flex items-center gap-2">
        {["<", "1", "2", ">"].map((item) => (
          <button
            key={item}
            type="button"
            className={`h-8 min-w-8 rounded-md border text-sm font-black ${
              item === "1"
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-blue-100 bg-white text-slate-700 hover:bg-blue-50"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Housekeeping Page (separate from Room Settings) ─────────────────────────
const housekeepingTasks = [
  { room: "101", type: "Standard King", floor: "1", status: "ຕ້ອງທຳຄວາມສະອາດ", cleaner: "Bounmee", priority: "ດ່ວນ", notes: "VIP guest arriving 2PM" },
  { room: "102", type: "Standard Twin", floor: "1", status: "ສະອາດ", cleaner: "Naly", priority: "ປົກກະຕິ", notes: "" },
  { room: "103", type: "Deluxe King", floor: "1", status: "ກວດແລ້ວ", cleaner: "Bounmee", priority: "ສຳເລັດ", notes: "" },
  { room: "104", type: "Deluxe Twin", floor: "1", status: "ກຳລັງທຳຄວາມສະອາດ", cleaner: "Malin", priority: "ປົກກະຕິ", notes: "Deep clean requested" },
  { room: "201", type: "Superior King", floor: "2", status: "ສ້ອມບຳລຸງ", cleaner: "—", priority: "ລໍຖ້າ", notes: "AC repair needed" },
  { room: "202", type: "Superior Twin", floor: "2", status: "ຕ້ອງທຳຄວາມສະອາດ", cleaner: "Naly", priority: "ດ່ວນ", notes: "" },
  { room: "203", type: "Family Room", floor: "2", status: "ສະອາດ", cleaner: "Malin", priority: "ສຳເລັດ", notes: "" },
  { room: "204", type: "Suite", floor: "2", status: "ກວດແລ້ວ", cleaner: "Bounmee", priority: "ສຳເລັດ", notes: "VIP" }
];

const hkStats = [
  { label: "ທັງໝົດ", value: "24", color: "bg-blue-50 text-blue-600" },
  { label: "ຕ້ອງທຳຄວາມສະອາດ", value: "8", color: "bg-amber-50 text-amber-600" },
  { label: "ກຳລັງດຳເນີນ", value: "3", color: "bg-sky-50 text-sky-600" },
  { label: "ສຳເລັດ", value: "11", color: "bg-emerald-50 text-emerald-600" },
  { label: "ສ້ອມບຳລຸງ", value: "2", color: "bg-rose-50 text-rose-600" }
];

function hkStatusClass(status: string) {
  if (status.includes("ສຳເລັດ") || status.includes("ກວດ")) return "border-emerald-100 bg-emerald-50 text-emerald-700";
  if (status.includes("ກຳລັງ")) return "border-sky-100 bg-sky-50 text-sky-700";
  if (status.includes("ຕ້ອງ")) return "border-amber-100 bg-amber-50 text-amber-700";
  if (status.includes("ສ້ອມ")) return "border-rose-100 bg-rose-50 text-rose-700";
  return "border-slate-100 bg-slate-50 text-slate-600";
}

function priorityClass(p: string) {
  if (p === "ດ່ວນ") return "border-red-100 bg-red-50 text-red-600";
  if (p === "ສຳເລັດ") return "border-emerald-100 bg-emerald-50 text-emerald-600";
  if (p === "ລໍຖ້າ") return "border-slate-100 bg-slate-50 text-slate-500";
  return "border-blue-100 bg-blue-50 text-blue-600";
}

export function HousekeepingPage() {
  return (
    <HospitalityPage
      active="ແມ່ບ້ານ"
      title="ແມ່ບ້ານ"
      description="ຈັດການຄວາມສະອາດຫ້ອງ ແລະ ມອບໝາຍຕຳແໜ່ງໃຫ້ທີມ."
      actions={
        <div className="flex items-center gap-2">
          <HotelButton variant="secondary" icon={ClipboardCheck}>ລາຍງານ</HotelButton>
          <HotelButton>ມອບໝາຍໃໝ່</HotelButton>
        </div>
      }
    >
      <div className="space-y-5">
        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {hkStats.map((stat) => (
            <HotelCard key={stat.label}>
              <div className={`flex flex-col items-center justify-center gap-1 p-4 ${stat.color} rounded-lg`}>
                <span className="text-2xl font-black">{stat.value}</span>
                <span className="text-center text-[11px] font-bold">{stat.label}</span>
              </div>
            </HotelCard>
          ))}
        </div>

        {/* Task board */}
        <HotelCard>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-50 p-4">
            <HotelTabs
              tabs={["ຫ້ອງທັງໝົດ", "ຊັ້ນ 1", "ຊັ້ນ 2", "ຊັ້ນ 3"]}
              active="ຫ້ອງທັງໝົດ"
            />
            <HotelTabs
              tabs={["ທຸກສະຖານະ", "ຕ້ອງທຳຄວາມສະອາດ", "ກຳລັງດຳເນີນ", "ສຳເລັດ"]}
              active="ທຸກສະຖານະ"
            />
          </div>
          <HotelTable
            headers={["ຫ້ອງ", "ປະເພດ", "ຊັ້ນ", "ສະຖານະ", "ແມ່ບ້ານ", "ຄວາມດ່ວນ", "ໝາຍເຫດ", "ການດຳເນີນການ"]}
            rows={housekeepingTasks.map((task) => [
              <span key="room" className="font-black text-slate-950">{task.room}</span>,
              task.type,
              `ຊັ້ນ ${task.floor}`,
              <span key="status" className={`rounded-md border px-2 py-1 text-[10px] font-black ${hkStatusClass(task.status)}`}>{task.status}</span>,
              task.cleaner,
              <span key="priority" className={`rounded-md border px-2 py-1 text-[10px] font-black ${priorityClass(task.priority)}`}>{task.priority}</span>,
              <span key="notes" className="max-w-[160px] truncate text-xs text-slate-500">{task.notes || "—"}</span>,
              <ActionCell key="action" />
            ])}
          />
        </HotelCard>

        {/* Cleaner assignments */}
        <HotelCard title="ທີມແມ່ບ້ານ">
          <div className="grid gap-4 p-4 md:grid-cols-3">
            {[
              { name: "Bounmee", rooms: ["101", "103", "204"], done: 2, total: 3 },
              { name: "Naly", rooms: ["102", "202"], done: 1, total: 2 },
              { name: "Malin", rooms: ["104", "203"], done: 1, total: 2 }
            ].map((cleaner) => (
              <div key={cleaner.name} className="rounded-lg border border-blue-100 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-950">{cleaner.name}</span>
                  <span className="text-xs font-bold text-slate-500">
                    {cleaner.done}/{cleaner.total} ຫ້ອງ
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-blue-50">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all"
                    style={{ width: `${(cleaner.done / cleaner.total) * 100}%` }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {cleaner.rooms.map((r) => (
                    <span key={r} className="rounded border border-blue-100 px-2 py-0.5 text-[11px] font-black text-blue-600">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </HotelCard>
      </div>
    </HospitalityPage>
  );
}

