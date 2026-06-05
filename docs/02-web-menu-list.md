# TJ POS — รายการเมนูทั้งหมดของแต่ละเว็บ/แอป

**เวอร์ชัน:** Final Spec Draft  
**ภาษา:** ไทย  
**วัตถุประสงค์:** ใช้เป็นเอกสารสรุปรายการเมนูหลักของระบบ TJ POS สำหรับนำไปออกแบบ UI/UX, แบ่งสิทธิ์ผู้ใช้งาน และวางโครงสร้างโปรเจกต์

---

## 1. ภาพรวมโครงสร้างระบบ

TJ POS แบ่งออกเป็น 3 ส่วนหลัก:

| ส่วน | เทคโนโลยีที่แนะนำ | หน้าที่ |
|---|---|---|
| `frontend/apps/web` | Next.js | เว็บไซต์หลัก, Platform Admin, Business Admin, Reports, Settings, Public Menu |
| `frontend/apps/terminal` | Vite React | หน้าขาย POS, Staff Order Mobile, Customer Display, Kitchen/Bar Display |
| `backend` | Backend API | Auth, Business, Branch, Items, Orders, Payments, Plans, Add-ons, Reports |

> หมายเหตุ: `backend` ไม่ใช่เว็บ UI แต่เป็น backend ที่ทุกเว็บ/แอปใช้งานร่วมกัน

---

## 2. เว็บไซต์หลักของ TJ POS

เว็บไซต์หลักคือหน้าเว็บสำหรับแนะนำสินค้าและบริการของ TJ POS ให้ลูกค้าที่สนใจ

### Route ตัวอย่าง

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

หมายเหตุ:

```text
เว็บไซต์หลักใช้หน้าเดียวและเลื่อนไปยัง section ด้วย hash
ไม่ใช้ route แยกของเมนูเว็บไซต์หลัก
ไม่ใช้ route demo แยก
/login, /forgot-password, /reset-password เป็น Auth/Admin Entry ไม่ใช่เมนูของเว็บไซต์หลัก
เว็บไซต์หลักห้ามมีปุ่มหรือ link ไป /login
```

### เมนูเว็บไซต์หลัก

| เมนู | จุดประสงค์ | ผู้ใช้งาน |
|---|---|---|
| Home | แนะนำ TJ POS | ลูกค้าที่ยังไม่ได้ใช้งาน |
| POS Types | แนะนำ POS ทั้ง 5 ประเภท | ลูกค้าที่ยังไม่ได้ใช้งาน |
| Features | แสดงฟีเจอร์หลัก | ลูกค้าที่ยังไม่ได้ใช้งาน |
| Pricing | แสดงแพ็กเกจบริการเพื่อให้ลูกค้าเข้าใจ | ลูกค้าที่ยังไม่ได้ใช้งาน |
| Add-ons | แสดง module เสริมที่สามารถเปิดเพิ่มตาม business | ลูกค้าที่ยังไม่ได้ใช้งาน |
| FAQ/Help | รวมคำถามที่พบบ่อยและช่องทางขอความช่วยเหลือ | ลูกค้าที่ยังไม่ได้ใช้งาน |
| Contact | ส่งคำขอปรึกษา / ขอใบเสนอราคา | ลูกค้าที่ยังไม่ได้ใช้งาน |

### CTA ที่ควรใช้

```text
ติดต่อเพื่อขอคำปรึกษา
ขอใบเสนอราคา
นัดคุยกับทีม TJ POS
```

### CTA ที่ไม่ควรเน้นใน MVP

```text
Register Now
Start Free
Try Demo Public
```

เหตุผล: ระบบนี้เป็น Managed SaaS POS ใช้ในประเทศ ลูกค้าต้องติดต่อทีม TJ POS เพื่อ setup ระบบจริง

---

## 3. Platform Admin ของ TJ POS

Platform Admin คือพื้นที่สำหรับทีม TJ POS ใช้จัดการระบบทั้งหมด ไม่ใช่ admin ของร้าน

