import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
