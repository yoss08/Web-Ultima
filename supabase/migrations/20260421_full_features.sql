-- ============================================================
-- MIGRATION: Full Features Implementation
-- ============================================================

-- 1. Ensure 'coach_students' table exists
CREATE TABLE IF NOT EXISTS public.coach_students (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_at   timestamptz DEFAULT now(),
  UNIQUE(coach_id, student_id)
);

-- Enable RLS for coach_students
ALTER TABLE public.coach_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coach can see their own students"
  ON public.coach_students FOR SELECT
  USING (auth.uid() = coach_id);

CREATE POLICY "Coach can add students"
  ON public.coach_students FOR INSERT
  WITH CHECK (auth.uid() = coach_id);

-- 2. Ensure 'notifications' table exists with all required columns
CREATE TABLE IF NOT EXISTS public.notifications (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type          text        NOT NULL,
  message       text        NOT NULL,
  read          boolean     DEFAULT false,
  created_at    timestamptz DEFAULT now()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- 3. Ensure 'tournaments' and 'matches' have club_id
-- We use 'tournaments' table as per existing code patterns
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tournaments' AND column_name='club_id') THEN
    ALTER TABLE public.tournaments ADD COLUMN club_id uuid REFERENCES public.clubs(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='matches' AND column_name='club_id') THEN
    ALTER TABLE public.matches ADD COLUMN club_id uuid REFERENCES public.clubs(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='matches' AND column_name='player3_id') THEN
    ALTER TABLE public.matches ADD COLUMN player3_id uuid REFERENCES auth.users(id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='matches' AND column_name='player4_id') THEN
    ALTER TABLE public.matches ADD COLUMN player4_id uuid REFERENCES auth.users(id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='matches' AND column_name='match_type') THEN
    ALTER TABLE public.matches ADD COLUMN match_type text DEFAULT 'singles';
  END IF;
END $$;

-- 4. Ensure 'bookings' has status column with pending/accepted/declined
-- If column exists as text, we just ensure it's there.
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='status') THEN
    ALTER TABLE public.bookings ADD COLUMN status text DEFAULT 'pending';
  END IF;
END $$;

-- Add check constraint for booking status if not present
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_status_check') THEN
        ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled'));
    END IF;
END $$;

-- 5. Create coach_feedbacks table if not exists (referenced in code)
CREATE TABLE IF NOT EXISTS public.coach_feedbacks (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content       text,
  rating        int,
  technique     int,
  power         int,
  speed         int,
  stamina       int,
  mental        int,
  created_at    timestamptz DEFAULT now()
);

-- Enable RLS for coach_feedbacks
ALTER TABLE public.coach_feedbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coach can manage feedbacks"
  ON public.coach_feedbacks FOR ALL
  USING (auth.uid() = coach_id);

CREATE POLICY "Students can see their own feedbacks"
  ON public.coach_feedbacks FOR SELECT
  USING (auth.uid() = student_id);
