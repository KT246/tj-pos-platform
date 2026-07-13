import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  BadgePercent,
  Boxes,
  ChevronDown,
  CreditCard,
  Download,
  PackageCheck,
  PackageX,
  ReceiptText,
  RefreshCw,
  SearchX,
  ShoppingBag,
  Users,
  WalletCards,
} from "lucide-react"
import type { ComponentType, ReactNode } from "react"
import { useMemo, useState } from "react"

import { listPosOrders, type PosBusinessOrder } from "@/features/pos/api/pos-orders-api"
import {
  getPosReportsOverview,
  type BreakdownItem,
  type ReportKpi,
  type ReportRange,
  type ReportsOverviewResponse,
  type RevenuePoint,
  type StaffShiftReportItem,
  type TopProductReportItem,
  type TopStaffReportItem,
} from "@/features/pos/api/pos-reports-api"
import { listPosStockItems, type CafeStockItem } from "@/features/pos/api/pos-stock-api"
import {
  DonutBreakdown,
  HourlyRevenueChart,
  KpiCard,
  PaymentBreakdown,
  ReportCard,
  ShiftTable,
  TopProductsList,
  TopStaffList,
  WeeklyLineChart,
} from "@/features/pos/components/reports/report-widgets"
import { ReportsTopbar } from "@/features/pos/components/reports/reports-topbar"
import { formatVnd } from "@/features/pos/lib/format"
import { cn } from "@/lib/utils"

type ReportTabId = "overview" | "revenue" | "products" | "staff" | "customers" | "stock"

type ReportTab = {
  id: ReportTabId
  label: string
}

type CustomerReportRow = {
  id: string
  name: string
  orders: number
  revenue: number
  lastOrderAt: string
  paymentRisk: number
}

const kpiIcons = [WalletCards, ShoppingBag, Users, CreditCard]
const kpiAccents = ["bg-[#5a3718]", "bg-[#2f8748]", "bg-[#6f63b7]", "bg-[#b56f1b]"]
const reportTabs: ReportTab[] = [
  { id: "overview", label: "ພາບລວມ" },
  { id: "revenue", label: "ລາຍຮັບ" },
  { id: "products", label: "ສິນຄ້າ" },
  { id: "staff", label: "ພະນັກງານ" },
  { id: "customers", label: "ລູກຄ້າ" },
  { id: "stock", label: "ຄັງສິນຄ້າ" },
]
const rangeOptions: Array<[ReportRange, string]> = [
  ["today", "ມື້ນີ້"],
  ["7d", "7 ມື້ຜ່ານມາ"],
  ["30d", "30 ມື້ຜ່ານມາ"],
]
const emptyKpis: ReportKpi[] = []
const emptyRevenue: RevenuePoint[] = []
const emptyBreakdown: BreakdownItem[] = []
const emptyProducts: TopProductReportItem[] = []
const emptyShifts: StaffShiftReportItem[] = []
const emptyStaff: TopStaffReportItem[] = []
const emptyOrders: PosBusinessOrder[] = []
const emptyStockItems: CafeStockItem[] = []

