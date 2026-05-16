/**
 * React Query mutation hook for dissolving a couple.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { couplesApi } from '../api/couplesApi';

import type { RompreCoupleInput } from '../types';

export function useRompreCouple(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RompreCoupleInput) => couplesApi.rompre(id, input),
    onSuccess: (updatedCouple) => {
      // Update detail cache
      queryClient.setQueryData(['couples', 'detail', id], updatedCouple);
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: ['couples', 'list'] });
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });
}
