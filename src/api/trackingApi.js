// src/api/trackingApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const trackDuration = (data) =>
  axiosInstance.post(endpoints.tracking.duration, data);

export const trackPageview = (data) =>
  axiosInstance.post(endpoints.tracking.pageview, data);

export const trackPageView = trackPageview;

export const trackConsent = (data) =>
  axiosInstance.post(endpoints.tracking.consent, data);

export const getDurationBeaconUrl = () =>
  `${axiosInstance.defaults.baseURL || "https://beauty.joyory.com"}${endpoints.tracking.duration}`;
