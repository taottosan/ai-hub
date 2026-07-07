# Rollback Guide — AI Hub Dashboard

## When to Rollback

- Critical dashboard errors after deploy
- Worker connectivity loss
- Honcho API incompatibility detected
- Boss instructions

## Quick Rollback — Dashboard

```bash
# Rollback to previous deployment
# Cloudflare Pages keeps previous deployments for 30 days

cd C:\Users\Ta\ai-hub
CLOUDFLARE_API_TOKEN=*** npx wrangler pages rollback ai-hub --branch main
```

Or via Cloudflare Dashboard:
```
1. ไปที่ Cloudflare Dashboard → Pages → ai-hub
2. เลือก Deployment history
3. คลิก ⋮ → Rollback to this deployment
```

## Quick Rollback — Worker

```bash
cd C:\Users\Ta\workers\honcho-proxy

# List versions
npx wrangler deployments list

# Rollback to specific version
npx wrangler rollback <version-id>
```

## Rollback — Git (Code)

```bash
# If tagged
git checkout v1.0.0-prod

# If not tagged, use git log
git log --oneline -10
git checkout <previous-stable-commit>
```

## Rollback Verification

After rollback, verify:

| Check | Command |
|---|---|
| Dashboard loads | Open `https://ai-hub.doonunghub.com/dashboard/overview/` |
| Worker health | `curl -s https://honcho-api-proxy.doonunghd4k.workers.dev/health` |
| No console errors | Browser DevTools → Console |
| Honcho reachable | `curl -s -X POST https://api.honcho.dev/v3/workspaces/list` |
| Error handling | Check `GET /nonexistent` returns 404 |

## Rollback Communication

```text
🔴 ROLLBACK ACTIVATED
  Date:   YYYY-MM-DD HH:mm
  By:     Molly
  Reason: <brief description>
  Tag:    rolling-back-to-<version>
  Status: <in-progress / complete / verified>
```

## Notes

- Dashboard rollback takes ~30 seconds (Cloudflare Pages propagation)
- Worker rollback is instant
- Honcho Cloud is external — no rollback needed
- Always verify after rollback before marking complete
