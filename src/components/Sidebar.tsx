'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  title: string
  slug?: string
  children?: NavItem[]
}

const NAV_ITEMS: NavItem[] = [
  { title: 'Home', slug: '' },
  {
    title: 'Architecture',
    children: [
      { title: 'Overview', slug: 'philosophy' },
      { title: 'ADR-001', slug: 'adr/ADR-0001-why-memory-platform' },
      { title: 'ADR-002', slug: 'adr/ADR-0002-why-single-api' },
      { title: 'ADR-003', slug: 'adr/ADR-0003-why-provider-adapter' },
      { title: 'ADR-004', slug: 'adr/ADR-0004-why-event-bus' },
      { title: 'ADR-005', slug: 'adr/ADR-0005-why-mem0-honcho' },
      { title: 'ADR-006', slug: 'adr/ADR-0006-why-context-builder' },
      { title: 'ADR-007', slug: 'adr/ADR-0007-why-policy-engine' },
      { title: 'ADR-008', slug: 'adr/ADR-0008-why-monorepo' },
      { title: 'ADR-009', slug: 'adr/ADR-0009-why-inprocess-eventbus' },
      { title: 'ADR-010', slug: 'adr/ADR-0010-why-context-budget' },
      { title: 'ADR-012', slug: 'adr/ADR-0012-archive-role' },
    ],
  },
  {
    title: 'Evaluation',
    children: [
      { title: 'Benchmark', slug: 'benchmark' },
      { title: 'Conformance', slug: 'conformance' },
      { title: 'Governance', slug: 'governance' },
      { title: 'Obsidian Adapter', slug: 'obsidian-adapter-evaluation' },
      { title: 'Mem0 Adapter', slug: 'mem0-adapter-evaluation' },
      { title: 'Skills Adapter', slug: 'skills-adapter-evaluation' },
    ],
  },
  {
    title: 'Planning',
    children: [
      { title: 'Phase 3 Scope', slug: 'phase-3-scope' },
      { title: 'Phase 3.5 Scope', slug: 'phase-3.5-scope' },
      { title: 'Freeze Report v1', slug: 'platform-freeze-report-v1' },
    ],
  },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const pathname = usePathname()

  function isActive(slug?: string): boolean {
    if (!slug) return pathname === '/'
    return pathname === `/mdx/${slug}` || pathname.startsWith(`/mdx/${slug}/`)
  }

  function toggleGroup(title: string) {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <aside
      className={cn(
        'w-64 shrink-0 overflow-y-auto border-r border-surface-200',
        'bg-surface-50 p-4',
        'dark:border-surface-800 dark:bg-surface-900',
      )}
      aria-label="Documentation navigation"
    >
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          if (!item.children) {
            return (
              <Link
                key={item.title}
                href={item.slug ? `/mdx/${item.slug}` : '/'}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive(item.slug)
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
                    : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800',
                )}
              >
                {item.title}
              </Link>
            )
          }

          const isCollapsed = collapsed[item.title]

          return (
            <div key={item.title} className="space-y-0.5">
              <button
                onClick={() => toggleGroup(item.title)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider',
                  'text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800',
                )}
                aria-expanded={!isCollapsed}
              >
                <svg
                  className={cn(
                    'h-3 w-3 transition-transform',
                    isCollapsed ? '-rotate-90' : '',
                  )}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
                {item.title}
              </button>

              {!isCollapsed && (
                <div className="ml-1 space-y-0.5 border-l-2 border-surface-200 pl-2 dark:border-surface-700">
                  {item.children.map((child) => (
                    <Link
                      key={child.title}
                      href={`/mdx/${child.slug}`}
                      className={cn(
                        'block rounded-md px-3 py-1.5 text-sm transition-colors',
                        isActive(child.slug)
                          ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
                          : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800',
                      )}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