export function PosReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTabId>("overview")
  const [range, setRange] = useState<ReportRange>("today")
  const [search, setSearch] = useState("")
  const searchText = search.trim().toLowerCase()
  const reportsQuery = useQuery({
    queryKey: ["pos-reports-overview", range],
    queryFn: () => getPosReportsOverview(range),
    refetchOnMount: "always",
  })
  const ordersQuery = useQuery({
    queryKey: ["pos-orders-report-source"],
    queryFn: () => listPosOrders(),
    enabled: activeTab === "customers",
  })
  const stockQuery = useQuery({
    queryKey: ["pos-stock-report-source"],
    queryFn: () => listPosStockItems({ page: 1, pageSize: 50 }),
    enabled: activeTab === "stock",
  })
  const report = reportsQuery.data
  const reportKpis = report?.kpis ?? emptyKpis
  const hourlyRevenue = report?.hourlyRevenue ?? emptyRevenue
  const weeklyRevenue = report?.weeklyRevenue ?? emptyRevenue
  const paymentBreakdown = report?.paymentBreakdown ?? emptyBreakdown
  const categoryBreakdown = report?.categoryBreakdown ?? emptyBreakdown
  const shiftReports = filterByKeyword(
    report?.shiftReports ?? emptyShifts,
    searchText,
    (item) => [item.shift, item.employee, item.status],
  )
  const topProducts = filterByKeyword(
    report?.topProducts ?? emptyProducts,
    searchText,
    (item) => [item.name, item.quantity],
  )
  const topStaff = filterByKeyword(
    report?.topStaff ?? emptyStaff,
    searchText,
    (item) => [item.name, String(item.orders), String(item.revenue)],
  )
  const customerRows = useMemo(
    () => buildCustomerRows(ordersQuery.data?.orders ?? emptyOrders, searchText),
    [ordersQuery.data?.orders, searchText],
  )
  const stockItems = useMemo(
    () => filterStockRows(stockQuery.data?.items ?? emptyStockItems, searchText),
    [searchText, stockQuery.data?.items],
  )
  const generatedAtLabel = report?.generatedAt
    ? formatReportTimestamp(report.generatedAt)
    : "ກຳລັງໂຫຼດຂໍ້ມູນ"

  return (
    <main className="h-screen overflow-hidden bg-[#efe7dc] text-[#3b2511]">
      <div className="flex h-full min-w-[1280px]">
        <section className="flex min-w-0 flex-1 flex-col">
          <ReportsTopbar search={search} onSearchChange={setSearch} />

          <div className="min-h-0 flex-1 p-3">
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex h-full min-h-0 flex-col overflow-hidden border border-[#eadfce] bg-white shadow-[0_18px_40px_rgba(80,54,27,0.1)]"
            >
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#eadfce] bg-[#fbfaf7] px-5 py-4">
                <div>
                  <h1 className="text-2xl font-black tracking-normal text-[#3b2511]">
                    ລາຍງານ
                  </h1>
                  <p className="mt-1 text-sm font-semibold text-[#8a7560]">
                    ຕິດຕາມລາຍຮັບ, ສິນຄ້າຂາຍດີ, ກະເຮັດວຽກ, ລູກຄ້າ ແລະ ແຈ້ງເຕືອນຄັງສິນຄ້າ.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <RangeSelect value={range} onChange={setRange} />
                  <button
                    type="button"
                    onClick={() => report && exportReportCsv(report)}
                    disabled={!report}
                    className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-[#eadfce] bg-white px-4 text-sm font-bold text-[#5f4a35] transition hover:bg-[#fbf4ea] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <Download className="h-4 w-4" />
                    ສົ່ງອອກ CSV
                  </button>
                </div>
              </div>

              <div className="flex h-10 shrink-0 items-end gap-8 border-b border-[#eadfce] bg-white px-5 text-sm font-black">
                {reportTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "h-full cursor-pointer border-b-2 px-2 transition",
                      activeTab === tab.id
                        ? "border-[#5a3718] text-[#5a3718]"
                        : "border-transparent text-[#8a7560] hover:text-[#5a3718]",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                {reportsQuery.isLoading ? (
                  <StatePanel icon={RefreshCw} title="ກຳລັງໂຫຼດລາຍງານ" spinning />
                ) : reportsQuery.isError ? (
                  <StatePanel
                    icon={SearchX}
                    title="ໂຫຼດລາຍງານບໍ່ສຳເລັດ"
                    description="ກວດສອບ backend ແລະ database ກ່ອນໂຫຼດໃໝ່."
                  />
                ) : (
                  <>
                    {activeTab === "overview" ? (
                      <OverviewTab
                        kpis={reportKpis}
                        hourlyRevenue={hourlyRevenue}
                        weeklyRevenue={weeklyRevenue}
                        paymentBreakdown={paymentBreakdown}
                        categoryBreakdown={categoryBreakdown}
                        shiftReports={shiftReports}
                        topProducts={topProducts}
                        topStaff={topStaff}
                        range={range}
                      />
                    ) : null}

                    {activeTab === "revenue" ? (
                      <RevenueTab
                        kpis={reportKpis}
                        hourlyRevenue={hourlyRevenue}
                        weeklyRevenue={weeklyRevenue}
                        paymentBreakdown={paymentBreakdown}
                        categoryBreakdown={categoryBreakdown}
                        range={range}
                      />
                    ) : null}

                    {activeTab === "products" ? (
                      <ProductsTab topProducts={topProducts} categoryBreakdown={categoryBreakdown} />
                    ) : null}

                    {activeTab === "staff" ? (
                      <StaffTab shiftReports={shiftReports} topStaff={topStaff} />
                    ) : null}

                    {activeTab === "customers" ? (
                      <CustomersTab
                        rows={customerRows}
                        loading={ordersQuery.isLoading}
                        error={ordersQuery.isError}
                      />
                    ) : null}

                    {activeTab === "stock" ? (
                      <StockTab
                        items={stockItems}
                        kpis={stockQuery.data?.kpis ?? []}
                        loading={stockQuery.isLoading}
                        error={stockQuery.isError}
                      />
                    ) : null}
                  </>
                )}
              </div>

              <div className="flex h-[46px] shrink-0 items-center gap-3 border-t border-[#eadfce] bg-[#fbfaf7] px-5 text-sm font-semibold text-[#8a7560]">
                <span>ອັບເດດຫຼ້າສຸດ: {generatedAtLabel}</span>
                <button
                  type="button"
                  onClick={() => void reportsQuery.refetch()}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#5a3718] transition hover:bg-[#efe3d2]"
                  aria-label="ໂຫຼດລາຍງານໃໝ່"
                >
                  <RefreshCw className={cn("h-4 w-4", reportsQuery.isFetching && "animate-spin")} />
                </button>
                <PackageCheck className="ml-auto h-4 w-4 text-[#d9c7b0]" />
              </div>
            </motion.section>
          </div>
        </section>
      </div>
    </main>
  )
}

function OverviewTab({
  kpis,
  hourlyRevenue,
  weeklyRevenue,
  paymentBreakdown,
  categoryBreakdown,
  shiftReports,
  topProducts,
  topStaff,
  range,
}: {
  kpis: ReportKpi[]
  hourlyRevenue: RevenuePoint[]
  weeklyRevenue: RevenuePoint[]
  paymentBreakdown: BreakdownItem[]
  categoryBreakdown: BreakdownItem[]
  shiftReports: StaffShiftReportItem[]
  topProducts: TopProductReportItem[]
  topStaff: TopStaffReportItem[]
  range: ReportRange
}) {
  const totalCategoryRevenue = categoryBreakdown.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_390px] gap-4">
      <div className="min-w-0 space-y-4">
        <KpiGrid kpis={kpis} />

        <div className="grid grid-cols-2 gap-4">
          <ReportCard title="ລາຍຮັບຕາມຊົ່ວໂມງ">
            <HourlyRevenueChart data={hourlyRevenue} />
          </ReportCard>

          <ReportCard title={range === "30d" ? "ລາຍຮັບ 30 ມື້ຜ່ານມາ" : "ລາຍຮັບ 7 ມື້ຜ່ານມາ"}>
            <WeeklyLineChart data={weeklyRevenue} />
          </ReportCard>
        </div>

        <div className="grid grid-cols-[0.85fr_1.15fr] gap-4">
          <ReportCard title="ລາຍຮັບຕາມໝວດໝູ່">
            <DonutBreakdown
              items={categoryBreakdown}
              centerLabel="ລວມ"
              centerValue={formatVnd(totalCategoryRevenue)}
            />
          </ReportCard>

          <ReportCard title="ກະເຮັດວຽກ">
            <ShiftTable items={shiftReports} />
          </ReportCard>
        </div>
      </div>

      <aside className="space-y-4">
        <ReportCard title="ການຊຳລະ">
          <PaymentBreakdown items={paymentBreakdown} />
        </ReportCard>

        <ReportCard title="ສິນຄ້າຂາຍດີ">
          <TopProductsList items={topProducts} />
        </ReportCard>

        <ReportCard title="ພະນັກງານອັນດັບຕົ້ນ">
          <TopStaffList items={topStaff} />
        </ReportCard>
      </aside>
    </div>
  )
}

