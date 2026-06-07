# โฟลว์สุดท้ายของ TJ POS

เอกสารนี้เป็นเวอร์ชันสรุปสุดท้ายของแนวคิด **TJ POS** ตามที่ได้ตกลงกันล่าสุด โดยเนื้อหานี้ใช้สำหรับอธิบายทิศทางสินค้า โครงสร้างระบบ โฟลว์การใช้งาน และ business model ของ TJ POS ให้ทีมเข้าใจตรงกัน

---

## 1. นิยามของ TJ POS

**TJ POS** คือระบบ **Managed SaaS POS สำหรับใช้งานภายในประเทศ**

ความหมายคือ TJ POS ไม่ใช่แค่หน้าขายของธรรมดา แต่เป็นแพลตฟอร์มกลางที่ให้หลายร้าน หลายธุรกิจ และหลายบริการใช้งานระบบเดียวกัน โดยแต่ละร้านจะมี workspace ของตัวเอง มีข้อมูลของตัวเอง มีพนักงานของตัวเอง มีเมนู สินค้า ใบเสร็จ สี โลโก้ และการตั้งค่าของตัวเอง

แนวทางที่ตกลงกันคือ:

```text
ลูกค้าไม่สร้าง business เองแบบอัตโนมัติ
ลูกค้าไม่ซื้อแพ็กเกจเองแบบ self-service
ลูกค้าสนใจ → ติดต่อ TJ POS
ทีม TJ POS ให้คำปรึกษา → setup ร้าน → ลูกค้า login ใช้งาน
```

ดังนั้น TJ POS จะเป็นบริการแบบ **managed service** มากกว่า SaaS global ที่ปล่อยให้ผู้ใช้ทำทุกอย่างเอง

---

## 2. โครงสร้างระบบหลัก

ระบบ TJ POS แบ่งเป็น 3 ส่วนหลัก

| ส่วนระบบ | เทคโนโลยีที่แนะนำ | ใช้ทำอะไร |
|---|---|---|
| **frontend/apps/web** | Next.js | เว็บไซต์หลักของ TJ POS, landing, pricing, contact |
| **frontend/apps/platform-admin** | Next.js | Platform Admin สำหรับทีม TJ Solution |
| **frontend/apps/business-admin** | Vite React | Business Admin ของร้าน, Reports, Settings, Branding |
| **frontend/apps/terminal** | Vite React | หน้าขาย POS |
| **frontend/apps/staff-order** | Vite React | Staff Order บนมือถือ |
| **frontend/apps/kitchen-display** | Vite React | Kitchen / Bar Display |
| **frontend/apps/customer-display** | Vite React | Customer Display |
| **frontend/apps/public-menu** | Vite React | Public Menu / QR Menu สำหรับลูกค้าสแกนดูเมนู |
| **backend** | Backend API | Auth, Business, Branch, Orders, Payments, Plans, Modules, Reports, Backup settings |

แนวคิดสำคัญคือระบบมีหลายพื้นที่ใช้งาน แต่ไม่ได้หมายความว่าต้องมีหลายระบบแยกกันทั้งหมด ทุกส่วนใช้ backend และ database เดียวกันในช่วงเริ่มต้น

---

## 3. เว็บไซต์หลักของ TJ POS

เว็บไซต์หลักคือหน้าเว็บของ TJ POS ที่ใช้แนะนำสินค้าให้ลูกค้าที่ยังไม่ได้ใช้งานจริง

ตัวอย่างหน้าเว็บ:

```text
tjpos.la
หรือ
app.tjpos.la
```

หน้าเว็บหลักควรมี:

```text
Home
POS Types
Features
Pricing
Add-ons
FAQ/Help
Contact
```

จุดประสงค์ของเว็บหลัก:

- อธิบายว่า TJ POS คืออะไร
- แสดง 5 ประเภท POS ที่รองรับ
- แสดงฟีเจอร์หลัก
- แสดงแพ็กเกจบริการ
- แสดง Add-ons ที่เปิดเพิ่มได้ตาม business
- รวมคำถามที่พบบ่อยและช่องทางขอความช่วยเหลือ
- ให้ลูกค้าติดต่อเพื่อขอคำปรึกษา
- ให้ลูกค้านัดคุยกับทีม TJ POS ผ่าน contact

