// src/api/affiliateApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/** POST /api/affiliate/signup */
export const affiliateSignup = async (payload) =>
  axiosInstance.post(endpoints.affiliate.signup, payload);

/** POST /api/affiliate/login */
export const affiliateLogin = async (payload) =>
  axiosInstance.post(endpoints.affiliate.login, payload);
