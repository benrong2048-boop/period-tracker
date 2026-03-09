-- Fix for: PGRST204 "Could not find the 'user_id' column of 'periods'"
-- If you created `public.periods` before adding `user_id`, run this.

alter table public.periods
  add column if not exists user_id uuid;

-- If you want to link it to Supabase Auth users (optional):
-- alter table public.periods
--   add constraint periods_user_id_fkey
--   foreign key (user_id) references auth.users(id) on delete cascade;

-- Helpful index (optional)
create index if not exists idx_periods_user_start on public.periods(user_id, start_date desc);

