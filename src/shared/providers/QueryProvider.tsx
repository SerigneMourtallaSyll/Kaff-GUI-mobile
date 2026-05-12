import { useState, type ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { QUERY } from '@/core/config';
import { AppError } from '@/core/errors';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: QUERY.staleTime,
            gcTime: QUERY.gcTime,
            retry: (failureCount, error) => {
              // Never retry auth / validation errors.
              if (AppError.isAppError(error)) {
                if (
                  error.code === 'UNAUTHORIZED' ||
                  error.code === 'FORBIDDEN' ||
                  error.code === 'VALIDATION_ERROR' ||
                  error.code === 'NOT_FOUND'
                ) {
                  return false;
                }
              }
              return failureCount < QUERY.retries;
            },
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
