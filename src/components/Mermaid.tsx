'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface MermaidProps {
  chart: string
  caption?: string
  className?: string
}

export default function Mermaid({ chart, caption, className }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null)
  const renderId = useRef(`mermaid-${Math.random().toString(36).slice(2, 9)}`)

  useEffect(() => {
    let mounted = true

    async function render() {
      const { default: mermaid } = await import('mermaid')
      if (!mounted || !ref.current) return

      mermaid.initialize({
        startOnLoad: false,
        theme: window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark' : 'default',
        themeVariables: {
          primaryColor: '#2050d6',
          primaryTextColor: '#ffffff',
          primaryBorderColor: '#14348f',
          lineColor: '#5a6070',
          secondaryColor: '#ffedd5',
          tertiaryColor: '#f8f9fb',
        },
        fontFamily: 'Inter, system-ui, sans-serif',
        securityLevel: 'loose',
      })

      try {
        const { svg } = await mermaid.render(renderId.current, chart)
        if (mounted && ref.current) {
          ref.current.innerHTML = svg
        }
      } catch (err) {
        console.error('Mermaid render error:', err)
        if (mounted && ref.current) {
          ref.current.innerHTML = `<pre class="text-danger">⚠ Mermaid render failed: ${err}</pre>`
        }
      }
    }

    render()
    return () => { mounted = false }
  }, [chart])

  return (
    <figure className={cn('mermaid-wrapper', className)}>
      <div ref={ref} className="w-full" />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-surface-500">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
