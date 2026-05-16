/**
 * Dashboard Zod schemas for runtime validation.
 */
import { z } from 'zod';

export const recentReproductionSchema = z.object({
  id: z.string().uuid(),
  couple_id: z.string().uuid(),
  date_ponte: z.string(), // ISO date
  date_eclosion: z.string().nullable(),
  nb_pigeonneaux: z.number().int().min(0),
  male_bague: z.string(),
  femelle_bague: z.string(),
});

export const dashboardStatsSchema = z.object({
  pigeons: z.object({
    actifs: z.number().int().min(0),
    vendus: z.number().int().min(0),
    morts: z.number().int().min(0),
    perdus: z.number().int().min(0),
  }),
  cages: z.object({
    libres: z.number().int().min(0),
    occupees_pigeon: z.number().int().min(0),
    occupees_couple: z.number().int().min(0),
  }),
  couples_actifs: z.number().int().min(0),
  dernieres_reproductions: z.array(recentReproductionSchema),
});
