import { useState, useCallback } from 'react';
import { generatePassword } from '../utils/crypto';
import { calcStrength } from '../utils/strength';

const MAX_HISTORY = 10;

const DEFAULT_OPTS = {
  length: 24,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  avoidAmbiguous: false,
};

export function usePasswordGenerator() {
  const [opts, setOpts] = useState(DEFAULT_OPTS);
  const [password, setPassword] = useState(() => generatePassword(DEFAULT_OPTS));
  const [history, setHistory] = useState([]);

  const generate = useCallback((overrides = {}) => {
    const merged = { ...opts, ...overrides };
    const pw = generatePassword(merged);
    setPassword(pw);
    setHistory(prev => [
      { value: pw, createdAt: Date.now() },
      ...prev.slice(0, MAX_HISTORY - 1),
    ]);
    return pw;
  }, [opts]);

  const updateOpt = useCallback((key, value) => {
    setOpts(prev => {
      const next = { ...prev, [key]: value };
      const pw = generatePassword(next);
      setPassword(pw);
      setHistory(h => [{ value: pw, createdAt: Date.now() }, ...h.slice(0, MAX_HISTORY - 1)]);
      return next;
    });
  }, []);

  const strength = calcStrength(password);

  return { password, opts, strength, generate, updateOpt, history, clearHistory: () => setHistory([]) };
}
