# TJ POS — รายละเอียด Specification ของแต่ละเมนู

**เวอร์ชัน:** Final Spec Draft  
**ภาษา:** ไทย  
**วัตถุประสงค์:** ใช้เป็นเอกสารชี้แจงรายละเอียดเมนู, field, import/export, PDF/Print และ flow การขาย POS

---

## 1. หลักการออกแบบ

TJ POS เป็น Managed SaaS POS สำหรับใช้งานในประเทศ ระบบมีหลายเมนูและหลาย module แต่แต่ละ business จะเห็นเฉพาะส่วนที่เกี่ยวข้องกับตนเองตาม:

```text
POS Type + Role + Plan + Enabled Modules
```

เป้าหมายของเมนูใน Business Workspace คือให้แต่ละร้านสามารถสร้าง แก้ไข ปิดใช้งาน นำเข้า ส่งออก และตรวจสอบข้อมูลของตัวเองได้ โดย frontend ต้องแสดงเฉพาะ field/action ที่สิทธิ์และ module อนุญาต และ backend ต้อง validate ซ้ำเสมอ

ข้อมูลที่ร้านควรแก้ไขเองได้ตามสิทธิ์:

```text
Business profile
Branches
Staff / Roles / Permissions
Items / Categories / Variants / Options
Inventory / Stock Movements / Purchase Receipts / Suppliers
Customers / Loyalty / Promotions / Coupons
Payment Methods / Bank QR / Receipt Template
Branding / Devices / Modules / Settings
Import / Export / Reports / Support
```

### ประเภทของ Field

| ประเภท field | ความหมาย |
|---|---|
| บังคับ | ต้องมีเมื่อสร้างข้อมูล |
| ไม่บังคับ | เว้นว่างหรือเป็น `null` ได้ |
| ตาม module | ใช้เมื่อเปิด module นั้น |
| ระบบสร้าง | ระบบสร้างให้อัตโนมัติ |

### หลักการ Import / Export

```text
XLSX = ข้อมูลตาราง, import/export, บัญชี, วิเคราะห์
PDF/Print = บิล, ใบเอกสาร, รายงานสำหรับส่งหรือพิมพ์
```

---

## 2. Business Profile

### จุดประสงค์

เก็บข้อมูลพื้นฐานของร้าน/ธุรกิจ

### Field

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| business_id | ระบบสร้าง | ID ของ business |
| business_name | บังคับ | ชื่อร้าน/ธุรกิจ |
| business_slug | บังคับ | ใช้ใน URL เช่น `tj-cafe` |
| pos_type | บังคับ | Retail, Cafe, Restaurant, Beauty, Hospitality |
| business_category | ไม่บังคับ | เช่น ชานม, mini mart, salon |
| phone | ไม่บังคับ | เบอร์โทรร้าน |
| email | ไม่บังคับ | อีเมลติดต่อ |
| address | ไม่บังคับ | ที่อยู่ |
| country | บังคับ | ค่าเริ่มต้น LA / ลาว |
| currency | บังคับ | ค่าเริ่มต้น LAK |
| tax_enabled | ไม่บังคับ | ใช้ภาษีหรือไม่ |
| service_charge_enabled | ไม่บังคับ | ใช้กับร้านอาหาร |
| status | บังคับ | active / inactive / suspended / archived |
| created_at | ระบบสร้าง | วันที่สร้าง |
| updated_at | ระบบสร้าง | วันที่แก้ไขล่าสุด |

### Import / Export

| ข้อมูล | Import XLSX | Export XLSX | PDF/Print |
|---|---:|---:|---:|
| Business Profile | ไม่ต้อง | ได้ถ้าจำเป็น | ไม่ต้อง |

---

## 3. Branches

### จุดประสงค์

จัดการสาขา/จุดขายของ business

### Field

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| branch_id | ระบบสร้าง | ID สาขา |
| business_id | บังคับ | อยู่ใน business ใด |
| branch_name | บังคับ | เช่น Main Branch, Vientiane |
| branch_code | บังคับ | ใช้ในเลขบิล |
| address | ไม่บังคับ | ที่อยู่สาขา |
| phone | ไม่บังคับ | เบอร์โทรสาขา |
| manager_user_id | ไม่บังคับ | ผู้จัดการสาขา |
| opening_hours | ไม่บังคับ | เวลาเปิด-ปิด |
| default_payment_method_id | ไม่บังคับ | QR/ธนาคารเริ่มต้น |
| default_receipt_template_id | ไม่บังคับ | เทมเพลตบิลเริ่มต้น |
| status | บังคับ | active / inactive |
| created_at | ระบบสร้าง |  |
| updated_at | ระบบสร้าง |  |

### Import / Export

| ข้อมูล | Import XLSX | Export XLSX | PDF/Print |
|---|---:|---:|---:|
| Branches | ได้ | ได้ | ไม่ต้อง |

---

## 4. Staff / Roles / Permissions

### จุดประสงค์

จัดการพนักงานและสิทธิ์การใช้งาน

