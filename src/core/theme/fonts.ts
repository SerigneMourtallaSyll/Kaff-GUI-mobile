/**
 * Font family configuration.
 *
 * Konnect is the primary type family. We register one font per weight so the
 * platform picks the right glyphs without faux-bolding. The actual binaries
 * live in `assets/fonts/` (see the README there).
 *
 * Tailwind classes map to these names through `tailwind.config.js`:
 *   `font-sans`      → Konnect-Regular
 *   `font-medium`    → Konnect-Medium (weight 500)  — handled by RN fontWeight
 *   `font-semibold`  → Konnect-SemiBold
 *   `font-bold`      → Konnect-Bold
 *
 * In React Native, when font files are split by weight we MUST also set the
 * corresponding `fontFamily` (the `fontWeight` style alone is not enough).
 * The `byWeight` helper centralises that mapping.
 */

export const FONT_FAMILY = {
  regular: 'Konnect-Regular',
  medium: 'Konnect-Medium',
  semibold: 'Konnect-SemiBold',
  bold: 'Konnect-Bold',
} as const;

export type FontWeightToken = keyof typeof FONT_FAMILY;

export const byWeight = (weight: FontWeightToken): string => FONT_FAMILY[weight];
