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
import { AppProviders } from '@/shared/providers';

import '../global.css';

void SplashScreen.preventAutoHideAsync();

function RootStack() {
  const status = useAuthStore(selectAuthStatus);
  useBootstrapAuth();

  useEffect(() => {
    if (status !== 'idle') {
      void SplashScreen.hideAsync();
    }
  }, [status]);

  // Show nothing while hydrating — the splash screen is still visible.
  if (status === 'idle') return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
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
