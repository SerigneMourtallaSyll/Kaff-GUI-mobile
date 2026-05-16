/**
 * React Query hook for single sortie detail.
 */
import { useQuery } from '@tanstack/react-query';

import { sortiesApi } from '../api/sortiesApi';

export function useSortie(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['sorties', 'detail', id],
    queryFn: () => sortiesApi.getById(id!),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes (sorties are immutable)
  });
}
