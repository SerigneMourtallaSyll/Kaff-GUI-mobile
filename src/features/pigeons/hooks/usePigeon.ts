/**
 * React Query hook for single pigeon detail.
 */
import { useQuery } from '@tanstack/react-query';

import { pigeonsApi } from '../api/pigeonsApi';

export function usePigeon(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['pigeons', 'detail', id],
    queryFn: () => pigeonsApi.getById(id!),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
