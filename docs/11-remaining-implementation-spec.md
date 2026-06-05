# TJ POS — Remaining Implementation Specification

**เวอร์ชัน:** Final Remaining Implementation Spec  
**ภาษา:** ไทย  
**ขอบเขต:** เอกสารนี้สรุปส่วนที่เหลือที่ต้องชี้แจงหลังจากชี้แจง flow, stack, routes, UI guideline, domain schema, database schema, API overview, Redis/Worker/PgBouncer แล้ว  
**วัตถุประสงค์:** ใช้เป็นเอกสารสำหรับทีม dev เพื่อรู้ว่ายังต้องทำอะไรต่อ และต้องทำตามลำดับใด

---

## 1. สถานะปัจจุบันของเอกสาร TJ POS

ตอนนี้ได้ชี้แจงแล้ว:

```text
1. Final Flow ของ TJ POS
2. Business Model และ Service Packages
3. Frontend Stack
4. Backend Stack
5. Frontend Routes
6. UI Interaction Guideline
7. Domain Schema
8. Backend Folder Structure
9. PostgreSQL Database Schema
10. API Specification ระดับระบบ
11. Redis / Queue / Worker / PgBouncer
12. Menu List และ Menu Detail Spec
13. Import / Export / PDF / Print direction
14. POS Core Flow
15. Bill / Receipt / Bank / QR Payment
```

เอกสารนี้จะชี้แจงส่วนที่เหลือเพื่อให้ทีมสามารถเริ่มพัฒนาได้เป็นระบบมากขึ้น

---

# 2. ส่วนที่เหลือที่ต้องชี้แจง

ส่วนที่ยังต้องกำหนดให้ชัดเจนก่อนเริ่ม code จริงแบบเต็มระบบ:

```text
1. Development Roadmap / ลำดับการพัฒนา
2. Permission Matrix
3. API Request/Response Detail Guideline
4. Database Migration / Drizzle Schema Guideline
5. UI Layout Guideline รายหน้าจอ
6. Form Validation Guideline
7. Import XLSX Template Guideline
8. Report Formula Guideline
9. Testing / QA Checklist
10. Definition of Done
```

---

# 3. Development Roadmap / ลำดับการพัฒนา

## 3.1 หลักการ

ระบบ TJ POS ได้ชี้แจง scope เต็มแล้ว แต่ตอนพัฒนาไม่ควรทำทุกอย่างพร้อมกัน

ต้องแยกเป็นลำดับการพัฒนา เพื่อให้:

```text
ระบบไม่ซับซ้อนเกินไปตั้งแต่วันแรก
ทีม dev ไม่หลงทาง
สามารถ test ได้ทีละส่วน
สามารถ demo ได้เร็ว
ลดความเสี่ยงจากการแก้หลายจุดพร้อมกัน
```

หมายเหตุ:

```text
ลำดับการพัฒนาไม่ได้แปลว่า feature นั้นไม่อยู่ใน scope
ทุกอย่างยังอยู่ใน scope หลัก แต่ต้องมีลำดับการทำก่อน/หลัง
```

---

## 3.2 Milestone 1 — Foundation

เป้าหมาย:

```text
ให้ระบบ login ได้
สร้าง business ได้
เข้า workspace ได้
role/permission เริ่มทำงานได้
```

ต้องทำ:

```text
Auth
User
Business
Branch
Business Member
Role / Permission
Business Context
Platform Admin basic
Frontend layout พื้นฐาน
```

ผลลัพธ์ที่ต้องได้:

```text
Platform Admin สร้าง business ให้ลูกค้าได้
Owner login ได้
Owner เข้า Business Workspace ได้
ระบบรู้ว่า user มี role อะไร
ระบบรู้ว่า business ใช้ POS Type อะไร
```

---

## 3.3 Milestone 2 — Catalog / Items

เป้าหมาย:

```text
ให้ business สร้างสิ่งที่ขายได้
```

ต้องทำ:

```text
Items
Categories
Item create/edit
Item list
Item detail
Search item
Barcode field
Image upload
Branch availability
Basic import items
```

ผลลัพธ์ที่ต้องได้:

```text
Retail สร้าง product ได้
Cafe/Restaurant สร้าง menu item ได้
Beauty สร้าง service ได้
Hospitality สร้าง room/extra service ได้
```

---

## 3.4 Milestone 3 — POS Core

เป้าหมาย:

```text
ให้ขายของได้จริงแบบ basic
```

ต้องทำ:

