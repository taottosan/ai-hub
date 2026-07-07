# Phase 1: API Mapping Analysis — AI Hub Dashboard → Honcho Cloud Official API v3

> Source: https://docs.honcho.dev | OpenAPI: https://honcho.dev/docs/v3/openapi.json
> API Base: https://api.honcho.dev | Auth: Bearer Token

---

## ตาราง Mapping Dashboard → Honcho API

### A. Dashboard Overview (`/dashboard/overview`)

| Dashboard ต้องการ | Honcho API มี? | Endpoint | Method | หมายเหตุ |
|---|---|---|---|---|
| **Total Requests** | ❌ ไม่มี | — | — | Honcho ไม่มี aggregate request counter |
| **Requests / min** | ❌ ไม่มี | — | — | ไม่มี real-time rate metric |
| **Memory Count** | ❌ ไม่มี | — | — | ไม่มี "memory" aggregate endpoint |
| **Memory Tokens** | ❌ ไม่มี | — | — | ไม่มี token tracking |
| **Tokens Total** | ❌ ไม่มี | — | — | ไม่มี token tracking |
| **Tokens Input** | ❌ ไม่มี | — | — | ไม่มี token tracking |
| **Tokens Output** | ❌ ไม่มี | — | — | ไม่มี token tracking |
| **Error Count** | ❌ ไม่มี | — | — | ไม่มี error aggregation API |
| **Errors by Type** | ❌ ไม่มี | — | — | ไม่มี error type tracking |
| **Latency p50/p95/p99** | ❌ ไม่มี | — | — | ไม่มี latency metrics |

### B. Service Status (`/dashboard/system`)

| Dashboard ต้องการ | Honcho API มี? | Endpoint | Method | หมายเหตุ |
|---|---|---|---|---|
| **Honcho API Health** | ❌ ไม่มี | — | — | No dedicated health endpoint |
| **Cloud Status** | ❌ ไม่มี | — | — | No cloud status API |
| **Search Latency** | ❌ ไม่มี | — | — | No latency endpoint |
| **Conclude Latency** | ❌ ไม่มี | — | — | No latency endpoint |
| **Neuromancer Status** | ❌ ไม่มี | — | — | No neuromancer endpoint |
| **Cron Status** | ❌ ไม่มี | — | — | No cron monitoring API |
| **Uptime Seconds** | ❌ ไม่มี | — | — | No uptime endpoint |
| **Maintenance Queue** | ✅ มี (บางส่วน) | `/v3/workspaces/{workspace_id}/queue/status` | GET | คืน `{ total_work_units, completed, in_progress, pending }` แต่ dashboard ต้องการแค่ number |

### C. Runtime Flow (`/dashboard/flow`)

| Dashboard ต้องการ | Honcho API มี? | Endpoint | Method | หมายเหตุ |
|---|---|---|---|---|
| **Flow Steps** | ❌ ไม่มี | — | — | Honcho ไม่มี pipeline/flow concept |
| **Session ID** | ✅ มี | `/v3/workspaces/{wid}/peers/{pid}/sessions` | POST | List sessions |
| **Query** | ✅ มี | Messages content | — | อยู่ใน message objects |
| **Timestamp** | ✅ มี | Session/Message metadata | — | `created_at` field |
| **Total Latency** | ❌ ไม่มี | — | — | ไม่มี request timing |

### D. Event Logs / Traces (`/dashboard/trace`)

| Dashboard ต้องการ | Honcho API มี? | Endpoint | Method | หมายเหตุ |
|---|---|---|---|---|
| **Trace ID** | ❌ ไม่มี | — | — | Honcho ไม่มี trace concept |
| **Request ID** | ❌ ไม่มี | — | — | ไม่มี request ID concept |
| **Steps array** | ❌ ไม่มี | — | — | ไม่มี step/pipeline concept |
| **Total Latency** | ❌ ไม่มี | — | — | ไม่มี timing |

---

## สรุปผล Phase 1

