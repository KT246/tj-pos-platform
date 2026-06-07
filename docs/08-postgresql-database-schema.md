# TJ POS — PostgreSQL Database Schema Specification

**เวอร์ชัน:** PostgreSQL Database Schema Final Draft  
**ภาษา:** ไทย  
**ขอบเขต:** เอกสารนี้สรุปโครงสร้างฐานข้อมูล PostgreSQL แบบเต็มสำหรับ TJ POS  
**หมายเหตุ:** เอกสารนี้ใช้เป็นฐานในการออกแบบ migration, backend module, API และ frontend data model ต่อไป

---

## 1. หลักการออกแบบ Database

TJ POS ใช้ PostgreSQL และในช่วง MVP ใช้ฐานข้อมูลกลาง 1 ชุด:

```text
tj_pos_platform_db
```

ข้อมูลของแต่ละร้าน/ธุรกิจถูกแยกด้วย:

```text
business_id
branch_id
```

หลักการสำคัญ:

```text
1. ใช้ 1 database กลางใน MVP
2. ไม่ใช้ database แยกต่อร้านใน MVP
3. ไม่ใช้ custom domain หรือ deploy แยกต่อร้านใน MVP
4. ตารางข้อมูลของ business ต้องมี business_id
5. ตารางข้อมูลที่เกี่ยวกับสาขาต้องมี branch_id
6. ข้อมูลสำคัญ เช่น orders, payments, refunds, stock_movements, audit_logs ไม่ควรลบถาวร
7. ข้อมูล transaction ต้องเก็บ snapshot เพื่อรักษาข้อมูล ณ เวลาที่เกิดรายการ
8. Index ต้องเน้น business_id, branch_id, created_at, status และ field ที่ใช้ค้นหาบ่อย
```

---

## 2. มาตรฐานชนิดข้อมูล

| ประเภทข้อมูล | PostgreSQL Type |
|---|---|
| ID | `uuid` |
| เงิน | `numeric(14,2)` |
| จำนวนสินค้า / stock | `numeric(14,3)` |
| วันเวลา | `timestamptz` |
| วันที่ | `date` |
| ข้อความสั้น | `varchar` |
| ข้อความยาว | `text` |
| ข้อมูลยืดหยุ่น | `jsonb` |
| true/false | `boolean` |

---

## 3. Field มาตรฐานที่ควรมีในหลายตาราง

หลายตารางควรมี field เหล่านี้:

```text
id uuid primary key
business_id uuid
branch_id uuid nullable
status varchar
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz nullable
created_by uuid nullable
updated_by uuid nullable
```

ตารางบางประเภทไม่จำเป็นต้องมีครบทุก field เช่น ตาราง join หรือ transaction บางตัว แต่หลักการคือควรมี metadata พอให้ตรวจสอบย้อนหลังได้

---

## 4. Enum / Status หลัก

### 4.1 POS Type

```text
retail
cafe
restaurant
beauty
hospitality
```

### 4.2 User Role

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

### 4.3 Entity Status

```text
active
inactive
suspended
archived
```

### 4.4 Order Status

```text
draft
held
open
paid
cancelled
refunded
```

### 4.5 Payment Status

```text
unpaid
partial
paid
refunded
```

### 4.6 Payment Method Type

```text
cash
bank_transfer
qr
card
other
```

### 4.7 Item Type

```text
product
menu_item
service
room
extra_service
ingredient
```

---

# 5. Core / Tenant Tables

---

## 5.1 `users`

ใช้เก็บบัญชีผู้ใช้งานสำหรับ login

```sql
users
- id uuid pk
- full_name varchar not null
- email varchar unique null
- phone varchar unique null
- password_hash text not null
- avatar_url text null
- status varchar not null default 'active'
- last_login_at timestamptz null
- created_at timestamptz not null
- updated_at timestamptz not null
- deleted_at timestamptz null
```

### หมายเหตุ

```text
email หรือ phone ต้องมีอย่างน้อย 1 ค่า
```

### Index

```text
email
phone
status
```

---

## 5.2 `businesses`

ใช้เก็บข้อมูลร้าน, แบรนด์ หรือธุรกิจของลูกค้า

```sql
businesses
- id uuid pk
- name varchar not null
- slug varchar not null unique
- pos_type varchar not null
- category varchar null
- phone varchar null
- email varchar null
- address text null
- country varchar not null default 'LA'
- currency varchar not null default 'LAK'
- tax_enabled boolean not null default false
- service_charge_enabled boolean not null default false
- owner_user_id uuid not null fk users(id)
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
- deleted_at timestamptz null
```

### Index

```text
slug
owner_user_id
pos_type
status
```

---

## 5.3 `branches`

ใช้เก็บสาขาหรือจุดขายของ business

