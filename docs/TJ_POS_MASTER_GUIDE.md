# TJ POS — Master Project & UI Prompt Guide

**Version:** 1.0
**Last updated:** 2026-06-05
**Purpose:** This file consolidates the decisions already agreed for the TJ POS platform so another AI, designer, or developer can continue the work consistently without needing the full chat history.

---

## 1. Project Context

**TJ POS** is a modular SaaS point-of-sale platform for Laos. It supports multiple business types:

- Retail
- Cafe
- Restaurant
- Beauty / appointment-based businesses
- Hospitality / hotel-room businesses

The goal is to design and build a complete POS platform with a clear visual system, consistent UI flow, and separate Frontend / Backend work tracking.

The current UI design workflow is:

1. Create AI mockups for each UI screen.
2. Review whether the mockup matches the approved group style.
3. Mark the screen as done in Google Sheet only after visual approval.
4. Use the approved mockups to guide frontend implementation.

---

## 2. Repository Structure

The agreed project structure is a single parent folder with frontend and backend separated:

```text
tj-pos-platform/
├── frontend/
└── backend/
```

### Rules

- Frontend and backend can be developed separately.
- Frontend should not directly depend on backend implementation details.
- Backend should expose stable API contracts for frontend.
- Shared naming should be kept consistent with the UI screen names in the Google Sheet.
- UI screen names should remain in English for easier routing, component naming, and AI prompting.
- ใช้ `frontend/apps/web` สำหรับเว็บไซต์หลักของ TJ POS เท่านั้น
- ใช้ `frontend/apps/platform-admin` สำหรับ Platform Admin ของทีม TJ Solution
- ใช้ `frontend/apps/business-admin` สำหรับ Business Workspace / Business Admin ของร้าน
- ใช้ `frontend/apps/terminal` สำหรับ POS Terminal
- ใช้ `frontend/apps/staff-order` สำหรับ Staff Order Mobile
- ใช้ `frontend/apps/kitchen-display` สำหรับ Kitchen / Bar Display
- ใช้ `frontend/apps/customer-display` สำหรับ Customer Display
- ใช้ `frontend/apps/public-menu` สำหรับ Public Menu / QR Menu ให้ลูกค้าสแกนดูเมนู
- ใช้ `backend` เป็น backend API กลางที่ทุกเว็บ/แอปใช้งานร่วมกัน

Example frontend naming:

```text
BusinessDashboardPage
ItemsListPage
ItemFormPage
POSMainTerminal
CheckoutCashModal
KitchenDashboard
RoomCalendar
```

---

## 3. Google Sheet Structure

The main tracking file is the Google Sheet:

```text
TJ POS Development Task Tracker Lao
```

Current key tabs:

```text
Summary
Frontend
Backend
UI Prompts 136
Lists
All Tasks Old
```

### Tab Purposes

| Tab              | Purpose                                                              |
| ---------------- | -------------------------------------------------------------------- |
| `Summary`        | Overall progress summary for Frontend, Backend, and UI prompts       |
| `Frontend`       | Development tasks for the frontend developer                         |
| `Backend`        | Development tasks for the backend developer                          |
| `UI Prompts 136` | Main screen list, descriptions, AI prompts, and UI completion status |
| `Lists`          | Dropdown source lists and helper values                              |
| `All Tasks Old`  | Legacy/backup tasks, not the main working tab                        |

### Language Rules in Sheet

| Field                              | Language               |
| ---------------------------------- | ---------------------- |
| Screen name / `ຊື່ໜ້າຈໍ`           | English                |
| Description / `ຄຳອະທິບາຍ`          | Lao                    |
| Status / `ສະຖານະ`                  | Lao                    |
| AI Prompt                          | English                |
| UI labels inside generated mockups | English                |
| Sample business data               | Realistic Laos context |

### Font Rule

Use:

```css
font-family: Inter, "Noto Sans Lao", sans-serif;
```

For Google Sheet formatting, use **Noto Sans Lao** where possible.

---

## 4. Status Rules

### UI Prompt Status

For `UI Prompts 136`, use only:

```text
ຍັງບໍ່ແລ້ວ = Not done / not approved
ແລ້ວ = Done / approved / locked
```

### Development Task Status

For Frontend / Backend tasks, use three-step status tracking:

```text
ຍັງບໍ່ເຮັດ = Not started
ກຳລັງເຮັດ = In progress
ແລ້ວ = Done
```

### Locked Prompt Rule

Once a UI screen status is:

```text
ແລ້ວ
```

that prompt is considered **approved and locked**.

Do not update the entire Prompt column again. Only edit the prompt for the current screen or for screens that are still not approved.

---

## 5. Global Design System

TJ POS uses a clean light B2B SaaS style.

### Visual Style

- White and light gray surfaces
- Soft light-blue background areas
- Primary blue actions
- Teal / green success accents
- Amber warning accents
- Red destructive actions
- Rounded cards and buttons
- Clear spacing rhythm
- Clean SaaS dashboard tables
- Status badges
- Search/filter bars
- Right-side summary cards where useful
- Pagination for table screens
- No watermark

### Typography

Frontend should use:

```css
Inter, "Noto Sans Lao", sans-serif
```

### AI Mockup Text Rule

Generated UI mockups should use realistic **English UI labels** even if the Sheet description is Lao.

---

## 6. Core AI Prompt Rules

Every AI prompt should be standalone and understandable even if copied into another AI tool.

Each prompt should include:

1. Screen name
2. Project context
3. Group name
4. Group style
5. Approved anchor reference
6. Layout/navigation rules
7. Relationship rule to parent/list/detail screen
8. Screen objective
9. Required content sections
10. Realistic sample data
11. No watermark

### Universal Prompt Requirements

```text
Use realistic English UI labels and realistic sample data from Laos.
Keep brand, colors, spacing, cards, buttons, sidebar/topbar rules consistent with the related approved screens.
No watermark.
```

### Do Not Do

```text
Do not redesign the brand.
Do not change the logo treatment.
Do not use the wrong group layout.
Do not mix Platform Admin sidebar with Business Admin sidebar.
Do not add website footer in admin/app pages.
Do not use random profile names after a group profile name is approved.
Do not shorten sidebar labels when exact labels are specified.
```

---

## 7. UI Groups Overview

There are **136 UI screens** divided into **13 groups**.

| Group                 |      UI Range | Status / Notes                                                  |
| --------------------- | ------------: | --------------------------------------------------------------- |
| Web chính             | UI-001–UI-007 | Approved style group; ไม่มี Gallery และไม่มี Request Demo route |
| Platform Admin        | UI-010–UI-030 | Approved / locked                                               |
| Business Admin Core   | UI-031–UI-062 | UI-031 is approved anchor; group in progress                    |
| POS Terminal          | UI-063–UI-079 | Not yet locked as a group                                       |
| Staff Order Mobile    | UI-080–UI-087 | Pending                                                         |
| Customer Display      | UI-088–UI-091 | Pending                                                         |
| Kitchen / Bar Display | UI-092–UI-097 | Pending                                                         |
| Public Menu / QR Menu | UI-098–UI-103 | Pending                                                         |
| Retail-specific       | UI-104–UI-108 | Pending                                                         |
| Cafe-specific         | UI-109–UI-114 | Implemented / pending review                                    |
| Restaurant-specific   | UI-115–UI-121 | Source image added / in implementation                          |
| Beauty-specific       | UI-122–UI-129 | Pending                                                         |
| Hospitality-specific  | UI-130–UI-136 | Pending                                                         |

---

## 8. Group Style Rules

## 8.1 Web Chính

### Approved Anchor Screens

```text
UI-001 TJ POS Home
UI-002 POS Types
UI-003 Features
UI-004 Pricing
UI-005 Add-ons
```

The remaining Web screens must visually match the same marketing site style.

### Web Navbar

```text
Logo TJ POS
Home
POS Types
Features
Pricing
Add-ons
FAQ/Help
Contact
```

กฎ route สำคัญ:

```text
เว็บไซต์หลักใช้เฉพาะ `/` พร้อม hash section เช่น `/#pricing` และ `/#contact`
ไม่สร้าง route แยก `/request-demo`
ไม่แสดง `/login` เป็นเมนูของเว็บไซต์หลัก
`/login` เป็น Auth/Admin Entry เท่านั้น
```

### Web Style Rules

- Marketing website layout
- Top navbar only
- No admin sidebar
- Hero section
- Content sections
- CTA block
- Light footer
- Same logo treatment, spacing, cards, buttons, and color palette

### Web Screens

```text
UI-001 TJ POS Home
UI-002 POS Types
UI-003 Features
UI-004 Pricing
UI-005 Add-ons
UI-006 FAQ / Help
UI-007 Contact Us
```

---

## 8.2 Platform Admin

### Status

Platform Admin screens are considered approved/locked:

```text
UI-010 to UI-030 = ແລ້ວ
```

### Platform Admin Shell

- Full TJ POS wordmark top-left
- Fixed left sidebar
- Topbar search
- Notification bell
- `+ Create Business` button
- Profile name: `Somchai Phommasenh`
- Profile role: `Platform Admin`
- White/light-blue admin surfaces
- KPI cards
- Filters
- Tables
- Forms
- Pagination
- Right summary cards
- No website footer
- Only the left sidebar help card is allowed at the bottom

### Platform Admin Sidebar Labels

Use exact labels:

```text
Dashboard
Businesses
Business Owners / Users
Plans
Subscriptions
Add-ons
Subscription Payments
Contact Requests
Support Tickets
Global Modules
Master Payment Config
Notification Templates
Audit Logs
Platform Settings
```

### Platform Admin Screens

```text
UI-010 Platform Admin Login
UI-011 Platform Admin Dashboard
UI-012 Businesses List
UI-013 Business Detail
UI-014 Create Business
UI-015 Edit Business
UI-016 Business Owners List
UI-017 Owner Detail
UI-018 Plans Management
UI-019 Assign Plan
UI-020 Add-ons Management
UI-021 Contact Requests List
UI-022 Contact Request Detail
UI-023 Support Tickets List
UI-024 Support Ticket Detail
UI-025 Global Modules Catalog
UI-026 Platform Settings
UI-027 Master Bank / Payment Config
UI-028 Notification Templates
UI-029 Platform Audit Logs
UI-030 Platform Profile & Security
```

### Platform Admin Relationship Rules

| Screen                      | Parent / Relationship                           |
| --------------------------- | ----------------------------------------------- |
| Business Detail             | Opens from Businesses List                      |
| Create Business             | Created from Businesses module                  |
| Edit Business               | Opens from Business Detail                      |
| Owner Detail                | Opens from Business Owners List                 |
| Assign Plan                 | Related to Plans Management and Business Detail |
| Contact Request Detail      | Opens from Contact Requests List                |
| Support Ticket Detail       | Opens from Support Tickets List                 |
| Master Payment Config       | Platform-level config table screen              |
| Notification Templates      | Platform-level template/config screen           |
| Platform Audit Logs         | Audit table + detail drawer                     |
| Platform Profile & Security | Profile/security settings for platform admin    |

---

## 8.3 Business Admin Core

### Approved Anchor

```text
UI-031 Business Dashboard
```

This screen is the approved anchor for all Business Admin Core screens.

Business Admin Core คือ workspace ที่แต่ละร้าน/ธุรกิจใช้แก้ไขข้อมูลการทำงานของตัวเองตาม role, permission, plan limit, POS Type และ enabled modules

ร้านสามารถจัดการข้อมูลเหล่านี้ได้:

- ข้อมูลร้าน, logo, สี, branding และ receipt settings
- สาขาและ POS devices
- พนักงาน, role และ permission
- สินค้า, เมนู, บริการ, ห้อง, category, variant และ option
- Inventory, stock movements, stock in, stock adjustment, suppliers และ purchase receipts
- Customers, loyalty, promotions และ coupons
- Payment methods, bank / QR payment info, receipt / bill template
- Modules, import / export, reports, support, audit logs และ settings

### Business Admin Route Rule

```text
/business-admin/[businessSlug]
/business-admin/[businessSlug]/dashboard
/business-admin/[businessSlug]/items
/business-admin/[businessSlug]/settings
```

กฎสำคัญ:

```text
Business Admin Core เป็น route หลัง login สำหรับ owner / manager / staff ตามสิทธิ์
ห้ามใช้ `/b/[businessSlug]` เป็น admin route
`/b/[businessSlug]` เป็น public route ของร้านสำหรับลูกค้าและ QR menu เท่านั้น
```

### Business Admin Shell

- TJ POS wordmark top-left
- Fixed left sidebar
- Business switcher
- Branch selector
- `Open POS` button
- Search placeholder:

```text
Search items, orders, customers...
```

- Notification bell
- Business owner profile
- White/light-blue admin surfaces
- Rounded cards
- Tables
- Filters
- Forms
- Pagination
- Right summary cards
- Quick actions
- No Platform Admin sidebar labels
- No website footer

### Business Admin Sidebar Labels

Use exact labels:

```text
Dashboard
POS
Orders
Items
Categories
Inventory
Stock Movements
Suppliers
Customers
Loyalty
Promotions
Staff
Roles & Permissions
Branches
Reports
Receipt/Bill
Branding
Payment Methods
Devices
Modules
Import/Export
Support
Audit Logs
Settings
```

### Business Admin Core Screens

```text
UI-031 Business Dashboard
UI-032 Business Profile
UI-033 Branches List
UI-034 Branch Form
UI-035 Staff List
UI-036 Staff Form / Detail
UI-037 Roles & Permissions
UI-038 Categories List
UI-039 Items List
UI-040 Item Form
UI-041 Item Variants / Options
UI-042 Inventory Overview
UI-043 Stock Movements
UI-044 Stock In
UI-045 Stock Adjustment
UI-046 Suppliers List
UI-047 Supplier Form
UI-048 Purchase Receipts List
UI-049 Purchase Receipt Detail / Form
UI-050 Customers List
UI-051 Customer Detail
UI-052 Loyalty Settings
UI-053 Promotions List
UI-054 Promotion Form
UI-055 Coupons List
UI-056 Payment Methods
UI-057 Receipt / Bill Settings
UI-058 Branding / Theme
UI-059 Device Management
UI-060 Module Settings
UI-061 Import Center
UI-062 Export Center
```

### Business Admin Relationship Rules

| Screen                         | Parent / Relationship                               |
| ------------------------------ | --------------------------------------------------- |
| Business Profile               | Related to Business Dashboard / Settings / Branding |
| Branches List                  | Business Dashboard → Branches                       |
| Branch Form                    | Opens from Branches List                            |
| Staff List                     | Business Dashboard → Staff                          |
| Staff Form / Detail            | Opens from Staff List                               |
| Roles & Permissions            | Related to Staff List                               |
| Categories List                | Related to Items / menu structure                   |
| Items List                     | Business Dashboard → Items                          |
| Item Form                      | Opens from Items List                               |
| Item Variants / Options        | Opens from Item Form                                |
| Inventory Overview             | Business Dashboard → Inventory                      |
| Stock Movements                | Opens from Inventory Overview                       |
| Stock In                       | Opens from Stock Movements                          |
| Stock Adjustment               | Opens from Stock Movements                          |
| Suppliers List                 | Related to Inventory Overview                       |
| Supplier Form                  | Opens from Suppliers List                           |
| Purchase Receipts List         | Related to Stock In and Suppliers List              |
| Purchase Receipt Detail / Form | Opens from Purchase Receipts List                   |
| Customers List                 | Business Dashboard → Customers                      |
| Customer Detail                | Opens from Customers List                           |
| Loyalty Settings               | Related to Customers List and Customer Detail       |
| Promotions List                | Related to Items, Customers, and Loyalty            |
| Promotion Form                 | Opens from Promotions List                          |
| Coupons List                   | Related to Promotions List                          |
| Payment Methods                | Business-level payment config                       |
| Receipt / Bill Settings        | Related to Payment Methods and Branding             |
| Branding / Theme               | Related to Business Profile and Receipt Settings    |
| Device Management              | Related to Branches and POS devices                 |
| Module Settings                | Business-level enabled modules/add-ons              |
| Import Center                  | Related to Items, Customers, Suppliers              |
| Export Center                  | Related to Import Center and reporting/list data    |

### Special Fix: Loyalty Settings

The approved direction for Loyalty Settings is **not** a generic settings page. It must be a full loyalty/membership management screen.

It should include:

- KPI cards for members and points
- Points rules
- Membership tiers
- Rewards
- Member groups
- Expiration settings
- Notifications
- Right summary cards
- Recent loyalty activity

---

## 8.4 POS Terminal

### Group Style

- No normal admin sidebar
- Touch-first layout
- Top bar with branch, cashier, shift, and connection status
- Category tabs / category area
- Item grid
- Search / barcode scan input
- Cart panel
- Checkout actions
- Large touch-friendly buttons
- Hold / open orders

### POS Terminal Screens

```text
UI-063 POS Terminal Main
UI-064 Barcode Scan State
UI-065 Product Search / Category Browse
UI-066 Cart with Notes
UI-067 Table Selection
UI-068 Hold / Open Orders
UI-069 Discount Modal
UI-070 Customer Attach / Member Lookup
UI-071 Split Payment
UI-072 Checkout Modal — Cash
UI-073 Checkout Modal — Bank / QR
UI-074 Payment Success & Print
UI-075 Refund / Return Start
UI-076 Refund Detail Confirm
UI-077 Open Shift
UI-078 Close Shift / End Shift Summary
UI-079 Offline / Reconnect State
```

---

## 8.5 Staff Order Mobile

### Group Style

- Mobile-first layout
- Header
- Bottom navigation
- Large touch targets
- Category tabs
- Item cards
- Cart summary
- Send order flow

### Screens

```text
UI-080 Staff Order Login / Branch Select
UI-081 Table Select
UI-082 Menu Browse
UI-083 Item Customize
UI-084 Cart Review
UI-085 Send Order Success
UI-086 Active Tables / Orders
UI-087 Staff Order Settings / Profile
```

---

## 8.6 Customer Display

### Group Style

- Full-screen customer-facing display
- No sidebar
- No admin navbar
- Large readable order content
- Payment total
- QR/bank payment info
- Thank-you / success state

### Screens

```text
UI-088 Idle Branded Screen
UI-089 Live Order Review
UI-090 QR / Bank Payment Screen
UI-091 Payment Success / Thank You
```

---

## 8.7 Kitchen / Bar Display

### Group Style

- Full-screen kitchen or bar board
- No admin sidebar
- Large ticket cards
- Status tabs: New / Preparing / Ready
- Station filter
- Sound status
- Elapsed time
- Clear action buttons

### Screens

```text
UI-092 Kitchen Dashboard
UI-093 Order Ticket Detail
UI-094 New Order Alert Overlay
UI-095 Preparing Queue
UI-096 Ready / Done Queue
UI-097 Kitchen Settings / Station Filter
```

---

## 8.8 Public Menu / QR Menu

### Public Route Rule

```text
/b/[businessSlug]
/b/[businessSlug]/menu
/b/[businessSlug]/menu/[itemSlug]
/b/[businessSlug]/info
/b/[businessSlug]/book
/b/[businessSlug]/branch/[branchSlug]/menu
/q/[qrCode]
```

กฎสำคัญ:

```text
Public Menu / QR Menu ไม่ต้อง login
`/b/[businessSlug]` คือ URL public ของแต่ละร้าน
ลูกค้าใช้ดูข้อมูลร้าน เมนู รายการสินค้า ราคา และเวลาเปิดปิด
Public Menu เป็น view-only ไม่สร้าง order ไม่ checkout และไม่ชำระเงิน
```

### Group Style

- Mobile public menu
- Business logo
- Search
- Category tabs
- Item cards
- Store info
- View-only menu
- No checkout
- No payment

### Screens

```text
UI-098 Public Menu Landing
UI-099 Category Menu List
UI-100 Item Detail
UI-101 Search Results
UI-102 Out-of-Stock / Unavailable State
UI-103 Store Info / Hours
```

---

## 8.9 Retail-specific

### Group Style

Use Business Admin shell with retail-specific inventory operations.

### Screens

```text
UI-104 Stock Count
UI-105 Low Stock / Expiry Alerts
UI-106 Goods Receiving
UI-107 Return / Exchange Counter
UI-108 Shelf Label / Barcode Print
```

### Frontend Routes

```text
UI-104 Stock Count → /business-admin/[businessSlug]/stock-count
UI-105 Low Stock / Expiry Alerts → /business-admin/[businessSlug]/low-stock-expiry
UI-106 Goods Receiving → /business-admin/[businessSlug]/goods-receiving
UI-107 Return / Exchange Counter → /business-admin/[businessSlug]/returns
UI-108 Shelf Label / Barcode Print → /business-admin/[businessSlug]/barcode-labels
```

---

## 8.10 Cafe-specific

### Group Style

Use Business Admin, POS, or display shell depending on the screen. Cafe screens should use cafe-specific content.

### Screens

```text
UI-109 Cafe Floor Table Map -> /business-admin/[businessSlug]/tables
UI-110 Coffee Modifiers / Recipe Options -> /business-admin/[businessSlug]/modifiers
UI-111 Queue Pickup Screen -> /display/b/[businessSlug]/pickup-display
UI-112 Barista Queue Detail -> /business-admin/[businessSlug]/barista-queue
UI-113 Happy Hour / Combo Setup -> /business-admin/[businessSlug]/happy-hour
UI-114 Cafe Daily Quick View -> /business-admin/[businessSlug]/cafe-daily-view
```

### Route Mapping

```text
UI-109 Cafe Floor Table Map -> /business-admin/[businessSlug]/tables
UI-110 Coffee Modifiers / Recipe Options -> /business-admin/[businessSlug]/modifiers
UI-111 Queue Pickup Screen -> /display/b/[businessSlug]/pickup-display
UI-112 Barista Queue Detail -> /business-admin/[businessSlug]/barista-queue
UI-113 Happy Hour / Combo Setup -> /business-admin/[businessSlug]/happy-hour
UI-114 Cafe Daily Quick View -> /business-admin/[businessSlug]/cafe-daily-view
```

หมายเหตุ: UI-111 เป็นจอ display ใน `frontend/apps/terminal` ไม่ใช่หน้า admin ใน `frontend/apps/web`.

---

## 8.11 Restaurant-specific

### Group Style

Use Business Admin, POS, or kitchen display shell depending on the screen. Restaurant screens should support table service and kitchen workflow.

### Screens

```text
UI-115 Restaurant Areas / Tables
UI-116 Reservation Book
UI-117 Kitchen Course Management
UI-118 Split Bill by Guest / Item
UI-119 Service Charge / Tax Preview
UI-120 Merge / Transfer Table
UI-121 Restaurant End-of-Day Summary
```

### Route Mapping

```text
UI-115 Restaurant Areas / Tables -> /business-admin/[businessSlug]/tables
UI-116 Reservation Book -> /business-admin/[businessSlug]/reservations
UI-117 Kitchen Course Management -> /business-admin/[businessSlug]/kitchen-courses
UI-118 Split Bill by Guest / Item -> /business-admin/[businessSlug]/split-bill
UI-119 Service Charge / Tax Preview -> /business-admin/[businessSlug]/service-charge
UI-120 Merge / Transfer Table -> /business-admin/[businessSlug]/merge-transfer-table
UI-121 Restaurant End-of-Day Summary -> /business-admin/[businessSlug]/end-of-day
```

หมายเหตุ: UI-115 ใช้ route `/tables` ร่วมกับ Cafe แต่ render ตาม POS Type/business slug.

---

## 8.12 Beauty-specific

### Group Style

Use Business Admin shell with beauty/appointment service content.

### Screens

```text
UI-122 Appointment Calendar
UI-123 Create Appointment
UI-124 Service Menu & Duration Settings
UI-125 Staff Schedule
UI-126 Package / Treatment Sessions
UI-127 Customer History & Notes
UI-128 Deposit / Cancellation Policy
UI-129 Beauty Daily Schedule Board
```

---

## 8.13 Hospitality-specific

### Group Style

Use Business Admin shell with room/booking/guest-folio content.

### Screens

```text
UI-130 Room Calendar
UI-131 Room Settings & Housekeeping
UI-132 Booking List
UI-133 Create Booking
UI-134 Check-in
UI-135 Check-out
UI-136 Guest Folio / Extra Charges
```

---

## 9. AI Generation QA Checklist

Before marking any UI as done, check:

```text
1. Correct group style
2. Correct logo treatment
3. Correct sidebar or no sidebar depending on group
4. Correct active navigation item
5. Correct topbar for that group
6. No wrong footer in admin/app screens
7. Screen content matches the objective
8. List/detail/form relationship is clear
9. Realistic Laos sample data
10. No watermark
11. UI labels are English
12. Layout can be implemented by frontend developer
```

### Platform Admin Specific QA

```text
- Profile must be Somchai Phommasenh / Platform Admin
- Topbar must include + Create Business
- Sidebar labels must match exactly
- No website footer/version/copyright
```

### Business Admin Specific QA

```text
- Business switcher must be visible
- Branch selector must be visible
- Open POS button must be visible
- Search placeholder: Search items, orders, customers...
- Profile role should be Business Owner or equivalent
- Sidebar must not use Platform Admin labels
```

---

## 10. Approved / Locked Prompt Rule

When a screen is approved:

```text
Status = ແລ້ວ
```

Then:

- Do not rewrite that prompt.
- Do not update the whole Prompt column.
- Do not change its anchor logic.
- Use it as a visual reference for related screens.

If a screen is not approved:

```text
Status = ຍັງບໍ່ແລ້ວ
```

Then it can be edited individually.

---

## 11. Development Notes

### Frontend

Frontend work should follow the approved UI mockups and group style anchors.

Suggested frontend concerns:

- Reusable layout shells:
  - Marketing layout
  - Platform Admin layout
  - Business Admin layout
  - POS Terminal layout
  - Mobile layout
  - Display/KDS layout
- Reusable components:
  - Cards
  - Tables
  - Filters
  - Forms
  - Modals
  - Drawers
  - Status badges
  - Pagination
  - Summary side panels

### Backend

Backend work should map to modules:

```text
Businesses
Branches
Staff
Roles & Permissions
Items
Categories
Inventory
Stock Movements
Suppliers
Purchases
Customers
Loyalty
Promotions
Coupons
Payments
Receipts
Devices
Modules
Reports
Support
Audit Logs
Settings
```

The backend should support multi-business and multi-branch logic from the start.

ข้อมูลของ business ต้องแก้ไขได้โดย owner/manager ตาม permission ที่อนุญาต และ backend ต้องบังคับขอบเขต `business_id`, `branch_id`, role, permission, plan, POS Type และ enabled modules เสมอ

---

## 12. Current Progress Summary

### Done / Approved Groups

```text
Web chính
Platform Admin
```

### Approved Anchor

```text
Business Admin Core → UI-031 Business Dashboard
```

### In Progress

```text
Business Admin Core
```

### Pending Groups

```text
POS Terminal
Staff Order Mobile
Customer Display
Kitchen / Bar Display
Public Menu / QR Menu
Retail-specific
Cafe-specific
Restaurant-specific
Beauty-specific
Hospitality-specific
```

---

## 13. Final Working Principle

This project should be managed like this:

```text
One source of truth: Google Sheet
One visual direction per group: approved anchor screen
One prompt per screen: standalone and specific
One status per UI: approved or not approved
No bulk prompt rewrite after approval
```

This ensures that another AI, designer, or developer can continue TJ POS without breaking the approved design direction.
