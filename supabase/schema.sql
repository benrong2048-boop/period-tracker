-- Period Tracker: PostgreSQL schema for Supabase
-- Run this in Supabase SQL Editor to create tables

-- Period records: each row = one period (start + optional end)
create table if not exists public.periods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  start_date date not null,
  end_date date,
  cycle_length_days int default 28,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint valid_dates check (end_date is null or end_date >= start_date)
);

-- Enable RLS
alter table public.periods enable row level security;

-- Policies: users can only access their own rows (when using auth)
-- For anonymous/demo: allow all for simplicity; tighten in production
create policy "Users can manage own periods"
  on public.periods for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- For demo without login: anon can read/insert rows where user_id is null
create policy "Anon can use periods with null user_id"
  on public.periods for all
  using (user_id is null)
  with check (user_id is null);

-- Index for fast lookups by user and date
create index if not exists idx_periods_user_start on public.periods(user_id, start_date desc);

-- Daily reminder preference (optional)
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  reminder_enabled boolean default true,
  reminder_hour int default 9,
  reminder_minute int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_settings enable row level security;

create policy "Users can manage own settings"
  on public.user_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
