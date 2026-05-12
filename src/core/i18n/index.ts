/**
 * i18n bootstrap.
 *
 * Default language is French (cahier des charges). English is provided as a
 * fallback. Add a new locale by dropping a JSON file in `locales/` and
 * registering it below — keys must match the FR file (treat FR as canonical).
 */
import * as Localization from 'expo-localization';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fr from './locales/fr.json';

export const resources = {
  fr: { translation: fr },
  en: { translation: en },
} as const;

export type SupportedLocale = keyof typeof resources;

const detectLocale = (): SupportedLocale => {
  const tag = Localization.getLocales()[0]?.languageCode ?? 'fr';
  return (tag in resources ? tag : 'fr') as SupportedLocale;
};

void i18n.use(initReactI18next).init({
  resources,
  lng: detectLocale(),
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
  returnNull: false,
  compatibilityJSON: 'v4',
});

export { i18n };
export default i18n;
