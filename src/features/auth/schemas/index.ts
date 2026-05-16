/**
 * Zod schemas for auth — source of truth for both:
 *   1. Form validation (react-hook-form + zodResolver).
 *   2. Runtime validation of API responses (defense in depth).
 *
 * Rules enforced (cahier des charges US-AUTH-02 / RM):
 *   - Email is case-insensitive (normalised to lowercase).
 *   - Password >= 8 chars, at least 1 digit.
 */
import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email requis')
  .email('Format email invalide')
  .transform((v) => v.toLowerCase());

export const passwordSchema = z
  .string()
  .min(8, 'Au moins 8 caractères')
  .regex(/\d/, 'Au moins 1 chiffre');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Mot de passe requis'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().trim().min(1, 'Prénom requis').max(100),
  lastName: z.string().trim().min(1, 'Nom requis').max(100),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const totpCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Code à 6 chiffres requis')
    .length(6, 'Code à 6 chiffres requis'),
});

export type TOTPCodeInput = z.infer<typeof totpCodeSchema>;

/* ----------- API response schemas (validated at the API layer) ----------- */

export const tokensResponseSchema = z.object({
  access: z.string().min(1),
  refresh: z.string().min(1),
});

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  is_active: z.boolean().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

export const publicKeyResponseSchema = z.object({
  public_key: z.string(),
  algorithm: z.string(),
});

export const loginStep1ResponseSchema = z.object({
  state: z.literal('TWO_FACTOR_REQUIRED'),
  challenge_token: z.string(),
});

export const enrollmentResponseSchema = z.object({
  user: userResponseSchema,
  challenge_token: z.string(),
  provisioning_uri: z.string(),
  qr_code_data_uri: z.string(),
});

export const authenticatedResponseSchema = z.object({
  user: userResponseSchema,
  tokens: tokensResponseSchema,
});

export const loginResponseSchema = authenticatedResponseSchema;

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type PublicKeyResponse = z.infer<typeof publicKeyResponseSchema>;
export type LoginStep1Response = z.infer<typeof loginStep1ResponseSchema>;
export type EnrollmentResponse = z.infer<typeof enrollmentResponseSchema>;
export type AuthenticatedResponse = z.infer<typeof authenticatedResponseSchema>;
