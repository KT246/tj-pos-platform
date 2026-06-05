# TJ POS — กลุ่มรูปภาพ UI

**อัปเดตล่าสุด:** 2026-06-05  
**ภาษา:** ไทย  
**วัตถุประสงค์:** ใช้กำหนดโครงสร้างและกติกาการเก็บรูปภาพ UI ใน `docs/designs`

---

## 1. บทบาทของ `docs/designs`

`docs/designs` ใช้สำหรับเก็บรูปภาพ UI เท่านั้น เช่น:

```text
screenshot
mockup
reference UI
design export image
```

ไม่ใช้สำหรับเก็บ source code, frontend component, backend code, API spec หรือเอกสารรายละเอียด

---

## 2. กฎการจัดเก็บรูปภาพ

1. รูปภาพ UI ต้องอยู่ในกลุ่ม UI ที่ถูกต้อง
2. ใช้ชื่อไฟล์ภาษาอังกฤษแบบ kebab-case เท่านั้น
3. ใช้เลขลำดับ 2 หลักนำหน้าไฟล์ เพื่อรักษาลำดับหน้าจอ
4. ถ้าหน้าจอเดียวกันมีหลายเวอร์ชัน ให้ใช้รูปที่ใหม่ล่าสุดเป็น source of truth
5. ห้ามใส่ไฟล์รูป UI ปนกับ source code ใน `frontend` หรือ `backend`

นามสกุลไฟล์ที่แนะนำ:

```text
.png
.jpg
.jpeg
.webp
```

ตัวอย่างชื่อไฟล์:

```text
01-dashboard-overview.png
02-order-list.png
03-order-detail.png
```

ถ้ายังไม่รู้ชื่อหน้าจอ ให้ตั้งชื่อชั่วคราวแบบนี้:

```text
01-design.png
02-design.png
03-design.png
```

แล้วค่อยเปลี่ยนชื่อให้ตรงกับหน้าจอจริงภายหลัง

---

## 3. กลุ่ม UI

| ลำดับ | โฟลเดอร์ | กลุ่ม | จำนวนรูป source of truth |
|---|---|---|---|
| 01 | `01-web-main` | Web หลัก | 7 |
| 02 | `02-platform-admin` | Platform Admin | 21 |
| 03 | `03-business-admin-core` | Business Admin Core | 32 |
| 04 | `04-pos-terminal` | POS Terminal | 17 |
| 05 | `05-staff-order-mobile` | Staff Order Mobile | 8 |
| 06 | `06-customer-display` | Customer Display | 4 |
| 07 | `07-kitchen-bar-display` | Kitchen / Bar Display | 6 |
| 08 | `08-public-menu-qr-menu` | Public Menu / QR Menu | 6 |
| 09 | `09-retail-specific` | Retail-specific | 5 |
| 10 | `10-cafe-specific` | Cafe-specific | 6 |
| 11 | `11-restaurant-specific` | Restaurant-specific | 7 |
| 12 | `12-beauty-specific` | Beauty-specific | 8 |
| 13 | `13-hospitality-specific` | Hospitality-specific | 7 |

รวมทั้งหมดตาม source of truth: **134 รูป**

---

## 4. หมายเหตุ

ตอนนี้โฟลเดอร์กลุ่มถูกเตรียมไว้แล้ว แต่ถ้ายังไม่มีรูป UI ในโฟลเดอร์ ระบบจะยังไม่มีอะไรให้ rename เป็นรายไฟล์

สำหรับ `01-web-main` ตามทิศทางล่าสุด ไม่มีหน้า Gallery แล้ว และใช้รูป UI 7 ส่วนเป็น source of truth:

```text
Home
POS Types
Features
Pricing
Add-ons
FAQ/Help
Contact
```

เว็บไซต์หลักใช้หน้า `/` หน้าเดียว แล้วเลื่อนไปยัง section ด้วย hash เช่น `/#pricing` หรือ `/#contact`
ไม่ใช้ route แยก `/pos-types`, `/features`, `/pricing`, `/add-ons`, `/faq-help`, `/contact` และไม่ใช้ `/request-demo`

ถ้ายังมีรูปเก่าเกี่ยวกับ Request Demo อยู่ใน folder ให้ถือว่า deprecated และไม่ใช้เป็น source of truth

สำหรับ `02-platform-admin` ให้ใช้รูป UI 21 รูปนี้เป็น source of truth สำหรับ dev:

```text
01-platform-admin-login.png
02-platform-admin-dashboard.png
03-businesses-list.png
04-business-detail.png
05-create-business.png
06-edit-business.png
07-business-owners-list.png
08-owner-detail.png
09-plans-management.png
10-assign-plan.png
11-add-ons-management.png
12-contact-requests-list.png
13-contact-request-detail.png
14-support-tickets-list.png
15-support-ticket-detail.png
16-global-modules-catalog.png
17-master-bank-payment-config.png
18-notification-templates.png
19-platform-settings.png
20-platform-audit-logs.png
21-platform-profile-security.png
```
