/**
 * React Query mutation hook for creating a pigeon.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { pigeonsApi } from '../api/pigeonsApi';

import type { CreatePigeonInput } from '../types';

export function useCreatePigeon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePigeonInput) => pigeonsApi.create(input),
    onSuccess: () => {
      // Invalidate pigeons list to refetch
      queryClient.invalidateQueries({ queryKey: ['pigeons', 'list'] });
      // Invalidate dashboard stats (pigeons count changed)
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });
}
