/**
 * React Query hook for single couple detail.
 */
import { useQuery } from '@tanstack/react-query';

import { couplesApi } from '../api/couplesApi';

export function useCouple(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['couples', 'detail', id],
    queryFn: () => couplesApi.getById(id!),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
