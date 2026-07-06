/**
 * Honcho Cloud API Client — Production Runtime
 *
 * Lightweight client that fetches live metrics from the Honcho Cloud API.
 * Returns typed data on success, or a sentinel "no data" response when
 * the API is unreachable (pre-deployment / not-yet-connected state).
 *
 * Every consumer must handle both shapes — do NOT invent fake values.
 */

export const HONCHO_API_BASE =
  process.env.NEXT_PUBLIC_HONCHO_API_URL || 'http://honcho-api.local:8080'

/* ── Types ── */

export interface HonchoStatus {
  honcho_api: 'healthy' | 'degraded' | 'down'
  cloud_status: 'operational' | 'degraded' | 'outage'
  search_latency_ms: number | null
  conclude_latency_ms: number | null
  neuromancer: 'active' | 'idle' | 'error'
  maintenance_queue: number
  cron_status: 'running' | 'paused' | 'error'
  uptime_seconds: number
}

export interface HonchoMetrics {
  total_requests: number
  requests_per_minute: number
  tokens_total: number
  tokens_input: number
  tokens_output: number
  memory_count: number
  memory_tokens: number
  error_count: number
  errors_by_type: Record<string, number>
  latency_p50_ms: number
  latency_p95_ms: number
  latency_p99_ms: number
}

export interface HonchoFlowEntry {
  id: string
  step: string
  status: 'ok' | 'miss' | 'error'
  latency_ms: number
  started_at: string
  completed_at: string
}

export interface HonchoFlow {
  session_id: string
  query: string
  timestamp: string
  steps: HonchoFlowEntry[]
  total_latency_ms: number
}

export interface HonchoTrace {
  trace_id: string
  request_id: string
  session_id: string
  query: string
  steps: HonchoFlowEntry[]
  total_latency_ms: number
  started_at: string
  completed_at: string
}

/* ── Sentinel ── */

export const NO_DATA = Symbol('no-production-data-yet')

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: typeof NO_DATA; message: string }

function noData<T>(): ApiResult<T> {
  return {
    ok: false,
    reason: NO_DATA,
    message: 'No Production Data Yet — Connect Honcho Cloud to see live metrics',
  }
}

/* ── Fetcher helpers ── */

async function fetchJson<T>(path: string, timeoutMs = 5_000): Promise<ApiResult<T>> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    const res = await fetch(`${HONCHO_API_BASE}${path}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
    clearTimeout(timer)

    if (!res.ok) return noData()
    const data: T = await res.json()
    return { ok: true, data }
  } catch {
    return noData()
  }
}

/* ── Public API ── */

/** GET /api/status — service health & component status */
export async function fetchStatus(): Promise<ApiResult<HonchoStatus>> {
  return fetchJson<HonchoStatus>('/api/status')
}

/** GET /api/metrics — runtime observability KPIs */
export async function fetchMetrics(): Promise<ApiResult<HonchoMetrics>> {
  return fetchJson<HonchoMetrics>('/api/metrics')
}

/** GET /api/flow/latest — most recent request flow */
export async function fetchLatestFlow(): Promise<ApiResult<HonchoFlow>> {
  return fetchJson<HonchoFlow>('/api/flow/latest')
}

/** GET /api/traces — recent traces */
export async function fetchTraces(limit = 10): Promise<ApiResult<HonchoTrace[]>> {
  return fetchJson<HonchoTrace[]>(`/api/traces?limit=${limit}`)
}
