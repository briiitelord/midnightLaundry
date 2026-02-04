-- Create social_accounts table for managing connected social media accounts
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

-- Enable RLS
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

-- Public can view active accounts
CREATE POLICY "Anyone can view active social accounts"
  ON public.social_accounts
  FOR SELECT
  TO public
  USING (is_active = true);

-- Anyone can insert/update accounts (for admin functionality)
CREATE POLICY "Anyone can insert social accounts"
  ON public.social_accounts
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update social accounts"
  ON public.social_accounts
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can delete social accounts"
  ON public.social_accounts
  FOR DELETE
  TO public
  USING (true);

-- Add platform and external_id to social_posts if not exists
ALTER TABLE public.social_posts 
  ADD COLUMN IF NOT EXISTS external_post_id text,
  ADD COLUMN IF NOT EXISTS account_id uuid REFERENCES public.social_accounts(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON public.social_accounts(platform, is_active);
CREATE INDEX IF NOT EXISTS idx_social_accounts_sync ON public.social_accounts(auto_sync, last_synced_at);
CREATE INDEX IF NOT EXISTS idx_social_posts_external ON public.social_posts(external_post_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_account ON public.social_posts(account_id);

-- Create updated_at trigger for social_accounts
DROP TRIGGER IF EXISTS set_updated_at ON public.social_accounts;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.social_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
