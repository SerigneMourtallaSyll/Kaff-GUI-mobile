/**
 * React Query hook for dashboard statistics.
 */
import { useQuery } from '@tanstack/react-query';

import { dashboardApi } from '../api/dashboardApi';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.getStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
