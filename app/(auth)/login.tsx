/**
 * Login screen — US-AUTH-01.
 * Banking-grade implementation:
 *   - react-hook-form + Zod validation.
 *   - Client-side rate-limiting (5 attempts / 5 min) — mirrors server policy.
 *   - Typed errors surfaced inline; no PII in error toasts.
 *
 * Visuals match the Figma prototype 1:1 (gradient surface, logo halo,
 * card with form, version footer).
 */
import { useState } from 'react';

import { Pressable, Text, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { zodResolver } from '@hookform/resolvers/zod';
import { Bird, Lock, Mail } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';

import { AUTH } from '@/core/config';
import { AppError } from '@/core/errors';
import { FONT_FAMILY } from '@/core/theme';
import { useLogin, loginSchema, type LoginInput } from '@/features/auth';
import { Button, Input, Screen } from '@/shared/ui';

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
    <LinearGradient
      colors={['#E8E8EE', '#FFFFFF', '#F5F5F8']}
      locations={[0, 0.55, 1]}
      style={{ flex: 1 }}
    >
      <Screen
        scroll
        className="bg-transparent"
        contentClassName="px-6 pt-16 pb-10"
        edges={['top', 'bottom']}
      >
        <View className="mb-8 items-center">
          <View
            className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-primary"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Bird color="#FFFFFF" size={42} />
          </View>
          <Text style={{ fontFamily: FONT_FAMILY.bold }} className="mb-1 text-3xl text-primary">
            Kàff GUI
          </Text>
          <Text style={{ fontFamily: FONT_FAMILY.regular }} className="text-muted-foreground">
            Gestion de Volière
          </Text>
        </View>

        <View
          className="rounded-2xl border border-border bg-white p-6"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 18,
            elevation: 4,
          }}
        >
          <Text
            style={{ fontFamily: FONT_FAMILY.semibold }}
            className="mb-6 text-xl text-foreground"
          >
            Connexion
          </Text>

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
              <Text
                style={{ fontFamily: FONT_FAMILY.regular }}
                className="text-sm text-danger"
                accessibilityLiveRegion="polite"
              >
                {errorMessage}
              </Text>
            ) : null}

            {isLocked ? (
              <Text style={{ fontFamily: FONT_FAMILY.regular }} className="text-sm text-warning">
                Trop de tentatives. Réessayez dans quelques minutes.
              </Text>
            ) : null}

            <Button onPress={onSubmit} loading={login.isPending} disabled={isLocked}>
              Se connecter
            </Button>
          </View>

          <View className="mt-6 items-center">
            <Pressable onPress={() => router.push('/register')} hitSlop={8}>
              <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-sm text-primary">
                Créer un compte
              </Text>
            </Pressable>
          </View>
        </View>

        <Text
          style={{ fontFamily: FONT_FAMILY.regular }}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          Baay Pitàq Colombophile Management System v1.0.0
        </Text>
      </Screen>
    </LinearGradient>
  );
}
