-- Fix security: Add authentication requirement policies

-- 1. Profiles table - require authentication for all operations
CREATE POLICY "Require authentication for profiles"
ON public.profiles
FOR ALL
TO public
USING (auth.uid() IS NOT NULL);

-- 2. Registrations table - require authentication for all operations
CREATE POLICY "Require authentication for registrations"
ON public.registrations
FOR ALL
TO public
USING (auth.uid() IS NOT NULL);

-- 3. User roles table - require authentication for all operations
CREATE POLICY "Require authentication for user_roles"
ON public.user_roles
FOR ALL
TO public
USING (auth.uid() IS NOT NULL);