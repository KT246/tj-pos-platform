export type StockStatus = "in-stock" | "low-stock" | "out-of-stock" | "ordering"
export type StockCategory = "ingredient" | "supply" | "product"

export type CafeStockItem = {
  id: string
  name: string
  category: StockCategory
  categoryLabel: string
  sku: string
  unit: string
  currentStock: number
  availableStock: number
  minStock: number
  orderingStock: number
  status: StockStatus
  costPrice: number
  inventoryValue: number
  supplier: string
  lastImportAt: string
  expiryDate: string
  image: string
}

export type StockKpi = {
  id: string
  title: string
  value: string
  subtitle: string
  tone: "brown" | "green" | "amber" | "red" | "blue"
  helper?: string
}

export type StockMovementPoint = {
  date: string
  importQty: number
  exportQty: number
}

const coffeeBeansImage =
  "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=160&q=80"
const milkImage =
  "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=160&q=80"
const syrupImage =
  "https://images.unsplash.com/photo-1608877907149-a206d75ba011?auto=format&fit=crop&w=160&q=80"
const cupImage =
  "https://images.unsplash.com/photo-1522992319-0365e5f11656?auto=format&fit=crop&w=160&q=80"
const lidImage =
  "https://images.unsplash.com/photo-1599458252573-56ae36120de1?auto=format&fit=crop&w=160&q=80"
const strawImage =
  "https://images.unsplash.com/photo-1607668478747-14c53552d978?auto=format&fit=crop&w=160&q=80"
const sugarImage =
  "https://images.unsplash.com/photo-1605286978633-2dec93ff88a2?auto=format&fit=crop&w=160&q=80"
const teaImage =
  "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=160&q=80"

export const stockTabs = [
  "Tổng quan",
  "Sản phẩm",
  "Nguyên liệu",
  "Nhập hàng",
  "Chuyển kho",
  "Kiểm kho",
  "Cảnh báo",
  "Nhà cung cấp",
]

export const stockKpis: StockKpi[] = [
  {
    id: "value",
    title: "Tổng giá trị tồn kho",
    value: "234,560,000 ກີບ",
    subtitle: "so với tháng trước",
    tone: "brown",
    helper: "↑ 8.5%",
  },
  {
    id: "products",
    title: "Tổng sản phẩm",
    value: "152",
    subtitle: "SKU",
    tone: "green",
  },
  {
    id: "low",
    title: "Sắp hết hàng",
    value: "12",
    subtitle: "Xem chi tiết",
    tone: "amber",
  },
  {
    id: "out",
    title: "Hết hàng",
    value: "3",
    subtitle: "Xem chi tiết",
    tone: "red",
  },
  {
    id: "imports",
    title: "Nhập hàng hôm nay",
    value: "5",
    subtitle: "Đơn nhập",
    tone: "blue",
  },
]

