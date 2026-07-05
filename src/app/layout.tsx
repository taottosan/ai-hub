import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import Search from '@/components/Search'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata: Metadata = {
  title: {
    template: '%s | Memory Platform Academy',
    default: 'Memory Platform Academy',
  },
  description: 'Learn the architecture, ADRs, and internals of the AI Memory Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        {/* Inter font — variable weight, high legibility */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex h-full flex-col">
        {/* Skip-to-content link */}
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>

        {/* ── Header ── */}
        <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/95 backdrop-blur-sm dark:border-surface-800 dark:bg-surface-950/95">
          <div className="mx-auto flex h-14 max-w-8xl items-center gap-4 px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold text-surface-900 dark:text-surface-50"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-xs font-bold text-white">
                MP
              </span>
              <span className="hidden sm:inline">Memory Platform Academy</span>
            </Link>

            <div className="flex-1" />

            <Search />

            {/* Theme toggle */}
            <ThemeToggle />
          </div>
        </header>

        {/* ── Main content area ── */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />

          <main
            id="main-content"
            className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8"
          >
            <div className="mx-auto max-w-4xl">
              {children}
            </div>

            {/* Footer */}
            <footer className="mt-16 border-t border-surface-200 pt-6 text-center text-xs text-surface-400 dark:border-surface-800">
              <p>Memory Platform Academy &mdash; Built with Next.js, MDX, and ☕</p>
            </footer>
          </main>
          <footer className="border-t border-[#30363d] bg-[#0d1117] py-3 px-6 text-center text-xs text-[#8b949e]">
            Memory Platform <a href="/status" className="text-[#58a6ff] hover:underline">v1.0.0</a> — Build 525f771 — Updated 2026-07-04
          </footer>
          </div>
      </body>
    </html>
  )
}
