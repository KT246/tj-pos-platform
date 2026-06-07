# TJ POS — รายการเมนูทั้งหมดของแต่ละเว็บ/แอป

**เวอร์ชัน:** Final Spec Draft  
**ภาษา:** ไทย  
**วัตถุประสงค์:** ใช้เป็นเอกสารสรุปรายการเมนูหลักของระบบ TJ POS สำหรับนำไปออกแบบ UI/UX, แบ่งสิทธิ์ผู้ใช้งาน และวางโครงสร้างโปรเจกต์

---

## 1. ภาพรวมโครงสร้างระบบ

TJ POS แบ่ง frontend ออกตามประเภทผู้ใช้งานจริง และใช้ backend กลางร่วมกัน:

| ส่วน                             | เทคโนโลยีที่แนะนำ | หน้าที่                                                                  |
| -------------------------------- | ----------------- | ------------------------------------------------------------------------ |
| `frontend/apps/web`              | Next.js           | เว็บไซต์หลักของ TJ POS, landing, pricing, contact, content lo/en         |
| `frontend/apps/platform-admin`   | Vite React        | Platform Admin สำหรับทีม TJ Solution                                     |
| `frontend/apps/business-admin`   | Vite React        | Business Admin สำหรับเจ้าของร้าน / ผู้จัดการ                             |
| `frontend/apps/terminal`         | Vite React        | POS Terminal                                                             |
| `frontend/apps/staff-order`      | Vite React        | Staff Order Mobile                                                       |
| `frontend/apps/kitchen-display`  | Vite React        | Kitchen / Bar Display                                                    |
| `frontend/apps/customer-display` | Vite React        | Customer Display                                                         |
| `frontend/apps/public-menu`      | Vite React        | Public Menu / QR Menu ให้ลูกค้าสแกนดูเมนู                                |
| `backend`                        | Backend API       | Auth, Business, Branch, Items, Orders, Payments, Plans, Add-ons, Reports |

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

| เมนู      | จุดประสงค์                                      | ผู้ใช้งาน                |
| --------- | ----------------------------------------------- | ------------------------ |
| Home      | แนะนำ TJ POS                                    | ลูกค้าที่ยังไม่ได้ใช้งาน |
| POS Types | แนะนำ POS ทั้ง 5 ประเภท                         | ลูกค้าที่ยังไม่ได้ใช้งาน |
| Features  | แสดงฟีเจอร์หลัก                                 | ลูกค้าที่ยังไม่ได้ใช้งาน |
| Pricing   | แสดงแพ็กเกจบริการเพื่อให้ลูกค้าเข้าใจ           | ลูกค้าที่ยังไม่ได้ใช้งาน |
| Add-ons   | แสดง module เสริมที่สามารถเปิดเพิ่มตาม business | ลูกค้าที่ยังไม่ได้ใช้งาน |
| FAQ/Help  | รวมคำถามที่พบบ่อยและช่องทางขอความช่วยเหลือ      | ลูกค้าที่ยังไม่ได้ใช้งาน |
| Contact   | ส่งคำขอปรึกษา / ขอใบเสนอราคา                    | ลูกค้าที่ยังไม่ได้ใช้งาน |

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

| เมนู                         | จุดประสงค์                                                    |
| ---------------------------- | ------------------------------------------------------------- |
| Dashboard                    | ภาพรวมจำนวนร้าน, แพ็กเกจที่ active, ลูกค้าใกล้หมดอายุ         |
| Businesses                   | สร้าง/จัดการร้านหรือธุรกิจของลูกค้า                           |
| Users                        | จัดการบัญชี owner/staff                                       |
| Plans                        | จัดการแพ็กเกจ Starter / Pro / Business / Enterprise           |
| Subscriptions                | ดูแพ็กเกจที่แต่ละ business ใช้งาน                             |
| Add-ons                      | เปิด/ปิด add-on ให้แต่ละ business                             |
| Global Modules Catalog       | จัดการ module catalog กลางของระบบ                             |
| Payments                     | จัดการการชำระเงินแบบ manual / ต่ออายุ                         |
| Master Bank / Payment Config | ตั้งค่า bank และ payment config กลาง                          |
| Contact Requests             | คำขอติดต่อจากเว็บไซต์หลัก                                     |
| Support Tickets              | แจ้งปัญหา, feedback, request feature                          |
| System Settings              | ตั้งค่าระบบรวม                                                |
| Notification Templates       | ตั้งค่า template การแจ้งเตือน                                 |
| Audit Logs                   | ประวัติการกระทำสำคัญในระบบ                                    |
| Profile & Security           | จัดการ profile และ security ของ Platform Admin ที่ login อยู่ |

