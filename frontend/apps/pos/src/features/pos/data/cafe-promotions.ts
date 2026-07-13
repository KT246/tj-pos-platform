export type PromotionStatus = "active" | "paused" | "ended" | "upcoming"
export type PromotionType = "percent" | "amount" | "bogo" | "free-shipping" | "combo"

export type CafePromotion = {
  id: string
  name: string
  code: string
  type: PromotionType
  typeLabel: string
  value: string
  valueNote: string
  period: string
  remaining: string
  status: PromotionStatus
  image: string
  appliesTo: string
  scope: string
  condition: string
  exclusion: string
  description: string
  createdAt: string
  createdBy: string
}

export type PromotionKpi = {
  id: string
  title: string
  value: string
  subtitle: string
  tone: "green" | "amber" | "red"
}

const promoImage =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=180&q=80"
const shippingImage =
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=180&q=80"
const comboImage =
  "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=180&q=80"

export const promotionKpis: PromotionKpi[] = [
  { id: "total", title: "ລວມໂປຣໂມຊັນ", value: "12", subtitle: "ໂປຣໂມຊັນ", tone: "green" },
  { id: "active", title: "ກຳລັງໃຊ້ງານ", value: "5", subtitle: "ໂປຣໂມຊັນ", tone: "green" },
  { id: "paused", title: "ຢຸດຊົ່ວຄາວ", value: "2", subtitle: "ໂປຣໂມຊັນ", tone: "amber" },
  { id: "ended", title: "ສິ້ນສຸດແລ້ວ", value: "5", subtitle: "ໂປຣໂມຊັນ", tone: "red" },
]

export const promoTabs = ["ທັງໝົດ", "ກຳລັງໃຊ້ງານ", "ຢຸດຊົ່ວຄາວ", "ກຳລັງຈະເລີ່ມ", "ສິ້ນສຸດແລ້ວ"]

