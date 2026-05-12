/**
 * Volière — US-CAG-01 / US-CAG-02 / US-CAG-03.
 *
 * Central differentiator of the product:
 *   - Legend card explaining the colour code.
 *   - 4-column grid of cage tiles (`CageIllustration`).
 *   - Tap → bottom sheet with cage details + contextual actions
 *     (affecter pigeon, affecter couple, libérer la cage).
 *
 * Data is mocked here; once `pigeons` and `cages` features are wired to the
 * backend, replace `mockCages` with a `useCages()` query that returns a
 * paginated list. The UI is already aspect-ratio-stable, ready for
 * skeletons during loading.
 */
import { useState } from 'react';

import { Modal, Pressable, Text, View } from 'react-native';

import { Bird, Info, Users, X } from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';
import { useLogout } from '@/features/auth';
import { AppHeader, Button, CageIllustration, Screen, type CageStatus } from '@/shared/ui';

interface Cage {
  id: number;
  numero: string;
  status: CageStatus;
  pigeon?: { bague: string; nom: string; sexe: 'MALE' | 'FEMALE' };
  couple?: { male: string; femelle: string };
}

const mockCages: Cage[] = [
  {
    id: 1,
    numero: 'A1',
    status: 'occupee-pigeon',
    pigeon: { bague: 'B2024-001', nom: 'Sultan', sexe: 'MALE' },
  },
  { id: 2, numero: 'A2', status: 'libre' },
  {
    id: 3,
    numero: 'A3',
    status: 'occupee-couple',
    couple: { male: 'B2024-005', femelle: 'B2024-006' },
  },
  {
    id: 4,
    numero: 'A4',
    status: 'occupee-pigeon',
    pigeon: { bague: 'B2024-012', nom: 'Princesse', sexe: 'FEMALE' },
  },
  { id: 5, numero: 'B1', status: 'libre' },
  {
    id: 6,
    numero: 'B2',
    status: 'occupee-couple',
    couple: { male: 'B2024-020', femelle: 'B2024-021' },
  },
  {
    id: 7,
    numero: 'B3',
    status: 'occupee-pigeon',
    pigeon: { bague: 'B2024-033', nom: 'Champion', sexe: 'MALE' },
  },
  { id: 8, numero: 'B4', status: 'libre' },
  {
    id: 9,
    numero: 'C1',
    status: 'occupee-couple',
    couple: { male: 'B2024-040', femelle: 'B2024-041' },
  },
  {
    id: 10,
    numero: 'C2',
    status: 'occupee-pigeon',
    pigeon: { bague: 'B2024-045', nom: 'Reine', sexe: 'FEMALE' },
  },
  { id: 11, numero: 'C3', status: 'libre' },
  {
    id: 12,
    numero: 'C4',
    status: 'occupee-couple',
    couple: { male: 'B2024-050', femelle: 'B2024-051' },
  },
  {
    id: 13,
    numero: 'D1',
    status: 'occupee-pigeon',
    pigeon: { bague: 'B2024-060', nom: 'Warrior', sexe: 'MALE' },
  },
  { id: 14, numero: 'D2', status: 'libre' },
  {
    id: 15,
    numero: 'D3',
    status: 'occupee-pigeon',
    pigeon: { bague: 'B2024-070', nom: 'Beauty', sexe: 'FEMALE' },
  },
  { id: 16, numero: 'D4', status: 'libre' },
  {
    id: 17,
    numero: 'E1',
    status: 'occupee-couple',
    couple: { male: 'B2024-080', femelle: 'B2024-081' },
  },
  { id: 18, numero: 'E2', status: 'libre' },
  {
    id: 19,
    numero: 'E3',
    status: 'occupee-pigeon',
    pigeon: { bague: 'B2024-090', nom: 'Spirit', sexe: 'MALE' },
  },
  { id: 20, numero: 'E4', status: 'libre' },
];

const LEGEND: { color: string; label: string }[] = [
  { color: '#4CAF50', label: 'Cage libre' },
  { color: '#F44336', label: 'Occupée - 1 pigeon' },
  { color: '#FF9800', label: 'Occupée - Couple' },
];

