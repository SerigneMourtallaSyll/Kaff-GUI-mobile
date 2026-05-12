/**
 * Normalises axios errors into typed `AppError`s.
 *
 * Run AFTER the auth interceptor so 401-driven refreshes are not converted to
 * AppError before the auth interceptor gets a chance to retry.
 */
import axios from 'axios';

import { AppError, type AppErrorCode } from '@/core/errors';
import { logger } from '@/core/logger';

import type { AxiosError, AxiosInstance } from 'axios';

interface ApiErrorBody {
  detail?: string;
  message?: string;
  /** DRF-style field errors: { field: [msg, ...] } */
  [field: string]: unknown;
}

const codeFromStatus = (status: number | undefined): AppErrorCode => {
  if (!status) return 'NETWORK_ERROR';
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 409) return 'CONFLICT';
  if (status === 422 || status === 400) return 'VALIDATION_ERROR';
  if (status >= 500) return 'SERVER_ERROR';
  return 'UNKNOWN_ERROR';
};

const extractFieldErrors = (
  body: ApiErrorBody | undefined,
): Record<string, string[]> | undefined => {
  if (!body) return undefined;
  const entries: [string, string[]][] = [];
  for (const [key, value] of Object.entries(body)) {
    if (key === 'detail' || key === 'message') continue;
    if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
      entries.push([key, value as string[]]);
    }
  }
  return entries.length ? Object.fromEntries(entries) : undefined;
};

export const installErrorInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorBody>) => {
      // Already an AppError (e.g. from the auth interceptor): pass through.
      if (AppError.isAppError(error)) {
        return Promise.reject(error);
      }

      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }

      const status = error.response?.status;
      const code = codeFromStatus(status);
      const body = error.response?.data;
      const message =
        body?.detail ?? body?.message ?? error.message ?? 'An unexpected error occurred.';

      const appError = new AppError({
        code,
        message,
        status,
        fields: extractFieldErrors(body),
        cause: error,
        retryable: code === 'NETWORK_ERROR' || code === 'SERVER_ERROR' || code === 'TIMEOUT',
      });

      logger.warn('[api] request failed', {
        url: error.config?.url,
        method: error.config?.method,
        code,
        status,
      });

      return Promise.reject(appError);
    },
  );
};
