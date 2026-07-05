'use client'

import Link from 'next/link'

/* ── Step Data ── */

interface StepData {
  number: number
  title: string
  subtitle: string
  description: string
  icon: string
  details: string[]
  estimatedTime: string
  links: { label: string; href: string }[]
}

const STEPS: StepData[] = [
  {
    number: 1,
    title: 'Set Up Your Environment',
    subtitle: 'Install dependencies and clone the repository',
    icon: '🛠️',
    description:
      'Get your development environment ready — clone the Memory Platform monorepo, install system dependencies (Node.js 20+, Python 3.11+, Docker), and run the bootstrap script.',
    details: [
      'Clone the repository from GitHub',
      'Install Node.js 20+, Python 3.11+, and Docker',
      'Run make bootstrap to install all dependencies',
      'Verify with make check — all green',
    ],
    estimatedTime: '15–20 minutes',
    links: [
      { label: 'Repository README', href: 'https://github.com/your-org/memory-platform' },
      { label: 'Bootstrap Guide', href: '/mdx/setup/bootstrap' },
    ],
  },
  {
    number: 2,
    title: 'Configure Providers',
    subtitle: 'Connect your AI model providers',
    icon: '🔌',
    description:
      'Configure LLM provider API keys and set up the provider adapter. The platform supports OpenAI, Anthropic, Google Gemini, local models (Ollama, LM Studio), and custom endpoints through a unified interface.',
    details: [
      'Obtain API keys for your chosen providers',
      'Run hermes setup or edit .env with your keys',
      'Configure the provider adapter in config/providers.yaml',
      'Test connectivity with a simple query',
    ],
    estimatedTime: '10–15 minutes',
    links: [
      { label: 'Provider Setup', href: '/dashboard/providers' },
      { label: 'Provider Adapter ADR', href: '/mdx/adr/ADR-0003-why-provider-adapter' },
    ],
  },
  {
    number: 3,
    title: 'Understand Memory',
    subtitle: 'Learn the memory layer fundamentals',
    icon: '🧠',
    description:
      'Understand the three memory tiers — ephemeral (in-session), working (cross-session), and archival (long-term). Learn how Honcho manages memory with semantic search, compaction, and user-scoped isolation.',
    details: [
      'Explore the three memory tier model',
      'Start the Honcho server with docker compose up honcho',
      'Run the memory demo: make demo-memory',
      'Review the Honcho capability matrix',
    ],
    estimatedTime: '20–30 minutes',
    links: [
      { label: 'Memory Systems Faculty', href: '/academy/ai-university#memory-systems' },
      { label: 'Honcho Setup', href: '/mdx/setup/honcho' },
    ],
  },
  {
    number: 4,
    title: 'Build Your First Agent',
    subtitle: 'Create a conversational agent with memory',
    icon: '🤖',
    description:
      'Build a working conversational agent that remembers context across sessions. Use the context builder for prompt assembly, the policy engine for content filtering, and the event bus for inter-agent communication.',
    details: [
      'Create a simple agent using the memory SDK',
      'Configure the context builder with token budget',
      'Add a policy for PII redaction',
      'Test across multiple sessions — memory persists',
    ],
    estimatedTime: '30–45 minutes',
    links: [
      { label: 'Agent Design Faculty', href: '/academy/ai-university#agent-design' },
      { label: 'Quickstart Tutorial', href: '/mdx/tutorials/first-agent' },
    ],
  },
  {
    number: 5,
    title: 'Deploy & Monitor',
    subtitle: 'Go to production with confidence',
    icon: '🚀',
    description:
      'Containerize your agent, deploy with Docker Compose or Kubernetes, and set up observability. The platform includes distributed tracing, context usage monitoring, and structured logging out of the box.',
    details: [
      'Containerize with Docker — use the provided Dockerfile',
      'Deploy with docker compose up -d',
      'Check the status dashboard at /status',
      'Set up alerts for context overruns and provider errors',
    ],
    estimatedTime: '20–30 minutes',
    links: [
      { label: 'Status Dashboard', href: '/status' },
      { label: 'Deployment Faculty', href: '/academy/ai-university#deployment-devops' },
    ],
  },
]

/* ── Component ── */

export default function GettingStartedPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-surface-500 dark:text-surface-400">
        <Link href="/academy" className="hover:text-brand-500 transition-colors">Academy</Link>
        <span className="mx-2">/</span>
        <span className="text-surface-700 dark:text-surface-200">Getting Started</span>
      </nav>

      {/* Header */}
      <div className="mb-12 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-3xl dark:bg-brand-900/50">
          🚀
        </span>
        <h1 className="mt-4 text-3xl font-bold text-surface-900 dark:text-white">
          Getting Started
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-surface-500 dark:text-surface-400">
          Five steps to go from zero to a working AI memory system.
          Follow them in order — each builds on the last.
        </p>

        {/* Jump-to navigation */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {STEPS.map((step) => (
            <a
              key={step.number}
              href={`#step-${step.number}`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-100 text-xs font-bold text-surface-600 transition-colors hover:bg-brand-100 hover:text-brand-600 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-brand-900/50 dark:hover:text-brand-300"
              aria-label={`Jump to step ${step.number}`}
            >
              {step.number}
            </a>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-10">
        {STEPS.map((step) => (
          <section
            key={step.number}
            id={`step-${step.number}`}
            className="scroll-mt-16 rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-900 sm:p-8"
          >
            {/* Step header */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-xl font-bold text-brand-600 dark:bg-brand-900/50 dark:text-brand-300">
                {step.number}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-surface-900 dark:text-white">
                    {step.title}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-100 px-2.5 py-0.5 text-2xs font-medium text-surface-500 dark:bg-surface-800 dark:text-surface-400">
                    <span aria-hidden="true">⏱️</span> {step.estimatedTime}
                  </span>
                </div>
                <p className="mt-0.5 text-sm font-medium text-brand-600 dark:text-brand-400">
                  {step.subtitle}
                </p>
              </div>
              <span className="hidden text-3xl sm:block" aria-hidden="true">
                {step.icon}
              </span>
            </div>

            {/* Description */}
            <p className="mt-4 text-sm leading-relaxed text-surface-600 dark:text-surface-400">
              {step.description}
            </p>

            {/* Checklist */}
            <div className="mt-4 rounded-lg border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-950">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                Checklist
              </p>
              <ul className="space-y-1.5">
                {step.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-300">
                    <span className="mt-0.5 shrink-0 text-brand-500" aria-hidden="true">▸</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div className="mt-4 flex flex-wrap gap-3">
              {step.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-surface-200 bg-white px-3.5 py-2 text-xs font-medium text-surface-700 transition-colors hover:bg-surface-50 hover:text-brand-600 dark:border-surface-700 dark:bg-surface-950 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-brand-400"
                >
                  {link.label}
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Completion CTA */}
      <div className="mt-10 rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white p-8 text-center dark:border-brand-800 dark:from-brand-950/50 dark:to-surface-900">
        <span className="text-3xl" aria-hidden="true">🎉</span>
        <h2 className="mt-3 text-xl font-bold text-surface-900 dark:text-white">
          You&apos;re ready to build
        </h2>
        <p className="mx-auto mt-1 max-w-lg text-sm text-surface-600 dark:text-surface-400">
          Completed all five steps? Dive deeper into specific topics at the
          AI University or check your system health on the dashboard.
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <Link
            href="/academy/ai-university"
            className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            Explore AI University →
          </Link>
          <Link
            href="/status"
            className="rounded-lg border border-surface-200 bg-white px-5 py-2.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-950 dark:text-surface-300 dark:hover:bg-surface-800"
          >
            Check Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
