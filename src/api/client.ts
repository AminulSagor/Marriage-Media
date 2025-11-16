// src/api/client.ts
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import {API_BASE_URL} from '../config/env';
import {getToken} from '../storage/secureToken';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

/**
 * Request interceptor
 * Attach Bearer token if present.
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getToken();

    if (token) {
      if (!config.headers) {
        (config as any).headers = {};
      }

      const headers = config.headers as any;

      // Axios v1: AxiosHeaders instance has .set()
      if (typeof headers.set === 'function') {
        headers.set('Authorization', `Bearer ${token}`);
      } else {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  error => Promise.reject(error),
);

/**
 * Response interceptor
 * Normalize errors so screens / React Query can rely on `error.message`
 * and (optionally) `error.status` & `error.data`.
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const backendMessage =
      (error.response?.data as any)?.message ||
      (error.response?.data as any)?.error;

    const normalizedError: AxiosError & {
      status?: number;
      data?: any;
    } = {
      ...error,
      status,
      data: error.response?.data,
      message:
        backendMessage ||
        (status === 401
          ? 'Your session has expired. Please log in again.'
          : status === 403
          ? 'You do not have permission to perform this action.'
          : status === 404
          ? 'Requested resource was not found.'
          : status && status >= 500
          ? 'Server error. Please try again later.'
          : error.message || 'Something went wrong.'),
    };

    if (__DEV__) {
      // Helpful debug log
      console.log('[API ERROR]', {
        url: error.config?.url,
        method: error.config?.method,
        status: normalizedError.status,
        message: normalizedError.message,
        data: normalizedError.data,
      });
    }

    return Promise.reject(normalizedError);
  },
);
