export type CafeCategoryStatus = "visible" | "hidden"

export type CafeCategory = {
  id: string
  name: string
  description: string
  productCount: number
  sortOrder: number
  status: CafeCategoryStatus
  updatedAt: string
  updatedBy: string
  image: string
}

export const cafeCategories: CafeCategory[] = [
  {
    id: "coffee",
    name: "C\u00e0 ph\u00ea",
    description: "C\u00e1c lo\u1ea1i c\u00e0 ph\u00ea truy\u1ec1n th\u1ed1ng v\u00e0 hi\u1ec7n \u0111\u1ea1i",
    productCount: 12,
    sortOrder: 1,
    status: "visible",
    updatedAt: "20/05/2024 09:15",
    updatedBy: "Nguy\u1ec5n Minh",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=220&q=80",
  },
  {
    id: "tea",
    name: "Tr\u00e0",
    description: "Tr\u00e0 tr\u00e1i c\u00e2y, tr\u00e0 s\u1eefa, tr\u00e0 truy\u1ec1n th\u1ed1ng",
    productCount: 8,
    sortOrder: 2,
    status: "visible",
    updatedAt: "20/05/2024 09:14",
    updatedBy: "Nguy\u1ec5n Minh",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=220&q=80",
  },
  {
    id: "frappe",
    name: "\u0110\u00e1 xay",
    description: "C\u00e1c lo\u1ea1i \u0111\u1ed3 u\u1ed1ng \u0111\u00e1 xay",
    productCount: 10,
    sortOrder: 3,
    status: "visible",
    updatedAt: "20/05/2024 09:13",
    updatedBy: "Nguy\u1ec5n Minh",
    image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=220&q=80",
  },
  {
    id: "juice",
    name: "N\u01b0\u1edbc \u00e9p",
    description: "N\u01b0\u1edbc \u00e9p tr\u00e1i c\u00e2y t\u01b0\u01a1i",
    productCount: 6,
    sortOrder: 4,
    status: "visible",
    updatedAt: "19/05/2024 16:40",
    updatedBy: "Nguy\u1ec5n Minh",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=220&q=80",
  },
  {
    id: "cake",
    name: "B\u00e1nh",
    description: "B\u00e1nh ng\u1ecdt, b\u00e1nh m\u1eb7n",
    productCount: 9,
    sortOrder: 5,
    status: "visible",
    updatedAt: "19/05/2024 16:38",
    updatedBy: "Nguy\u1ec5n Minh",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=220&q=80",
  },
  {
    id: "other",
    name: "Kh\u00e1c",
    description: "C\u00e1c s\u1ea3n ph\u1ea9m kh\u00e1c",
    productCount: 4,
    sortOrder: 6,
    status: "visible",
    updatedAt: "19/05/2024 16:35",
    updatedBy: "Nguy\u1ec5n Minh",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=220&q=80",
  },
  {
    id: "combo",
    name: "Combo",
    description: "Combo ti\u1ebft ki\u1ec7m",
    productCount: 7,
    sortOrder: 7,
    status: "hidden",
    updatedAt: "18/05/2024 11:20",
    updatedBy: "Nguy\u1ec5n Minh",
    image: "",
  },
]
