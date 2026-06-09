# TJ POS — Frontend Vite Migration Plan

**อัปเดตล่าสุด:** 2026-06-07
**ภาษา:** ไทย
**สถานะ:** Approved direction / migration in progress
**วัตถุประสงค์:** ใช้เป็นแผนย้าย frontend ไปสู่โครงสร้างที่ Next.js ใช้เฉพาะเว็บหลัก ส่วน app อื่นทั้งหมดใช้ Vite React

---

## 1. ข้อสรุปหลัก

```text
Next.js ใช้เฉพาะ:
- frontend/apps/web

Vite React ใช้กับ admin app และ app ฝั่งลูกค้าทั้งหมด:
- frontend/apps/platform-admin
- frontend/apps/business-admin
- frontend/apps/terminal
- frontend/apps/staff-order
- frontend/apps/kitchen-display
- frontend/apps/customer-display
- frontend/apps/public-menu
```

เหตุผล:

```text
app ฝั่งลูกค้าต้องการความเร็ว, offline/PWA, kiosk/mobile experience และ refresh route แบบ SPA
ไม่ต้องใช้ SSR เป็นหลัก
Public Menu ใช้สำหรับลูกค้าสแกน QR เพื่อดูเมนู ไม่ได้เน้น SEO เหมือนเว็บไซต์หลัก
```

---

## 2. โครงสร้างเป้าหมาย

```text
frontend/
├─ apps/
│  ├─ web/                 # Next.js - เว็บไซต์หลัก TJ POS
│  ├─ platform-admin/      # Vite React - Platform Admin
│  ├─ business-admin/      # Vite React - Business Admin ของร้าน
│  ├─ terminal/            # Vite React - POS Terminal
│  ├─ staff-order/         # Vite React - Staff Order Mobile
│  ├─ kitchen-display/     # Vite React - Kitchen / Bar Display
│  ├─ customer-display/    # Vite React - Customer Display
│  └─ public-menu/         # Vite React - QR Menu / Public Menu
│
├─ packages/
│  ├─ ui/
│  ├─ shared/
│  ├─ i18n/
│  └─ config/
│
├─ pnpm-workspace.yaml
├─ package.json
└─ turbo.json
```

---

## 3. App Ownership

| App                              | Framework  | หน้าที่                                      |
| -------------------------------- | ---------- | -------------------------------------------- |
| `frontend/apps/web`              | Next.js    | เว็บไซต์หลัก, hash sections, content lo/en   |
| `frontend/apps/platform-admin`   | Vite React | Admin ของทีม TJ Solution                     |
| `frontend/apps/business-admin`   | Vite React | Owner / Manager จัดการร้าน                   |
| `frontend/apps/terminal`         | Vite React | POS Terminal                                 |
| `frontend/apps/staff-order`      | Vite React | Staff Order Mobile                           |
| `frontend/apps/kitchen-display`  | Vite React | Kitchen / Bar Display                        |
| `frontend/apps/customer-display` | Vite React | Customer Display                             |
| `frontend/apps/public-menu`      | Vite React | Public Menu / QR Menu สำหรับลูกค้าสแกนดูเมนู |

---

## 4. Route Ownership เป้าหมาย

| Route                             | App                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------- |
| `/`                               | `frontend/apps/web`                                                             |
| `/#home`                          | `frontend/apps/web`                                                             |
| `/#pos-types`                     | `frontend/apps/web`                                                             |
| `/#features`                      | `frontend/apps/web`                                                             |
| `/#pricing`                       | `frontend/apps/web`                                                             |
| `/#add-ons`                       | `frontend/apps/web`                                                             |
| `/#faq-help`                      | `frontend/apps/web`                                                             |
| `/#contact`                       | `frontend/apps/web`                                                             |
| `/login`                          | `frontend/apps/platform-admin` ใน phase แรก หรือ auth entry กลางตาม deploy จริง |
| `/forgot-password`                | `frontend/apps/platform-admin` ใน phase แรก หรือ auth entry กลางตาม deploy จริง |
| `/reset-password`                 | `frontend/apps/platform-admin` ใน phase แรก หรือ auth entry กลางตาม deploy จริง |
| `/platform-admin/*`               | `frontend/apps/platform-admin`                                                  |
| `/business-admin/:businessSlug/*` | `frontend/apps/business-admin`                                                  |
| `/terminal/b/:businessSlug/pos/*` | `frontend/apps/terminal`                                                        |
| `/staff-order/b/:businessSlug/*`  | `frontend/apps/staff-order`                                                     |
| `/kitchen/b/:businessSlug/*`      | `frontend/apps/kitchen-display`                                                 |
| `/display/b/:businessSlug/*`      | `frontend/apps/customer-display`                                                |
| `/b/:businessSlug/*`              | `frontend/apps/public-menu`                                                     |
| `/q/:qrCode`                      | `frontend/apps/public-menu`                                                     |

