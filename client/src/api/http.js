import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const http = axios.create({
  baseURL,
  withCredentials: false,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
