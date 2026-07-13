import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query } from "@nestjs/common";

import type { SaveStaffAttendanceBody, SaveStaffLeaveBody, SaveStaffScheduleBody, SaveStaffShiftBody } from "./staff-hr.dto";
import { StaffHrService } from "./staff-hr.service";

const defaultCafeBusinessSlug = "tj-cafe-vientiane";

@Controller("pos/staff/hr")
export class StaffHrController {
  constructor(private readonly staffHrService: StaffHrService) {}

  @Get("overview")
  getOverview(@Headers("x-business-slug") slug: string | undefined, @Query("date") date?: string) {
    return this.staffHrService.getOverview(resolveBusinessSlug(slug), date);
  }

  @Post("shifts")
  createShift(@Headers("x-business-slug") slug: string | undefined, @Body() body: SaveStaffShiftBody) {
    return this.staffHrService.saveShift(resolveBusinessSlug(slug), body);
  }

  @Patch("shifts/:shiftId")
  updateShift(@Headers("x-business-slug") slug: string | undefined, @Param("shiftId") shiftId: string, @Body() body: SaveStaffShiftBody) {
    return this.staffHrService.saveShift(resolveBusinessSlug(slug), body, shiftId);
  }

  @Post("schedules")
  saveSchedule(@Headers("x-business-slug") slug: string | undefined, @Body() body: SaveStaffScheduleBody) {
    return this.staffHrService.saveSchedule(resolveBusinessSlug(slug), body);
  }

  @Delete("schedules/:scheduleId")
  deleteSchedule(@Headers("x-business-slug") slug: string | undefined, @Param("scheduleId") scheduleId: string) {
    return this.staffHrService.deleteSchedule(resolveBusinessSlug(slug), scheduleId);
  }

  @Post("attendance")
  saveAttendance(@Headers("x-business-slug") slug: string | undefined, @Body() body: SaveStaffAttendanceBody) {
    return this.staffHrService.saveAttendance(resolveBusinessSlug(slug), body);
  }

  @Post("leave-requests")
  createLeave(@Headers("x-business-slug") slug: string | undefined, @Body() body: SaveStaffLeaveBody) {
    return this.staffHrService.saveLeaveRequest(resolveBusinessSlug(slug), body);
  }

  @Patch("leave-requests/:leaveId")
  updateLeave(@Headers("x-business-slug") slug: string | undefined, @Param("leaveId") leaveId: string, @Body() body: SaveStaffLeaveBody) {
    return this.staffHrService.saveLeaveRequest(resolveBusinessSlug(slug), body, leaveId);
  }
}

function resolveBusinessSlug(value: string | undefined) {
  return value?.trim() || defaultCafeBusinessSlug;
}
