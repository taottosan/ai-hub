'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Activity,
  Database,
  Users,
  BookOpen,
  Wrench,
  FileText,
  BarChart3,
  Settings,
  Server,
  GraduationCap,
  Files,
  BookMarked,
  Code,
  Workflow,
  Sparkles,
  BookOpenCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  title: string
  slug?: string
  icon?: LucideIcon
  children?: NavItem[]
}

/* ── Dashboard-first navigation ── */
const NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    children: [
      { title: 'Overview', slug: 'dashboard/overview', icon: Activity },
      { title: 'Runtime Flow', slug: 'dashboard/flow', icon: Workflow },
      { title: 'Service Status', slug: 'dashboard/system', icon: Server },
      { title: 'Event Logs', slug: 'dashboard/trace', icon: FileText },
    ],
  },
  {
    title: 'Memory',
    icon: Database,
    children: [
      { title: 'Honcho Cloud', slug: 'dashboard/providers', icon: Database },
    ],
  },
  { title: 'Sessions', slug: 'status', icon: Users },
  {
    title: 'Academy',
    icon: GraduationCap,
    children: [
      { title: 'Overview', slug: 'academy', icon: BookOpenCheck },
      { title: 'Architecture', slug: 'academy/architecture', icon: Code },
      { title: 'Memory vs Knowledge', slug: 'academy/memory-vs-knowledge', icon: BookMarked },
      { title: 'Providers', slug: 'academy/providers', icon: Server },
      { title: 'Workflow', slug: 'academy/workflow', icon: Workflow },
      { title: 'AI University', slug: 'academy/ai-university', icon: Sparkles },
      { title: 'Getting Started', slug: 'academy/getting-started', icon: BookOpen },
    ],
  },
  {
    title: 'ADR',
    icon: Files,
    children: [
      { title: 'ADR Overview', slug: 'academy/adr', icon: FileText },
    ],
  },
  { title: 'Settings', slug: 'settings', icon: Settings },
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
        'w-64 shrink-0 overflow-y-auto border-r',
        'border-[#2b3140] bg-[#171a21]',
      )}
      aria-label="Documentation navigation"
    >
      {/* Logo area */}
      <div className="flex h-14 items-center gap-2 border-b border-[#2b3140] px-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-xs font-bold text-white">
          AH
        </span>
        <span className="text-sm font-bold text-[#e6edf3]">AI Hub</span>
      </div>

      <nav className="space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon

          if (!item.children) {
            return (
              <Link
                key={item.title}
                href={item.slug ? `/${item.slug}` : '/'}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive(item.slug)
                    ? 'bg-brand-500/10 text-brand-400'
                    : 'text-[#8b949e] hover:bg-[#1e222d] hover:text-[#e6edf3]',
                )}
              >
                {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                {item.title}
              </Link>
            )
          }

          const isGroupActive = item.children.some((c) => isActive(c.slug))

          return (
            <div key={item.title}>
              <button
                onClick={() => toggleGroup(item.title)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isGroupActive
                    ? 'text-brand-400'
                    : 'text-[#8b949e] hover:bg-[#1e222d] hover:text-[#e6edf3]',
                )}
              >
                {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                <span className="flex-1 text-left">{item.title}</span>
                <svg
                  className={cn(
                    'h-3 w-3 transition-transform text-[#5c6570]',
                    collapsed[item.title] ? '' : 'rotate-90',
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              {!collapsed[item.title] && (
                <div className="ml-2 space-y-0.5">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon
                    return (
                      <Link
                        key={child.title}
                        href={`/${child.slug}`}
                        className={cn(
                          'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
                          isActive(child.slug)
                            ? 'bg-brand-500/10 text-brand-400'
                            : 'text-[#6e7681] hover:bg-[#1e222d] hover:text-[#e6edf3]',
                        )}
                      >
                        {ChildIcon && (
                          <ChildIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {child.title}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
