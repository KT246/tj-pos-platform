import {
  ArrowDown,
  CalendarCheck,
  CalendarDays,
  Check,
  ChefHat,
  Clock3,
  CreditCard,
  FileText,
  GitMerge,
  Grid3X3,
  MoreHorizontal,
  Percent,
  Plus,
  ReceiptText,
  Settings2,
  Split,
  Table2,
  Users,
  UtensilsCrossed,
  WalletCards
} from "lucide-react";
import type { ReactNode } from "react";

import {
  Badge,
  Button,
  Card,
  IconButton,
  KpiGrid,
  PageHeader,
  SelectButton
} from "../components/business-admin-primitives";
import { BusinessAdminShell } from "../layouts/business-admin-shell";
import type { BusinessMenuKey, Kpi, Tone } from "../types";
import { toLaoNode, toLaoText } from "../utils/lao-labels";

type RestaurantTableStatus = "available" | "occupied" | "reserved" | "cleaning" | "blocked";

const tableStatusStyles: Record<
  RestaurantTableStatus,
  { label: string; className: string; dot: string; tone: Tone }
> = {
  available: {
    label: "ວ່າງ",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    tone: "emerald"
  },
  occupied: {
    label: "ມີລູກຄ້າ",
    className: "border-orange-200 bg-orange-50 text-orange-700",
    dot: "bg-orange-500",
    tone: "amber"
  },
  reserved: {
    label: "ຈອງແລ້ວ",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
    tone: "blue"
  },
  cleaning: {
    label: "ກຳລັງທຳຄວາມສະອາດ",
    className: "border-violet-200 bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
    tone: "violet"
  },
  blocked: {
    label: "ປິດໃຊ້",
    className: "border-slate-200 bg-slate-100 text-slate-500",
    dot: "bg-slate-400",
    tone: "slate"
  }
};

const restaurantTables = [
  { id: "T01", area: "Indoor", pax: 2, status: "available", top: "22%", left: "8%" },
  { id: "T02", area: "Indoor", pax: 2, status: "available", top: "22%", left: "24%" },
  { id: "T03", area: "Indoor", pax: 4, status: "available", top: "22%", left: "42%" },
  { id: "T04", area: "Indoor", pax: 4, status: "occupied", top: "22%", left: "62%", time: "45m" },
  { id: "T06", area: "Indoor", pax: 2, status: "available", top: "54%", left: "10%" },
  { id: "T07", area: "Indoor", pax: 6, status: "reserved", top: "54%", left: "30%", time: "7:00 PM" },
  { id: "T08", area: "Indoor", pax: 2, status: "available", top: "54%", left: "49%" },
  { id: "T10", area: "Indoor", pax: 4, status: "occupied", top: "54%", left: "68%", time: "18m" },
  { id: "T11", area: "Indoor", pax: 6, status: "cleaning", top: "78%", left: "28%" },
  { id: "T12", area: "Terrace", pax: 4, status: "available", top: "28%", left: "22%" },
  { id: "T13", area: "Terrace", pax: 4, status: "occupied", top: "28%", left: "58%", time: "30m" },
  { id: "T14", area: "Terrace", pax: 2, status: "available", top: "64%", left: "28%" },
  { id: "T15", area: "Terrace", pax: 2, status: "available", top: "64%", left: "58%" },
  { id: "R01", area: "Private Room", pax: 8, status: "reserved", top: "24%", left: "28%", time: "6:30 PM" },
  { id: "R02", area: "Private Room", pax: 8, status: "available", top: "64%", left: "38%" }
] satisfies Array<{
  id: string;
  area: string;
  pax: number;
  status: RestaurantTableStatus;
  top: string;
  left: string;
  time?: string;
}>;

