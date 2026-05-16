/**
 * Register Confirmation screen — US-AUTH-02 (step 2).
 *
 * Displays QR code for TOTP enrollment and prompts for first verification code.
 * Banking-grade implementation:
 *   - QR code display (data URI from backend)
 *   - 6-digit code validation
 *   - Clear instructions for Authenticator app setup
 */
import { useEffect, useRef, useState } from 'react';

import { Clipboard, Image, Pressable, Text, TextInput, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';

import { zodResolver } from '@hookform/resolvers/zod';
import { Bird, Copy, QrCode, Shield } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';

import { AppError } from '@/core/errors';
import { FONT_FAMILY } from '@/core/theme';
import { useVerify2FA, totpCodeSchema, type TOTPCodeInput } from '@/features/auth';
import { Button, Input, Screen, TopLoadingBar } from '@/shared/ui';

/**
 * Extract TOTP secret from otpauth:// URI
 */
function extractSecretFromUri(uri: string): string | null {
  try {
    const url = new URL(uri);
    return url.searchParams.get('secret');
  } catch {
    return null;
  }
}

export default function RegisterConfirmScreen() {
  const params = useLocalSearchParams<{
    challengeToken: string;
    qrCodeDataUri: string;
    provisioningUri?: string;
    email?: string;
  }>();
  const verify2FA = useVerify2FA();
  const codeInputRef = useRef<TextInput>(null);
  const [copied, setCopied] = useState(false);

  // Extract secret from provisioning URI
  const totpSecret = params.provisioningUri ? extractSecretFromUri(params.provisioningUri) : null;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TOTPCodeInput>({
    resolver: zodResolver(totpCodeSchema),
    defaultValues: { code: '' },
  });

  useEffect(() => {
    // Auto-focus on mount after user scans QR
    setTimeout(() => codeInputRef.current?.focus(), 500);
  }, []);

  const handleCopySecret = async () => {
    if (totpSecret) {
      Clipboard.setString(totpSecret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const onSubmit = handleSubmit((values) => {
    if (!params.challengeToken) {
      router.replace('/register');
      return;
    }

    verify2FA.mutate(
      {
        challengeToken: params.challengeToken,
        code: values.code,
        isRegistration: true,
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

        <View className="rounded-3xl bg-white p-6">
          <View className="mb-6 items-center">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <QrCode color="#030213" size={32} />
            </View>
            <Text
              style={{ fontFamily: FONT_FAMILY.semibold }}
              className="mb-2 text-xl text-foreground"
            >
              Configuration 2FA
            </Text>
            <Text
              style={{ fontFamily: FONT_FAMILY.regular }}
              className="text-center text-sm text-muted-foreground"
            >
              Scannez ce QR code avec votre application Authenticator
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

          {/* QR Code Display */}
          {params.qrCodeDataUri ? (
            <View className="mb-6 items-center">
              <View
                className="overflow-hidden rounded-2xl bg-white p-4"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.06,
                  shadowRadius: 12,
                  elevation: 3,
                }}
              >
                <Image
                  source={{ uri: params.qrCodeDataUri }}
                  style={{ width: 200, height: 200 }}
                  resizeMode="contain"
                />
              </View>
              <Text
                style={{ fontFamily: FONT_FAMILY.regular }}
                className="mt-4 text-center text-xs text-muted-foreground"
              >
                Utilisez Google Authenticator, Authy ou une app compatible TOTP
              </Text>

              {/* Manual Secret Entry Option */}
              {totpSecret ? (
                <View className="mt-6 w-full rounded-lg border border-border bg-muted/50 p-4">
                  <Text
                    style={{ fontFamily: FONT_FAMILY.semibold }}
                    className="mb-2 text-center text-sm text-foreground"
                  >
                    Configuration manuelle
                  </Text>
                  <Text
                    style={{ fontFamily: FONT_FAMILY.regular }}
                    className="mb-3 text-center text-xs text-muted-foreground"
                  >
                    Si vous ne pouvez pas scanner le QR code, copiez cette clé et ajoutez-la
                    manuellement dans votre application Authenticator :
                  </Text>
                  <Pressable
                    onPress={handleCopySecret}
                    className="flex-row items-center justify-center rounded-lg bg-white p-3"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.04,
                      shadowRadius: 6,
                      elevation: 2,
                    }}
                  >
                    <Text
                      style={{ fontFamily: FONT_FAMILY.medium }}
                      className="mr-2 flex-1 text-center text-sm text-foreground"
                      selectable
                    >
                      {totpSecret}
                    </Text>
                    <Copy size={18} color={copied ? '#4CAF50' : '#717182'} />
                  </Pressable>
                  {copied ? (
                    <Text
                      style={{ fontFamily: FONT_FAMILY.medium }}
                      className="mt-2 text-center text-xs text-primary"
                    >
                      ✓ Clé copiée dans le presse-papiers
                    </Text>
                  ) : (
                    <Text
                      style={{ fontFamily: FONT_FAMILY.regular }}
                      className="mt-2 text-center text-xs text-muted-foreground"
                    >
                      Appuyez pour copier
                    </Text>
                  )}
                </View>
              ) : null}
            </View>
          ) : null}

          {/* Verification Code Input */}
          <View className="gap-4">
            <Text
              style={{ fontFamily: FONT_FAMILY.medium }}
              className="text-center text-sm text-foreground"
            >
              Entrez le code généré par votre application
            </Text>

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
              Confirmer et se connecter
            </Button>

            <Button
              variant="ghost"
              onPress={() => router.replace('/register')}
              disabled={verify2FA.isPending}
            >
              Recommencer
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
