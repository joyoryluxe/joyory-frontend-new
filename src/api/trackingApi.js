// src/api/trackingApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * POST /api/tracking/duration
 */
export const sendTrackingDuration = (payload) => {
  return axiosInstance.post(endpoints.tracking.duration, payload).catch(() => {});
};

/**
 * POST /api/tracking/pageview
 */
export const sendPageView = (payload) => {
  return axiosInstance.post(endpoints.tracking.pageview, payload).catch(() => {});
};

/**
 * POST /api/tracking/consent
 */
export const sendConsent = (payload) => {
  return axiosInstance.post(endpoints.tracking.consent, payload).catch(() => {});
};
