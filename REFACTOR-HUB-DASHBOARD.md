# AI Hub Dashboard Refactoring — Scope & Requirements
## Project: AI Operations Portal

## ปัญหา
Dashboard ปัจจุบันออกแบบจากสมมติฐาน (fake Request Flow, dummy metrics) ไม่ใช่จากระบบจริง (Honcho Cloud Runtime)

## สิ่งที่ต้องเปลี่ยน

### 1. Request Flow → Live Runtime Flow
**ไฟล์:** `src/app/dashboard/flow/page.tsx`

**ของเดิม:** Fake 6-stage pipeline (Question→Memory→Skills→Obsidian→Tool→Answer) พร้อม random latency + random outcome

**ของใหม่:** Honcho Cloud Runtime Flow จริง:

```
User Request
     │
     ▼
   Session
     │
     ▼
   Honcho Search
     │
  ┌──┴──┐
  │     │
 HIT   MISS
  │     │
  ▼     ▼
Memory  LLM
  │
  ▼
Response
  │
  ▼
Honcho Conclude
  │
  ▼
Maintenance Queue
```

### 2. Dashboard → Observability

**ของเดิม:** Active Agents, Total Memories, Active Sessions, Requests/min, Error Rate, Avg Latency — dummy metrics ทั้งหมด

**ของใหม่:** Live Runtime Metrics:

```
Request Timeline
├── Search (latency ms)
├── Retrieve (latency ms)
├── Reasoning (latency ms)
├── Conclude (latency ms)
├── Memory Used (tokens/count)
├── Tokens (total/input/output)
└── Errors (count/type)
```

### 3. Service Status

**ของเดิม:** Memory, Honcho, Trace, Health — generic names

**ของใหม่:**
| Service | Status | Description |
|---|---|---|
| Honcho API | Healthy/Degraded/Down | Cloud API status |
| Cloud Status | ✅/⚠️/❌ | Honcho Cloud overall |
| Search Latency | Nms | live metric |
| Conclude Latency | Nms | live metric |
| Neuromancer | Active/Idle | Reasoning engine |
| Maintenance Queue | N pending | Cron job queue |
| Cron Status | ✅/⚠️ | All cron jobs health |

### 4. Navigation Structure

**ของเดิม:** Home, Academy, ADR, Dashboard(System/Flow/Providers/Trace), Status

**ของใหม่:**

```
AI Hub
├── Dashboard         ← Live Runtime Observability
├── Memory            ← Honcho Cloud
├── Sessions          ← Active/History
├── Canonical         ← Plan C Canonical entries
├── Maintenance       ← Cron jobs + Health
├── Event Logs        ← Pipeline events
├── Metrics           ← Golden Questions + Feedback
└── Settings          ← Config
```

### 5. Data Source

**ของเดิม:** `Math.random()`, fake data, dummy arrays

**ของใหม่:** Live Honcho Cloud API calls:
- `/api/memory/search` → search latency
- `/api/memory/conclude` → conclude latency
- `/api/status` → service health
- `/api/metrics` → tokens, memory used, errors

### 6. Empty State

**ของใหม่:**  ถ้ายังไม่มีข้อมูล → แสดง "No Production Data Yet" — ห้ามแสดงข้อมูลจำลอง

### 7. Sidebar/Layout

**ไฟล์:** `src/components/Sidebar.tsx`, `src/app/layout.tsx`

- Sidebar ต้องเปลี่ยน navigation structure ตามข้อ 4
- Layout ต้องรองรับ Dashboard-first (ไม่ใช่ Academy-first)
- ต้องมี top bar แสดง environment (production v1.1.0), version, refresh button

## Acceptance Criteria
1. [ ] ไม่มี fake/random data เหลือใน dashboard
2. [ ] Request Flow แสดง Honcho Cloud Runtime pipeline จริง
3. [ ] Service Status แสดง live metrics จาก Honcho API
4. [ ] Navigation structure ตามที่กำหนด
5. [ ] Empty state = "No Production Data Yet" ไม่ใช่ dummy
6. [ ] ข้อมูลทั้งหมดมาจาก live API call ถ้าไม่มี API → แสดงสถานะ offline

## Files ที่ต้องแก้
- `src/app/dashboard/flow/page.tsx` — Request Flow → Runtime Flow
- `src/app/dashboard/system/page.js` — Service Status → Honcho Runtime Status
- `src/app/dashboard/trace/page.tsx` — Real trace from Honcho
- `src/components/Sidebar.tsx` — Navigation restructure
- `src/app/layout.tsx` — Layout restructure for Operations Portal
- New: `src/app/dashboard/overview/page.tsx` — Observability dashboard
- New: `src/lib/honcho.ts` — Honcho API client

## NOT in Scope
- Academy pages (keep as-is)
- Authentication/auth
- Backend changes (API is separate)

## Risk
- Honcho API endpoints อาจยังไม่พร้อม → ใช้ try/catch + offline state
- large refactor → branch new, ไม่ touch working code
