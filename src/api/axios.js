// src/api/axios.js
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://beauty.joyory.com";

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
});

export default api;
