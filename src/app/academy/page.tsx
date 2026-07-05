import Link from 'next/link'

export default function AcademyHome() {
  return (
    <div className="space-y-12">
      {/* ── Hero ── */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
          📚 Academy
        </h1>
        <p className="text-lg leading-relaxed text-surface-600 dark:text-surface-400">
          Deep-dive learning resources for the AI Memory Platform — understand the
          architecture, how memory differs from knowledge, how every provider works,
          and how to extend the platform safely.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/academy/architecture"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-brand-500"
          >
            🏛️ Explore Architecture
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/academy/providers"
            className="inline-flex items-center gap-2 rounded-lg border border-surface-300 px-5 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50 dark:border-surface-600 dark:text-surface-300 dark:hover:bg-surface-800"
          >
            🔌 View Providers
          </Link>
        </div>
      </section>

      {/* ── Quick links grid ── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: '🏛️ Architecture',
            description: 'System design, provider model, event bus, context building — how everything fits together.',
            href: '/academy/architecture',
          },
          {
            title: '🧠 Memory vs Knowledge',
            description: 'What is memory? What is knowledge? When to use each, and how the platform separates concerns.',
            href: '/academy/memory-vs-knowledge',
          },
          {
            title: '🔌 Provider Overview',
            description: 'Every provider at a glance: InMemory, Mem0, Honcho, Obsidian, Skills, Archive, and how they compare.',
            href: '/academy/providers',
          },
          {
            title: '📋 ADRs',
            description: '12 Architecture Decision Records explaining every design choice made.',
            href: '/mdx/adr/ADR-0001-why-memory-platform',
          },
          {
            title: '🎯 Philosophy',
            description: 'The design principles and reasoning behind the Memory Platform.',
            href: '/mdx/philosophy',
          },
          {
            title: '📊 Governance',
            description: 'Rules for safe provider integration, quality gates, and conformance testing.',
            href: '/mdx/governance',
          },
        ].map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group rounded-xl border border-surface-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-md dark:border-surface-700 dark:bg-surface-900 dark:hover:border-brand-600"
          >
            <div className="mb-3 text-2xl" aria-hidden="true">{card.title}</div>
            <h3 className="mb-1 font-semibold text-surface-900 group-hover:text-brand-600 dark:text-surface-100 dark:group-hover:text-brand-400">
              {card.title.replace(/^.+?\s/, '').trim()}
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              {card.description}
            </p>
          </Link>
        ))}
      </section>

      {/* ── Learning path ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
          🧭 Suggested Learning Path
        </h2>
        <div className="space-y-3">
          {[
            {
              step: '1',
              title: 'Start with Architecture',
              desc: 'Understand the high-level system design, action router, policy engine, and context builder.',
              href: '/academy/architecture',
            },
            {
              step: '2',
              title: 'Memory vs Knowledge',
              desc: 'Learn the core distinction that shapes the entire provider model.',
              href: '/academy/memory-vs-knowledge',
            },
            {
              step: '3',
              title: 'Explore Providers',
              desc: 'See how each provider implements the contract and when to use which one.',
              href: '/academy/providers',
            },
            {
              step: '4',
              title: 'Read the ADRs',
              desc: 'Dive into the Architecture Decision Records for the full rationale.',
              href: '/mdx/adr/ADR-0001-why-memory-platform',
            },
          ].map((item) => (
            <Link
              key={item.step}
              href={item.href}
              className="group flex items-start gap-4 rounded-xl border border-surface-200 bg-white p-4 transition-all hover:border-brand-300 hover:shadow-md dark:border-surface-700 dark:bg-surface-900 dark:hover:border-brand-600"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
                {item.step}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold text-surface-900 group-hover:text-brand-600 dark:text-surface-100 dark:group-hover:text-brand-400">
                  {item.title}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
