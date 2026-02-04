-- Create site_settings table for managing site-wide images and styling

-- Create or replace the update_updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text UNIQUE NOT NULL,
  setting_value text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public can view settings
CREATE POLICY "Anyone can view site settings"
  ON public.site_settings
  FOR SELECT
  TO public
  USING (true);

-- Anyone can insert/update settings (for admin functionality)
CREATE POLICY "Anyone can insert site settings"
  ON public.site_settings
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update site settings"
  ON public.site_settings
  FOR UPDATE
  TO public
  USING (true);

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value, description) VALUES
  ('background_image', '/laundry-sketch.JPG', 'Main site background image'),
  ('button_theme_image', '/forest-texture.jpg', 'Button theme background image'),
  ('header_image', '/nebula-bg.jpg', 'Header background image'),
  ('footer_image', '/nebula-bg.jpg', 'Footer background image')
ON CONFLICT (setting_key) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX idx_site_settings_key ON public.site_settings(setting_key);

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
