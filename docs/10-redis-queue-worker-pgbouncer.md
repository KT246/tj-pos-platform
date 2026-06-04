# TJ POS — Redis / Queue / Worker / PgBouncer Specification

**เวอร์ชัน:** Final Infrastructure Helper Spec  
**ภาษา:** ไทย  
**ขอบเขต:** เอกสารนี้สรุปการใช้ Redis, BullMQ, Worker และ PgBouncer สำหรับ TJ POS  
**หมายเหตุ:** เอกสารนี้เป็นแนวทางสถาปัตยกรรม ไม่ใช่ deployment config ขั้นสุดท้าย

---

## 1. Stack ที่ตกลงกัน

สำหรับ backend ของ TJ POS ให้ใช้ stack ต่อไปนี้:

```text
NestJS
PostgreSQL
PgBouncer
Redis
BullMQ
Worker
Drizzle ORM + Raw SQL
Cloudflare R2
JWT + RBAC
Swagger / OpenAPI
```

บทบาทของแต่ละส่วน:

```text
PostgreSQL = แหล่งข้อมูลจริงของระบบ
PgBouncer = จัดการ connection ไป PostgreSQL
Redis = cache + lock + queue support
BullMQ = ระบบ queue สำหรับงานเบื้องหลัง
Worker = ตัวประมวลผลงานเบื้องหลัง
```

หลักการสำคัญ:

```text
Redis ช่วยให้ระบบเร็วขึ้น
PgBouncer ช่วยให้ PostgreSQL เสถียรขึ้น
Worker ช่วยแยกงานหนักออกจาก API
แต่ข้อมูลจริงและ transaction สำคัญยังต้องอยู่ที่ PostgreSQL
```

---

## 2. PgBouncer ใช้ทำอะไร

PgBouncer ใช้เป็น connection pooler ระหว่าง NestJS API และ PostgreSQL

โครงสร้าง:

```text
NestJS API
↓
PgBouncer
↓
PostgreSQL
```

### เหตุผลที่ควรใช้ PgBouncer ตั้งแต่ backend เริ่มใช้งานจริง

```text
ลดจำนวน connection ตรงเข้า PostgreSQL
ช่วยให้ database เสถียรขึ้น
เหมาะกับระบบที่มี request จาก POS, Admin, Staff Order, Customer Display
ช่วยรองรับการเพิ่ม API instance ในอนาคต
```

### ใช้เมื่อไหร่

```text
ควรใช้ตั้งแต่เริ่มมี backend จริง
ไม่ต้องรอให้ระบบใหญ่ก่อน
```

---

## 3. Redis ใช้ตั้งแต่ต้น

TJ POS จะใช้ Redis ตั้งแต่ต้น

แต่ต้องใช้ Redis ในบทบาทที่ถูกต้อง:

```text
Redis = cache + lock + queue support
PostgreSQL = ข้อมูลหลักของระบบ
```

ไม่ใช้ Redis แทน PostgreSQL

---

## 4. Redis ควร Cache อะไร

Redis เหมาะสำหรับข้อมูลที่:

```text
อ่านบ่อย
เปลี่ยนไม่บ่อย
ไม่ใช่ข้อมูล transaction สำคัญโดยตรง
```

ข้อมูลที่ควร cache:

```text
Business context
User permissions
Enabled modules
Plan limits
Branding
Receipt template
Payment methods active
Categories active
Active items / menu list
Top items
Public menu
POS bootstrap
```

ตัวอย่าง cache key:

```text
business-context:{businessId}
permissions:{businessId}:{userId}
modules:{businessId}
branding:{businessId}
receipt-template:{businessId}:{branchId}
payment-methods:{businessId}:{branchId}
categories:{businessId}:{branchId}
items-active:{businessId}:{branchId}
public-menu:{businessSlug}:{branchSlug}
pos-bootstrap:{businessId}:{branchId}:{userId}
```

---

## 5. Product / Item / Menu ควร Cache หรือไม่

ควร cache

เหตุผล:

```text
POS ต้องเปิดเร็ว
พนักงานต้องเลือกเมนูเร็ว
Public Menu ต้องโหลดไว
Category และ item ถูกอ่านบ่อย
```

ข้อมูลที่เหมาะกับ cache:

```text
Active items
Active categories
Menu items ตาม branch
Public menu
Top items
Payment methods active
Receipt template
Branding
```

---

## 6. Cache Invalidation

Redis จะมีปัญหาถ้า cache ไม่ถูกล้างเมื่อข้อมูลเปลี่ยน ดังนั้นต้องมีหลักการล้าง cache ชัดเจน

เมื่อมีการเปลี่ยนข้อมูลเหล่านี้:

```text
แก้ item
เปลี่ยนราคา
เปลี่ยน category
หยุดขาย item
แก้ topping / option
แก้ payment method
แก้ receipt template
แก้ branding
เปิด/ปิด module
เปลี่ยน permission
เปลี่ยน plan limit
```

