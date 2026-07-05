import Link from 'next/link'

export default function MemoryVsKnowledgePage() {
  return (
    <div className="space-y-12">
      {/* ── Hero ── */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
          🧠 Memory vs Knowledge
        </h1>
        <p className="text-lg leading-relaxed text-surface-600 dark:text-surface-400">
          The AI Memory Platform draws a sharp line between <strong className="font-semibold text-surface-900 dark:text-surface-50">memory</strong> and{' '}
          <strong className="font-semibold text-surface-900 dark:text-surface-50">knowledge</strong>. Understanding the
          distinction is key to using the platform effectively and designing
          new providers.
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
            🔌 See Providers →
          </Link>
        </div>
      </section>

      {/* ── Side-by-side comparison ── */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Memory column */}
        <div className="rounded-xl border border-brand-300 bg-white p-6 dark:border-brand-600 dark:bg-surface-900">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-3xl">💾</span>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
              Memory
            </h2>
          </div>
          <ul className="space-y-3">
            {[
              { icon: '🔄', text: 'Ephemeral & dynamic — changes with every interaction' },
              { icon: '👤', text: 'Tied to a specific user, session, or agent' },
              { icon: '⏱️', text: 'Time-sensitive — recency and recency-weighted importance' },
              { icon: '📝', text: 'Recorded automatically by the platform during interactions' },
              { icon: '📊', text: 'Scored by confidence and importance before storage' },
              { icon: '🗑️', text: 'Can be updated, deleted, or expired over time' },
              { icon: '📦', text: 'Stored in operational backends (Mem0, Honcho, InMemory)' },
            ].map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0" aria-hidden="true">{item.icon}</span>
                <span className="text-sm leading-relaxed text-surface-600 dark:text-surface-400">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Knowledge column */}
        <div className="rounded-xl border border-accent-400 bg-white p-6 dark:border-accent-500 dark:bg-surface-900">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
              Knowledge
            </h2>
          </div>
          <ul className="space-y-3">
            {[
              { icon: '🏛️', text: 'Static & curated — authored and maintained deliberately' },
              { icon: '🌐', text: 'Shared across users, sessions, and agents' },
              { icon: '⏳', text: 'Long-lived — changes infrequently via explicit updates' },
              { icon: '✍️', text: 'Written and reviewed by humans or automated curation' },
              { icon: '✅', text: 'Trusted at face value — no confidence scoring needed' },
              { icon: '📌', text: 'Appended to, but never deleted without explicit action' },
              { icon: '🗃️', text: 'Stored in structured backends (Obsidian vault, Skills)' },
            ].map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0" aria-hidden="true">{item.icon}</span>
                <span className="text-sm leading-relaxed text-surface-600 dark:text-surface-400">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Detailed explanation ── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
          🔍 How the Platform Separates Concerns
        </h2>

        <article className="rounded-xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-900">
          <h3 className="mb-3 text-xl font-bold text-surface-900 dark:text-surface-50">
            🔵 Memory Providers
          </h3>
          <p className="mb-4 leading-relaxed text-surface-600 dark:text-surface-400">
            Memory providers implement the <code className="rounded bg-surface-100 px-1.5 py-0.5 font-mono text-sm text-surface-800 dark:bg-surface-800 dark:text-surface-200">MemoryProvider</code> ABC. They handle
            data that is personal, session-specific, and dynamic. Every memory
            is evaluated by the Policy Engine first — low-confidence memories
            are discarded before they reach the provider. Memories are scored,
            ranked, and can be queried by recency, relevance, or importance.
          </p>
          <div className="rounded-lg border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
            <h4 className="mb-2 text-sm font-semibold text-surface-700 dark:text-surface-300">
              Memory providers in the platform:
            </h4>
            <ul className="space-y-1 text-sm text-surface-600 dark:text-surface-400">
              <li>• <strong className="text-surface-900 dark:text-surface-100">InMemory</strong> — gold standard, reference implementation</li>
              <li>• <strong className="text-surface-900 dark:text-surface-100">Mem0</strong> — PostgreSQL-backed HTTP memory service</li>
              <li>• <strong className="text-surface-900 dark:text-surface-100">Honcho</strong> — backend memory service for persistent storage</li>
              <li>• <strong className="text-surface-900 dark:text-surface-100">Archive</strong> — cold storage for infrequently accessed memories</li>
            </ul>
          </div>
        </article>

        <article className="rounded-xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-900">
          <h3 className="mb-3 text-xl font-bold text-surface-900 dark:text-surface-50">
            🟢 Knowledge Providers
          </h3>
          <p className="mb-4 leading-relaxed text-surface-600 dark:text-surface-400">
            Knowledge providers implement the <code className="rounded bg-surface-100 px-1.5 py-0.5 font-mono text-sm text-surface-800 dark:bg-surface-800 dark:text-surface-200">KnowledgeProvider</code> ABC. They
            handle curated, long-lived information that is shared across the
            system. Knowledge does not go through confidence scoring — it is
            trusted by definition. It is queried alongside memories during
            context building but is never automatically expired or deleted.
          </p>
          <div className="rounded-lg border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
            <h4 className="mb-2 text-sm font-semibold text-surface-700 dark:text-surface-300">
              Knowledge providers in the platform:
            </h4>
            <ul className="space-y-1 text-sm text-surface-600 dark:text-surface-400">
              <li>• <strong className="text-surface-900 dark:text-surface-100">Obsidian</strong> — markdown vault as a knowledge graph</li>
              <li>• <strong className="text-surface-900 dark:text-surface-100">Skills</strong> — agent capabilities and procedural knowledge (JSON)</li>
            </ul>
          </div>
        </article>

        <article className="rounded-xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-900">
          <h3 className="mb-3 text-xl font-bold text-surface-900 dark:text-surface-50">
            🔄 How They Combine: Context Building
          </h3>
          <p className="leading-relaxed text-surface-600 dark:text-surface-400">
            When a query comes in, the Context Builder queries ALL registered
            providers — both memory and knowledge — in parallel. It merges
            the results, ranks them by a unified relevance score, and applies
            a token budget. The final response includes metadata showing which
            memories and which knowledge entries were used, along with the
            trace_id for full auditability.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-surface-200 bg-surface-50 p-4 text-xs leading-relaxed dark:border-surface-700 dark:bg-surface-800">
{`context.build(query)
  ├── parallel query ALL providers
  │   ├── 💾 InMemory   (memory)   ──→ memories
  │   ├── 💾 Mem0       (memory)   ──→ memories
  │   ├── 💾 Honcho     (memory)   ──→ memories
  │   ├── 💾 Archive    (memory)   ──→ memories
  │   ├── 📚 Obsidian   (knowledge)──→ knowledge
  │   └── 📚 Skills     (knowledge)──→ knowledge
  │
  └── merge → rank by score → apply token budget
       └── return ContextObject + explainability`}
          </pre>
        </article>
      </section>

      {/* ── When to use each ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
          🎯 When to Use Memory vs Knowledge
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: '💾',
              title: 'Use Memory when…',
              items: [
                'Remembering a user\'s last conversation topic',
                'Tracking session-specific preferences',
                'Recording agent actions for audit trails',
                'Storing temporary state that may be updated',
                'Learning from user feedback over time',
              ],
            },
            {
              icon: '📚',
              title: 'Use Knowledge when…',
              items: [
                'Documenting system architecture and ADRs',
                'Storing API reference and code patterns',
                'Maintaining agent skill definitions',
                'Holding curated reference data',
                'Preserving information that must never expire',
              ],
            },
          ].map((col) => (
            <div
              key={col.title}
              className="rounded-xl border border-surface-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-900"
            >
              <div className="mb-3 text-2xl" aria-hidden="true">{col.icon}</div>
              <h3 className="mb-3 font-semibold text-surface-900 dark:text-surface-100">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-surface-600 dark:text-surface-400">
                    <span className="mt-0.5 shrink-0 text-brand-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Architecture diagram ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
          📊 Provider Contract Hierarchy
        </h2>
        <pre className="overflow-x-auto rounded-xl border border-surface-200 bg-white p-4 text-xs leading-relaxed dark:border-surface-700 dark:bg-surface-900">
{`┌─────────────────────────────────────────────────┐
│              🧩 Provider ABC                      │
│  (Abstract Base Class — defines contract)         │
└────────────────────┬────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌─────────────────┐   ┌──────────────────────┐
│ 💾 MemoryProvider│   │ 📚 KnowledgeProvider  │
│                 │   │                      │
│ • store()       │   │ • query()            │
│ • query()       │   │ • get()              │
│ • get()         │   │ • delete()           │
│ • delete()      │   │                      │
│ • count()       │   │ (no confidence score) │
└────────┬────────┘   └──────────┬───────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐   ┌──────────────────────┐
│ InMemory        │   │ Obsidian             │
│ Mem0            │   │ Skills               │
│ Honcho          │   │                      │
│ Archive         │   │                      │
│ Mock (gold std) │   │                      │
└─────────────────┘   └──────────────────────┘`}
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
        </div>
      </section>
    </div>
  )
}
