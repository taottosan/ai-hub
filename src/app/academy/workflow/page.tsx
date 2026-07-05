'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/* ── Types ── */

interface Choice {
  id: string
  label: string
  description: string
  icon: string
}

interface Step {
  id: string
  title: string
  subtitle: string
  choices: Choice[]
}

/* ── Step Data ── */

const STEPS: Step[] = [
  {
    id: 'purpose',
    title: 'Define Your Purpose',
    subtitle: 'What are you building with the Memory Platform?',
    choices: [
      { id: 'chat',        label: 'Conversational AI',    description: 'Persistent memory for chatbots, assistants, and customer support agents',        icon: '💬' },
      { id: 'research',    label: 'Research Assistant',    description: 'Long-term knowledge retrieval for research and analysis workflows',              icon: '🔬' },
      { id: 'agent',       label: 'Autonomous Agent',      description: 'Self-directed AI agents that remember context across sessions and tasks',           icon: '🤖' },
      { id: 'creative',    label: 'Creative Companion',    description: 'Writing, brainstorming, and creative collaboration with session continuity',         icon: '✨' },
      { id: 'enterprise',  label: 'Enterprise Pipeline',   description: 'High-throughput memory for production workloads with compliance requirements',     icon: '🏢' },
    ],
  },
  {
    id: 'architecture',
    title: 'Choose Architecture',
    subtitle: 'How should your system be structured?',
    choices: [
      { id: 'single',      label: 'Single-API Gateway',    description: 'One unified API — all models, one endpoint. Simplest to operate.',                 icon: '🔀' },
      { id: 'multi-agent', label: 'Multi-Agent Mesh',      description: 'Independent agents communicating via event bus. Scales horizontally.',              icon: '🕸️' },
      { id: 'hybrid',      label: 'Hybrid Pipeline',       description: 'Gateway + agent bus combined. Best for complex workflows.',                         icon: '⚡' },
      { id: 'edge',        label: 'Edge-First',            description: 'Local-first with optional cloud sync. Low latency, offline capable.',                icon: '📡' },
      { id: 'legacy',      label: 'Legacy Integration',    description: 'Wrap existing APIs and databases with a memory layer. Minimal refactor.',             icon: '🔌' },
    ],
  },
  {
    id: 'memory',
    title: 'Select Memory Layer',
    subtitle: 'How should memory be stored and retrieved?',
    choices: [
      { id: 'honcho',      label: 'Honcho (Recommended)',  description: 'Production-grade memory server. Semantic search, auto-compaction, user-scoped.',     icon: '🧠' },
      { id: 'mem0',        label: 'Mem0',                  description: 'Lightweight embedding-based memory. Great for prototyping and small deployments.',    icon: '📦' },
      { id: 'file',        label: 'File-Based',            description: 'Simple JSON/Markdown persistence. No dependencies, best for demos.',                 icon: '📄' },
      { id: 'hybrid-mem',  label: 'Hybrid Memory',         description: 'Honcho backend + file-based cache. Balances performance with durability.',           icon: '🔄' },
      { id: 'custom',      label: 'Custom Provider',       description: 'Bring your own storage backend via the provider adapter interface.',                  icon: '🔧' },
    ],
  },
  {
    id: 'context',
    title: 'Configure Context',
    subtitle: 'How much context should your system retain?',
    choices: [
      { id: 'tight',       label: 'Tight (2K tokens)',     description: 'Fast, focused responses. Best for simple Q&A and chatbots.',                        icon: '🎯' },
      { id: 'balanced',    label: 'Balanced (8K tokens)',  description: 'Good balance of speed and depth. Recommended for most use cases.',                   icon: '⚖️' },
      { id: 'generous',    label: 'Generous (32K tokens)', description: 'Richer context for complex reasoning and long-form analysis.',                       icon: '📚' },
      { id: 'extreme',     label: 'Extreme (128K+ tokens)',description: 'Maximum context for document-heavy agents. Higher latency.',                         icon: '🏗️' },
      { id: 'dynamic',     label: 'Dynamic Budget',        description: 'Auto-scales context based on task complexity. Smart defaults.',                      icon: '📊' },
    ],
  },
  {
    id: 'deploy',
    title: 'Deploy & Monitor',
    subtitle: 'Where and how will your system run?',
    choices: [
      { id: 'local',       label: 'Local Development',     description: 'Run on your machine for testing and iteration. Fastest feedback loop.',               icon: '💻' },
      { id: 'docker',      label: 'Docker Compose',        description: 'Containerized deployment for staging and production environments.',                  icon: '🐳' },
      { id: 'cloud',       label: 'Cloud (Tower-HD)',      description: 'Deploy to your homelab or cloud VM with full observability.',                        icon: '☁️' },
      { id: 'k8s',         label: 'Kubernetes',            description: 'Orchestrated deployment for enterprise-scale workloads.',                             icon: '⚙️' },
      { id: 'edge-net',    label: 'Edge Network',          description: 'Distributed deployment across edge nodes. Low-latency global access.',                icon: '🌐' },
    ],
  },
]

