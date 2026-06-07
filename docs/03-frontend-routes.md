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

หมายเหตุล่าสุด 2026-06-07:

```text
`apps/web` ใช้สำหรับเว็บไซต์หลักของ TJ POS เท่านั้น
ไม่ใช้สำหรับ Platform Admin, Business Admin หรือ Public Menu แล้ว
Platform Admin จะถูกแยกไป `frontend/apps/platform-admin`
Business Admin และ Public Menu อยู่ใน Vite app แยกตามแผน `16-frontend-vite-migration-plan.md`
```

`apps/web` ใช้สำหรับ public website หลักของ TJ POS เท่านั้น

ใช้สำหรับ:

```text
เว็บไซต์หลักของ TJ POS
Contact / Pricing / Add-ons / FAQ/Help
```

---

## 4. `apps/terminal` — Vite React

หมายเหตุล่าสุด 2026-06-07:

```text
`apps/terminal` ใช้สำหรับ POS Terminal
Staff Order, Kitchen / Bar Display, Customer Display และ Public Menu จะมี Vite app แยกตามโครงสร้างเป้าหมาย
ระหว่าง migration สามารถมี route เดิมใน terminal ชั่วคราวได้ แต่ source of truth เป้าหมายให้ยึด section Route Ownership ด้านล่าง
```

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
ห้ามสร้าง route แยกสำหรับเมนูเว็บไซต์หลัก
ห้ามสร้าง route demo แยก
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

กฎสำคัญ:

```text
เว็บไซต์หลักไม่มีปุ่มหรือ link ไป /login
/login ใช้เข้าผ่าน URL โดยตรง หรือ flow ภายในหลังทีม TJ POS setup account ให้แล้ว
```

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

# 7. Business Workspace / Business Admin Routes — Vite React

Business Workspace เป็นพื้นที่ของแต่ละร้านในระบบเดียวกัน

Base route:

```text
/business-admin/[businessSlug]
```

ตัวอย่าง:

```text
/business-admin/tj-cafe
/business-admin/tj-mini-mart
/business-admin/tj-spa
```

เป้าหมายของ Business Workspace:

```text
ให้แต่ละร้านสามารถจัดการและแก้ไขข้อมูลของตัวเองได้ตาม role, permission, plan, POS Type และ enabled modules
```

กฎ route สำคัญ:

```text
ใช้ `/business-admin/[businessSlug]/...` เป็น route production หลัง login
`/business-admin` ใช้เป็นหน้าเลือก business หรือ redirect หลัง login ได้
ห้ามใช้ `/b/[businessSlug]/...` เป็น route admin เพราะ `/b` เป็น public URL ของร้าน
ไม่ใช้ `/b/{businessSlug}`
```

## 7.1 Dashboard

```text
/business-admin/[businessSlug]
/business-admin/[businessSlug]/dashboard
```

Dashboard ของ business นั้น

## 7.2 Business Profile

```text
/business-admin/[businessSlug]/profile
```

ใช้แก้ข้อมูลร้าน เช่น ชื่อร้าน, logo, สี, ข้อมูลติดต่อ และข้อมูลพื้นฐานของ business

## 7.3 Orders

```text
/business-admin/[businessSlug]/orders
/business-admin/[businessSlug]/orders/[orderId]
```

ใช้ดูรายการ order และรายละเอียด order

## 7.4 Payments

```text
/business-admin/[businessSlug]/payments
```

ใช้ดูรายการชำระเงินของ business

## 7.5 Items

```text
/business-admin/[businessSlug]/items
/business-admin/[businessSlug]/items/create
/business-admin/[businessSlug]/items/[itemId]
/business-admin/[businessSlug]/items/[itemId]/edit
```

ใช้จัดการสิ่งที่ขาย:

```text
Retail → Products
Cafe / Restaurant → Menu Items
Beauty → Services
Hospitality → Rooms / Extra Services
```

