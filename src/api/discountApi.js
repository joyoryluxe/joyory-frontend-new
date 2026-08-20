// src/api/discountApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/** POST /api/user/discounts/eligible */
export const getEligibleDiscounts = async (payload) =>
  axiosInstance.post(endpoints.discounts.eligible, payload);

/** POST /api/user/discounts/validate */
export const validateDiscount = async (payload) =>
  axiosInstance.post(endpoints.discounts.validate, payload);
