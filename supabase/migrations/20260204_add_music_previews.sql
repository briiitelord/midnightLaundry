/*
  # Add preview support for music tracks

  Adds preview URL and status columns so 22-second previews can be generated and stored.
  - preview_url: URL to 22-second WAV preview
  - preview_status: pending | ready | failed
*/

ALTER TABLE music_items
  ADD COLUMN preview_url text,
  ADD COLUMN preview_status text DEFAULT 'pending';
