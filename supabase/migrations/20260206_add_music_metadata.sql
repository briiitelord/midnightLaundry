/*
  # Add metadata fields to music_items

  Adds fields for:
  - legal_docs: JSON array of legal document slugs applied to track
  - producer_credit: Text credit, defaults to "produced by briiite."
  - view_count: Number of times track has been viewed/played
*/

ALTER TABLE music_items
  ADD COLUMN legal_docs jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN producer_credit text DEFAULT 'produced by briiite.',
  ADD COLUMN view_count integer DEFAULT 0;

-- Create index for view_count (useful for sorting)
CREATE INDEX idx_music_items_view_count ON music_items(view_count DESC);
