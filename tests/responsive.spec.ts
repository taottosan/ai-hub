import { test, expect } from '../fixtures/test-fixtures';

test.describe('Responsive Design', () => {
  const breakpoints = [
    { name: 'Desktop 1440x900', width: 1440, height: 900 },
    { name: 'Tablet 1024x1366', width: 1024, height: 1366 },
  ];

  for (const bp of breakpoints) {
    test(`dashboard renders correctly at ${bp.name}`, async ({ page }) => {
      test.info().annotations.push({
        type: 'viewport',
        description: `Testing at ${bp.width}x${bp.height}`,
      });

      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('/dashboard/');
      await page.waitForLoadState('networkidle');

      // Verify the "Dashboard" navigation link is visible
      const dashboardLink = page.getByRole('link', { name: /dashboard/i });
      await expect(dashboardLink.first()).toBeVisible();

      // Verify no horizontal scrollbar — content width must not exceed viewport
      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );
      expect(hasHorizontalScroll).toBe(false);

      // Verify main content area renders
      const main = page.locator('main, [role="main"], #__next');
      await expect(main.first()).toBeVisible({ timeout: 5_000 });
    });
  }
});
