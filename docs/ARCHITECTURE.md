# Architecture — Kàff GUI Mobile

> Status: foundation (J1 — initial scaffolding).
> Audience: developers + reviewers (Bakeli evaluation jury).

---

## 1. Goals

The application is the validation project for Bakeli DTS Développeur Web ou
Mobile. Beyond the immediate MVP scope (cahier des charges §1.3), the codebase
is engineered to the standards expected for **production-grade mobile
applications in security-sensitive domains** (banking, fintech, ...). Concrete
properties:

- **Modularity** — features can be implemented, reviewed, and refactored in
  isolation. Every module has a public API (`index.ts`) and treats everything
  else as private.
- **Maintainability** — strict TypeScript, consistent style (Prettier+ESLint),
  Conventional Commits, ADRs for non-obvious decisions.
- **Security** — JWT in secure enclave storage, silent refresh queue, defence
  in depth via runtime schema validation, no PII in logs.
- **Performance** — minimal re-renders (Zustand selectors), React Query for
  network state, Reanimated for 60fps animations.
- **Testability** — pure cores (no DOM/RN access in `core/`, `api/`, `features/<x>/api/`),
  MSW for API mocking, Jest preset `jest-expo`.

## 2. Layering

```
                +---------------------------+
                | app/  (Expo Router pages) |
                +-------------+-------------+
                              |
            +-----------------+------------------+
            |                                    |
+-----------v-----------+         +--------------v------------+
| features/<feature>/UI |  uses   | shared/ui (design system) |
+-----------+-----------+         +--------------+------------+
            |
+-----------v-----------+
| features/<feature>/   |
| hooks, stores         |
+-----------+-----------+
            |
+-----------v-----------+         +---------------------------+
| features/<feature>/   |  uses   | api/ (axios + interceptors)|
| api  (Zod-validated)  |         +--------------+------------+
+-----------+-----------+                        |
            |                                    |
+-----------v-----------+         +--------------v------------+
| core/ (config, theme, |  uses   | storage/ (secure + prefs) |
| i18n, errors, types)  |         +---------------------------+
+-----------------------+
```

Allowed import directions:

- `app/` → `features/*` (public surface), `shared/*`, `core/*`
- `features/<x>/` → `core/*`, `api/*`, `storage/*`, `shared/*`
- `features/<x>/` → **NEVER** `features/<y>/` directly. Cross-feature talk goes
  through `shared/` or pure types in `core/`.
- `shared/` → `core/*` only.
- `core/` and `api/` have no React imports (pure modules).

## 3. Feature-sliced layout

Every feature directory is a complete vertical slice:

```
features/<feature>/
├── api/         HTTP wrappers (apiClient + Zod schemas)
├── hooks/       React Query / domain hooks
├── stores/      Zustand stores (local feature state)
├── schemas/     Zod schemas (forms + API responses)
├── types/       TypeScript domain types
├── components/  Feature-specific components (not shared)
└── index.ts     Public surface — ONLY thing other features can import
```

## 4. Auth flow

1. Boot — `app/_layout.tsx` mounts providers and `useBootstrapAuth()`.
2. `tokenManager.hydrate()` reads tokens from `expo-secure-store`.
3. If present, `authApi.me()` validates them and seeds the store with the user.
4. Navigation guards in `app/(auth)/_layout.tsx` and `app/(protected)/_layout.tsx`
   route the user to the right group.
5. On 401 from any API call, the auth interceptor performs **silent refresh
   with an in-flight queue** — concurrent failed requests share a single
   refresh round-trip.
6. If refresh fails, `tokenManager.clear()` is called, the store transitions to
   `unauthenticated`, and the user is redirected to login.

## 5. Storage

| Concern                  | Backend                                                     | Reason                                                                                      |
| ------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Access + refresh tokens  | `expo-secure-store` (Keychain / EncryptedSharedPreferences) | Hardware-backed protection                                                                  |
| UI preferences           | `AsyncStorage`                                              | Plain text fine, simple API, Expo Go compatible                                             |
| HTTP cache (React Query) | In-memory                                                   | MMKV/AsyncStorage persistence can be added later via `@tanstack/react-query-persist-client` |

## 6. Styling — NativeWind v4

We use NativeWind v4 (Tailwind for React Native) so that the prototype's
Tailwind classes carry over with minimal churn. The single source of truth
for design tokens is `src/core/theme/tokens.ts`, mirrored in
`tailwind.config.js`. A future task will codegen the Tailwind config from
the tokens to remove drift.

Cage colors (cahier des charges §3.8) live in `theme.cage` and are exposed as
`bg-cage-free`, `bg-cage-pigeon`, `bg-cage-couple`.

## 7. Testing strategy

- **Unit** — pure modules in `core/`, `api/`, schemas, store reducers.
- **Component** — `@testing-library/react-native` with mocked navigation.
- **Integration** — MSW intercepts API calls; runs through a real React Query
  client.
- **Smoke** — `__tests__/smoke.test.ts` makes sure the import graph is sound.

## 8. CI/CD intent

- Lint + format + typecheck + tests on every PR (zero warnings).
- EAS Build for production APK / iOS app.
- EAS Update for OTA fixes within the same native runtime.

## 9. Observability

`logger` exposes a swappable sink. The Sentry adapter will be added once we
have a DSN; until then logs go to `console` in development and are silent in
production. Calls are categorical (`debug`, `info`, `warn`, `error`) and
include a small structured payload — never PII.

## 10. Open items

Tracked in `docs/adr/`:

- ADR-001 — Initial stack choices (Expo Router, NativeWind, Zustand+Query).
- Future: ADR for state persistence strategy, deep linking schemes, offline mode.
