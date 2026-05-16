/**
 * Screen — top-level container for routes.
 *
 * - Applies safe-area padding (status bar + bottom).
 * - Drives background color through the theme.
 * - `scroll` toggles between View and ScrollView with proper keyboard avoidance.
 */
import type { ReactNode } from 'react';

import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import type { RefreshControlProps } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/shared/utils';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  className?: string;
  contentClassName?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

export function Screen({
  children,
  scroll = false,
  className,
  contentClassName,
  edges = ['top', 'bottom'],
  refreshControl,
}: ScreenProps) {
  const Content = scroll ? ScrollView : View;

  return (
    <SafeAreaView edges={edges} className={cn('flex-1 bg-background', className)}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <Content
          className={cn('flex-1', contentClassName)}
          contentContainerClassName={scroll ? 'flex-grow' : undefined}
          keyboardShouldPersistTaps={scroll ? 'handled' : undefined}
          refreshControl={scroll ? refreshControl : undefined}
        >
          {children}
        </Content>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