export const cafePromotions: CafePromotion[] = [
  {
    id: "promo-save20",
    name: "ຫຼຸດ 20% ເຄື່ອງດື່ມ",
    code: "SAVE20",
    type: "percent",
    typeLabel: "ຫຼຸດ %",
    value: "20%",
    valueNote: "ສູງສຸດ 50.000 ກີບ",
    period: "15/05/2024 - 31/05/2024",
    remaining: "ເຫຼືອ 11 ມື້",
    status: "active",
    image: promoImage,
    appliesTo: "ເຄື່ອງດື່ມທັງໝົດ",
    scope: "ທຸກສາຂາ",
    condition: "ບິນຕັ້ງແຕ່ 50.000 ກີບ",
    exclusion: "ຢາສູບ, ບັດເຕີມເງິນໂທລະສັບ",
    description: "ຫຼຸດ 20% ສຳລັບເຄື່ອງດື່ມທັງໝົດ.",
    createdAt: "10/05/2024 09:15",
    createdBy: "?????",
  },
  {
    id: "promo-coffee30",
    name: "ຫຼຸດ 30.000 ກີບ ບິນຕັ້ງແຕ່ 100K",
    code: "COFFEE30",
    type: "amount",
    typeLabel: "ຫຼຸດເປັນເງິນ",
    value: "30.000 ກີບ",
    valueNote: "ບິນຕັ້ງແຕ່ 100.000 ກີບ",
    period: "10/05/2024 - 25/05/2024",
    remaining: "ເຫຼືອ 5 ມື້",
    status: "active",
    image: promoImage,
    appliesTo: "ເມນູທັງໝົດ",
    scope: "ສາຂາ 1",
    condition: "ບິນຂັ້ນຕ່ຳ 100.000 ກີບ",
    exclusion: "ຄອມໂບທີ່ກຳລັງຫຼຸດລາຄາ",
    description: "ຫຼຸດທັນທີ 30.000 ກີບ ສຳລັບບິນຕັ້ງແຕ່ 100.000 ກີບ.",
    createdAt: "09/05/2024 10:00",
    createdBy: "?????",
  },
  {
    id: "promo-buy2get1",
    name: "ຊື້ 2 ແຖມ 1 ກາເຟ",
    code: "BUY2GET1",
    type: "bogo",
    typeLabel: "ຊື້ X ແຖມ Y",
    value: "ຊື້ 2 ແຖມ 1",
    valueNote: "ກາເຟດຳ",
    period: "01/05/2024 - 31/05/2024",
    remaining: "ເຫຼືອ 11 ມື້",
    status: "active",
    image: promoImage,
    appliesTo: "ກາເຟ",
    scope: "ທຸກສາຂາ",
    condition: "ຊື້ 2 ແກ້ວປະເພດດຽວກັນ",
    exclusion: "ບໍ່ໃຊ້ຮ່ວມກັບວອຊເຊີອື່ນ",
    description: "ຊື້ກາເຟ 2 ແກ້ວ ແຖມກາເຟດຳ 1 ແກ້ວ.",
    createdAt: "01/05/2024 08:00",
    createdBy: "?????",
  },
  {
    id: "promo-freeship50",
    name: "ສົ່ງຟຣີ ບິນຕັ້ງແຕ່ 50K",
    code: "FREESHIP50",
    type: "free-shipping",
    typeLabel: "ສົ່ງຟຣີ",
    value: "ຟຣີ",
    valueNote: "ບິນຕັ້ງແຕ່ 50.000 ກີບ",
    period: "01/05/2024 - 31/05/2024",
    remaining: "ເຫຼືອ 11 ມື້",
    status: "active",
    image: shippingImage,
    appliesTo: "ອໍເດີຈັດສົ່ງ",
    scope: "ລັດສະໝີ 5km",
    condition: "ອໍເດີຈັດສົ່ງຕັ້ງແຕ່ 50.000 ກີບ",
    exclusion: "ພື້ນທີ່ນອກລັດສະໝີທີ່ຮອງຮັບ",
    description: "ສົ່ງຟຣີສຳລັບບິນຕັ້ງແຕ່ 50.000 ກີບ.",
    createdAt: "01/05/2024 08:30",
    createdBy: "?????",
  },
  {
    id: "promo-happyhour",
    name: "Happy Hour 14h - 16h",
    code: "HH1416",
    type: "percent",
    typeLabel: "ຫຼຸດ %",
    value: "15%",
    valueNote: "ສູງສຸດ 30.000 ກີບ",
    period: "01/05/2024 - 31/05/2024",
    remaining: "ເຫຼືອ 11 ມື້",
    status: "paused",
    image: promoImage,
    appliesTo: "ເຄື່ອງດື່ມ",
    scope: "ສາຂາ 1",
    condition: "ໃຊ້ໄດ້ສະເພາະ 14h - 16h",
    exclusion: "ບໍ່ໃຊ້ໃນມື້ພັກ",
    description: "ໂປຣໂມຊັນຊ່ວງເວລາລູກຄ້ານ້ອຍສຳລັບເຄື່ອງດື່ມ.",
    createdAt: "01/05/2024 09:00",
    createdBy: "?????",
  },
  {
    id: "promo-monday20",
    name: "ສ່ວນຫຼຸດວັນຈັນປະຈຳອາທິດ",
    code: "MONDAY20",
    type: "percent",
    typeLabel: "ຫຼຸດ %",
    value: "20%",
    valueNote: "ສູງສຸດ 40.000 ກີບ",
    period: "01/05/2024 - 30/06/2024",
    remaining: "ເຫຼືອ 41 ມື້",
    status: "paused",
    image: promoImage,
    appliesTo: "ເມນູທັງໝົດ",
    scope: "ທຸກສາຂາ",
    condition: "ໃຊ້ໃນວັນຈັນ",
    exclusion: "ບໍ່ໃຊ້ຮ່ວມກັບໂປຣໂມຊັນອື່ນ",
    description: "ສ່ວນຫຼຸດປະຈຳທຸກວັນຈັນ.",
    createdAt: "30/04/2024 16:00",
    createdBy: "?????",
  },
  {
    id: "promo-new20",
    name: "ສ່ວນຫຼຸດລູກຄ້າໃໝ່",
    code: "NEW20",
    type: "amount",
    typeLabel: "ຫຼຸດເປັນເງິນ",
    value: "20.000 ກີບ",
    valueNote: "ບິນຕັ້ງແຕ່ 80.000 ກີບ",
    period: "01/04/2024 - 30/04/2024",
    remaining: "ສິ້ນສຸດແລ້ວ",
    status: "ended",
    image: promoImage,
    appliesTo: "ລູກຄ້າໃໝ່",
    scope: "ທຸກສາຂາ",
    condition: "ລູກຄ້າທີ່ສ້າງໃໝ່",
    exclusion: "ບໍ່ໃຊ້ກັບລູກຄ້າເກົ່າ",
    description: "ສ່ວນຫຼຸດສຳລັບລູກຄ້າໃໝ່.",
    createdAt: "28/03/2024 13:30",
    createdBy: "?????",
  },
  {
    id: "promo-cb49k",
    name: "ຄອມໂບເຊົ້າ 49K",
    code: "CB49K",
    type: "combo",
    typeLabel: "Combo",
    value: "49.000 ກີບ",
    valueNote: "ເຄື່ອງດື່ມ 1 + ເຂົ້າໜົມ 1",
    period: "01/04/2024 - 30/04/2024",
    remaining: "ສິ້ນສຸດແລ້ວ",
    status: "ended",
    image: comboImage,
    appliesTo: "ຄອມໂບເຊົ້າ",
    scope: "ສາຂາ 1",
    condition: "ໃຊ້ກ່ອນ 10h",
    exclusion: "ບໍ່ໃຊ້ໃນທ້າຍອາທິດ",
    description: "ຄອມໂບເຊົ້າລາຄາດີ.",
    createdAt: "25/03/2024 09:00",
    createdBy: "?????",
  },
]