## 7.6 Categories

```text
/business-admin/[businessSlug]/categories
```

ใช้จัดการหมวดหมู่สินค้า เมนู บริการ หรือห้อง

## 7.7 Inventory

```text
/business-admin/[businessSlug]/inventory
/business-admin/[businessSlug]/stock-movements
/business-admin/[businessSlug]/stock-in
/business-admin/[businessSlug]/stock-adjustment
```

ใช้จัดการ stock, การนำเข้า stock, การปรับ stock และดูประวัติ movement

## 7.8 Suppliers

```text
/business-admin/[businessSlug]/suppliers
/business-admin/[businessSlug]/suppliers/create
```

ใช้จัดการผู้จัดหา/ซัพพลายเออร์

## 7.9 Purchase Receipts

```text
/business-admin/[businessSlug]/purchase-receipts
/business-admin/[businessSlug]/purchase-receipts/[receiptId]
```

ใช้จัดการเอกสารรับสินค้าเข้าและเชื่อมกับ supplier / stock in

## 7.10 Customers

```text
/business-admin/[businessSlug]/customers
/business-admin/[businessSlug]/customers/[customerId]
```

ใช้จัดการ customer profile หรือ member profile

## 7.11 Loyalty

```text
/business-admin/[businessSlug]/loyalty
```

ใช้จัดการระบบสะสมแต้ม, VIP, membership

หมายเหตุ:

```text
ขายปกติไม่จำเป็นต้องมี customer profile
customer profile ใช้เมื่อเปิด loyalty / membership เท่านั้น
```

## 7.12 Promotions

```text
/business-admin/[businessSlug]/promotions
/business-admin/[businessSlug]/promotions/create
```

ใช้จัดการโปรโมชั่น, coupon, combo, happy hour

## 7.13 Staff

```text
/business-admin/[businessSlug]/staff
/business-admin/[businessSlug]/staff/create
/business-admin/[businessSlug]/staff/[staffId]
```

ใช้จัดการพนักงานและ role

## 7.14 Roles & Permissions

```text
/business-admin/[businessSlug]/roles-permissions
```

ใช้จัดการ role และ permission ภายในร้าน

## 7.15 Branches

```text
/business-admin/[businessSlug]/branches
/business-admin/[businessSlug]/branches/create
/business-admin/[businessSlug]/branches/[branchId]
```

ใช้จัดการสาขาหรือจุดขาย

## 7.16 Devices

```text
/business-admin/[businessSlug]/devices
```

ใช้จัดการเครื่อง POS, printer, customer display, kitchen display

## 7.17 Reports

```text
/business-admin/[businessSlug]/reports
```

ใช้ดูรายงานของ business

## 7.18 Receipt / Bill

```text
/business-admin/[businessSlug]/receipt-bill
```

ใช้ตั้งค่า template บิล, paper size, footer, QR, bank info, field ที่ต้องการแสดง

## 7.19 Branding

```text
/business-admin/[businessSlug]/branding
```

ใช้ตั้งค่า logo, สี, banner, style ของ menu และ customer display

## 7.20 Payment Methods

```text
/business-admin/[businessSlug]/payment-methods
```

ใช้ตั้งค่า payment methods เช่น Cash, Bank Transfer, QR Payment, Card

## 7.21 Modules

```text
/business-admin/[businessSlug]/modules
```

ใช้เปิด/ปิด module เช่น Customer Display, Staff Order, Kitchen Display, Loyalty, Smart Menu

## 7.22 Import / Export

```text
/business-admin/[businessSlug]/import
/business-admin/[businessSlug]/export
```

ใช้ import/export ข้อมูล เช่น items, customers, staff, opening stock, orders, payments, inventory

## 7.23 Settings

```text
/business-admin/[businessSlug]/settings
```

ใช้ตั้งค่าทั่วไปของ business

## 7.24 Support

```text
/business-admin/[businessSlug]/support
```

