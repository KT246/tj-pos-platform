import {
  AlertTriangle,
  Barcode,
  BellRing,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Download,
  FileText,
  Filter,
  MoreVertical,
  PackageCheck,
  PackagePlus,
  Printer,
  ReceiptText,
  RefreshCcw,
  RotateCcw,
  Save,
  ScanLine,
  Search,
  ShieldAlert,
  ShoppingBasket,
  Truck,
  Warehouse
} from "lucide-react";
import type { ReactNode } from "react";

import {
  Badge,
  Button,
  Card,
  DataTable,
  Field,
  IconButton,
  ItemIdentity,
  KpiGrid,
  PageHeader,
  QuickActionsCard,
  RightRail,
  SelectButton,
  SummaryCard,
  Tabs
} from "../components/business-admin-primitives";
import { BusinessAdminShell } from "../layouts/business-admin-shell";
import type { Kpi, TableColumn, Tone } from "../types";

type StockCountRow = {
  countNo: string;
  name: string;
  branch: string;
  location: string;
  status: "ກຳລັງດຳເນີນ" | "ສຳເລັດ" | "ຍົກເລີກ";
  progress: number;
  counted: string;
  countedAt: string;
  variance: string;
  varianceTone: Tone;
};

type AlertRow = {
  item: string;
  sku: string;
  barcode: string;
  location: string;
  onHand: number;
  minimum: number;
  status: "Low Stock" | "ວິກິດ" | "Expiry Soon" | "Expired";
  delta?: string;
  expiryDate?: string;
  daysLeft?: string;
  image?: string;
};

type ReceivingLine = {
  item: string;
  sku: string;
  ordered: number;
  received: number;
  unitCost: string;
  total: string;
  batch: string;
  expiry: string;
  image?: string;
};

type ReturnLine = {
  item: string;
  sku: string;
  purchased: number;
  returnQty: number;
  unitPrice: string;
  reason: string;
  amount: string;
  image?: string;
};

type LabelItem = {
  item: string;
  price: string;
  barcode: string;
};

const retailImages = [
  "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1519996521439-692b831cf66e?auto=format&fit=crop&w=120&q=80"
];

const stockCountKpis: Kpi[] = [
  {
    label: "ກຳລັງດຳເນີນ",
    value: "3",
    change: "Counts",
    tone: "blue",
    icon: ClipboardList
  },
  {
    label: "To Count",
    value: "1,245",
    change: "ສິນຄ້າ",
    tone: "cyan",
    icon: FileText
  },
  {
    label: "Counted",
    value: "865",
    change: "ສິນຄ້າ",
    tone: "emerald",
    icon: CheckCircle2
  },
  {
    label: "Variance",
    value: "- LAK 2,450,000",
    change: "Total value",
    tone: "red",
    icon: ShieldAlert
  }
];

const alertKpis: Kpi[] = [
  {
    label: "Low Stock",
    value: "36",
    change: "Needs reorder",
    tone: "amber",
    icon: BellRing
  },
  {
    label: "Critical Items",
    value: "8",
    change: "Below 40% minimum",
    tone: "red",
    icon: AlertTriangle
  },
  {
    label: "Expiry Soon",
    value: "28",
    change: "Within 7 days",
    tone: "violet",
    icon: CalendarDays
  },
  {
    label: "Reorder Value",
    value: "LAK 8,240,000",
    change: "Estimated cost",
    tone: "blue",
    icon: PackagePlus
  }
];

const receivingKpis: Kpi[] = [
  {
    label: "Expected Items",
    value: "260",
    change: "From current PO",
    tone: "blue",
    icon: PackagePlus
  },
  {
    label: "Received Qty",
    value: "260",
    change: "Ready to post",
    tone: "emerald",
    icon: PackageCheck
  },
  {
    label: "ຍອດລວມ",
    value: "LAK 2,456,000",
    change: "Before discounts",
    tone: "violet",
    icon: ReceiptText
  },
  {
    label: "Supplier",
    value: "Lao Beverage",
    change: "Net 15 terms",
    tone: "cyan",
    icon: Truck
  }
];

