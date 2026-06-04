# TJ POS — Backend Stack Specification

**เวอร์ชัน:** Backend Stack Final Draft  
**ภาษา:** ไทย  
**ขอบเขต:** เอกสารนี้สรุปเฉพาะ Stack ฝั่ง Backend ที่ตกลงกันล่าสุด  
**หมายเหตุ:** เอกสารนี้ยังไม่ลงรายละเอียด API endpoints, database schema, deploy หรือ production infrastructure

---

## 1. เป้าหมายของ Backend Stack

Backend ของ TJ POS ต้องรองรับระบบ POS SaaS แบบ managed service ที่ใช้งานในประเทศ โดยต้องเน้น:

```text
โครงสร้างชัดเจน
ดูแลระบบง่าย
รองรับหลาย business
รองรับหลาย POS Type
จัดการ permission ได้ดี
ทำ transaction เกี่ยวกับ order/payment/stock ได้มั่นคง
ขยายต่อได้ในอนาคต
```

TJ POS มีหลาย module เช่น:

```text
Auth
Platform Admin
Business
Branch
Staff
Items
Orders
Payments
Inventory
Customers
Promotions
Reports
Receipt
Branding
Support
```

ดังนั้น Backend ต้องมี stack ที่เป็นระบบ ไม่ใช่เขียนแบบไฟล์รวมกันจนดูแลยาก

---

## 2. Backend หลัก

Backend หลักใช้ชื่อ project:

```text
backend
```

Stack ที่ตกลงกัน:

```text
NestJS
TypeScript
PostgreSQL
PgBouncer
Drizzle ORM + Raw SQL
Zod Validation
JWT Auth
RBAC Permission
Swagger / OpenAPI
Cloudflare R2
Redis Cache / Lock
BullMQ + Worker สำหรับงาน background ตาม phase
```

---

## 3. Framework: NestJS

### เลือกใช้

```text
NestJS
```

### เหตุผล

NestJS เหมาะกับ TJ POS เพราะระบบมีหลาย module และต้องการโครงสร้างที่ชัดเจน

ข้อดี:

```text
จัดโครงสร้างแบบ Module / Controller / Service ได้ดี
เหมาะกับ TypeScript
เหมาะกับ backend ขนาดกลางถึงใหญ่
แยก business logic ได้ชัดเจน
ทำ Guard / Permission / Middleware ได้ดี
เหมาะกับระบบ POS ที่มีหลายส่วน
```

ตัวอย่างโครงสร้าง module:

```text
orders/
├── orders.module.ts
├── orders.controller.ts
├── orders.service.ts
├── orders.dto.ts
└── orders.permissions.ts
```

---

## 4. Language: TypeScript

### เลือกใช้

```text
TypeScript
```

### เหตุผล

Frontend และ Backend ใช้ TypeScript เหมือนกัน ทำให้ทีมเข้าใจ type และ schema ได้ง่ายขึ้น

ใช้กับ:

```text
DTO
Service
Validation
Type-safe database query
Shared types ในอนาคต
```

---

## 5. Database: PostgreSQL

### เลือกใช้

```text
PostgreSQL
```

### เหตุผล

PostgreSQL เหมาะกับระบบ POS เพราะข้อมูลมีความสัมพันธ์ชัดเจน เช่น:

```text
business
branch
staff
items
orders
order_items
payments
inventory
customers
reports
```

ข้อดี:

```text
รองรับ transaction ได้ดี
เหมาะกับ order/payment/stock
เขียน report ด้วย SQL ได้ดี
backup/restore ง่าย
เหมาะกับข้อมูลเชิงธุรกิจ
```

### รูปแบบ database ใน MVP

ช่วงเริ่มต้นใช้:

```text
1 PostgreSQL database รวม
```

ตัวอย่างชื่อ database:

```text
tj_pos_platform_db
```

ข้อมูลแต่ละร้านแยกด้วย:

```text
business_id
branch_id
role
permissions
```

### ยังไม่ใช้ใน MVP

```text
DB แยกต่อร้าน
Read replica
Sharding
Multi database
Database ต่อ customer
```

เหตุผล: เป้าหมายตอนนี้คือใช้งานในประเทศ จำนวนผู้ใช้งานไม่ใหญ่เท่าระบบ public ขนาดใหญ่ ดังนั้น database เดียว + index ดี + backup ดี เพียงพอสำหรับ MVP

---

## 6. ORM: Drizzle ORM + Raw SQL

### เลือกใช้

```text
Drizzle ORM + Raw SQL
```

### เหตุผล

Drizzle ORM เหมาะกับ TypeScript และมีความเบา อ่าน query ได้ชัดเจน

