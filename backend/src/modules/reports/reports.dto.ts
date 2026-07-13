export type ReportRange = "today" | "7d" | "30d";

export type ReportKpi = {
  id: string;
  title: string;
  value: string;
  change: string;
};

export type RevenuePoint = {
  label: string;
  value: number;
};

export type BreakdownItem = {
  label: string;
  value: number;
  percent: number;
  color: string;
};

export type TopProductReportItem = {
  rank: number;
  name: string;
  quantity: string;
  revenue: number;
  image: string;
};

export type StaffShiftReportItem = {
  shift: string;
  employee: string;
  revenue: number;
  orders: number;
  status: "active" | "pending";
};

export type TopStaffReportItem = {
  rank: number;
  name: string;
  revenue: number;
  orders: number;
  avatar: string;
};

export type ReportsOverviewResponse = {
  range: ReportRange;
  generatedAt: string;
  kpis: ReportKpi[];
  hourlyRevenue: RevenuePoint[];
  weeklyRevenue: RevenuePoint[];
  paymentBreakdown: BreakdownItem[];
  categoryBreakdown: BreakdownItem[];
  shiftReports: StaffShiftReportItem[];
  topProducts: TopProductReportItem[];
  topStaff: TopStaffReportItem[];
};
