/**
 * Sorties types (lecture seule).
 */
import type { ISODate, UUID } from '@/core/types';

export type SortieType = 'VENTE' | 'DECES' | 'PERTE';

export interface Sortie {
  id: UUID;
  pigeonId: UUID;
  typeSortie: SortieType;
  dateSortie: ISODate;
  prix: number | null;
  acheteur: string;
  cause: string;
  circonstance: string;
  createdAt: string; // ISO datetime
}
