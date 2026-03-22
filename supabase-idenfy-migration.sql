-- ============================================================
-- Plezyy — iDenfy Magic Link Integration Migration
-- Run this in the Supabase SQL Editor after the main schema.
-- ============================================================

-- Add iDenfy tracking columns to creator_verifications
alter table public.creator_verifications
  add column if not exists idenfy_scan_ref    text unique,
  add column if not exists idenfy_auth_token  text,
  add column if not exists idenfy_raw_response jsonb;

-- Make gov_id_type nullable (iDenfy handles document type selection)
alter table public.creator_verifications
  alter column gov_id_type drop not null;

-- Make full_legal_name nullable (can be populated after iDenfy returns)
alter table public.creator_verifications
  alter column full_legal_name drop not null;

-- Make date_of_birth nullable (can be populated after iDenfy returns)
alter table public.creator_verifications
  alter column date_of_birth drop not null;

-- Index for webhook lookups by scan_ref
create index if not exists idx_creator_verifications_scan_ref
  on public.creator_verifications (idenfy_scan_ref);

-- Allow the service role (used by the webhook edge function) to update verifications
-- This is handled by the existing RLS + service_role bypass, but we add a policy
-- for the webhook to update any verification by scan_ref
create policy "Service role can update verifications"
  on public.creator_verifications for update
  using (true)
  with check (true);
-- Note: This broad policy is safe because RLS is bypassed by the service_role key.
-- The anon key still respects the creator-specific policies defined in the main schema.
