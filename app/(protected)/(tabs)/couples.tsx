import { Text } from 'react-native';

import { Card, Heading, Screen } from '@/shared/ui';

export default function CouplesScreen() {
  return (
    <Screen contentClassName="px-4 pt-4">
      <Heading level="h1" className="mb-2">
        Couples
      </Heading>
      <Card>
        <Text className="text-foreground">
          Gestion des couples (US-COU-01 → US-COU-03). À implémenter.
        </Text>
      </Card>
    </Screen>
  );
}
