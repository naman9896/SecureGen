import { supabase } from './supabaseClient';

const TABLE = 'generated_secrets';

export async function fetchSecrets(kind) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, ciphertext, iv, format, prefix, created_at')
    .eq('kind', kind)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function insertSecrets(kind, userId, rows) {
  const payload = rows.map(r => ({
    user_id: userId,
    kind,
    ciphertext: r.ciphertext,
    iv: r.iv,
    format: r.format ?? null,
    prefix: r.prefix ?? null,
  }));
  const { data, error } = await supabase.from(TABLE).insert(payload).select('id, created_at');
  if (error) throw error;
  return data;
}

export async function deleteAllSecrets(kind, userId) {
  const { error } = await supabase.from(TABLE).delete().eq('kind', kind).eq('user_id', userId);
  if (error) throw error;
}