export const cafeStockItems: CafeStockItem[] = [
  {
    id: "robusta-beans",
    name: "Hạt cà phê Robusta",
    category: "ingredient",
    categoryLabel: "Nguyên liệu",
    sku: "ING-0001",
    unit: "kg",
    currentStock: 28.5,
    availableStock: 28.5,
    minStock: 10,
    orderingStock: 5,
    status: "in-stock",
    costPrice: 120000,
    inventoryValue: 3420000,
    supplier: "Công ty TNHH Cà phê Việt",
    lastImportAt: "18/05/2024",
    expiryDate: "18/11/2024",
    image: coffeeBeansImage,
  },
  {
    id: "vinamilk-fresh-milk",
    name: "Sữa tươi Vinamilk",
    category: "ingredient",
    categoryLabel: "Nguyên liệu",
    sku: "ING-0002",
    unit: "hộp",
    currentStock: 15,
    availableStock: 15,
    minStock: 10,
    orderingStock: 0,
    status: "in-stock",
    costPrice: 32000,
    inventoryValue: 480000,
    supplier: "Vinamilk Distribution",
    lastImportAt: "19/05/2024",
    expiryDate: "28/05/2024",
    image: milkImage,
  },
  {
    id: "caramel-syrup",
    name: "Siro Caramel",
    category: "ingredient",
    categoryLabel: "Nguyên liệu",
    sku: "ING-0003",
    unit: "chai",
    currentStock: 5,
    availableStock: 5,
    minStock: 8,
    orderingStock: 3,
    status: "low-stock",
    costPrice: 85000,
    inventoryValue: 425000,
    supplier: "Coffee Ingredient Laos",
    lastImportAt: "12/05/2024",
    expiryDate: "12/11/2024",
    image: syrupImage,
  },
  {
    id: "paper-cup-12oz",
    name: "Ly giấy 12oz",
    category: "supply",
    categoryLabel: "Vật tư",
    sku: "SUP-0001",
    unit: "cái",
    currentStock: 120,
    availableStock: 120,
    minStock: 50,
    orderingStock: 0,
    status: "in-stock",
    costPrice: 1200,
    inventoryValue: 144000,
    supplier: "Bao bì Vientiane",
    lastImportAt: "17/05/2024",
    expiryDate: "-",
    image: cupImage,
  },
  {
    id: "cup-lid-12oz",
    name: "Nắp ly 12oz",
    category: "supply",
    categoryLabel: "Vật tư",
    sku: "SUP-0002",
    unit: "cái",
    currentStock: 45,
    availableStock: 45,
    minStock: 50,
    orderingStock: 0,
    status: "low-stock",
    costPrice: 800,
    inventoryValue: 36000,
    supplier: "Bao bì Vientiane",
    lastImportAt: "17/05/2024",
    expiryDate: "-",
    image: lidImage,
  },
  {
    id: "paper-straw",
    name: "Ống hút giấy",
    category: "supply",
    categoryLabel: "Vật tư",
    sku: "SUP-0003",
    unit: "cái",
    currentStock: 0,
    availableStock: 0,
    minStock: 100,
    orderingStock: 0,
    status: "out-of-stock",
    costPrice: 300,
    inventoryValue: 0,
    supplier: "Bao bì Vientiane",
    lastImportAt: "10/05/2024",
    expiryDate: "-",
    image: strawImage,
  },
  {
    id: "white-sugar",
    name: "Đường cát trắng",
    category: "ingredient",
    categoryLabel: "Nguyên liệu",
    sku: "ING-0004",
    unit: "kg",
    currentStock: 25,
    availableStock: 25,
    minStock: 15,
    orderingStock: 0,
    status: "in-stock",
    costPrice: 18000,
    inventoryValue: 450000,
    supplier: "Chợ đầu mối Vientiane",
    lastImportAt: "16/05/2024",
    expiryDate: "16/12/2024",
    image: sugarImage,
  },
  {
    id: "black-tea",
    name: "Trà đen",
    category: "ingredient",
    categoryLabel: "Nguyên liệu",
    sku: "ING-0005",
    unit: "gói",
    currentStock: 12,
    availableStock: 12,
    minStock: 10,
    orderingStock: 0,
    status: "in-stock",
    costPrice: 45000,
    inventoryValue: 540000,
    supplier: "Tea House Supply",
    lastImportAt: "15/05/2024",
    expiryDate: "15/11/2024",
    image: teaImage,
  },
]

export const stockMovement7d: StockMovementPoint[] = [
  { date: "14/05", importQty: 16, exportQty: 48 },
  { date: "15/05", importQty: 26, exportQty: 18 },
  { date: "16/05", importQty: 34, exportQty: 24 },
  { date: "17/05", importQty: 35, exportQty: 42 },
  { date: "18/05", importQty: 48, exportQty: 45 },
  { date: "19/05", importQty: 24, exportQty: 49 },
  { date: "20/05", importQty: 5, exportQty: 35 },
]
