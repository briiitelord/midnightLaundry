-- Create scribbles table for daily PDF uploads
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

-- Enable RLS
ALTER TABLE public.scribbles ENABLE ROW LEVEL SECURITY;

-- Public can view active scribbles
CREATE POLICY "Anyone can view active scribbles"
  ON public.scribbles
  FOR SELECT
  TO public
  USING (is_active = true);

-- Anyone can insert (for admin functionality)
CREATE POLICY "Anyone can insert scribbles"
  ON public.scribbles
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Anyone can update
CREATE POLICY "Anyone can update scribbles"
  ON public.scribbles
  FOR UPDATE
  TO public
  USING (true);

-- Anyone can delete
CREATE POLICY "Anyone can delete scribbles"
  ON public.scribbles
  FOR DELETE
  TO public
  USING (true);

-- Create index for active scribbles
CREATE INDEX idx_scribbles_active ON public.scribbles(is_active, display_date DESC);

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.scribbles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
