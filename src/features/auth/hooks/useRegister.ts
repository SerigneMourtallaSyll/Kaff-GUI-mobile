/**
 * useRegister — handles registration step 1.
 *
 * Sends encrypted credentials and receives QR code + challenge token.
 * Step 2 (TOTP confirmation) is handled by useVerify2FA.
 */
import { useMutation } from '@tanstack/react-query';

import { logger } from '@/core/logger';

import { authApi } from '../api';

import type { RegisterInput } from '../schemas';

export const useRegister = () =>
  useMutation({
    mutationFn: async (input: RegisterInput) => {
      const result = await authApi.register(input);
      logger.info('[auth] registration step 1 success');
      return result;
    },
    onError: (error) => {
      logger.warn('[auth] registration step 1 failed', { error: String(error) });
    },
    retry: false,
  });
