/**
 * LoadingOverlay — full-screen loading indicator with backdrop.
 *
 * Used for blocking operations like authentication, data fetching, etc.
 */
import { ActivityIndicator, Text, View } from 'react-native';

import { FONT_FAMILY } from '@/core/theme';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <View
      className="absolute inset-0 z-50 items-center justify-center bg-black/50"
      style={{ elevation: 1000 }}
    >
      <View className="items-center rounded-2xl bg-white p-6 shadow-lg">
        <ActivityIndicator size="large" color="#4CAF50" />
        {message ? (
          <Text
            style={{ fontFamily: FONT_FAMILY.medium }}
            className="mt-4 text-center text-base text-foreground"
          >
            {message}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
