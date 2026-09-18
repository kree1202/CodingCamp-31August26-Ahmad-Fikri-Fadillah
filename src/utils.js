/**
 * Utility functions extracted from index.html for testability.
 * These are pure functions with no DOM dependency.
 */

/**
 * Formats an IDR integer to "Rp X.XXX" with thousand-separator dots.
 * @param {number} amount
 * @returns {string}  e.g. formatIDR(150000) → "Rp 150.000"
 */
export function formatIDR(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

/**
 * Builds a wa.me deep-link URL.
 * @param {string} phone   - E.164 digits only, e.g. "6281234567890"
 * @param {string} message - Pre-filled message text
 * @returns {string}
 */
export function buildWaUrl(phone, message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