### Route ตัวอย่าง

```text
/platform-admin
/platform-admin/dashboard
/platform-admin/businesses
/platform-admin/users
/platform-admin/plans
/platform-admin/subscriptions
/platform-admin/add-ons
/platform-admin/add-ons/catalog
/platform-admin/payments
/platform-admin/payments/settings
/platform-admin/contact-requests
/platform-admin/support-tickets
/platform-admin/system-settings
/platform-admin/system-settings/notification-templates
/platform-admin/audit-logs
/platform-admin/profile-security
```

### เมนู Platform Admin

| เมนู | จุดประสงค์ |
|---|---|
| Dashboard | ภาพรวมจำนวนร้าน, แพ็กเกจที่ active, ลูกค้าใกล้หมดอายุ |
| Businesses | สร้าง/จัดการร้านหรือธุรกิจของลูกค้า |
| Users | จัดการบัญชี owner/staff |
| Plans | จัดการแพ็กเกจ Starter / Pro / Business / Enterprise |
| Subscriptions | ดูแพ็กเกจที่แต่ละ business ใช้งาน |
| Add-ons | เปิด/ปิด add-on ให้แต่ละ business |
| Global Modules Catalog | จัดการ module catalog กลางของระบบ |
| Payments | จัดการการชำระเงินแบบ manual / ต่ออายุ |
| Master Bank / Payment Config | ตั้งค่า bank และ payment config กลาง |
| Contact Requests | คำขอติดต่อจากเว็บไซต์หลัก |
| Support Tickets | แจ้งปัญหา, feedback, request feature |
| System Settings | ตั้งค่าระบบรวม |
| Notification Templates | ตั้งค่า template การแจ้งเตือน |
| Audit Logs | ประวัติการกระทำสำคัญในระบบ |
| Profile & Security | จัดการ profile และ security ของ Platform Admin ที่ login อยู่ |

---

## 4. Business Admin / Business Workspace

Business Workspace คือพื้นที่ทำงานของแต่ละร้าน/ธุรกิจในระบบเดียวกัน

### Route ตัวอย่าง

```text
/b/{businessSlug}
/b/{businessSlug}/admin
/b/{businessSlug}/dashboard
/b/{businessSlug}/orders
/b/{businessSlug}/items
/b/{businessSlug}/customers
/b/{businessSlug}/promotions
/b/{businessSlug}/staff
/b/{businessSlug}/branches
/b/{businessSlug}/devices
/b/{businessSlug}/reports
/b/{businessSlug}/receipt
/b/{businessSlug}/branding
/b/{businessSlug}/payment-methods
/b/{businessSlug}/settings
/b/{businessSlug}/modules
/b/{businessSlug}/support
```

### เมนูหลักใน Business Workspace

| เมนู | จุดประสงค์ | ใครเห็น |
|---|---|---|
| Dashboard | ภาพรวมร้าน | Owner, Manager |
| Orders | ดูออเดอร์/บิล | Owner, Manager, Cashier ตามสิทธิ์ |
| Payments | ดูรายการชำระเงิน | Owner, Manager, Cashier ตามสิทธิ์ |
| Items | สินค้า / เมนู / บริการ / ห้อง | Owner, Manager |
| Categories | หมวดหมู่ | Owner, Manager |
| Customers / Loyalty | ลูกค้าสมาชิก, แต้ม, VIP | Owner, Manager, Cashier ถ้าเปิด module |
| Promotions | ส่วนลด, coupon, combo | Owner, Manager |
| Staff / Roles | พนักงานและสิทธิ์ | Owner, Manager ที่มีสิทธิ์ |
| Branches | สาขา | Owner |
| Devices | เครื่อง POS, printer, customer display | Owner, Manager |
| Reports | รายงาน | Owner, Manager |
| Receipt / Bill | ตั้งค่ารูปแบบบิล | Owner, Manager ที่มีสิทธิ์ |
| Branding | โลโก้, สี, style | Owner, Manager ที่มีสิทธิ์ |
| Payment Methods | เงินสด, ธนาคาร, QR | Owner, Manager ที่มีสิทธิ์ |
| Settings | ตั้งค่าร้าน | Owner |
| Modules | เปิด/ปิดฟีเจอร์ | Owner |
| Support / Feedback | แจ้งปัญหา / ขอเพิ่มฟีเจอร์ | Owner, Manager, Staff ถ้าอนุญาต |

