/**
 * JWT auth interceptor for axios.
 *
 * Responsibilities:
 *   1. Attach `Authorization: Bearer <access>` to every outgoing request.
 *   2. On 401, attempt a refresh ONCE and queue concurrent in-flight requests
 *      so we don't fire N parallel refreshes (a classic banking-grade pitfall).
 *   3. If refresh fails (or there's no refresh token), clear tokens and
 *      surface a typed UNAUTHORIZED error so the auth store can react.
 *
 * Important: the queue holds promises, not callbacks — when the refresh
 * resolves, every queued request is replayed with the new access token.
 */
import axios from 'axios';

import { env } from '@/core/config';
import { AppError } from '@/core/errors';
import { logger } from '@/core/logger';

import { ENDPOINTS } from '../endpoints';
import { tokenManager } from '../tokenManager';

import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let pendingQueue: QueueItem[] = [];

const flushQueue = (error: unknown, token: string | null): void => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingQueue = [];
};

const refreshTokens = async (refreshToken: string): Promise<string> => {
  // Use a raw axios instance to avoid recursive interceptor calls.
  const raw = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: env.apiTimeoutMs,
    headers: { 'Content-Type': 'application/json' },
  });

  const response = await raw.post<{ access: string; refresh?: string }>(ENDPOINTS.auth.refresh, {
    refresh: refreshToken,
  });

  const newAccess = response.data.access;
  const newRefresh = response.data.refresh ?? refreshToken;
  await tokenManager.set({ access: newAccess, refresh: newRefresh });
  return newAccess;
};

export const installAuthInterceptor = (instance: AxiosInstance): void => {
  // ---------- Request: attach Bearer token ----------
  instance.interceptors.request.use((config) => {
    const tokens = tokenManager.get();
    if (tokens?.access && config.headers) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  });

  // ---------- Response: 401 → refresh + replay ----------
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config as RetryConfig | undefined;
      const status = error.response?.status;

      // Network / no response — not an auth issue.
      if (!error.response || !original) {
        return Promise.reject(error);
      }

      // Already retried once — give up to avoid loops.
      if (status !== 401 || original._retry) {
        return Promise.reject(error);
      }

      const tokens = tokenManager.get();
      if (!tokens?.refresh) {
        await tokenManager.clear();
        return Promise.reject(
          new AppError({
            code: 'UNAUTHORIZED',
            message: 'No refresh token available.',
            status: 401,
          }),
        );
      }

      original._retry = true;

      // Concurrent 401s — queue and replay once refresh completes.
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (newAccess) => {
              if (original.headers) {
                original.headers.Authorization = `Bearer ${newAccess}`;
              }
              resolve(instance.request(original as AxiosRequestConfig));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      try {
        const newAccess = await refreshTokens(tokens.refresh);
        flushQueue(null, newAccess);
        if (original.headers) {
          original.headers.Authorization = `Bearer ${newAccess}`;
        }
        return instance.request(original as AxiosRequestConfig);
      } catch (refreshError) {
        flushQueue(refreshError, null);
        await tokenManager.clear();
        logger.warn('[auth] refresh failed — clearing session', {
          error: String(refreshError),
        });
        return Promise.reject(
          new AppError({
            code: 'UNAUTHORIZED',
            message: 'Session expired. Please sign in again.',
            status: 401,
            cause: refreshError,
          }),
        );
      } finally {
        isRefreshing = false;
      }
    },
  );
};
