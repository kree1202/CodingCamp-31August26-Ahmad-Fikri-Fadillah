/**
 * Integration test for the Syaflower Shop gallery "All" filter.
 *
 * Feature: syaflower-shop, Property 2: "All" filter reveals every card
 * Validates: Requirements 5.4
 *
 * After applying a non-"all" filter (which hides some cards), clicking the
 * "All" button must reveal every product card — i.e. zero cards may carry
 * the `.product-card--hidden` class.
 */

import { test, expect, type Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Absolute file:/// URL pointing to the project root index.html
const INDEX_HTML = (() => {
  const abs = path.resolve(__dirname, '..', 'index.html');
  return 'file:///' + abs.replace(/\\/g, '/');
})();

// Non-"all" filter values to use as the "pre-filter" step
const NON_ALL_FILTERS = ['roses', 'tulips', 'bouquets', 'wedding', 'seasonal'] as const;

test.describe('Property 2: "All" filter reveals every card', () => {

  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto(INDEX_HTML);
    // Wait for renderGallery() to inject product cards into the DOM
    await page.waitForSelector('.product-card');
  });

  for (const preFilter of NON_ALL_FILTERS) {
    test(`after filtering by "${preFilter}", clicking "All" hides zero cards`, async ({ page }: { page: Page }) => {
      // Step 1 — apply a non-"all" filter so that some cards are hidden
      await page.locator(`.filter-btn[data-filter="${preFilter}"]`).click();

      // Wait for filter animation (transition duration ≤ 300ms per spec)
      await page.waitForTimeout(350);

      // Step 2 — click the "All" filter button
      await page.locator('.filter-btn[data-filter="all"]').click();

      // Wait for the reveal animation to complete
      await page.waitForTimeout(350);

      // Step 3 — assert: zero product cards carry .product-card--hidden
      const hiddenCards = page.locator('.product-card.product-card--hidden');
      await expect(hiddenCards).toHaveCount(0);
    });
  }

  test('clicking "All" after cycling through every non-"all" filter reveals all cards', async ({ page }: { page: Page }) => {
    // Cycle through every non-"all" filter, then finish on "All"
    for (const preFilter of NON_ALL_FILTERS) {
      await page.locator(`.filter-btn[data-filter="${preFilter}"]`).click();
      await page.waitForTimeout(100);
    }

    // Click "All" to reset
    await page.locator('.filter-btn[data-filter="all"]').click();
    await page.waitForTimeout(350);

    // All cards must be visible — none may carry .product-card--hidden
    const hiddenCards = page.locator('.product-card.product-card--hidden');
    await expect(hiddenCards).toHaveCount(0);

    // Cross-check: at least one card is actually present (guard against empty grid)
    const allCards = page.locator('.product-card');
    await expect(allCards).not.toHaveCount(0);
  });

});
