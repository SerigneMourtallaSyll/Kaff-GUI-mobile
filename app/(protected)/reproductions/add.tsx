/**
 * Add Reproduction Screen — US-REP-02 (enregistrer une ponte).
 *
 * Form to create a new reproduction by selecting a couple and entering ponte details.
 */
import { useState } from 'react';

import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { router } from 'expo-router';

import { ArrowLeft } from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';
import { useCouples } from '@/features/couples';
import { useCreateReproduction } from '@/features/reproductions';
import { Button, DatePicker } from '@/shared/ui';

export default function AddReproductionScreen() {
  const createReproduction = useCreateReproduction();
  const [datePonte, setDatePonte] = useState('');
  const [nbOeufs, setNbOeufs] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCoupleId, setSelectedCoupleId] = useState<string | null>(null);

  // Fetch active couples
  const { data: couplesData } = useCouples({ statut: 'ACTIF' });
  const couples = couplesData?.results || [];
  const selectedCouple = couples.find((c) => c.id === selectedCoupleId);

  const handleSubmit = async () => {
    // Validation
    if (!selectedCoupleId) {
      Alert.alert('Erreur', 'Sélectionnez un couple');
      return;
    }
    if (!datePonte) {
      Alert.alert('Erreur', 'La date de ponte est obligatoire');
      return;
    }
    if (!nbOeufs.trim()) {
      Alert.alert('Erreur', "Le nombre d'œufs est obligatoire");
      return;
    }

    const oeufsCount = parseInt(nbOeufs, 10);
    if (isNaN(oeufsCount) || oeufsCount < 1) {
      Alert.alert('Erreur', "Le nombre d'œufs doit être au moins 1");
      return;
    }

    try {
      await createReproduction.mutateAsync({
        coupleId: selectedCoupleId,
        datePonte,
        nbOeufs: oeufsCount,
        notes: notes.trim() || undefined,
      });

      Alert.alert('Succès', 'Ponte enregistrée avec succès', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || "Impossible d'enregistrer la ponte");
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
            Enregistrer une ponte
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" keyboardShouldPersistTaps="handled">
        {/* Select Couple */}
        <View className="mb-4">
          <Text style={{ fontFamily: FONT_FAMILY.medium }} className="mb-2 text-sm text-foreground">
            Couple <Text className="text-danger">*</Text>
          </Text>
          <View className="rounded-lg border border-border bg-card p-3">
            {selectedCouple ? (
              <View className="flex-row items-center justify-between">
                <View>
                  <Text
                    style={{ fontFamily: FONT_FAMILY.semibold }}
                    className="text-base text-foreground"
                  >
                    ♂ {selectedCouple.male.bague} × ♀ {selectedCouple.femelle.bague}
                  </Text>
                  <Text
                    style={{ fontFamily: FONT_FAMILY.regular }}
                    className="text-sm text-muted-foreground"
                  >
                    {selectedCouple.male.race} / {selectedCouple.femelle.race}
                  </Text>
                </View>
                <Pressable
                  onPress={() => setSelectedCoupleId(null)}
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
                  Sélectionnez un couple actif:
                </Text>
                <ScrollView className="max-h-60">
                  {couples.map((couple) => (
                    <Pressable
                      key={couple.id}
                      onPress={() => setSelectedCoupleId(couple.id)}
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
                  {couples.length === 0 ? (
                    <Text
                      style={{ fontFamily: FONT_FAMILY.regular }}
                      className="text-sm text-muted-foreground"
                    >
                      Aucun couple actif disponible
                    </Text>
                  ) : null}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* Date de ponte */}
        <DatePicker
          label="Date de ponte"
          value={datePonte}
          onChange={setDatePonte}
          required
          placeholder="Sélectionner une date"
        />
        <View className="mb-4" />

        {/* Nombre d'œufs */}
        <View className="mb-4">
          <Text style={{ fontFamily: FONT_FAMILY.medium }} className="mb-2 text-sm text-foreground">
            Nombre d&apos;œufs <Text className="text-danger">*</Text>
          </Text>
          <TextInput
            value={nbOeufs}
            onChangeText={setNbOeufs}
            placeholder="Ex: 2"
            placeholderTextColor="#9C9CB1"
            keyboardType="number-pad"
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="h-12 rounded-lg border border-border bg-input px-3 text-base text-foreground"
          />
        </View>

        {/* Notes */}
        <View className="mb-6">
          <Text style={{ fontFamily: FONT_FAMILY.medium }} className="mb-2 text-sm text-foreground">
            Notes
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes optionnelles..."
            placeholderTextColor="#9C9CB1"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="rounded-lg border border-border bg-input p-3 text-base text-foreground"
          />
        </View>

        {/* Submit button */}
        <Button onPress={handleSubmit} disabled={createReproduction.isPending} className="mb-6">
          {createReproduction.isPending ? 'Enregistrement en cours...' : 'Enregistrer la ponte'}
        </Button>
      </ScrollView>
    </View>
  );
}
