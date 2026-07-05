'use client'

import { useMemo, useId } from 'react'
import type { MDXComponents } from 'mdx/types'

interface MdxContentProps {
  /** Raw markdown/MDX body rendered as HTML with rehype on the server */
  html: string
}

/**
 * Client-side renderer for MDX content.
 *
 * Receives pre-compiled HTML (produced by the server component via
 * unified/remark/rehype) and renders it. Mermaid diagrams are extracted
 * from <code class="language-mermaid"> blocks and hydrated client-side.
 */
export default function MdxContent({ html }: MdxContentProps) {
  const id = useId()

  const content = useMemo(() => {
    if (typeof document === 'undefined') return null

    // Create a temporary container to parse the HTML
    const container = document.createElement('div')
    container.innerHTML = html

    // Find all Mermaid code blocks and replace them with <Mermaid> placeholders
    const mermaidBlocks = container.querySelectorAll<HTMLElement>('code.language-mermaid')
    const replacements: Array<{ id: string; chart: string }> = []

    mermaidBlocks.forEach((block, index) => {
      const mid = `mermaid-${id}-${index}`
      const chart = block.textContent || ''
      replacements.push({ id: mid, chart })

      const placeholder = document.createElement('div')
      placeholder.className = 'mermaid-placeholder'
      placeholder.dataset.mermaidId = mid
      placeholder.dataset.chart = chart
      block.parentElement?.replaceWith(placeholder)
    })

    return container.innerHTML
  }, [html, id])

  // Hydrate Mermaid placeholders client-side
  useMemo(() => {
    if (typeof document === 'undefined' || !content) return

    const placeholders = document.querySelectorAll<HTMLElement>('.mermaid-placeholder[data-mermaid-id]')

    placeholders.forEach(async (el) => {
      const chart = el.dataset.chart
      if (!chart) return

      try {
        const { default: mermaid } = await import('mermaid')
        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'Inter, system-ui, sans-serif',
        })

        const { svg } = await mermaid.render(el.dataset.mermaidId || 'mermaid-dyn', chart)
        el.innerHTML = `<div class="mermaid-wrapper">${svg}</div>`
      } catch (err) {
        console.error('Mermaid render error:', err)
        el.innerHTML = `<pre class="text-danger p-4">⚠ Mermaid render failed</pre>`
      }
    })
  }, [content])

  return (
    <div
      className="mdx-content"
      dangerouslySetInnerHTML={{ __html: content || html }}
    />
  )
}
