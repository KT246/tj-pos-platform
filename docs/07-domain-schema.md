# TJ POS — Domain Schema Specification

**เวอร์ชัน:** Domain Schema Final Draft  
**ภาษา:** ไทย  
**ขอบเขต:** เอกสารนี้สรุป Domain Schema ของ TJ POS เพื่อให้ Frontend และ Backend เข้าใจข้อมูลร่วมกัน  
**หมายเหตุ:** เอกสารนี้ยังไม่ใช่ Database Migration, API Request/Response หรือ SQL Schema ขั้นสุดท้าย

---

## 1. หลักการออกแบบ Schema

TJ POS ใช้แนวคิด Managed SaaS POS สำหรับใช้งานในประเทศ โดยช่วง MVP จะใช้ฐานข้อมูลกลางชุดเดียว และแยกข้อมูลของแต่ละร้านด้วย `businessId`

หลักการสำคัญ:

```text
1. ข้อมูลของแต่ละร้านต้องมี businessId
2. ข้อมูลที่เกี่ยวกับสาขาต้องมี branchId
3. Field ที่บาง POS Type ไม่ใช้ สามารถเป็น null ได้
4. ข้อมูลสำคัญควรมี status, createdAt, updatedAt
5. ข้อมูลที่ไม่ควรลบถาวรควรใช้ deletedAt หรือ soft delete
6. Order, Payment, Stock ต้องเก็บ snapshot เพื่อให้ข้อมูลเก่าไม่เปลี่ยนตามข้อมูลใหม่
```

ตัวอย่าง:

```text
Retail order → tableId = null
Restaurant order → tableId มีค่า
Beauty order → appointmentId อาจมีค่า
Hospitality order → roomId อาจมีค่า
```

---

## 2. Common Schema

### 2.1 BaseEntity

ใช้กับ entity หลักทั่วไป

```ts
type BaseEntity = {
  id: string
  status: EntityStatus
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}
```

### 2.2 TenantEntity

ใช้กับข้อมูลที่อยู่ภายใต้ business

```ts
type TenantEntity = BaseEntity & {
  businessId: string
  branchId?: string | null
}
```

### 2.3 AuditFields

ใช้กับข้อมูลที่ต้องรู้ว่าใครสร้างหรือแก้ไข

```ts
type AuditFields = {
  createdBy?: string | null
  updatedBy?: string | null
}
```

### 2.4 Money

ช่วง MVP ใช้ LAK เป็นค่าเริ่มต้น

```ts
type Money = {
  amount: number
  currency: "LAK"
}
```

---

## 3. Enums / Status

### 3.1 POS Type

```ts
type PosType =
  | "retail"
  | "cafe"
  | "restaurant"
  | "beauty"
  | "hospitality"
```

### 3.2 Entity Status

```ts
type EntityStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "archived"
```

### 3.3 User Role

```ts
type UserRole =
  | "platform_admin"
  | "owner"
  | "manager"
  | "cashier"
  | "waiter"
  | "kitchen"
  | "bar"
  | "receptionist"
```

### 3.4 Item Type

```ts
type ItemType =
  | "product"
  | "menu_item"
  | "service"
  | "room"
  | "extra_service"
  | "ingredient"
```

### 3.5 Order Status

```ts
type OrderStatus =
  | "draft"
  | "held"
  | "open"
  | "paid"
  | "cancelled"
  | "refunded"
```

### 3.6 Payment Status

```ts
type PaymentStatus =
  | "unpaid"
  | "partial"
  | "paid"
  | "debt"
  | "refunded"
```

### 3.7 Customer Type

```ts
type CustomerType =
  | "retail_customer"
  | "wholesale_customer"
  | "reseller"
  | "vip"
```

### 3.8 Payment Method Type

```ts
type PaymentMethodType =
  | "cash"
  | "bank_transfer"
  | "qr"
  | "card"
  | "other"
```

### 3.9 Stock Movement Type

```ts
type StockMovementType =
  | "in"
  | "out"
  | "adjustment"
  | "transfer"
  | "refund"
```

