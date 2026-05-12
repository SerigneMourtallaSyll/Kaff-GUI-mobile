import { Text } from 'react-native';

import { Card, Heading, Screen } from '@/shared/ui';

export default function PigeonsScreen() {
  return (
    <Screen contentClassName="px-4 pt-4">
      <Heading level="h1" className="mb-2">
        Pigeons
      </Heading>
      <Card>
        <Text className="text-foreground">
          Liste des pigeons (US-PIG-01 → US-PIG-04). À implémenter.
        </Text>
      </Card>
    </Screen>
  );
}
