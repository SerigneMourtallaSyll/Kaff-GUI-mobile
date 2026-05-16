/**
 * Add Pigeon Screen — US-PIG-01 (create).
 *
 * Form to create a new pigeon with validation.
 */
import { useState } from 'react';

import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { router } from 'expo-router';

import { ArrowLeft } from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';
import { useCreatePigeon } from '@/features/pigeons';
import { Button, DatePicker } from '@/shared/ui';

export default function AddPigeonScreen() {
  const createPigeon = useCreatePigeon();

  const [bague, setBague] = useState('');
  const [sexe, setSexe] = useState<'MALE' | 'FEMALE'>('MALE');
  const [race, setRace] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [couleur, setCouleur] = useState('');
  const [poids, setPoids] = useState('');

  const handleSubmit = async () => {
    // Validation
    if (!bague.trim()) {
      Alert.alert('Erreur', 'La bague est obligatoire');
      return;
    }
    if (!race.trim()) {
      Alert.alert('Erreur', 'La race est obligatoire');
      return;
    }
    if (!dateNaissance) {
      Alert.alert('Erreur', 'La date de naissance est obligatoire');
      return;
    }

    // Prepare payload
    const payload = {
      bague: bague.trim(),
      sexe,
      race: race.trim(),
      dateNaissance,
      couleur: couleur.trim() || undefined,
      poids: poids ? parseFloat(poids) : undefined,
      photoUrl: undefined,
    };

    try {
      await createPigeon.mutateAsync(payload);

      Alert.alert('Succès', 'Pigeon ajouté avec succès', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('[ADD PIGEON] Error:', error);
      console.error('[ADD PIGEON] Error.fields:', error.fields);
      console.error('[ADD PIGEON] Error.message:', error.message);
      console.error('[ADD PIGEON] Error.cause:', error.cause);
      console.error('[ADD PIGEON] Error.cause.response:', error.cause?.response);
      console.error('[ADD PIGEON] Error.cause.response.data:', error.cause?.response?.data);

      // Extract error message
      let errorMessage = "Impossible d'ajouter le pigeon";

      // Check if it's an AppError with field errors
      if (error.fields && typeof error.fields === 'object') {
        const fieldErrors = Object.entries(error.fields)
          .map(([key, messages]) => {
            if (Array.isArray(messages)) {
              return `${key}: ${messages.join(', ')}`;
            }
            return `${key}: ${messages}`;
          })
          .join('\n');

        if (fieldErrors) {
          errorMessage = fieldErrors;
        }
      } else if (error.cause?.response?.data) {
        // Try to extract from the original axios error
        const data = error.cause.response.data;

        if (typeof data === 'object') {
          const errors = Object.entries(data)
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return `${key}: ${value.join(', ')}`;
              }
              return `${key}: ${value}`;
            })
            .join('\n');

          if (errors) {
            errorMessage = errors;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Erreur de validation', errorMessage);
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
            Ajouter un pigeon
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" keyboardShouldPersistTaps="handled">
        {/* Bague */}
        <View className="mb-4">
          <Text style={{ fontFamily: FONT_FAMILY.medium }} className="mb-2 text-sm text-foreground">
            Bague <Text className="text-danger">*</Text>
          </Text>
          <TextInput
            value={bague}
            onChangeText={setBague}
            placeholder="Ex: FR-2024-001"
            placeholderTextColor="#9C9CB1"
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="h-12 rounded-lg border border-border bg-input px-3 text-base text-foreground"
          />
        </View>

        {/* Sexe */}
        <View className="mb-4">
          <Text style={{ fontFamily: FONT_FAMILY.medium }} className="mb-2 text-sm text-foreground">
            Sexe <Text className="text-danger">*</Text>
          </Text>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => setSexe('MALE')}
              className={`h-12 flex-1 items-center justify-center rounded-lg border ${
                sexe === 'MALE' ? 'border-primary bg-primary/10' : 'border-border bg-input'
              }`}
            >
              <Text
                style={{ fontFamily: FONT_FAMILY.medium }}
                className={sexe === 'MALE' ? 'text-primary' : 'text-muted-foreground'}
              >
                ♂ Mâle
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSexe('FEMALE')}
              className={`h-12 flex-1 items-center justify-center rounded-lg border ${
                sexe === 'FEMALE' ? 'border-primary bg-primary/10' : 'border-border bg-input'
              }`}
            >
              <Text
                style={{ fontFamily: FONT_FAMILY.medium }}
                className={sexe === 'FEMALE' ? 'text-primary' : 'text-muted-foreground'}
              >
                ♀ Femelle
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Race */}
        <View className="mb-4">
          <Text style={{ fontFamily: FONT_FAMILY.medium }} className="mb-2 text-sm text-foreground">
            Race <Text className="text-danger">*</Text>
          </Text>
          <TextInput
            value={race}
            onChangeText={setRace}
            placeholder="Ex: Voyageur"
            placeholderTextColor="#9C9CB1"
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="h-12 rounded-lg border border-border bg-input px-3 text-base text-foreground"
          />
        </View>

        {/* Date de naissance */}
        <DatePicker
          label="Date de naissance"
          value={dateNaissance}
          onChange={setDateNaissance}
          required
          placeholder="Sélectionner une date"
        />
        <View className="mb-4" />

        {/* Couleur */}
        <View className="mb-4">
          <Text style={{ fontFamily: FONT_FAMILY.medium }} className="mb-2 text-sm text-foreground">
            Couleur
          </Text>
          <TextInput
            value={couleur}
            onChangeText={setCouleur}
            placeholder="Ex: Bleu"
            placeholderTextColor="#9C9CB1"
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="h-12 rounded-lg border border-border bg-input px-3 text-base text-foreground"
          />
        </View>

        {/* Poids */}
        <View className="mb-6">
          <Text style={{ fontFamily: FONT_FAMILY.medium }} className="mb-2 text-sm text-foreground">
            Poids (kg)
          </Text>
          <TextInput
            value={poids}
            onChangeText={setPoids}
            placeholder="Ex: 0.45"
            placeholderTextColor="#9C9CB1"
            keyboardType="decimal-pad"
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="h-12 rounded-lg border border-border bg-input px-3 text-base text-foreground"
          />
        </View>

        {/* Submit button */}
        <Button onPress={handleSubmit} disabled={createPigeon.isPending} className="mb-6">
          {createPigeon.isPending ? 'Ajout en cours...' : 'Ajouter le pigeon'}
        </Button>
      </ScrollView>
    </View>
  );
}
