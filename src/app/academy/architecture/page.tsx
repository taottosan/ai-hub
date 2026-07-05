import Link from 'next/link'

const sections = [
  {
    title: '🎯 Action Router',
    id: 'action-router',
    body: `The single entry point is a POST to /api/v1 which accepts an action field
(memory.store, memory.query, memory.get, memory.delete, context.build).
The router dispatches to the correct handler based on this action — no REST
resource nesting, no multiple endpoints. This keeps the API surface minimal
and makes every operation traceable through a single gateway.`,
  },
  {
    title: '🔍 Policy Engine',
    id: 'policy-engine',
    body: `Before any data is stored, the Policy Engine evaluates each incoming memory
candidate. It scores confidence, checks importance thresholds, and discards
low-value memories before they reach any provider. This runs BEFORE storage
so that providers only ever see high-confidence, policy-compliant data.`,
  },
  {
    title: '🧩 Context Builder',
    id: 'context-builder',
    body: `When the platform needs to answer a query, the Context Builder queries
every registered provider in parallel, merges results, ranks them by
relevance score, and applies a token budget. The merged context is then
returned with explainability metadata (trace_id + reasoning) so callers
know where each piece of information came from.`,
  },
  {
    title: '🔌 Provider Model',
    id: 'provider-model',
    body: `Every provider implements one of two ABCs — MemoryProvider or
KnowledgeProvider. The InMemory provider is the gold standard reference;
every other provider must pass the same conformance tests. Providers
are pluggable: add a new one by implementing the contract and registering
it. The Policy Engine and Context Builder treat all providers uniformly.`,
  },
  {
    title: '📡 Event Bus & Explainability',
    id: 'event-bus',
    body: `All operations emit structured events with a trace_id that follows the
request end-to-end. Every response includes an explainability block listing
which providers were queried, what they returned, how the context was
assembled, and any policy decisions that were made along the way.`,
  },
]

