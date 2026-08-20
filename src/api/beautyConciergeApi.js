// src/api/beautyConciergeApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * POST /api/user/beauty-concierge/chat
 * @param {string} message
 * @param {string|null} sessionId – guest session ID (null for logged-in users)
 */
export const sendChatMessage = async (message, sessionId = null) => {
  return await axiosInstance.post(endpoints.beautyConcierge.chat, { message, sessionId });
};

/**
 * GET /api/user/beauty-concierge/history
 * @param {string|null} sessionId
 */
export const getChatHistory = async (sessionId = null) => {
  return await axiosInstance.get(endpoints.beautyConcierge.history, {
    params: sessionId ? { sessionId } : {},
  });
};

/**
 * DELETE /api/user/beauty-concierge/history
 * @param {string|null} sessionId
 */
export const clearChatHistory = async (sessionId = null) => {
  return await axiosInstance.delete(endpoints.beautyConcierge.history, {
    params: sessionId ? { sessionId } : {},
  });
};

/**
 * POST /api/user/beauty-concierge/quick-recs
 */
export const getQuickRecommendations = async (body) => {
  return await axiosInstance.post(endpoints.beautyConcierge.quickRecs, body);
};
