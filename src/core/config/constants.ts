/**
 * Cross-cutting application constants.
 * Keep values that are independent of the environment here.
 */

export const APP = {
  name: 'Kàff GUI',
  fullName: 'Baay Pitàq Colombophile Management System',
  version: '1.0.0',
} as const;

export const QUERY = {
  /** Default React Query staleTime (5 minutes). */
  staleTime: 1000 * 60 * 5,
  /** Default cache garbage-collection delay (30 minutes). */
  gcTime: 1000 * 60 * 30,
  /** Max number of retries for queries (mutations stay at 0). */
  retries: 2,
} as const;

export const AUTH = {
  /** Margin before access token expiration to trigger refresh. */
  refreshSkewMs: 60 * 1000,
  /** Max number of failed login attempts before client-side rate limiting. */
  maxLoginAttempts: 5,
  /** Lockout window after exceeding max login attempts. */
  lockoutWindowMs: 5 * 60 * 1000,
} as const;
