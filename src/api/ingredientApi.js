// src/api/ingredientApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

// NOTE: listAllProducts is provided as a convenience re-export so that
// IngredientCompatibility.jsx does not need to import from two API files.
// Internally it delegates to the same endpoint as productApi.getAllProducts.
import { getAllProducts } from "./productApi";

/**
 * GET /api/ingredients
 * List all ingredients (supports optional query params e.g. { q, page, limit })
 */
export const listIngredients = (params = {}) =>
  axiosInstance.get(endpoints.ingredients.list, { params });

/**
 * GET /api/ingredients/:name
 * Get single ingredient details by name
 */
export const getIngredientByName = (name) =>
  axiosInstance.get(endpoints.ingredients.byName(name));

/**
 * POST /api/ingredients/compatibility
 * Check compatibility between two or more ingredients
 * @param {string[]} ingredients - array of ingredient names
 */
export const checkCompatibility = (ingredients) =>
  axiosInstance.post(endpoints.ingredients.compatibility, { ingredients });

/**
 * GET /api/ingredients/:name/products
 * Get Joyory catalog products containing this ingredient
 * @param {string} name - ingredient name
 * @param {number|string|null} pageOrCursor - page number (number) or cursor (string) for pagination
 * @param {number} limit - results per page (default 12)
 */
export const getProductsByIngredient = (name, pageOrCursor = null, limit = 12) => {
  const params = { limit };
  if (pageOrCursor !== null && pageOrCursor !== undefined) {
    if (typeof pageOrCursor === "number") {
      params.page = pageOrCursor;
    } else {
      params.cursor = pageOrCursor;
    }
  }
  return axiosInstance.get(endpoints.ingredients.productsByName(name), { params });
};

/**
 * GET /api/ingredients/scan/product/:id
 * Scan a product's ingredients for allergens and get catalog info
 */
export const ingredientScan = (productId) =>
  axiosInstance.get(endpoints.ingredients.scanProduct(productId));

/**
 * POST /api/ingredients/user/allergens
 * Save / update user's allergen and sensitive ingredients list
 */
export const saveUserAllergens = (payload) =>
  axiosInstance.post(endpoints.ingredients.userAllergens, payload);

/**
 * GET /api/ingredients/user/allergens
 * Get current user's allergen list
 */
export const getUserAllergens = () =>
  axiosInstance.get(endpoints.ingredients.userAllergens);

/**
 * POST /api/ingredients/product-compatibility
 * Check compatibility between two finished products
 */
export const checkProductCompatibility = (productAId, productBId) =>
  axiosInstance.post(endpoints.ingredients.productCompatibility, {
    productAId,
    productBId,
  });

/**
 * GET /api/ingredients/product-safety/:productId
 * Calculate clean beauty safety score for a product
 */
export const getProductSafetyScore = (productId) =>
  axiosInstance.get(endpoints.ingredients.productSafety(productId));

/**
 * POST /api/ingredients/scan-text
 * Parse and scan raw ingredient text (useful for label OCR scanner)
 */
export const scanIngredientText = (text) =>
  axiosInstance.post(endpoints.ingredients.scanText, { text });

/**
 * GET /api/user/products/all
 * Convenience re-export of getAllProducts for ingredient-related screens.
 * Internally uses the same endpoint as productApi.getAllProducts.
 * Import directly from productApi if you don't need other ingredient functions.
 */
export const listAllProducts = (params = {}) => getAllProducts(params);
