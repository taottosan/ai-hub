'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

/* ── Types ── */

interface ADREntry {
  id: string
  number: number
  title: string
  summary: string
  status: 'accepted' | 'deprecated' | 'superseded' | 'proposed'
  category: string
  icon: string
}

/* ── 12 ADRs ── */

const ADRS: ADREntry[] = [
  {
    id: 'ADR-0001-why-memory-platform',
    number: 1,
    title: 'Why a Memory Platform?',
    summary:
      'Establishes the rationale for a dedicated memory platform separate from model inference. Covers state management, cross-session continuity, and the limitations of stateless LLM APIs.',
    status: 'accepted',
    category: 'Strategy',
    icon: '🎯',
  },
  {
    id: 'ADR-0002-why-single-api',
    number: 2,
    title: 'Why a Single API?',
    summary:
      'Proposes a unified API gateway for all provider interactions. Eliminates provider lock-in, standardizes request/response schemas, and simplifies client integration.',
    status: 'accepted',
    category: 'Architecture',
    icon: '🔀',
  },
  {
    id: 'ADR-0003-why-provider-adapter',
    number: 3,
    title: 'Why a Provider Adapter?',
    summary:
      'Introduces the adapter pattern for multi-provider support. Each provider implements a common interface, enabling seamless switching between OpenAI, Anthropic, Google, and local models.',
    status: 'accepted',
    category: 'Architecture',
    icon: '🔌',
  },
  {
    id: 'ADR-0004-why-event-bus',
    number: 4,
    title: 'Why an Event Bus?',
    summary:
      'Adopts an event-driven architecture for inter-agent communication. Decouples components, enables asynchronous workflows, and supports multi-agent coordination at scale.',
    status: 'accepted',
    category: 'Architecture',
    icon: '📡',
  },
  {
    id: 'ADR-0005-why-mem0-honcho',
    number: 5,
    title: 'Why Mem0 and Honcho?',
    summary:
      'Evaluates memory backends and selects Honcho for production with Mem0 as a lightweight alternative. Compares performance, scalability, and operational complexity.',
    status: 'accepted',
    category: 'Data',
    icon: '🧠',
  },
  {
    id: 'ADR-0006-why-context-builder',
    number: 6,
    title: 'Why a Context Builder?',
    summary:
      'Defines the context builder component that assembles prompts from memory, system instructions, and conversation history. Enables structured context assembly with token budgeting.',
    status: 'accepted',
    category: 'Engineering',
    icon: '📐',
  },
  {
    id: 'ADR-0007-why-policy-engine',
    number: 7,
    title: 'Why a Policy Engine?',
    summary:
      'Introduces a policy engine for governance — PII redaction, content filtering, access control, and compliance rules enforced before data reaches models or memory.',
    status: 'accepted',
    category: 'Security',
    icon: '🛡️',
  },
  {
    id: 'ADR-0008-why-monorepo',
    number: 8,
    title: 'Why a Monorepo?',
    summary:
      'Selects a monorepo structure for the platform. Single source of truth for shared types, unified versioning, simplified CI/CD, and easier cross-component refactoring.',
    status: 'accepted',
    category: 'Engineering',
    icon: '📦',
  },
  {
    id: 'ADR-0009-why-inprocess-eventbus',
    number: 9,
    title: 'Why In-Process Event Bus?',
    summary:
      'Supersedes ADR-004 for single-process deployments. An in-process event bus eliminates network overhead while preserving the event-driven pattern for simpler setups.',
    status: 'accepted',
    category: 'Architecture',
    icon: '⚡',
  },
  {
    id: 'ADR-0010-why-context-budget',
    number: 10,
    title: 'Why a Context Budget?',
    summary:
      'Formalizes context budget management — allocating token limits per request, preventing context overflow, and dynamically adjusting budgets based on task complexity.',
    status: 'accepted',
    category: 'Engineering',
    icon: '💰',
  },
  {
    id: 'ADR-0012-archive-role',
    number: 12,
    title: 'Archive Role',
    summary:
      'Defines the archive role for long-term storage management. Handles data retention policies, compaction schedules, and lifecycle transitions across memory tiers.',
    status: 'accepted',
    category: 'Operations',
    icon: '🗄️',
  },
  {
    id: 'ADR-0011-pending',
    number: 11,
    title: 'ADR-011 (Pending)',
    summary:
      'Reserved for an upcoming architectural decision. The numbering gap will be filled as the platform evolves.',
    status: 'proposed',
    category: 'Pending',
    icon: '📋',
  },
]

