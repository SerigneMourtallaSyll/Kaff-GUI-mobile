/**
 * Reproductions feature — Zod validation schemas.
 */
import { z } from 'zod';

/**
 * Schema for reproduction from API (snake_case).
 */
export const reproductionSchema = z.object({
  id: z.string().uuid(),
  couple: z.string().uuid(),
  date_ponte: z.string(),
  date_eclosion: z.string().nullable(),
  nb_pigeonneaux: z.number().int().min(0),
  notes: z.string(),
  created_at: z.string(),
  male_bague: z.string().optional().nullable(),
  femelle_bague: z.string().optional().nullable(),
});

/**
 * Schema for pigeonneau from API (snake_case).
 */
export const pigeonneauSchema = z.object({
  id: z.string().uuid(),
  reproduction_id: z.string().uuid(),
  bague: z.string(),
  sexe: z.enum(['MALE', 'FEMALE']),
  date_naissance: z.string(),
  statut: z.enum(['ACTIF', 'VENDU', 'MORT', 'PERDU']),
  created_at: z.string(),
});

/**
 * Schema for paginated list response.
 */
export const reproductionListResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(reproductionSchema),
});

/**
 * Schema for pigeonneaux list response.
 */
export const pigeonneauxListResponseSchema = z.array(pigeonneauSchema);

/**
 * Input schema for creating a reproduction.
 */
export const createReproductionInputSchema = z.object({
  coupleId: z.string().uuid({ message: 'Sélectionnez un couple valide' }),
  datePonte: z.string().min(1, { message: 'La date de ponte est requise' }),
  nbOeufs: z.number().int().min(1, { message: "Le nombre d'œufs doit être au moins 1" }),
  notes: z.string().optional(),
});

/**
 * Input schema for updating a reproduction.
 */
export const updateReproductionInputSchema = z.object({
  dateEclosion: z.string().optional(),
  nbPigeonneaux: z.number().int().min(0).optional(),
  statut: z.enum(['EN_COURS', 'ECLOS', 'ECHEC']).optional(),
  notes: z.string().optional(),
});
