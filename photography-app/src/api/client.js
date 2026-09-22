import axios from "axios";

// Points at the PHP backend served by Laragon.
// Example Laragon URL if the backend folder is placed at C:/laragon/www/photography-api
export const API_BASE_URL = "http://localhost/photography-api";
export const UPLOADS_BASE_URL = `${API_BASE_URL}/uploads/galleries`;

const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("lumen_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("lumen_token");
      localStorage.removeItem("lumen_user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default client;