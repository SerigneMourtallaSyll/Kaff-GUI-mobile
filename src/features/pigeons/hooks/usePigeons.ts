/**
 * React Query hook for pigeons list with filters.
 */
import { useQuery } from '@tanstack/react-query';

import { pigeonsApi } from '../api/pigeonsApi';

import type { PigeonSexe, PigeonStatut } from '../types';

interface UsePigeonsParams {
  search?: string;
  sexe?: PigeonSexe;
  statut?: PigeonStatut;
  page?: number;
  enabled?: boolean;
}

export function usePigeons(params: UsePigeonsParams = {}) {
  const { search, sexe, statut, page = 1, enabled = true } = params;

  return useQuery({
    queryKey: ['pigeons', 'list', { search, sexe, statut, page }],
    queryFn: async () => {
      try {
        const result = await pigeonsApi.list({ search, sexe, statut, page });
        return result;
      } catch (error) {
        console.error('[usePigeons] Error:', error);
        throw error;
      }
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
