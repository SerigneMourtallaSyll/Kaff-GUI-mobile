/**
 * Sorties — US-SOR-01 (list) + entry to US-SOR-02 (record an exit).
 *
 * Three exit types (cahier des charges §3.7):
 *   - VENTE  → primary tint
 *   - DECES  → chart-3 (cold blue)
 *   - PERTE  → chart-4 (warm gold)
 *
 * Quick-type filters at the top, then a chronological list of exit cards.
 * Behind the mock data, the API will surface paginated `sorties` ordered
 * by date desc; the chips will translate into a `?type=` query param.
 */
import { Pressable, Text, View } from 'react-native';

import { AlertTriangle, DollarSign, Plus, XCircle } from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';
import { useLogout } from '@/features/auth';
import { AppHeader, Screen } from '@/shared/ui';

type SortieType = 'VENTE' | 'DECES' | 'PERTE';

interface SortieRow {
  id: number;
  type: SortieType;
  pigeon: { bague: string; nom: string };
  date: string;
  details: string;
}

const mockSorties: SortieRow[] = [
  {
    id: 1,
    type: 'VENTE',
    pigeon: { bague: 'B2024-045', nom: 'Champion Elite' },
    date: '10 Mai 2026',
    details: '50,000 FCFA - M. Diop',
  },
  {
    id: 2,
    type: 'DECES',
    pigeon: { bague: 'B2024-033', nom: 'Veteran' },
    date: '05 Mai 2026',
    details: 'Cause: Vieillesse',
  },
  {
    id: 3,
    type: 'VENTE',
    pigeon: { bague: 'B2024-028', nom: 'Swift' },
    date: '28 Avr 2026',
    details: '35,000 FCFA - Mme Fall',
  },
];

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

  return (
    <Screen scroll className="bg-background" contentClassName="pb-6" edges={['bottom']}>
      <AppHeader title="Gestion des Sorties" onLogout={() => logout.mutate()} />

      <View className="px-4 pt-6">
        {/* Primary CTA */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Enregistrer une sortie"
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
            return (
              <View key={type} className="flex-1 px-1">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Filtrer ${s.label}`}
                  className="h-12 items-center justify-center rounded-lg active:opacity-70"
                  style={{ backgroundColor: s.bg }}
                >
                  <Text style={{ color: s.fg, fontFamily: FONT_FAMILY.medium }} className="text-sm">
                    {s.label}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        {/* List */}
        <View className="gap-3">
          {mockSorties.map((sortie) => (
            <SortieCard key={sortie.id} sortie={sortie} />
          ))}
        </View>
      </View>
    </Screen>
  );
}

function SortieCard({ sortie }: { sortie: SortieRow }) {
  const style = TYPE_STYLES[sortie.type];
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
                {sortie.pigeon.nom}
              </Text>
              <Text
                style={{ fontFamily: FONT_FAMILY.regular }}
                className="text-sm text-muted-foreground"
              >
                {sortie.pigeon.bague}
              </Text>
            </View>
            <View className="rounded px-2 py-1" style={{ backgroundColor: style.bg }}>
              <Text
                style={{ color: style.fg, fontFamily: FONT_FAMILY.medium }}
                className="text-[10px]"
              >
                {sortie.type}
              </Text>
            </View>
          </View>
          <Text
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="mb-2 text-sm text-muted-foreground"
          >
            {sortie.details}
          </Text>
          <Text
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="text-xs text-muted-foreground"
          >
            {sortie.date}
          </Text>
        </View>
      </View>
    </View>
  );
}
