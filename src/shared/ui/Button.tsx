/**
 * Button — primary actionable element of the design system.
 *
 * Variants align with the prototype (primary, secondary, outline, destructive,
 * ghost). Sizes: sm, md, lg. Supports loading state, leading icon, and a
 * disabled state that is both visually distinct and accessible.
 */
import type { ReactNode } from 'react';

import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { FONT_FAMILY } from '@/core/theme';
import { cn } from '@/shared/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  className?: string;
  accessibilityLabel?: string;
  testID?: string;
}

const containerStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary active:opacity-80',
  secondary: 'bg-muted active:opacity-80',
  outline: 'border border-border bg-transparent active:bg-muted',
  destructive: 'bg-danger active:opacity-80',
  ghost: 'bg-transparent active:bg-muted',
};

const textStyles: Record<ButtonVariant, string> = {
  primary: 'text-primary-foreground',
  secondary: 'text-foreground',
  outline: 'text-foreground',
  destructive: 'text-white',
  ghost: 'text-primary',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3',
  md: 'h-12 px-4',
  lg: 'h-14 px-6',
};

const textSizeStyles: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-base',
};

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
  leadingIcon,
  className,
  accessibilityLabel,
  testID,
}: ButtonProps) {
  const isInert = disabled || loading;

  return (
    <Pressable
      onPress={isInert ? undefined : onPress}
      disabled={isInert}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isInert, busy: loading }}
      testID={testID}
      className={cn(
        'flex-row items-center justify-center rounded-lg',
        containerStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        isInert && 'opacity-50',
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'destructive' ? '#FFFFFF' : '#030213'}
        />
      ) : (
        <View className="flex-row items-center gap-2">
          {leadingIcon}
          <Text
            style={{ fontFamily: FONT_FAMILY.medium }}
            className={cn(textStyles[variant], textSizeStyles[size])}
          >
            {children}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
