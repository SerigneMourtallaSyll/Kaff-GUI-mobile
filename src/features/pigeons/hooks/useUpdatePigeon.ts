/**
 * React Query mutation hook for updating a pigeon.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { pigeonsApi } from '../api/pigeonsApi';

import type { PigeonDetail, UpdatePigeonInput } from '../types';

export function useUpdatePigeon(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdatePigeonInput) => pigeonsApi.update(id, input),
    onSuccess: (updatedPigeon: PigeonDetail) => {
      // Update the detail cache
      queryClient.setQueryData(['pigeons', 'detail', id], updatedPigeon);
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: ['pigeons', 'list'] });
    },
  });
}
