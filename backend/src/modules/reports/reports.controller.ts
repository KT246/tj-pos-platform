import { Controller, Get, Headers, Query } from "@nestjs/common";

import type { ReportRange } from "./reports.dto";
import { ReportsService } from "./reports.service";

const defaultCafeBusinessSlug = "tj-cafe-vientiane";

@Controller("pos/reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("overview")
  getOverview(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Query("range") range?: ReportRange
  ) {
    return this.reportsService.getBusinessOverview(resolveBusinessSlug(businessSlug), range);
  }
}

function resolveBusinessSlug(value: string | undefined) {
  const slug = value?.trim();

  return slug || defaultCafeBusinessSlug;
}
