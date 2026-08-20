// src/api/ingredientApi.jsx
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * GET /api/ingredients
 * List all ingredients
 */
export const listIngredients = async (params = {}) => {
  return await axiosInstance.get(endpoints.ingredients.list, { params });
};

/**
 * GET /api/ingredients/:name
 * Get single ingredient details
 */
export const getIngredientByName = async (name) => {
  return await axiosInstance.get(endpoints.ingredients.byName(name));
};

/**
 * POST /api/ingredients/compatibility
 * Check compatibility between two or more ingredients
 */
export const checkCompatibility = async (ingredients) => {
  return await axiosInstance.post(endpoints.ingredients.compatibility, { ingredients });
};

/**
 * GET /api/ingredients/:name/products
 * Get Joyory catalog products containing this ingredient
 */
export const getProductsByIngredient = async (name, pageOrCursor = null, limit = 12) => {
  const params = { limit };
  if (pageOrCursor) {
    if (typeof pageOrCursor === "number") {
      params.page = pageOrCursor;
    } else {
      params.cursor = pageOrCursor;
    }
  }
  return await axiosInstance.get(endpoints.ingredients.productsByIngredient(name), {
    params,
  });
};

/**
 * GET /api/ingredients/scan/product/:id
 * Scan a product's ingredients for allergens and get catalog info
 */
export const ingredientScan = async (productId) => {
  return await axiosInstance.get(endpoints.ingredients.ingredientScan(productId));
};

/**
 * POST /api/ingredients/user/allergens
 * Save/update user's allergen and sensitive ingredients list
 */
export const saveUserAllergens = async (payload) => {
  return await axiosInstance.post(endpoints.ingredients.userAllergens, payload);
};

/**
 * GET /api/ingredients/user/allergens
 * Get current user's allergen list
 */
export const getUserAllergens = async () => {
  return await axiosInstance.get(endpoints.ingredients.userAllergens);
};

/**
 * POST /api/ingredients/product-compatibility
 * Check compatibility between two finished products
 */
export const checkProductCompatibility = async (productAId, productBId) => {
  return await axiosInstance.post(endpoints.ingredients.productCompatibility, { productAId, productBId });
};

/**
 * GET /api/ingredients/product-safety/:productId
 * Calculate clean beauty safety score for a product
 */
export const getProductSafetyScore = async (productId) => {
  return await axiosInstance.get(endpoints.ingredients.productSafetyScore(productId));
};

/**
 * POST /api/ingredients/scan-text
 * Parse and scan raw ingredient text (useful for label OCR scanner)
 */
export const scanIngredientText = async (text) => {
  return await axiosInstance.post(endpoints.ingredients.scanText, { text });
};

/** 
 * GET /api/user/products/all
 * Fetch all catalog products for dropdown/autocomplete selectors
 */
export const listAllProducts = async (params = {}) => {
  return await axiosInstance.get(endpoints.products.all, { params });
};
