/**
 * variantHelpers.js
 * ─────────────────────────────────────────────────────────────
 * Shared product variant and metadata utility functions.
 * Extracted to avoid duplicating variant handling across pages.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Get SKU from a variant object with graceful fallbacks.
 * @param {object} variant
 * @returns {string}
 */
export const getSku = (variant) =>
  variant?.sku || variant?.variantSku || `sku-${variant?._id || "default"}`;

/**
 * Check if a string is a valid 3 or 6 digit hex color code.
 * @param {string} hex
 * @returns {boolean}
 */
export const isValidHexColor = (hex) => {
  if (!hex || typeof hex !== "string") return false;
  const normalized = hex.trim().toLowerCase();
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
};

/**
 * Get the display label for a variant (shade name, size, weight, etc.)
 * @param {object} variant
 * @returns {string}
 */
export const getVariantDisplayText = (variant) => {
  if (!variant) return "DEFAULT";
  return (
    variant.shadeName ||
    variant.name ||
    variant.size ||
    variant.ml ||
    variant.weight ||
    "Default"
  ).toUpperCase();
};

/**
 * Group an array of variants into color, text, and default categories.
 * Preserves the `default: []` array for compatibility with all existing consumers.
 * @param {Array} variants
 * @returns {{ color: Array, text: Array, default: Array }}
 */
export const groupVariantsByType = (variants) => {
  const grouped = { color: [], text: [], default: [] };
  (variants || []).forEach((v) => {
    if (!v) return;
    if (v.hex && isValidHexColor(v.hex)) {
      grouped.color.push(v);
    } else {
      grouped.text.push(v);
    }
  });
  return grouped;
};

/**
 * Safely extract brand name from a product object.
 * Handles both object `{ name: "..." }` and string brand formats.
 * @param {object} product
 * @returns {string}
 */
export const getBrandName = (product) => {
  const brand = product?.brand || product?.product?.brand;
  if (!brand) return "Unknown Brand";
  if (typeof brand === "object" && brand.name) return brand.name;
  if (typeof brand === "string") return brand;
  return "Unknown Brand";
};

/**
 * Safely extract product slug for routing.
 * @param {object} product
 * @param {string} [productId]
 * @returns {string}
 */
export const getProductSlug = (product, productId) => {
  if (!product) return productId || "";
  if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) {
    return product.slugs[0];
  }
  return product.slug || product.product?.slug || productId || product._id || "";
};

/**
 * Safely extract first valid image URL from variant or product.
 * @param {object} displayVariant
 * @param {object} product
 * @returns {string}
 */
export const getProductImageUrl = (displayVariant, product) => {
  const rawImage =
    displayVariant?.images?.[0] ||
    displayVariant?.image ||
    product?.selectedVariant?.images?.[0] ||
    product?.product?.selectedVariant?.images?.[0] ||
    product?.images?.[0] ||
    product?.product?.images?.[0] ||
    product?.image ||
    product?.product?.image ||
    "";

  if (rawImage) {
    return rawImage.startsWith("http")
      ? rawImage
      : `https://res.cloudinary.com/dekngswix/image/upload/${rawImage}`;
  }
  return "https://placehold.co/400x300/ffffff/cccccc?text=Product";
};