---

## 4. Business Admin / Business Workspace

Business Workspace คือพื้นที่ทำงานของแต่ละร้าน/ธุรกิจในระบบเดียวกัน

### Route ตัวอย่าง

```text
/business-admin/[businessSlug]
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
/business-admin/[businessSlug]/settings
/business-admin/[businessSlug]/modules
/business-admin/[businessSlug]/import
/business-admin/[businessSlug]/export
/business-admin/[businessSlug]/support
/business-admin/[businessSlug]/audit-logs
/business-admin/[businessSlug]/tables
/business-admin/[businessSlug]/modifiers
/business-admin/[businessSlug]/barista-queue
/business-admin/[businessSlug]/happy-hour
/business-admin/[businessSlug]/cafe-daily-view
/business-admin/[businessSlug]/reservations
/business-admin/[businessSlug]/kitchen-courses
/business-admin/[businessSlug]/split-bill
/business-admin/[businessSlug]/service-charge
/business-admin/[businessSlug]/merge-transfer-table
/business-admin/[businessSlug]/end-of-day
```

กฎสำคัญ:

```text
ใช้ `/business-admin/[businessSlug]/...` เป็น route production ของ Business Workspace หลัง login
`/business-admin` ใช้เป็นหน้าเลือก business หรือ redirect หลัง login ได้
ห้ามใช้ `/b/[businessSlug]/...` เป็น route admin เพราะ `/b` เป็น public URL ของร้าน
ไม่ใช้ `/b/{businessSlug}`
```

เป้าหมายของ Business Workspace:

```text
ให้แต่ละร้านสามารถจัดการและแก้ไขข้อมูลของตัวเองได้ตาม role, permission, plan, POS Type และ enabled modules
```

### เมนูหลักใน Business Workspace

