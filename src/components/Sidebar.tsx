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
    title: 'Academy',
    children: [
      { title: 'Overview', slug: 'academy' },
      { title: 'Architecture', slug: 'academy/architecture' },
      { title: 'Memory vs Knowledge', slug: 'academy/memory-vs-knowledge' },
      { title: 'Providers', slug: 'academy/providers' },
      { title: 'Workflow', slug: 'academy/workflow' },
      { title: 'AI University', slug: 'academy/ai-university' },
      { title: 'Getting Started', slug: 'academy/getting-started' },
    ],
  },
  {
    title: 'ADR',
    children: [
      { title: 'ADR Overview', slug: 'academy/adr' },
    ],
  },
  {
    title: 'Dashboard',
    children: [
      { title: 'System', slug: 'dashboard/system' },
      { title: 'Flow', slug: 'dashboard/flow' },
      { title: 'Providers', slug: 'dashboard/providers' },
      { title: 'Trace', slug: 'dashboard/trace' },
    ],
  },
  { title: 'Status', slug: 'status' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const pathname = usePathname()

  function isActive(slug?: string): boolean {
    if (!slug) return pathname === '/'
    return pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
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
                href={item.slug ? `/${item.slug}` : '/'}
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
          return (
            <div key={item.title}>
              <button
                onClick={() => toggleGroup(item.title)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800',
                )}
              >
                <svg
                  className={cn('h-4 w-4 transition-transform', collapsed[item.title] ? '' : 'rotate-90')}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {item.title}
              </button>
              {!collapsed[item.title] && (
                <div className="ml-4 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.title}
                      href={`/${child.slug}`}
                      className={cn(
                        'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
                        isActive(child.slug)
                          ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
                          : 'text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800',
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
