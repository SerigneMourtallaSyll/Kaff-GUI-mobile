/**
 * Auth store — single source of truth for client-side auth state.
 *
 * Pattern: minimal Zustand store driven by an explicit state machine. All
 * mutations go through dedicated actions so the transitions stay auditable.
 *
 * Note: persistence is NOT done by Zustand — `tokenManager` owns the tokens
 * (in secure storage). This store mirrors the in-memory derived state.
 */
import { create } from 'zustand';

import type { AuthSession, AuthStatus, User } from '../types';

interface AuthState {
  status: AuthStatus;
  session: AuthSession | null;
  // Action surface
  setAuthenticating: () => void;
  setAuthenticated: (session: AuthSession) => void;
  setUnauthenticated: () => void;
  setUser: (user: User) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'idle',
  session: null,

  setAuthenticating: () => set({ status: 'authenticating' }),

  setAuthenticated: (session) => set({ status: 'authenticated', session }),

  setUnauthenticated: () => set({ status: 'unauthenticated', session: null }),

  setUser: (user) =>
    set((state) => (state.session ? { session: { ...state.session, user } } : state)),

  reset: () => set({ status: 'unauthenticated', session: null }),
}));

/** Convenience selectors — keep components subscribed to minimal slices. */
export const selectIsAuthenticated = (s: AuthState): boolean => s.status === 'authenticated';

export const selectAuthStatus = (s: AuthState): AuthStatus => s.status;

export const selectUser = (s: AuthState): User | null => s.session?.user ?? null;
