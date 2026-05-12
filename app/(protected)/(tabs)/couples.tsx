/**
 * Couples — US-COU-01 (list) + entry point to US-COU-02 (former un couple).
 *
 * Each card surfaces: couple id, formation date, male+female (bague & nom),
 * count of reproductions, and a CTA to drill into the couple detail (still
 * a TODO once the route ships).
 */
import { Pressable, Text, View } from 'react-native';

import { Calendar, Heart, Plus } from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';
import { useLogout } from '@/features/auth';
import { AppHeader, Screen } from '@/shared/ui';

interface CoupleRow {
  id: number;
  male: { bague: string; nom: string };
  femelle: { bague: string; nom: string };
  dateFormation: string;
  reproductions: number;
}

const mockCouples: CoupleRow[] = [
  {
    id: 1,
    male: { bague: 'B2024-005', nom: 'Sultan Jr' },
    femelle: { bague: 'B2024-006', nom: 'Perle' },
    dateFormation: '01 Mai 2026',
    reproductions: 2,
  },
  {
    id: 2,
    male: { bague: 'B2024-020', nom: 'Prince' },
    femelle: { bague: 'B2024-021', nom: 'Lady' },
    dateFormation: '15 Avr 2026',
    reproductions: 3,
  },
  {
    id: 3,
    male: { bague: 'B2024-040', nom: 'King' },
    femelle: { bague: 'B2024-041', nom: 'Queen' },
    dateFormation: '20 Avr 2026',
    reproductions: 1,
  },
];

export default function CouplesScreen() {
  const logout = useLogout();

  return (
    <Screen scroll className="bg-background" contentClassName="pb-6" edges={['bottom']}>
      <AppHeader title="Gestion des Couples" onLogout={() => logout.mutate()} />

      <View className="px-4 pt-6">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Former un nouveau couple"
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

        <View className="gap-3">
          {mockCouples.map((couple) => (
            <CoupleCard key={couple.id} couple={couple} />
          ))}
        </View>
      </View>
    </Screen>
  );
}

function CoupleCard({ couple }: { couple: CoupleRow }) {
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
      <View className="mb-3 flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-chart-4/10">
          <Heart color="#E5B854" size={20} />
        </View>
        <View className="flex-1">
          <Text style={{ fontFamily: FONT_FAMILY.semibold }} className="text-base text-foreground">
            Couple #{couple.id}
          </Text>
          <View className="mt-1 flex-row items-center gap-1">
            <Calendar color="#717182" size={12} />
            <Text
              style={{ fontFamily: FONT_FAMILY.regular }}
              className="text-xs text-muted-foreground"
            >
              {couple.dateFormation}
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
            {couple.male.nom}
          </Text>
          <Text
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="text-sm text-muted-foreground"
          >
            ({couple.male.bague})
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Text style={{ fontFamily: FONT_FAMILY.bold }} className="text-base text-female">
            ♀
          </Text>
          <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-sm text-foreground">
            {couple.femelle.nom}
          </Text>
          <Text
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="text-sm text-muted-foreground"
          >
            ({couple.femelle.bague})
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <Text style={{ fontFamily: FONT_FAMILY.regular }} className="text-sm text-muted-foreground">
          {couple.reproductions} reproduction{couple.reproductions > 1 ? 's' : ''}
        </Text>
        <Pressable hitSlop={8} accessibilityRole="button">
          <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-sm text-primary">
            Voir détails
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