### Staff Fields

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| staff_id | ระบบสร้าง | ID พนักงาน |
| business_id | บังคับ | อยู่ใน business ใด |
| branch_ids | ไม่บังคับ | อาจอยู่ได้หลายสาขา |
| full_name | บังคับ | ชื่อพนักงาน |
| phone | ไม่บังคับ | ใช้ login/ติดต่อ |
| email | ไม่บังคับ | ใช้ login/ติดต่อ |
| role | บังคับ | Owner, Manager, Cashier, Waiter, Kitchen, Bar, Receptionist |
| can_login | บังคับ | true/false |
| pin_code | ไม่บังคับ | login เร็วบน POS |
| commission_enabled | ตาม module | ใช้กับ Beauty POS |
| status | บังคับ | active / inactive |
| created_at | ระบบสร้าง |  |
| updated_at | ระบบสร้าง |  |

### Permission หลัก

| กลุ่ม | Permission |
|---|---|
| Sales | order.create, order.cancel, order.refund |
| Items | item.create, item.update, item.delete |
| Inventory | stock.view, stock.adjust, stock.import |
| Reports | report.view, report.export |
| Staff | staff.create, staff.update, staff.disable |
| Settings | settings.update |
| Payment | payment.confirm, payment.refund |
| Platform | เฉพาะ TJ POS Admin |

### Import / Export

| ข้อมูล | Import XLSX | Export XLSX | PDF/Print |
|---|---:|---:|---:|
| Staff | ได้ | ได้ | ไม่ต้อง |
| Roles / Permissions | ไม่ต้อง | ได้ถ้าจำเป็น | ไม่ต้อง |

---

## 5. Items / Products / Menu / Services

### จุดประสงค์

จัดการสิ่งที่ขายในระบบ

### Label ตาม POS Type

| POS Type | Label บน UI |
|---|---|
| Retail | Products |
| Cafe / Restaurant | Menu Items |
| Beauty | Services |
| Hospitality | Rooms / Extra Services |

### Field กลาง

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| item_id | ระบบสร้าง | ID item |
| business_id | บังคับ | อยู่ใน business |
| branch_id | ไม่บังคับ | ถ้าขายเฉพาะสาขา |
| item_name | บังคับ | ชื่อสินค้า/เมนู/บริการ |
| item_type | บังคับ | product / menu_item / service / room / extra_service |
| category_id | บังคับ | หมวดหมู่ |
| selling_price | บังคับ | ราคาขาย |
| cost_price | ไม่บังคับ | ต้นทุน |
| image_url | ไม่บังคับ | รูปภาพ |
| description | ไม่บังคับ | รายละเอียด |
| sku | ไม่บังคับ | Retail |
| barcode | ไม่บังคับ | Retail / mini mart |
| unit | บังคับ | ชิ้น, แก้ว, จาน, ชั่วโมง, คืน, ครั้ง |
| tax_id | ไม่บังคับ | ถ้ามีภาษี |
| status | บังคับ | active / inactive / suspended / archived |
| available_for_sale | บังคับ | true/false |
| sort_order | ไม่บังคับ | ลำดับแสดงผล |
| deleted_at | ไม่บังคับ | soft delete |
| created_at | ระบบสร้าง |  |
| updated_at | ระบบสร้าง |  |

### Field สำหรับ Retail

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| stock_tracking | บังคับ | ติดตาม stock หรือไม่ |
| current_stock | ตาม module | ถ้าเปิด stock |
| minimum_stock | ไม่บังคับ | แจ้งเตือนใกล้หมด |
| supplier_id | ไม่บังคับ | ผู้จัดหา |
| brand | ไม่บังคับ | เครื่องสำอาง/เสื้อผ้า |
| size | ไม่บังคับ | เสื้อผ้า/รองเท้า |
| color | ไม่บังคับ | เสื้อผ้า |
| expiry_date | ไม่บังคับ | ของกิน/เครื่องสำอาง |
| batch_no | ไม่บังคับ | เลขล็อต |
| warranty_period | ไม่บังคับ | อุปกรณ์/มือถือ |
| wholesale_price | ไม่บังคับ | ราคาขายส่ง |

### Field สำหรับ Cafe / Restaurant

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| kitchen_station | ไม่บังคับ | kitchen / bar |
| size_options | ไม่บังคับ | S/M/L |
| toppings | ไม่บังคับ | ไข่มุก, pudding |
| sugar_level_options | ไม่บังคับ | 0%, 30%, 50%, 100% |
| ice_level_options | ไม่บังคับ | น้ำแข็งน้อย/ปกติ |
| hot_cold_option | ไม่บังคับ | ร้อน/เย็น |
| preparation_note | ไม่บังคับ | หมายเหตุการทำ |
| ingredient_tracking | ไม่บังคับ | ตัดวัตถุดิบ |
| print_label | ไม่บังคับ | พิมพ์สติ๊กเกอร์แก้ว |
| dine_in_available | ไม่บังคับ | ทานที่ร้าน |
| takeaway_available | ไม่บังคับ | ซื้อกลับ |

### Field สำหรับ Beauty

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| service_duration | บังคับ | ระยะเวลาบริการ |
| assigned_staff | ไม่บังคับ | พนักงานที่ทำ |
| commission_type | ไม่บังคับ | % หรือจำนวนเงิน |
| commission_value | ไม่บังคับ | ค่า commission |
| package_supported | ไม่บังคับ | รองรับคอร์สหรือไม่ |
| booking_required | ไม่บังคับ | ต้องจองไหม |
| product_consumption | ไม่บังคับ | วัสดุ/เครื่องสำอางที่ใช้ |

