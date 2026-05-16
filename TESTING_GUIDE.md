# Guide de Test - Kaff GUI Mobile

## ✅ Erreurs Corrigées

### Import manquant de `router`

- **Problème**: `router` n'était pas importé dans les écrans tabs
- **Solution**: Ajout de `import { router } from 'expo-router';` dans:
  - `app/(protected)/(tabs)/pigeons.tsx`
  - `app/(protected)/(tabs)/couples.tsx`
  - `app/(protected)/(tabs)/reproductions.tsx`

## 🧪 Tests à Effectuer

### 1. Test des Formulaires d'Ajout

#### A. Ajouter un Pigeon

1. Aller dans l'onglet **Pigeons**
2. Cliquer sur **"Ajouter un pigeon"**
3. Remplir le formulaire:
   - **Bague**: `FR-2024-001` (obligatoire, unique)
   - **Sexe**: Sélectionner Mâle ou Femelle
   - **Race**: `Voyageur` (obligatoire)
   - **Date de naissance**: `2024-01-15` (format AAAA-MM-JJ)
   - **Couleur**: `Bleu` (optionnel)
   - **Poids**: `0.45` (optionnel)
4. Cliquer sur **"Ajouter le pigeon"**
5. Vérifier le message de succès
6. Vérifier que le pigeon apparaît dans la liste

**Tests de validation**:

- ❌ Soumettre sans bague → Erreur "La bague est obligatoire"
- ❌ Soumettre sans race → Erreur "La race est obligatoire"
- ❌ Date invalide `2024/01/15` → Erreur "Format de date invalide"
- ❌ Bague déjà existante → Erreur du backend

#### B. Former un Couple

1. **Prérequis**: Avoir au moins 1 mâle et 1 femelle actifs
2. Aller dans l'onglet **Couples**
3. Cliquer sur **"Former un nouveau couple"**
4. Sélectionner un mâle dans la liste
5. Sélectionner une femelle dans la liste
6. Entrer la date de formation: `2024-05-15`
7. Cliquer sur **"Former le couple"**
8. Vérifier le message de succès
9. Vérifier que le couple apparaît dans la liste

**Tests de validation**:

- ❌ Soumettre sans mâle → Erreur "Sélectionnez un mâle"
- ❌ Soumettre sans femelle → Erreur "Sélectionnez une femelle"
- ❌ Date invalide → Erreur "Format de date invalide"

#### C. Enregistrer une Ponte

1. **Prérequis**: Avoir au moins 1 couple actif
2. Aller dans l'onglet **Reproductions**
3. Cliquer sur **"Enregistrer une ponte"**
4. Sélectionner un couple dans la liste
5. Entrer la date de ponte: `2024-05-15`
6. Entrer le nombre d'œufs: `2`
7. (Optionnel) Ajouter des notes
8. Cliquer sur **"Enregistrer la ponte"**
9. Vérifier le message de succès
10. Vérifier que la reproduction apparaît dans la liste

**Tests de validation**:

- ❌ Soumettre sans couple → Erreur "Sélectionnez un couple"
- ❌ Soumettre sans date → Erreur "La date de ponte est obligatoire"
- ❌ Nombre d'œufs = 0 → Erreur "Le nombre d'œufs doit être au moins 1"
- ❌ Date invalide → Erreur "Format de date invalide"

### 2. Test de Navigation

#### Navigation vers les formulaires

- ✅ Depuis Pigeons → Formulaire d'ajout pigeon
- ✅ Depuis Couples → Formulaire d'ajout couple
- ✅ Depuis Reproductions → Formulaire d'ajout reproduction

#### Retour après soumission

- ✅ Après ajout pigeon → Retour à la liste pigeons
- ✅ Après ajout couple → Retour à la liste couples
- ✅ Après ajout reproduction → Retour à la liste reproductions

#### Bouton retour

- ✅ Bouton retour (flèche) fonctionne dans chaque formulaire
- ✅ Retour sans sauvegarder ne crée pas d'entrée

### 3. Test de l'Intégration API

#### Vérifier les appels API