เว็บไซต์หลักไม่ควรเปิด demo แบบ interactive ให้คนทั่วไปเข้ามากดเล่นในช่วง MVP ควรใช้ภาพหน้าจอ วิดีโอ หรือการ demo แบบส่วนตัวแทน

ปุ่มหลักที่ควรใช้:

```text
ติดต่อขอคำปรึกษา
ขอใบเสนอราคา
นัดคุยกับทีม TJ POS
```

ไม่ควรเน้น:

```text
Register Now
Start Free
Try Demo Public
```

---

## 4. โฟลว์ลูกค้าที่ต้องการใช้งาน TJ POS

โฟลว์ที่ตกลงกันคือ:

```text
ลูกค้าเข้าเว็บไซต์หลัก
↓
ดูข้อมูล ฟีเจอร์ รูปภาพ และแพ็กเกจ
↓
ถ้าสนใจ → ติดต่อทีม TJ POS
↓
ทีม TJ POS ให้คำปรึกษา เลือก POS Type ที่เหมาะสม
↓
ทีม TJ POS สร้าง account owner ให้ลูกค้า
↓
ทีม TJ POS สร้าง business / ร้านให้ลูกค้า
↓
ทีม TJ POS เลือก POS Type + แพ็กเกจ + add-on
↓
ทีม TJ POS setup เบื้องต้น:
  - ชื่อร้าน
  - โลโก้
  - สีของร้าน
  - สาขาแรก
  - เมนู / สินค้า / บริการ
  - QR ชำระเงิน
  - รูปแบบบิล
  - พนักงาน
↓
ลูกค้า login เข้า workspace ของร้านเพื่อใช้งานจริง
```

แนวทางนี้เหมาะกับตลาดในประเทศ เพราะเจ้าของร้านจำนวนมากต้องการคนช่วย setup ตั้งแต่ต้น เช่น เมนู พนักงาน เครื่องพิมพ์ QR และบิล

---

## 5. Platform Admin ของ TJ POS

**Platform Admin** คือหน้าจัดการสำหรับทีม TJ POS เท่านั้น ไม่ใช่ admin ของร้านลูกค้า

ตัวอย่าง route:

```text
app.tjpos.la/platform-admin
```

Platform Admin ใช้สำหรับ:

- จัดการรายชื่อ business / ร้านทั้งหมด
- สร้าง business ให้ลูกค้า
- สร้าง owner account
- เลือก POS Type ให้ร้าน
- กำหนดแพ็กเกจบริการ
- กำหนด limit ของแต่ละแพ็กเกจ
- เปิด / ปิด add-on
- ต่ออายุแพ็กเกจ
- ปิด / เปิด business
- จัดการการชำระเงินแบบ manual
- ดูคำขอติดต่อจากลูกค้า
- ดู feedback / bug report / feature request
- ช่วย support ลูกค้า

Platform Admin คือศูนย์กลางการบริหารบริการของ TJ POS

---

## 6. Business Workspace ของแต่ละร้าน

แต่ละร้านจะมี workspace ของตัวเองภายในระบบเดียวกัน

ตัวอย่าง:

```text
app.tjpos.la/business-admin/tj-cafe
```

ตัวอย่าง route ภายใน workspace:

```text
/business-admin/tj-cafe
/business-admin/tj-cafe/dashboard
/business-admin/tj-cafe/profile
/business-admin/tj-cafe/orders
/business-admin/tj-cafe/items
/business-admin/tj-cafe/customers
/business-admin/tj-cafe/reports
/business-admin/tj-cafe/settings
/business-admin/tj-cafe/branding
/business-admin/tj-cafe/receipt-bill
/business-admin/tj-cafe/payment-methods
```

เป้าหมายของ Business Workspace คือให้แต่ละร้านสามารถจัดการและแก้ไขข้อมูลของตัวเองได้เกือบทั้งหมด โดยระบบต้องควบคุมด้วย `role`, `permission`, `plan`, `POS Type` และ `enabled modules`

เจ้าของร้านเป็น admin หลักของ business นั้น และสามารถจัดการ:

- เมนู / สินค้า / บริการ
- หมวดหมู่, variant, option, topping หรือข้อมูลเฉพาะตาม POS Type
- พนักงาน
- role และ permission
- สาขา
- stock, stock movement, stock in, stock adjustment
- supplier และ purchase receipt
- ลูกค้า, loyalty, promotion, coupon
- รายงาน
- โลโก้
- สีของร้าน
- ชื่อร้าน
- รูปแบบบิล
- QR ชำระเงิน
- payment method และข้อมูลธนาคาร
- device และ printer
- import / export
- module ที่เปิดใช้งานตามแพ็กเกจ
- คำขอ support ไปยัง TJ POS

