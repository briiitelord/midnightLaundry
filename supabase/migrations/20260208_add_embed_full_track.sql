-- Add embed_full_track column to music_items table
-- This allows admins to toggle between full track embed vs 22-second preview

ALTER TABLE music_items 
ADD COLUMN IF NOT EXISTS embed_full_track boolean DEFAULT false;

COMMENT ON COLUMN music_items.embed_full_track IS 'When true, embed the full track. When false (default), use 22-second preview.';
