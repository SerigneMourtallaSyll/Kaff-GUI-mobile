/**
 * Pigeons types.
 */
import type { ISODate, UUID } from '@/core/types';

export type PigeonSexe = 'MALE' | 'FEMALE';
export type PigeonStatut = 'ACTIF' | 'VENDU' | 'MORT' | 'PERDU';

export interface Pigeon {
  id: UUID;
  bague: string;
  sexe: PigeonSexe;
  race: string;
  dateNaissance: ISODate | null;
  statut: PigeonStatut;
  pereId: UUID | null;
  mereId: UUID | null;
  notes: string;
  createdAt: string; // ISO datetime
}

export interface PigeonListItem {
  id: UUID;
  bague: string;
  sexe: PigeonSexe;
  race: string;
  dateNaissance: ISODate;
  ageJours: number;
  statut: PigeonStatut;
  couleur: string;
  photoUrl: string;
}

export interface PigeonDetail {
  id: UUID;
  bague: string;
  sexe: PigeonSexe;
  race: string;
  dateNaissance: ISODate;
  ageJours: number;
  couleur: string;
  poids: number | null;
  photoUrl: string;
  statut: PigeonStatut;
  pere: PigeonNested | null;
  mere: PigeonNested | null;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface PigeonNested {
  id: UUID;
  bague: string;
  sexe: PigeonSexe;
  race: string;
  statut: PigeonStatut;
}

export interface Genealogy {
  pigeon: PigeonNested;
  pere: PigeonNested | null;
  mere: PigeonNested | null;
  descendants: PigeonNested[];
}

// Input types
export interface CreatePigeonInput {
  bague: string;
  sexe: PigeonSexe;
  race: string;
  dateNaissance?: string; // ISO date
  couleur?: string;
  poids?: number;
  photoUrl?: string;
}

export interface UpdatePigeonInput {
  race?: string;
  couleur?: string;
  poids?: number;
  photoUrl?: string;
}

export interface VenteInput {
  dateSortie: string; // ISO date
  prixVente: number;
  acheteur?: string;
  notes?: string;
}

export interface DecesInput {
  dateSortie: string; // ISO date
  cause?: string;
  notes?: string;
}

export interface PerteInput {
  dateSortie: string; // ISO date
  circonstances?: string;
  notes?: string;
}
