/**
 * Pigeons Zod schemas for runtime validation.
 */
import { z } from 'zod';

// Enums
export const pigeonSexeSchema = z.enum(['MALE', 'FEMALE']);
export const pigeonStatutSchema = z.enum(['ACTIF', 'VENDU', 'MORT', 'PERDU']);

// Nested pigeon (used in relations)
export const pigeonNestedSchema = z.object({
  id: z.string().uuid(),
  bague: z.string(),
  sexe: pigeonSexeSchema,
  race: z.string(),
  statut: pigeonStatutSchema,
});

// List item (lightweight for lists)
export const pigeonListItemSchema = z.object({
  id: z.string().uuid(),
  bague: z.string(),
  sexe: pigeonSexeSchema,
  race: z.string(),
  date_naissance: z.string(), // ISO date
  age_jours: z.number().int(), // Removed .min(0) to allow negative ages (future dates)
  statut: pigeonStatutSchema.optional().default('ACTIF'),
  couleur: z.string(),
  photo_url: z.string(),
});

// Detail (full pigeon with parents)
export const pigeonDetailSchema = z.object({
  id: z.string().uuid(),
  bague: z.string(),
  sexe: pigeonSexeSchema,
  race: z.string(),
  date_naissance: z.string(), // ISO date
  age_jours: z.number().int().optional().default(0), // Removed .min(0) to allow negative ages
  couleur: z.string(),
  poids: z.string().nullable(), // Decimal as string
  photo_url: z.string(),
  statut: pigeonStatutSchema.optional().default('ACTIF'),
  pere: pigeonNestedSchema.nullable().optional().default(null),
  mere: pigeonNestedSchema.nullable().optional().default(null),
  created_at: z.string().optional().default(new Date().toISOString()), // ISO datetime
  updated_at: z.string().optional().default(new Date().toISOString()), // ISO datetime
});

// Genealogy response
export const genealogySchema = z.object({
  pigeon: pigeonNestedSchema,
  pere: pigeonNestedSchema.nullable(),
  mere: pigeonNestedSchema.nullable(),
  descendants: z.array(pigeonNestedSchema),
});

// Create input validation
export const createPigeonInputSchema = z.object({
  bague: z.string().min(1, 'La bague est obligatoire'),
  sexe: pigeonSexeSchema,
  race: z.string().min(1, 'La race est obligatoire'),
  dateNaissance: z.string().optional(), // ISO date
  couleur: z.string().optional(),
  poids: z.number().positive().optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
});

// Update input validation
export const updatePigeonInputSchema = z.object({
  race: z.string().min(1).optional(),
  couleur: z.string().optional(),
  poids: z.number().positive().optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
});

// Vente input validation
export const venteInputSchema = z.object({
  dateSortie: z.string(), // ISO date
  prixVente: z.number().positive('Le prix doit être positif'),
  acheteur: z.string().optional(),
  notes: z.string().optional(),
});

// Décès input validation
export const decesInputSchema = z.object({
  dateSortie: z.string(), // ISO date
  cause: z.string().optional(),
  notes: z.string().optional(),
});

// Perte input validation
export const perteInputSchema = z.object({
  dateSortie: z.string(), // ISO date
  circonstances: z.string().optional(),
  notes: z.string().optional(),
});

// Sortie response (generic)
export const sortieResponseSchema = z.object({
  id: z.string().uuid(),
  type_sortie: z.enum(['VENTE', 'DECES', 'PERTE']),
});
