/**
 * Reproductions feature — TypeScript types.
 */

/**
 * Reproduction entity from API.
 */
export interface Reproduction {
  id: string;
  couple_id: string;
  date_ponte: string;
  date_eclosion: string | null;
  nb_oeufs: number;
  nb_pigeonneaux: number;
  statut: ReproductionStatut;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Nested data
  male_bague: string;
  femelle_bague: string;
}

/**
 * Camel-case version for app consumption.
 */
export interface ReproductionData {
  id: string;
  coupleId: string;
  datePonte: string;
  dateEclosion: string | null;
  nbOeufs: number;
  nbPigeonneaux: number;
  statut: ReproductionStatut;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  maleBague: string | null;
  femelleBague: string | null;
}

/**
 * Pigeonneau entity from API.
 */
export interface Pigeonneau {
  id: string;
  reproduction_id: string;
  bague: string;
  sexe: 'MALE' | 'FEMALE';
  date_naissance: string;
  statut: 'ACTIF' | 'VENDU' | 'MORT' | 'PERDU';
  created_at: string;
}

/**
 * Camel-case version for app consumption.
 */
export interface PigeonneauData {
  id: string;
  reproductionId: string;
  bague: string;
  sexe: 'MALE' | 'FEMALE';
  dateNaissance: string;
  statut: 'ACTIF' | 'VENDU' | 'MORT' | 'PERDU';
  createdAt: string;
}

/**
 * Reproduction status.
 */
export type ReproductionStatut = 'EN_COURS' | 'ECLOS' | 'ECHEC';

/**
 * Paginated list response.
 */
export interface ReproductionListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ReproductionData[];
}

/**
 * Input for creating a reproduction.
 */
export interface CreateReproductionInput {
  coupleId: string;
  datePonte: string;
  nbOeufs: number;
  notes?: string;
}

/**
 * Input for updating a reproduction.
 */
export interface UpdateReproductionInput {
  dateEclosion?: string;
  nbPigeonneaux?: number;
  statut?: ReproductionStatut;
  notes?: string;
}

/**
 * Query params for listing reproductions.
 */
export interface ReproductionQueryParams {
  coupleId?: string;
  statut?: ReproductionStatut;
  search?: string;
  page?: number;
}