| เมนู                | จุดประสงค์                                                    | ใครเห็น                                |
| ------------------- | ------------------------------------------------------------- | -------------------------------------- |
| Dashboard           | ภาพรวมร้าน                                                    | Owner, Manager                         |
| Business Profile    | ข้อมูลร้าน, โลโก้, สี, ข้อมูลติดต่อ                           | Owner                                  |
| Orders              | ดูออเดอร์/บิล รวม retail, wholesale และ return                 | Owner, Manager, Cashier ตามสิทธิ์      |
| Payments            | ดูรายการชำระเงิน, partial payment และ debt payment             | Owner, Manager, Cashier ตามสิทธิ์      |
| Items               | สินค้า / เมนู / บริการ / ห้อง พร้อมราคาปลีก/ส่ง/reseller      | Owner, Manager                         |
| Categories          | หมวดหมู่                                                      | Owner, Manager                         |
| Inventory           | ดู stock คงเหลือ                                              | Owner, Manager                         |
| Stock Movements     | ดูประวัติ stock in/out/adjustment/refund                      | Owner, Manager                         |
| Stock Count         | นับ stock จริงและตรวจ variance                                | Owner, Manager, Inventory staff        |
| Goods Receiving     | รับสินค้าเข้าและอัปเดต stock                                  | Owner, Manager, Inventory staff        |
| Returns             | return / exchange และ restock                                 | Owner, Manager, Cashier ตามสิทธิ์      |
| Low Stock / Expiry  | แจ้งเตือน stock ต่ำและสินค้าใกล้หมดอายุ                       | Owner, Manager, Inventory staff        |
| Barcode Labels      | พิมพ์ shelf label และ barcode                                 | Owner, Manager, Inventory staff        |
| Table Map           | ผังโต๊ะและสถานะโต๊ะสำหรับ Cafe                                | Owner, Manager, Cashier                |
| Modifiers           | ตัวเลือกกาแฟ เช่น milk, sweetness, shot, temperature, topping | Owner, Manager                         |
| Barista Queue       | queue งานเครื่องดื่มสำหรับ barista                            | Owner, Manager, Barista                |
| Pickup Display      | จอแสดงคิวรับเครื่องดื่มสำหรับลูกค้า                           | Owner, Manager, Barista                |
| Happy Hour          | ตั้งค่า happy hour, combo และ promotion สำหรับ Cafe           | Owner, Manager                         |
| Cafe Daily View     | สรุปยอดขาย, order, queue, โต๊ะ และสินค้าเด่นรายวัน            | Owner, Manager                         |
| Reservations        | จองโต๊ะและจัดคิวลูกค้าร้านอาหาร                               | Owner, Manager, Host                   |
| Kitchen Courses     | จัดลำดับ course อาหารและ routing ไป station ครัว              | Owner, Manager, Kitchen lead           |
| Split Bill          | แบ่งบิลตามลูกค้าหรือ item                                     | Owner, Manager, Cashier                |
| Service Charge      | ตั้งค่า service charge, VAT และ preview ยอดชำระ               | Owner, Manager                         |
| Merge / Transfer    | ย้ายโต๊ะหรือรวมโต๊ะพร้อม order                                | Owner, Manager, Cashier                |
| End of Day          | สรุปยอดปิดวัน restaurant                                      | Owner, Manager                         |
| Suppliers           | จัดการ supplier                                               | Owner, Manager                         |
| Purchase Receipts   | บันทึกการรับสินค้าเข้า                                        | Owner, Manager                         |
| Customers           | จัดการ customer/member/wholesale/reseller profile             | Owner, Manager, Cashier ถ้าเปิด module |
| Loyalty             | แต้ม, VIP, membership, reward                                 | Owner, Manager ถ้าเปิด module          |
| Promotions          | ส่วนลด, coupon, combo                                         | Owner, Manager                         |
| Staff               | พนักงาน                                                       | Owner, Manager ที่มีสิทธิ์             |
| Roles & Permissions | role และ permission                                           | Owner, Manager ที่มีสิทธิ์             |
| Branches            | สาขา                                                          | Owner                                  |
| Devices             | เครื่อง POS, printer, customer display                        | Owner, Manager                         |
| Reports             | รายงาน พร้อม filter customer type, order type และ debt         | Owner, Manager                         |
| Receipt / Bill      | ตั้งค่ารูปแบบบิล                                              | Owner, Manager ที่มีสิทธิ์             |
| Branding            | โลโก้, สี, style                                              | Owner, Manager ที่มีสิทธิ์             |
| Payment Methods     | เงินสด, ธนาคาร, QR                                            | Owner, Manager ที่มีสิทธิ์             |
| Settings            | ตั้งค่าร้าน                                                   | Owner                                  |
| Modules             | เปิด/ปิดฟีเจอร์                                               | Owner                                  |
| Import / Export     | นำเข้าและส่งออกข้อมูล รวม wholesale price/customer debt       | Owner, Manager ที่มีสิทธิ์             |
| Support / Feedback  | แจ้งปัญหา / ขอเพิ่มฟีเจอร์                                    | Owner, Manager, Staff ถ้าอนุญาต        |
| Audit Logs          | ดูประวัติการกระทำสำคัญของร้าน                                 | Owner, Manager ที่มีสิทธิ์             |

หมายเหตุ Wholesale:

```text
ไม่สร้างเมนู Wholesale แยก
ไม่สร้าง TJ Wholesale
ไม่เพิ่มกลุ่ม UI ใหม่

Wholesale support ต้องอยู่ในเมนูเดิม:
Customers, Items, Orders, Payments, Reports, Import / Export, Roles & Permissions
```

---

## 5. POS Terminal

POS Terminal คือหน้าจอขายที่ต้องเร็วและใช้งานง่าย แนะนำให้ใช้ Vite React

### Route ตัวอย่าง

```text
/terminal/b/[businessSlug]/pos
/terminal/b/[businessSlug]/pos/open-orders
/terminal/b/[businessSlug]/pos/held-orders
/terminal/b/[businessSlug]/pos/checkout
/terminal/b/[businessSlug]/pos/receipt-preview
/terminal/b/[businessSlug]/pos/refund
```