function RevenueTab({
  kpis,
  hourlyRevenue,
  weeklyRevenue,
  paymentBreakdown,
  categoryBreakdown,
  range,
}: {
  kpis: ReportKpi[]
  hourlyRevenue: RevenuePoint[]
  weeklyRevenue: RevenuePoint[]
  paymentBreakdown: BreakdownItem[]
  categoryBreakdown: BreakdownItem[]
  range: ReportRange
}) {
  return (
    <div className="space-y-4">
      <KpiGrid kpis={kpis} />

      <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-4">
        <div className="space-y-4">
          <ReportCard title="ລາຍຮັບຕາມຊົ່ວໂມງ">
            <HourlyRevenueChart data={hourlyRevenue} />
          </ReportCard>

          <ReportCard title={range === "30d" ? "ລາຍລະອຽດລາຍຮັບ 30 ມື້" : "ລາຍລະອຽດລາຍຮັບ 7 ມື້"}>
            <RevenueTable rows={weeklyRevenue} />
          </ReportCard>
        </div>

        <aside className="space-y-4">
          <ReportCard title="ສັດສ່ວນການຊຳລະ">
            <PaymentBreakdown items={paymentBreakdown} />
          </ReportCard>
          <ReportCard title="ໝວດໝູ່ທີ່ສ້າງລາຍຮັບ">
            <BreakdownRows items={categoryBreakdown} />
          </ReportCard>
        </aside>
      </div>
    </div>
  )
}

