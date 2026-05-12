import type { ReactNode } from 'react';

import { Text } from 'react-native';

import { cn } from '@/shared/utils';

type Level = 'h1' | 'h2' | 'h3';

interface HeadingProps {
  level?: Level;
  children: ReactNode;
  className?: string;
}

const styles: Record<Level, string> = {
  h1: 'text-3xl font-bold text-foreground',
  h2: 'text-xl font-semibold text-foreground',
  h3: 'text-base font-semibold text-foreground',
};

export function Heading({ level = 'h2', children, className }: HeadingProps) {
  return <Text className={cn(styles[level], className)}>{children}</Text>;
}
