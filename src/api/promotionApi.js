// src/api/promotionApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * GET /api/user/promotions/active
 * @param {Object} params – e.g. { section: "banner" | "product" | "offers" }
 */
export const getActivePromotions = async (params = {}) =>
  axiosInstance.get(endpoints.promotions.active, { params });

/** GET /api/user/promotions/offers-page */
export const getOffersPage = async () =>
  axiosInstance.get(endpoints.promotions.offersPage);

/**
 * GET /api/user/promotions/:idOrSlug/products
 */
export const getPromotionProducts = async (idOrSlug, params = {}) =>
  axiosInstance.get(endpoints.promotions.products(idOrSlug), { params });
