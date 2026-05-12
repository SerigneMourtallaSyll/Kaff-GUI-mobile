import type { ReactNode } from 'react';

import { Text, View } from 'react-native';

import { cn } from '@/shared/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <View className={cn('items-center justify-center px-6 py-12', className)}>
      {icon ? <View className="mb-4 opacity-70">{icon}</View> : null}
      <Text className="mb-2 text-center text-base font-semibold text-foreground">{title}</Text>
      {description ? (
        <Text className="mb-4 text-center text-sm text-muted-foreground">{description}</Text>
      ) : null}
      {action}
    </View>
  );
}
