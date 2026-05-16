/**
 * Register screen — US-AUTH-02 (step 1).
 *
 * Banking-grade implementation:
 *   - react-hook-form + Zod validation
 *   - Password strength requirements (8+ chars, 1 digit)
 *   - Encrypted payload transmission
 *   - Navigates to QR code enrollment on success
 */
import { Pressable, Text, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { zodResolver } from '@hookform/resolvers/zod';
import { Bird, Lock, Mail, User } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';

import { AppError } from '@/core/errors';
import { FONT_FAMILY } from '@/core/theme';
import { useRegister, useInitCrypto, registerSchema, type RegisterInput } from '@/features/auth';
import { Button, Input, TopLoadingBar, Screen } from '@/shared/ui';

export default function RegisterScreen() {
  const register = useRegister();
  const initCrypto = useInitCrypto();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    // Ensure crypto is initialized before submitting
    if (!initCrypto.data && !initCrypto.isPending) {
      initCrypto.mutate();
      return;
    }

    register.mutate(values, {
      onSuccess: (data) => {
        // Navigate to QR code enrollment screen
        router.push(
          `/register-confirm?challengeToken=${data.challengeToken}&qrCodeDataUri=${encodeURIComponent(data.qrCodeDataUri)}&provisioningUri=${encodeURIComponent(data.provisioningUri)}&email=${encodeURIComponent(values.email)}`,
        );
      },
    });
  });

  const error = register.error;
  const errorMessage =
    error && AppError.isAppError(error)
      ? error.code === 'VALIDATION_ERROR'
        ? 'Email déjà utilisé ou données invalides.'
        : error.code === 'NETWORK_ERROR'
          ? 'Connexion impossible. Vérifiez votre réseau.'
          : 'Une erreur est survenue. Réessayez.'
      : undefined;

  const isLoading = register.isPending || initCrypto.isPending;

  return (
    <LinearGradient
      colors={['rgba(76, 175, 80, 0.1)', '#FFFFFF', 'rgba(76, 175, 80, 0.05)']}
      locations={[0, 0.5, 1]}
      style={{ flex: 1 }}
    >
      <TopLoadingBar isLoading={isLoading} />
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
          className="mb-6 rounded-3xl bg-white p-6"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 20,
            elevation: 4,
          }}
        >
          <Text
            style={{ fontFamily: FONT_FAMILY.semibold }}
            className="mb-6 text-xl text-foreground"
          >
            Créer un compte
          </Text>

          <View className="gap-4">
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Prénom"
                  placeholder="Baay"
                  autoCapitalize="words"
                  autoComplete="given-name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.firstName?.message}
                  leadingIcon={<User size={20} color="#717182" />}
                />
              )}
            />

            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Nom"
                  placeholder="Pitàq"
                  autoCapitalize="words"
                  autoComplete="family-name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.lastName?.message}
                  leadingIcon={<User size={20} color="#717182" />}
                />
              )}
            />

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
                  autoComplete="password-new"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  leadingIcon={<Lock size={20} color="#717182" />}
                />
              )}
            />

            <Text
              style={{ fontFamily: FONT_FAMILY.regular }}
              className="text-xs text-muted-foreground"
            >
              Le mot de passe doit contenir au moins 8 caractères et 1 chiffre.
            </Text>

            {errorMessage ? (
              <Text
                style={{ fontFamily: FONT_FAMILY.regular }}
                className="text-sm text-danger"
                accessibilityLiveRegion="polite"
              >
                {errorMessage}
              </Text>
            ) : null}

            <Button onPress={onSubmit} loading={isLoading} disabled={isLoading}>
              Continuer
            </Button>
          </View>

          <View className="mt-6 items-center">
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-sm text-primary">
                Déjà un compte ? Se connecter
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
