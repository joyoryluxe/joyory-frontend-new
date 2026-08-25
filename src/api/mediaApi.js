// src/api/mediaApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getMedia = () =>
  axiosInstance.get(endpoints.media.base);
