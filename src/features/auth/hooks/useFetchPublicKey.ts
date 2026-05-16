/**
 * useFetchPublicKey — fetches server's public key.
 *
 * Must be called before any login/register operation.
 * Crypto is already initialized via index.js polyfill.
 */
import { useEffect } from 'react';

import { useMutation } from '@tanstack/react-query';

import { setServerPublicKey } from '@/api/crypto';
import { logger } from '@/core/logger';

import { authApi } from '../api';

export const useFetchPublicKey = () => {
  return useMutation({
    mutationFn: async () => {
      const { publicKey } = await authApi.getPublicKey();
      setServerPublicKey(publicKey);
      logger.info('[auth] public key fetched and crypto initialized');
      return publicKey;
    },
    retry: 2,
  });
};

/**
 * useInitCrypto — auto-fetches public key on mount.
 * Use this in the root auth layout to ensure crypto is ready.
 */
export const useInitCrypto = () => {
  const fetchPublicKey = useFetchPublicKey();

  useEffect(() => {
    if (!fetchPublicKey.data && !fetchPublicKey.isPending) {
      fetchPublicKey.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return fetchPublicKey;
};
