// ✅ axiosInstance.js (fixed for guest + logged-in flow)
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

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor – notify session expiry and handle unauthorized requests
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const data = error.response?.data;
      const isExpired = Boolean(
        data?.sessionExpired ||
        (typeof data?.message === "string" && data.message.toLowerCase().includes("expired")) ||
        (typeof data?.error === "string" && data.error.toLowerCase().includes("expired"))
      );

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("joyory:session-expired", {
            detail: {
              sessionExpired: isExpired,
              message: data?.message || "Session expired. Please log in again.",
            },
          })
        );
      }
      console.warn("Unauthorized: session expired or token invalid, notified auth state.", error.response?.data);
    }
    return Promise.reject(error);
  }
);

// If custom/local backend configured in development, route hardcoded production URLs to it
axiosInstance.interceptors.request.use((config) => {
  const targetBackend = getBackendUrl();
  if (targetBackend !== "https://beauty.joyory.com" && config.url && config.url.includes("https://beauty.joyory.com")) {
    config.url = config.url.replace("https://beauty.joyory.com", targetBackend);
  }
  return config;
});

export default axiosInstance;