ใช้ส่ง support, feedback, bug report, feature request ไปยังทีม TJ POS

## 7.25 Audit Logs

```text
/business-admin/[businessSlug]/audit-logs
```

ใช้ดูประวัติการกระทำสำคัญใน business ตาม permission

---

# 8. Business Workspace Routes ตาม POS Type

Routes กลุ่มนี้จะแสดงเฉพาะเมื่อ POS Type หรือ module ที่เกี่ยวข้องถูกเปิด

---

## 8.1 Retail POS Routes

ใช้สำหรับร้านค้าปลีก, mini mart, แฟชั่น, เครื่องสำอาง, decor

```text
/business-admin/[businessSlug]/items
/business-admin/[businessSlug]/categories
/business-admin/[businessSlug]/inventory
/business-admin/[businessSlug]/stock-in
/business-admin/[businessSlug]/stock-adjustment
/business-admin/[businessSlug]/stock-movements
/business-admin/[businessSlug]/stock-count
/business-admin/[businessSlug]/low-stock-expiry
/business-admin/[businessSlug]/goods-receiving
/business-admin/[businessSlug]/returns
/business-admin/[businessSlug]/suppliers
/business-admin/[businessSlug]/purchase-receipts
/business-admin/[businessSlug]/barcode-labels
```

ความหมาย:

```text
Products
Categories
Inventory
Stock In
Stock Adjustment
Stock Movements
Stock Count
Low Stock / Expiry
Goods Receiving
Returns / Exchange
Suppliers
Purchase Receipts
Barcode Labels
```

---

## 8.2 Cafe POS Routes

ใช้สำหรับ cafe, ชานม, ร้านน้ำ, bakery เล็ก

```text
/business-admin/[businessSlug]/items
/business-admin/[businessSlug]/categories
/business-admin/[businessSlug]/tables
/business-admin/[businessSlug]/modifiers
/business-admin/[businessSlug]/barista-queue
/business-admin/[businessSlug]/happy-hour
/business-admin/[businessSlug]/cafe-daily-view
/display/b/[businessSlug]/pickup-display
```

ความหมาย:

```text
Menu Items
Categories
Cafe Floor Table Map
Coffee Modifiers / Recipe Options
Barista Queue Detail
Happy Hour / Combo Setup
Cafe Daily Quick View
Queue Pickup Screen
```

หมายเหตุ: `Queue Pickup Screen` เป็น route ของ `frontend/apps/terminal` เพราะเป็นจอ display ให้ลูกค้าดูคิว ไม่ใช่หน้า admin form.

---

## 8.3 Restaurant POS Routes

ใช้สำหรับร้านอาหาร, ร้านลาบ, หมูกระทะ, ปิ้งย่าง, buffet เล็ก

```text
/business-admin/[businessSlug]/tables
/business-admin/[businessSlug]/reservations
/business-admin/[businessSlug]/kitchen-courses
/business-admin/[businessSlug]/split-bill
/business-admin/[businessSlug]/service-charge
/business-admin/[businessSlug]/merge-transfer-table
/business-admin/[businessSlug]/end-of-day
```

ความหมาย:

```text
Table Map
Reservation Book
Kitchen Course Management
Split Bill
Service Charge / Tax Preview
Merge / Transfer Table
Restaurant End-of-Day Summary
```

หมายเหตุ: `/business-admin/[businessSlug]/tables` เป็น route table map กลางตาม POS Type. ถ้า business เป็น Cafe ให้แสดง Cafe Floor Table Map; ถ้า business เป็น Restaurant ให้แสดง Restaurant Areas / Tables.

---

## 8.4 Beauty POS Routes

ใช้สำหรับ spa, salon, nail, massage, barber