```sql
branches
- id uuid pk
- business_id uuid not null fk businesses(id)
- name varchar not null
- code varchar not null
- address text null
- phone varchar null
- manager_user_id uuid null fk users(id)
- opening_hours jsonb null
- default_payment_method_id uuid null
- default_receipt_template_id uuid null
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
- deleted_at timestamptz null
```

### Unique

```text
business_id + code
```

### Index

```text
business_id
business_id + status
```

---

## 5.4 `business_members`

ใช้เชื่อม user กับ business และกำหนด role/permission

```sql
business_members
- id uuid pk
- business_id uuid not null fk businesses(id)
- user_id uuid not null fk users(id)
- role varchar not null
- branch_ids uuid[] null
- can_login boolean not null default true
- pin_code_hash text null
- permissions jsonb not null default '[]'
- commission_enabled boolean not null default false
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
- deleted_at timestamptz null
```

### Unique

```text
business_id + user_id
```

### Index

```text
business_id
user_id
business_id + role
```

---

## 5.5 `roles`

ใช้เก็บ role มาตรฐานหรือ custom role

```sql
roles
- id uuid pk
- business_id uuid null fk businesses(id)
- key varchar not null
- name varchar not null
- description text null
- is_system boolean not null default false
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
```

### หมายเหตุ

```text
business_id = null หมายถึง role ของระบบ
business_id มีค่า หมายถึง custom role ของ business นั้น
```

---

## 5.6 `permissions`

ใช้เก็บ permission ทั้งหมดในระบบ

```sql
permissions
- id uuid pk
- key varchar not null unique
- name varchar not null
- description text null
- module varchar not null
- created_at timestamptz not null
```

### ตัวอย่าง permission

```text
order.create
order.cancel
order.refund
item.create
item.update
payment.confirm
stock.adjust
report.view
```

---

## 5.7 `role_permissions`

ใช้เชื่อม role กับ permission

```sql
role_permissions
- id uuid pk
- role_id uuid not null fk roles(id)
- permission_id uuid not null fk permissions(id)
- created_at timestamptz not null
```

### Unique

```text
role_id + permission_id
```

---

# 6. Platform / Subscription Tables

---

## 6.1 `plans`

ใช้เก็บแพ็กเกจบริการ

```sql
plans
- id uuid pk
- name varchar not null
- code varchar not null unique
- description text null
- max_branches int null
- max_pos_devices int null
- max_staff int null
- max_items int null
- max_orders_per_month int null
- max_member_profiles int null
- support_level varchar not null default 'standard'
- allow_add_ons boolean not null default true
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
```

### ตัวอย่าง code

```text
starter
pro
business
enterprise
```

---

## 6.2 `subscriptions`

ใช้เก็บว่า business ใช้แพ็กเกจใด

```sql
subscriptions
- id uuid pk
- business_id uuid not null fk businesses(id)
- plan_id uuid not null fk plans(id)
- billing_cycle varchar not null
- status varchar not null default 'active'
- started_at timestamptz not null
- expires_at timestamptz not null
- setup_fee_waived boolean not null default false
- custom_note text null
- created_at timestamptz not null
- updated_at timestamptz not null
```

### billing_cycle

```text
monthly
yearly
custom
```

### Index

```text
business_id
plan_id
status
expires_at
```

---

## 6.3 `add_ons`

ใช้เก็บรายการ add-on ของระบบ

```sql
add_ons
- id uuid pk
- key varchar not null unique
- name varchar not null
- description text null
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
```

### ตัวอย่าง add-on

```text
customer_display
staff_order
qr_menu
kitchen_display
advanced_inventory
smart_menu
a4_invoice
```

---

## 6.4 `business_add_ons`

ใช้เก็บว่า business เปิด add-on ใด

```sql
business_add_ons
- id uuid pk
- business_id uuid not null fk businesses(id)
- add_on_id uuid not null fk add_ons(id)
- enabled boolean not null default false
- enabled_at timestamptz null
- enabled_by uuid null fk users(id)
- expires_at timestamptz null
- created_at timestamptz not null
- updated_at timestamptz not null
```

### Unique

```text
business_id + add_on_id
```

---

## 6.5 `subscription_payments`

ใช้เก็บการชำระเงินค่าแพ็กเกจให้ TJ POS

```sql
subscription_payments
- id uuid pk
- business_id uuid not null fk businesses(id)
- subscription_id uuid not null fk subscriptions(id)
- amount numeric(14,2) not null
- currency varchar not null default 'LAK'
- payment_method varchar null
- payment_note text null
- paid_at timestamptz null
- confirmed_by uuid null fk users(id)
- status varchar not null default 'pending'
- created_at timestamptz not null
- updated_at timestamptz not null
```

### status

```text
pending
confirmed
rejected
cancelled
```

---

## 6.6 `contact_requests`