### Field สำหรับ Hospitality

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| room_number | บังคับ | เลข/ชื่อห้อง |
| room_type | บังคับ | Standard, VIP, Dorm |
| capacity | ไม่บังคับ | จำนวนผู้เข้าพัก |
| bed_type | ไม่บังคับ | Queen, Twin |
| price_per_night | บังคับ | ราคาต่อคืน |
| price_per_hour | ไม่บังคับ | ถ้ามีเช่ารายชั่วโมง |
| room_status | บังคับ | available / occupied / cleaning / maintenance |
| deposit_required | ไม่บังคับ | ต้องมีมัดจำไหม |

### Import / Export

| ข้อมูล | Import XLSX | Export XLSX | PDF/Print |
|---|---:|---:|---:|
| Items / Products / Menu / Services | จำเป็นมาก | จำเป็นมาก | ได้ถ้าจำเป็น |
| Categories | ได้ | ได้ | ไม่ต้อง |
| Variants / Options | ได้ | ได้ | ไม่ต้อง |
| Price list | ได้ถ้าจำเป็น | ได้ | PDF ถ้าต้องการ |
| Room list | ได้ | ได้ | PDF ถ้าต้องการ |
| Barcode labels | ไม่ต้อง | ได้ถ้าจำเป็น | พิมพ์สติ๊กเกอร์ |

---

## 6. Categories

### Field

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| category_id | ระบบสร้าง |  |
| business_id | บังคับ |  |
| category_name | บังคับ | ชื่อหมวดหมู่ |
| parent_category_id | ไม่บังคับ | หมวดหมู่แม่ |
| pos_type | ไม่บังคับ | ใช้กับ POS Type ไหน |
| image_url | ไม่บังคับ | รูป/icon |
| sort_order | ไม่บังคับ | ลำดับ |
| status | บังคับ | active/inactive |

### Import / Export

| ข้อมูล | Import XLSX | Export XLSX | PDF/Print |
|---|---:|---:|---:|
| Categories | ได้ | ได้ | ไม่ต้อง |

---

## 7. Inventory / Stock

### Inventory Balance Fields

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| item_id | บังคับ | สินค้า/วัตถุดิบ |
| business_id | บังคับ |  |
| branch_id | บังคับ | stock ตามสาขา |
| current_stock | บังคับ | จำนวนคงเหลือ |
| unit | บังคับ | ชิ้น, กล่อง, kg, ลิตร |
| minimum_stock | ไม่บังคับ | แจ้งเตือน |
| maximum_stock | ไม่บังคับ | stock สูงสุด |
| average_cost | ไม่บังคับ | ต้นทุนเฉลี่ย |
| last_stock_count_date | ไม่บังคับ | วันที่นับ stock ล่าสุด |

### Stock Movement Fields

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| movement_id | ระบบสร้าง |  |
| business_id | บังคับ |  |
| branch_id | บังคับ |  |
| item_id | บังคับ |  |
| movement_type | บังคับ | in / out / adjustment / transfer / refund |
| quantity | บังคับ | จำนวน |
| unit | บังคับ | หน่วย |
| reference_type | บังคับ | sale / purchase / adjustment / transfer / refund |
| reference_id | ไม่บังคับ | ID เอกสารที่เกี่ยวข้อง |
| note | ไม่บังคับ | หมายเหตุ |
| created_by | บังคับ | ผู้ทำรายการ |
| created_at | ระบบสร้าง |  |

### Import / Export

| ข้อมูล | Import XLSX | Export XLSX | PDF/Print |
|---|---:|---:|---:|
| Opening stock | จำเป็นมาก | ไม่จำเป็น | ไม่ต้อง |
| Stock adjustment | ได้ | ได้ | ใบตรวจ stock |
| Inventory balance | ไม่ต้อง | จำเป็นมาก | PDF รายงาน |
| Stock movements | ไม่ต้อง | จำเป็นมาก | PDF รายงาน |
| Stock-in slip | ไม่ต้อง | ได้ | พิมพ์/PDF |
| Stock-out slip | ไม่ต้อง | ได้ | พิมพ์/PDF |

---

## 8. Suppliers

### Field

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| supplier_id | ระบบสร้าง |  |
| business_id | บังคับ |  |
| supplier_name | บังคับ | ชื่อผู้จัดหา |
| phone | ไม่บังคับ | เบอร์โทร |
| email | ไม่บังคับ |  |
| address | ไม่บังคับ |  |
| contact_person | ไม่บังคับ | ผู้ติดต่อ |
| tax_code | ไม่บังคับ | ถ้าต้องใช้ |
| payment_terms | ไม่บังคับ | เงื่อนไขชำระเงิน |
| debt_balance | ไม่บังคับ | ยอดค้าง |
| status | บังคับ | active/inactive |

### Import / Export

| ข้อมูล | Import XLSX | Export XLSX | PDF/Print |
|---|---:|---:|---:|
| Suppliers | ได้ | ได้ | ไม่ต้อง |
| Supplier debt | ไม่ต้อง | ได้ | PDF ถ้าจำเป็น |

---

## 9. Orders / ใบขาย / บิล

