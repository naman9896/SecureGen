// Client-side encryption for synced history — Supabase only ever stores ciphertext.
const PBKDF2_ITERATIONS = 100000;

function toBase64(bytes) {
  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(str) {
  return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}

/**
 * Derives an AES-GCM key from the user's account password.
 * The salt is the user's (non-secret) Supabase UUID, giving a unique key per user
 * without needing a separate salt round-trip to the server.
 */
export async function deriveVaultKey(password, userId) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode(userId), iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptValue(key, plaintext) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertextBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plaintext));
  return { iv: toBase64(iv), ciphertext: toBase64(new Uint8Array(ciphertextBuf)) };
}

/**
 * Throws if `key` doesn't match the key the value was encrypted with (AES-GCM auth tag mismatch) —
 * this is what lets us detect a wrong unlock password.
 */
export async function decryptValue(key, { iv, ciphertext }) {
  const plainBuf = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(iv) },
    key,
    fromBase64(ciphertext)
  );
  return new TextDecoder().decode(plainBuf);
}
