import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query } from "@nestjs/common";

import type { SaveStaffBody } from "./staff.dto";
import { StaffService } from "./staff.service";

const defaultCafeBusinessSlug = "tj-cafe-vientiane";

@Controller("pos/staff")
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  listStaff(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Query("q") q?: string,
    @Query("role") role?: string,
    @Query("status") status?: string
  ) {
    return this.staffService.listBusinessStaff(resolveBusinessSlug(businessSlug), {
      q,
      role,
      status
    });
  }

  @Get(":staffId")
  getStaff(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Param("staffId") staffId: string
  ) {
    return this.staffService.getBusinessStaff(resolveBusinessSlug(businessSlug), staffId);
  }

  @Post()
  createStaff(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Body() body: SaveStaffBody
  ) {
    return this.staffService.createBusinessStaff(resolveBusinessSlug(businessSlug), body);
  }

  @Patch(":staffId")
  updateStaff(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Param("staffId") staffId: string,
    @Body() body: SaveStaffBody
  ) {
    return this.staffService.updateBusinessStaff(resolveBusinessSlug(businessSlug), staffId, body);
  }

  @Delete(":staffId")
  deleteStaff(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Param("staffId") staffId: string
  ) {
    return this.staffService.deleteBusinessStaff(resolveBusinessSlug(businessSlug), staffId);
  }
}

function resolveBusinessSlug(value: string | undefined) {
  const slug = value?.trim();

  return slug || defaultCafeBusinessSlug;
}