ใช้เก็บคำขอติดต่อจากหน้าเว็บไซต์หลัก

```sql
contact_requests
- id uuid pk
- full_name varchar not null
- phone varchar not null
- email varchar null
- business_name varchar null
- pos_type varchar null
- message text null
- status varchar not null default 'new'
- assigned_to uuid null fk users(id)
- created_at timestamptz not null
- updated_at timestamptz not null
```

### status

```text
new
contacted
in_progress
closed
```

---

# 7. Catalog / Items Tables

---

## 7.1 `categories`

ใช้เก็บหมวดหมู่สินค้า เมนู บริการ หรือห้อง

```sql
categories
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid null fk branches(id)
- name varchar not null
- parent_category_id uuid null fk categories(id)
- pos_type varchar null
- image_url text null
- sort_order int null
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
- deleted_at timestamptz null
```

### Index

```text
business_id
business_id + parent_category_id
business_id + status
```

---

## 7.2 `items`

ตารางกลางสำหรับ product, menu item, service, room, extra service

```sql
items
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid null fk branches(id)
- name varchar not null
- item_type varchar not null
- category_id uuid not null fk categories(id)
- selling_price numeric(14,2) not null
- cost_price numeric(14,2) null
- wholesale_price numeric(14,2) null
- reseller_price numeric(14,2) null
- min_wholesale_quantity numeric(14,3) null
- image_url text null
- description text null
- sku varchar null
- barcode varchar null
- unit varchar not null
- tax_id uuid null
- available_for_sale boolean not null default true
- sort_order int null
- status varchar not null default 'active'
- metadata jsonb null
- created_at timestamptz not null
- updated_at timestamptz not null
- deleted_at timestamptz null
```

### การใช้ `metadata`

`metadata` ใช้เก็บ field ยืดหยุ่นตาม POS Type

```text
Retail: size, color, brand, expiry_date, batch_no
Cafe: toppings, sugar, ice, station
Beauty: duration, commission
Hospitality: room info
```

หมายเหตุ Wholesale:

```text
selling_price คือ default retail price
wholesale_price และ reseller_price เป็น optional
ไม่สร้าง item ซ้ำสำหรับขายส่ง
```

### Index

```text
business_id
business_id + category_id
business_id + barcode
business_id + sku
business_id + status
business_id + available_for_sale
```

---

## 7.3 `item_variants`

ใช้เก็บตัวเลือกสินค้าหรือ variant เช่น size/color

```sql
item_variants
- id uuid pk
- business_id uuid not null fk businesses(id)
- item_id uuid not null fk items(id)
- name varchar not null
- sku varchar null
- barcode varchar null
- selling_price numeric(14,2) null
- cost_price numeric(14,2) null
- attributes jsonb null
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
- deleted_at timestamptz null
```

### ตัวอย่าง attributes

```json
{
  "size": "L",
  "color": "Black"
}
```

---

## 7.4 `item_options`

ใช้เก็บกลุ่ม option ของ item

```sql
item_options
- id uuid pk
- business_id uuid not null fk businesses(id)
- item_id uuid null fk items(id)
- name varchar not null
- option_type varchar not null
- required boolean not null default false
- multiple boolean not null default false
- sort_order int null
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
```

### ตัวอย่าง option

```text
Size
Topping
Sugar Level
Ice Level
```

---

## 7.5 `item_option_values`

ใช้เก็บค่าของ option

```sql
item_option_values
- id uuid pk
- business_id uuid not null fk businesses(id)
- option_id uuid not null fk item_options(id)
- name varchar not null
- price_delta numeric(14,2) not null default 0
- sort_order int null
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
```

---

## 7.6 `item_branch_availability`

ใช้กำหนดว่า item ขายที่สาขาใด และสามารถมีราคาพิเศษตามสาขาได้

```sql
item_branch_availability
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- item_id uuid not null fk items(id)
- available boolean not null default true
- custom_price numeric(14,2) null
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
```

### Unique

```text
business_id + branch_id + item_id
```

---

## 7.7 `price_lists`

ใช้เก็บชุดราคาพิเศษสำหรับลูกค้าส่ง, reseller หรือกลุ่มลูกค้าเฉพาะ โดยไม่ถือเป็น module แยก

```sql
price_lists
- id uuid pk
- business_id uuid not null fk businesses(id)
- name varchar not null
- customer_type varchar null
- description text null
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
- deleted_at timestamptz null
```

### Index

```text
business_id + customer_type
business_id + status
```

---

## 7.8 `price_list_items`

ใช้เก็บราคาพิเศษราย item ของแต่ละ price list

```sql
price_list_items
- id uuid pk
- business_id uuid not null fk businesses(id)
- price_list_id uuid not null fk price_lists(id)
- item_id uuid not null fk items(id)
- price numeric(14,2) not null
- min_quantity numeric(14,3) null
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
```