const returnKpis: Kpi[] = [
  {
    label: "Return Amount",
    value: "LAK 1,070,000",
    change: "Current receipt",
    tone: "red",
    icon: RotateCcw
  },
  {
    label: "Return Lines",
    value: "2",
    change: "Items selected",
    tone: "blue",
    icon: ClipboardList
  },
  {
    label: "Restock Items",
    value: "1",
    change: "Eligible item",
    tone: "emerald",
    icon: Warehouse
  },
  {
    label: "Approval",
    value: "Required",
    change: "Manager policy",
    tone: "amber",
    icon: ShieldAlert
  }
];

const labelKpis: Kpi[] = [
  {
    label: "Items Selected",
    value: "45",
    change: "Ready to print",
    tone: "blue",
    icon: Barcode
  },
  {
    label: "Labels Per Page",
    value: "27",
    change: "3 columns",
    tone: "emerald",
    icon: Printer
  },
  {
    label: "Total Pages",
    value: "2",
    change: "A4 label sheet",
    tone: "violet",
    icon: FileText
  },
  {
    label: "Missing Barcode",
    value: "0",
    change: "All valid",
    tone: "cyan",
    icon: CheckCircle2
  }
];

const stockCounts: StockCountRow[] = [
  {
    countNo: "SC-250518-001",
    name: "Monthly Count - May 2025",
    branch: "ສາຂາຫຼັກ",
    location: "ທຸກຕຳແໜ່ງ",
    status: "ກຳລັງດຳເນີນ",
    progress: 65,
    counted: "845 / 1,300",
    countedAt: "May 18, 2025 10:30 AM",
    variance: "- LAK 1,250,000",
    varianceTone: "red"
  },
  {
    countNo: "SC-250515-002",
    name: "Beverage Section",
    branch: "ສາຂາຫຼັກ",
    location: "Aisle 02 - Drinks",
    status: "ສຳເລັດ",
    progress: 100,
    counted: "210 / 210",
    countedAt: "May 15, 2025 04:15 PM",
    variance: "+ LAK 320,000",
    varianceTone: "emerald"
  },
  {
    countNo: "SC-250510-001",
    name: "Snacks & Confectionery",
    branch: "ສາຂາຫຼັກ",
    location: "Aisle 04",
    status: "ສຳເລັດ",
    progress: 100,
    counted: "185 / 185",
    countedAt: "May 10, 2025 02:40 PM",
    variance: "- LAK 180,000",
    varianceTone: "red"
  },
  {
    countNo: "SC-250508-001",
    name: "Daily Quick Count",
    branch: "ສາຂາຫຼັກ",
    location: "ທຸກຕຳແໜ່ງ",
    status: "ຍົກເລີກ",
    progress: 0,
    counted: "0 / 980",
    countedAt: "May 8, 2025 09:10 AM",
    variance: "-",
    varianceTone: "slate"
  }
];

const lowStockAlerts: AlertRow[] = [
  {
    item: "Coca-Cola Can 330ml",
    sku: "8935049500012",
    barcode: "8935049500012",
    location: "Aisle 02 - Drinks",
    onHand: 12,
    minimum: 30,
    status: "Low Stock",
    delta: "-18",
    image: retailImages[0]
  },
  {
    item: "Lay's Classic 60g",
    sku: "8935049500456",
    barcode: "8935049500456",
    location: "Aisle 04 - Snacks",
    onHand: 5,
    minimum: 20,
    status: "ວິກິດ",
    delta: "-15",
    image: retailImages[1]
  },
  {
    item: "Nestea Lemon 500ml",
    sku: "8935049500784",
    barcode: "8935049500784",
    location: "Aisle 02 - Drinks",
    onHand: 8,
    minimum: 24,
    status: "Low Stock",
    delta: "-16",
    image: retailImages[2]
  },
  {
    item: "Milk Dutchie 225ml",
    sku: "8935049501125",
    barcode: "8935049501125",
    location: "Aisle 01 - Dairy",
    onHand: 6,
    minimum: 15,
    status: "ວິກິດ",
    delta: "-9",
    image: retailImages[3]
  },
  {
    item: "Red Bull 150ml",
    sku: "8935049501507",
    barcode: "8935049501507",
    location: "Aisle 02 - Drinks",
    onHand: 10,
    minimum: 30,
    status: "Low Stock",
    delta: "-20",
    image: retailImages[4]
  }
];

