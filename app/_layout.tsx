/**
 * Root layout — single composition root for the whole app.
 *
 * Responsibilities:
 *   - Wire global providers (gestures, safe area, React Query, i18n).
 *   - Bootstrap the auth state from secure storage.
 *   - Keep the splash screen visible until the auth state is hydrated, so
 *     the first paint is already in the correct (auth/protected) group.
 */
import { useEffect } from 'react';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import '@/core/i18n';
import { selectAuthStatus, useAuthStore, useBootstrapAuth } from '@/features/auth';
import { useAppFonts } from '@/shared/hooks';
import { AppProviders } from '@/shared/providers';

import '../global.css';

void SplashScreen.preventAutoHideAsync();

function RootStack() {
  const status = useAuthStore(selectAuthStatus);
  const { ready: fontsReady } = useAppFonts();
  useBootstrapAuth();

  const bootReady = status !== 'idle' && fontsReady;

  useEffect(() => {
    if (bootReady) {
      void SplashScreen.hideAsync();
    }
  }, [bootReady]);

  // Show nothing while hydrating — the splash screen is still visible.
  if (!bootReady) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(protected)" options={{ animation: 'fade' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootStack />
    </AppProviders>
  );
}
