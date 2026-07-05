'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SearchResult {
  slug: string
  title: string
  description: string
  category: string
}

type FlexSearchDocument = {
  add: (doc: SearchResult) => void
  searchAsync: (query: string, limit: number, options?: { enrich?: boolean }) => Promise<{ field: string; result: { doc?: SearchResult }[] }[]>
}

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const indexRef = useRef<FlexSearchDocument | null>(null)

  // Lazy-load FlexSearch and build index
  useEffect(() => {
    async function init() {
      const FlexSearch = (await import('flexsearch')).default as unknown as {
        Document: new (opts: Record<string, unknown>) => FlexSearchDocument
      }
      const index = new FlexSearch.Document({
        tokenize: 'forward',
        document: {
          id: 'slug',
          index: ['title', 'description', 'category'],
          store: ['slug', 'title', 'description', 'category'],
        },
      })

      try {
        const res = await fetch('/search-index.json')
        const docs: SearchResult[] = await res.json()
        docs.forEach((doc) => index.add(doc))
      } catch {
        // Index not available — search will just return empty
      }

      indexRef.current = index
    }
    init()
  }, [])

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value)
    if (!value.trim() || !indexRef.current) {
      setResults([])
      return
    }

    const fieldResults = await indexRef.current.searchAsync(value, 20, { enrich: true })
    const seen = new Set<string>()
    const combined: SearchResult[] = []

    for (const fieldResult of fieldResults) {
      for (const item of fieldResult.result) {
        const doc = item.doc
        if (doc && !seen.has(doc.slug)) {
          seen.add(doc.slug)
          combined.push(doc)
        }
      }
    }

    setResults(combined.slice(0, 12))
  }, [])

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          placeholder="Search documentation…"
          aria-label="Search documentation"
          aria-expanded={isOpen && results.length > 0}
          role="combobox"
          aria-controls="search-results"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className={cn(
            'w-full rounded-lg border border-surface-300 bg-white py-2 pl-10 pr-4',
            'text-sm text-surface-900 placeholder-surface-400',
            'focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-hidden',
            'dark:border-surface-600 dark:bg-surface-800 dark:text-surface-100 dark:placeholder-surface-500',
            'dark:focus:border-brand-400 dark:focus:ring-brand-800',
          )}
        />
      </div>

      {results.length > 0 && (
        <ul
          id="search-results"
          role="listbox"
          className={cn(
            'absolute top-full z-50 mt-1 w-full overflow-hidden rounded-lg',
            'border border-surface-200 bg-white shadow-lg',
            'dark:border-surface-700 dark:bg-surface-800',
          )}
        >
          {results.map((result) => (
            <li key={result.slug} role="option">
              <Link
                href={`/mdx/${result.slug}`}
                onClick={() => { setIsOpen(false); setQuery('') }}
                className={cn(
                  'flex flex-col gap-0.5 px-4 py-3 text-left',
                  'hover:bg-surface-50 focus-visible:bg-surface-50 outline-hidden',
                  'dark:hover:bg-surface-700 dark:focus-visible:bg-surface-700',
                )}
              >
                <span className="text-sm font-medium text-surface-900 dark:text-surface-100">
                  {result.title}
                </span>
                {result.description && (
                  <span className="text-xs text-surface-500 line-clamp-1">
                    {result.description}
                  </span>
                )}
                <span className="mt-0.5 self-start rounded bg-surface-100 px-1.5 py-0.5 text-2xs text-surface-500 dark:bg-surface-700 dark:text-surface-400">
                  {result.category}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
