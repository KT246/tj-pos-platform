# TJ POS — API Specification

**เวอร์ชัน:** API Specification Final Draft  
**ภาษา:** ไทย  
**ขอบเขต:** เอกสารนี้สรุป API ระดับระบบของ TJ POS ตามที่ตกลงกันล่าสุด  
**หมายเหตุ:** เอกสารนี้ยังไม่ลงรายละเอียด request body ทุก field และยังไม่ใช่ implementation code

---

## 1. หลักการออกแบบ API

API ของ TJ POS ต้องรองรับทั้ง:

```text
frontend/apps/web
frontend/apps/terminal
Platform Admin
Business Admin
POS ขายหน้าร้าน
Staff Order
Customer Display
Public Menu
```

หลักการสำคัญ:

```text
1. API แบ่งตาม module ธุรกิจ
2. Frontend ใช้ businessSlug เพื่อ URL สวย
3. Backend ควรใช้ businessId เพื่อ query และตรวจสิทธิ์
4. API ทุกตัวที่เกี่ยวกับ business ต้องตรวจ user, role, permission, business access, branch access
5. List ขนาดใหญ่ต้องมี pagination
6. List สำหรับ select/options ไม่ต้องมี pagination
7. Action สำคัญต้องส่ง response ชัดเจน
8. Error format ต้องเหมือนกันทั้งระบบ
```

Base API:

```text
/api
```

ตัวอย่าง:

```text
Frontend route:
/b/tj-cafe/orders

API:
GET /api/businesses/:businessId/orders
```

---

## 2. สิ่งที่ API ต้องตรวจสอบ

ทุก API ที่เกี่ยวกับ business ต้องตรวจ:

```text
User login แล้วหรือยัง
User เป็นสมาชิกของ business หรือไม่
Role ของ user คืออะไร
Permission เพียงพอหรือไม่
Branch ที่เรียกมีสิทธิ์เข้าถึงหรือไม่
Module เปิดอยู่หรือไม่
Plan/Package อนุญาตให้ใช้งานหรือไม่
Business ถูก suspend หรือไม่
```

Frontend สามารถซ่อนเมนูตาม role ได้ แต่ backend ต้องตรวจสิทธิ์เองเสมอ

---

# 3. API Response Convention

API ของ TJ POS ไม่ควรใช้ response แบบเดียวกันทั้งหมด เพราะแต่ละ API มีลักษณะต่างกัน

ประเภท response ที่ใช้:

```text
1. Single Object
2. Paginated List
3. Options List
4. Action Result
5. Context Object
6. Error Response
```

---

## 3.1 Single Object Response

ใช้กับ API ที่คืน object เดียว เช่น detail, create, update

```json
{
  "success": true,
  "data": {}
}
```

ใช้กับ:

```text
item detail
order detail
customer detail
staff detail
branch detail
payment method detail
create/update result
```

---

## 3.2 Paginated List Response

ใช้กับ list ขนาดใหญ่

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

ใช้กับ:

```text
orders
items
customers
payments
refunds
stock movements
suppliers
staff list
support tickets
audit logs
reports detail
import/export jobs
devices
price lists
```

---

## 3.3 Options List Response

ใช้กับ select, combobox, dropdown

```json
{
  "success": true,
  "data": [
    {
      "label": "Main Branch",
      "value": "branch_001"
    }
  ]
}
```

ใช้กับ:

```text
branch options
staff options
category options
supplier options
payment method options
room options
table options
```

---

## 3.4 Action Result Response

ใช้กับ action เช่น checkout, cancel, refund, hold, enable module

```json
{
  "success": true,
  "message": "Action completed",
  "data": {}
}
```

ใช้กับ:

```text
checkout
confirm paid
cancel order
refund
hold order
resume order
close shift
enable/disable module
```

---

## 3.5 Context Object Response

ใช้กับ API ที่คืนข้อมูล context รวม เช่น me, business context, POS bootstrap

```json
{
  "success": true,
  "data": {}
}
```

ไม่ใช้ pagination

---

## 3.6 Error Response

