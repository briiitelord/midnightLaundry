-- ============================================================
-- midnightLaundry Database Migrations - Apply All Missing Tables
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- 1. Add price column to writing_pieces
ALTER TABLE writing_pieces ADD COLUMN IF NOT EXISTS price decimal(10, 2) DEFAULT 0;

-- Add United Masters support to music_items
ALTER TABLE music_items 
  ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'direct_upload' CHECK (source_type IN ('direct_upload', 'united_masters'));

ALTER TABLE music_items
  ADD COLUMN IF NOT EXISTS united_masters_link text;

-- Add embed_full_track toggle to music_items
ALTER TABLE music_items 
  ADD COLUMN IF NOT EXISTS embed_full_track boolean DEFAULT false;

-- ============================================================
-- 2. Create scribbles table for daily PDF uploads
-- ============================================================
CREATE TABLE IF NOT EXISTS public.scribbles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  pdf_url text NOT NULL,
  is_active boolean DEFAULT false,
  display_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for scribbles
ALTER TABLE public.scribbles ENABLE ROW LEVEL SECURITY;

-- Scribbles policies
DROP POLICY IF EXISTS "Anyone can view active scribbles" ON public.scribbles;
CREATE POLICY "Anyone can view active scribbles"
  ON public.scribbles
  FOR SELECT
  TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Anyone can insert scribbles" ON public.scribbles;
CREATE POLICY "Anyone can insert scribbles"
  ON public.scribbles
  FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update scribbles" ON public.scribbles;
CREATE POLICY "Anyone can update scribbles"
  ON public.scribbles
  FOR UPDATE
  TO public
  USING (true);

DROP POLICY IF EXISTS "Anyone can delete scribbles" ON public.scribbles;
CREATE POLICY "Anyone can delete scribbles"
  ON public.scribbles
  FOR DELETE
  TO public
  USING (true);

-- Index for scribbles
CREATE INDEX IF NOT EXISTS idx_scribbles_active ON public.scribbles(is_active, display_date DESC);

-- Trigger for scribbles
DROP TRIGGER IF EXISTS set_updated_at ON public.scribbles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.scribbles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 3. Create site_settings table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text UNIQUE NOT NULL,
  setting_value text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Site settings policies
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
CREATE POLICY "Anyone can view site settings"
  ON public.site_settings
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert site settings" ON public.site_settings;
CREATE POLICY "Anyone can insert site settings"
  ON public.site_settings
  FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update site settings" ON public.site_settings;
CREATE POLICY "Anyone can update site settings"
  ON public.site_settings
  FOR UPDATE
  TO public
  USING (true);

DROP POLICY IF EXISTS "Anyone can delete site settings" ON public.site_settings;
CREATE POLICY "Anyone can delete site settings"
  ON public.site_settings
  FOR DELETE
  TO public
  USING (true);

-- Trigger for site_settings
DROP TRIGGER IF EXISTS set_updated_at ON public.site_settings;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 4. Create social_accounts table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.social_accounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  platform text NOT NULL CHECK (platform IN ('twitter', 'instagram', 'tiktok', 'youtube', 'linkedin', 'facebook')),
  account_name text NOT NULL,
  account_url text NOT NULL,
  is_active boolean DEFAULT true,
  auto_sync boolean DEFAULT true,
  last_synced_at timestamptz,
  sync_frequency_minutes integer DEFAULT 30,
  api_credentials jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(platform, account_name)
);

-- Enable RLS for social_accounts
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

-- Social accounts policies
DROP POLICY IF EXISTS "Anyone can view active social accounts" ON public.social_accounts;
CREATE POLICY "Anyone can view active social accounts"
  ON public.social_accounts
  FOR SELECT
  TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Anyone can insert social accounts" ON public.social_accounts;
CREATE POLICY "Anyone can insert social accounts"
  ON public.social_accounts
  FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update social accounts" ON public.social_accounts;
CREATE POLICY "Anyone can update social accounts"
  ON public.social_accounts
  FOR UPDATE
  TO public
  USING (true);

DROP POLICY IF EXISTS "Anyone can delete social accounts" ON public.social_accounts;
CREATE POLICY "Anyone can delete social accounts"
  ON public.social_accounts
  FOR DELETE
  TO public
  USING (true);

-- Add columns to social_posts if they don't exist
ALTER TABLE public.social_posts 
  ADD COLUMN IF NOT EXISTS external_post_id text,
  ADD COLUMN IF NOT EXISTS account_id uuid REFERENCES public.social_accounts(id) ON DELETE SET NULL;

-- Indexes for social_accounts
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON public.social_accounts(platform, is_active);
CREATE INDEX IF NOT EXISTS idx_social_accounts_sync ON public.social_accounts(auto_sync, last_synced_at);
CREATE INDEX IF NOT EXISTS idx_social_posts_external ON public.social_posts(external_post_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_account ON public.social_posts(account_id);

-- Trigger for social_accounts
DROP TRIGGER IF EXISTS set_updated_at ON public.social_accounts;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.social_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 5. Create error_logs table for site failure tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS public.error_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  error_message text NOT NULL,
  error_type text,
  error_stack text,
  page_url text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Index for error_logs
CREATE INDEX IF NOT EXISTS idx_error_logs_created ON error_logs(created_at DESC);

-- Enable RLS for error_logs
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Error logs policies
DROP POLICY IF EXISTS "Anyone can insert error logs" ON public.error_logs;
CREATE POLICY "Anyone can insert error logs"
  ON public.error_logs
  FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view error logs" ON public.error_logs;
CREATE POLICY "Anyone can view error logs"
  ON public.error_logs
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Anyone can delete error logs" ON public.error_logs;
CREATE POLICY "Anyone can delete error logs"
  ON public.error_logs
  FOR DELETE
  TO public
  USING (true);

-- ============================================================
-- DONE! All migrations applied.
-- ============================================================

-- ============================================================
-- 6. Create scribbles storage bucket and policies
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'scribbles',
  'scribbles',
  true,
  10485760, -- 10MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can read scribbles" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload scribbles" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update scribbles" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete scribbles" ON storage.objects;

-- Allow public read access to scribbles
CREATE POLICY "Public can read scribbles"
ON storage.objects
FOR SELECT
USING (bucket_id = 'scribbles');

-- Allow anyone to upload scribbles (for user submissions)
CREATE POLICY "Anyone can upload scribbles"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'scribbles');

-- Allow authenticated users to update scribbles
CREATE POLICY "Authenticated can update scribbles"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'scribbles' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete scribbles
CREATE POLICY "Authenticated can delete scribbles"
ON storage.objects
FOR DELETE
USING (bucket_id = 'scribbles' AND auth.role() = 'authenticated');

-- ============================================================
-- 7. Add artwork support to music_items
-- ============================================================
ALTER TABLE music_items 
  ADD COLUMN IF NOT EXISTS artwork_url text;

COMMENT ON COLUMN music_items.artwork_url IS 'URL to album artwork/cover image for display in media players';