### Order Header Fields

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| order_id | ระบบสร้าง |  |
| order_number | บังคับ | เลขบิล |
| business_id | บังคับ |  |
| branch_id | บังคับ |  |
| pos_type | บังคับ | Retail/Cafe/etc |
| order_type | บังคับ | retail / dine_in / takeaway / service / room |
| customer_id | ไม่บังคับ | ถ้ามี loyalty |
| staff_id | บังคับ | คนสร้างออเดอร์ |
| cashier_id | ไม่บังคับ | คนรับเงิน |
| table_id | ไม่บังคับ | Cafe/Restaurant |
| room_id | ไม่บังคับ | Hospitality |
| appointment_id | ไม่บังคับ | Beauty |
| status | บังคับ | draft / held / open / paid / cancelled / refunded |
| payment_status | บังคับ | unpaid / partial / paid / refunded |
| subtotal | บังคับ | ก่อนส่วนลด |
| discount_total | บังคับ | เป็น 0 ได้ |
| tax_total | ไม่บังคับ | ถ้ามีภาษี |
| service_charge | ไม่บังคับ | ร้านอาหาร |
| grand_total | บังคับ | ยอดรวมสุดท้าย |
| note | ไม่บังคับ | หมายเหตุ |
| source | ไม่บังคับ | POS / staff_order / platform |
| created_at | ระบบสร้าง |  |
| paid_at | ไม่บังคับ | เวลาชำระเงิน |

### Order Item Fields

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| order_item_id | ระบบสร้าง |  |
| order_id | บังคับ |  |
| item_id | บังคับ |  |
| item_name_snapshot | บังคับ | ชื่อ ณ เวลาขาย |
| quantity | บังคับ | จำนวน |
| unit_price_snapshot | บังคับ | ราคา ณ เวลาขาย |
| cost_price_snapshot | ไม่บังคับ | ต้นทุน ณ เวลาขาย |
| discount_amount | ไม่บังคับ | ส่วนลดรายบรรทัด |
| total_amount | บังคับ | ยอดรวมบรรทัด |
| options_snapshot | ไม่บังคับ | size/topping/color |
| item_note | ไม่บังคับ | เช่น หวานน้อย, น้ำแข็งน้อย |
| kitchen_status | ไม่บังคับ | pending/preparing/done |
| served_status | ไม่บังคับ | เสิร์ฟแล้วหรือยัง |

### Import / Export

| ข้อมูล | Import XLSX | Export XLSX | PDF/Print |
|---|---:|---:|---:|
| Orders | ไม่ค่อยใช้ | จำเป็นมาก | ได้ |
| Order Items | ไม่ค่อยใช้ | จำเป็นมาก | ได้ |
| Sales history migration | ได้ถ้าต้องย้ายข้อมูล | ได้ | ไม่ต้อง |
| Receipt / Bill | ไม่ต้อง | ได้ถ้าจำเป็น | พิมพ์/PDF |
| Refund receipt | ไม่ต้อง | ได้ถ้าจำเป็น | พิมพ์/PDF |
| Kitchen ticket | ไม่ต้อง | ไม่ต้อง | พิมพ์ |

---

## 10. Payments / Payment Methods

### Payment Method Fields

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| payment_method_id | ระบบสร้าง |  |
| business_id | บังคับ |  |
| branch_id | ไม่บังคับ | ถ้าสาขามี QR คนละตัว |
| method_name | บังคับ | Cash, BCEL, JDB |
| method_type | บังคับ | cash / bank_transfer / qr / card / other |
| bank_name | ไม่บังคับ | ถ้าเป็นโอนเงิน |
| account_name | ไม่บังคับ | ชื่อบัญชี |
| account_number | ไม่บังคับ | เลขบัญชี |
| qr_image_url | ไม่บังคับ | รูป QR |
| payment_note | ไม่บังคับ | หมายเหตุค่าธรรมเนียมข้ามธนาคาร |
| is_default | บังคับ | true/false |
| status | บังคับ | active/inactive |

### Payment Transaction Fields

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| payment_id | ระบบสร้าง |  |
| order_id | บังคับ | ของออเดอร์ใด |
| payment_method_id | บังคับ | วิธีชำระ |
| amount | บังคับ | จำนวนเงิน |
| currency | บังคับ | LAK |
| bank_name_snapshot | ไม่บังคับ | บันทึกชื่อธนาคารตอนชำระ |
| reference_code | ไม่บังคับ | เลขอ้างอิงธุรกรรม |
| confirmed_by | บังคับ | ใครยืนยัน |
| paid_at | บังคับ | เวลาชำระ |
| status | บังคับ | pending / confirmed / failed / refunded |
| note | ไม่บังคับ | หมายเหตุ |

### Import / Export

| ข้อมูล | Import XLSX | Export XLSX | PDF/Print |
|---|---:|---:|---:|
| Payment Methods | ได้ถ้าจำเป็น | ได้ | ไม่ต้อง |
| Payment Transactions | ไม่ต้อง | จำเป็นมาก | รายงาน PDF |
| Bank transfer report | ไม่ต้อง | ได้ | PDF |

---

## 11. Customers / Loyalty / Member Profiles

### หลักการ

ขายปกติไม่ต้องมี customer profile  
จะมี customer profile เมื่อเปิด Loyalty / Membership เท่านั้น

### Customer Profile Fields

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| customer_id | ระบบสร้าง |  |
| business_id | บังคับ |  |
| customer_name | ไม่บังคับ | บางกรณีมีแค่เบอร์ |
| phone | บังคับถ้าเปิด loyalty | ใช้ค้นหา member |
| email | ไม่บังคับ |  |
| birthday | ไม่บังคับ | โปรโมชั่นวันเกิด |
| gender | ไม่บังคับ |  |
| address | ไม่บังคับ | Retail/delivery |
| member_code | ไม่บังคับ | รหัสสมาชิก |
| points_balance | ตาม module | ถ้าเปิดสะสมแต้ม |
| member_tier | ตาม module | Normal/Silver/Gold/VIP |
| total_spending | ระบบคำนวณ | ยอดซื้อรวม |
| total_orders | ระบบคำนวณ | จำนวนครั้งซื้อ |
| last_visit | ระบบคำนวณ | มาครั้งล่าสุด |
| notes | ไม่บังคับ | หมายเหตุ |
| status | บังคับ | active/inactive |

