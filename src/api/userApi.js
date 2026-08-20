// src/api/userApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * GET /api/user/profile
 */
export const getUserProfile = async () => {
  return await axiosInstance.get(endpoints.user.getProfile);
};

/**
 * PATCH /api/user/profile
 */
export const updateUserProfile = async (profileData) => {
  return await axiosInstance.patch(endpoints.user.updateProfile, profileData);
};

/**
 * GET /api/user/profile/avatar
 */
export const getProfileImage = async () => {
  return await axiosInstance.get(endpoints.user.avatar);
};

/**
 * POST /api/user/profile/avatar
 * @param {FormData} formData – includes 'image' field
 */
export const uploadProfileImage = async (formData) => {
  return await axiosInstance.post(endpoints.user.avatar, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * DELETE /api/user/profile/avatar
 */
export const removeProfileImage = async () => {
  return await axiosInstance.delete(endpoints.user.avatar);
};

/**
 * GET /api/user/profile/address
 */
export const getUserAddresses = async () => {
  return await axiosInstance.get(endpoints.user.addresses);
};

/**
 * POST /api/user/profile/address
 */
export const addUserAddress = async (addressData) => {
  return await axiosInstance.post(endpoints.user.addresses, addressData);
};

/**
 * PATCH /api/user/profile/address/:id
 */
export const updateUserAddress = async (id, addressData) => {
  return await axiosInstance.patch(endpoints.user.updateAddress(id), addressData);
};

/**
 * DELETE /api/user/profile/address/:id
 */
export const deleteUserAddress = async (id) => {
  return await axiosInstance.delete(endpoints.user.deleteAddress(id));
};

/**
 * POST /api/user/profile/send-otp
 */
export const sendProfileVerificationOtp = async (payload) => {
  return await axiosInstance.post(endpoints.user.profileSendOtp, payload);
};

/**
 * POST /api/user/profile/verify-otp
 */
export const verifyProfileOtp = async (payload) => {
  return await axiosInstance.post(endpoints.user.profileVerifyOtp, payload);
};

/**
 * GET /api/user/wallet
 */
export const getUserWallet = async () => {
  return await axiosInstance.get(endpoints.wallet.get);
};
