/**
 * Client-side encryption service using TweetNaCl sealed box (X25519).
 *
 * Implements libsodium crypto_box_seal manually with tweetnacl.
 * Compatible with PyNaCl SealedBox on the backend.
 *
 * Flow:
 *   1. Fetch server's public key from /auth/public-key/
 *   2. Encrypt credentials with sealed_box (ephemeral keypair + X25519-XSalsa20-Poly1305)
 *   3. Send base64-encoded ciphertext in `encrypted_payload` field
 *
 * Security properties:
 *   - Forward secrecy (ephemeral sender keypair)
 *   - Authenticated encryption (Poly1305 MAC)
 *   - No PII in transit logs (credentials never sent in clear)
 *
 * Algorithm:
 *   - Key exchange:      X25519 (Curve25519)
 *   - Encryption:        XSalsa20
 *   - Authentication:    Poly1305
 *   - Nonce:             blake2b(ephemeral_pk || recipient_pk)[0:24]
 *
 * Format: [ ephemeralPublicKey (32 bytes) | box (msg + 16 bytes MAC) ]
 *
 * PRNG: Uses expo-random polyfill (imported in index.js)
 */
import * as blake from 'blakejs';
import nacl from 'tweetnacl';
import { decodeBase64, encodeBase64, decodeUTF8 } from 'tweetnacl-util';

const PUBLIC_KEY_SIZE = 32; // Curve25519
const NONCE_LENGTH = 24; // XSalsa20

let _serverPublicKey: Uint8Array | null = null;

/**
 * Cast to Uint8Array — tweetnacl is strict on types.
 */
function toU8(v: ArrayLike<number> | ArrayBufferLike): Uint8Array {
  return v instanceof Uint8Array ? v : new Uint8Array(v as ArrayBufferLike);
}

/**
 * Derive the deterministic nonce used by libsodium sealed box.
 *
 * libsodium uses Blake2b:
 *   nonce = blake2b(ephemeral_pk || recipient_pk, outlen=24)
 *
 * This is the EXACT implementation used by libsodium crypto_box_seal.
 */
function deriveNonce(ephemeralPublicKey: Uint8Array, recipientPublicKey: Uint8Array): Uint8Array {
  // Concatenate ephemeral_pk || recipient_pk
  const combined = new Uint8Array(ephemeralPublicKey.length + recipientPublicKey.length);
  combined.set(ephemeralPublicKey, 0);
  combined.set(recipientPublicKey, ephemeralPublicKey.length);

  // Blake2b hash with output length = 24 bytes (NONCE_LENGTH)
  const hash = blake.blake2b(combined, undefined, NONCE_LENGTH);
  return new Uint8Array(hash);
}

/**
 * Initialize crypto. TweetNaCl uses the global crypto.getRandomValues polyfill.
 * Waits for the polyfill to be available with retry logic.
 * Safe to call multiple times (idempotent).
 */
export async function initCrypto(): Promise<void> {
  const MAX_RETRIES = 10;
  const RETRY_DELAY_MS = 50;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      try {
        // Verify only that the function executes without exception
        // Do NOT check returned values — false positives possible on Android
        const testBuffer = new Uint8Array(32);
        crypto.getRandomValues(testBuffer);
        return; // ✅ Polyfill available and functional
      } catch {
        // Not ready yet — retry
      }
    }

    if (attempt < MAX_RETRIES - 1) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }

  throw new Error(
    '[encryption] PRNG not available after retries. ' +
      'Ensure react-native-get-random-values is imported in index.js BEFORE expo-router/entry.',
  );
}

/**
 * Store the server's public key (base64-encoded X25519 key).
 * Must be called after fetching from /auth/public-key/ endpoint.
 */
export function setServerPublicKey(publicKeyB64: string): void {
  _serverPublicKey = decodeBase64(publicKeyB64);
}

/**
 * Get the currently stored server public key.
 */
export function getServerPublicKey(): Uint8Array | null {
  return _serverPublicKey;
}

/**
 * Encrypt a payload using libsodium sealed box (crypto_box_seal).
 *
 * @param payload - Plain object to encrypt (will be JSON-stringified)
 * @returns Base64-encoded ciphertext
 * @throws Error if public key not set or encryption fails
 */
export function encryptPayload(payload: Record<string, unknown>): string {
  // Guard PRNG — detect calls before initialization
  if (typeof crypto === 'undefined' || typeof crypto.getRandomValues !== 'function') {
    throw new Error(
      '[encryption] No PRNG. Import react-native-get-random-values as the first line of index.js.',
    );
  }

  if (!_serverPublicKey) {
    throw new Error('[encryption] Server public key not set. Call setServerPublicKey() first.');
  }

  const recPK = toU8(_serverPublicKey);
  if (recPK.length !== PUBLIC_KEY_SIZE) {
    throw new Error(
      `[encryption] Invalid public key: ${recPK.length} bytes received, ${PUBLIC_KEY_SIZE} expected`,
    );
  }

  const plaintext = JSON.stringify(payload);
  const messageBytes = toU8(decodeUTF8(plaintext));

  // Generate ephemeral keypair
  const ephemeral = nacl.box.keyPair();
  const ephPK = toU8(ephemeral.publicKey);
  const ephSK = toU8(ephemeral.secretKey);

  // Derive nonce from public keys
  const nonce = deriveNonce(ephPK, recPK);

  // Encrypt with nacl.box (X25519 + XSalsa20 + Poly1305)
  const boxed = nacl.box(messageBytes, nonce, recPK, ephSK);
  if (!boxed) {
    throw new Error('[encryption] Encryption failed (nacl.box returned null)');
  }

  // Format: ephemeralPublicKey (32) || MAC+ciphertext (msg.length + 16)
  const ciphertext = new Uint8Array(PUBLIC_KEY_SIZE + boxed.length);
  ciphertext.set(ephPK, 0);
  ciphertext.set(toU8(boxed), PUBLIC_KEY_SIZE);

  return encodeBase64(ciphertext);
}

/**
 * Clear the stored server public key (e.g., on logout or key rotation).
 */
export function clearServerPublicKey(): void {
  _serverPublicKey = null;
}
