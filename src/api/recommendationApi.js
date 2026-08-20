// src/api/recommendationApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * GET /api/user/recommendations
 * @param {Object} params – optional query params e.g. { limit: 10 }
 */
export const getRecommendations = async (params = {}) =>
  axiosInstance.get(endpoints.recommendations.get, { params });

/**
 * GET /api/user/recommendations/personalized
 * @param {Object} params – optional query params e.g. { section: "manual" }
 */
export const getPersonalizedRecommendations = async (params = {}) =>
  axiosInstance.get(endpoints.recommendations.personalized, { params });

/**
 * GET /api/user/recommendations/personal-summary
 */
export const getPersonalSummary = async () =>
  axiosInstance.get(endpoints.recommendations.personalSummary);
