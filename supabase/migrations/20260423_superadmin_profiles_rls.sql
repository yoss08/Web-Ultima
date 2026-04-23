-- ============================================================
-- MIGRATION: Super Admin can read all profiles
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Allow super admins to read ALL profiles (needed for admin accounts list, user management, etc.)
-- Without this, super admins can only see their own profile row
CREATE POLICY IF NOT EXISTS "Super admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id  -- users can always read their own profile
    OR
    (
      SELECT role FROM public.profiles
      WHERE id = auth.uid()
    ) IN ('superadmin', 'super_admin', 'super admin')
  );

-- Allow super admins to update any profile (e.g., assigning roles)
CREATE POLICY IF NOT EXISTS "Super admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    (
      SELECT role FROM public.profiles
      WHERE id = auth.uid()
    ) IN ('superadmin', 'super_admin', 'super admin')
  );

-- Allow authenticated users to insert their own profile (needed for signup)
CREATE POLICY IF NOT EXISTS "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY IF NOT EXISTS "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