### เมนู / หน้าจอ POS Terminal

| หน้าจอ               | จุดประสงค์                            | ผู้ใช้                                 |
| -------------------- | ------------------------------------- | -------------------------------------- |
| POS / Sales          | ขายหน้าร้าน                           | Cashier, Owner, Manager                |
| Category / Item Grid | เลือกสินค้า/เมนู/บริการ               | Cashier                                |
| Barcode Search       | สแกน barcode / ค้นหา SKU              | Retail, Mini mart                      |
| Cart                 | ตะกร้าหรือออเดอร์ปัจจุบัน             | Cashier                                |
| Hold Order           | พักออเดอร์ชั่วคราว                    | Cashier                                |
| Open Orders          | ออเดอร์ที่ยังเปิดอยู่ / ออเดอร์พักไว้ | Cashier                                |
| Checkout             | ชำระเงิน                              | Cashier                                |
| Payment Select       | เลือกเงินสด/ธนาคาร/QR                 | Cashier                                |
| Print Bill           | พิมพ์บิล                              | Cashier                                |
| Refund / Return      | คืนสินค้า / คืนเงิน                   | Manager/Owner หรือ Cashier ที่มีสิทธิ์ |

---

## 6. Staff Order Mobile

Staff Order คือหน้าสำหรับพนักงานใช้โทรศัพท์รับออเดอร์ ไม่ใช่ให้ลูกค้าสั่งเอง

### Route ตัวอย่าง

```text
/staff-order/b/[businessSlug]
/staff-order/b/[businessSlug]/tables
/staff-order/b/[businessSlug]/table/[tableId]
```

### เมนู / หน้าจอ Staff Order

| หน้าจอ              | จุดประสงค์                              | POS Type         |
| ------------------- | --------------------------------------- | ---------------- |
| Table List          | เลือกโต๊ะ                               | Cafe, Restaurant |
| Menu Items          | เลือกเมนู                               | Cafe, Restaurant |
| Item Options        | Size, topping, น้ำตาล/น้ำแข็ง, หมายเหตุ | Cafe             |
| Order Review        | ตรวจสอบออเดอร์ก่อนส่ง                   | Cafe, Restaurant |
| Send to Bar/Kitchen | ส่งออเดอร์ไป bar/ครัว                   | Cafe, Restaurant |
| Open Table Orders   | ดูออเดอร์ตามโต๊ะ                        | Cafe, Restaurant |

> ข้อสรุป: ลูกค้าดูเมนูได้เท่านั้น ออเดอร์จริงต้องให้พนักงานเป็นคนบันทึก

---

## 7. Customer Display

Customer Display คือจอให้ลูกค้าดูรายการและยอดชำระที่หน้าเคาน์เตอร์หรือจอที่สอง

### Route ตัวอย่าง

```text
/display/b/[businessSlug]
/display/b/[businessSlug]/[deviceId]
/display/b/[businessSlug]/pickup-display
```

### หน้าจอ Customer Display

| หน้าจอ           | เนื้อหา                         |
| ---------------- | ------------------------------- |
| Welcome          | โลโก้, ชื่อร้าน, สีของร้าน      |
| Current Order    | รายการที่สั่ง, จำนวน, ราคา      |
| Payment QR       | ยอดรวม, QR, ชื่อธนาคาร          |
| Payment Success  | แจ้งว่าชำระเงินสำเร็จ           |
| Idle / Promotion | ภาพเมนูหรือโปรโมชั่น ถ้าต้องการ |
| Pickup Queue     | จอคิวรับเครื่องดื่มสำหรับ Cafe  |

---

## 8. Kitchen / Bar Display

ใช้กับ Cafe / Restaurant เมื่อเปิด module

### Route ตัวอย่าง

```text
/kitchen/b/[businessSlug]
/bar/b/[businessSlug]
```

### เมนู / หน้าจอ Kitchen-Bar

| หน้าจอ         | จุดประสงค์                |
| -------------- | ------------------------- |
| Pending Orders | รายการที่รอทำ             |
| Preparing      | รายการที่กำลังทำ          |
| Done           | รายการที่เสร็จแล้ว        |
| Order Detail   | รายละเอียดเมนูและหมายเหตุ |
| Station Filter | กรองตาม kitchen / bar     |

