/**
 * Pigeons API — thin functional wrappers around apiClient.
 *
 * - Validate responses with Zod (defence in depth).
 * - Map snake_case → camelCase at the API boundary.
 */
import { apiClient, ENDPOINTS } from '@/api';
import { asISODate, asISODateTime, asUUID } from '@/core/types';

import {
  genealogySchema,
  pigeonDetailSchema,
  pigeonListItemSchema,
  sortieResponseSchema,
} from '../schemas';

import type {
  CreatePigeonInput,
  DecesInput,
  Genealogy,
  PerteInput,
  PigeonDetail,
  PigeonListItem,
  PigeonNested,
  UpdatePigeonInput,
  VenteInput,
} from '../types';

const toPigeonNested = (raw: any): PigeonNested => ({
  id: asUUID(raw.id),
  bague: raw.bague,
  sexe: raw.sexe,
  race: raw.race,
  statut: raw.statut,
});

const toPigeonListItem = (raw: any): PigeonListItem => ({
  id: asUUID(raw.id),
  bague: raw.bague,
  sexe: raw.sexe,
  race: raw.race,
  dateNaissance: asISODate(raw.date_naissance),
  ageJours: raw.age_jours,
  statut: raw.statut,
  couleur: raw.couleur,
  photoUrl: raw.photo_url,
});

const toPigeonDetail = (raw: any): PigeonDetail => ({
  id: asUUID(raw.id),
  bague: raw.bague,
  sexe: raw.sexe,
  race: raw.race,
  dateNaissance: asISODate(raw.date_naissance),
  ageJours: raw.age_jours,
  couleur: raw.couleur,
  poids: raw.poids ? parseFloat(raw.poids) : null,
  photoUrl: raw.photo_url,
  statut: raw.statut,
  pere: raw.pere ? toPigeonNested(raw.pere) : null,
  mere: raw.mere ? toPigeonNested(raw.mere) : null,
  createdAt: asISODateTime(raw.created_at),
  updatedAt: asISODateTime(raw.updated_at),
});

export const pigeonsApi = {
  /**
   * List pigeons with optional filters and pagination.
   */
  async list(params?: {
    search?: string;
    sexe?: string;
    statut?: string;
    page?: number;
  }): Promise<{
    results: PigeonListItem[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    const { data } = await apiClient.get(ENDPOINTS.pigeons.list, { params });

    // DRF pagination response
    return {
      results: data.results.map((raw: any) => {
        const parsed = pigeonListItemSchema.parse(raw);
        return toPigeonListItem(parsed);
      }),
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  /**
   * Get pigeon detail by ID.
   */
  async getById(id: string): Promise<PigeonDetail> {
    const { data } = await apiClient.get(ENDPOINTS.pigeons.detail(id));
    const parsed = pigeonDetailSchema.parse(data);
    return toPigeonDetail(parsed);
  },

  /**
   * Create a new pigeon.
   */
  async create(input: CreatePigeonInput): Promise<PigeonDetail> {
    const payload: Record<string, any> = {
      bague: input.bague,
      sexe: input.sexe,
      race: input.race,
      date_naissance: input.dateNaissance,
      couleur: input.couleur || '',
      photo_url: input.photoUrl || '',
    };

    // Only add poids if it's defined
    if (input.poids !== undefined && input.poids !== null) {
      payload.poids = input.poids.toString();
    }

    const { data } = await apiClient.post(ENDPOINTS.pigeons.create, payload);
    const parsed = pigeonDetailSchema.parse(data);
    return toPigeonDetail(parsed);
  },

  /**
   * Update an existing pigeon (ACTIF only).
   */
  async update(id: string, input: UpdatePigeonInput): Promise<PigeonDetail> {
    const payload: any = {};
    if (input.race !== undefined) payload.race = input.race;
    if (input.couleur !== undefined) payload.couleur = input.couleur;
    if (input.poids !== undefined) payload.poids = input.poids?.toString();
    if (input.photoUrl !== undefined) payload.photo_url = input.photoUrl;

    const { data } = await apiClient.patch(ENDPOINTS.pigeons.update(id), payload);
    const parsed = pigeonDetailSchema.parse(data);
    return toPigeonDetail(parsed);
  },

  /**
   * Get genealogy tree (parents + descendants).
   */
  async getGenealogy(id: string): Promise<Genealogy> {
    const { data } = await apiClient.get(ENDPOINTS.pigeons.genealogy(id));
    const parsed = genealogySchema.parse(data);

    return {
      pigeon: toPigeonNested(parsed.pigeon),
      pere: parsed.pere ? toPigeonNested(parsed.pere) : null,
      mere: parsed.mere ? toPigeonNested(parsed.mere) : null,
      descendants: parsed.descendants.map(toPigeonNested),
    };
  },

  /**
   * Vendre un pigeon (US-SOR-02).
   */
  async vendre(id: string, input: VenteInput): Promise<{ id: string; typeSortie: string }> {
    const payload = {
      date_sortie: input.dateSortie,
      prix: input.prixVente, // Backend expects 'prix' not 'prix_vente'
      acheteur: input.acheteur,
    };

    const { data } = await apiClient.post(ENDPOINTS.pigeons.vendre(id), payload);
    const parsed = sortieResponseSchema.parse(data);

    return {
      id: asUUID(parsed.id),
      typeSortie: parsed.type_sortie,
    };
  },

  /**
   * Déclarer un décès (US-SOR-03).
   */
  async declarerDeces(id: string, input: DecesInput): Promise<{ id: string; typeSortie: string }> {
    const payload = {
      date_sortie: input.dateSortie,
      cause: input.cause || '',
    };

    const { data } = await apiClient.post(ENDPOINTS.pigeons.declarerDeces(id), payload);
    const parsed = sortieResponseSchema.parse(data);

    return {
      id: asUUID(parsed.id),
      typeSortie: parsed.type_sortie,
    };
  },

  /**
   * Déclarer une perte (US-SOR-03).
   */
  async declarerPerte(id: string, input: PerteInput): Promise<{ id: string; typeSortie: string }> {
    const payload = {
      date_sortie: input.dateSortie,
      circonstance: input.circonstances || '', // Backend expects 'circonstance' (singular)
    };

    const { data } = await apiClient.post(ENDPOINTS.pigeons.declarerPerte(id), payload);
    const parsed = sortieResponseSchema.parse(data);

    return {
      id: asUUID(parsed.id),
      typeSortie: parsed.type_sortie,
    };
  },
};