---

## 5. POS Terminal

POS Terminal คือหน้าจอขายที่ต้องเร็วและใช้งานง่าย แนะนำให้ใช้ Vite React

### Route ตัวอย่าง

```text
/terminal/b/{businessSlug}/pos
/terminal/b/{businessSlug}/pos/open-orders
/terminal/b/{businessSlug}/pos/held-orders
/terminal/b/{businessSlug}/pos/checkout
/terminal/b/{businessSlug}/pos/receipt-preview
/terminal/b/{businessSlug}/pos/refund
```

### เมนู / หน้าจอ POS Terminal

| หน้าจอ | จุดประสงค์ | ผู้ใช้ |
|---|---|---|
| POS / Sales | ขายหน้าร้าน | Cashier, Owner, Manager |
| Category / Item Grid | เลือกสินค้า/เมนู/บริการ | Cashier |
| Barcode Search | สแกน barcode / ค้นหา SKU | Retail, Mini mart |
| Cart | ตะกร้าหรือออเดอร์ปัจจุบัน | Cashier |
| Hold Order | พักออเดอร์ชั่วคราว | Cashier |
| Open Orders | ออเดอร์ที่ยังเปิดอยู่ / ออเดอร์พักไว้ | Cashier |
| Checkout | ชำระเงิน | Cashier |
| Payment Select | เลือกเงินสด/ธนาคาร/QR | Cashier |
| Print Bill | พิมพ์บิล | Cashier |
| Refund / Return | คืนสินค้า / คืนเงิน | Manager/Owner หรือ Cashier ที่มีสิทธิ์ |

---

## 6. Staff Order Mobile

Staff Order คือหน้าสำหรับพนักงานใช้โทรศัพท์รับออเดอร์ ไม่ใช่ให้ลูกค้าสั่งเอง

### Route ตัวอย่าง

```text
/terminal/b/{businessSlug}/staff-order
/terminal/b/{businessSlug}/staff-order/tables
/terminal/b/{businessSlug}/staff-order/order/{tableId}
```

### เมนู / หน้าจอ Staff Order

| หน้าจอ | จุดประสงค์ | POS Type |
|---|---|---|
| Table List | เลือกโต๊ะ | Cafe, Restaurant |
| Menu Items | เลือกเมนู | Cafe, Restaurant |
| Item Options | Size, topping, น้ำตาล/น้ำแข็ง, หมายเหตุ | Cafe |
| Order Review | ตรวจสอบออเดอร์ก่อนส่ง | Cafe, Restaurant |
| Send to Bar/Kitchen | ส่งออเดอร์ไป bar/ครัว | Cafe, Restaurant |
| Open Table Orders | ดูออเดอร์ตามโต๊ะ | Cafe, Restaurant |

> ข้อสรุป: ลูกค้าดูเมนูได้เท่านั้น ออเดอร์จริงต้องให้พนักงานเป็นคนบันทึก

---

## 7. Customer Display

Customer Display คือจอให้ลูกค้าดูรายการและยอดชำระที่หน้าเคาน์เตอร์หรือจอที่สอง

### Route ตัวอย่าง

```text
/terminal/b/{businessSlug}/display
/terminal/b/{businessSlug}/display/{deviceId}
```

### หน้าจอ Customer Display