### Loyalty Rule Fields

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| rule_name | บังคับ | ชื่อโปรแกรม |
| earning_rule | บังคับ | ซื้อเท่าไหร่ได้กี่แต้ม |
| redeem_rule | บังคับ | ใช้แต้มแลกอะไร |
| expiry_rule | ไม่บังคับ | แต้มหมดอายุ |
| tier_rule | ไม่บังคับ | เงื่อนไข VIP |
| applicable_items | ไม่บังคับ | ใช้กับ item ไหน |
| start_date | ไม่บังคับ |  |
| end_date | ไม่บังคับ |  |
| status | บังคับ | active/inactive |

### Import / Export

| ข้อมูล | Import XLSX | Export XLSX | PDF/Print |
|---|---:|---:|---:|
| Customers / Members | ได้ | ได้ | ไม่ต้อง |
| Points history | ไม่ต้อง | ได้ | PDF ถ้าจำเป็น |
| Member tiers | ได้ถ้าจำเป็น | ได้ | ไม่ต้อง |
| Coupons | ได้ | ได้ | PDF report ได้ |

---

## 12. Promotions

### Field

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| promotion_id | ระบบสร้าง |  |
| business_id | บังคับ |  |
| promotion_name | บังคับ | ชื่อโปรโมชั่น |
| promotion_type | บังคับ | discount / coupon / combo / buy_x_get_y / happy_hour |
| discount_type | ไม่บังคับ | % หรือจำนวนเงิน |
| discount_value | ไม่บังคับ | มูลค่าส่วนลด |
| apply_scope | บังคับ | item / category / order / member |
| conditions | ไม่บังคับ | ยอดขั้นต่ำ, เวลาใช้งาน |
| start_date | บังคับ |  |
| end_date | บังคับ |  |
| applicable_branch | ไม่บังคับ | สาขา |
| applicable_customer_tier | ไม่บังคับ | VIP/Gold |
| usage_limit | ไม่บังคับ | จำกัดจำนวนครั้ง |
| status | บังคับ | active/inactive |

### Import / Export

| ข้อมูล | Import XLSX | Export XLSX | PDF/Print |
|---|---:|---:|---:|
| Promotions | ได้ถ้าจำเป็น | ได้ | PDF report |
| Coupon codes | ได้ | ได้ | ได้ถ้าจำเป็น |

---

## 13. Tables / Areas

ใช้สำหรับ Cafe ที่มีที่นั่ง และ Restaurant

### Area Fields

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| area_id | ระบบสร้าง |  |
| business_id | บังคับ |  |
| branch_id | บังคับ |  |
| area_name | บังคับ | Indoor, Outdoor |
| sort_order | ไม่บังคับ |  |
| status | บังคับ | active/inactive |

### Table Fields

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| table_id | ระบบสร้าง |  |
| business_id | บังคับ |  |
| branch_id | บังคับ |  |
| area_id | บังคับ |  |
| table_name | บังคับ | A01, B02 |
| capacity | ไม่บังคับ | จำนวนที่นั่ง |
| status | บังคับ | available / occupied / reserved / cleaning |
| qr_code | ไม่บังคับ | QR menu ตามโต๊ะ |
| note | ไม่บังคับ |  |

### Import / Export

| ข้อมูล | Import XLSX | Export XLSX | PDF/Print |
|---|---:|---:|---:|
| Areas | ได้ | ได้ | ไม่ต้อง |
| Tables | ได้ | ได้ | พิมพ์ QR โต๊ะ |
| Table QR | ไม่ต้อง | ได้ | พิมพ์/PDF |

---

## 14. Kitchen / Bar Display

### Kitchen Ticket Fields

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| ticket_id | ระบบสร้าง |  |
| ticket_number | บังคับ | เลข ticket |
| business_id | บังคับ |  |
| branch_id | บังคับ |  |
| order_id | บังคับ | ออเดอร์ที่เกี่ยวข้อง |
| table_id | ไม่บังคับ | ถ้ามีโต๊ะ |
| station | บังคับ | kitchen / bar |
| items | บังคับ | รายการที่ต้องทำ |
| item_note | ไม่บังคับ | หวานน้อย, เผ็ดน้อย |
| status | บังคับ | pending / preparing / done / cancelled |
| created_at | ระบบสร้าง |  |
| completed_at | ไม่บังคับ |  |

### Import / Export

| ข้อมูล | Import XLSX | Export XLSX | PDF/Print |
|---|---:|---:|---:|
| Kitchen tickets | ไม่ต้อง | ได้ถ้าจำเป็น | พิมพ์ใบครัว |
| Bar tickets | ไม่ต้อง | ได้ถ้าจำเป็น | พิมพ์ใบ bar |
| Processing time report | ไม่ต้อง | ได้ | PDF/XLSX |

---

## 15. Appointments / Beauty

