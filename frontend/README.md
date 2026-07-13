# Deploy to Cloudflare Workers Builds

This frontend is a Vite monorepo. Configure the Cloudflare Worker Build with:

| Setting | Value |
| --- | --- |
| Root directory | `frontend` |
| Build command | `pnpm build` |
| Deploy command | `npx wrangler deploy` |
| Production branch | Your production branch |

Set these environment variables for both Preview and Production:

```text
VITE_API_BASE_URL=https://api.example.com
VITE_POS_BUSINESS_SLUG=tj-cafe-vientiane
PNPM_VERSION=10.25.0
```

`VITE_API_BASE_URL` is embedded in the browser bundle, so it must be the public HTTPS URL of the backend API. Do not add secret values with a `VITE_` prefix.

`wrangler.jsonc` publishes `apps/pos/dist` as Worker static assets. It also configures SPA fallback, so deep links such as `/pos/staff` load the React application after a refresh.

`.nvmrc` pins the Cloudflare build to Node.js 22.16.0. The backend must be deployed separately and accept requests from the Pages domain.
