// src/api/beautyConciergeApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * POST /api/user/beauty-concierge/chat
 * @param {string} message
 * @param {string|null} sessionId – guest session ID (null for logged-in users)
 */
export const sendChatMessage = (message, sessionId = null) =>
  axiosInstance.post(endpoints.beautyConcierge.chat, { message, sessionId });

// Alias matching prompt specification
export const sendChat = sendChatMessage;

/**
 * GET /api/user/beauty-concierge/history
 * @param {string|null} sessionId
 */
export const getChatHistory = (sessionId = null) =>
  axiosInstance.get(endpoints.beautyConcierge.history, {
    params: sessionId ? { sessionId } : {},
  });

/**
 * DELETE /api/user/beauty-concierge/history
 * @param {string|null} sessionId
 */
export const clearChatHistory = (sessionId = null) =>
  axiosInstance.delete(endpoints.beautyConcierge.history, {
    params: sessionId ? { sessionId } : {},
  });

/**
 * POST /api/user/beauty-concierge/quick-recs
 */
export const getQuickRecommendations = (body) =>
  axiosInstance.post(endpoints.beautyConcierge.quickRecs, body);

// Alias matching prompt specification
export const getQuickRecs = getQuickRecommendations;
