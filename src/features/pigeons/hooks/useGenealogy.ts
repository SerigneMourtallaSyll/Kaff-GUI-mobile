/**
 * React Query hook for pigeon genealogy tree.
 */
import { useQuery } from '@tanstack/react-query';

import { pigeonsApi } from '../api/pigeonsApi';

export function useGenealogy(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['pigeons', 'genealogy', id],
    queryFn: () => pigeonsApi.getGenealogy(id!),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes (genealogy doesn't change often)
  });
}
