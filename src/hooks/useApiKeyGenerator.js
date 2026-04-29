import { useState, useCallback } from 'react';
import { generateApiKeys } from '../utils/crypto';

const DEFAULT_OPTS = {
  length: 32,
  format: 'alphanumeric',
  prefix: '',
  count: 1,
};

const MAX_RESULTS = 20;

export function useApiKeyGenerator() {
  const [opts, setOpts] = useState(DEFAULT_OPTS);
  const [keys, setKeys] = useState([]);

  const generate = useCallback((overrides = {}) => {
    const merged = { ...opts, ...overrides };
    const newKeys = generateApiKeys(merged).map(k => ({
      value: k,
      createdAt: Date.now(),
      format: merged.format,
      prefix: merged.prefix,
    }));
    setKeys(prev => [...newKeys, ...prev].slice(0, MAX_RESULTS));
    return newKeys;
  }, [opts]);

  const updateOpt = useCallback((key, value) => {
    setOpts(prev => ({ ...prev, [key]: value }));
  }, []);

  return { keys, opts, generate, updateOpt, clearKeys: () => setKeys([]) };
}
