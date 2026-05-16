/**
 * Sorties — US-SOR-01 (list) + entry to US-SOR-02 (record an exit).
 *
 * Three exit types (cahier des charges §3.7):
 *   - VENTE  → primary tint
 *   - DECES  → chart-3 (cold blue)
 *   - PERTE  → chart-4 (warm gold)
 *
 * Quick-type filters at the top, then a chronological list of exit cards.
 */
import { useState } from 'react';

import { ActivityIndicator, Pressable, RefreshControl, Text, View } from 'react-native';

import { router } from 'expo-router';

import { AlertTriangle, DollarSign, Plus, XCircle } from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';
import { useLogout } from '@/features/auth';
import { useSorties, type Sortie, type SortieType } from '@/features/sorties';
import { AppHeader, Screen } from '@/shared/ui';

interface TypeStyle {
  label: string;
  bg: string;
  fg: string;
  icon: React.ReactNode;
}

const TYPE_STYLES: Record<SortieType, TypeStyle> = {
  VENTE: {
    label: 'Vente',
    bg: 'rgba(3, 2, 19, 0.08)',
    fg: '#030213',
    icon: <DollarSign color="#030213" size={20} />,
  },
  DECES: {
    label: 'Décès',
    bg: 'rgba(45, 78, 104, 0.12)',
    fg: '#2D4E68',
    icon: <XCircle color="#2D4E68" size={20} />,
  },
  PERTE: {
    label: 'Perte',
    bg: 'rgba(229, 184, 84, 0.18)',
    fg: '#C58F1F',
    icon: <AlertTriangle color="#C58F1F" size={20} />,
  },
};

export default function SortiesScreen() {
  const logout = useLogout();
  const [selectedType, setSelectedType] = useState<SortieType | undefined>();

  // Real API call
  const { data, isLoading, error, refetch, isRefetching } = useSorties({
    typeSortie: selectedType,
  });

  const handleRefresh = () => {
    refetch();
  };

  return (
    <View className="flex-1 bg-background">
      <AppHeader title="Gestion des Sorties" onLogout={() => logout.mutate()} />
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
            accessibilityLabel="Enregistrer une sortie"
            onPress={() => router.push('/(protected)/(tabs)/pigeons')}
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
              Enregistrer une sortie
            </Text>
          </Pressable>

          {/* Type quick filters */}
          <View className="-mx-1 mb-6 flex-row">
            {(['VENTE', 'DECES', 'PERTE'] as SortieType[]).map((type) => {
              const s = TYPE_STYLES[type];
              const isSelected = selectedType === type;
              return (
                <View key={type} className="flex-1 px-1">
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Filtrer ${s.label}`}
                    onPress={() => setSelectedType(isSelected ? undefined : type)}
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
                Chargement des sorties...
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
                Impossible de charger les sorties
              </Text>
            </View>
          ) : null}

          {/* List */}
          {!isLoading && !error && data ? (
            <View className="gap-3">
              {data.results.map((sortie) => (
                <SortieCard key={sortie.id} sortie={sortie} />
              ))}
              {data.results.length === 0 ? (
                <Text
                  style={{ fontFamily: FONT_FAMILY.regular }}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  Aucune sortie enregistrée.
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>
      </Screen>
    </View>
  );
}

function SortieCard({ sortie }: { sortie: Sortie }) {
  const style = TYPE_STYLES[sortie.typeSortie];

  // Format details based on type
  let details = '';
  if (sortie.typeSortie === 'VENTE' && sortie.prix) {
    details = `${sortie.prix.toLocaleString('fr-FR')} FCFA`;
    if (sortie.acheteur) details += ` - ${sortie.acheteur}`;
  } else if (sortie.typeSortie === 'DECES' && sortie.cause) {
    details = `Cause: ${sortie.cause}`;
  } else if (sortie.typeSortie === 'PERTE' && sortie.circonstance) {
    details = sortie.circonstance;
  }

  return (
    <View
      className="rounded-2xl bg-card p-4"
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
          {style.icon}
        </View>
        <View className="flex-1">
          <View className="mb-1 flex-row items-start justify-between">
            <View className="flex-1 pr-2">
              <Text
                style={{ fontFamily: FONT_FAMILY.semibold }}
                className="text-base text-foreground"
              >
                Pigeon {sortie.pigeonId.slice(0, 8)}
              </Text>
            </View>
            <View className="rounded px-2 py-1" style={{ backgroundColor: style.bg }}>
              <Text
                style={{ color: style.fg, fontFamily: FONT_FAMILY.medium }}
                className="text-[10px]"
              >
                {sortie.typeSortie}
              </Text>
            </View>
          </View>
          {details ? (
            <Text
              style={{ fontFamily: FONT_FAMILY.regular }}
              className="mb-2 text-sm text-muted-foreground"
            >
              {details}
            </Text>
          ) : null}
          <Text
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="text-xs text-muted-foreground"
          >
            {new Date(sortie.dateSortie).toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </View>
    </View>
  );
}