function ProductsTab({
  topProducts,
  categoryBreakdown,
}: {
  topProducts: TopProductReportItem[]
  categoryBreakdown: BreakdownItem[]
}) {
  const totalRevenue = topProducts.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-4">
      <ReportCard title="ຕາຕະລາງຈັດອັນດັບສິນຄ້າ" className="min-w-0">
        <ReportTable
          empty={!topProducts.length}
          headers={["ອັນດັບ", "ສິນຄ້າ", "ຈຳນວນ", "ລາຍຮັບ", "ສັດສ່ວນ"]}
        >
          {topProducts.map((item) => (
            <tr key={item.rank} className="border-b border-[#eadfce] last:border-b-0">
              <TableCell className="font-black">#{item.rank}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="h-11 w-11 rounded-md object-cover" />
                  <span className="font-black">{item.name}</span>
                </div>
              </TableCell>
              <TableCell>{localizeReportText(item.quantity)}</TableCell>
              <TableCell className="font-black">{formatVnd(item.revenue)}</TableCell>
              <TableCell>{formatPercent(item.revenue, totalRevenue)}</TableCell>
            </tr>
          ))}
        </ReportTable>
      </ReportCard>

      <aside className="space-y-4">
        <ReportCard title="ໝວດໝູ່">
          <BreakdownRows items={categoryBreakdown} />
        </ReportCard>
        <ReportCard title="ອັນດັບຕົ້ນ">
          <TopProductsList items={topProducts.slice(0, 5)} />
        </ReportCard>
      </aside>
    </div>
  )
}

function StaffTab({
  shiftReports,
  topStaff,
}: {
  shiftReports: StaffShiftReportItem[]
  topStaff: TopStaffReportItem[]
}) {
  const totalStaffRevenue = topStaff.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-4">
      <div className="space-y-4">
        <ReportCard title="ກະເຮັດວຽກໃນຊ່ວງນີ້">
          <ShiftTable items={shiftReports} />
        </ReportCard>
        <ReportCard title="ຕາຕະລາງຜົນງານພະນັກງານ">
          <ReportTable
            empty={!topStaff.length}
            headers={["ອັນດັບ", "ພະນັກງານ", "ອໍເດີ", "ລາຍຮັບ", "ສັດສ່ວນ"]}
          >
            {topStaff.map((item) => (
              <tr key={item.rank} className="border-b border-[#eadfce] last:border-b-0">
                <TableCell className="font-black">#{item.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={item.avatar} alt={item.name} className="h-9 w-9 rounded-full object-cover" />
                    <span className="font-black">{item.name}</span>
                  </div>
                </TableCell>
                <TableCell>{item.orders}</TableCell>
                <TableCell className="font-black">{formatVnd(item.revenue)}</TableCell>
                <TableCell>{formatPercent(item.revenue, totalStaffRevenue)}</TableCell>
              </tr>
            ))}
          </ReportTable>
        </ReportCard>
      </div>

      <ReportCard title="ພະນັກງານອັນດັບຕົ້ນ">
        <TopStaffList items={topStaff} />
      </ReportCard>
    </div>
  )
}

