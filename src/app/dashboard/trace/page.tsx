'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Database,
  ExternalLink,
  FileText,
  Filter,
  GitBranch,
  Globe,
  HelpCircle,
  Layers,
  Loader2,
  Maximize2,
  Minimize2,
  Play,
  RefreshCw,
  Search,
  Server,
  Share2,
  Shuffle,
  SkipForward,
  SlidersHorizontal,
  Sparkles,
  Timer,
  XCircle,
  Zap,
} from 'lucide-react'

/* ─── Types ─── */

type SpanStatus = 'HIT' | 'MISS' | 'SKIP' | 'FAIL'

interface TraceHop {
  id: string
  label: string
  service: string
  status: SpanStatus
  durationMs: number
  detail?: string
  children?: TraceHop[]
}

interface TraceData {
  id: string
  timestamp: string
  totalDurationMs: number
  spans: TraceHop[]
  metrics: {
    memoryHitRate: number
    knowledgeHitRate: number
    skillHitRate: number
    searchTimeMs: number
    toolTimeMs: number
    answerTimeMs: number
    fallbackCount: number
    admissionCount: number
  }
}

/* ─── Sample Data ─── */

const SAMPLE_TRACE: TraceData = {
  id: '5821',
  timestamp: '2026-07-04T14:32:18.124Z',
  totalDurationMs: 595,
  spans: [
    {
      id: 'router',
      label: 'Router',
      service: 'hermes-router',
      status: 'HIT',
      durationMs: 2,
      detail: 'Matched intent → memory-platform',
      children: [
        {
          id: 'mem',
          label: 'Memory Provider',
          service: 'memory-platform',
          status: 'MISS',
          durationMs: 45,
          detail: 'No prior context found for this query',
        },
        {
          id: 'skills',
          label: 'Skills Engine',
          service: 'skill-resolver',
          status: 'HIT',
          durationMs: 120,
          detail: 'Resolved → media-scanner',
          children: [
            {
              id: 'media-skill',
              label: 'media-scanner',
              service: 'skill:media-scanner',
              status: 'HIT',
              durationMs: 120,
              detail: 'Matched pattern: scan media files',
            },
          ],
        },
        {
          id: 'obsidian',
          label: 'Obsidian Wiki',
          service: 'obsidian-adapter',
          status: 'HIT',
          durationMs: 80,
          detail: '2 files found → agent-orchestrator-study.md, media-scanner.md',
        },
        {
          id: 'firecrawl',
          label: 'Firecrawl',
          service: 'web-adapter',
          status: 'SKIP',
          durationMs: 0,
          detail: 'Skipped — sufficient local context',
        },
        {
          id: 'answer',
          label: 'Answer Generation',
          service: 'llm-router',
          status: 'HIT',
          durationMs: 350,
          detail: 'Generated response from aggregated context',
        },
      ],
    },
  ],
  metrics: {
    memoryHitRate: 0.35,
    knowledgeHitRate: 0.72,
    skillHitRate: 0.88,
    searchTimeMs: 125,
    toolTimeMs: 200,
    answerTimeMs: 350,
    fallbackCount: 1,
    admissionCount: 3,
  },
}

/* ─── Color helpers ─── */

