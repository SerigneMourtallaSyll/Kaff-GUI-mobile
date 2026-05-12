/**
 * useAppFonts — loads the app type system at boot.
 *
 * Returns a tuple [loaded, error] mirroring expo-font's `useFonts`. When the
 * font files are not yet provided locally (see `assets/fonts/README.md`), the
 * hook gracefully resolves with `loaded = true` so the app keeps rendering
 * with the platform default font instead of staying stuck on splash.
 *
 * To enable Konnect:
 *   1. Drop the four .otf/.ttf files in `assets/fonts/`.
 *   2. Uncomment the `require()` block below.
 *   3. Restart Metro (`npm run start -- --reset-cache`).
 */
import { useEffect, useState } from 'react';

import { loadAsync } from 'expo-font';

import { logger } from '@/core/logger';

const KONNECT_ASSETS: Record<string, number> | null = null;
// === Uncomment once the font files exist in `assets/fonts/` ===
// const KONNECT_ASSETS: Record<string, number> = {
//   'Konnect-Regular': require('@/../assets/fonts/Konnect-Regular.otf'),
//   'Konnect-Medium': require('@/../assets/fonts/Konnect-Medium.otf'),
//   'Konnect-SemiBold': require('@/../assets/fonts/Konnect-SemiBold.otf'),
//   'Konnect-Bold': require('@/../assets/fonts/Konnect-Bold.otf'),
// };

export const useAppFonts = (): { ready: boolean; error: Error | null } => {
  const [ready, setReady] = useState(KONNECT_ASSETS === null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (KONNECT_ASSETS === null) return;
    let cancelled = false;

    loadAsync(KONNECT_ASSETS)
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err: unknown) => {
        logger.warn('[fonts] Konnect failed to load — falling back to system', {
          error: String(err),
        });
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          // Still mark ready: better to render with system font than to block.
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { ready, error };
};
