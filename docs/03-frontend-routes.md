# TJ POS — Frontend Routes Specification

**เวอร์ชัน:** Final Frontend Route Spec  
**ภาษา:** ไทย  
**สถานะ:** ชุดนี้สรุปเฉพาะ Frontend Routes ตามที่ตกลงกันล่าสุด  
**หมายเหตุ:** เอกสารนี้ยังไม่รวม API endpoints, database schema, deploy, Nginx หรือ production routing

---

## 1. ขอบเขตของเอกสารนี้

เอกสารนี้ใช้สำหรับชี้แจงเส้นทางหน้าเว็บและหน้าจอของระบบ TJ POS ฝั่ง Frontend เท่านั้น

ตอนนี้ชัดเจนว่าเราจะโฟกัสที่:

```text
Frontend Routes
Frontend App Separation
Route ตาม web / terminal
Route ตาม role
Route ตาม POS Type
```

ยังไม่ชี้แจงในเอกสารนี้:

```text
API endpoints
Database schema
Backend modules
Deploy routing
Nginx
Production domain
```

---

## 2. โครงสร้าง Frontend ที่ตกลงกัน

ระบบ Frontend ใช้ repository เดียวก่อน:

```text
frontend
```

ภายในแบ่งเป็น 2 app:

```text
frontend
├── apps
│   ├── web        → Next.js
│   └── terminal   → Vite React
```

Package manager ที่ใช้สำหรับ frontend:

```text
pnpm
```

กฎ:

```text
ใช้ pnpm สำหรับ install / dev / build / lint / typecheck
ไม่ใช้ npm หรือ yarn ใน frontend
ควรมี pnpm-workspace.yaml ที่ root ของ frontend
ควรกำหนด packageManager ใน frontend/package.json
```

---

## 3. `apps/web` — Next.js

`apps/web` ใช้สำหรับหน้าที่เป็น web, admin, report, setting และ public page

ใช้สำหรับ:

```text
เว็บไซต์หลักของ TJ POS
Platform Admin ของทีม TJ POS
Business Admin ของแต่ละร้าน
Reports
Settings
Branding
Receipt Designer
Payment Methods
Public Menu สำหรับลูกค้าดู
Contact / Pricing / Add-ons / FAQ/Help
```

---

## 4. `apps/terminal` — Vite React

`apps/terminal` ใช้สำหรับหน้าที่ต้องการความเร็วสูงและ interaction เยอะ

ใช้สำหรับ:

```text
POS ขายหน้าร้าน
Staff Order บนมือถือ
Customer Display
Kitchen / Bar Display
```

คำว่า `terminal` ในที่นี้หมายถึง POS Terminal หรือหน้าจอขาย ไม่ใช่ command line terminal

---

# 5. Routes ของ `apps/web` — Next.js

## 5.1 Public Website Routes

ใช้สำหรับลูกค้าที่ยังไม่ได้ใช้งาน TJ POS

ตามทิศทางล่าสุด เว็บไซต์หลักใช้ route จริงเพียงหน้าเดียว:

```text
/
```

เมนูในเว็บไซต์หลักไม่ใช่ route แยก แต่เป็น hash section ในหน้าเดียว:

```text
/
/#home
/#pos-types
/#features
/#pricing
/#add-ons
/#faq-help
/#contact
```

กฎสำคัญ:

```text
ห้ามสร้าง route แยกสำหรับ /pos-types, /features, /pricing, /add-ons, /faq-help, /contact
ห้ามสร้าง route /request-demo
ปุ่มในเว็บไซต์หลักให้เลื่อนไปยัง section ที่เกี่ยวข้องแทนการเปลี่ยนหน้า
```

### ภาษา

Public Website ใน `frontend/apps/web` รองรับเนื้อหาเว็บไซต์เฉพาะ 2 ภาษา:

```text
lo
en
```

กฎสำคัญ:

