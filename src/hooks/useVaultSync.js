import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { decryptValue, encryptValue } from '../lib/vaultCrypto';
import { deleteAllSecrets, fetchSecrets, insertSecrets } from '../lib/supabaseSecrets';

/**
 * Persists a per-user, per-kind ('password' | 'api_key') history to Supabase,
 * encrypted client-side with the account's derived vault key. Falls back to
 * `synced: false` (caller keeps its own local/ephemeral state) whenever the
 * user is signed out or the vault is locked.
 */
export function useVaultSync(kind) {
  const { user, encryptionKey, locked, reportDecryptFailure } = useAuth();
  const synced = Boolean(user && encryptionKey);
  const [remoteHistory, setRemoteHistory] = useState([]);
  // Tracks whose data `remoteHistory` currently holds, so switching accounts
  // never briefly shows the previous user's decrypted values while the new
  // fetch is still in flight.
  const [ownerId, setOwnerId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!synced) return;

    let cancelled = false;
    // Standard fetch-on-dependency-change loading flag; the async .then/.catch below
    // are what actually resolve the fetch, this just marks it as in flight.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    fetchSecrets(kind)
      .then(async rows => {
        const decrypted = [];
        let failures = 0;
        for (const row of rows) {
          try {
            const value = await decryptValue(encryptionKey, row);
            decrypted.push({
              id: row.id,
              value,
              createdAt: new Date(row.created_at).getTime(),
              format: row.format ?? undefined,
              prefix: row.prefix ?? undefined,
            });
          } catch {
            failures += 1;
          }
        }
        if (cancelled) return;
        if (rows.length > 0 && failures === rows.length) {
          reportDecryptFailure();
          return;
        }
        setRemoteHistory(decrypted);
        setOwnerId(user.id);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [synced, encryptionKey, kind, user, reportDecryptFailure]);

  const saveEntries = useCallback(
    async entries => {
      if (!synced) return [];
      const encrypted = await Promise.all(
        entries.map(async e => {
          const { iv, ciphertext } = await encryptValue(encryptionKey, e.value);
          return { iv, ciphertext, format: e.format, prefix: e.prefix };
        })
      );
      const inserted = await insertSecrets(kind, user.id, encrypted);
      const rows = inserted.map((row, i) => ({
        id: row.id,
        value: entries[i].value,
        createdAt: new Date(row.created_at).getTime(),
        format: entries[i].format,
        prefix: entries[i].prefix,
      }));
      setRemoteHistory(prev => [...rows, ...prev]);
      setOwnerId(user.id);
      return rows;
    },
    [synced, encryptionKey, kind, user]
  );

  const clearAll = useCallback(async () => {
    if (synced) await deleteAllSecrets(kind, user.id);
    setRemoteHistory([]);
    setOwnerId(user?.id ?? null);
  }, [synced, kind, user]);

  // Only expose remoteHistory once we're sure it belongs to the currently signed-in user.
  const safeHistory = synced && ownerId === user.id ? remoteHistory : [];

  return { synced, locked, remoteHistory: safeHistory, loading, saveEntries, clearAll };
}
