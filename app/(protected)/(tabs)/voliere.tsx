/**
 * Volière — US-CAG-01 / US-CAG-02 / US-CAG-03.
 *
 * Central differentiator of the product:
 *   - Legend card explaining the colour code.
 *   - 4-column grid of cage tiles (`CageIllustration`).
 *   - Tap → bottom sheet with cage details + contextual actions.
 */
import { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { router } from 'expo-router';

import { Bird, Info, Plus, X } from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';
import { useLogout } from '@/features/auth';
import {
  useAffecterCouple,
  useAffecterPigeon,
  useLibererCage,
  useVolet,
  type VoletCage,
} from '@/features/cages';
import { useCouples } from '@/features/couples';
import { usePigeons } from '@/features/pigeons';
import { AppHeader, Button, CageIllustration, Screen, type CageStatus } from '@/shared/ui';

const LEGEND: { color: string; label: string }[] = [
  { color: '#4CAF50', label: 'Cage libre' },
  { color: '#F44336', label: 'Occupée - 1 pigeon' },
  { color: '#FF9800', label: 'Occupée - Couple' },
];

const STATUS_MAP: Record<string, CageStatus> = {
  LIBRE: 'libre',
  OCCUPE_PIGEON: 'occupee-pigeon',
  OCCUPE_COUPLE: 'occupee-couple',
};

export default function VoliereScreen() {
  const logout = useLogout();
  const [selectedCage, setSelectedCage] = useState<VoletCage | null>(null);
  const { data: cages, isLoading, error, refetch, isRefetching } = useVolet();

  const handleRefresh = () => {
    refetch();
  };

  return (
    <>
      <View className="flex-1 bg-background">
        <AppHeader title="Visualisation Volière" onLogout={() => logout.mutate()} />
        <Screen
          scroll
          className="bg-background"
          contentClassName="pb-6"
          edges={['bottom']}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              colors={['#4CAF50']}
              tintColor="#4CAF50"
            />
          }
        >
          <View className="px-4 pb-24 pt-6">
            {/* Add Cage Button */}
            <Pressable
              onPress={() => router.push('/cages/add')}
              className="mb-4 flex-row items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 active:opacity-80"
            >
              <Plus color="#FFFFFF" size={20} />
              <Text style={{ fontFamily: FONT_FAMILY.semibold }} className="text-base text-white">
                Ajouter une cage
              </Text>
            </Pressable>
            {/* Legend */}
            <View className="mb-4 rounded-2xl bg-card p-5">
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

            {/* Loading state */}
            {isLoading ? (
              <View className="items-center py-12">
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text
                  style={{ fontFamily: FONT_FAMILY.regular }}
                  className="mt-4 text-sm text-muted-foreground"
                >
                  Chargement de la volière...
                </Text>
              </View>
            ) : null}

            {/* Error state */}
            {error ? (
              <View className="items-center py-12">
                <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-base text-danger">
                  Erreur de chargement
                </Text>
                <Text
                  style={{ fontFamily: FONT_FAMILY.regular }}
                  className="mt-2 text-sm text-muted-foreground"
                >
                  Impossible de charger la volière
                </Text>
              </View>
            ) : null}

            {/* Cage grid - 3 columns for better visibility */}
            {!isLoading && !error && cages ? (
              <View className="rounded-2xl bg-muted p-5">
                <Text
                  style={{ fontFamily: FONT_FAMILY.semibold }}
                  className="mb-4 text-base text-foreground"
                >
                  Grille des Cages
                </Text>
                <View className="-mx-2 flex-row flex-wrap">
                  {cages.map((cage) => (
                    <View key={cage.id} className="w-1/3 px-2 pb-4">
                      <Pressable
                        onPress={() => setSelectedCage(cage)}
                        accessibilityRole="button"
                        accessibilityLabel={`Cage ${cage.numero}`}
                        className="rounded-xl bg-white p-3 active:opacity-80"
                        style={{
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.06,
                          shadowRadius: 8,
                          elevation: 2,
                        }}
                      >
                        <CageIllustration
                          status={STATUS_MAP[cage.statutOccupation]}
                          numero={cage.numero}
                        />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        </Screen>
      </View>

      <CageDetailsSheet cage={selectedCage} onClose={() => setSelectedCage(null)} />
    </>
  );
}

function CageDetailsSheet({ cage, onClose }: { cage: VoletCage | null; onClose: () => void }) {
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

function CageDetails({ cage, onClose }: { cage: VoletCage; onClose: () => void }) {
  const libererCage = useLibererCage(cage.id);
  const affecterPigeon = useAffecterPigeon(cage.id);
  const affecterCouple = useAffecterCouple(cage.id);

  // Fetch available pigeons and couples for assignment
  const { data: pigeonsData } = usePigeons({ statut: 'ACTIF' });
  const { data: couplesData } = useCouples();

  const availablePigeons = pigeonsData?.results || [];
  const availableCouples = couplesData?.results || [];

  const [showPigeonPicker, setShowPigeonPicker] = useState(false);
  const [showCouplePicker, setShowCouplePicker] = useState(false);

  const handleLiberer = () => {
    Alert.alert('Libérer la cage', 'Êtes-vous sûr de vouloir libérer cette cage ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Libérer',
        style: 'destructive',
        onPress: async () => {
          try {
            await libererCage.mutateAsync();
            Alert.alert('Succès', 'Cage libérée avec succès');
            onClose();
          } catch (error: any) {
            Alert.alert('Erreur', error.message || 'Impossible de libérer la cage');
          }
        },
      },
    ]);
  };

  const handleAffecterPigeon = async (pigeonId: string) => {
    try {
      await affecterPigeon.mutateAsync({ pigeonId });
      Alert.alert('Succès', 'Pigeon affecté avec succès');
      setShowPigeonPicker(false);
      onClose();
    } catch (error: any) {
      Alert.alert('Erreur', error.message || "Impossible d'affecter le pigeon");
    }
  };

  const handleAffecterCouple = async (coupleId: string) => {
    try {
      await affecterCouple.mutateAsync({ coupleId });
      Alert.alert('Succès', 'Couple affecté avec succès');
      setShowCouplePicker(false);
      onClose();
    } catch (error: any) {
      Alert.alert('Erreur', error.message || "Impossible d'affecter le couple");
    }
  };

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

      {cage.statutOccupation === 'LIBRE' && !showPigeonPicker && !showCouplePicker && (
        <View className="items-center py-8">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Bird color="#030213" size={32} />
          </View>
          <Text style={{ fontFamily: FONT_FAMILY.regular }} className="mb-4 text-muted-foreground">
            Cage libre
          </Text>
          <View className="w-full gap-2">
            <Button onPress={() => setShowPigeonPicker(true)}>Affecter un pigeon</Button>
            <Button variant="outline" onPress={() => setShowCouplePicker(true)}>
              Affecter un couple
            </Button>
          </View>
        </View>
      )}

      {showPigeonPicker && (
        <View>
          <Text
            style={{ fontFamily: FONT_FAMILY.medium }}
            className="mb-3 text-base text-foreground"
          >
            Sélectionner un pigeon
          </Text>
          <ScrollView className="mb-4 max-h-64">
            {availablePigeons.map((pigeon) => (
              <Pressable
                key={pigeon.id}
                onPress={() => handleAffecterPigeon(pigeon.id)}
                disabled={affecterPigeon.isPending}
                className="mb-2 rounded-lg bg-muted p-3 active:bg-muted/70"
              >
                <Text
                  style={{ fontFamily: FONT_FAMILY.medium }}
                  className="text-sm text-foreground"
                >
                  {pigeon.bague}
                </Text>
                <Text
                  style={{ fontFamily: FONT_FAMILY.regular }}
                  className="text-xs text-muted-foreground"
                >
                  {pigeon.race} • {pigeon.sexe === 'MALE' ? '♂ Mâle' : '♀ Femelle'}
                </Text>
              </Pressable>
            ))}
            {availablePigeons.length === 0 && (
              <Text
                style={{ fontFamily: FONT_FAMILY.regular }}
                className="text-sm text-muted-foreground"
              >
                Aucun pigeon disponible
              </Text>
            )}
          </ScrollView>
          <Button variant="outline" onPress={() => setShowPigeonPicker(false)}>
            Annuler
          </Button>
        </View>
      )}

      {showCouplePicker && (
        <View>
          <Text
            style={{ fontFamily: FONT_FAMILY.medium }}
            className="mb-3 text-base text-foreground"
          >
            Sélectionner un couple
          </Text>
          <ScrollView className="mb-4 max-h-64">
            {availableCouples.map((couple) => (
              <Pressable
                key={couple.id}
                onPress={() => handleAffecterCouple(couple.id)}
                disabled={affecterCouple.isPending}
                className="mb-2 rounded-lg bg-muted p-3 active:bg-muted/70"
              >
                <Text
                  style={{ fontFamily: FONT_FAMILY.medium }}
                  className="text-sm text-foreground"
                >
                  ♂ {couple.male.bague} × ♀ {couple.femelle.bague}
                </Text>
                <Text
                  style={{ fontFamily: FONT_FAMILY.regular }}
                  className="text-xs text-muted-foreground"
                >
                  {couple.male.race} / {couple.femelle.race}
                </Text>
              </Pressable>
            ))}
            {availableCouples.length === 0 && (
              <Text
                style={{ fontFamily: FONT_FAMILY.regular }}
                className="text-sm text-muted-foreground"
              >
                Aucun couple disponible
              </Text>
            )}
          </ScrollView>
          <Button variant="outline" onPress={() => setShowCouplePicker(false)}>
            Annuler
          </Button>
        </View>
      )}

      {cage.statutOccupation === 'OCCUPE_PIGEON' && cage.pigeon && (
        <View>
          <View className="mb-4 gap-2 rounded-lg bg-muted p-4">
            <DetailRow label="Bague" value={cage.pigeon.bague} />
            <DetailRow label="Sexe" value={cage.pigeon.sexe === 'MALE' ? '♂ Mâle' : '♀ Femelle'} />
            <DetailRow label="Race" value={cage.pigeon.race} />
          </View>
          <Button variant="destructive" onPress={handleLiberer} disabled={libererCage.isPending}>
            {libererCage.isPending ? 'Libération...' : 'Libérer la cage'}
          </Button>
        </View>
      )}

      {cage.statutOccupation === 'OCCUPE_COUPLE' && cage.couple && (
        <View>
          <View className="mb-4 gap-2 rounded-lg bg-muted p-4">
            <DetailRow
              label="Mâle"
              value={cage.couple.maleBague}
              icon={<Bird color="#2563EB" size={16} />}
            />
            <DetailRow
              label="Femelle"
              value={cage.couple.femelleBague}
              icon={<Bird color="#DB2777" size={16} />}
            />
          </View>
          <View className="gap-2">
            <Button variant="destructive" onPress={handleLiberer} disabled={libererCage.isPending}>
              {libererCage.isPending ? 'Libération...' : 'Libérer la cage'}
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
