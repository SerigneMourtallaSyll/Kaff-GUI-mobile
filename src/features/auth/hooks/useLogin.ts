/**
 * useLogin — handles the 2-step login flow.
 *
 * Step 1: Send encrypted credentials → receive challenge token
 * Step 2: Handled by useVerify2FA hook
 *
 * This hook only handles step 1 and returns the challenge token.
 */
import { useMutation } from '@tanstack/react-query';

import { logger } from '@/core/logger';

import { authApi } from '../api';
import { useAuthStore } from '../stores';

import type { LoginInput } from '../schemas';

export const useLogin = () => {
  const setAuthenticating = useAuthStore((s) => s.setAuthenticating);
  const setUnauthenticated = useAuthStore((s) => s.setUnauthenticated);

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      setAuthenticating();
      const { challengeToken } = await authApi.loginStep1(input);
      return { challengeToken };
    },
    onError: (error) => {
      setUnauthenticated();
      logger.warn('[auth] login step 1 failed', { error: String(error) });
    },
    retry: false,
  });
};
