import { useMutation } from '@tanstack/react-query';

import { tokenManager } from '@/api';
import { logger } from '@/core/logger';

import { authApi } from '../api';
import { useAuthStore } from '../stores';

import type { LoginInput } from '../schemas';

export const useLogin = () => {
  const setAuthenticating = useAuthStore((s) => s.setAuthenticating);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setUnauthenticated = useAuthStore((s) => s.setUnauthenticated);

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      setAuthenticating();
      const { session, tokens } = await authApi.login(input);
      await tokenManager.set(tokens);
      return session;
    },
    onSuccess: (session) => {
      setAuthenticated(session);
      logger.info('[auth] login success');
    },
    onError: (error) => {
      setUnauthenticated();
      logger.warn('[auth] login failed', { error: String(error) });
    },
    retry: false,
  });
};
