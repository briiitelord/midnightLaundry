# Scribbles Storage Fix

## Problem
The scribbles upload is failing with a 400 error because the `scribbles` storage bucket doesn't exist in your Supabase project.

## Solution
You need to create the storage bucket and set up the proper policies. There are two ways to do this:

### Option 1: Run the Migration (Recommended)
1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Run the migration file: `supabase/migrations/20260209_create_scribbles_storage.sql`

OR copy and paste this SQL:

```sql
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
```

### Option 2: Create via UI
1. Go to Supabase Dashboard → **Storage**
2. Click **New bucket**
3. Settings:
   - Name: `scribbles`
   - Public bucket: ✅ **Yes**
   - File size limit: 10 MB
   - Allowed MIME types: `image/png`, `image/jpeg`, `image/jpg`, `application/pdf`
4. Click **Create bucket**
5. Go to the bucket → **Policies** tab
6. Add the policies from the SQL above

## Verify
After running the migration, test the scribble save functionality:
1. Go to the About page
2. Draw something on the chalkboard
3. Click the download button
4. It should save and download successfully

## What This Does
- Creates a public storage bucket called `scribbles`
- Allows anyone to upload scribbles (user submissions from the chalkboard)
- Allows public read access (to display scribbles)
- Limits file size to 10MB
- Restricts to image and PDF files only
