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

The first run requires a development build (Expo dev client) if you want native
modules like `expo-secure-store` to work fully. For pure UI development, Expo
Go is sufficient.

## 🧰 Scripts

| Script                                          | Description                    |
| ----------------------------------------------- | ------------------------------ |
| `npm run start`                                 | Start Metro bundler            |
| `npm run android` / `ios` / `web`               | Run on a specific platform     |
| `npm run lint` / `lint:fix`                     | ESLint (zero warnings allowed) |
| `npm run format` / `format:check`               | Prettier                       |
| `npm run typecheck`                             | TypeScript without emit        |
| `npm run test` / `test:watch` / `test:coverage` | Jest (jest-expo preset)        |
| `npm run doctor`                                | `expo-doctor` health check     |

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
