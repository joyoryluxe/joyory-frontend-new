// src/api/authApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * POST /api/user/login
 */
export const loginUser = async (credentials) => {
  return await axiosInstance.post(endpoints.auth.login, credentials);
};

/**
 * POST /api/user/signup
 */
export const signupUser = async (userData) => {
  return await axiosInstance.post(endpoints.auth.signup, userData);
};

/**
 * POST /api/user/logout
 */
export const logoutUser = async () => {
  return await axiosInstance.post(endpoints.auth.logout);
};

/**
 * DELETE /api/user/delete-account
 */
export const deleteUserAccount = async () => {
  return await axiosInstance.delete(endpoints.auth.deleteAccount);
};

/**
 * POST /api/security/forgot-password
 */
export const forgotPassword = async (emailData) => {
  return await axiosInstance.post(endpoints.auth.forgotPassword, emailData);
};

/**
 * POST /api/security/reset-password
 */
export const resetPassword = async (resetData) => {
  return await axiosInstance.post(endpoints.auth.resetPassword, resetData);
};

/**
 * POST /api/security/send-otp
 */
export const sendOtp = async (payload) => {
  return await axiosInstance.post(endpoints.auth.sendOtp, payload);
};

/**
 * POST /api/security/verify-otp
 */
export const verifyOtp = async (payload) => {
  return await axiosInstance.post(endpoints.auth.verifyOtp, payload);
};

/**
 * POST /api/user/otp/send
 */
export const sendPhoneOtp = async (payload) => {
  return await axiosInstance.post(endpoints.auth.phoneOtpSend, payload);
};

/**
 * POST /api/user/otp/verify
 */
export const verifyPhoneOtp = async (payload) => {
  return await axiosInstance.post(endpoints.auth.phoneOtpVerify, payload);
};

/**
 * POST /api/user/otp/complete-profile
 */
export const completePhoneProfile = async (payload) => {
  return await axiosInstance.post(endpoints.auth.phoneCompleteProfile, payload);
};