```text
POS Terminal
Category / item grid
Search item
Scan barcode
Cart
Quantity +/-
Item note
Hold order
Open orders
Checkout
Payment method
Print bill preview
```

ผลลัพธ์ที่ต้องได้:

```text
Cashier เปิด POS ได้
เลือก item ได้
สร้าง order ได้
พัก order ได้
ชำระเงินได้
ดู bill ได้
```

---

## 3.5 Milestone 4 — Orders / Payments / Receipt

เป้าหมาย:

```text
ให้ flow order/payment/bill สมบูรณ์ขึ้น
```

ต้องทำ:

```text
Order list
Order detail
Payment confirmation
Payment methods
Bank/QR display
Receipt template
Receipt print data
Cancel order
Refund basic
Audit log basic
```

ผลลัพธ์ที่ต้องได้:

```text
ดู order ย้อนหลังได้
พิมพ์ bill ได้
แสดง bank/QR ได้
ยกเลิก order ก่อน paid ได้
refund order paid ได้ตามสิทธิ์
```

---

## 3.6 Milestone 5 — Business Admin Core

เป้าหมาย:

```text
ให้ owner/manager จัดการร้านเองได้
```

ต้องทำ:

```text
Dashboard basic
Staff
Branches
Branding
Payment Methods
Receipt Settings
Modules Settings
Support Ticket
Plan usage display
```

ผลลัพธ์ที่ต้องได้:

```text
Owner เปลี่ยนโลโก้ สี ร้านได้
Owner เพิ่ม staff ได้
Owner ตั้งค่า payment method ได้
Owner ตั้งค่า bill ได้
Owner ส่ง support ticket ได้
```

---

## 3.7 Milestone 6 — Inventory / Supplier

เป้าหมาย:

```text
ให้ธุรกิจที่ต้องมี stock ใช้งานได้
```

ต้องทำ:

```text
Inventory balances
Stock in
Stock adjustment
Stock movements
Suppliers
Low stock warning
Stock report
```

ผลลัพธ์ที่ต้องได้:

```text
Retail ใช้ stock ได้
รับสินค้าเข้าได้
ปรับ stock ได้
ดูประวัติ stock ได้
```

---

## 3.8 Milestone 7 — Loyalty / Promotion

เป้าหมาย:

```text
ให้ business ใช้ customer/member/discount ได้
```

ต้องทำ:

```text
Customers
Customer search by phone
Loyalty rule basic
Point earning/redeem
Member tier basic
Promotions
Coupon
Discount
```

ผลลัพธ์ที่ต้องได้:

```text
ขายปกติไม่บังคับมี customer
ถ้าเปิด loyalty สามารถค้นหา member ได้
สามารถสะสมแต้ม/ใช้แต้ม/ใช้ coupon ได้
```

---

## 3.9 Milestone 8 — Industry Modules

เป้าหมาย:

```text
ทำ feature เฉพาะ POS Type
```

ต้องทำตามลำดับ:

```text
Cafe / Restaurant:
- Tables
- Areas
- Staff Order
- Kitchen / Bar Display
- QR Menu view-only

Beauty:
- Appointments
- Calendar
- Packages
- Commission

Hospitality:
- Rooms
- Bookings
- Check-in / Check-out
- Housekeeping
```

---

## 3.10 Milestone 9 — Reports / Import / Export / Worker

เป้าหมาย:

```text
ให้ระบบใช้งานเชิงบริหารและข้อมูลจำนวนมากได้ดีขึ้น
```

ต้องทำ:

```text
Sales report
Payment report
Item report
Inventory report
Staff report
Export XLSX
Export PDF
Import XLSX
BullMQ Worker
Import/export jobs
```

---

# 4. Permission Matrix

## 4.1 Role หลัก

```text
platform_admin
owner
manager
cashier
waiter
kitchen
bar
receptionist
```

---

## 4.2 Permission Rule หลัก

```text
Platform Admin → จัดการทั้งระบบ
Owner → จัดการ business ของตัวเองทั้งหมด
Manager → จัดการตาม branch และสิทธิ์ที่ได้รับ
Cashier → ใช้ POS, order, payment ตามสิทธิ์
Waiter → ใช้ Staff Order
Kitchen / Bar → ดูและอัปเดตสถานะ ticket
Receptionist → ใช้ hospitality flow
```

---

## 4.3 Permission Matrix แบบสรุป

