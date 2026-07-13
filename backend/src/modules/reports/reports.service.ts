import { Injectable, NotFoundException } from "@nestjs/common";

import { DatabaseService } from "../../database/database.service";
import type {
  BreakdownItem,
  ReportKpi,
  ReportRange,
  ReportsOverviewResponse,
  RevenuePoint,
  StaffShiftReportItem,
  TopProductReportItem,
  TopStaffReportItem
} from "./reports.dto";

type BusinessRow = {
  id: string;
};

type SummaryRow = {
  revenue: string;
  orders: string;
  customers: string;
};

type HourlyRow = {
  hour_label: string;
  revenue: string;
};

type DailyRow = {
  date_label: string;
  revenue: string;
};

type BreakdownRow = {
  label: string;
  value: string;
};

type ProductRow = {
  name: string;
  quantity: string;
  revenue: string;
  image: string | null;
};

type ShiftRow = {
  shift: string;
  revenue: string;
  orders: string;
};

type StaffRow = {
  name: string;
  revenue: string;
  orders: string;
};

const reportRanges = new Set<ReportRange>(["today", "7d", "30d"]);
const paymentColors = ["#8a5425", "#f4b65e", "#94c476", "#f0a33f"];
const categoryColors = ["#8a5425", "#6d5a38", "#b8c765", "#f2b654", "#9b856b"];
const fallbackProductImage =
  "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=120&q=80";
const fallbackAvatar =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80";

@Injectable()
export class ReportsService {
  constructor(private readonly database: DatabaseService) {}

  async getBusinessOverview(
    businessSlug: string,
    requestedRange?: ReportRange
  ): Promise<ReportsOverviewResponse> {
    const business = await this.getBusinessBySlug(businessSlug);
    const range = reportRanges.has(requestedRange as ReportRange)
      ? requestedRange as ReportRange
      : "today";
    const currentWindow = resolveRangeWindow(range, 0);
    const previousWindow = resolveRangeWindow(range, 1);
    const [summary, previousSummary] = await Promise.all([
      this.getSummary(business.id, currentWindow),
      this.getSummary(business.id, previousWindow)
    ]);
    const [
      hourlyRevenue,
      weeklyRevenue,
      paymentBreakdown,
      categoryBreakdown,
      shiftReports,
      topProducts,
      topStaff
    ] = await Promise.all([
      this.getHourlyRevenue(business.id, currentWindow),
      this.getDailyRevenue(business.id, range),
      this.getPaymentBreakdown(business.id, currentWindow),
      this.getCategoryBreakdown(business.id, currentWindow),
      this.getShiftReports(business.id, currentWindow),
      this.getTopProducts(business.id, currentWindow),
      this.getTopStaff(business.id, currentWindow)
    ]);

    return {
      range,
      generatedAt: new Date().toISOString(),
      kpis: buildReportKpis(summary, previousSummary),
      hourlyRevenue,
      weeklyRevenue,
      paymentBreakdown,
      categoryBreakdown,
      shiftReports,
      topProducts,
      topStaff
    };
  }

