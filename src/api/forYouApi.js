// src/api/forYouApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/** GET /api/user/for-you/intro */
export const getForYouIntro = async () =>
  axiosInstance.get(endpoints.forYou.intro);

/** GET /api/user/for-you/makeup-guide */
export const getMakeupGuide = async () =>
  axiosInstance.get(endpoints.forYou.makeupGuide);

/** GET /api/user/for-you/skincare/questions */
export const getSkincareQuiz = async () =>
  axiosInstance.get(endpoints.forYou.skincareQuestions);

/**
 * POST /api/user/for-you/skincare/submit
 * @param {{ answers: Array }} payload
 */
export const submitSkincareQuiz = async (payload) =>
  axiosInstance.post(endpoints.forYou.skincareSubmit, payload);

/** GET /api/user/for-you/skincare/profile */
export const getSkincareProfile = async () =>
  axiosInstance.get(endpoints.forYou.skincareProfile);

/** GET /api/user/for-you/recommendations */
export const getForYouRecommendations = async () =>
  axiosInstance.get(endpoints.forYou.recommendations);