ต้องล้าง cache ที่เกี่ยวข้องทันที

ตัวอย่างเมื่อแก้ item:

```text
Update item ใน PostgreSQL
↓
Delete cache:
items-active:{businessId}:*
categories:{businessId}:*
pos-bootstrap:{businessId}:*
public-menu:{businessSlug}:*
```

หลักการ:

```text
อย่ารอ TTL อย่างเดียว
ถ้ามี update สำคัญ ต้องล้าง cache ทันที
```

---

## 7. TTL ที่แนะนำ

ควรตั้ง TTL เพื่อป้องกัน cache เก่าอยู่ในระบบนานเกินไป

```text
business context: 5–15 นาที
permissions: 5–15 นาที
modules: 5–15 นาที
plan limits: 5–15 นาที
branding: 30–60 นาที
receipt template: 30–60 นาที
payment methods: 5–15 นาที
categories: 10–30 นาที
active items/menu: 5–15 นาที
public menu: 5–15 นาที
POS bootstrap: 1–5 นาที
```

หมายเหตุ:

```text
TTL เป็นตัวช่วย
แต่การล้าง cache หลัง update ยังจำเป็น
```

---

## 8. ข้อมูลที่ไม่ควรใช้ Redis เป็นแหล่งข้อมูลหลัก

ไม่ควรใช้ Redis เป็นแหล่งข้อมูลจริงสำหรับ:

```text
Orders
Payments
Refunds
Stock หลัก
Stock movements
Audit logs
```

ข้อมูลเหล่านี้ต้องอิง PostgreSQL เป็นหลัก

โดยเฉพาะ action ต่อไปนี้ต้องใช้ PostgreSQL transaction:

```text
Checkout
Confirm Paid
Refund
ตัด stock
ปรับ stock
Close shift
```

Redis สามารถช่วย lock หรือช่วย cache บางส่วนได้ แต่ไม่ใช่แหล่งข้อมูลจริง

---

## 9. Redis Lock

Redis Lock ใช้ป้องกันการทำ action ซ้ำ

ควรใช้กับ action สำคัญ:

```text
Confirm Paid
Checkout
Refund
Stock adjustment
Close shift
```

ตัวอย่าง key:

```text
lock:order:{orderId}:checkout
lock:order:{orderId}:refund
lock:stock:{businessId}:{itemId}:adjust
lock:cash-session:{sessionId}:close
```

### Flow ตัวอย่าง Checkout

```text
User กด Confirm Paid
↓
Backend สร้าง Redis lock สำหรับ orderId
↓
ถ้า lock มีอยู่แล้ว → ตอบว่า order กำลังถูกประมวลผล
↓
ถ้าไม่มี lock → เริ่ม PostgreSQL transaction
↓
ตรวจว่า order ยังไม่ paid
↓
สร้าง payment
↓
อัปเดต order เป็น paid
↓
commit transaction
↓
ลบ lock
```

### ข้อสำคัญ

Redis lock ไม่แทนที่ database transaction

ยังต้องตรวจใน PostgreSQL เสมอ:

```text
ถ้า order paid แล้ว → ห้าม paid ซ้ำ
```

Error ที่ควรใช้:

```text
ORDER_ALREADY_PAID
```

---

## 10. BullMQ + Worker

เพราะ TJ POS ใช้ Redis ตั้งแต่ต้น จึงสามารถเตรียมโครงสร้าง BullMQ + Worker ไว้ตั้งแต่ต้นได้

แต่การเปิดใช้ Worker จริงควรผูกกับงาน background ที่จำเป็น เช่น import/export/report/email/backup และสอดคล้องกับ Milestone 9

BullMQ ใช้สำหรับงานเบื้องหลัง

Worker ใช้ประมวลผล job จาก queue

---

## 11. งานที่ควรใช้ Queue / Worker

ควรใช้ Worker สำหรับงานที่ใช้เวลานานหรือไม่ควรทำใน API request โดยตรง

```text
Import Excel
Export XLSX
Export PDF
Generate report ขนาดใหญ่
ส่ง email
สร้างไฟล์ backup
ประมวลผลรูปภาพ
แจ้งเตือนแพ็กเกจใกล้หมดอายุ
Smart Menu / Forecast ในอนาคต
```

ตัวอย่าง flow import:

```text
Admin upload Excel
↓
API บันทึก import job
↓
API ส่ง job เข้า BullMQ
↓
Worker อ่าน job
↓
Worker ประมวลผล file
↓
Worker บันทึกผลลัพธ์ใน database
↓
Admin ดูสถานะ import job
```

---

## 12. งานที่ไม่ควรใช้ Worker เป็นขั้นหลัก

งานที่ต้องตอบผลทันทีและเกี่ยวกับ transaction สำคัญ ไม่ควรโยนเข้า worker เป็นขั้นหลัก

ไม่ควรใช้ worker เป็นตัวหลักสำหรับ:

```text
Checkout หลัก
Confirm paid หลัก
ตัด stock หลัก
Refund หลัก
ปิดกะหลัก
```

เหตุผล:

```text
งานเหล่านี้ต้องตอบผลให้ user ทันที
ต้องควบคุม transaction ชัดเจน
ต้องรู้ว่าทำสำเร็จหรือไม่สำเร็จทันที
```

งานเหล่านี้ควรอยู่ใน:

```text
NestJS API + PostgreSQL transaction
```

---

## 13. Worker ควรอยู่ที่ไหน

ช่วงเริ่มต้นควรให้ Worker อยู่ใน repo เดียวกับ backend

ตัวอย่าง:

```text
backend/
├── src/
│   ├── modules/
│   └── worker/
```

หรือในอนาคตถ้าใช้ monorepo backend:

```text
backend/
├── apps/
│   ├── api/
│   └── worker/
```

ช่วงเริ่มต้นแนะนำ:

```text
src/worker/
```

เมื่อระบบใหญ่ขึ้นค่อยแยกเป็น repo หรือ service ใหม่:

```text
backend-worker
```

---

## 14. Realtime และ Redis

Redis ยังช่วยรองรับ realtime ในอนาคตได้

ช่วง MVP สามารถใช้วิธีง่ายก่อน:

```text
Polling 1–3 วินาที
```

ใช้กับ:

```text
Customer Display
Kitchen Display
Staff Order
Open Orders
```

เมื่อระบบต้องการ realtime ที่ลื่นขึ้น ค่อยเพิ่ม:

```text
Socket.IO
Socket.IO Redis adapter ถ้ามีหลาย API server
```

---

## 15. Architecture ที่ตกลงกัน

### Request ปกติ

```text
Frontend
↓
NestJS API
↓
Redis Cache / Lock
↓
PgBouncer
↓
PostgreSQL
```

### Job เบื้องหลัง

```text
NestJS API
↓
Redis / BullMQ
↓
Worker
↓
PostgreSQL / Cloudflare R2 / Email
```

---

## 16. อะไรช่วยให้ระบบเร็วที่สุด

ลำดับความสำคัญ:

```text
1. Query PostgreSQL ให้ถูก
2. Index ให้ดี
3. ใช้ pagination
4. ไม่ส่งข้อมูลเยอะเกินจำเป็น
5. ใช้ PgBouncer เพื่อจัดการ connection
6. ใช้ Redis cache สำหรับข้อมูลที่อ่านบ่อย
7. ใช้ Queue/Worker สำหรับงานหนัก
```

หมายเหตุ:

```text
Redis ช่วยให้เร็วขึ้น
แต่ไม่สามารถแทน query design และ index ที่ดีได้
```

---

## 17. สิ่งที่ควรทำตั้งแต่ต้น

```text
ใช้ PgBouncer ตั้งแต่ backend เริ่มใช้งานจริง
ใช้ Redis ตั้งแต่ต้น
ทำ cache สำหรับ business context, permissions, modules, branding, receipt, payment methods, categories, active items
ใช้ Redis lock สำหรับ checkout/refund/stock adjustment/close shift
เตรียม BullMQ + Worker ไว้สำหรับ import/export/report/email/backup และเปิดใช้จริงเมื่อถึง phase งานหนัก
```

---

## 18. สิ่งที่ต้องระวัง

```text
อย่า cache orders/payments/refunds/stock เป็นแหล่งข้อมูลหลัก
อย่าพึ่ง Redis แทน PostgreSQL transaction
อย่าลืมล้าง cache เมื่อข้อมูลเปลี่ยน
อย่าใช้ worker กับงานที่ต้อง confirm ทันที เช่น payment
อย่า load item/order/customer ทั้งหมดโดยไม่มี pagination
```

---

## 19. ข้อสรุปสุดท้าย

TJ POS จะใช้ Redis, BullMQ, Worker และ PgBouncer ตามแนวทางนี้:

```text
PostgreSQL = แหล่งข้อมูลจริง
PgBouncer = จัดการ connection ให้ PostgreSQL เสถียร
Redis = cache + lock + queue support
BullMQ = queue สำหรับงาน background
Worker = ตัวประมวลผล import/export/report/email/backup
```

ข้อสรุปหลัก:

```text
TJ POS ใช้ Redis ตั้งแต่ต้น
Redis ใช้เพื่อความเร็วและความเสถียร ไม่ใช่แทนฐานข้อมูล
Product/Menu/Category/Payment Methods/Branding/Receipt/Modules/Permissions ควร cache
Order/Payment/Refund/Stock Transaction ต้องยึด PostgreSQL เป็นหลัก
Checkout/Payment/Refund/Stock ต้องใช้ PostgreSQL transaction
Queue/Worker ใช้กับงานหนักที่ไม่ควรทำใน request หลัก และเปิดใช้จริงตาม phase งาน import/export/report/email/backup
```