### Appointment Fields

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| appointment_id | ระบบสร้าง |  |
| business_id | บังคับ |  |
| branch_id | บังคับ |  |
| customer_id | บังคับ | ลูกค้าที่จอง |
| service_id | บังคับ | บริการ |
| staff_id | ไม่บังคับ | พนักงาน |
| room_or_chair | ไม่บังคับ | ห้อง/เก้าอี้ |
| start_time | บังคับ | เวลาเริ่ม |
| end_time | บังคับ | เวลาจบ |
| status | บังคับ | booked / arrived / done / cancelled / no_show |
| deposit | ไม่บังคับ | มัดจำ |
| note | ไม่บังคับ | หมายเหตุ |

### Package / Treatment Course Fields

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| package_id | ระบบสร้าง |  |
| customer_id | บังคับ | ลูกค้า |
| service_id | บังคับ | บริการ |
| package_name | บังคับ | ชื่อคอร์ส |
| total_sessions | บังคับ | จำนวนครั้งทั้งหมด |
| used_sessions | บังคับ | ใช้ไปแล้ว |
| remaining_sessions | บังคับ | คงเหลือ |
| expiry_date | ไม่บังคับ | วันหมดอายุ |
| status | บังคับ | active / expired / completed |

### Import / Export

| ข้อมูล | Import XLSX | Export XLSX | PDF/Print |
|---|---:|---:|---:|
| Services | ได้ | ได้ | ไม่ต้อง |
| Customers | ได้ | ได้ | ไม่ต้อง |
| Appointments | ได้ถ้าจำเป็น | ได้ | PDF ตารางนัด |
| Packages | ได้ถ้าจำเป็น | ได้ | PDF ได้ |
| Commission report | ไม่ต้อง | ได้ | PDF/XLSX |

---

## 16. Rooms / Bookings / Hospitality

### Room Fields

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| room_id | ระบบสร้าง |  |
| business_id | บังคับ |  |
| branch_id | บังคับ |  |
| room_name | บังคับ | 101, Deluxe A |
| room_type | บังคับ | Standard/VIP/Dorm |
| capacity | บังคับ | จำนวนผู้เข้าพัก |
| base_price | บังคับ | ราคาเริ่มต้น |
| status | บังคับ | available / occupied / cleaning / maintenance |
| floor | ไม่บังคับ | ชั้น |
| amenities | ไม่บังคับ | สิ่งอำนวยความสะดวก |
| note | ไม่บังคับ |  |

### Booking Fields

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| booking_id | ระบบสร้าง |  |
| guest_id | บังคับ | ผู้เข้าพัก |
| room_id | บังคับ | ห้อง |
| check_in_date | บังคับ |  |
| check_out_date | บังคับ |  |
| number_of_guests | ไม่บังคับ |  |
| deposit | ไม่บังคับ | มัดจำ |
| booking_source | ไม่บังคับ | walk-in / phone / agency |
| status | บังคับ | booked / checked_in / checked_out / cancelled |
| extra_services | ไม่บังคับ | ซักรีด, น้ำ, เช่ารถ |
| note | ไม่บังคับ |  |

### Import / Export

| ข้อมูล | Import XLSX | Export XLSX | PDF/Print |
|---|---:|---:|---:|
| Rooms | ได้ | ได้ | PDF ได้ |
| Guests | ได้ | ได้ | ไม่ต้อง |
| Bookings | ได้ถ้าจำเป็น | ได้ | PDF ยืนยัน |
| Extra services | ได้ | ได้ | ไม่ต้อง |
| Occupancy report | ไม่ต้อง | ได้ | PDF/XLSX |
| Invoice A4 | ไม่ต้อง | ได้ถ้าจำเป็น | PDF/พิมพ์ |

---

## 17. Receipt / Bill Template

### Field

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| template_id | ระบบสร้าง |  |
| business_id | บังคับ |  |
| template_name | บังคับ | ชื่อเทมเพลต |
| paper_size | บังคับ | 58mm / 80mm / A4 |
| color_mode | บังคับ | ค่าเริ่มต้น Black & White |
| show_logo | ไม่บังคับ |  |
| show_branch_address | ไม่บังคับ |  |
| show_table | ไม่บังคับ | Cafe/Restaurant |
| show_item_note | ไม่บังคับ | หมายเหตุเมนู |
| show_bank_info | ไม่บังคับ | ชื่อธนาคาร |
| show_qr | ไม่บังคับ | QR ชำระเงิน |
| footer_text | ไม่บังคับ | ข้อความขอบคุณ |
| column_labels | ไม่บังคับ | เปลี่ยนชื่อคอลัมน์ |
| enabled_blocks | ไม่บังคับ | เปิด/ปิด block |

### PDF / Print

| ข้อมูล | XLSX | PDF/Print |
|---|---:|---:|
| Receipt 58mm/80mm | ไม่ต้อง | พิมพ์ |
| A4 Invoice | ไม่ต้อง | PDF/พิมพ์ |
| Refund receipt | ไม่ต้อง | พิมพ์/PDF |
| Kitchen ticket | ไม่ต้อง | พิมพ์ |

---

## 18. Branding

### Field

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| business_id | บังคับ |  |
| logo_url | ไม่บังคับ | โลโก้ |
| primary_color | ไม่บังคับ | สีหลัก |
| secondary_color | ไม่บังคับ | สีรอง |
| banner_url | ไม่บังคับ | banner |
| menu_style | ไม่บังคับ | style public menu |
| customer_display_style | ไม่บังคับ | style customer display |
| receipt_footer | ไม่บังคับ | footer บิล |
| updated_at | ระบบสร้าง |  |

