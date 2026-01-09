-- Fix profiles table: Convert RESTRICTIVE policies to PERMISSIVE

-- Drop existing RESTRICTIVE policies
DROP POLICY IF EXISTS "profile_delete_admin" ON public.profiles;
DROP POLICY IF EXISTS "profile_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profile_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profile_update_own" ON public.profiles;
DROP POLICY IF EXISTS "Require authentication for profiles" ON public.profiles;

-- Create PERMISSIVE policies with proper access control

-- SELECT: Users can view their own profile, admins can view all
CREATE POLICY "profiles_select_policy"
ON public.profiles
FOR SELECT
TO authenticated
USING ((auth.uid() = id) OR has_role(auth.uid(), 'admin'::user_role));

-- INSERT: Users can create their own profile, admins can create any
CREATE POLICY "profiles_insert_policy"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK ((auth.uid() = id) OR has_role(auth.uid(), 'admin'::user_role));

-- UPDATE: Users can update their own profile, admins can update any
CREATE POLICY "profiles_update_policy"
ON public.profiles
FOR UPDATE
TO authenticated
USING ((auth.uid() = id) OR has_role(auth.uid(), 'admin'::user_role));

-- DELETE: Only admins can delete profiles
CREATE POLICY "profiles_delete_policy"
ON public.profiles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::user_role));