const STATUS_META: Record<string, { label: string; className: string }> = {
  accepted:   { label: 'Accepted',   className: 'bg-success/10 text-success border-success/30' },
  deprecated: { label: 'Deprecated', className: 'bg-danger/10 text-danger border-danger/30' },
  superseded: { label: 'Superseded', className: 'bg-warning/10 text-warning border-warning/30' },
  proposed:   { label: 'Proposed',   className: 'bg-info/10 text-info border-info/30' },
}

/* ── Component ── */

export default function ADROverviewPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-surface-500 dark:text-surface-400">
        <Link href="/academy" className="hover:text-brand-500 transition-colors">Academy</Link>
        <span className="mx-2">/</span>
        <span className="text-surface-700 dark:text-surface-200">ADR Overview</span>
      </nav>

      {/* Header */}
      <div className="mb-12 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-3xl dark:bg-brand-900/50">
          📋
        </span>
        <h1 className="mt-4 text-3xl font-bold text-surface-900 dark:text-white">
          Architecture Decision Records
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-surface-500 dark:text-surface-400">
          Every significant architectural decision in the Memory Platform is documented as an ADR.
          These records capture context, alternatives considered, and the rationale behind each choice.
        </p>
      </div>

      {/* Stats bar */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-surface-200 bg-white p-4 text-center dark:border-surface-700 dark:bg-surface-900">
          <p className="text-2xl font-bold text-brand-500">{ADRS.filter((a) => a.status === 'accepted').length}</p>
          <p className="text-xs text-surface-500 dark:text-surface-400">Accepted</p>
        </div>
        <div className="rounded-xl border border-surface-200 bg-white p-4 text-center dark:border-surface-700 dark:bg-surface-900">
          <p className="text-2xl font-bold text-accent-400">{ADRS.filter((a) => a.status === 'proposed').length}</p>
          <p className="text-xs text-surface-500 dark:text-surface-400">Proposed</p>
        </div>
        <div className="rounded-xl border border-surface-200 bg-white p-4 text-center dark:border-surface-700 dark:bg-surface-900">
          <p className="text-2xl font-bold text-surface-700 dark:text-surface-200">{ADRS.length}</p>
          <p className="text-xs text-surface-500 dark:text-surface-400">Total</p>
        </div>
      </div>

      {/* ADR List */}
      <div className="space-y-4">
        {ADRS.map((adr) => {
          const statusMeta = STATUS_META[adr.status]
          const href = adr.number === 11
            ? '#'
            : `/mdx/adr/${adr.id}`

          const isDisabled = adr.number === 11

          return (
            <div
              key={adr.id}
              className={cn(
                'rounded-xl border border-surface-200 bg-white p-5 transition-all dark:border-surface-700 dark:bg-surface-900',
                isDisabled ? 'opacity-60' : 'hover:shadow-md hover:border-brand-300 dark:hover:border-brand-700'
              )}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-100 text-lg dark:bg-surface-800" aria-hidden="true">
                  {adr.icon}
                </span>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-surface-400 dark:text-surface-500">
                      ADR-{String(adr.number).padStart(4, '0')}
                    </span>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-2xs font-semibold ${statusMeta.className}`}>
                      {statusMeta.label}
                    </span>
                    <span className="rounded-full bg-surface-100 px-2 py-0.5 text-2xs font-medium text-surface-500 dark:bg-surface-800 dark:text-surface-400">
                      {adr.category}
                    </span>
                  </div>

                  <h2 className="mt-1 text-lg font-bold text-surface-900 dark:text-white">
                    {isDisabled ? adr.title : (
                      <Link href={href} className="hover:text-brand-500 transition-colors">
                        {adr.title}
                      </Link>
                    )}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-surface-600 dark:text-surface-400">
                    {adr.summary}
                  </p>

                  {!isDisabled && (
                    <Link
                      href={href}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors"
                    >
                      Read full ADR →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-10 text-center text-xs text-surface-400 dark:text-surface-500">
        <Link href="https://github.com/your-org/memory-platform/tree/main/adr" className="hover:text-brand-500 transition-colors">
          View all ADRs on GitHub →
        </Link>
      </p>
    </div>
  )
}