```text
ใช้เฉพาะกับเว็บไซต์หลักของ TJ POS
ไม่ใช้กับ Platform Admin
ไม่ใช้กับ Business Admin
ไม่ใช้กับ Public Menu ของร้าน
ไม่ใช้กับ apps/terminal
ไม่ใช้เป็น i18n กลางของระบบ
```

Section `/#pos-types` แนะนำ POS ทั้ง 5 ประเภท:

```text
Retail POS
Cafe POS
Restaurant POS
Beauty POS
Hospitality POS
```

## 5.2 Auth / Admin Entry Routes

ใช้สำหรับลูกค้าที่ทีม TJ POS setup account ให้แล้ว และใช้เป็นทางเข้า Platform Admin / Business Admin ตามสิทธิ์ผู้ใช้

```text
/login
```

หน้าเข้าสู่ระบบ

```text
/forgot-password
/reset-password
```

ลืมรหัสผ่าน / ตั้งรหัสผ่านใหม่

### Routes ที่ยังไม่เน้นใน MVP

```text
/register
/start-free
/try-demo
```

เหตุผล:

```text
Flow ปัจจุบันคือ ลูกค้าดูเว็บไซต์ → ติดต่อ TJ POS → ทีม TJ POS setup → ลูกค้า login ใช้งาน
```

ยังไม่ให้ลูกค้าสร้าง business จริงเอง

---

# 6. Platform Admin Routes — Next.js

Platform Admin ใช้โดยทีม TJ POS เพื่อจัดการระบบทั้งหมด

Base route:

```text
/platform-admin
```

## 6.1 Dashboard

```text
/platform-admin
/platform-admin/dashboard
```

ใช้ดูภาพรวมระบบ เช่น จำนวนร้าน, ร้านที่ active, แพ็กเกจที่ใกล้หมดอายุ, คำขอ support

## 6.2 Businesses

```text
/platform-admin/businesses
/platform-admin/businesses/create
/platform-admin/businesses/[businessId]
/platform-admin/businesses/[businessId]/edit
```

ใช้จัดการ business หรือร้านของลูกค้า

ตัวอย่างหน้าที่ใช้:

```text
รายการร้านทั้งหมด
สร้างร้านใหม่ให้ลูกค้า
ดูรายละเอียดร้าน
แก้ไขข้อมูลร้าน
เปิด/ปิดสถานะร้าน
```

## 6.3 Users

```text
/platform-admin/users
/platform-admin/users/[userId]
```

ใช้จัดการบัญชีผู้ใช้ เช่น owner, staff, platform admin

## 6.4 Plans

```text
/platform-admin/plans
/platform-admin/plans/[planId]
```

ใช้จัดการแพ็กเกจบริการ เช่น Starter, Pro, Business, Enterprise

## 6.5 Subscriptions

```text
/platform-admin/subscriptions
/platform-admin/subscriptions/[subscriptionId]
```

ใช้จัดการแพ็กเกจที่แต่ละ business ใช้งาน เช่น วันหมดอายุ, สถานะ, การต่ออายุ

## 6.6 Add-ons

```text
/platform-admin/add-ons
```

ใช้จัดการ add-on เช่น Customer Display, Staff Order, Smart Menu, Advanced Inventory

```text
/platform-admin/add-ons/catalog
```

ใช้จัดการ global modules catalog ที่ระบบสามารถเปิดให้ business ใช้งานได้

## 6.7 Payments

```text
/platform-admin/payments
```

ใช้จัดการการชำระเงินแบบ manual, การต่ออายุ, บันทึกการจ่ายเงินของลูกค้า

```text
/platform-admin/payments/settings
```

ใช้ตั้งค่า master bank / payment config สำหรับระบบ

## 6.8 Contact Requests

```text
/platform-admin/contact-requests
/platform-admin/contact-requests/[requestId]
```

ใช้ดูคำขอติดต่อจากเว็บไซต์หลัก

## 6.9 Support Tickets

