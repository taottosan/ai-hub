import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import Mermaid from '@/components/Mermaid'
import { Highlight, CodeBlock } from '@/components/CodeBlock'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href, children, ...props }) => {
      if (href?.startsWith('http') || href?.startsWith('//')) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
          </a>
        )
      }
      return (
        <Link href={href || '#'} {...props}>
          {children}
        </Link>
      )
    },
    pre: ({ children, ...props }) => {
      // If <pre> contains a <code> block, let shiki handle it
      return <pre {...props}>{children}</pre>
    },
    code: ({ className, children, ...props }) => {
      const isBlock = className?.startsWith('language-')
      if (isBlock) {
        return <code className={className} {...props}>{children}</code>
      }
      return (
        <code
          className="rounded bg-surface-100 px-1.5 py-0.5 text-sm font-medium text-surface-800 dark:bg-surface-800 dark:text-surface-200"
          {...props}
        >
          {children}
        </code>
      )
    },
    Mermaid,
    Highlight,
    CodeBlock,
    ...components,
  }
}
