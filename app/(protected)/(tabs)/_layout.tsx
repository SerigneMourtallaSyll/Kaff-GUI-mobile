/**
 * Bottom-tabs layout — main navigation hub for the authenticated app.
 * Modern floating tab bar design with smooth animations.
 */
import { Platform } from 'react-native';

import { Tabs } from 'expo-router';

import { Bird, Egg, Grid3X3, Heart, LayoutDashboard, TrendingDown } from 'lucide-react-native';

import { FONT_FAMILY, palette } from '@/core/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary.DEFAULT,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 8,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          ...Platform.select({
            android: {
              elevation: 10,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: FONT_FAMILY.semibold,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, focused }) => (
            <LayoutDashboard
              color={color}
              size={focused ? 26 : 24}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="voliere"
        options={{
          title: 'Volière',
          tabBarIcon: ({ color, focused }) => (
            <Grid3X3 color={color} size={focused ? 26 : 24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="pigeons"
        options={{
          title: 'Pigeons',
          tabBarIcon: ({ color, focused }) => (
            <Bird color={color} size={focused ? 26 : 24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="couples"
        options={{
          title: 'Couples',
          tabBarIcon: ({ color, focused }) => (
            <Heart color={color} size={focused ? 26 : 24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="reproductions"
        options={{
          title: 'Pontes',
          tabBarIcon: ({ color, focused }) => (
            <Egg color={color} size={focused ? 26 : 24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="sorties"
        options={{
          title: 'Sorties',
          tabBarIcon: ({ color, focused }) => (
            <TrendingDown color={color} size={focused ? 26 : 24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}