ใช้ error format แบบเดียวกันทั้งระบบ

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": null
  }
}
```

Error codes ที่ควรมี:

```text
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
BUSINESS_SUSPENDED
PLAN_LIMIT_EXCEEDED
MODULE_NOT_ENABLED
INSUFFICIENT_STOCK
ORDER_ALREADY_PAID
PAYMENT_REQUIRED
DUPLICATE_DATA
INTERNAL_ERROR
```

---

# 4. Pagination Query Standard

API list ขนาดใหญ่ควรรองรับ query มาตรฐาน:

```text
page=1
limit=20
search=
sortBy=createdAt
sortOrder=desc
status=
branchId=
from=
to=
```

Filter เฉพาะงาน:

```text
categoryId=
paymentStatus=
orderStatus=
customerId=
staffId=
itemId=
methodType=
```

ตัวอย่าง:

```text
GET /api/businesses/:businessId/orders?page=1&limit=20&branchId=branch_001&from=2026-06-01&to=2026-06-30&paymentStatus=paid
```

---

# 5. กฎว่า API ไหนต้อง Pagination / ไม่ต้อง Pagination

## 5.1 ต้องมี Pagination

```text
orders
items
customers
payments
refunds
inventory
stock movements
purchase receipts
suppliers
staff
support tickets
audit logs
reports detail
import/export jobs
devices
```

## 5.2 ไม่ต้องมี Pagination

```text
auth/me
business context
POS bootstrap
branch options
payment methods active
roles
permissions
module settings
branding
receipt template
platform system settings
notification templates
master payment config
health
```

## 5.3 มีได้ทั้งสองแบบ

```text
branches
categories
staff
tables
rooms
payment methods
```

ถ้าใช้ใน admin table:

```text
ใช้ pagination
```

ถ้าใช้ใน select/options:

```text
ใช้ Options List
```

---

# 6. Auth API

## 6.1 Login

```text
POST /api/auth/login
```

ใช้สำหรับเข้าสู่ระบบ

Response type:

```text
Single Object
```

คืนข้อมูล:

```text
accessToken
refreshToken
user
```

---

## 6.2 Logout

```text
POST /api/auth/logout
```

Response type:

```text
Action Result
```

---

## 6.3 Refresh Token

```text
POST /api/auth/refresh
```

Response type:

```text
Single Object
```

---

## 6.4 Current User

```text
GET /api/auth/me
```

Response type:

```text
Context Object
```

ไม่ใช้ pagination

ควรคืนข้อมูล:

```text
user
memberships
businesses ที่ user มีสิทธิ์
roles
permissions
```

---

## 6.5 Forgot Password

```text
POST /api/auth/forgot-password
```

Response type:

```text
Action Result
```

---

## 6.6 Reset Password

```text
POST /api/auth/reset-password
```

Response type:

```text
Action Result
```

---

# 7. Business Context API

API กลุ่มนี้สำคัญมาก เพราะ frontend ต้องใช้เพื่อรู้ว่า user อยู่ business ไหน, role อะไร, เปิด module ไหน

---

## 7.1 My Businesses

```text
GET /api/businesses/my
```

Response type:

```text
Simple List
```

ไม่ใช้ pagination เพราะ user หนึ่งคนมักมี business ไม่เยอะ

---

## 7.2 Business Context

```text
GET /api/businesses/:businessId/context
```

Response type:

```text
Context Object
```

ควรคืนข้อมูล:

```text
business
branches
currentUser role/permissions
enabledModules
plan/limits/usage
branding
defaultPaymentMethods
receipt config
```

---

## 7.3 POS Bootstrap

```text
GET /api/pos/:businessId/bootstrap?branchId=
```

Response type:

```text
Context Object
```

ใช้สำหรับ `frontend/apps/terminal`

ควรคืนข้อมูล:

```text
business
branch
user role/permissions
categories
topItems
paymentMethods
receipt config
modules
branding
openOrders summary
```

หลักการ:

```text
เปิด POS ให้เร็ว
ไม่โหลด orders/customers/reports ทั้งหมด
ไม่เรียก API ย่อยเยอะเกินไปตอนเปิด POS
```

---

# 8. Platform Admin API

ใช้โดย `platform_admin` เท่านั้น

---

## 8.1 Businesses

```text
GET    /api/platform/businesses
POST   /api/platform/businesses
GET    /api/platform/businesses/:businessId
PATCH  /api/platform/businesses/:businessId
POST   /api/platform/businesses/:businessId/suspend
POST   /api/platform/businesses/:businessId/activate
```

Response type:

```text
GET list → Paginated List
GET detail → Single Object
POST/PATCH → Single Object
suspend/activate → Action Result
```

---

## 8.2 Platform Users

```text
GET    /api/platform/users
POST   /api/platform/users
GET    /api/platform/users/:userId
PATCH  /api/platform/users/:userId
POST   /api/platform/users/:userId/disable
```

Response type:

```text
GET list → Paginated List
GET detail → Single Object
actions → Action Result
```

---

## 8.3 Plans

```text
GET    /api/platform/plans
POST   /api/platform/plans
GET    /api/platform/plans/:planId
PATCH  /api/platform/plans/:planId
```

Response type:

```text
GET list → Simple List หรือ Paginated List
GET detail → Single Object
POST/PATCH → Single Object
```

หมายเหตุ:

```text
plans มีจำนวนน้อย จึงสามารถไม่ใช้ pagination ได้
```

---

## 8.4 Subscriptions

```text
GET    /api/platform/subscriptions
POST   /api/platform/subscriptions
GET    /api/platform/subscriptions/:subscriptionId
PATCH  /api/platform/subscriptions/:subscriptionId
POST   /api/platform/subscriptions/:subscriptionId/renew
POST   /api/platform/subscriptions/:subscriptionId/suspend
```

Response type:

```text
GET list → Paginated List
GET detail → Single Object
renew/suspend → Action Result
```

---

## 8.5 Add-ons

```text
GET    /api/platform/add-ons
POST   /api/platform/add-ons
PATCH  /api/platform/add-ons/:addOnId
POST   /api/platform/businesses/:businessId/add-ons/:addOnId/enable
POST   /api/platform/businesses/:businessId/add-ons/:addOnId/disable
```

Response type:

```text
GET add-ons → Simple List
POST/PATCH → Single Object
enable/disable → Action Result
```

---

## 8.6 Subscription Payments

```text
GET    /api/platform/subscription-payments
POST   /api/platform/subscription-payments
PATCH  /api/platform/subscription-payments/:paymentId/confirm
PATCH  /api/platform/subscription-payments/:paymentId/reject
```

Response type:

```text
GET list → Paginated List
POST → Single Object
confirm/reject → Action Result
```

---

## 8.7 Contact Requests

```text
GET   /api/platform/contact-requests
GET   /api/platform/contact-requests/:requestId
PATCH /api/platform/contact-requests/:requestId
```

Response type:

```text
GET list → Paginated List
GET detail → Single Object
PATCH → Single Object
```

---

## 8.8 Platform Support Tickets

```text
GET   /api/platform/support-tickets
GET   /api/platform/support-tickets/:ticketId
PATCH /api/platform/support-tickets/:ticketId
POST  /api/platform/support-tickets/:ticketId/messages
```

Response type:

```text
GET list → Paginated List
GET detail → Single Object
message/action → Action Result
```

---

## 8.9 Platform Audit Logs

```text
GET /api/platform/audit-logs
```

Response type:

```text
Paginated List
```

---

## 8.10 Platform System Settings

```text
GET   /api/platform/system-settings
PATCH /api/platform/system-settings
```

Response type:

```text
GET → Single Object
PATCH → Single Object
```

ใช้ตั้งค่าระดับ platform เช่น default currency, support contact, system limits, global feature flags

---

## 8.11 Notification Templates

```text
GET   /api/platform/system-settings/notification-templates
PATCH /api/platform/system-settings/notification-templates/:templateKey
```

Response type:

```text
GET → Simple List
PATCH → Single Object
```

ใช้จัดการ template การแจ้งเตือนระดับระบบ

---

## 8.12 Master Payment Config

```text
GET   /api/platform/payments/settings
PATCH /api/platform/payments/settings
```

Response type:

```text
GET → Single Object
PATCH → Single Object
```

ใช้ตั้งค่า bank / QR / payment config กลางของ TJ POS สำหรับ subscription payment และการชำระเงินให้ทีม TJ POS

---

# 9. Business Profile API

Business API กลุ่มนี้ใช้ให้แต่ละร้านจัดการข้อมูลของตัวเองตาม role, permission, plan, POS Type และ enabled modules โดย backend ต้องตรวจ `businessId` และ permission ทุกครั้ง

---

## 9.1 Business Detail

```text
GET /api/businesses/:businessId
```

Response type:

```text
Single Object
```

---

## 9.2 Update Business Profile

```text
PATCH /api/businesses/:businessId
```

Response type:

```text
Single Object
```

Permission:

```text
business.update
```

---

# 10. Branch API

---

## 10.1 Branch List for Admin Table

```text
GET /api/businesses/:businessId/branches
```

Response type:

```text
Paginated List
```

---

## 10.2 Branch Options

```text
GET /api/businesses/:businessId/branches/options
```

Response type:

```text
Options List
```

---

## 10.3 Create Branch

```text
POST /api/businesses/:businessId/branches
```

Response type:

```text
Single Object
```

---

## 10.4 Branch Detail

```text
GET /api/businesses/:businessId/branches/:branchId
```

Response type:

```text
Single Object
```

---

## 10.5 Update Branch

```text
PATCH /api/businesses/:businessId/branches/:branchId
```

Response type:

```text
Single Object
```

---

## 10.6 Disable Branch

```text
POST /api/businesses/:businessId/branches/:branchId/disable
```

Response type:

```text
Action Result
```

---

# 11. Staff / Roles / Permissions API

---

## 11.1 Staff List

```text
GET /api/businesses/:businessId/staff
```

Response type:

```text
Paginated List
```

---

## 11.2 Staff Options

```text
GET /api/businesses/:businessId/staff/options
```

Response type:

```text
Options List
```

---

## 11.3 Create Staff

```text
POST /api/businesses/:businessId/staff
```

Response type:

```text
Single Object
```

---

## 11.4 Staff Detail

```text
GET /api/businesses/:businessId/staff/:staffId
```

Response type:

```text
Single Object
```

---

## 11.5 Update Staff

```text
PATCH /api/businesses/:businessId/staff/:staffId
```

Response type:

```text
Single Object
```

---

## 11.6 Disable Staff

```text
POST /api/businesses/:businessId/staff/:staffId/disable
```

Response type:

```text
Action Result
```

---

## 11.7 Roles

```text
GET /api/businesses/:businessId/roles
```

Response type:

```text
Simple List
```

---

## 11.8 Permissions

```text
GET /api/permissions
```

Response type:

```text
Simple List
```

---

# 12. Items / Categories API

---

## 12.1 Items List

```text
GET /api/businesses/:businessId/items
```

Response type:

```text
Paginated List
```

Query:

```text
page
limit
search
branchId
categoryId
status
itemType
barcode
sku
availableForSale
priceType
```

หมายเหตุ Wholesale:

```text
Item payload ต้องรองรับ sellingPrice เป็น default retail price
field optional: wholesalePrice, resellerPrice, minWholesaleQuantity, priceListId
ไม่สร้าง item ซ้ำสำหรับขายส่ง
```

---

## 12.2 Item Options for Select

```text
GET /api/businesses/:businessId/items/options
```

Response type:

```text
Options List
```

---

## 12.3 Search Items

```text
GET /api/businesses/:businessId/items/search?search=&limit=
```

Response type:

```text
Simple List
```

ใช้สำหรับ POS search / combobox

---

## 12.4 Find Item by Barcode

```text
GET /api/businesses/:businessId/items/barcode/:barcode
```

Response type:

```text
Single Object
```

ถ้าไม่พบ:

```text
NOT_FOUND
```

---

## 12.5 Create Item

```text
POST /api/businesses/:businessId/items
```

Response type:

```text
Single Object
```

---

## 12.6 Item Detail

```text
GET /api/businesses/:businessId/items/:itemId
```

Response type:

```text
Single Object
```

---

## 12.7 Update Item

```text
PATCH /api/businesses/:businessId/items/:itemId
```

Response type:

```text
Single Object
```

---

## 12.8 Disable Item / Stop Selling

```text
POST /api/businesses/:businessId/items/:itemId/disable
```

Response type:

```text
Action Result
```

---

## 12.9 Categories List

```text
GET /api/businesses/:businessId/categories
```

Response type:

```text
Paginated List หรือ Simple List
```

ถ้าใช้ใน admin table:

```text
ใช้ pagination
```

ถ้าใช้ใน POS sidebar/category menu:

```text
ใช้ simple list
```

---

## 12.10 Category Options

```text
GET /api/businesses/:businessId/categories/options
```

Response type:

```text
Options List
```

---

## 12.11 Create / Update Category

```text
POST  /api/businesses/:businessId/categories
PATCH /api/businesses/:businessId/categories/:categoryId
```

Response type:

```text
Single Object
```

---

# 13. POS / Orders API

กลุ่มนี้เป็น API หลักของระบบขาย

---

## 13.1 Orders List

```text
GET /api/businesses/:businessId/orders
```

Response type:

```text
Paginated List
```

Query:

```text
page
limit
branchId
status
paymentStatus
from
to
customerId
staffId
orderType
customerType
debtStatus
deliveryStatus
search
```

หมายเหตุ Wholesale:

```text
orderType ต้องรองรับ retail, wholesale, purchase, return
Wholesale order ใช้ endpoint Orders เดิม
payload เพิ่ม optional priceListId, debtStatus, deliveryStatus, quantity discount และ notes
```

---

## 13.2 Open Orders

```text
GET /api/businesses/:businessId/orders/open
```

Response type:

```text
Simple List
```

ใช้ใน POS Terminal เพื่อแสดงออเดอร์ที่ยังเปิดอยู่

---

## 13.3 Held Orders

```text
GET /api/businesses/:businessId/orders/held
```

Response type:

```text
Simple List
```

ใช้ใน POS Terminal เพื่อแสดงออเดอร์ที่พักไว้

---

## 13.4 Create Order

```text
POST /api/businesses/:businessId/orders
```

Response type:

```text
Single Object
```

---

## 13.5 Order Detail

```text
GET /api/businesses/:businessId/orders/:orderId
```

Response type:

```text
Single Object
```

---

## 13.6 Update Order Draft

```text
PATCH /api/businesses/:businessId/orders/:orderId
```

Response type:

```text
Single Object
```

ใช้เมื่อ order ยังไม่ paid

---

## 13.7 Add Item to Order

```text
POST /api/businesses/:businessId/orders/:orderId/items
```

Response type:

```text
Single Object
```

คืนค่าเป็น order ที่อัปเดตแล้ว หรือ order item ที่เพิ่มใหม่

---

## 13.8 Update Order Item

```text
PATCH /api/businesses/:businessId/orders/:orderId/items/:orderItemId
```

Response type:

```text
Single Object
```

ใช้กับ:

```text
quantity
note
options
discount
```

---

## 13.9 Remove Order Item

```text
DELETE /api/businesses/:businessId/orders/:orderId/items/:orderItemId
```

Response type:

```text
Action Result
```

---

## 13.10 Hold Order

```text
POST /api/businesses/:businessId/orders/:orderId/hold
```

Response type:

```text
Action Result
```

---

## 13.11 Resume Order

```text
POST /api/businesses/:businessId/orders/:orderId/resume
```

Response type:

```text
Action Result
```

---

## 13.12 Cancel Order

```text
POST /api/businesses/:businessId/orders/:orderId/cancel
```

Response type:

```text
Action Result
```

Request ต้องมี:

```text
reason
```

ถ้า order paid แล้ว:

```text
ไม่ให้ cancel ตรง ๆ
คืน error ORDER_ALREADY_PAID
แนะนำให้ใช้ refund
```

---

## 13.13 Checkout Order

```text
POST /api/businesses/:businessId/orders/:orderId/checkout
```

Response type:

```text
Action Result
```

Action นี้สามารถสร้าง payment พร้อมกันได้ถ้า request มี payment info

---

## 13.14 Print Receipt Data

```text
GET /api/businesses/:businessId/orders/:orderId/receipt
```

Response type:

```text
Single Object
```

คืนข้อมูลสำหรับ FE render/print bill

---

# 14. Payments / Payment Methods API

---

## 14.1 Payment Methods List

```text
GET /api/businesses/:businessId/payment-methods
```

Response type:

```text
Paginated List
```

---

## 14.2 Active Payment Methods

```text
GET /api/businesses/:businessId/payment-methods/active
```

Response type:

```text
Simple List
```

ใช้ใน POS checkout

---

## 14.3 Payment Method Options

```text
GET /api/businesses/:businessId/payment-methods/options
```

Response type:

```text
Options List
```

---

## 14.4 Create Payment Method

```text
POST /api/businesses/:businessId/payment-methods
```

Response type:

```text
Single Object
```

---

## 14.5 Update Payment Method

```text
PATCH /api/businesses/:businessId/payment-methods/:paymentMethodId
```

Response type:

```text
Single Object
```

---

## 14.6 Disable Payment Method

```text
POST /api/businesses/:businessId/payment-methods/:paymentMethodId/disable
```

Response type:

```text
Action Result
```

---

## 14.7 Confirm Payment

```text
POST /api/businesses/:businessId/orders/:orderId/payments
```

Response type:

```text
Action Result
```

---

## 14.8 Payments List

```text
GET /api/businesses/:businessId/payments
```

Response type:

```text
Paginated List
```

Query:

```text
page
limit
branchId
methodType
status
customerId
orderType
debtStatus
from
to
```

หมายเหตุ Debt:

```text
Payments endpoint เดิมต้องรองรับ order payment และ debt payment
paymentContext รองรับ order_payment, debt_payment, opening_balance_payment
```

---

# 15. Refund API

---

## 15.1 Refund List

```text
GET /api/businesses/:businessId/refunds
```

Response type:

```text
Paginated List
```

---

## 15.2 Create Refund

```text
POST /api/businesses/:businessId/orders/:orderId/refund
```

Response type:

```text
Action Result
```

Request ต้องมี:

```text
refundType
refundAmount
reason
returnedItems ถ้าเป็น partial/item return
restock
```

---

## 15.3 Refund Detail

```text
GET /api/businesses/:businessId/refunds/:refundId
```

Response type:

```text
Single Object
```

---

# 16. Cash Session API

---

## 16.1 Open Cash Session

```text
POST /api/businesses/:businessId/cash-sessions/open
```

Response type:

```text
Single Object
```

---

## 16.2 Close Cash Session

```text
POST /api/businesses/:businessId/cash-sessions/:sessionId/close
```

Response type:

```text
Action Result
```

---

## 16.3 Cash Sessions List

```text
GET /api/businesses/:businessId/cash-sessions
```

Response type:

```text
Paginated List
```

---

## 16.4 Current Session

```text
GET /api/businesses/:businessId/cash-sessions/current?branchId=&deviceId=
```

Response type:

```text
Single Object
```

---

# 17. Inventory / Suppliers API

---

## 17.1 Inventory List

```text
GET /api/businesses/:businessId/inventory
```

Response type:

```text
Paginated List
```

Query:

```text
branchId
search
lowStock=true
page
limit
```

---

## 17.2 Stock Movements

```text
GET /api/businesses/:businessId/stock-movements
```

Response type:

```text
Paginated List
```

---

## 17.3 Stock In

```text
POST /api/businesses/:businessId/stock-in
```

Response type:

```text
Action Result
```

---

## 17.4 Stock Adjustment

```text
POST /api/businesses/:businessId/stock-adjustment
```

Response type:

```text
Action Result
```

Request ต้องมี:

```text
reason
items
```

---

## 17.5 Stock Transfer

```text
POST /api/businesses/:businessId/stock-transfer
```

Response type:

```text
Action Result
```

---

## 17.6 Suppliers List

```text
GET /api/businesses/:businessId/suppliers
```

Response type:

```text
Paginated List
```

---

## 17.7 Supplier Options

```text
GET /api/businesses/:businessId/suppliers/options
```

Response type:

```text
Options List
```

---

## 17.8 Create / Update Supplier

```text
POST  /api/businesses/:businessId/suppliers
PATCH /api/businesses/:businessId/suppliers/:supplierId
```

Response type:

```text
Single Object
```

---

## 17.9 Purchase Receipts List

```text
GET /api/businesses/:businessId/purchase-receipts
```

Response type:

```text
Paginated List
```

Query:

```text
page
limit
branchId
supplierId
status
from
to
search
```

---

## 17.10 Purchase Receipt Detail

```text
GET /api/businesses/:businessId/purchase-receipts/:receiptId
```

Response type:

```text
Single Object
```

---

## 17.11 Create / Update Purchase Receipt

```text
POST  /api/businesses/:businessId/purchase-receipts
PATCH /api/businesses/:businessId/purchase-receipts/:receiptId
```

Response type:

```text
Single Object
```

Business rules:

```text
ต้องมี branchId
ต้องมี supplierId ถ้าเป็นการรับของจาก supplier
เมื่อ confirm แล้วสามารถสร้าง stock movement แบบ in ได้
ห้ามแก้ข้อมูลสำคัญหลัง confirm ยกเว้นมี permission เฉพาะ
```

---

# 18. Customers / Loyalty API

---

## 18.1 Customers List

```text
GET /api/businesses/:businessId/customers
```

Response type:

```text
Paginated List
```

Query:

```text
page
limit
search
customerType
priceListId
debtStatus
status
```

หมายเหตุ Wholesale:

```text
Customers endpoint เดิมต้องรองรับ retail_customer, wholesale_customer, reseller และ vip
Customer detail ต้องมี priceListId, debtBalance, creditLimit, paymentTerm, purchase history และ wholesale order history
```

---

## 18.2 Search Customer

```text
GET /api/businesses/:businessId/customers/search?phone=&search=
```

Response type:

```text
Simple List
```

ใช้สำหรับ checkout/member lookup

---

## 18.3 Create Customer

```text
POST /api/businesses/:businessId/customers
```

Response type:

```text
Single Object
```

---

## 18.4 Customer Detail

```text
GET /api/businesses/:businessId/customers/:customerId
```

Response type:

```text
Single Object
```

---

## 18.5 Update Customer

```text
PATCH /api/businesses/:businessId/customers/:customerId
```

Response type:

```text
Single Object
```

---

## 18.6 Loyalty Rules

```text
GET   /api/businesses/:businessId/loyalty/rules
POST  /api/businesses/:businessId/loyalty/rules
PATCH /api/businesses/:businessId/loyalty/rules/:ruleId
```

Response type:

```text
GET → Simple List
POST/PATCH → Single Object
```

---

## 18.7 Loyalty Point History

```text
GET /api/businesses/:businessId/customers/:customerId/points
```

Response type:

```text
Paginated List
```

---

# 19. Promotions API

---

## 19.1 Promotions List

```text
GET /api/businesses/:businessId/promotions
```

Response type:

```text
Paginated List
```

---

## 19.2 Active Promotions

```text
GET /api/businesses/:businessId/promotions/active
```

Response type:

```text
Simple List
```

ใช้ใน checkout/apply promotion

---

## 19.3 Create / Update Promotion

```text
POST  /api/businesses/:businessId/promotions
PATCH /api/businesses/:businessId/promotions/:promotionId
```

Response type:

```text
Single Object
```

---

## 19.4 Disable Promotion

```text
POST /api/businesses/:businessId/promotions/:promotionId/disable
```

Response type:

```text
Action Result
```

---

## 19.5 Validate Coupon

```text
POST /api/businesses/:businessId/promotions/validate-coupon
```

Response type:

```text
Action Result
```

---

# 20. Tables / Areas API

ใช้สำหรับ Cafe / Restaurant

---

## 20.1 Areas

```text
GET   /api/businesses/:businessId/areas
POST  /api/businesses/:businessId/areas
PATCH /api/businesses/:businessId/areas/:areaId
```

Response type:

```text
GET → Simple List หรือ Paginated List
POST/PATCH → Single Object
```

---

## 20.2 Tables List

```text
GET /api/businesses/:businessId/tables
```

Response type:

```text
Simple List หรือ Paginated List
```

หมายเหตุ:

```text
POS table map → Simple List ตาม branch
Admin table → Paginated List ถ้ามีจำนวนมาก
```

---

## 20.3 Table Options

```text
GET /api/businesses/:businessId/tables/options?branchId=
```

Response type:

```text
Options List
```

---

## 20.4 Create / Update Table

```text
POST  /api/businesses/:businessId/tables
PATCH /api/businesses/:businessId/tables/:tableId
```

Response type:

```text
Single Object
```

---

## 20.5 Update Table Status

```text
PATCH /api/businesses/:businessId/tables/:tableId/status
```

Response type:

```text
Action Result
```

---

# 21. Kitchen / Bar API

---

## 21.1 Kitchen Tickets

```text
GET /api/businesses/:businessId/kitchen/tickets
```

Response type:

```text
Simple List
```

ใช้กับ Kitchen Display โดยดึง ticket ที่ยัง pending/preparing

---

## 21.2 Bar Tickets

```text
GET /api/businesses/:businessId/bar/tickets
```

Response type:

```text
Simple List
```

---

## 21.3 Update Ticket Status

```text
PATCH /api/businesses/:businessId/kitchen/tickets/:ticketId/status
PATCH /api/businesses/:businessId/bar/tickets/:ticketId/status
```

Response type:

```text
Action Result
```

---

# 22. Beauty API

---

## 22.1 Appointments List

```text
GET /api/businesses/:businessId/appointments
```

Response type:

```text
Paginated List หรือ Calendar List
```

Query:

```text
from
to
branchId
staffId
```

---

## 22.2 Create / Update Appointment

```text
POST  /api/businesses/:businessId/appointments
PATCH /api/businesses/:businessId/appointments/:appointmentId
```

Response type:

```text
Single Object
```

---

## 22.3 Update Appointment Status

```text
PATCH /api/businesses/:businessId/appointments/:appointmentId/status
```

Response type:

```text
Action Result
```

---

## 22.4 Treatment Packages

```text
GET   /api/businesses/:businessId/treatment-packages
POST  /api/businesses/:businessId/treatment-packages
PATCH /api/businesses/:businessId/treatment-packages/:packageId
POST  /api/businesses/:businessId/treatment-packages/:packageId/use-session
```

Response type:

```text
GET → Paginated List
POST/PATCH → Single Object
use-session → Action Result
```

---

# 23. Hospitality API

---

## 23.1 Rooms List

```text
GET /api/businesses/:businessId/rooms
```

Response type:

```text
Paginated List หรือ Simple List
```

Room calendar/display อาจใช้ Simple List

---

## 23.2 Room Options

```text
GET /api/businesses/:businessId/rooms/options
```

Response type:

```text
Options List
```

---

## 23.3 Create / Update Room

```text
POST  /api/businesses/:businessId/rooms
PATCH /api/businesses/:businessId/rooms/:roomId
```

Response type:

```text
Single Object
```

---

## 23.4 Bookings List

```text
GET /api/businesses/:businessId/bookings
```

Response type:

```text
Paginated List หรือ Calendar List
```

---

## 23.5 Create / Update Booking

```text
POST  /api/businesses/:businessId/bookings
PATCH /api/businesses/:businessId/bookings/:bookingId
```

Response type:

```text
Single Object
```

---

## 23.6 Check-in / Check-out

```text
POST /api/businesses/:businessId/bookings/:bookingId/check-in
POST /api/businesses/:businessId/bookings/:bookingId/check-out
```

Response type:

```text
Action Result
```

---

## 23.7 Housekeeping

```text
GET   /api/businesses/:businessId/housekeeping/tasks
POST  /api/businesses/:businessId/housekeeping/tasks
PATCH /api/businesses/:businessId/housekeeping/tasks/:taskId/status
```

Response type:

```text
GET → Paginated List
POST/PATCH → Single Object หรือ Action Result
```

---

# 24. Reports API

---

## 24.1 Sales Summary

```text
GET /api/businesses/:businessId/reports/sales-summary
```

Response type:

```text
Single Object
```

Query:

```text
branchId
from
to
customerType
orderType
priceType
```

---

## 24.2 Orders Report

```text
GET /api/businesses/:businessId/reports/orders
```

Response type:

```text
Paginated List
```

Query เพิ่ม:

```text
customerType
orderType
debtStatus
```

---

## 24.3 Payments Report

```text
GET /api/businesses/:businessId/reports/payments
```

Response type:

```text
Paginated List
```

Query เพิ่ม:

```text
methodType
customerType
orderType
debtStatus
```

---

## 24.4 Items Report

```text
GET /api/businesses/:businessId/reports/items
```

Response type:

```text
Paginated List
```

Query เพิ่ม:

```text
priceType
customerType
```

มุมมองที่ต้องรองรับใน Reports เดิม:

```text
Sales by customer type
Wholesale sales
Top wholesale customers
Debt report
Payment by bank
Customer balance
Profit by price type
```

---

## 24.5 Staff Report

```text
GET /api/businesses/:businessId/reports/staff
```

Response type:

```text
Paginated List หรือ Summary List
```

---

## 24.6 Inventory Report

```text
GET /api/businesses/:businessId/reports/inventory
```

Response type:

```text
Paginated List
```

---

## 24.7 Export Report

```text
POST /api/businesses/:businessId/reports/export
```

Response type:

```text
Action Result
```

คืนค่า export job หรือ file URL ถ้า generate ได้เร็ว

---

# 25. Receipt / Branding / Modules API

---

## 25.1 Receipt Template

```text
GET   /api/businesses/:businessId/receipt-template
PATCH /api/businesses/:businessId/receipt-template
```

Response type:

```text
Single Object
```

---

## 25.2 Receipt Preview

```text
POST /api/businesses/:businessId/receipt-template/preview
```

Response type:

```text
Single Object
```

---

## 25.3 Branding

```text
GET   /api/businesses/:businessId/branding
PATCH /api/businesses/:businessId/branding
```

Response type:

```text
Single Object
```

---

## 25.4 Modules

```text
GET   /api/businesses/:businessId/modules
PATCH /api/businesses/:businessId/modules/:moduleKey
```

Response type:

```text
GET → Simple List หรือ Single Object
PATCH → Action Result
```

ถ้า module ไม่อยู่ในแพ็กเกจ:

```text
MODULE_NOT_ENABLED
PLAN_LIMIT_EXCEEDED
```

---

# 26. Devices API

---

## 26.1 Devices List

```text
GET /api/businesses/:businessId/devices
```

Response type:

```text
Paginated List
```

---

## 26.2 Create / Register Device

```text
POST /api/businesses/:businessId/devices
```

Response type:

```text
Single Object
```

---

## 26.3 Pair Device

```text
POST /api/businesses/:businessId/devices/:deviceId/pair
```

Response type:

```text
Action Result
```

---

## 26.4 Update Device

```text
PATCH /api/businesses/:businessId/devices/:deviceId
```

Response type:

```text
Single Object
```

---

## 26.5 Disable Device

```text
POST /api/businesses/:businessId/devices/:deviceId/disable
```

Response type:

```text
Action Result
```

---

# 27. Support API

---

## 27.1 Support Tickets List

```text
GET /api/businesses/:businessId/support-tickets
```

Response type:

```text
Paginated List
```

---

## 27.2 Create Support Ticket

```text
POST /api/businesses/:businessId/support-tickets
```

Response type:

```text
Single Object
```

---

## 27.3 Ticket Detail

```text
GET /api/businesses/:businessId/support-tickets/:ticketId
```

Response type:

```text
Single Object
```

---

## 27.4 Add Ticket Message

```text
POST /api/businesses/:businessId/support-tickets/:ticketId/messages
```

Response type:

```text
Action Result
```

---

# 28. Files API

---

## 28.1 Upload File

```text
POST /api/businesses/:businessId/files/upload
```

Response type:

```text
Single Object
```

ใช้สำหรับ:

```text
logo
item image
banner
QR image
support attachment
import file
```

---

## 28.2 File Detail

```text
GET /api/businesses/:businessId/files/:fileId
```

Response type:

```text
Single Object
```

---

# 29. Import / Export API

---

## 29.1 Import Items

```text
POST /api/businesses/:businessId/import/items
```

Response type:

```text
Action Result
```

---

## 29.2 Import Customers

```text
POST /api/businesses/:businessId/import/customers
```

Response type:

```text
Action Result
```

---

## 29.3 Import Staff

```text
POST /api/businesses/:businessId/import/staff
```

Response type:

```text
Action Result
```

---

## 29.4 Import Opening Stock

```text
POST /api/businesses/:businessId/import/opening-stock
```

Response type:

```text
Action Result
```

---

## 29.5 Export Data

```text
GET /api/businesses/:businessId/export/items
GET /api/businesses/:businessId/export/orders
GET /api/businesses/:businessId/export/payments
GET /api/businesses/:businessId/export/inventory
GET /api/businesses/:businessId/export/customers
GET /api/businesses/:businessId/export/customer-debt
GET /api/businesses/:businessId/export/wholesale-price-list
GET /api/businesses/:businessId/export/wholesale-orders
```

Response type:

```text
Action Result หรือ File Download
```

ถ้า export ใหญ่:

```text
สร้าง export job
```

หมายเหตุ Import / Export:

```text
Import items ต้องรองรับ wholesalePrice, resellerPrice, minWholesaleQuantity
Import customers ต้องรองรับ customerType, priceListId, debt opening balance, creditLimit, paymentTerm
Export เดิมต้อง filter ได้ด้วย customerType และ orderType โดยไม่สร้าง Wholesale module แยก
```

---

## 29.6 Import / Export Jobs

```text
GET /api/businesses/:businessId/import-jobs
GET /api/businesses/:businessId/export-jobs
```

Response type:

```text
Paginated List
```

---

# 30. Audit Logs API

---

## 30.1 Business Audit Logs

```text
GET /api/businesses/:businessId/audit-logs
```

Response type:

```text
Paginated List
```

Query:

```text
userId
action
entityType
from
to
page
limit
```

สิทธิ์:

```text
Owner / Manager ที่มี permission
Platform Admin
```

---

# 31. Public Business / QR Menu API

สถานะ: pending backend

```text
/b/[businessSlug]
/b/[businessSlug]/menu
/b/[businessSlug]/menu/[itemSlug]
/b/[businessSlug]/info
/b/[businessSlug]/book
/b/[businessSlug]/branch/[branchSlug]/menu
/q/[qrCode]
```

ตอนนี้โฟกัส FE ก่อน จึงยังไม่ชี้ขาด backend endpoint ของกลุ่มนี้

Business rules:

```text
Public route กลุ่มนี้ไม่ต้อง login
ข้อมูลต้องเป็น read-only สำหรับลูกค้า
ต้องแสดงเฉพาะ business ที่ active
ต้องแสดงเฉพาะ branch ที่ active
ต้องแสดงเฉพาะ item ที่ public/published และ available ตาม rule ของร้าน
ห้ามสร้าง order ห้าม checkout และห้ามชำระเงิน
ถ้า item หมด ให้แสดง out-of-stock หรือซ่อนตาม setting ของร้าน
```

---

# 32. Health API

```text
GET /api/health
```

Response type:

```text
Single Object
```

ควรคืนข้อมูล:

```text
api status
database status
version
uptime
```

---

# 33. สรุป API ที่ต้องมี Pagination

```text
orders
items
customers
payments
refunds
inventory
stock movements
suppliers
staff
support tickets
audit logs
reports detail
import/export jobs
devices
```

---

# 34. สรุป API ที่ไม่ต้องมี Pagination

```text
auth/me
business context
pos bootstrap
branch options
payment methods active
roles
permissions
module settings
branding
receipt template
health
```

---

# 35. API ที่มีได้ทั้ง 2 รูปแบบ

```text
branches
categories
staff
tables
rooms
payment methods
```

หลักการ:

```text
Admin table → ใช้ Paginated List
Select / dropdown / options → ใช้ Options List
```

---

# 36. สรุป Module API ทั้งหมด

API ของ TJ POS แบ่งตาม module:

```text
Auth
Platform Admin
Business Context
Branches
Staff / Roles / Permissions
Items / Categories
Orders / POS
Payments / Payment Methods
Refunds
Cash Sessions
Inventory / Suppliers
Purchase Receipts
Customers / Loyalty
Promotions
Tables / Kitchen
Beauty
Hospitality
Reports
Receipt / Branding / Modules
Devices
Support
Files
Import / Export
Audit Logs
Platform Settings / Notification Templates / Master Payment Config
Public Business / QR Menu (pending backend)
Health
```

หมายเหตุ Wholesale:

```text
ไม่เพิ่ม Wholesale เป็น Module API แยก
Wholesale support อยู่ใน Items, Customers, Orders, Payments, Reports และ Import / Export
```

---

# 37. ข้อกำหนดเวลาเขียน API Spec รายละเอียด

เมื่อเขียน spec รายละเอียดของแต่ละ API ต้องระบุ:

```text
Method
Endpoint
Purpose
Role / Permission
Query Params
Request Body
Response Type
Response Example
Business Rules
Errors
```

---

## 38. ข้อสรุปสุดท้าย

เอกสารนี้เป็น API Specification ระดับระบบของ TJ POS

สิ่งที่ชัดเจนแล้ว:

```text
API แบ่งตาม module
API list ใหญ่ต้องมี pagination
API options/select ไม่ต้องมี pagination
API detail ใช้ Single Object
API action ใช้ Action Result
API context/me/bootstrap ไม่ต้องมี pagination
Error response ต้องใช้ format เดียวกันทั้งระบบ
```

สิ่งที่ยังต้องทำต่อภายหลัง:

```text
request body รายละเอียดของแต่ละ endpoint
response example รายละเอียดของแต่ละ endpoint
validation rule
permission matrix แบบเต็ม
API implementation
Swagger/OpenAPI generation
```
