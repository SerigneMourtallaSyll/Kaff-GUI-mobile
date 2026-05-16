/**
 * React Query mutation hook for creating a couple.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { couplesApi } from '../api/couplesApi';

import type { CreateCoupleInput } from '../types';

export function useFormerCouple() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCoupleInput) => couplesApi.create(input),
    onSuccess: () => {
      // Invalidate couples list
      queryClient.invalidateQueries({ queryKey: ['couples', 'list'] });
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });
}