| Module / Action | Platform Admin | Owner | Manager | Cashier | Waiter | Kitchen/Bar | Receptionist |
|---|---:|---:|---:|---:|---:|---:|---:|
| Platform Admin | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Business Profile | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Branches | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Staff | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Items | ✅ | ✅ | ✅ | 👁️ | 👁️ | 👁️ | 👁️ |
| POS Sale | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Staff Order | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Kitchen/Bar | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Orders View | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| Cancel Order | ❌ | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| Refund | ❌ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Payments | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ⚠️ |
| Inventory | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Stock Adjustment | ❌ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Customers | ✅ | ✅ | ✅ | ⚠️ | ❌ | ❌ | ⚠️ |
| Loyalty | ✅ | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| Promotions | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Reports | ✅ | ✅ | ✅ | ⚠️ | ❌ | ❌ | ⚠️ |
| Receipt / Bill Config | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Branding | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Modules | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Support Ticket | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| Audit Logs | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |

คำอธิบาย:

```text
✅ = ทำได้
❌ = ทำไม่ได้
👁️ = ดูได้เท่านั้น
⚠️ = ทำได้ถ้าได้รับ permission เพิ่มหรือจำกัดตาม branch
```

---

## 4.4 Permission ที่ควรใช้จริง

```text
business.view
business.update

branch.view
branch.create
branch.update
branch.disable

staff.view
staff.create
staff.update
staff.disable

item.view
item.create
item.update
item.disable
item.delete

order.view
order.create
order.update
order.cancel
order.checkout
order.print

payment.view
payment.confirm
payment.refund

refund.view
refund.create
refund.approve

stock.view
stock.in
stock.out
stock.adjust
stock.transfer

customer.view
customer.create
customer.update

loyalty.view
loyalty.manage
loyalty.apply

promotion.view
promotion.create
promotion.update
promotion.disable

report.view
report.export

receipt.view
receipt.update

branding.view
branding.update

module.view
module.update

device.view
device.create
device.update
device.disable

support.create
support.view
support.reply
support.manage

audit.view

platform.business.manage
platform.user.manage
platform.plan.manage
platform.subscription.manage
platform.payment.manage
platform.support.manage
```

---

# 5. API Request / Response Detail Guideline

## 5.1 หลักการ

API overview ได้ชี้แจง endpoint ระดับระบบแล้ว  
เมื่อทำ API detail ต้องเขียนให้ครบ:

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

## 5.2 Template สำหรับ API Detail

```md
## API Name

### Endpoint

METHOD /api/...

### Purpose

ใช้ทำอะไร

### Role / Permission

Role:
- owner
- manager

Permission:
- item.create

### Query Params

| Field | Type | Required | Description |
|---|---|---:|---|

### Request Body

| Field | Type | Required | Description |
|---|---|---:|---|

### Response Type

Single Object / Paginated List / Action Result / Options List / Context Object

### Response Example

```json
{
  "success": true,
  "data": {}
}
```

### Business Rules

- rule 1
- rule 2

### Errors

- VALIDATION_ERROR
- FORBIDDEN
- NOT_FOUND
```

---

## 5.3 API Detail ที่ควรทำก่อน

```text
1. Auth
2. Business Context
3. Items
4. Orders
5. Payments
6. Payment Methods
7. Staff
8. Branches
9. Receipt / Branding
10. Support
```

---

# 6. Database Migration / Drizzle Schema Guideline

## 6.1 หลักการ

PostgreSQL schema ได้ชี้แจงแล้ว แต่ตอนทำจริงต้องแปลงเป็น:

```text
Drizzle schema
migration files
relations
indexes
constraints
```

---

## 6.2 กฎการตั้งชื่อ

Table:

```text
snake_case plural
```

ตัวอย่าง:

```text
users
businesses
business_members
order_items
payment_methods
stock_movements
```

Column:

```text
snake_case
```

ตัวอย่าง:

```text
business_id
branch_id
created_at
updated_at
deleted_at
```

TypeScript property:

```text
camelCase
```

ตัวอย่าง:

```text
businessId
branchId
createdAt
updatedAt
deletedAt
```

---

## 6.3 Field ที่ควรมี

ตารางหลักควรมี:

```text
id
business_id ถ้าเป็นข้อมูลของ business
branch_id ถ้าเกี่ยวกับสาขา
status
created_at
updated_at
deleted_at ถ้าต้อง soft delete
created_by / updated_by ถ้าต้อง audit
```

---

## 6.4 Index สำคัญ

Index ที่ต้องให้ความสำคัญ:

```text
business_id
business_id + branch_id
business_id + created_at
business_id + status
business_id + order_number
business_id + barcode
business_id + phone
```

---

## 6.5 Migration Rule

