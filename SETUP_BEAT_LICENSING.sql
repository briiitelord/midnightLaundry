-- ============================================================
-- BEAT LICENSING & COMMISSION CODES SETUP
-- Apply this in Supabase SQL Editor
-- ============================================================

-- Step 1: Add licensing price columns to music_items
ALTER TABLE music_items 
  ADD COLUMN IF NOT EXISTS license_single_use_price decimal(10,2),
  ADD COLUMN IF NOT EXISTS license_master_file_price decimal(10,2);

-- Step 2: Create commission_codes table
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

-- Step 3: Enable RLS for commission_codes
ALTER TABLE public.commission_codes ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for commission_codes
DROP POLICY IF EXISTS "Anyone can verify commission codes" ON public.commission_codes;
CREATE POLICY "Anyone can verify commission codes"
  ON public.commission_codes
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Anyone can update commission codes" ON public.commission_codes;
CREATE POLICY "Anyone can update commission codes"
  ON public.commission_codes
  FOR UPDATE
  TO public
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert commission codes" ON public.commission_codes;
CREATE POLICY "Anyone can insert commission codes"
  ON public.commission_codes
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Step 5: Create indexes for commission_codes
CREATE INDEX IF NOT EXISTS idx_commission_codes_code ON public.commission_codes(code);
CREATE INDEX IF NOT EXISTS idx_commission_codes_email ON public.commission_codes(purchaser_email);
CREATE INDEX IF NOT EXISTS idx_commission_codes_expires ON public.commission_codes(expires_at);

-- Step 6: Add commission code tracking to commission_inquiries
ALTER TABLE commission_inquiries 
  ADD COLUMN IF NOT EXISTS commission_code text,
  ADD COLUMN IF NOT EXISTS is_free_commission boolean DEFAULT false;

-- Step 7: Create index on commission_inquiries for code tracking
CREATE INDEX IF NOT EXISTS idx_commission_inquiries_code ON public.commission_inquiries(commission_code);

-- ============================================================
-- Example: Set licensing prices for existing beats
-- Uncomment and modify as needed
-- ============================================================

-- UPDATE music_items 
-- SET 
--   license_single_use_price = 25.00,
--   license_master_file_price = 100.00
-- WHERE category = 'beat_for_sale';

-- ============================================================
-- Verify the setup
-- ============================================================

-- Check music_items columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'music_items' 
  AND column_name IN ('license_single_use_price', 'license_master_file_price');

-- Check commission_codes table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'commission_codes';

-- Check commission_inquiries columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'commission_inquiries' 
  AND column_name IN ('commission_code', 'is_free_commission');

SELECT 'Setup complete!' as status;
