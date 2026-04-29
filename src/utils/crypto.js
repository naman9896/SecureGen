// All generation uses the Web Crypto API (CSPRNG) — never Math.random()

const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  ambiguous: /[O0lI1]/g,
};

/**
 * Returns a cryptographically secure random integer in [0, max).
 */
function randomInt(max) {
  const arr = new Uint32Array(1);
  const limit = 2 ** 32 - ((2 ** 32) % max);
  do {
    crypto.getRandomValues(arr);
  } while (arr[0] >= limit); // rejection sampling to avoid modulo bias
  return arr[0] % max;
}

/**
 * Generates a random password according to the provided options.
 */
export function generatePassword({
  length = 16,
  uppercase = true,
  lowercase = true,
  numbers = true,
  symbols = true,
  avoidAmbiguous = false,
}) {
  let pool = '';
  const required = [];

  if (uppercase) {
    let s = CHARSETS.upper;
    if (avoidAmbiguous) s = s.replace(CHARSETS.ambiguous, '');
    pool += s;
    required.push(s[randomInt(s.length)]);
  }
  if (lowercase) {
    let s = CHARSETS.lower;
    if (avoidAmbiguous) s = s.replace(CHARSETS.ambiguous, '');
    pool += s;
    required.push(s[randomInt(s.length)]);
  }
  if (numbers) {
    let s = CHARSETS.numbers;
    if (avoidAmbiguous) s = s.replace(CHARSETS.ambiguous, '');
    pool += s;
    required.push(s[randomInt(s.length)]);
  }
  if (symbols) {
    const s = CHARSETS.symbols;
    pool += s;
    required.push(s[randomInt(s.length)]);
  }

  if (!pool) pool = CHARSETS.lower; // fallback

  const remaining = length - required.length;
  const chars = Array.from({ length: remaining }, () => pool[randomInt(pool.length)]);
  const all = [...required, ...chars];

  // Fisher-Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [all[i], all[j]] = [all[j], all[i]];
  }

  return all.join('');
}

const HEX_CHARS = '0123456789abcdef';
const ALNUM_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generates a single API key in the requested format.
 */
export function generateApiKey({ length = 32, format = 'alphanumeric', prefix = '' }) {
  let key;

  if (format === 'hex') {
    key = Array.from({ length }, () => HEX_CHARS[randomInt(HEX_CHARS.length)]).join('');
  } else if (format === 'base64') {
    // Generate raw random bytes then base64-encode them
    const byteCount = Math.ceil((length * 3) / 4);
    const bytes = new Uint8Array(byteCount);
    crypto.getRandomValues(bytes);
    key = btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
      .slice(0, length);
  } else {
    // alphanumeric
    key = Array.from({ length }, () => ALNUM_CHARS[randomInt(ALNUM_CHARS.length)]).join('');
  }

  return `${prefix}${key}`;
}

/**
 * Generates multiple API keys at once.
 */
export function generateApiKeys({ count = 1, ...opts }) {
  return Array.from({ length: count }, () => generateApiKey(opts));
}
