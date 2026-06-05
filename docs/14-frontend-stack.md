# TJ POS — Frontend Stack

**อัปเดตล่าสุด:** 2026-06-05  
**ภาษา:** ไทย  
**วัตถุประสงค์:** ใช้เป็นแหล่งอ้างอิงหลักสำหรับ stack ฝั่ง frontend ใน `frontend`

---

## 1. Package Manager

Frontend ใช้ `pnpm` เท่านั้น

```text
pnpm install
pnpm dev:web
pnpm dev:terminal
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

ไม่ใช้ `npm` หรือ `yarn` ใน frontend

---

## 2. App Framework

| App | Framework | หน้าที่ |
|---|---|---|
| `frontend/apps/web` | Next.js | เว็บไซต์หลัก, Platform Admin, Business Admin, Reports, Settings, Public Menu |
| `frontend/apps/terminal` | Vite React | POS Terminal, Staff Order Mobile, Customer Display, Kitchen / Bar Display |

---

## 3. Styling / UI Foundation

ใช้ stack นี้สำหรับทั้ง `apps/web` และ `apps/terminal`:

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

หมายเหตุ:

```text
ยังไม่สร้าง component UI จริงในขั้น setup
ยังไม่เพิ่ม shadcn component template จนกว่าจะเริ่มทำ UI จริง
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

หลักการ:

```text
ใช้ mock data จนกว่า FE/BE จะตกลง API contract
ยังไม่ต่อ API จริงเอง
ยังไม่สร้าง shared API client จนกว่า backend endpoint จะชัดเจน
```

---

## 6. Routing

```text
apps/web ใช้ routing ของ Next.js
apps/terminal ใช้ react-router-dom
```

---

## 7. Testing

ใช้:

```text
Vitest
Testing Library
Playwright
jsdom
```

---

## 8. ภาษาเว็บไซต์หลัก

ไม่ใช้ i18n กลางทั้งระบบ

```text
Public Website ใน frontend/apps/web รองรับ content เฉพาะ lo / en
ไม่ใช้ i18n กับ Platform Admin
ไม่ใช้ i18n กับ Business Admin
ไม่ใช้ i18n กับ Public Menu ของร้าน
ไม่ใช้ i18n กับ apps/terminal
```

ใช้ package ภายใน workspace:

```text
frontend/packages/i18n
```

ขอบเขตของ package นี้คือช่วยจัดการ dictionary สำหรับ Public Website เท่านั้น
ไม่ถือเป็น i18n กลางของ Platform Admin หรือ Business Admin

---

## 9. ขอบเขตที่ยังไม่ทำในขั้น setup

```text
ยังไม่สร้าง UI component
ยังไม่สร้าง page layout
ยังไม่ต่อ API จริง
ยังไม่เพิ่ม business flow
ยังไม่เพิ่มข้อมูลจริง
```
