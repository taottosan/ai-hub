'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FlaskConical,
  HelpCircle,
  RefreshCw,
  Search,
  Server,
  Sparkles,
  XCircle,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchTraces, NO_DATA } from '@/lib/honcho'
import type { HonchoTrace, HonchoFlowEntry } from '@/lib/honcho'

/* ── Step status icon ── */
function StepStatusIcon({ status }: { status: string }) {
  if (status === 'ok')
    return <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
  if (status === 'miss')
    return <HelpCircle className="h-4 w-4 text-orange-500" aria-hidden="true" />
  return <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
}

/* ── Step row ── */
function StepRow({ step, index }: { step: HonchoFlowEntry; index: number }) {
  return (
    <div className="flex items-start gap-3 py-2">
      {/* Step number */}
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2b3140] text-[10px] font-bold text-[#8b949e]">
        {index + 1}
      </span>

      {/* Connector line */}
      <div className="relative flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StepStatusIcon status={step.status} />
            <span className="text-sm font-medium text-[#e6edf3]">{step.step}</span>
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
                step.status === 'ok' && 'bg-green-500/10 text-green-500',
                step.status === 'miss' && 'bg-orange-500/10 text-orange-500',
                step.status === 'error' && 'bg-red-500/10 text-red-500',
              )}
            >
              {step.status === 'ok' ? 'OK' : step.status === 'miss' ? 'MISS' : 'ERROR'}
            </span>
          </div>
          <span className="text-xs font-mono text-[#8b949e]">{step.latency_ms}ms</span>
        </div>
        {step.started_at && (
          <p className="mt-0.5 text-[11px] text-[#5c6570]">
            {new Date(step.started_at).toLocaleTimeString()}
            {step.completed_at && (
              <> → {new Date(step.completed_at).toLocaleTimeString()}</>
            )}
          </p>
        )}
      </div>
    </div>
  )
}

/* ── Trace card ── */
function TraceCard({ trace }: { trace: HonchoTrace }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl border border-[#2b3140] bg-[#1e222d] transition-all hover:border-[#3b4252]">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <ChevronRight
            className={cn(
              'h-4 w-4 shrink-0 text-[#8b949e] transition-transform',
              expanded && 'rotate-90',
            )}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#e6edf3]">
              {trace.query || '(no query)'}
            </p>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#5c6570]">
                {trace.trace_id?.slice(0, 12)}…
              </span>
              <span className="text-[11px] text-[#5c6570]">·</span>
              <span className="text-[11px] text-[#5c6570]">
                {trace.total_latency_ms}ms
              </span>
              <span className="text-[11px] text-[#5c6570]">·</span>
              <span className="text-[11px] text-[#5c6570]">
                {trace.steps.length} steps
              </span>
            </div>
          </div>
        </div>

        {/* Status summary */}
        <div className="flex shrink-0 items-center gap-1.5">
          {trace.steps.slice(0, 4).map((s, i) => (
            <StepStatusIcon key={i} status={s.status} />
          ))}
          {trace.steps.length > 4 && (
            <span className="text-[10px] text-[#5c6570]">+{trace.steps.length - 4}</span>
          )}
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-[#2b3140] px-4 pb-4">
          {/* Metadata */}
          <div className="flex flex-wrap gap-4 py-3 text-xs text-[#5c6570]">
            {trace.trace_id && (
              <span>Trace: <span className="font-mono text-[#8b949e]">{trace.trace_id}</span></span>
            )}
            {trace.request_id && (
              <span>Request: <span className="font-mono text-[#8b949e]">{trace.request_id}</span></span>
            )}
            {trace.session_id && (
              <span>Session: <span className="font-mono text-[#8b949e]">{trace.session_id}</span></span>
            )}
          </div>

          {/* Timeline */}
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
                Steps
              </span>
            </div>
            <div className="ml-2.5 border-l border-[#2b3140] pl-4">
              {trace.steps.map((step, idx) => (
                <StepRow key={step.id ?? idx} step={step} index={idx} />
              ))}
            </div>
          </div>

          {/* Total latency */}
          <div className="flex items-center justify-between rounded-lg bg-[#0f1117] px-3 py-2 text-xs">
            <span className="text-[#8b949e]">Total Latency</span>
            <span className="font-mono font-bold text-[#e6edf3]">{trace.total_latency_ms}ms</span>
          </div>
        </div>
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
        Connect Honcho Cloud to see real-time request traces with step-by-step
        breakdowns. The dashboard will populate automatically once the API
        is reachable.
      </p>
    </div>
  )
}

/* ── Main component ── */
export default function TracePage() {
  const [traces, setTraces] = useState<HonchoTrace[]>([])
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const result = await fetchTraces(20)
    if (result.ok) {
      setTraces(result.data)
      setConnected(true)
    } else {
      setTraces([])
      setConnected(false)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 15_000)
    return () => clearInterval(interval)
  }, [fetchData])

  if (loading && traces.length === 0 && !connected) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#e6edf3]">
            Event Logs
          </h1>
          <p className="mt-1 text-sm text-[#8b949e]">
            Honcho Cloud Request Traces
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-[#e6edf3]">
            Event Logs
          </h1>
          {connected && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Live
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-[#8b949e]">
          Honcho Cloud Request Traces
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

        {traces.length > 0 && (
          <span className="text-xs text-[#8b949e]">
            {traces.length} trace{traces.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Traces list ── */}
      {!connected && traces.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {traces.map((trace) => (
            <TraceCard key={trace.trace_id} trace={trace} />
          ))}
        </div>
      )}
    </div>
  )
}
