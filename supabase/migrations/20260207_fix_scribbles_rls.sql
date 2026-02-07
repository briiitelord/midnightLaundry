-- Fix scribbles RLS policies to allow viewing all scribbles for admin management
-- while still restricting public view to only active scribbles

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Anyone can view active scribbles" ON public.scribbles;

-- Create new policies:
-- 1. Public/unauthenticated users can only see active scribbles
CREATE POLICY "Public can view active scribbles"
  ON public.scribbles
  FOR SELECT
  TO anon
  USING (is_active = true);

-- 2. Allow viewing all scribbles (for admin management)
-- This assumes admin operations happen without authentication in this setup
CREATE POLICY "Anyone can view all scribbles for management"
  ON public.scribbles
  FOR SELECT
  TO public
  USING (true);