### 3.10 Support Ticket Type

```ts
type SupportTicketType =
  | "bug"
  | "feedback"
  | "feature_request"
  | "support"
```

---

## 4. Business Schema

Business หมายถึง ร้าน, แบรนด์, หรือธุรกิจของลูกค้า

```ts
type Business = BaseEntity & {
  name: string
  slug: string
  posType: PosType
  category?: string | null

  phone?: string | null
  email?: string | null
  address?: string | null

  country: "LA"
  currency: "LAK"

  taxEnabled: boolean
  serviceChargeEnabled: boolean

  ownerUserId: string
}
```

### Field บังคับ

```text
name
slug
posType
country
currency
status
ownerUserId
```

### Field ไม่บังคับ

```text
category
phone
email
address
taxEnabled
serviceChargeEnabled
```

---

## 5. Branch Schema

Branch หมายถึง สาขาหรือจุดขายของ business

```ts
type Branch = BaseEntity & {
  businessId: string

  name: string
  code: string

  address?: string | null
  phone?: string | null
  managerUserId?: string | null

  openingHours?: string | null

  defaultPaymentMethodId?: string | null
  defaultReceiptTemplateId?: string | null
}
```

### Field บังคับ

```text
businessId
name
code
status
```

### Field ไม่บังคับ

```text
address
phone
managerUserId
openingHours
defaultPaymentMethodId
defaultReceiptTemplateId
```

---

## 6. User Schema

User คือบัญชีผู้ใช้งานสำหรับ login

```ts
type User = BaseEntity & {
  fullName: string
  email?: string | null
  phone?: string | null

  passwordHash: string
  avatarUrl?: string | null

  lastLoginAt?: string | null
}
```

### Field บังคับ

```text
fullName
passwordHash
email หรือ phone อย่างน้อย 1 ค่า
status
```

---

## 7. Business Member / Staff Schema

BusinessMember ใช้เชื่อม user กับ business และกำหนด role/permission

```ts
type BusinessMember = BaseEntity & {
  businessId: string
  userId: string

  branchIds: string[]
  role: UserRole

  canLogin: boolean
  pinCode?: string | null

  permissions: string[]

  commissionEnabled?: boolean
}
```

### Field บังคับ

```text
businessId
userId
role
canLogin
permissions
status
```

### Field ไม่บังคับ

```text
branchIds
pinCode
commissionEnabled
```

---

## 8. Category Schema

```ts
type Category = TenantEntity & {
  name: string
  parentCategoryId?: string | null
  posType?: PosType | null

  imageUrl?: string | null
  sortOrder?: number | null
}
```

### Field บังคับ

```text
businessId
name
status
```

### Field ไม่บังคับ

```text
branchId
parentCategoryId
posType
imageUrl
sortOrder
```

---

## 9. Item Schema

Item เป็น schema กลางสำหรับ product, menu item, service, room และ extra service

```ts
type Item = TenantEntity & {
  name: string
  type: ItemType
  categoryId: string

  sellingPrice: number
  costPrice?: number | null
  wholesalePrice?: number | null
  resellerPrice?: number | null
  minWholesaleQuantity?: number | null
  priceListId?: string | null

  imageUrl?: string | null
  description?: string | null

  sku?: string | null
  barcode?: string | null
  unit: string

  taxId?: string | null

  availableForSale: boolean
  sortOrder?: number | null

  retail?: RetailItemFields | null
  food?: FoodItemFields | null
  beauty?: BeautyServiceFields | null
  hospitality?: HospitalityRoomFields | null
}
```

### Field บังคับ

```text
businessId
name
type
categoryId
sellingPrice
unit
availableForSale
status
```

### Field ไม่บังคับ

```text
branchId
costPrice
wholesalePrice
resellerPrice
minWholesaleQuantity
priceListId
imageUrl
description
sku
barcode
taxId
sortOrder
retail
food
beauty
hospitality
```

---

## 10. Price List Schema