หมายเหตุ:

```text
Route ใน docs หลักอาจยังใช้รูปแบบ [businessSlug] ตาม Next.js เพื่ออธิบาย dynamic segment
เมื่ออยู่ใน Vite / React Router ให้ใช้ :businessSlug
ความหมายเหมือนกัน แต่ syntax ของ framework ต่างกัน
```

---

## 5. ลำดับ Migration

### Phase 1 — Docs / Source of Truth

```text
อัปเดต docs ให้ระบุว่า Next.js เหลือเฉพาะ web
ระบุว่า admin app และ app ฝั่งลูกค้าทั้งหมดเป็น Vite React
ยังไม่ย้ายไฟล์ UI ขนาดใหญ่ใน phase นี้
```

### Phase 2 — แยก Platform Admin

```text
สร้าง frontend/apps/platform-admin
ย้าย route และ feature platform-admin จาก frontend/apps/web
เปลี่ยน Platform Admin จาก Next.js App Router เป็น Vite React + React Router
สถานะปัจจุบัน: เสร็จแล้ว
```

### Phase 3 — Business Admin Vite

```text
สร้าง frontend/apps/business-admin
ย้าย Business Admin UI จาก frontend/apps/web
เปลี่ยน next/link, next/navigation, next/image ไปใช้ react-router-dom และ browser primitives
ใช้ route /business-admin/:businessSlug/*
สถานะปัจจุบัน: เสร็จแล้ว
```

### Phase 4 — Public Menu Vite

```text
สร้าง frontend/apps/public-menu
ใช้ route /b/:businessSlug/*
ใช้ route /q/:qrCode
ใช้สำหรับลูกค้าสแกน QR ดูเมนูและข้อมูลร้าน
ไม่ต้องใช้ i18n กลางของเว็บหลัก
static UI text ให้เขียนเป็นภาษาลาวตรงใน component/config
ไม่ใช้ English key แล้ว map ผ่าน i18n/helper
ย้าย Public Menu / QR Menu ออกจาก frontend/apps/web
สถานะปัจจุบัน: เสร็จแล้ว
```

### Phase 5 — แยก customer apps

```text
ถ้าต้องการแยก deploy ชัดเจน ให้แยก staff-order, kitchen-display, customer-display ออกจาก terminal
ถ้ายังต้องการ dev เร็ว สามารถคงอยู่ใน terminal ชั่วคราวได้ แต่ route ownership ใน docs ให้ถือเป็นเป้าหมายใหม่
static UI text ของ staff-order, kitchen-display และ customer-display ต้องเป็นภาษาลาวตรงใน component/config
ไม่ใช้ i18n หรือ label map สำหรับ static UI
สถานะปัจจุบัน: staff-order, kitchen-display และ customer-display แยกเสร็จแล้ว
```

---

## 6. Env Naming

```text
Next.js app:
NEXT_PUBLIC_API_BASE_URL=

Vite apps:
VITE_API_BASE_URL=
```

ห้ามใช้ env name ข้าม framework ถ้าไม่มีเหตุผลจำเป็น

---

## 7. Verification

ทุก phase ต้องเช็ก:

```text
pnpm typecheck
pnpm build
pnpm --filter <app-name> dev
refresh browser ที่ deep route ของ Vite แล้วต้องไม่ 404
```

สำหรับ Vite app ต้องตั้งค่า deploy fallback ให้ทุก route กลับไป `index.html`
