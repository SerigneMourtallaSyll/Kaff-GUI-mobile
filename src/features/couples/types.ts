/**
 * Couples types.
 */
import type { ISODate, UUID } from '@/core/types';

import type { PigeonNested } from '../pigeons';

export type CoupleStatut = 'ACTIF' | 'DISSOUS';

export interface Couple {
  id: UUID;
  male: PigeonNested;
  femelle: PigeonNested;
  dateFormation: ISODate;
  dateDissolution: ISODate | null;
  statut: CoupleStatut;
  nbReproductions: number;
  createdAt: string; // ISO datetime
}

// Input types
export interface CreateCoupleInput {
  maleId: string;
  femelleId: string;
  dateFormation: string; // ISO date
}

export interface RompreCoupleInput {
  dateDissolution: string; // ISO date
}
