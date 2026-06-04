# TJ POS — UI Interaction Guideline

**เวอร์ชัน:** Final UI Interaction Guideline  
**ภาษา:** ไทย  
**ขอบเขต:** เอกสารนี้ใช้กำหนดหลักการใช้งาน UI component, loading, confirmation, sound และ vibration สำหรับระบบ TJ POS

---

## 1. หลักการหลักของ UI

TJ POS มี 2 กลุ่ม UI หลัก:

```text
1. frontend/apps/web
   → เว็บไซต์หลัก, Platform Admin, Business Admin, Reports, Settings
   → เน้นความชัดเจน, จัดการข้อมูล, ตาราง, ฟอร์ม, รายงาน

2. frontend/apps/terminal
   → POS ขายหน้าร้าน, Staff Order, Customer Display, Kitchen/Bar Display
   → เน้นความเร็ว, ปุ่มใหญ่, ขั้นตอนน้อย, feedback ชัดเจน
```

หลักการสำคัญ:

```text
POS ต้องเร็ว ชัดเจน กันการกดพลาด และกันการกดซ้ำ
Admin ต้องอ่านง่าย จัดการง่าย และมี warning ที่ชัดเจน
Action ที่เกี่ยวกับเงิน, stock, order ต้องมี confirm, เหตุผล และ audit log
```

---

## 2. Modal

### ใช้เมื่อไหร่

ใช้กับงานสั้น ๆ ที่ต้องให้ user โฟกัสกับสิ่งนั้นก่อน แล้วค่อยกลับไปหน้าหลัก

### ควรใช้กับ

```text
Checkout
เลือก payment method
กรอกจำนวนเงินที่ลูกค้าจ่าย
ใส่หมายเหตุเมนู
เลือก size / topping / sugar / ice
กรอกเหตุผลยกเลิก order
กรอกเหตุผล refund
ยืนยันเปิด/ปิดกะ
```

### ไม่ควรใช้กับ

```text
ฟอร์มยาว
สร้าง item/product แบบเต็ม
สร้าง staff แบบละเอียด
ตั้งค่า bill template ซับซ้อน
ตั้งค่า business profile หลาย field
```

ฟอร์มยาวควรใช้ full page หรือ drawer แทน

---

## 3. Drawer / Side Panel

### ใช้เมื่อไหร่

ใช้เมื่อต้องดูหรือแก้รายละเอียด โดยยังอยากให้ user เห็น context ของหน้าหลักอยู่

### ควรใช้กับ

```text
รายละเอียด order
รายละเอียด item
รายละเอียด customer
รายละเอียด staff
รายละเอียด booking
รายละเอียด room
ประวัติการชำระเงิน
ประวัติ stock movement
```

### ตัวอย่าง

```text
อยู่หน้า Orders
→ กด order หนึ่งรายการ
→ เปิด drawer ด้านขวา
→ เห็น order detail, payment, bill, refund history
```

---

## 4. Select

### ใช้เมื่อไหร่

ใช้เมื่อรายการตัวเลือกมีน้อย และ user ไม่จำเป็นต้องค้นหา

### ควรใช้กับ

```text
Role
Branch
POS Type
Payment Method
Bank
Order Status
Payment Status
Paper Size: 58mm / 80mm / A4
Receipt Mode: Black & White / Color
Language
Currency
```

---

## 5. Combobox / Search Select

### ใช้เมื่อไหร่

ใช้เมื่อรายการมีจำนวนมาก และต้องค้นหาได้

### ควรใช้กับ

```text
ค้นหา product / item
ค้นหา customer / member
ค้นหา supplier
ค้นหา staff
ค้นหา room
ค้นหา booking
ค้นหา order
```

### ตัวอย่าง

```text
Cashier กรอกเบอร์โทรลูกค้า
→ combobox ค้นหา member
→ ถ้าไม่พบ ให้แสดง option “สร้าง customer ใหม่”
```

---

## 6. Alert

### ใช้เมื่อไหร่

ใช้กับข้อความสำคัญที่ต้องให้ user เห็นบนหน้า

