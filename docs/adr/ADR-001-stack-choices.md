# ADR-001 — Initial mobile stack choices

- **Status:** Accepted
- **Date:** 2026-05-12
- **Deciders:** Mobile lead

## Context

The cahier des charges (§4.2) prescribes a React Native + Expo + Django REST
stack with React Navigation 6, React Native Paper, Zustand, React Query, and
Axios. We need to confirm or adjust these choices for a 5-day MVP that also
hits banking-grade quality bars.

## Decision

We adopt the following stack:

| Concern      | Choice                                                   | Diverges from cahier?                                                                                       |
| ------------ | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Runtime      | **Expo SDK 54** (latest stable on 2026-05-12)            | Cahier said SDK 51 — outdated for 2026. Latest stable used.                                                 |
| Navigation   | **Expo Router v3**                                       | Built on top of React Navigation 6 → compatible. File-based routing, type-safe routes, native deep linking. |
| State server | **TanStack Query v5**                                    | ✓                                                                                                           |
| State global | **Zustand 5**                                            | ✓                                                                                                           |
| HTTP         | **Axios**                                                | ✓                                                                                                           |
| Validation   | **Zod + react-hook-form**                                | Added (cahier silent). Critical for banking-grade input validation.                                         |
| Styling      | **NativeWind v4**                                        | Replaces React Native Paper. The Figma prototype is Tailwind/shadcn-based, not Material.                    |
| Storage      | **expo-secure-store** + **AsyncStorage**                 | More explicit than the cahier.                                                                              |
| i18n         | **i18next + react-i18next**                              | Added. Future-proofing for WO/EN.                                                                           |
| Tests        | **Jest + RNTL + MSW**                                    | Added.                                                                                                      |
| Lint         | **ESLint + Prettier + Husky + lint-staged + commitlint** | Added. CI hygiene.                                                                                          |

## Consequences

- The team writes Tailwind classes both in the web prototype (Vite) and the
  RN app, lowering the integration cost when porting screens.
- We diverge from React Native Paper. If a stakeholder requires Material
  Design later, we'll layer Paper on top of NativeWind for specific screens —
  not on the whole app.
- Expo Router gives us type-safe routes via `experiments.typedRoutes`. The
  cahier des charges still names "React Navigation 6"; Expo Router uses
  RN 6 internally, so the spirit of the requirement is preserved.
- NativeWind v4 is still maturing; we mitigate this by centralising tokens
  in `src/core/theme/tokens.ts` so a swap to a pure StyleSheet-based system
  remains feasible.

## Alternatives considered

- **Pure React Navigation 6 + StyleSheet** — strict match to cahier, but
  loses the prototype's Tailwind ergonomics and adds boilerplate.
- **Tamagui** — strong design system, but heavier integration cost for a
  5-day MVP.
- **React Native Paper** — Material Design conflicts with the shadcn-based
  prototype.