### Import / Export

ไม่จำเป็นต้อง import/export XLSX  
รูปภาพ/โลโก้ upload แยก

---

## 19. Payment Methods — หมายเหตุสำหรับลาว

เพราะในลาวมีหลายธนาคาร และการโอนต่างธนาคารอาจมีค่าธรรมเนียม ควรแสดงข้อมูลเหล่านี้ให้ชัดเจน:

```text
ชื่อธนาคาร
ชื่อบัญชี
เลขบัญชีถ้าจำเป็น
QR code
ยอดเงิน
หมายเหตุค่าธรรมเนียมถ้าต้องการ
```

MVP ไม่ควรคำนวณค่าธรรมเนียมอัตโนมัติ ให้แสดงเป็น note ก่อน

---

## 20. Reports

| Report | Export XLSX | PDF/Print |
|---|---:|---:|
| Sales Report | ได้ | ได้ |
| Orders Report | ได้ | ได้ |
| Payments Report | ได้ | ได้ |
| Item Sales Report | ได้ | ได้ |
| Staff Report | ได้ | ได้ |
| Branch Report | ได้ | ได้ |
| Inventory Report | ได้ | ได้ |
| Stock Movement Report | ได้ | ได้ |
| Customer / Member Report | ได้ | ได้ |
| Promotion Report | ได้ | ได้ |
| Occupancy Report | ได้ | ได้ |
| Commission Report | ได้ | ได้ |

---

## 21. Support / Feedback

### Field

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| ticket_id | ระบบสร้าง |  |
| business_id | บังคับ |  |
| branch_id | ไม่บังคับ | ถ้าเกี่ยวกับสาขา |
| created_by | บังคับ | ผู้ส่ง |
| type | บังคับ | bug / feedback / feature_request / support |
| title | บังคับ | หัวข้อ |
| description | บังคับ | รายละเอียด |
| attachment_url | ไม่บังคับ | รูป/วิดีโอ |
| priority | ไม่บังคับ | low/medium/high |
| status | บังคับ | open / in_review / in_progress / resolved / rejected |
| assigned_to | ไม่บังคับ | เจ้าหน้าที่ TJ POS |
| created_at | ระบบสร้าง |  |
| updated_at | ระบบสร้าง |  |

### Export

| ข้อมูล | Export XLSX | PDF/Print |
|---|---:|---:|
| Support tickets | ได้ | PDF ถ้าจำเป็น |

---

## 22. Import / Export Center

### Import XLSX

```text
Items / Products / Menu / Services
Categories
Opening Stock
Customers / Members
Suppliers
Staff
Tables
Rooms
Payment Methods
Promotions / Coupons
```

### Export XLSX

```text
Items
Categories
Inventory
Stock Movements
Customers / Members
Suppliers
Staff
Orders
Order Items
Payments
Reports
Loyalty Points
Promotions
Tables
Rooms
Bookings
Appointments
```

### PDF / Print

```text
Receipt / Bill
A4 Invoice
Refund Receipt
Kitchen Ticket
Bar Ticket
QR Menu
QR Table
Stock In Slip
Stock Adjustment Slip
Sales Report
Payment Report
Inventory Report
Booking Confirmation
Appointment Schedule
Commission Report
Occupancy Report
```

---

## 23. POS ขายหน้าร้าน — Flow รายละเอียด

### 23.1 เปิดกะขาย

| Field | สถานะ | หมายเหตุ |
|---|---|---|
| staff_id | บังคับ | ใครขาย |
| branch_id | บังคับ | สาขาไหน |
| device_id | บังคับ | เครื่องไหน |
| shift_id / cash_session_id | ไม่บังคับแต่ควรมี | กะขาย |
| opening_cash | ไม่บังคับ | เงินต้นกะ |

### 23.2 เลือก item / สแกน barcode

พนักงานสามารถ:

```text
สแกน barcode
ค้นหาชื่อ
ค้นหา SKU
เลือก category
เลือก item ขายดี
```

### 23.3 เพิ่มลง cart

| Field | บังคับ? | หมายเหตุ |
|---|---:|---|
| item_id | ใช่ | Item |
| item_name_snapshot | ใช่ | ชื่อตอนขาย |
| quantity | ใช่ | จำนวน |
| unit_price_snapshot | ใช่ | ราคาตอนขาย |
| options_snapshot | ไม่บังคับ | Size/topping/color |
| item_note | ไม่บังคับ | หวานน้อย, ไม่ใส่น้ำตาล |
| discount_amount | ไม่บังคับ | ส่วนลด |
| total_amount | ใช่ | ยอดรวม |

### 23.4 ตรวจ stock

ถ้า `stock_tracking = true`:

```text
พอขาย → ขายได้
ไม่พอ → แจ้งเตือน
ขายติดลบ → ต้องมีสิทธิ์
ไม่อนุญาตขายติดลบ → ห้าม checkout
```

### 23.5 ส่วนลด

รองรับ:

```text
ส่วนลดราย item
ส่วนลดทั้ง order
Coupon
Promotion
Member/VIP discount
Manual discount
```

ส่วนลด manual จำนวนมากควรต้องใช้สิทธิ์ Manager/Owner

### 23.6 ภาษีและ Service Charge

Tax optional:

```text
tax_enabled
tax_rate
tax_total
```

