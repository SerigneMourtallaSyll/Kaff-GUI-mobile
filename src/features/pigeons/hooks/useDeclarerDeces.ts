/**
 * React Query mutation hook for declaring a pigeon death (US-SOR-03).
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { pigeonsApi } from '../api/pigeonsApi';

import type { DecesInput } from '../types';

export function useDeclarerDeces(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DecesInput) => pigeonsApi.declarerDeces(id, input),
    onSuccess: () => {
      // Invalidate pigeon detail (status changed to MORT)
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
