-- Add licensing options and pricing to music_items for beats
ALTER TABLE music_items 
  ADD COLUMN IF NOT EXISTS license_single_use_price decimal(10,2),
  ADD COLUMN IF NOT EXISTS license_master_file_price decimal(10,2);

-- Create commission_codes table for master file purchasers
CREATE TABLE IF NOT EXISTS public.commission_codes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  music_item_id uuid REFERENCES music_items(id) ON DELETE CASCADE,
  purchaser_email text NOT NULL,
  purchaser_name text,
  uses_remaining integer DEFAULT 3,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '1 year'),
  last_used_at timestamptz
);

-- Enable RLS
ALTER TABLE public.commission_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can verify codes (for validation)
CREATE POLICY "Anyone can verify commission codes"
  ON public.commission_codes
  FOR SELECT
  TO public
  USING (true);

-- Anyone can update codes (for usage tracking)
CREATE POLICY "Anyone can update commission codes"
  ON public.commission_codes
  FOR UPDATE
  TO public
  USING (true);

-- Anyone can insert codes (for purchase completion)
CREATE POLICY "Anyone can insert commission codes"
  ON public.commission_codes
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create index for fast code lookups
CREATE INDEX idx_commission_codes_code ON public.commission_codes(code);
CREATE INDEX idx_commission_codes_email ON public.commission_codes(email);

-- Add commission_code field to commission_inquiries to track which code was used
ALTER TABLE commission_inquiries 
  ADD COLUMN IF NOT EXISTS commission_code text,
  ADD COLUMN IF NOT EXISTS is_free_commission boolean DEFAULT false;
