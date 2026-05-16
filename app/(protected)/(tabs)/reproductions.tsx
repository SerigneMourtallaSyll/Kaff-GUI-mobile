/**
 * Reproductions — US-REP-01 (list) + entry point to US-REP-02 (enregistrer une ponte).
 *
 * Layout:
 *   - Primary CTA "Enregistrer une ponte".
 *   - Status filter chips (EN_COURS, ECLOS, ECHEC).
 *   - List of reproduction cards showing couple, dates, eggs/pigeonneaux count.
 */
import { useState } from 'react';

import { ActivityIndicator, Pressable, RefreshControl, Text, View } from 'react-native';

import { router } from 'expo-router';

import { Calendar, Egg, Plus } from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';
import { useLogout } from '@/features/auth';
import {
  useReproductions,
  type ReproductionData,
  type ReproductionStatut,
} from '@/features/reproductions';
import { AppHeader, Screen } from '@/shared/ui';

interface StatusStyle {
  label: string;
  bg: string;
  fg: string;
}

const STATUS_STYLES: Record<ReproductionStatut, StatusStyle> = {
  EN_COURS: {
    label: 'En cours',
    bg: 'rgba(229, 184, 84, 0.18)',
    fg: '#C58F1F',
  },
  ECLOS: {
    label: 'Éclos',
    bg: 'rgba(76, 175, 80, 0.15)',
    fg: '#2E7D32',
  },
  ECHEC: {
    label: 'Échec',
    bg: 'rgba(244, 67, 54, 0.12)',
    fg: '#C62828',
  },
};

export default function ReproductionsScreen() {
  const logout = useLogout();
  const [selectedStatut, setSelectedStatut] = useState<ReproductionStatut | undefined>();

  // Real API call
  const { data, isLoading, error, refetch, isRefetching } = useReproductions({
    statut: selectedStatut,
  });

  const handleRefresh = () => {
    refetch();
  };

  return (
    <View className="flex-1 bg-background">
      <AppHeader title="Gestion des Reproductions" onLogout={() => logout.mutate()} />
      <Screen
        scroll
        className="bg-background"
        contentClassName="pb-6"
        edges={['bottom']}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
      >
        <View className="px-4 pb-24 pt-6">
          {/* Primary CTA */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Enregistrer une ponte"
            onPress={() => router.push('/(protected)/reproductions/add')}
            className="mb-4 h-12 flex-row items-center justify-center gap-2 rounded-lg bg-primary active:opacity-80"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Plus color="#FFFFFF" size={20} />
            <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-base text-white">
              Enregistrer une ponte
            </Text>
          </Pressable>

          {/* Status quick filters */}
          <View className="-mx-1 mb-6 flex-row">
            {(['EN_COURS', 'ECLOS', 'ECHEC'] as ReproductionStatut[]).map((statut) => {
              const s = STATUS_STYLES[statut];
              const isSelected = selectedStatut === statut;
              return (
                <View key={statut} className="flex-1 px-1">
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Filtrer ${s.label}`}
                    onPress={() => setSelectedStatut(isSelected ? undefined : statut)}
                    className="h-12 items-center justify-center rounded-lg active:opacity-70"
                    style={{
                      backgroundColor: isSelected ? s.fg : s.bg,
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected ? '#FFFFFF' : s.fg,
                        fontFamily: FONT_FAMILY.medium,
                      }}
                      className="text-sm"
                    >
                      {s.label}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>

          {/* Loading state */}
          {isLoading ? (
            <View className="items-center py-12">
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text
                style={{ fontFamily: FONT_FAMILY.regular }}
                className="mt-4 text-sm text-muted-foreground"
              >
                Chargement des reproductions...
              </Text>
            </View>
          ) : null}

          {/* Error state */}
          {error ? (
            <View className="items-center py-12">
              <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-base text-danger">
                Erreur de chargement
              </Text>
              <Text
                style={{ fontFamily: FONT_FAMILY.regular }}
                className="mt-2 text-sm text-muted-foreground"
              >
                Impossible de charger les reproductions
              </Text>
            </View>
          ) : null}

          {/* List */}
          {!isLoading && !error && data ? (
            <View className="gap-3">
              {data.results.map((reproduction) => (
                <ReproductionCard key={reproduction.id} reproduction={reproduction} />
              ))}
              {data.results.length === 0 ? (
                <Text
                  style={{ fontFamily: FONT_FAMILY.regular }}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  Aucune reproduction enregistrée.
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>
      </Screen>
    </View>
  );
}

function ReproductionCard({ reproduction }: { reproduction: ReproductionData }) {
  const style = STATUS_STYLES[reproduction.statut];

  const handlePress = () => {
    router.push(`/(protected)/reproductions/${reproduction.id}` as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="rounded-2xl bg-card p-4 active:opacity-80"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="flex-row items-start gap-3">
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: style.bg }}
        >
          <Egg color={style.fg} size={20} />
        </View>
        <View className="flex-1">
          <View className="mb-2 flex-row items-start justify-between">
            <View className="flex-1 pr-2">
              <Text
                style={{ fontFamily: FONT_FAMILY.semibold }}
                className="mb-1 text-base text-foreground"
              >
                {reproduction.maleBague} × {reproduction.femelleBague}
              </Text>
              <View className="flex-row items-center gap-1">
                <Calendar color="#717182" size={12} />
                <Text
                  style={{ fontFamily: FONT_FAMILY.regular }}
                  className="text-xs text-muted-foreground"
                >
                  Ponte: {new Date(reproduction.datePonte).toLocaleDateString('fr-FR')}
                </Text>
              </View>
            </View>
            <View className="rounded px-2 py-1" style={{ backgroundColor: style.bg }}>
              <Text
                style={{ color: style.fg, fontFamily: FONT_FAMILY.medium }}
                className="text-[10px]"
              >
                {style.label.toUpperCase()}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-4">
            <Text
              style={{ fontFamily: FONT_FAMILY.regular }}
              className="text-sm text-muted-foreground"
            >
              🥚 {reproduction.nbOeufs} œuf{reproduction.nbOeufs > 1 ? 's' : ''}
            </Text>
            {reproduction.nbPigeonneaux > 0 ? (
              <Text
                style={{ fontFamily: FONT_FAMILY.regular }}
                className="text-sm text-muted-foreground"
              >
                🐣 {reproduction.nbPigeonneaux} pigeonneau
                {reproduction.nbPigeonneaux > 1 ? 'x' : ''}
              </Text>
            ) : null}
          </View>

          {reproduction.dateEclosion ? (
            <Text
              style={{ fontFamily: FONT_FAMILY.regular }}
              className="mt-2 text-xs text-muted-foreground"
            >
              Éclosion: {new Date(reproduction.dateEclosion).toLocaleDateString('fr-FR')}
            </Text>
          ) : null}

          {reproduction.notes ? (
            <Text
              style={{ fontFamily: FONT_FAMILY.regular }}
              className="mt-2 text-xs italic text-muted-foreground"
            >
              {reproduction.notes}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
