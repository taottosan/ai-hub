'use client'

export function generateStaticParams() {
  return [
    { name: 'inmemory' },
    { name: 'mem0' },
    { name: 'honcho' },
    { name: 'obsidian' },
    { name: 'skills' },
    { name: 'archive' },
  ]
}

import { ArrowLeft, HardDrive, Database, Server, BookOpen,
  Activity, Cpu, Globe, Layers, Shield, Zap, Clock,
  AlertTriangle, CheckCircle, XCircle, Search, FileText,
  Settings, BarChart3, RefreshCw } from 'lucide-react'
import Link from 'next/link'
  Brain,
  Archive,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Zap,
  BarChart3,
  Layers,
  Search,
  Hash,
  AlertTriangle,
  Timer,
  Gauge,
  Download,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Types ── */

interface Metric {
  label: string
  value: string
  icon: LucideIcon
  color: string
  detail?: string
}

interface BarData {
  label: string
  value: number
  max: number
  color: string
}

interface ProviderDetail {
  id: string
  name: string
  icon: LucideIcon
  description: string
  longDescription: string
  score: string
  total: string
  latency: string
  color: string
  metrics: Metric[]
  bars: BarData[]
  category: string
}

/* ── Full provider dataset ── */

const PROVIDER_DETAILS: Record<string, ProviderDetail> = {
  inmemory: {
    id: 'inmemory',
    name: 'InMemory',
    icon: HardDrive,
    description: 'Gold Standard — reference implementation',
    longDescription:
      'The InMemory provider is the canonical reference implementation and Gold Standard for the Memory Platform. All other providers must pass the same conformance tests and produce identical results. It stores memories in-process with zero network overhead.',
    score: '15',
    total: '15',
    latency: '<1ms',
    color: 'text-success',
    category: 'Memory',
    metrics: [
      { label: 'Conformance', value: '15/15', icon: CheckCircle, color: 'text-success', detail: 'All tests passing' },
      { label: 'Avg Latency', value: '<1ms', icon: Clock, color: 'text-surface-600', detail: 'In-process memory' },
      { label: 'Memory Type', value: 'Volatile', icon: Database, color: 'text-brand-500', detail: 'RAM-based storage' },
      { label: 'Throughput', value: 'High', icon: Zap, color: 'text-accent-500', detail: 'No network bottleneck' },
    ],
    bars: [
      { label: 'Store', value: 100, max: 100, color: 'bg-success' },
      { label: 'Query', value: 100, max: 100, color: 'bg-success' },
      { label: 'Get', value: 100, max: 100, color: 'bg-success' },
      { label: 'Delete', value: 100, max: 100, color: 'bg-success' },
      { label: 'Context', value: 100, max: 100, color: 'bg-success' },
    ],
  },
  mem0: {
    id: 'mem0',
    name: 'Mem0',
    icon: Database,
    description: 'HTTP-based memory provider',
    longDescription:
      'Mem0 provides a remote memory service accessed via HTTP. It passes all 15 conformance tests with an average latency of ~50ms. Ideal for distributed deployments where in-memory storage is not feasible.',
    score: '15',
    total: '15',
    latency: '~50ms',
    color: 'text-brand-500',
    category: 'Memory',
    metrics: [
      { label: 'Conformance', value: '15/15', icon: CheckCircle, color: 'text-success', detail: 'All tests passing' },
      { label: 'Avg Latency', value: '~50ms', icon: Clock, color: 'text-surface-600', detail: 'HTTP round-trip' },
      { label: 'Memory Type', value: 'Remote', icon: Server, color: 'text-brand-500', detail: 'HTTP API' },
      { label: 'Throughput', value: 'Medium', icon: Zap, color: 'text-accent-500', detail: 'Network dependent' },
    ],
    bars: [
      { label: 'Store', value: 100, max: 100, color: 'bg-success' },
      { label: 'Query', value: 100, max: 100, color: 'bg-success' },
      { label: 'Get', value: 100, max: 100, color: 'bg-success' },
      { label: 'Delete', value: 100, max: 100, color: 'bg-success' },
      { label: 'Context', value: 100, max: 100, color: 'bg-success' },
    ],
  },
  honcho: {
    id: 'honcho',
    name: 'Honcho',
    icon: Server,
    description: 'Backend memory service',
    longDescription:
      'Honcho provides a backend-hosted memory service with persistent storage. It passes all conformance tests at ~80ms average latency. Real-world observability data is available for deeper analysis.',
    score: '15',
    total: '15',
    latency: '~80ms',
    color: 'text-accent-500',
    category: 'Memory',
    metrics: [
      { label: 'Conformance', value: '15/15', icon: CheckCircle, color: 'text-success', detail: 'All tests passing' },
      { label: 'Avg Latency', value: '~80ms', icon: Clock, color: 'text-surface-600', detail: 'Service round-trip' },
      { label: 'Cache Hit Rate', value: '87%', icon: Gauge, color: 'text-success', detail: 'Last 24h' },
      { label: 'Error Rate', value: '0.3%', icon: AlertTriangle, color: 'text-warning', detail: 'Last 24h' },
      { label: 'Timeout Rate', value: '0.1%', icon: Timer, color: 'text-warning', detail: 'Last 24h' },
      { label: 'Total Requests', value: '142.3K', icon: Activity, color: 'text-brand-500', detail: 'Last 24h' },
    ],
    bars: [
      { label: 'Requests', value: 142300, max: 200000, color: 'bg-brand-500' },
      { label: 'Cache Hits', value: 123801, max: 142300, color: 'bg-success' },
      { label: 'Avg Latency', value: 80, max: 200, color: 'bg-accent-500' },
      { label: 'Success Rate', value: 99.7, max: 100, color: 'bg-success' },
      { label: 'Uptime', value: 99.95, max: 100, color: 'bg-success' },
    ],
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian',
    icon: BookOpen,
    description: 'Knowledge graph integration',
    longDescription:
      'The Obsidian provider integrates with the Obsidian knowledge base to provide rich context for memory operations. With 43/43 tests passing at ~50ms latency, it is the most extensively tested provider in the platform.',
    score: '43',
    total: '43',
    latency: '~50ms',
    color: 'text-info',
    category: 'Knowledge',
    metrics: [
      { label: 'Conformance', value: '43/43', icon: CheckCircle, color: 'text-success', detail: 'All tests passing' },
      { label: 'Avg Latency', value: '~50ms', icon: Clock, color: 'text-surface-600', detail: 'File system I/O' },
      { label: 'Notes Indexed', value: '2,847', icon: Layers, color: 'text-brand-500', detail: 'Vault size' },
      { label: 'Links Resolved', value: '12.4K', icon: Hash, color: 'text-accent-500', detail: 'Cross-reference count' },
      { label: 'Search Precision', value: '94%', icon: Search, color: 'text-success', detail: 'Top-5 recall' },
    ],
    bars: [
      { label: 'Search', value: 98, max: 100, color: 'bg-success' },
      { label: 'Retrieval', value: 96, max: 100, color: 'bg-success' },
      { label: 'Link Resolve', value: 92, max: 100, color: 'bg-brand-500' },
      { label: 'Context Build', value: 97, max: 100, color: 'bg-success' },
      { label: 'Graph Traversal', value: 90, max: 100, color: 'bg-brand-500' },
    ],
  },
  skills: {
    id: 'skills',
    name: 'Skills',
    icon: Brain,
    description: 'Agent skills matching engine',
    longDescription:
      'The Skills provider evaluates agent skills against incoming requests to find the best match. With 9/9 conformance tests passing at ~80ms latency, it supports 253 loaded skills across 19 categories for fast, accurate skill routing.',
    score: '9',
    total: '9',
    latency: '~80ms',
    color: 'text-warning',
    category: 'Agent',
    metrics: [
      { label: 'Conformance', value: '9/9', icon: CheckCircle, color: 'text-success', detail: 'All tests passing' },
      { label: 'Avg Latency', value: '~80ms', icon: Clock, color: 'text-surface-600', detail: 'Search + rank' },
      { label: 'Skills Loaded', value: '253', icon: Layers, color: 'text-brand-500', detail: 'Active skill registry' },
      { label: 'Categories', value: '19', icon: Hash, color: 'text-accent-500', detail: 'Skill categories' },
      { label: 'Search Time', value: '18ms', icon: Search, color: 'text-success', detail: 'Avg query time' },
    ],
    bars: [
      { label: 'Match Accuracy', value: 96, max: 100, color: 'bg-success' },
      { label: 'Search Time', value: 18, max: 100, color: 'bg-brand-500' },
      { label: 'Coverage', value: 100, max: 100, color: 'bg-success' },
      { label: 'Cache Hit Rate', value: 72, max: 100, color: 'bg-accent-500' },
      { label: 'Utilization', value: 45, max: 100, color: 'bg-brand-500' },
    ],
  },
  archive: {
    id: 'archive',
    name: 'Archive',
    icon: Archive,
    description: 'Long-term archive storage',
    longDescription:
      'The Archive provider manages long-term memory storage with efficient compression and retrieval. All 21 conformance tests pass with sub-millisecond latency, making it ideal for high-volume, low-cost persistent storage of historical data.',
    score: '21',
    total: '21',
    latency: '<1ms',
    color: 'text-surface-500',
    category: 'Storage',
    metrics: [
      { label: 'Conformance', value: '21/21', icon: CheckCircle, color: 'text-success', detail: 'All tests passing' },
      { label: 'Avg Latency', value: '<1ms', icon: Clock, color: 'text-surface-600', detail: 'In-process storage' },
      { label: 'Compression', value: '8.4x', icon: Download, color: 'text-brand-500', detail: 'Avg ratio' },
      { label: 'Retention', value: '90 days', icon: Timer, color: 'text-accent-500', detail: 'Default policy' },
    ],
    bars: [
      { label: 'Store', value: 100, max: 100, color: 'bg-success' },
      { label: 'Query', value: 100, max: 100, color: 'bg-success' },
      { label: 'Compress', value: 95, max: 100, color: 'bg-brand-500' },
      { label: 'Retrieve', value: 100, max: 100, color: 'bg-success' },
      { label: 'Prune', value: 100, max: 100, color: 'bg-success' },
    ],
  },
}

