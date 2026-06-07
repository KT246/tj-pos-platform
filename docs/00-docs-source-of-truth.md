# TJ POS — แหล่งอ้างอิงหลักของเอกสาร

**อัปเดตล่าสุด:** 2026-06-05  
**ภาษา:** ไทย  
**วัตถุประสงค์:** ใช้เป็นไฟล์นำทางว่าเอกสารใดควรถูกใช้เป็นแหล่งอ้างอิงหลัก เมื่อมีหลายไฟล์พูดถึงหัวข้อเดียวกัน

---

## 1. กฎการใช้งานเอกสาร

เมื่อเอกสารหลายไฟล์พูดถึงหัวข้อเดียวกัน ให้ใช้กฎนี้:

```text
1. ใช้ไฟล์ที่แก้ไขล่าสุดเป็นแหล่งอ้างอิงหลักของหัวข้อนั้น
2. ถ้าไฟล์ใหม่กว่าเป็น guideline เฉพาะด้าน ให้ใช้ไฟล์นั้นสำหรับรายละเอียดด้านนั้น
3. ถ้าไฟล์เก่ากว่าเป็น overview ให้ใช้เป็นภาพรวม ไม่ใช้ตัดสินรายละเอียด implementation
4. API ให้ยึด `09-api-specification.md`
5. Database ให้ยึด `08-postgresql-database-schema.md`
6. Domain type ให้ยึด `07-domain-schema.md`
7. Frontend route ให้ยึด `03-frontend-routes.md`
8. UI interaction ให้ยึด `04-ui-interaction-guideline.md`
9. Roadmap / permission / Definition of Done ให้ยึด `11-remaining-implementation-spec.md`
10. Redis / PgBouncer / cache / lock ให้ยึด `10-redis-queue-worker-pgbouncer.md`
11. รูปภาพ UI ใน `docs/designs` ให้ยึด `13-ui-design-image-groups.md`
12. Frontend stack ให้ยึด `14-frontend-stack.md`
13. แผน dev Platform Admin ให้ยึด `15-platform-admin-dev-plan.md`
14. UI prompt, group style, locked prompt rule และ QA checklist ให้ยึด `TJ_POS_MASTER_GUIDE.md`
15. แผนแยก frontend app ใหม่ให้ยึด `16-frontend-vite-migration-plan.md`
```

หมายเหตุ:

```text
หลังจากปรับเอกสารให้ตรงกันแล้ว LastWriteTime ของไฟล์เก่าบางไฟล์อาจใหม่กว่าไฟล์ต้นทาง
ให้ยึดตารางแหล่งอ้างอิงหลักในไฟล์นี้เป็นหลัก
```

---

## 2. ลำดับเอกสารและบทบาท

| ไฟล์ | บทบาท |
|---|---|
| `01-product-final-flow.md` | ภาพรวมสินค้า, business model, flow หลัก |
| `02-web-menu-list.md` | สรุปเมนูหลักของแต่ละเว็บ/แอป |
| `03-frontend-routes.md` | แหล่งอ้างอิงหลักสำหรับ frontend routes |
| `04-ui-interaction-guideline.md` | แหล่งอ้างอิงหลักสำหรับ UI behavior, loading, confirm, sound, offline state |
| `05-menu-detail-spec.md` | รายละเอียด field, import/export, print/PDF, POS flow |
| `06-backend-stack.md` | ภาพรวม backend stack |
| `07-domain-schema.md` | แหล่งอ้างอิงหลักสำหรับ domain model และ TypeScript naming |
| `08-postgresql-database-schema.md` | แหล่งอ้างอิงหลักสำหรับ table, column, index, constraint |
| `09-api-specification.md` | แหล่งอ้างอิงหลักสำหรับ API endpoint และ response convention |
| `10-redis-queue-worker-pgbouncer.md` | แหล่งอ้างอิงหลักสำหรับ PgBouncer, Redis, cache, lock, queue architecture |
| `11-remaining-implementation-spec.md` | แหล่งอ้างอิงหลักสำหรับ roadmap, permission matrix, validation, testing, DoD |
| `12-fe-be-collaboration-rules.md` | กฎแบ่งงาน frontend/backend และกติกาก่อนต่อ API จริง |
| `13-ui-design-image-groups.md` | กฎจัดกลุ่มและตั้งชื่อรูปภาพ UI ใน `docs/designs` |
| `14-frontend-stack.md` | แหล่งอ้างอิงหลักสำหรับ frontend stack และ package ที่ใช้ |
| `15-platform-admin-dev-plan.md` | แผน dev Platform Admin จากรูป UI ใน `docs/designs/02-platform-admin` |
| `16-frontend-vite-migration-plan.md` | แผนย้าย app ฝั่งลูกค้าไปใช้ Vite และแยก `platform-admin` ออกจาก `web` |
| `TJ_POS_MASTER_GUIDE.md` | แหล่งอ้างอิงหลักสำหรับ UI prompt, group style, locked status, QA checklist และ anchor screen |

