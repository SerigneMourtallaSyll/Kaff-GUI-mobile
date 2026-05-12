/**
 * useBootstrapAuth — hydrates auth state from secure storage on app boot.
 *
 * Boot flow:
 *   1. Read tokens from secure storage (if any).
 *   2. If found, call `me()` to validate them and fetch the current user.
 *   3. Move the store from `idle` to either `authenticated` or
 *      `unauthenticated`. This drives the navigation guards.
 *
 * The hook is a fire-and-forget effect — components rely on the store's
 * `status` to render gates.
 */
import { useEffect } from 'react';

import { tokenManager } from '@/api';
import { logger } from '@/core/logger';

import { authApi } from '../api';
import { useAuthStore } from '../stores';

export const useBootstrapAuth = (): void => {
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setUnauthenticated = useAuthStore((s) => s.setUnauthenticated);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async (): Promise<void> => {
      try {
        const tokens = await tokenManager.hydrate();
        if (!tokens) {
          if (!cancelled) setUnauthenticated();
          return;
        }
        const user = await authApi.me();
        if (!cancelled) setAuthenticated({ user });
      } catch (error) {
        logger.warn('[auth] bootstrap failed', { error: String(error) });
        await tokenManager.clear();
        if (!cancelled) setUnauthenticated();
      }
    };

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [setAuthenticated, setUnauthenticated]);
};
