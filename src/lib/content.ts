import { readFileSync, readdirSync, statSync, existsSync, mkdirSync, copyFileSync } from 'node:fs'
import { join, relative, basename, extname, dirname } from 'node:path'

export interface ContentMeta {
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
  date: string
  wordCount: number
  path: string
}

const SOURCE_DIR = join(import.meta.dirname, '..', 'obsidian-vault', 'projects', 'ai-memory-platform')
const DEST_DIR = join(import.meta.dirname, '..', 'memory-platform', 'academy', 'src', 'content')

/** Recursively find all .md files in source */
export function findMdFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory() && entry.name !== '.obsidian') {
      files.push(...findMdFiles(full))
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      files.push(full)
    }
  }
  return files
}

/** Parse frontmatter from markdown content */
export function parseFrontmatter(content: string): Record<string, unknown> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const matter = require('gray-matter')
  return matter(content).data
}

/** Strip frontmatter, return body only */
export function stripFrontmatter(content: string): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const matter = require('gray-matter')
  return matter(content).content
}

/** Read a content file and return its metadata */
export function readContentMeta(filePath: string): ContentMeta | null {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const relPath = relative(SOURCE_DIR, filePath)
    const { data, content: body } = require('gray-matter')(content)
    const slug = relPath
      .replace(/\.mdx?$/, '')
      .replace(/\\/g, '/')

    return {
      slug,
      title: data.title || basename(filePath).replace(/\.mdx?$/, ''),
      description: data.description || '',
      category: data.category || data.tags?.[0] || 'uncategorized',
      tags: data.tags || [],
      date: data.date || data.created || '',
      wordCount: body.split(/\s+/).length,
      path: relPath,
    }
  } catch {
    return null
  }
}

/** Copy content files from obsidian vault to the academy content dir */
export function syncContent(sourceDir = SOURCE_DIR, destDir = DEST_DIR): { copied: number; skipped: number; errors: string[] } {
  if (!existsSync(sourceDir)) {
    return { copied: 0, skipped: 0, errors: [`Source not found: ${sourceDir}`] }
  }

  const errors: string[] = []
  let copied = 0
  let skipped = 0

  const files = findMdFiles(sourceDir)

  for (const file of files) {
    try {
      const relPath = relative(sourceDir, file)
      const destPath = join(destDir, relPath)
      const destDirPath = dirname(destPath)

      if (!existsSync(destDirPath)) {
        mkdirSync(destDirPath, { recursive: true })
      }

      copyFileSync(file, destPath)
      copied++
    } catch (err) {
      errors.push(`${file}: ${err}`)
      skipped++
    }
  }

  return { copied, skipped, errors }
}

/** Build a search index from content files */
export function buildSearchIndex(sourceDir = DEST_DIR): ContentMeta[] {
  if (!existsSync(sourceDir)) return []
  const files = findMdFiles(sourceDir)
  return files
    .map(readContentMeta)
    .filter((m): m is ContentMeta => m !== null)
}
