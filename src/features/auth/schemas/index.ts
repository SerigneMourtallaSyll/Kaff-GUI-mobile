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
  created_at: z.string(),
});

export const loginResponseSchema = z.object({
  user: userResponseSchema,
  tokens: tokensResponseSchema,
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
