/**
 * Protected group layout — requires an authenticated session.
 * Redirect unauthenticated users to the login screen.
 */
import { Redirect, Stack } from 'expo-router';

import { selectAuthStatus, useAuthStore } from '@/features/auth';

export default function ProtectedLayout() {
  const status = useAuthStore(selectAuthStatus);

  if (status === 'unauthenticated') {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
