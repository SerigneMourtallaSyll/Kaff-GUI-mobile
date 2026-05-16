/**
 * Dashboard — US-DASH-01.
 *
 * Snapshot of the colombier:
 *   - Weather widget with current conditions
 *   - 4 KPI tiles (active pigeons, free cages, active couples, monthly exits).
 *   - Gradient CTA to jump to the Volière (US-CAG-01).
 *   - Latest activities feed (recent reproductions).
 */
import type { ComponentType } from 'react';

import { ActivityIndicator, Pressable, RefreshControl, Text, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import {
  AlertCircle,
  Bird,
  Box,
  Cloud,
  CloudDrizzle,
  CloudRain,
  Droplets,
  Grid3X3,
  Heart,
  type LucideProps,
  Sun,
  TrendingDown,
  Wind,
} from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';
import { useLogout } from '@/features/auth';
import { useDashboardStats } from '@/features/dashboard';
import { useWeather } from '@/services/weather';
import { AppHeader, Screen } from '@/shared/ui';

interface StatTile {
  label: string;
  value: number;
  Icon: ComponentType<LucideProps>;
  color: string;
  bg: string;
  route?: string;
}

// Modern weather icon mapping
function getWeatherIcon(condition: string, size: number = 48) {
  const iconProps = { size, color: '#FFFFFF', strokeWidth: 1.5 };

  switch (condition) {
    case 'sunny':
    case 'clear':
      return <Sun {...iconProps} />;
    case 'partly-cloudy':
      return <Cloud {...iconProps} />;
    case 'cloudy':
      return <Cloud {...iconProps} />;
    case 'rainy':
      return <CloudRain {...iconProps} />;
    case 'stormy':
      return <CloudDrizzle {...iconProps} />;
    default:
      return <Sun {...iconProps} />;
  }
}

// Modern gradient colors for weather
function getModernWeatherGradient(temp: number, condition: string): [string, string] {
  // Rainy/Stormy - Cool gray-blue
  if (condition === 'rainy' || condition === 'stormy') {
    return ['#667EEA', '#764BA2'];
  }

  // Hot (>30°C) - Warm sunset
  if (temp > 30) {
    return ['#F093FB', '#F5576C'];
  }

  // Warm (25-30°C) - Golden hour
  if (temp > 25) {
    return ['#FA709A', '#FEE140'];
  }

  // Pleasant (20-25°C) - Fresh green-blue
  if (temp > 20) {
    return ['#4FACFE', '#00F2FE'];
  }

  // Cool (<20°C) - Cool blue
  return ['#667EEA', '#764BA2'];
}

export default function DashboardScreen() {
  const logout = useLogout();
  const { data: stats, isLoading, error, refetch, isRefetching } = useDashboardStats();
  const { data: weather, isLoading: weatherLoading } = useWeather();

  const handleRefresh = () => {
    refetch();
  };

  // Map API data to stat tiles with modern colors
  const statTiles: StatTile[] = stats
    ? [
        {
          label: 'Pigeons actifs',
          value: stats.pigeons.actifs,
          Icon: Bird,
          color: '#6366F1',
          bg: '#EEF2FF',
          route: '/(protected)/(tabs)/pigeons',
        },
        {
          label: 'Cages libres',
          value: stats.cages.libres,
          Icon: Box,
          color: '#10B981',
          bg: '#D1FAE5',
          route: '/(protected)/(tabs)/voliere',
        },
        {
          label: 'Couples actifs',
          value: stats.couplesActifs,
          Icon: Heart,
          color: '#F59E0B',
          bg: '#FEF3C7',
          route: '/(protected)/(tabs)/couples',
        },
        {
          label: 'Sorties (total)',
          value: stats.pigeons.vendus + stats.pigeons.morts + stats.pigeons.perdus,
          Icon: TrendingDown,
          color: '#EF4444',
          bg: '#FEE2E2',
          route: '/(protected)/(tabs)/sorties',
        },
      ]
    : [];

  return (
    <View className="flex-1 bg-background">
      <AppHeader title="Tableau de bord" onLogout={() => logout.mutate()} />
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
          {/* Modern Weather Widget */}
          {weather && !weatherLoading && (
            <LinearGradient
              colors={getModernWeatherGradient(weather.temperature, weather.condition)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="mb-6 p-6"
              style={{
                borderRadius: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text
                    style={{ fontFamily: FONT_FAMILY.medium }}
                    className="mb-1 text-sm text-white/90"
                  >
                    📍 {weather.location}
                  </Text>
                  <View className="mb-2 flex-row items-baseline">
                    <Text style={{ fontFamily: FONT_FAMILY.bold }} className="text-6xl text-white">
                      {weather.temperature}
                    </Text>
                    <Text
                      style={{ fontFamily: FONT_FAMILY.semibold }}
                      className="ml-1 text-3xl text-white/90"
                    >
                      °C
                    </Text>
                  </View>
                  <Text
                    style={{ fontFamily: FONT_FAMILY.medium }}
                    className="text-lg capitalize text-white/95"
                  >
                    {weather.description}
                  </Text>
                </View>
                <View className="items-center justify-center">
                  {getWeatherIcon(weather.condition, 64)}
                </View>
              </View>

              <View className="mt-6 flex-row items-center gap-6 border-t border-white/20 pt-5">
                <View className="flex-row items-center gap-2">
                  <Droplets color="#FFFFFF" size={18} opacity={0.9} strokeWidth={2} />
                  <Text
                    style={{ fontFamily: FONT_FAMILY.medium }}
                    className="text-sm text-white/90"
                  >
                    {weather.humidity}%
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Wind color="#FFFFFF" size={18} opacity={0.9} strokeWidth={2} />
                  <Text
                    style={{ fontFamily: FONT_FAMILY.medium }}
                    className="text-sm text-white/90"
                  >
                    {weather.windSpeed} km/h
                  </Text>
                </View>
              </View>
            </LinearGradient>
          )}

          {/* Loading state */}
          {isLoading ? (
            <View className="items-center py-12">
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text
                style={{ fontFamily: FONT_FAMILY.regular }}
                className="mt-4 text-sm text-muted-foreground"
              >
                Chargement des statistiques...
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
                Impossible de charger les statistiques
              </Text>
            </View>
          ) : null}

          {/* Modern Stats grid */}
          {!isLoading && !error && stats ? (
            <>
              <View className="-mx-2 mb-6 flex-row flex-wrap">
                {statTiles.map((stat) => (
                  <View key={stat.label} className="w-1/2 px-2 pb-4">
                    <StatCard stat={stat} />
                  </View>
                ))}
              </View>

              {/* Volière CTA */}
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/(protected)/(tabs)/voliere')}
                className="mb-6 overflow-hidden rounded-3xl"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.25,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <LinearGradient
                  colors={['#1E293B', '#334155']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ padding: 24 }}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 pr-4">
                      <Text
                        style={{ fontFamily: FONT_FAMILY.bold }}
                        className="mb-2 text-xl text-white"
                      >
                        Visualiser la Volière
                      </Text>
                      <Text
                        style={{ fontFamily: FONT_FAMILY.regular }}
                        className="text-sm text-white/80"
                      >
                        Vue interactive des cages
                      </Text>
                    </View>
                    <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                      <Grid3X3 color="#FFFFFF" size={28} strokeWidth={2} />
                    </View>
                  </View>
                </LinearGradient>
              </Pressable>

              {/* Recent reproductions */}
              <View className="rounded-3xl border border-border/50 bg-card p-6">
                <View className="mb-5 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <AlertCircle color="#4CAF50" size={20} strokeWidth={2.5} />
                    </View>
                    <Text
                      style={{ fontFamily: FONT_FAMILY.bold }}
                      className="text-lg text-foreground"
                    >
                      Dernières reproductions
                    </Text>
                  </View>
                </View>
                {stats.dernieresReproductions.length > 0 ? (
                  stats.dernieresReproductions.map((repro, index) => (
                    <View
                      key={repro.id}
                      className={`flex-row items-start gap-3 ${
                        index === stats.dernieresReproductions.length - 1
                          ? ''
                          : 'mb-4 border-b border-border/30 pb-4'
                      }`}
                    >
                      <View className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                      <View className="flex-1">
                        <Text
                          style={{ fontFamily: FONT_FAMILY.semibold }}
                          className="mb-1 text-sm text-foreground"
                        >
                          {repro.maleBague} × {repro.femelleBague}
                        </Text>
                        <View className="flex-row items-center gap-3">
                          <Text
                            style={{ fontFamily: FONT_FAMILY.regular }}
                            className="text-xs text-muted-foreground"
                          >
                            📅 {new Date(repro.datePonte).toLocaleDateString('fr-FR')}
                          </Text>
                          <Text
                            style={{ fontFamily: FONT_FAMILY.regular }}
                            className="text-xs text-muted-foreground"
                          >
                            🥚 {repro.nbPigeonneaux} pigeonneau{repro.nbPigeonneaux > 1 ? 'x' : ''}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="items-center py-8">
                    <Text
                      style={{ fontFamily: FONT_FAMILY.regular }}
                      className="text-sm text-muted-foreground"
                    >
                      Aucune reproduction récente
                    </Text>
                  </View>
                )}
              </View>
            </>
          ) : null}
        </View>
      </Screen>
    </View>
  );
}

function StatCard({ stat }: { stat: StatTile }) {
  const { Icon, label, value, color, route } = stat;

  // Create gradient colors based on the main color
  const getGradientColors = (mainColor: string): [string, string] => {
    const gradients: Record<string, [string, string]> = {
      '#6366F1': ['#818CF8', '#6366F1'], // Indigo
      '#10B981': ['#34D399', '#10B981'], // Green
      '#F59E0B': ['#FBBF24', '#F59E0B'], // Amber
      '#EF4444': ['#F87171', '#EF4444'], // Red
    };
    return gradients[mainColor] || [mainColor, mainColor];
  };

  const [gradientStart, gradientEnd] = getGradientColors(color);

  const content = (
    <LinearGradient
      colors={[gradientStart, gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="p-5"
      style={{
        borderRadius: 24,
        shadowColor: color,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
        minHeight: 140,
      }}
    >
      {/* Icon in top right with subtle background */}
      <View className="absolute right-4 top-4 h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
        <Icon color="#FFFFFF" size={24} strokeWidth={2.5} />
      </View>

      {/* Value and label */}
      <View className="mt-8">
        <Text style={{ fontFamily: FONT_FAMILY.bold }} className="mb-2 text-5xl text-white">
          {value}
        </Text>
        <Text style={{ fontFamily: FONT_FAMILY.semibold }} className="text-sm text-white/90">
          {label}
        </Text>
      </View>

      {/* Decorative element */}
      <View className="absolute bottom-0 right-0 h-20 w-20 rounded-tl-full bg-white/10" />
    </LinearGradient>
  );

  if (route) {
    return (
      <Pressable
        onPress={() => router.push(route as any)}
        accessibilityRole="button"
        className="active:opacity-90"
      >
        {content}
      </Pressable>
    );
  }

  return content;
}
