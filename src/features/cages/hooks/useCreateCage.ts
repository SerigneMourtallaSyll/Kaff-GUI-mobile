/**
 * Hook for creating a cage.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cagesApi } from '../api/cagesApi';

import type { CreateCageInput } from '../types';

export function useCreateCage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCageInput) => cagesApi.createCage(input),
    onSuccess: () => {
      // Invalidate volet to refresh the volière view
      queryClient.invalidateQueries({ queryKey: ['cages', 'volet'] });
    },
  });
}
