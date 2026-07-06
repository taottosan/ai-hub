'use client'

import { useState, useEffect } from 'react'
import {
  Activity,
  BarChart3,
  Clock,
  Database,
  FlaskConical,
  AlertTriangle,
  Layers,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { HonchoMetrics } from '@/lib/honcho'
import { fetchMetrics, NO_DATA } from '@/lib/honcho'

/* ── Poll interval ── */
const POLL_MS = 15_000

/* ── KPI Card ── */
function KpiCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  accent,
}: {
  icon: typeof Activity
  label: string
  value: string
  unit?: string
  trend?: { dir: 'up' | 'down'; pct: string }
  accent: 'brand' | 'success' | 'warning' | 'danger'
}) {
  const accentMap: Record<string, string> = {
    brand: 'text-brand-500 border-brand-500/30 bg-brand-500/10',
    success: 'text-green-500 border-green-500/30 bg-green-500/10',
    warning: 'text-orange-500 border-orange-500/30 bg-orange-500/10',
    danger: 'text-red-500 border-red-500/30 bg-red-500/10',
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-[#2b3140] bg-[#1e222d] p-5 transition-all hover:border-[#3b4252] hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-[#8b949e]">
            {label}
          </p>
          <p className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#e6edf3] tabular-nums">
              {value}
            </span>
            {unit && (
              <span className="text-sm text-[#8b949e]">{unit}</span>
            )}
          </p>
        </div>
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg border',
            accentMap[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 border-t border-[#2b3140] pt-2 text-xs">
          <span
            className={cn(
              'font-medium',
              trend.dir === 'up' ? 'text-green-500' : 'text-red-500',
            )}
          >
            {trend.dir === 'up' ? '↑' : '↓'} {trend.pct}
          </span>
          <span className="text-[#8b949e]">vs last poll</span>
        </div>
      )}
    </div>
  )
}

/* ── Section card wrapper ── */
function SectionCard({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string
  icon: typeof Activity
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[#2b3140] bg-[#1e222d] p-5',
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand-500" />
        <h2 className="text-sm font-semibold text-[#e6edf3]">{title}</h2>
      </div>
      {children}
    </div>
  )
}

/* ── Mini progress bar ── */
function MiniBar({ label, value, max, color }: {
  label: string
  value: number
  max: number
  color: string
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#8b949e]">{label}</span>
        <span className="font-mono text-[#e6edf3]">{value.toLocaleString()}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#2b3140]">
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/* ── Latency timeline ── */
function LatencyTimeline() {
  const stages = [
    { label: 'Search', key: 'latency_search_ms', color: 'bg-blue-500' },
    { label: 'Retrieve', key: 'latency_retrieve_ms', color: 'bg-cyan-500' },
    { label: 'Reasoning', key: 'latency_reasoning_ms', color: 'bg-purple-500' },
    { label: 'Conclude', key: 'latency_conclude_ms', color: 'bg-amber-500' },
  ]

  return (
    <div className="space-y-3">
      {stages.map((stage) => (
        <div key={stage.key} className="flex items-center gap-3">
          <span className="w-20 text-xs text-[#8b949e]">{stage.label}</span>
          <div className="flex-1">
            <div className="h-2 overflow-hidden rounded-full bg-[#2b3140]">
              <div
                className={cn('h-full rounded-full', stage.color)}
                style={{ width: '0%' }}
              />
            </div>
          </div>
          <span className="w-16 text-right text-xs font-mono text-[#e6edf3]">
            — ms
          </span>
        </div>
      ))}
      <p className="pt-2 text-center text-xs text-[#8b949e]">
        No Production Data Yet — Connect Honcho Cloud to see live latency
      </p>
    </div>
  )
}

/* ── Empty state ── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2b3140] bg-[#1e222d]">
        <FlaskConical className="h-8 w-8 text-[#8b949e]" />
      </div>
      <h3 className="text-lg font-semibold text-[#e6edf3]">
        No Production Data Yet
      </h3>
      <p className="mt-2 max-w-md text-sm text-[#8b949e]">
        Connect Honcho Cloud to see live runtime metrics, request flows, and
        service status. The dashboard will populate automatically once the API
        is reachable.
      </p>
    </div>
  )
}

/* ── Main component ── */
export default function OverviewPage() {
  const [metrics, setMetrics] = useState<HonchoMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)

  const poll = async () => {
    const result = await fetchMetrics()
    if (result.ok) {
      setMetrics(result.data)
      setConnected(true)
    } else {
      setMetrics(null)
      setConnected(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    poll()
    const interval = setInterval(poll, POLL_MS)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-[#8b949e]">
          <Activity className="h-5 w-5 animate-pulse text-brand-500" />
          <span className="text-sm">Connecting to Honcho Cloud…</span>
        </div>
      </div>
    )
  }

  if (!connected && !metrics) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#e6edf3]">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-[#8b949e]">
            Live Runtime Observability
          </p>
        </div>
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-[#e6edf3]">
            Dashboard Overview
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Live
          </span>
        </div>
        <p className="mt-1 text-sm text-[#8b949e]">
          Live Runtime Observability — auto-refreshes every {POLL_MS / 1000}s
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Zap}
          label="Requests (total)"
          value={metrics?.total_requests?.toLocaleString() ?? '—'}
          accent="brand"
        />
        <KpiCard
          icon={Database}
          label="Memory Used"
          value={metrics?.memory_count?.toLocaleString() ?? '—'}
          unit="entries"
          accent="success"
        />
        <KpiCard
          icon={BarChart3}
          label="Tokens"
          value={metrics?.tokens_total?.toLocaleString() ?? '—'}
          unit="total"
          accent="warning"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Errors"
          value={metrics?.error_count?.toLocaleString() ?? '—'}
          accent={metrics && metrics.error_count > 0 ? 'danger' : 'success'}
        />
      </div>

      {/* ── Details grid ── */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Token breakdown */}
        <SectionCard title="Token Usage" icon={BarChart3}>
          <div className="space-y-3">
            {metrics ? (
              <>
                <MiniBar
                  label="Input"
                  value={metrics.tokens_input}
                  max={metrics.tokens_total || 1}
                  color="bg-blue-500"
                />
                <MiniBar
                  label="Output"
                  value={metrics.tokens_output}
                  max={metrics.tokens_total || 1}
                  color="bg-purple-500"
                />
                <div className="flex items-center justify-between border-t border-[#2b3140] pt-2 text-xs font-semibold text-[#e6edf3]">
                  <span>Total</span>
                  <span className="font-mono">
                    {metrics.tokens_total.toLocaleString()}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-[#8b949e]">No data available</p>
            )}
          </div>
        </SectionCard>

        {/* Errors by type */}
        <SectionCard title="Errors by Type" icon={AlertTriangle}>
          {metrics?.errors_by_type &&
          Object.keys(metrics.errors_by_type).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(metrics.errors_by_type).map(([type, count]) => (
                <div
                  key={type}
                  className="flex items-center justify-between rounded-lg bg-[#0f1117] px-3 py-2"
                >
                  <span className="text-xs font-medium text-[#e6edf3]">
                    {type}
                  </span>
                  <span className="text-xs font-mono font-bold text-red-500">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#8b949e]">
              No errors recorded
            </p>
          )}
        </SectionCard>
      </div>

      {/* ── Latency section ── */}
      <SectionCard title="Request Timeline" icon={Clock}>
        <LatencyTimeline />
      </SectionCard>
    </div>
  )
}
