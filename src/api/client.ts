/**
 * Axios HTTP client — singleton.
 *
 * Wire order matters:
 *   1. Auth interceptor (attach token, refresh on 401, replay).
 *   2. Error interceptor (normalise into AppError).
 *
 * The auth interceptor must run FIRST on responses so that a successful
 * refresh+retry doesn't bubble up as a 401 AppError.
 */
import axios from 'axios';

import { env } from '@/core/config';

import { installAuthInterceptor } from './interceptors/authInterceptor';
import { installErrorInterceptor } from './interceptors/errorInterceptor';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

installAuthInterceptor(apiClient);
installErrorInterceptor(apiClient);

export type { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
