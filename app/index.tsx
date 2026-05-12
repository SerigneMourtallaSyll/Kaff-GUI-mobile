/**
 * Root index — dispatches to the correct route group based on auth state.
 * Expo Router renders this for `/`. We just `<Redirect />` to the right group.
 */
import { Redirect } from 'expo-router';

import { selectAuthStatus, useAuthStore } from '@/features/auth';
import { Spinner } from '@/shared/ui';

export default function Index() {
  const status = useAuthStore(selectAuthStatus);

  if (status === 'idle' || status === 'authenticating') {
    return <Spinner fullscreen />;
  }

  if (status === 'authenticated') {
    return <Redirect href="/(protected)/(tabs)/dashboard" />;
  }

  return <Redirect href="/(auth)/login" />;
}