ใช้กับราคาพิเศษสำหรับ wholesale customer, reseller หรือ customer group โดยไม่สร้าง module แยก

```ts
type PriceList = TenantEntity & {
  name: string
  customerType?: CustomerType | null
  description?: string | null
}

type PriceListItem = {
  id: string
  businessId: string
  priceListId: string
  itemId: string
  price: number
  minQuantity?: number | null
  status: EntityStatus
}
```

---

## 11. Retail Item Fields

ใช้กับ Retail POS เช่น mini mart, shop เสื้อผ้า, เครื่องสำอาง, decor, ของฝาก

```ts
type RetailItemFields = {
  stockTracking: boolean

  supplierId?: string | null
  brand?: string | null

  size?: string | null
  color?: string | null

  expiryDate?: string | null
  batchNo?: string | null
  warrantyPeriod?: string | null

  minimumStock?: number | null
}
```

หมายเหตุ:

```text
sellingPrice คือ default retail price
wholesalePrice, resellerPrice และ minWholesaleQuantity ใช้กับขายส่ง/ลูกค้าส่งโดยไม่สร้าง item ซ้ำ
ถ้าร้านใช้หลาย price list ให้ใช้ priceListId หรือ price list table เพิ่มเติมตาม phase backend
```

---

## 12. Food Item Fields

ใช้กับ Cafe POS และ Restaurant POS

```ts
type FoodItemFields = {
  kitchenStation?: "kitchen" | "bar" | null

  sizeOptions?: string[]
  toppings?: string[]

  sugarLevelOptions?: string[]
  iceLevelOptions?: string[]

  hotColdOption?: boolean

  preparationNote?: string | null

  ingredientTracking?: boolean
  printLabel?: boolean

  dineInAvailable?: boolean
  takeawayAvailable?: boolean
}
```

ตัวอย่าง:

```text
กาแฟดำเย็น
Size: M
Sugar: 0%
Ice: Less ice
Note: ไม่ใส่น้ำตาล, น้ำแข็งน้อย
```

---

## 13. Beauty Service Fields

ใช้กับ Beauty POS เช่น spa, salon, nail, massage, barber

```ts
type BeautyServiceFields = {
  durationMinutes: number

  assignedStaffIds?: string[]

  commissionType?: "percent" | "fixed" | null
  commissionValue?: number | null

  packageSupported?: boolean
  bookingRequired?: boolean

  productConsumption?: {
    itemId: string
    quantity: number
    unit: string
  }[]
}
```

---

## 14. Hospitality Room Fields

ใช้กับ Hospitality POS เช่น guesthouse, homestay, hotel เล็ก, hostel, villa

```ts
type HospitalityRoomFields = {
  roomNumber: string
  roomType: string

  capacity?: number | null
  bedType?: string | null

  pricePerNight: number
  pricePerHour?: number | null

  roomStatus:
    | "available"
    | "occupied"
    | "cleaning"
    | "maintenance"

  depositRequired?: boolean
}
```

---

## 15. Supplier Schema

```ts
type Supplier = TenantEntity & {
  name: string

  phone?: string | null
  email?: string | null
  address?: string | null
  contactPerson?: string | null

  taxCode?: string | null
  paymentTerms?: string | null
  debtBalance?: number | null
}
```

### Field บังคับ

```text
businessId
name
status
```

---

## 16. Inventory Balance Schema

```ts
type InventoryBalance = {
  id: string
  businessId: string
  branchId: string
  itemId: string

  currentStock: number
  unit: string

  minimumStock?: number | null
  maximumStock?: number | null
  averageCost?: number | null

  lastStockCountDate?: string | null

  updatedAt: string
}
```

### Field บังคับ

```text
businessId
branchId
itemId
currentStock
unit
```

---

## 17. Stock Movement Schema

```ts
type StockMovement = {
  id: string
  businessId: string
  branchId: string
  itemId: string

  movementType: StockMovementType

  quantity: number
  unit: string

  referenceType:
    | "sale"
    | "purchase"
    | "adjustment"
    | "transfer"
    | "refund"

  referenceId?: string | null

  note?: string | null

  createdBy: string
  createdAt: string
}
```

