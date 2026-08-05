-- Run this once in your Supabase project's SQL editor (Dashboard → SQL Editor → New query).
-- Stores only client-side-encrypted ciphertext — SecureGen's server (Supabase) never sees
-- plaintext passwords or API keys.

create table if not exists public.generated_secrets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('password', 'api_key')),
  ciphertext text not null,
  iv text not null,
  format text,
  prefix text,
  created_at timestamptz not null default now()
);

alter table public.generated_secrets enable row level security;

create policy "select own secrets"
  on public.generated_secrets for select
  using (auth.uid() = user_id);

create policy "insert own secrets"
  on public.generated_secrets for insert
  with check (auth.uid() = user_id);

create policy "delete own secrets"
  on public.generated_secrets for delete
  using (auth.uid() = user_id);

create index if not exists generated_secrets_user_kind_idx
  on public.generated_secrets (user_id, kind, created_at desc);