function CustomersTab({
  rows,
  loading,
  error,
}: {
  rows: CustomerReportRow[]
  loading: boolean
  error: boolean
}) {
  const revenue = rows.reduce((sum, item) => sum + item.revenue, 0)
  const riskOrders = rows.reduce((sum, item) => sum + item.paymentRisk, 0)
  const averageRevenue = rows.length ? revenue / rows.length : 0

  if (loading) return <StatePanel icon={RefreshCw} title="ກຳລັງໂຫຼດຂໍ້ມູນລູກຄ້າ" spinning />
  if (error) return <StatePanel icon={SearchX} title="ໂຫຼດອໍເດີເພື່ອເຮັດລາຍງານລູກຄ້າບໍ່ສຳເລັດ" />

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-px overflow-hidden border border-[#eadfce] bg-[#eadfce]">
        <SummaryTile icon={Users} label="ລູກຄ້າ" value={rows.length.toLocaleString("vi-VN")} />
        <SummaryTile icon={ReceiptText} label="ລາຍຮັບລວມ" value={formatVnd(revenue)} />
        <SummaryTile icon={WalletCards} label="ສະເລ່ຍ / ລູກຄ້າ" value={formatVnd(averageRevenue)} />
        <SummaryTile icon={BadgePercent} label="ອໍເດີທີ່ຕ້ອງຕິດຕາມ" value={riskOrders.toLocaleString("vi-VN")} />
      </div>

      <ReportCard title="ຕາຕະລາງລູກຄ້າ">
        <ReportTable
          empty={!rows.length}
          headers={["ລູກຄ້າ", "ຈຳນວນອໍເດີ", "ລາຍຮັບ", "ຄັ້ງຫຼ້າສຸດ", "ຕ້ອງຕິດຕາມ"]}
        >
          {rows.map((item) => (
            <tr key={item.id} className="border-b border-[#eadfce] last:border-b-0">
              <TableCell className="font-black">{item.name}</TableCell>
              <TableCell>{item.orders}</TableCell>
              <TableCell className="font-black">{formatVnd(item.revenue)}</TableCell>
              <TableCell>{formatReportTimestamp(item.lastOrderAt)}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "inline-flex h-7 items-center rounded-md px-2.5 text-xs font-black",
                    item.paymentRisk > 0
                      ? "bg-[#fff3d9] text-[#b56f1b]"
                      : "bg-[#eef8f0] text-[#2f8748]",
                  )}
                >
                  {item.paymentRisk > 0 ? `${item.paymentRisk} ອໍເດີ` : "ປົກກະຕິ"}
                </span>
              </TableCell>
            </tr>
          ))}
        </ReportTable>
      </ReportCard>
    </div>
  )
}

