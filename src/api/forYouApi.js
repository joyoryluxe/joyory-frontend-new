// src/api/forYouApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getForYouIntro = () =>
  axiosInstance.get(endpoints.forYou.intro);

export const getMakeupGuide = () =>
  axiosInstance.get(endpoints.forYou.makeupGuide);

export const getSkincareQuestions = () =>
  axiosInstance.get(endpoints.forYou.skincareQuestions);

export const submitSkincareQuiz = (data) =>
  axiosInstance.post(endpoints.forYou.skincareSubmit, data);

export const getSkincareProfile = () =>
  axiosInstance.get(endpoints.forYou.skincareProfile);

export const getForYouRecommendations = (params = {}) =>
  axiosInstance.get(endpoints.forYou.recommendations, { params });
