-- ============================================================
-- MIGRATION: Admin/Super-Admin DB Alignment
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Create the 'clubs' table (needed by ClubSettingsPage & multi-club logic)
CREATE TABLE IF NOT EXISTS public.clubs (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  super_admin_id  uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  name            text        NOT NULL,
  location        text,
  address         text,
  phone           text,
  website         text,
  open_time       text        DEFAULT '08:00',
  close_time      text        DEFAULT '22:00',
  price_per_court numeric     DEFAULT 0,
  description     text,
  photo_url       text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  UNIQUE (super_admin_id)
);

-- Enable RLS
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

-- Anyone can read clubs (for public club pages)
CREATE POLICY "Clubs are viewable by everyone"
  ON public.clubs FOR SELECT
  USING (true);

-- Super admin can create/update their own club
CREATE POLICY "Super admins can manage their club"
  ON public.clubs FOR ALL
  USING (auth.uid() = super_admin_id)
  WITH CHECK (auth.uid() = super_admin_id);

-- ============================================================
-- 2. Add club_id to profiles (links admins/coaches to a club)
-- ============================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS club_id uuid REFERENCES public.clubs(id) ON DELETE SET NULL;

-- ============================================================
-- 3. Add club_id to courts (for multi-club court ownership)
-- ============================================================
ALTER TABLE public.courts
  ADD COLUMN IF NOT EXISTS club_id uuid REFERENCES public.clubs(id) ON DELETE SET NULL;

-- ============================================================
-- 4. Add user_id to notifications (so we can target specific users)
-- ============================================================
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- ============================================================
-- 5. Migrate bookings.club_id from integer → uuid
--    (It had no FK before; we convert it safely)
--    NOTE: Only run this if your bookings.club_id column is currently unused/empty.
--    If it has data, you must handle the migration manually.
-- ============================================================
-- Step 5a: Drop the old integer column
ALTER TABLE public.bookings
  DROP COLUMN IF EXISTS club_id;

-- Step 5b: Add it back as uuid with FK to clubs
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS club_id uuid REFERENCES public.clubs(id) ON DELETE SET NULL;

-- ============================================================
-- 6. Create storage bucket for club photos (if not already done)
--    Run this separately in Supabase dashboard > Storage, or
--    uncomment the line below if you have storage admin access:
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('club-photos', 'club-photos', true)
-- ON CONFLICT (id) DO NOTHING;
