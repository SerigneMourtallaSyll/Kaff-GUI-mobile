/**
 * TopLoadingBar — Thin progress bar at the top of the screen.
 *
 * Shows during API requests. Uses Reanimated for smooth animations.
 */
import { useEffect } from 'react';

import { StyleSheet, View } from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

import { palette } from '@/core/theme';

interface TopLoadingBarProps {
  isLoading: boolean;
}

export function TopLoadingBar({ isLoading }: TopLoadingBarProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (isLoading) {
      // Indeterminate progress animation
      progress.value = 0;
      progress.value = withRepeat(
        withTiming(1, {
          duration: 1500,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
        }),
        -1, // infinite
        false,
      );
    } else {
      // Complete the bar quickly then hide
      cancelAnimation(progress);
      progress.value = withTiming(1, { duration: 200 }, () => {
        progress.value = 0;
      });
    }
  }, [isLoading, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  // Don't render if not loading (avoid reading progress.value during render)
  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bar, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'transparent',
    zIndex: 9999,
  },
  bar: {
    height: '100%',
    backgroundColor: palette.primary[500],
  },
});
