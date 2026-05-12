import { Text } from 'react-native';

import { Card, Heading, Screen } from '@/shared/ui';

export default function SortiesScreen() {
  return (
    <Screen contentClassName="px-4 pt-4">
      <Heading level="h1" className="mb-2">
        Sorties
      </Heading>
      <Card>
        <Text className="text-foreground">
          Vente / Décès / Perte (US-SOR-01 → US-SOR-04). À implémenter.
        </Text>
      </Card>
    </Screen>
  );
}