| หน้าจอ | เนื้อหา |
|---|---|
| Welcome | โลโก้, ชื่อร้าน, สีของร้าน |
| Current Order | รายการที่สั่ง, จำนวน, ราคา |
| Payment QR | ยอดรวม, QR, ชื่อธนาคาร |
| Payment Success | แจ้งว่าชำระเงินสำเร็จ |
| Idle / Promotion | ภาพเมนูหรือโปรโมชั่น ถ้าต้องการ |

---

## 8. Kitchen / Bar Display

ใช้กับ Cafe / Restaurant เมื่อเปิด module

### Route ตัวอย่าง

```text
/terminal/b/{businessSlug}/kitchen
/terminal/b/{businessSlug}/bar
```

### เมนู / หน้าจอ Kitchen-Bar

| หน้าจอ | จุดประสงค์ |
|---|---|
| Pending Orders | รายการที่รอทำ |
| Preparing | รายการที่กำลังทำ |
| Done | รายการที่เสร็จแล้ว |
| Order Detail | รายละเอียดเมนูและหมายเหตุ |
| Station Filter | กรองตาม kitchen / bar |

---

## 9. Public Menu

Public Menu คือหน้าที่ลูกค้าสแกน QR เพื่อดูเมนู/สินค้า/ราคา แต่ไม่สามารถสร้างออเดอร์เอง

### Route ตัวอย่าง

```text
/menu/{businessSlug}
/menu/{businessSlug}/{branchSlug}
/q/{qrCode}
```

### เมนู Public

| หน้าจอ | เนื้อหา |
|---|---|
| Business Menu Home | โลโก้, ชื่อร้าน, สีร้าน |
| Categories | หมวดหมู่เมนู/สินค้า |
| Item List | รูป, ชื่อ, ราคา, คำอธิบาย |
| Item Detail | รูปใหญ่, รายละเอียด, option ถ้ามี |
| Out of Stock | แสดงรายการที่หมด |
| QR Table Context | ถ้า QR ตามโต๊ะ ระบบรู้โต๊ะ/สาขา |

> ข้อสรุป: Public Menu ใช้ดูเท่านั้น ไม่สร้าง order

---

## 10. Menu แสดงตาม Role

| Role | เมนูหลักที่เห็น |
|---|---|
| Platform Admin | Platform Admin ทั้งระบบ |
| Owner | เกือบทั้งหมดใน Business Workspace |
| Manager | Dashboard, Orders, Items, Staff สาขา, Reports สาขา |
| Cashier | POS, Orders, Payments, Hold/Open Orders, Print Bill |
| Waiter | Staff Order, Tables, Menu |
| Kitchen / Bar | Kitchen/Bar Orders, Order Status |
| Receptionist | Room Dashboard, Bookings, Check-in/out, Guests, Payments |

---

## 11. Menu แสดงตาม POS Type

| POS Type | เมนูที่ควรเด่น | เมนูที่ควรซ่อน |
|---|---|---|
| Retail | Products, Barcode, Inventory, Suppliers, Stock | Tables, Kitchen, Rooms, Appointments |
| Cafe | Menu Items, Toppings, Sugar/Ice, Staff Order, Customer Display | Rooms, Appointments |
| Restaurant | Table Map, Areas, Kitchen, Split Bill, Service Charge | Barcode, Rooms, Commission |
| Beauty | Appointments, Services, Packages, Commission | Tables, Kitchen, Rooms |
| Hospitality | Rooms, Bookings, Check-in/out, Deposit, Housekeeping | Topping, Kitchen, Beauty Commission |

---

## 12. ข้อสรุป frontend project

```text
frontend/apps/web
→ Next.js
→ เว็บไซต์หลัก, Platform Admin, Business Admin, Reports, Settings, Public Menu

frontend/apps/terminal
→ Vite React
→ POS Terminal, Staff Order Mobile, Customer Display, Kitchen/Bar Display
```

ทุกส่วนใช้ร่วมกัน:

```text
backend
tj_pos_platform_db
```