```text
/business-admin/[businessSlug]/appointments
/business-admin/[businessSlug]/appointments/create
/business-admin/[businessSlug]/calendar
/business-admin/[businessSlug]/bookings
/business-admin/[businessSlug]/walk-in
/business-admin/[businessSlug]/services
/business-admin/[businessSlug]/staff-schedule
/business-admin/[businessSlug]/packages
/business-admin/[businessSlug]/commission
/business-admin/[businessSlug]/customer-history
/business-admin/[businessSlug]/deposit-policy
/business-admin/[businessSlug]/beauty-daily-schedule
```

ความหมาย:

```text
Appointments
Calendar
Bookings
Walk-in
Services
Staff Schedule
Packages / Treatment Course
Commission
Customer History
Deposit Policy
Beauty Daily Schedule
```

---

## 8.5 Hospitality POS Routes

ใช้สำหรับ guesthouse, homestay, hotel เล็ก, hostel, villa

```text
/business-admin/[businessSlug]/rooms
/business-admin/[businessSlug]/room-calendar
/business-admin/[businessSlug]/bookings
/business-admin/[businessSlug]/bookings/create
/business-admin/[businessSlug]/front-desk
/business-admin/[businessSlug]/check-in
/business-admin/[businessSlug]/check-out
/business-admin/[businessSlug]/guests
/business-admin/[businessSlug]/housekeeping
/business-admin/[businessSlug]/room-settings
/business-admin/[businessSlug]/guest-folio
/business-admin/[businessSlug]/deposit-cancellation-policy
```

ความหมาย:

```text
Rooms
Room Calendar
Bookings
Create Booking
Front Desk
Check-in
Check-out
Guests
Housekeeping
Room Settings
Guest Folio
Deposit / Cancellation Policy
```

---

# 9. Public Menu Routes — Vite React

ใช้สำหรับลูกค้าดู menu หรือสินค้า ไม่ให้ลูกค้าสั่งเอง

`/b/[businessSlug]` คือ public URL ของแต่ละร้าน ไม่ต้อง login และใช้สำหรับลูกค้า/QR menu

```text
/b/[businessSlug]
```

หน้า public landing ของ business

```text
/b/[businessSlug]/menu
```

เมนู public ของ business

```text
/b/[businessSlug]/menu/[itemSlug]
```

รายละเอียด item

```text
/b/[businessSlug]/info
```

ข้อมูลร้าน เวลาเปิดปิด และช่องทางติดต่อ

```text
/b/[businessSlug]/book
```

Booking / appointment ถ้า POS Type หรือ module รองรับ

```text
/b/[businessSlug]/branch/[branchSlug]/menu
```

เมนูตามสาขา

```text
/q/[qrCode]
```

QR code ตามโต๊ะหรือสาขา ระบบจะรู้ว่าเป็น business, branch และ table ใด

ตัวอย่าง:

```text
/b/tj-cafe-vientiane
/b/tj-cafe-vientiane/menu
/b/tj-cafe-vientiane/menu/iced-latte
/b/tj-cafe-vientiane/info
/b/tj-cafe-vientiane/branch/main-branch/menu
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
/staff-order/b/[businessSlug]
```

หน้าหลัก Staff Order

```text
/staff-order/b/[businessSlug]/tables
```

รายชื่อโต๊ะ

```text
/staff-order/b/[businessSlug]/table/[tableId]
```

รับ order ตามโต๊ะ

```text
/staff-order/b/[businessSlug]/review
```

ตรวจ order ก่อนส่ง

---

## 10.3 Customer Display Routes

ใช้สำหรับจอที่ลูกค้ามองเห็นหน้าเคาน์เตอร์

```text
/display/b/[businessSlug]
```

Customer Display ค่าเริ่มต้น

```text
/display/b/[businessSlug]/[deviceId]
```

Customer Display ตามอุปกรณ์

```text
/display/b/[businessSlug]/pair
/display/b/[businessSlug]/pickup-display
```

จับคู่จอลูกค้ากับ POS device

---

## 10.4 Kitchen / Bar Display Routes

