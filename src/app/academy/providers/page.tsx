import Link from 'next/link'

interface ProviderCard {
  id: string
  name: string
  icon: string
  category: 'memory' | 'knowledge' | 'tooling'
  categoryLabel: string
  status: string
  latency: string
  conformance: string
  description: string
  backend: string
  highlights: string[]
}

const PROVIDERS: ProviderCard[] = [
  {
    id: 'inmemory',
    name: 'InMemory',
    icon: '💾',
    category: 'memory',
    categoryLabel: 'Memory Provider',
    status: '✅ Production',
    latency: '&lt;1ms',
    conformance: '15/15',
    description: 'Gold standard reference implementation. All other providers must match its behavior exactly to pass conformance.',
    backend: 'Python dict (in-process)',
    highlights: [
      'Canonical provider used in all tests',
      'Zero external dependencies',
      'Reference for provider contract behavior',
      'Every conformance test validated against it first',
    ],
  },
  {
    id: 'mem0',
    name: 'Mem0',
    icon: '🔵',
    category: 'memory',
    categoryLabel: 'Memory Provider',
    status: '✅ Production',
    latency: '~50ms',
    conformance: '15/15',
    description: 'HTTP-based memory service backed by PostgreSQL. The primary operational memory store for the platform.',
    backend: 'PostgreSQL via HTTP API',
    highlights: [
      'Full CRUD for memory objects',
      'Recency-weighted importance scoring',
      'Parallel query support',
      'Designed for high-throughput workloads',
    ],
  },
  {
    id: 'honcho',
    name: 'Honcho',
    icon: '🟣',
    category: 'memory',
    categoryLabel: 'Memory Provider',
    status: '✅ Production',
    latency: '~80ms',
    conformance: '15/15',
    description: 'Backend memory service providing persistent, long-term memory storage for agents and users.',
    backend: 'Honcho API',
    highlights: [
      'Purpose-built for AI agent memory',
      'Session and user scoping',
      'Automatic memory consolidation',
      'Good balance of speed vs durability',
    ],
  },
  {
    id: 'archive',
    name: 'Archive',
    icon: '🗄️',
    category: 'memory',
    categoryLabel: 'Memory Provider',
    status: '✅ Production',
    latency: '~200ms',
    conformance: '15/15',
    description: 'Cold storage provider for infrequently accessed memories. Optimized for durability over speed.',
    backend: 'Cold storage (file/object)',
    highlights: [
      'Tiered storage for cost optimization',
      'Automatic archiving of old memories',
      'Compression for storage efficiency',
      'Retrievable on demand with latency trade-off',
    ],
  },
  {
    id: 'mock',
    name: 'Mock',
    icon: '🧪',
    category: 'tooling',
    categoryLabel: 'Testing Tool',
    status: '✅ Development',
    latency: '&lt;1ms',
    conformance: '15/15',
    description: 'Test double used in benchmark and conformance suites. Validates provider behavior without side effects.',
    backend: 'In-memory (test harness)',
    highlights: [
      'Used in all 46 automated tests',
      'Golden dataset validation runs against it',
      'Deterministic behavior for reproducible tests',
      'Policy engine integration testing',
    ],
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    icon: '🟢',
    category: 'knowledge',
    categoryLabel: 'Knowledge Provider',
    status: '✅ Production',
    latency: '~50ms',
    conformance: '43/43',
    description: 'Knowledge graph integration using an Obsidian markdown vault as the backend. Each note becomes a knowledge entry.',
    backend: 'Obsidian Markdown vault',
    highlights: [
      'Full-text search across notes',
      'Tag and link-based retrieval',
      'Bidirectional note graph traversal',
      'Markdown frontmatter metadata extraction',
    ],
  },
  {
    id: 'skills',
    name: 'Skills',
    icon: '🧠',
    category: 'knowledge',
    categoryLabel: 'Knowledge Provider',
    status: '✅ Production',
    latency: '~80ms',
    conformance: '9/9',
    description: 'Agent skills matching engine. Stores and retrieves procedural knowledge as structured skill definitions.',
    backend: 'JSON-based skill registry',
    highlights: [
      'Semantic skill matching',
      'Category-based organization',
      'Relevance scoring for skill selection',
      'Dynamic skill registration at runtime',
    ],
  },
]

