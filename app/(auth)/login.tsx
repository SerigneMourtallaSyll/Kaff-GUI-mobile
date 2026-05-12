/**
 * Login screen — US-AUTH-01.
 * Minimal banking-grade implementation:
 *   - react-hook-form + Zod validation.
 *   - Local rate-limiting (5 attempts / 5 min) — mirrors server policy.
 *   - Network/typed errors surfaced inline; no PII in error toasts.
 */
import { useState } from 'react';

import { Text, View } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { Bird, Lock, Mail } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';

import { AUTH } from '@/core/config';
import { AppError } from '@/core/errors';
import { useLogin, loginSchema, type LoginInput } from '@/features/auth';
import { Button, Heading, Input, Screen } from '@/shared/ui';

export default function LoginScreen() {
  const login = useLogin();
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit((values) => {
    if (lockedUntil && Date.now() < lockedUntil) return;

    login.mutate(values, {
      onError: () => {
        const next = attempts + 1;
        setAttempts(next);
        if (next >= AUTH.maxLoginAttempts) {
          setLockedUntil(Date.now() + AUTH.lockoutWindowMs);
        }
      },
      onSuccess: () => {
        setAttempts(0);
        setLockedUntil(null);
      },
    });
  });

  const error = login.error;
  const errorMessage =
    error && AppError.isAppError(error)
      ? error.code === 'UNAUTHORIZED' || error.code === 'VALIDATION_ERROR'
        ? 'Email ou mot de passe incorrect.'
        : error.code === 'NETWORK_ERROR'
          ? 'Connexion impossible. Vérifiez votre réseau.'
          : 'Une erreur est survenue. Réessayez.'
      : undefined;

  const isLocked = Boolean(lockedUntil && Date.now() < lockedUntil);

  return (
    <Screen scroll contentClassName="px-6 pt-12">
      <View className="mb-8 items-center">
        <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-primary">
          <Bird color="#FFFFFF" size={42} />
        </View>
        <Heading level="h1" className="mb-1">
          Kàff GUI
        </Heading>
        <Text className="text-muted-foreground">Gestion de Volière</Text>
      </View>

      <Heading level="h2" className="mb-6">
        Connexion
      </Heading>

      <View className="gap-4">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              label="Email"
              placeholder="baay.pitaq@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              leadingIcon={<Mail size={20} color="#717182" />}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              label="Mot de passe"
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              leadingIcon={<Lock size={20} color="#717182" />}
            />
          )}
        />

        {errorMessage ? (
          <Text className="text-sm text-danger" accessibilityLiveRegion="polite">
            {errorMessage}
          </Text>
        ) : null}

        {isLocked ? (
          <Text className="text-sm text-warning">
            Trop de tentatives. Réessayez dans quelques minutes.
          </Text>
        ) : null}

        <Button onPress={onSubmit} loading={login.isPending} disabled={isLocked}>
          Se connecter
        </Button>
      </View>

      <View className="mt-6 items-center">
        <Text className="text-xs text-muted-foreground">
          Baay Pitàq Colombophile Management System v1.0.0
        </Text>
      </View>
    </Screen>
  );
}
