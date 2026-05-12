/**
 * AppProviders — single composition root for runtime providers.
 *
 * Order matters: SafeArea > GestureHandler > Query > i18n already initialised
 * at import time. Keep this file minimal so it stays auditable.
 */
import type { ReactNode } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '@/core/i18n';

import { QueryProvider } from './QueryProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryProvider>{children}</QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