สิ่งที่ร้านแก้ได้ต้องไม่เกินสิทธิ์และ package limit ที่ทีม TJ POS กำหนดไว้ใน Platform Admin

หมายเหตุสำคัญ:

```text
/b/[businessSlug] เป็น public URL ของร้าน ไม่ใช่ admin workspace
/business-admin/[businessSlug] เป็น route หลัง login สำหรับ owner / manager จัดการร้าน
```

---

## 7. ไม่มี admin app แยกสำหรับแต่ละร้าน

TJ POS ไม่ต้องสร้าง admin app แยกให้แต่ละร้าน ทุกอย่างอยู่ในระบบเดียวกัน แต่แสดงเมนูตาม role และ permission

ตัวอย่าง workspace เดียวกัน:

```text
app.tjpos.la/business-admin/tj-cafe
```

แต่ผู้ใช้แต่ละ role จะเห็นไม่เหมือนกัน:

| Role | เห็นอะไร |
|---|---|
| **Owner** | เห็น admin ของร้านเกือบทั้งหมด |
| **Manager** | เห็นการจัดการสาขา พนักงาน รายงาน |
| **Cashier** | เห็น POS ขายสินค้า Orders Payments |
| **Waiter** | เห็น Staff Order โต๊ะ และเมนู |
| **Kitchen / Bar** | เห็นรายการ order ที่ต้องทำ |
| **Receptionist** | เห็นห้อง booking check-in/out สำหรับ Hospitality POS |

ดังนั้นระบบแยกด้วย:

```text
business_id
branch_id
role
permissions
enabled modules
plan limits
```

---

## 8. User / Business / Branch

ความหมายหลัก:

| คำ | ความหมาย |
|---|---|
| **User** | คนที่ login เข้าระบบ |
| **Business** | ร้าน แบรนด์ หรือธุรกิจ |
| **Branch** | สาขา หรือสถานที่ขายของ business นั้น |

กฎที่ตกลงกัน:

```text
เจ้าของเดียวกัน + แบรนด์เดียวกัน + หลายสถานที่
→ ใช้ Branch

User เดียวกันแต่มีหลายแบรนด์หรือหลายประเภทธุรกิจ
→ สร้าง Business ใหม่

คนละเจ้าของหรือคนละผู้ดูแล
→ สร้าง User / Account ใหม่
```

ตัวอย่าง:

```text
User: Tay

Business: TJ Cafe
- Branch: Vientiane
- Branch: Pakse

Business: TJ Mini Mart
- Branch: Main Branch

Business: TJ Spa
- Branch: Main Branch
```

---

## 9. POS Type หลัก 5 ประเภท

| ลำดับ | POS Type | เหมาะกับ |
|---:|---|---|
| 1 | **Retail POS** | ร้านค้าปลีก เช่น ร้านชำ มินิมาร์ท แฟชั่น เครื่องสำอาง decor ของขวัญ อุปกรณ์เสริม |
| 2 | **Cafe POS** | ร้านกาแฟ ชานม น้ำผลไม้ smoothie bakery เล็ก take-away |
| 3 | **Restaurant POS** | ร้านอาหาร ร้านข้าว เฝอ หม้อไฟ ปิ้งย่าง buffet เล็ก ร้านนั่งดื่ม |
| 4 | **Beauty POS** | Spa, salon, nail, massage, skincare, barber |
| 5 | **Hospitality POS** | Guesthouse, homestay, โรงแรมเล็ก, hostel, villa |

ถ้าต้องการขยายในอนาคต สามารถเพิ่ม:

```text
Facility / Rental POS
→ สนามฟุตบอล สนามแบดมินตัน สนาม pickleball บิลเลียด karaoke การเช่าเป็นชั่วโมง
```

แต่ยังไม่ควรใส่ใน MVP 5 ประเภทหลัก

---

## 10. เมนูหลักที่ทุก POS ควรมี

เมนู core ที่ทุกประเภทควรมี:

```text
Dashboard
POS / Sales
Orders
Payments
Items / Products / Services
Customers
Promotions
Reports
Staff
Branches
Devices
Receipt / Bill
Branding
Settings
Subscription
Support / Feedback
```

