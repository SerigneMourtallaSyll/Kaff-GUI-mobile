/**
 * Design tokens — single source of truth for visual styles.
 *
 * These tokens are mirrored in `tailwind.config.js`. When you change a value
 * here, update the Tailwind config too (a future task: codegen). Anything
 * that should be addressable by Tailwind class names lives in the config;
 * this file is what JS/TS code reads when it needs a raw value (e.g.
 * StyleSheet, native APIs, charts).
 */

export const palette = {
  primary: {
    DEFAULT: '#030213',
    foreground: '#FFFFFF',
    50: '#F5F5F8',
    100: '#E8E8EE',
    200: '#C5C5D2',
    300: '#9C9CB1',
    400: '#5F5F7A',
    500: '#3D3D5C',
    600: '#2A2A45',
    700: '#1C1C30',
    800: '#0F0F1F',
    900: '#030213',
  },

  background: '#FFFFFF',
  foreground: '#0A0A0F',
  card: '#FFFFFF',
  cardForeground: '#0A0A0F',
  muted: '#ECECF0',
  mutedForeground: '#717182',
  accent: '#E9EBEF',
  accentForeground: '#030213',
  border: '#E5E7EB',
  input: '#F3F3F5',

  // Volière (cahier des charges §3.8)
  cage: {
    free: '#4CAF50',
    pigeon: '#F44336',
    couple: '#FF9800',
  },

  // Status
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
  info: '#0EA5E9',
} as const;

export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
} as const;

export const radius = {
  none: 0,
  sm: 6,
  DEFAULT: 8,
  md: 10,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 6,
  },
} as const;

export type Palette = typeof palette;
export type Spacing = typeof spacing;
export type Radius = typeof radius;
