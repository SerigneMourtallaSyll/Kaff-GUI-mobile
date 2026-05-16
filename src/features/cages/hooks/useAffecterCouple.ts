/**
 * Hook for assigning a couple to a cage.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cagesApi } from '../api/cagesApi';

import type { AffecterCoupleInput } from '../types';

export function useAffecterCouple(cageId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AffecterCoupleInput) => cagesApi.affecterCouple(cageId, input),
    onSuccess: () => {
      // Invalidate volet to refresh the volière view
      queryClient.invalidateQueries({ queryKey: ['cages', 'volet'] });
      // Also invalidate couples list as the couple status may have changed
      queryClient.invalidateQueries({ queryKey: ['couples'] });
    },
  });
}
