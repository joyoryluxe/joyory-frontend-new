// src/api/videoApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getVideos = () =>
  axiosInstance.get(endpoints.videos.list);

export const getVideoBySlug = (slug) =>
  axiosInstance.get(endpoints.videos.bySlug(slug));

export const recordVideoView = (id) =>
  axiosInstance.post(endpoints.videos.view(id));
