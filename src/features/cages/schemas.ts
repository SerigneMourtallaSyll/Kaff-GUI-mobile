/**
 * Cages Zod schemas.
 */
import { z } from 'zod';

export const cageStatutSchema = z.enum(['LIBRE', 'OCCUPE_PIGEON', 'OCCUPE_COUPLE']);

/**
 * Schema for cage from API (snake_case).
 */
export const cageSchema = z.object({
  id: z.string().uuid(),
  numero: z.string(),
  nom: z.string(),
  superficie: z.string().nullable(),
  description: z.string().nullable(),
  statut_occupation: cageStatutSchema,
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * Schema for cage creation response (limited fields).
 */
export const cageCreateResponseSchema = z.object({
  id: z.string().uuid(),
  numero: z.string(),
  nom: z.string(),
  superficie: z.string().nullable(),
  description: z.string().nullable(),
});

/**
 * Schema for volière cage view.
 */
export const voletCageSchema = z.object({
  id: z.string().uuid(),
  numero: z.string(),
  nom: z.string(),
  statut_occupation: cageStatutSchema,
  color: z.string(),
  pigeon: z
    .object({
      id: z.string().uuid(),
      bague: z.string(),
      sexe: z.string(),
      race: z.string(),
    })
    .nullable(),
  couple: z
    .object({
      id: z.string().uuid(),
      male_bague: z.string(),
      femelle_bague: z.string(),
    })
    .nullable(),
});

/**
 * Input schema for creating a cage.
 */
export const createCageInputSchema = z.object({
  numero: z.string().min(1, 'Le numéro de cage est obligatoire'),
  nom: z.string().min(1, 'Le nom de la cage est obligatoire'),
  superficie: z.number().positive().optional(),
  description: z.string().optional(),
});

/**
 * Input schema for updating a cage.
 */
export const updateCageInputSchema = z.object({
  nom: z.string().min(1).optional(),
  superficie: z.number().positive().optional(),
  description: z.string().optional(),
});
