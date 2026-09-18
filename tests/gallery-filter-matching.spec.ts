/**
 * Integration tests for the Syaflower Shop gallery filter — matching cards only.
 *
 * Feature: syaflower-shop, Property 1: Gallery filter shows only matching cards
 * Validates: Requirements 5.3
 *
 * For each non-"all" filter button, every visible card after the click
 * (.product-card:not(.product-card--hidden)) must have a data-category
 * attribute that exactly matches the selected filter value.
 */

import { test, expect, type Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute file:/// URL — one directory up from /tests to reach the root index.html
const INDEX_HTML = (() => {
  const abs = path.resolve(__dirname, '..', 'index.html');
  // Convert Windows backslashes to forward slashes for the file:// protocol
  return 'file:///' + abs.replace(/\\/g, '/');
})();

// Only non-"all" filter values — "all" is covered by Property 2 (task 8.4)
const NON_ALL_FILTERS = ['roses', 'tulips', 'bouquets', 'wedding', 'seasonal'] as const;

test.describe('Property 1: Gallery filter shows only matching cards', () => {

  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto(INDEX_HTML);
    // Wait for renderGallery() to inject product cards (DOMContentLoaded)
    await page.waitForSelector('.product-card');
  });

  for (const filterValue of NON_ALL_FILTERS) {
    test(`clicking "${filterValue}" → only cards with data-category="${filterValue}" are visible`, async ({ page }: { page: Page }) => {
      // Click the filter button for this category
      await page.locator(`.filter-btn[data-filter="${filterValue}"]`).click();

      // Allow the CSS filter transition to settle (300ms per spec + buffer)
      await page.waitForTimeout(350);

      // Collect all visible (non-hidden) product cards
      const visibleCards = page.locator('.product-card:not(.product-card--hidden)');
      const count = await visibleCards.count();

      // If no cards are visible, the gallery should show the empty-state message
      // and the assertions below simply pass vacuously (zero iterations).
      // The empty-state itself is tested in task 8.x; here we focus on the matching invariant.

      // Assert: every visible card carries the correct data-category
      for (let i = 0; i < count; i++) {
        const card = visibleCards.nth(i);
        const dataCategory = await card.getAttribute('data-category');
        expect(dataCategory).toBe(filterValue);
      }

      // Assert: every card with a non-matching category is hidden
      const nonMatchingVisible = page.locator(
        `.product-card:not(.product-card--hidden):not([data-category="${filterValue}"])`
      );
      await expect(nonMatchingVisible).toHaveCount(0);
    });
  }

  test('filtering cycles through all non-"all" categories — matching invariant holds throughout', async ({ page }: { page: Page }) => {
    for (const filterValue of NON_ALL_FILTERS) {
      await page.locator(`.filter-btn[data-filter="${filterValue}"]`).click();
      await page.waitForTimeout(350);

      // No card with a different category should be visible
      const nonMatchingVisible = page.locator(
        `.product-card:not(.product-card--hidden):not([data-category="${filterValue}"])`
      );
      await expect(nonMatchingVisible).toHaveCount(0);

      // Confirm visible cards actually belong to the selected category
      const visibleCards = page.locator('.product-card:not(.product-card--hidden)');
      const count = await visibleCards.count();
      for (let i = 0; i < count; i++) {
        const dataCategory = await visibleCards.nth(i).getAttribute('data-category');
        expect(dataCategory).toBe(filterValue);
      }
    }
  });

});
