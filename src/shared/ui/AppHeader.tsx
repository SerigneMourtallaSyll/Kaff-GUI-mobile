/**
 * AppHeader — sticky top header for protected screens.
 *
 * Port of the prototype `Header.tsx`. Carries the brand mark + a contextual
 * title and an optional logout action. Uses the SafeAreaView's top inset so
 * the header sits below the status bar on every device.
 */
import { Alert, Pressable, StatusBar, Text, View } from 'react-native';

import { Bird, LogOut } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FONT_FAMILY } from '@/core/theme';

interface AppHeaderProps {
  title: string;
  onLogout?: () => void;
}

export function AppHeader({ title, onLogout }: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  const handleLogoutPress = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: onLogout,
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <View
        className="bg-primary"
        style={{
          paddingTop: insets.top,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
              <Bird color="#4CAF50" size={24} />
            </View>
            <View>
              <Text style={{ fontFamily: FONT_FAMILY.semibold }} className="text-base text-white">
                Kàff GUI
              </Text>
              <Text style={{ fontFamily: FONT_FAMILY.regular }} className="text-xs text-white/80">
                {title}
              </Text>
            </View>
          </View>

          {onLogout ? (
            <Pressable
              onPress={handleLogoutPress}
              accessibilityRole="button"
              accessibilityLabel="Déconnexion"
              className="rounded-lg p-2 active:bg-white/10"
              hitSlop={8}
            >
              <LogOut color="#FFFFFF" size={20} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </>
  );
}