const STATUS_COLORS: Record<SpanStatus, { bg: string; text: string; dot: string }> = {
  HIT: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  MISS: {
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  SKIP: {
    bg: 'bg-surface-100 dark:bg-surface-800',
    text: 'text-surface-500 dark:text-surface-400',
    dot: 'bg-surface-400',
  },
  FAIL: {
    bg: 'bg-red-100 dark:bg-red-900/40',
    text: 'text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
  },
}

const STATUS_ICON: Record<SpanStatus, React.ReactNode> = {
  HIT: <CheckCircle2 className="h-3.5 w-3.5" />,
  MISS: <AlertTriangle className="h-3.5 w-3.5" />,
  SKIP: <SkipForward className="h-3.5 w-3.5" />,
  FAIL: <XCircle className="h-3.5 w-3.5" />,
}

/* ─── Metric Card ─── */

function MetricCard({
  label,
  value,
  subtitle,
  icon,
  trend,
}: {
  label: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}) {
  return (
    <div className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-surface-700 dark:bg-surface-900">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-surface-500 dark:text-surface-400">
          {icon}
          <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        </div>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-semibold',
              trend === 'up' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
              trend === 'down' && 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
              trend === 'neutral' && 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
            )}
          >
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trend === 'neutral' && '→'}
          </span>
        )}
      </div>
      <div className="mt-2">
        <span className="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
          {value}
        </span>
        {subtitle && (
          <p className="mt-0.5 text-2xs text-surface-500 dark:text-surface-400">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

/* ─── Timeline Waterfall ─── */

function TimelineBar({
  durationMs,
  totalMs,
  offsetMs,
  color,
  label,
}: {
  durationMs: number
  totalMs: number
  offsetMs: number
  color: string
  label: string
}) {
  const pctWidth = Math.max((durationMs / totalMs) * 100, 1.5)
  const pctOffset = (offsetMs / totalMs) * 100

  return (
    <div className="relative flex h-7 items-center group">
      {/* Background track */}
      <div className="absolute inset-y-0 left-0 right-0 rounded bg-surface-100 dark:bg-surface-800" />
      {/* The bar */}
      <div
        className={cn(
          'absolute inset-y-1 rounded transition-all group-hover:brightness-110',
          color,
        )}
        style={{
          left: `${pctOffset}%`,
          width: `${pctWidth}%`,
          minWidth: '4px',
        }}
      />
      {/* Label on hover */}
      <span className="relative z-10 ml-1.5 text-2xs font-medium text-surface-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-surface-400">
        {durationMs}ms
      </span>
    </div>
  )
}

/* ─── Span Row ─── */

function SpanRow({
  hop,
  depth,
  totalMs,
  startOffset,
  defaultExpanded,
}: {
  hop: TraceHop
  depth: number
  totalMs: number
  startOffset: number
  defaultExpanded: boolean
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const colors = STATUS_COLORS[hop.status]
  const hasChildren = hop.children && hop.children.length > 0

  /* Compute cumulative offset by summing preceding siblings — for a real app
     you'd track this with an accumulator. For this demo we approximate. */
  const barColor =
    hop.status === 'HIT'
      ? 'bg-emerald-400 dark:bg-emerald-500'
      : hop.status === 'MISS'
        ? 'bg-amber-400 dark:bg-amber-500'
        : hop.status === 'SKIP'
          ? 'bg-surface-300 dark:bg-surface-600'
          : 'bg-red-400 dark:bg-red-500'

  return (
    <>
      <tr
        className={cn(
          'group border-b border-surface-100 transition-colors last:border-0 hover:bg-surface-50/50 dark:border-surface-800 dark:hover:bg-surface-800/50',
          depth > 0 && 'bg-surface-50/30 dark:bg-surface-800/20',
        )}
      >
        {/* Name column */}
        <td className="py-2 pl-3 pr-2">
          <div className="flex items-center gap-1" style={{ paddingLeft: `${depth * 20}px` }}>
            {hasChildren ? (
              <button
                onClick={() => setExpanded(!expanded)}
                className="shrink-0 rounded p-0.5 text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700"
                aria-label={expanded ? 'Collapse' : 'Expand'}
              >
                {expanded ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            ) : (
              <span className="w-4 shrink-0" />
            )}
            <span className="truncate text-sm font-medium text-surface-800 dark:text-surface-200">
              {hop.label}
            </span>
          </div>
        </td>

        {/* Status column */}
        <td className="py-2 px-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-semibold',
              colors.bg,
              colors.text,
            )}
          >
            {STATUS_ICON[hop.status]}
            {hop.status}
          </span>
        </td>

        {/* Service column */}
        <td className="hidden py-2 px-2 text-xs text-surface-500 md:table-cell dark:text-surface-400">
          <code className="rounded bg-surface-100 px-1.5 py-0.5 text-2xs dark:bg-surface-800">
            {hop.service}
          </code>
        </td>

        {/* Timeline bar column */}
        <td className="w-1/3 min-w-[120px] py-2 px-2">
          <TimelineBar
            durationMs={hop.durationMs}
            totalMs={totalMs}
            offsetMs={startOffset}
            color={barColor}
            label={hop.label}
          />
        </td>

        {/* Duration column */}
        <td className="py-2 pl-2 pr-3 text-right">
          <code className="text-xs font-semibold tabular-nums text-surface-700 dark:text-surface-300">
            {hop.durationMs}ms
          </code>
        </td>
      </tr>

      {/* Detail row (expanded) */}
      {expanded && hop.detail && (
        <tr className="border-b border-surface-100 dark:border-surface-800">
          <td
            colSpan={5}
            className="bg-surface-50/50 px-4 py-2 dark:bg-surface-800/30"
            style={{ paddingLeft: `${32 + depth * 20}px` }}
          >
            <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
              <FileText className="h-3 w-3 shrink-0" />
              <span>{hop.detail}</span>
            </div>
          </td>
        </tr>
      )}

      {/* Children (recursive) */}
      {expanded &&
        hasChildren &&
        hop.children!.map((child, idx) => {
          /* Approximate offset: sum prior siblings' durations */
          const priorMs = hop.children!
            .slice(0, idx)
            .reduce((sum, s) => sum + s.durationMs, 0)
          return (
            <SpanRow
              key={child.id}
              hop={child}
              depth={depth + 1}
              totalMs={totalMs}
              startOffset={startOffset + priorMs}
              defaultExpanded={false}
            />
          )
        })}
    </>
  )
}

/* ─── Architecture Diagram ─── */

function ArchitectureDiagram() {
  const [activeBox, setActiveBox] = useState<string | null>(null)
  const [showDesc, setShowDesc] = useState(false)

  const boxes = [
    { id: 'router', label: 'Router', icon: GitBranch, x: 0, y: 0 },
    { id: 'memory', label: 'Memory\nProvider', icon: Database, x: 1, y: 0 },
    { id: 'skills', label: 'Skills\nEngine', icon: Layers, x: 2, y: 0 },
    { id: 'obsidian', label: 'Obsidian\nAdapter', icon: FileText, x: 0, y: 1 },
    { id: 'web', label: 'Web\nAdapter', icon: Globe, x: 1, y: 1 },
    { id: 'llm', label: 'LLM\nRouter', icon: Sparkles, x: 2, y: 1 },
    { id: 'response', label: 'Response', icon: Share2, x: 2, y: 2 },
  ]

  const descriptions: Record<string, string> = {
    router: 'Incoming request → intent classification → route dispatch',
    memory: 'Semantic memory lookup. HIT = prior context found, MISS = cold start',
    skills: 'Skill resolution from query patterns. Resolves → executes matched skill',
    obsidian: 'Obsidian wiki adapter. Queries knowledge base for relevant files',
    web: 'Web search adapter (Firecrawl). Skipped when local context is sufficient',
    llm: 'LLM call to generate final answer from aggregated context',
    response: 'Structured response assembled and returned to caller',
  }

  return (
    <div className="rounded-xl border border-surface-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-surface-800 dark:text-surface-200">
          <Server className="h-4 w-4 text-brand-500" />
          Architecture View
        </h3>
        <button
          onClick={() => setShowDesc(!showDesc)}
          className={cn(
            'rounded-lg px-2.5 py-1 text-2xs font-medium transition-colors',
            showDesc
              ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
              : 'text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800',
          )}
        >
          {showDesc ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Grid */}
      <div className="relative mx-auto max-w-xl">
        {/* SVG connecting lines */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 300 220"
          fill="none"
        >
          {/* Row 0 → Row 0 horizontal */}
          <path
            d="M75 40 L125 40"
            stroke="currentColor"
            className="text-surface-300 dark:text-surface-600"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <path
            d="M175 40 L225 40"
            stroke="currentColor"
            className="text-surface-300 dark:text-surface-600"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          {/* Row 0 → Row 1 vertical */}
          <path
            d="M50 75 L50 110"
            stroke="currentColor"
            className="text-surface-300 dark:text-surface-600"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <path
            d="M150 75 L150 110"
            stroke="currentColor"
            className="text-surface-300 dark:text-surface-600"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <path
            d="M250 75 L250 110"
            stroke="currentColor"
            className="text-surface-300 dark:text-surface-600"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          {/* Row 1 horizontal */}
          <path
            d="M50 140 L100 140"
            stroke="currentColor"
            className="text-surface-300 dark:text-surface-600"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <path
            d="M200 140 L250 140"
            stroke="currentColor"
            className="text-surface-300 dark:text-surface-600"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          {/* Row 1 col2 → Row 2 */}
          <path
            d="M250 175 L250 195"
            stroke="currentColor"
            className="text-surface-300 dark:text-surface-600"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          {/* Row 0 col2 → Row 2 (skip) */}
          <path
            d="M250 40 L250 25"
            stroke="currentColor"
            className="text-surface-300 dark:text-surface-600"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        </svg>

        <div className="grid grid-cols-3 gap-3">
          {boxes.map((box) => {
            const Icon = box.icon
            const isActive = activeBox === box.id
            return (
              <button
                key={box.id}
                onClick={() => setActiveBox(isActive ? null : box.id)}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all',
                  isActive
                    ? 'border-brand-400 bg-brand-50 shadow-md dark:border-brand-500 dark:bg-brand-900/30'
                    : 'border-surface-200 bg-surface-50 hover:border-surface-300 hover:shadow-sm dark:border-surface-700 dark:bg-surface-800 dark:hover:border-surface-600',
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5',
                    isActive
                      ? 'text-brand-500'
                      : 'text-surface-500 dark:text-surface-400',
                  )}
                />
                <span
                  className={cn(
                    'text-2xs font-semibold leading-tight whitespace-pre-line',
                    isActive
                      ? 'text-brand-700 dark:text-brand-300'
                      : 'text-surface-600 dark:text-surface-400',
                  )}
                >
                  {box.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Description panel */}
        {activeBox && showDesc && (
          <div className="mt-4 rounded-lg border border-brand-200 bg-brand-50/50 p-3 text-xs text-brand-800 dark:border-brand-800 dark:bg-brand-900/20 dark:text-brand-200">
            <p className="font-medium">{activeBox.charAt(0).toUpperCase() + activeBox.slice(1)}</p>
            <p className="mt-1 text-brand-600 dark:text-brand-400">{descriptions[activeBox]}</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Main Trace Page ─── */

export default function TracePage() {
  const [trace, setTrace] = useState<TraceData>(SAMPLE_TRACE)
  const [viewMode, setViewMode] = useState<'waterfall' | 'table'>('waterfall')
  const [showArch, setShowArch] = useState(true)
  const [isExplaining, setIsExplaining] = useState(false)
  const [explainOutput, setExplainOutput] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const m = trace.metrics

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(trace, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [trace])

  const handleExplain = useCallback(() => {
    setIsExplaining(true)
    setExplainOutput(null)
    // Simulate explanation generation
    setTimeout(() => {
      setExplainOutput(
        `Trace #${trace.id} Analysis\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `Total Duration: ${trace.totalDurationMs}ms\n\n` +
          `1. Router received request and dispatched to Memory Provider (2ms)\n` +
          `2. Memory: MISS — no prior context for this query (45ms)\n` +
          `3. Skills Engine: HIT → resolved to media-scanner (120ms)\n` +
          `4. Obsidian Wiki: HIT — found 2 relevant files (80ms)\n` +
          `5. Firecrawl: SKIPPED — local context sufficient (0ms)\n` +
          `6. Answer Generation: 350ms via LLM routing\n\n` +
          `Key Observations:\n` +
          `• Memory MISS is expected for cold queries; consider warming with related context\n` +
          `• Skill Hit Rate at 88% — healthy resolution pipeline\n` +
          `• Answer generation dominates at 58.8% of total latency\n` +
          `• 0 failures across 5 hops — clean trace`
      )
      setIsExplaining(false)
    }, 1200)
  }, [trace])

  /* Compute cumulative start offsets for top-level spans */
  let cumulativeOffset = 0
  const spanOffsets: number[] = []
  for (const span of trace.spans) {
    spanOffsets.push(cumulativeOffset)
    cumulativeOffset += span.durationMs
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-30 border-b border-surface-200 bg-white/80 backdrop-blur-md dark:border-surface-800 dark:bg-surface-900/80">
        <div className="mx-auto flex max-w-8xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-700 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <div className="h-5 w-px bg-surface-200 dark:bg-surface-700" />
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand-500" />
              <div>
                <h1 className="text-sm font-semibold text-surface-900 dark:text-surface-50">
                  Trace{' '}
                  <code className="rounded bg-brand-100 px-1.5 py-0.5 text-xs font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                    #{trace.id}
                  </code>
                </h1>
                <p className="text-2xs text-surface-500 dark:text-surface-400">
                  {new Date(trace.timestamp).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'medium',
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold',
                trace.totalDurationMs < 300
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : trace.totalDurationMs < 1000
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
              )}
            >
              <Clock className="h-3 w-3" />
              {trace.totalDurationMs}ms
            </span>

            <button
              onClick={handleCopy}
              className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800 dark:hover:text-surface-300"
              title="Copy trace JSON"
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="mx-auto max-w-8xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* ─── Metrics Grid ─── */}
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              <BarChart3 className="h-3.5 w-3.5" />
              Trace Metrics
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <MetricCard
                label="Memory Hit Rate"
                value={`${(m.memoryHitRate * 100).toFixed(0)}%`}
                subtitle={`${m.memoryHitRate > 0.5 ? 'Warm' : 'Cold'} cache`}
                icon={<Database className="h-3.5 w-3.5" />}
                trend={m.memoryHitRate > 0.5 ? 'up' : 'down'}
              />
              <MetricCard
                label="Knowledge Hit Rate"
                value={`${(m.knowledgeHitRate * 100).toFixed(0)}%`}
                subtitle={`${m.fallbackCount} fallback(s) used`}
                icon={<FileText className="h-3.5 w-3.5" />}
                trend={m.knowledgeHitRate > 0.6 ? 'up' : 'neutral'}
              />
              <MetricCard
                label="Skill Hit Rate"
                value={`${(m.skillHitRate * 100).toFixed(0)}%`}
                subtitle={`${m.admissionCount} admission(s)`}
                icon={<Layers className="h-3.5 w-3.5" />}
                trend={m.skillHitRate > 0.7 ? 'up' : 'neutral'}
              />
              <MetricCard
                label="Search Time"
                value={`${m.searchTimeMs}ms`}
                subtitle="Memory + Obsidian"
                icon={<Search className="h-3.5 w-3.5" />}
                trend={m.searchTimeMs < 200 ? 'up' : 'down'}
              />
              <MetricCard
                label="Tool Time"
                value={`${m.toolTimeMs}ms`}
                subtitle="Skills + Firecrawl"
                icon={<Zap className="h-3.5 w-3.5" />}
                trend={m.toolTimeMs < 300 ? 'up' : 'down'}
              />
            </div>

            {/* Secondary metrics row */}
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricCard
                label="Answer Time"
                value={`${m.answerTimeMs}ms`}
                subtitle="LLM generation"
                icon={<Sparkles className="h-3.5 w-3.5" />}
                trend={m.answerTimeMs < 500 ? 'up' : 'down'}
              />
              <MetricCard
                label="Fallback Count"
                value={`${m.fallbackCount}`}
                subtitle={
                  m.fallbackCount === 0
                    ? 'No fallbacks needed'
                    : `${m.fallbackCount} provider(s) degraded`
                }
                icon={<Shuffle className="h-3.5 w-3.5" />}
                trend={m.fallbackCount === 0 ? 'up' : 'down'}
              />
              <MetricCard
                label="Admission Count"
                value={`${m.admissionCount}`}
                subtitle="Policies passed"
                icon={<Filter className="h-3.5 w-3.5" />}
                trend="neutral"
              />
              <MetricCard
                label="Avg Span"
                value={`${(trace.totalDurationMs / trace.spans.length).toFixed(0)}ms`}
                subtitle={`${trace.spans.length} top-level spans`}
                icon={<Timer className="h-3.5 w-3.5" />}
                trend="neutral"
              />
            </div>
          </section>

          {/* ─── Waterfall / Trace Table ─── */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                <Activity className="h-3.5 w-3.5" />
                Span Timeline
              </h2>
              <div className="flex items-center gap-2">
                {/* View toggle */}
                <div className="inline-flex overflow-hidden rounded-lg border border-surface-200 dark:border-surface-700">
                  <button
                    onClick={() => setViewMode('waterfall')}
                    className={cn(
                      'px-2.5 py-1 text-2xs font-medium transition-colors',
                      viewMode === 'waterfall'
                        ? 'bg-brand-500 text-white'
                        : 'bg-white text-surface-500 hover:bg-surface-50 dark:bg-surface-900 dark:text-surface-400 dark:hover:bg-surface-800',
                    )}
                  >
                    Waterfall
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={cn(
                      'px-2.5 py-1 text-2xs font-medium transition-colors',
                      viewMode === 'table'
                        ? 'bg-brand-500 text-white'
                        : 'bg-white text-surface-500 hover:bg-surface-50 dark:bg-surface-900 dark:text-surface-400 dark:hover:bg-surface-800',
                    )}
                  >
                    Table
                  </button>
                </div>
              </div>
            </div>

            {viewMode === 'waterfall' ? (
              /* ── Waterfall View ── */
              <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white shadow-sm dark:border-surface-700 dark:bg-surface-900">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-100 bg-surface-50/50 text-2xs font-semibold uppercase tracking-wider text-surface-500 dark:border-surface-800 dark:bg-surface-800/50 dark:text-surface-400">
                      <th className="py-2 pl-3 pr-2 text-left">Span</th>
                      <th className="py-2 px-2 text-left">Status</th>
                      <th className="hidden py-2 px-2 text-left md:table-cell">Service</th>
                      <th className="py-2 px-2 text-left">Timeline</th>
                      <th className="py-2 pl-2 pr-3 text-right">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trace.spans.map((span, idx) => (
                      <SpanRow
                        key={span.id}
                        hop={span}
                        depth={0}
                        totalMs={trace.totalDurationMs}
                        startOffset={spanOffsets[idx]}
                        defaultExpanded
                      />
                    ))}
                    {/* Total row */}
                    <tr className="border-t-2 border-surface-200 bg-surface-50/80 dark:border-surface-700 dark:bg-surface-800/50">
                      <td className="py-2.5 pl-3 pr-2">
                        <span className="text-sm font-bold text-surface-800 dark:text-surface-200">
                          Total
                        </span>
                      </td>
                      <td className="py-2.5 px-2" />
                      <td className="hidden py-2.5 px-2 md:table-cell" />
                      <td className="py-2.5 px-2">
                        <TimelineBar
                          durationMs={trace.totalDurationMs}
                          totalMs={trace.totalDurationMs}
                          offsetMs={0}
                          color="bg-brand-400 dark:bg-brand-500"
                          label="Total"
                        />
                      </td>
                      <td className="py-2.5 pl-2 pr-3 text-right">
                        <code className="text-sm font-bold tabular-nums text-brand-600 dark:text-brand-400">
                          {trace.totalDurationMs}ms
                        </code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              /* ── Table View ── */
              <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white shadow-sm dark:border-surface-700 dark:bg-surface-900">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-100 bg-surface-50/50 text-2xs font-semibold uppercase tracking-wider text-surface-500 dark:border-surface-800 dark:bg-surface-800/50 dark:text-surface-400">
                      <th className="py-2.5 pl-3 pr-2 text-left">Span</th>
                      <th className="py-2.5 px-2 text-left">Status</th>
                      <th className="py-2.5 px-2 text-left">Duration</th>
                      <th className="hidden py-2.5 px-2 text-left sm:table-cell">Service</th>
                      <th className="py-2.5 pl-2 pr-3 text-left">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const rows: { hop: TraceHop; depth: number }[] = []
                      function flatten(h: TraceHop, d: number) {
                        rows.push({ hop: h, depth: d })
                        if (h.children) {
                          for (const c of h.children) flatten(c, d + 1)
                        }
                      }
                      for (const s of trace.spans) flatten(s, 0)
                      return rows.map(({ hop, depth }) => {
                        const colors = STATUS_COLORS[hop.status]
                        return (
                          <tr
                            key={hop.id}
                            className="border-b border-surface-100 last:border-0 hover:bg-surface-50/50 dark:border-surface-800 dark:hover:bg-surface-800/50"
                          >
                            <td className="py-2 pl-3 pr-2">
                              <span
                                className="text-sm text-surface-800 dark:text-surface-200"
                                style={{ paddingLeft: `${depth * 16}px` }}
                              >
                                {hop.label}
                              </span>
                            </td>
                            <td className="py-2 px-2">
                              <span
                                className={cn(
                                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-semibold',
                                  colors.bg,
                                  colors.text,
                                )}
                              >
                                {STATUS_ICON[hop.status]}
                                {hop.status}
                              </span>
                            </td>
                            <td className="py-2 px-2">
                              <code className="text-xs font-semibold tabular-nums text-surface-700 dark:text-surface-300">
                                {hop.durationMs}ms
                              </code>
                            </td>
                            <td className="hidden py-2 px-2 sm:table-cell">
                              <code className="rounded bg-surface-100 px-1.5 py-0.5 text-2xs dark:bg-surface-800 text-surface-500 dark:text-surface-400">
                                {hop.service}
                              </code>
                            </td>
                            <td className="py-2 pl-2 pr-3">
                              <span className="text-xs text-surface-500 dark:text-surface-400 line-clamp-1">
                                {hop.detail || '—'}
                              </span>
                            </td>
                          </tr>
                        )
                      })
                    })()}
                    {/* Total row */}
                    <tr className="border-t-2 border-surface-200 bg-surface-50/80 dark:border-surface-700 dark:bg-surface-800/50">
                      <td className="py-2.5 pl-3 pr-2 font-bold text-surface-800 dark:text-surface-200">
                        Total
                      </td>
                      <td className="py-2.5 px-2" />
                      <td className="py-2.5 px-2">
                        <code className="text-sm font-bold tabular-nums text-brand-600 dark:text-brand-400">
                          {trace.totalDurationMs}ms
                        </code>
                      </td>
                      <td className="hidden py-2.5 px-2 sm:table-cell" />
                      <td className="py-2.5 pl-2 pr-3" />
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ─── Two-column: Architecture + Explain ─── */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Architecture Diagram */}
            {showArch && <ArchitectureDiagram />}

            {/* Explain / Replay panel */}
            <div className="rounded-xl border border-surface-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-900">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-surface-800 dark:text-surface-200">
                  <HelpCircle className="h-4 w-4 text-brand-500" />
                  Explain This Trace
                </h3>
                <button
                  onClick={() => setShowArch(!showArch)}
                  className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800 dark:hover:text-surface-300"
                  title={showArch ? 'Hide architecture' : 'Show architecture'}
                >
                  {showArch ? (
                    <Minimize2 className="h-3.5 w-3.5" />
                  ) : (
                    <Maximize2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              <button
                onClick={handleExplain}
                disabled={isExplaining}
                className={cn(
                  'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all',
                  isExplaining
                    ? 'bg-surface-200 text-surface-400 dark:bg-surface-700 dark:text-surface-500 cursor-not-allowed'
                    : 'bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.98]',
                )}
              >
                {isExplaining ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing trace…
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Explain This Answer{' '}
                    <kbd className="ml-1 rounded bg-white/20 px-1.5 py-0.5 text-2xs font-mono">
                      Replay
                    </kbd>
                  </>
                )}
              </button>

              {/* Explanation Output */}
              {explainOutput && (
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Trace Analysis Complete
                    </div>
                    <div className="mt-2 text-xs text-surface-600 dark:text-surface-400">
                      <p>
                        All <strong>5 hops</strong> completed with <strong>0 failures</strong>.
                        Total latency{' '}
                        <strong className="text-brand-600 dark:text-brand-400">
                          {trace.totalDurationMs}ms
                        </strong>
                        .
                      </p>
                    </div>
                  </div>

                  <pre className="overflow-x-auto rounded-lg bg-surface-950 p-4 text-xs leading-relaxed text-surface-200">
                    {explainOutput}
                  </pre>
                </div>
              )}

              {/* Before-explanation placeholder */}
              {!explainOutput && !isExplaining && (
                <div className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-surface-200 py-8 text-center dark:border-surface-700">
                  <Play className="mb-2 h-8 w-8 text-surface-300 dark:text-surface-600" />
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    Click &quot;Explain This Answer&quot; to replay and analyze
                  </p>
                  <p className="mt-1 text-2xs text-surface-400 dark:text-surface-500">
                    Shows step-by-step breakdown of how this trace was resolved
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ─── Distribution Summary ─── */}
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Latency Distribution
            </h2>
            <div className="rounded-xl border border-surface-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-900">
              <div className="space-y-3">
                {trace.spans.map((span) => {
                  const pct = ((span.durationMs / trace.totalDurationMs) * 100).toFixed(1)
                  const colors = STATUS_COLORS[span.status]
                  return (
                    <div key={span.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={cn('h-2 w-2 rounded-full', colors.dot)} />
                          <span className="font-medium text-surface-700 dark:text-surface-300">
                            {span.label}
                          </span>
                        </div>
                        <span className="tabular-nums text-surface-500 dark:text-surface-400">
                          {span.durationMs}ms{' '}
                          <span className="text-2xs">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            span.status === 'HIT'
                              ? 'bg-emerald-400 dark:bg-emerald-500'
                              : span.status === 'MISS'
                                ? 'bg-amber-400 dark:bg-amber-500'
                                : span.status === 'SKIP'
                                  ? 'bg-surface-300 dark:bg-surface-600'
                                  : 'bg-red-400 dark:bg-red-500',
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {span.children &&
                        span.children.map((child) => {
                          const childPct = (
                            (child.durationMs / trace.totalDurationMs) *
                            100
                          ).toFixed(1)
                          const childColors = STATUS_COLORS[child.status]
                          return (
                            <div
                              key={child.id}
                              className="ml-4 flex items-center justify-between text-2xs"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className={cn('h-1.5 w-1.5 rounded-full', childColors.dot)} />
                                <span className="text-surface-500 dark:text-surface-400">
                                  └ {child.label}
                                </span>
                              </div>
                              <span className="tabular-nums text-surface-400 dark:text-surface-500">
                                {child.durationMs}ms ({childPct}%)
                              </span>
                            </div>
                          )
                        })}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
