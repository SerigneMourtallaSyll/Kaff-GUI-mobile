# Fonts

The app uses **Konnect** as its primary type family. The repository does NOT
ship the font files (Konnect is a commercial font — keep the binaries out of
version control). Drop the following four files in this folder:

```
assets/fonts/
├── Konnect-Regular.otf      (weight 400)
├── Konnect-Medium.otf       (weight 500)
├── Konnect-SemiBold.otf     (weight 600)
└── Konnect-Bold.otf         (weight 700)
```

`.ttf` files work just as well as `.otf` — adjust the file extensions in
`src/core/theme/fonts.ts` if your distribution uses TTF.

Once the files are in place:

1. Make sure `src/core/theme/fonts.ts` references them (it does by default).
2. Restart the Metro bundler: `npm run start -- --reset-cache`.

If the files are missing at runtime, `useAppFonts` silently falls back to
the platform default font (no crash, just slightly different look). This
makes local development work even before the fonts are obtained.

## Why are font binaries gitignored?

Konnect is licensed per-developer / per-app. Committing binaries can violate
the license and bloats the Git history. Each developer drops the files
locally; production builds get them through EAS Build assets.
