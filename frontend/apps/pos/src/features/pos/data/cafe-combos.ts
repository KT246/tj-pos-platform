export type ComboStatus = "active" | "paused" | "stopped"

export type ComboProduct = {
  name: string
  price: number
  quantity: number
  image: string
}

export type CafeCombo = {
  id: string
  name: string
  subtitle: string
  price: number
  status: ComboStatus
  sortOrder: number
  image: string
  description: string
  products: ComboProduct[]
}

export type ComboKpi = {
  id: string
  title: string
  value: string
  subtitle: string
  tone: "brown" | "green" | "amber" | "red"
}

const blackCoffee =
  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=180&q=80"
const croissant =
  "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=180&q=80"
const peachTea =
  "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=180&q=80"
const cake =
  "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=180&q=80"
const juice =
  "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=180&q=80"
const matcha =
  "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=180&q=80"
const smoothie =
  "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=180&q=80"

export const comboKpis: ComboKpi[] = [
  { id: "total", title: "Tổng combo", value: "24", subtitle: "combo", tone: "brown" },
  { id: "active", title: "Đang hoạt động", value: "20", subtitle: "combo", tone: "green" },
  { id: "paused", title: "Tạm dừng", value: "2", subtitle: "combo", tone: "amber" },
  { id: "stopped", title: "Ngừng bán", value: "2", subtitle: "combo", tone: "red" },
]

export const cafeCombos: CafeCombo[] = [
  {
    id: "combo-breakfast",
    name: "Combo Cà phê sáng",
    subtitle: "Cà phê + Bánh ngọt",
    price: 45000,
    status: "active",
    sortOrder: 1,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=520&q=80",
    description: "Combo gồm cà phê và bánh ngọt, phù hợp cho bữa sáng.",
    products: [
      { name: "Cà phê đen", price: 25000, quantity: 1, image: blackCoffee },
      { name: "Croissant", price: 20000, quantity: 1, image: croissant },
    ],
  },
  {
    id: "combo-afternoon-tea",
    name: "Combo Trà chiều",
    subtitle: "Trà + Bánh",
    price: 55000,
    status: "active",
    sortOrder: 2,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=520&q=80",
    description: "Trà trái cây dùng cùng bánh ngọt nhẹ.",
    products: [
      { name: "Trà đào", price: 35000, quantity: 1, image: peachTea },
      { name: "Cheesecake", price: 20000, quantity: 1, image: cake },
    ],
  },
  {
    id: "combo-energy",
    name: "Combo Năng lượng",
    subtitle: "Cà phê + Nước ép",
    price: 65000,
    status: "active",
    sortOrder: 3,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=520&q=80",
    description: "Combo cho khách cần đồ uống tỉnh táo và tươi mát.",
    products: [
      { name: "Americano", price: 30000, quantity: 1, image: blackCoffee },
      { name: "Nước cam", price: 35000, quantity: 1, image: juice },
    ],
  },
  {
    id: "combo-healthy",
    name: "Combo Healthy",
    subtitle: "Trà xanh + Bánh yến mạch",
    price: 60000,
    status: "paused",
    sortOrder: 4,
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=520&q=80",
    description: "Combo nhẹ, ít ngọt cho khách thích lựa chọn lành mạnh.",
    products: [
      { name: "Trà xanh latte", price: 35000, quantity: 1, image: matcha },
      { name: "Cookies", price: 25000, quantity: 1, image: cake },
    ],
  },
  {
    id: "combo-saving",
    name: "Combo Tiết kiệm",
    subtitle: "Cà phê + Croissant",
    price: 40000,
    status: "active",
    sortOrder: 5,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=520&q=80",
    description: "Combo nhỏ, giá tốt cho khách mua nhanh.",
    products: [
      { name: "Cà phê sữa", price: 28000, quantity: 1, image: blackCoffee },
      { name: "Croissant", price: 12000, quantity: 1, image: croissant },
    ],
  },
  {
    id: "combo-detox",
    name: "Combo Detox",
    subtitle: "Sinh tố + Trái cây",
    price: 70000,
    status: "stopped",
    sortOrder: 6,
    image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=520&q=80",
    description: "Combo sinh tố và trái cây, hiện đang ngừng bán.",
    products: [
      { name: "Sinh tố dâu", price: 40000, quantity: 1, image: smoothie },
      { name: "Trái cây", price: 30000, quantity: 1, image: juice },
    ],
  },
]