ใช้สำหรับ Cafe / Restaurant ถ้าเปิด module

```text
/kitchen/b/[businessSlug]
```

หน้าจอครัว

```text
/bar/b/[businessSlug]
```

หน้าจอ bar

```text
/kitchen/b/[businessSlug]/ticket/[ticketId]
```

รายละเอียดใบครัว

---

# 11. Route ใดอยู่ใน app ใด

| Route                                              | App                                                                |
| -------------------------------------------------- | ------------------------------------------------------------------ |
| `/`                                                | `frontend/apps/web`                                                |
| `/#pos-types`                                      | `frontend/apps/web`                                                |
| `/#features`                                       | `frontend/apps/web`                                                |
| `/#pricing`                                        | `frontend/apps/web`                                                |
| `/#add-ons`                                        | `frontend/apps/web`                                                |
| `/#faq-help`                                       | `frontend/apps/web`                                                |
| `/#contact`                                        | `frontend/apps/web`                                                |
| `/login`                                           | `frontend/apps/platform-admin` หรือ auth entry กลางตาม deploy จริง |
| `/forgot-password`                                 | `frontend/apps/platform-admin` หรือ auth entry กลางตาม deploy จริง |
| `/reset-password`                                  | `frontend/apps/platform-admin` หรือ auth entry กลางตาม deploy จริง |
| `/platform-admin/...`                              | `frontend/apps/platform-admin`                                     |
| `/business-admin/[businessSlug]/...`               | `frontend/apps/business-admin`                                     |
| `/business-admin/[businessSlug]/profile`           | `frontend/apps/business-admin`                                     |
| `/business-admin/[businessSlug]/inventory`         | `frontend/apps/business-admin`                                     |
| `/business-admin/[businessSlug]/stock-movements`   | `frontend/apps/business-admin`                                     |
| `/business-admin/[businessSlug]/stock-in`          | `frontend/apps/business-admin`                                     |
| `/business-admin/[businessSlug]/stock-adjustment`  | `frontend/apps/business-admin`                                     |
| `/business-admin/[businessSlug]/purchase-receipts` | `frontend/apps/business-admin`                                     |
| `/business-admin/[businessSlug]/roles-permissions` | `frontend/apps/business-admin`                                     |
| `/business-admin/[businessSlug]/import`            | `frontend/apps/business-admin`                                     |
| `/business-admin/[businessSlug]/export`            | `frontend/apps/business-admin`                                     |
| `/business-admin/[businessSlug]/audit-logs`        | `frontend/apps/business-admin`                                     |
| `/business-admin/[businessSlug]/tables`            | `frontend/apps/business-admin`                                     |
| `/business-admin/[businessSlug]/modifiers`         | `frontend/apps/business-admin`                                     |
| `/business-admin/[businessSlug]/barista-queue`     | `frontend/apps/business-admin`                                     |
| `/business-admin/[businessSlug]/happy-hour`        | `frontend/apps/business-admin`                                     |
| `/business-admin/[businessSlug]/cafe-daily-view`   | `frontend/apps/business-admin`                                     |
| `/b/[businessSlug]`                                | `frontend/apps/public-menu`                                        |
| `/b/[businessSlug]/menu`                           | `frontend/apps/public-menu`                                        |
| `/b/[businessSlug]/menu/[itemSlug]`                | `frontend/apps/public-menu`                                        |
| `/b/[businessSlug]/info`                           | `frontend/apps/public-menu`                                        |
| `/b/[businessSlug]/book`                           | `frontend/apps/public-menu`                                        |
| `/b/[businessSlug]/branch/[branchSlug]/menu`       | `frontend/apps/public-menu`                                        |
| `/q/[qrCode]`                                      | `frontend/apps/public-menu`                                        |
| `/terminal/b/[businessSlug]/pos`                   | `frontend/apps/terminal`                                           |
| `/staff-order/b/[businessSlug]/...`                | `frontend/apps/staff-order`                                        |
| `/display/b/[businessSlug]/...`                    | `frontend/apps/customer-display`                                   |
| `/kitchen/b/[businessSlug]/...`                    | `frontend/apps/kitchen-display`                                    |
| `/bar/b/[businessSlug]/...`                        | `frontend/apps/kitchen-display`                                    |

