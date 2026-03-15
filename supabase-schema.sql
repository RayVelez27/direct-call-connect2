-- ============================================================
-- Plezyy — Full Supabase Schema
-- Run this entire file as one script in the Supabase SQL Editor.
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. ENUMS
-- ────────────────────────────────────────────────────────────

create type public.user_role as enum ('consumer', 'creator');

create type public.gender as enum (
  'female', 'male', 'non_binary', 'trans', 'prefer_not_to_say'
);

create type public.sexual_preference as enum (
  'straight', 'bisexual', 'lesbian', 'gay', 'pansexual', 'other'
);

create type public.profile_visibility as enum ('public', 'members_only');

create type public.gov_id_type as enum ('passport', 'drivers_license', 'national_id');

create type public.verification_status as enum ('pending', 'verified', 'rejected');

create type public.booking_status as enum (
  'pending', 'confirmed', 'completed', 'cancelled', 'disputed'
);

create type public.session_type as enum (
  'video_call', 'live_session', 'custom_content', 'message'
);

create type public.transaction_type as enum (
  'booking_payment', 'refund', 'payout'
);

create type public.transaction_status as enum (
  'pending', 'processing', 'completed', 'failed', 'refunded'
);

create type public.media_type as enum ('photo', 'video', 'preview_video');

create type public.message_type as enum ('text', 'image', 'media');


-- ────────────────────────────────────────────────────────────
-- 2. PROFILES
-- ────────────────────────────────────────────────────────────

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  role        public.user_role not null default 'consumer',
  email       text not null,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);


-- ────────────────────────────────────────────────────────────
-- 3. CREATOR PROFILES
-- ────────────────────────────────────────────────────────────

