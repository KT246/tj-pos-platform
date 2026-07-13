# TJ POS Backend

## Local development

Docker is only required on the server. For normal local development, run PostgreSQL locally, copy `.env.example` to `.env`, then run:

```bash
pnpm install
pnpm dev
```

For a disposable local PostgreSQL container instead:

```bash
docker compose -f docker-compose.dev.yml up --build
```

## Production server with Supabase

The production compose file runs only the NestJS API. Supabase hosts PostgreSQL, so do not run the `postgres` service on the server.

1. In Supabase, open **Connect** and copy the **Session pooler** URL. For a typical IPv4 VPS, use port `5432`, not the transaction pooler at `6543`.
2. On the server, copy `.env.production.example` to `.env.production` and set the Supabase URL, public API domain, Cloudflare Worker domain, JWT secrets, and initial administrator credentials.
3. Run the API:

```bash
docker compose up -d --build
docker compose logs -f backend
curl http://127.0.0.1:3001/health
```

Uploaded images are stored in the Docker volume `backend_uploads`. For production, place a reverse proxy with HTTPS in front of port `3001` and use that public URL in `PUBLIC_BASE_URL`.

On the first startup against an empty Supabase database, the backend creates its required tables and creates the initial administrator from `INITIAL_ADMIN_*`. Keep the Supabase connection string and all JWT values only in `.env.production`; never commit that file.
