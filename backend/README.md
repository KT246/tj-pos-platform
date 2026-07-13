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

## Production server with Supabase and Cloudflare Tunnel

The production compose file runs the NestJS API and `cloudflared`. Supabase hosts PostgreSQL, so do not run the `postgres` service on the server. Nginx, Certbot, public port `3001`, and a DNS A record for the server are not required.

1. In Cloudflare, go to **Networking > Tunnels**, create a remotely-managed tunnel named `tj-pos-api`, and select **Docker**. Copy only the token.
2. Add a **Published application** on that tunnel: public hostname `api.your-domain.com`, service `http://backend:3001`. Cloudflare creates the DNS route automatically.
3. In Supabase, open **Connect** and copy the **Session pooler** URL. For a typical IPv4 VPS, use port `5432`, not the transaction pooler at `6543`.
4. On the server, copy `.env.production.example` to `.env.production` and set the Supabase URL, `PUBLIC_BASE_URL=https://api.your-domain.com`, the Cloudflare Worker URL in `CORS_ORIGIN`, JWT secrets, and initial administrator credentials.
5. Copy `.env.tunnel.example` to `.env.tunnel` and paste the Cloudflare Tunnel token.
6. Run the API and tunnel:

```bash
docker compose up -d --build
docker compose logs -f backend
docker compose logs -f cloudflared
```

The server needs only outbound network access for `cloudflared`; do not open inbound ports `80`, `443`, or `3001` for this API. Uploaded images are stored in the Docker volume `backend_uploads`.

On the first startup against an empty Supabase database, the backend creates its required tables and creates the initial administrator from `INITIAL_ADMIN_*`. Keep the Supabase connection string and all JWT values only in `.env.production`; never commit that file.
