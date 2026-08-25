// src/api/discountApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getEligibleDiscounts = () =>
  axiosInstance.get(endpoints.discounts.eligible);

export const validateDiscount = (data) =>
  axiosInstance.post(endpoints.discounts.validate, data);
