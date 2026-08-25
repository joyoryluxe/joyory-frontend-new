// src/api/affiliateApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const affiliateSignup = (data) =>
  axiosInstance.post(endpoints.affiliate.signup, data);

export const affiliateLogin = (data) =>
  axiosInstance.post(endpoints.affiliate.login, data);