const reservations = [
  {
    time: "11:00 AM",
    name: "Mr. Alex Johnson",
    phone: "020 5155 1234",
    pax: 2,
    table: "T05",
    area: "Indoor",
    status: "Seated",
    notes: "Window seat"
  },
  {
    time: "12:30 PM",
    name: "Ms. Soukanya Latsamy",
    phone: "020 9988 7766",
    pax: 4,
    table: "T02",
    area: "Indoor",
    status: "Seated",
    notes: "Anniversary"
  },
  {
    time: "2:00 PM",
    name: "Mr. Bounphanh V.",
    phone: "020 5155 8999",
    pax: 6,
    table: "R01",
    area: "Private Room",
    status: "Confirmed",
    notes: "Birthday"
  },
  {
    time: "6:00 PM",
    name: "Khamphone Family",
    phone: "020 2244 5566",
    pax: 5,
    table: "T13",
    area: "Terrace",
    status: "Confirmed",
    notes: "High chair"
  },
  {
    time: "7:00 PM",
    name: "Mr. David Wilson",
    phone: "020 1111 3344",
    pax: 3,
    table: "T10",
    area: "Indoor",
    status: "Confirmed",
    notes: "-"
  },
  {
    time: "8:00 PM",
    name: "Walk-in",
    phone: "-",
    pax: 2,
    table: "-",
    area: "-",
    status: "Walk-in",
    notes: "-"
  }
];

const courses = [
  ["Appetizer", "1", "Yes", "Kitchen, Cold Station", "Spring Roll, Salad, Bruschetta"],
  ["Soup", "2", "Yes", "Kitchen", "Tom Yum, Pumpkin Soup"],
  ["Main Course", "3", "Yes", "Kitchen, Grill Station", "Steak, Salmon, Pasta"],
  ["Sides", "4", "No", "Kitchen", "French Fries, Mashed Potato"],
  ["Dessert", "5", "Yes", "Pastry Station", "Cheesecake, Ice Cream"],
  ["Beverage", "6", "No", "Bar", "Juice, Soft Drink"]
];

const splitGuests = [
  { guest: "Guest 1", amount: "LAK 195,000", charge: "LAK 5,000" },
  { guest: "Guest 2", amount: "LAK 180,000", charge: "-" },
  { guest: "Guest 3", amount: "LAK 150,000", charge: "-" },
  { guest: "Guest 4", amount: "LAK 60,000", charge: "Unpaid" }
];

const splitItems = [
  ["Grilled Salmon", "1", "LAK 120,000", "Guest 1"],
  ["Ribeye Steak", "1", "LAK 180,000", "Guest 2"],
  ["Caesar Salad", "1", "LAK 45,000", "Guest 3"],
  ["Garlic Bread", "1", "LAK 25,000", "Guest 3"],
  ["Coke", "2", "LAK 15,000", "Guest 4"],
  ["Chocolate Cake", "1", "LAK 40,000", "Guest 1"]
];

const endDayItems = [
  ["Grilled Salmon", "48"],
  ["Ribeye Steak", "36"],
  ["Tom Yum Soup", "33"],
  ["Mango Sticky Rice", "31"],
  ["Coca Cola", "60"]
];

export function RestaurantAreasTablesPage() {
  return (
    <RestaurantShell
      active="Table Map"
      title="ແຜນຜັງໂຕະ Restaurant"
      description="ຈັດການ area, table, ສະຖານະໂຕະ ແລະ order ຂອງຮ້ານອາຫານ."
      kpis={[
        { label: "ໂຕະທັງໝົດ", value: "38", change: "3 areas", tone: "blue", icon: Grid3X3 },
        { label: "ມີລູກຄ້າ", value: "11", change: "active", tone: "amber", icon: Users },
        { label: "ຈອງແລ້ວ", value: "7", change: "today", tone: "violet", icon: CalendarCheck },
        { label: "ວ່າງ", value: "20", change: "ready", tone: "emerald", icon: Check }
      ]}
      actions={
        <>
          <Button variant="secondary" icon={Table2}>List View</Button>
          <Button icon={Plus}>ສ້າງ Order</Button>
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr_0.8fr]">
        <RestaurantAreaCard title="Indoor Area" area="Indoor" />
        <RestaurantAreaCard title="Terrace" area="Terrace" />
        <RestaurantAreaCard title="Private Room" area="Private Room" />
      </div>
    </RestaurantShell>
  );
}