Service charge optional:

```text
service_charge_enabled
service_charge_rate
service_charge_amount
```

ไม่ใช้ให้เป็น `0` หรือ `null`

### 23.7 Hold Order

ต้องมี:

```text
Hold Order
New Sale
Open Orders
Resume Order
```

Flow:

```text
ลูกค้า A เลือกนาน
→ Hold Order
→ เปิด New Sale ให้ลูกค้า B
→ ขายให้ลูกค้า B
→ Resume Order ของลูกค้า A
```

### 23.8 ชำระเงิน

Payment methods:

```text
Cash
Bank Transfer
QR Payment
Card
Other
```

Flow:

```text
Checkout
↓
เลือกวิธีชำระ
↓
ถ้า QR/Bank Transfer → เลือกธนาคาร
↓
แสดง QR + bank name + amount บน bill/customer display
↓
พนักงานยืนยันว่าได้รับเงินแล้ว
↓
Order = Paid
```

MVP ยังไม่ต้องมี callback จากธนาคาร

### 23.9 พิมพ์บิล

ค่าเริ่มต้น:

```text
Black & White
58mm / 80mm
```

ข้อมูลบนบิล:

```text
โลโก้
ชื่อร้าน
สาขา
เลข order
วันเวลา
พนักงาน
เลขโต๊ะถ้ามี
รายการ item
หมายเหตุเมนูถ้าเปิด
ยอดรวม
ธนาคาร/QR ถ้ามี
Footer
```

### 23.10 Refund / Return

รองรับ:

```text
Full refund
Partial refund
Return item
Refund receipt
Restock option
Refund reason
Manager approval ถ้าจำเป็น
```

Refund fields:

| Field | บังคับ? | หมายเหตุ |
|---|---:|---|
| refund_id | ระบบสร้าง |  |
| order_id | ใช่ | ออเดอร์ที่คืน |
| refund_type | ใช่ | full / partial |
| refund_amount | ใช่ | จำนวนเงินคืน |
| returned_items | ไม่บังคับ | item ที่คืน |
| restock | ไม่บังคับ | นำกลับเข้า stock หรือไม่ |
| reason | ใช่ | เหตุผล |
| approved_by | ไม่บังคับ | Manager/Owner |
| created_by | ใช่ | ใครทำ |
| created_at | ระบบสร้าง |  |

### 23.11 ยกเลิก order

ก่อนชำระ:

```text
cancel order
```

หลังชำระ:

```text
ไม่ลบ order
ต้องใช้ refund/void ตามสิทธิ์
```

ห้ามลบบิลจริงแบบ hard delete

### 23.12 Stock หลังขาย

Retail:

```text
Order paid → ตัด stock
```

Cafe/Restaurant:

```text
ถ้าเปิด ingredient inventory → ตัดวัตถุดิบ
ถ้าไม่เปิด → ไม่ตัด stock
```

Refund/return:

```text
restock = true → เพิ่ม stock กลับ
```

---

## 24. Field ระบบที่ควรมีในเกือบทุกตาราง

```text
id
business_id
branch_id ถ้าเกี่ยวกับสาขา
created_by
updated_by
created_at
updated_at
deleted_at
status
note
sort_order ถ้าจำเป็น
source ถ้าจำเป็น
reference_code ถ้าจำเป็น
metadata ถ้าจำเป็น
```

ตารางเกี่ยวกับเงิน/order ควรมีเพิ่ม:

```text
order_number
payment_status
total_amount
currency
snapshot fields
idempotency_key ถ้าจำเป็น
audit_logs
```

Snapshot สำคัญ:

```text
item_name_snapshot
unit_price_snapshot
cost_price_snapshot
options_snapshot
bank_name_snapshot
```

---

## 25. ข้อสรุปอย่างเป็นทางการ

### เมนูสุดท้าย

```text
1. Dashboard
2. POS / Sales
3. Orders
4. Payments
5. Items
6. Categories
7. Inventory
8. Suppliers
9. Customers / Loyalty
10. Promotions
11. Staff / Roles
12. Branches
13. Devices
14. Reports
15. Receipt / Bill
16. Branding
17. Payment Methods
18. Modules
19. Support / Feedback
20. Import / Export Center
```

### เมนูตามอุตสาหกรรม

```text
Retail → Barcode, SKU, Inventory, Supplier, Variants
Cafe → Size, Topping, Sugar/Ice, Bar Orders, QR Menu, Staff Order, Customer Display
Restaurant → Tables, Areas, Kitchen, Split/Merge Bill, Service Charge
Beauty → Appointments, Services, Packages, Commission
Hospitality → Rooms, Bookings, Check-in/out, Deposit, Housekeeping
```

### ข้อมูลที่ต้องมี XLSX

```text
Items
Categories
Inventory
Stock Movements
Suppliers
Customers/Members
Staff
Orders
Payments
Reports
Promotions
Tables
Rooms
Bookings
Appointments
```

### ข้อมูลที่ต้องมี PDF/Print

```text
Receipt / Bill
A4 Invoice
Refund Receipt
Kitchen Ticket
Bar Ticket
QR Menu
QR Table
Stock In Slip
Stock Adjustment Slip
Sales Report
Payment Report
Inventory Report
Booking Confirmation
Appointment Schedule
Commission Report
Occupancy Report
```

นี่คือ specification เมนู + field + import/export + POS flow อย่างเป็นทางการของ TJ POS
