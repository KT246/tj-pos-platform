# TJ POS — Frontend Stack

**อัปเดตล่าสุด:** 2026-06-07
**ภาษา:** ไทย  
**วัตถุประสงค์:** ใช้เป็นแหล่งอ้างอิงหลักสำหรับ stack ฝั่ง frontend ใน `frontend`

---

## 1. Package Manager

Frontend ใช้ `pnpm` เท่านั้น

```text
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

ไม่ใช้ `npm` หรือ `yarn` ใน frontend

หมายเหตุ:

```text
script dev:* ของ app ใหม่จะเพิ่มเมื่อ app นั้นถูกสร้างจริง
ห้ามเพิ่ม script ที่ชี้ไป package ที่ยังไม่มี เพราะจะทำให้คำสั่ง fail
```

---

## 2. App Framework

| App | Framework | หน้าที่ |
|---|---|---|
| `frontend/apps/web` | Next.js | เว็บไซต์หลัก TJ POS, landing, pricing, contact, content lo/en |
| `frontend/apps/platform-admin` | Next.js | Platform Admin ของทีม TJ Solution |
| `frontend/apps/business-admin` | Vite React | Business Admin / Owner / Manager ของร้าน |
| `frontend/apps/terminal` | Vite React | POS Terminal |
| `frontend/apps/staff-order` | Vite React | Staff Order Mobile |
| `frontend/apps/kitchen-display` | Vite React | Kitchen / Bar Display |
| `frontend/apps/customer-display` | Vite React | Customer Display |
| `frontend/apps/public-menu` | Vite React | Public Menu / QR Menu สำหรับลูกค้าสแกนดูเมนู |

หลักการ:

```text
Next.js ใช้เฉพาะ app ที่ต้องการ website/admin shell และ route metadata ชัดเจน
Vite React ใช้กับ app ฝั่งลูกค้าที่เน้นความเร็ว, offline/PWA, kiosk/mobile และ SPA interaction
```

---

## 3. Styling / UI Foundation

ใช้ stack นี้ร่วมกันผ่าน workspace packages:

```text
Tailwind CSS
Radix UI primitives
lucide-react
class-variance-authority
clsx
tailwind-merge
sonner
date-fns
```

ใช้ font หลัก:

```text
Primary UI font: Inter
Lao fallback font: Noto Sans Lao
```

---

## 4. Form / Validation

ใช้:

```text
react-hook-form
@hookform/resolvers
zod
```

หลักการ:

```text
Frontend ใช้ Zod สำหรับ validation ฝั่ง browser
Backend ต้อง validate ซ้ำเสมอ
Frontend ไม่แก้ schema backend เอง
```

---

## 5. Data Fetching / State

ใช้:

```text
@tanstack/react-query
zustand
@tanstack/react-table
```

หลักการ state:

```text
local UI state -> อยู่ใน component/feature
state ใช้หลาย page ใน app เดียว -> app-level store
state ใช้ร่วมหลาย app -> frontend/packages/shared/src/stores
ไม่ใช่ทุก state ต้องลง localStorage
```

หลักการ data:

```text
ใช้ mock data จนกว่า FE/BE จะตกลง API contract
ยังไม่ต่อ API จริงเองถ้า contract ยังไม่ชัด
shared API client อยู่ใน packages/shared เมื่อ backend endpoint ชัดเจนแล้ว
```

---

## 6. Routing

```text
apps/web ใช้ Next.js App Router
apps/platform-admin ใช้ Next.js App Router
Vite apps ใช้ react-router-dom
```

Dynamic route syntax:

```text
Next.js: /business-admin/[businessSlug]
Vite / React Router: /business-admin/:businessSlug
```

ความหมายเหมือนกัน ต่างกันที่ syntax ของ framework

---

## 7. Testing

ใช้:

```text
Vitest
Testing Library
Playwright
jsdom
```

ทุก app ต้องมี:

```text
typecheck
build
dev smoke test
deep route refresh test สำหรับ Vite app
```

---

## 8. ภาษา

ไม่ใช้ i18n กลางทั้งระบบ

```text
Public Website ใน frontend/apps/web รองรับ content เฉพาะ lo / en
ไม่ใช้ i18n กับ Platform Admin
ไม่ใช้ i18n กับ Business Admin
ไม่ใช้ i18n กับ Public Menu ของร้าน
ไม่ใช้ i18n กับ POS/customer apps
```

ใช้ package ภายใน workspace:

```text
frontend/packages/i18n
```

ขอบเขตของ package นี้คือช่วยจัดการ dictionary สำหรับ Public Website เท่านั้น
ไม่ถือเป็น i18n กลางของ Platform Admin หรือ Business Admin

---

## 9. Env Naming

Next.js apps:

```text
NEXT_PUBLIC_API_BASE_URL=
```

Vite apps:

```text
VITE_API_BASE_URL=
```

ห้ามใช้ env name ข้าม framework ถ้าไม่มีเหตุผลจำเป็น

---

## 10. Migration Note

ทิศทางใหม่ให้ยึด `16-frontend-vite-migration-plan.md`

```text
web และ platform-admin = Next.js
business-admin, terminal, staff-order, kitchen-display, customer-display, public-menu = Vite React
```
