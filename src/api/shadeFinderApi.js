// src/api/shadeFinderApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getTones = (params = {}) =>
  axiosInstance.get(endpoints.shadeFinder.tones, { params });

export const getUndertones = (params = {}) =>
  axiosInstance.get(endpoints.shadeFinder.undertones, { params });

export const getFamilies = (params = {}) =>
  axiosInstance.get(endpoints.shadeFinder.families, { params });

export const getFormulations = (params = {}) =>
  axiosInstance.get(endpoints.shadeFinder.formulations, { params });

export const getRecommendations = (params = {}) =>
  axiosInstance.get(endpoints.shadeFinder.recommendations, { params });
