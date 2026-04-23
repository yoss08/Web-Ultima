-- ============================================================
-- MIGRATION: Fix booking status constraint + admin RLS
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Drop the old restrictive status constraint (it was missing 'confirmed')
ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_status_check;

-- 2. Add the correct constraint that includes all statuses used in the app
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('pending', 'accepted', 'confirmed', 'declined', 'cancelled', 'completed'));

-- 3. RLS: Allow admins to read all bookings for their club
--    We join via profiles to get the admin's club_id
CREATE POLICY IF NOT EXISTS "Admins can view their club bookings"
  ON public.bookings FOR SELECT
  USING (
    club_id IN (
      SELECT club_id FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'superadmin', 'super_admin', 'super admin')
    )
    OR auth.uid() = user_id
  );

-- 4. RLS: Allow admins to update booking status for their club
CREATE POLICY IF NOT EXISTS "Admins can update their club bookings"
  ON public.bookings FOR UPDATE
  USING (
    club_id IN (
      SELECT club_id FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'superadmin', 'super_admin', 'super admin')
    )
  );

-- 5. RLS: Allow authenticated users to insert bookings (for court booking page)
CREATE POLICY IF NOT EXISTS "Authenticated users can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 6. RLS: Allow users to cancel their own bookings
CREATE POLICY IF NOT EXISTS "Users can cancel their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- 7. RLS: Allow service role and admins to insert notifications
CREATE POLICY IF NOT EXISTS "Service role can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);
