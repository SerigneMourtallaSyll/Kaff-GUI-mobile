/**
 * Secure storage wrapper backed by `expo-secure-store` (Keychain on iOS,
 * EncryptedSharedPreferences on Android).
 *
 * - Use ONLY for sensitive data (auth tokens, session secrets).
 * - Reads/writes are async — expose `*Async` suffix at call sites.
 * - Never log values from this module.
 */
import * as SecureStore from 'expo-secure-store';

import { logger } from '@/core/logger';

import type { SecureKey } from './keys';

const options: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED,
};

export const secureStorage = {
  async get(key: SecureKey): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key, options);
    } catch (error) {
      logger.error('[secureStorage] get failed', { key, error: String(error) });
      return null;
    }
  },

  async set(key: SecureKey, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value, options);
    } catch (error) {
      logger.error('[secureStorage] set failed', { key, error: String(error) });
      throw error;
    }
  },

  async remove(key: SecureKey): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key, options);
    } catch (error) {
      logger.error('[secureStorage] remove failed', { key, error: String(error) });
    }
  },

  async clear(keys: readonly SecureKey[]): Promise<void> {
    await Promise.all(keys.map((k) => this.remove(k)));
  },
};
