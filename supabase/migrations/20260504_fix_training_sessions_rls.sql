-- ============================================================
-- MIGRATION: Fix Training Sessions RLS for Global Scheduling
-- Allows coaches to schedule sessions for any player account
-- ============================================================

DROP POLICY IF EXISTS "Coaches can schedule sessions for club players" ON public.training_sessions;

-- Allow coaches to schedule sessions for any player globally
CREATE POLICY "Coaches can schedule sessions for any player"
  ON public.training_sessions FOR INSERT
  WITH CHECK (
    coach_id = auth.uid()
    AND student_id IN (
      SELECT id FROM public.profiles
      WHERE role = 'player'
    )
  );

-- Update Select policies to be more robust
DROP POLICY IF EXISTS "Coaches can see their scheduled sessions" ON public.training_sessions;
CREATE POLICY "Coaches can see their scheduled sessions"
  ON public.training_sessions FOR SELECT
  USING (coach_id = auth.uid());

DROP POLICY IF EXISTS "Students can see their training sessions" ON public.training_sessions;
CREATE POLICY "Students can see their training sessions"
  ON public.training_sessions FOR SELECT
  USING (student_id = auth.uid());
