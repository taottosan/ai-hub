/**
 * Visual Regression Tests — AI Hub Dashboard
 *
 * ## How it works
 * - Playwright's toHaveScreenshot() stores baseline images on the first run.
 * - The first run WILL FAIL (no baseline yet). That is expected.
 * - On subsequent runs, new screenshots are compared against the stored baseline.
 * - If pixel differences exceed the threshold, the test fails.
 *
 * ## Updating baselines
 * Delete the images in tests/visual-regression-snapshots/ and re-run.
 * The directory is gitignored — baselines are meant to be regenerated locally.
 *
 * ## Storage
 * Snapshots are stored in tests/visual-regression-snapshots/
 * (configured via snapshotDir + snapshotPathTemplate in playwright.config.ts)
 *
 *   tests/visual-regression-snapshots/
 *   ├── dashboard-desktop.png   (1920x1080)
 *   └── dashboard-tablet.png    (1024x1366)
 */

import { test, expect } from '../fixtures/test-fixtures';

test.describe('Visual Regression', () => {
  test('dashboard desktop 1920x1080 matches baseline', async ({ page }) => {
    test.info().annotations.push({
      type: 'viewport',
      description: '1920x1080',
    });

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/dashboard/');
    await page.waitForLoadState('networkidle');

    // On first run, Playwright auto-creates the baseline and the test fails.
    // On subsequent runs, it compares against the existing baseline.
    // maxDiffPixels is set globally (100) in playwright.config.ts;
    // the explicit option here reinforces the intent.
    await expect(page).toHaveScreenshot('dashboard-desktop.png', {
      maxDiffPixels: 100,
    });
  });

  test('dashboard tablet 1024x1366 matches baseline', async ({ page }) => {
    test.info().annotations.push({
      type: 'viewport',
      description: '1024x1366',
    });

    await page.setViewportSize({ width: 1024, height: 1366 });
    await page.goto('/dashboard/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('dashboard-tablet.png', {
      maxDiffPixels: 100,
    });
  });
});
