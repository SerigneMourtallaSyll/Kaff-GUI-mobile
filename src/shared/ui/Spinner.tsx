import { ActivityIndicator, View } from 'react-native';

import { palette } from '@/core/theme';

interface SpinnerProps {
  size?: 'small' | 'large';
  fullscreen?: boolean;
}

export function Spinner({ size = 'large', fullscreen = false }: SpinnerProps) {
  if (fullscreen) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size={size} color={palette.primary.DEFAULT} />
      </View>
    );
  }
  return <ActivityIndicator size={size} color={palette.primary.DEFAULT} />;
}
