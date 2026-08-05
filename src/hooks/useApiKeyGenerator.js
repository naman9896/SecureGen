import { useState, useCallback } from 'react';
import { generateApiKeys } from '../utils/crypto';
import { useVaultSync } from './useVaultSync';

const DEFAULT_OPTS = {
  length: 32,
  format: 'alphanumeric',
  prefix: '',
  count: 1,
};

const MAX_RESULTS = 20;

export function useApiKeyGenerator() {
  const [opts, setOpts] = useState(DEFAULT_OPTS);
  const [localKeys, setLocalKeys] = useState([]);
  const { synced, locked, remoteHistory, loading, saveEntries, clearAll } = useVaultSync('api_key');

  const keys = synced ? remoteHistory : localKeys;

  const generate = useCallback(async (overrides = {}) => {
    const merged = { ...opts, ...overrides };
    const values = generateApiKeys(merged);

    if (synced) {
      const entries = values.map(v => ({ value: v, format: merged.format, prefix: merged.prefix }));
      return saveEntries(entries);
    }

    const newKeys = values.map(v => ({
      value: v,
      createdAt: Date.now(),
      format: merged.format,
      prefix: merged.prefix,
    }));
    setLocalKeys(prev => [...newKeys, ...prev].slice(0, MAX_RESULTS));
    return newKeys;
  }, [opts, synced, saveEntries]);

  const updateOpt = useCallback((key, value) => {
    setOpts(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    keys,
    opts,
    generate,
    updateOpt,
    clearKeys: clearAll,
    locked,
    syncing: loading,
  };
}
