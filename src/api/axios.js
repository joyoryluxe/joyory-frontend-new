// src/api/axios.js
import axios from "axios";

export const getBackendUrl = () => {
  // 🚀 In Production build: ALWAYS target live production backend
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_BACKEND_URL && !import.meta.env.VITE_BACKEND_URL.includes("localhost")
      ? import.meta.env.VITE_BACKEND_URL
      : "https://beauty.joyory.com";
  }

  // 💻 In Local Development: target local machine or mobile LAN IP
  const envUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
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
