'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  MessageSquare,
  CheckCircle,
  HelpCircle,
  XCircle,
  RefreshCw,
  Clock,
  Sparkles,
  ChevronRight,
  FlaskConical,
  Database,
  Brain,
  Server,
  Zap,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchLatestFlow, NO_DATA } from '@/lib/honcho'
import type { HonchoFlow, HonchoFlowEntry } from '@/lib/honcho'

/* ── Honcho Cloud Pipeline Stages ── */
interface StageDef {
  id: string
  label: string
  icon: typeof Brain
  description: string
}

const HONCHO_STAGES: StageDef[] = [
  { id: 'user_request', label: 'User Request', icon: MessageSquare, description: 'Parse and validate incoming request' },
  { id: 'session',      label: 'Session',      icon: Database,      description: 'Load or create Honcho session' },
  { id: 'honcho_search', label: 'Honcho Search', icon: Search,     description: 'Search Honcho cloud memory' },
  { id: 'hit_miss',     label: 'HIT / MISS',   icon: Activity,     description: 'Evaluate memory relevance' },
  { id: 'memory_llm',   label: 'Memory → LLM', icon: Brain,        description: 'Augment LLM with retrieved context' },
  { id: 'response',     label: 'Response',      icon: Sparkles,     description: 'Stream final response' },
  { id: 'honcho_conclude', label: 'Honcho Conclude', icon: Zap,    description: 'Store interaction in Honcho' },
  { id: 'maintenance',  label: 'Maintenance',   icon: Server,       description: 'Post-processing queue' },
]

/* ── Pipeline step status mapping ── */
function statusForStep(step: string, entries: HonchoFlowEntry[]): {
  status: 'idle' | 'ok' | 'miss' | 'error'
  latency: number | null
} {
  const match = entries.find((e) => e.step === step)
  if (!match) return { status: 'idle', latency: null }

  if (match.status === 'ok') return { status: 'ok', latency: match.latency_ms }
  if (match.status === 'miss') return { status: 'miss', latency: match.latency_ms }
  return { status: 'error', latency: match.latency_ms }
}

/* ── Step badge ── */
function StepBadge({ status }: { status: string }) {
  if (status === 'idle') return null

  const config: Record<string, { icon: typeof CheckCircle; className: string; label: string }> = {
    ok:    { icon: CheckCircle, className: 'text-green-500', label: 'OK' },
    miss:  { icon: HelpCircle,  className: 'text-orange-500', label: 'MISS' },
    error: { icon: XCircle,     className: 'text-red-500', label: 'ERROR' },
  }
  const c = config[status] ?? config.error

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold" aria-label={c.label}>
      <c.icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span className={c.className}>{c.label}</span>
    </span>
  )
}

/* ── Status dot ── */
function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    idle:  'bg-[#2b3140]',
    ok:    'bg-green-500',
    miss:  'bg-orange-500',
    error: 'bg-red-500',
  }
  return (
    <span
      className={cn('inline-block h-2.5 w-2.5 rounded-full', colors[status] ?? colors.idle)}
      aria-hidden="true"
    />
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
        Connect Honcho Cloud to see real-time request flows through the
        pipeline. The dashboard will populate automatically once the API
        is reachable.
      </p>
    </div>
  )
}

