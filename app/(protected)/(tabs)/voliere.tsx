import { Text } from 'react-native';

import { Card, Heading, Screen } from '@/shared/ui';

export default function VoliereScreen() {
  return (
    <Screen contentClassName="px-4 pt-4">
      <Heading level="h1" className="mb-2">
        Visualisation Volière
      </Heading>
      <Card>
        <Text className="text-foreground">
          Écran central (US-CAG-01). Grille interactive (libre/pigeon/couple) à venir.
        </Text>
      </Card>
    </Screen>
  );
}
