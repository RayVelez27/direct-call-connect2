-- ============================================================
-- Profile Views Tracking Table
-- Run this migration in the Supabase SQL Editor.
-- ============================================================

create table if not exists public.profile_views (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references public.creator_profiles (id) on delete cascade,
  viewer_id     uuid references public.profiles (id) on delete set null,
  viewed_at     timestamptz not null default now()
);

alter table public.profile_views enable row level security;

create policy "Anyone can insert profile views"
  on public.profile_views for insert with check (true);

create policy "Creators can view own profile views"
  on public.profile_views for select using (
    auth.uid() = (select user_id from public.creator_profiles where id = profile_id)
  );

create index idx_profile_views_profile_id on public.profile_views (profile_id);
create index idx_profile_views_viewed_at on public.profile_views (viewed_at);