หมายเหตุสำหรับ frontend setup:

```text
ใช้ pnpm เท่านั้นสำหรับ frontend
ไม่ใช้ npm หรือ yarn ใน frontend
```

---

## 3. Naming Convention ของ project

ให้ใช้ชื่อ project/app ตามนี้:

| ชื่อ | ความหมาย |
|---|---|
| `frontend` | frontend workspace หลัก |
| `frontend/apps/web` | Next.js app สำหรับเว็บไซต์หลักของ TJ POS เท่านั้น |
| `frontend/apps/platform-admin` | Next.js app สำหรับ Platform Admin ของทีม TJ Solution |
| `frontend/apps/business-admin` | Vite React app สำหรับ Business Admin / Owner / Manager ของร้าน |
| `frontend/apps/terminal` | Vite React app สำหรับ POS Terminal |
| `frontend/apps/staff-order` | Vite React app สำหรับ Staff Order Mobile |
| `frontend/apps/kitchen-display` | Vite React app สำหรับ Kitchen / Bar Display |
| `frontend/apps/customer-display` | Vite React app สำหรับ Customer Display |
| `frontend/apps/public-menu` | Vite React app สำหรับ Public Menu / QR Menu ให้ลูกค้าสแกนดูเมนู |
| `backend` | Backend API กลางที่ทุกเว็บ/แอปใช้งานร่วมกัน |
| `tj_pos_platform_db` | PostgreSQL database กลางในช่วงเริ่มต้น |

ไม่ใช้ชื่อ project/app แบบมี prefix `tj-pos-` แล้ว

```text
ชื่อ project/app เดิมที่ขึ้นต้นด้วย prefix นี้ถือว่า deprecated ทั้งหมด
```

หมายเหตุ:

```text
`backend` ไม่ใช่เว็บ UI แต่เป็น backend ที่ทุกเว็บ/แอปใช้งานร่วมกัน
```

---

## 4. Conflict ที่ตรวจพบและแก้แล้ว

