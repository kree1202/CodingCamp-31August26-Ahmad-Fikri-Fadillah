/**
 * Integration tests for the Syaflower Shop gallery filter bar.
 *
 * Feature: syaflower-shop, Property 3: Active filter button is exclusively highlighted
 * Validates: Requirements 5.5
 *
 * After each filter button click, exactly one `.filter-btn--active` must exist
 * in the DOM and it must be the button that was just clicked.
 */

import { test, expect, type Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve to the project root index.html (one directory up from /tests)
const INDEX_HTML = (() => {
  const abs = path.resolve(__dirname, '..', 'index.html');
  // Convert Windows backslashes to forward slashes for the file:// protocol
  return 'file:///' + abs.replace(/\\/g, '/');
})();

const FILTER_VALUES = ['all', 'roses', 'tulips', 'bouquets', 'wedding', 'seasonal'] as const;

test.describe('Property 3: Active filter button is exclusively highlighted', () => {

  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto(INDEX_HTML);
    // Wait for renderGallery() to run — product cards must be present
    await page.waitForSelector('.product-card', { timeout: 5000 });
  });

  for (const filterValue of FILTER_VALUES) {
    test(`clicking "${filterValue}" button → exactly one active button, matching data-filter="${filterValue}"`, async ({ page }: { page: Page }) => {
      // Click the filter button whose data-filter matches
      await page.locator(`.filter-btn[data-filter="${filterValue}"]`).click();

      // Allow CSS transitions (300ms) to settle
      await page.waitForTimeout(350);

      // Assert: exactly one .filter-btn--active in the DOM
      const activeButtons = page.locator('.filter-btn--active');
      await expect(activeButtons).toHaveCount(1);

      // Assert: the single active button's data-filter matches what was clicked
      const activeDataFilter = await activeButtons.first().getAttribute('data-filter');
      expect(activeDataFilter).toBe(filterValue);
    });
  }

  test('clicking through all filters in sequence always leaves exactly one active', async ({ page }: { page: Page }) => {
    for (const filterValue of FILTER_VALUES) {
      await page.locator(`.filter-btn[data-filter="${filterValue}"]`).click();
      await page.waitForTimeout(350);

      const activeButtons = page.locator('.filter-btn--active');
      await expect(activeButtons).toHaveCount(1);

      const activeDataFilter = await activeButtons.first().getAttribute('data-filter');
      expect(activeDataFilter).toBe(filterValue);
    }
  });

});