/* ── Summary descriptions ── */

const SUMMARY: Record<string, string> = {
  chat:       'Conversational AI with persistent memory',
  research:   'Research Assistant with long-term retrieval',
  agent:      'Autonomous Agent with cross-session memory',
  creative:   'Creative Companion with session continuity',
  enterprise: 'Enterprise Pipeline with compliance controls',
  single:     'Single-API Gateway — one endpoint to rule them all',
  'multi-agent': 'Multi-Agent Mesh — independent agents on an event bus',
  hybrid:     'Hybrid Pipeline — gateway + agent bus combined',
  edge:       'Edge-First — local with optional cloud sync',
  legacy:     'Legacy Integration — wrap existing APIs',
  honcho:     'Honcho — production memory server',
  mem0:       'Mem0 — lightweight embedding memory',
  file:       'File-Based — simple JSON persistence',
  'hybrid-mem': 'Hybrid Memory — Honcho + file cache',
  custom:     'Custom Provider — bring your own backend',
  tight:      'Tight budget — 2K tokens, fast responses',
  balanced:   'Balanced budget — 8K tokens, recommended',
  generous:   'Generous budget — 32K tokens, rich context',
  extreme:    'Extreme budget — 128K+ tokens, max context',
  dynamic:    'Dynamic budget — auto-scaling context',
  local:      'Local Development — fastest feedback loop',
  docker:     'Docker Compose — containerized deployment',
  cloud:      'Cloud (Tower-HD) — deploy with observability',
  k8s:        'Kubernetes — enterprise orchestration',
  'edge-net': 'Edge Network — distributed global access',
}

/* ── Component ── */