ใช้ Drizzle สำหรับ:

```text
CRUD ปกติ
Insert / update / delete
Query ที่ไม่ซับซ้อน
Schema typing
```

ใช้ Raw SQL สำหรับ:

```text
รายงานยอดขาย
รายงาน stock
ยอดขายตามวัน/เดือน
ยอดขายตาม branch
สินค้าขายดี
payment report
query ที่ต้อง optimize เอง
```

เหตุผลที่ไม่ใช้ ORM อย่างเดียว:

```text
ระบบ POS มี report เยอะ
บาง query ต้องควบคุม performance
Raw SQL ทำให้ปรับ query ได้ตรงกว่า
```

---

## 7. Validation: Zod

### เลือกใช้

```text
Zod
```

### ใช้สำหรับ

```text
Validate request body
Validate query params
Validate form schema
Validate import Excel
Validate business rules เบื้องต้น
```

### เหตุผล

Frontend ก็ใช้ Zod ดังนั้นสามารถทำให้ schema ฝั่ง FE/BE เข้าใจตรงกันได้ง่ายขึ้น

ตัวอย่าง schema ที่ควรมี:

```text
CreateBusinessSchema
CreateItemSchema
CreateOrderSchema
ConfirmPaymentSchema
RefundSchema
StockAdjustmentSchema
CreateStaffSchema
```

---

## 8. Authentication

### รูปแบบ Auth ที่ตกลง

```text
Email/Phone + Password
JWT Access Token
Refresh Token
```

### MVP ยังไม่จำเป็นต้องมี

```text
OTP login
Social login
2FA
SSO
```

### ใช้สำหรับ

```text
Platform Admin login
Owner login
Manager login
Cashier login
Staff login
```

### หลักสำคัญ

```text
Frontend ซ่อนเมนูตาม role ได้
แต่ Backend ต้องเช็ค permission ทุกครั้ง
```

ไม่ควรเชื่อเฉพาะ frontend

---

## 9. Authorization / Permission

### รูปแบบ Permission

ใช้:

```text
RBAC + Permission Strings
```

Role หลัก:

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

Permission ตัวอย่าง:

```text
order.create
order.cancel
order.refund
item.create
item.update
payment.confirm
stock.adjust
report.view
staff.manage
settings.update
platform.business.manage
```

ทุก request ที่เกี่ยวกับ business ต้องรู้:

```text
user คือใคร
user อยู่ business ไหน
branch ไหน
role อะไร
permission อะไร
module ไหนเปิดอยู่
```

---

## 10. API Documentation

### เลือกใช้

```text
Swagger / OpenAPI
```

### เหตุผล

ช่วยให้ frontend และ backend เข้าใจ API ตรงกัน

ใช้สำหรับ:

```text
ดู endpoint
ดู request body
ดู response
ทดสอบ API
ให้ dev ใหม่เข้าใจระบบเร็วขึ้น
```

### หมายเหตุ

ตอนนี้ยังไม่ชี้แจง API endpoints ลึก แต่เมื่อเริ่มออกแบบ API จริง ควรใช้ Swagger/OpenAPI ตั้งแต่ต้น

---

## 11. File Storage

### เลือกใช้

```text
Cloudflare R2
```

### ใช้สำหรับ

```text
Logo ร้าน
รูปสินค้า/เมนู
รูป banner
QR payment image
ไฟล์ import/export
PDF report ถ้ามี
Backup database ในอนาคต
```

### Bucket แนะนำในอนาคต

```text
platform-media
platform-exports
platform-backups
```

หลักการ:

```text
media → รูปภาพ public หรือ signed URL
exports → ไฟล์ export ส่วนตัว
backups → backup database แบบ private
```

---

## 12. Queue / Worker

### สถานะ

```text
Redis ใช้ตั้งแต่ต้นสำหรับ cache และ lock
BullMQ + Worker ยังไม่ใช่ core ของ Milestone แรก
สามารถเตรียมโครงสร้างไว้ได้ แต่เปิดใช้จริงเมื่อมีงาน background หนัก
```

### Stack ที่ใช้

```text
Redis
BullMQ
Worker
```

### ใช้กับงาน background เช่น

```text
Import Excel ขนาดใหญ่
Export report ขนาดใหญ่
Generate PDF
ส่ง email
แจ้งเตือนแพ็กเกจหมดอายุ
Backup job
Report async
```

### หลักการใช้งาน

```text
งานหลักที่เกี่ยวกับ order/payment/refund/stock ต้องทำใน API + PostgreSQL transaction
Redis ใช้ช่วย cache และ lock ไม่ใช่แหล่งข้อมูลจริง
BullMQ + Worker ใช้กับ import/export/report/email/backup ตาม Milestone 9
```

