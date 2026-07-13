import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "crypto";

import { DatabaseService } from "../../database/database.service";
import type {
  SaveStaffAttendanceBody,
  SaveStaffLeaveBody,
  SaveStaffScheduleBody,
  SaveStaffShiftBody,
  StaffAttendanceEntry,
  StaffHrOverview,
  StaffLeaveRequest,
  StaffScheduleAssignment,
  StaffShiftTemplate
} from "./staff-hr.dto";

type BusinessRow = { id: string };

@Injectable()
export class StaffHrService implements OnModuleInit {
  constructor(private readonly database: DatabaseService) {}

  async onModuleInit() {
    await this.ensureSchema();
  }

  async getOverview(businessSlug: string, date?: string): Promise<StaffHrOverview> {
    const business = await this.getBusiness(businessSlug);
    const selectedDate = normalizeDate(date) ?? currentDate();
    const weekStart = startOfWeek(selectedDate);
    const weekEnd = addDays(weekStart, 6);

    const [shifts, schedules, attendance, leaveRequests] = await Promise.all([
      this.database.sql<StaffShiftTemplate[]>`
        SELECT id, name, start_time AS "startTime", end_time AS "endTime", color, active
        FROM staff_shift_templates
        WHERE business_id = ${business.id}
        ORDER BY start_time ASC
      `,
      this.database.sql<StaffScheduleAssignment[]>`
        SELECT id, staff_id AS "staffId", shift_id AS "shiftId", work_date::text AS "workDate", status, note
        FROM staff_schedule_assignments
        WHERE business_id = ${business.id}
          AND work_date BETWEEN ${weekStart}::date AND ${weekEnd}::date
        ORDER BY work_date ASC
      `,
      this.database.sql<StaffAttendanceEntry[]>`
        SELECT id, staff_id AS "staffId", work_date::text AS "workDate", check_in AS "checkIn", check_out AS "checkOut", note
        FROM staff_attendance
        WHERE business_id = ${business.id}
          AND work_date BETWEEN ${weekStart}::date AND ${weekEnd}::date
        ORDER BY work_date DESC
      `,
      this.database.sql<StaffLeaveRequest[]>`
        SELECT id, staff_id AS "staffId", leave_type AS "leaveType", start_date::text AS "startDate", end_date::text AS "endDate", status, note, review_note AS "reviewNote"
        FROM staff_leave_requests
        WHERE business_id = ${business.id}
          AND end_date >= ${weekStart}::date
        ORDER BY created_at DESC
      `
    ]);

    return {
      shifts,
      schedules,
      attendance,
      leaveRequests,
      summary: {
        scheduledToday: schedules.filter((item) => item.workDate === selectedDate && item.status === "scheduled").length,
        checkedInToday: attendance.filter((item) => item.workDate === selectedDate && Boolean(item.checkIn)).length,
        pendingLeaveRequests: leaveRequests.filter((item) => item.status === "pending").length
      }
    };
  }

  async saveShift(businessSlug: string, body: SaveStaffShiftBody, shiftId?: string) {
    const business = await this.getBusiness(businessSlug);
    const name = body.name?.trim() ?? "";
    const startTime = normalizeTime(body.startTime) ?? "08:00";
    const endTime = normalizeTime(body.endTime) ?? "17:00";

    if (!name) throw new BadRequestException("Shift name is required");

    if (shiftId) {
      const [row] = await this.database.sql<StaffShiftTemplate[]>`
        UPDATE staff_shift_templates
        SET name = ${name}, start_time = ${startTime}, end_time = ${endTime},
          color = ${normalizeColor(body.color)}, active = ${body.active ?? true}, updated_at = now()
        WHERE id = ${shiftId} AND business_id = ${business.id}
        RETURNING id, name, start_time AS "startTime", end_time AS "endTime", color, active
      `;
      if (!row) throw new NotFoundException("Shift not found");
      return row;
    }

    const [row] = await this.database.sql<StaffShiftTemplate[]>`
      INSERT INTO staff_shift_templates (id, business_id, name, start_time, end_time, color, active)
      VALUES (${randomUUID()}, ${business.id}, ${name}, ${startTime}, ${endTime}, ${normalizeColor(body.color)}, ${body.active ?? true})
      RETURNING id, name, start_time AS "startTime", end_time AS "endTime", color, active
    `;
    return row;
  }