### ควรใช้กับ

```text
แพ็กเกจใกล้หมดอายุ
ใกล้ถึง limit ของ items/staff/devices
stock ใกล้หมด
payment ยังไม่ยืนยัน
module ยังไม่ได้เปิด
ไม่มีสิทธิ์ทำ action นี้
device offline
backup failed
```

### ระดับของ Alert

```text
Info
Warning
Error
Success
```

### ตัวอย่าง

```text
Items: 1,850 / 2,000
ใกล้ถึง limit ของแพ็กเกจ Pro แล้ว
กรุณาติดต่อ TJ POS เพื่อขยาย limit หรืออัปเกรดแพ็กเกจ
```

---

## 7. Toast

### ใช้เมื่อไหร่

ใช้สำหรับ feedback สั้น ๆ หลังจาก action เสร็จ

### ควรใช้กับ

```text
บันทึกสำเร็จ
เพิ่ม item ลง cart แล้ว
ส่ง support ticket แล้ว
ไม่พบ barcode
เชื่อมต่อกลับมาแล้ว
พิมพ์บิลสำเร็จ
```

### ไม่ควรใช้กับ

```text
Payment failed แบบสำคัญ
Refund failed
Printer error ที่ต้องแก้
Action ที่กระทบเงิน/stock/order
```

กรณีสำคัญควรใช้ Alert หรือ Modal แทน

---

## 8. Confirm Dialog

### ใช้เมื่อไหร่

ใช้กับ action ที่มีผลกระทบหรือมีความเสี่ยง

### ต้องมี confirm สำหรับ

```text
ยกเลิก order
Refund
Return item
ปรับ stock
ปิดกะ
ลบ/หยุดขาย item
ล็อก staff
ปิด module
Reset bill template
ล็อก business
```

### Confirm Dialog ควรมี

```text
หัวข้อชัดเจน
อธิบายผลกระทบ
ข้อมูล object ที่ถูกกระทบ
ช่องกรอกเหตุผล ถ้าเป็น action สำคัญ
ปุ่ม Cancel
ปุ่ม Confirm ที่ใช้สีเตือน
```

---

## 9. ระดับของ Confirm

### ระดับ 1 — Confirm แบบเบา

ใช้กับ action ที่ย้อนกลับได้ง่าย

```text
หยุดขาย item
ออกจาก form ที่ยังไม่ได้บันทึก
ปิด promotion
```

ไม่จำเป็นต้องกรอกเหตุผล

---

### ระดับ 2 — Confirm + เหตุผล

ใช้กับ action ที่กระทบ order หรือ stock

```text
ยกเลิก order
ยกเลิกเมนู
ปรับ stock
คืนสินค้า
```

ต้องกรอกเหตุผล และควรบันทึก audit log

---

### ระดับ 3 — Confirm + เหตุผล + สิทธิ์สูง

ใช้กับ action ที่กระทบเงินหรือข้อมูลสำคัญ

```text
Refund
ลบข้อมูลสำคัญ
ล็อก business
Reset ข้อมูล
เปลี่ยนสถานะแพ็กเกจ
```

ต้องใช้สิทธิ์ Manager / Owner / Platform Admin ตามกรณี

---

## 10. Loading

### ใช้เมื่อไหร่

ใช้เมื่อระบบกำลังประมวลผล และ user ต้องรอผลลัพธ์

### ประเภท Loading

```text
Page Loading
Table Loading
Button Loading
Inline Loading
Full-screen Blocking Loading
Progress Bar
```

---

### 10.1 Page Loading

ใช้เมื่อเปิดหน้าขนาดใหญ่ครั้งแรก

```text
Dashboard
Reports
Items
Orders
Platform Admin Businesses
```

ควรใช้ skeleton แทนหน้าว่าง

---

### 10.2 Table Loading

ใช้เมื่อตารางกำลังโหลดข้อมูล

```text
Orders
Items
Customers
Staff
Payments
Reports
Support Tickets
```

