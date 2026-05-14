# Kàff GUI — Mobile app

> Baay Pitàq Colombophile Management System.
>
> Application mobile React Native (Expo SDK 54) pour la gestion d'une volière :
> pigeons, cages, couples, reproductions, sorties et visualisation interactive.

---

## ⚡ Quick start

```bash
# 1. Copy and configure environment variables
cp .env.example .env

# 2. Install dependencies (Windows: use the absolute npm path if PowerShell aliases an old npm)
npm install --legacy-peer-deps

# 3. Start the dev server
npm run start
```

Then press `a` for Android, `i` for iOS, or `w` for Web.

Pour tester **avec le même binaire que la prod** (Secure Store, Dev Menu,
navigation native complète), utilisez un **development build** EAS puis
`npm run start:dev` pour brancher Metro — voir la section _Builds EAS_ ci-dessous.

## 🧰 Scripts

| Script                                            | Description                                       |
| ------------------------------------------------- | ------------------------------------------------- |
| `npm run start`                                   | Start Metro bundler                               |
| `npm run android` / `ios` / `web`                 | Run on a specific platform                        |
| `npm run lint` / `lint:fix`                       | ESLint (zero warnings allowed)                    |
| `npm run format` / `format:check`                 | Prettier                                          |
| `npm run typecheck`                               | TypeScript without emit                           |
| `npm run test` / `test:watch` / `test:coverage`   | Jest (jest-expo preset)                           |
| `npm run doctor`                                  | `expo-doctor` health check                        |
| `npm run start:dev`                               | Metro pour **development build** EAS (dev client) |
| `npm run eas:dev:android` / `eas:dev:ios`         | EAS Build — profil **development**                |
| `npm run eas:preview:android` / `eas:preview:ios` | EAS Build — profil **preview** (interne)          |

## 📲 Builds EAS (téléphone physique)

Prérequis : compte sur [expo.dev](https://expo.dev), **Node ≥ 20**, dépendances installées (`npm install --legacy-peer-deps`).

1. Connexion CLI : `npx eas-cli login`
2. Lier le projet (première fois) : `npx eas-cli init` — ajoute `extra.eas.projectId` dans `app.json` si besoin.
3. Build **development** (APK Android prêt à sideload) : `npm run eas:dev:android`
4. Récupérer l’APK ou l’IPA sur la page du build Expo et l’installer.
5. Sur le PC : `npm run start:dev` puis ouvrir l’app sur l’appareil (même Wi‑Fi, ou tunnel depuis le menu développeur).

**Backend** : sur téléphone, `localhost` ne cible pas votre PC. Utilisez l’IP LAN ou une URL de staging pour `EXPO_PUBLIC_API_BASE_URL` (secrets / variables EAS ou `.env` selon votre flux).

Profils dans [`eas.json`](./eas.json) : `development` (dev client), `preview`, `production`.

## 🏗️ Architecture

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the full description
of the Feature-Sliced + Clean Architecture approach.

Quick overview:

```
app/                  Expo Router routes (file-based) + guards
src/
  core/               config, theme, i18n, logger, errors, Result, types
  api/                axios client, JWT interceptors, endpoints
  storage/            secure-store (tokens) + AsyncStorage (preferences)
  features/           vertical slices (auth, pigeons, cages, ...)
  shared/             ui design system, providers, utils, hooks
```

ADRs live in [`docs/adr/`](./docs/adr/).

## 🔒 Security highlights

- Tokens (JWT access + refresh) live in **`expo-secure-store`** — Keychain on
  iOS, EncryptedSharedPreferences on Android.
- Single in-memory `tokenManager` is the sole owner of tokens at runtime.
- Axios interceptor performs **silent refresh** on 401 with an in-flight
  queue (no duplicate refresh requests under concurrent failures).
- All API responses are validated with **Zod** at the API boundary.
- Errors are normalised into a single typed `AppError` taxonomy.
- Client-side login rate-limit (5 attempts / 5 minutes) mirrors server policy.
- No secrets in the bundle: `EXPO_PUBLIC_*` only. Real secrets live in EAS
  secrets.

## 📚 Documentation

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — architectural overview.
- [`docs/adr/`](./docs/adr/) — Architecture Decision Records.

## 📦 Stack

- Expo SDK 54 · React Native 0.81 · React 19 · TypeScript (strict)
- Expo Router v3 (file-based, on top of React Navigation 6)
- TanStack Query v5 · Zustand · Axios · Zod · react-hook-form
- NativeWind v4 + Tailwind CSS v3
- expo-secure-store · AsyncStorage
- Reanimated 3 · Gesture Handler · lucide-react-native
- i18next · expo-localization (FR par défaut, EN fallback)
- Jest · @testing-library/react-native · MSW

## 🧪 Quality gates

Pre-commit hook (Husky + lint-staged) runs ESLint (zero warnings) and Prettier
on staged files. Commits follow [Conventional Commits](https://www.conventionalcommits.org/).

```bash
# Examples of valid commit messages
feat(auth): add JWT refresh queue
fix(cages): release cage on couple dissolution
docs: document tokenManager lifecycle
```

## 📄 License

Confidentiel — v1.0 — Mai 2026
