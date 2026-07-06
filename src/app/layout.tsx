import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import Search from '@/components/Search'

export const metadata: Metadata = {
  title: {
    template: '%s | AI Hub',
    default: 'AI Hub — Honcho Cloud Runtime',
  },
  description: 'AI Operations Portal — Dashboard, Academy, Provider Explorer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full dark" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex h-full flex-col bg-[#0f1117] text-[#e6edf3] antialiased">
        {/* Skip-to-content link */}
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>

        {/* ── Header / Top Bar ── */}
        <header className="sticky top-0 z-40 border-b border-[#2b3140] bg-[#171a21]/95 backdrop-blur-sm">
          <div className="mx-auto flex h-14 max-w-8xl items-center gap-4 px-4 sm:px-6 lg:px-8">
            {/* Brand */}
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold text-[#e6edf3] shrink-0"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-xs font-bold text-white">
                AH
              </span>
              <span className="hidden sm:inline">AI Hub</span>
            </Link>

            {/* Environment tag */}
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-0.5 text-xs font-medium text-brand-400">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              production v1.1.0
            </span>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search */}
            <div className="max-w-xs flex-1">
              <Search />
            </div>

            {/* Version info */}
            <span className="hidden lg:inline text-xs text-[#5c6570] font-mono">
              build 525f771
            </span>
          </div>
        </header>

        {/* ── Main content area ── */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />

          <main
            id="main-content"
            className="flex-1 overflow-y-auto"
          >
            {children}

            {/* Footer */}
            <footer className="border-t border-[#2b3140] bg-[#0f1117] py-4 text-center text-xs text-[#5c6570]">
              <p>
                AI Hub — Honcho Cloud Runtime{' · '}
                <a href="/status" className="text-brand-400 hover:underline">
                  v1.1.0
                </a>
                {' · '}Build 525f771{' · '}Updated 2026-07-06
              </p>
            </footer>
          </main>
        </div>
      </body>
    </html>
  )
}
