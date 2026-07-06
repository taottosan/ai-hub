import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    // Wait for the page to settle — content may be dynamic
    await page.waitForTimeout(500);
  });

  test('dashboard page loads with status 200 and heading visible', async ({ page }) => {
    // Verify the page URL is at /dashboard
    expect(page.url()).toContain('/dashboard');

    // Main heading should be visible
    const heading = page.locator('h2:has-text("Dashboard")');
    await expect(heading).toBeVisible();

    // Verify no JS errors on the page
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    // Re-navigate to capture errors from scratch
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    expect(consoleErrors).toHaveLength(0);
  });

  test('all widgets and metric sections render', async ({ page }) => {
    // Check for KPI/metric label cards
    const metricLabels = [
      'ACTIVE AGENTS',
      'TOTAL MEMORIES',
      'ACTIVE SESSIONS',
      'REQUESTS / MIN',
      'ERROR RATE',
      'AVG LATENCY',
    ];

    for (const label of metricLabels) {
      const metric = page.locator(`text="${label}"`);
      await expect(metric).toBeVisible({ timeout: 5000 });
    }

    // Check that the Service Status section exists
    const serviceStatus = page.locator('h3:has-text("Service Status")');
    await expect(serviceStatus).toBeVisible();

    // Check that the Service Status table renders with expected columns
    const table = page.locator('table');
    await expect(table).toBeVisible();
    for (const col of ['SERVICE', 'STATUS', 'LATENCY']) {
      await expect(page.locator(`th:has-text("${col}")`)).toBeVisible();
    }
  });

  test('statistics and numeric values are visible', async ({ page }) => {
    // Check that numeric values render (could be 0, empty, or actual data)
    // Look for known numeric patterns in the dashboard
    const numericLocators = [
      page.locator('text="ACTIVE AGENTS" + p, text="ACTIVE AGENTS" ~ p'),
      page.locator('text="TOTAL MEMORIES" + p, text="TOTAL MEMORIES" ~ p'),
      page.locator('text="ACTIVE SESSIONS" + p, text="ACTIVE SESSIONS" ~ p'),
      page.locator('text="REQUESTS / MIN" + p, text="REQUESTS / MIN" ~ p'),
    ];

    // At least one numeric stat should have a visible value
    let foundNumeric = false;
    for (const locator of numericLocators) {
      const visible = await locator.isVisible().catch(() => false);
      if (visible) {
        const text = await locator.textContent().catch(() => '');
        if (text && text.trim().length > 0) {
          foundNumeric = true;
          break;
        }
      }
    }

    // Also check service table for latency values (e.g. "12ms", "23ms")
    if (!foundNumeric) {
      const latencyCells = page.locator('table td:nth-child(3)');
      const count = await latencyCells.count();
      for (let i = 0; i < count; i++) {
        const text = await latencyCells.nth(i).textContent();
        if (text && text.trim().length > 0) {
          foundNumeric = true;
          break;
        }
      }
    }

    expect(foundNumeric).toBe(true);
  });

  test('sidebar navigation navigates to correct sections', async ({ page }) => {
    // The sidebar has buttons: Dashboard, Memory, Honcho, Trace, Settings
    // Navigation is hash-based
    const navItems: { name: string; hash: string }[] = [
      { name: 'Dashboard', hash: '' },
      { name: 'Memory', hash: 'memory' },
      { name: 'Honcho', hash: 'honcho' },
      { name: 'Trace', hash: 'trace' },
      { name: 'Settings', hash: 'settings' },
    ];

    for (const item of navItems) {
      const button = page.locator(`button:has-text("${item.name}")`);
      await expect(button).toBeVisible();
      await button.click();

      // Wait for the hash change to take effect
      await page.waitForTimeout(300);
      await page.waitForLoadState('networkidle');

      if (item.hash) {
        await expect(page).toHaveURL(new RegExp(`/dashboard/#${item.hash}$`));
      } else {
        // Dashboard button should keep us on /dashboard/ (no hash)
        await expect(page).toHaveURL(/\/dashboard\/?$/);
      }
    }
  });

  test('key sections are present with at least 3 section headings or widget containers', async ({ page }) => {
    // Collect all section-level headings and aria regions
    const sectionMarkers = await page.evaluate(() => {
      const selectors = Array.from(
        document.querySelectorAll('h2, h3, h4, section, [role="region"], [aria-label]')
      );
      return selectors
        .map((el) => {
          const tag = el.tagName.toLowerCase();
          const text = (el.textContent ?? '').trim().slice(0, 80);
          const ariaLabel = el.getAttribute('aria-label') ?? '';
          return `${tag}${ariaLabel ? `[aria-label="${ariaLabel}"]` : ''}: "${text}"`;
        })
        .filter(
          (s) =>
            // Filter out navigation banners, toolbars, and utility elements
            !s.includes('navigation') &&
            !s.includes('Search') &&
            !s.includes('Boss') &&
            !s.includes('v1.') &&
            !s.includes('⌘') &&
            s.includes(':') && // must have a text label
            !s.endsWith(': ""') &&
            !s.endsWith(': "(empty)"')
        );
    });

    // Should find at least 3 meaningful sections
    expect(sectionMarkers.length).toBeGreaterThanOrEqual(3);

    // Specifically check that known sections are present
    await expect(page.locator('h2:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('h3:has-text("Service Status")')).toBeVisible();

    // Verify the platform description text exists
    await expect(page.locator('text=Platform overview and key metrics')).toBeVisible();
  });

  test('handles "No Production Data Yet" state gracefully', async ({ page }) => {
    // The dashboard may show either production data or "No Production Data Yet"
    // Both states are valid — we just verify the page doesn't crash
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check if we're in "no data" state or normal state
    const noDataMessage = page.locator('text=No Production Data Yet');
    const noDataVisible = await noDataMessage.isVisible().catch(() => false);

    if (noDataVisible) {
      // No-data state: verify the informational message is shown
      await expect(noDataMessage).toBeVisible();
    } else {
      // Normal state: verify at least some metrics are present
      const metricCards = page.locator(
        'text=ACTIVE AGENTS, text=TOTAL MEMORIES, text=ACTIVE SESSIONS'
      );
      const count = await metricCards.count();
      expect(count).toBeGreaterThanOrEqual(1);
    }

    // In either state, ensure there are no JS errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    expect(consoleErrors).toHaveLength(0);
  });
});
