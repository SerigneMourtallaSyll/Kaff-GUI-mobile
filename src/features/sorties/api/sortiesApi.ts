/**
 * Sorties API — lecture seule (les sorties sont créées via pigeons).
 */
import { apiClient, ENDPOINTS } from '@/api';
import { asISODate, asISODateTime, asUUID } from '@/core/types';

import { sortieSchema } from '../schemas';

import type { Sortie } from '../types';

const toSortie = (raw: any): Sortie => ({
  id: asUUID(raw.id),
  pigeonId: asUUID(raw.pigeon),
  typeSortie: raw.type_sortie,
  dateSortie: asISODate(raw.date_sortie),
  prix: raw.prix ? parseFloat(raw.prix) : null,
  acheteur: raw.acheteur,
  cause: raw.cause,
  circonstance: raw.circonstance,
  createdAt: asISODateTime(raw.created_at),
});

export const sortiesApi = {
  /**
   * List sorties with optional filters.
   */
  async list(params?: {
    type_sortie?: string;
    page?: number;
  }): Promise<{ results: Sortie[]; count: number; next: string | null; previous: string | null }> {
    const { data } = await apiClient.get(ENDPOINTS.sorties.list, { params });

    return {
      results: data.results.map((raw: any) => {
        const parsed = sortieSchema.parse(raw);
        return toSortie(parsed);
      }),
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  /**
   * Get sortie detail by ID.
   */
  async getById(id: string): Promise<Sortie> {
    const { data } = await apiClient.get(ENDPOINTS.sorties.detail(id));
    const parsed = sortieSchema.parse(data);
    return toSortie(parsed);
  },
};