### Unique

```text
business_id + price_list_id + item_id
```

---

## 7.9 `tax_rates`

ใช้เก็บภาษีแบบ optional

```sql
tax_rates
- id uuid pk
- business_id uuid not null fk businesses(id)
- name varchar not null
- rate numeric(6,3) not null
- included_in_price boolean not null default false
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
```

---

# 8. Sales / Orders / Payments Tables

---

## 8.1 `orders`

ใช้เก็บ order หรือบิลขาย

```sql
orders
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- order_number varchar not null
- pos_type varchar not null
- order_type varchar not null
- customer_id uuid null
- price_list_id uuid null fk price_lists(id)
- staff_id uuid not null fk users(id)
- cashier_id uuid null fk users(id)
- table_id uuid null
- room_id uuid null
- appointment_id uuid null
- status varchar not null default 'draft'
- payment_status varchar not null default 'unpaid'
- debt_status varchar null
- delivery_status varchar null
- subtotal numeric(14,2) not null default 0
- discount_total numeric(14,2) not null default 0
- tax_total numeric(14,2) null
- service_charge numeric(14,2) null
- grand_total numeric(14,2) not null default 0
- note text null
- source varchar null
- created_at timestamptz not null
- updated_at timestamptz not null
- paid_at timestamptz null
- cancelled_at timestamptz null
- cancelled_by uuid null fk users(id)
- cancel_reason text null
```

### Unique

```text
business_id + order_number
```

### Index

```text
business_id + branch_id + created_at
business_id + status
business_id + payment_status
business_id + debt_status
business_id + order_number
```

---

## 8.2 `order_items`

ใช้เก็บรายการสินค้า/เมนู/บริการใน order

```sql
order_items
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- order_id uuid not null fk orders(id)
- item_id uuid not null fk items(id)
- item_variant_id uuid null fk item_variants(id)
- item_name_snapshot varchar not null
- quantity numeric(14,3) not null
- unit_price_snapshot numeric(14,2) not null
- cost_price_snapshot numeric(14,2) null
- discount_amount numeric(14,2) null
- total_amount numeric(14,2) not null
- options_snapshot jsonb null
- item_note text null
- kitchen_status varchar null
- served_status varchar null
- created_at timestamptz not null
- updated_at timestamptz not null
```

### Index

```text
business_id + order_id
business_id + item_id
```

### Snapshot สำคัญ

```text
item_name_snapshot
unit_price_snapshot
cost_price_snapshot
options_snapshot
```

เหตุผล: หาก item เปลี่ยนชื่อหรือเปลี่ยนราคาในอนาคต order เก่ายังต้องแสดงข้อมูล ณ เวลาที่ขาย

---

## 8.3 `payment_methods`

ใช้เก็บช่องทางชำระเงินของ business

```sql
payment_methods
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid null fk branches(id)
- name varchar not null
- method_type varchar not null
- bank_name varchar null
- account_name varchar null
- account_number varchar null
- qr_image_url text null
- payment_note text null
- is_default boolean not null default false
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
- deleted_at timestamptz null
```

### Index

```text
business_id
business_id + branch_id
business_id + method_type
```

---

## 8.4 `payments`

ใช้เก็บ transaction การชำระเงิน

```sql
payments
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- order_id uuid null fk orders(id)
- customer_id uuid null fk customers(id)
- payment_context varchar not null default 'order_payment'
- payment_method_id uuid not null fk payment_methods(id)
- amount numeric(14,2) not null
- currency varchar not null default 'LAK'
- bank_name_snapshot varchar null
- reference_code varchar null
- confirmed_by uuid not null fk users(id)
- paid_at timestamptz not null
- status varchar not null default 'confirmed'
- note text null
- created_at timestamptz not null
- updated_at timestamptz not null
```

### Index

```text
business_id + branch_id + paid_at
business_id + order_id
business_id + customer_id
business_id + status
```

### payment_context

```text
order_payment
debt_payment
opening_balance_payment
```

---

## 8.5 `refunds`

ใช้เก็บข้อมูล refund หรือการคืนเงิน

```sql
refunds
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- order_id uuid not null fk orders(id)
- refund_type varchar not null
- refund_amount numeric(14,2) not null
- restock boolean not null default false
- reason text not null
- approved_by uuid null fk users(id)
- created_by uuid not null fk users(id)
- created_at timestamptz not null
```

---

## 8.6 `refund_items`

ใช้เก็บ item ที่ถูกคืน

```sql
refund_items
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- refund_id uuid not null fk refunds(id)
- order_item_id uuid not null fk order_items(id)
- quantity numeric(14,3) not null
- created_at timestamptz not null
```

---

## 8.7 `cash_sessions`

