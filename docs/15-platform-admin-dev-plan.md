# TJ POS — Platform Admin Development Plan

**อัปเดตล่าสุด:** 2026-06-05  
**ภาษา:** ไทย  
**ขอบเขต:** แผน dev สำหรับ Platform Admin โดยยึดรูปใน `docs/designs/02-platform-admin` เป็น visual source of truth

---

## 1. เป้าหมาย

Platform Admin คือพื้นที่ทำงานของทีม TJ POS สำหรับจัดการระบบทั้งหมด ไม่ใช่ admin ของร้าน

เป้าหมายของรอบ dev นี้:

```text
สร้างโครงหน้า Platform Admin ใน frontend/apps/web
ใช้ mock data ก่อน
ยังไม่ต่อ API จริง
ยังไม่แตะ backend
ยังไม่เปลี่ยน UI เว็บไซต์หลัก
ยึดรูปใน docs/designs/02-platform-admin เป็นหลัก
```

---

## 2. Source of Truth

ต้องอ่านเอกสารเหล่านี้ก่อนเริ่ม dev:

```text
00-docs-source-of-truth.md
02-web-menu-list.md
03-frontend-routes.md
04-ui-interaction-guideline.md
11-remaining-implementation-spec.md
12-fe-be-collaboration-rules.md
13-ui-design-image-groups.md
14-frontend-stack.md
```

รูป UI ที่ใช้:

```text
docs/designs/02-platform-admin
```

กฎสำคัญ:

```text
ถ้ารูปกับข้อความใน docs ขัดกัน ให้ใช้ docs ล่าสุดเพื่อกำหนด route/flow
แต่ให้ใช้รูปเพื่อกำหนด layout, spacing, visual style และลำดับ content
```

---

## 3. Route และรูปอ้างอิง

| ลำดับ | รูป UI | Route / UI Target | หมายเหตุ |
|---:|---|---|---|
| 01 | `01-platform-admin-login.png` | `/login` | Auth entry สำหรับ Platform Admin / Business Admin |
| 02 | `02-platform-admin-dashboard.png` | `/platform-admin`, `/platform-admin/dashboard` | Dashboard overview |
| 03 | `03-businesses-list.png` | `/platform-admin/businesses` | Business table + filters |
| 04 | `04-business-detail.png` | `/platform-admin/businesses/[businessId]` | Business detail |
| 05 | `05-create-business.png` | `/platform-admin/businesses/create` | Full page form / wizard |
| 06 | `06-edit-business.png` | `/platform-admin/businesses/[businessId]/edit` | Edit form |
| 07 | `07-business-owners-list.png` | `/platform-admin/users?role=owner` | Owner list view |
| 08 | `08-owner-detail.png` | `/platform-admin/users/[userId]` | User/owner detail |
| 09 | `09-plans-management.png` | `/platform-admin/plans` | Plans management |
| 10 | `10-assign-plan.png` | Action modal / detail panel | Assign plan ให้ business |
| 11 | `11-add-ons-management.png` | `/platform-admin/add-ons` | Add-ons management |
| 12 | `12-contact-requests-list.png` | `/platform-admin/contact-requests` | Contact request table |
| 13 | `13-contact-request-detail.png` | `/platform-admin/contact-requests/[requestId]` | Detail page/drawer |
| 14 | `14-support-tickets-list.png` | `/platform-admin/support-tickets` | Support ticket table |
| 15 | `15-support-ticket-detail.png` | `/platform-admin/support-tickets/[ticketId]` | Ticket detail |
| 16 | `16-global-modules-catalog.png` | `/platform-admin/add-ons/catalog` | Global modules catalog |
| 17 | `17-master-bank-payment-config.png` | `/platform-admin/payments/settings` | Master bank / payment config |
| 18 | `18-notification-templates.png` | `/platform-admin/system-settings/notification-templates` | Notification templates |
| 19 | `19-platform-settings.png` | `/platform-admin/system-settings` | Platform settings |
| 20 | `20-platform-audit-logs.png` | `/platform-admin/audit-logs` | Audit logs |
| 21 | `21-platform-profile-security.png` | `/platform-admin/profile-security` | Admin profile/security |

หมายเหตุ:

```text
แม้จะมี route /login แต่เว็บไซต์หลักไม่มีปุ่มหรือ link ไป /login
/login เป็น Auth/Admin Entry สำหรับการเข้าผ่าน URL โดยตรง หรือ flow หลังทีม TJ POS setup account ให้แล้ว
```

---

## 4. โครงสร้างไฟล์ที่ควรใช้

ภายใน `frontend/apps/web` ให้แยก Platform Admin ออกจาก public website:

