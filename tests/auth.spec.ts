import { test, expect, type Page } from '../fixtures/test-fixtures';

/**
 * Check whether authentication is enabled on this deployment.
 *
 * Navigates to /login and looks for common login-form elements.
 * Returns `false` if the page returns a 404, redirects to home,
 * or simply lacks the expected form controls — allowing the suite
 * to skip gracefully instead of failing.
 */
async function isAuthEnabled(page: Page): Promise<boolean> {
  const response = await page.goto('/login', { waitUntil: 'networkidle' });

  // 404 or non-2xx → no auth endpoint exposed
  if (!response || !response.ok()) {
    return false;
  }

  // Check the URL hasn't redirected us away from a login page
  const url = page.url();
  if (!url.includes('/login') && !url.includes('/auth') && !url.includes('/signin')) {
    return false;
  }

  // Look for common login-form controls
  const emailInput = page.locator(
    'input[type="email"], input[name="email"], input#email, input[autocomplete="email"]',
  );
  const passwordInput = page.locator('input[type="password"]');
  const submitButton = page.locator(
    'button[type="submit"], button:has-text("Sign In"), button:has-text("Login"), button:has-text("Log in")',
  );

  const hasEmail = (await emailInput.count()) > 0;
  const hasPassword = (await passwordInput.count()) > 0;
  const hasSubmit = (await submitButton.count()) > 0;

  return hasEmail && hasPassword && hasSubmit;
}

test.describe('Authentication', () => {
  let authEnabled = false;

  test.beforeAll(async ({ page }) => {
    authEnabled = await isAuthEnabled(page);
    test.info().annotations.push({
      type: 'auth',
      description: `Authentication enabled: ${authEnabled}`,
    });
  });

  // ---------------------------------------------------------------------------
  // Auth-disabled: all flow tests gracefully skip with a single descriptive note
  // ---------------------------------------------------------------------------
  test.describe('Auth flows', () => {
    const skipReason = 'Authentication is not enabled on this deployment';

    test('Login — fill credentials and verify redirect to dashboard', async ({ page }) => {
      test.skip(!authEnabled, skipReason);

      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const emailInput = page.locator(
        'input[type="email"], input[name="email"], input#email',
      ).first();
      const passwordInput = page.locator('input[type="password"]').first();
      const submitButton = page.locator(
        'button[type="submit"], button:has-text("Sign In"), button:has-text("Login")',
      ).first();

      await emailInput.fill(process.env.TEST_USER_EMAIL || 'test@example.com');
      await passwordInput.fill(process.env.TEST_USER_PASSWORD || 'password');
      await submitButton.click();

      // Wait for navigation — should land on dashboard or home
      await page.waitForLoadState('networkidle');
      expect(page.url()).not.toContain('/login');
      // Confirm we're on a logged-in page by checking for expected dashboard elements
      await expect(page.locator('nav, header, [role="navigation"]').first()).toBeVisible();
    });

    test('Logout — click logout and verify redirect to login', async ({ page }) => {
      test.skip(!authEnabled, skipReason);

      // Pre-condition: logged in
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const emailInput = page.locator(
        'input[type="email"], input[name="email"], input#email',
      ).first();
      const passwordInput = page.locator('input[type="password"]').first();
      const submitButton = page.locator(
        'button[type="submit"], button:has-text("Sign In"), button:has-text("Login")',
      ).first();

      await emailInput.fill(process.env.TEST_USER_EMAIL || 'test@example.com');
      await passwordInput.fill(process.env.TEST_USER_PASSWORD || 'password');
      await submitButton.click();
      await page.waitForLoadState('networkidle');

      // Click logout — handle various selector patterns
      const logoutButton = page.locator(
        'button:has-text("Logout"), button:has-text("Log out"), a:has-text("Logout"), a:has-text("Log out"), [href*="logout"], [href*="signout"]',
      );
      await logoutButton.first().click();
      await page.waitForLoadState('networkidle');

      // Should return to login
      const url = page.url();
      expect(
        url.includes('/login') || url.includes('/auth') || url.includes('/signin'),
      ).toBeTruthy();
    });

    test('Session persistence — login, navigate, refresh, still logged in', async ({ page }) => {
      test.skip(!authEnabled, skipReason);

      // Login
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const emailInput = page.locator(
        'input[type="email"], input[name="email"], input#email',
      ).first();
      const passwordInput = page.locator('input[type="password"]').first();
      const submitButton = page.locator(
        'button[type="submit"], button:has-text("Sign In"), button:has-text("Login")',
      ).first();

      await emailInput.fill(process.env.TEST_USER_EMAIL || 'test@example.com');
      await passwordInput.fill(process.env.TEST_USER_PASSWORD || 'password');
      await submitButton.click();
      await page.waitForLoadState('networkidle');

      // Navigate to another page
      await page.goto('/dashboard/memory');
      await page.waitForLoadState('networkidle');

      // Refresh the page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Verify still logged in — URL should not be /login
      const url = page.url();
      expect(
        !url.includes('/login') && !url.includes('/auth') && !url.includes('/signin'),
      ).toBeTruthy();
    });

    test('Protected routes — access /dashboard/ without auth redirects to login', async ({
      page,
    }) => {
      test.skip(!authEnabled, skipReason);

      // Clear any existing session
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(';').forEach((c) => {
          document.cookie = c.replace(/=.*/, '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/');
        });
      });

      await page.goto('/dashboard/');
      await page.waitForLoadState('networkidle');

      const url = page.url();
      expect(
        url.includes('/login') || url.includes('/auth') || url.includes('/signin'),
      ).toBeTruthy();
    });
  });

  // ---------------------------------------------------------------------------
  // Baseline check — always runs, even when auth is disabled
  // ---------------------------------------------------------------------------
  test('login page returns a valid response', async ({ page }) => {
    const response = await page.goto('/login', { waitUntil: 'networkidle' });
    // A 404 is valid behaviour when auth is off; a 5xx is not
    if (response) {
      expect(response.status()).toBeLessThan(500);
    }
  });
});
