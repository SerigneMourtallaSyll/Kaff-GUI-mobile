/**
 * Hook for fetching a single reproduction by ID.
 */
import { useQuery } from '@tanstack/react-query';

import { reproductionsApi } from '../api';

export function useReproduction(id: string | undefined) {
  return useQuery({
    queryKey: ['reproductions', 'detail', id],
    queryFn: () => reproductionsApi.getReproduction(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
