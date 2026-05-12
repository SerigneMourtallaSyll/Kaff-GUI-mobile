/**
 * Centralised storage keys.
 *
 * Why: one place to grep, one place to bump on a breaking storage change.
 * Never construct keys inline at call sites.
 */

export const SECURE_KEYS = {
  accessToken: 'kaffgui.auth.accessToken',
  refreshToken: 'kaffgui.auth.refreshToken',
} as const;

export const PREF_KEYS = {
  locale: 'kaffgui.prefs.locale',
  theme: 'kaffgui.prefs.theme',
  onboardingDone: 'kaffgui.prefs.onboardingDone',
} as const;

export type SecureKey = (typeof SECURE_KEYS)[keyof typeof SECURE_KEYS];
export type PrefKey = (typeof PREF_KEYS)[keyof typeof PREF_KEYS];