ถ้าเปลี่ยน filter ไม่ควรทำทั้งหน้าขาว ควร loading เฉพาะ table

---

### 10.3 Button Loading

ใช้เมื่อ user กดปุ่มแล้วระบบกำลังทำงาน

```text
Save
Create
Checkout
Confirm Paid
Refund
Print
Upload
Import
Export
```

ต้อง disable ปุ่มระหว่าง loading เพื่อกันการกดซ้ำ

ตัวอย่างสำคัญ:

```text
กด Confirm Paid
→ ปุ่มขึ้น Processing...
→ ปุ่มถูก disable
→ สำเร็จแล้ว order = Paid
```

---

### 10.4 Inline Loading

ใช้กับการโหลดเล็ก ๆ ในส่วนหนึ่งของหน้า

```text
ค้นหา member ด้วยเบอร์โทร
ค้นหา product ด้วย barcode
โหลด item เพิ่มใน category
ตรวจ stock
```

---

### 10.5 Full-screen Blocking Loading

ใช้เฉพาะงานสำคัญมากที่ไม่ควรให้ user ทำอย่างอื่น

```text
กำลังยืนยัน payment
กำลังกู้ session POS
กำลัง sync order สำคัญ
```

ไม่ควรใช้บ่อย เพราะทำให้ POS รู้สึกช้า

---

### 10.6 Progress Bar

ใช้กับงานยาว

```text
Import Excel
Export report
Upload logo / image
Generate PDF ขนาดใหญ่
```

ตัวอย่าง:

```text
Importing products...
450 / 1,000 rows processed
```

---

## 11. Empty State

### ใช้เมื่อไหร่

ใช้เมื่อยังไม่มีข้อมูลในหน้านั้น

### ตัวอย่าง

```text
ยังไม่มีสินค้า
→ Add Item / Import XLSX

ยังไม่มี order วันนี้
→ เปิด POS เพื่อเริ่มขาย

ยังไม่มีพนักงาน
→ Add Staff

ยังไม่มี customer profile
→ เปิด Loyalty ถ้าต้องการใช้ระบบ member
```

Empty State ต้องบอก user ว่าควรทำอะไรต่อ

---

## 12. Error State

### ใช้เมื่อไหร่

ใช้เมื่อโหลดข้อมูลหรือทำ action ไม่สำเร็จ

### ตัวอย่าง error ที่ต้องรองรับ

```text
โหลดสินค้าไม่สำเร็จ
ไม่พบ barcode
stock ไม่พอ
printer ไม่เชื่อมต่อ
ไม่มีสิทธิ์ทำ action นี้
payment ยังไม่ยืนยัน
module ยังไม่เปิด
network หลุด
```

### รูปแบบที่ควรใช้

ไม่ควรแสดงแค่:

```text
Error
```

ควรแสดง:

```text
ไม่สามารถโหลดรายการสินค้าได้
กรุณาลองใหม่อีกครั้ง

[Retry]
```

---

## 13. Disabled State

### ใช้เมื่อไหร่

ใช้เมื่อ user ยังไม่สามารถกด action ได้

### ตัวอย่าง

```text
Checkout disabled ถ้า cart ว่าง
Confirm Paid disabled ถ้ายังไม่เลือก payment method
Refund disabled ถ้า user ไม่มีสิทธิ์
Save disabled ถ้า field บังคับยังไม่ครบ
Print disabled ถ้า order ยังไม่พร้อมพิมพ์
```

ควรมีคำอธิบายสั้น ๆ ว่าทำไมปุ่มถึง disabled

---

## 14. Sound

### ใช้เมื่อไหร่

ใช้หลัก ๆ ใน POS Terminal เพื่อ feedback เร็ว

### ควรมีเสียงสำหรับ

```text
Scan barcode สำเร็จ
Scan barcode ไม่พบ
Payment success
Payment failed
Order ใหม่เข้า kitchen/bar
Stock ไม่พอ
Printer error
```

### ตัวอย่างเสียง

