import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Viewport configurations for responsive accessibility testing.
 * Desktop: 1440×900 (standard laptop)
 * Tablet: 1024×1366 (iPad Pro 11" portrait)
 */
const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 1024, height: 1366 },
} as const;

type ViewportName = keyof typeof VIEWPORTS;

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'dashboard', path: '/dashboard/' },
  { name: 'status', path: '/status' },
] as const;

/**
 * Format a list of axe violations into a readable string for test output.
 */
function formatViolations(
  violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations'],
): string {
  if (violations.length === 0) return '  (none)';
  return violations
    .map(
      (v) =>
        `  [${(v.impact ?? 'unknown').toUpperCase()}] ${v.id}: ${v.description}\n` +
        `    Help: ${v.helpUrl}\n` +
        `    Elements affected: ${v.nodes.length}\n` +
        `    Tags: ${(v.tags ?? []).join(', ')}`,
    )
    .join('\n\n');
}

test.describe('Accessibility compliance', () => {
  for (const page of PAGES) {
    for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
      test(`[${viewportName}] ${page.name} page — no critical or serious violations`, async ({
        page: pageObj,
      }) => {
        // Record viewport in test annotations
        test.info().annotations.push({
          type: 'viewport',
          description: `${viewportName} (${viewport.width}×${viewport.height})`,
        });

        // Set viewport explicitly so tests are independent of project config
        await pageObj.setViewportSize(viewport);

        // Navigate to the page — use 'load' instead of 'networkidle' because
        // Cloudflare-deployed Next.js apps often have long-lived connections
        // (analytics, WebSockets, SSE) that prevent 'networkidle' from settling.
        await pageObj.goto(page.path, { waitUntil: 'load' });

        // Give dynamic content (images, fonts, lazy sections) time to render
        await pageObj.waitForTimeout(2000);

        // Run axe-core analysis with standard WCAG tags + best-practice rules
        const results = await new AxeBuilder({ page: pageObj })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
          .analyze();

        const { violations } = results;

        // --- Log all violations for debugging ---
        // Minor and moderate violations are informational only and don't fail the test.
        if (violations.length > 0) {
          console.log(
            `\n=== 🌐 [${viewportName}] ${page.name} — ${violations.length} total violation(s) ===`,
          );
          console.log(formatViolations(violations));
        }

        // --- Count by severity ---
        const criticalCount = violations.filter((v) => v.impact === 'critical').length;
        const seriousCount = violations.filter((v) => v.impact === 'serious').length;
        const minorModerateCount =
          violations.length - criticalCount - seriousCount;

        test.info().annotations.push({
          type: 'violations',
          description: `critical=${criticalCount} serious=${seriousCount} minor/moderate=${minorModerateCount} total=${violations.length}`,
        });

        // --- Assert: fail on critical or serious violations ---
        const criticalSerious = violations.filter(
          (v) => v.impact === 'critical' || v.impact === 'serious',
        );

        expect(
          criticalSerious,
          criticalSerious.length > 0
            ? `❌ ${criticalSerious.length} critical/serious violation(s) on "${page.name}" (${viewportName}):\n${formatViolations(criticalSerious)}`
            : undefined,
        ).toHaveLength(0);
      });
    }
  }
});
