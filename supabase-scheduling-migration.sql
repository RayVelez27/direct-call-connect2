-- ============================================================
-- Plezyy — Scheduling & Availability Migration
-- Run this in the Supabase SQL Editor.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. CREATOR AVAILABILITY (weekly recurring slots)
-- ────────────────────────────────────────────────────────────

create table if not exists public.creator_availability (
  id              uuid primary key default gen_random_uuid(),
  creator_id      uuid not null references public.creator_profiles (id) on delete cascade,
  day_of_week     smallint not null check (day_of_week between 0 and 6), -- 0=Sunday, 6=Saturday
  start_time      time not null,
  end_time        time not null,
  is_active       boolean not null default true,
  timezone        text not null default 'America/New_York',

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint valid_time_range check (end_time > start_time),
  constraint unique_creator_day_slot unique (creator_id, day_of_week, start_time)
);

alter table public.creator_availability enable row level security;

create policy "Availability is viewable by everyone"
  on public.creator_availability for select using (is_active = true);

create policy "Creators can manage own availability"
  on public.creator_availability for all using (
    auth.uid() = (select user_id from public.creator_profiles where id = creator_id)
  );

-- ────────────────────────────────────────────────────────────
-- 2. CREATOR BLOCKED DATES (specific dates off)
-- ────────────────────────────────────────────────────────────

create table if not exists public.creator_blocked_dates (
  id              uuid primary key default gen_random_uuid(),
  creator_id      uuid not null references public.creator_profiles (id) on delete cascade,
  blocked_date    date not null,
  reason          text,

  created_at      timestamptz not null default now(),

  constraint unique_creator_blocked_date unique (creator_id, blocked_date)
);

alter table public.creator_blocked_dates enable row level security;

create policy "Blocked dates are viewable by everyone"
  on public.creator_blocked_dates for select using (true);

create policy "Creators can manage own blocked dates"
  on public.creator_blocked_dates for all using (
    auth.uid() = (select user_id from public.creator_profiles where id = creator_id)
  );

-- ────────────────────────────────────────────────────────────
-- 3. INDEXES
-- ────────────────────────────────────────────────────────────

create index if not exists idx_creator_availability_creator
  on public.creator_availability (creator_id, day_of_week);

create index if not exists idx_creator_blocked_dates_creator
  on public.creator_blocked_dates (creator_id, blocked_date);

create index if not exists idx_bookings_creator_scheduled
  on public.bookings (creator_id, scheduled_at)
  where status in ('pending', 'confirmed');