| สถานการณ์ | เสียง |
|---|---|
| Barcode สำเร็จ | beep สั้น |
| Barcode ไม่พบ | error beep |
| Payment success | success chime |
| Payment failed | error tone |
| New kitchen order | notification bell |
| Stock warning | warning beep |

ต้องมี setting เปิด/ปิดเสียง

```text
Terminal Settings → Sound ON/OFF
```

---

## 15. Vibration

### ใช้เมื่อไหร่

ใช้เฉพาะ mobile/tablet โดยเฉพาะ Staff Order Mobile

### ควรใช้กับ

```text
ส่ง order สำเร็จ
ส่ง order ไม่สำเร็จ
มี notification ใหม่
Scan mobile สำเร็จ/ไม่สำเร็จ
```

ไม่ควรรุงบ่อยเกินไป

ต้องมี setting เปิด/ปิด

```text
Terminal Settings → Vibration ON/OFF
```

---

## 16. Offline / Reconnect State

MVP ยังไม่ต้องมี offline mode เต็มรูปแบบ แต่ต้องมีสถานะ network

### สถานะที่ต้องมี

```text
Offline
Reconnecting
Reconnected
```

### ตอน offline

```text
ไม่ควรให้ checkout ถ้าต้องยืนยัน server
ไม่ควรให้ Confirm Paid ถ้าไม่แน่ใจว่า server ได้รับข้อมูล
อาจเก็บ cart local ชั่วคราวได้
```

### ตอน reconnect

```text
แสดง toast: Reconnected
อาจมีเสียงแจ้งเตือนเบา ๆ
```

---

## 17. Notification Badge

ใช้แสดงจำนวนสิ่งที่ต้องสนใจ

### ตัวอย่าง

```text
Open Orders (3)
Held Orders (2)
Support Reply (1)
Payment Pending (2)
Stock Warning (5)
New Kitchen Orders (4)
```

---

## 18. Optimistic UI

### ใช้ได้กับงานเบา

```text
เพิ่ม item ลง cart แบบ local
เพิ่ม/ลดจำนวนใน cart
เลือก category
เขียน note ก่อนส่ง order
```

### ไม่ควรใช้กับงานสำคัญ

```text
Payment
Refund
Stock deduction
Close shift
Delete data
```

งานเกี่ยวกับเงินและ stock ต้องรอ server ยืนยันก่อน

---

## 19. Debounce

ใช้กับ search เพื่อไม่ให้เรียก request บ่อยเกินไป

### ใช้กับ

```text
Search product
Search customer by phone
Search order
Search supplier
Search staff
```

ค่าแนะนำ:

```text
300ms
```

Barcode scan ไม่ควร delay นาน เพราะต้องตอบสนองเร็ว

---

## 20. Pagination / Load More

ใช้กับข้อมูลจำนวนมาก

### ใช้กับ

```text
Orders
Items
Customers
Staff
Payments
Reports
Audit Logs
Support Tickets
```

POS item grid สามารถใช้:

```text
Category + limit
Search + limit
Load More
```

ไม่ควรโหลด items ทั้งหมดจำนวนมากในครั้งเดียว

---

## 21. UI Rule สำหรับ POS Terminal

POS Terminal ต้องเน้นเร็ว

### ควรมี

```text
ปุ่มใหญ่
cart มองเห็นเสมอ
checkout ไม่หลายขั้นตอน
Hold Order กดง่าย
Open Orders กลับมาได้เร็ว
feedback ด้วย toast/sound
ป้องกันการกดซ้ำ
```

### การใช้งานหลัก

| Action | UI ที่ควรใช้ |
|---|---|
| เลือก item | Grid / Card |
| ค้นหา item | Search input |
| Scan barcode | Focus input + beep |
| เพิ่ม/ลดจำนวน | Inline +/- |
| หมายเหตุเมนู | Modal สั้น |
| Size/Topping | Modal หรือ Bottom Sheet |
| Hold Order | Button + Toast |
| Checkout | Modal / Checkout Panel |
| เลือกธนาคาร | Select หรือ Card List |
| Confirm Paid | Button loading + disabled |
| Refund | Confirm + เหตุผล |
| Print Bill | Button + Toast |

