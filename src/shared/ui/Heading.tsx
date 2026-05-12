import type { ReactNode } from 'react';

import { Text } from 'react-native';

import { FONT_FAMILY } from '@/core/theme';
import { cn } from '@/shared/utils';

type Level = 'h1' | 'h2' | 'h3';

interface HeadingProps {
  level?: Level;
  children: ReactNode;
  className?: string;
}

const styles: Record<Level, string> = {
  h1: 'text-3xl text-foreground',
  h2: 'text-xl text-foreground',
  h3: 'text-base text-foreground',
};

const weightByLevel: Record<Level, string> = {
  h1: FONT_FAMILY.bold,
  h2: FONT_FAMILY.semibold,
  h3: FONT_FAMILY.semibold,
};

export function Heading({ level = 'h2', children, className }: HeadingProps) {
  return (
    <Text style={{ fontFamily: weightByLevel[level] }} className={cn(styles[level], className)}>
      {children}
    </Text>
  );
}