```text
/platform-admin/support-tickets
/platform-admin/support-tickets/[ticketId]
```

ใช้ดู ticket จากลูกค้า เช่น bug, feedback, feature request, support

## 6.10 System Settings

```text
/platform-admin/system-settings
```

ใช้ตั้งค่าระบบรวม

```text
/platform-admin/system-settings/notification-templates
```

ใช้จัดการ template การแจ้งเตือนของระบบ

## 6.11 Audit Logs

```text
/platform-admin/audit-logs
```

ใช้ดูประวัติการกระทำสำคัญของระบบ

## 6.12 Profile & Security

```text
/platform-admin/profile-security
```

ใช้จัดการ profile และ security ของ Platform Admin ที่ login อยู่

---

# 7. Business Workspace / Business Admin Routes — Next.js

Business Workspace เป็นพื้นที่ของแต่ละร้านในระบบเดียวกัน

Base route:

```text
/b/[businessSlug]
```

ตัวอย่าง:

```text
/b/tj-cafe
/b/tj-mini-mart
/b/tj-spa
```

## 7.1 Dashboard

```text
/b/[businessSlug]
/b/[businessSlug]/dashboard
```

Dashboard ของ business นั้น

## 7.2 Orders

```text
/b/[businessSlug]/orders
/b/[businessSlug]/orders/[orderId]
```

ใช้ดูรายการ order และรายละเอียด order

## 7.3 Payments

```text
/b/[businessSlug]/payments
```

ใช้ดูรายการชำระเงินของ business

## 7.4 Items

```text
/b/[businessSlug]/items
/b/[businessSlug]/items/create
/b/[businessSlug]/items/[itemId]
/b/[businessSlug]/items/[itemId]/edit
```

ใช้จัดการสิ่งที่ขาย:

```text
Retail → Products
Cafe / Restaurant → Menu Items
Beauty → Services
Hospitality → Rooms / Extra Services
```

## 7.5 Categories

```text
/b/[businessSlug]/categories
```

ใช้จัดการหมวดหมู่สินค้า เมนู บริการ หรือห้อง

## 7.6 Inventory

```text
/b/[businessSlug]/inventory
/b/[businessSlug]/inventory/stock-in
/b/[businessSlug]/inventory/adjustment
```

ใช้จัดการ stock, การนำเข้า stock, การปรับ stock

## 7.7 Suppliers

```text
/b/[businessSlug]/suppliers
```

ใช้จัดการผู้จัดหา/ซัพพลายเออร์

## 7.8 Customers

```text
/b/[businessSlug]/customers
/b/[businessSlug]/customers/[customerId]
```

ใช้จัดการ customer profile หรือ member profile

## 7.9 Loyalty

```text
/b/[businessSlug]/loyalty
```

ใช้จัดการระบบสะสมแต้ม, VIP, membership

หมายเหตุ:

```text
ขายปกติไม่จำเป็นต้องมี customer profile
customer profile ใช้เมื่อเปิด loyalty / membership เท่านั้น
```

## 7.10 Promotions

```text
/b/[businessSlug]/promotions
```

ใช้จัดการโปรโมชั่น, coupon, combo, happy hour

## 7.11 Staff

```text
/b/[businessSlug]/staff
/b/[businessSlug]/staff/create
/b/[businessSlug]/staff/[staffId]
```

ใช้จัดการพนักงานและ role

## 7.12 Branches

```text
/b/[businessSlug]/branches
/b/[businessSlug]/branches/create
/b/[businessSlug]/branches/[branchId]
```

ใช้จัดการสาขาหรือจุดขาย

## 7.13 Devices

```text
/b/[businessSlug]/devices
```

ใช้จัดการเครื่อง POS, printer, customer display, kitchen display

## 7.14 Reports

```text
/b/[businessSlug]/reports
```

ใช้ดูรายงานของ business

## 7.15 Receipt / Bill

```text
/b/[businessSlug]/receipt
```

