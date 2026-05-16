/**
 * Hook for freeing a cage (removing current occupation).
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cagesApi } from '../api/cagesApi';

export function useLibererCage(cageId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cagesApi.libererCage(cageId),
    onSuccess: () => {
      // Invalidate volet to refresh the volière view
      queryClient.invalidateQueries({ queryKey: ['cages', 'volet'] });
      // Also invalidate pigeons and couples as their status may have changed
      queryClient.invalidateQueries({ queryKey: ['pigeons'] });
      queryClient.invalidateQueries({ queryKey: ['couples'] });
    },
  });
}
