import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";

const API_PREFIX = "/api/v1";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type AuthResponse = {
  accessToken: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

type RetriableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let accessToken: string | null = null;

const getCsrfTokenFromCookie = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith("csrf="));

  if (!cookie) return null;
  return decodeURIComponent(cookie.split("=")[1] ?? "");
};

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      window.localStorage.setItem("access_token", token);
    } else {
      window.localStorage.removeItem("access_token");
    }
  }
};

export const hydrateAccessToken = (): void => {
  if (typeof window === "undefined") return;
  const token = window.localStorage.getItem("access_token");
  accessToken = token;
};

const applyAuthHeaders = (config: RetriableConfig): RetriableConfig => {
  const nextConfig = { ...config };
  const headers = AxiosHeaders.from(nextConfig.headers);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const isMutation = ["post", "put", "patch", "delete"].includes(
    (nextConfig.method ?? "").toLowerCase(),
  );

  const url = nextConfig.url ?? "";
  const isAuthCookieRoute = url.includes("/auth/refresh") || url.includes("/auth/logout");
  if (isMutation && isAuthCookieRoute) {
    const csrfToken = getCsrfTokenFromCookie();
    if (csrfToken) {
      headers.set("X-CSRF-Token", csrfToken);
    }
  }

  nextConfig.headers = headers;
  return nextConfig;
};

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => applyAuthHeaders(config));

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;

    if (!originalRequest || originalRequest._retry) {
      throw error;
    }

    const status = error.response?.status;
    const isUnauthorized = status === 401;
    const isRefreshCall = (originalRequest.url ?? "").includes("/auth/refresh");

    if (!isUnauthorized || isRefreshCall) {
      throw error;
    }

    originalRequest._retry = true;

    try {
      const refreshed = await refreshSession();
      setAccessToken(refreshed.accessToken);

      const headers = AxiosHeaders.from(originalRequest.headers);
      headers.set("Authorization", `Bearer ${refreshed.accessToken}`);
      originalRequest.headers = headers;

      return api(originalRequest);
    } catch {
      setAccessToken(null);
      throw error;
    }
  },
);

export const register = async (payload: RegisterInput): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(`${API_PREFIX}/auth/register`, payload);
  return response.data;
};

export const login = async (payload: LoginInput): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(`${API_PREFIX}/auth/login`, payload);
  return response.data;
};

export const refreshSession = async (): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(`${API_PREFIX}/auth/refresh`);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post(`${API_PREFIX}/auth/logout`);
  setAccessToken(null);
};

export const getMe = async () => {
  const response = await api.get(`${API_PREFIX}/users/me`);
  return response.data;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Request failed.",
): string => {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: unknown } | undefined)?.message;
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }

    if (error.code === "ERR_NETWORK") {
      return "Cannot reach API server.";
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
};