export default function VoliereScreen() {
  const logout = useLogout();
  const [selectedCage, setSelectedCage] = useState<Cage | null>(null);

  return (
    <>
      <Screen scroll className="bg-background" contentClassName="pb-6" edges={['bottom']}>
        <AppHeader title="Visualisation Volière" onLogout={() => logout.mutate()} />

        <View className="px-4 pt-6">
          {/* Legend */}
          <View className="mb-4 rounded-xl border border-border bg-card p-4">
            <View className="mb-3 flex-row items-center gap-2">
              <Info color="#030213" size={20} />
              <Text
                style={{ fontFamily: FONT_FAMILY.semibold }}
                className="text-base text-foreground"
              >
                Légende
              </Text>
            </View>
            <View className="gap-2">
              {LEGEND.map((item) => (
                <View key={item.label} className="flex-row items-center gap-3">
                  <View className="h-6 w-6 rounded" style={{ backgroundColor: item.color }} />
                  <Text
                    style={{ fontFamily: FONT_FAMILY.regular }}
                    className="text-sm text-foreground"
                  >
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Cage grid */}
          <View className="rounded-xl border border-border bg-muted p-4">
            <Text
              style={{ fontFamily: FONT_FAMILY.semibold }}
              className="mb-4 text-base text-foreground"
            >
              Grille des Cages
            </Text>
            <View className="-mx-1.5 flex-row flex-wrap">
              {mockCages.map((cage) => (
                <View key={cage.id} className="w-1/4 px-1.5 pb-3">
                  <Pressable
                    onPress={() => setSelectedCage(cage)}
                    accessibilityRole="button"
                    accessibilityLabel={`Cage ${cage.numero}`}
                    className="rounded-xl bg-white p-2 active:opacity-80"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.08,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <CageIllustration status={cage.status} numero={cage.numero} />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Screen>

      <CageDetailsSheet cage={selectedCage} onClose={() => setSelectedCage(null)} />
    </>
  );
}

function CageDetailsSheet({ cage, onClose }: { cage: Cage | null; onClose: () => void }) {
  return (
    <Modal visible={cage !== null} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="rounded-t-3xl bg-white px-6 pb-8 pt-6"
        >
          {cage ? <CageDetails cage={cage} onClose={onClose} /> : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function CageDetails({ cage, onClose }: { cage: Cage; onClose: () => void }) {
  return (
    <View>
      <View className="mb-4 flex-row items-center justify-between">
        <Text style={{ fontFamily: FONT_FAMILY.bold }} className="text-lg text-foreground">
          Cage {cage.numero}
        </Text>
        <Pressable
          onPress={onClose}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Fermer"
          className="rounded-lg p-2 active:bg-muted"
        >
          <X color="#030213" size={20} />
        </Pressable>
      </View>

      {cage.status === 'libre' && (
        <View className="items-center py-8">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Bird color="#030213" size={32} />
          </View>
          <Text style={{ fontFamily: FONT_FAMILY.regular }} className="mb-4 text-muted-foreground">
            Cage libre
          </Text>
          <View className="w-full gap-2">
            <Button onPress={() => {}}>Affecter un pigeon</Button>
            <Button variant="outline" onPress={() => {}}>
              Affecter un couple
            </Button>
          </View>
        </View>
      )}

      {cage.status === 'occupee-pigeon' && cage.pigeon && (
        <View>
          <View className="mb-4 gap-2 rounded-lg bg-muted p-4">
            <DetailRow label="Bague" value={cage.pigeon.bague} />
            <DetailRow label="Nom" value={cage.pigeon.nom} />
            <DetailRow label="Sexe" value={cage.pigeon.sexe === 'MALE' ? '♂ Mâle' : '♀ Femelle'} />
          </View>
          <Button variant="destructive" onPress={() => {}}>
            Libérer la cage
          </Button>
        </View>
      )}

      {cage.status === 'occupee-couple' && cage.couple && (
        <View>
          <View className="mb-4 gap-2 rounded-lg bg-muted p-4">
            <DetailRow
              label="Mâle"
              value={cage.couple.male}
              icon={<Users color="#2563EB" size={16} />}
            />
            <DetailRow
              label="Femelle"
              value={cage.couple.femelle}
              icon={<Users color="#DB2777" size={16} />}
            />
          </View>
          <View className="gap-2">
            <Button onPress={() => {}}>Voir détails du couple</Button>
            <Button variant="destructive" onPress={() => {}}>
              Libérer la cage
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

function DetailRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        {icon}
        <Text style={{ fontFamily: FONT_FAMILY.regular }} className="text-sm text-muted-foreground">
          {label}
        </Text>
      </View>
      <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-sm text-foreground">
        {value}
      </Text>
    </View>
  );
}