หมายเหตุ:

```text
ใน Next.js docs ใช้ `[businessSlug]`
ใน Vite / React Router implementation ให้ใช้ `:businessSlug`
เช่น `/business-admin/:businessSlug/items`
```

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
/business-admin/[businessSlug]/dashboard
/business-admin/[businessSlug]/profile
/business-admin/[businessSlug]/orders
/business-admin/[businessSlug]/payments
/business-admin/[businessSlug]/items
/business-admin/[businessSlug]/categories
/business-admin/[businessSlug]/inventory
/business-admin/[businessSlug]/stock-movements
/business-admin/[businessSlug]/suppliers
/business-admin/[businessSlug]/purchase-receipts
/business-admin/[businessSlug]/customers
/business-admin/[businessSlug]/loyalty
/business-admin/[businessSlug]/promotions
/business-admin/[businessSlug]/staff
/business-admin/[businessSlug]/roles-permissions
/business-admin/[businessSlug]/branches
/business-admin/[businessSlug]/devices
/business-admin/[businessSlug]/reports
/business-admin/[businessSlug]/receipt-bill
/business-admin/[businessSlug]/branding
/business-admin/[businessSlug]/payment-methods
/business-admin/[businessSlug]/modules
/business-admin/[businessSlug]/import
/business-admin/[businessSlug]/export
/business-admin/[businessSlug]/settings
/business-admin/[businessSlug]/support
/business-admin/[businessSlug]/audit-logs
```

---

## Manager

```text
/business-admin/[businessSlug]/dashboard
/business-admin/[businessSlug]/profile
/business-admin/[businessSlug]/orders
/business-admin/[businessSlug]/items
/business-admin/[businessSlug]/categories
/business-admin/[businessSlug]/inventory
/business-admin/[businessSlug]/stock-movements
/business-admin/[businessSlug]/suppliers
/business-admin/[businessSlug]/customers
/business-admin/[businessSlug]/loyalty
/business-admin/[businessSlug]/promotions
/business-admin/[businessSlug]/staff
/business-admin/[businessSlug]/reports
/business-admin/[businessSlug]/import
/business-admin/[businessSlug]/export
/business-admin/[businessSlug]/support
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
/staff-order/b/[businessSlug]
/staff-order/b/[businessSlug]/tables
/staff-order/b/[businessSlug]/table/[tableId]
```

---

## Kitchen / Bar

```text
/kitchen/b/[businessSlug]
/bar/b/[businessSlug]
```

---

## Receptionist

ใช้กับ Hospitality POS

```text
/business-admin/[businessSlug]/rooms
/business-admin/[businessSlug]/room-calendar
/business-admin/[businessSlug]/bookings
/business-admin/[businessSlug]/check-in
/business-admin/[businessSlug]/check-out
/business-admin/[businessSlug]/guests
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
→ เว็บไซต์หลักของ TJ POS

frontend/apps/platform-admin = Vite React
→ Platform Admin

frontend/apps/business-admin = Vite React
→ Business Admin / Business Workspace

frontend/apps/terminal = Vite React
→ POS Terminal

frontend/apps/staff-order = Vite React
→ Staff Order Mobile

frontend/apps/kitchen-display = Vite React
→ Kitchen / Bar Display

frontend/apps/customer-display = Vite React
→ Customer Display

frontend/apps/public-menu = Vite React
→ Public Menu / QR Menu
```

Routes ทั้งหมดในเอกสารนี้ใช้สำหรับเริ่มออกแบบ UI และ flow frontend ก่อน ยังไม่ใช่ API spec