function StockTab({
  items,
  kpis,
  loading,
  error,
}: {
  items: CafeStockItem[]
  kpis: Array<{ id: string; title: string; value: string; subtitle: string }>
  loading: boolean
  error: boolean
}) {
  const totalValue = items.reduce((sum, item) => sum + item.inventoryValue, 0)
  const lowStock = items.filter((item) => item.status === "low-stock").length
  const outOfStock = items.filter((item) => item.status === "out-of-stock").length

  if (loading) return <StatePanel icon={RefreshCw} title="ກຳລັງໂຫຼດຂໍ້ມູນຄັງ" spinning />
  if (error) return <StatePanel icon={SearchX} title="ໂຫຼດລາຍງານຄັງບໍ່ສຳເລັດ" />

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-px overflow-hidden border border-[#eadfce] bg-[#eadfce]">
        <SummaryTile
          icon={Boxes}
          label={localizeReportText(kpis[0]?.title ?? "ລາຍການ")}
          value={kpis[0]?.value ?? items.length.toLocaleString("vi-VN")}
          helper={kpis[0]?.subtitle ? localizeReportText(kpis[0].subtitle) : undefined}
        />
        <SummaryTile icon={WalletCards} label="ມູນຄ່າຄົງເຫຼືອ" value={formatVnd(totalValue)} />
        <SummaryTile icon={PackageCheck} label="ໃກ້ໝົດ" value={lowStock.toLocaleString("vi-VN")} />
        <SummaryTile icon={PackageX} label="ໝົດສິນຄ້າ" value={outOfStock.toLocaleString("vi-VN")} />
      </div>

      <ReportCard title="ແຈ້ງເຕືອນຄັງສິນຄ້າ">
        <ReportTable
          empty={!items.length}
          headers={["ລາຍການ", "SKU", "ຍອດຄົງເຫຼືອ", "ຂັ້ນຕ່ຳ", "ມູນຄ່າ", "ສະຖານະ"]}
        >
          {items
            .slice()
            .sort((a, b) => statusWeight(a) - statusWeight(b))
            .map((item) => (
              <tr key={item.id} className="border-b border-[#eadfce] last:border-b-0">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={item.image || "/images/pos-login-hero.png"} alt={item.name} className="h-10 w-10 rounded-md object-cover" />
                    <span className="font-black">{item.name}</span>
                  </div>
                </TableCell>
                <TableCell>{item.sku || "-"}</TableCell>
                <TableCell>{formatQuantity(item.currentStock)} {item.unit}</TableCell>
                <TableCell>{formatQuantity(item.minStock)} {item.unit}</TableCell>
                <TableCell className="font-black">{formatVnd(item.inventoryValue)}</TableCell>
                <TableCell>
                  <StockStatusBadge status={item.status} />
                </TableCell>
              </tr>
            ))}
        </ReportTable>
      </ReportCard>
    </div>
  )
}

function KpiGrid({ kpis }: { kpis: ReportKpi[] }) {
  if (!kpis.length) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-[112px] animate-pulse rounded-xl bg-[#f5eee5]" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpiIcons[index] ?? ReceiptText

        return (
          <KpiCard
            key={kpi.id}
            title={localizeReportText(kpi.title)}
            value={kpi.value}
            change={localizeReportText(kpi.change)}
            icon={Icon}
            accentClass={kpiAccents[index] ?? "bg-[#5a3718]"}
          />
        )
      })}
    </div>
  )
}

function RevenueTable({ rows }: { rows: RevenuePoint[] }) {
  const total = rows.reduce((sum, item) => sum + item.value, 0)
  const average = rows.length ? total / rows.length : 0

  return (
    <ReportTable empty={!rows.length} headers={["ວັນທີ", "ລາຍຮັບ", "ສັດສ່ວນ", "ທຽບກັບສະເລ່ຍ"]}>
      {rows.map((item) => (
        <tr key={item.label} className="border-b border-[#eadfce] last:border-b-0">
          <TableCell className="font-black">{item.label}</TableCell>
          <TableCell className="font-black">{formatVnd(item.value)}</TableCell>
          <TableCell>{formatPercent(item.value, total)}</TableCell>
          <TableCell>
            <span className={cn("font-black", item.value >= average ? "text-[#2f8748]" : "text-[#b56f1b]")}>
              {item.value >= average ? "+" : "-"}
              {formatVnd(Math.abs(item.value - average))}
            </span>
          </TableCell>
        </tr>
      ))}
    </ReportTable>
  )
}

function BreakdownRows({ items }: { items: BreakdownItem[] }) {
  return (
    <div className="mt-4 space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between gap-4 text-sm font-bold">
            <span className="flex min-w-0 items-center gap-2 text-[#5f4a35]">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="truncate">{localizeReportText(item.label)}</span>
            </span>
            <span className="shrink-0 text-[#3b2511]">{formatVnd(item.value)} - {item.percent}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f1e7da]">
            <div className="h-full rounded-full" style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function RangeSelect({
  value,
  onChange,
}: {
  value: ReportRange
  onChange: (value: ReportRange) => void
}) {
  return (
    <label className="relative inline-flex">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as ReportRange)}
        className="h-10 cursor-pointer appearance-none rounded-md border border-[#eadfce] bg-white px-3 pr-8 text-sm font-bold text-[#5f4a35] outline-none transition hover:bg-[#fbf4ea]"
      >
        {rangeOptions.map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7560]" />
    </label>
  )
}

