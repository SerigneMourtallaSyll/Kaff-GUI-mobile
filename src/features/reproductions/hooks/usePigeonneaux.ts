/**
 * Hook: usePigeonneaux
 *
 * Fetches pigeonneaux for a specific reproduction.
 */
import { useQuery } from '@tanstack/react-query';

import { getPigeonneaux } from '../api/reproductionsApi';

export function usePigeonneaux(reproductionId: string) {
  return useQuery({
    queryKey: ['reproductions', reproductionId, 'pigeonneaux'],
    queryFn: () => getPigeonneaux(reproductionId),
    enabled: !!reproductionId,
  });
}
