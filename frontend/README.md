# TJ POS Frontend

Frontend workspace for TJ POS.

## Package Manager

Use `pnpm` only.

```bash
pnpm install
pnpm dev:web
pnpm dev:platform-admin
pnpm dev:business-admin
pnpm dev:public-menu
pnpm dev:staff-order
pnpm dev:customer-display
pnpm dev:kitchen-display
pnpm dev:terminal
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Structure

```text
frontend/
+- apps/
|  +- web              # Next.js public website
|  +- platform-admin   # Vite React platform admin
|  +- business-admin   # Vite React business admin
|  +- terminal         # Vite React POS terminal
|  +- public-menu      # Vite React public menu / QR menu
|  +- staff-order      # Vite React staff order mobile
|  +- customer-display # Vite React customer display
|  +- kitchen-display  # Vite React kitchen / bar display
+- packages/
   +- ui
   +- shared
   +- i18n
   +- config
```

Only `apps/web` uses Next.js. Admin, customer-facing, and shop operation apps
use Vite React.

The frontend should use mock data until the API contract is agreed with backend.

## Stack

Installed stack:

```text
Next.js
Vite React
Tailwind CSS
Radix UI primitives
lucide-react
TanStack Query
TanStack Table
Zustand
React Hook Form
Zod
Vitest
Testing Library
Playwright
```

i18n is scoped to public website `lo` and `en` content. Do not make it a
system-wide requirement for admin, terminal, or display apps unless the docs
explicitly change that rule.