### Field บังคับ

```text
businessId
branchId
itemId
movementType
quantity
unit
referenceType
createdBy
createdAt
```

---

## 18. Order Schema

```ts
type Order = {
  id: string

  businessId: string
  branchId: string

  orderNumber: string
  posType: PosType
  orderType:
    | "retail"
    | "wholesale"
    | "purchase"
    | "return"
    | "dine_in"
    | "takeaway"
    | "service"
    | "room"

  customerId?: string | null
  priceListId?: string | null

  staffId: string
  cashierId?: string | null

  tableId?: string | null
  roomId?: string | null
  appointmentId?: string | null

  status: OrderStatus
  paymentStatus: PaymentStatus
  debtStatus?: "none" | "unpaid" | "partial" | "debt" | "settled" | null
  deliveryStatus?: "not_required" | "pending" | "delivered" | "cancelled" | null

  subtotal: number
  discountTotal: number
  taxTotal?: number | null
  serviceCharge?: number | null
  grandTotal: number

  note?: string | null

  source?: "pos" | "staff_order" | "platform" | null

  items: OrderItem[]

  createdAt: string
  paidAt?: string | null
}
```

### Field บังคับ

```text
businessId
branchId
orderNumber
posType
orderType
staffId
status
paymentStatus
subtotal
discountTotal
grandTotal
items
createdAt
```

### Field ไม่บังคับ / Nullable

```text
customerId
priceListId
cashierId
tableId
roomId
appointmentId
taxTotal
serviceCharge
debtStatus
deliveryStatus
note
source
paidAt
```

หมายเหตุ Wholesale:

```text
Wholesale order ใช้ Order schema เดิม
ไม่สร้าง order schema หรือ module แยก
orderType=wholesale ต้องผูก customer/reseller, priceListId, paymentStatus/debtStatus และ deliveryStatus ถ้าต้องจัดส่ง
```

---

## 19. Order Item Schema

```ts
type OrderItem = {
  id: string
  orderId: string
  itemId: string

  itemNameSnapshot: string
  quantity: number

  unitPriceSnapshot: number
  costPriceSnapshot?: number | null

  discountAmount?: number | null
  totalAmount: number

  optionsSnapshot?: Record<string, unknown> | null

  itemNote?: string | null

  kitchenStatus?:
    | "pending"
    | "preparing"
    | "done"
    | "cancelled"
    | null

  servedStatus?: "not_served" | "served" | null
}
```

### Snapshot สำคัญมาก

ต้องบันทึก:

```text
itemNameSnapshot
unitPriceSnapshot
```

เหตุผล: ถ้าอนาคตเปลี่ยนชื่อ item หรือราคา order เก่าต้องยังแสดงข้อมูล ณ เวลาที่ขาย

---

## 20. Payment Method Schema

```ts
type PaymentMethod = TenantEntity & {
  branchId?: string | null

  name: string
  type: PaymentMethodType

  bankName?: string | null
  accountName?: string | null
  accountNumber?: string | null

  qrImageUrl?: string | null

  paymentNote?: string | null

  isDefault: boolean
}
```

### Field บังคับ

```text
businessId
name
type
isDefault
status
```

### Field ไม่บังคับ

```text
branchId
bankName
accountName
accountNumber
qrImageUrl
paymentNote
```

ตัวอย่างที่ใช้ในลาว:

```text
BCEL
JDB
LDB
ST Bank
Cash
Other
```

---

## 21. Payment Transaction Schema

```ts
type PaymentTransaction = {
  id: string

  businessId: string
  branchId: string

  orderId: string
  paymentMethodId: string

  amount: number
  currency: "LAK"

  bankNameSnapshot?: string | null
  referenceCode?: string | null

  confirmedBy: string

  paidAt: string

  status:
    | "pending"
    | "confirmed"
    | "failed"
    | "refunded"

  note?: string | null
}
```

---

## 22. Customer / Member Profile Schema