const expiryAlerts: AlertRow[] = [
  {
    item: "Maji Yogurt 100g",
    sku: "8935049502207",
    barcode: "8935049502207",
    location: "Chiller 01",
    onHand: 18,
    minimum: 0,
    status: "Expiry Soon",
    expiryDate: "May 25, 2025",
    daysLeft: "7 days",
    image: retailImages[5]
  },
  {
    item: "Beerlao Lager 330ml",
    sku: "8935049503333",
    barcode: "8935049503333",
    location: "Aisle 03",
    onHand: 24,
    minimum: 0,
    status: "Expiry Soon",
    expiryDate: "May 22, 2025",
    daysLeft: "4 days",
    image: retailImages[0]
  },
  {
    item: "Sandwich Bread",
    sku: "8935049500678",
    barcode: "8935049500678",
    location: "Bakery Shelf",
    onHand: 10,
    minimum: 0,
    status: "Expiry Soon",
    expiryDate: "May 19, 2025",
    daysLeft: "1 day",
    image: retailImages[1]
  }
];

const receivingLines: ReceivingLine[] = [
  {
    item: "Coca-Cola Can 330ml",
    sku: "8935049500012",
    ordered: 100,
    received: 80,
    unitCost: "LAK 9,500",
    total: "LAK 760,000",
    batch: "CC230518",
    expiry: "Nov 18, 2025",
    image: retailImages[0]
  },
  {
    item: "Fanta Orange 330ml",
    sku: "8935049500029",
    ordered: 60,
    received: 60,
    unitCost: "LAK 8,000",
    total: "LAK 480,000",
    batch: "FN230518",
    expiry: "Nov 20, 2025",
    image: retailImages[1]
  },
  {
    item: "Sprite Can 330ml",
    sku: "8935049500036",
    ordered: 40,
    received: 40,
    unitCost: "LAK 8,000",
    total: "LAK 320,000",
    batch: "SP230518",
    expiry: "Nov 19, 2025",
    image: retailImages[2]
  },
  {
    item: "Lay's Classic 60g",
    sku: "8935049500456",
    ordered: 60,
    received: 40,
    unitCost: "LAK 11,200",
    total: "LAK 448,000",
    batch: "LY230518",
    expiry: "Jan 18, 2026",
    image: retailImages[3]
  }
];

const returnLines: ReturnLine[] = [
  {
    item: "Nike Running Shoes",
    sku: "8975049100012",
    purchased: 1,
    returnQty: 1,
    unitPrice: "LAK 850,000",
    reason: "Wrong Size",
    amount: "LAK 850,000",
    image: retailImages[4]
  },
  {
    item: "Adidas T-Shirt M",
    sku: "8975049100322",
    purchased: 2,
    returnQty: 1,
    unitPrice: "LAK 220,000",
    reason: "Exchange Size",
    amount: "LAK 220,000",
    image: retailImages[5]
  }
];

const labelItems: LabelItem[] = [
  { item: "Coca-Cola Can 330ml", price: "LAK 12,000", barcode: "8935049500012" },
  { item: "Fanta Orange 330ml", price: "LAK 11,000", barcode: "8935049500029" },
  { item: "Sprite Can 330ml", price: "LAK 11,000", barcode: "8935049500036" },
  { item: "Lay's Classic 60g", price: "LAK 16,000", barcode: "8935049500456" },
  { item: "Oreo Chocolate 133g", price: "LAK 17,000", barcode: "8935049500676" },
  { item: "Red Bull 150ml", price: "LAK 12,500", barcode: "8935049501507" }
];

