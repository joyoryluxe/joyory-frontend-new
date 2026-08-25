// src/api/promotionApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getActivePromotions = (params = {}) =>
  axiosInstance.get(endpoints.promotions.active, { params });

export const getOffersPage = () =>
  axiosInstance.get(endpoints.promotions.offersPage);

export const getPromotionProducts = (idOrSlug, params = {}) =>
  axiosInstance.get(endpoints.promotions.bySlug(idOrSlug), { params });
