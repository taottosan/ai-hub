import Link from 'next/link'
import Mermaid from '@/components/Mermaid'

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* ── Hero ── */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
          Memory Platform Academy
        </h1>
        <p className="text-lg leading-relaxed text-surface-600 dark:text-surface-400">
          Interactive documentation for the AI Memory Platform — explore ADRs,
          architecture decisions, adapter evaluations, and system design.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/mdx/philosophy"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-brand-500"
          >
            Start Reading
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/mdx/adr/ADR-0001-why-memory-platform"
            className="inline-flex items-center gap-2 rounded-lg border border-surface-300 px-5 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50 dark:border-surface-600 dark:text-surface-300 dark:hover:bg-surface-800"
          >
            View ADRs
          </Link>
        </div>
      </section>

      {/* ── Quick links ── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: 'Architecture',
            description: 'System design, provider model, event bus, context building',
            href: '/mdx/philosophy',
            icon: '🏛️',
          },
          {
            title: 'ADRs',
            description: '12 Architecture Decision Records explaining every design choice',
            href: '/mdx/adr/ADR-0001-why-memory-platform',
            icon: '📋',
          },
          {
            title: 'Evaluations',
            description: 'Adapter benchmarks, conformance tests, and governance',
            href: '/mdx/benchmark',
            icon: '📊',
          },
          {
            title: 'Freeze Report v1',
            description: 'Platform freeze analysis and compatibility assessment',
            href: '/mdx/platform-freeze-report-v1',
            icon: '❄️',
          },
          {
            title: 'Phase Plans',
            description: 'Scope and deliverables for Phase 3 and Phase 3.5',
            href: '/mdx/phase-3-scope',
            icon: '🗺️',
          },
          {
            title: 'Governance',
            description: 'Rules for safe provider integration and quality gates',
            href: '/mdx/governance',
            icon: '⚙️',
          },
        ].map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group rounded-xl border border-surface-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-md dark:border-surface-700 dark:bg-surface-900 dark:hover:border-brand-600"
          >
            <div className="mb-3 text-2xl" aria-hidden="true">{card.icon}</div>
            <h3 className="mb-1 font-semibold text-surface-900 group-hover:text-brand-600 dark:text-surface-100 dark:group-hover:text-brand-400">
              {card.title}
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              {card.description}
            </p>
          </Link>
        ))}
      </section>

      {/* ── System architecture diagram ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
          System Architecture
        </h2>
        <Mermaid
          chart={`
graph TD
    User["👤 User / Agent"]
    API["POST /api/v1<br/>Action Router"]
    Policy["Policy Engine<br/>(confidence > threshold)"]
    CB["Context Builder<br/>(merge → rank → budget)"]
    Mem0[("Mem0 Provider<br/>(PostgreSQL)")]
    Obsidian[("Obsidian Provider<br/>(Markdown vault)")]
    Skills[("Skills Provider<br/>(JSON)")]
    Archive[("Archive Provider<br/>(cold storage)")]
    Mock[("Mock Provider<br/>(gold standard)")]
    Exp["Explainability<br/>(trace_id + reasoning)"]

    User --> API
    API --> Policy
    Policy --> Mem0
    Policy --> Obsidian
    Policy --> Skills
    Policy --> Archive
    Policy --> Mock
    Mem0 --> CB
    Obsidian --> CB
    Skills --> CB
    Archive --> CB
    Mock --> CB
    CB --> Exp
    Exp --> User

    style Mem0 fill:#2050d6,color:#fff
    style Obsidian fill:#1a7b3a,color:#fff
    style Skills fill:#b35900,color:#fff
    style Archive fill:#5a6070,color:#fff
    style Mock fill:#2050d6,color:#fff
    style Policy fill:#e67300,color:#fff
          `}
          caption="AI Memory Platform — high-level system architecture"
        />
      </section>
    </div>
  )
}
