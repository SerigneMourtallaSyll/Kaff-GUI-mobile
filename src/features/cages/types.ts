/**
 * Cages types.
 */
import type { UUID } from '@/core/types';

export type CageStatut = 'LIBRE' | 'OCCUPE_PIGEON' | 'OCCUPE_COUPLE';

/**
 * Cage entity from API (snake_case).
 */
export interface Cage {
  id: UUID;
  numero: string;
  nom: string;
  superficie: string | null;
  description: string | null;
  statut_occupation: CageStatut;
  created_at: string;
  updated_at: string;
}

/**
 * Camel-case version for app consumption.
 */
export interface CageData {
  id: UUID;
  numero: string;
  nom: string;
  superficie: string | null;
  description: string | null;
  statutOccupation: CageStatut;
  createdAt: string;
  updatedAt: string;
}

/**
 * Volière view - cage with current occupation.
 */
export interface VoletCage {
  id: UUID;
  numero: string;
  nom: string;
  statutOccupation: CageStatut;
  color: string;
  pigeon: {
    id: UUID;
    bague: string;
    sexe: string;
    race: string;
  } | null;
  couple: {
    id: UUID;
    maleBague: string;
    femelleBague: string;
  } | null;
}

/**
 * Input for creating a cage.
 */
export interface CreateCageInput {
  numero: string;
  nom: string;
  superficie?: number;
  description?: string;
}

/**
 * Input for updating a cage.
 */
export interface UpdateCageInput {
  nom?: string;
  superficie?: number;
  description?: string;
}

/**
 * Input for assigning a pigeon to a cage.
 */
export interface AffecterPigeonInput {
  pigeonId: string;
}

/**
 * Input for assigning a couple to a cage.
 */
export interface AffecterCoupleInput {
  coupleId: string;
}