export function StockCountPage() {
  return (
    <RetailShell
      active="ນັບສະຕັອກ"
      title="ນັບສະຕັອກ"
      description="Create and manage your physical stock counts."
      kpis={stockCountKpis}
      actions={
        <>
          <Button icon={Download} variant="secondary">
            Export
          </Button>
          <Button icon={PackagePlus}>New Stock Count</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Card>
          <div className="grid gap-3 p-4 xl:grid-cols-[repeat(3,minmax(150px,1fr))_minmax(180px,1fr)_auto]">
            <SelectButton>All Branches</SelectButton>
            <SelectButton>All Locations</SelectButton>
            <SelectButton>All Status</SelectButton>
            <SelectButton icon={CalendarDays}>May 12 - May 18, 2025</SelectButton>
            <Button icon={PackagePlus}>New Stock Count</Button>
          </div>
        </Card>
        <DataTable
          columns={stockCountColumns}
          rows={stockCounts}
          footer={<RetailPagination label="Showing 1 to 4 of 4 results" />}
        />
      </div>
    </RetailShell>
  );
}

export function LowStockExpiryPage() {
  return (
    <RetailShell
      active="ສະຕັອກຕ່ຳ / ໃກ້ໝົດອາຍຸ"
      title="Low Stock / Expiry Alerts"
      description="Monitor items that are running low or nearing expiry."
      kpis={alertKpis}
      actions={
        <>
          <Button icon={Filter} variant="secondary">
            Filter
          </Button>
          <Button icon={Download} variant="secondary">
            Export
          </Button>
        </>
      }
    >
      <Tabs
        tabs={["Low Stock (36)", "Expiry Soon (28)", "Expired (5)"]}
        active="Low Stock (36)"
      />
      <Card>
        <div className="grid gap-3 p-4 xl:grid-cols-[repeat(3,minmax(160px,1fr))_auto_auto]">
          <SelectButton>All Locations</SelectButton>
          <SelectButton>All Categories</SelectButton>
          <SelectButton>All Suppliers</SelectButton>
          <Button icon={Filter} variant="secondary">
            Filter
          </Button>
          <Button icon={Download} variant="secondary">
            Export
          </Button>
        </div>
      </Card>
      <div className="mt-4 space-y-4">
        <DataTable
          columns={lowStockColumns}
          rows={lowStockAlerts}
          footer={<RetailPagination label="Showing 1 to 5 of 36 low stock items" />}
        />
        <DataTable
          columns={expiryColumns}
          rows={expiryAlerts}
          footer={<RetailPagination label="Showing 1 to 3 of 28 expiry alerts" />}
        />
      </div>
    </RetailShell>
  );
}

export function GoodsReceivingPage() {
  return (
    <RetailShell
      active="ຮັບສິນຄ້າ"
      title="ຮັບສິນຄ້າ"
      description="Receive purchased goods into your inventory."
      kpis={receivingKpis}
      actions={
        <div className="flex rounded-md border border-blue-100 bg-white p-1">
          <button
            type="button"
            className="h-8 rounded-md px-4 text-xs font-black text-blue-600 hover:bg-blue-50"
          >
            Draft
          </button>
          <button
            type="button"
            className="h-8 rounded-md bg-blue-600 px-4 text-xs font-black text-white"
          >
            Received
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <Card>
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="PO / Reference" value="PO-250516-007" />
            <Field label="Supplier" value="Lao Beverage Co., Ltd." type="select" />
            <Field label="Delivery Date" value="18 ພຶດສະພາ 2025" />
            <Field label="Expected Date" value="18 ພຶດສະພາ 2025" />
          </div>
        </Card>
        <Card title="Received Items">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-blue-100 text-[11px] font-black text-slate-600">
                  {[
                    "ລາຍການ",
                    "SKU / Barcode",
                    "Ordered",
                    "Received",
                    "Unit Cost",
                    "Total",
                    "Batch / Lot",
                    "Expiry Date"
                  ].map((heading) => (
                    <th key={heading} className="px-3 py-2.5">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {receivingLines.map((line) => (
                  <tr key={line.sku} className="border-b border-blue-50 last:border-b-0">
                    <td className="px-3 py-3">
                      <ItemIdentity title={line.item} image={line.image} size="sm" />
                    </td>
                    <td className="px-3 py-3 font-bold text-slate-700">{line.sku}</td>
                    <td className="px-3 py-3 font-bold text-slate-700">{line.ordered}</td>
                    <td className="px-3 py-3">
                      <QuantityInput value={line.received} />
                    </td>
                    <td className="px-3 py-3 font-bold text-slate-700">{line.unitCost}</td>
                    <td className="px-3 py-3 font-black text-slate-950">{line.total}</td>
                    <td className="px-3 py-3">
                      <MiniInput value={line.batch} />
                    </td>
                    <td className="px-3 py-3">
                      <MiniInput value={line.expiry} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-blue-50 px-4 py-3">
            <Button icon={PackagePlus} variant="secondary">
              Add Item
            </Button>
          </div>
        </Card>
        <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
          <Card>
            <div className="grid gap-3 p-4 sm:grid-cols-3">
              <TotalTile label="Total Items Received" value="260" />
              <TotalTile label="Total Quantity" value="260" />
              <TotalTile label="ຍອດລວມ" value="LAK 2,456,000" />
            </div>
          </Card>
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary">Cancel</Button>
            <Button icon={Save} variant="secondary">
              Save Draft
            </Button>
            <Button icon={CheckCircle2}>Receive Goods</Button>
          </div>
        </div>
      </div>
    </RetailShell>
  );
}

export function ReturnExchangeCounterPage() {
  return (
    <RetailShell
      active="ຄືນສິນຄ້າ"
      title="Return / Exchange Counter"
      description="Process product returns or exchanges."
      kpis={returnKpis}
      actions={<Tabs tabs={["ຄືນສິນຄ້າ", "Exchange"]} active="ຄືນສິນຄ້າ" />}
    >
      <div className="space-y-4">
        <Card>
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Receipt / Invoice" value="INV-250517-1256" />
            <Field label="Date" value="18 ພຶດສະພາ 2025" />
            <Field label="ລູກຄ້າ" value="Khamla Vongsa" />
            <Field label="Phone" value="020 5565 1234" />
          </div>
        </Card>
        <Card title="Return Items">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-blue-100 text-[11px] font-black text-slate-600">
                  {[
                    "ລາຍການ",
                    "SKU / Barcode",
                    "Purchased",
                    "Return Qty",
                    "Unit Price",
                    "Reason",
                    "ຈຳນວນເງິນ"
                  ].map((heading) => (
                    <th key={heading} className="px-3 py-2.5">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {returnLines.map((line) => (
                  <tr key={line.sku} className="border-b border-blue-50 last:border-b-0">
                    <td className="px-3 py-3">
                      <ItemIdentity title={line.item} image={line.image} size="sm" />
                    </td>
                    <td className="px-3 py-3 font-bold text-slate-700">{line.sku}</td>
                    <td className="px-3 py-3 font-bold text-slate-700">{line.purchased}</td>
                    <td className="px-3 py-3">
                      <QuantityInput value={line.returnQty} />
                    </td>
                    <td className="px-3 py-3 font-bold text-slate-700">{line.unitPrice}</td>
                    <td className="px-3 py-3">
                      <SelectButton>{line.reason}</SelectButton>
                    </td>
                    <td className="px-3 py-3 font-black text-slate-950">{line.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-blue-50 px-4 py-3">
            <Button icon={PackagePlus} variant="secondary">
              Add Item
            </Button>
          </div>
        </Card>
        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <Card title="Return Details">
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <Field label="Return Reason" value="Customer Return" type="select" />
              <Field
                label="ໝາຍເຫດ"
                value="Customer requested return."
                type="textarea"
              />
            </div>
          </Card>
          <SummaryCard
            title="Refund Summary"
            items={[
              { label: "ຍອດກ່ອນຄ່າບໍລິການ", value: "LAK 1,070,000", tone: "slate" },
              { label: "Discount", value: "LAK 0", tone: "slate" },
              { label: "Total Refund", value: "LAK 1,070,000", tone: "red" }
            ]}
            action={<Badge tone="amber">Needs approval</Badge>}
          />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button variant="secondary">Cancel</Button>
          <Button icon={CheckCircle2}>Process Return</Button>
        </div>
      </div>
    </RetailShell>
  );
}

export function BarcodeLabelsPage() {
  return (
    <RetailShell
      active="ປ້າຍ Barcode"
      title="Shelf Label / Barcode Print"
      description="Generate and print shelf labels with barcodes."
      kpis={labelKpis}
      actions={
        <>
          <Button icon={Printer} variant="secondary">
            Preview
          </Button>
          <Button icon={Printer}>Print Labels</Button>
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card>
            <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
              <Field label="Label Template" value="Shelf Label - 60x40mm" type="select" />
              <Field label="Paper Size" value="60 x 40 mm" type="select" />
              <Field label="Layout" value="3 columns" type="select" />
              <div>
                <span className="mb-2 block text-xs font-black text-slate-600">
                  Sort By
                </span>
                <RadioGroup options={["All Items", "Selected Items"]} active="All Items" />
              </div>
              <div>
                <span className="mb-2 block text-xs font-black text-slate-600">
                  Item Source
                </span>
                <RadioGroup options={["All Items", "Selected Items"]} active="All Items" />
              </div>
              <div className="flex items-end justify-end">
                <Button icon={Filter} variant="secondary">
                  Filter
                </Button>
              </div>
            </div>
          </Card>
          <Card title="Label Preview">
            <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
              {labelItems.map((item) => (
                <BarcodeLabelCard key={item.barcode} item={item} />
              ))}
            </div>
          </Card>
          <div className="flex items-center justify-end gap-3">
            <Button icon={Printer} variant="secondary">
              Preview
            </Button>
            <Button icon={Printer}>Print Labels</Button>
          </div>
        </div>
        <RightRail>
          <SummaryCard
            title="Print Summary"
            items={[
              { label: "Items Selected", value: "45", tone: "blue" },
              { label: "Labels Per Page", value: "27", tone: "slate" },
              { label: "Total Pages", value: "2", tone: "violet" },
              { label: "Printer", value: "Label Printer 01", tone: "emerald" }
            ]}
          />
          <QuickActionsCard
            actions={[
              {
                label: "Scan Barcode",
                description: "Add item by scanner",
                icon: ScanLine,
                tone: "blue"
              },
              {
                label: "Import Item List",
                description: "Upload CSV list",
                icon: Download,
                tone: "emerald"
              },
              {
                label: "Save Template",
                description: "Reuse this layout",
                icon: Save,
                tone: "violet"
              },
              {
                label: "Printer Settings",
                description: "Configure label printer",
                icon: Printer,
                tone: "amber"
              }
            ]}
          />
        </RightRail>
      </div>
    </RetailShell>
  );
}

function RetailShell({
  active,
  title,
  description,
  kpis,
  actions,
  children
}: {
  active:
    | "ນັບສະຕັອກ"
    | "ສະຕັອກຕ່ຳ / ໃກ້ໝົດອາຍຸ"
    | "ຮັບສິນຄ້າ"
    | "ຄືນສິນຄ້າ"
    | "ປ້າຍ Barcode";
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

const stockCountColumns: TableColumn<StockCountRow>[] = [
  {
    key: "countNo",
    label: "Count #",
    render: (row) => <span className="text-blue-600">{row.countNo}</span>
  },
  { key: "name", label: "Count Name", render: (row) => row.name },
  { key: "branch", label: "ສາຂາ", render: (row) => row.branch },
  { key: "location", label: "Location", render: (row) => row.location },
  {
    key: "status",
    label: "ສະຖານະ",
    render: (row) => <Badge tone={stockStatusTone(row.status)}>{row.status}</Badge>
  },
  {
    key: "progress",
    label: "Progress",
    render: (row) => <ProgressCell progress={row.progress} label={row.counted} />
  },
  { key: "countedAt", label: "Counted At", render: (row) => row.countedAt },
  {
    key: "variance",
    label: "Variance",
    render: (row) => (
      <span className={varianceTextClass(row.varianceTone)}>{row.variance}</span>
    )
  },
  {
    key: "actions",
    label: "ການດຳເນີນການ",
    align: "right",
    render: () => <IconButton icon={MoreVertical} label="ເພີ່ມເຕີມ" tone="slate" />
  }
];

const lowStockColumns: TableColumn<AlertRow>[] = [
  {
    key: "item",
    label: "ລາຍການ",
    render: (row) => <ItemIdentity title={row.item} image={row.image} size="sm" />
  },
  {
    key: "sku",
    label: "SKU / Barcode",
    render: (row) => (
      <span>
        {row.sku}
        <span className="block text-[11px] font-semibold text-slate-500">
          {row.barcode}
        </span>
      </span>
    )
  },
  { key: "location", label: "Location", render: (row) => row.location },
  { key: "onHand", label: "On Hand", render: (row) => row.onHand },
  { key: "minimum", label: "Min. Stock", render: (row) => row.minimum },
  {
    key: "status",
    label: "ສະຖານະ",
    render: (row) => <Badge tone={alertTone(row.status)}>{row.status}</Badge>
  },
  {
    key: "alert",
    label: "Alert",
    align: "right",
    render: (row) => <span className="font-black text-red-500">{row.delta}</span>
  }
];

const expiryColumns: TableColumn<AlertRow>[] = [
  {
    key: "item",
    label: "ລາຍການ",
    render: (row) => <ItemIdentity title={row.item} image={row.image} size="sm" />
  },
  { key: "sku", label: "SKU / Barcode", render: (row) => row.sku },
  { key: "expiry", label: "Expiry Date", render: (row) => row.expiryDate },
  { key: "onHand", label: "On Hand", render: (row) => row.onHand },
  { key: "days", label: "Days Left", render: (row) => row.daysLeft },
  {
    key: "status",
    label: "ສະຖານະ",
    align: "right",
    render: (row) => <Badge tone={alertTone(row.status)}>{row.status}</Badge>
  }
];

function ProgressCell({ progress, label }: { progress: number; label: string }) {
  return (
    <div className="min-w-[130px]">
      <div className="mb-1 flex items-center justify-between gap-2 text-[11px] font-black">
        <span>{progress}%</span>
        <span className="text-slate-500">{label}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            progress === 100 ? "bg-emerald-500" : "bg-blue-600"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function QuantityInput({ value }: { value: number }) {
  return (
    <input
      className="h-8 w-20 rounded-md border border-blue-100 bg-white px-2 text-center text-xs font-black text-slate-900 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
      defaultValue={value}
    />
  );
}

function MiniInput({ value }: { value: string }) {
  return (
    <input
      className="h-8 min-w-[118px] rounded-md border border-blue-100 bg-white px-2 text-xs font-bold text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
      defaultValue={value}
    />
  );
}

function TotalTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-4 text-center">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function RadioGroup({ options, active }: { options: string[]; active: string }) {
  return (
    <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2">
          <span
            className={`h-4 w-4 rounded-full border ${
              option === active ? "border-blue-600 p-1" : "border-slate-300"
            }`}
          >
            {option === active ? <span className="block h-full w-full rounded-full bg-blue-600" /> : null}
          </span>
          {option}
        </label>
      ))}
    </div>
  );
}

function BarcodeLabelCard({ item }: { item: LabelItem }) {
  return (
    <div className="rounded-lg border border-dashed border-blue-200 bg-white p-4 text-center">
      <p className="text-sm font-black text-slate-950">{item.item}</p>
      <p className="mt-1 text-sm font-black text-slate-950">{item.price}</p>
      <div className="mx-auto mt-4 flex h-12 w-[160px] items-end justify-center gap-[3px]">
        {item.barcode.split("").map((digit, index) => {
          const height = 20 + ((Number(digit) + index) % 5) * 6;
          const width = digit === "0" || digit === "8" ? 3 : 2;

          return (
            <span
              key={`${digit}-${index}`}
              className="block bg-slate-950"
              style={{ height, width }}
            />
          );
        })}
      </div>
      <p className="mt-2 text-[10px] font-black tracking-[0.18em] text-slate-600">
        {item.barcode}
      </p>
    </div>
  );
}

function RetailPagination({ label }: { label: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-50 px-4 py-3">
      <p className="text-[13px] font-semibold text-slate-600">{label}</p>
      <div className="flex items-center gap-2">
        {["<", "1", ">"].map((item) => (
          <button
            key={item}
            type="button"
            className={`h-8 min-w-8 rounded-md border text-sm font-extrabold ${
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

function stockStatusTone(status: StockCountRow["status"]) {
  if (status === "ສຳເລັດ") return "emerald";
  if (status === "ກຳລັງດຳເນີນ") return "blue";
  return "slate";
}

function alertTone(status: AlertRow["status"]) {
  if (status === "ວິກິດ" || status === "Expired") return "red";
  if (status === "Expiry Soon") return "amber";
  return "amber";
}

function varianceTextClass(tone: Tone) {
  if (tone === "emerald") return "font-black text-emerald-600";
  if (tone === "red") return "font-black text-red-500";
  return "font-black text-slate-500";
}
