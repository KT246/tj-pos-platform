export type StaffShiftTemplate = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  color: string;
  active: boolean;
};

export type StaffScheduleAssignment = {
  id: string;
  staffId: string;
  shiftId: string;
  workDate: string;
  status: "scheduled" | "off";
  note: string;
};

export type StaffAttendanceEntry = {
  id: string;
  staffId: string;
  workDate: string;
  checkIn: string | null;
  checkOut: string | null;
  note: string;
};

export type StaffLeaveRequest = {
  id: string;
  staffId: string;
  leaveType: "annual" | "sick" | "unpaid" | "other";
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  note: string;
  reviewNote: string;
};

export type StaffHrOverview = {
  shifts: StaffShiftTemplate[];
  schedules: StaffScheduleAssignment[];
  attendance: StaffAttendanceEntry[];
  leaveRequests: StaffLeaveRequest[];
  summary: {
    scheduledToday: number;
    checkedInToday: number;
    pendingLeaveRequests: number;
  };
};

export type SaveStaffShiftBody = Partial<Omit<StaffShiftTemplate, "id">>;
export type SaveStaffScheduleBody = Partial<Omit<StaffScheduleAssignment, "id">>;
export type SaveStaffAttendanceBody = Partial<Omit<StaffAttendanceEntry, "id">>;
export type SaveStaffLeaveBody = Partial<Omit<StaffLeaveRequest, "id">>;
