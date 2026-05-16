/**
 * Dashboard API — thin functional wrappers around apiClient.
 *
 * - Validate responses with Zod (defence in depth).
 * - Map snake_case → camelCase at the API boundary.
 */
import { apiClient, ENDPOINTS } from '@/api';
import { asISODate, asUUID } from '@/core/types';

import { dashboardStatsSchema } from '../schemas';

import type { DashboardStats } from '../types';

export const dashboardApi = {
  /**
   * Fetch dashboard statistics (KPIs cross-app).
   */
  async getStats(): Promise<DashboardStats> {
    const { data } = await apiClient.get(ENDPOINTS.dashboard.stats);
    const parsed = dashboardStatsSchema.parse(data);

    return {
      pigeons: {
        actifs: parsed.pigeons.actifs,
        vendus: parsed.pigeons.vendus,
        morts: parsed.pigeons.morts,
        perdus: parsed.pigeons.perdus,
      },
      cages: {
        libres: parsed.cages.libres,
        occupeesPigeon: parsed.cages.occupees_pigeon,
        occupeesCouple: parsed.cages.occupees_couple,
      },
      couplesActifs: parsed.couples_actifs,
      dernieresReproductions: parsed.dernieres_reproductions.map((r) => ({
        id: asUUID(r.id),
        coupleId: asUUID(r.couple_id),
        datePonte: asISODate(r.date_ponte),
        dateEclosion: r.date_eclosion ? asISODate(r.date_eclosion) : null,
        nbPigeonneaux: r.nb_pigeonneaux,
        maleBague: r.male_bague,
        femelleBague: r.femelle_bague,
      })),
    };
  },
};
