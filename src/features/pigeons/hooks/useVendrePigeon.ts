/**
 * React Query mutation hook for selling a pigeon (US-SOR-02).
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { pigeonsApi } from '../api/pigeonsApi';

import type { VenteInput } from '../types';

export function useVendrePigeon(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: VenteInput) => pigeonsApi.vendre(id, input),
    onSuccess: () => {
      // Invalidate pigeon detail (status changed to VENDU)
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