| หมวด | Dashboard Fields | Honcho API มี | % |
|---|---|---|---|
| Overview (A) | 11 fields | 0 | **0%** |
| Service Status (B) | 8 fields | 1 (partial) | **12.5%** |
| Runtime Flow (C) | 5 fields | 3 (session, query, timestamp) | **60%** |
| Event Logs (D) | 4 fields | 0 | **0%** |
| **รวมทั้งหมด** | **28 fields** | **4 fields** | **14.3%** |

**14.3% mapping coverage — ไม่เพียงพอสำหรับ Thin Proxy**

---

## รายการที่มีใน Honcho API จริง (สิ่งที่ Dashboard ใช้ได้)

| API | Endpoint | Method | ข้อมูลที่ได้ |
|---|---|---|---|
| ✅ Workspace Info | `/v3/workspaces` | POST | ตรวจสอบ workspace existence (+ auth test) |
| ✅ Queue Status | `/v3/workspaces/{wid}/queue/status` | GET | `total`, `completed`, `in_progress`, `pending` work units |
| ✅ Peers List | `/v3/workspaces/{wid}/peers/list` | POST | จำนวน peers, metadata |
| ✅ Sessions List | `/v3/workspaces/{wid}/peers/{pid}/sessions` | POST | จำนวน sessions, latest activity |
| ✅ Peer Card | `/v3/workspaces/{wid}/peers/{pid}/card` | GET | Peer profile, preferences |
| ✅ Session Context | `/v3/workspaces/{wid}/peers/{pid}/sessions/{sid}/context` | GET | Session summary + recent messages |
| ✅ Search Messages | `/v3/workspaces/{wid}/search` | POST | ค้นหาข้อความ |
| ✅ Chat (Dialectic) | `/v3/workspaces/{wid}/peers/{pid}/chat` | POST | Natural language reasoning |
| ✅ Messages | `/v3/workspaces/{wid}/peers/{pid}/sessions/{sid}/messages` | GET/POST | History, create |
| ✅ Conclusions | `/v3/workspaces/{wid}/conclusions` | POST | Store/query conclusions |
| ✅ Schedule Dream | `/v3/workspaces/{wid}/schedule_dream` | POST | Trigger Dreaming |

---

## Phase 3 Verdict: ต้องแก้ Dashboard

**Thin Proxy จะไม่ถูกสร้าง** เพราะมันจะต้อง:
1. ✅ ไม่มี Business Logic (โจทย์ Boss)
2. ❌ ไม่สามารถ map 14/28 fields ได้ (14 fields ไม่มีใน Honcho API)
3. ❌ การ map ต้อง "คิดเอง" (aggregate, calculate, invent)

**การแก้ Dashboard ที่แนะนำ:**

```
OLD fields (ต้องลบ)              NEW fields (ใช้ของจริง)
─────────────────────             ─────────────────────
Total Requests                    → พร้อมใช้: Sessions count
Requests/min                      → พร้อมใช้: Peers count
Tokens (all)                      → ❌ ลบ — ไม่มีใน Honcho
Latency (all)                     → ❌ ลบ — ไม่มีใน Honcho
Error Count                       → ❌ ลบ — ไม่มีใน Honcho
Neuromancer Status                → ❌ ลบ — ไม่มีใน Honcho
Cron Status                       → ❌ ลบ — ไม่มีใน Honcho
Honcho API Health                 → ✅ ใช้ POST /v3/workspaces (200 = healthy)
Cloud Status                      → ❌ ลบ — ไม่มี
Maintenance Queue                 → ✅ ใช้ Queue Status API
Flow Steps (fake)                 → ✅ ใช้ Session Context API จริง
Traces (fake)                     → ✅ ใช้ Sessions + Messages API จริง
```

**Worker ที่ควรมี (ถ้ามี):**
```
GET /v3/workspaces/{wid}/queue/status
    → Worker ต้องไม่ aggregate หรือคำนวณอะไร
    → ส่งต่อ response ตามที่ Honcho คืนมา
    → Dashboard ต้องปรับ UI ให้รับ QueueStatus shape จริง
```

รอ Boss ครับ — ให้ Molly เริ่ม **Phase 3 (Rewrite Dashboard)** หรือปรับอะไรก่อน?
