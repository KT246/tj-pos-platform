import {
  CalendarDays,
  Check,
  CircleDot,
  Clock3,
  Coffee,
  CupSoda,
  Edit3,
  Eye,
  Flame,
  Grid3X3,
  MoreHorizontal,
  Plus,
  ReceiptText,
  Settings2,
  Sparkles,
  Star,
  Timer,
  Users
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

const coffeeImage =
  "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=420&q=80";
const croissantImage =
  "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=420&q=80";
const latteImage =
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=420&q=80";

const tableStatusStyles = {
  available: {
    label: "ວ່າງ",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500"
  },
  occupied: {
    label: "ມີລູກຄ້າ",
    className: "border-orange-200 bg-orange-50 text-orange-700",
    dot: "bg-orange-500"
  },
  reserved: {
    label: "ຈອງແລ້ວ",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-500"
  },
  cleaning: {
    label: "ກຳລັງທຳຄວາມສະອາດ",
    className: "border-violet-200 bg-violet-50 text-violet-700",
    dot: "bg-violet-500"
  },
  blocked: {
    label: "ປິດໃຊ້",
    className: "border-slate-200 bg-slate-100 text-slate-500",
    dot: "bg-slate-400"
  }
} as const;

type CafeTableStatus = keyof typeof tableStatusStyles;

const cafeTables: {
  id: string;
  seats: number;
  status: CafeTableStatus;
  zone: string;
  order?: string;
  amount?: string;
  time?: string;
  top: string;
  left: string;
  wide?: boolean;
}[] = [
  { id: "T01", seats: 2, status: "available", zone: "ໃນຮ້ານ", top: "12%", left: "6%" },
  { id: "T02", seats: 2, status: "available", zone: "ໃນຮ້ານ", top: "12%", left: "24%" },
  { id: "T03", seats: 4, status: "available", zone: "ໃນຮ້ານ", top: "12%", left: "42%" },
  {
    id: "T04",
    seats: 2,
    status: "occupied",
    zone: "ໃນຮ້ານ",
    order: "ORD-0018",
    amount: "LAK 85,000",
    time: "10:24 AM",
    top: "12%",
    left: "62%"
  },
  { id: "T05", seats: 2, status: "available", zone: "ໃນຮ້ານ", top: "12%", left: "80%" },
  { id: "T06", seats: 2, status: "available", zone: "ໃນຮ້ານ", top: "35%", left: "8%" },
  { id: "T07", seats: 4, status: "reserved", zone: "ໃນຮ້ານ", top: "35%", left: "29%" },
  { id: "T08", seats: 2, status: "available", zone: "ໃນຮ້ານ", top: "35%", left: "48%" },
  { id: "T09", seats: 2, status: "available", zone: "ໃນຮ້ານ", top: "35%", left: "70%" },
  { id: "T10", seats: 2, status: "available", zone: "ໃນຮ້ານ", top: "58%", left: "8%" },
  { id: "T11", seats: 4, status: "cleaning", zone: "ໃນຮ້ານ", top: "58%", left: "29%" },
  { id: "T12", seats: 2, status: "available", zone: "ໃນຮ້ານ", top: "58%", left: "48%" },
  {
    id: "T13",
    seats: 6,
    status: "occupied",
    zone: "ໃນຮ້ານ",
    order: "ORD-0021",
    amount: "LAK 142,000",
    time: "10:31 AM",
    top: "58%",
    left: "70%",
    wide: true
  },
  { id: "T14", seats: 2, status: "available", zone: "ໃນຮ້ານ", top: "80%", left: "8%" },
  { id: "T15", seats: 2, status: "available", zone: "ໃນຮ້ານ", top: "80%", left: "30%" },
  { id: "T16", seats: 4, status: "available", zone: "ໃນຮ້ານ", top: "80%", left: "50%" }
];

const modifierRows = [
  {
    group: "Milk Choice",
    type: "ເລືອກໄດ້ 1",
    required: "ແມ່ນ",
    multi: "ບໍ່",
    sort: "1",
    status: "ເປີດໃຊ້"
  },
  {
    group: "ລະດັບຄວາມຫວານ",
    type: "ເລືອກໄດ້ 1",
    required: "ແມ່ນ",
    multi: "ບໍ່",
    sort: "2",
    status: "ເປີດໃຊ້"
  },
  { group: "Shot", type: "ເລືອກໄດ້ 1", required: "ບໍ່", multi: "ບໍ່", sort: "3", status: "ເປີດໃຊ້" },
  {
    group: "Temperature",
    type: "ເລືອກໄດ້ 1",
    required: "ບໍ່",
    multi: "ບໍ່",
    sort: "4",
    status: "ເປີດໃຊ້"
  },
  { group: "ຕົວເລືອກເພີ່ມ", type: "ເລືອກໄດ້ຫຼາຍ", required: "ບໍ່", multi: "ແມ່ນ", sort: "5", status: "ເປີດໃຊ້" },
  { group: "Toppings", type: "ເລືອກໄດ້ຫຼາຍ", required: "ບໍ່", multi: "ແມ່ນ", sort: "6", status: "ເປີດໃຊ້" }
];

const queueRows = [
  {
    order: "A012",
    type: "ຮັບກັບບ້ານ",
    items: "Iced Americano, Croissant",
    time: "10:30 AM",
    status: "ກຳລັງກຽມ",
    station: "Bar 1"
  },
  {
    order: "A013",
    type: "ນັ່ງທີ່ຮ້ານ - T04",
    items: "Latte",
    time: "10:29 AM",
    status: "ກຳລັງກຽມ",
    station: "Bar 2"
  },
  {
    order: "A014",
    type: "ຮັບກັບບ້ານ",
    items: "Mocha, Chocolate Cake",
    time: "10:25 AM",
    status: "ກຳລັງກຽມ",
    station: "Bar 1"
  },
  {
    order: "A008",
    type: "ຮັບທີ່ counter",
    items: "Caramel Macchiato",
    time: "10:20 AM",
    status: "ພ້ອມ",
    station: "Pickup"
  },
  {
    order: "A009",
    type: "ນັ່ງທີ່ຮ້ານ - T02",
    items: "Flat White",
    time: "10:21 AM",
    status: "ພ້ອມ",
    station: "Bar 2"
  },
  {
    order: "A010",
    type: "ຮັບກັບບ້ານ",
    items: "Iced Latte, Brownie",
    time: "10:22 AM",
    status: "ພ້ອມ",
    station: "Pickup"
  }
];

const happyHourRows = [
  {
    name: "Afternoon Delight",
    schedule: "Mon - Fri",
    time: "2:00 PM - 5:00 PM",
    discount: "ຫຼຸດ 20%",
    status: "ເປີດໃຊ້",
    icon: Flame,
    tone: "amber" as Tone
  },
  {
    name: "Sunset Special",
    schedule: "Mon - Thu",
    time: "5:00 PM - 7:00 PM",
    discount: "Buy 1 Get 1 50%",
    status: "ເປີດໃຊ້",
    icon: Sparkles,
    tone: "red" as Tone
  },
  {
    name: "Weekend Boost",
    schedule: "Sat - Sun",
    time: "All Day",
    discount: "15% Off",
    status: "ເປີດໃຊ້",
    icon: Star,
    tone: "blue" as Tone
  },
  {
    name: "Late Night Coffee",
    schedule: "Every Day",
    time: "9:00 PM - Close",
    discount: "10% Off",
    status: "ປິດໃຊ້",
    icon: Clock3,
    tone: "slate" as Tone
  }
];

const topItems = [
  { name: "ລາເຕ້ເຢັນ", qty: 86, sales: "LAK 2,236,000", image: latteImage },
  { name: "Americano", qty: 72, sales: "LAK 1,512,000", image: coffeeImage },
  { name: "Cappuccino", qty: 48, sales: "LAK 1,104,000", image: coffeeImage },
  { name: "ຄຣົວຊອງ", qty: 35, sales: "LAK 525,000", image: croissantImage },
  { name: "Chocolate Cake", qty: 28, sales: "LAK 476,000", image: croissantImage }
];

export function CafeFloorTableMapPage() {
  const selectedTable = cafeTables.find((table) => table.id === "T04") ?? cafeTables[0];

  return (
    <CafeShell
      active="ແຜນຜັງໂຕະ"
      title="ແຜນຜັງໂຕະ Cafe"
      description="ຕິດຕາມສະຖານະໂຕະ, Order ແລະການຈອງໃນແຕ່ລະພື້ນທີ່."
      kpis={[
        { label: "ໂຕະທັງໝົດ", value: "31", change: "4 zones", tone: "blue", icon: Grid3X3 },
        { label: "ກຳລັງໃຊ້ງານ", value: "8", change: "26%", tone: "amber", icon: Users },
        { label: "ຈອງໄວ້", value: "3", change: "today", tone: "violet", icon: CalendarDays },
        { label: "ວ່າງ", value: "18", change: "ready", tone: "emerald", icon: Check }
      ]}
      actions={
        <>
          <Button icon={Grid3X3} variant="secondary">
            ລາຍການໂຕະ
          </Button>
          <Button icon={Plus}>ສ້າງ Order</Button>
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_260px]">
        <Card>
          <div className="space-y-2 p-3">
            {[
              ["ໃນຮ້ານ", "16"],
              ["Outdoor", "8"],
              ["ລະບຽງ", "6"],
              ["ຫ້ອງ VIP", "2"]
            ].map(([area, count], index) => (
              <button
                key={area}
                type="button"
                className={`flex h-11 w-full items-center justify-between rounded-md border px-3 text-[13px] font-black transition ${
                  index === 0
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-blue-100 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/60"
                }`}
              >
                <span>{area}</span>
                <span>{count}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card
          title="Indoor Area"
          action={
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-500">
              {Object.entries(tableStatusStyles).map(([key, value]) => (
                <span key={key} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${value.dot}`} />
                  {value.label}
                </span>
              ))}
            </div>
          }
        >
          <div className="p-4">
            <div className="relative h-[440px] overflow-hidden rounded-lg border border-blue-100 bg-[linear-gradient(90deg,rgba(148,163,184,.18)_1px,transparent_1px),linear-gradient(180deg,rgba(148,163,184,.18)_1px,transparent_1px)] bg-[length:28px_28px]">
              <div className="absolute inset-x-4 top-4 h-[1px] bg-blue-100" />
              <div className="absolute top-0 right-0 h-full w-[92px] border-l border-blue-100 bg-slate-50/80">
                <div className="m-4 h-20 rounded-md border border-blue-100 bg-white" />
                <div className="mx-4 h-24 rounded-md border border-blue-100 bg-white/80" />
                <div className="absolute right-3 bottom-3 grid grid-cols-2 gap-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <span
                      key={index}
                      className="h-9 w-9 rounded-full border border-emerald-100 bg-emerald-50"
                    />
                  ))}
                </div>
              </div>
              {cafeTables.map((table) => (
                <CafeFloorTable key={table.id} table={table} />
              ))}
            </div>
          </div>
        </Card>

        <Card title={`Table ${selectedTable.id}`}>
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">ສະຖານະ</span>
              <StatusBadge status={selectedTable.status} />
            </div>
            <InfoRow label="ເລກອໍເດີ" value={selectedTable.order ?? "ORD-0018"} />
            <InfoRow label="ຈຳນວນແຂກ" value={`${selectedTable.seats} ຄົນ`} />
            <InfoRow label="ເວລາເຂົ້າ" value={selectedTable.time ?? "10:24 AM"} />
            <InfoRow label="ລວມຍອດ" value={selectedTable.amount ?? "LAK 85,000"} />
            <Button variant="secondary" icon={Eye}>
              ເບິ່ງ Order
            </Button>
            <div className="grid grid-cols-2 gap-2">
              {["Walk-in Order", "Reserve Table", "Merge Table", "Transfer Order"].map(
                (action) => (
                  <button
                    key={action}
                    type="button"
                    className="h-10 rounded-md border border-blue-100 bg-white text-[11px] font-black text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    {action}
                  </button>
                )
              )}
            </div>
          </div>
        </Card>
      </div>
    </CafeShell>
  );
}

export function CoffeeModifiersPage() {
  return (
    <CafeShell
      active="ຕົວເລືອກເພີ່ມ"
      title="ຕົວເລືອກກາເຟ / Recipe"
      description="ຕັ້ງຄ່າ milk, sweetness, shot, temperature ແລະ add-ons ສຳລັບເມນູເຄື່ອງດື່ມ."
      kpis={[
        { label: "ກຸ່ມ Modifier", value: "6", change: "ເປີດໃຊ້", tone: "blue", icon: Settings2 },
        { label: "ຕົວເລືອກບັງຄັບ", value: "2", change: "milk + sweet", tone: "amber", icon: CircleDot },
        { label: "Preset Recipe", value: "18", change: "ເຄື່ອງດື່ມ", tone: "emerald", icon: Coffee },
        { label: "ຄ່າເພີ່ມ", value: "12", change: "items", tone: "violet", icon: Sparkles }
      ]}
      actions={<Button icon={Plus}>ສ້າງ Modifier Group</Button>}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card
          title="ກຸ່ມ Modifier"
          action={
            <div className="flex gap-2">
              {["ກຸ່ມ", "ຕົວເລືອກ", "Preset Recipe", "ຄ່າເພີ່ມ"].map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={`h-8 rounded-md px-3 text-[12px] font-black transition ${
                    index === 0
                      ? "bg-blue-600 text-white"
                      : "border border-blue-100 text-slate-600 hover:bg-blue-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-blue-100 text-[11px] font-black text-slate-500">
                  {[
                    "ຊື່ກຸ່ມ",
                    "ປະເພດ",
                    "ບັງຄັບ",
                    "ເລືອກຫຼາຍ",
                    "ລຳດັບ",
                    "ສະຖານະ",
                    "ຈັດການ"
                  ].map(
                    (heading) => (
                      <th key={heading} className="px-4 py-3">
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {modifierRows.map((row) => (
                  <tr key={row.group} className="border-b border-blue-50 last:border-b-0">
                    <td className="px-4 py-3 font-black text-slate-950">{row.group}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">{row.type}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">{row.required}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">{row.multi}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">{row.sort}</td>
                    <td className="px-4 py-3">
                      <Badge tone="emerald">ເປີດໃຊ້</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <IconButton icon={Edit3} label="ແກ້ໄຂ" />
                        <IconButton icon={MoreHorizontal} label="ເພີ່ມເຕີມ" tone="slate" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationLite label="ສະແດງ 1-6 ຈາກ 6 modifier groups" />
        </Card>

        <Card title="ຕົວຢ່າງເມນູ">
          <div className="space-y-4 p-4">
            <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-slate-50 p-3">
              <span
                className="h-16 w-16 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${latteImage})` }}
              />
              <span>
                <span className="block text-sm font-black text-slate-950">
                  {"ລາເຕ້ເຢັນ"}
                </span>
                <span className="mt-1 block text-xs font-bold text-slate-500">LAK 28,000</span>
              </span>
            </div>
            <OptionGroup title="ປະເພດນົມ" required options={["ນົມສົດ", "ນົມໂອດ", "ອາມອນ", "ນົມຖົ່ວເຫຼືອງ"]} />
            <OptionGroup title="ລະດັບຄວາມຫວານ" required options={["0%", "25%", "50%", "75%", "100%"]} active="50%" />
            <div>
              <p className="mb-2 text-xs font-black text-slate-700">
                {"ຕົວເລືອກເພີ່ມ"}
              </p>
              <div className="space-y-2">
                {["ເພີ່ມ Shot +3,000", "ນ້ຳເຊື່ອມ Vanilla +2,000", "ນ້ຳເຊື່ອມ Caramel +2,000"].map(
                  (item) => (
                    <label key={item} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <span className="flex h-4 w-4 items-center justify-center rounded border border-blue-200 bg-blue-600 text-white">
                        <Check className="h-3 w-3" />
                      </span>
                      {item}
                    </label>
                  )
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </CafeShell>
  );
}

export function BaristaQueueDetailPage() {
  return (
    <CafeShell
      active="ຄິວ Barista"
      title="ຄິວ Barista"
      description="ຕິດຕາມ order ເຄື່ອງດື່ມ, ເວລາລໍຖ້າ ແລະສະຖານະຮັບເຄື່ອງ."
      kpis={[
        { label: "Order ໃໝ່", value: "3", change: "orders", tone: "blue", icon: ReceiptText },
        { label: "ກຳລັງຈັດກຽມ", value: "6", change: "bar", tone: "amber", icon: Timer },
        { label: "ພ້ອມຮັບ", value: "3", change: "pickup", tone: "emerald", icon: Check },
        { label: "Avg. Prep Time", value: "4m 32s", change: "today", tone: "violet", icon: Clock3 }
      ]}
      actions={
        <>
          <Button icon={Check} variant="secondary">
            ປັບທຸກ Order ເປັນພ້ອມ
          </Button>
          <Button icon={Settings2} variant="secondary">
            ຕັ້ງຄ່າ
          </Button>
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Card
          title="ລາຍລະອຽດຄິວ"
          action={
            <div className="flex gap-2">
              {["ທັງໝົດ (12)", "ໃໝ່ (3)", "ກຳລັງຈັດກຽມ (6)", "ພ້ອມຮັບ (3)"].map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={`h-8 rounded-md px-3 text-[12px] font-black ${
                    index === 0
                      ? "bg-blue-600 text-white"
                      : "border border-blue-100 text-slate-600 hover:bg-blue-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-blue-100 text-[11px] font-black text-slate-500">
                  {["#", "Order", "ປະເພດ", "ລາຍການ", "ເວລາ", "Station", "ສະຖານະ", "ຈັດການ"].map(
                    (heading) => (
                      <th key={heading} className="px-4 py-3">
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {queueRows.map((row, index) => (
                  <tr key={row.order} className="border-b border-blue-50 last:border-b-0">
                    <td className="px-4 py-3 font-bold text-slate-500">{index + 1}</td>
                    <td className="px-4 py-3 font-black text-blue-600">{row.order}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">
                      {row.type}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-950">
                      {row.items}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-700">{row.time}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">
                      {row.station}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={row.status === "ພ້ອມ" ? "emerald" : "amber"}>
                        {row.status === "ພ້ອມ" ? "ພ້ອມຮັບ" : "ກຳລັງຈັດກຽມ"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <IconButton icon={Check} label="ພ້ອມຮັບ" tone="emerald" />
                        <IconButton icon={MoreHorizontal} label="ເພີ່ມເຕີມ" tone="slate" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationLite label="ສະແດງ 1-6 ຈາກ 12 queue tickets" />
        </Card>

        <div className="space-y-4">
          <Card title="ສະຫຼຸບຄິວ">
            <div className="grid grid-cols-2 gap-3 p-4">
              {[
                ["Order ໃໝ່", "3"],
                ["ກຳລັງຈັດກຽມ", "6"],
                ["ພ້ອມຮັບ", "3"],
                ["ລວມ", "12"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-blue-100 bg-blue-50/50 p-3">
                  <p className="text-xs font-bold text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-black text-blue-600">{value}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card title="ໝາຍເຫດ Barista">
            <div className="space-y-3 p-4 text-xs font-bold text-slate-600">
              <p className="rounded-md bg-amber-50 p-3 text-amber-700">
                T04 ຂໍ latte ເພີ່ມ shot ແລະນ້ຳຕານ 50%.
              </p>
              <p className="rounded-md bg-emerald-50 p-3 text-emerald-700">
                A008-A010 ພ້ອມຮັບທີ່ counter.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </CafeShell>
  );
}

export function HappyHourComboSetupPage() {
  return (
    <CafeShell
      active="Happy Hour"
      title="ຕັ້ງຄ່າ Happy Hour / Combo"
      description="ສ້າງ promotion ຕາມເວລາ, ກຳນົດ combo ແລະເປີດໃຊ້ກັບເມນູເຄື່ອງດື່ມ."
      kpis={[
        { label: "Rule ທີ່ເປີດໃຊ້", value: "3", change: "ກຳລັງໃຊ້", tone: "emerald", icon: Check },
        { label: "Combos", value: "8", change: "sets", tone: "blue", icon: CupSoda },
        { label: "Today Discount", value: "LAK 420K", change: "saved", tone: "amber", icon: Flame },
        { label: "Next Campaign", value: "2:00 PM", change: "today", tone: "violet", icon: Clock3 }
      ]}
      actions={<Button icon={Plus}>ສ້າງ Happy Hour</Button>}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card
          title="Rule Happy Hour"
          action={
            <div className="flex gap-2">
              {["Happy Hour", "Combos", "ໂປຣໂມຊັນ"].map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={`h-8 rounded-md px-3 text-[12px] font-black ${
                    index === 0
                      ? "bg-blue-600 text-white"
                      : "border border-blue-100 text-slate-600 hover:bg-blue-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-blue-100 text-[11px] font-black text-slate-500">
                  {["ຊື່", "ວັນ", "ເວລາ", "ສ່ວນຫຼຸດ", "ສະຖານະ", "ຈັດການ"].map(
                    (heading) => (
                      <th key={heading} className="px-4 py-3">
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {happyHourRows.map((row) => {
                  const Icon = row.icon;

                  return (
                    <tr key={row.name} className="border-b border-blue-50 last:border-b-0">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-3 font-black text-slate-950">
                          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-50 text-amber-500">
                            <Icon className="h-4 w-4" />
                          </span>
                          {row.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-700">{row.schedule}</td>
                      <td className="px-4 py-3 font-bold text-slate-700">{row.time}</td>
                      <td className="px-4 py-3 font-bold text-slate-950">{row.discount}</td>
                      <td className="px-4 py-3">
                        <Badge tone={row.status === "ເປີດໃຊ້" ? "emerald" : "slate"}>
                          {row.status === "ເປີດໃຊ້" ? "ເປີດໃຊ້" : "ປິດໃຊ້"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Toggle enabled={row.status === "ເປີດໃຊ້"} />
                          <IconButton icon={Edit3} label="ແກ້ໄຂ" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <PaginationLite label="ສະແດງ 1-4 ຈາກ 14 campaign rules" />
        </Card>

        <Card title="ຕົວຢ່າງ Happy Hour">
          <div className="space-y-4 p-4">
            <div className="rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-blue-50 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <Flame className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-lg font-black text-slate-950">
                    {"Afternoon Delight"}
                  </span>
                  <span className="mt-1 block text-sm font-black text-blue-600">
                    {"ຫຼຸດ 20%"}
                  </span>
                </span>
              </div>
              <p className="mt-3 text-xs leading-5 font-semibold text-slate-600">
                ເວລາ 2:00 PM - 5:00 PM ສຳລັບ coffee ແລະ pastry.
              </p>
              <div
                className="mt-4 h-40 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${coffeeImage})` }}
              />
            </div>
            <InfoRow label="ສະຖານະ" value="ເປີດໃຊ້" />
            <InfoRow label="ເມນູທີ່ໃຊ້" value="Beverages, Pastries" />
            <InfoRow label="ເງື່ອນໄຂ" value="ນັ່ງທີ່ຮ້ານ + ຮັບກັບບ້ານ" />
          </div>
        </Card>
      </div>
    </CafeShell>
  );
}

export function CafeDailyQuickViewPage() {
  return (
    <CafeShell
      active="ພາບລວມຮ້ານກາເຟ"
      title="ສະຫຼຸບຮ້ານ Cafe ປະຈຳວັນ"
      description="ພາບລວມຍອດຂາຍ, order, ຄິວ Barista, ໂຕະ ແລະສິນຄ້າຂາຍດີ."
      kpis={[
        { label: "ຍອດຂາຍລວມ", value: "LAK 6,420,000", change: "12.4%", tone: "blue", icon: ReceiptText },
        { label: "Order", value: "245", change: "8.2%", tone: "emerald", icon: CupSoda },
        { label: "ມູນຄ່າສະເລ່ຍ / Order", value: "LAK 26,204", change: "3.1%", tone: "amber", icon: Sparkles },
        { label: "Items ຂາຍໄດ້", value: "523", change: "11.4%", tone: "violet", icon: Coffee }
      ]}
      actions={
        <>
          <SelectButton icon={CalendarDays}>May 18, 2025</SelectButton>
          <Button icon={ReceiptText} variant="secondary">
            Export Report
          </Button>
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)_minmax(260px,0.5fr)]">
        <Card title="ຍອດຂາຍຕາມເວລາ">
          <div className="p-4">
            <div className="grid h-[300px] grid-cols-10 items-end gap-3 rounded-lg bg-slate-50 p-4">
              {[18, 22, 31, 42, 55, 74, 68, 90, 102, 86].map((height, index) => (
                <div key={index} className="flex h-full flex-col justify-end gap-2">
                  <div
                    className="rounded-t-md bg-gradient-to-t from-blue-600 to-blue-300"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-center text-[10px] font-bold text-slate-500">
                    {`${6 + index * 2}h`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title="ເມນູຂາຍດີ">
          <div className="divide-y divide-blue-50">
            {topItems.map((item, index) => (
              <div key={item.name} className="flex items-center gap-3 px-4 py-3">
                <span className="w-5 text-xs font-black text-slate-400">{index + 1}</span>
                <span
                  className="h-10 w-10 rounded-md bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-black text-slate-950">
                    {item.name}
                  </span>
                  <span className="block text-xs font-bold text-slate-500">
                    ຂາຍໄດ້ {item.qty}
                  </span>
                </span>
                <span className="text-right text-xs font-black text-slate-700">
                  {item.sales}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="ຍອດຂາຍຕາມ Category">
          <div className="flex h-full flex-col items-center justify-center gap-5 p-5">
            <div className="relative h-44 w-44 rounded-full bg-[conic-gradient(#2563eb_0_60%,#f59e0b_60%_76%,#10b981_76%_88%,#94a3b8_88%_100%)]">
              <div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
                <span className="text-xl font-black text-slate-950">LAK 6.42M</span>
                <span className="text-[11px] font-bold text-slate-500">
                  {"Total"}
                </span>
              </div>
            </div>
            <div className="w-full space-y-2">
              {[
                ["ເຄື່ອງດື່ມ", "60%", "bg-blue-600"],
                ["ເບເກີຣີ", "16%", "bg-amber-500"],
                ["ອາຫານ", "12%", "bg-emerald-500"],
                ["ອື່ນໆ", "12%", "bg-slate-400"]
              ].map(([label, value, color]) => (
                <div key={label} className="flex items-center justify-between text-xs font-black">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                    {label}
                  </span>
                  <span className="text-slate-950">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-4 xl:col-span-3">
          {[
            ["ໂຕະກຳລັງໃຊ້", "8", "ໂຕະທີ່ໃຊ້ງານ"],
            ["Order ຮັບກັບບ້ານ", "12", "ລໍຖ້າຮັບ"],
            ["ຄິວ Barista", "3 / 3", "ກຳລັງຈັດກຽມ / ພ້ອມຮັບ"],
            ["Happy Hour", "ເປີດໃຊ້", "2:00 PM - 5:00 PM"]
          ].map(([title, value, desc]) => (
            <Card key={title}>
              <div className="p-4">
                <p className="text-xs font-bold text-slate-500">{title}</p>
                <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">{desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </CafeShell>
  );
}

function CafeShell({
  active,
  title,
  description,
  kpis,
  actions,
  children
}: {
  active: Extract<
    BusinessMenuKey,
    "ແຜນຜັງໂຕະ" | "ຕົວເລືອກເພີ່ມ" | "ຄິວ Barista" | "Happy Hour" | "ພາບລວມຮ້ານກາເຟ"
  >;
  title: string;
  description: string;
  kpis: Kpi[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <BusinessAdminShell active={active}>
      <PageHeader title={title} description={description} actions={actions} />
      <KpiGrid kpis={kpis} />
      {children}
    </BusinessAdminShell>
  );
}

function CafeFloorTable({
  table
}: {
  table: (typeof cafeTables)[number];
}) {
  const status = tableStatusStyles[table.status];

  return (
    <button
      type="button"
      className={`absolute flex items-center justify-center rounded-xl border-2 text-[12px] font-black transition hover:-translate-y-1 hover:shadow-lg ${status.className} ${
        table.wide ? "h-14 w-24" : "h-14 w-14"
      }`}
      style={{ top: table.top, left: table.left }}
      title={`${table.id} - ${status.label}`}
    >
      {table.id}
    </button>
  );
}

function StatusBadge({ status }: { status: CafeTableStatus }) {
  const statusConfig = tableStatusStyles[status];

  return (
    <span
      className={`inline-flex rounded-md border px-2.5 py-1 text-[11px] font-black ${statusConfig.className}`}
    >
      {statusConfig.label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-blue-50 pb-2 last:border-b-0">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <span className="text-right text-xs font-black text-slate-950">
        {value}
      </span>
    </div>
  );
}

function OptionGroup({
  title: titleValue,
  required,
  options,
  active = options[0]
}: {
  title: string;
  required?: boolean;
  options: string[];
  active?: string;
}) {
  const title = titleValue;

  return (
    <div>
      <p className="mb-2 text-xs font-black text-slate-700">
        {title} {required ? <span className="text-blue-600">(ບັງຄັບ)</span> : null}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`min-h-9 rounded-md border px-2 text-[11px] font-black transition ${
              option === active
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-blue-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <button
      type="button"
      className={`relative h-6 w-11 rounded-full transition ${
        enabled ? "bg-blue-600" : "bg-slate-200"
      }`}
      aria-label={enabled ? "ເປີດໃຊ້" : "ປິດໃຊ້"}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function PaginationLite({ label }: { label: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-50 px-4 py-3">
      <p className="text-[12px] font-semibold text-slate-500">{label}</p>
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
