import { Link, Stack } from 'expo-router';

import { Heading, Screen } from '@/shared/ui';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page introuvable' }} />
      <Screen contentClassName="items-center justify-center px-6">
        <Heading level="h1" className="mb-4">
          Oups !
        </Heading>
        <Link href="/" className="text-primary underline">
          Retour à l&apos;accueil
        </Link>
      </Screen>
    </>
  );
}