ใช้ตั้งค่า template บิล, paper size, footer, QR, bank info, field ที่ต้องการแสดง

## 7.16 Branding

```text
/b/[businessSlug]/branding
```

ใช้ตั้งค่า logo, สี, banner, style ของ menu และ customer display

## 7.17 Payment Methods

```text
/b/[businessSlug]/payment-methods
```

ใช้ตั้งค่า payment methods เช่น Cash, Bank Transfer, QR Payment, Card

## 7.18 Modules

```text
/b/[businessSlug]/modules
```

ใช้เปิด/ปิด module เช่น Customer Display, Staff Order, Kitchen Display, Loyalty, Smart Menu

## 7.19 Settings

```text
/b/[businessSlug]/settings
```

ใช้ตั้งค่าทั่วไปของ business

## 7.20 Support

```text
/b/[businessSlug]/support
```

ใช้ส่ง support, feedback, bug report, feature request ไปยังทีม TJ POS

---

# 8. Business Workspace Routes ตาม POS Type

Routes กลุ่มนี้จะแสดงเฉพาะเมื่อ POS Type หรือ module ที่เกี่ยวข้องถูกเปิด

---

## 8.1 Retail POS Routes

ใช้สำหรับร้านค้าปลีก, mini mart, แฟชั่น, เครื่องสำอาง, decor

```text
/b/[businessSlug]/items
/b/[businessSlug]/categories
/b/[businessSlug]/inventory
/b/[businessSlug]/inventory/stock-in
/b/[businessSlug]/inventory/adjustment
/b/[businessSlug]/suppliers
/b/[businessSlug]/barcode-labels
```

ความหมาย:

```text
Products
Categories
Inventory
Stock In
Stock Adjustment
Suppliers
Barcode Labels
```

---

## 8.2 Cafe POS Routes

ใช้สำหรับ cafe, ชานม, ร้านน้ำ, bakery เล็ก

```text
/b/[businessSlug]/menu-items
/b/[businessSlug]/categories
/b/[businessSlug]/options
/b/[businessSlug]/toppings
/b/[businessSlug]/tables
/b/[businessSlug]/bar-orders
/b/[businessSlug]/qr-menu
```

ความหมาย:

```text
Menu Items
Size / Options
Toppings
Sugar / Ice
Tables ถ้ามีที่นั่ง
Bar Orders
QR Menu
```

---

## 8.3 Restaurant POS Routes

ใช้สำหรับร้านอาหาร, ร้านลาบ, หมูกระทะ, ปิ้งย่าง, buffet เล็ก

```text
/b/[businessSlug]/tables
/b/[businessSlug]/areas
/b/[businessSlug]/kitchen
/b/[businessSlug]/split-bill
/b/[businessSlug]/service-charge
```

ความหมาย:

```text
Table Map
Areas
Kitchen Display
Split Bill
Service Charge
```

---

## 8.4 Beauty POS Routes

ใช้สำหรับ spa, salon, nail, massage, barber

```text
/b/[businessSlug]/appointments
/b/[businessSlug]/calendar
/b/[businessSlug]/services
/b/[businessSlug]/packages
/b/[businessSlug]/commission
/b/[businessSlug]/customer-history
```

ความหมาย:

```text
Appointments
Calendar
Services
Packages / Treatment Course
Commission
Customer History
```

---

## 8.5 Hospitality POS Routes

ใช้สำหรับ guesthouse, homestay, hotel เล็ก, hostel, villa

```text
/b/[businessSlug]/rooms
/b/[businessSlug]/room-calendar
/b/[businessSlug]/bookings
/b/[businessSlug]/check-in
/b/[businessSlug]/check-out
/b/[businessSlug]/guests
/b/[businessSlug]/housekeeping
```

ความหมาย:

```text
Rooms
Room Calendar
Bookings
Check-in
Check-out
Guests
Housekeeping
```

---

# 9. Public Menu Routes — Next.js

