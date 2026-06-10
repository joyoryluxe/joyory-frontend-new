// src/api/beautyConciergeApi.jsx
import api from "./axios";

/**
 * POST /api/user/beauty-concierge/chat
 * @param {string} message
 * @param {string|null} sessionId  – guest session ID (null for logged-in users)
 */
export const sendChatMessage = (message, sessionId = null) =>
  api.post("/user/beauty-concierge/chat", { message, sessionId });

/**
 * GET /api/user/beauty-concierge/history
 * @param {string|null} sessionId
 */
export const getChatHistory = (sessionId = null) =>
  api.get("/user/beauty-concierge/history", {
    params: sessionId ? { sessionId } : {},
  });

/**
 * DELETE /api/user/beauty-concierge/history
 * @param {string|null} sessionId
 */
export const clearChatHistory = (sessionId = null) =>
  api.delete("/user/beauty-concierge/history", {
    params: sessionId ? { sessionId } : {},
  });

/**
 * POST /api/user/beauty-concierge/quick-recs
 */
export const getQuickRecommendations = (body) =>
  api.post("/user/beauty-concierge/quick-recs", body);
