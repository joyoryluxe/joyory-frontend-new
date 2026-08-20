// src/api/productApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * GET /api/user/products/all
 */
export const getAllProducts = async (params = {}) => {
  if (typeof params === "string") {
    const url = params ? `${endpoints.products.all}?${params}` : endpoints.products.all;
    return await axiosInstance.get(url);
  }
  return await axiosInstance.get(endpoints.products.all, { params });
};

/**
 * GET /api/user/products/:idOrSlug
 */
export const getProductDetails = async (idOrSlug) => {
  return await axiosInstance.get(endpoints.products.details(idOrSlug));
};

/**
 * GET /api/user/products/top-sellers
 */
export const getTopSellers = async (params = {}) => {
  return await axiosInstance.get(endpoints.products.topSellers, { params });
};

/**
 * GET /api/user/products/top-categories
 */
export const getTopCategories = async (params = {}) => {
  return await axiosInstance.get(endpoints.products.topCategories, { params });
};

/**
 * GET /api/user/products/filters
 */
export const getFilterMetadata = async () => {
  return await axiosInstance.get(endpoints.products.filters);
};

/**
 * GET /api/user/products/skin-types
 */
export const getAllSkinTypes = async () => {
  return await axiosInstance.get(endpoints.products.skinTypes);
};

/**
 * GET /api/user/products/category/:slug/products
 */
export const getProductsByCategory = async (slug, params = {}) => {
  return await axiosInstance.get(endpoints.products.byCategory(slug), { params });
};

/**
 * GET /api/user/products/skintype/:slug
 */
export const getProductsBySkinType = async (slug, params = {}) => {
  return await axiosInstance.get(endpoints.products.bySkinType(slug), { params });
};

/**
 * GET /api/user/products/ingredient/:slug
 */
export const getProductsByIngredientSlug = async (slug, params = {}) => {
  return await axiosInstance.get(endpoints.products.byIngredient(slug), { params });
};
