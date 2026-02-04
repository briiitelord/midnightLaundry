-- Add United Masters support to music_items table
ALTER TABLE music_items 
  ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'direct_upload' CHECK (source_type IN ('direct_upload', 'united_masters'));

ALTER TABLE music_items
  ADD COLUMN IF NOT EXISTS united_masters_link text;

-- Add comment for clarity
COMMENT ON COLUMN music_items.source_type IS 'Source of the music file: direct_upload or united_masters';
COMMENT ON COLUMN music_items.united_masters_link IS 'United Masters master link URL (for new_release category)';