function ReportTable({
  headers,
  empty,
  children,
}: {
  headers: string[]
  empty: boolean
  children: ReactNode
}) {
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-[#eadfce]">
      <table className="w-full border-separate border-spacing-0 text-left">
        <thead className="bg-[#fbfaf7]">
          <tr>
            {headers.map((header) => (
              <th key={header} className="border-b border-[#eadfce] px-4 py-3 text-xs font-black uppercase tracking-normal text-[#6f5c49]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm font-semibold text-[#5f4a35]">
          {empty ? (
            <tr>
              <td colSpan={headers.length} className="h-[180px] px-4 text-center text-sm font-black text-[#8a7560]">
                ຍັງບໍ່ມີຂໍ້ມູນທີ່ກົງເງື່ອນໄຂ.
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  )
}

function TableCell({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 text-[#3b2511]", className)}>{children}</td>
}

function SummaryTile({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
  helper?: string
}) {
  return (
    <article className="min-w-0 bg-white p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#f1e4d4] text-[#5a3718]">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-bold uppercase tracking-normal text-[#7c6448]">{label}</p>
          <p className="mt-1 truncate text-xl font-black leading-none text-[#3b2511]">{value}</p>
        </div>
      </div>
      {helper ? <p className="mt-2 truncate text-xs font-bold text-[#7c6448]">{helper}</p> : null}
    </article>
  )
}

function StatePanel({
  icon: Icon,
  title,
  description,
  spinning = false,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  description?: string
  spinning?: boolean
}) {
  return (
    <div className="flex h-full min-h-[360px] items-center justify-center">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-[#f1e4d4] text-[#5a3718]">
          <Icon className={cn("h-6 w-6", spinning && "animate-spin")} />
        </span>
        <p className="mt-4 text-sm font-black text-[#3b2511]">{title}</p>
        {description ? <p className="mt-2 text-sm font-semibold text-[#8a7560]">{description}</p> : null}
      </div>
    </div>
  )
}

function StockStatusBadge({ status }: { status: CafeStockItem["status"] }) {
  const className: Record<CafeStockItem["status"], string> = {
    "in-stock": "bg-[#eef8f0] text-[#2f8748]",
    "low-stock": "bg-[#fff3d9] text-[#b56f1b]",
    "out-of-stock": "bg-[#fff0ee] text-[#d33c32]",
    ordering: "bg-[#eef6ff] text-[#2f75bd]",
  }
  const label: Record<CafeStockItem["status"], string> = {
    "in-stock": "ຍັງມີສິນຄ້າ",
    "low-stock": "ໃກ້ໝົດ",
    "out-of-stock": "ໝົດສິນຄ້າ",
    ordering: "ກຳລັງສັ່ງຊື້",
  }

  return (
    <span className={cn("inline-flex h-7 items-center rounded-md px-2.5 text-xs font-black", className[status])}>
      {label[status]}
    </span>
  )
}

function buildCustomerRows(orders: PosBusinessOrder[], searchText: string): CustomerReportRow[] {
  const map = new Map<string, CustomerReportRow>()

  orders.forEach((order) => {
    const id = order.customerId || order.customerName || "walk-in"
    const name = order.customerName || "ລູກຄ້າທົ່ວໄປ"
    const current = map.get(id) ?? {
      id,
      name,
      orders: 0,
      revenue: 0,
      lastOrderAt: order.createdAt,
      paymentRisk: 0,
    }

    current.orders += 1
    current.revenue += order.total
    if (new Date(order.createdAt).getTime() > new Date(current.lastOrderAt).getTime()) {
      current.lastOrderAt = order.createdAt
    }
    if (order.paymentStatus !== "paid" && !["cancelled", "voided", "refunded"].includes(order.status)) {
      current.paymentRisk += 1
    }
    map.set(id, current)
  })

  return Array.from(map.values())
    .filter((row) => {
      if (!searchText) return true

      return [row.name, String(row.orders), String(row.revenue)].some((value) =>
        value.toLowerCase().includes(searchText),
      )
    })
    .sort((a, b) => b.revenue - a.revenue)
}

function filterStockRows(items: CafeStockItem[], searchText: string) {
  if (!searchText) return items

  return items.filter((item) =>
    [item.name, item.sku, item.categoryLabel, item.supplier, item.status].some((value) =>
      value.toLowerCase().includes(searchText),
    ),
  )
}

function filterByKeyword<TItem>(
  items: TItem[],
  searchText: string,
  getValues: (item: TItem) => string[],
) {
  if (!searchText) return items

  return items.filter((item) =>
    getValues(item).some((value) => value.toLowerCase().includes(searchText)),
  )
}

function localizeReportText(value: string) {
  const text = value.trim()
  const normalized = text.toLowerCase()

  if (normalized.includes("doanh thu")) return "ລາຍຮັບ"
  if (normalized.includes("khach") || normalized.includes("khÃ¡ch")) return "ລູກຄ້າ"
  if (normalized.includes("ÄÆ¡n") || normalized.includes("don") || normalized.includes("hÃ ng")) return "ອໍເດີ"
  if (normalized.includes("giÃ¡") || normalized.includes("trá»‹")) return "ມູນຄ່າອໍເດີສະເລ່ຍ"
  if (normalized.includes("so vá»›i") || normalized.includes("so voi")) {
    return text
      .replace(/so v(?:á»›|o)i k(?:á»³|y) tr(?:Æ°á»›|uo)c/gi, "ທຽບກັບຊ່ວງກ່ອນ")
      .replace(/so v(?:á»›|o)i h(?:Ã´|o)m qua/gi, "ທຽບກັບມື້ວານ")
  }
  if (normalized.includes("tiá»n") || normalized.includes("tien")) return "ເງິນສົດ"
  if (normalized.includes("chuyá»ƒn") || normalized.includes("chuyen")) return "ໂອນເງິນ"
  if (normalized.includes("tháº»") || normalized.includes("the")) return "ບັດ"
  if (normalized.includes("qr")) return "QR"
  if (normalized.includes("vÃ­") || normalized.includes("vi ")) return "ກະເປົາເງິນດິຈິຕອນ"
  if (normalized.includes("mÃ³n") || normalized.includes("mon")) {
    return text.replace(/mÃ³n|mon/gi, "ລາຍການ")
  }
  if (normalized.includes("chá»a") || normalized.includes("chua")) return "ຍັງບໍ່ມີຂໍ້ມູນ"

  return text
}

function rangeLabel(range: ReportRange) {
  return rangeOptions.find(([value]) => value === range)?.[1] ?? "ມື້ນີ້"
}

function formatReportTimestamp(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  const hour = String(date.getHours()).padStart(2, "0")
  const minute = String(date.getMinutes()).padStart(2, "0")

  return `${day}/${month}/${year} ${hour}:${minute}`
}

function formatPercent(value: number, total: number) {
  if (!total) return "0%"

  return `${Math.round((value / total) * 100)}%`
}

function formatQuantity(value: number) {
  return Number.isInteger(value)
    ? value.toLocaleString("vi-VN")
    : value.toLocaleString("vi-VN", { maximumFractionDigits: 3 })
}

function statusWeight(item: CafeStockItem) {
  if (item.status === "out-of-stock") return 0
  if (item.status === "low-stock") return 1
  if (item.status === "ordering") return 2

  return 3
}

function exportReportCsv(report: ReportsOverviewResponse) {
  const rows = [
    ["ລາຍງານ", rangeLabel(report.range)],
    ["ອັບເດດ", formatReportTimestamp(report.generatedAt)],
    [],
    ["ຕົວຊີ້ວັດ", "ມູນຄ່າ", "ການປ່ຽນແປງ"],
    ...report.kpis.map((kpi) => [localizeReportText(kpi.title), kpi.value, localizeReportText(kpi.change)]),
    [],
    ["ສິນຄ້າອັນດັບຕົ້ນ", "ຈຳນວນ", "ລາຍຮັບ"],
    ...report.topProducts.map((item) => [item.name, localizeReportText(item.quantity), String(item.revenue)]),
    [],
    ["ການຊຳລະ", "ມູນຄ່າ", "ສັດສ່ວນ"],
    ...report.paymentBreakdown.map((item) => [localizeReportText(item.label), String(item.value), `${item.percent}%`]),
  ]
  const csv = rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n")
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = `pos-report-${report.range}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

function escapeCsvCell(value: string | number | undefined) {
  const text = String(value ?? "")
  const escapedValue = text.replace(/"/g, '""')

  return `"${escapedValue}"`
}
