/**
 * Jest global setup.
 * - testing-library v12+ matchers are auto-extended via its main entry.
 * - Mocks native modules unavailable in the JSDOM/jest-expo env.
 */
import '@testing-library/react-native';

// expo-secure-store is a native module — mock it for unit tests.
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => undefined),
  deleteItemAsync: jest.fn(async () => undefined),
  WHEN_UNLOCKED: 'WHEN_UNLOCKED',
}));

// AsyncStorage — official mock recommended by the maintainer.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Reanimated mock — recommended by the library.
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// expo-localization — return a stable locale in tests.
jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'fr' }],
}));