```text
ห้ามแก้ migration เก่าหลัง deploy แล้ว
เพิ่ม migration ใหม่เสมอ
การเปลี่ยน column สำคัญต้องมีแผน migrate data
การลบ column ต้องระวังมาก
Production ต้อง backup ก่อน migration
```

---

# 7. UI Layout Guideline รายหน้าจอ

## 7.1 Web หลัก

หน้าที่ควรมี:

```text
Home
POS Types
Features
Pricing
Add-ons
FAQ/Help
Contact
```

หมายเหตุ:

```text
เว็บไซต์หลักใช้หน้า / หน้าเดียวและเลื่อนด้วย hash section
ไม่ใช้ route /request-demo
Login อยู่ใน Auth/Admin Entry ไม่ใช่เมนูของเว็บไซต์หลัก
```

หลัก UI:

```text
อ่านง่าย
มี screenshot
CTA ชัดเจน
ไม่ให้ self-register business
เน้น Contact TJ POS
```

---

## 7.2 Platform Admin

Layout:

```text
Sidebar
Topbar
Table
Filter
Detail Drawer
Action Modal
```

หน้าที่สำคัญ:

```text
Dashboard
Businesses
Users
Plans
Subscriptions
Add-ons
Payments
Contact Requests
Support Tickets
System Settings
Audit Logs
Profile & Security
```

หน้าจอ Platform Admin ให้ยึดรูปใน `docs/designs/02-platform-admin` เป็น visual source of truth
และใช้ mock data ก่อนต่อ API จริงตามกฎ FE/BE collaboration

---

## 7.3 Business Admin

Layout:

```text
Sidebar ตาม role
Topbar แสดง business/branch/user
Content area
Filter/Table/Form
Drawer สำหรับ detail
```

หน้าหลัก:

```text
Dashboard
Orders
Items
Customers
Promotions
Staff
Branches
Reports
Receipt
Branding
Payment Methods
Modules
Settings
Support
```

---

## 7.4 POS Terminal

Layout:

```text
Category ด้านซ้ายหรือด้านบน
Item grid ตรงกลาง
Cart ด้านขวา
Checkout ด้านล่างหรือขวา
ปุ่มใหญ่
ตอบสนองเร็ว
```

ต้องมี:

```text
Search
Barcode input
Hold Order
Open Orders
Checkout
Payment Method
Receipt Preview
```

---

## 7.5 Staff Order Mobile

Layout:

```text
Mobile first
เลือกโต๊ะ
เลือกเมนู
เลือก option
ตรวจ order
ส่ง order
```

ต้องไม่ให้ลูกค้าใช้สั่งเอง

---

## 7.6 Customer Display

Layout:

```text
Logo
รายการ order
ยอดรวม
QR
ชื่อธนาคาร
Payment Success
```

ไม่มี form, ไม่มี sidebar, ไม่มีปุ่มเยอะ

---

## 7.7 Kitchen / Bar Display

Layout:

```text
Kanban หรือ list
Pending
Preparing
Done
```

Card ต้องมี:

```text
Table
Order number
Items
Item note
Time waiting
```

---

# 8. Form Validation Guideline

## 8.1 หลักการ

ทุก form ต้องมี validation ชัดเจนทั้ง frontend และ backend

ใช้:

```text
Zod
```

---

## 8.2 Field บังคับตัวอย่าง

Business:

```text
name
slug
posType
currency
```

Item:

```text
name
type
categoryId
sellingPrice
unit
availableForSale
```

Order:

```text
branchId
orderType
items
```

Payment:

```text
orderId
paymentMethodId
amount
confirmedBy
```

Refund:

```text
refundType
refundAmount
reason
```

Stock Adjustment:

```text
branchId
items
reason
```

---

## 8.3 Error Message

Error ต้องชัด:

```text
กรุณากรอกชื่อสินค้า
ราคาขายต้องมากกว่า 0
กรุณาเลือก payment method
stock ไม่เพียงพอ
ไม่มีสิทธิ์ทำรายการนี้
```

---

# 9. Import XLSX Template Guideline

## 9.1 Template ที่ต้องมี

```text
Items Import Template
Customers Import Template
Staff Import Template
Opening Stock Import Template
Suppliers Import Template
Tables Import Template
Rooms Import Template
Promotions / Coupons Import Template
```

---

## 9.2 Items Import Template

Column แนะนำ:

```text
name
category
selling_price
cost_price
sku
barcode
unit
description
status
stock_tracking
initial_stock
minimum_stock
supplier
brand
size
color
expiry_date
```

