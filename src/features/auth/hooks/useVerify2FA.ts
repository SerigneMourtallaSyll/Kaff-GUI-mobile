/**
 * useVerify2FA — handles TOTP verification (login step 2 or register confirm).
 *
 * Verifies the 6-digit code and completes authentication.
 */
import { useMutation } from '@tanstack/react-query';

import { tokenManager } from '@/api';
import { logger } from '@/core/logger';

import { authApi } from '../api';
import { useAuthStore } from '../stores';

interface Verify2FAInput {
  challengeToken: string;
  code: string;
  isRegistration?: boolean;
}

export const useVerify2FA = () => {
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setUnauthenticated = useAuthStore((s) => s.setUnauthenticated);

  return useMutation({
    mutationFn: async ({ challengeToken, code, isRegistration }: Verify2FAInput) => {
      const result = isRegistration
        ? await authApi.confirmRegistration(challengeToken, code)
        : await authApi.verify2FA(challengeToken, code);

      await tokenManager.set(result.tokens);
      return result.session;
    },
    onSuccess: (session) => {
      setAuthenticated(session);
      logger.info('[auth] 2FA verification success');
    },
    onError: (error) => {
      setUnauthenticated();
      logger.warn('[auth] 2FA verification failed', { error: String(error) });
    },
    retry: false,
  });
};
