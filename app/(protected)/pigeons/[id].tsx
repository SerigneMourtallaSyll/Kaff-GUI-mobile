/**
 * Pigeon Detail Screen — View detailed information about a pigeon.
 */
import { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

import { ArrowLeft, Bird, Calendar, Palette, Scale, Users, X } from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';
import { useDeclarerDeces, useDeclarerPerte, usePigeon, useVendrePigeon } from '@/features/pigeons';
import { Button, DatePicker } from '@/shared/ui';

type SortieModalType = 'vente' | 'deces' | 'perte' | null;

export default function PigeonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: pigeon, isLoading, error } = usePigeon(id!);

  const vendrePigeon = useVendrePigeon(id!);
  const declarerDeces = useDeclarerDeces(id!);
  const declarerPerte = useDeclarerPerte(id!);

  const [sortieModal, setSortieModal] = useState<SortieModalType>(null);
  const [dateSortie, setDateSortie] = useState('');
  const [prixVente, setPrixVente] = useState('');
  const [acheteur, setAcheteur] = useState('');
  const [cause, setCause] = useState('');
  const [circonstances, setCirconstances] = useState('');

  const resetForm = () => {
    setDateSortie('');
    setPrixVente('');
    setAcheteur('');
    setCause('');
    setCirconstances('');
  };

  const handleVendre = async () => {
    if (!dateSortie) {
      Alert.alert('Erreur', 'La date de sortie est obligatoire');
      return;
    }
    if (!prixVente) {
      Alert.alert('Erreur', 'Le prix de vente est obligatoire');
      return;
    }
    if (!acheteur || !acheteur.trim()) {
      Alert.alert('Erreur', "Le nom de l'acheteur est obligatoire");
      return;
    }

    try {
      await vendrePigeon.mutateAsync({
        dateSortie,
        prixVente: parseFloat(prixVente),
        acheteur: acheteur.trim(),
      });
      Alert.alert('Succès', 'Pigeon vendu avec succès');
      setSortieModal(null);
      resetForm();
      router.back();
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de vendre le pigeon');
    }
  };

  const handleDeclarerDeces = async () => {
    if (!dateSortie) {
      Alert.alert('Erreur', 'La date de sortie est obligatoire');
      return;
    }

    try {
      await declarerDeces.mutateAsync({
        dateSortie,
        cause: cause || undefined,
      });
      Alert.alert('Succès', 'Décès déclaré avec succès');
      setSortieModal(null);
      resetForm();
      router.back();
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de déclarer le décès');
    }
  };

  const handleDeclarerPerte = async () => {
    if (!dateSortie) {
      Alert.alert('Erreur', 'La date de sortie est obligatoire');
      return;
    }

    try {
      await declarerPerte.mutateAsync({
        dateSortie,
        circonstances: circonstances || undefined,
      });
      Alert.alert('Succès', 'Perte déclarée avec succès');
      setSortieModal(null);
      resetForm();
      router.back();
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de déclarer la perte');
    }
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
              Détails du pigeon
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

  if (error || !pigeon) {
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
              Détails du pigeon
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
            Impossible de charger les détails du pigeon
          </Text>
          <Button onPress={() => router.back()} className="mt-4">
            Retour
          </Button>
        </View>
      </View>
    );
  }

  const isMale = pigeon.sexe === 'MALE';
  const ageAnnees = Math.floor(pigeon.ageJours / 365);
  const ageMois = Math.floor((pigeon.ageJours % 365) / 30);

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
            {pigeon.bague}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Main Info Card */}
        <View className="mb-4 rounded-2xl bg-card p-5">
          <View className="mb-4 flex-row items-center gap-3">
            <View
              className="h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: isMale ? '#DBEAFE' : '#FCE7F3' }}
            >
              <Bird color={isMale ? '#2563EB' : '#DB2777'} size={32} />
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: FONT_FAMILY.bold }} className="text-xl text-foreground">
                {pigeon.bague}
              </Text>
              <View className="mt-1 flex-row items-center gap-2">
                <View className="rounded bg-primary/10 px-2 py-1">
                  <Text style={{ fontFamily: FONT_FAMILY.medium }} className="text-xs text-primary">
                    {pigeon.statut}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="gap-3">
            <InfoRow
              icon={<Users color="#6B7280" size={18} />}
              label="Sexe"
              value={isMale ? '♂ Mâle' : '♀ Femelle'}
            />
            <InfoRow icon={<Bird color="#6B7280" size={18} />} label="Race" value={pigeon.race} />
            {pigeon.couleur && (
              <InfoRow
                icon={<Palette color="#6B7280" size={18} />}
                label="Couleur"
                value={pigeon.couleur}
              />
            )}
            <InfoRow
              icon={<Calendar color="#6B7280" size={18} />}
              label="Date de naissance"
              value={new Date(pigeon.dateNaissance).toLocaleDateString('fr-FR')}
            />
            <InfoRow
              icon={<Calendar color="#6B7280" size={18} />}
              label="Âge"
              value={
                ageAnnees > 0 || ageMois > 0
                  ? `${ageAnnees > 0 ? `${ageAnnees} an${ageAnnees > 1 ? 's' : ''}` : ''} ${ageMois > 0 ? `${ageMois} mois` : ''}`
                  : "Moins d'un mois"
              }
            />
            {pigeon.poids && (
              <InfoRow
                icon={<Scale color="#6B7280" size={18} />}
                label="Poids"
                value={`${pigeon.poids} kg`}
              />
            )}
          </View>
        </View>

        {/* Parents Card */}
        {(pigeon.pere || pigeon.mere) && (
          <View className="mb-4 rounded-2xl bg-card p-5">
            <Text
              style={{ fontFamily: FONT_FAMILY.semibold }}
              className="mb-3 text-base text-foreground"
            >
              Parents
            </Text>
            <View className="gap-3">
              {pigeon.pere && (
                <View className="flex-row items-center justify-between">
                  <Text
                    style={{ fontFamily: FONT_FAMILY.regular }}
                    className="text-sm text-muted-foreground"
                  >
                    Père
                  </Text>
                  <Text
                    style={{ fontFamily: FONT_FAMILY.medium }}
                    className="text-sm text-foreground"
                  >
                    {pigeon.pere.bague}
                  </Text>
                </View>
              )}
              {pigeon.mere && (
                <View className="flex-row items-center justify-between">
                  <Text
                    style={{ fontFamily: FONT_FAMILY.regular }}
                    className="text-sm text-muted-foreground"
                  >
                    Mère
                  </Text>
                  <Text
                    style={{ fontFamily: FONT_FAMILY.medium }}
                    className="text-sm text-foreground"
                  >
                    {pigeon.mere.bague}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Actions */}
        {pigeon.statut === 'ACTIF' && (
          <View className="mb-6">
            <Text
              style={{ fontFamily: FONT_FAMILY.semibold }}
              className="mb-3 text-base text-foreground"
            >
              Actions de sortie
            </Text>
            <View className="gap-2">
              <Button onPress={() => setSortieModal('vente')}>Vendre le pigeon</Button>
              <Button variant="outline" onPress={() => setSortieModal('deces')}>
                Déclarer un décès
              </Button>
              <Button variant="outline" onPress={() => setSortieModal('perte')}>
                Déclarer une perte
              </Button>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sortie Modals */}
      <SortieModal
        visible={sortieModal !== null}
        type={sortieModal}
        onClose={() => {
          setSortieModal(null);
          resetForm();
        }}
        dateSortie={dateSortie}
        setDateSortie={setDateSortie}
        prixVente={prixVente}
        setPrixVente={setPrixVente}
        acheteur={acheteur}
        setAcheteur={setAcheteur}
        cause={cause}
        setCause={setCause}
        circonstances={circonstances}
        setCirconstances={setCirconstances}
        onSubmitVente={handleVendre}
        onSubmitDeces={handleDeclarerDeces}
        onSubmitPerte={handleDeclarerPerte}
        isLoading={vendrePigeon.isPending || declarerDeces.isPending || declarerPerte.isPending}
      />
    </View>
  );
}

interface SortieModalProps {
  visible: boolean;
  type: SortieModalType;
  onClose: () => void;
  dateSortie: string;
  setDateSortie: (value: string) => void;
  prixVente: string;
  setPrixVente: (value: string) => void;
  acheteur: string;
  setAcheteur: (value: string) => void;
  cause: string;
  setCause: (value: string) => void;
  circonstances: string;
  setCirconstances: (value: string) => void;
  onSubmitVente: () => void;
  onSubmitDeces: () => void;
  onSubmitPerte: () => void;
  isLoading: boolean;
}

function SortieModal({
  visible,
  type,
  onClose,
  dateSortie,
  setDateSortie,
  prixVente,
  setPrixVente,
  acheteur,
  setAcheteur,
  cause,
  setCause,
  circonstances,
  setCirconstances,
  onSubmitVente,
  onSubmitDeces,
  onSubmitPerte,
  isLoading,
}: SortieModalProps) {
  if (!type) return null;

  const getTitle = () => {
    switch (type) {
      case 'vente':
        return 'Vendre le pigeon';
      case 'deces':
        return 'Déclarer un décès';
      case 'perte':
        return 'Déclarer une perte';
      default:
        return '';
    }
  };

  const handleSubmit = () => {
    switch (type) {
      case 'vente':
        onSubmitVente();
        break;
      case 'deces':
        onSubmitDeces();
        break;
      case 'perte':
        onSubmitPerte();
        break;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="max-h-[80%] rounded-t-3xl bg-white px-6 pb-8 pt-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text style={{ fontFamily: FONT_FAMILY.bold }} className="text-lg text-foreground">
              {getTitle()}
            </Text>
            <Pressable onPress={onClose} hitSlop={8} className="rounded-lg p-2 active:bg-muted">
              <X color="#030213" size={20} />
            </Pressable>
          </View>

          <ScrollView className="mb-4" keyboardShouldPersistTaps="handled">
            {/* Date de sortie */}
            <DatePicker
              label="Date de sortie"
              value={dateSortie}
              onChange={setDateSortie}
              required
              placeholder="Sélectionner une date"
            />
            <View className="mb-4" />

            {/* Vente specific fields */}
            {type === 'vente' && (
              <>
                <View className="mb-4">
                  <Text
                    style={{ fontFamily: FONT_FAMILY.medium }}
                    className="mb-2 text-sm text-foreground"
                  >
                    Prix de vente <Text className="text-danger">*</Text>
                  </Text>
                  <TextInput
                    value={prixVente}
                    onChangeText={setPrixVente}
                    placeholder="Ex: 50.00"
                    placeholderTextColor="#9C9CB1"
                    keyboardType="decimal-pad"
                    style={{ fontFamily: FONT_FAMILY.regular }}
                    className="h-12 rounded-lg border border-border bg-input px-3 text-base text-foreground"
                  />
                </View>

                <View className="mb-4">
                  <Text
                    style={{ fontFamily: FONT_FAMILY.medium }}
                    className="mb-2 text-sm text-foreground"
                  >
                    Acheteur <Text className="text-danger">*</Text>
                  </Text>
                  <TextInput
                    value={acheteur}
                    onChangeText={setAcheteur}
                    placeholder="Nom de l'acheteur"
                    placeholderTextColor="#9C9CB1"
                    style={{ fontFamily: FONT_FAMILY.regular }}
                    className="h-12 rounded-lg border border-border bg-input px-3 text-base text-foreground"
                  />
                </View>
              </>
            )}

            {/* Deces specific fields */}
            {type === 'deces' && (
              <View className="mb-4">
                <Text
                  style={{ fontFamily: FONT_FAMILY.medium }}
                  className="mb-2 text-sm text-foreground"
                >
                  Cause du décès
                </Text>
                <TextInput
                  value={cause}
                  onChangeText={setCause}
                  placeholder="Cause du décès"
                  placeholderTextColor="#9C9CB1"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  style={{ fontFamily: FONT_FAMILY.regular }}
                  className="rounded-lg border border-border bg-input p-3 text-base text-foreground"
                />
              </View>
            )}

            {/* Perte specific fields */}
            {type === 'perte' && (
              <View className="mb-4">
                <Text
                  style={{ fontFamily: FONT_FAMILY.medium }}
                  className="mb-2 text-sm text-foreground"
                >
                  Circonstances
                </Text>
                <TextInput
                  value={circonstances}
                  onChangeText={setCirconstances}
                  placeholder="Circonstances de la perte"
                  placeholderTextColor="#9C9CB1"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  style={{ fontFamily: FONT_FAMILY.regular }}
                  className="rounded-lg border border-border bg-input p-3 text-base text-foreground"
                />
              </View>
            )}
          </ScrollView>

          <View className="gap-2">
            <Button onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            <Button variant="outline" onPress={onClose}>
              Annuler
            </Button>
          </View>
        </View>
      </View>
    </Modal>
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