```ts
type Customer = TenantEntity & {
  name?: string | null
  customerType: CustomerType

  phone?: string | null
  email?: string | null

  birthday?: string | null
  gender?: "male" | "female" | "other" | null
  address?: string | null

  memberCode?: string | null
  priceListId?: string | null
  debtBalance?: number | null
  creditLimit?: number | null
  paymentTerm?: string | null

  pointsBalance?: number | null
  memberTier?: "normal" | "silver" | "gold" | "vip" | null

  totalSpending: number
  totalOrders: number

  lastVisit?: string | null

  notes?: string | null
}
```

### หลักการ

```text
ขายปกติอาจไม่ต้องมี customer profile
ใช้ customer profile เมื่อเปิด Loyalty / Membership / Wholesale / Debt
```

ถ้าเปิด Loyalty:

```text
phone ควรเป็น field สำคัญ
```

ถ้าเปิด Wholesale / Debt:

```text
customerType, priceListId, debtBalance, creditLimit และ paymentTerm เป็น field สำคัญ
customerType รองรับ retail_customer, wholesale_customer, reseller และ vip
```

---

## 23. Loyalty Rule Schema

```ts
type LoyaltyRule = TenantEntity & {
  name: string

  earningRule: {
    spendAmount: number
    points: number
  }

  redeemRule: {
    points: number
    discountAmount: number
  }

  expiryRule?: {
    expireAfterDays: number
  } | null

  tierRule?: {
    tier: "silver" | "gold" | "vip"
    minSpending: number
  }[] | null

  applicableItemIds?: string[]
  startDate?: string | null
  endDate?: string | null
}
```

---

## 24. Promotion Schema

```ts
type Promotion = TenantEntity & {
  name: string

  type:
    | "discount"
    | "coupon"
    | "combo"
    | "buy_x_get_y"
    | "happy_hour"

  discountType?: "percent" | "fixed" | null
  discountValue?: number | null

  applyScope:
    | "item"
    | "category"
    | "order"
    | "member"

  conditions?: Record<string, unknown> | null

  startDate: string
  endDate: string

  applicableBranchIds?: string[]
  applicableCustomerTiers?: string[]

  usageLimit?: number | null
}
```

---

## 25. Area Schema

ใช้กับ Cafe ที่มีโต๊ะ และ Restaurant

```ts
type Area = TenantEntity & {
  branchId: string
  name: string
  sortOrder?: number | null
}
```

---

## 26. Table Schema

```ts
type Table = TenantEntity & {
  branchId: string
  areaId: string

  name: string
  capacity?: number | null

  tableStatus:
    | "available"
    | "occupied"
    | "reserved"
    | "cleaning"

  qrCode?: string | null
  note?: string | null
}
```

---

## 27. Kitchen Ticket Schema

```ts
type KitchenTicket = {
  id: string

  businessId: string
  branchId: string

  ticketNumber: string
  orderId: string

  tableId?: string | null

  station: "kitchen" | "bar"

  items: {
    orderItemId: string
    itemName: string
    quantity: number
    note?: string | null
  }[]

  status:
    | "pending"
    | "preparing"
    | "done"
    | "cancelled"

  createdAt: string
  completedAt?: string | null
}
```

---

## 28. Appointment Schema

ใช้กับ Beauty POS

```ts
type Appointment = TenantEntity & {
  branchId: string

  customerId: string
  serviceId: string

  staffId?: string | null
  roomOrChair?: string | null

  startTime: string
  endTime: string

  status:
    | "booked"
    | "arrived"
    | "done"
    | "cancelled"
    | "no_show"

  deposit?: number | null
  note?: string | null
}
```

---

## 29. Package / Treatment Course Schema

```ts
type TreatmentPackage = TenantEntity & {
  customerId: string
  serviceId: string

  name: string

  totalSessions: number
  usedSessions: number
  remainingSessions: number

  expiryDate?: string | null

  status:
    | "active"
    | "expired"
    | "completed"
}
```

---

## 30. Room Schema

ใช้กับ Hospitality POS

