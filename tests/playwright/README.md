# AI Hub Dashboard — Playwright Regression Suite

End-to-end and visual regression tests for the [AI Operations Portal](https://ai-hub.doonunghub.com).

## Prerequisites

- Node.js 22+
- npm

## Install

```bash
# From the project root
npm ci
npx playwright install --with-deps chromium
```

## Run locally

```bash
# All tests — Chromium + tablet
npx playwright test

# Single project
npx playwright test --project=chromium
npx playwright test --project=tablet

# Single test file
npx playwright test tests/auth.spec.ts

# With UI mode (interactive)
npx playwright test --ui
```

## View the report

After a run, open the HTML report:

```bash
npx playwright show-report playwright-report/
```

## Project structure

```
tests/
├── playwright/
│   └── README.md         ← this file
├── smoke.spec.ts
├── auth.spec.ts
├── dashboard.spec.ts
├── api.spec.ts
└── visual-regression.spec.ts
```

## Configuration

Key settings in `playwright.config.ts`:

| Setting            | Value                                      |
| ------------------ | ------------------------------------------ |
| Projects           | Desktop Chromium, iPad Pro 11 (tablet)     |
| Retries            | 2                                          |
| Parallel workers   | 4 (CI) / 2 (local)                         |
| Timeout (per test) | 30 seconds                                 |
| Base URL           | `https://ai-hub.doonunghub.com`            |
| Trace              | Retained on failure                        |
| Screenshot         | Captured on failure                        |
| Video              | Retained on failure                        |

## CI integration

Tests run automatically via GitHub Actions on:

- **Push** to `main` or `e2e/*` branches
- **Pull request** targeting `main`

After a CI run:
1. The **playwright-report** artifact is always uploaded (HTML report).
2. On failure, **test-results** (traces, videos, screenshots) are uploaded for debugging.

Download the artifact from the Actions tab and open locally:

```bash
npx playwright show-report <extracted-folder>/playwright-report/
```

## Tips

- Add `--headed` to see the browser window (local only).
- Add `--debug` to step through a test with the Playwright inspector.
- Use `--reporter=list` for a compact CLI output.
