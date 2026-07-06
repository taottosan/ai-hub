import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('home page loads with status 200 and correct title', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/AI Hub|Memory Platform/);
  });

  test('no uncaught JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors, 'uncaught JS errors').toHaveLength(0);
  });

  test('no failed network requests', async ({ page }) => {
    const failedReqs: string[] = [];
    page.on('requestfailed', (req) => {
      failedReqs.push(`${req.failure()?.errorText ?? 'unknown'} ${req.url()}`);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(failedReqs, 'failed network requests').toHaveLength(0);
  });

  test('favicon loads successfully', async ({ page }) => {
    const responses: Map<string, number> = new Map();
    page.on('response', (res) => responses.set(res.url(), res.status()));

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if any response was for a favicon resource
    const faviconResponses = Array.from(responses.entries()).filter(([url]) =>
      url.includes('favicon'),
    );

    // Some sites embed favicon inlined or use an emoji favicon;
    // only assert if we actually saw a network request for it
    for (const [url, status] of faviconResponses) {
      expect(status, `favicon at ${url}`).toBe(200);
    }
  });

  test('page has a visible heading with text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2, [role="heading"]').first();
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });
});
