// src/api/ingredientApi.jsx
import api from "./axios";

/**
 * GET /api/ingredients
 * List all ingredients
 */
export const listIngredients = (params = {}) => {
  return api.get("/ingredients", { params });
};

/**
 * GET /api/ingredients/:name
 * Get single ingredient details
 */
export const getIngredientByName = (name) => {
  return api.get(`/ingredients/${encodeURIComponent(name)}`);
};

/**
 * POST /api/ingredients/compatibility
 * Check compatibility between two or more ingredients
 */
export const checkCompatibility = (ingredients) => {
  return api.post("/ingredients/compatibility", { ingredients });
};

/**
 * GET /api/ingredients/:name/products
 * Get Joyory catalog products containing this ingredient
 */
export const getProductsByIngredient = (name, pageOrCursor = null, limit = 12) => {
  const params = { limit };
  if (pageOrCursor) {
    if (typeof pageOrCursor === "number") {
      params.page = pageOrCursor;
    } else {
      params.cursor = pageOrCursor;
    }
  }
  return api.get(`/ingredients/${encodeURIComponent(name)}/products`, {
    params,
  });
};

/**
 * GET /api/ingredients/scan/product/:id
 * Scan a product's ingredients for allergens and get catalog info
 */
export const ingredientScan = (productId) => {
  return api.get(`/ingredients/scan/product/${productId}`);
};

/**
 * POST /api/ingredients/user/allergens
 * Save/update user's allergen and sensitive ingredients list
 */
export const saveUserAllergens = (payload) => {
  return api.post("/ingredients/user/allergens", payload);
};

/**
 * GET /api/ingredients/user/allergens
 * Get current user's allergen list
 */
export const getUserAllergens = () => {
  return api.get("/ingredients/user/allergens");
};

/**
 * POST /api/ingredients/product-compatibility
 * Check compatibility between two finished products
 */
export const checkProductCompatibility = (productAId, productBId) => {
  return api.post("/ingredients/product-compatibility", { productAId, productBId });
};

/**
 * GET /api/ingredients/product-safety/:productId
 * Calculate clean beauty safety score for a product
 */
export const getProductSafetyScore = (productId) => {
  return api.get(`/ingredients/product-safety/${productId}`);
};

/**
 * POST /api/ingredients/scan-text
 * Parse and scan raw ingredient text (useful for label OCR scanner)
 */
export const scanIngredientText = (text) => {
  return api.post("/ingredients/scan-text", { text });  
};

/** 
 * GET /api/user/products/all
 * Fetch all catalog products for dropdown/autocomplete selectors
 */
export const listAllProducts = (params = {}) => {
  return api.get("/user/products/all", { params });
};

