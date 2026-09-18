/**
 * Property-based tests for utility functions.
 *
 * Property 4: Price formatting round-trip        — Validates: Requirements 5.7
 * Property 5: WhatsApp URL encodes all characters — Validates: Requirements 7.7
 * Property 6: Alt text length invariant           — Validates: Requirements 5.7, 9.2
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { formatIDR, buildWaUrl } from './utils.js';
import { PRODUCTS } from './products.js';

// ---------------------------------------------------------------------------
// Property 4: Price formatting round-trip
// Validates: Requirements 5.7
// ---------------------------------------------------------------------------
describe('formatIDR', () => {
  it('Property 4: output starts with "Rp " and numeric portion round-trips back to original integer', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 999_999_999 }),
        (amount) => {
          const result = formatIDR(amount);

          // Must start with the currency prefix
          expect(result.startsWith('Rp ')).toBe(true);

          // Strip "Rp " and reverse the id-ID thousand-separator (dots) to recover the number
          const numericPart = result.slice(3); // remove "Rp "
          const recovered = parseInt(numericPart.replace(/\./g, ''), 10);
          expect(recovered).toBe(amount);
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 5: WhatsApp URL encodes all characters
// Validates: Requirements 7.7
// ---------------------------------------------------------------------------
describe('buildWaUrl', () => {
  /**
   * **Property 5: WhatsApp URL encodes all characters**
   *
   * For any message string (including special chars, spaces, ampersands, and
   * non-ASCII characters), buildWaUrl must produce a URL where decodeURIComponent
   * applied to the `text` query-param value recovers the original message exactly.
   *
   * **Validates: Requirements 7.7**
   */
  it('Property 5: decodeURIComponent of the text query param recovers the original message', () => {
    fc.assert(
      fc.property(
        fc.string(), // any Unicode string, including special chars and non-ASCII
        (message) => {
          const phone = '6289686838565';
          const url = buildWaUrl(phone, message);

          // Parse the URL and extract the `text` query parameter
          const parsedUrl = new URL(url);
          const encodedText = parsedUrl.searchParams.get('text');

          // The extracted value (already decoded by URLSearchParams) must equal the original message
          expect(encodedText).toBe(message);
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });

  it('produces the correct wa.me base URL with the given phone number', () => {
    const url = buildWaUrl('6281234567890', 'hello');
    expect(url.startsWith('https://wa.me/6281234567890')).toBe(true);
  });

  it('correctly percent-encodes spaces and special characters', () => {
    const url = buildWaUrl('628123', 'hello world & more');
    expect(url).toContain('text=hello%20world%20%26%20more');
  });

  it('correctly encodes non-ASCII (Indonesian) characters', () => {
    const message = 'Halo, saya ingin memesan bunga 🌸';
    const url = buildWaUrl('628123', message);
    const parsedUrl = new URL(url);
    expect(parsedUrl.searchParams.get('text')).toBe(message);
  });
});

// ---------------------------------------------------------------------------
// Property 6: Alt text length invariant
// Validates: Requirements 5.7, 9.2
// ---------------------------------------------------------------------------

/**
 * **Property 6: Alt text length invariant**
 *
 * For every product in the PRODUCTS array:
 *   - imageAlt must be a non-empty string between 1 and 125 characters inclusive
 *   - description must be a non-empty string of no more than 80 characters
 *
 * This is a deterministic check (no random generation) — it iterates the full
 * static catalog and asserts each entry satisfies the invariants.
 *
 * **Validates: Requirements 5.7, 9.2**
 */
describe('PRODUCTS catalog — Property 6: Alt text length invariant', () => {
  it('PRODUCTS array is non-empty', () => {
    expect(PRODUCTS.length).toBeGreaterThan(0);
  });

  it('every product imageAlt is a non-empty string of 1–125 characters', () => {
    for (const product of PRODUCTS) {
      expect(
        typeof product.imageAlt,
        `product "${product.id}": imageAlt must be a string`
      ).toBe('string');

      expect(
        product.imageAlt.length,
        `product "${product.id}": imageAlt must be at least 1 character (got empty string)`
      ).toBeGreaterThanOrEqual(1);

      expect(
        product.imageAlt.length,
        `product "${product.id}": imageAlt must be ≤125 characters (got ${product.imageAlt.length})`
      ).toBeLessThanOrEqual(125);
    }
  });

  it('every product description is a non-empty string of 1–80 characters', () => {
    for (const product of PRODUCTS) {
      expect(
        typeof product.description,
        `product "${product.id}": description must be a string`
      ).toBe('string');

      expect(
        product.description.length,
        `product "${product.id}": description must be at least 1 character (got empty string)`
      ).toBeGreaterThanOrEqual(1);

      expect(
        product.description.length,
        `product "${product.id}": description must be ≤80 characters (got ${product.description.length})`
      ).toBeLessThanOrEqual(80);
    }
  });
});