แต่เมนูจริงที่ผู้ใช้เห็นจะขึ้นอยู่กับ:

```text
POS Type
Role
Plan
Enabled modules
Add-ons
```

---

## 11. เมนูเฉพาะของแต่ละ POS Type

### 11.1 Retail POS

```text
Products
Categories
Barcode / SKU
Inventory
Stock In
Stock Adjustment
Suppliers
Customers
Loyalty
Promotions
Reports
```

### 11.2 Cafe POS

```text
Menu Items
Categories
Size / Options
Toppings
Sugar / Ice Level
Tables ถ้าร้านมีที่นั่ง
Bar Orders
Customers
Loyalty
Promotions
Reports
QR Menu
Staff Order
Customer Display
```

### 11.3 Restaurant POS

```text
Table Map
Areas
Order by Table
Menu Items
Kitchen Display
Order Status
Split Bill
Merge / Move Table
Service Charge
Customers
Loyalty
Promotions
Reports
QR Menu
Staff Order
```

### 11.4 Beauty POS

```text
Appointments
Calendar
Services
Staff Calendar
Customers
Customer History
Packages
Membership
Commission
Product Sales ถ้ามี
Promotions
Reports
```

### 11.5 Hospitality POS

```text
Room Dashboard
Room Calendar
Rooms
Bookings
Check-in / Check-out
Guests
Deposit
Extra Services
Housekeeping
Payments
Invoice / Receipt
Occupancy Report
Reports
```

---

## 12. POS Terminal สำหรับการขาย

POS Terminal ใช้ **Vite React** เพื่อให้หน้าขายทำงานเร็ว คลิกเร็ว และเหมาะกับหน้าจอ touch

Core ของหน้าขาย:

```text
Category
Search
รายการ item/product/menu/service
Cart
Quantity
Note
Discount
Payment
Bill
Hold Order
Open Orders
Resume Order
```

Layout แตกต่างตามประเภท POS:

| POS Type | Layout หลัก |
|---|---|
| Retail | product / barcode layout |
| Cafe | menu / topping layout |
| Restaurant | table layout |
| Beauty | booking / service layout |
| Hospitality | room / check-in layout |

---

## 13. Hold Order

POS ต้องมีความสามารถ:

```text
Hold Order
New Sale
Open Orders
Resume Order
```

เพื่อรองรับสถานการณ์จริง เช่น ลูกค้าคนแรกเลือกของนาน แต่ลูกค้าคนถัดไปซื้อของน้อยและจ่ายเร็ว

Flow:

```text
ลูกค้า A กำลังเลือกหลายรายการ
↓
พนักงานกด Hold Order
↓
เปิด New Sale ให้ลูกค้า B
↓
ขายให้ลูกค้า B ก่อน
↓
กลับมา Resume Order ของลูกค้า A
```

ระบบไม่ควรตัดสินใจเองว่าใครควรได้ก่อน พนักงานเป็นคนควบคุม

---

## 14. QR Menu และ Staff Order

ข้อตกลงสำคัญ:

```text
ลูกค้าดูเมนูได้เท่านั้น
ลูกค้าไม่สามารถ order เองได้
order จริงต้องให้พนักงานเป็นคนบันทึก
```

Flow:

```text
ลูกค้า scan QR
↓
ดูเมนู รูป ราคา
↓
เรียกพนักงาน
↓
พนักงานใช้มือถือเลือกโต๊ะ
↓
พนักงานบันทึกรายการอาหาร/เครื่องดื่ม
↓
order เข้าไปในระบบ
```

Module นี้เหมาะกับ:

```text
Cafe POS
Restaurant POS
```

ไม่จำเป็นต้องเปิดให้ทุก POS

---

## 15. Customer Display

Customer Display คือหน้าจอที่หันให้ลูกค้าดูตอนสั่งหรือจ่ายเงิน

แสดง:

```text
โลโก้ร้าน
รายการที่กำลังสั่ง
จำนวน
ราคา
ยอดรวม
QR ชำระเงิน
ชื่อธนาคาร
Payment success
```

Customer Display ต้องใช้สี โลโก้ และ style ของร้านนั้น

เป็น optional module หรือ add-on ไม่ต้องเปิดให้ทุก business

---

## 16. Branding ของแต่ละร้าน

