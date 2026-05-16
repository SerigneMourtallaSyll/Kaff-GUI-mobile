/**
 * React Query hook for volière view (central feature).
 */
import { useQuery } from '@tanstack/react-query';

import { cagesApi } from '../api/cagesApi';

export function useVolet(enabled = true) {
  return useQuery({
    queryKey: ['cages', 'volet'],
    queryFn: () => cagesApi.getVolet(),
    enabled,
    staleTime: 1000 * 60 * 1, // 1 minute (cage status changes frequently)
  });
}
