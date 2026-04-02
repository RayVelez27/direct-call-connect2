-- ============================================================
-- Chat Realtime Migration
-- Enables realtime on messages table and adds performance indexes
-- ============================================================

-- 1. Enable Supabase Realtime on the messages table
alter publication supabase_realtime add table public.messages;

-- 2. Index for conversation queries (all messages between two users, ordered)
create index if not exists idx_messages_conversation
  on public.messages (
    least(sender_id, recipient_id),
    greatest(sender_id, recipient_id),
    created_at
  );

-- 3. Index for unread message count queries
create index if not exists idx_messages_unread
  on public.messages (recipient_id, is_read)
  where is_read = false;

-- 4. Index for fetching a user's recent conversations quickly
create index if not exists idx_messages_sender_created
  on public.messages (sender_id, created_at desc);

create index if not exists idx_messages_recipient_created
  on public.messages (recipient_id, created_at desc);