export default function ProvidersPage() {
  const memoryProviders = PROVIDERS.filter((p) => p.category === 'memory')
  const knowledgeProviders = PROVIDERS.filter((p) => p.category === 'knowledge')
  const toolingProviders = PROVIDERS.filter((p) => p.category === 'tooling')

  return (
    <div className="space-y-12">
      {/* ── Hero ── */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
          🔌 Provider Overview
        </h1>
        <p className="text-lg leading-relaxed text-surface-600 dark:text-surface-400">
          The Memory Platform ships with seven providers across three categories.
          Every provider implements a strict contract and must pass conformance
          tests before it can be used in production.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 rounded-lg border border-surface-300 px-5 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50 dark:border-surface-600 dark:text-surface-300 dark:hover:bg-surface-800"
          >
            ← Back to Academy
          </Link>
          <Link
            href="/academy/architecture"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
          >
            🏛️ View Architecture →
          </Link>
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
          📊 Provider Comparison
        </h2>
        <div className="overflow-x-auto rounded-xl border border-surface-200 dark:border-surface-700">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-800">
                <th className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">Provider</th>
                <th className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">Type</th>
                <th className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">Status</th>
                <th className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">Latency</th>
                <th className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">Conformance</th>
                <th className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">Backend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
              {PROVIDERS.map((p) => (
                <tr
                  key={p.id}
                  className="bg-white transition-colors hover:bg-surface-50 dark:bg-surface-900 dark:hover:bg-surface-800"
                >
                  <td className="px-4 py-3 font-medium text-surface-900 dark:text-surface-100">
                    <span className="mr-2" aria-hidden="true">{p.icon}</span>
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-surface-600 dark:text-surface-400">
                    {p.categoryLabel}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success dark:text-success">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-surface-600 dark:text-surface-400">
                    {p.latency}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-medium text-surface-900 dark:text-surface-100">
                      {p.conformance}
                    </span>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-xs text-surface-500 dark:text-surface-400">
                    {p.backend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Memory Providers ── */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-surface-900 dark:text-surface-50">
          💾 Memory Providers
        </h2>
        <p className="text-surface-600 dark:text-surface-400">
          These providers handle dynamic, session-specific data. Every memory is scored by the Policy Engine before storage.
        </p>
        <div className="space-y-4">
          {memoryProviders.map((p) => (
            <ProviderDetailCard key={p.id} provider={p} />
          ))}
        </div>
      </section>

      {/* ── Knowledge Providers ── */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-surface-900 dark:text-surface-50">
          📚 Knowledge Providers
        </h2>
        <p className="text-surface-600 dark:text-surface-400">
          These providers handle curated, long-lived information that is trusted at face value — no confidence scoring.
        </p>
        <div className="space-y-4">
          {knowledgeProviders.map((p) => (
            <ProviderDetailCard key={p.id} provider={p} />
          ))}
        </div>
      </section>

      {/* ── Tooling / Testing ── */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-surface-900 dark:text-surface-50">
          🧪 Testing &amp; Tooling
        </h2>
        <p className="text-surface-600 dark:text-surface-400">
          Providers used during development and testing to validate behavior and performance.
        </p>
        <div className="space-y-4">
          {toolingProviders.map((p) => (
            <ProviderDetailCard key={p.id} provider={p} />
          ))}
        </div>
      </section>

      {/* ── Provider model diagram ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
          🧩 Provider Contract Architecture
        </h2>
        <pre className="overflow-x-auto rounded-xl border border-surface-200 bg-white p-4 text-xs leading-relaxed dark:border-surface-700 dark:bg-surface-900">
{`┌────────────────────────────────────────────────────┐
│              MemoryProvider (ABC)                    │
│  store()  query()  get()  delete()  count()          │
└────┬────────────────────────────────────────────┬───┘
     │                                            │
     ▼                                            ▼
┌──────────────┐  ┌──────────┐  ┌────────────┐  ┌───────────┐
│ 💾 InMemory  │  │ 🔵 Mem0  │  │ 🟣 Honcho │  │ 🗄️ Archive│
│ (dict,       │  │ (Post-   │  │ (Honcho    │  │ (cold     │
│  gold std)   │  │  gresQL) │  │  API)      │  │  storage) │
└──────────────┘  └──────────┘  └────────────┘  └───────────┘

┌────────────────────────────────────────────────────┐
│            KnowledgeProvider (ABC)                  │
│  query()  get()  delete()                           │
└────┬────────────────────────────────────────────┬───┘
     │                                            │
     ▼                                            ▼
┌──────────────┐                          ┌──────────────┐
│ 🟢 Obsidian  │                          │ 🧠 Skills    │
│ (Markdown    │                          │ (JSON        │
│  vault)      │                          │  registry)   │
└──────────────┘                          └──────────────┘`}
        </pre>
      </section>

      {/* ── Related ── */}
      <section className="rounded-xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-900">
        <h2 className="mb-4 text-xl font-bold text-surface-900 dark:text-surface-50">
          🔗 Related Resources
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/academy/architecture"
            className="group flex items-center gap-3 rounded-lg border border-surface-200 p-3 transition-all hover:border-brand-300 dark:border-surface-700 dark:hover:border-brand-600"
          >
            <span className="text-xl">🏛️</span>
            <div>
              <div className="text-sm font-semibold text-surface-900 group-hover:text-brand-600 dark:text-surface-100 dark:group-hover:text-brand-400">
                Architecture
              </div>
              <div className="text-xs text-surface-500 dark:text-surface-400">
                System design and component model
              </div>
            </div>
          </Link>
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
            href="/mdx/governance"
            className="group flex items-center gap-3 rounded-lg border border-surface-200 p-3 transition-all hover:border-brand-300 dark:border-surface-700 dark:hover:border-brand-600"
          >
            <span className="text-xl">⚙️</span>
            <div>
              <div className="text-sm font-semibold text-surface-900 group-hover:text-brand-600 dark:text-surface-100 dark:group-hover:text-brand-400">
                Governance
              </div>
              <div className="text-xs text-surface-500 dark:text-surface-400">
                Provider integration rules and quality gates
              </div>
            </div>
          </Link>
          <Link
            href="/dashboard/providers"
            className="group flex items-center gap-3 rounded-lg border border-surface-200 p-3 transition-all hover:border-brand-300 dark:border-surface-700 dark:hover:border-brand-600"
          >
            <span className="text-xl">📊</span>
            <div>
              <div className="text-sm font-semibold text-surface-900 group-hover:text-brand-600 dark:text-surface-100 dark:group-hover:text-brand-400">
                Provider Dashboard
              </div>
              <div className="text-xs text-surface-500 dark:text-surface-400">
                Live provider status and metrics
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}

function ProviderDetailCard({ provider }: { provider: ProviderCard }) {
  return (
    <div
      id={provider.id}
      className="rounded-xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-900"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="mt-1 text-3xl" aria-hidden="true">{provider.icon}</span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold text-surface-900 dark:text-surface-50">
                {provider.name}
              </h3>
              <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-xs font-medium text-brand-500">
                {provider.categoryLabel}
              </span>
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                {provider.status}
              </span>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-surface-600 dark:text-surface-400">
              {provider.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-6 text-center text-xs">
          <div>
            <div className="font-mono text-lg font-bold text-surface-900 dark:text-surface-50">{provider.conformance}</div>
            <div className="text-surface-500 dark:text-surface-400">Tests</div>
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-surface-900 dark:text-surface-50">{provider.latency}</div>
            <div className="text-surface-500 dark:text-surface-400">Latency</div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
        <span className="font-medium text-surface-700 dark:text-surface-300">Backend:</span>
        <code className="rounded bg-surface-100 px-1.5 py-0.5 font-mono dark:bg-surface-800">
          {provider.backend}
        </code>
      </div>

      <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {provider.highlights.map((h) => (
          <div key={h} className="flex items-start gap-2 text-xs text-surface-600 dark:text-surface-400">
            <span className="mt-0.5 shrink-0 text-brand-500">✦</span>
            {h}
          </div>
        ))}
      </div>
    </div>
  )
}
