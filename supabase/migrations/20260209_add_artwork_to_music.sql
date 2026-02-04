-- Add artwork/cover image support to music_items
ALTER TABLE music_items 
  ADD COLUMN IF NOT EXISTS artwork_url text;

-- Add comment for documentation
COMMENT ON COLUMN music_items.artwork_url IS 'URL to album artwork/cover image for display in media players';
