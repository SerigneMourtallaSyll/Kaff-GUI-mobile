import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tokenManager } from '@/api';
import { logger } from '@/core/logger';

import { authApi } from '../api';
import { useAuthStore } from '../stores';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const reset = useAuthStore((s) => s.reset);

  return useMutation({
    mutationFn: async () => {
      const tokens = tokenManager.get();
      // Best-effort server-side logout (token blacklist). Never block the
      // client-side reset on a network failure.
      if (tokens?.refresh) {
        try {
          await authApi.logout(tokens.refresh);
        } catch (error) {
          logger.warn('[auth] server logout failed (continuing)', {
            error: String(error),
          });
        }
      }
      await tokenManager.clear();
      reset();
      queryClient.clear();
    },
    retry: false,
  });
};
