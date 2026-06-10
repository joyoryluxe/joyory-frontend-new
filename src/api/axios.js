// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://beauty.joyory.com/api",
  withCredentials: true,   // ✅ always send cookies
});

export default api;