แต่ละ business สามารถปรับ:

```text
ชื่อร้าน
โลโก้
สีหลัก
สีรอง
ภาพ banner
QR ชำระเงิน
Receipt footer
Menu style
Customer display style
```

เป้าหมายคือ:

```text
ระบบเดียวกัน แต่แต่ละร้านรู้สึกเหมือนเป็นระบบของตัวเอง
```

---

## 17. Bill / Receipt Designer

ผู้ใช้สามารถปรับการแสดงผลของ bill ได้ เช่น:

```text
โลโก้
ชื่อร้าน
ที่อยู่
เบอร์โทร
Footer
QR ชำระเงิน
ชื่อคอลัมน์ที่แสดง
เปิด/ปิด block
Template
```

แต่ไม่สามารถแก้ไขข้อมูลจริงของ order ได้

ค่าเริ่มต้นของ bill:

```text
Black & White
ไม่ใช้สี
๕๘ มม. / ๘๐ มม.
```

Color Receipt เป็น option ขั้นสูง ไม่ใช่ค่าเริ่มต้น

Field บางอย่างเป็น optional เช่น:

```text
table_id
note
room_id
appointment_id
```

ถ้าโมเดลธุรกิจนั้นไม่ใช้ ให้เก็บเป็น `null` และไม่แสดงบน bill

---

## 18. Loyalty / Customer Profile

การขายปกติไม่จำเป็นต้องบันทึกข้อมูลลูกค้า

```text
ขายธรรมดา
→ ไม่ต้องมี customer profile
```

จะบันทึก customer profile ก็ต่อเมื่อร้านเปิด Loyalty / Membership เช่น:

```text
สะสมแต้ม
VIP
Coupon
ส่วนลดครั้งถัดไป
ประวัติการซื้อ
โปรโมชั่นวันเกิด
```

ในแพ็กเกจควรเรียกให้ชัดว่า:

```text
Member profiles
Customer profiles
โปรไฟล์ลูกค้าสมาชิก
```

ไม่ใช่จำนวนลูกค้าทั่วไปที่เข้ามาซื้อของ

---

## 19. Smart Menu / Forecast

ยังไม่จำเป็นต้องเป็น AI

ชื่อที่ควรใช้:

```text
Smart Menu
Sales Forecast
Seasonal Menu Suggestion
```

ใช้เพื่อแนะนำ:

```text
เมนูหรือสินค้าที่ขายดี
เมนูหรือสินค้าที่ขายช้า
ควรเตรียมอะไรสำหรับวันพิเศษ
ควรทำ combo อะไร
คาดการณ์ความต้องการตามฤดูกาลหรือวันในสัปดาห์
```

เหมาะกับ:

```text
Cafe POS
Restaurant POS
Retail POS
```

สามารถทำเป็น add-on หรือใส่ในแพ็กเกจสูง

---

## 20. แพ็กเกจบริการ

แพ็กเกจไม่ได้แบ่งตาม POS Type แต่แบ่งตามขนาดการใช้งาน

แพ็กเกจหลัก:

```text
Starter
Pro
Business
Enterprise
```

สิ่งที่ใช้เปรียบเทียบแพ็กเกจ:

```text
จำนวน branch
จำนวน POS device
จำนวน staff
จำนวน items
จำนวน orders ต่อเดือน
จำนวน member profiles
ระดับ report
ระดับ receipt customization
ระดับ support
สิทธิ์ในการเปิด add-on
```

ลูกค้าไม่ซื้อแพ็กเกจเอง online ทีม TJ POS เป็นผู้กำหนดแพ็กเกจให้จาก Platform Admin

สามารถมี:

```text
Monthly price
Yearly price ราคาถูกกว่า
ฟรี setup ถ้าจ่ายรายปี
แถม 1 เดือนถ้าจ่ายรายปี
```

---

## 21. Add-on ที่ควรแยกต่างหาก

Module ที่ไม่ใช่ทุกธุรกิจต้องใช้ควรแยกเป็น add-on เช่น:

```text
Customer Display
Staff Order & QR Menu
Kitchen / Bar Display
Advanced Inventory
Smart Menu / Forecast
Advanced Loyalty
A4 Invoice
Booking / Reservation
Extra POS Device
Extra Branch
Extra Staff
```

หลักการคือ:

```text
ระบบมีความสามารถ แต่ร้านไหนไม่ใช้ก็ไม่ต้องเปิด
```

