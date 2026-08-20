// src/api/vtoApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * GET /api/vto/enabled
 */
export const getVtoEnabledStatus = async () => {
  return await axiosInstance.get(endpoints.vto.enabled);
};
export const getVtoEnabled = getVtoEnabledStatus;

/**
 * GET /api/vto/workflow
 */
export const getVtoWorkflow = async (params = {}) => {
  return await axiosInstance.get(endpoints.vto.workflow, { params });
};

/**
 * GET /api/user/shadefinder/tones
 */
export const getShadeTones = async () => {
  return await axiosInstance.get(endpoints.shadeFinder.tones);
};

/**
 * GET /api/user/shadefinder/undertones
 */
export const getShadeUndertones = async (toneKey) => {
  return await axiosInstance.get(endpoints.shadeFinder.undertones(toneKey));
};

/**
 * GET /api/user/shadefinder/families
 */
export const getShadeFamilies = async (toneKey, undertoneKey) => {
  return await axiosInstance.get(endpoints.shadeFinder.families(toneKey, undertoneKey));
};

/**
 * GET /api/user/shadefinder/formulations
 */
export const getShadeFormulations = async (params = {}) => {
  return await axiosInstance.get(endpoints.shadeFinder.formulations, { params });
};

/**
 * GET /api/user/shadefinder/recommendations
 */
export const getShadeRecommendations = async (params = {}) => {
  return await axiosInstance.get(endpoints.shadeFinder.recommendations, { params });
};