---

## 13. Realtime

### สถานะ

```text
ยังไม่บังคับใน MVP แรก
```

### Stack ในอนาคต

```text
Socket.IO
```

### ใช้กับ

```text
Customer Display
Kitchen / Bar Display
Staff Order
Open Orders
Payment status
```

### วิธี MVP แบบง่าย

ช่วงแรกสามารถใช้:

```text
Polling 1–3 วินาที
```

ก่อน แล้วค่อยเปลี่ยนเป็น WebSocket เมื่อระบบนิ่งขึ้น

---

## 14. Email Provider

### สถานะ

```text
ยังไม่ใช่ core แรกสุด
```

### ใช้สำหรับในอนาคต

```text
Reset password
แจ้ง account ให้ลูกค้า
แจ้งแพ็กเกจใกล้หมดอายุ
ตอบกลับ support ticket
```

### Provider ที่แนะนำ

```text
Resend
Amazon SES
```

---

## 15. Audit Logs

### ต้องมีแนวคิดนี้ตั้งแต่แรก

ระบบ POS เกี่ยวกับเงิน, order และ stock ดังนั้นต้องมี audit log

ควรบันทึก action สำคัญ เช่น:

```text
ใครยกเลิก order
ใคร refund
ใครปรับ stock
ใครเปลี่ยนราคา
ใครล็อก staff
ใครเปิด/ปิด module
ใครต่ออายุแพ็กเกจ
ใครล็อก business
```

MVP สามารถทำ audit log แบบง่ายก่อน แต่ต้องวางโครงสร้างไว้

---

## 16. Error Handling

Backend ควรส่ง error format แบบเดียวกันทุก API

ตัวอย่าง:

```json
{
  "message": "ไม่มีสิทธิ์ทำรายการนี้",
  "code": "FORBIDDEN",
  "statusCode": 403
}
```

Error ควรมี:

```text
message
code
statusCode
details ถ้าจำเป็น
```

ไม่ควรให้แต่ละ API ส่ง error คนละรูปแบบ

---

## 17. Backend Module Structure ที่แนะนำ

```text
src/
├── app.module.ts
├── common/
│   ├── guards/
│   ├── decorators/
│   ├── filters/
│   ├── interceptors/
│   └── utils/
├── auth/
├── platform/
├── businesses/
├── branches/
├── staff/
├── roles/
├── items/
├── categories/
├── orders/
├── payments/
├── inventory/
├── suppliers/
├── customers/
├── loyalty/
├── promotions/
├── tables/
├── kitchen/
├── appointments/
├── rooms/
├── reports/
├── receipt/
├── branding/
├── modules/
├── support/
├── files/
└── import-export/
```

---

## 18. Backend MVP ควรทำก่อน

ลำดับที่แนะนำ:

```text
1. Auth
2. Business Context
3. Platform Admin Basic
4. Branch
5. Staff / Role / Permission
6. Items / Categories
7. Orders / POS Flow
8. Payments
9. Receipt / Payment Methods
10. Inventory Basic
11. Reports Basic
12. Support / Feedback
```

---

## 19. ยังไม่ทำใน MVP แรก

```text
BullMQ Worker สำหรับงานหนักแบบเต็ม
Socket.IO
Advanced Reports
AI / Smart Forecast
Payment callback จากธนาคาร
Offline Mode เต็มรูปแบบ
Multi DB
Read Replica
DB แยกต่อ business
```

---

## 20. Stack สรุปสุดท้าย

```text
Backend:
NestJS + TypeScript

Database:
PostgreSQL

ORM:
Drizzle ORM + Raw SQL

Validation:
Zod

Auth:
JWT Access Token + Refresh Token

Permission:
RBAC + Permission Strings

Docs:
Swagger / OpenAPI

Storage:
Cloudflare R2

Connection Pool:
PgBouncer

Cache / Lock:
Redis

Queue / Worker later:
BullMQ + Worker สำหรับ import/export/report/email/backup

Realtime later:
Socket.IO

Email later:
Resend / Amazon SES
```

---

## 21. สถานะของเอกสารนี้

เอกสารนี้ชี้แจง stack backend ที่ควรใช้

ยังไม่ชี้แจง:

```text
API endpoint list
Database schema รายละเอียด
Deploy
Nginx
Production infrastructure
```

ข้อสรุป:

```text
เอกสารนี้เพียงพอสำหรับกำหนดทิศทาง backend stack
ขั้นตอนต่อไปควรชี้แจง Domain Schema หรือ Backend Module Structure ก่อนเริ่มเขียน API จริง
```
