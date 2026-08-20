// src/api/videoApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/** GET /api/user/videos */
export const getPublicVideos = async () =>
  axiosInstance.get(endpoints.videos.list);

/** GET /api/user/videos/:slug */
export const getVideoBySlug = async (slug) =>
  axiosInstance.get(endpoints.videos.bySlug(slug));

/** POST /api/user/videos/:id/view */
export const recordVideoView = async (id) =>
  axiosInstance.post(endpoints.videos.recordView(id));

/** GET /api/media */
export const getMedia = async () =>
  axiosInstance.get(endpoints.media.list);
