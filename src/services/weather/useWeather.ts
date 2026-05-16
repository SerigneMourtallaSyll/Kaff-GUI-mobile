/**
 * React Query hook for weather data
 */
import { useQuery } from '@tanstack/react-query';

import { getWeather, type WeatherData } from './weatherService';

import type { UseQueryResult } from '@tanstack/react-query';

export function useWeather(): UseQueryResult<WeatherData, Error> {
  return useQuery({
    queryKey: ['weather'],
    queryFn: getWeather,
    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });
}
