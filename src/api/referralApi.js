// src/api/referralApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/** GET /api/referral/code */
export const getReferralCode = async () =>
  axiosInstance.get(endpoints.referral.code);

/** GET /api/referral/history */
export const getReferralHistory = async () =>
  axiosInstance.get(endpoints.referral.history);