```ts
type Room = TenantEntity & {
  branchId: string

  name: string
  roomType: string

  capacity: number
  basePrice: number

  roomStatus:
    | "available"
    | "occupied"
    | "cleaning"
    | "maintenance"

  floor?: string | null
  amenities?: string[]
  note?: string | null
}
```

---

## 31. Booking Schema

```ts
type Booking = TenantEntity & {
  branchId: string

  guestId: string
  roomId: string

  checkInDate: string
  checkOutDate: string

  numberOfGuests?: number | null

  deposit?: number | null

  bookingSource?:
    | "walk_in"
    | "phone"
    | "agency"
    | "other"
    | null

  status:
    | "booked"
    | "checked_in"
    | "checked_out"
    | "cancelled"

  extraServices?: {
    itemId: string
    quantity: number
    price: number
  }[]

  note?: string | null
}
```

---

## 32. Receipt Template Schema

```ts
type ReceiptTemplate = TenantEntity & {
  name: string

  paperSize: "58mm" | "80mm" | "a4"

  colorMode: "black_white" | "color"

  showLogo: boolean
  showBranchAddress: boolean
  showTable: boolean
  showItemNote: boolean
  showBankInfo: boolean
  showQr: boolean

  footerText?: string | null

  columnLabels?: {
    item?: string
    quantity?: string
    price?: string
    total?: string
  }

  enabledBlocks?: string[]
}
```

ค่าเริ่มต้น:

```text
paperSize = 80mm
colorMode = black_white
```

---

## 33. Branding Schema

```ts
type Branding = {
  businessId: string

  logoUrl?: string | null
  primaryColor?: string | null
  secondaryColor?: string | null
  bannerUrl?: string | null

  menuStyle?: string | null
  customerDisplayStyle?: string | null

  receiptFooter?: string | null

  updatedAt: string
}
```

---

## 34. Device Schema

```ts
type Device = TenantEntity & {
  branchId: string

  name: string

  type:
    | "pos"
    | "staff_order"
    | "customer_display"
    | "kitchen_display"
    | "bar_display"
    | "printer"

  deviceCode?: string | null

  lastSeenAt?: string | null
  isOnline: boolean
}
```

---

## 35. Module Setting Schema

```ts
type ModuleSetting = {
  businessId: string

  moduleKey:
    | "customer_display"
    | "staff_order"
    | "qr_menu"
    | "kitchen_display"
    | "loyalty"
    | "advanced_inventory"
    | "smart_menu"
    | "a4_invoice"
    | "booking"
    | "commission"

  enabled: boolean

  enabledAt?: string | null
  enabledBy?: string | null
}
```

---

## 36. Support Ticket Schema

```ts
type SupportTicket = TenantEntity & {
  branchId?: string | null

  createdBy: string

  type: SupportTicketType

  title: string
  description: string

  attachmentUrl?: string | null

  priority?: "low" | "medium" | "high"

  ticketStatus:
    | "open"
    | "in_review"
    | "in_progress"
    | "resolved"
    | "rejected"

  assignedTo?: string | null
}
```

---

## 37. Refund Schema

```ts
type Refund = {
  id: string

  businessId: string
  branchId: string

  orderId: string

  refundType: "full" | "partial"
  refundAmount: number

  returnedItems?: {
    orderItemId: string
    quantity: number
  }[]

  restock?: boolean

  reason: string

  approvedBy?: string | null
  createdBy: string

  createdAt: string
}
```

---

## 38. Cash Session / Shift Schema

```ts
type CashSession = {
  id: string

  businessId: string
  branchId: string
  deviceId: string
  staffId: string

  openingCash?: number | null
  expectedCash?: number | null
  actualCash?: number | null
  difference?: number | null

  status:
    | "open"
    | "closed"

  openedAt: string
  closedAt?: string | null

  note?: string | null
}
```

---

## 39. Import Job Schema

