export type StaffStatus = "active" | "inactive" | "on-leave";

export type StaffMember = {
  id: string;
  name: string;
  username: string;
  canLogin: boolean;
  email: string;
  phone: string;
  role: string;
  shift: string;
  shiftTime: string;
  status: StaffStatus;
  avatar: string;
  gender: string;
  birthday: string;
  address: string;
  identityNumber: string;
  joinDate: string;
  note: string;
  revenue: number;
  orders: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export type StaffKpi = {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  tone: "brown" | "green" | "amber" | "purple";
};

export type StaffListResponse = {
  staff: StaffMember[];
  kpis: StaffKpi[];
};

export type SaveStaffBody = {
  name?: string;
  username?: string;
  password?: string;
  canLogin?: boolean;
  email?: string;
  phone?: string;
  role?: string;
  shift?: string;
  shiftTime?: string;
  status?: StaffStatus;
  avatar?: string;
  gender?: string;
  birthday?: string;
  address?: string;
  identityNumber?: string;
  joinDate?: string;
  note?: string;
};

export type DeleteStaffResponse = {
  id: string;
  deleted: true;
};
