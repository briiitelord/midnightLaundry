-- Create site-images storage bucket for Site Build Manager uploads
-- This bucket stores background images, header images, footer images, etc.

-- Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,                           -- Public bucket (images need to be publicly accessible)
  10485760,                       -- 10MB limit per file
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read/view images (public access)
CREATE POLICY "Public can view site images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'site-images');

-- Allow authenticated admins to upload site images
CREATE POLICY "Authenticated users can upload site images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'site-images'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated admins to update site images
CREATE POLICY "Authenticated users can update site images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'site-images')
WITH CHECK (bucket_id = 'site-images');

-- Allow authenticated admins to delete site images
CREATE POLICY "Authenticated users can delete site images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'site-images');

-- Create site_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read site settings (needed for public site)
CREATE POLICY "Anyone can read site settings"
ON site_settings
FOR SELECT
USING (true);

-- Allow authenticated admins to insert/update site settings
CREATE POLICY "Authenticated users can manage site settings"
ON site_settings
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Insert default site settings if they don't exist
INSERT INTO site_settings (setting_key, setting_value, description) VALUES
  ('background_image', '/laundry-sketch.JPG', 'Main site background image (laundry sketch)'),
  ('button_theme_image', '/forest-texture.jpg', 'Forest texture for active buttons'),
  ('header_image', '/nebula-bg.jpg', 'Navigation header background'),
  ('footer_image', '/nebula-bg.jpg', 'Footer section background')
ON CONFLICT (setting_key) DO NOTHING;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to auto-update updated_at timestamp
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
