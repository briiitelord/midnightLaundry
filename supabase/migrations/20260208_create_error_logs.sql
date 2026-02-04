-- Create error_logs table for tracking site failures
CREATE TABLE IF NOT EXISTS public.error_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  error_message text NOT NULL,
  error_type text,
  error_stack text,
  page_url text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create index for chronological sorting
CREATE INDEX IF NOT EXISTS idx_error_logs_created ON error_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Anyone can insert errors (for client-side error reporting)
CREATE POLICY "Anyone can insert error logs"
  ON public.error_logs
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Anyone can view error logs (for admin functionality)
CREATE POLICY "Anyone can view error logs"
  ON public.error_logs
  FOR SELECT
  TO public
  USING (true);

-- Anyone can delete error logs (for admin cleanup)
CREATE POLICY "Anyone can delete error logs"
  ON public.error_logs
  FOR DELETE
  TO public
  USING (true);