1. Ouvrir les DevTools réseau (si disponible)
2. Soumettre un formulaire
3. Vérifier:
   - ✅ Requête POST envoyée au bon endpoint
   - ✅ Payload correct (snake_case)
   - ✅ Réponse 201 Created
   - ✅ Cache React Query invalidé
   - ✅ Liste mise à jour automatiquement

#### Tester les erreurs backend

1. Essayer d'ajouter un pigeon avec une bague existante
2. Vérifier que l'erreur du backend est affichée
3. Essayer de former un couple avec des pigeons déjà en couple
4. Vérifier que l'erreur est gérée correctement

### 4. Test de l'UX

#### États de chargement

- ✅ Bouton submit affiche "Ajout en cours..." pendant la requête
- ✅ Bouton submit est désactivé pendant la requête
- ✅ Pas de double soumission possible

#### Messages de feedback

- ✅ Alert de succès après création
- ✅ Alert d'erreur en cas d'échec
- ✅ Messages d'erreur clairs et en français

#### Sélection de pigeons/couples

- ✅ Liste déroulante scrollable
- ✅ Affichage clair (bague + race)
- ✅ Possibilité de changer la sélection
- ✅ Message si aucun pigeon/couple disponible

### 5. Test des Cas Limites

#### Listes vides

- ✅ Aucun mâle actif → Message "Aucun mâle actif disponible"
- ✅ Aucune femelle active → Message "Aucune femelle active disponible"
- ✅ Aucun couple actif → Message "Aucun couple actif disponible"

#### Validation des données

- ✅ Poids avec virgule: `0,45` → Convertir en `0.45`
- ✅ Bague avec espaces: `FR-001` → Trim automatique
- ✅ Date future acceptée
- ✅ Date passée acceptée

#### Gestion des erreurs réseau

- ✅ Pas de connexion → Message d'erreur
- ✅ Timeout → Message d'erreur
- ✅ Erreur 500 → Message d'erreur générique

## 📊 Checklist Complète

### Fonctionnalités

- [ ] Ajout de pigeon fonctionne
- [ ] Formation de couple fonctionne
- [ ] Enregistrement de ponte fonctionne
- [ ] Navigation vers formulaires fonctionne
- [ ] Retour après soumission fonctionne
- [ ] Validation côté client fonctionne
- [ ] Erreurs backend affichées correctement

### UX/UI

- [ ] Design cohérent avec le reste de l'app
- [ ] Header vert avec bouton retour
- [ ] Champs de formulaire clairs
- [ ] Labels avec astérisques pour champs obligatoires
- [ ] États de chargement visibles
- [ ] Messages de feedback clairs

### Performance

- [ ] Pas de lag lors de la saisie
- [ ] Soumission rapide
- [ ] Liste mise à jour instantanément après ajout
- [ ] Pas de re-render inutiles

### Accessibilité

- [ ] Labels accessibles
- [ ] Boutons avec accessibilityRole
- [ ] Feedback vocal (si activé)
- [ ] Navigation au clavier (si applicable)

## 🐛 Bugs Connus

Aucun bug connu pour le moment.

## 📝 Notes

### Format de Date

- **Format attendu**: `AAAA-MM-JJ` (ex: `2024-05-15`)
- **Raison**: Format ISO 8601 standard, compatible avec le backend Django
- **Amélioration future**: Ajouter un date picker natif

### Upload d'Images

- **État actuel**: Non implémenté
- **Champ**: `photo_url` existe mais non utilisé dans le formulaire
- **Prochaine étape**: Voir `UPLOAD_IMAGES.md` pour l'implémentation

### Sélection de Pigeons/Couples

- **État actuel**: Liste déroulante simple avec ScrollView
- **Amélioration future**:
  - Ajouter une barre de recherche
  - Ajouter des filtres (race, âge, etc.)
  - Utiliser un composant Select plus avancé

## 🚀 Prochaines Étapes

1. **Tests manuels**: Tester tous les scénarios ci-dessus
2. **Corrections**: Corriger les bugs trouvés
3. **Upload d'images**: Implémenter avec Cloudinary
4. **Date picker**: Ajouter un date picker natif
5. **Tests automatisés**: Écrire des tests E2E avec Detox
