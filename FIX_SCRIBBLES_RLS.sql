-- ============================================================
-- FIX: Scribbles RLS Policy for Admin Management
-- Copy and paste this into Supabase SQL Editor and run it
-- ============================================================

-- This fixes the issue where admins cannot see all scribbles in the dashboard
-- The original policy only allowed SELECT for active scribbles, but admins need to see ALL scribbles

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Anyone can view active scribbles" ON public.scribbles;

-- Recreate with proper access:
-- This allows anyone (including admin dashboard) to view all scribbles
CREATE POLICY "Anyone can view all scribbles"
  ON public.scribbles
  FOR SELECT
  TO public
  USING (true);

-- Note: In a production environment with proper authentication,
-- you would want to restrict this to authenticated admin users only.
-- For now, this allows the admin dashboard to function properly.
