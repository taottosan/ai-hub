import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-6xl font-bold text-surface-300 dark:text-surface-700">
        404
      </div>
      <h1 className="mt-4 text-2xl font-bold text-surface-900 dark:text-surface-50">
        Page Not Found
      </h1>
      <p className="mt-2 text-surface-500 dark:text-surface-400">
        This content hasn&apos;t been synced from the Obsidian vault yet.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
      >
        ← Back to Home
      </Link>
    </div>
  )
}
