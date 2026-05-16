/**
 * Sorties Zod schemas for runtime validation.
 */
import { z } from 'zod';

export const sortieTypeSchema = z.enum(['VENTE', 'DECES', 'PERTE']);

export const sortieSchema = z.object({
  id: z.string().uuid(),
  pigeon: z.string().uuid(),
  type_sortie: sortieTypeSchema,
  date_sortie: z.string(), // ISO date
  prix: z.string().nullable(), // Decimal as string
  acheteur: z.string(),
  cause: z.string(),
  circonstance: z.string(),
  created_at: z.string(), // ISO datetime
});
