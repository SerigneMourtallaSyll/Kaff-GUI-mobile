/**
 * Public surface of the auth feature.
 * Other features MUST only import from this barrel — internals are private.
 */

export { authApi } from './api';
export * from './hooks';
export { useAuthStore, selectIsAuthenticated, selectAuthStatus, selectUser } from './stores';
export type { User, AuthStatus, AuthSession } from './types';
export { loginSchema, registerSchema, emailSchema, passwordSchema } from './schemas';
export type { LoginInput, RegisterInput } from './schemas';