ใช้เก็บข้อมูลกะขาย

```sql
cash_sessions
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- device_id uuid not null
- staff_id uuid not null fk users(id)
- opening_cash numeric(14,2) null
- expected_cash numeric(14,2) null
- actual_cash numeric(14,2) null
- difference numeric(14,2) null
- status varchar not null default 'open'
- opened_at timestamptz not null
- closed_at timestamptz null
- note text null
```

### Index

```text
business_id + branch_id + opened_at
staff_id
status
```

---

# 9. Inventory / Supplier Tables

---

## 9.1 `suppliers`

ใช้เก็บ supplier หรือผู้จัดหา

```sql
suppliers
- id uuid pk
- business_id uuid not null fk businesses(id)
- name varchar not null
- phone varchar null
- email varchar null
- address text null
- contact_person varchar null
- tax_code varchar null
- payment_terms text null
- debt_balance numeric(14,2) null
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
- deleted_at timestamptz null
```

---

## 9.2 `inventory_balances`

ใช้เก็บ stock ปัจจุบันของ item ตามสาขา

```sql
inventory_balances
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- item_id uuid not null fk items(id)
- current_stock numeric(14,3) not null default 0
- unit varchar not null
- minimum_stock numeric(14,3) null
- maximum_stock numeric(14,3) null
- average_cost numeric(14,2) null
- last_stock_count_date timestamptz null
- updated_at timestamptz not null
```

### Unique

```text
business_id + branch_id + item_id
```

---

## 9.3 `stock_movements`

ใช้เก็บประวัติ stock in/out/adjustment/transfer/refund

```sql
stock_movements
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- item_id uuid not null fk items(id)
- movement_type varchar not null
- quantity numeric(14,3) not null
- unit varchar not null
- reference_type varchar not null
- reference_id uuid null
- note text null
- created_by uuid not null fk users(id)
- created_at timestamptz not null
```

### Index

```text
business_id + branch_id + created_at
business_id + item_id
reference_type + reference_id
```

---

## 9.4 `purchase_receipts`

ใช้เก็บใบรับสินค้า/ใบ nhậpสินค้า

```sql
purchase_receipts
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- supplier_id uuid null fk suppliers(id)
- receipt_number varchar not null
- total_amount numeric(14,2) not null default 0
- note text null
- status varchar not null default 'completed'
- created_by uuid not null fk users(id)
- created_at timestamptz not null
- updated_at timestamptz not null
```

---

## 9.5 `purchase_receipt_items`

ใช้เก็บ item ในใบรับสินค้า

```sql
purchase_receipt_items
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- purchase_receipt_id uuid not null fk purchase_receipts(id)
- item_id uuid not null fk items(id)
- quantity numeric(14,3) not null
- unit_cost numeric(14,2) not null
- total_cost numeric(14,2) not null
- expiry_date date null
- batch_no varchar null
```

---

# 10. Customer / Loyalty / Promotion Tables

---

## 10.1 `customers`

ใช้เก็บ customer profile / member profile

```sql
customers
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid null fk branches(id)
- name varchar null
- customer_type varchar not null default 'retail_customer'
- price_list_id uuid null fk price_lists(id)
- debt_balance numeric(14,2) not null default 0
- credit_limit numeric(14,2) null
- payment_term varchar null
- phone varchar null
- email varchar null
- birthday date null
- gender varchar null
- address text null
- member_code varchar null
- points_balance numeric(14,2) not null default 0
- member_tier varchar null
- total_spending numeric(14,2) not null default 0
- total_orders int not null default 0
- last_visit timestamptz null
- notes text null
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
- deleted_at timestamptz null
```

### Index

```text
business_id + phone
business_id + member_code
business_id + customer_type
business_id + price_list_id
```

---

## 10.2 `loyalty_rules`

ใช้เก็บกติกาสะสมแต้ม

```sql
loyalty_rules
- id uuid pk
- business_id uuid not null fk businesses(id)
- name varchar not null
- earning_rule jsonb not null
- redeem_rule jsonb not null
- expiry_rule jsonb null
- tier_rule jsonb null
- applicable_item_ids uuid[] null
- start_date timestamptz null
- end_date timestamptz null
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
```

---

## 10.3 `loyalty_point_transactions`

ใช้เก็บประวัติแต้ม

```sql
loyalty_point_transactions
- id uuid pk
- business_id uuid not null fk businesses(id)
- customer_id uuid not null fk customers(id)
- order_id uuid null fk orders(id)
- type varchar not null
- points numeric(14,2) not null
- note text null
- created_at timestamptz not null
```

### type

```text
earn
redeem
adjust
expire
```

---

## 10.4 `promotions`

ใช้เก็บโปรโมชั่น

