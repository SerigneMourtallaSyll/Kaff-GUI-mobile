/**
 * lib/crypto/polyfill.ts
 *
 * Polyfill de crypto.getRandomValues() via expo-random.
 * Compatible avec Expo Go (pas besoin de rebuild natif).
 *
 * À importer EN PREMIER dans index.js avant expo-router/entry.
 */
import * as Random from 'expo-random';

// Polyfill global crypto.getRandomValues
if (typeof crypto === 'undefined') {
  // @ts-ignore — global crypto non défini sur certaines versions RN
  globalThis.crypto = {};
}

if (typeof globalThis.crypto.getRandomValues !== 'function') {
  globalThis.crypto.getRandomValues = function getRandomValues<T extends ArrayBufferView>(
    buffer: T,
  ): T {
    if (
      !(buffer instanceof Uint8Array) &&
      !(buffer instanceof Int8Array) &&
      !(buffer instanceof Uint16Array) &&
      !(buffer instanceof Int16Array) &&
      !(buffer instanceof Uint32Array) &&
      !(buffer instanceof Int32Array)
    ) {
      throw new TypeError('Expected ArrayBufferView');
    }

    // expo-random.getRandomBytes est synchrone
    const bytes = Random.getRandomBytes(buffer.byteLength);
    const view = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    view.set(bytes);

    return buffer;
  };
}
