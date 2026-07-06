'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Activity,
  Server,
  Cloud,
  Search,
  Zap,
  Brain,
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FlaskConical,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchStatus, NO_DATA } from '@/lib/honcho'
import type { HonchoStatus } from '@/lib/honcho'

/* ── Service card ── */
function ServiceCard({
  name,
  status,
  icon: Icon,
  latency,
  extra,
}: {
  name: string
  status: 'healthy' | 'degraded' | 'down' | 'active' | 'idle' | 'error' | 'running' | 'paused'
  icon: typeof Server
  latency?: number | null
  extra?: string
}) {
  const statusConfig: Record<string, { label: string; dot: string; border: string; bg: string; text: string }> = {
    healthy:  { label: 'Healthy',  dot: 'bg-green-500',  border: 'border-green-500/30', bg: 'bg-green-500/5',  text: 'text-green-500' },
    degraded: { label: 'Degraded', dot: 'bg-orange-500', border: 'border-orange-500/30', bg: 'bg-orange-500/5', text: 'text-orange-500' },
    down:     { label: 'Down',     dot: 'bg-red-500',    border: 'border-red-500/30',    bg: 'bg-red-500/5',    text: 'text-red-500' },
    active:   { label: 'Active',   dot: 'bg-green-500',  border: 'border-green-500/30', bg: 'bg-green-500/5',  text: 'text-green-500' },
    idle:     { label: 'Idle',     dot: 'bg-[#8b949e]',  border: 'border-[#2b3140]',     bg: 'bg-[#1e222d]',    text: 'text-[#8b949e]' },
    running:  { label: 'Running',  dot: 'bg-green-500',  border: 'border-green-500/30', bg: 'bg-green-500/5',  text: 'text-green-500' },
    paused:   { label: 'Paused',   dot: 'bg-orange-500', border: 'border-orange-500/30', bg: 'bg-orange-500/5', text: 'text-orange-500' },
    error:    { label: 'Error',    dot: 'bg-red-500',    border: 'border-red-500/30',    bg: 'bg-red-500/5',    text: 'text-red-500' },
  }

  const cfg = statusConfig[status] ?? statusConfig.down

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-xl border p-4 transition-all',
        cfg.border,
        cfg.bg,
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg border', cfg.border, cfg.bg)}>
          <Icon className={cn('h-5 w-5', cfg.text)} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#e6edf3]">{name}</p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className={cn('inline-flex items-center gap-1 text-xs font-medium', cfg.text)}>
              <span className={cn('inline-block h-2 w-2 rounded-full', cfg.dot)} />
              {cfg.label}
            </span>
            {latency !== null && latency !== undefined && (
              <span className="text-xs text-[#8b949e]">{latency}ms</span>
            )}
          </div>
        </div>
      </div>
      {extra && (
        <span className="text-xs text-[#8b949e]">{extra}</span>
      )}
    </div>
  )
}

/* ── Empty state ── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2b3140] bg-[#1e222d]">
        <FlaskConical className="h-8 w-8 text-[#8b949e]" />
      </div>
      <h3 className="text-lg font-semibold text-[#e6edf3]">
        No Production Data Yet
      </h3>
      <p className="mt-2 max-w-md text-sm text-[#8b949e]">
        Connect Honcho Cloud to see live service status, latency metrics, and
        component health. The dashboard will populate automatically once the API
        is reachable.
      </p>
    </div>
  )
}

/* ── Main component ── */
export default function ServiceStatusPage() {
  const [status, setStatus] = useState<HonchoStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const result = await fetchStatus()
    if (result.ok) {
      setStatus(result.data)
      setConnected(true)
    } else {
      setStatus(null)
      setConnected(false)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 15_000)
    return () => clearInterval(interval)
  }, [fetchData])

  if (loading && !status) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#e6edf3]">
            Service Status
          </h1>
          <p className="mt-1 text-sm text-[#8b949e]">
            Honcho Cloud Component Health
          </p>
        </div>
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex items-center gap-3 text-[#8b949e]">
            <Activity className="h-5 w-5 animate-pulse text-brand-500" />
            <span className="text-sm">Connecting to Honcho Cloud…</span>
          </div>
        </div>
      </div>
    )
  }

  if (!connected && !status) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#e6edf3]">
            Service Status
          </h1>
          <p className="mt-1 text-sm text-[#8b949e]">
            Honcho Cloud Component Health
          </p>
        </div>
        <EmptyState />
      </div>
    )
  }

  const s = status!

  const formatUptime = (seconds: number): string => {
    const d = Math.floor(seconds / 86400)
    const h = Math.floor((seconds % 86400) / 3600)
    return `${d}d ${h}h`
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-[#e6edf3]">
            Service Status
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Live
          </span>
        </div>
        <p className="mt-1 text-sm text-[#8b949e]">
          Honcho Cloud Component Health — auto-refreshes every 15s
        </p>
      </div>

      {/* ── Refresh ── */}
      <div className="mb-6">
        <button
          onClick={fetchData}
          disabled={loading}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-all',
            loading
              ? 'cursor-not-allowed bg-[#2b3140] text-[#8b949e]'
              : 'bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.97]',
          )}
        >
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* ── Grid ── */}
      <div className="space-y-3">
        <ServiceCard
          name="Honcho API"
          status={s.honcho_api}
          icon={Server}
        />
        <ServiceCard
          name="Cloud Status"
          status={
            s.cloud_status === 'operational'
              ? 'healthy'
              : s.cloud_status === 'degraded'
              ? 'degraded'
              : 'down'
          }
          icon={Cloud}
        />
        <ServiceCard
          name="Search Latency"
          status={s.search_latency_ms !== null && s.search_latency_ms < 500 ? 'healthy' : s.search_latency_ms !== null ? 'degraded' : 'down'}
          icon={Search}
          latency={s.search_latency_ms}
        />
        <ServiceCard
          name="Conclude Latency"
          status={s.conclude_latency_ms !== null && s.conclude_latency_ms < 500 ? 'healthy' : s.conclude_latency_ms !== null ? 'degraded' : 'down'}
          icon={Zap}
          latency={s.conclude_latency_ms}
        />
        <ServiceCard
          name="Neuromancer"
          status={
            s.neuromancer === 'active'
              ? 'active'
              : s.neuromancer === 'idle'
              ? 'idle'
              : 'error'
          }
          icon={Brain}
        />
        <ServiceCard
          name="Maintenance Queue"
          status={s.maintenance_queue > 0 ? 'active' : 'idle'}
          icon={Database}
          extra={s.maintenance_queue > 0 ? `${s.maintenance_queue} pending` : 'Empty'}
        />
        <ServiceCard
          name="Cron Status"
          status={s.cron_status}
          icon={Clock}
        />
      </div>

      {/* ── Uptime ── */}
      {s.uptime_seconds > 0 && (
        <div className="mt-6 rounded-lg border border-[#2b3140] bg-[#1e222d] p-4 text-center text-sm text-[#8b949e]">
          System Uptime: <span className="font-mono text-[#e6edf3]">{formatUptime(s.uptime_seconds)}</span>
        </div>
      )}
    </div>
  )
}
