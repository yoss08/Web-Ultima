-- ============================================================
-- MIGRATION: Fix all infinite recursion issues across all tables
-- ============================================================
-- Problem: Multiple tables have policies with subqueries that reference
-- the same table, causing infinite recursion.
-- Solution: Create helper functions that bypass RLS, then use them in all policies.

-- ============================================================
-- 1. CREATE HELPER FUNCTIONS (these bypass RLS)
-- ============================================================

-- Check if user is a super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
    AND role IN ('superadmin', 'super_admin', 'super admin')
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Check if user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
    AND role IN ('admin', 'superadmin', 'super_admin', 'super admin')
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Check if user is a coach
CREATE OR REPLACE FUNCTION public.is_coach(user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
    AND role = 'coach'
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Get user's club_id (safely)
CREATE OR REPLACE FUNCTION public.get_user_club_id(user_id uuid)
RETURNS uuid AS $$
  SELECT club_id FROM public.profiles WHERE id = user_id LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================
-- 2. DROP ALL PROBLEMATIC POLICIES
-- ============================================================

-- Notifications table policies
DROP POLICY IF EXISTS "Users can see their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can see booking notifications for their club" ON public.notifications;
DROP POLICY IF EXISTS "Super admins can see admin activity notifications" ON public.notifications;

-- Coach-students table policies
DROP POLICY IF EXISTS "Coach can see their own students" ON public.coach_students;
DROP POLICY IF EXISTS "Students can see their assigned coaches" ON public.coach_students;
DROP POLICY IF EXISTS "Coach can add students" ON public.coach_students;
DROP POLICY IF EXISTS "Admins can manage coach-student relationships in their club" ON public.coach_students;
DROP POLICY IF EXISTS "Coaches can assign students in their club" ON public.coach_students;

-- Profiles table policies (from previous migrations)
DROP POLICY IF EXISTS "Users can read own profile or super admins read all" ON public.profiles;
DROP POLICY IF EXISTS "Coaches can see club members" ON public.profiles;

-- ============================================================
-- 3. RECREATE NOTIFICATIONS POLICIES (fixed)
-- ============================================================

CREATE POLICY "Users can see their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can see booking notifications for their club"
  ON public.notifications FOR SELECT
  USING (
    type = 'booking_update'
    AND user_id IN (
      SELECT id FROM public.profiles
      WHERE club_id = public.get_user_club_id(auth.uid())
    )
    AND public.is_admin(auth.uid())
  );

CREATE POLICY "Super admins can see admin activity notifications"
  ON public.notifications FOR SELECT
  USING (
    type IN ('admin_added_court', 'admin_published_competition', 'admin_activity')
    AND public.is_super_admin(auth.uid())
  );

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- 4. RECREATE COACH-STUDENTS POLICIES (fixed)
-- ============================================================

CREATE POLICY "Coach can see their own students"
  ON public.coach_students FOR SELECT
  USING (auth.uid() = coach_id);

CREATE POLICY "Students can see their assigned coaches"
  ON public.coach_students FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Coaches can assign students in their club"
  ON public.coach_students FOR INSERT
  WITH CHECK (
    auth.uid() = coach_id
    AND student_id IN (
      SELECT id FROM public.profiles
      WHERE club_id = public.get_user_club_id(auth.uid())
    )
  );

CREATE POLICY "Admins can manage coach-student relationships in their club"
  ON public.coach_students FOR ALL
  USING (
    public.is_admin(auth.uid())
    AND (
      coach_id IN (
        SELECT id FROM public.profiles 
        WHERE club_id = public.get_user_club_id(auth.uid())
      )
      OR
      student_id IN (
        SELECT id FROM public.profiles 
        WHERE club_id = public.get_user_club_id(auth.uid())
      )
    )
  );

-- ============================================================
-- 5. RECREATE PROFILES POLICIES (fixed)
-- ============================================================

CREATE POLICY "Users can read own profile or super admins read all"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id
    OR public.is_super_admin(auth.uid())
  );

CREATE POLICY "Coaches can see club members"
  ON public.profiles FOR SELECT
  USING (
    -- Users can see their own profile
    auth.uid() = id
    OR
    -- Coaches can see all players in their club
    (
      public.is_coach(auth.uid())
      AND club_id = public.get_user_club_id(auth.uid())
    )
    OR
    -- Admins can see all club members
    (
      public.is_admin(auth.uid())
      AND club_id = public.get_user_club_id(auth.uid())
    )
  );

CREATE POLICY "Super admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_super_admin(auth.uid()));

-- Keep existing insert/update policies for normal users
CREATE POLICY IF NOT EXISTS "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
