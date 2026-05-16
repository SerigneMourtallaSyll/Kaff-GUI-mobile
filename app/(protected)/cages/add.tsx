/**
 * Add Cage Screen — Create a new cage.
 */
import { useState } from 'react';

import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { router } from 'expo-router';

import { ArrowLeft } from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';
import { useCreateCage } from '@/features/cages';
import { Button } from '@/shared/ui';

export default function AddCageScreen() {
  const createCage = useCreateCage();
  const [numero, setNumero] = useState('');
  const [nom, setNom] = useState('');
  const [superficie, setSuperficie] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    // Validation
    if (!numero.trim()) {
      Alert.alert('Erreur', 'Le numéro de cage est obligatoire');
      return;
    }
    if (!nom.trim()) {
      Alert.alert('Erreur', 'Le nom de la cage est obligatoire');
      return;
    }

    try {
      await createCage.mutateAsync({
        numero: numero.trim(),
        nom: nom.trim(),
        superficie: superficie ? parseFloat(superficie) : undefined,
        description: description.trim() || undefined,
      });

      Alert.alert('Succès', 'Cage créée avec succès', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de créer la cage');
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
            Ajouter une cage
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" keyboardShouldPersistTaps="handled">
        {/* Numéro */}
        <View className="mb-4">
          <Text style={{ fontFamily: FONT_FAMILY.medium }} className="mb-2 text-sm text-foreground">
            Numéro de cage <Text className="text-danger">*</Text>
          </Text>
          <TextInput
            value={numero}
            onChangeText={setNumero}
            placeholder="Ex: C-001"
            placeholderTextColor="#9CA3AF"
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="rounded-lg border border-border bg-card px-4 py-3 text-base text-foreground"
          />
        </View>

        {/* Nom */}
        <View className="mb-4">
          <Text style={{ fontFamily: FONT_FAMILY.medium }} className="mb-2 text-sm text-foreground">
            Nom de la cage <Text className="text-danger">*</Text>
          </Text>
          <TextInput
            value={nom}
            onChangeText={setNom}
            placeholder="Ex: Cage principale"
            placeholderTextColor="#9CA3AF"
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="rounded-lg border border-border bg-card px-4 py-3 text-base text-foreground"
          />
        </View>

        {/* Superficie */}
        <View className="mb-4">
          <Text style={{ fontFamily: FONT_FAMILY.medium }} className="mb-2 text-sm text-foreground">
            Superficie (m²)
          </Text>
          <TextInput
            value={superficie}
            onChangeText={setSuperficie}
            placeholder="Ex: 2.5"
            placeholderTextColor="#9CA3AF"
            keyboardType="decimal-pad"
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="rounded-lg border border-border bg-card px-4 py-3 text-base text-foreground"
          />
        </View>

        {/* Description */}
        <View className="mb-4">
          <Text style={{ fontFamily: FONT_FAMILY.medium }} className="mb-2 text-sm text-foreground">
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Notes ou description de la cage"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="rounded-lg border border-border bg-card px-4 py-3 text-base text-foreground"
          />
        </View>

        {/* Submit button */}
        <Button onPress={handleSubmit} disabled={createCage.isPending} className="mb-6">
          {createCage.isPending ? 'Création en cours...' : 'Créer la cage'}
        </Button>
      </ScrollView>
    </View>
  );
}
