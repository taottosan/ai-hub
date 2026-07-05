# Memory Platform Academy

Interactive documentation site for the AI Memory Platform — built with Next.js, MDX, Mermaid.js, Shiki, FlexSearch, and Tailwind CSS.

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Next.js 15** (App Router) | Static site generation via `output: 'export'` |
| **MDX** (`@next/mdx`) | Render Obsidian vault content as pages |
| **Mermaid.js** | System architecture flowcharts & sequence diagrams |
| **Shiki** (`rehype-shiki`) | Syntax highlighting with `material-theme-darker` |
| **Tailwind CSS v4** | Accessible, high-contrast styles (colorblind-safe palette) |
| **FlexSearch** | Client-side full-text search (Ctrl+K) |
| **Cloudflare Pages** | Deployment via `@cloudflare/next-on-pages` |

## Getting Started

```bash
# Install
npm install

# Sync Obsidian vault content into src/content/
npm run sync-content

# Build the search index
npm run build-search-index

# Dev server
npm run dev

# Production build + preview
npm run build
npm run start
```

## Deployment

```bash
# Full deploy to Cloudflare Pages
npm run deploy

# — or step by step —
npm run sync-content
npm run build-search-index
npm run pages:build
npm run pages:deploy     # requires wrangler login
npm run pages:preview    # local preview
```

## Build Scripts

| Script | Description |
|--------|-------------|
| `sync-content.mjs` | Copies `.md` files from Obsidian vault → `src/content/` as `.mdx`, converts wikilinks and callouts |
| `build-search-index.mjs` | Scans `src/content/` → produces `public/search-index.json` for FlexSearch |

## Architecture

The site uses:

- **Catch-all route** `app/mdx/[...slug]/page.tsx` — reads any `.md`/`.mdx` file from `src/content/` and renders it
- **Server-side MDX compilation** via `unified` + `remark-parse` + `remark-gfm` + `rehype-shiki` + `rehype-stringify`
- **Client-side Mermaid hydration** — `MdxContent` component extracts `language-mermaid` code blocks and renders them with Mermaid.js
- **FlexSearch index** built at build time, loaded client-side via `public/search-index.json`

## Color Palette

Designed for accessibility (WCAG AA+) with colorblind-safe contrast:

- **Brand:** Blue (`#2050d6`) — navigation, links, primary actions
- **Accent:** Orange (`#e67300`) — call-to-action, highlights
- **Success:** Dark green (`#1a7b3a`) — distinguishable from red even with deuteranopia
- **Danger:** Dark red (`#b32424`) — always paired with icons, never standalone
