/**
 * Pigeons — US-PIG-01 (list + search) and entry point to US-PIG-02 (create).
 *
 * Layout:
 *   - Search input (filters by name or bague) + filter trigger.
 *   - Primary CTA "Ajouter un pigeon".
 *   - List of cards (sex-tinted avatar, status badge, race, cage).
 *
 * Data is mocked. When the API ships, swap `mockPigeons` for a paginated
 * query (`useInfinitePigeons`) and use `FlatList` for windowing.
 */
import { useMemo, useState } from 'react';

import { Pressable, Text, TextInput, View } from 'react-native';

import { Bird, Filter, Plus, Search } from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';
import { useLogout } from '@/features/auth';
import { AppHeader, Screen } from '@/shared/ui';

type Sexe = 'MALE' | 'FEMALE';

interface PigeonRow {
  bague: string;
  nom: string;
  sexe: Sexe;
  race: string;
  statut: 'ACTIF' | 'INACTIF';
  cage: string;
}

const mockPigeons: PigeonRow[] = [
  {
    bague: 'B2024-001',
    nom: 'Sultan',
    sexe: 'MALE',
    race: 'Voyageur',
    statut: 'ACTIF',
    cage: 'A1',
  },
  {
    bague: 'B2024-012',
    nom: 'Princesse',
    sexe: 'FEMALE',
    race: 'Mondain',
    statut: 'ACTIF',
    cage: 'A4',
  },
  {
    bague: 'B2024-033',
    nom: 'Champion',
    sexe: 'MALE',
    race: 'Voyageur',
    statut: 'ACTIF',
    cage: 'B3',
  },
  { bague: 'B2024-045', nom: 'Reine', sexe: 'FEMALE', race: 'Texan', statut: 'ACTIF', cage: 'C2' },
  {
    bague: 'B2024-060',
    nom: 'Warrior',
    sexe: 'MALE',
    race: 'Voyageur',
    statut: 'ACTIF',
    cage: 'D1',
  },
  {
    bague: 'B2024-070',
    nom: 'Beauty',
    sexe: 'FEMALE',
    race: 'Mondain',
    statut: 'ACTIF',
    cage: 'D3',
  },
];

export default function PigeonsScreen() {
  const logout = useLogout();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return mockPigeons;
    return mockPigeons.filter(
      (p) => p.nom.toLowerCase().includes(term) || p.bague.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  return (
    <Screen scroll className="bg-background" contentClassName="pb-6" edges={['bottom']}>
      <AppHeader title="Gestion des Pigeons" onLogout={() => logout.mutate()} />

      <View className="px-4 pt-6">
        {/* Search + filter */}
        <View className="mb-4 flex-row gap-2">
          <View className="flex-1 flex-row items-center rounded-lg border border-border bg-input px-3">
            <Search color="#717182" size={20} />
            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Rechercher..."
              placeholderTextColor="#9C9CB1"
              style={{ fontFamily: FONT_FAMILY.regular }}
              className="ml-2 h-12 flex-1 text-base text-foreground"
              accessibilityLabel="Rechercher un pigeon"
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Filtrer"
            className="h-12 w-12 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
          >
            <Filter color="#030213" size={20} />
          </Pressable>
        </View>

        {/* CTA */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ajouter un pigeon"
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

        {/* List */}
        <View className="gap-3">
          {filtered.map((p) => (
            <PigeonCard key={p.bague} pigeon={p} />
          ))}
          {filtered.length === 0 ? (
            <Text
              style={{ fontFamily: FONT_FAMILY.regular }}
              className="py-8 text-center text-sm text-muted-foreground"
            >
              Aucun pigeon ne correspond à votre recherche.
            </Text>
          ) : null}
        </View>
      </View>
    </Screen>
  );
}

function PigeonCard({ pigeon }: { pigeon: PigeonRow }) {
  const isMale = pigeon.sexe === 'MALE';
  return (
    <View
      className="rounded-xl border border-border bg-card p-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 1,
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
              className="text-base text-foreground"
            >
              {pigeon.nom}
            </Text>
            <View className="rounded bg-primary/10 px-2 py-1">
              <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-[10px] text-primary">
                {pigeon.statut}
              </Text>
            </View>
          </View>
          <Text
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="mb-2 text-sm text-muted-foreground"
          >
            {pigeon.bague}
          </Text>
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
            <Text
              style={{ fontFamily: FONT_FAMILY.regular }}
              className="text-xs text-muted-foreground"
            >
              Cage: {pigeon.cage}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
