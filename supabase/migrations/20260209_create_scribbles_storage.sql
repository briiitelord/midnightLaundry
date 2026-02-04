-- Create scribbles storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'scribbles',
  'scribbles',
  true,
  10485760, -- 10MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

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
