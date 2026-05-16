/**
 * Pigeons — US-PIG-01 (list + search) and entry point to US-PIG-02 (create).
 *
 * Layout:
 *   - Search input (filters by name or bague) + filter trigger.
 *   - Primary CTA "Ajouter un pigeon".
 *   - List of cards (sex-tinted avatar, status badge, race, age).
 */
import { useState } from 'react';

import { ActivityIndicator, Pressable, RefreshControl, Text, TextInput, View } from 'react-native';

import { router } from 'expo-router';

import { Bird, Filter, Plus, Search } from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';
import { useLogout } from '@/features/auth';
import { usePigeons, type PigeonListItem } from '@/features/pigeons';
import { AppHeader, Screen } from '@/shared/ui';

export default function PigeonsScreen() {
  const logout = useLogout();
  const [searchTerm, setSearchTerm] = useState('');

  // Real API call with React Query
  const { data, isLoading, error, refetch, isRefetching } = usePigeons({
    search: searchTerm,
    statut: 'ACTIF',
  });

  const handleRefresh = () => {
    refetch();
  };

  return (
    <View className="flex-1 bg-background">
      <AppHeader title="Gestion des Pigeons" onLogout={() => logout.mutate()} />
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
          {/* Search + filter */}
          <View className="mb-4 flex-row gap-2">
            <View className="flex-1 flex-row items-center rounded-lg border border-border bg-input px-3">
              <Search color="#717182" size={20} />
              <TextInput
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Rechercher par bague ou race..."
                placeholderTextColor="#9C9CB1"
                style={{ fontFamily: FONT_FAMILY.regular }}
                className="ml-2 h-12 flex-1 text-base text-foreground"
                accessibilityLabel="Rechercher un pigeon"
              />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Filtrer"
              className="h-12 w-12 items-center justify-center rounded-xl bg-card active:bg-muted"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Filter color="#030213" size={20} />
            </Pressable>
          </View>

          {/* CTA */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ajouter un pigeon"
            onPress={() => router.push('/(protected)/pigeons/add')}
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
              Ajouter un pigeon
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
                Chargement des pigeons...
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
                Impossible de charger les pigeons
              </Text>
            </View>
          ) : null}

          {/* List */}
          {!isLoading && !error && data ? (
            <View className="gap-3">
              {data.results.map((pigeon) => (
                <PigeonCard key={pigeon.id} pigeon={pigeon} />
              ))}
              {data.results.length === 0 ? (
                <Text
                  style={{ fontFamily: FONT_FAMILY.regular }}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  Aucun pigeon ne correspond à votre recherche.
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>
      </Screen>
    </View>
  );
}

function PigeonCard({ pigeon }: { pigeon: PigeonListItem }) {
  const isMale = pigeon.sexe === 'MALE';
  const ageAnnees = Math.floor(pigeon.ageJours / 365);
  const ageMois = Math.floor((pigeon.ageJours % 365) / 30);

  return (
    <Pressable
      onPress={() => router.push(`/(protected)/pigeons/${pigeon.id}`)}
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
          className="h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: isMale ? '#DBEAFE' : '#FCE7F3' }}
        >
          <Bird color={isMale ? '#2563EB' : '#DB2777'} size={24} />
        </View>
        <View className="flex-1">
          <View className="mb-1 flex-row items-start justify-between">
            <Text
              style={{ fontFamily: FONT_FAMILY.semibold }}
              className="flex-1 text-base text-foreground"
            >
              {pigeon.bague}
            </Text>
            <View className="rounded bg-primary/10 px-2 py-1">
              <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-[10px] text-primary">
                {pigeon.statut}
              </Text>
            </View>
          </View>
          <View className="flex-row flex-wrap gap-x-4 gap-y-1">
            <Text
              style={{ fontFamily: FONT_FAMILY.regular }}
              className="text-xs text-muted-foreground"
            >
              {isMale ? '♂ Mâle' : '♀ Femelle'}
            </Text>
            <Text
              style={{ fontFamily: FONT_FAMILY.regular }}
              className="text-xs text-muted-foreground"
            >
              Race: {pigeon.race}
            </Text>
            {ageAnnees > 0 || ageMois > 0 ? (
              <Text
                style={{ fontFamily: FONT_FAMILY.regular }}
                className="text-xs text-muted-foreground"
              >
                Âge: {ageAnnees > 0 ? `${ageAnnees}a ` : ''}
                {ageMois > 0 ? `${ageMois}m` : ''}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
