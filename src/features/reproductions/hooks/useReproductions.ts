/**
 * Hook: useReproductions
 *
 * Fetches paginated list of reproductions with optional filters.
 */
import { useQuery } from '@tanstack/react-query';

import { getReproductions } from '../api/reproductionsApi';

import type { ReproductionQueryParams } from '../types';

export function useReproductions(params?: ReproductionQueryParams) {
  return useQuery({
    queryKey: ['reproductions', params],
    queryFn: () => getReproductions(params),
  });
}
