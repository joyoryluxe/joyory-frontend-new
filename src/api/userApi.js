// src/api/userApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getProfile = () => axiosInstance.get(endpoints.user.profile);
export const updateProfile = (data) => axiosInstance.patch(endpoints.user.profile, data);
export const getAvatar = () => axiosInstance.get(endpoints.user.avatar);
export const uploadAvatar = (formData) =>
  axiosInstance.post(endpoints.user.avatar, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteAvatar = () => axiosInstance.delete(endpoints.user.avatar);
export const getAddresses = () => axiosInstance.get(endpoints.user.address);
export const addAddress = (data) => axiosInstance.post(endpoints.user.address, data);
export const updateAddress = (id, data) => axiosInstance.patch(endpoints.user.addressById(id), data);
export const deleteAddress = (id) => axiosInstance.delete(endpoints.user.addressById(id));
export const sendUserOtp = (data) => axiosInstance.post(endpoints.user.sendOtp, data);
export const verifyUserOtp = (data) => axiosInstance.post(endpoints.user.verifyOtp, data);
export const deleteAccount = () => axiosInstance.delete(endpoints.auth.deleteAccount);
