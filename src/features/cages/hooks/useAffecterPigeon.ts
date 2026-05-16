/**
 * Hook for assigning a pigeon to a cage.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cagesApi } from '../api/cagesApi';

import type { AffecterPigeonInput } from '../types';

export function useAffecterPigeon(cageId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AffecterPigeonInput) => cagesApi.affecterPigeon(cageId, input),
    onSuccess: () => {
      // Invalidate volet to refresh the volière view
      queryClient.invalidateQueries({ queryKey: ['cages', 'volet'] });
      // Also invalidate pigeons list as the pigeon status may have changed
      queryClient.invalidateQueries({ queryKey: ['pigeons'] });
    },
  });
}