ใช้สำหรับลูกค้าดู menu หรือสินค้า ไม่ให้ลูกค้าสั่งเอง

```text
/menu/[businessSlug]
```

เมนู public ของ business

```text
/menu/[businessSlug]/[branchSlug]
```

เมนูตามสาขา

```text
/menu/[businessSlug]/[branchSlug]/[categorySlug]
```

เมนูตาม category

```text
/menu/[businessSlug]/item/[itemId]
```

รายละเอียด item

```text
/q/[qrCode]
```

QR code ตามโต๊ะหรือสาขา ระบบจะรู้ว่าเป็น business, branch และ table ใด

ตัวอย่าง:

```text
/menu/tj-cafe
/menu/tj-cafe/main-branch
/q/8K2XQ9
```

ข้อสรุป:

```text
Public Menu ใช้ดูเท่านั้น
ไม่สร้าง order
ไม่ชำระเงิน
ไม่ส่ง order เข้า kitchen/bar
```

---

# 10. Routes ของ `apps/terminal` — Vite React

`terminal` คือ app สำหรับใช้งานที่จุดขาย ไม่ใช่ command line terminal

ใช้สำหรับ:

```text
POS ขายหน้าร้าน
Staff Order mobile
Customer Display
Kitchen / Bar Display
```

Base route:

```text
/terminal/b/[businessSlug]
```

---

## 10.1 POS Sales Routes

```text
/terminal/b/[businessSlug]/pos
```

หน้าจอ POS หลัก

```text
/terminal/b/[businessSlug]/pos/new-sale
```

สร้าง order ใหม่

```text
/terminal/b/[businessSlug]/pos/open-orders
```

order ที่ยังเปิดอยู่

```text
/terminal/b/[businessSlug]/pos/held-orders
```

order ที่พักไว้

```text
/terminal/b/[businessSlug]/pos/checkout
```

ชำระเงิน

```text
/terminal/b/[businessSlug]/pos/receipt-preview
```

ดูตัวอย่างบิล

```text
/terminal/b/[businessSlug]/pos/refund
```

คืนสินค้า / คืนเงิน

---

## 10.2 Staff Order Mobile Routes

ใช้โดย waiter หรือพนักงานบริการ ลูกค้าไม่ใช้หน้านี้

```text
/terminal/b/[businessSlug]/staff-order
```

หน้าหลัก Staff Order

```text
/terminal/b/[businessSlug]/staff-order/tables
```

รายชื่อโต๊ะ

```text
/terminal/b/[businessSlug]/staff-order/table/[tableId]
```

รับ order ตามโต๊ะ

```text
/terminal/b/[businessSlug]/staff-order/review
```

ตรวจ order ก่อนส่ง

---

## 10.3 Customer Display Routes

ใช้สำหรับจอที่ลูกค้ามองเห็นหน้าเคาน์เตอร์

```text
/terminal/b/[businessSlug]/display
```

Customer Display ค่าเริ่มต้น

```text
/terminal/b/[businessSlug]/display/[deviceId]
```

Customer Display ตามอุปกรณ์

```text
/terminal/b/[businessSlug]/display/pair
```

จับคู่จอลูกค้ากับ POS device

---

## 10.4 Kitchen / Bar Display Routes

ใช้สำหรับ Cafe / Restaurant ถ้าเปิด module

```text
/terminal/b/[businessSlug]/kitchen
```

หน้าจอครัว

```text
/terminal/b/[businessSlug]/bar
```

หน้าจอ bar

```text
/terminal/b/[businessSlug]/kitchen/ticket/[ticketId]
```

รายละเอียดใบครัว

---

# 11. Route ใดอยู่ใน app ใด

