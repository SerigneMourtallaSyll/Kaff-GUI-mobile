/**
 * Cages API - Complete CRUD + occupation actions.
 */
import { apiClient, ENDPOINTS } from '@/api';
import { asUUID } from '@/core/types';

import { cageCreateResponseSchema, cageSchema, voletCageSchema } from '../schemas';

import type {
  AffecterCoupleInput,
  AffecterPigeonInput,
  CageData,
  CreateCageInput,
  UpdateCageInput,
  VoletCage,
} from '../types';

export const cagesApi = {
  /**
   * Get volière view (all cages with current occupation).
   * This is the central feature of the app.
   */
  async getVolet(): Promise<VoletCage[]> {
    const { data } = await apiClient.get(ENDPOINTS.cages.volet);

    return data.map((raw: any) => {
      const parsed = voletCageSchema.parse(raw);
      return {
        id: asUUID(parsed.id),
        numero: parsed.numero,
        nom: parsed.nom,
        statutOccupation: parsed.statut_occupation,
        color: parsed.color,
        pigeon: parsed.pigeon
          ? {
              id: asUUID(parsed.pigeon.id),
              bague: parsed.pigeon.bague,
              sexe: parsed.pigeon.sexe,
              race: parsed.pigeon.race,
            }
          : null,
        couple: parsed.couple
          ? {
              id: asUUID(parsed.couple.id),
              maleBague: parsed.couple.male_bague,
              femelleBague: parsed.couple.femelle_bague,
            }
          : null,
      };
    });
  },

  /**
   * Get a single cage by ID.
   */
  async getCage(id: string): Promise<CageData> {
    const { data } = await apiClient.get(ENDPOINTS.cages.detail(id));
    const parsed = cageSchema.parse(data);

    return {
      id: asUUID(parsed.id),
      numero: parsed.numero,
      nom: parsed.nom,
      superficie: parsed.superficie,
      description: parsed.description,
      statutOccupation: parsed.statut_occupation,
      createdAt: parsed.created_at,
      updatedAt: parsed.updated_at,
    };
  },

  /**
   * Create a new cage.
   */
  async createCage(input: CreateCageInput): Promise<CageData> {
    const payload = {
      numero: input.numero,
      nom: input.nom,
      superficie: input.superficie?.toString(),
      description: input.description,
    };

    const { data } = await apiClient.post(ENDPOINTS.cages.list, payload);
    const parsed = cageCreateResponseSchema.parse(data);

    return {
      id: asUUID(parsed.id),
      numero: parsed.numero,
      nom: parsed.nom,
      superficie: parsed.superficie,
      description: parsed.description,
      // Default values for fields not returned by create endpoint
      statutOccupation: 'LIBRE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  /**
   * Update a cage.
   */
  async updateCage(id: string, input: UpdateCageInput): Promise<CageData> {
    const payload: any = {};
    if (input.nom !== undefined) payload.nom = input.nom;
    if (input.superficie !== undefined) payload.superficie = input.superficie.toString();
    if (input.description !== undefined) payload.description = input.description;

    const { data } = await apiClient.patch(ENDPOINTS.cages.detail(id), payload);
    const parsed = cageSchema.parse(data);

    return {
      id: asUUID(parsed.id),
      numero: parsed.numero,
      nom: parsed.nom,
      superficie: parsed.superficie,
      description: parsed.description,
      statutOccupation: parsed.statut_occupation,
      createdAt: parsed.created_at,
      updatedAt: parsed.updated_at,
    };
  },

  /**
   * Delete a cage (only if libre).
   */
  async deleteCage(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.cages.detail(id));
  },

  /**
   * Assign a pigeon to a cage.
   */
  async affecterPigeon(cageId: string, input: AffecterPigeonInput): Promise<void> {
    await apiClient.post(ENDPOINTS.cages.affecterPigeon(cageId), {
      pigeon_id: input.pigeonId,
    });
  },

  /**
   * Assign a couple to a cage.
   */
  async affecterCouple(cageId: string, input: AffecterCoupleInput): Promise<void> {
    await apiClient.post(ENDPOINTS.cages.affecterCouple(cageId), {
      couple_id: input.coupleId,
    });
  },

  /**
   * Free a cage (remove current occupation).
   */
  async libererCage(cageId: string): Promise<void> {
    await apiClient.post(ENDPOINTS.cages.liberer(cageId));
  },
};
