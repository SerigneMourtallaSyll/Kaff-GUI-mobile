/**
 * Thin functional wrappers around `apiClient` for the auth feature.
 *
 * - Validate every response with Zod (defence in depth).
 * - Map snake_case → camelCase at the API boundary; the rest of the app stays
 *   camelCase to remain idiomatic to TypeScript.
 */
import { apiClient, ENDPOINTS } from '@/api';
import { asISODateTime, asUUID } from '@/core/types';

import {
  loginResponseSchema,
  userResponseSchema,
  tokensResponseSchema,
  type LoginInput,
  type RegisterInput,
} from '../schemas';

import type { AuthSession, User } from '../types';

const toUser = (raw: {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}): User => ({
  id: asUUID(raw.id),
  email: raw.email,
  firstName: raw.first_name,
  lastName: raw.last_name,
  createdAt: asISODateTime(raw.created_at),
});

export const authApi = {
  async login(input: LoginInput): Promise<{
    session: AuthSession;
    tokens: { access: string; refresh: string };
  }> {
    const { data } = await apiClient.post(ENDPOINTS.auth.login, input);
    const parsed = loginResponseSchema.parse(data);
    return {
      session: { user: toUser(parsed.user) },
      tokens: parsed.tokens,
    };
  },

  async register(input: RegisterInput): Promise<User> {
    const { data } = await apiClient.post(ENDPOINTS.auth.register, {
      email: input.email,
      password: input.password,
      first_name: input.firstName,
      last_name: input.lastName,
    });
    return toUser(userResponseSchema.parse(data));
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post(ENDPOINTS.auth.logout, { refresh: refreshToken });
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get(ENDPOINTS.auth.me);
    return toUser(userResponseSchema.parse(data));
  },

  async refresh(refreshToken: string): Promise<{ access: string; refresh: string }> {
    const { data } = await apiClient.post(ENDPOINTS.auth.refresh, {
      refresh: refreshToken,
    });
    return tokensResponseSchema.parse(data);
  },
};
