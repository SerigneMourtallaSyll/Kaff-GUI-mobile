/**
 * React Query hook for couples list.
 */
import { useQuery } from '@tanstack/react-query';

import { couplesApi } from '../api/couplesApi';

import type { CoupleStatut } from '../types';

interface UseCouplesParams {
  statut?: CoupleStatut;
  page?: number;
  enabled?: boolean;
}

export function useCouples(params: UseCouplesParams = {}) {
  const { statut, page = 1, enabled = true } = params;

  return useQuery({
    queryKey: ['couples', 'list', { statut, page }],
    queryFn: () => couplesApi.list({ statut, page }),
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
