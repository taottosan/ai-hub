import { notFound } from 'next/navigation'
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import matter from 'gray-matter'
import { formatDate } from '@/lib/utils'
import MdxContent from '@/components/MdxContent'

/** Server-side MDX → HTML compilation */
async function compileMdxToHtml(source: string): Promise<string> {
  const { unified } = await import('unified')
  const remarkParse = (await import('remark-parse')).default
  const remarkGfm = (await import('remark-gfm')).default
  const remarkRehype = (await import('remark-rehype')).default
  const rehypeStringify = (await import('rehype-stringify')).default
  const rehypeShiki = (await import('@shikijs/rehype')).default

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeShiki, { theme: 'material-theme-darker' })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(source)

  return String(file)
}

/** Resolve content path from slug */
function resolvePath(slug: string[]): string | null {
  const base = join(process.cwd(), 'src', 'content')
  const rel = slug.map(s => s.replace(/\.\./g, '')).join('/')

  for (const ext of ['.mdx', '.md']) {
    const p = join(base, rel + ext)
    if (existsSync(p)) return p
  }
  return null
}

/** Recursively find all mdx/md files in the content directory */
function findContentFiles(): string[] {
  const base = join(process.cwd(), 'src', 'content')
  if (!existsSync(base)) return []
  const files: string[] = []
  function walk(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory() && !entry.name.startsWith('.')) walk(full)
      else if (entry.isFile() && /\.mdx?$/.test(entry.name)) files.push(full)
    }
  }
  walk(base)
  return files
}

interface Props {
  params: Promise<{ slug: string[] }>
}

/** Generate all static paths at build time */
export async function generateStaticParams() {
  const files = findContentFiles()
  const base = join(process.cwd(), 'src', 'content')
  return files.map((f) => {
    const rel = relative(base, f).replace(/\.mdx?$/, '')
    const segments = rel.split(/[\\/]/)
    return { slug: segments }
  })
}

export default async function MdxPage({ params }: Props) {
  const { slug } = await params
  const filePath = resolvePath(slug || [])
  if (!filePath) notFound()

  const raw = readFileSync(filePath, 'utf-8')
  const { data: frontmatter, content: body } = matter(raw)

  const title = frontmatter.title || slug?.join('/') || 'Untitled'
  const description = frontmatter.description || ''
  const date = frontmatter.date || ''

  // Compile MDX to HTML server-side
  let html: string
  try {
    html = await compileMdxToHtml(body)
  } catch (err) {
    console.error(`MDX compilation error for ${filePath}:`, err)
    html = `<pre class="text-danger">Error rendering content</pre>`
  }

  return (
    <article className="prose prose-surface max-w-none dark:prose-invert">
      <header className="mb-8 not-prose">
        <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
          {title}
        </h1>
        {(description || date) && (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-surface-500 dark:text-surface-400">
            {description && <p className="m-0">{description}</p>}
            {date && (
              <time dateTime={date} className="ml-auto">
                {formatDate(date)}
              </time>
            )}
          </div>
        )}
      </header>

      <MdxContent html={html} />
    </article>
  )
}
