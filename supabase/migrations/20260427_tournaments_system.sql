-- ============================================================
-- MIGRATION: Create Tournament/Competition System
-- ============================================================
-- Purpose: Allow super admins to create competitions and players to register
-- Tables: tournaments, tournament_registrations
-- RLS: All tables have comprehensive row-level security policies

-- ============================================================
-- 1. CREATE HELPER FUNCTIONS FOR PLAYER ROLE CHECK
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_player(user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
    AND role = 'player'
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================
-- 2. CREATE TOURNAMENTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.tournaments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  title text NOT NULL,
  description text NULL,
  start_date date NOT NULL,
  end_date date NULL,
  max_players integer NULL DEFAULT 32,
  current_players integer NULL DEFAULT 0,
  prize_pool text NULL DEFAULT '$0'::text,
  competition_type text NULL DEFAULT 'Open'::text,
  registration_deadline timestamp with time zone NULL,
  entry_fee numeric NULL DEFAULT 0,
  rules_text text NULL,
  club_id uuid NULL,
  created_by uuid NULL,
  status text NOT NULL DEFAULT 'open'::text,
  
  CONSTRAINT tournaments_pkey PRIMARY KEY (id),
  CONSTRAINT tournaments_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs (id) ON DELETE SET NULL,
  CONSTRAINT tournaments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles (id) ON DELETE SET NULL,
  CONSTRAINT tournaments_status_check CHECK (status IN ('open', 'in_progress', 'closed', 'completed')),
  CONSTRAINT tournaments_current_players_check CHECK (current_players <= max_players)
) TABLESPACE pg_default;

-- ============================================================
-- 3. CREATE TOURNAMENT_REGISTRATIONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.tournament_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL,
  player_id uuid NOT NULL,
  registered_at timestamp with time zone NULL DEFAULT now(),
  status character varying NOT NULL DEFAULT 'pending'::character varying,
  
  CONSTRAINT tournament_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT tournament_registrations_tournament_id_player_id_key UNIQUE (tournament_id, player_id),
  CONSTRAINT tournament_registrations_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.profiles (id) ON DELETE CASCADE,
  CONSTRAINT tournament_registrations_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments (id) ON DELETE CASCADE,
  CONSTRAINT tournament_registrations_status_check CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn', 'completed'))
) TABLESPACE pg_default;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tournaments_club_id ON public.tournaments(club_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_created_by ON public.tournaments(created_by);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON public.tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournament_registrations_tournament_id ON public.tournament_registrations(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_registrations_player_id ON public.tournament_registrations(player_id);
CREATE INDEX IF NOT EXISTS idx_tournament_registrations_status ON public.tournament_registrations(status);

-- ============================================================
-- 4. ENABLE RLS
-- ============================================================

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. DROP OLD POLICIES (if any exist)
-- ============================================================

DROP POLICY IF EXISTS "Super admins can create tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Players can view all active tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Anyone can read tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Super admins can update tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Players can register for tournaments" ON public.tournament_registrations;
DROP POLICY IF EXISTS "Players can view their registrations" ON public.tournament_registrations;
DROP POLICY IF EXISTS "Players can withdraw from tournaments" ON public.tournament_registrations;

-- ============================================================
-- 6. TOURNAMENTS TABLE POLICIES
-- ============================================================

-- SELECT: Anyone authenticated can view tournaments
CREATE POLICY "Anyone can read tournaments"
  ON public.tournaments FOR SELECT
  USING (true);

-- INSERT: Only super admins can create tournaments
CREATE POLICY "Super admins can create tournaments"
  ON public.tournaments FOR INSERT
  WITH CHECK (
    public.is_super_admin(auth.uid())
    AND created_by = auth.uid()
  );

-- UPDATE: Only super admins can update their tournaments
CREATE POLICY "Super admins can update tournaments"
  ON public.tournaments FOR UPDATE
  USING (
    public.is_super_admin(auth.uid())
    AND created_by = auth.uid()
  );

-- DELETE: Only super admins can delete their tournaments
CREATE POLICY "Super admins can delete tournaments"
  ON public.tournaments FOR DELETE
  USING (
    public.is_super_admin(auth.uid())
    AND created_by = auth.uid()
  );

-- ============================================================
-- 7. TOURNAMENT_REGISTRATIONS TABLE POLICIES
-- ============================================================

-- SELECT: Players can see their own registrations, super admins see all
CREATE POLICY "Players can view their registrations"
  ON public.tournament_registrations FOR SELECT
  USING (
    auth.uid() = player_id
    OR public.is_super_admin(auth.uid())
  );

-- INSERT: Players can register for tournaments
CREATE POLICY "Players can register for tournaments"
  ON public.tournament_registrations FOR INSERT
  WITH CHECK (
    public.is_player(auth.uid())
    AND player_id = auth.uid()
  );

-- UPDATE: Players can update their own registration status, super admins can manage
CREATE POLICY "Players can update their registrations"
  ON public.tournament_registrations FOR UPDATE
  USING (
    auth.uid() = player_id
    OR public.is_super_admin(auth.uid())
  );

-- DELETE: Players can withdraw from tournaments, super admins can delete
CREATE POLICY "Players can withdraw from tournaments"
  ON public.tournament_registrations FOR DELETE
  USING (
    auth.uid() = player_id
    OR public.is_super_admin(auth.uid())
  );

-- ============================================================
-- 8. GRANT PERMISSIONS
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tournaments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tournament_registrations TO authenticated;
