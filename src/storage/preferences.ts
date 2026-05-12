/**
 * Non-sensitive preferences (theme, locale, onboarding flags...).
 * Backed by AsyncStorage; works in Expo Go (no native build required).
 *
 * Swap to MMKV later by replacing the implementation without changing the API.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import { logger } from '@/core/logger';

import type { PrefKey } from './keys';

export const preferences = {
  async get<T>(key: PrefKey): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (error) {
      logger.warn('[preferences] get failed', { key, error: String(error) });
      return null;
    }
  },

  async set<T>(key: PrefKey, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      logger.warn('[preferences] set failed', { key, error: String(error) });
    }
  },

  async remove(key: PrefKey): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      logger.warn('[preferences] remove failed', { key, error: String(error) });
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      logger.warn('[preferences] clear failed', { error: String(error) });
    }
  },
};
