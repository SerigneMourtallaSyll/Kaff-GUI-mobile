/**
 * Hook for updating a reproduction.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { reproductionsApi } from '../api';

import type { UpdateReproductionInput } from '../types';

export function useUpdateReproduction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateReproductionInput }) =>
      reproductionsApi.updateReproduction(id, input),
    onSuccess: (_, variables) => {
      // Invalidate the specific reproduction
      queryClient.invalidateQueries({ queryKey: ['reproductions', 'detail', variables.id] });
      // Invalidate the list
      queryClient.invalidateQueries({ queryKey: ['reproductions', 'list'] });
      // Invalidate dashboard as stats may have changed
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
