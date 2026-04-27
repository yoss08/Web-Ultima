-- ============================================================
-- MIGRATION: Fix infinite recursion in profiles RLS policies
-- ============================================================
-- Problem: The previous RLS policies used subqueries that referenced
-- the same table, causing infinite recursion.
-- Solution: Create a helper function that bypasses RLS checks.

-- 1. Drop the problematic policies that cause recursion
DROP POLICY IF EXISTS "Super admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can update all profiles" ON public.profiles;

-- 2. Create a helper function to check if user is super admin
-- This function uses "SECURITY DEFINER" so it bypasses RLS
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
    AND role IN ('superadmin', 'super_admin', 'super admin')
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- 3. Create new policies using the helper function
-- Readers can see their own profile or if they are a super admin
CREATE POLICY "Users can read own profile or super admins read all"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id
    OR public.is_super_admin(auth.uid())
  );

-- Super admins can update any profile
CREATE POLICY "Super admins can update all profiles v2"
  ON public.profiles FOR UPDATE
  USING (public.is_super_admin(auth.uid()));

-- Keep the existing insert/update policies for normal users
-- (They should already exist, but ensure they're there)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile"
      ON public.profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;
