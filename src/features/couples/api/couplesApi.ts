/**
 * Couples API.
 */
import { apiClient, ENDPOINTS } from '@/api';
import { asISODate, asISODateTime, asUUID } from '@/core/types';

import { coupleSchema } from '../schemas';

import type { Couple, CreateCoupleInput, RompreCoupleInput } from '../types';

const toCouple = (raw: any): Couple => ({
  id: asUUID(raw.id),
  male: {
    id: asUUID(raw.male.id),
    bague: raw.male.bague,
    sexe: raw.male.sexe,
    race: raw.male.race,
    statut: raw.male.statut,
  },
  femelle: {
    id: asUUID(raw.femelle.id),
    bague: raw.femelle.bague,
    sexe: raw.femelle.sexe,
    race: raw.femelle.race,
    statut: raw.femelle.statut,
  },
  dateFormation: asISODate(raw.date_formation),
  dateDissolution: raw.date_dissolution ? asISODate(raw.date_dissolution) : null,
  statut: raw.statut,
  nbReproductions: raw.nb_reproductions,
  createdAt: asISODateTime(raw.created_at),
});

export const couplesApi = {
  /**
   * List couples with optional filters.
   */
  async list(params?: {
    statut?: string;
    page?: number;
  }): Promise<{ results: Couple[]; count: number; next: string | null; previous: string | null }> {
    const { data } = await apiClient.get(ENDPOINTS.couples.list, { params });

    return {
      results: data.results.map((raw: any) => {
        const parsed = coupleSchema.parse(raw);
        return toCouple(parsed);
      }),
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  /**
   * Get couple detail by ID.
   */
  async getById(id: string): Promise<Couple> {
    const { data } = await apiClient.get(ENDPOINTS.couples.detail(id));
    const parsed = coupleSchema.parse(data);
    return toCouple(parsed);
  },

  /**
   * Create a new couple (former un couple).
   */
  async create(input: CreateCoupleInput): Promise<Couple> {
    const payload = {
      male_id: input.maleId,
      femelle_id: input.femelleId,
      date_formation: input.dateFormation,
    };

    const { data } = await apiClient.post(ENDPOINTS.couples.create, payload);
    const parsed = coupleSchema.parse(data);
    return toCouple(parsed);
  },

  /**
   * Rompre un couple (dissolve).
   */
  async rompre(id: string, input: RompreCoupleInput): Promise<Couple> {
    const payload = {
      date_dissolution: input.dateDissolution,
    };

    const { data } = await apiClient.post(ENDPOINTS.couples.rompre(id), payload);
    const parsed = coupleSchema.parse(data);
    return toCouple(parsed);
  },
};
