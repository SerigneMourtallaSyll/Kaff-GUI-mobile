/**
 * Reproduction Detail Screen — View and update reproduction status.
 */
import { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

import { ArrowLeft, Egg, Users } from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';
import { useReproduction, useUpdateReproduction } from '@/features/reproductions';
import { Button, DatePicker } from '@/shared/ui';

export default function ReproductionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: reproduction, isLoading, error } = useReproduction(id!);
  const updateReproduction = useUpdateReproduction();

  const [showEclosionForm, setShowEclosionForm] = useState(false);
  const [dateEclosion, setDateEclosion] = useState('');
  const [nbPigeonneaux, setNbPigeonneaux] = useState('');

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
              Détails de la reproduction
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

  if (error || !reproduction) {
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
              Détails de la reproduction
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
            Impossible de charger les détails de la reproduction
          </Text>
          <Button onPress={() => router.back()} className="mt-4">
            Retour
          </Button>
        </View>
      </View>
    );
  }

  const handleEnregistrerEclosion = async () => {
    if (!dateEclosion) {
      Alert.alert('Erreur', "La date d'éclosion est obligatoire");
      return;
    }

    const count = parseInt(nbPigeonneaux, 10);
    if (isNaN(count) || count < 0) {
      Alert.alert('Erreur', 'Le nombre de pigeonneaux doit être un nombre positif');
      return;
    }

    try {
      await updateReproduction.mutateAsync({
        id: reproduction.id,
        input: {
          dateEclosion,
          nbPigeonneaux: count,
        },
      });

      Alert.alert('Succès', 'Éclosion enregistrée avec succès');
      setShowEclosionForm(false);
      setDateEclosion('');
      setNbPigeonneaux('');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || "Impossible d'enregistrer l'éclosion");
    }
  };

  const handleMarquerEchec = () => {
    Alert.alert(
      'Marquer comme échec',
      'Êtes-vous sûr de vouloir marquer cette reproduction comme un échec ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateReproduction.mutateAsync({
                id: reproduction.id,
                input: {
                  dateEclosion: new Date().toISOString().split('T')[0],
                  nbPigeonneaux: 0,
                },
              });
              Alert.alert('Succès', 'Reproduction marquée comme échec');
            } catch (error: any) {
              Alert.alert('Erreur', error.message || 'Impossible de marquer comme échec');
            }
          },
        },
      ],
    );
  };

  const getStatusColor = () => {
    switch (reproduction.statut) {
      case 'EN_COURS':
        return '#F59E0B';
      case 'ECLOS':
        return '#10B981';
      case 'ECHEC':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = () => {
    switch (reproduction.statut) {
      case 'EN_COURS':
        return 'En cours';
      case 'ECLOS':
        return 'Éclos';
      case 'ECHEC':
        return 'Échec';
      default:
        return reproduction.statut;
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
            Reproduction
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Status Badge */}
        <View className="mb-4 items-center">
          <View
            className="rounded-full px-4 py-2"
            style={{ backgroundColor: `${getStatusColor()}20` }}
          >
            <Text
              style={{ fontFamily: FONT_FAMILY.semibold, color: getStatusColor() }}
              className="text-sm"
            >
              {getStatusLabel()}
            </Text>
          </View>
        </View>

        {/* Main Info Card */}
        <View className="mb-4 rounded-2xl bg-card p-5">
          <View className="mb-4 flex-row items-center gap-2">
            <Users color="#6B7280" size={20} />
            <Text
              style={{ fontFamily: FONT_FAMILY.semibold }}
              className="text-base text-foreground"
            >
              Couple
            </Text>
          </View>
          <View className="gap-3">
            <InfoRow label="Mâle" value={reproduction.maleBague || 'Non renseigné'} />
            <InfoRow label="Femelle" value={reproduction.femelleBague || 'Non renseigné'} />
          </View>
        </View>

        {/* Ponte Info Card */}
        <View className="mb-4 rounded-2xl bg-card p-5">
          <View className="mb-4 flex-row items-center gap-2">
            <Egg color="#6B7280" size={20} />
            <Text
              style={{ fontFamily: FONT_FAMILY.semibold }}
              className="text-base text-foreground"
            >
              Informations de ponte
            </Text>
          </View>
          <View className="gap-3">
            <InfoRow
              label="Date de ponte"
              value={new Date(reproduction.datePonte).toLocaleDateString('fr-FR')}
            />
            <InfoRow label="Nombre d'œufs" value={reproduction.nbOeufs.toString()} />
            {reproduction.dateEclosion && (
              <InfoRow
                label="Date d'éclosion"
                value={new Date(reproduction.dateEclosion).toLocaleDateString('fr-FR')}
              />
            )}
            <InfoRow label="Pigeonneaux" value={reproduction.nbPigeonneaux.toString()} />
          </View>
        </View>

        {/* Notes */}
        {reproduction.notes && (
          <View className="mb-4 rounded-2xl bg-card p-5">
            <Text
              style={{ fontFamily: FONT_FAMILY.semibold }}
              className="mb-2 text-base text-foreground"
            >
              Notes
            </Text>
            <Text
              style={{ fontFamily: FONT_FAMILY.regular }}
              className="text-sm text-muted-foreground"
            >
              {reproduction.notes}
            </Text>
          </View>
        )}

        {/* Eclosion Form */}
        {showEclosionForm && reproduction.statut === 'EN_COURS' && (
          <View className="mb-4 rounded-2xl bg-card p-5">
            <Text
              style={{ fontFamily: FONT_FAMILY.semibold }}
              className="mb-4 text-base text-foreground"
            >
              Enregistrer l&apos;éclosion
            </Text>

            <DatePicker
              label="Date d'éclosion"
              value={dateEclosion}
              onChange={setDateEclosion}
              required
              placeholder="Sélectionner une date"
            />
            <View className="mb-4" />

            <View className="mb-4">
              <Text
                style={{ fontFamily: FONT_FAMILY.medium }}
                className="mb-2 text-sm text-foreground"
              >
                Nombre de pigeonneaux <Text className="text-danger">*</Text>
              </Text>
              <TextInput
                value={nbPigeonneaux}
                onChangeText={setNbPigeonneaux}
                placeholder="Ex: 2"
                placeholderTextColor="#9C9CB1"
                keyboardType="number-pad"
                style={{ fontFamily: FONT_FAMILY.regular }}
                className="h-12 rounded-lg border border-border bg-input px-3 text-base text-foreground"
              />
            </View>

            <View className="gap-2">
              <Button onPress={handleEnregistrerEclosion} disabled={updateReproduction.isPending}>
                {updateReproduction.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
              <Button variant="outline" onPress={() => setShowEclosionForm(false)}>
                Annuler
              </Button>
            </View>
          </View>
        )}

        {/* Actions */}
        {reproduction.statut === 'EN_COURS' && !showEclosionForm && (
          <View className="mb-6 gap-2">
            <Button onPress={() => setShowEclosionForm(true)}>Enregistrer l&apos;éclosion</Button>
            <Button variant="destructive" onPress={handleMarquerEchec}>
              Marquer comme échec
            </Button>
          </View>
        )}

        {reproduction.statut === 'ECLOS' && reproduction.nbPigeonneaux > 0 && (
          <View className="mb-6">
            <Button onPress={() => Alert.alert('Info', 'Fonctionnalité à venir')}>
              Gérer les pigeonneaux ({reproduction.nbPigeonneaux})
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text style={{ fontFamily: FONT_FAMILY.regular }} className="text-sm text-muted-foreground">
        {label}
      </Text>
      <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-sm text-foreground">
        {value}
      </Text>
    </View>
  );
}
