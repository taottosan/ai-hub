'use client'

import Link from 'next/link'
import {
  Database,
  HardDrive,
  Server,
  BookOpen,
  Brain,
  Archive,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Provider data ── */

interface ProviderSummary {
  id: string
  name: string
  icon: typeof Database
  score: string
  total: string
  latency: string
  description: string
  color: string
}

const PROVIDERS: ProviderSummary[] = [
  {
    id: 'inmemory',
    name: 'InMemory',
    icon: HardDrive,
    score: '15',
    total: '15',
    latency: '<1ms',
    description: 'Gold Standard — reference implementation',
    color: 'text-success',
  },
  {
    id: 'mem0',
    name: 'Mem0',
    icon: Database,
    score: '15',
    total: '15',
    latency: '~50ms',
    description: 'HTTP-based memory provider',
    color: 'text-brand-500',
  },
  {
    id: 'honcho',
    name: 'Honcho',
    icon: Server,
    score: '15',
    total: '15',
    latency: '~80ms',
    description: 'Backend memory service',
    color: 'text-accent-500',
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    icon: BookOpen,
    score: '43',
    total: '43',
    latency: '~50ms',
    description: 'Knowledge graph integration',
    color: 'text-info',
  },
  {
    id: 'skills',
    name: 'Skills',
    icon: Brain,
    score: '9',
    total: '9',
    latency: '~80ms',
    description: 'Agent skills matching engine',
    color: 'text-warning',
  },
  {
    id: 'archive',
    name: 'Archive',
    icon: Archive,
    score: '21',
    total: '21',
    latency: '<1ms',
    description: 'Long-term archive storage',
    color: 'text-surface-500',
  },
]

function ProviderCard({ provider }: { provider: ProviderSummary }) {
  const percentage = (Number(provider.score) / Number(provider.total)) * 100

  return (
    <Link
      href={`/dashboard/providers/${provider.id}`}
      className={cn(
        'group relative flex flex-col gap-4 rounded-xl border p-5 transition-all',
        'border-surface-200 bg-white hover:border-brand-300 hover:shadow-md',
        'dark:border-surface-700 dark:bg-surface-900 dark:hover:border-brand-600',
      )}
    >
      {/* Icon + name row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            'bg-surface-100 dark:bg-surface-800',
          )}>
            <provider.icon className={cn('h-5 w-5', provider.color)} aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-50">
              {provider.name}
            </h3>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              {provider.description}
            </p>
          </div>
        </div>
        <ArrowRight className={cn(
          'h-4 w-4 text-surface-300 transition-transform group-hover:translate-x-0.5',
          'dark:text-surface-600',
        )} aria-hidden="true" />
      </div>

      {/* Score + latency badges */}
      <div className="flex items-center gap-3">
        {/* Score badge */}
        <span className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
          Number(provider.score) === Number(provider.total)
            ? 'bg-success/10 text-success'
            : 'bg-warning/10 text-warning',
        )}>
          <CheckCircle className="h-3 w-3" aria-hidden="true" />
          {provider.score}/{provider.total}
        </span>

        {/* Latency badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-100 px-3 py-1 text-xs font-medium text-surface-600 dark:bg-surface-800 dark:text-surface-300">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {provider.latency}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            percentage === 100 ? 'bg-success' : 'bg-brand-500',
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </Link>
  )
}

export default function ProvidersIndexPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
          Providers
        </h1>
        <p className="mt-2 text-surface-500 dark:text-surface-400">
          Evaluation results for all memory providers across conformance tests.
          Each provider is scored against the Golden Dataset benchmark.
        </p>
      </div>

      {/* Summary row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-surface-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-900">
          <p className="text-2xl font-bold text-surface-900 dark:text-surface-50">6</p>
          <p className="text-xs text-surface-500 dark:text-surface-400">Providers</p>
        </div>
        <div className="rounded-xl border border-surface-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-900">
          <p className="text-2xl font-bold text-success">6/6</p>
          <p className="text-xs text-surface-500 dark:text-surface-400">Passing</p>
        </div>
        <div className="rounded-xl border border-surface-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-900">
          <p className="text-2xl font-bold text-surface-900 dark:text-surface-50">118/118</p>
          <p className="text-xs text-surface-500 dark:text-surface-400">Total Tests</p>
        </div>
      </div>

      {/* Provider grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROVIDERS.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
  )
}
