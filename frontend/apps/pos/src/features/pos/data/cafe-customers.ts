export type CustomerTier = "gold" | "silver" | "bronze"
export type CustomerStatus = "active" | "locked"

export type FavoriteCustomerItem = {
  name: string
  price: number
  image: string
}

export type RecentCustomerOrder = {
  id: string
  date: string
  time: string
  total: number
  status: "completed" | "open"
}

export type CafeCustomer = {
  id: string
  code: string
  name: string
  phone: string
  email: string
  tier: CustomerTier
  points: number
  visits: number
  totalSpent: number
  lastVisit: string
  status: CustomerStatus
  avatar: string
  birthday: string
  joinDate: string
  favoriteItems: FavoriteCustomerItem[]
  recentOrders: RecentCustomerOrder[]
}

const milkCoffeeImage =
  "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=140&q=80"
const latteImage =
  "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=140&q=80"
const peachTeaImage =
  "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=140&q=80"

export const cafeCustomers: CafeCustomer[] = [
  {
    id: "cus-001",
    code: "CM0001",
    name: "Nguyễn Thảo Vy",
    phone: "0901 234 567",
    email: "vy.nguyen@example.com",
    tier: "gold",
    points: 2450,
    visits: 24,
    totalSpent: 3450000,
    lastVisit: "19/05/2024",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    birthday: "12/08/1995",
    joinDate: "05/06/2023",
    favoriteItems: [
      { name: "Cà phê sữa", price: 28000, image: milkCoffeeImage },
      { name: "Latte", price: 35000, image: latteImage },
      { name: "Trà đào", price: 35000, image: peachTeaImage },
    ],
    recentOrders: [
      { id: "#DH0421", date: "19/05/2024", time: "10:15", total: 145000, status: "completed" },
      { id: "#DH0387", date: "17/05/2024", time: "16:42", total: 98000, status: "completed" },
      { id: "#DH0342", date: "15/05/2024", time: "09:28", total: 125000, status: "completed" },
    ],
  },
  {
    id: "cus-002",
    code: "CM0002",
    name: "Trần Minh Hoàng",
    phone: "0912 345 678",
    email: "hoang.tran@example.com",
    tier: "silver",
    points: 1280,
    visits: 15,
    totalSpent: 2150000,
    lastVisit: "18/05/2024",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    birthday: "18/02/1993",
    joinDate: "21/08/2023",
    favoriteItems: [
      { name: "Latte", price: 35000, image: latteImage },
      { name: "Cà phê sữa", price: 28000, image: milkCoffeeImage },
      { name: "Trà đào", price: 35000, image: peachTeaImage },
    ],
    recentOrders: [
      { id: "#DH0412", date: "18/05/2024", time: "08:40", total: 70000, status: "completed" },
      { id: "#DH0330", date: "13/05/2024", time: "14:22", total: 115000, status: "completed" },
    ],
  },
  {
    id: "cus-003",
    code: "CM0003",
    name: "Lê Phương Linh",
    phone: "0933 456 789",
    email: "linh.le@example.com",
    tier: "gold",
    points: 2050,
    visits: 22,
    totalSpent: 3020000,
    lastVisit: "17/05/2024",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80",
    birthday: "04/04/1997",
    joinDate: "10/07/2023",
    favoriteItems: [
      { name: "Trà đào", price: 35000, image: peachTeaImage },
      { name: "Latte", price: 35000, image: latteImage },
    ],
    recentOrders: [
      { id: "#DH0398", date: "17/05/2024", time: "12:10", total: 175000, status: "completed" },
    ],
  },
  {
    id: "cus-004",
    code: "CM0004",
    name: "Phạm Quốc Anh",
    phone: "0987 654 321",
    email: "anh.pham@example.com",
    tier: "bronze",
    points: 620,
    visits: 8,
    totalSpent: 780000,
    lastVisit: "15/05/2024",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80",
    birthday: "22/12/1994",
    joinDate: "11/11/2023",
    favoriteItems: [{ name: "Cà phê sữa", price: 28000, image: milkCoffeeImage }],
    recentOrders: [
      { id: "#DH0341", date: "15/05/2024", time: "11:20", total: 78000, status: "completed" },
    ],
  },
  {
    id: "cus-005",
    code: "CM0005",
    name: "Đỗ Thu Hà",
    phone: "0902 345 678",
    email: "ha.do@example.com",
    tier: "silver",
    points: 1150,
    visits: 13,
    totalSpent: 1950000,
    lastVisit: "14/05/2024",
    status: "locked",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80",
    birthday: "19/01/1998",
    joinDate: "02/09/2023",
    favoriteItems: [{ name: "Latte", price: 35000, image: latteImage }],
    recentOrders: [
      { id: "#DH0301", date: "14/05/2024", time: "17:35", total: 95000, status: "completed" },
    ],
  },
  {
    id: "cus-006",
    code: "CM0006",
    name: "Nguyễn Đức Mạnh",
    phone: "0977 888 999",
    email: "manh.nguyen@example.com",
    tier: "bronze",
    points: 410,
    visits: 6,
    totalSpent: 520000,
    lastVisit: "12/05/2024",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
    birthday: "08/05/1992",
    joinDate: "28/12/2023",
    favoriteItems: [{ name: "Trà đào", price: 35000, image: peachTeaImage }],
    recentOrders: [
      { id: "#DH0288", date: "12/05/2024", time: "13:00", total: 52000, status: "completed" },
    ],
  },
  {
    id: "cus-007",
    code: "CM0007",
    name: "Vũ Khánh Ngọc",
    phone: "0918 765 432",
    email: "ngoc.vu@example.com",
    tier: "silver",
    points: 980,
    visits: 11,
    totalSpent: 1560000,
    lastVisit: "10/05/2024",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=160&q=80",
    birthday: "16/03/1996",
    joinDate: "15/05/2023",
    favoriteItems: [{ name: "Latte", price: 35000, image: latteImage }],
    recentOrders: [
      { id: "#DH0272", date: "10/05/2024", time: "18:10", total: 132000, status: "completed" },
    ],
  },
  {
    id: "cus-008",
    code: "CM0008",
    name: "Bùi Anh Tuấn",
    phone: "0936 222 111",
    email: "tuan.bui@example.com",
    tier: "bronze",
    points: 330,
    visits: 5,
    totalSpent: 410000,
    lastVisit: "08/05/2024",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1618641986557-1ecd230959aa?auto=format&fit=crop&w=160&q=80",
    birthday: "25/09/1991",
    joinDate: "01/02/2024",
    favoriteItems: [{ name: "Cà phê sữa", price: 28000, image: milkCoffeeImage }],
    recentOrders: [
      { id: "#DH0250", date: "08/05/2024", time: "09:45", total: 41000, status: "completed" },
    ],
  },
  {
    id: "cus-009",
    code: "CM0009",
    name: "Hoàng Yến Nhi",
    phone: "0909 123 456",
    email: "nhi.hoang@example.com",
    tier: "silver",
    points: 1620,
    visits: 17,
    totalSpent: 2480000,
    lastVisit: "07/05/2024",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=160&q=80",
    birthday: "30/07/1999",
    joinDate: "09/08/2023",
    favoriteItems: [{ name: "Trà đào", price: 35000, image: peachTeaImage }],
    recentOrders: [
      { id: "#DH0239", date: "07/05/2024", time: "15:12", total: 168000, status: "completed" },
    ],
  },
  {
    id: "cus-010",
    code: "CM0010",
    name: "Đặng Quang Huy",
    phone: "0914 321 654",
    email: "huy.dang@example.com",
    tier: "gold",
    points: 2780,
    visits: 28,
    totalSpent: 4120000,
    lastVisit: "06/05/2024",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80",
    birthday: "11/10/1990",
    joinDate: "18/04/2023",
    favoriteItems: [
      { name: "Cà phê sữa", price: 28000, image: milkCoffeeImage },
      { name: "Latte", price: 35000, image: latteImage },
    ],
    recentOrders: [
      { id: "#DH0226", date: "06/05/2024", time: "08:55", total: 220000, status: "completed" },
    ],
  },
]