---

## 9.3 Customers Import Template

```text
name
phone
email
birthday
gender
address
member_code
member_tier
points_balance
notes
```

---

## 9.4 Staff Import Template

```text
full_name
phone
email
role
branch_code
can_login
status
```

---

## 9.5 Opening Stock Template

```text
sku
barcode
item_name
branch_code
quantity
unit
average_cost
minimum_stock
note
```

---

## 9.6 Import Result

หลัง import ต้องแสดง:

```text
total rows
success rows
failed rows
error file
```

---

# 10. Report Formula Guideline

## 10.1 Sales

```text
Gross Sales = ยอดขายก่อน discount
Discount Total = ส่วนลดรวม
Net Sales = Gross Sales - Discount Total
Tax Total = ภาษีรวม
Service Charge = ค่าบริการ
Grand Total = Net Sales + Tax + Service Charge
```

---

## 10.2 Payment

```text
Total Cash
Total Bank Transfer
Total QR
Total Card
Total Other
```

---

## 10.3 Profit

```text
Gross Profit = Net Sales - Cost of Goods Sold
```

หมายเหตุ:

```text
ถ้าไม่มี cost_price ให้ profit อาจไม่สมบูรณ์
```

---

## 10.4 Inventory

```text
Current Stock
Low Stock Items
Stock In
Stock Out
Stock Adjustment
Stock Transfer
```

---

## 10.5 Staff Report

```text
Sales by staff
Orders by staff
Refunds by staff
Average order value by staff
```

---

## 10.6 Loyalty Report

```text
New members
Active members
Points earned
Points redeemed
VIP customers
```

---

## 10.7 Hospitality Report

```text
Occupancy Rate = Occupied Rooms / Total Rooms
Room Revenue
Extra Service Revenue
Average Daily Rate
```

---

# 11. Testing / QA Checklist

## 11.1 Auth

```text
Login success
Login wrong password
Refresh token
Logout
Permission denied
```

## 11.2 Business / Role

```text
Owner เห็นเมนูถูกต้อง
Manager เห็นเฉพาะที่ควรเห็น
Cashier เข้า POS ได้
Waiter เข้า Staff Order ได้
Kitchen เห็นเฉพาะ Kitchen Display
```

## 11.3 Items

```text
Create item
Edit item
Disable item
Search item
Scan barcode
Category filter
```

## 11.4 Orders / POS

```text
Create order
Add item
Change quantity
Add note
Hold order
Resume order
Checkout
Print bill
Cancel unpaid order
Prevent cancel paid order
```

## 11.5 Payments

```text
Cash payment
QR/bank payment
Confirm paid
Prevent double payment
Payment method inactive
```

## 11.6 Refund

```text
Full refund
Partial refund
Refund requires reason
Refund requires permission
Restock returned item
```

## 11.7 Inventory

```text
Stock in
Stock adjustment
Low stock warning
Prevent selling if stock not enough
Stock movement created after sale
```

## 11.8 Redis / Lock

```text
Confirm paid double click
Checkout lock
Refund lock
Cache invalidation after item update
POS bootstrap cache refresh
```

## 11.9 Import / Export

```text
Import success
Import with invalid rows
Error file generated
Export XLSX
Export PDF
Large export creates job
```

## 11.10 UI

```text
Loading state
Empty state
Error state
Disabled state
Confirm dialog
Toast
Alert
Sound
Vibration
```

---

# 12. Definition of Done

ฟีเจอร์หนึ่งถือว่าเสร็จเมื่อ:

```text
1. Schema ชัดเจน
2. API ชัดเจน
3. Permission ถูกต้อง
4. UI ทำงานครบ
5. Validation ครบ
6. Error handling ครบ
7. Loading/empty/error state มีครบ
8. Audit log มีถ้า action สำคัญ
9. Test case ผ่าน
10. เอกสารอัปเดตแล้ว
```

---

# 13. ข้อสรุปสุดท้าย

ส่วนที่เหลือของ TJ POS ต้องชี้แจงและทำตามลำดับนี้:

```text
1. Development Roadmap
2. Permission Matrix
3. API Request/Response Detail
4. Drizzle/Migration Guideline
5. UI Layout Guideline
6. Form Validation
7. Import XLSX Templates
8. Report Formula
9. Testing / QA Checklist
10. Definition of Done
```

เอกสารนี้ใช้เป็นแผนรวมสำหรับส่วน implementation detail ที่เหลือทั้งหมด เพื่อให้ทีม dev เดินต่อได้อย่างเป็นระบบ
