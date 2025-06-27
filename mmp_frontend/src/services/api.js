import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const API = axios.create({ baseURL });

// Helper to refresh access token
const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) throw new Error("No refresh token");

  const res = await axios.post(`${baseURL}/api/token/refresh/`, { refresh });
  localStorage.setItem("access", res.data.access);
  return res.data.access;
};

// Request interceptor: attach access token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle token expiration
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccess = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return API(originalRequest);
      } catch (err) {
        console.error("Auto-refresh failed, redirecting to login.");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Your original API calls
export const getAllMovies = async () => {
  const response = await API.get("/movies/");
  return response.data;
};

export const searchMovies = async (query) => {
  const response = await API.get("/movies/search", {
    params: { q: query },
  });
  return response.data;
};

export default API;
