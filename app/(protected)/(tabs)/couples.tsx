/**
 * Couples — US-COU-01 (list) + entry point to US-COU-02 (former un couple).
 */
import { ActivityIndicator, Pressable, RefreshControl, Text, View } from 'react-native';

import { router } from 'expo-router';

import { Calendar, Heart, Plus } from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';
import { useLogout } from '@/features/auth';
import { useCouples, type Couple } from '@/features/couples';
import { AppHeader, Screen } from '@/shared/ui';

export default function CouplesScreen() {
  const logout = useLogout();
  const { data, isLoading, error, refetch, isRefetching } = useCouples({ statut: 'ACTIF' });

  const handleRefresh = () => {
    refetch();
  };

  return (
    <View className="flex-1 bg-background">
      <AppHeader title="Gestion des Couples" onLogout={() => logout.mutate()} />
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
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Former un nouveau couple"
            onPress={() => router.push('/(protected)/couples/add')}
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
              Former un nouveau couple
            </Text>
          </Pressable>

          {/* Loading state */}
          {isLoading ? (
            <View className="items-center py-12">
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text
                style={{ fontFamily: FONT_FAMILY.regular }}
                className="mt-4 text-sm text-muted-foreground"
              >
                Chargement des couples...
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
                Impossible de charger les couples
              </Text>
            </View>
          ) : null}

          {/* List */}
          {!isLoading && !error && data ? (
            <View className="gap-3">
              {data.results.map((couple) => (
                <CoupleCard key={couple.id} couple={couple} />
              ))}
              {data.results.length === 0 ? (
                <Text
                  style={{ fontFamily: FONT_FAMILY.regular }}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  Aucun couple actif.
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>
      </Screen>
    </View>
  );
}

function CoupleCard({ couple }: { couple: Couple }) {
  return (
    <Pressable
      onPress={() => router.push(`/(protected)/couples/${couple.id}` as any)}
      accessibilityRole="button"
      className="active:opacity-70"
    >
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
        <View className="mb-3 flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-chart-4/10">
            <Heart color="#E5B854" size={20} />
          </View>
          <View className="flex-1">
            <Text
              style={{ fontFamily: FONT_FAMILY.semibold }}
              className="text-base text-foreground"
            >
              Couple #{couple.id.slice(0, 8)}
            </Text>
            <View className="mt-1 flex-row items-center gap-1">
              <Calendar color="#717182" size={12} />
              <Text
                style={{ fontFamily: FONT_FAMILY.regular }}
                className="text-xs text-muted-foreground"
              >
                {new Date(couple.dateFormation).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-3 gap-2 rounded-lg bg-muted p-3">
          <View className="flex-row items-center gap-2">
            <Text style={{ fontFamily: FONT_FAMILY.bold }} className="text-base text-male">
              ♂
            </Text>
            <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-sm text-foreground">
              {couple.male.bague}
            </Text>
            <Text
              style={{ fontFamily: FONT_FAMILY.regular }}
              className="text-sm text-muted-foreground"
            >
              ({couple.male.race})
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text style={{ fontFamily: FONT_FAMILY.bold }} className="text-base text-female">
              ♀
            </Text>
            <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-sm text-foreground">
              {couple.femelle.bague}
            </Text>
            <Text
              style={{ fontFamily: FONT_FAMILY.regular }}
              className="text-sm text-muted-foreground"
            >
              ({couple.femelle.race})
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <Text
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="text-sm text-muted-foreground"
          >
            {couple.nbReproductions} reproduction{couple.nbReproductions > 1 ? 's' : ''}
          </Text>
          <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-sm text-primary">
            Voir détails →
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
