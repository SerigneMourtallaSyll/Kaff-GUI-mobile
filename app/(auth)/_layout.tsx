/**
 * Auth group layout — only accessible when NOT authenticated.
 * Redirect logged-in users back to the protected area.
 */
import { Redirect, Stack } from 'expo-router';

import { selectAuthStatus, useAuthStore } from '@/features/auth';

export default function AuthLayout() {
  const status = useAuthStore(selectAuthStatus);

  if (status === 'authenticated') {
    return <Redirect href="/(protected)/(tabs)/dashboard" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
