# Upload d'Images - Guide d'Implémentation

## État Actuel

### Backend (Django)

- **Champ**: `photo_url` (TextField) dans le modèle `Pigeon`
- **Type**: URL texte (pas d'upload direct de fichier)
- **Parser**: `MultiPartParser` activé dans DRF settings
- **Utilisation**: Stockage d'URL externe (ex: Cloudinary, AWS S3, etc.)

### Mobile (React Native)

- **Formulaire**: Champ `photo_url` optionnel dans le formulaire d'ajout de pigeon
- **État actuel**: Non implémenté dans l'UI (champ caché)
- **Besoin**: Intégration d'un service d'upload d'images

## Options d'Implémentation

### Option 1: Cloudinary (Recommandé) ⭐

**Avantages**:

- Service gratuit jusqu'à 25 GB de stockage
- SDK React Native officiel
- Transformations d'images automatiques (resize, crop, etc.)
- CDN global pour performance optimale
- Upload direct depuis le mobile

**Installation**:

```bash
npm install cloudinary-react-native
npm install react-native-fs
```

**Configuration**:

```typescript
// src/lib/cloudinary.ts
import { Cloudinary } from 'cloudinary-react-native';

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'YOUR_CLOUD_NAME',
  },
  url: {
    secure: true,
  },
});
```

**Utilisation**:

```typescript
import { cloudinary } from '@/lib/cloudinary';
import * as ImagePicker from 'expo-image-picker';

// Pick image
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
});

if (!result.canceled) {
  // Upload to Cloudinary
  const uploadResult = await cloudinary.uploader.upload(result.assets[0].uri, {
    folder: 'kaff-pigeons',
    upload_preset: 'YOUR_PRESET',
  });

  const photoUrl = uploadResult.secure_url;
  // Use photoUrl in form submission
}
```

### Option 2: AWS S3

**Avantages**:

- Contrôle total sur le stockage
- Intégration avec AWS ecosystem
- Scalabilité illimitée

**Installation**:

```bash
npm install aws-sdk
npm install react-native-fs
```

**Configuration**:

```typescript
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: 'YOUR_ACCESS_KEY',
  secretAccessKey: 'YOUR_SECRET_KEY',
  region: 'YOUR_REGION',
});
```

### Option 3: Backend Upload (Modification requise)

**Avantages**:

- Contrôle total côté backend
- Pas de service externe

**Inconvénients**:

- Nécessite modification du backend (ImageField au lieu de TextField)
- Gestion du stockage sur le serveur
- Pas de CDN intégré

**Modifications Backend**:

```python
# apps/pigeons/models.py
class Pigeon(BaseModel, SoftDeleteModel):
    # ...
    photo = models.ImageField(upload_to='pigeons/', blank=True, null=True)
    # ...
```

## Implémentation Recommandée (Cloudinary)

### Étape 1: Configuration Cloudinary

1. Créer un compte sur [cloudinary.com](https://cloudinary.com)
2. Obtenir `cloud_name`, `api_key`, `api_secret`
3. Créer un upload preset (Settings > Upload > Upload presets)

### Étape 2: Installation des dépendances

```bash
cd Kaff-GUI-mobile
npm install cloudinary-react-native expo-image-picker
```

### Étape 3: Créer le composant ImagePicker

```typescript
// src/shared/ui/ImagePicker.tsx
import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Upload } from 'lucide-react-native';
import { FONT_FAMILY } from '@/core/theme';

interface ImagePickerProps {
  value?: string;
  onChange: (url: string) => void;
}

export function ImagePickerComponent({ value, onChange }: ImagePickerProps) {
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission refusée');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    setUploading(true);
    try {
      // TODO: Implement Cloudinary upload
      // const uploadResult = await cloudinary.uploader.upload(uri, {
      //   folder: 'kaff-pigeons',
      //   upload_preset: 'YOUR_PRESET',
      // });
      // onChange(uploadResult.secure_url);

      // For now, just use the local URI
      onChange(uri);
    } catch (error) {
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View>
      {value ? (
        <View className="relative">
          <Image
            source={{ uri: value }}
            className="h-32 w-32 rounded-lg"
            resizeMode="cover"
          />
          <Pressable
            onPress={pickImage}
            className="absolute bottom-2 right-2 rounded-full bg-primary p-2"
          >
            <Camera color="#FFFFFF" size={16} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={pickImage}
          disabled={uploading}
          className="h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted"
        >
          <Upload color="#717182" size={32} />
          <Text
            style={{ fontFamily: FONT_FAMILY.regular }}
            className="mt-2 text-sm text-muted-foreground"
          >
            {uploading ? 'Upload...' : 'Ajouter photo'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
```

### Étape 4: Intégrer dans le formulaire

```typescript
// Dans app/(protected)/pigeons/add.tsx
import { ImagePickerComponent } from '@/shared/ui/ImagePicker';

// Dans le composant:
const [photoUrl, setPhotoUrl] = useState('');

// Dans le JSX:
<View className="mb-4">
  <Text style={{ fontFamily: FONT_FAMILY.medium }} className="mb-2 text-sm text-foreground">
    Photo
  </Text>
  <ImagePickerComponent value={photoUrl} onChange={setPhotoUrl} />
</View>
```

## Prochaines Étapes

### Court terme (Sans service externe)

1. ✅ Formulaires d'ajout créés (sans upload d'image)
2. ⏳ Tester les formulaires avec le backend
3. ⏳ Ajouter validation côté client

### Moyen terme (Avec Cloudinary)

1. ⏳ Créer compte Cloudinary
2. ⏳ Installer dépendances
3. ⏳ Créer composant ImagePicker
4. ⏳ Intégrer dans formulaire pigeon
5. ⏳ Tester upload end-to-end

### Long terme (Optimisations)

1. ⏳ Compression d'images avant upload
2. ⏳ Cache local des images
3. ⏳ Gestion des erreurs d'upload
4. ⏳ Retry automatique en cas d'échec
5. ⏳ Affichage des images dans la liste

## Notes Importantes

- **Sécurité**: Ne jamais exposer les clés API dans le code client
- **Performance**: Compresser les images avant upload (max 1MB)
- **UX**: Afficher un loader pendant l'upload
- **Offline**: Gérer le cas où l'utilisateur est hors ligne
- **Validation**: Vérifier le type et la taille du fichier

## Ressources

- [Cloudinary React Native SDK](https://cloudinary.com/documentation/react_native_integration)
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [AWS S3 React Native](https://docs.amplify.aws/lib/storage/getting-started/q/platform/react-native/)
