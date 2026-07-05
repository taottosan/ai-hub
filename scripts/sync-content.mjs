/**
 * sync-content.mjs
 *
 * Build script: copies Obsidian vault markdown files into the Next.js content
 * directory so they become routable MDX pages.
 *
 * Usage:
 *   node scripts/sync-content.mjs
 *
 * Configured via env vars:
 *   OBSIDIAN_VAULT_PATH   — path to Obsidian vault (default: ../obsidian-vault/projects/ai-memory-platform)
 *   CONTENT_DEST          — destination directory (default: src/content)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, basename, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, '..')

// Configurable paths
const OBSIDIAN_VAULT = process.env.OBSIDIAN_VAULT_PATH
  || join(PROJECT_ROOT, '..', '..', 'obsidian-vault', 'projects', 'ai-memory-platform')

const CONTENT_DEST = process.env.CONTENT_DEST
  || join(PROJECT_ROOT, 'src', 'content')

// Resolve to absolute
const sourceDir = join(PROJECT_ROOT, '..', '..', OBSIDIAN_VAULT.includes('..') ? join(PROJECT_ROOT, OBSIDIAN_VAULT) : OBSIDIAN_VAULT)
const destDir = join(PROJECT_ROOT, CONTENT_DEST.includes('..') ? join(PROJECT_ROOT, CONTENT_DEST) : CONTENT_DEST)

/**
 * Recursively find all .md files
 */
function findMdFiles(dir) {
  if (!existsSync(dir)) return []
  const entries = readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory() && entry.name !== '.obsidian' && !entry.name.startsWith('.')) {
      files.push(...findMdFiles(full))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(full)
    }
  }
  return files
}

/**
 * Convert Obsidian markdown to MDX:
 * - Replace [[wikilinks]] with standard MDX links
 * - Strip Obsidian-specific frontmatter if present
 * - Add proper MDX frontmatter
 */
function obsidianToMdx(filePath) {
  const content = readFileSync(filePath, 'utf-8')

  let body = content

  // Strip frontmatter if it exists
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/)
  let frontmatter = {}
  if (fmMatch) {
    try {
      const fmLines = fmMatch[1].split('\n')
      for (const line of fmLines) {
        const colonIdx = line.indexOf(':')
        if (colonIdx > 0) {
          const key = line.slice(0, colonIdx).trim()
          let value = line.slice(colonIdx + 1).trim()
          // Remove quotes
          value = value.replace(/^["']|["']$/g, '')
          frontmatter[key] = value
        }
      }
    } catch {}
    body = content.slice(fmMatch[0].length)
  }

  // Convert [[Wikilink]] → [Wikilink](/mdx/path-to-wikilink)
  body = body.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, link, alias) => {
    const slug = link
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
    const text = alias || link
    return `[${text}](/mdx/${slug})`
  })

  // Convert Obsidian callouts (> [!NOTE]) to blockquotes
  body = body.replace(/^>\s*\[!(\w+)\]/gm, (_, type) => {
    const labels = { NOTE: '📝 Note', WARNING: '⚠️ Warning', TIP: '💡 Tip', IMPORTANT: '🔑 Important', CAUTION: '⚡ Caution' }
    return `> **${labels[type] || type}**`
  })

  // Add interword spacing improvements
  body = body.replace(/\n{3,}/g, '\n\n')

  return body
}

function main() {
  console.log('')
  console.log('╔══════════════════════════════════════════╗')
  console.log('║   Memory Platform Academy — Content Sync  ║')
  console.log('╚══════════════════════════════════════════╝')
  console.log('')
  console.log(`  Source: ${sourceDir}`)
  console.log(`  Dest:   ${destDir}`)
  console.log('')

  if (!existsSync(sourceDir)) {
    console.error(`  ✗ Source directory not found: ${sourceDir}`)
    console.error('  Set OBSIDIAN_VAULT_PATH env var to the correct path.')
    process.exit(1)
  }

  // Ensure destination exists
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true })
  }

  const files = findMdFiles(sourceDir)
  console.log(`  Found ${files.length} markdown files\n`)

  let copied = 0
  let errors = 0

  for (const file of files) {
    try {
      const relPath = relative(sourceDir, file)
      const mdxName = basename(relPath, '.md') + '.mdx'
      const mdxRelPath = join(dirname(relPath), mdxName)
      const destPath = join(destDir, mdxRelPath)
      const destDirPath = dirname(destPath)

      if (!existsSync(destDirPath)) {
        mkdirSync(destDirPath, { recursive: true })
      }

      const mdxBody = obsidianToMdx(file)
      writeFileSync(destPath, mdxBody, 'utf-8')
      copied++

      if (copied <= 5 || copied % 5 === 0) {
        process.stdout.write(`  ✓ ${mdxRelPath}\n`)
      }
    } catch (err) {
      console.error(`  ✗ Error processing ${file}: ${err}`)
      errors++
    }
  }

  console.log(`\n  Done: ${copied} files synced, ${errors} errors\n`)
}

main()
