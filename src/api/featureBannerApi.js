// src/api/featureBannerApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getFeatureBanners = () =>
  axiosInstance.get(endpoints.featureBanners.list);
