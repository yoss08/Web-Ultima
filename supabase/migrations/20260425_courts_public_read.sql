-- ============================================================
-- MIGRATION: Allow public read access to courts table
-- This allows visitors to see available courts without logging in
-- ============================================================

-- Enable RLS on courts table if not already enabled
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone (including unauthenticated users) to read courts
CREATE POLICY IF NOT EXISTS "Courts are viewable by everyone"
  ON public.courts FOR SELECT
  USING (true);

-- Allow authenticated users to create bookings for courts
CREATE POLICY IF NOT EXISTS "Authenticated users can create court bookings"
  ON public.courts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow admins to manage courts in their club
CREATE POLICY IF NOT EXISTS "Admins can manage their club courts"
  ON public.courts FOR ALL
  USING (
    club_id IN (
      SELECT club_id FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'superadmin', 'super_admin', 'super admin')
    )
  );

-- ============================================================
-- Allow public read access to bookings (to see available slots)
-- ============================================================

-- Create policy to allow everyone to view booking availability (taken slots)
-- This is needed so visitors can see which time slots are available
CREATE POLICY IF NOT EXISTS "Bookings availability is viewable by everyone"
  ON public.bookings FOR SELECT
  USING (
    -- Allow everyone to see confirmed/accepted bookings (to show availability)
    status IN ('confirmed', 'accepted')
    -- Allow users to see their own bookings
    OR auth.uid() = user_id
    -- Allow admins to see their club's bookings
    OR club_id IN (
      SELECT club_id FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'superadmin', 'super_admin', 'super admin')
    )
  );

-- Allow anyone (including unauthenticated users) to create bookings
-- This enables visitors to book without logging in
CREATE POLICY IF NOT EXISTS "Anyone can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

-- Allow users to update their own bookings (for cancellation, etc.)
CREATE POLICY IF NOT EXISTS "Users can update their own bookings for notifications"
  ON public.bookings FOR UPDATE
  USING (
    auth.uid() = user_id
    OR club_id IN (
      SELECT club_id FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'superadmin', 'super_admin', 'super admin')
    )
  );