---

## 9. Public Menu

Public Menu คือหน้าที่ลูกค้าสแกน QR เพื่อดูเมนู/สินค้า/ราคา แต่ไม่สามารถสร้างออเดอร์เอง

### Route ตัวอย่าง

```text
/b/[businessSlug]
/b/[businessSlug]/menu
/b/[businessSlug]/menu/[itemSlug]
/b/[businessSlug]/info
/b/[businessSlug]/book
/b/[businessSlug]/branch/[branchSlug]/menu
/q/[qrCode]
```

### เมนู Public

| หน้าจอ             | เนื้อหา                           |
| ------------------ | --------------------------------- |
| Business Menu Home | โลโก้, ชื่อร้าน, สีร้าน           |
| Categories         | หมวดหมู่เมนู/สินค้า               |
| Item List          | รูป, ชื่อ, ราคา, คำอธิบาย         |
| Item Detail        | รูปใหญ่, รายละเอียด, option ถ้ามี |
| Out of Stock       | แสดงรายการที่หมด                  |
| QR Table Context   | ถ้า QR ตามโต๊ะ ระบบรู้โต๊ะ/สาขา   |

> ข้อสรุป: Public Menu ใช้ดูเท่านั้น ไม่สร้าง order

---

## 10. Menu แสดงตาม Role

| Role           | เมนูหลักที่เห็น                                          |
| -------------- | -------------------------------------------------------- |
| Platform Admin | Platform Admin ทั้งระบบ                                  |
| Owner          | เกือบทั้งหมดใน Business Workspace                        |
| Manager        | Dashboard, Orders, Items, Staff สาขา, Reports สาขา       |
| Cashier        | POS, Orders, Payments, Hold/Open Orders, Print Bill      |
| Waiter         | Staff Order, Tables, Menu                                |
| Kitchen / Bar  | Kitchen/Bar Orders, Order Status                         |
| Receptionist   | Room Dashboard, Bookings, Check-in/out, Guests, Payments |

---

## 11. Menu แสดงตาม POS Type

| POS Type    | เมนูที่ควรเด่น                                                                                                         | เมนูที่ควรซ่อน                       |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Retail      | Products, Barcode Labels, Inventory, Stock Count, Goods Receiving, Returns, Suppliers, Stock                           | Tables, Kitchen, Rooms, Appointments |
| Cafe        | Table Map, Modifiers, Barista Queue, Pickup Display, Happy Hour, Cafe Daily View, Staff Order, Customer Display        | Rooms, Appointments                  |
| Restaurant  | Table Map, Reservations, Kitchen Courses, Split Bill, Service Charge, Merge / Transfer, End of Day                     | Barcode, Rooms, Commission           |
| Beauty      | Appointments, Calendar, Services, Staff Schedule, Packages, Customer History, Deposit Policy, Beauty Daily, Commission | Tables, Kitchen, Rooms               |
| Hospitality | Rooms, Room Calendar, Bookings, Front Desk, Check-in/out, Guests, Housekeeping, Guest Folio, Deposit Policy            | Topping, Kitchen, Beauty Commission  |

---

## 12. ข้อสรุป frontend project

```text
frontend/apps/web
→ Next.js
→ เว็บไซต์หลักของ TJ POS เท่านั้น

frontend/apps/platform-admin
→ Next.js
→ Platform Admin ของทีม TJ Solution

frontend/apps/business-admin
→ Vite React
→ Business Admin, Reports, Settings, Branding, Payment Methods

frontend/apps/terminal
→ Vite React
→ POS Terminal

frontend/apps/staff-order
→ Vite React
→ Staff Order Mobile

frontend/apps/kitchen-display
→ Vite React
→ Kitchen/Bar Display

frontend/apps/customer-display
→ Vite React
→ Customer Display

frontend/apps/public-menu
→ Vite React
→ Public Menu / QR Menu สำหรับลูกค้าสแกนดูเมนู
```

ทุกส่วนใช้ร่วมกัน:

```text
backend
tj_pos_platform_db
```
