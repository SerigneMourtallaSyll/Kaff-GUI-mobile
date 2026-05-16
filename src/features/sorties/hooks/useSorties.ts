/**
 * React Query hook for sorties list.
 */
import { useQuery } from '@tanstack/react-query';

import { sortiesApi } from '../api/sortiesApi';

import type { SortieType } from '../types';

interface UseSortiesParams {
  typeSortie?: SortieType;
  page?: number;
  enabled?: boolean;
}

export function useSorties(params: UseSortiesParams = {}) {
  const { typeSortie, page = 1, enabled = true } = params;

  return useQuery({
    queryKey: ['sorties', 'list', { typeSortie, page }],
    queryFn: () => sortiesApi.list({ type_sortie: typeSortie, page }),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
