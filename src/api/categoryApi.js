// src/api/categoryApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * GET /api/user/categories/tree
 */
export const getCategoryTree = async () => {
  return await axiosInstance.get(endpoints.categories.tree);
};

/**
 * GET /api/user/categories/category/:slug/landing
 */
export const getCategoryLanding = async (slug) => {
  return await axiosInstance.get(endpoints.categories.landing(slug));
};

/**
 * GET /api/user/categories/category/:slug/products
 */
export const getCategoryProducts = async (slug, params = {}) => {
  return await axiosInstance.get(endpoints.categories.products(slug), { params });
};
