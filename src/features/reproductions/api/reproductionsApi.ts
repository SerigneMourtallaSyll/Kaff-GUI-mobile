/**
 * Reproductions feature — API layer.
 *
 * Handles HTTP calls, response validation, and snake_case → camelCase transformation.
 */
import { apiClient, ENDPOINTS } from '@/api';
import { asISODate, asISODateTime, asUUID } from '@/core/types';

import {
  pigeonneauxListResponseSchema,
  reproductionListResponseSchema,
  reproductionSchema,
} from '../schemas';

import type {
  CreateReproductionInput,
  PigeonneauData,
  ReproductionData,
  ReproductionListResponse,
  ReproductionQueryParams,
  UpdateReproductionInput,
} from '../types';

/**
 * Transform snake_case reproduction to camelCase.
 */
const toReproductionData = (raw: any): ReproductionData => {
  // Determine status based on date_eclosion and nb_pigeonneaux
  let statut: 'EN_COURS' | 'ECLOS' | 'ECHEC' = 'EN_COURS';
  if (raw.date_eclosion) {
    statut = raw.nb_pigeonneaux > 0 ? 'ECLOS' : 'ECHEC';
  }

  return {
    id: asUUID(raw.id),
    coupleId: asUUID(raw.couple),
    datePonte: asISODate(raw.date_ponte),
    dateEclosion: raw.date_eclosion ? asISODate(raw.date_eclosion) : null,
    nbOeufs: raw.nb_pigeonneaux || 0, // Backend doesn't track eggs separately
    nbPigeonneaux: raw.nb_pigeonneaux || 0,
    statut,
    notes: raw.notes || null,
    createdAt: asISODateTime(raw.created_at),
    updatedAt: asISODateTime(raw.created_at), // Backend doesn't return updated_at
    maleBague: raw.male_bague || null,
    femelleBague: raw.femelle_bague || null,
  };
};

/**
 * Transform snake_case pigeonneau to camelCase.
 */
const toPigeonneauData = (raw: any): PigeonneauData => ({
  id: asUUID(raw.id),
  reproductionId: asUUID(raw.reproduction_id),
  bague: raw.bague,
  sexe: raw.sexe,
  dateNaissance: asISODate(raw.date_naissance),
  statut: raw.statut,
  createdAt: asISODateTime(raw.created_at),
});

/**
 * Fetch paginated list of reproductions.
 */
export async function getReproductions(
  params?: ReproductionQueryParams,
): Promise<ReproductionListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.coupleId) queryParams.append('couple', params.coupleId);
  // Note: Backend doesn't support 'statut' filter, we'll filter client-side
  if (params?.search) queryParams.append('search', params.search);
  if (params?.page) queryParams.append('page', params.page.toString());

  const url = `${ENDPOINTS.reproductions.list}${queryParams.toString() ? `?${queryParams}` : ''}`;
  const { data } = await apiClient.get(url);

  // Validate with Zod
  const validated = reproductionListResponseSchema.parse(data);

  // Transform to camelCase
  let results = validated.results.map(toReproductionData);

  // Client-side filtering by statut
  if (params?.statut) {
    results = results.filter((r) => r.statut === params.statut);
  }

  return {
    count: results.length, // Update count after filtering
    next: validated.next,
    previous: validated.previous,
    results,
  };
}

/**
 * Fetch a single reproduction by ID.
 */
export async function getReproduction(id: string): Promise<ReproductionData> {
  try {
    const { data } = await apiClient.get(ENDPOINTS.reproductions.detail(id));

    // Validate with Zod
    const validated = reproductionSchema.parse(data);

    // Transform to camelCase
    const result = toReproductionData(validated);

    return result;
  } catch (error) {
    console.error('[reproductionsApi] Error fetching reproduction:', error);
    throw error;
  }
}

/**
 * Create a new reproduction.
 */
export async function createReproduction(
  input: CreateReproductionInput,
): Promise<ReproductionData> {
  // Transform to snake_case for API
  // Note: Backend expects 'couple' not 'couple_id', and 'nb_pigeonneaux' not 'nb_oeufs'
  const payload = {
    couple: input.coupleId,
    date_ponte: input.datePonte,
    nb_pigeonneaux: input.nbOeufs, // Backend uses nb_pigeonneaux for initial egg count
    notes: input.notes || '',
  };

  const { data } = await apiClient.post(ENDPOINTS.reproductions.create, payload);

  // Backend returns limited fields, so we need to handle missing fields
  return {
    id: asUUID(data.id),
    coupleId: asUUID(data.couple),
    datePonte: asISODate(data.date_ponte),
    dateEclosion: data.date_eclosion ? asISODate(data.date_eclosion) : null,
    nbOeufs: data.nb_pigeonneaux || 0,
    nbPigeonneaux: data.nb_pigeonneaux || 0,
    statut: 'EN_COURS', // Default status for new reproduction
    notes: data.notes || null,
    createdAt: asISODateTime(data.created_at),
    updatedAt: asISODateTime(data.created_at), // Use created_at as fallback
    maleBague: '', // Not returned by create endpoint
    femelleBague: '', // Not returned by create endpoint
  };
}

/**
 * Update an existing reproduction.
 */
export async function updateReproduction(
  id: string,
  input: UpdateReproductionInput,
): Promise<ReproductionData> {
  // Transform to snake_case for API
  const payload: Record<string, unknown> = {};
  if (input.dateEclosion !== undefined) payload.date_eclosion = input.dateEclosion;
  if (input.nbPigeonneaux !== undefined) payload.nb_pigeonneaux = input.nbPigeonneaux;
  if (input.notes !== undefined) payload.notes = input.notes;
  // Note: Backend doesn't have a 'statut' field, it's calculated from date_eclosion and nb_pigeonneaux

  const { data } = await apiClient.patch(ENDPOINTS.reproductions.detail(id), payload);

  // Validate with Zod
  const validated = reproductionSchema.parse(data);

  // Transform to camelCase
  return toReproductionData(validated);
}

/**
 * Fetch pigeonneaux for a reproduction.
 */
export async function getPigeonneaux(reproductionId: string): Promise<PigeonneauData[]> {
  const { data } = await apiClient.get(ENDPOINTS.reproductions.pigeonneaux(reproductionId));

  // Validate with Zod
  const validated = pigeonneauxListResponseSchema.parse(data);

  // Transform to camelCase
  return validated.map(toPigeonneauData);
}

/**
 * Reproductions API object for easier imports.
 */
export const reproductionsApi = {
  getReproductions,
  getReproduction,
  createReproduction,
  updateReproduction,
  getPigeonneaux,
};