```sql
promotions
- id uuid pk
- business_id uuid not null fk businesses(id)
- name varchar not null
- promotion_type varchar not null
- discount_type varchar null
- discount_value numeric(14,2) null
- apply_scope varchar not null
- conditions jsonb null
- start_date timestamptz not null
- end_date timestamptz not null
- applicable_branch_ids uuid[] null
- applicable_customer_tiers varchar[] null
- usage_limit int null
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
- deleted_at timestamptz null
```

---

## 10.5 `promotion_coupons`

ใช้เก็บ coupon code

```sql
promotion_coupons
- id uuid pk
- business_id uuid not null fk businesses(id)
- promotion_id uuid not null fk promotions(id)
- code varchar not null
- usage_limit int null
- used_count int not null default 0
- status varchar not null default 'active'
- created_at timestamptz not null
```

### Unique

```text
business_id + code
```

---

## 10.6 `promotion_usages`

ใช้เก็บประวัติการใช้ promotion/coupon

```sql
promotion_usages
- id uuid pk
- business_id uuid not null fk businesses(id)
- promotion_id uuid not null fk promotions(id)
- coupon_id uuid null fk promotion_coupons(id)
- order_id uuid not null fk orders(id)
- customer_id uuid null fk customers(id)
- discount_amount numeric(14,2) not null default 0
- used_at timestamptz not null
```

---

# 11. Cafe / Restaurant Industry Tables

---

## 11.1 `areas`

ใช้เก็บโซนหรือพื้นที่โต๊ะ

```sql
areas
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- name varchar not null
- sort_order int null
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
```

---

## 11.2 `tables`

ใช้เก็บโต๊ะ

```sql
tables
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- area_id uuid not null fk areas(id)
- name varchar not null
- capacity int null
- table_status varchar not null default 'available'
- qr_code varchar null
- note text null
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
```

---

## 11.3 `kitchen_tickets`

ใช้เก็บใบครัว/ใบ bar

```sql
kitchen_tickets
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- ticket_number varchar not null
- order_id uuid not null fk orders(id)
- table_id uuid null fk tables(id)
- station varchar not null
- status varchar not null default 'pending'
- created_at timestamptz not null
- completed_at timestamptz null
```

---

## 11.4 `kitchen_ticket_items`

ใช้เก็บ item ในใบครัว/ใบ bar

```sql
kitchen_ticket_items
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- kitchen_ticket_id uuid not null fk kitchen_tickets(id)
- order_item_id uuid not null fk order_items(id)
- item_name_snapshot varchar not null
- quantity numeric(14,3) not null
- note text null
- status varchar not null default 'pending'
```

---

# 12. Beauty Industry Tables

---

## 12.1 `appointments`

ใช้เก็บข้อมูลการนัดหมาย

```sql
appointments
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- customer_id uuid not null fk customers(id)
- service_id uuid not null fk items(id)
- staff_id uuid null fk users(id)
- room_or_chair varchar null
- start_time timestamptz not null
- end_time timestamptz not null
- status varchar not null default 'booked'
- deposit numeric(14,2) null
- note text null
- created_at timestamptz not null
- updated_at timestamptz not null
```

---

## 12.2 `treatment_packages`

ใช้เก็บแพ็กเกจหรือคอร์สบริการ

```sql
treatment_packages
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid null fk branches(id)
- customer_id uuid not null fk customers(id)
- service_id uuid not null fk items(id)
- name varchar not null
- total_sessions int not null
- used_sessions int not null default 0
- remaining_sessions int not null
- expiry_date date null
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
```

---

## 12.3 `treatment_package_sessions`

ใช้เก็บประวัติการใช้คอร์สแต่ละครั้ง

```sql
treatment_package_sessions
- id uuid pk
- business_id uuid not null fk businesses(id)
- treatment_package_id uuid not null fk treatment_packages(id)
- appointment_id uuid null fk appointments(id)
- used_by uuid null fk users(id)
- used_at timestamptz not null
- note text null
```

---

# 13. Hospitality Industry Tables

---

## 13.1 `rooms`

ใช้เก็บข้อมูลห้องพัก

```sql
rooms
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- name varchar not null
- room_type varchar not null
- capacity int not null
- base_price numeric(14,2) not null
- room_status varchar not null default 'available'
- floor varchar null
- amenities jsonb null
- note text null
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
```

---

## 13.2 `bookings`

ใช้เก็บข้อมูลการจองห้อง

```sql
bookings
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- guest_id uuid not null fk customers(id)
- room_id uuid not null fk rooms(id)
- check_in_date timestamptz not null
- check_out_date timestamptz not null
- number_of_guests int null
- deposit numeric(14,2) null
- booking_source varchar null
- status varchar not null default 'booked'
- note text null
- created_at timestamptz not null
- updated_at timestamptz not null
```

---

## 13.3 `booking_extra_services`