```text
src/app/login/page.tsx
src/app/forgot-password/page.tsx
src/app/reset-password/page.tsx
src/app/platform-admin/layout.tsx
src/app/platform-admin/page.tsx
src/app/platform-admin/dashboard/page.tsx
src/app/platform-admin/businesses/page.tsx
src/app/platform-admin/businesses/create/page.tsx
src/app/platform-admin/businesses/[businessId]/page.tsx
src/app/platform-admin/businesses/[businessId]/edit/page.tsx
src/app/platform-admin/users/page.tsx
src/app/platform-admin/users/[userId]/page.tsx
src/app/platform-admin/plans/page.tsx
src/app/platform-admin/add-ons/page.tsx
src/app/platform-admin/add-ons/catalog/page.tsx
src/app/platform-admin/payments/page.tsx
src/app/platform-admin/payments/settings/page.tsx
src/app/platform-admin/contact-requests/page.tsx
src/app/platform-admin/contact-requests/[requestId]/page.tsx
src/app/platform-admin/support-tickets/page.tsx
src/app/platform-admin/support-tickets/[ticketId]/page.tsx
src/app/platform-admin/system-settings/page.tsx
src/app/platform-admin/system-settings/notification-templates/page.tsx
src/app/platform-admin/audit-logs/page.tsx
src/app/platform-admin/profile-security/page.tsx
```

Feature folder:

```text
src/features/platform-admin/
  components/
  data/
  layouts/
  pages/
  types/
  utils/
```

หลักการ:

```text
Page file ใน app router ควรบาง
UI หลักให้อยู่ใน src/features/platform-admin
Component ใช้ซ้ำให้แยกออก ไม่รวมทุกอย่างไว้ไฟล์เดียว
Mock data แยกไว้ใน data/
Type แยกไว้ใน types/
```

---

## 5. Component ที่ควรทำก่อน

ทำ component พื้นฐานก่อน แล้วค่อยประกอบแต่ละหน้า:

```text
AdminShell
AdminSidebar
AdminTopbar
AdminPageHeader
AdminStatCard
AdminDataTable
AdminFilterBar
AdminStatusBadge
AdminActionMenu
AdminDetailPanel
AdminConfirmDialog
AdminFormSection
AdminEmptyState
AdminLoadingState
```

ใช้ component จาก `@workspace/ui` เฉพาะส่วนที่เป็น dumb component เท่านั้น
logic/page-specific state ให้อยู่ใน `features/platform-admin`

---

## 6. ลำดับการ dev

### Phase 1 — Layout Foundation

```text
สร้าง AdminShell
สร้าง Sidebar / Topbar
สร้าง route group ของ /platform-admin
สร้าง mock session ของ platform admin
ทำ responsive desktop-first
```

ผลลัพธ์:

```text
เข้า /platform-admin แล้วเห็น layout admin ตามรูป
เมนู sidebar active ถูกต้อง
ยังไม่ต่อ API จริง
```

### Phase 2 — Dashboard และ Businesses

```text
Dashboard overview
Businesses list
Business detail
Create business
Edit business
Assign plan modal
```

เหตุผล:

```text
Milestone 1 ต้องให้ Platform Admin สร้าง business ให้ลูกค้าได้ก่อน
```

### Phase 3 — Users / Owners / Plans / Add-ons

```text
Business owners list
Owner detail
Plans management
Add-ons management
Global modules catalog
```

### Phase 4 — Contact / Support / Payments

```text
Contact requests list/detail
Support tickets list/detail
Payments list
Master bank / payment config
```

### Phase 5 — System / Audit / Profile

```text
System settings
Notification templates
Audit logs
Profile & security
```

---

## 7. UI Behavior Rules

ต้องทำตาม `04-ui-interaction-guideline.md`:

```text
Table ต้องมี loading, empty, error state
Filter เปลี่ยนแล้ว loading เฉพาะ table ไม่ทำทั้งหน้าขาว
Action สำคัญต้องมี confirm
Action สำคัญมากต้องมี reason
Action เกี่ยวกับ plan, payment, lock business ต้องเตรียม audit log
Button ที่กดได้ต้องใช้ cursor pointer
```

Action ที่ต้องมี confirm + reason:

```text
Lock business
Change business plan
Disable add-on
Confirm manual payment
Close support ticket
Change system setting สำคัญ
```

---

## 8. FE / BE Boundary

ช่วง dev Platform Admin รอบแรก:

```text
Frontend ทำ UI ด้วย mock data
Frontend ไม่แก้ backend
Frontend ไม่เดา API endpoint เอง
Backend ไม่ต้องแก้ตาม mock UI จนกว่าจะคุย API contract
เมื่อต้องต่อ API จริง ให้ FE/BE ตกลง request/response ก่อน
```

ไฟล์ที่ควรเตรียมไว้สำหรับ mock:

```text
src/features/platform-admin/data/mock-businesses.ts
src/features/platform-admin/data/mock-users.ts
src/features/platform-admin/data/mock-plans.ts
src/features/platform-admin/data/mock-add-ons.ts
src/features/platform-admin/data/mock-contact-requests.ts
src/features/platform-admin/data/mock-support-tickets.ts
src/features/platform-admin/data/mock-payments.ts
src/features/platform-admin/data/mock-audit-logs.ts
```

---

## 9. Definition of Done สำหรับรอบนี้

Platform Admin UI รอบแรกถือว่าเสร็จเมื่อ:

```text
ทุก route ใน Phase 1-5 เปิดได้
Layout ตรงกับรูปอ้างอิงระดับ component และ spacing หลัก
Sidebar active state ถูกต้อง
Table/filter/detail/action state มีครบ
ไม่มี hydration warning จาก code ของเรา
pnpm lint ผ่าน
pnpm typecheck ผ่าน
pnpm build ผ่าน
ยังไม่ต่อ API จริง
docs ถูกอัปเดตหลังเปลี่ยน route หรือ flow
```