---

## 22. การชำระเงินผ่านธนาคารและการแสดงบน bill

ในลาว การโอนต่างธนาคารอาจมีค่าธรรมเนียม ดังนั้น bill และ Customer Display ควรแสดงข้อมูลธนาคารให้ชัดเจน

ใน Business Admin ควรมี:

```text
Settings → Payment Methods
```

Owner สามารถตั้งค่า:

```text
Cash
Bank Transfer
QR Payment
Card
Other
```

สำหรับ Bank Transfer ควรมี:

```text
Bank name
Account name
Account number
QR image
Payment note
Is default
```

Flow ตอน checkout:

```text
พนักงานเลือก payment method
↓
ถ้าเลือก QR / Bank Transfer
↓
เลือกธนาคาร
↓
Bill / Customer Display แสดง QR + ชื่อธนาคาร + จำนวนเงิน
↓
พนักงานยืนยันว่าได้รับเงินแล้ว
```

MVP ยังไม่จำเป็นต้องเชื่อม callback จากธนาคารแบบอัตโนมัติ

---

## 23. Database

ช่วงเริ่มต้นใช้:

```text
1 PostgreSQL database กลาง
```

ตัวอย่างชื่อ:

```text
tj_pos_platform_db
```

ข้อมูลแยกด้วย:

```text
business_id
branch_id
user_id
role
```

MVP ไม่ใช้:

```text
Database แยกต่อร้าน
URL แยกต่อร้าน
Deploy แยกต่อร้าน
Custom domain
```

Database ไม่ควรอยู่ในตารางเปรียบเทียบแพ็กเกจ เพราะทุกแพ็กเกจใช้ฐานข้อมูลกลางเดียวกันในช่วงเริ่มต้น

---

## 24. Backup

Backup เป็นสิ่งบังคับ

Flow:

```text
PostgreSQL database
↓
Backup อัตโนมัติทุกวัน
↓
Upload ไป Cloudflare R2 / S3
↓
เก็บ backup หลายชุด
↓
ทดสอบ restore เป็นระยะ
```

ไม่ควรเก็บ backup ไว้เฉพาะในเครื่อง database เท่านั้น

---

## 25. สิ่งที่ไม่ทำใน MVP

เพื่อไม่ให้ระบบใหญ่เกินไป MVP จะไม่ทำ:

```text
Self-service สมัคร business จริง
Public interactive demo
Custom domain ต่อร้าน
Database แยกต่อร้าน
Deploy แยกต่อร้าน
AI เต็มรูปแบบ
ลูกค้า order เอง
Offline mode ซับซ้อน
Payment gateway callback อัตโนมัติ
Mobile app native
```

---

## 26. สรุปสุดท้าย

**TJ POS** คือ:

```text
Managed SaaS POS สำหรับใช้งานในประเทศ
มี web หลักเพื่อแนะนำผลิตภัณฑ์
มี Platform Admin สำหรับทีม TJ POS
มี Business Workspace สำหรับแต่ละร้าน
มี Business Admin สำหรับ owner / manager
มี POS Terminal สำหรับขายเร็ว
มี Staff Order mobile สำหรับพนักงาน
มี Customer Display สำหรับลูกค้าดูยอดเงิน
มี Public Menu สำหรับลูกค้าดูเมนู
มี backend API กลาง
มี PostgreSQL database กลางในช่วงเริ่มต้น
มี backup อัตโนมัติเป็นสิ่งบังคับ
```

แนวทาง frontend:

```text
frontend/apps/web = Next.js
→ web หลักของ TJ POS

frontend/apps/platform-admin = Next.js
→ platform admin ของทีม TJ Solution

frontend/apps/business-admin = Vite React
→ business admin, reports, settings, branding

frontend/apps/terminal = Vite React
→ POS ขายหน้าร้าน

frontend/apps/staff-order = Vite React
→ staff order mobile

frontend/apps/kitchen-display = Vite React
→ kitchen/bar display

frontend/apps/customer-display = Vite React
→ customer display

frontend/apps/public-menu = Vite React
→ public menu / QR menu สำหรับลูกค้าสแกนดูเมนู

backend = backend API
→ ใช้ร่วมกันทั้งระบบ
```

นี่คือ flow สุดท้ายของ TJ POS ในเวอร์ชันปัจจุบัน
