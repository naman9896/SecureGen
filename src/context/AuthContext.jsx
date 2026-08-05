import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { deriveVaultKey } from '../lib/vaultCrypto';
import { AuthContext } from '../hooks/useAuth';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [unlockError, setUnlockError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        setEncryptionKey(null);
        setUnlockError('');
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const signUp = async ({ email, password, firstName, lastName }) => {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured yet.');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName } },
    });
    if (error) throw error;
    if (data.user) setEncryptionKey(await deriveVaultKey(password, data.user.id));
  };

  const signIn = async ({ email, password }) => {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured yet.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUnlockError('');
    setEncryptionKey(await deriveVaultKey(password, data.user.id));
  };

  const signInWithProvider = async provider => {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured yet.');
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) throw error;
  };

  const signOut = async () => {
    setEncryptionKey(null);
    setUnlockError('');
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  };

  // Re-derives the vault key for an already-authenticated session (e.g. after a page
  // reload) where we have a valid Supabase session but no password in memory to have
  // derived the key from yet.
  const unlock = async password => {
    if (!session?.user) return;
    setUnlockError('');
    setEncryptionKey(await deriveVaultKey(password, session.user.id));
  };

  // Called when decrypting existing rows with the current key fails — signals the
  // unlock password was wrong, so we drop back to a locked state for another attempt.
  const reportDecryptFailure = () => {
    setEncryptionKey(null);
    setUnlockError("That password doesn't match your account. Try again.");
  };

  const user = session?.user ?? null;

  const value = {
    user,
    loading,
    configured: isSupabaseConfigured,
    encryptionKey,
    locked: Boolean(user) && !encryptionKey,
    unlockError,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    unlock,
    reportDecryptFailure,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