  async saveSchedule(businessSlug: string, body: SaveStaffScheduleBody) {
    const business = await this.getBusiness(businessSlug);
    const staffId = body.staffId?.trim() ?? "";
    const shiftId = body.shiftId?.trim() ?? "";
    const workDate = normalizeDate(body.workDate);
    if (!staffId || !shiftId || !workDate) throw new BadRequestException("Staff, shift and work date are required");
    await this.assertStaffAndShift(business.id, staffId, shiftId);

    const [row] = await this.database.sql<StaffScheduleAssignment[]>`
      INSERT INTO staff_schedule_assignments (id, business_id, staff_id, shift_id, work_date, status, note)
      VALUES (${randomUUID()}, ${business.id}, ${staffId}, ${shiftId}, ${workDate}::date, ${body.status === "off" ? "off" : "scheduled"}, ${body.note?.trim() ?? ""})
      ON CONFLICT (business_id, staff_id, work_date) DO UPDATE SET
        shift_id = EXCLUDED.shift_id, status = EXCLUDED.status, note = EXCLUDED.note, updated_at = now()
      RETURNING id, staff_id AS "staffId", shift_id AS "shiftId", work_date::text AS "workDate", status, note
    `;
    return row;
  }

  async deleteSchedule(businessSlug: string, scheduleId: string) {
    const business = await this.getBusiness(businessSlug);
    const [row] = await this.database.sql<{ id: string }[]>`
      DELETE FROM staff_schedule_assignments
      WHERE id = ${scheduleId} AND business_id = ${business.id}
      RETURNING id
    `;
    if (!row) throw new NotFoundException("Schedule assignment not found");
    return { id: row.id, deleted: true };
  }

  async saveAttendance(businessSlug: string, body: SaveStaffAttendanceBody) {
    const business = await this.getBusiness(businessSlug);
    const staffId = body.staffId?.trim() ?? "";
    const workDate = normalizeDate(body.workDate) ?? currentDate();
    if (!staffId) throw new BadRequestException("Staff is required");
    await this.assertStaff(business.id, staffId);

    const [row] = await this.database.sql<StaffAttendanceEntry[]>`
      INSERT INTO staff_attendance (id, business_id, staff_id, work_date, check_in, check_out, note)
      VALUES (${randomUUID()}, ${business.id}, ${staffId}, ${workDate}::date, ${body.checkIn ?? null}, ${body.checkOut ?? null}, ${body.note?.trim() ?? ""})
      ON CONFLICT (business_id, staff_id, work_date) DO UPDATE SET
        check_in = COALESCE(EXCLUDED.check_in, staff_attendance.check_in),
        check_out = COALESCE(EXCLUDED.check_out, staff_attendance.check_out),
        note = EXCLUDED.note,
        updated_at = now()
      RETURNING id, staff_id AS "staffId", work_date::text AS "workDate", check_in AS "checkIn", check_out AS "checkOut", note
    `;
    return row;
  }

  async saveLeaveRequest(businessSlug: string, body: SaveStaffLeaveBody, leaveId?: string) {
    const business = await this.getBusiness(businessSlug);
    const staffId = body.staffId?.trim() ?? "";
    const startDate = normalizeDate(body.startDate);
    const endDate = normalizeDate(body.endDate);
    if (!staffId || !startDate || !endDate || startDate > endDate) {
      throw new BadRequestException("Staff and a valid leave period are required");
    }
    await this.assertStaff(business.id, staffId);
    const leaveType = normalizeLeaveType(body.leaveType);
    const status = normalizeLeaveStatus(body.status);

    if (leaveId) {
      const [row] = await this.database.sql<StaffLeaveRequest[]>`
        UPDATE staff_leave_requests
        SET leave_type = ${leaveType}, start_date = ${startDate}::date, end_date = ${endDate}::date,
          status = ${status}, note = ${body.note?.trim() ?? ""}, review_note = ${body.reviewNote?.trim() ?? ""}, updated_at = now()
        WHERE id = ${leaveId} AND business_id = ${business.id}
        RETURNING id, staff_id AS "staffId", leave_type AS "leaveType", start_date::text AS "startDate", end_date::text AS "endDate", status, note, review_note AS "reviewNote"
      `;
      if (!row) throw new NotFoundException("Leave request not found");
      return row;
    }

    const [row] = await this.database.sql<StaffLeaveRequest[]>`
      INSERT INTO staff_leave_requests (id, business_id, staff_id, leave_type, start_date, end_date, status, note, review_note)
      VALUES (${randomUUID()}, ${business.id}, ${staffId}, ${leaveType}, ${startDate}::date, ${endDate}::date, ${status}, ${body.note?.trim() ?? ""}, ${body.reviewNote?.trim() ?? ""})
      RETURNING id, staff_id AS "staffId", leave_type AS "leaveType", start_date::text AS "startDate", end_date::text AS "endDate", status, note, review_note AS "reviewNote"
    `;
    return row;
  }

