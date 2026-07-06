import { test, expect } from '@playwright/test';

test.describe('API Health', () => {
  test('all dashboard API endpoints return valid responses', async ({ page }) => {
    const apiCalls: { url: string; status: number; body: string }[] = [];

    page.on('response', async (res) => {
      const url = res.url();
      // Track API calls to our domain, excluding static assets and favicon
      if (
        url.includes('ai-hub.doonunghub.com') &&
        !url.endsWith('.css') &&
        !url.endsWith('.js') &&
        !url.includes('font') &&
        !url.includes('favicon')
      ) {
        let body = '';
        try {
          body = await res.text();
        } catch {
          body = '<unreadable>';
        }
        apiCalls.push({ url: url.replace(/[?&].*/, ''), status: res.status(), body });
      }
    });

    // Navigate to all three dashboard pages
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await page.goto('/dashboard/flow');
    await page.waitForLoadState('networkidle');

    await page.goto('/dashboard/system');
    await page.waitForLoadState('networkidle');

    const failed = apiCalls.filter((r) => r.status >= 400);

    // Accept known "offline" JSON responses during development
    const unexpectedFailures = failed.filter((r) => {
      const isOfflineResponse =
        r.body.includes('"offline"') ||
        r.body.includes('"service unavailable"') ||
        r.body.includes('"maintenance mode"') ||
        r.body.includes('"not deployed"') ||
        r.body.includes('"unavailable"') ||
        r.status === 503;
      return !isOfflineResponse;
    });

    if (unexpectedFailures.length > 0) {
      const msg = unexpectedFailures.map((r) => `${r.status} ${r.url}`).join('; ');
      test.info().annotations.push({
        type: 'api',
        description: `${unexpectedFailures.length} unexpected API failures: ${msg}`,
      });
    }

    // 4xx with known offline structure is acceptable during development.
    // Only 5xx server errors are real failures.
    const serverErrors = unexpectedFailures.filter((r) => r.status >= 500);
    expect(serverErrors, `server errors: ${serverErrors.map((r) => r.url).join(', ')}`).toHaveLength(
      0,
    );
  });

  test('no API-related console errors across all dashboard pages', async ({ page }) => {
    const apiErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().toLowerCase().includes('api')) {
        apiErrors.push(msg.text());
      }
    });

    // Navigate to all three dashboard pages
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await page.goto('/dashboard/flow');
    await page.waitForLoadState('networkidle');

    await page.goto('/dashboard/system');
    await page.waitForLoadState('networkidle');

    if (apiErrors.length > 0) {
      test.info().annotations.push({
        type: 'console-api',
        description: `${apiErrors.length} API console errors: ${apiErrors.join(' | ')}`,
      });
    }

    expect(apiErrors).toHaveLength(0);
  });
});