```ts
type ImportJob = {
  id: string

  businessId: string
  branchId?: string | null

  type:
    | "items"
    | "customers"
    | "staff"
    | "opening_stock"
    | "suppliers"
    | "tables"
    | "rooms"

  fileUrl: string

  status:
    | "pending"
    | "processing"
    | "completed"
    | "failed"

  totalRows?: number | null
  successRows?: number | null
  failedRows?: number | null

  errorFileUrl?: string | null

  createdBy: string
  createdAt: string
}
```

---

## 40. Export Job Schema

```ts
type ExportJob = {
  id: string

  businessId: string
  branchId?: string | null

  type:
    | "items"
    | "orders"
    | "payments"
    | "inventory"
    | "customers"
    | "reports"

  format: "xlsx" | "pdf"

  fileUrl?: string | null

  status:
    | "pending"
    | "processing"
    | "completed"
    | "failed"

  createdBy: string
  createdAt: string
}
```

---

## 41. Audit Log Schema

```ts
type AuditLog = {
  id: string

  businessId?: string | null
  branchId?: string | null

  userId: string

  action: string

  entityType: string
  entityId?: string | null

  oldData?: Record<string, unknown> | null
  newData?: Record<string, unknown> | null

  ipAddress?: string | null
  deviceId?: string | null

  createdAt: string
}
```

ใช้กับ:

```text
cancel order
refund
stock adjustment
price update
staff lock
module update
business lock
plan update
```

---

## 42. Plan / Subscription Schema

### 41.1 Plan

```ts
type Plan = BaseEntity & {
  name: "starter" | "pro" | "business" | "enterprise"

  maxBranches?: number | null
  maxPosDevices?: number | null
  maxStaff?: number | null
  maxItems?: number | null
  maxOrdersPerMonth?: number | null
  maxMemberProfiles?: number | null

  supportLevel: "standard" | "priority" | "custom"

  allowAddOns: boolean
}
```

### 41.2 Subscription

```ts
type Subscription = {
  id: string

  businessId: string
  planId: string

  billingCycle:
    | "monthly"
    | "yearly"
    | "custom"

  status:
    | "active"
    | "expired"
    | "suspended"
    | "cancelled"

  startedAt: string
  expiresAt: string

  setupFeeWaived?: boolean
  customNote?: string | null
}
```

---

## 43. Schema ที่ควรใช้ก่อนใน Frontend MVP

Frontend MVP ควรเริ่มจาก schema เหล่านี้ก่อน:

```text
Business
Branch
User
BusinessMember
Item
Category
Order
OrderItem
PaymentMethod
PaymentTransaction
ReceiptTemplate
Branding
Device
SupportTicket
Plan
Subscription
```

Schema ที่อาจทำ phase ถัดไป:

```text
Appointment
TreatmentPackage
Room
Booking
KitchenTicket
ImportJob
ExportJob
AuditLog แบบละเอียด
Smart Menu
```

---

## 44. ข้อสรุปสุดท้าย

แนวทาง schema ของ TJ POS คือ:

```text
Domain Schema ก่อน
Database Schema ทีหลัง
API Request/Response ทีหลัง
```

Entity สำคัญควรรองรับ:

```text
businessId
branchId ถ้าเกี่ยวกับสาขา
status
createdAt
updatedAt
deletedAt ถ้าต้อง soft delete
createdBy / updatedBy ถ้าต้อง audit
```

Field ที่ไม่ใช้ใน POS Type นั้นให้เป็น:

```text
null
```

ตัวอย่าง:

```text
Retail order → tableId = null
Restaurant order → tableId มีค่า
Beauty order → appointmentId อาจมีค่า
Hospitality order → roomId อาจมีค่า
```

Wholesale support:

```text
ไม่สร้าง Wholesale schema แยก
ใช้ Customer, Item, Order, PaymentTransaction, Report และ Import/Export schema เดิม
เพิ่ม field optional สำหรับ customerType, priceList, wholesale/reseller price, debt และ payment term
```

เอกสารนี้คือ Domain Schema หลักเพื่อให้ Frontend และ Backend ใช้ภาษาเดียวกัน ก่อนจะไปออกแบบ API และ Database จริง
