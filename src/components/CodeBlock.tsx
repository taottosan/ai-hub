import { cn } from '@/lib/utils'

interface HighlightProps {
  children: string
  lang?: string
  className?: string
}

export function Highlight({ children, lang, className }: HighlightProps) {
  return (
    <div className={cn('my-4 overflow-x-auto rounded-lg border border-surface-200 dark:border-surface-700', className)}>
      {lang && (
        <div className="border-b border-surface-200 bg-surface-50 px-4 py-1 text-xs font-medium text-surface-500 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-400">
          {lang}
        </div>
      )}
      <pre className="!m-0 !rounded-none !border-0">
        <code>{children}</code>
      </pre>
    </div>
  )
}

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  className?: string
}

export function CodeBlock({ code, language, title, className }: CodeBlockProps) {
  return (
    <div className={cn('my-4 overflow-x-auto rounded-lg border border-surface-200 dark:border-surface-700', className)}>
      {title && (
        <div className="flex items-center gap-2 border-b border-surface-200 bg-surface-50 px-4 py-2 text-xs font-medium text-surface-600 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          {title}
        </div>
      )}
      <pre className="!m-0 !rounded-none !border-0">
        <code className={language ? `language-${language}` : ''}>{code.trim()}</code>
      </pre>
    </div>
  )
}
