/**
 * Input — controlled text field with optional leading icon, label, error.
 *
 * - Forwards every TextInput prop via `inputProps` so we don't shadow the
 *   React Native API.
 * - Designed to be driven by react-hook-form's Controller.
 */
import { forwardRef, type ReactNode } from 'react';

import { Text, TextInput, type TextInputProps, View } from 'react-native';

import { cn } from '@/shared/utils';

interface InputProps extends Omit<TextInputProps, 'style' | 'placeholderTextColor'> {
  label?: string;
  error?: string | undefined;
  leadingIcon?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, leadingIcon, containerClassName, className, ...rest },
  ref,
) {
  const hasError = Boolean(error);
  return (
    <View className={cn('w-full', containerClassName)}>
      {label ? <Text className="mb-2 text-sm text-foreground">{label}</Text> : null}
      <View
        className={cn(
          'flex-row items-center rounded-lg border bg-input px-3',
          hasError ? 'border-danger' : 'border-border',
        )}
      >
        {leadingIcon ? <View className="mr-2">{leadingIcon}</View> : null}
        <TextInput
          ref={ref}
          placeholderTextColor="#9C9CB1"
          className={cn('h-12 flex-1 text-base text-foreground', className)}
          {...rest}
        />
      </View>
      {hasError ? (
        <Text className="mt-1 text-xs text-danger" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
});
