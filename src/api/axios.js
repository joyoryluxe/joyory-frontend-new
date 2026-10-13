// src/api/axios.js
import axios from "axios";

const getDevHost = () => {
  if (typeof window !== "undefined" && window.location?.hostname) {
    return window.location.hostname;
  }
  return "localhost";
};

const api = axios.create({
  baseURL: import.meta.env.DEV ? `http://${getDevHost()}:5000/api` : "https://beauty.joyory.com/api",
  withCredentials: true,
});

export default api;
