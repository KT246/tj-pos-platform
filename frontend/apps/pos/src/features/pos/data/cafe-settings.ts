export type SettingSectionId =
  | "business"
  | "branches"
  | "payments"
  | "printers"
  | "invoices"
  | "taxes"
  | "permissions"
  | "appearance"
  | "backup"
  | "notifications"

export type SettingSection = {
  id: SettingSectionId
  label: string
}

export type OpeningHour = {
  day: string
  time: string
}

export type SettingModuleCard = {
  id: SettingSectionId
  title: string
  description: string
  status: string
  tone: "green" | "amber" | "blue" | "purple" | "cyan" | "pink" | "red" | "gray"
  actionLabel: string
}

export const settingSections: SettingSection[] = [
  { id: "business", label: "Thông tin quán" },
  { id: "branches", label: "Chi nhánh" },
  { id: "payments", label: "Thanh toán" },
  { id: "printers", label: "Máy in" },
  { id: "invoices", label: "Hóa đơn" },
  { id: "taxes", label: "Thuế / Phí" },
  { id: "permissions", label: "Phân quyền" },
  { id: "appearance", label: "Giao diện" },
  { id: "backup", label: "Sao lưu dữ liệu" },
  { id: "notifications", label: "Thông báo" },
]

export const cafeBusinessSettings = {
  name: "Coffee Time",
  phone: "020 9999 8888",
  address: "Số 123, Đường Kaysone Phomvihane, P. Phonexay, Vientiane, Lào",
  email: "coffeetime.laos@gmail.com",
  coverImage:
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=320&q=80",
}

export const cafeLogoSettings = {
  logoUrl:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=320&q=80",
  uploadHint: "PNG, JPG tối đa 2MB",
}

export const cafeOpeningHours: OpeningHour[] = [
  { day: "Thứ 2", time: "06:30 - 22:30" },
  { day: "Thứ 3", time: "06:30 - 22:30" },
  { day: "Thứ 4", time: "06:30 - 22:30" },
  { day: "Thứ 5", time: "06:30 - 22:30" },
  { day: "Thứ 6", time: "06:30 - 23:00" },
  { day: "Thứ 7", time: "06:30 - 23:00" },
  { day: "Chủ nhật", time: "06:30 - 22:30" },
]

export const settingModuleCards: SettingModuleCard[] = [
  {
    id: "branches",
    title: "Chi nhánh",
    description: "Quản lý thông tin các chi nhánh của quán",
    status: "2 chi nhánh đang hoạt động",
    tone: "green",
    actionLabel: "Quản lý",
  },
  {
    id: "payments",
    title: "Thanh toán",
    description: "Quản lý phương thức thanh toán được chấp nhận",
    status: "4 phương thức",
    tone: "amber",
    actionLabel: "Quản lý",
  },
  {
    id: "printers",
    title: "Máy in",
    description: "Cấu hình máy in hóa đơn, in bếp và in bar",
    status: "3 máy in",
    tone: "purple",
    actionLabel: "Quản lý",
  },
  {
    id: "invoices",
    title: "Hóa đơn",
    description: "Tùy chỉnh mẫu hóa đơn và nội dung hiển thị",
    status: "Đang sử dụng mẫu 1",
    tone: "blue",
    actionLabel: "Quản lý",
  },
  {
    id: "taxes",
    title: "Thuế / Phí",
    description: "Thiết lập thuế VAT, phí dịch vụ và làm tròn tiền",
    status: "VAT 10%",
    tone: "red",
    actionLabel: "Quản lý",
  },
  {
    id: "permissions",
    title: "Phân quyền",
    description: "Quản lý vai trò và quyền hạn của nhân viên",
    status: "5 vai trò",
    tone: "amber",
    actionLabel: "Quản lý",
  },
  {
    id: "appearance",
    title: "Giao diện",
    description: "Tùy chỉnh màu sắc, giao diện hệ thống",
    status: "Chế độ sáng",
    tone: "cyan",
    actionLabel: "Quản lý",
  },
  {
    id: "backup",
    title: "Sao lưu dữ liệu",
    description: "Sao lưu và khôi phục dữ liệu hệ thống",
    status: "Lần sao lưu gần nhất: 19/05/2024",
    tone: "blue",
    actionLabel: "Sao lưu ngay",
  },
  {
    id: "notifications",
    title: "Thông báo",
    description: "Cài đặt thông báo hệ thống và email",
    status: "Đang bật",
    tone: "purple",
    actionLabel: "Quản lý",
  },
]
