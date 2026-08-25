// src/api/referralApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getReferralCode = () =>
  axiosInstance.get(endpoints.referral.code);

export const getReferralHistory = () =>
  axiosInstance.get(endpoints.referral.history);