  private async getBusiness(slug: string) {
    const [business] = await this.database.sql<BusinessRow[]>`
      SELECT id FROM businesses WHERE slug = ${slug} LIMIT 1
    `;
    if (!business) throw new NotFoundException("Business not found");
    return business;
  }

  private async assertStaff(businessId: string, staffId: string) {
    const [staff] = await this.database.sql<{ id: string }[]>`
      SELECT id FROM staff_members WHERE id = ${staffId} AND business_id = ${businessId} AND deleted_at IS NULL LIMIT 1
    `;
    if (!staff) throw new NotFoundException("Staff member not found");
  }

  private async assertStaffAndShift(businessId: string, staffId: string, shiftId: string) {
    await this.assertStaff(businessId, staffId);
    const [shift] = await this.database.sql<{ id: string }[]>`
      SELECT id FROM staff_shift_templates WHERE id = ${shiftId} AND business_id = ${businessId} LIMIT 1
    `;
    if (!shift) throw new NotFoundException("Shift not found");
  }

  private async ensureSchema() {
    await this.database.sql`
      CREATE TABLE IF NOT EXISTS staff_shift_templates (
        id uuid PRIMARY KEY,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        name varchar NOT NULL,
        start_time varchar NOT NULL,
        end_time varchar NOT NULL,
        color varchar NOT NULL DEFAULT '#8A5425',
        active boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await this.database.sql`
      CREATE TABLE IF NOT EXISTS staff_schedule_assignments (
        id uuid PRIMARY KEY,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        staff_id uuid NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
        shift_id uuid NOT NULL REFERENCES staff_shift_templates(id) ON DELETE RESTRICT,
        work_date date NOT NULL,
        status varchar NOT NULL DEFAULT 'scheduled',
        note text NOT NULL DEFAULT '',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE (business_id, staff_id, work_date)
      )
    `;
    await this.database.sql`
      CREATE TABLE IF NOT EXISTS staff_attendance (
        id uuid PRIMARY KEY,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        staff_id uuid NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
        work_date date NOT NULL,
        check_in varchar NULL,
        check_out varchar NULL,
        note text NOT NULL DEFAULT '',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE (business_id, staff_id, work_date)
      )
    `;
    await this.database.sql`
      CREATE TABLE IF NOT EXISTS staff_leave_requests (
        id uuid PRIMARY KEY,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        staff_id uuid NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
        leave_type varchar NOT NULL DEFAULT 'annual',
        start_date date NOT NULL,
        end_date date NOT NULL,
        status varchar NOT NULL DEFAULT 'pending',
        note text NOT NULL DEFAULT '',
        review_note text NOT NULL DEFAULT '',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
  }
}

function normalizeDate(value?: string) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;
}

function normalizeTime(value?: string) {
  return value && /^\d{2}:\d{2}$/.test(value) ? value : undefined;
}

function normalizeColor(value?: string) {
  return value && /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#8A5425";
}

function normalizeLeaveType(value?: string) {
  return value === "sick" || value === "unpaid" || value === "other" ? value : "annual";
}

function normalizeLeaveStatus(value?: string) {
  return value === "approved" || value === "rejected" ? value : "pending";
}

function currentDate() {
  return new Date().toISOString().slice(0, 10);
}

function startOfWeek(date: string) {
  const current = new Date(`${date}T00:00:00`);
  const day = current.getDay() || 7;
  current.setDate(current.getDate() - day + 1);
  return current.toISOString().slice(0, 10);
}

function addDays(date: string, days: number) {
  const current = new Date(`${date}T00:00:00`);
  current.setDate(current.getDate() + days);
  return current.toISOString().slice(0, 10);
}
