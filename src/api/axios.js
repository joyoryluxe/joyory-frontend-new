// src/api/axios.js
import axios from "axios";

export const getBackendUrl = () => {
  // 🚀 In Production build: ALWAYS target live production backend
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_BACKEND_URL && !import.meta.env.VITE_BACKEND_URL.includes("localhost")
      ? import.meta.env.VITE_BACKEND_URL
      : "https://beauty.joyory.com";
  }

  // 💻 In Local Development:
  // If not explicitly configured in local .env, default to production (for frontend-only developers)
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  if (!envUrl) {
    return "https://beauty.joyory.com";
  }

  // If local backend is configured (e.g. http://localhost:5000), support LAN/mobile testing
  if (typeof window !== "undefined" && window.location?.hostname && window.location.hostname !== "localhost") {
    return envUrl.replace("localhost", window.location.hostname).replace("127.0.0.1", window.location.hostname);
  }
  return envUrl;
};

const BACKEND_URL = getBackendUrl();

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
});

export default api;
