/**
 * Design tokens — single source of truth for visual styles.
 *
 * These tokens are mirrored in `tailwind.config.js`. When you change a value
 * here, update the Tailwind config too (a future task: codegen). Anything
 * that should be addressable by Tailwind class names lives in the config;
 * this file is what JS/TS code reads when it needs a raw value (e.g.
 * StyleSheet, native APIs, charts).
 */
import { FONT_FAMILY } from './fonts';

export const palette = {
  primary: {
    DEFAULT: '#4CAF50', // Vert du prototype
    foreground: '#FFFFFF',
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50',
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },

  background: '#FFFFFF',
  foreground: '#1A1A1A',
  card: '#FFFFFF',
  cardForeground: '#1A1A1A',
  muted: '#F5F5F5',
  mutedForeground: '#6B7280',
  accent: '#E8F5E9',
  accentForeground: '#1A1A1A',
  border: 'rgba(0, 0, 0, 0.1)',
  input: '#F5F5F5',

  // Volière (cahier des charges §3.8)
  cage: {
    free: '#4CAF50',
    pigeon: '#F44336',
    couple: '#FF9800',
  },

  // Status
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
  info: '#2196F3',

  // Chart accents (mirror the prototype shadcn chart-* palette so screens
  // can carry the same iconography colors)
  chart: {
    1: '#4CAF50',
    2: '#81C784',
    3: '#F44336',
    4: '#FF9800',
    5: '#2196F3',
  },

  // Pigeon sex tints (used in the Pigeons / Couples lists)
  male: { bg: '#DBEAFE', fg: '#2563EB' },
  female: { bg: '#FCE7F3', fg: '#DB2777' },
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
  fontFamily: FONT_FAMILY,
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
