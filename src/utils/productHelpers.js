// src/utils/productHelpers.js
// Centralized product utility helpers — previously copy-pasted across 15+ files.
// Import from here instead of defining locally.

/**
 * Get the SKU string from a variant object.
 */
export const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

/**
 * Validate whether a string is a valid 3- or 6-digit hex color (with #).
 */
export const isValidHexColor = (hex) => {
  if (!hex || typeof hex !== 'string') return false;
  const normalized = hex.trim().toLowerCase();
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
};

/**
 * Get a human-readable display text for a variant (shade name, size, ml, etc.).
 */
export const getVariantDisplayText = (variant) => {
  if (!variant) return 'DEFAULT';
  return (
    variant.shadeName ||
    variant.name ||
    variant.size ||
    variant.ml ||
    variant.weight ||
    'Default'
  ).toUpperCase();
};

/**
 * Group an array of variants into { color: [], text: [], default: [] }.
 */
export const groupVariantsByType = (variants) => {
  const grouped = { color: [], text: [], default: [] };
  if (!Array.isArray(variants)) return grouped;
  variants.forEach((v) => {
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
 * Safely get the brand name from a product's brand field
 * (which may be an object with a .name, or a plain string).
 */
export const getBrandName = (product) => {
  if (!product?.brand) return 'Unknown Brand';
  if (typeof product.brand === 'object' && product.brand.name) return product.brand.name;
  if (typeof product.brand === 'string') return product.brand;
  return 'Unknown Brand';
};

export const getCategoryName = (product) => {
  if (!product?.category) return '';
  if (typeof product.category === 'object' && product.category.name) return product.category.name;
  if (typeof product.category === 'string') return product.category;
  return '';
};

/**
 * Format a price as Indian Rupee (e.g., ₹1,299).
 */
export const formatPrice = (price) => {
  const numPrice = parseFloat(price || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numPrice);
};

/**
 * Get the primary slug for a product (from slugs array, slug field, or _id).
 */
export const getProductSlug = (product) => {
  if (!product) return null;
  if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) {
    return product.slugs[0];
  }
  if (product.slug) return product.slug;
  return product._id;
};

/**
 * Get a human-readable name for a variant
 * (shadeName > name > variantName > size > ml > weight > "Default").
 */
export const getVariantName = (variant) => {
  if (!variant) return 'Default';
  const sources = [
    variant.shadeName,
    variant.name,
    variant.variantName,
    variant.size,
    variant.ml,
    variant.weight,
  ];
  for (const src of sources) {
    if (src && typeof src === 'string') return src;
  }
  return 'Default';
};

/**
 * Classify a variant into 'color' | 'shade' | 'size' | 'ml' | 'weight' | 'default'.
 */
export const getVariantType = (variant) => {
  if (!variant) return 'default';
  if (variant.hex && isValidHexColor(variant.hex)) return 'color';
  if (variant.shadeName) return 'shade';
  if (variant.size) return 'size';
  if (variant.ml) return 'ml';
  if (variant.weight) return 'weight';
  return 'default';
};

/**
 * Build a normalized display-ready product object from raw backend data.
 * Handles variant selection, price calculation, image resolution and out-of-stock logic.
 *
 * @param {object} product - Raw product from API
 * @param {object} selectedVariants - Map of productId → currently selected variant
 * @returns {object|null} Normalized product or null if input is invalid
 */
export const getProductDisplayData = (product, selectedVariants = {}) => {
  if (!product) return null;

  const allVariants = Array.isArray(product.variants)
    ? product.variants
    : Array.isArray(product.shadeOptions)
    ? product.shadeOptions
    : [];

  const availableVariants = allVariants.filter((v) => v && parseInt(v.stock || 0) > 0);
  const defaultVariant = allVariants[0] || {};

  const storedVariant = selectedVariants[product._id];

  // ForYou also checks product.selectedVariant — preserved here
  let selectedVariant =
    storedVariant ||
    product.selectedVariant ||
    (availableVariants.length > 0 ? availableVariants[0] : defaultVariant);

  if (storedVariant) {
    const storedStock = parseInt(storedVariant.stock || 0);
    if (storedStock <= 0 && availableVariants.length > 0) {
      selectedVariant = availableVariants[0];
    }
  }

  const getVariantImage = (v) => v?.images?.[0] || v?.image;
  const image =
    getVariantImage(selectedVariant) ||
    getVariantImage(availableVariants[0]) ||
    getVariantImage(defaultVariant) ||
    product.image ||
    product.displayImage ||
    '';

  const displayPrice = parseFloat(
    selectedVariant.displayPrice ||
    selectedVariant.discountedPrice ||
    selectedVariant.price ||
    product.price ||
    0
  );

  const originalPrice = parseFloat(
    selectedVariant.originalPrice ||
    selectedVariant.mrp ||
    product.mrp ||
    displayPrice
  );

  const discountAmount = parseFloat(
    selectedVariant.discountAmount || product.discountAmount || 0
  );

  let discountPercent = parseFloat(
    selectedVariant.discountPercent || product.discountPercent || 0
  );
  if (!discountPercent && originalPrice > displayPrice) {
    discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
  }

  const variantName = getVariantName(selectedVariant);
  const variantType = getVariantType(selectedVariant);
  const variantDisplayText = getVariantDisplayText(selectedVariant);

  const stock = parseInt(selectedVariant.stock || product.stock || 0);
  const status = stock > 0 ? 'inStock' : 'outOfStock';
  const sku = selectedVariant.sku || product.sku || '';
  const sales = parseInt(selectedVariant.sales || product.sales || 0);
  const promoApplied = selectedVariant.promoApplied || product.promoApplied || false;
  const promoMessage = selectedVariant.promoMessage || product.promoMessage || '';

  const brandName = getBrandName(product);
  const productSlug = getProductSlug(product);
  const hexColor = selectedVariant.hex || product.hex || '#000000';

  return {
    ...product,
    _id: product._id || '',
    name: product.name || 'Unnamed Product',
    brandName: typeof brandName === 'string' ? brandName : 'Unknown Brand',
    slug: productSlug,
    variant: {
      ...selectedVariant,
      variantName,
      variantDisplayText,
      displayPrice,
      originalPrice,
      discountPercent,
      discountAmount,
      stock,
      status,
      sku,
      sales,
      promoApplied,
      promoMessage,
      hex: hexColor,
      variantType,
      _id: selectedVariant._id || '',
    },
    image,
    brandId: product.brand,
    description: product.description || '',
    avgRating: parseFloat(product.avgRating || 0),
    totalRatings: parseInt(product.totalRatings || 0),
    allVariants: [...allVariants].filter((v) => v),
    variants: allVariants,
    isCompletelyOutOfStock: allVariants.length > 0 && availableVariants.length === 0,
  };
};
