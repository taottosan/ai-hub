'use client'

export default function ThemeToggle() {
  return (
    <button
      aria-label="Toggle color scheme"
      className={[
        'flex h-8 w-8 items-center justify-center rounded-md',
        'text-surface-500 hover:bg-surface-100 hover:text-surface-700',
        'dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-200',
      ].join(' ')}
      onClick={() => {
        document.documentElement.classList.toggle('dark')
      }}
    >
      {/* Sun icon */}
      <svg className="block h-4 w-4 dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      {/* Moon icon */}
      <svg className="hidden h-4 w-4 dark:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  )
}