---

## 22. UI Rule สำหรับ Business Admin

Business Admin เน้นจัดการข้อมูลชัดเจน

| Action | UI ที่ควรใช้ |
|---|---|
| สร้าง item เต็ม | Full Page Form |
| แก้ item เร็ว | Drawer |
| ดู order detail | Drawer |
| สร้าง staff | Full Page หรือ Modal ตามจำนวน field |
| เปิด/ปิด module | Switch + Confirm |
| ตั้งค่า bill | Page + Preview |
| ตั้งค่า branding | Page + Live Preview |
| ตั้งค่า payment method | Page/Form |
| Reports | Page + Filter + Export |

---

## 23. UI Rule สำหรับ Platform Admin

Platform Admin ใช้โดยทีม TJ POS

| Action | UI ที่ควรใช้ |
|---|---|
| สร้าง business | Full Page Form หรือ Wizard |
| กำหนดแพ็กเกจ | Modal หรือ Detail Page |
| เปิด add-on | Switch + Confirm |
| ต่ออายุแพ็กเกจ | Modal |
| Lock business | Confirm + เหตุผล |
| ดู support ticket | Drawer หรือ Detail Page |
| ดู contact request | Table + Detail Drawer |
| Audit logs | Table + Filter |

---

## 24. UI Rule สำหรับ Public Menu

Public Menu ใช้ดูเท่านั้น ไม่สั่งเอง

### ควรมี

```text
Card menu สวย
Category tabs
Search ง่าย
Item detail modal / bottom sheet
Out of stock badge
Logo และสีตามร้าน
```

### ไม่ควรมี

```text
Cart
Checkout
Add to order
Payment
```

---

## 25. UI Rule สำหรับ Customer Display

Customer Display ไม่ควรมีปุ่มเยอะ

### ควรแสดง

```text
Logo ร้าน
รายการ order
จำนวน
ยอดรวม
QR
ชื่อธนาคาร
Payment success
```

### หลัก UI

```text
ตัวอักษรใหญ่
contrast สูง
ข้อมูลน้อย
ไม่มี sidebar
ไม่มี form
```

---

## 26. UI Rule สำหรับ Kitchen / Bar

Kitchen / Bar Display ต้องชัดและเร็ว

### ควรใช้

```text
Kanban หรือ list ตาม status
Pending
Preparing
Done
```

### Order card ควรมี

```text
Table
Order number
Items
Item note
Time waiting
Priority
```

### Sound

```text
มี order ใหม่ → notification sound
```

---

## 27. สีสถานะ UI

แม้แต่ละร้านจะมี branding color ของตัวเอง แต่ status color ควรใช้มาตรฐานเดียวกัน

```text
Green = success / paid / done
Yellow/Orange = warning / pending
Red = error / cancelled / failed
Blue = info / active
Gray = inactive / disabled
```

ห้ามให้ branding color ทำให้ status color สับสน

---

## 28. ข้อสรุปสุดท้าย

```text
Modal = งานสั้นที่ต้อง focus
Drawer = ดู/แก้รายละเอียดโดยไม่ออกจากหน้า
Select = ตัวเลือกน้อย
Combobox = รายการยาว ต้องค้นหา
Alert = เตือนเรื่องสำคัญ
Toast = feedback เร็ว
Confirm = action ที่มีความเสี่ยง
Loading = ระบบกำลังประมวลผล
Empty State = ยังไม่มีข้อมูล
Error State = เกิดข้อผิดพลาด
Disabled = ยังไม่พร้อมกด
Sound = feedback เร็วใน POS
Vibration = feedback บน mobile
Offline/Reconnecting = สถานะ network
Progress Bar = งานยาว เช่น import/export
```

ข้อสรุปหลัก:

```text
POS ต้องเร็ว ชัดเจน กันกดพลาด กันกดซ้ำ
Admin ต้องจัดการง่าย มี warning ชัด
Action เกี่ยวกับเงิน, stock, order ต้องมี confirm, เหตุผล และ audit log