export default function AcademyWorkflowPage() {
  const [stepIndex, setStepIndex] = useState(0)
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [showSummary, setShowSummary] = useState(false)

  const step = STEPS[stepIndex]
  const isLastStep = stepIndex === STEPS.length - 1
  const currentChoice = selections[step.id]

  function handleSelect(choiceId: string) {
    const updated = { ...selections, [step.id]: choiceId }
    setSelections(updated)

    if (isLastStep) {
      setShowSummary(true)
    } else {
      setTimeout(() => setStepIndex((i) => i + 1), 350)
    }
  }

  function handleBack() {
    if (showSummary) {
      setShowSummary(false)
      setStepIndex(STEPS.length - 1)
    } else if (stepIndex > 0) {
      setStepIndex((i) => i - 1)
    }
  }

  function handleReset() {
    setStepIndex(0)
    setSelections({})
    setShowSummary(false)
  }

  /* ── Summary Screen ── */

  if (showSummary) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-8 text-sm text-surface-500 dark:text-surface-400">
          <Link href="/academy" className="hover:text-brand-500 transition-colors">Academy</Link>
          <span className="mx-2">/</span>
          <span className="text-surface-700 dark:text-surface-200">Workflow</span>
        </nav>

        <div className="rounded-2xl border border-surface-200 bg-surface-50 p-8 dark:border-surface-700 dark:bg-surface-900">
          <div className="mb-6 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-success/10 text-2xl">
              ✅
            </span>
            <h1 className="mt-4 text-2xl font-bold text-surface-900 dark:text-white">
              Your Academy Blueprint
            </h1>
            <p className="mt-1 text-surface-500 dark:text-surface-400">
              Based on your choices, here is the recommended learning path.
            </p>
          </div>

          <div className="space-y-3">
            {STEPS.map((s) => {
              const pick = selections[s.id]
              if (!pick) return null
              return (
                <div
                  key={s.id}
                  className="flex items-start gap-3 rounded-lg border border-surface-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-950"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900/50 dark:text-brand-300">
                    {STEPS.indexOf(s) + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-surface-900 dark:text-white">{s.title}</p>
                    <p className="mt-0.5 text-sm text-surface-500 dark:text-surface-400">
                      {SUMMARY[pick] ?? pick}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={handleBack}
              className="rounded-lg border border-surface-200 bg-white px-5 py-2.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-950 dark:text-surface-300 dark:hover:bg-surface-800"
            >
              ← Edit Choices
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Wizard ── */

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <nav className="mb-8 text-sm text-surface-500 dark:text-surface-400">
        <Link href="/academy" className="hover:text-brand-500 transition-colors">Academy</Link>
        <span className="mx-2">/</span>
        <span className="text-surface-700 dark:text-surface-200">Workflow</span>
      </nav>

      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  i < stepIndex
                    ? 'bg-success text-white'
                    : i === stepIndex
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-200 text-surface-500 dark:bg-surface-800 dark:text-surface-400'
                )}
                aria-label={`Step ${i + 1}: ${s.title}`}
              >
                {i < stepIndex ? '✓' : i + 1}
              </div>
              <span
                className={cn(
                  'hidden text-xs font-medium sm:inline',
                  i === stepIndex
                    ? 'text-surface-900 dark:text-white'
                    : 'text-surface-400 dark:text-surface-500'
                )}
              >
                {s.title}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    'hidden h-0.5 flex-1 sm:block',
                    i < stepIndex
                      ? 'bg-success'
                      : 'bg-surface-200 dark:bg-surface-800'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-2xl border border-surface-200 bg-surface-50 p-8 dark:border-surface-700 dark:bg-surface-900">
        <div className="mb-8 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-xl dark:bg-brand-900/50">
            {stepIndex + 1}
          </span>
          <h1 className="mt-4 text-2xl font-bold text-surface-900 dark:text-white">
            {step.title}
          </h1>
          <p className="mt-1 text-surface-500 dark:text-surface-400">
            {step.subtitle}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {step.choices.map((choice) => {
            const isSelected = currentChoice === choice.id
            return (
              <button
                key={choice.id}
                onClick={() => handleSelect(choice.id)}
                className={cn(
                  'group relative rounded-xl border-2 p-4 text-left transition-all',
                  isSelected
                    ? 'border-brand-500 bg-brand-50 shadow-md dark:border-brand-400 dark:bg-brand-900/30'
                    : 'border-surface-200 bg-white hover:border-brand-300 hover:shadow-sm dark:border-surface-700 dark:bg-surface-950 dark:hover:border-brand-700'
                )}
                aria-pressed={isSelected}
              >
                <span className="mb-2 block text-2xl" aria-hidden="true">
                  {choice.icon}
                </span>
                <h3
                  className={cn(
                    'text-sm font-semibold',
                    isSelected
                      ? 'text-brand-700 dark:text-brand-300'
                      : 'text-surface-900 dark:text-white'
                  )}
                >
                  {choice.label}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-surface-500 dark:text-surface-400">
                  {choice.description}
                </p>
                {isSelected && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] text-white">
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {stepIndex > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleBack}
              className="rounded-lg border border-surface-200 bg-white px-4 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-950 dark:text-surface-400 dark:hover:bg-surface-800"
            >
              ← Previous Step
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-surface-400 dark:text-surface-500">
          Select an option to continue
        </p>
      </div>
    </div>
  )
}
