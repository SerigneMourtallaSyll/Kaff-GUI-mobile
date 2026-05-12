/**
 * Token manager — single owner of access/refresh tokens at runtime.
 *
 * - In-memory cache for fast access (no async on every request).
 * - Persistent storage in `expo-secure-store` (Keychain / EncryptedSharedPrefs).
 * - Listener API so the auth store can react to external mutations
 *   (e.g. token cleared by the refresh interceptor on auth failure).
 *
 * This file MUST stay free of UI / Zustand dependencies — it is consumed by
 * the axios interceptor which runs outside React.
 */
import { SECURE_KEYS, secureStorage } from '@/storage';

export interface Tokens {
  access: string;
  refresh: string;
}

type Listener = (tokens: Tokens | null) => void;

let inMemoryTokens: Tokens | null = null;
const listeners = new Set<Listener>();

const notify = (): void => {
  listeners.forEach((l) => l(inMemoryTokens));
};

export const tokenManager = {
  /** Hydrate in-memory cache from secure storage. Call once at app boot. */
  async hydrate(): Promise<Tokens | null> {
    const [access, refresh] = await Promise.all([
      secureStorage.get(SECURE_KEYS.accessToken),
      secureStorage.get(SECURE_KEYS.refreshToken),
    ]);

    if (access && refresh) {
      inMemoryTokens = { access, refresh };
    } else {
      inMemoryTokens = null;
    }
    notify();
    return inMemoryTokens;
  },

  /** Synchronous read — used by axios interceptor for every request. */
  get(): Tokens | null {
    return inMemoryTokens;
  },

  async set(tokens: Tokens): Promise<void> {
    inMemoryTokens = tokens;
    await Promise.all([
      secureStorage.set(SECURE_KEYS.accessToken, tokens.access),
      secureStorage.set(SECURE_KEYS.refreshToken, tokens.refresh),
    ]);
    notify();
  },

  async clear(): Promise<void> {
    inMemoryTokens = null;
    await secureStorage.clear([SECURE_KEYS.accessToken, SECURE_KEYS.refreshToken]);
    notify();
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
