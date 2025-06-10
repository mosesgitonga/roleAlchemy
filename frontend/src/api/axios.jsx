import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// List of public endpoints to ignore in the response interceptor
const PUBLIC_PATHS = ["/login", "/register"];

api.interceptors.response.use(
  response => response,
  error => {
    const { config, response } = error;

    // Check if the request URL is public
    const isPublic = PUBLIC_PATHS.some(path => config.url?.includes(path));

    if (response?.status === 401 && !isPublic) {
      localStorage.removeItem("token");
      window.location.href = "/login";  
    }

    return Promise.reject(error);
  }
);

export default api;