/* ── Main component ── */
export default function RuntimeFlowPage() {
  const [flow, setFlow] = useState<HonchoFlow | null>(null)
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    const result = await fetchLatestFlow()
    if (result.ok) {
      setFlow(result.data)
      setConnected(true)
    } else {
      setFlow(null)
      setConnected(false)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 15_000)
    return () => clearInterval(interval)
  }, [fetchData])

  /* ── Loading state ── */
  if (loading && !flow) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#e6edf3]">
            Runtime Flow
          </h1>
          <p className="mt-1 text-sm text-[#8b949e]">
            Honcho Cloud Pipeline Stages
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

  /* ── Empty / not connected ── */
  if (!connected && !flow) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#e6edf3]">
            Runtime Flow
          </h1>
          <p className="mt-1 text-sm text-[#8b949e]">
            Honcho Cloud Pipeline Stages
          </p>
        </div>
        <EmptyState />
      </div>
    )
  }

  const steps = flow?.steps ?? []

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-[#e6edf3]">
            Runtime Flow
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            {connected ? 'Live' : 'Reconnecting…'}
          </span>
        </div>
        <p className="mt-1 text-sm text-[#8b949e]">
          Honcho Cloud Pipeline Stages
        </p>
      </div>

      {/* ── Controls ── */}
      <div className="mb-6 flex items-center gap-3">
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

        {flow && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1e222d] px-2.5 py-0.5 text-xs font-medium text-[#8b949e]">
            <Clock className="h-3 w-3" />
            {flow.total_latency_ms}ms total
          </span>
        )}
      </div>

      {/* ── Query display ── */}
      {flow?.query && (
        <div className="mb-6 rounded-lg border border-[#2b3140] bg-[#1e222d] p-3">
          <div className="flex items-start gap-3">
            <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-[#8b949e]" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-[#8b949e]">Query</p>
              <p className="mt-0.5 text-sm text-[#e6edf3]">
                &ldquo;{flow.query}&rdquo;
              </p>
            </div>
            <span className="ml-auto shrink-0 text-xs text-[#8b949e]">
              {flow.session_id && `session: ${flow.session_id.slice(0, 12)}…`}
            </span>
          </div>
        </div>
      )}

      {/* ── Pipeline visualization ── */}
      <div className="rounded-xl border border-[#2b3140] bg-[#1e222d] p-6">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#e6edf3]">
            Honcho Cloud Pipeline
          </h2>
          <span className="rounded-md bg-[#0f1117] px-2 py-0.5 text-[10px] font-mono text-[#8b949e]">
            {steps.length}/{HONCHO_STAGES.length} stages
          </span>
        </div>

        {/* Step cards */}
        <div className="flex flex-wrap items-start justify-center gap-2 sm:gap-3">
          {HONCHO_STAGES.map((stage, idx) => {
            const { status, latency } = statusForStep(stage.id, steps)
            const Icon = stage.icon
            const isLast = idx === HONCHO_STAGES.length - 1

            const statusBorder: Record<string, string> = {
              idle:  'border-[#2b3140] bg-[#1e222d]',
              ok:    'border-green-500/50 bg-green-500/5',
              miss:  'border-orange-500/50 bg-orange-500/5',
              error: 'border-red-500/50 bg-red-500/5',
            }

            const statusIcon: Record<string, string> = {
              idle:  'text-[#4a5260]',
              ok:    'text-green-500',
              miss:  'text-orange-500',
              error: 'text-red-500',
            }

            return (
              <div key={stage.id} className="flex items-center gap-2 sm:gap-3">
                <div
                  className={cn(
                    'flex min-w-[90px] flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all sm:min-w-[110px] sm:p-4',
                    statusBorder[status],
                  )}
                  role="region"
                  aria-label={`${stage.label}: ${status}`}
                >
                  <Icon className={cn('h-5 w-5 sm:h-6 sm:w-6', statusIcon[status])} aria-hidden="true" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8b949e] sm:text-xs">
                    {stage.label}
                  </span>
                  <StepBadge status={status} />
                  {latency !== null && (
                    <span className="text-[10px] tabular-nums text-[#8b949e]">{latency}ms</span>
                  )}
                </div>

                {!isLast && (
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#4a5260] sm:h-5 sm:w-5" aria-hidden="true" />
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[#2b3140] pt-4 text-xs text-[#8b949e]">
          <span className="font-medium text-[#e6edf3]">Status:</span>
          <span className="inline-flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
            OK — step completed
          </span>
          <span className="inline-flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5 text-orange-500" />
            MISS — no relevant data
          </span>
          <span className="inline-flex items-center gap-1">
            <XCircle className="h-3.5 w-3.5 text-red-500" />
            ERROR — step failed
          </span>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  )
}
