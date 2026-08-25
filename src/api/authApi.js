// src/api/authApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const login = (data) => axiosInstance.post(endpoints.auth.login, data);
export const signup = (data) => axiosInstance.post(endpoints.auth.signup, data);
export const logout = () => axiosInstance.post(endpoints.auth.logout);
export const deleteAccount = () => axiosInstance.delete(endpoints.auth.deleteAccount);
export const forgotPassword = (data) => axiosInstance.post(endpoints.auth.forgotPassword, data);
export const resetPassword = (data) => axiosInstance.post(endpoints.auth.resetPassword, data);
export const sendOtp = (data) => axiosInstance.post(endpoints.auth.securitySendOtp, data);
export const verifyOtp = (data) => axiosInstance.post(endpoints.auth.securityVerifyOtp, data);
export const phoneOtpSend = (data) => axiosInstance.post(endpoints.auth.otpSend, data);
export const phoneOtpVerify = (data) => axiosInstance.post(endpoints.auth.otpVerify, data);
export const phoneCompleteProfile = (data) => axiosInstance.post(endpoints.auth.otpCompleteProfile, data);
export const googleLogin = (data) => axiosInstance.post("/api/user/google-login", data);
