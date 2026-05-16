/**
 * Couples Zod schemas.
 */
import { z } from 'zod';

import { pigeonNestedSchema } from '../pigeons/schemas';

export const coupleStatutSchema = z.enum(['ACTIF', 'DISSOUS']);

export const coupleSchema = z.object({
  id: z.string().uuid(),
  male: pigeonNestedSchema,
  femelle: pigeonNestedSchema,
  date_formation: z.string(), // ISO date
  date_dissolution: z.string().nullable(),
  statut: coupleStatutSchema,
  nb_reproductions: z.number().int().min(0),
  created_at: z.string(), // ISO datetime
});

export const createCoupleInputSchema = z.object({
  maleId: z.string().uuid('Sélectionnez un mâle'),
  femelleId: z.string().uuid('Sélectionnez une femelle'),
  dateFormation: z.string(),
});

export const rompreCoupleInputSchema = z.object({
  dateDissolution: z.string(),
});