| Route | App |
|---|---|
| `/` | `frontend/apps/web` |
| `/#pos-types` | `frontend/apps/web` |
| `/#features` | `frontend/apps/web` |
| `/#pricing` | `frontend/apps/web` |
| `/#add-ons` | `frontend/apps/web` |
| `/#faq-help` | `frontend/apps/web` |
| `/#contact` | `frontend/apps/web` |
| `/login` | `frontend/apps/web` |
| `/forgot-password` | `frontend/apps/web` |
| `/reset-password` | `frontend/apps/web` |
| `/platform-admin/...` | `frontend/apps/web` |
| `/b/[businessSlug]/...` | `frontend/apps/web` |
| `/menu/[businessSlug]` | `frontend/apps/web` |
| `/q/[qrCode]` | `frontend/apps/web` |
| `/terminal/b/[businessSlug]/pos` | `frontend/apps/terminal` |
| `/terminal/b/[businessSlug]/staff-order` | `frontend/apps/terminal` |
| `/terminal/b/[businessSlug]/display` | `frontend/apps/terminal` |
| `/terminal/b/[businessSlug]/kitchen` | `frontend/apps/terminal` |
| `/terminal/b/[businessSlug]/bar` | `frontend/apps/terminal` |

---

# 12. Route แสดงตาม Role

## Platform Admin

```text
/platform-admin/...
```

เห็นทุก route ของ Platform Admin

---

## Owner

```text
/b/[businessSlug]/dashboard
/b/[businessSlug]/orders
/b/[businessSlug]/items
/b/[businessSlug]/customers
/b/[businessSlug]/promotions
/b/[businessSlug]/staff
/b/[businessSlug]/branches
/b/[businessSlug]/devices
/b/[businessSlug]/reports
/b/[businessSlug]/receipt
/b/[businessSlug]/branding
/b/[businessSlug]/payment-methods
/b/[businessSlug]/modules
/b/[businessSlug]/settings
/b/[businessSlug]/support
```

---

## Manager

```text
/b/[businessSlug]/dashboard
/b/[businessSlug]/orders
/b/[businessSlug]/items
/b/[businessSlug]/customers
/b/[businessSlug]/promotions
/b/[businessSlug]/staff
/b/[businessSlug]/reports
/b/[businessSlug]/support
```

---

## Cashier

```text
/terminal/b/[businessSlug]/pos
/terminal/b/[businessSlug]/pos/open-orders
/terminal/b/[businessSlug]/pos/held-orders
/terminal/b/[businessSlug]/pos/checkout
/terminal/b/[businessSlug]/pos/receipt-preview
```

---

## Waiter

```text
/terminal/b/[businessSlug]/staff-order
/terminal/b/[businessSlug]/staff-order/tables
/terminal/b/[businessSlug]/staff-order/table/[tableId]
```

---

## Kitchen / Bar

```text
/terminal/b/[businessSlug]/kitchen
/terminal/b/[businessSlug]/bar
```

---

## Receptionist

ใช้กับ Hospitality POS

```text
/b/[businessSlug]/rooms
/b/[businessSlug]/room-calendar
/b/[businessSlug]/bookings
/b/[businessSlug]/check-in
/b/[businessSlug]/check-out
/b/[businessSlug]/guests
```

---

# 13. ขอบเขตที่ชัดเจนตอนนี้

ตอนนี้ชี้แจงเฉพาะ:

```text
Frontend routes
การแยก app ฝั่ง frontend
Route ตาม web / terminal
Route ตาม role
Route ตาม POS Type
```

ยังไม่ชี้แจง:

```text
API endpoints
Database schema
Backend modules
Deploy routing
Nginx
Production domain
```

---

# 14. ข้อสรุปสุดท้าย

```text
frontend/apps/web = Next.js
→ เว็บไซต์หลัก, Platform Admin, Business Admin, Public Menu

frontend/apps/terminal = Vite React
→ POS ขายหน้าร้าน, Staff Order, Customer Display, Kitchen/Bar Display
```

Routes ทั้งหมดในเอกสารนี้ใช้สำหรับเริ่มออกแบบ UI และ flow frontend ก่อน ยังไม่ใช่ API spec
