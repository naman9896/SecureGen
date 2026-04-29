/**
 * Calculates password entropy (bits) and maps it to a strength label.
 * entropy = log2(poolSize ^ length) = length * log2(poolSize)
 */
export function calcStrength(password) {
  if (!password) return { score: 0, label: 'None', bits: 0 };

  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 32;

  const bits = Math.round(password.length * Math.log2(pool || 1));

  let score, label;
  if (bits < 40) {
    score = 1; label = 'Weak';
  } else if (bits < 60) {
    score = 2; label = 'Fair';
  } else if (bits < 80) {
    score = 3; label = 'Strong';
  } else {
    score = 4; label = 'Very Strong';
  }

  return { score, label, bits };
}

export const STRENGTH_COLORS = {
  1: '#ef4444',
  2: '#f59e0b',
  3: '#10b981',
  4: '#10b981',
};

export const STRENGTH_TEXT_COLORS = {
  1: 'text-red-400',
  2: 'text-amber-400',
  3: 'text-emerald-400',
  4: 'text-emerald-400',
};
