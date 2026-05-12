import { Text, View } from 'react-native';

import { useLogout, selectUser, useAuthStore } from '@/features/auth';
import { Button, Card, Heading, Screen } from '@/shared/ui';

export default function DashboardScreen() {
  const user = useAuthStore(selectUser);
  const logout = useLogout();

  return (
    <Screen contentClassName="px-4 pt-4">
      <Heading level="h1" className="mb-1">
        Tableau de bord
      </Heading>
      <Text className="mb-6 text-muted-foreground">Bonjour {user?.firstName ?? ''} 👋</Text>

      <Card>
        <Text className="text-foreground">
          Squelette prêt. Les statistiques (US-DASH-01) seront branchées sur l&apos;API Django via
          React Query.
        </Text>
      </Card>

      <View className="mt-6">
        <Button variant="outline" onPress={() => logout.mutate()} loading={logout.isPending}>
          Se déconnecter
        </Button>
      </View>
    </Screen>
  );
}
