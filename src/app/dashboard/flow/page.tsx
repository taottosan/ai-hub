'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Brain,
  Search,
  BookOpen,
  FileText,
  Wrench,
  MessageSquare,
  CheckCircle,
  HelpCircle,
  XCircle,
  RefreshCw,
  Clock,
  Sparkles,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Types ── */

type HopStatus = 'idle' | 'running' | 'hit' | 'miss' | 'fail'

interface Hop {
  id: string
  label: string
  icon: typeof Brain
  description: string
  status: HopStatus
  latency: number | null
}

interface Trace {
  id: string
  timestamp: string
  hops: Hop[]
  totalLatency: number
  question: string
}

/* ── Hop definitions ── */

const HOP_CONFIG: Omit<Hop, 'status' | 'latency'>[] = [
  { id: 'question', label: 'Question', icon: MessageSquare, description: 'Parse and embed user input' },
  { id: 'memory',   label: 'Memory',   icon: Search,      description: 'Query vector store for relevant memories' },
  { id: 'skills',   label: 'Skills',   icon: Brain,       description: 'Match agent skills to request' },
  { id: 'obsidian', label: 'Obsidian', icon: BookOpen,    description: 'Search knowledge graph for context' },
  { id: 'tool',     label: 'Tool',     icon: Wrench,      description: 'Execute external tool calls' },
  { id: 'answer',   label: 'Answer',   icon: Sparkles,    description: 'Assemble and return final response' },
]

const EXAMPLE_QUESTIONS = [
  'How do I configure memory retention policies?',
  'What providers are supported in phase 3?',
  'Show me the ADR for context budgeting',
  'Explain the policy engine architecture',
  'How does Obsidian integration work?',
]

/* ── Random helpers ── */

function randomLatency(min = 80, max = 600): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickQuestion(): string {
  return EXAMPLE_QUESTIONS[Math.floor(Math.random() * EXAMPLE_QUESTIONS.length)]
}

