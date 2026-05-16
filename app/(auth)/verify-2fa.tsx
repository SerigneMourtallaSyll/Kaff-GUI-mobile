/**
 * 2FA Verification screen — US-AUTH-01 (step 2).
 *
 * Receives challenge token from login/register and prompts for TOTP code.
 * Banking-grade implementation:
 *   - 6-digit code validation
 *   - Clear error messaging
 *   - Auto-focus on mount
 */
import { useEffect, useRef } from 'react';

import { Text, TextInput, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';

import { zodResolver } from '@hookform/resolvers/zod';
import { Bird, Shield } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';

import { AppError } from '@/core/errors';
import { FONT_FAMILY } from '@/core/theme';
import { useVerify2FA, totpCodeSchema, type TOTPCodeInput } from '@/features/auth';
import { Button, Input, Screen, TopLoadingBar } from '@/shared/ui';

export default function Verify2FAScreen() {
  const params = useLocalSearchParams<{ challengeToken: string; email?: string }>();
  const verify2FA = useVerify2FA();
  const codeInputRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TOTPCodeInput>({
    resolver: zodResolver(totpCodeSchema),
    defaultValues: { code: '' },
  });

  useEffect(() => {
    // Auto-focus on mount
    setTimeout(() => codeInputRef.current?.focus(), 300);
  }, []);

  const onSubmit = handleSubmit((values) => {
    if (!params.challengeToken) {
      router.replace('/login');
      return;
    }

    verify2FA.mutate(
      {
        challengeToken: params.challengeToken,
        code: values.code,
        isRegistration: false,
      },
      {
        onSuccess: () => {
          // Navigation handled by auth store
        },
      },
    );
  });

  const error = verify2FA.error;
  const errorMessage =
    error && AppError.isAppError(error)
      ? error.code === 'UNAUTHORIZED' || error.code === 'VALIDATION_ERROR'
        ? 'Code invalide. Vérifiez votre application Authenticator.'
        : error.code === 'NETWORK_ERROR'
          ? 'Connexion impossible. Vérifiez votre réseau.'
          : 'Une erreur est survenue. Réessayez.'
      : undefined;

  return (
    <LinearGradient
      colors={['rgba(76, 175, 80, 0.1)', '#FFFFFF', 'rgba(76, 175, 80, 0.05)']}
      locations={[0, 0.5, 1]}
      style={{ flex: 1 }}
    >
      <TopLoadingBar isLoading={verify2FA.isPending} />
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
            <Bird color="#FFFFFF" size={48} />
          </View>
          <Text style={{ fontFamily: FONT_FAMILY.bold }} className="mb-1 text-3xl text-primary">
            Kàff GUI
          </Text>
          <Text style={{ fontFamily: FONT_FAMILY.regular }} className="text-muted-foreground">
            Gestion de Volière
          </Text>
        </View>

        <View
          className="rounded-3xl bg-white p-6"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 20,
            elevation: 4,
          }}
        >
          <View className="mb-6 items-center">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield color="#030213" size={32} />
            </View>
            <Text
              style={{ fontFamily: FONT_FAMILY.semibold }}
              className="mb-2 text-xl text-foreground"
            >
              Authentification à deux facteurs
            </Text>
            <Text
              style={{ fontFamily: FONT_FAMILY.regular }}
              className="text-center text-sm text-muted-foreground"
            >
              Entrez le code à 6 chiffres de votre application Authenticator
            </Text>
            {params.email ? (
              <Text
                style={{ fontFamily: FONT_FAMILY.medium }}
                className="mt-2 text-center text-sm text-primary"
              >
                {params.email}
              </Text>
            ) : null}
          </View>

          <View className="gap-4">
            <Controller
              control={control}
              name="code"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  ref={codeInputRef}
                  label="Code de vérification"
                  placeholder="000000"
                  keyboardType="number-pad"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.code?.message}
                  leadingIcon={<Shield size={20} color="#717182" />}
                  textAlign="center"
                  className="text-2xl font-bold tracking-widest"
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

            <Button onPress={onSubmit} loading={verify2FA.isPending} disabled={verify2FA.isPending}>
              Vérifier
            </Button>

            <Button variant="ghost" onPress={() => router.back()} disabled={verify2FA.isPending}>
              Retour
            </Button>
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
