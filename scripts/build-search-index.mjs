/**
 * build-search-index.mjs
 *
 * Build script: scans the synced content directory and produces a
 * search-index.json consumed by the FlexSearch client-side component.
 *
 * Usage:
 *   node scripts/build-search-index.mjs
 *
 * This must run AFTER sync-content.mjs.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join, basename, dirname, extname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = join(__dirname, '..', 'src', 'content')
const OUTPUT_FILE = join(__dirname, '..', 'public', 'search-index.json')

/**
 * Simple frontmatter parser (avoids importing gray-matter at build time
 * on the runtime bundle — it's a dev-only script).
 */
function extractFrontmatter(content) {
  const fm = { title: '', description: '', category: '', tags: [] }

  const match = content.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) return fm

  const lines = match[1].split('\n')
  for (const line of lines) {
    const colonIdx = line.indexOf(':')
    if (colonIdx < 0) continue

    const key = line.slice(0, colonIdx).trim()
    let value = line.slice(colonIdx + 1).trim()

    // Handle arrays like tags: [tag1, tag2]
    if (value.startsWith('[') && value.endsWith(']')) {
      fm.tags = value.slice(1, -1).split(',').map(t => t.trim().replace(/["']/g, ''))
      continue
    }

    value = value.replace(/^["']|["']$/g, '')

    switch (key) {
      case 'title':
        fm.title = value; break
      case 'description':
        fm.description = value; break
      case 'category':
        fm.category = value; break
      case 'tags':
        fm.tags = value.split(',').map(t => t.trim()); break
    }
  }

  return fm
}

function findContentFiles(dir) {
  if (!existsSync(dir)) return []
  const entries = readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      files.push(...findContentFiles(full))
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.push(full)
    }
  }
  return files
}

function main() {
  console.log('\n  Building search index...\n')

  if (!existsSync(CONTENT_DIR)) {
    console.log(`  Content directory not found at ${CONTENT_DIR}`)
    console.log('  Run node scripts/sync-content.mjs first.\n')
    writeFileSync(OUTPUT_FILE, '[]', 'utf-8')
    console.log('  Wrote empty search-index.json\n')
    return
  }

  const files = findContentFiles(CONTENT_DIR)
  const docs = []

  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8')
      const fm = extractFrontmatter(content)
      const relPath = relative(CONTENT_DIR, file)
      const slug = relPath.replace(/\.mdx$/, '').replace(/\\/g, '/')

      docs.push({
        slug,
        title: fm.title || basename(file).replace(/\.mdx$/, ''),
        description: fm.description || '',
        category: fm.category || fm.tags?.[0] || 'uncategorized',
      })
    } catch (err) {
      console.error(`  ✗ Error reading ${file}: ${err}`)
    }
  }

  writeFileSync(OUTPUT_FILE, JSON.stringify(docs, null, 2), 'utf-8')
  console.log(`  Indexed ${docs.length} documents → ${OUTPUT_FILE}\n`)
}

main()
