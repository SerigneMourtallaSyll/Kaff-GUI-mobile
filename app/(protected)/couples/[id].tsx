/**
 * Couple Detail Screen — View detailed information about a couple.
 */
import { useState } from 'react';

import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

import { ArrowLeft, Calendar, Heart, X } from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';
import { useCouple, useRompreCouple } from '@/features/couples';
import { Button, DatePicker } from '@/shared/ui';

export default function CoupleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: couple, isLoading, error } = useCouple(id!);
  const rompreCouple = useRompreCouple(id!);

  const [showRompreModal, setShowRompreModal] = useState(false);
  const [dateDissolution, setDateDissolution] = useState('');

  const handleRompre = async () => {
    if (!dateDissolution) {
      Alert.alert('Erreur', 'La date de dissolution est obligatoire');
      return;
    }

    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir dissoudre ce couple ? Cette action est irréversible.',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Dissoudre',
          style: 'destructive',
          onPress: async () => {
            try {
              await rompreCouple.mutateAsync({ dateDissolution });
              Alert.alert('Succès', 'Couple dissous avec succès');
              setShowRompreModal(false);
              setDateDissolution('');
              router.back();
            } catch (error: any) {
              Alert.alert('Erreur', error.message || 'Impossible de dissoudre le couple');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <View className="bg-primary px-4 pb-4 pt-12">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Retour"
              className="rounded-lg p-2 active:bg-white/20"
            >
              <ArrowLeft color="#FFFFFF" size={24} />
            </Pressable>
            <Text
              style={{ fontFamily: FONT_FAMILY.semibold }}
              className="flex-1 text-xl text-white"
            >
              Détails du couple
            </Text>
          </View>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="mt-4 text-sm text-muted-foreground"
          >
            Chargement...
          </Text>
        </View>
      </View>
    );
  }

  if (error || !couple) {
    return (
      <View className="flex-1 bg-background">
        <View className="bg-primary px-4 pb-4 pt-12">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Retour"
              className="rounded-lg p-2 active:bg-white/20"
            >
              <ArrowLeft color="#FFFFFF" size={24} />
            </Pressable>
            <Text
              style={{ fontFamily: FONT_FAMILY.semibold }}
              className="flex-1 text-xl text-white"
            >
              Détails du couple
            </Text>
          </View>
        </View>
        <View className="flex-1 items-center justify-center px-4">
          <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-base text-danger">
            Erreur de chargement
          </Text>
          <Text
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="mt-2 text-center text-sm text-muted-foreground"
          >
            Impossible de charger les détails du couple
          </Text>
          <Button onPress={() => router.back()} className="mt-4">
            Retour
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-primary px-4 pb-4 pt-12">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Retour"
            className="rounded-lg p-2 active:bg-white/20"
          >
            <ArrowLeft color="#FFFFFF" size={24} />
          </Pressable>
          <Text style={{ fontFamily: FONT_FAMILY.semibold }} className="flex-1 text-xl text-white">
            Couple #{couple.id.slice(0, 8)}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Main Info Card */}
        <View className="mb-4 rounded-2xl bg-card p-5">
          <View className="mb-4 flex-row items-center gap-3">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-chart-4/10">
              <Heart color="#E5B854" size={32} />
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: FONT_FAMILY.bold }} className="text-xl text-foreground">
                Couple #{couple.id.slice(0, 8)}
              </Text>
              <View className="mt-1 flex-row items-center gap-2">
                <View
                  className={`rounded px-2 py-1 ${couple.statut === 'ACTIF' ? 'bg-primary/10' : 'bg-muted'}`}
                >
                  <Text
                    style={{ fontFamily: FONT_FAMILY.medium }}
                    className={`text-xs ${couple.statut === 'ACTIF' ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {couple.statut}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="gap-3">
            <InfoRow
              icon={<Calendar color="#6B7280" size={18} />}
              label="Date de formation"
              value={new Date(couple.dateFormation).toLocaleDateString('fr-FR')}
            />
            {couple.dateDissolution && (
              <InfoRow
                icon={<Calendar color="#6B7280" size={18} />}
                label="Date de dissolution"
                value={new Date(couple.dateDissolution).toLocaleDateString('fr-FR')}
              />
            )}
            <InfoRow
              icon={<Heart color="#6B7280" size={18} />}
              label="Reproductions"
              value={`${couple.nbReproductions} ponte${couple.nbReproductions > 1 ? 's' : ''}`}
            />
          </View>
        </View>

        {/* Pigeons Card */}
        <View className="mb-4 rounded-2xl bg-card p-5">
          <Text
            style={{ fontFamily: FONT_FAMILY.semibold }}
            className="mb-3 text-base text-foreground"
          >
            Pigeons du couple
          </Text>

          {/* Male */}
          <Pressable
            onPress={() => router.push(`/(protected)/pigeons/${couple.male.id}` as any)}
            className="mb-3 rounded-lg bg-muted p-3 active:opacity-70"
          >
            <View className="flex-row items-center gap-2">
              <Text style={{ fontFamily: FONT_FAMILY.bold }} className="text-lg text-male">
                ♂
              </Text>
              <View className="flex-1">
                <Text
                  style={{ fontFamily: FONT_FAMILY.semibold }}
                  className="text-sm text-foreground"
                >
                  {couple.male.bague}
                </Text>
                <Text
                  style={{ fontFamily: FONT_FAMILY.regular }}
                  className="text-xs text-muted-foreground"
                >
                  {couple.male.race} • {couple.male.statut}
                </Text>
              </View>
              <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-xs text-primary">
                Voir →
              </Text>
            </View>
          </Pressable>

          {/* Femelle */}
          <Pressable
            onPress={() => router.push(`/(protected)/pigeons/${couple.femelle.id}` as any)}
            className="rounded-lg bg-muted p-3 active:opacity-70"
          >
            <View className="flex-row items-center gap-2">
              <Text style={{ fontFamily: FONT_FAMILY.bold }} className="text-lg text-female">
                ♀
              </Text>
              <View className="flex-1">
                <Text
                  style={{ fontFamily: FONT_FAMILY.semibold }}
                  className="text-sm text-foreground"
                >
                  {couple.femelle.bague}
                </Text>
                <Text
                  style={{ fontFamily: FONT_FAMILY.regular }}
                  className="text-xs text-muted-foreground"
                >
                  {couple.femelle.race} • {couple.femelle.statut}
                </Text>
              </View>
              <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-xs text-primary">
                Voir →
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Actions */}
        {couple.statut === 'ACTIF' && (
          <View className="mb-6">
            <Text
              style={{ fontFamily: FONT_FAMILY.semibold }}
              className="mb-3 text-base text-foreground"
            >
              Actions
            </Text>
            <Button variant="outline" onPress={() => setShowRompreModal(true)}>
              Dissoudre le couple
            </Button>
          </View>
        )}
      </ScrollView>

      {/* Rompre Modal */}
      <Modal
        visible={showRompreModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRompreModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <Pressable className="flex-1" onPress={() => setShowRompreModal(false)} />
          <View className="max-h-[80%] rounded-t-3xl bg-white px-6 pb-8 pt-6">
            <View className="mb-4 flex-row items-center justify-between">
              <Text style={{ fontFamily: FONT_FAMILY.bold }} className="text-lg text-foreground">
                Dissoudre le couple
              </Text>
              <Pressable
                onPress={() => setShowRompreModal(false)}
                hitSlop={8}
                className="rounded-lg p-2 active:bg-muted"
              >
                <X color="#030213" size={20} />
              </Pressable>
            </View>

            <ScrollView className="mb-4" keyboardShouldPersistTaps="handled">
              <DatePicker
                label="Date de dissolution"
                value={dateDissolution}
                onChange={setDateDissolution}
                required
                placeholder="Sélectionner une date"
              />
            </ScrollView>

            <View className="gap-2">
              <Button onPress={handleRompre} disabled={rompreCouple.isPending}>
                {rompreCouple.isPending ? 'Enregistrement...' : 'Dissoudre'}
              </Button>
              <Button variant="outline" onPress={() => setShowRompreModal(false)}>
                Annuler
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View className="flex-row items-center gap-3">
      {icon}
      <View className="flex-1 flex-row items-center justify-between">
        <Text style={{ fontFamily: FONT_FAMILY.regular }} className="text-sm text-muted-foreground">
          {label}
        </Text>
        <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-sm text-foreground">
          {value}
        </Text>
      </View>
    </View>
  );
}
