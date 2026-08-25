// src/api/recommendationApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getRecommendations = (params = {}) =>
  axiosInstance.get(endpoints.recommendations.base, { params });

export const getCartRecommendations = (params = {}) =>
  axiosInstance.get(endpoints.recommendations.cart, { params });

export const getPersonalSummary = () =>
  axiosInstance.get(endpoints.recommendations.personalSummary);

export const getPersonalized = (params = {}) =>
  axiosInstance.get(endpoints.recommendations.personalized, { params });

export const getPersonalizedRecommendations = (params = {}) =>
  axiosInstance.get(endpoints.recommendations.personalized, { params });
