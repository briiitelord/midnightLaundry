/*
  # Add preview thumbnail fields for videos

  Adds preview URLs and status columns so previews can be generated and stored.
  - preview_url: SFW preview image
  - preview_blurred_url: NSFW pixelated preview image
  - preview_status: pending | ready | failed
  - preview_ts: timestamp (seconds) used for preview capture
*/

ALTER TABLE videos
  ADD COLUMN preview_url text,
  ADD COLUMN preview_blurred_url text,
  ADD COLUMN preview_status text DEFAULT 'pending',
  ADD COLUMN preview_ts double precision;
