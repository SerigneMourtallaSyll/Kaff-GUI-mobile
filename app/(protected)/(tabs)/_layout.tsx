/**
 * Bottom-tabs layout — main navigation hub for the authenticated app.
 */
import { Tabs } from 'expo-router';

import { Bird, Grid3X3, Heart, LayoutDashboard, TrendingDown } from 'lucide-react-native';

import { palette } from '@/core/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary.DEFAULT,
        tabBarInactiveTintColor: palette.mutedForeground,
        tabBarStyle: {
          borderTopColor: palette.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Tableau',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="voliere"
        options={{
          title: 'Volière',
          tabBarIcon: ({ color, size }) => <Grid3X3 color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="pigeons"
        options={{
          title: 'Pigeons',
          tabBarIcon: ({ color, size }) => <Bird color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="couples"
        options={{
          title: 'Couples',
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="sorties"
        options={{
          title: 'Sorties',
          tabBarIcon: ({ color, size }) => <TrendingDown color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
