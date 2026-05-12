/**
 * Dashboard — US-DASH-01.
 *
 * Snapshot of the colombier:
 *   - 4 KPI tiles (active pigeons, free cages, active couples, monthly exits).
 *   - Gradient CTA to jump to the Volière (US-CAG-01).
 *   - Latest activities feed.
 *
 * Data is currently mocked (see `mockStats` / `mockActivities`); it will be
 * swapped for API queries (`useDashboardStats`) once the backend is online.
 * The screen stays render-stable — no skeletons here yet because the data
 * is synchronous, but the layout is ready to host them.
 */
import type { ComponentType } from 'react';

import { Pressable, Text, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import {
  AlertCircle,
  Bird,
  Box,
  Grid3X3,
  Heart,
  type LucideProps,
  TrendingDown,
} from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';
import { useLogout } from '@/features/auth';
import { AppHeader, Screen } from '@/shared/ui';

interface StatTile {
  label: string;
  value: number;
  Icon: ComponentType<LucideProps>;
  color: string;
  bg: string;
}

interface Activity {
  type: 'reproduction' | 'vente' | 'couple';
  date: string;
  desc: string;
}

const mockStats: StatTile[] = [
  { label: 'Pigeons actifs', value: 42, Icon: Bird, color: '#030213', bg: '#E8E8EE' },
  { label: 'Cages libres', value: 8, Icon: Box, color: '#2EB6A8', bg: '#E0F5F2' },
  { label: 'Couples actifs', value: 15, Icon: Heart, color: '#E5B854', bg: '#FBF1D9' },
  { label: 'Sorties (mois)', value: 3, Icon: TrendingDown, color: '#2D4E68', bg: '#DEE7EF' },
];

const mockActivities: Activity[] = [
  { type: 'reproduction', date: '11 Mai 2026', desc: 'Nouvelle ponte - Couple #12' },
  { type: 'vente', date: '10 Mai 2026', desc: 'Vente pigeon #B2024-045' },
  { type: 'couple', date: '09 Mai 2026', desc: 'Formation couple #16' },
];

const activityDotColor: Record<Activity['type'], string> = {
  reproduction: '#030213',
  vente: '#2D4E68',
  couple: '#E5B854',
};

export default function DashboardScreen() {
  const logout = useLogout();

  return (
    <Screen scroll className="bg-background" contentClassName="pb-6" edges={['bottom']}>
      <AppHeader title="Tableau de bord" onLogout={() => logout.mutate()} />

      <View className="px-4 pt-6">
        {/* Stats grid */}
        <View className="-mx-1.5 mb-6 flex-row flex-wrap">
          {mockStats.map((stat) => (
            <View key={stat.label} className="w-1/2 px-1.5 pb-3">
              <StatCard stat={stat} />
            </View>
          ))}
        </View>

        {/* Volière CTA */}
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(protected)/(tabs)/voliere')}
          className="mb-6 overflow-hidden rounded-2xl"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.18,
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          <LinearGradient
            colors={['#030213', '#2A2A45']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ padding: 24 }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <Text
                  style={{ fontFamily: FONT_FAMILY.semibold }}
                  className="mb-1 text-lg text-white"
                >
                  Visualiser la Volière
                </Text>
                <Text style={{ fontFamily: FONT_FAMILY.regular }} className="text-sm text-white/80">
                  Vue interactive des cages
                </Text>
              </View>
              <Grid3X3 color="#FFFFFF" size={32} />
            </View>
          </LinearGradient>
        </Pressable>

        {/* Recent activities */}
        <View className="rounded-xl border border-border bg-card p-4">
          <View className="mb-4 flex-row items-center gap-2">
            <AlertCircle color="#030213" size={20} />
            <Text
              style={{ fontFamily: FONT_FAMILY.semibold }}
              className="text-base text-foreground"
            >
              Activités récentes
            </Text>
          </View>
          {mockActivities.map((activity, index) => (
            <View
              key={`${activity.type}-${index}`}
              className={`flex-row items-start gap-3 ${
                index === mockActivities.length - 1 ? '' : 'mb-3 border-b border-border pb-3'
              }`}
            >
              <View
                className="mt-2 h-2 w-2 rounded-full"
                style={{ backgroundColor: activityDotColor[activity.type] }}
              />
              <View className="flex-1">
                <Text
                  style={{ fontFamily: FONT_FAMILY.medium }}
                  className="text-sm text-foreground"
                >
                  {activity.desc}
                </Text>
                <Text
                  style={{ fontFamily: FONT_FAMILY.regular }}
                  className="mt-1 text-xs text-muted-foreground"
                >
                  {activity.date}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

function StatCard({ stat }: { stat: StatTile }) {
  const { Icon, label, value, color, bg } = stat;
  return (
    <View
      className="rounded-xl border border-border bg-card p-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <View
        className="mb-3 h-10 w-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: bg }}
      >
        <Icon color={color} size={20} />
      </View>
      <Text style={{ fontFamily: FONT_FAMILY.bold }} className="mb-1 text-2xl text-foreground">
        {value}
      </Text>
      <Text style={{ fontFamily: FONT_FAMILY.regular }} className="text-xs text-muted-foreground">
        {label}
      </Text>
    </View>
  );
}
