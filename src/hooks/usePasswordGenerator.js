import { useState, useCallback } from 'react';
import { generatePassword } from '../utils/crypto';
import { calcStrength } from '../utils/strength';
import { useVaultSync } from './useVaultSync';

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
  const [localHistory, setLocalHistory] = useState([]);
  const { synced, locked, remoteHistory, loading, saveEntries, clearAll } = useVaultSync('password');

  const history = synced ? remoteHistory : localHistory;

  const generate = useCallback((overrides = {}) => {
    const merged = { ...opts, ...overrides };
    const pw = generatePassword(merged);
    setPassword(pw);
    if (synced) {
      saveEntries([{ value: pw }]);
    } else {
      setLocalHistory(prev => [{ value: pw, createdAt: Date.now() }, ...prev.slice(0, MAX_HISTORY - 1)]);
    }
    return pw;
  }, [opts, synced, saveEntries]);

  // Live preview only while the user drags sliders/toggles options — not persisted,
  // so adjusting settings doesn't flood synced history with intermediate values.
  const updateOpt = useCallback((key, value) => {
    setOpts(prev => {
      const next = { ...prev, [key]: value };
      const pw = generatePassword(next);
      setPassword(pw);
      if (!synced) {
        setLocalHistory(h => [{ value: pw, createdAt: Date.now() }, ...h.slice(0, MAX_HISTORY - 1)]);
      }
      return next;
    });
  }, [synced]);

  const strength = calcStrength(password);

  return {
    password,
    opts,
    strength,
    generate,
    updateOpt,
    history,
    clearHistory: clearAll,
    locked,
    syncing: loading,
  };
}
