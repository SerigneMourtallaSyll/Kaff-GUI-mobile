/**
 * Hook: useCreateReproduction
 *
 * Creates a new reproduction and invalidates relevant queries.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createReproduction } from '../api/reproductionsApi';

import type { CreateReproductionInput } from '../types';

export function useCreateReproduction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReproductionInput) => createReproduction(input),
    onSuccess: () => {
      // Invalidate reproductions list
      queryClient.invalidateQueries({ queryKey: ['reproductions'] });
      // Invalidate dashboard stats (dernières reproductions)
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });
}