ใช้เก็บบริการเสริมใน booking

```sql
booking_extra_services
- id uuid pk
- business_id uuid not null fk businesses(id)
- booking_id uuid not null fk bookings(id)
- item_id uuid not null fk items(id)
- quantity numeric(14,3) not null
- price numeric(14,2) not null
- total_amount numeric(14,2) not null
- created_at timestamptz not null
```

---

## 13.4 `housekeeping_tasks`

ใช้เก็บงานทำความสะอาดห้อง

```sql
housekeeping_tasks
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- room_id uuid not null fk rooms(id)
- assigned_to uuid null fk users(id)
- status varchar not null default 'pending'
- note text null
- created_at timestamptz not null
- completed_at timestamptz null
```

---

# 14. Config / UI / System Tables

---

## 14.1 `receipt_templates`

ใช้เก็บรูปแบบบิล

```sql
receipt_templates
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid null fk branches(id)
- name varchar not null
- paper_size varchar not null default '80mm'
- color_mode varchar not null default 'black_white'
- show_logo boolean not null default true
- show_branch_address boolean not null default true
- show_table boolean not null default false
- show_item_note boolean not null default true
- show_bank_info boolean not null default true
- show_qr boolean not null default true
- footer_text text null
- column_labels jsonb null
- enabled_blocks jsonb null
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
```

---

## 14.2 `branding_settings`

ใช้เก็บ logo, สี และ style ของ business

```sql
branding_settings
- id uuid pk
- business_id uuid not null fk businesses(id)
- logo_url text null
- primary_color varchar null
- secondary_color varchar null
- banner_url text null
- menu_style jsonb null
- customer_display_style jsonb null
- receipt_footer text null
- updated_at timestamptz not null
```

### Unique

```text
business_id
```

---

## 14.3 `devices`

ใช้เก็บอุปกรณ์ของ business

```sql
devices
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid not null fk branches(id)
- name varchar not null
- device_type varchar not null
- device_code varchar null
- last_seen_at timestamptz null
- is_online boolean not null default false
- status varchar not null default 'active'
- created_at timestamptz not null
- updated_at timestamptz not null
```

### device_type

```text
pos
staff_order
customer_display
kitchen_display
bar_display
printer
```

---

## 14.4 `module_settings`

ใช้เก็บ module ที่เปิด/ปิดของ business

```sql
module_settings
- id uuid pk
- business_id uuid not null fk businesses(id)
- module_key varchar not null
- enabled boolean not null default false
- enabled_at timestamptz null
- enabled_by uuid null fk users(id)
- created_at timestamptz not null
- updated_at timestamptz not null
```

### Unique

```text
business_id + module_key
```

---

## 14.5 `support_tickets`

ใช้เก็บ support ticket / feedback / bug report

```sql
support_tickets
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid null fk branches(id)
- created_by uuid not null fk users(id)
- type varchar not null
- title varchar not null
- description text not null
- attachment_url text null
- priority varchar null
- ticket_status varchar not null default 'open'
- assigned_to uuid null fk users(id)
- created_at timestamptz not null
- updated_at timestamptz not null
```

---

## 14.6 `support_ticket_messages`

ใช้เก็บข้อความใน ticket

```sql
support_ticket_messages
- id uuid pk
- ticket_id uuid not null fk support_tickets(id)
- sender_id uuid not null fk users(id)
- message text not null
- attachment_url text null
- created_at timestamptz not null
```

---

## 14.7 `file_assets`

ใช้เก็บ file ที่ upload เข้าระบบ

```sql
file_assets
- id uuid pk
- business_id uuid null fk businesses(id)
- uploaded_by uuid null fk users(id)
- file_name varchar not null
- file_type varchar not null
- mime_type varchar null
- file_size bigint null
- url text not null
- storage_key text not null
- is_public boolean not null default false
- created_at timestamptz not null
```

---

## 14.8 `import_jobs`

ใช้เก็บ job การ import ข้อมูล

```sql
import_jobs
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid null fk branches(id)
- type varchar not null
- file_url text not null
- status varchar not null default 'pending'
- total_rows int null
- success_rows int null
- failed_rows int null
- error_file_url text null
- created_by uuid not null fk users(id)
- created_at timestamptz not null
- updated_at timestamptz not null
```

---

## 14.9 `export_jobs`

ใช้เก็บ job การ export ข้อมูล

```sql
export_jobs
- id uuid pk
- business_id uuid not null fk businesses(id)
- branch_id uuid null fk branches(id)
- type varchar not null
- format varchar not null
- file_url text null
- status varchar not null default 'pending'
- created_by uuid not null fk users(id)
- created_at timestamptz not null
- updated_at timestamptz not null
```

---

## 14.10 `audit_logs`

ใช้เก็บประวัติ action สำคัญ

