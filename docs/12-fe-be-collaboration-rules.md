# TJ POS — กฎการแบ่งงาน Frontend / Backend

**อัปเดตล่าสุด:** 2026-06-05  
**ภาษา:** ไทย  
**วัตถุประสงค์:** ใช้เป็นกฎสำคัญสำหรับทีมที่แยกคนทำ frontend และ backend เพื่อไม่ให้แก้ไฟล์ทับกัน, ไม่ให้ scope ปนกัน, และลดปัญหาเวลาต่อระบบจริง

---

## 1. หลักการหลัก

TJ POS แยกงานพัฒนาออกเป็น 2 ฝั่งชัดเจน:

```text
Frontend → ทำงานใน folder frontend
Backend → ทำงานใน folder backend
```

หลักสำคัญ:

```text
คนทำ frontend ไม่แก้ backend
คนทำ backend ไม่แก้ frontend
ถ้าต้องเชื่อมต่อกันจริง ต้องคุยและตกลง API contract ก่อน
```

---

## 2. ขอบเขตของ Frontend

คนทำ frontend ทำได้ใน:

```text
frontend/
frontend/apps/web
frontend/apps/terminal
docs/designs
docs
```

งาน frontend รวมถึง:

```text
หน้าเว็บ
layout
component
form
table
POS terminal UI
state management
mock data
API client แบบอิง contract
loading / empty / error state
validation ฝั่ง browser
```

คนทำ frontend ไม่ควรแก้:

```text
backend source code
database schema
migration
backend env
auth guard
permission guard
server config
worker
queue
```

---

## 3. ขอบเขตของ Backend

คนทำ backend ทำได้ใน:

```text
backend/
backend/src
backend/docs
```

งาน backend รวมถึง:

```text
API controller
service
database schema
migration
Drizzle query
raw SQL report
auth
permission
business context
validation ฝั่ง server
worker
queue
cache
lock
file upload
```

คนทำ backend ไม่ควรแก้:

```text
frontend page
frontend component
frontend route UI
frontend CSS
frontend design files
frontend mock screen
terminal UI interaction
```

---

## 4. การใช้ docs ร่วมกัน

ทั้ง frontend และ backend อ่านเอกสารจาก:

```text
docs/
```

แต่การแก้เอกสารกลางควรระวัง เพราะกระทบทั้งสองฝั่ง

กฎ:

```text
ถ้าแก้ docs ที่เป็นแหล่งอ้างอิงหลัก ต้องแจ้งอีกฝั่ง
ถ้าแก้ API spec ต้องแจ้งทั้ง frontend และ backend
ถ้าแก้ database/domain schema ต้องแจ้ง backend ก่อน และแจ้ง frontend ถ้า response เปลี่ยน
ถ้าแก้ route/frontend flow ต้องแจ้ง frontend ก่อน และแจ้ง backend ถ้ามี API ใหม่
```

---

## 5. กฎ Package Manager

Frontend ใช้ package manager เดียว:

```text
pnpm
```

กฎสำหรับคนทำ frontend:

```text
ใช้ pnpm install
ใช้ pnpm dev
ใช้ pnpm build
ใช้ pnpm lint
ใช้ pnpm typecheck
ห้ามใช้ npm install
ห้ามใช้ yarn install
ห้าม commit package-lock.json หรือ yarn.lock ใน frontend
```

ไฟล์ที่ควรมีใน frontend:

```text
frontend/package.json
frontend/pnpm-workspace.yaml
frontend/pnpm-lock.yaml
```

ถ้าเครื่องยังไม่มี pnpm:

```text
ให้ติดตั้ง pnpm ก่อนเริ่ม setup frontend
```

---

## 6. API Contract ก่อนเชื่อมต่อจริง

ก่อน frontend เรียก backend จริง ต้องตกลง API contract ก่อน

ต้องระบุให้ครบ:

```text
endpoint
method
permission
query params
request body
response type
response example
error code
business rule
pagination ถ้ามี
```

ให้ยึดรูปแบบจาก:

```text
09-api-specification.md
```

ถ้ายังไม่ตกลง API contract:

```text
frontend ใช้ mock data ไปก่อน
backend ทำ API ตาม spec ไปก่อน
ห้าม frontend เดา response เองเพื่อผูกกับ backend จริง
ห้าม backend เปลี่ยน response โดยไม่แจ้ง frontend
```

