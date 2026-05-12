import { useMutation } from '@tanstack/react-query';

import { authApi } from '../api';

import type { RegisterInput } from '../schemas';

export const useRegister = () =>
  useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    retry: false,
  });
