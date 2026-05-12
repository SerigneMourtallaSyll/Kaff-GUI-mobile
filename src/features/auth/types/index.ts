import type { ISODateTime, UUID } from '@/core/types';

export interface User {
  id: UUID;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: ISODateTime;
}

/** Auth state machine — explicit transitions only. */
export type AuthStatus =
  | 'idle' // Not hydrated yet (boot phase).
  | 'unauthenticated' // No valid session.
  | 'authenticating' // Login/register in flight.
  | 'authenticated'; // Tokens valid, user resolved.

export interface AuthSession {
  user: User;
}