create table public.creator_profiles (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null unique references public.profiles (id) on delete cascade,
  display_name        text not null,
  date_of_birth       date not null,
  gender              public.gender,
  nationality         text,
  country_region      text,
  sexual_preference   public.sexual_preference,
  bio                 text check (char_length(bio) <= 500),
  tagline             text check (char_length(tagline) <= 80),
  categories          text[] not null default '{}',
  cover_photo_url     text,
  visibility          public.profile_visibility not null default 'public',
  slug                text unique,

  -- stats (denormalized for fast reads)
  average_rating      numeric(3,2) not null default 0,
  total_reviews       integer not null default 0,
  completion_rate     numeric(5,2) not null default 100,
  avg_response_time   text,

  -- status flags
  is_online           boolean not null default false,
  is_verified         boolean not null default false,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.creator_profiles enable row level security;

create policy "Creator profiles are viewable by everyone"
  on public.creator_profiles for select using (true);

create policy "Creators can update own profile"
  on public.creator_profiles for update using (auth.uid() = user_id);

create policy "Creators can insert own profile"
  on public.creator_profiles for insert with check (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────
-- 4. CREATOR VERIFICATIONS
-- ────────────────────────────────────────────────────────────

create table public.creator_verifications (
  id                    uuid primary key default gen_random_uuid(),
  creator_id            uuid not null unique references public.creator_profiles (id) on delete cascade,
  full_legal_name       text not null,
  date_of_birth         date not null,
  gov_id_type           public.gov_id_type not null,
  gov_id_document_url   text,

  address_street        text,
  address_city          text,
  address_state         text,
  address_zip           text,
  address_country       text,

  status                public.verification_status not null default 'pending',
  rejection_reason      text,
  verified_at           timestamptz,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.creator_verifications enable row level security;

create policy "Creators can view own verification"
  on public.creator_verifications for select using (
    auth.uid() = (select user_id from public.creator_profiles where id = creator_id)
  );

create policy "Creators can insert own verification"
  on public.creator_verifications for insert with check (
    auth.uid() = (select user_id from public.creator_profiles where id = creator_id)
  );

create policy "Creators can update own verification"
  on public.creator_verifications for update using (
    auth.uid() = (select user_id from public.creator_profiles where id = creator_id)
  );


-- ────────────────────────────────────────────────────────────
-- 5. PAYOUT ACCOUNTS
-- ────────────────────────────────────────────────────────────

create table public.payout_accounts (
  id                        uuid primary key default gen_random_uuid(),
  creator_id                uuid not null references public.creator_profiles (id) on delete cascade,
  payout_method             text not null default 'stripe' check (payout_method in ('stripe', 'manual_bank')),

  -- Stripe
  stripe_account_id         text,
  stripe_connected_at       timestamptz,

  -- Manual bank (store sensitive fields encrypted or via Vault)
  bank_account_name         text,
  bank_account_number       text,
  bank_routing_number       text,
  bank_swift_code           text,

  is_primary                boolean not null default true,
  is_active                 boolean not null default true,

  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

alter table public.payout_accounts enable row level security;

create policy "Creators can manage own payout accounts"
  on public.payout_accounts for all using (
    auth.uid() = (select user_id from public.creator_profiles where id = creator_id)
  );


-- ────────────────────────────────────────────────────────────
-- 6. SERVICES
-- ────────────────────────────────────────────────────────────

create table public.services (
  id                  uuid primary key default gen_random_uuid(),
  creator_id          uuid not null references public.creator_profiles (id) on delete cascade,
  name                text not null,
  description         text,
  category            text not null,
  subcategory         text,

  base_price          numeric(10,2) not null check (base_price >= 0),
  currency            text not null default 'USD',
  duration_minutes    integer,

  is_active           boolean not null default true,
  display_order       integer not null default 0,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.services enable row level security;

create policy "Active services are viewable by everyone"
  on public.services for select using (is_active = true);

create policy "Creators can manage own services"
  on public.services for all using (
    auth.uid() = (select user_id from public.creator_profiles where id = creator_id)
  );


-- ────────────────────────────────────────────────────────────
-- 7. SERVICE TIERS
-- ────────────────────────────────────────────────────────────

create table public.service_tiers (
  id                uuid primary key default gen_random_uuid(),
  service_id        uuid not null references public.services (id) on delete cascade,
  label             text not null,
  name              text not null,
  description       text,
  price             numeric(10,2) not null check (price >= 0),
  duration_minutes  integer,
  features          jsonb not null default '[]',
  display_order     integer not null default 0,
  is_best_value     boolean not null default false,

  created_at        timestamptz not null default now()
);

alter table public.service_tiers enable row level security;

create policy "Service tiers are viewable by everyone"
  on public.service_tiers for select using (true);

create policy "Creators can manage own service tiers"
  on public.service_tiers for all using (
    auth.uid() = (
      select cp.user_id from public.creator_profiles cp
      join public.services s on s.creator_id = cp.id
      where s.id = service_id
    )
  );


-- ────────────────────────────────────────────────────────────
-- 8. BOOKINGS
-- ────────────────────────────────────────────────────────────

create table public.bookings (
  id                    uuid primary key default gen_random_uuid(),
  consumer_id           uuid not null references public.profiles (id) on delete cascade,
  creator_id            uuid not null references public.creator_profiles (id) on delete cascade,
  service_id            uuid not null references public.services (id),
  service_tier_id       uuid references public.service_tiers (id),

  scheduled_at          timestamptz,
  duration_minutes      integer,
  session_type          public.session_type,

  -- money
  total_amount          numeric(10,2) not null,
  platform_fee          numeric(10,2) not null default 0,
  creator_payout        numeric(10,2) not null default 0,
  currency              text not null default 'USD',

  consumer_notes        text,
  status                public.booking_status not null default 'pending',
  cancelled_by          text check (cancelled_by in ('consumer', 'creator')),
  cancellation_reason   text,
  cancelled_at          timestamptz,
  completed_at          timestamptz,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.bookings enable row level security;

create policy "Users can view own bookings"
  on public.bookings for select using (
    auth.uid() = consumer_id
    or auth.uid() = (select user_id from public.creator_profiles where id = creator_id)
  );

create policy "Consumers can create bookings"
  on public.bookings for insert with check (auth.uid() = consumer_id);

create policy "Booking participants can update"
  on public.bookings for update using (
    auth.uid() = consumer_id
    or auth.uid() = (select user_id from public.creator_profiles where id = creator_id)
  );


-- ────────────────────────────────────────────────────────────
-- 9. TRANSACTIONS
-- ────────────────────────────────────────────────────────────

create table public.transactions (
  id                        uuid primary key default gen_random_uuid(),
  booking_id                uuid not null references public.bookings (id) on delete cascade,
  consumer_id               uuid not null references public.profiles (id),
  creator_id                uuid not null references public.creator_profiles (id),

  amount                    numeric(10,2) not null,
  currency                  text not null default 'USD',
  type                      public.transaction_type not null,
  status                    public.transaction_status not null default 'pending',
  failure_reason            text,

  stripe_payment_intent_id  text,

  processed_at              timestamptz,
  created_at                timestamptz not null default now()
);

alter table public.transactions enable row level security;

create policy "Users can view own transactions"
  on public.transactions for select using (
    auth.uid() = consumer_id
    or auth.uid() = (select user_id from public.creator_profiles where id = creator_id)
  );


-- ────────────────────────────────────────────────────────────
-- 10. REVIEWS
-- ────────────────────────────────────────────────────────────

create table public.reviews (
  id                    uuid primary key default gen_random_uuid(),
  booking_id            uuid not null unique references public.bookings (id) on delete cascade,
  reviewer_id           uuid not null references public.profiles (id),
  creator_id            uuid not null references public.creator_profiles (id),

  rating                smallint not null check (rating between 1 and 5),
  comment               text,

  -- optional sub-ratings
  rating_communication  smallint check (rating_communication between 1 and 5),
  rating_reliability    smallint check (rating_reliability between 1 and 5),
  rating_authenticity   smallint check (rating_authenticity between 1 and 5),

  helpful_count         integer not null default 0,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on public.reviews for select using (true);

create policy "Consumers can create reviews for own bookings"
  on public.reviews for insert with check (auth.uid() = reviewer_id);

create policy "Reviewers can update own reviews"
  on public.reviews for update using (auth.uid() = reviewer_id);


-- ────────────────────────────────────────────────────────────
-- 11. CREATOR MEDIA
-- ────────────────────────────────────────────────────────────

create table public.creator_media (
  id                uuid primary key default gen_random_uuid(),
  creator_id        uuid not null references public.creator_profiles (id) on delete cascade,
  media_type        public.media_type not null,
  url               text not null,
  thumbnail_url     text,
  title             text,
  description       text,
  display_order     integer not null default 0,

  is_preview        boolean not null default false,
  requires_purchase boolean not null default false,

  created_at        timestamptz not null default now()
);

alter table public.creator_media enable row level security;

create policy "Preview media is viewable by everyone"
  on public.creator_media for select using (is_preview = true or requires_purchase = false);

create policy "Creators can manage own media"
  on public.creator_media for all using (
    auth.uid() = (select user_id from public.creator_profiles where id = creator_id)
  );


-- ────────────────────────────────────────────────────────────
-- 12. MESSAGES
-- ────────────────────────────────────────────────────────────

create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  sender_id       uuid not null references public.profiles (id),
  recipient_id    uuid not null references public.profiles (id),
  booking_id      uuid references public.bookings (id),

  message_type    public.message_type not null default 'text',
  content         text not null,

  is_read         boolean not null default false,
  read_at         timestamptz,

  created_at      timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Users can view own messages"
  on public.messages for select using (
    auth.uid() = sender_id or auth.uid() = recipient_id
  );

create policy "Users can send messages"
  on public.messages for insert with check (auth.uid() = sender_id);

create policy "Recipients can mark messages read"
  on public.messages for update using (auth.uid() = recipient_id);


-- ────────────────────────────────────────────────────────────
-- 13. FAVORITES
-- ────────────────────────────────────────────────────────────

create table public.favorites (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  creator_id    uuid not null references public.creator_profiles (id) on delete cascade,
  created_at    timestamptz not null default now(),

  unique (user_id, creator_id)
);

alter table public.favorites enable row level security;

create policy "Users can view own favorites"
  on public.favorites for select using (auth.uid() = user_id);

create policy "Users can manage own favorites"
  on public.favorites for all using (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────
-- 14. SERVICE CATEGORIES (reference / seed data)
-- ────────────────────────────────────────────────────────────

create table public.service_categories (
  id            serial primary key,
  heading       text not null,
  emoji         text,
  name          text not null,
  description   text,
  display_order integer not null default 0
);

alter table public.service_categories enable row level security;

create policy "Categories are viewable by everyone"
  on public.service_categories for select using (true);


-- ────────────────────────────────────────────────────────────
-- 15. INDEXES
-- ────────────────────────────────────────────────────────────

-- Creator lookups
create index idx_creator_profiles_slug on public.creator_profiles (slug);
create index idx_creator_profiles_user_id on public.creator_profiles (user_id);

-- Services
create index idx_services_creator_id on public.services (creator_id);
create index idx_services_category on public.services (category);
create index idx_service_tiers_service_id on public.service_tiers (service_id);

-- Bookings
create index idx_bookings_consumer_id on public.bookings (consumer_id);
create index idx_bookings_creator_id on public.bookings (creator_id);
create index idx_bookings_status on public.bookings (status);

-- Messages
create index idx_messages_sender_id on public.messages (sender_id);
create index idx_messages_recipient_id on public.messages (recipient_id);
create index idx_messages_booking_id on public.messages (booking_id);

-- Reviews
create index idx_reviews_creator_id on public.reviews (creator_id);

-- Transactions
create index idx_transactions_booking_id on public.transactions (booking_id);

-- Favorites
create index idx_favorites_user_id on public.favorites (user_id);


-- ────────────────────────────────────────────────────────────
-- 16. UPDATED-AT TRIGGER
-- ────────────────────────────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.creator_profiles
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.creator_verifications
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.payout_accounts
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.services
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.bookings
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.reviews
  for each row execute function public.handle_updated_at();


-- ────────────────────────────────────────────────────────────
-- 17. AUTO-CREATE PROFILE ON SIGN-UP
-- ────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'consumer')::public.user_role
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
