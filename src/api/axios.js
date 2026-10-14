// src/api/axios.js
import axios from "axios";

const getBackendUrl = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  if (!envUrl) return "https://beauty.joyory.com";
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
