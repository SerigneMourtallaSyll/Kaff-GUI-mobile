/**
 * React Query mutation hook for declaring a pigeon loss (US-SOR-03).
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { pigeonsApi } from '../api/pigeonsApi';

import type { PerteInput } from '../types';

export function useDeclarerPerte(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PerteInput) => pigeonsApi.declarerPerte(id, input),
    onSuccess: () => {
      // Invalidate pigeon detail (status changed to PERDU)
      queryClient.invalidateQueries({ queryKey: ['pigeons', 'detail', id] });
      // Invalidate pigeons list
      queryClient.invalidateQueries({ queryKey: ['pigeons', 'list'] });
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      // Invalidate sorties list
      queryClient.invalidateQueries({ queryKey: ['sorties', 'list'] });
    },
  });
}