export function ReservationBookPage() {
  return (
    <RestaurantShell
      active="Reservations"
      title="ປື້ມຈອງໂຕະ"
      description="ຈັດການ reservation ປະຈຳວັນ, walk-in, confirmed ແລະ seated."
      kpis={[
        { label: "ຈອງທັງໝົດ", value: "22", change: "today", tone: "blue", icon: CalendarCheck },
        { label: "Confirmed", value: "16", change: "ready", tone: "emerald", icon: Check },
        { label: "Walk-in", value: "6", change: "queue", tone: "amber", icon: Users },
        { label: "No-show Risk", value: "1", change: "watch", tone: "red", icon: Clock3 }
      ]}
      actions={<Button icon={Plus}>ສ້າງ Reservation</Button>}
    >
      <div className="grid gap-4 xl:grid-cols-[250px_minmax(0,1fr)]">
        <Card title="May 2025">
          <div className="p-4">
            <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-black text-slate-500">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <span key={`${day}-${index}`}>{day}</span>
              ))}
              {Array.from({ length: 35 }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`h-8 rounded-md text-xs font-black ${
                    index === 17
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 hover:bg-blue-50"
                  }`}
                >
                  {index + 1 <= 31 ? index + 1 : ""}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {[
                ["All Reservations", "22"],
                ["Today", "22"],
                ["Walk-in", "6"],
                ["Confirmed", "16"],
                ["Seated", "8"],
                ["Cancelled", "2"]
              ].map(([label, value], index) => (
                <button
                  key={label}
                  type="button"
                  className={`flex h-9 w-full items-center justify-between rounded-md px-3 text-[12px] font-black ${
                    index === 0
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-blue-50"
                  }`}
                >
                  {label}
                  <span>{value}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>
        <Card
          title="Reservation List"
          action={
            <div className="flex gap-2">
              <Button variant="secondary" icon={CalendarDays}>Day</Button>
              <Button variant="secondary" icon={Settings2}>Filter</Button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-blue-100 text-[11px] font-black text-slate-500">
                  {["Time", "Name", "Phone", "Pax", "Table", "Area", "Status", "Notes", ""].map(
                    (heading) => (
                      <th key={heading} className="px-4 py-3">{heading}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {reservations.map((row) => (
                  <tr key={`${row.time}-${row.name}`} className="border-b border-blue-50 last:border-b-0">
                    <td className="px-4 py-3 font-black text-slate-950">{row.time}</td>
                    <td className="px-4 py-3 font-black text-slate-950">{row.name}</td>
                    <td className="px-4 py-3 font-bold text-slate-600">{row.phone}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">{row.pax}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">{row.table}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">{row.area}</td>
                    <td className="px-4 py-3">
                      <Badge tone={row.status === "Walk-in" ? "amber" : row.status === "Seated" ? "emerald" : "blue"}>
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-600">{row.notes}</td>
                    <td className="px-4 py-3 text-right">
                      <IconButton icon={MoreHorizontal} label="More" tone="slate" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationLite label="ສະແດງ 1-6 ຈາກ 22 reservations" />
        </Card>
      </div>
    </RestaurantShell>
  );
}

export function KitchenCourseManagementPage() {
  return (
    <RestaurantShell
      active="Kitchen Courses"
      title="ຈັດການ Course ອາຫານ"
      description="ກຳນົດລຳດັບ course, station ຄົວ ແລະ routing ໄປ KDS."
      kpis={[
        { label: "Courses", value: "6", change: "active", tone: "blue", icon: ChefHat },
        { label: "Kitchen Stations", value: "5", change: "enabled", tone: "emerald", icon: UtensilsCrossed },
        { label: "Display To Staff", value: "4", change: "courses", tone: "amber", icon: Settings2 },
        { label: "Typical Items", value: "34", change: "mapped", tone: "violet", icon: FileText }
      ]}
      actions={<Button icon={Plus}>ສ້າງ Course</Button>}
    >
      <Card title="Course Management">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-blue-100 text-[11px] font-black text-slate-500">
                {["Course Name", "Sequence", "Display To Staff", "Stations", "Typical Items", "Status", "Actions"].map(
                  (heading) => (
                    <th key={heading} className="px-4 py-3">{heading}</th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {courses.map(([name, sequence, display, stations, items]) => (
                <tr key={name} className="border-b border-blue-50 last:border-b-0">
                  <td className="px-4 py-3 font-black text-slate-950">{name}</td>
                  <td className="px-4 py-3 font-bold text-slate-700">{sequence}</td>
                  <td className="px-4 py-3 font-bold text-slate-700">{display}</td>
                  <td className="px-4 py-3 font-bold text-slate-700">{stations}</td>
                  <td className="px-4 py-3 font-bold text-slate-700">{items}</td>
                  <td className="px-4 py-3"><Badge tone="emerald">Active</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <IconButton icon={Settings2} label="Edit" />
                      <IconButton icon={MoreHorizontal} label="More" tone="slate" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationLite label="ສະແດງ 1-6 ຈາກ 6 courses" />
      </Card>
    </RestaurantShell>
  );
}

export function SplitBillPage() {
  return (
    <RestaurantShell
      active="Split Bill"
      title="ແບ່ງ Bill ຕາມ Guest / Item"
      description="ແບ່ງຍອດຊຳລະຕາມແຂກ ຫຼືຕາມ item ສຳລັບ table service."
      kpis={[
        { label: "Table", value: "T04", change: "active", tone: "blue", icon: Table2 },
        { label: "Order", value: "ORD-00158", change: "4 guests", tone: "emerald", icon: ReceiptText },
        { label: "Total", value: "LAK 585,000", change: "before charge", tone: "amber", icon: WalletCards },
        { label: "Unpaid", value: "1", change: "guest", tone: "red", icon: Users }
      ]}
      actions={<Button icon={ReceiptText}>Review & Pay</Button>}
    >
      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card
          title="Guests"
          action={
            <div className="flex gap-2">
              <Button variant="secondary" icon={Users}>By Guest</Button>
              <Button variant="secondary" icon={Split}>By Item</Button>
            </div>
          }
        >
          <div className="space-y-2 p-4">
            {splitGuests.map((guest, index) => (
              <button
                key={guest.guest}
                type="button"
                className={`w-full rounded-lg border p-3 text-left transition ${
                  index === 0
                    ? "border-blue-200 bg-blue-50"
                    : "border-blue-100 bg-white hover:bg-blue-50/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-950">{guest.guest}</span>
                  <span className="text-sm font-black text-slate-950">{guest.amount}</span>
                </div>
                <p className="mt-1 text-xs font-bold text-emerald-600">{guest.charge}</p>
              </button>
            ))}
            <Button variant="secondary" icon={Plus}>Add Guest</Button>
          </div>
        </Card>
        <Card title="Order Items">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-blue-100 text-[11px] font-black text-slate-500">
                  {["Item", "Qty", "Unit Price", "Assign To"].map((heading) => (
                    <th key={heading} className="px-4 py-3">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {splitItems.map(([item, qty, price, guest]) => (
                  <tr key={item} className="border-b border-blue-50 last:border-b-0">
                    <td className="px-4 py-3 font-black text-slate-950">{item}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">{qty}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">{price}</td>
                    <td className="px-4 py-3">
                      <SelectPill>{guest}</SelectPill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-blue-50 px-4 py-3">
            <span className="text-sm font-bold text-slate-500">
              {toLaoText("Total Amount")}
            </span>
            <span className="text-lg font-black text-slate-950">LAK 585,000</span>
          </div>
        </Card>
      </div>
    </RestaurantShell>
  );
}

export function ServiceChargeTaxPreviewPage() {
  return (
    <RestaurantShell
      active="Service Charge"
      title="Service Charge & Tax Preview"
      description="Preview ແລະຕັ້ງຄ່າ service charge, VAT, rounding ກ່ອນຊຳລະ."
      kpis={[
        { label: "Subtotal", value: "LAK 585,000", change: "order", tone: "blue", icon: ReceiptText },
        { label: "Service Charge", value: "10%", change: "enabled", tone: "emerald", icon: Percent },
        { label: "VAT", value: "10%", change: "enabled", tone: "amber", icon: FileText },
        { label: "Payable", value: "LAK 708,000", change: "rounded", tone: "violet", icon: CreditCard }
      ]}
      actions={<Button icon={Settings2}>Save Settings</Button>}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card title="Preview">
          <div className="space-y-5 p-5">
            {[
              ["Subtotal", "LAK 585,000"],
              ["Service Charge (10%)", "LAK 58,500"],
              ["Tax (VAT 10%)", "LAK 64,350"],
              ["Rounding", "LAK 150"]
            ].map(([label, value]) => (
              <InfoRow key={label} label={label} value={value} />
            ))}
            <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
              <span className="text-sm font-black text-slate-700">
                {toLaoText("Total Payable")}
              </span>
              <span className="text-2xl font-black text-blue-600">LAK 708,000</span>
            </div>
          </div>
        </Card>
        <Card title="Settings">
          <div className="space-y-4 p-5">
            <ToggleRow title="Service Charge" enabled />
            <SettingRow label="Type" value="Percentage" />
            <SettingRow label="Rate" value="10%" />
            <ToggleRow title="Tax (VAT)" enabled />
            <SettingRow label="Type" value="VAT" />
            <SettingRow label="Rate" value="10%" />
            <SettingRow label="Rounding" value="Round to nearest 100 LAK" />
            <div className="rounded-md bg-blue-50 p-3 text-xs font-black text-blue-700">
              Service charge is distributed to staff according to your configuration.
            </div>
          </div>
        </Card>
      </div>
    </RestaurantShell>
  );
}

export function MergeTransferTablePage() {
  return (
    <RestaurantShell
      active="Merge / Transfer"
      title="ຍ້າຍ / ລວມໂຕະ"
      description="ຍ້າຍ order ຈາກໂຕະໜຶ່ງໄປອີກໂຕະ ຫຼືລວມ table ໃຫ້ເປັນ group."
      kpis={[
        { label: "Source Table", value: "T04", change: "occupied", tone: "amber", icon: Table2 },
        { label: "Guests", value: "4", change: "current", tone: "blue", icon: Users },
        { label: "Destination", value: "T12", change: "available", tone: "emerald", icon: GitMerge },
        { label: "Order Amount", value: "LAK 585,000", change: "move", tone: "violet", icon: ReceiptText }
      ]}
      actions={<Button icon={GitMerge}>Transfer Table</Button>}
    >
      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_280px]">
        <Card title="From (Source Table)">
          <div className="space-y-4 p-4">
            <h3 className="text-2xl font-black text-slate-950">Table T04</h3>
            <Badge tone="amber">ມີລູກຄ້າ</Badge>
            <InfoRow label="Guests" value="4" />
            <InfoRow label="Order" value="ORD-00158" />
            <InfoRow label="Duration" value="45m" />
            <InfoRow label="Total" value="LAK 585,000" />
          </div>
        </Card>
        <Card title="To (Destination Table)">
          <div className="space-y-2 p-4">
            {[
              ["T06", "Indoor", "2 pax"],
              ["T12", "Terrace", "4 pax"],
              ["R02", "Private Room", "8 pax"]
            ].map(([table, area, pax], index) => (
              <button
                key={table}
                type="button"
                className={`flex h-14 w-full items-center gap-3 rounded-lg border px-4 text-left transition ${
                  index === 1
                    ? "border-blue-600 bg-blue-50"
                    : "border-blue-100 bg-white hover:bg-blue-50"
                }`}
              >
                <span className={`h-4 w-4 rounded-full border ${index === 1 ? "border-blue-600 bg-blue-600" : "border-slate-300"}`} />
                <span className="flex-1 text-sm font-black text-slate-950">{table}</span>
                <span className="text-xs font-bold text-slate-500">
                  {toLaoText(area)}
                </span>
                <Badge tone="emerald">Available</Badge>
                <span className="text-xs font-bold text-slate-500">{pax}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card title="Transfer Summary">
          <div className="space-y-5 p-4">
            <InfoRow label="From" value="T04 (Indoor)" />
            <div className="flex justify-center text-blue-600"><ArrowDown className="h-8 w-8" /></div>
            <InfoRow label="To" value="T12 (Terrace)" />
            <InfoRow label="Guests" value="4" />
            <InfoRow label="Order Amount" value="LAK 585,000" />
            <Button icon={GitMerge}>Transfer Table</Button>
          </div>
        </Card>
      </div>
    </RestaurantShell>
  );
}

export function RestaurantEndOfDaySummaryPage() {
  return (
    <RestaurantShell
      active="End of Day"
      title="ສະຫຼຸບປິດມື້ Restaurant"
      description="ສະຫຼຸບ sales, payment, void, discount ແລະ top items ກ່ອນ close day."
      kpis={[
        { label: "Total Sales", value: "LAK 8,450,000", change: "12.5%", tone: "blue", icon: ReceiptText },
        { label: "Orders", value: "156", change: "8.2%", tone: "emerald", icon: FileText },
        { label: "Avg. Order Value", value: "LAK 54,167", change: "3.2%", tone: "amber", icon: WalletCards },
        { label: "Covers", value: "328", change: "7.9%", tone: "violet", icon: Users },
        { label: "Void Amount", value: "LAK 120,000", change: "5.1%", tone: "red", icon: ReceiptText },
        { label: "Discounts", value: "LAK 210,000", change: "2.4%", tone: "red", icon: Percent }
      ]}
      actions={
        <>
          <SelectButton icon={CalendarDays}>May 18, 2025</SelectButton>
          <Button icon={ReceiptText}>Close Day</Button>
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[1fr_1.15fr_0.8fr]">
        <Card title="Sales Summary">
          <div className="space-y-4 p-4">
            {[
              ["Food Sales", "LAK 6,120,000"],
              ["Beverage Sales", "LAK 1,990,000"],
              ["Service Charge", "LAK 445,000"],
              ["Tax (VAT 10%)", "LAK 645,000"]
            ].map(([label, value]) => (
              <InfoRow key={label} label={label} value={value} />
            ))}
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
              <span className="font-black text-slate-700">{toLaoText("Total")}</span>
              <span className="text-xl font-black text-slate-950">LAK 8,450,000</span>
            </div>
          </div>
        </Card>
        <Card title="Payment Summary">
          <div className="grid gap-4 p-5 2xl:grid-cols-[180px_1fr]">
            <div className="mx-auto">
              <DonutChart center="LAK 8.45M" />
            </div>
            <div className="space-y-3">
              {[
                ["Cash", "LAK 2,850,000", "33.7%", "bg-blue-600"],
                ["Card", "LAK 2,320,000", "31.1%", "bg-emerald-500"],
                ["Mobile / QR", "LAK 1,980,000", "25.2%", "bg-amber-500"]
              ].map(([label, value, percent, color]) => (
                <div
                  key={label}
                  className="grid grid-cols-[minmax(95px,1fr)_minmax(132px,auto)] items-center gap-3 text-xs font-black"
                >
                  <span className="flex min-w-0 items-center gap-2 text-slate-600">
                    <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                    {toLaoText(label)}
                  </span>
                  <span className="text-right text-slate-950">
                    {value}
                    <span className="ml-1 text-slate-500">({percent})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card title="Top Items Sold">
          <div className="divide-y divide-blue-50">
            {endDayItems.map(([name, qty], index) => (
              <div key={name} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="font-black text-slate-950">
                  {index + 1}. {toLaoText(name)}
                </span>
                <span className="font-black text-slate-600">{qty}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Notes" className="xl:col-span-2">
          <div className="p-4 text-sm font-bold leading-7 text-slate-600">
            <p>- {toLaoText("Restaurant closed at 11:30 PM")}</p>
            <p>- {toLaoText("All cash deposited")}</p>
            <p>- {toLaoText("One void order reviewed by manager")}</p>
          </div>
        </Card>
        <Card title="Closed By">
          <div className="flex items-center gap-3 p-4">
            <span
              className="h-12 w-12 rounded-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=96&q=80)"
              }}
            />
            <span>
              <span className="block text-sm font-black text-slate-950">Somchai Phommaseanh</span>
              <span className="block text-xs font-bold text-slate-500">
                {toLaoText("Manager - 11:35 PM")}
              </span>
            </span>
          </div>
        </Card>
      </div>
    </RestaurantShell>
  );
}

function RestaurantShell({
  active,
  title,
  description,
  kpis,
  actions,
  children
}: {
  active: Extract<
    BusinessMenuKey,
    | "Table Map"
    | "Reservations"
    | "Kitchen Courses"
    | "Split Bill"
    | "Service Charge"
    | "Merge / Transfer"
    | "End of Day"
  >;
  title: string;
  description: string;
  kpis: Kpi[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <BusinessAdminShell active={active} businessLabel="TJ Restaurant Vientiane">
      <PageHeader title={title} description={description} actions={actions} />
      <KpiGrid kpis={kpis} />
      {children}
    </BusinessAdminShell>
  );
}

function RestaurantAreaCard({ title, area }: { title: string; area: string }) {
  const tables = restaurantTables.filter((table) => table.area === area);

  return (
    <Card title={title}>
      <div className="p-4">
        <div className="mb-3 flex flex-wrap gap-3 text-[11px] font-bold text-slate-500">
          {Object.entries(tableStatusStyles).map(([key, value]) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${value.dot}`} />
              {value.label}
            </span>
          ))}
        </div>
        <div className="relative h-[330px] overflow-hidden rounded-lg border border-blue-100 bg-[linear-gradient(90deg,rgba(148,163,184,.18)_1px,transparent_1px),linear-gradient(180deg,rgba(148,163,184,.18)_1px,transparent_1px)] bg-[length:28px_28px]">
          <div className="absolute inset-x-5 top-5 h-[1px] bg-blue-100" />
          <div className="absolute right-4 bottom-4 grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <span key={index} className="h-8 w-8 rounded-full border border-emerald-100 bg-emerald-50" />
            ))}
          </div>
          {tables.map((table) => (
            <button
              key={table.id}
              type="button"
              className={`absolute flex h-14 w-14 items-center justify-center rounded-xl border-2 text-[12px] font-black transition hover:-translate-y-1 hover:shadow-lg ${tableStatusStyles[table.status].className}`}
              style={{ top: table.top, left: table.left }}
              title={`${table.id} - ${tableStatusStyles[table.status].label}`}
            >
              <span>
                {table.id}
                {table.time ? <span className="block text-[9px]">{table.time}</span> : null}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-blue-50 pb-2 last:border-b-0">
      <span className="text-xs font-bold text-slate-500">{toLaoText(label)}</span>
      <span className="text-right text-xs font-black text-slate-950">
        {toLaoText(value)}
      </span>
    </div>
  );
}

function ToggleRow({ title, enabled }: { title: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-black text-slate-700">{toLaoText(title)}</span>
      <span className={`relative h-6 w-11 rounded-full ${enabled ? "bg-blue-600" : "bg-slate-200"}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow ${enabled ? "left-6" : "left-1"}`} />
      </span>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-center gap-3">
      <span className="text-xs font-black text-slate-500">{toLaoText(label)}</span>
      <SelectPill>{value}</SelectPill>
    </div>
  );
}

function SelectPill({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-9 w-full items-center justify-between rounded-md border border-blue-100 bg-white px-3 text-left text-[12px] font-black text-slate-700 transition hover:bg-blue-50"
    >
      {toLaoNode(children)}
      <span className="text-slate-400">⌄</span>
    </button>
  );
}

function DonutChart({ center }: { center: string }) {
  return (
    <div className="relative h-40 w-40 rounded-full bg-[conic-gradient(#2563eb_0_34%,#10b981_34%_65%,#f59e0b_65%_100%)]">
      <div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
        <span className="text-sm font-black text-slate-950">{center}</span>
        <span className="text-[10px] font-bold text-slate-500">
          {toLaoText("Total")}
        </span>
      </div>
    </div>
  );
}

function PaginationLite({ label }: { label: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-50 px-4 py-3">
      <p className="text-[12px] font-semibold text-slate-500">{toLaoText(label)}</p>
      <div className="flex items-center gap-2">
        {["<", "1", "2", ">"].map((item, index) => (
          <button
            key={`${item}-${index}`}
            type="button"
            className={`h-8 min-w-8 rounded-md border text-xs font-black ${
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