  private async getBusinessBySlug(slug: string) {
    const [business] = await this.database.sql<BusinessRow[]>`
      SELECT id
      FROM businesses
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (!business) {
      throw new NotFoundException("Business not found");
    }

    return business;
  }

  private async getSummary(
    businessId: string,
    window: ReportWindow
  ): Promise<{ revenue: number; orders: number; customers: number; averageOrder: number }> {
    const [summary] = await this.database.sql<SummaryRow[]>`
      SELECT
        COALESCE(SUM(o.total), 0)::text AS revenue,
        COUNT(*)::text AS orders,
        COUNT(DISTINCT COALESCE(o.customer_id::text, NULLIF(o.customer_name, '')))::text AS customers
      FROM orders o
      WHERE o.business_id = ${businessId}
        AND o.status NOT IN ('cancelled', 'voided', 'refunded', 'draft')
        AND o.created_at >= ${window.start}
        AND o.created_at < ${window.end}
    `;
    const revenue = Number(summary?.revenue ?? 0);
    const orders = Number(summary?.orders ?? 0);

    return {
      revenue,
      orders,
      customers: Number(summary?.customers ?? 0),
      averageOrder: orders ? revenue / orders : 0
    };
  }

  private async getHourlyRevenue(businessId: string, window: ReportWindow): Promise<RevenuePoint[]> {
    const rows = await this.database.sql<HourlyRow[]>`
      WITH hours AS (
        SELECT generate_series(0, 23) AS hour
      )
      SELECT
        lpad(hours.hour::text, 2, '0') || ':00' AS hour_label,
        COALESCE(SUM(o.total), 0)::text AS revenue
      FROM hours
      LEFT JOIN orders o
        ON o.business_id = ${businessId}
       AND o.status NOT IN ('cancelled', 'voided', 'refunded', 'draft')
       AND o.created_at >= ${window.start}
       AND o.created_at < ${window.end}
       AND EXTRACT(HOUR FROM o.created_at) = hours.hour
      GROUP BY hours.hour
      ORDER BY hours.hour ASC
    `;

    return rows.map((row) => ({
      label: row.hour_label,
      value: Number(row.revenue)
    }));
  }

  private async getDailyRevenue(businessId: string, range: ReportRange): Promise<RevenuePoint[]> {
    const days = range === "30d" ? 30 : 7;
    const rows = await this.database.sql<DailyRow[]>`
      WITH days AS (
        SELECT generate_series(CURRENT_DATE - (${days - 1} * INTERVAL '1 day'), CURRENT_DATE, INTERVAL '1 day')::date AS day
      )
      SELECT
        to_char(days.day, 'DD/MM') AS date_label,
        COALESCE(SUM(o.total), 0)::text AS revenue
      FROM days
      LEFT JOIN orders o
        ON o.business_id = ${businessId}
       AND o.status NOT IN ('cancelled', 'voided', 'refunded', 'draft')
       AND o.created_at::date = days.day
      GROUP BY days.day
      ORDER BY days.day ASC
    `;

    return rows.map((row) => ({
      label: row.date_label,
      value: Number(row.revenue)
    }));
  }

  private async getPaymentBreakdown(businessId: string, window: ReportWindow): Promise<BreakdownItem[]> {
    const rows = await this.database.sql<BreakdownRow[]>`
      SELECT
        CASE p.method
          WHEN 'cash' THEN 'Tiền mặt'
          WHEN 'bank-transfer' THEN 'Chuyển khoản'
          WHEN 'qr-code' THEN 'QR'
          ELSE p.method
        END AS label,
        COALESCE(SUM(p.amount_paid - p.change_amount), 0)::text AS value
      FROM payments p
      JOIN orders o ON o.id = p.order_id
      WHERE o.business_id = ${businessId}
        AND p.status = 'paid'
        AND p.paid_at >= ${window.start}
        AND p.paid_at < ${window.end}
      GROUP BY p.method
      ORDER BY value DESC
    `;

    return buildBreakdown(rows, paymentColors, "Chưa thanh toán");
  }

  private async getCategoryBreakdown(businessId: string, window: ReportWindow): Promise<BreakdownItem[]> {
    const rows = await this.database.sql<BreakdownRow[]>`
      SELECT
        COALESCE(
          c.name,
          CASE
            WHEN lower(oi.name_snapshot) LIKE '%cà phê%' OR lower(oi.name_snapshot) LIKE '%coffee%' OR lower(oi.name_snapshot) LIKE '%americano%' OR lower(oi.name_snapshot) LIKE '%latte%' THEN 'Cà phê'
            WHEN lower(oi.name_snapshot) LIKE '%trà%' OR lower(oi.name_snapshot) LIKE '%tea%' OR lower(oi.name_snapshot) LIKE '%matcha%' THEN 'Trà'
            WHEN lower(oi.name_snapshot) LIKE '%bánh%' OR lower(oi.name_snapshot) LIKE '%cake%' OR lower(oi.name_snapshot) LIKE '%croissant%' THEN 'Bánh'
            WHEN lower(oi.name_snapshot) LIKE '%nước%' OR lower(oi.name_snapshot) LIKE '%juice%' OR lower(oi.name_snapshot) LIKE '%sinh tố%' THEN 'Nước ép'
            ELSE 'Khác'
          END,
          'Khác'
        ) AS label,
        COALESCE(SUM(oi.line_total), 0)::text AS value
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      LEFT JOIN items i ON i.id = oi.item_id
      LEFT JOIN categories c ON c.id = i.category_id
      WHERE o.business_id = ${businessId}
        AND o.status NOT IN ('cancelled', 'voided', 'refunded', 'draft')
        AND o.created_at >= ${window.start}
        AND o.created_at < ${window.end}
      GROUP BY label
      ORDER BY value DESC
      LIMIT 5
    `;

    return buildBreakdown(rows, categoryColors, "Chưa có dữ liệu");
  }

  private async getTopProducts(businessId: string, window: ReportWindow): Promise<TopProductReportItem[]> {
    const rows = await this.database.sql<ProductRow[]>`
      SELECT
        oi.name_snapshot AS name,
        COALESCE(SUM(oi.quantity), 0)::text AS quantity,
        COALESCE(SUM(oi.line_total), 0)::text AS revenue,
        MAX(i.image_url) AS image
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      LEFT JOIN items i ON i.id = oi.item_id
      WHERE o.business_id = ${businessId}
        AND o.status NOT IN ('cancelled', 'voided', 'refunded', 'draft')
        AND o.created_at >= ${window.start}
        AND o.created_at < ${window.end}
      GROUP BY oi.name_snapshot
      ORDER BY SUM(oi.quantity) DESC, SUM(oi.line_total) DESC
      LIMIT 5
    `;

    return rows.map((row, index) => ({
      rank: index + 1,
      name: row.name,
      quantity: `${formatQuantity(Number(row.quantity))} món`,
      revenue: Number(row.revenue),
      image: row.image || fallbackProductImage
    }));
  }

  private async getShiftReports(businessId: string, window: ReportWindow): Promise<StaffShiftReportItem[]> {
    const rows = await this.database.sql<ShiftRow[]>`
      SELECT
        CASE
          WHEN EXTRACT(HOUR FROM o.created_at) >= 6 AND EXTRACT(HOUR FROM o.created_at) < 14 THEN 'Ca sáng (06:00 - 14:00)'
          WHEN EXTRACT(HOUR FROM o.created_at) >= 14 AND EXTRACT(HOUR FROM o.created_at) < 22 THEN 'Ca chiều (14:00 - 22:00)'
          ELSE 'Ca tối (22:00 - 06:00)'
        END AS shift,
        COALESCE(SUM(o.total), 0)::text AS revenue,
        COUNT(*)::text AS orders
      FROM orders o
      WHERE o.business_id = ${businessId}
        AND o.status NOT IN ('cancelled', 'voided', 'refunded', 'draft')
        AND o.created_at >= ${window.start}
        AND o.created_at < ${window.end}
      GROUP BY shift
      ORDER BY MIN(o.created_at) ASC
    `;
    const employeeByShift: Record<string, string> = {
      "Ca sáng (06:00 - 14:00)": "Ca sáng",
      "Ca chiều (14:00 - 22:00)": "Ca chiều",
      "Ca tối (22:00 - 06:00)": "Ca tối"
    };

    return rows.map((row) => ({
      shift: row.shift,
      employee: employeeByShift[row.shift] ?? "Nhân viên POS",
      revenue: Number(row.revenue),
      orders: Number(row.orders),
      status: Number(row.orders) > 0 ? "active" : "pending"
    }));
  }

  private async getTopStaff(businessId: string, window: ReportWindow): Promise<TopStaffReportItem[]> {
    const rows = await this.database.sql<StaffRow[]>`
      SELECT
        COALESCE(NULLIF(o.cashier_name, ''), 'Thu ngân POS') AS name,
        COALESCE(SUM(o.total), 0)::text AS revenue,
        COUNT(*)::text AS orders
      FROM orders o
      WHERE o.business_id = ${businessId}
        AND o.status NOT IN ('cancelled', 'voided', 'refunded', 'draft')
        AND o.created_at >= ${window.start}
        AND o.created_at < ${window.end}
      GROUP BY COALESCE(NULLIF(o.cashier_name, ''), 'Thu ngân POS')
      ORDER BY SUM(o.total) DESC, COUNT(*) DESC
      LIMIT 5
    `;

    return rows.map((row, index) => ({
      rank: index + 1,
      name: row.name,
      revenue: Number(row.revenue),
      orders: Number(row.orders),
      avatar: fallbackAvatar
    }));
  }
}

type ReportWindow = {
  start: string;
  end: string;
};

function resolveRangeWindow(range: ReportRange, offset: number): ReportWindow {
  const now = new Date();
  const endDate = stripTime(now);
  let days = 1;

  if (range === "7d") days = 7;
  if (range === "30d") days = 30;

  const end = new Date(endDate);
  end.setDate(end.getDate() - offset * days + 1);

  const start = new Date(end);
  start.setDate(start.getDate() - days);

  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
}

function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function buildReportKpis(
  summary: { revenue: number; orders: number; customers: number; averageOrder: number },
  previousSummary: { revenue: number; orders: number; customers: number; averageOrder: number }
): ReportKpi[] {
  return [
    {
      id: "revenue",
      title: "Doanh thu",
      value: formatCurrency(summary.revenue),
      change: buildChange(summary.revenue, previousSummary.revenue)
    },
    {
      id: "orders",
      title: "Đơn hàng",
      value: String(summary.orders),
      change: buildChange(summary.orders, previousSummary.orders)
    },
    {
      id: "customers",
      title: "Khách hàng",
      value: String(summary.customers),
      change: buildChange(summary.customers, previousSummary.customers)
    },
    {
      id: "average-order",
      title: "Giá trị đơn trung bình",
      value: formatCurrency(summary.averageOrder),
      change: buildChange(summary.averageOrder, previousSummary.averageOrder)
    }
  ];
}

function buildChange(current: number, previous: number) {
  if (!previous && !current) return "0% so với kỳ trước";
  if (!previous) return "+100% so với kỳ trước";

  const percent = ((current - previous) / previous) * 100;
  const sign = percent > 0 ? "+" : "";

  return `${sign}${percent.toFixed(1)}% so với kỳ trước`;
}

function buildBreakdown(rows: BreakdownRow[], colors: string[], emptyLabel: string): BreakdownItem[] {
  const total = rows.reduce((sum, row) => sum + Number(row.value), 0);

  if (!rows.length || total <= 0) {
    return [{ label: emptyLabel, value: 0, percent: 100, color: colors[0] ?? "#8a5425" }];
  }

  return rows.map((row, index) => ({
    label: row.label,
    value: Number(row.value),
    percent: Math.round((Number(row.value) / total) * 100),
    color: colors[index % colors.length]
  }));
}

function formatCurrency(value: number) {
  return `${Math.round(value).toLocaleString("vi-VN")}đ`;
}

function formatQuantity(value: number) {
  return Number.isInteger(value)
    ? value.toLocaleString("vi-VN")
    : value.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
}