export default function ArchitecturePage() {
  return (
    <div className="space-y-12">
      {/* ── Hero ── */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
          🏛️ Architecture
        </h1>
        <p className="text-lg leading-relaxed text-surface-600 dark:text-surface-400">
          The AI Memory Platform is built around a single action-routed API, a
          pluggable provider model, and a policy-first storage engine. Every
          component is designed for extensibility, traceability, and testability.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 rounded-lg border border-surface-300 px-5 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50 dark:border-surface-600 dark:text-surface-300 dark:hover:bg-surface-800"
          >
            ← Back to Academy
          </Link>
          <Link
            href="/academy/providers"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
          >
            🔌 View Providers →
          </Link>
        </div>
      </section>

      {/* ── Architecture diagram ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
          📊 High-Level Flow
        </h2>
        <pre className="overflow-x-auto rounded-xl border border-surface-200 bg-white p-4 text-xs leading-relaxed dark:border-surface-700 dark:bg-surface-900">
{`┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│  👤 User /   │────▶│  POST /api/v1 │────▶│  Policy       │
│  Agent       │     │  Action Router│     │  Engine       │
└─────────────┘     └──────────────┘     └───────┬───────┘
                                                  │
                    ┌─────────────────────────────┼─────────────────────────────┐
                    │                             │                             │
                    ▼                             ▼                             ▼
        ┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
        │ 🔵 Mem0 Provider │         │ 🟢 Obsidian Prov.│         │ 🟠 Skills Prov.  │
        │ (PostgreSQL)     │         │ (Markdown vault) │         │ (JSON)           │
        └────────┬─────────┘         └────────┬─────────┘         └────────┬─────────┘
                 │                            │                            │
                 └──────────────┬─────────────┴──────────────┬──────────────┘
                                │                            │
                                ▼                            ▼
                    ┌──────────────────────┐     ┌──────────────────────┐
                    │  Context Builder     │     │  Archive Provider    │
                    │  (merge → rank →     │     │  (cold storage)      │
                    │   token budget)      │     │                      │
                    └──────────┬───────────┘     └──────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Explainability      │
                    │  (trace_id +         │
                    │   reasoning)         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  👤 Response to User  │
                    └──────────────────────┘`}
        </pre>
      </section>

      {/* ── Core components ── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
          ⚙️ Core Components
        </h2>
        {sections.map((sec) => (
          <article
            key={sec.id}
            id={sec.id}
            className="rounded-xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-900"
          >
            <h3 className="mb-3 text-xl font-bold text-surface-900 dark:text-surface-50">
              {sec.title}
            </h3>
            <p className="leading-relaxed text-surface-600 dark:text-surface-400">
              {sec.body}
            </p>
          </article>
        ))}
      </section>

      {/* ── Key design principles ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
          📐 Design Principles
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: '✅',
              title: 'Correctness First',
              desc: 'Every provider must pass the same conformance test suite before it can be plugged in. The InMemory provider is the gold standard — all others must match its behavior.',
            },
            {
              icon: '🔒',
              title: 'Policy Before Storage',
              desc: 'The Policy Engine evaluates every memory BEFORE it reaches a provider. Low-confidence memories are discarded early, saving storage and ensuring quality.',
            },
            {
              icon: '🧩',
              title: 'Pluggable Providers',
              desc: 'Providers implement an ABC contract and are registered at startup. The system treats them uniformly — swap, add, or remove providers without changing core logic.',
            },
            {
              icon: '📋',
              title: 'Trace Everything',
              desc: 'Every request carries a trace_id. Every response includes explainability metadata showing which providers contributed, how context was assembled, and why.',
            },
            {
              icon: '🧪',
              title: 'Test-Driven Evolution',
              desc: 'The Golden Dataset (200 cases) is the final judge. Any change that causes >5% regression blocks the merge. Mock providers validate behavior before production use.',
            },
            {
              icon: '❄️',
              title: 'Stable Contracts',
              desc: 'Core interfaces (MemoryObject, ContextObject, Provider ABCs) and the API action set are frozen at v1.0. Changes require an RFC and full conformance re-run.',
            },
          ].map((principle) => (
            <div
              key={principle.title}
              className="rounded-xl border border-surface-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-900"
            >
              <div className="mb-3 text-2xl" aria-hidden="true">{principle.icon}</div>
              <h3 className="mb-1 font-semibold text-surface-900 dark:text-surface-100">
                {principle.title}
              </h3>
              <p className="text-sm leading-relaxed text-surface-500 dark:text-surface-400">
                {principle.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Related links ── */}
      <section className="rounded-xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-900">
        <h2 className="mb-4 text-xl font-bold text-surface-900 dark:text-surface-50">
          🔗 Related Resources
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/academy/memory-vs-knowledge"
            className="group flex items-center gap-3 rounded-lg border border-surface-200 p-3 transition-all hover:border-brand-300 dark:border-surface-700 dark:hover:border-brand-600"
          >
            <span className="text-xl">🧠</span>
            <div>
              <div className="text-sm font-semibold text-surface-900 group-hover:text-brand-600 dark:text-surface-100 dark:group-hover:text-brand-400">
                Memory vs Knowledge
              </div>
              <div className="text-xs text-surface-500 dark:text-surface-400">
                How the platform separates concerns
              </div>
            </div>
          </Link>
          <Link
            href="/academy/providers"
            className="group flex items-center gap-3 rounded-lg border border-surface-200 p-3 transition-all hover:border-brand-300 dark:border-surface-700 dark:hover:border-brand-600"
          >
            <span className="text-xl">🔌</span>
            <div>
              <div className="text-sm font-semibold text-surface-900 group-hover:text-brand-600 dark:text-surface-100 dark:group-hover:text-brand-400">
                Provider Overview
              </div>
              <div className="text-xs text-surface-500 dark:text-surface-400">
                All providers compared side-by-side
              </div>
            </div>
          </Link>
          <Link
            href="/mdx/adr/ADR-0001-why-memory-platform"
            className="group flex items-center gap-3 rounded-lg border border-surface-200 p-3 transition-all hover:border-brand-300 dark:border-surface-700 dark:hover:border-brand-600"
          >
            <span className="text-xl">📋</span>
            <div>
              <div className="text-sm font-semibold text-surface-900 group-hover:text-brand-600 dark:text-surface-100 dark:group-hover:text-brand-400">
                ADR-0001
              </div>
              <div className="text-xs text-surface-500 dark:text-surface-400">
                Why the Memory Platform exists
              </div>
            </div>
          </Link>
          <Link
                href="/mdx/philosophy"
            className="group flex items-center gap-3 rounded-lg border border-surface-200 p-3 transition-all hover:border-brand-300 dark:border-surface-700 dark:hover:border-brand-600"
          >
            <span className="text-xl">🎯</span>
            <div>
              <div className="text-sm font-semibold text-surface-900 group-hover:text-brand-600 dark:text-surface-100 dark:group-hover:text-brand-400">
                Philosophy
              </div>
              <div className="text-xs text-surface-500 dark:text-surface-400">
                Design principles behind the platform
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
