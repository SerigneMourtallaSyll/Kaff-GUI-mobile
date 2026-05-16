/**
 * Add Couple Screen — US-COU-02 (former un couple).
 *
 * Form to create a new couple by selecting male and female pigeons.
 */
import { useState } from 'react';

import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { router } from 'expo-router';

import { ArrowLeft } from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';
import { useFormerCouple } from '@/features/couples';
import { usePigeons } from '@/features/pigeons';
import { Button, DatePicker } from '@/shared/ui';

export default function AddCoupleScreen() {
  const formerCouple = useFormerCouple();
  const [dateFormation, setDateFormation] = useState('');
  const [selectedMaleId, setSelectedMaleId] = useState<string | null>(null);
  const [selectedFemaleId, setSelectedFemaleId] = useState<string | null>(null);

  // Fetch active male and female pigeons
  const { data: malesData } = usePigeons({ sexe: 'MALE', statut: 'ACTIF' });
  const { data: femalesData } = usePigeons({ sexe: 'FEMALE', statut: 'ACTIF' });

  const males = malesData?.results || [];
  const females = femalesData?.results || [];

  const selectedMale = males.find((p) => p.id === selectedMaleId);
  const selectedFemale = females.find((p) => p.id === selectedFemaleId);

  const handleSubmit = async () => {
    // Validation
    if (!selectedMaleId) {
      Alert.alert('Erreur', 'Sélectionnez un mâle');
      return;
    }
    if (!selectedFemaleId) {
      Alert.alert('Erreur', 'Sélectionnez une femelle');
      return;
    }
    if (!dateFormation) {
      Alert.alert('Erreur', 'La date de formation est obligatoire');
      return;
    }

    try {
      await formerCouple.mutateAsync({
        maleId: selectedMaleId,
        femelleId: selectedFemaleId,
        dateFormation,
      });

      Alert.alert('Succès', 'Couple formé avec succès', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de former le couple');
    }
  };

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
            Former un couple
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" keyboardShouldPersistTaps="handled">
        {/* Select Male */}
        <View className="mb-4">
          <Text style={{ fontFamily: FONT_FAMILY.medium }} className="mb-2 text-sm text-foreground">
            Mâle <Text className="text-danger">*</Text>
          </Text>
          <View className="rounded-lg border border-border bg-card p-3">
            {selectedMale ? (
              <View className="flex-row items-center justify-between">
                <View>
                  <Text
                    style={{ fontFamily: FONT_FAMILY.semibold }}
                    className="text-base text-foreground"
                  >
                    {selectedMale.bague}
                  </Text>
                  <Text
                    style={{ fontFamily: FONT_FAMILY.regular }}
                    className="text-sm text-muted-foreground"
                  >
                    {selectedMale.race}
                  </Text>
                </View>
                <Pressable
                  onPress={() => setSelectedMaleId(null)}
                  className="rounded bg-danger/10 px-3 py-1"
                >
                  <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-sm text-danger">
                    Changer
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <Text
                  style={{ fontFamily: FONT_FAMILY.regular }}
                  className="mb-2 text-sm text-muted-foreground"
                >
                  Sélectionnez un mâle actif:
                </Text>
                <ScrollView className="max-h-40">
                  {males.map((male) => (
                    <Pressable
                      key={male.id}
                      onPress={() => setSelectedMaleId(male.id)}
                      className="mb-2 rounded-lg bg-muted p-3 active:bg-muted/70"
                    >
                      <Text
                        style={{ fontFamily: FONT_FAMILY.medium }}
                        className="text-sm text-foreground"
                      >
                        {male.bague}
                      </Text>
                      <Text
                        style={{ fontFamily: FONT_FAMILY.regular }}
                        className="text-xs text-muted-foreground"
                      >
                        {male.race}
                      </Text>
                    </Pressable>
                  ))}
                  {males.length === 0 ? (
                    <Text
                      style={{ fontFamily: FONT_FAMILY.regular }}
                      className="text-sm text-muted-foreground"
                    >
                      Aucun mâle actif disponible
                    </Text>
                  ) : null}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* Select Female */}
        <View className="mb-4">
          <Text style={{ fontFamily: FONT_FAMILY.medium }} className="mb-2 text-sm text-foreground">
            Femelle <Text className="text-danger">*</Text>
          </Text>
          <View className="rounded-lg border border-border bg-card p-3">
            {selectedFemale ? (
              <View className="flex-row items-center justify-between">
                <View>
                  <Text
                    style={{ fontFamily: FONT_FAMILY.semibold }}
                    className="text-base text-foreground"
                  >
                    {selectedFemale.bague}
                  </Text>
                  <Text
                    style={{ fontFamily: FONT_FAMILY.regular }}
                    className="text-sm text-muted-foreground"
                  >
                    {selectedFemale.race}
                  </Text>
                </View>
                <Pressable
                  onPress={() => setSelectedFemaleId(null)}
                  className="rounded bg-danger/10 px-3 py-1"
                >
                  <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-sm text-danger">
                    Changer
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <Text
                  style={{ fontFamily: FONT_FAMILY.regular }}
                  className="mb-2 text-sm text-muted-foreground"
                >
                  Sélectionnez une femelle active:
                </Text>
                <ScrollView className="max-h-40">
                  {females.map((female) => (
                    <Pressable
                      key={female.id}
                      onPress={() => setSelectedFemaleId(female.id)}
                      className="mb-2 rounded-lg bg-muted p-3 active:bg-muted/70"
                    >
                      <Text
                        style={{ fontFamily: FONT_FAMILY.medium }}
                        className="text-sm text-foreground"
                      >
                        {female.bague}
                      </Text>
                      <Text
                        style={{ fontFamily: FONT_FAMILY.regular }}
                        className="text-xs text-muted-foreground"
                      >
                        {female.race}
                      </Text>
                    </Pressable>
                  ))}
                  {females.length === 0 ? (
                    <Text
                      style={{ fontFamily: FONT_FAMILY.regular }}
                      className="text-sm text-muted-foreground"
                    >
                      Aucune femelle active disponible
                    </Text>
                  ) : null}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* Date de formation */}
        <DatePicker
          label="Date de formation"
          value={dateFormation}
          onChange={setDateFormation}
          required
          placeholder="Sélectionner une date"
        />
        <View className="mb-6" />

        {/* Submit button */}
        <Button onPress={handleSubmit} disabled={formerCouple.isPending} className="mb-6">
          {formerCouple.isPending ? 'Formation en cours...' : 'Former le couple'}
        </Button>
      </ScrollView>
    </View>
  );
}