function generateId(): string {
  return `trace-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

function randomOutcome(weights = { hit: 0.65, miss: 0.25, fail: 0.10 }): HopStatus {
  const r = Math.random()
  if (r < weights.hit) return 'hit'
  if (r < weights.hit + weights.miss) return 'miss'
  return 'fail'
}

/* ── Hop badge rendering ── */

function HopBadge({ status }: { status: HopStatus }) {
  if (status === 'idle') return null

  const config = {
    running: { Icon: Loader2,  className: 'text-brand-500 animate-spin',             label: '…' },
    hit:     { Icon: CheckCircle, className: 'text-success',                         label: 'HIT' },
    miss:    { Icon: HelpCircle,  className: 'text-warning',                         label: 'MISS' },
    fail:    { Icon: XCircle,     className: 'text-danger',                          label: 'FAIL' },
  }[status]

  const { Icon, className, label } = config

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold" aria-label={label}>
      <Icon className={cn('h-3.5 w-3.5', className)} aria-hidden="true" />
      <span className={className}>{label}</span>
    </span>
  )
}

/* ── Status dot ── */

function StatusDot({ status }: { status: HopStatus }) {
  const colors: Record<HopStatus, string> = {
    idle:    'bg-surface-300 dark:bg-surface-600',
    running: 'bg-brand-500 animate-pulse',
    hit:     'bg-success',
    miss:    'bg-warning',
    fail:    'bg-danger',
  }
  return (
    <span
      className={cn('inline-block h-2.5 w-2.5 rounded-full', colors[status])}
      aria-hidden="true"
    />
  )
}

/* ── Main component ── */

export default function RequestFlowPage() {
  const [currentTrace, setCurrentTrace] = useState<Omit<Trace, 'hops'> | null>(null)
  const [traces, setTraces] = useState<Trace[]>([])
  const [running, setRunning] = useState(false)
  const [explaining, setExplaining] = useState<string | null>(null)
  const pipelineRef = useRef<HTMLDivElement>(null)

  // Reset all hops to idle
  function idleHops(): Hop[] {
    return HOP_CONFIG.map(h => ({ ...h, status: 'idle' as HopStatus, latency: null }))
  }

  // Run a new trace with animation
  const runTrace = useCallback(async () => {
    if (running) return
    setRunning(true)
    setExplaining(null)

    const traceId = generateId()
    const question = pickQuestion()
    const hops = idleHops()
    let totalLatency = 0

    setCurrentTrace({ id: traceId, timestamp: new Date().toLocaleTimeString(), question, totalLatency })

    for (let i = 0; i < hops.length; i++) {
      // Mark current hop as running
      hops[i].status = 'running'
      setTraces(prev => {
        const copy = [...prev]
        if (copy.length > 0 && copy[copy.length - 1]?.id === traceId) {
          copy[copy.length - 1] = { ...copy[copy.length - 1], hops: [...hops] }
        }
        return copy
      })

      // Simulate processing delay
      const latency = randomLatency(200, 700)
      await new Promise(resolve => setTimeout(resolve, latency))

      // Determine outcome
      // Last hop (answer) always hits
      const status: HopStatus = i === hops.length - 1 ? 'hit' : randomOutcome()
      hops[i] = { ...hops[i], status, latency }
      totalLatency += latency

      // Update displayed trace
      setTraces(prev => {
        const copy = [...prev]
        const existing = copy.find(t => t.id === traceId)
        if (existing) {
          Object.assign(existing, { hops: [...hops], totalLatency })
        } else {
          copy.push({ id: traceId, timestamp: new Date().toLocaleTimeString(), hops: [...hops], totalLatency, question })
        }
        return [...copy]
      })

      // Scroll pipeline into view on first hop
      if (i === 0) {
        pipelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }

    setRunning(false)
  }, [running])

  // Clear all traces
  function clearTraces() {
    setTraces([])
    setCurrentTrace(null)
    setExplaining(null)
  }

  // Generate explanation for a trace
  function toggleExplain(traceId: string) {
    setExplaining(prev => prev === traceId ? null : traceId)
  }

  // The most recent trace (for the live pipeline display)
  const latestTrace = traces.length > 0 ? traces[traces.length - 1] : null

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
            Request Flow
          </h1>
          <p className="mt-2 text-surface-500 dark:text-surface-400">
            Real-time trace visualization — watch a request flow through Memory → Skills → Obsidian → Tool → Answer
          </p>
        </div>

        {/* ── Pipeline visualization ── */}
        <div ref={pipelineRef} className="mb-8">
          <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900">
            {/* Pipeline header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  Pipeline
                </h2>
                {latestTrace && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium text-surface-600 dark:bg-surface-800 dark:text-surface-300">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {latestTrace.totalLatency}ms
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={runTrace}
                  disabled={running}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-all',
                    running
                      ? 'cursor-not-allowed bg-surface-200 text-surface-400 dark:bg-surface-700 dark:text-surface-500'
                      : 'bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.97] dark:bg-brand-600 dark:hover:bg-brand-500'
                  )}
                >
                  <RefreshCw className={cn('h-4 w-4', running && 'animate-spin')} aria-hidden="true" />
                  {running ? 'Tracing…' : 'New Request'}
                </button>

                {traces.length > 0 && (
                  <button
                    onClick={clearTraces}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-surface-500 hover:bg-surface-100 hover:text-surface-700 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-200"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Question display */}
            {latestTrace && (
              <div className="mb-6 rounded-lg bg-surface-50 p-3 dark:bg-surface-800/50">
                <div className="flex items-start gap-3">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-surface-400" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-surface-400">Request</p>
                    <p className="mt-0.5 text-sm text-surface-700 dark:text-surface-200">
                      &ldquo;{latestTrace.question}&rdquo;
                    </p>
                  </div>
                  <span className="ml-auto shrink-0 text-xs text-surface-400">{latestTrace.timestamp}</span>
                </div>
              </div>
            )}

            {/* Pipeline hops — horizontal layout */}
            <div className="flex items-start justify-center gap-1 sm:gap-2">
              {(latestTrace?.hops ?? idleHops()).map((hop, idx) => {
                const Icon = hop.icon
                const isActive = hop.status !== 'idle'
                const isLast = idx === HOP_CONFIG.length - 1
                const statusColors: Record<HopStatus, string> = {
                  idle:    'border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-800',
                  running: 'border-brand-400 bg-brand-50 shadow-[0_0_0_2px_rgba(32,80,214,0.15)] dark:bg-brand-900/20 dark:shadow-[0_0_0_2px_rgba(32,80,214,0.3)]',
                  hit:     'border-success bg-success/5 dark:bg-success/10',
                  miss:    'border-warning bg-warning/5 dark:bg-warning/10',
                  fail:    'border-danger bg-danger/5 dark:bg-danger/10',
                }

                return (
                  <div key={hop.id} className="flex items-center gap-1 sm:gap-2">
                    {/* Hop card */}
                    <div
                      className={cn(
                        'flex min-w-[80px] flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all duration-300 sm:min-w-[100px] sm:p-4',
                        statusColors[hop.status],
                        isActive && hop.status !== 'running' && 'shadow-sm',
                      )}
                      role="region"
                      aria-label={`${hop.label}: ${hop.status === 'idle' ? 'waiting' : hop.status}`}
                    >
                      <div className="relative">
                        <Icon
                          className={cn(
                            'h-5 w-5 sm:h-6 sm:w-6',
                            hop.status === 'idle' && 'text-surface-400',
                            hop.status === 'running' && 'text-brand-500',
                            hop.status === 'hit' && 'text-success',
                            hop.status === 'miss' && 'text-warning',
                            hop.status === 'fail' && 'text-danger',
                          )}
                          aria-hidden="true"
                        />
                        {/* Running spinner overlay */}
                        {hop.status === 'running' && (
                          <span className="absolute -right-1 -top-1 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-500" />
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 sm:text-xs">
                        {hop.label}
                      </span>

                      {/* Status badge */}
                      <HopBadge status={hop.status} />

                      {/* Latency */}
                      {hop.latency !== null && (
                        <span className="text-[10px] tabular-nums text-surface-400">
                          {hop.latency}ms
                        </span>
                      )}
                    </div>

                    {/* Arrow connector */}
                    {!isLast && (
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 shrink-0 sm:h-5 sm:w-5',
                          hop.status !== 'idle'
                            ? 'text-brand-400 animate-pulse-once'
                            : 'text-surface-300 dark:text-surface-600'
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-surface-100 pt-4 text-xs text-surface-500 dark:border-surface-800 dark:text-surface-400">
              <span className="font-medium">Status:</span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                HIT — memory found
              </span>
              <span className="inline-flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
                MISS — memory not found
              </span>
              <span className="inline-flex items-center gap-1">
                <XCircle className="h-3.5 w-3.5 text-danger" aria-hidden="true" />
                FAIL — error occurred
              </span>
            </div>

            {/* Initial empty state */}
            {!latestTrace && (
              <div className="py-12 text-center">
                <Search className="mx-auto h-10 w-10 text-surface-300 dark:text-surface-600" aria-hidden="true" />
                <p className="mt-3 text-sm text-surface-400">
                  Click <strong>New Request</strong> to start a live trace visualization
                </p>
                <p className="text-xs text-surface-300 dark:text-surface-500">
                  Each request animates through the 6 stages of the Memory Platform pipeline
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Trace history ── */}
        {traces.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                Trace History
              </h2>
              <span className="text-xs text-surface-400">{traces.length} trace{traces.length !== 1 ? 's' : ''}</span>
            </div>

            {[...traces].reverse().map(trace => (
              <div
                key={trace.id}
                className={cn(
                  'rounded-xl border bg-white p-4 shadow-sm transition-all dark:bg-surface-900',
                  trace.id === latestTrace?.id
                    ? 'border-brand-300 dark:border-brand-700'
                    : 'border-surface-200 dark:border-surface-800'
                )}
              >
                {/* Trace header */}
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-surface-400">{trace.id}</span>
                    {trace.id === latestTrace?.id && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                        Latest
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-surface-400">{trace.timestamp} · {trace.totalLatency}ms total</span>
                </div>

                {/* Hops summary */}
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {trace.hops.map(hop => (
                    <div
                      key={hop.id}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium',
                        hop.status === 'hit'  && 'bg-success/10 text-success',
                        hop.status === 'miss' && 'bg-warning/10 text-warning',
                        hop.status === 'fail' && 'bg-danger/10 text-danger',
                        hop.status === 'idle' && 'bg-surface-100 text-surface-400 dark:bg-surface-800',
                        hop.status === 'running' && 'bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400',
                      )}
                    >
                      <StatusDot status={hop.status} />
                      {hop.label}
                      {hop.latency !== null && (
                        <span className="opacity-70">({hop.latency}ms)</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Question */}
                <p className="mb-3 text-sm text-surface-600 dark:text-surface-300">
                  &ldquo;{trace.question}&rdquo;
                </p>

                {/* Explain button */}
                <button
                  onClick={() => toggleExplain(trace.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-surface-200 bg-surface-50 px-3 py-1.5 text-xs font-medium text-surface-600 transition-colors hover:bg-surface-100 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700"
                >
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  {explaining === trace.id ? 'Hide Explanation' : 'Explain This Answer'}
                </button>

                {/* Explanation panel */}
                {explaining === trace.id && (
                  <div className="mt-3 rounded-lg border border-surface-200 bg-surface-50 p-4 text-sm leading-relaxed text-surface-700 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300">
                    <ExplainThisAnswer trace={trace} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Explain This Answer component ── */

function ExplainThisAnswer({ trace }: { trace: Trace }) {
  const hopResults = trace.hops.map(h => {
    if (h.status === 'hit')  return `${h.label}: ✅ Found (${h.latency}ms) — cached/matched successfully`
    if (h.status === 'miss') return `${h.label}: ❓ Not found (${h.latency}ms) — no relevant data; fell through`
    if (h.status === 'fail') return `${h.label}: ❌ Error (${h.latency}ms) — connection timeout or provider error`
    return `${h.label}: ⏳ Skipped`
  })

  return (
    <div className="space-y-3">
      <p className="font-medium text-surface-900 dark:text-surface-100">
        Trace Execution Summary
      </p>

      <ol className="space-y-1.5">
        {hopResults.map((result, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs">
            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-surface-200 text-[10px] font-bold text-surface-500 dark:bg-surface-700 dark:text-surface-400">
              {idx + 1}
            </span>
            <span>{result}</span>
          </li>
        ))}
      </ol>

      <div className="rounded-lg border border-surface-200 bg-white p-3 text-xs dark:border-surface-700 dark:bg-surface-900">
        <p className="mb-1 font-medium text-surface-900 dark:text-surface-100">How This Trace Was Built</p>
        <p className="text-surface-600 dark:text-surface-400">
          Each incoming request follows a deterministic pipeline. First, the <strong>Question</strong> is parsed and embedded.
          The <strong>Memory</strong> hop queries the vector store for semantically similar past interactions.
          <strong> Skills</strong> matches the request against registered agent capabilities.
          <strong> Obsidian</strong> pulls knowledge graph context. If needed, a <strong>Tool</strong> executes external
          calls (APIs, file reads). Finally, the <strong>Answer</strong> hop assembles everything into a coherent response.
          Every hop records its latency and status, enabling debugging at a glance.
        </p>
        <p className="mt-2 text-surface-500 dark:text-surface-400">
          Total pipeline time: <strong>{trace.totalLatency}ms</strong>
        </p>
      </div>
    </div>
  )
}
