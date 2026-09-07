/**
 * priceHelpers.js
 * ─────────────────────────────────────────────────────────────
 * Shared price and currency utility functions.
 * Extracted to avoid duplicating formatting logic across pages.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Format a price value in Indian Rupee (INR) currency format without decimals.
 * e.g. 1499 -> "₹1,499"
 * @param {number|string} price
 * @returns {string}
 */
export const formatPrice = (price) => {
  const numPrice = parseFloat(price || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numPrice);
};

/**
 * Calculate discount percentage from original price (MRP) and discounted price.
 * @param {number|string} originalPrice
 * @param {number|string} displayPrice
 * @returns {number}
 */
export const calculateDiscountPercent = (originalPrice, displayPrice) => {
  const orig = parseFloat(originalPrice || 0);
  const disp = parseFloat(displayPrice || 0);
  if (!orig || !disp || orig <= disp) return 0;
  return Math.round(((orig - disp) / orig) * 100);
};

/**
 * Safely parse any price value into a number.
 * @param {*} value
 * @returns {number}
 */
export const parsePrice = (value) => parseFloat(value || 0);
