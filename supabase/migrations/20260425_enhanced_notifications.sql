-- ============================================================
-- MIGRATION: Enhanced Notification System with Role-Based Access
-- This fixes and enhances notifications between coaches, players, admins, and super admins
-- ============================================================

-- ============================================================
-- 1. ENSURE NOTIFICATIONS TABLE HAS ALL REQUIRED FIELDS
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='notifications' AND column_name='notification_type_id') THEN
    ALTER TABLE public.notifications ADD COLUMN notification_type_id text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='notifications' AND column_name='related_entity_id') THEN
    ALTER TABLE public.notifications ADD COLUMN related_entity_id uuid;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='notifications' AND column_name='related_entity_type') THEN
    ALTER TABLE public.notifications ADD COLUMN related_entity_type text;
  END IF;
END $$;

-- ============================================================
-- 2. NOTIFICATION RLS POLICIES
-- ============================================================

-- Drop existing notification policies to recreate them
DROP POLICY IF EXISTS "Users can see their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;

-- Base policy: Users can see their own notifications
CREATE POLICY "Users can see their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Admins and super admins can see booking notifications for their club
CREATE POLICY "Admins can see booking notifications for their club"
  ON public.notifications FOR SELECT
  USING (
    type = 'booking_update'
    AND user_id IN (
      SELECT id FROM public.profiles
      WHERE club_id IN (
        SELECT club_id FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'superadmin', 'super_admin', 'super admin')
      )
    )
  );

-- Super admins can see admin activity notifications
CREATE POLICY "Super admins can see admin activity notifications"
  ON public.notifications FOR SELECT
  USING (
    type IN ('admin_added_court', 'admin_published_competition', 'admin_activity')
    AND (
      SELECT role FROM public.profiles WHERE id = auth.uid()
    ) IN ('superadmin', 'super_admin', 'super admin')
  );

-- Allow users to update (mark as read) their own notifications
CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow service role to insert notifications (for backend operations)
CREATE POLICY "Service role can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- 3. COACH-STUDENT ASSIGNMENT RLS POLICIES
-- ============================================================

DROP POLICY IF EXISTS "Coach can see their own students" ON public.coach_students;
DROP POLICY IF EXISTS "Coach can add students" ON public.coach_students;

-- Coaches can see their assigned students
CREATE POLICY "Coach can see their own students"
  ON public.coach_students FOR SELECT
  USING (auth.uid() = coach_id);

-- Students can see their assigned coaches
CREATE POLICY "Students can see their assigned coaches"
  ON public.coach_students FOR SELECT
  USING (auth.uid() = student_id);

-- Admins can see all coach-student relationships in their club
CREATE POLICY "Admins can manage coach-student relationships in their club"
  ON public.coach_students FOR ALL
  USING (
    coach_id IN (
      SELECT id FROM public.profiles WHERE club_id IN (
        SELECT club_id FROM public.profiles WHERE id = auth.uid()
        AND role IN ('admin', 'superadmin', 'super_admin', 'super admin')
      )
    )
    OR
    student_id IN (
      SELECT id FROM public.profiles WHERE club_id IN (
        SELECT club_id FROM public.profiles WHERE id = auth.uid()
        AND role IN ('admin', 'superadmin', 'super_admin', 'super admin')
      )
    )
  );

-- Coaches can assign students in their club
CREATE POLICY "Coaches can assign students in their club"
  ON public.coach_students FOR INSERT
  WITH CHECK (
    auth.uid() = coach_id
    AND student_id IN (
      SELECT id FROM public.profiles
      WHERE club_id = (
        SELECT club_id FROM public.profiles WHERE id = auth.uid()
      )
    )
  );

-- ============================================================
-- 4. PROFILES RLS - Allow coaches to see all players in their club
-- ============================================================

DROP POLICY IF EXISTS "Coaches can see club members" ON public.profiles;

-- Coaches can see all players (and other staff) in their club
CREATE POLICY "Coaches can see club members"
  ON public.profiles FOR SELECT
  USING (
    -- Users can see their own profile
    auth.uid() = id
    OR
    -- Coaches can see all players in their club
    (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'coach'
      AND club_id = (SELECT club_id FROM public.profiles WHERE id = auth.uid())
    )
    OR
    -- Admins can see all club members
    (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'superadmin', 'super_admin', 'super admin')
      AND club_id = (SELECT club_id FROM public.profiles WHERE id = auth.uid())
    )
  );

-- ============================================================
-- 5. TRAINING SESSIONS - Allow coaches to schedule for all players in club
-- ============================================================

DROP POLICY IF EXISTS "Coaches can schedule sessions for club players" ON public.training_sessions;

CREATE POLICY "Coaches can schedule sessions for club players"
  ON public.training_sessions FOR INSERT
  WITH CHECK (
    coach_id = auth.uid()
    AND student_id IN (
      SELECT id FROM public.profiles
      WHERE club_id = (SELECT club_id FROM public.profiles WHERE id = auth.uid())
      AND role = 'player'
    )
  );

CREATE POLICY "Students can see their training sessions"
  ON public.training_sessions FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Coaches can see their scheduled sessions"
  ON public.training_sessions FOR SELECT
  USING (coach_id = auth.uid());

-- ============================================================
-- 6. COACH FEEDBACKS - Allow coaches to add feedback for club players
-- ============================================================

DROP POLICY IF EXISTS "Coach can manage feedbacks" ON public.coach_feedbacks;
DROP POLICY IF EXISTS "Students can see their own feedbacks" ON public.coach_feedbacks;

CREATE POLICY "Coaches can add feedback for club players"
  ON public.coach_feedbacks FOR INSERT
  WITH CHECK (
    coach_id = auth.uid()
    AND student_id IN (
      SELECT id FROM public.profiles
      WHERE club_id = (SELECT club_id FROM public.profiles WHERE id = auth.uid())
      AND role = 'player'
    )
  );

CREATE POLICY "Coaches can view their feedback"
  ON public.coach_feedbacks FOR SELECT
  USING (coach_id = auth.uid());

CREATE POLICY "Students can see their own feedbacks"
  ON public.coach_feedbacks FOR SELECT
  USING (auth.uid() = student_id);

-- ============================================================
-- 7. COMPETITIONS - Admins can publish and super admins get notified
-- ============================================================

-- This section assumes a 'competitions' or 'tournaments' table exists
-- If you use 'tournaments' table, adjust the table name accordingly

DROP POLICY IF EXISTS "Admins can manage competitions in their club" ON public.tournaments;

CREATE POLICY IF NOT EXISTS "Admins can manage competitions in their club"
  ON public.tournaments FOR ALL
  USING (
    club_id IN (
      SELECT club_id FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'superadmin', 'super_admin', 'super admin')
    )
  );

CREATE POLICY IF NOT EXISTS "Players can see club competitions"
  ON public.tournaments FOR SELECT
  USING (
    club_id IN (
      SELECT club_id FROM public.profiles WHERE id = auth.uid()
    )
  );
