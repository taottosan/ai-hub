# Deployment Guide — AI Hub Dashboard

## Architecture

```
Browser → https://ai-hub.doonunghub.com/dashboard/overview
            │ fetch() → NEXT_PUBLIC_HONCHO_API_URL
            ▼
Cloudflare Worker → https://honcho-api-proxy.doonunghd4k.workers.dev
            │ strips prefix → POST /api/honcho/workspaces/list
            ▼
Honcho Cloud API → https://api.honcho.dev/v3/*
```

## Components

| Component | Technology | Location |
|---|---|---|
| Dashboard | Next.js (static export) | `C:\Users\Ta\ai-hub\` |
| Worker | Cloudflare Workers | `C:\Users\Ta\workers\honcho-proxy\` |
| Honcho API | Cloud API | `https://api.honcho.dev` |

## Prerequisites

- Node.js 22+
- `CLOUDFLARE_API_TOKEN` with permissions:
  - `Workers Scripts → Edit`
  - `Cloudflare Pages → Edit`
  - `User → User Details → Read`

## Deploy Worker

```bash
cd C:\Users\Ta\workers\honcho-proxy

# Set API key (one-time)
npx wrangler secret put HONCHO_API_KEY

# Deploy
npx wrangler deploy
```

## Verify Worker

```bash
WORKER="https://honcho-api-proxy.doonunghd4k.workers.dev"

# Health
curl -s $WORKER/health

# Endpoints
curl -s -X POST $WORKER/workspaces/list -H "Content-Type: application/json" -d '{}'
curl -s -X POST $WORKER/workspaces/hermes/peers/list -H "Content-Type: application/json" -d '{}'
curl -s -X POST $WORKER/workspaces/hermes/peers/boss/sessions -H "Content-Type: application/json" -d '{}'
curl -s $WORKER/workspaces/hermes/queue/status
```

## Deploy Dashboard

```bash
cd C:\Users\Ta\ai-hub

# Build with Worker URL
rm -rf .next
NEXT_PUBLIC_HONCHO_API_URL=https://honcho-api-proxy.doonunghd4k.workers.dev npx next build

# Deploy to Cloudflare Pages
CLOUDFLARE_API_TOKEN=*** npx wrangler pages deploy out/ --project-name ai-hub --branch main
```

## E2E Verification

```bash
# 1. Check dashboard loads
open https://ai-hub.doonunghub.com/dashboard/overview/

# 2. Check console for errors (0 expected)
# 3. Check Worker endpoints respond 200
# 4. Check error states (404 page)
```

## Tags

After successful deployment:
```bash
git tag -a v1.1.0-prod -m "Production Release — Honcho Cloud Runtime Dashboard"
git push origin v1.1.0-prod
```