```sql
audit_logs
- id uuid pk
- business_id uuid null fk businesses(id)
- branch_id uuid null fk branches(id)
- user_id uuid not null fk users(id)
- action varchar not null
- entity_type varchar not null
- entity_id uuid null
- old_data jsonb null
- new_data jsonb null
- ip_address varchar null
- device_id uuid null
- created_at timestamptz not null
```

### Index

```text
business_id + created_at
user_id + created_at
entity_type + entity_id
action
```

---

## 14.11 `system_settings`

ใช้เก็บ setting ระดับระบบ

```sql
system_settings
- id uuid pk
- key varchar not null unique
- value jsonb not null
- description text null
- updated_at timestamptz not null
```

---

# 15. Index สำคัญที่ต้องมี

เพราะระบบใช้ database รวม จึงต้องให้ความสำคัญกับ index

## 15.1 `items`

```text
business_id
business_id + category_id
business_id + barcode
business_id + sku
business_id + status
business_id + available_for_sale
```

## 15.2 `orders`

```text
business_id + branch_id + created_at
business_id + order_number
business_id + status
business_id + payment_status
business_id + customer_id
```

## 15.3 `payments`

```text
business_id + branch_id + paid_at
business_id + order_id
business_id + status
```

## 15.4 `customers`

```text
business_id + phone
business_id + member_code
business_id + status
```

## 15.5 `stock_movements`

```text
business_id + branch_id + created_at
business_id + item_id
reference_type + reference_id
```

## 15.6 `audit_logs`

```text
business_id + created_at
user_id + created_at
entity_type + entity_id
```

---

# 16. ตารางที่ไม่ควรลบถาวร

ไม่ควร hard delete:

```text
orders
order_items
payments
refunds
refund_items
stock_movements
audit_logs
cash_sessions
subscription_payments
```

ควรใช้ soft delete หรือ status กับ:

```text
items
categories
customers
staff/business_members
suppliers
payment_methods
promotions
devices
```

---

# 17. Snapshot Fields ที่ต้องมี

ข้อมูล transaction ต้องเก็บ snapshot เพื่อให้ข้อมูลเก่าไม่เปลี่ยนเมื่อข้อมูล master เปลี่ยน

## 17.1 `order_items`

```text
item_name_snapshot
unit_price_snapshot
cost_price_snapshot
options_snapshot
```

## 17.2 `payments`

```text
bank_name_snapshot
```

เหตุผล:

```text
ถ้าในอนาคตเปลี่ยนชื่อ item, ราคา, ธนาคาร หรือ QR
order เก่าและ bill เก่าต้องยังแสดงข้อมูลถูกต้อง ณ เวลาที่ทำรายการ
```

---

# 18. รายการตารางทั้งหมดที่ชัดเจน

```text
1. users
2. businesses
3. branches
4. business_members
5. roles
6. permissions
7. role_permissions

8. plans
9. subscriptions
10. add_ons
11. business_add_ons
12. subscription_payments
13. contact_requests

14. categories
15. items
16. item_variants
17. item_options
18. item_option_values
19. item_branch_availability
20. price_lists
21. price_list_items
22. tax_rates

23. orders
24. order_items
25. payment_methods
26. payments
27. refunds
28. refund_items
29. cash_sessions

30. suppliers
31. inventory_balances
32. stock_movements
33. purchase_receipts
34. purchase_receipt_items

35. customers
36. loyalty_rules
37. loyalty_point_transactions
38. promotions
39. promotion_coupons
40. promotion_usages

41. areas
42. tables
43. kitchen_tickets
44. kitchen_ticket_items

45. appointments
46. treatment_packages
47. treatment_package_sessions

48. rooms
49. bookings
50. booking_extra_services
51. housekeeping_tasks

52. receipt_templates
53. branding_settings
54. devices
55. module_settings
56. support_tickets
57. support_ticket_messages
58. file_assets
59. import_jobs
60. export_jobs
61. audit_logs
62. system_settings
```

---

# 19. ข้อสรุปสุดท้าย

นี่คือ PostgreSQL Database Schema แบบเต็มของ TJ POS

หลักการสุดท้าย:

```text
1. ใช้ 1 database กลาง
2. แยกข้อมูลด้วย business_id / branch_id
3. รองรับ POS ทั้ง 5 ประเภท
4. Field ที่ไม่ใช้ให้เป็น null
5. Order, payment, refund, stock movement, audit log ไม่ลบถาวร
6. Transaction ต้องเก็บ snapshot
7. Index ต้องเน้น business_id, branch_id, created_at, status
8. Wholesale ใช้ customers/items/orders/payments/reports/import-export เดิม ไม่สร้าง module แยก
9. Schema นี้ใช้เป็นฐานสำหรับ migration, API และ frontend mapping ต่อไป
```
