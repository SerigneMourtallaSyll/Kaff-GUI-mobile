/**
 * Thin functional wrappers around `apiClient` for the auth feature.
 *
 * - Validate every response with Zod (defence in depth).
 * - Map snake_case → camelCase at the API boundary; the rest of the app stays
 *   camelCase to remain idiomatic to TypeScript.
 * - Handle encrypted payloads for login/register (X25519 sealed box).
 */
import { apiClient, ENDPOINTS } from '@/api';
import { encryptPayload } from '@/api/crypto';
import { asISODateTime, asUUID } from '@/core/types';

import {
  authenticatedResponseSchema,
  enrollmentResponseSchema,
  loginStep1ResponseSchema,
  publicKeyResponseSchema,
  tokensResponseSchema,
  userResponseSchema,
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
  /**
   * Fetch server's public key for encryption.
   * Must be called before login/register.
   */
  async getPublicKey(): Promise<{ publicKey: string; algorithm: string }> {
    const { data } = await apiClient.get(ENDPOINTS.auth.publicKey);
    const parsed = publicKeyResponseSchema.parse(data);
    return {
      publicKey: parsed.public_key,
      algorithm: parsed.algorithm,
    };
  },

  /**
   * Login step 1: Send encrypted credentials, receive challenge token.
   */
  async loginStep1(input: LoginInput): Promise<{ challengeToken: string }> {
    const encryptedPayload = encryptPayload({
      email: input.email,
      password: input.password,
    });

    const { data } = await apiClient.post(ENDPOINTS.auth.login, {
      encrypted_payload: encryptedPayload,
    });

    const parsed = loginStep1ResponseSchema.parse(data);
    return { challengeToken: parsed.challenge_token };
  },

  /**
   * Login step 2: Verify TOTP code, receive JWT tokens.
   */
  async verify2FA(
    challengeToken: string,
    code: string,
  ): Promise<{
    session: AuthSession;
    tokens: { access: string; refresh: string };
  }> {
    const { data } = await apiClient.post(ENDPOINTS.auth.verify2FA, {
      challenge_token: challengeToken,
      code,
    });

    const parsed = authenticatedResponseSchema.parse(data);
    return {
      session: { user: toUser(parsed.user) },
      tokens: parsed.tokens,
    };
  },

  /**
   * Register step 1: Send encrypted credentials, receive QR code + challenge token.
   */
  async register(input: RegisterInput): Promise<{
    user: User;
    challengeToken: string;
    provisioningUri: string;
    qrCodeDataUri: string;
  }> {
    const encryptedPayload = encryptPayload({
      email: input.email,
      password: input.password,
      first_name: input.firstName,
      last_name: input.lastName,
    });

    const { data } = await apiClient.post(ENDPOINTS.auth.register, {
      encrypted_payload: encryptedPayload,
    });

    const parsed = enrollmentResponseSchema.parse(data);
    return {
      user: toUser(parsed.user),
      challengeToken: parsed.challenge_token,
      provisioningUri: parsed.provisioning_uri,
      qrCodeDataUri: parsed.qr_code_data_uri,
    };
  },

  /**
   * Register step 2: Confirm TOTP enrollment, receive JWT tokens.
   */
  async confirmRegistration(
    challengeToken: string,
    code: string,
  ): Promise<{
    session: AuthSession;
    tokens: { access: string; refresh: string };
  }> {
    const { data } = await apiClient.post(ENDPOINTS.auth.registerConfirm, {
      challenge_token: challengeToken,
      code,
    });

    const parsed = authenticatedResponseSchema.parse(data);
    return {
      session: { user: toUser(parsed.user) },
      tokens: parsed.tokens,
    };
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
