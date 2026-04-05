import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const client = axios.create({
  baseURL: import.meta.env["VITE_API_BASE_URL"] ?? "http://localhost:3001/api",
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (r) => r,
  async (error: unknown) => {
    const err = error as { response?: { status?: number }; config?: import("axios").InternalAxiosRequestConfig };
    if (err.response?.status === 401) {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const base = import.meta.env["VITE_API_BASE_URL"] ?? "http://localhost:3001/api";
          const { data } = await axios.post(`${base}/auth/refresh`, { refreshToken });
          useAuthStore.getState().setAccessToken(data.data.accessToken as string);
          if (err.config) {
            err.config.headers["Authorization"] = `Bearer ${data.data.accessToken as string}`;
            return client(err.config);
          }
        } catch {
          useAuthStore.getState().logout();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default client;
