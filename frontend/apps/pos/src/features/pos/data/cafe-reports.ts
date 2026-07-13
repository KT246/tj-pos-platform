export type ReportKpi = {
  id: string
  title: string
  value: string
  change: string
}

export type RevenuePoint = {
  label: string
  value: number
}

export type BreakdownItem = {
  label: string
  value: number
  percent: number
  color: string
}

export type TopProductReportItem = {
  rank: number
  name: string
  quantity: string
  revenue: number
  image: string
}

export type StaffShiftReportItem = {
  shift: string
  employee: string
  revenue: number
  orders: number
  status: "active" | "pending"
}

export type TopStaffReportItem = {
  rank: number
  name: string
  revenue: number
  orders: number
  avatar: string
}

export const reportTabs = [
  "Tổng quan",
  "Doanh thu",
  "Sản phẩm",
  "Nhân viên",
  "Khách hàng",
  "Kho hàng",
  "Báo cáo",
]

export const reportKpis: ReportKpi[] = [
  {
    id: "today-revenue",
    title: "Doanh thu hôm nay",
    value: "5.820.000 ກີບ",
    change: "12.5% so với hôm qua",
  },
  {
    id: "orders",
    title: "Đơn hàng",
    value: "128",
    change: "8.3% so với hôm qua",
  },
  {
    id: "customers",
    title: "Khách hàng",
    value: "96",
    change: "6.4% so với hôm qua",
  },
  {
    id: "average-order",
    title: "Giá trị đơn trung bình",
    value: "45.469 ກີບ",
    change: "3.7% so với hôm qua",
  },
]

export const hourlyRevenue: RevenuePoint[] = [
  { label: "00:00", value: 150000 },
  { label: "03:00", value: 45000 },
  { label: "04:30", value: 25000 },
  { label: "06:00", value: 105000 },
  { label: "08:00", value: 235000 },
  { label: "09:00", value: 380000 },
  { label: "11:00", value: 540000 },
  { label: "12:00", value: 830000 },
  { label: "14:00", value: 1080000 },
  { label: "15:00", value: 900000 },
  { label: "18:00", value: 710000 },
  { label: "20:00", value: 490000 },
  { label: "21:00", value: 240000 },
  { label: "23:00", value: 150000 },
]

export const weeklyRevenue: RevenuePoint[] = [
  { label: "14/05", value: 3600000 },
  { label: "15/05", value: 5300000 },
  { label: "16/05", value: 2800000 },
  { label: "17/05", value: 4200000 },
  { label: "18/05", value: 6000000 },
  { label: "19/05", value: 2800000 },
  { label: "20/05", value: 5500000 },
]

export const paymentBreakdown: BreakdownItem[] = [
  { label: "Tiền mặt", value: 2450000, percent: 42, color: "#8a5425" },
  { label: "Thẻ", value: 1680000, percent: 29, color: "#f4b65e" },
  { label: "Ví điện tử", value: 1020000, percent: 18, color: "#94c476" },
  { label: "Chuyển khoản", value: 670000, percent: 11, color: "#f0a33f" },
]

export const categoryBreakdown: BreakdownItem[] = [
  { label: "Cà phê", value: 3375000, percent: 58, color: "#8a5425" },
  { label: "Trà", value: 1164000, percent: 20, color: "#6d5a38" },
  { label: "Đá xay", value: 698400, percent: 12, color: "#b8c765" },
  { label: "Nước ép", value: 406800, percent: 7, color: "#f2b654" },
  { label: "Khác", value: 174000, percent: 3, color: "#9b856b" },
]

export const topProducts: TopProductReportItem[] = [
  {
    rank: 1,
    name: "Cà phê sữa đá",
    quantity: "128 ly",
    revenue: 1280000,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=120&q=80",
  },
  {
    rank: 2,
    name: "Latte",
    quantity: "96 ly",
    revenue: 960000,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=120&q=80",
  },
  {
    rank: 3,
    name: "Trà đào",
    quantity: "88 ly",
    revenue: 880000,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=120&q=80",
  },
  {
    rank: 4,
    name: "Cappuccino",
    quantity: "72 ly",
    revenue: 720000,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=120&q=80",
  },
  {
    rank: 5,
    name: "Americano",
    quantity: "64 ly",
    revenue: 640000,
    image: "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=120&q=80",
  },
]

export const shiftReports: StaffShiftReportItem[] = [
  {
    shift: "Ca sáng (06:00 - 14:00)",
    employee: "Nguyễn Minh",
    revenue: 2450000,
    orders: 54,
    status: "active",
  },
  {
    shift: "Ca chiều (14:00 - 22:00)",
    employee: "Trần Thị Mai",
    revenue: 2980000,
    orders: 68,
    status: "active",
  },
  {
    shift: "Ca tối (22:00 - 06:00)",
    employee: "Lê Văn An",
    revenue: 390000,
    orders: 6,
    status: "pending",
  },
]

export const topStaff: TopStaffReportItem[] = [
  {
    rank: 1,
    name: "Nguyễn Minh",
    revenue: 2450000,
    orders: 54,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80",
  },
  {
    rank: 2,
    name: "Trần Thị Mai",
    revenue: 2980000,
    orders: 68,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
  },
  {
    rank: 3,
    name: "Lê Văn An",
    revenue: 390000,
    orders: 6,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  },
]