| หัวข้อ | ไฟล์ที่มีข้อมูลทับกัน | ข้อสรุปล่าสุด |
|---|---|---|
| ชื่อ project/app | `01-product-final-flow.md`, `02-web-menu-list.md`, `03-frontend-routes.md`, `04-ui-interaction-guideline.md`, `06-backend-stack.md`, `09-api-specification.md`, `10-redis-queue-worker-pgbouncer.md`, `16-frontend-vite-migration-plan.md` | ใช้ `frontend/apps/web`, `frontend/apps/platform-admin`, `frontend/apps/business-admin`, `frontend/apps/terminal`, `frontend/apps/staff-order`, `frontend/apps/kitchen-display`, `frontend/apps/customer-display`, `frontend/apps/public-menu` และ `backend` ตามทิศทางล่าสุด |
| Redis / BullMQ / Worker | `06-backend-stack.md`, `10-redis-queue-worker-pgbouncer.md`, `11-remaining-implementation-spec.md` | ใช้ PgBouncer เมื่อ backend เริ่มใช้งานจริง, ใช้ Redis ตั้งแต่ต้นสำหรับ cache/lock, เตรียม BullMQ + Worker ได้ แต่เปิดใช้จริงกับงานหนักตาม phase import/export/report/email/backup |
| Route POS Terminal | `02-web-menu-list.md`, `03-frontend-routes.md` | ใช้ route จาก `03-frontend-routes.md`: route ย่อยของ POS อยู่ใต้ `/terminal/b/[businessSlug]/pos/...` |
| Business field | `05-menu-detail-spec.md`, `07-domain-schema.md`, `08-postgresql-database-schema.md` | `phone` เป็น optional, `country` ค่าเริ่มต้น `LA`, `currency` ค่าเริ่มต้น `LAK`, ไม่ใช้ `language` เป็น field ของ business |
| ภาษาเว็บไซต์หลัก | `03-frontend-routes.md` | ไม่ใช้ i18n กลางทั้งระบบ; ใช้เฉพาะ Public Website ใน `frontend/apps/web` และรองรับเฉพาะ `lo` / `en` |
| Route เว็บไซต์หลัก | `02-web-menu-list.md`, `03-frontend-routes.md`, `11-remaining-implementation-spec.md` | เว็บไซต์หลักใช้หน้า `/` หน้าเดียวและ hash section เช่น `/#pricing`; ไม่ใช้ route แยกของเมนูเว็บไซต์หลัก และไม่ใช้ route demo แยก |
| Login บนเว็บไซต์หลัก | `02-web-menu-list.md`, `03-frontend-routes.md`, `15-platform-admin-dev-plan.md` | เว็บไซต์หลักไม่มีปุ่มหรือ link ไป `/login`; `/login` เป็น Auth/Admin Entry ที่เข้าผ่าน URL โดยตรงหรือ flow ภายในหลังทีม TJ POS setup ให้แล้ว |
| Route Public Business / QR Menu | `02-web-menu-list.md`, `03-frontend-routes.md`, `TJ_POS_MASTER_GUIDE.md` | `/b/[businessSlug]` เป็น public route ของแต่ละร้าน ไม่ต้อง login และใช้กับ Public Menu / QR Menu เช่น `/b/[businessSlug]/menu` |
| Route Business Workspace | `02-web-menu-list.md`, `03-frontend-routes.md`, `TJ_POS_MASTER_GUIDE.md` | Route หลัง login ของ Business Workspace ต้องใช้ `/business-admin/[businessSlug]/...`; ห้ามใช้ `/b/[businessSlug]/...` เป็น admin route และไม่ใช้ `/b/{businessSlug}` |
| Frontend app split | `14-frontend-stack.md`, `16-frontend-vite-migration-plan.md` | Next.js ใช้เฉพาะ `apps/web` และ `apps/platform-admin`; app ฝั่งลูกค้าทั้งหมดใช้ Vite React |
| Master guide เก่ากับทิศทางใหม่ | `TJ_POS_MASTER_GUIDE.md`, `02-web-menu-list.md`, `03-frontend-routes.md`, `13-ui-design-image-groups.md` | Web หลักไม่มี Gallery, ไม่มี Request Demo route, ไม่มี Login ใน navbar; ใช้ `/` + hash sections เท่านั้น |
| รูป Platform Admin | `13-ui-design-image-groups.md`, `15-platform-admin-dev-plan.md` | ใช้รูป 21 รูปใน `docs/designs/02-platform-admin` เป็น visual source of truth สำหรับ dev Platform Admin |
| Staff / Role field | `05-menu-detail-spec.md`, `07-domain-schema.md`, `08-postgresql-database-schema.md` | ใช้ `branch_ids` สำหรับหลายสาขา และ role ต้องมี `bar` ด้วย |
| Item status | `05-menu-detail-spec.md`, `07-domain-schema.md`, `08-postgresql-database-schema.md` | ใช้ status กลาง `active/inactive/suspended/archived`; สถานะขายใช้ `available_for_sale` และ stock แยกต่างหาก |
| Stock movement | `05-menu-detail-spec.md`, `07-domain-schema.md`, `08-postgresql-database-schema.md` | `movement_type` ต้องรองรับ `refund` |
| ภาษาในเอกสาร | `05-menu-detail-spec.md` | แก้หัวข้อที่ยังเป็นภาษาเวียดนามให้เป็นภาษาไทยแล้ว |

---

## 5. หลักการเมื่อทำ implementation

```text
Product / business flow → อ่าน 01 ก่อน
Menu / route → อ่าน 02 แล้วตรวจ route จริงกับ 03
UI behavior → อ่าน 04
Field ในหน้าจอ → อ่าน 05 แล้วตรวจ domain/db กับ 07 และ 08
Backend module / stack → อ่าน 06
Domain type → อ่าน 07
Database migration → อ่าน 08
API endpoint / response → อ่าน 09
Cache / lock / worker → อ่าน 10
Roadmap / permission / validation / testing → อ่าน 11
FE/BE collaboration → อ่าน 12
UI image / screenshot / mockup → อ่าน 13
Frontend stack / package → อ่าน 14
Platform Admin dev plan → อ่าน 15
Frontend Vite migration plan → อ่าน 16
UI prompt / group style / locked prompt → อ่าน TJ_POS_MASTER_GUIDE
```

---

## 6. หมายเหตุเกี่ยวกับไฟล์ binary

ใน workspace ปัจจุบัน เหลือเฉพาะไฟล์ Markdown ใน `docs`

ถ้ามีไฟล์ `.docx` หรือ `.pdf` ถูกเพิ่มกลับมาในอนาคต และเนื้อหาไม่ตรงกับไฟล์ Markdown ให้ใช้ไฟล์ Markdown เป็นแหล่งอ้างอิงหลัก โดยเฉพาะ:

```text
01-product-final-flow.md
```

เหตุผลคือไฟล์ Markdown เหมาะกับการ review, diff, และปรับเนื้อหาใน repo มากกว่า