/* ── Sub-components ── */

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon
  return (
    <div className={cn(
      'flex flex-col gap-2 rounded-xl border p-4',
      'border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-900',
    )}>
      <div className="flex items-center gap-2">
        <Icon className={cn('h-4 w-4', metric.color)} aria-hidden="true" />
        <span className="text-xs font-medium text-surface-500 dark:text-surface-400">
          {metric.label}
        </span>
      </div>
      <p className="text-2xl font-bold text-surface-900 dark:text-surface-50">
        {metric.value}
      </p>
      {metric.detail && (
        <p className="text-xs text-surface-400 dark:text-surface-500">
          {metric.detail}
        </p>
      )}
    </div>
  )
}

function BarChart({ bars, title }: { bars: BarData[]; title: string }) {
  return (
    <div className={cn(
      'rounded-xl border p-5',
      'border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-900',
    )}>
      <h3 className="mb-4 text-sm font-semibold text-surface-900 dark:text-surface-50">
        {title}
      </h3>
      <div className="space-y-3">
        {bars.map((bar) => {
          const pct = Math.min((bar.value / bar.max) * 100, 100)
          return (
            <div key={bar.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-surface-600 dark:text-surface-300">
                  {bar.label}
                </span>
                <span className="text-surface-400 dark:text-surface-500">
                  {bar.label === 'Requests' || bar.label === 'Cache Hits'
                    ? (bar.value / 1000).toFixed(1) + 'K'
                    : bar.label === 'Success Rate' || bar.label === 'Uptime'
                    ? bar.value + '%'
                    : bar.label === 'Avg Latency'
                    ? bar.value + 'ms'
                    : bar.value + '%'}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
                <div
                  className={cn('h-full rounded-full transition-all duration-700', bar.color)}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Main page ── */

interface Props {
  params: Promise<{ name: string }>
}

function ProviderIcon({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return <Icon className={className} aria-hidden="true" />
}

export default function ProviderDetailPage({ params }: Props) {
  const { name } = use(params)
  const provider = PROVIDER_DETAILS[name]

  if (!provider) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl font-bold text-surface-300 dark:text-surface-700">
          404
        </div>
        <h1 className="mt-4 text-2xl font-bold text-surface-900 dark:text-surface-50">
          Provider Not Found
        </h1>
        <p className="mt-2 text-surface-500 dark:text-surface-400">
          No provider named &ldquo;{name}&rdquo; exists.
        </p>
        <Link
          href="/dashboard/providers"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Providers
        </Link>
      </div>
    )
  }

  const percentage = (Number(provider.score) / Number(provider.total)) * 100

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/dashboard/providers"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
      >
        <ArrowLeft className="h-4 w-4" />
        All Providers
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            'flex h-14 w-14 items-center justify-center rounded-xl',
            'bg-surface-100 dark:bg-surface-800',
          )}>
            <ProviderIcon icon={provider.icon} className={cn('h-7 w-7', provider.color)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
                {provider.name}
              </h1>
              <span className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium',
                'bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400',
              )}>
                {provider.category}
              </span>
            </div>
            <p className="mt-1 text-surface-500 dark:text-surface-400">
              {provider.longDescription}
            </p>
          </div>
        </div>

        {/* Score badge */}
        <div className={cn(
          'flex shrink-0 flex-col items-center rounded-xl border px-5 py-3',
          'border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-900',
        )}>
          <span className="text-2xl font-bold" style={{
            color: percentage === 100 ? '#1a7b3a' : '#2050d6',
          }}>
            {provider.score}/{provider.total}
          </span>
          <span className="text-xs text-surface-500 dark:text-surface-400">
            Tests Passing
          </span>
        </div>
      </div>

      {/* Latency indicator */}
      <div className="flex items-center gap-2 rounded-lg bg-surface-50 px-4 py-3 text-sm dark:bg-surface-800/50">
        <Clock className="h-4 w-4 text-surface-400" aria-hidden="true" />
        <span className="text-surface-600 dark:text-surface-300">
          Average latency:{' '}
          <strong className="font-semibold text-surface-900 dark:text-surface-50">
            {provider.latency}
          </strong>
        </span>
      </div>

      {/* Metric cards */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-surface-50">
          Metrics
        </h2>
        <div className={cn(
          'grid gap-3',
          provider.metrics.length <= 4
            ? 'grid-cols-2 sm:grid-cols-4'
            : 'grid-cols-2 sm:grid-cols-3',
        )}>
          {provider.metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </section>

      {/* Bar chart */}
      <section>
        <BarChart
          bars={provider.bars}
          title={
            provider.name === 'Honcho'
              ? 'Service Health (24h)'
              : provider.name === 'Skills'
              ? 'Skill Engine Performance'
              : 'Operation Performance'
          }
        />
      </section>
    </div>
  )
}
