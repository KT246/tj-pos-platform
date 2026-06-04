# TJ POS Frontend

Frontend workspace for TJ POS.

## Package Manager

Use `pnpm` only.

```bash
pnpm install
pnpm dev:web
pnpm dev:terminal
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Structure

```text
frontend/
├── apps/
│   ├── web
│   └── terminal
└── packages/
    └── config
```

`apps/web` is the Next.js app. `apps/terminal` is the Vite React app.

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

No i18n package is installed. Public website content in `apps/web` can support
`lo` and `en` later without making i18n a shared system-wide dependency.