---

## 7. Mock ก่อน ต่อจริงทีหลัง

ช่วงที่ยังไม่พร้อมต่อ API จริง:

```text
frontend ใช้ mock data / fixture / mock service
backend ใช้ Swagger / API response example / test request
```

เมื่อจะต่อจริง ต้องคุยกันก่อนว่า:

```text
base URL คืออะไร
auth token ส่งอย่างไร
businessId / branchId มาจากไหน
response success/error หน้าตาอย่างไร
pagination ใช้อย่างไร
loading/error state ใน frontend ต้องรองรับอะไร
```

---

## 8. ห้ามแก้ข้ามฝั่งโดยไม่ตกลง

ตัวอย่างที่ห้ามทำ:

```text
frontend แก้ backend schema เพื่อให้ UI ใช้ง่ายขึ้นเอง
frontend แก้ API response เอง
backend แก้ frontend component เพื่อทดสอบ API เอง
backend เปลี่ยน route frontend เอง
backend เปลี่ยน field name ที่ frontend ใช้อยู่โดยไม่แจ้ง
frontend hardcode field ที่ยังไม่มีใน API contract
```

ถ้าจำเป็นต้องแก้ข้ามฝั่ง:

```text
1. แจ้งอีกฝั่งก่อน
2. ระบุเหตุผล
3. ตกลงไฟล์ที่จะกระทบ
4. ตกลง API/schema/route ที่เปลี่ยน
5. ค่อยแก้หลังจากตกลงแล้ว
```

---

## 9. กฎเรื่อง Shared Types

ช่วงเริ่มต้นยังไม่ควรสร้าง shared package ถ้ายังไม่จำเป็น

แนวทาง:

```text
backend เป็นเจ้าของ schema จริง
frontend อ้างอิง type จาก API contract
ถ้าต้องใช้ shared type จริง ต้องตกลงโครงสร้างร่วมกันก่อน
```

ห้ามทำ:

```text
frontend สร้าง shared type แล้วบังคับ backend ตามเอง
backend สร้าง shared type ที่ทำให้ frontend ต้อง refactor โดยไม่แจ้ง
```

---

## 10. Branch / Commit / Task Naming

แนะนำให้แยกงานชัดเจน:

```text
fe/...
be/...
docs/...
```

ตัวอย่าง:

```text
fe/business-dashboard
fe/pos-cart
be/auth-login
be/items-api
docs/api-contract-orders
```

Commit ควรสื่อว่าแก้ฝั่งไหน:

```text
frontend: add POS cart layout
backend: add items list API
docs: update orders API contract
```

---

## 11. Definition of Ready ก่อนต่อ FE/BE

ก่อน frontend และ backend ต่อระบบจริง ต้องพร้อมอย่างน้อย:

```text
API endpoint ถูกตกลงแล้ว
request/response example มีแล้ว
error format มีแล้ว
permission rule มีแล้ว
mock data ใน frontend ตรงกับ response จริง
backend มี Swagger หรือ test request
frontend มี loading/error/empty state
```

ถ้ายังไม่ครบ:

```text
ยังไม่ควรต่อจริง
ให้ทำแยกฝั่งต่อไปก่อน
```

---

## 12. Definition of Done เมื่อต่อจริง

เมื่อต่อ frontend กับ backend จริงแล้ว ต้องตรวจ:

```text
login/auth ทำงาน
token หมดอายุแล้ว frontend รับมือได้
permission ไม่พอแล้วแสดง error ถูกต้อง
validation error แสดงใน form ถูกต้อง
pagination ทำงาน
loading state ไม่ค้าง
error state มี retry ถ้าจำเป็น
backend ไม่ส่งข้อมูลข้าม business
frontend ไม่ hardcode business/branch โดยไม่จำเป็น
```

---

## 13. ข้อสรุปสุดท้าย

```text
Frontend ทำใน frontend
Backend ทำใน backend
Frontend ใช้ pnpm เท่านั้น
Docs กลางใช้ร่วมกัน แต่ถ้าแก้แหล่งอ้างอิงหลักต้องแจ้งอีกฝั่ง
ต่อ API จริงเมื่อคุยและตกลง contract แล้วเท่านั้น
ถ้ายังไม่ตกลง ให้ใช้ mock และทำแยกฝั่งไปก่อน
```
