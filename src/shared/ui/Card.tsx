import type { ReactNode } from 'react';

import { View } from 'react-native';

import { cn } from '@/shared/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <View className={cn('rounded-xl border border-border bg-card p-4', className)}>{children}</View>
  );
}
